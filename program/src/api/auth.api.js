import { apiClient, makeApiCall, setToken } from './apiClient';


/**
 * Login function with token storage
 * @param {string} email - User's email address
* @param {string} password - User's password
 * @returns {Promise<Object>} Response object with success status and user data
 */
export const login = async (email, password) => {
  const response = await makeApiCall('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (response.success) {
    if (response.token) {
      setToken('accessToken', response.token);
    }
    if (response.refreshToken) {
      setToken('refreshToken', response.refreshToken);
    }

    // Get user role from the response based on PharmaCare backend specification
    // Backend response format: { token, refreshToken, user: { id, email, full_name, role_id }, mustChangePassword }
    // Note: Backend might return 'users' instead of 'user'
    let userRole = 'user'; // default fallback
    const userData = response.user || response.users;

    // Check for user role in response
    if (userData) {
      // According to PharmaCare spec, role_id determines the role:
      // role_id=1: Admin, role_id=2: Manager, role_id=3: Pharmacist, role_id=4: Cashier
      switch (userData.role_id) {
        case 1:
          userRole = 'admin';
          break;
        case 2:
          userRole = 'manager';
          break;
        case 3:
          userRole = 'pharmacist';
          break;
        case 4:
          userRole = 'cashier';
          break;
        default:
          userRole = 'user';
      }
    }

    if (userRole) {
      setToken('userRole', userRole);
      response.role = userRole;
    }

    // Store other user information from PharmaCare backend
    if (userData) {
      setToken('userId', userData.id || userData.user_id || '');
      setToken('userName', userData.full_name || userData.name || '');
      setToken('userEmail', userData.email || '');
      setToken('roleId', userData.role_id || '');
    }
  }

  return response;
};

/**
 * Signup function to register a new user
 * @param {string} full_name - User's full name
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @param {number} role_id - User's role ID (2=Manager, 3=Pharmacist, 4=Cashier)
 * @param {number} branch_id - Branch ID (required for non-admin roles)
 * @returns {Promise<Object>} Response object with success status
 */
export const signup = async (full_name, email, password, role_id, branch_id) => {
  return await makeApiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      full_name,
      email,
      password,
      role_id,
      branch_id
    }),
  });
};

/**
 * Manager signup function to register a new manager with branch information
 * @param {Object} managerData - Manager and branch data
 * @param {string} managerData.full_name - User's full name
 * @param {string} managerData.email - User's email address
 * @param {string} managerData.password - User's password
 * @param {number} managerData.role_id - User's role ID (should be 2 for Manager)
 * @param {string} managerData.branch_id - Dummy branch ID (backend will create new branch)
 * @param {string} managerData.pharmacy_name - Name of the pharmacy
 * @param {string} managerData.branch_name - Name of the branch
 * @param {string} managerData.branch_location - Location of the branch
 * @param {string} managerData.phone - Phone number of the branch
 * @param {string} [managerData.branch_email] - Email of the branch (optional)
 * @returns {Promise<Object>} Response object with success status
 */
export const signupManager = async (managerData) => {
  return await makeApiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify(managerData),
  });
};

/**
 * Resend verification email
 * @param {string} email - User's email address
 * @returns {Promise<Object>} Response object with success status
 */
export const resendVerification = async (email) => {
  return await makeApiCall('/auth/resend-verification', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

/**
 * Reset user password
 * @param {string} token - Password reset token
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Response object with success status
 */
export const resetPassword = async (token, newPassword) => {
  return await makeApiCall('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
};

/**
 * Logout function with server-side logout and token cleanup
 * @returns {Promise<void>}
 */
export const logout = async () => {
  try {
    const token = localStorage.getItem('accessToken'); // Fallback to localStorage for logout
    if (token) {
      await apiClient('/auth/logout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.warn('Server logout failed:', error.message);
  } finally {
    // Use new token management functions for removal
    import('./apiClient').then(({ removeToken }) => {
      removeToken('accessToken');
      removeToken('refreshToken');
      removeToken('userRole');
      removeToken('userId');
      removeToken('userName');
      removeToken('userEmail');
      removeToken('roleId');
    }).catch(() => {
      // Fallback to localStorage if import fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('roleId');
    });
  }
};

/**
 * Refresh authentication token
 * @returns {Promise<string>} New access token
 * @throws {Error} If refresh token is not available or refresh fails
 */
export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken'); // Fallback to localStorage for refresh
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await makeApiCall('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });

  if (response.success && response.token) {
    import('./apiClient').then(({ setToken }) => {
      setToken('accessToken', response.token);
    }).catch(() => {
      // Fallback to localStorage if import fails
      localStorage.setItem('accessToken', response.token);
    });
    return response.token;
  } else {
    import('./apiClient').then(({ removeToken }) => {
      removeToken('accessToken');
      removeToken('refreshToken');
    }).catch(() => {
      // Fallback to localStorage if import fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    });
    throw new Error(response.message || 'Token refresh failed');
  }
};

/**
 * Verify email with verification code
 * @param {string} email - User's email address
 * @param {string} verificationCode - 6-digit verification code
 * @returns {Promise<Object>} Response object with success status
 */
export const verifyEmail = async (email, verificationCode) => {
  return await makeApiCall('/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify({ email, verification_code: verificationCode }),
  });
};

/**
 * Forgot password request
 * @param {string} email - User's email address
 * @returns {Promise<Object>} Response object with success status
 */
export const forgotPassword = async (email) => {
  return await makeApiCall('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};

/**
 * Verify authentication token
 * @returns {Promise<Object>} Response object with success status and user data
 */
export const verifyToken = async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    return { success: false, message: 'No token available' };
  }

  try {
    const response = await apiClient('/auth/verify', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      ...response,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

/**
 * Get branches for the current user's pharmacy
 * @returns {Promise<Object>} Response object with branches data
 */
export const getBranches = async () => {
  return await makeApiCall('/branches', {
    method: 'GET',
  });
};

/**
 * Create a new branch
 * @param {Object} branchData - Branch data
 * @returns {Promise<Object>} Response object
 */
export const createBranch = async (branchData) => {
  return await makeApiCall('/branches', {
    method: 'POST',
    body: JSON.stringify(branchData),
  });
};

/**
 * Get users for the current user's pharmacy
 * @returns {Promise<Object>} Response object with users data
 */
export const getUsers = async () => {
  return await makeApiCall('/users', {
    method: 'GET',
  });
};

/**
 * Create a new user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Response object
 */
export const createUser = async (userData) => {
  return await makeApiCall('/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

/**
 * Change user password
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Response object with success status
 */
export const changePassword = async (currentPassword, newPassword) => {
  return await makeApiCall('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });
};

/**
 * Get current user profile
 * @returns {Promise<Object>} Response object with user profile data
 */
export const getProfile = async () => {
  return await makeApiCall('/auth/me', {
    method: 'GET',
  });
};

/**
 * Update user profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise<Object>} Response object with success status
 */
export const updateProfile = async (profileData) => {
  return await makeApiCall('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  });
};
