'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiService, LoginCredentials } from '../../services/api';

export default function LoginPage() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    phone: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.phone || !credentials.password) {
      setError('Please enter both phone number and password');
      return;
    }

    setIsLoading(true);
    
    try {
      // Try to format phone number - add +880 if it starts with 01
      let formattedPhone = credentials.phone.trim();
      if (formattedPhone.startsWith('01') && formattedPhone.length === 11) {
        formattedPhone = '+880' + formattedPhone.substring(1);
      }
      
      const response = await apiService.login({
        phone: formattedPhone,
        password: credentials.password
      });
      
      // Store tokens
      localStorage.setItem('access_token', response.access);
      localStorage.setItem('refresh_token', response.refresh);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-purple-300 hover:text-white mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Login to Rider's Club
          </h1>          <p className="text-lg text-gray-300">
            Welcome back! Sign in to your account
          </p>
          <div className="mt-4 text-sm text-purple-300">
            <p>Test credentials:</p>
            <p>Phone: +8801957045438</p>
            <p>Password: 123456</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={credentials.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="01XXXXXXXXX or +8801XXXXXXXXX"
                required
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-4 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="font-medium">{error}</span>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Don't have an account?{' '}
              <Link href="/join" className="text-purple-400 hover:text-purple-300 font-medium underline">
                Join Riders Club
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
