import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-10 p-6">          <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="group cursor-pointer">
            <div className="relative">
              <div className="text-white font-black text-2xl tracking-wider bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent transform transition-all duration-300 hover:scale-110 hover:rotate-1">
                RCB
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-lg opacity-0 group-hover:opacity-20 transition duration-300"></div>
            </div>
          </div>
          <div className="space-x-4">
            <Link
              href="/join"
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Join Club
            </Link>
            <Link
              href="/login"
              className="bg-transparent border border-white/30 hover:bg-white/10 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col pt-20 pb-10 items-center justify-center min-h-screen px-4">        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-2">
            Rider's Club Bangladesh
          </h1>
          <div className="mb-6">
            <p className="text-lg md:text-xl text-purple-300 font-medium tracking-wide">
              <span className="text-gray-400">by</span> <span className="text-purple-200 font-semibold">Lyricz Motors</span>
            </p>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join the ultimate community for motorcycle enthusiasts. Connect, ride, and share your passion.
          </p>
        </div>

        {/* Follow Us Section */}
        <div className="mb-8 bg-white/5 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/10">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-white mb-2">Follow Us</h3>
            <p className="text-gray-300">Stay connected with our community</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Facebook Link */}
            <a
              href="https://www.facebook.com/share/16p46KBPek"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[180px]"
            >
              <div className="mr-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold">Follow us on</div>
                <div className="text-xs text-blue-100">Facebook</div>
              </div>
            </a>

            {/* AdsyBN Link */}
            <a
              href="https://adsyclub.com/business-network/profile/9bbec703-b944-4393-a012-cc69bca5d2b5"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[180px]"
            >
              <div className="mr-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="text-sm font-semibold">Connect on</div>
                <div className="text-xs text-orange-100">AdsyBN</div>
              </div>
            </a>
          </div>        </div>

        {/* App Download Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-2xl border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Get the Mobile App
            </h2>
            <p className="text-gray-300 text-lg">
              Download now and take your riding experience everywhere
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* iOS App Store Button */}
            <a
              href="#"
              className="flex items-center bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[200px]"
            >
              <div className="mr-3">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xs text-gray-300">Download on the</div>
                <div className="text-lg font-semibold">App Store</div>
              </div>
            </a>

            {/* Google Play Store Button */}
            <a
              href="#"
              className="flex items-center bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[200px]"
            >
              <div className="mr-3">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
              </div>
              <div className="text-left">
                <div className="text-xs text-gray-300">Get it on</div>
                <div className="text-lg font-semibold">Google Play</div>
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
          </div>        </div>

        {/* Coming Soon Badge */}
        <div className="mt-8">
          <span className="bg-purple-600/20 text-purple-300 px-4 py-2 rounded-full text-sm font-medium border border-purple-500/30">
            🚀 Coming Soon to App Stores
          </span>
        </div>
      </div>
    </div>
  );
}

