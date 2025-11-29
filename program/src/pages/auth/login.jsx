'use client';

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FloatingPaths from '@/components/shared/FloatingPaths';
import { AppleIcon, AtSignIcon, GithubIcon, LockIcon } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    // Password is optional for testing (no validation)
    // if (!password) {
    //     setError('Please enter your password.');
    //     return;
    // }



    try {
      // Mock login for testing - determine role from email
      let role = 'manager'; // Default
      if (email.includes('admin')) role = 'admin';
      else if (email.includes('pharmacist')) role = 'pharmacist';
      else if (email.includes('cashier')) role = 'cashier';

      // Set mock tokens
      localStorage.setItem('accessToken', 'test-token-' + Date.now());
      localStorage.setItem('userRole', role);

      // Redirect based on role
      if (role === 'admin') navigate('/admin/overview');
      else if (role === 'manager') navigate('/manager/overview');
      else if (role === 'pharmacist') navigate('/pharmacist/overview');
      else if (role === 'cashier') navigate('/cashier/overview');
      else navigate('/manager/overview'); // Fallback

      // Uncomment below when backend is ready
      // const response = await login(email, password);
      // if (response.success) {
      //     const role = response.role || 'manager';
      //     if (role === 'admin') navigate('/admin/overview');
      //     else if (role === 'manager') navigate('/manager/overview');
      //     else if (role === 'pharmacist') navigate('/pharmacist/overview');
      //     else if (role === 'cashier') navigate('/cashier/overview');
      //     else navigate('/manager/overview');
      // } else {
      //     setError(response.message || 'Login failed. Please check your credentials.');
      // }
    } catch (err) {
      setError('An error occurred. Please try again.');
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
              &ldquo;PharmaCare transformed how we manage our pharmacy. Inventory tracking is now
              automated, prescription processing is seamless, and our team can focus on patient care
              instead of paperwork.&rdquo;
            </p>
            <footer className='font-mono text-sm font-semibold'>
              ~ Dr. Mekdes Hailu, Pharmacy Manager
            </footer>
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

        <div className='mx-auto space-y-4 sm:w-sm'>
          <div className='flex items-center gap-2 lg:hidden'>
            <img src='/logo.png' alt='PharmaCare Logo' className='size-24' />
            <p className='text-xl font-semibold'>PharmaCare</p>
          </div>
          <div className='flex flex-col space-y-1'>
            <h1 className='font-heading text-2xl font-bold tracking-wide'>Welcome Back!</h1>
            <p className='text-muted-foreground text-base'>Login to your PharmaCare account.</p>
          </div>
          <div className='space-y-2'>
            <Button type='button' size='lg' className='w-full'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='size-4 me-2'
              >
                <g>
                  <path d='M12.479,14.265v-3.279h11.049c0.108,0.571,0.164,1.247,0.164,1.979c0,2.46-0.672,5.502-2.84,7.669   C18.744,22.829,16.051,24,12.483,24C5.869,24,0.308,18.613,0.308,12S5.869,0,12.483,0c3.659,0,6.265,1.436,8.223,3.307L18.392,5.62   c-1.404-1.317-3.307-2.341-5.913-2.341C7.65,3.279,3.873,7.171,3.873,12s3.777,8.721,8.606,8.721c3.132,0,4.916-1.258,6.059-2.401   c0.927-0.927,1.537-2.251,1.777-4.059L12.479,14.265z' />
                </g>
              </svg>
              Continue with Google
            </Button>
            <Button type='button' size='lg' className='w-full'>
              <AppleIcon className='size-4 me-2' />
              Continue with Apple
            </Button>
            <Button type='button' size='lg' className='w-full'>
              <GithubIcon className='size-4 me-2' />
              Continue with GitHub
            </Button>
          </div>

          <div className='flex w-full items-center justify-center'>
            <div className='bg-border h-px w-full' />
            <span className='text-muted-foreground px-2 text-xs'>OR</span>
            <div className='bg-border h-px w-full' />
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <div className='relative h-max'>
                <Input
                  placeholder='your.email@example.com'
                  className={`peer ps-9 ${error && (error.includes('Email') || error.includes('email')) ? 'border-red-500' : ''}`}
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className='text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
                  <AtSignIcon className='size-4' aria-hidden='true' />
                </div>
              </div>
            </div>
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                  Password{' '}
                  <span className='text-muted-foreground text-xs'>(Optional for testing)</span>
                </label>
                <a
                  href='/auth/forgot-password'
                  className='text-xs underline-offset-4 hover:underline'
                >
                  Forgot password?
                </a>
              </div>
              <div className='relative h-max'>
                <Input
                  placeholder='Password (optional)'
                  className={`peer ps-9 ${error && error.includes('Password') ? 'border-red-500' : ''}`}
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div className='text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50'>
                  <LockIcon className='size-4' aria-hidden='true' />
                </div>
              </div>
            </div>

            {error && <p className='text-red-500 text-sm'>{error}</p>}

            <Button type='submit' className='w-full'>
              <span>Sign In</span>
            </Button>
          </form>

          <div className='flex items-center justify-between text-sm'>

            <a
              href='/auth/signup'
              className='text-muted-foreground hover:text-primary underline underline-offset-4'
            >
              Create Account
            </a>
          </div>

          <p className='text-muted-foreground mt-8 text-center text-sm'>
            By clicking continue, you agree to our{' '}
            <a href='#' className='hover:text-primary underline underline-offset-4'>
              Terms of Service
            </a>{' '}
            and{' '}
            <a href='#' className='hover:text-primary underline underline-offset-4'>
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
