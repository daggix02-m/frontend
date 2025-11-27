import { create } from 'zustand';

export const useSignupStore = create((set) => ({
    step: 1,
    formData: {
        pharmacyName: '',
        licenseNumber: '',
        managerName: '',
        managerEmail: '',
        managerPassword: '',
        managerPhone: '',
        branchAddress: '',
        branchContact: '',
    },
    setFormData: (data) =>
        set((state) => ({
            formData: { ...state.formData, ...data },
        })),
    nextStep: () => set((state) => ({ step: state.step + 1 })),
    prevStep: () => set((state) => ({ step: state.step - 1 })),
    resetForm: () =>
        set({
            step: 1,
            formData: {
                pharmacyName: '',
                licenseNumber: '',
                managerName: '',
                managerEmail: '',
                managerPassword: '',
                managerPhone: '',
                branchAddress: '',
                branchContact: '',
            },
        }),
}));
