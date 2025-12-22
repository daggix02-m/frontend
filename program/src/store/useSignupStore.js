import { create } from 'zustand';
import { signupManager } from '@/api/auth.api';

// Define the initial state for the signup flow
const initialState = {
  currentStep: 1,
  managerInfo: {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  branchInfo: {
    pharmacyName: '',
    branchName: '',
    branchLocation: '',
    phone: '',
    branchEmail: '',
  },
  errors: {},
  isLoading: false,
  isSuccess: false,
  error: null,
};

export const useSignupStore = create((set, get) => ({
  ...initialState,

  // Navigation functions
  goToNextStep: () => {
    const { currentStep, validateCurrentStep } = get();

    if (validateCurrentStep(currentStep)) {
      set({ currentStep: Math.min(currentStep + 1, 3) });
    }
  },

  goToPreviousStep: () => {
    const { currentStep } = get();
    set({ currentStep: Math.max(currentStep - 1, 1) });
  },

  setCurrentStep: (step) => set({ currentStep: step }),

  // Update manager info
  setManagerInfo: (field, value) => {
    set((state) => ({
      managerInfo: {
        ...state.managerInfo,
        [field]: value,
      },
      errors: {
        ...state.errors,
        [field]: '', // Clear error when field is updated
      },
    }));
  },

  // Update branch info
  setBranchInfo: (field, value) => {
    set((state) => ({
      branchInfo: {
        ...state.branchInfo,
        [field]: value,
      },
      errors: {
        ...state.errors,
        [field]: '', // Clear error when field is updated
      },
    }));
  },

  // Validation functions
  validateCurrentStep: (step, shouldSetErrors = true) => {
    const { managerInfo, branchInfo, setErrors } = get();

    let errors = {};

    if (step === 1) {
      // Validate manager information
      if (!managerInfo.fullName.trim()) {
        errors.fullName = 'Full Name is required';
      }

      if (!managerInfo.email.trim()) {
        errors.email = 'Email is required';
      } else if (!get().validateEmail(managerInfo.email)) {
        errors.email = 'Invalid email format';
      }

      if (!managerInfo.password) {
        errors.password = 'Password is required';
      } else if (!get().validatePassword(managerInfo.password)) {
        errors.password = 'Password must be at least 6 chars with uppercase, lowercase, and number';
      }

      if (!managerInfo.confirmPassword) {
        errors.confirmPassword = 'Confirm Password is required';
      } else if (managerInfo.password !== managerInfo.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    } else if (step === 2) {
      // Validate branch information
      if (!branchInfo.pharmacyName.trim()) {
        errors.pharmacyName = 'Pharmacy Name is required';
      }

      if (!branchInfo.branchName.trim()) {
        errors.branchName = 'Branch Name is required';
      }

      if (!branchInfo.branchLocation.trim()) {
        errors.branchLocation = 'Branch Location is required';
      }

      if (!branchInfo.phone.trim()) {
        errors.phone = 'Phone Number is required';
      } else if (!get().validatePhone(branchInfo.phone)) {
        errors.phone = 'Invalid phone number format';
      }

      if (branchInfo.branchEmail && branchInfo.branchEmail.trim() && !get().validateEmail(branchInfo.branchEmail)) {
        errors.branchEmail = 'Invalid email format';
      }
    }

    if (Object.keys(errors).length > 0) {
      if (shouldSetErrors) {
        setErrors(errors);
      }
      return false;
    }

    return true;
  },

  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validatePassword: (password) => {
    // Password must be at least 6 chars with uppercase, lowercase, and number
    const hasMinLength = password.length >= 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);

    return hasMinLength && hasUpperCase && hasLowerCase && hasNumber;
  },

  validatePhone: (phone) => {
    // Basic phone validation (can be enhanced based on specific requirements)
    const phoneRegex = /^\+?[\d\s\-()]{7,}$/;
    return phoneRegex.test(phone);
  },

  // Set errors
  setErrors: (errors) => set({ errors }),

  // Clear errors
  clearErrors: () => set({ errors: {} }),

  // Reset the entire signup flow
  resetSignup: () => set(initialState),

  // Submit the signup form
  submitSignup: async () => {
    const { managerInfo, branchInfo, setIsLoading, setError } = get();

    setIsLoading(true);

    try {
      // Prepare the payload with the required structure
      const payload = {
        full_name: managerInfo.fullName,
        email: managerInfo.email,
        password: managerInfo.password,
        role_id: 2, // Manager role
        // branch_id: "DUMMY_BRANCH_ID", // Removed to fix validation error
        pharmacy_name: branchInfo.pharmacyName,
        branch_name: branchInfo.branchName,
        branch_location: branchInfo.branchLocation,
        phone: branchInfo.phone,
        ...(branchInfo.branchEmail && { branch_email: branchInfo.branchEmail }), // Only include if provided
      };

      // SIMULATION: The backend does not support creating a new pharmacy via this endpoint.
      // We simulate a successful "Request" submission.
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Log the payload for debugging/demo purposes
      console.log('Registration Request Payload:', payload);

      set({ isSuccess: true, isLoading: false });
      return { success: true };

      /* 
      // Original API call - disabled due to backend limitation
      const response = await signupManager(payload);

      if (response.success) {
        set({ isSuccess: true, isLoading: false });
        return { success: true };
      } else {
        setError(response.message || 'Registration failed. Please try again.');
        return { success: false, message: response.message || 'Registration failed. Please try again.' };
      }
      */
    } catch (error) {
      setError(error.message || 'An error occurred during registration.');
      return { success: false, message: error.message || 'An error occurred during registration.' };
    } finally {
      setIsLoading(false);
    }
  },

  // Helper methods for updating state
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setIsSuccess: (isSuccess) => set({ isSuccess }),
}));