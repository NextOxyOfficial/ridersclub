'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { apiService, UserProfile } from '../services/api';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const checkAuthAndFetchUser = async () => {
      // Check if user is logged in using the API service
      const authenticated = apiService.isAuthenticated();
      setIsLoggedIn(authenticated);
      
      if (authenticated) {
        try {
          const userProfile = await apiService.getCurrentUser();
          setUser(userProfile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
          // If there's an error fetching user data, they might not be properly logged in
          setIsLoggedIn(false);
          setUser(null);
        }
      }
    };

    checkAuthAndFetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">{/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 bg-slate-900/70 backdrop-blur-lg border-b border-white/10">            <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="group cursor-pointer">
            <div className="relative">
              <div className="text-white font-black text-2xl tracking-wider bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent transform transition-all duration-300 hover:scale-110 hover:rotate-1">
                RCB
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-lg opacity-0 group-hover:opacity-20 transition duration-300"></div>
            </div>
          </div>              
          <div className="flex items-center space-x-4">            
            {isLoggedIn && user ? (
              <span className="text-white font-medium py-2 px-4">
                Hi, {user.full_name}
              </span>
            ) : (
              <Link
                href="/join"
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Join Club
              </Link>
            )}            
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="bg-transparent border border-white/30 hover:bg-white/10 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="bg-transparent border border-white/30 hover:bg-white/10 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Login
              </Link>
            )}
            
            {isLoggedIn && (
              <button
                onClick={() => {
                  localStorage.removeItem('access_token');
                  localStorage.removeItem('refresh_token');
                  setIsLoggedIn(false);
                  setUser(null);
                  window.location.reload();
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 rounded-lg transition-colors flex items-center"
                title="Logout"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </nav>      {/* Hero Section */}
      <div className="flex flex-col pt-20 sm:pt-32 pb-10 items-center justify-center min-h-screen px-2 sm:px-4">
        <div className="text-center mb-8 mt-8">
          <div className="relative inline-block">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-transparent bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text mb-2 drop-shadow-2xl leading-tight">
              Rider's Club Bangladesh
            </h1>
            <div className="absolute -top-2 -right-4 md:-right-12">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full text-xs md:text-sm font-semibold shadow-lg transform rotate-12 hover:rotate-6 transition-transform duration-300">
                <span className="text-purple-100">by</span> <span className="text-white font-bold">Lyricz Motors</span>
              </div>
            </div>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto mt-8">
            Join the ultimate community for motorcycle enthusiasts. Connect, ride, and share your passion.
          </p>
        </div>

        {/* Follow Us Section */}
        <div className="mb-8 bg-white/5 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/10 max-sm:w-full mx-2 sm:mx-4"><div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Follow Us</h3>
            <p className="text-gray-300">Stay connected with our community</p>
          </div>
          
          <div className="flex flex-row gap-3 sm:gap-4 justify-center items-center">
            {/* Facebook Link */}
            <a
              href="https://www.facebook.com/share/16p46KBPek"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex-1 sm:flex-none sm:min-w-[180px]"
            >
              <div className="mr-2 sm:mr-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xs sm:text-sm font-semibold">Follow us on</div>
                <div className="text-xs text-blue-100">Facebook</div>
              </div>
            </a>

            {/* AdsyBN Link */}
            <a
              href="https://adsyclub.com/business-network/profile/9bbec703-b944-4393-a012-cc69bca5d2b5"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 sm:px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex-1 sm:flex-none sm:min-w-[180px]"
            >
              <div className="mr-2 sm:mr-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>              <div className="text-left">
                <div className="text-xs sm:text-sm font-semibold">Connect on</div>
                <div className="text-xs text-orange-100">AdsyBN</div>
              </div>
            </a>
          </div></div>        
        
        {/* Member Benefits Section */}
        <div className="mb-8 bg-white/5 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/10 max-sm:w-full mx-2 sm:mx-4">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">🎁 Exclusive Member Benefits</h3>
            <p className="text-gray-300">Enjoy amazing discounts and offers exclusive to our members</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🍔</div>
              <h4 className="text-white font-semibold mb-1">Food & Dining</h4>
              <p className="text-gray-300 text-sm">Up to 25% off at partner restaurants</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">⛽</div>
              <h4 className="text-white font-semibold mb-1">Fuel & Service</h4>
              <p className="text-gray-300 text-sm">Special rates on fuel and bike services</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🛍️</div>
              <h4 className="text-white font-semibold mb-1">Shopping</h4>
              <p className="text-gray-300 text-sm">Exclusive discounts on gear and accessories</p>
            </div>
          </div>
          
          <div className="text-center">
            <Link
              href="/benefits"
              className="inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span>View All Benefits</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
          
          {/* App Download Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-12 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Get the Mobile App
            </h2>
            <p className="text-gray-300 text-lg">
              Download now and take your riding experience everywhere
            </p>
          </div>          
          <div className="flex flex-row gap-3 sm:gap-4 justify-center items-center">
            {/* iOS App Store Button */}
            <a
              href="#"
              className="flex items-center bg-black hover:bg-gray-800 text-white px-4 sm:px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex-1 sm:flex-none sm:min-w-[200px]"
            >
              <div className="mr-2 sm:mr-3">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xs text-gray-300">Download on the</div>
                <div className="text-sm sm:text-lg font-semibold">App Store</div>
              </div>
            </a>

            {/* Google Play Store Button */}
            <a
              href="#"
              className="flex items-center bg-black hover:bg-gray-800 text-white px-4 sm:px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex-1 sm:flex-none sm:min-w-[200px]"
            >
              <div className="mr-2 sm:mr-3">
                <svg className="w-6 h-6 sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xs text-gray-300">Get it on</div>
                <div className="text-sm sm:text-lg font-semibold">Google Play</div>
              </div>
            </a>
          </div>

          {/* Features Preview */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1">Find Rides</h3>
              <p className="text-gray-400 text-sm">Discover exciting routes near you</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1">Connect</h3>
              <p className="text-gray-400 text-sm">Meet fellow riders and friends</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1">Share</h3>
              <p className="text-gray-400 text-sm">Share your adventures and tips</p>
            </div>
          </div>        </div>        {/* Coming Soon Badge */}
        <div className="mt-8">
          <span className="bg-purple-600/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium border border-purple-500/30">
            🚀 Coming Soon to App Stores
          </span>
        </div>
      </div>

      {/* Footer - Terms and Conditions */}
      <footer className="bg-slate-900/50 backdrop-blur-lg border-t border-white/10 py-8 px-4">
        <div className="max-w-6xl mx-auto">          {/* Terms and Conditions Links */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mb-6">
            <a href="#" className="text-gray-300 hover:text-purple-400 text-sm transition-colors">
              Terms & Conditions
            </a>
            <a href="#" className="text-gray-300 hover:text-purple-400 text-sm transition-colors">
              Community Guidelines
            </a>
            <a href="#" className="text-gray-300 hover:text-purple-400 text-sm transition-colors">
              Support
            </a>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6"></div>

          {/* Copyright and Rights */}
          <div className="text-center space-y-3">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 text-sm text-gray-400">
              <span>© {new Date().getFullYear()} Rider's Club Bangladesh.</span>
              <span className="hidden sm:block">•</span>
              <span>All rights reserved.</span>
            </div>
            
            <div className="text-xs text-gray-500 max-w-2xl mx-auto">
              <p className="mb-2">
                By using this service, you agree to our Terms of Service and Privacy Policy. 
                Rider's Club Bangladesh is a registered trademark of Lyricz Motors.
              </p>
              <p>
                All content, logos, and designs are protected by copyright and other intellectual property laws. 
                Unauthorized reproduction or distribution is strictly prohibited.
              </p>
            </div>            {/* Company Attribution */}
            <div className="pt-4 border-t border-white/5">
              <p className="text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-center text-center">
                <span className="flex items-center">
                  Developed with love 
                  <svg className="w-3 h-3 mx-1 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  by
                </span>
                <span className="text-purple-400 font-medium sm:ml-1">Lyricz Softwares & Technology Limited</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

