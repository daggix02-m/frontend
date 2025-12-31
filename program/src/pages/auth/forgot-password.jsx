'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FloatingPaths from '@/components/shared/FloatingPaths';
import { ChevronLeftIcon, AtSignIcon, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import { forgotPassword } from '@/api/auth.api';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState(null);
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setVerificationCode(null);
    setIsDevelopmentMode(false);

    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email format');
      return;
    }

    setIsLoading(true);

    try {
      const response = await forgotPassword(email);

      // Check if email service is unavailable (503 error or service unavailable message)
      if (response.message && (
        response.message.includes('503') ||
        response.message.toLowerCase().includes('service unavailable') ||
        response.message.toLowerCase().includes('email service') ||
        response.message.toLowerCase().includes('smtp')
      )) {
        setError('Email service is not configured. Please contact your administrator to reset your password.');
        setIsLoading(false);
        return;
      }

      // Check if backend returned a verification code (development mode)
      if (response.verificationCode || response.code || response.verification_code) {
        const code = response.verificationCode || response.code || response.verification_code;
        setVerificationCode(code);
        setIsDevelopmentMode(true);
        setSuccess(`Password reset code generated (Development Mode): ${code}`);
        setEmail('');
      } else if (response.success) {
        setSuccess('Password reset link has been sent to your email address.');
        setEmail('');
      } else {
        setError(response.message || 'Failed to send reset link. Please try again.');
      }
    } catch (err) {
      // Handle 503 Service Unavailable error
      if (err.message && (
        err.message.includes('503') ||
        err.message.toLowerCase().includes('service unavailable') ||
        err.message.toLowerCase().includes('email service')
      )) {
        setError('Email service is not configured. Please contact your administrator to reset your password.');
      } else {
        setError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
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
              &ldquo;Recover your account access quickly and securely.&rdquo;
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
          <a href='/auth/login'>
            <ChevronLeftIcon className='size-4 me-2' />
            Back to Login
          </a>
        </Button>
        <div className='mx-auto space-y-4 sm:w-sm'>
          <div className='flex items-center gap-2 lg:hidden'>
            <img src='/logo.png' alt='PharmaCare Logo' className='size-24' />
            <p className='text-xl font-semibold'>PharmaCare</p>
          </div>
          <div className='flex flex-col space-y-1'>
            <h1 className='font-heading text-2xl font-bold tracking-wide'>Forgot Password?</h1>
            <p className='text-muted-foreground text-base'>
              Enter your email to receive a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <div className='relative h-max'>
                <Input
                  placeholder='your.email@example.com'
                  className={`peer ps-9 ${error ? 'border-red-500' : ''}`}
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className='text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
                  <AtSignIcon className='size-4' aria-hidden='true' />
                </div>
              </div>
            </div>

            {error && (
              <div className='flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg'>
                <AlertCircle className='size-4 text-red-600 mt-0.5 flex-shrink-0' />
                <p className='text-red-700 text-sm'>{error}</p>
              </div>
            )}
            
            {success && (
              <div className='flex items-start gap-2 p-3 bg-green-50 border border-green-200 rounded-lg'>
                <CheckCircle2 className='size-4 text-green-600 mt-0.5 flex-shrink-0' />
                <p className='text-green-700 text-sm'>{success}</p>
              </div>
            )}

            {isDevelopmentMode && verificationCode && (
              <div className='flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                <Info className='size-4 text-blue-600 mt-0.5 flex-shrink-0' />
                <div className='flex-1'>
                  <p className='text-blue-700 text-sm font-medium mb-1'>Development Mode</p>
                  <p className='text-blue-600 text-xs'>Use this code to reset your password:</p>
                  <code className='block mt-2 p-2 bg-white border border-blue-300 rounded text-blue-800 font-mono text-sm'>
                    {verificationCode}
                  </code>
                </div>
              </div>
            )}

            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          <div className='mt-6 p-4 bg-muted/50 rounded-lg border border-border'>
            <p className='text-xs text-muted-foreground'>
              <strong>Having trouble?</strong> If you don't receive the email within a few minutes,
              please check your spam folder or contact your administrator for assistance.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
