'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FloatingPaths from '@/components/shared/FloatingPaths';
import { useSignupStore } from '../../store/signupStore';
import { signup } from '@/api/auth.api';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeftIcon,
  Building2Icon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  LockIcon,
  FileTextIcon,
} from 'lucide-react';

export function SignupPage() {
  const navigate = useNavigate();
  const { step, formData, setFormData, nextStep, prevStep } = useSignupStore();
  const [errors, setErrors] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleNextStep = () => {
    const newErrors = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.pharmacyName.trim()) {
        newErrors.pharmacyName = 'Pharmacy Name is required';
        isValid = false;
      }
      if (!formData.licenseNumber.trim()) {
        newErrors.licenseNumber = 'License Number is required';
        isValid = false;
      }
    } else if (step === 2) {
      if (!formData.managerName.trim()) {
        newErrors.managerName = 'Manager Name is required';
        isValid = false;
      }
      if (!formData.managerEmail.trim()) {
        newErrors.managerEmail = 'Manager Email is required';
        isValid = false;
      } else if (!validateEmail(formData.managerEmail)) {
        newErrors.managerEmail = 'Invalid email format';
        isValid = false;
      }
      if (!formData.managerPassword.trim()) {
        newErrors.managerPassword = 'Password is required';
        isValid = false;
      }
      if (!formData.managerPhone.trim()) {
        newErrors.managerPhone = 'Phone Number is required';
        isValid = false;
      }
    }

    setErrors(newErrors);

    if (isValid) {
      nextStep();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    let isValid = true;

    if (step === 3) {
      if (!formData.branchAddress.trim()) {
        newErrors.branchAddress = 'Branch Address is required';
        isValid = false;
      }
      if (!formData.branchContact.trim()) {
        newErrors.branchContact = 'Branch Contact is required';
        isValid = false;
      }
    }

    setErrors(newErrors);

    if (isValid) {
      setIsLoading(true);
      // Call the actual signup API
      try {
        const response = await signup(
          formData.managerName,
          formData.managerEmail,
          formData.managerPassword,
          {
            name: formData.pharmacyName,
            license_number: formData.licenseNumber,
            branches: [
              {
                name: `${formData.pharmacyName} - Main Branch`,
                address: formData.branchAddress,
                contact: formData.branchContact,
              }
            ],
            branch_id: 1 // Workaround: Backend requires branch_id even for new pharmacy creation
          }
        );

        if (response.success) {
          // Registration successful - navigate to login or show success message
          alert('Registration successful! You can now log in.');
          // Redirect to login page
          navigate('/auth/login');
        } else {
          setErrors({ general: response.message || 'Registration failed. Please try again.' });
        }
      } catch (error) {
        setErrors({ general: error.message || 'An error occurred during registration.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <main className='relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2'>
      <div className='bg-muted/60 relative hidden h-full flex-col border-r p-10 lg:flex'>
        <div className='from-background absolute inset-0 z-10 bg-gradient-to-t to-transparent' />
        <div className='z-10 flex items-center gap-2'>
          <img src='/logo.png' alt='PharmaCare Logo' className='size-24' />
          <p className='text-xl font-semibold'>PharmaCare</p>
        </div>
        <div className='z-10 mt-auto'>
          <blockquote className='space-y-2'>
            <p className='text-xl'>
              &ldquo;Join thousands of pharmacies managing their operations efficiently.&rdquo;
            </p>
          </blockquote>
        </div>
        <div className='absolute inset-0'>
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
      </div>
      <div className='relative flex min-h-screen flex-col justify-center p-4'>
        <div aria-hidden className='absolute inset-0 isolate contain-strict -z-10 opacity-60'>
          <div className='bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,--theme(--color-foreground/.06)_0,hsla(0,0%,55%,.02)_50%,--theme(--color-foreground/.01)_80%)] absolute top-0 right-0 h-320 w-140 -translate-y-87.5 rounded-full' />
          <div className='bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 right-0 h-320 w-60 [translate:5%_-50%] rounded-full' />
          <div className='bg-[radial-gradient(50%_50%_at_50%_50%,--theme(--color-foreground/.04)_0,--theme(--color-foreground/.01)_80%,transparent_100%)] absolute top-0 right-0 h-320 w-60 -translate-y-87.5 rounded-full' />
        </div>
        <Button variant='ghost' className='absolute top-7 left-5' asChild>
          <a href='/'>
            <ChevronLeftIcon className='size-4 me-2' />
            Home
          </a>
        </Button>
        <div className='mx-auto space-y-4 sm:w-sm'>
          <div className='flex items-center gap-2 lg:hidden'>
            <img src='/logo.png' alt='PharmaCare Logo' className='size-24' />
            <p className='text-xl font-semibold'>PharmaCare</p>
          </div>
          <div className='flex flex-col space-y-1'>
            <h1 className='font-heading text-2xl font-bold tracking-wide'>Create Account</h1>
            <p className='text-muted-foreground text-base'>
              Step {step} of 3:{' '}
              {step === 1
                ? 'Pharmacy Details'
                : step === 2
                  ? 'Manager Details'
                  : 'Main Branch Details'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className='space-y-4'
              >
                <div className='relative h-max'>
                  <Input
                    name='pharmacyName'
                    value={formData.pharmacyName}
                    onChange={handleInputChange}
                    placeholder='Pharmacy Name'
                    className={`peer ps-9 ${errors.pharmacyName ? 'border-red-500' : ''}`}
                  />
                  <div className='text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
                    <Building2Icon className='size-4' aria-hidden='true' />
                  </div>
                </div>
                {errors.pharmacyName && (
                  <p className='text-red-500 text-xs'>{errors.pharmacyName}</p>
                )}

                <div className='relative h-max'>
                  <Input
                    name='licenseNumber'
                    value={formData.licenseNumber}
                    onChange={handleInputChange}
                    placeholder='License Number'
                    className={`peer ps-9 ${errors.licenseNumber ? 'border-red-500' : ''}`}
                  />
                  <div className='text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
                    <FileTextIcon className='size-4' aria-hidden='true' />
                  </div>
                </div>
                {errors.licenseNumber && (
                  <p className='text-red-500 text-xs'>{errors.licenseNumber}</p>
                )}

                <Button type='button' onClick={handleNextStep} className='w-full'>
                  Next
                </Button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className='space-y-4'
              >
                <div className='relative h-max'>
                  <Input
                    name='managerName'
                    value={formData.managerName}
                    onChange={handleInputChange}
                    placeholder='Manager Name'
                    className={`peer ps-9 ${errors.managerName ? 'border-red-500' : ''}`}
                  />
                  <div className='text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
                    <UserIcon className='size-4' aria-hidden='true' />
                  </div>
                </div>
                {errors.managerName && <p className='text-red-500 text-xs'>{errors.managerName}</p>}

                <div className='relative h-max'>
                  <Input
                    name='managerEmail'
                    value={formData.managerEmail}
                    onChange={handleInputChange}
                    placeholder='Manager Email'
                    type='email'
                    className={`peer ps-9 ${errors.managerEmail ? 'border-red-500' : ''}`}
                  />
                  <div className='text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
                    <MailIcon className='size-4' aria-hidden='true' />
                  </div>
                </div>
                {errors.managerEmail && (
                  <p className='text-red-500 text-xs'>{errors.managerEmail}</p>
                )}

                <div className='relative h-max'>
                  <Input
                    name='managerPassword'
                    value={formData.managerPassword}
                    onChange={handleInputChange}
                    placeholder='Password'
                    type='password'
                    className={`peer ps-9 ${errors.managerPassword ? 'border-red-500' : ''}`}
                  />
                  <div className='text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
                    <LockIcon className='size-4' aria-hidden='true' />
                  </div>
                </div>
                {errors.managerPassword && (
                  <p className='text-red-500 text-xs'>{errors.managerPassword}</p>
                )}

                <div className='relative h-max'>
                  <Input
                    name='managerPhone'
                    value={formData.managerPhone}
                    onChange={handleInputChange}
                    placeholder='Phone Number'
                    className={`peer ps-9 ${errors.managerPhone ? 'border-red-500' : ''}`}
                  />
                  <div className='text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
                    <PhoneIcon className='size-4' aria-hidden='true' />
                  </div>
                </div>
                {errors.managerPhone && (
                  <p className='text-red-500 text-xs'>{errors.managerPhone}</p>
                )}

                <div className='flex gap-2'>
                  <Button type='button' variant='outline' onClick={prevStep} className='w-full'>
                    Back
                  </Button>
                  <Button type='button' onClick={handleNextStep} className='w-full'>
                    Next
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className='space-y-4'
              >
                <div className='relative h-max'>
                  <Input
                    name='branchAddress'
                    value={formData.branchAddress}
                    onChange={handleInputChange}
                    placeholder='Main Branch Address'
                    className={`peer ps-9 ${errors.branchAddress ? 'border-red-500' : ''}`}
                  />
                  <div className='text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
                    <MapPinIcon className='size-4' aria-hidden='true' />
                  </div>
                </div>
                {errors.branchAddress && (
                  <p className='text-red-500 text-xs'>{errors.branchAddress}</p>
                )}

                <div className='relative h-max'>
                  <Input
                    name='branchContact'
                    value={formData.branchContact}
                    onChange={handleInputChange}
                    placeholder='Branch Contact Number'
                    className={`peer ps-9 ${errors.branchContact ? 'border-red-500' : ''}`}
                  />
                  <div className='text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
                    <PhoneIcon className='size-4' aria-hidden='true' />
                  </div>
                </div>
                {errors.branchContact && (
                  <p className='text-red-500 text-xs'>{errors.branchContact}</p>
                )}

                {errors.general && (
                  <p className='text-red-500 text-sm'>{errors.general}</p>
                )}

                <div className='flex gap-2'>
                  <Button type='button' variant='outline' onClick={prevStep} className='w-full'>
                    Back
                  </Button>
                  <Button type='submit' className='w-full' disabled={isLoading}>
                    {isLoading ? 'Registering...' : 'Complete Registration'}
                  </Button>
                </div>
              </motion.div>
            )}
          </form>

          <div className='text-center text-sm'>
            Already have an account?{' '}
            <a
              href='/auth/login'
              className='text-muted-foreground hover:text-primary underline underline-offset-4'
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
