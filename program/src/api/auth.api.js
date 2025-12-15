import { apiClient } from './apiClient';

/**
 * Generic API call wrapper with consistent error handling
 * @param {string} endpoint - The API endpoint to call
 * @param {Object} options - Request options
 * @returns {Promise<Object>} Response object with success status and data
 */
export const makeApiCall = async (endpoint, options = {}) => {
  try {
    const response = await apiClient(endpoint, options);
    return {
      success: true,
      ...response,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'An error occurred during the API call',
    };
  }
};

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
      localStorage.setItem('accessToken', response.token);
    }
    if (response.refreshToken) {
      localStorage.setItem('refreshToken', response.refreshToken);
    }

    // Get user role from the response
    const userRole = response.user?.role || response.role;
    if (userRole) {
      localStorage.setItem('userRole', userRole);
      response.role = userRole;
    }

    // Also store other user information if available
    if (response.user) {
      localStorage.setItem('userId', response.user.id || '');
      localStorage.setItem('userName', response.user.name || response.user.full_name || '');
    }
  }

  return response;
};

/**
 * Signup function to register a new manager and create pharmacy
 * @param {string} full_name - Manager's full name
 * @param {string} email - Manager's email address
 * @param {string} password - Manager's password
 * @param {Object} pharmacyData - Pharmacy and branch data
 * @returns {Promise<Object>} Response object with success status
 */
export const signup = async (full_name, email, password, pharmacyData) => {
  return await makeApiCall('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      full_name,
      email,
      password,
      role_id: 2,
      branch_id: pharmacyData.branch_id, // Extract branch_id from pharmacyData
      pharmacy: pharmacyData,
    }),
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
    const token = localStorage.getItem('accessToken');
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
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};

/**
 * Refresh authentication token
 * @returns {Promise<string>} New access token
 * @throws {Error} If refresh token is not available or refresh fails
 */
export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await makeApiCall('/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });

  if (response.success && response.token) {
    localStorage.setItem('accessToken', response.token);
    return response.token;
  } else {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
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
      new_password: newPassword
    }),
  });
};

/**
 * Get current user profile
 * @returns {Promise<Object>} Response object with user profile data
 */
export const getProfile = async () => {
  return await makeApiCall('/auth/profile', {
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
