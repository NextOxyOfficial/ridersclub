'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiService, UserProfile, ChangePasswordData, Benefit } from '../../services/api';

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [benefitsLoading, setBenefitsLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(true);  const [error, setError] = useState<string>('');  const [activeEventTab, setActiveEventTab] = useState<'upcoming' | 'previous'>('upcoming');
  const [registeredEvents, setRegisteredEvents] = useState<Set<string>>(new Set());
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showEventModal, setShowEventModal] = useState(false);const [passwordData, setPasswordData] = useState<ChangePasswordData & { confirm_password: string }>({
    old_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [passwordError, setPasswordError] = useState<string>('');
  const [passwordSuccess, setPasswordSuccess] = useState<string>('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      if (!apiService.isAuthenticated()) {
        router.push('/login');
        return;
      }      try {
        const [userProfile, allBenefits] = await Promise.all([
          apiService.getCurrentUser(),
          apiService.fetchBenefits() // Fetch all benefits instead of just featured
        ]);
        
        setUser(userProfile);
        setBenefits(allBenefits); // Show all benefits
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load dashboard data');
        // If token is invalid, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        router.push('/login');
      } finally {
        setIsLoading(false);
        setBenefitsLoading(false);
      }
    };

    checkAuth();
  }, [router]);
  const handleUseBenefit = async (benefitId: number, websiteUrl?: string) => {
    try {
      await apiService.useBenefit(benefitId);
      if (websiteUrl) {
        window.open(websiteUrl, '_blank');
      }
    } catch (error) {
      console.error('Error using benefit:', error);
      // Still open the website even if tracking fails
      if (websiteUrl) {
        window.open(websiteUrl, '_blank');
      }
    }  };  const handleJoinEvent = async (eventId: string, eventName: string) => {
    // Check if already registered, if so unregister
    if (registeredEvents.has(eventId)) {
      // Immediately unregister the user
      setRegisteredEvents(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
      
      try {
        // Here you would make the actual API call to leave the event
        // await apiService.leaveEvent(eventId);
        
        console.log(`Successfully unregistered from event: ${eventName}`);
      } catch (error) {
        console.error('Error unregistering from event:', error);
        // Add back to registered state on error
        setRegisteredEvents(prev => new Set(prev).add(eventId));
      }
    } else {
      // Immediately register the user
      setRegisteredEvents(prev => new Set(prev).add(eventId));
      
      try {
        // Here you would make the actual API call to join the event
        // await apiService.joinEvent(eventId);
        
        console.log(`Successfully registered for event: ${eventName}`);
      } catch (error) {
        console.error('Error registering for event:', error);        // Remove from registered state on error
        setRegisteredEvents(prev => {
          const newSet = new Set(prev);
          newSet.delete(eventId);
          return newSet;
        });
      }
    }
  };

  // Sample event data with full details
  const eventData = {
    'dhaka-night-ride': {
      id: 'dhaka-night-ride',
      title: 'Dhaka Night Ride',
      date: 'December 30, 2024 • 8:00 PM',
      location: 'Dhanmondi 27',
      price: 'Free',
      description: 'Join us for an exciting night ride through the streets of Dhaka. Safety gear mandatory.',
      fullDescription: 'Experience the thrill of riding through Dhaka\'s illuminated streets at night. This guided tour will take you through the most scenic and safe routes in the city. We\'ll start from Dhanmondi and make our way through key landmarks including Rabindra Sarobar, TSC, and the Parliament area. Professional marshals will ensure safety throughout the journey.',
      requirements: ['Valid driving license', 'Safety helmet (mandatory)', 'Reflective vest', 'Working headlight and taillight'],
      duration: '3 hours',
      difficulty: 'Beginner',
      maxParticipants: 50,
      currentJoined: 23,
      organizer: 'Dhaka Zone Team'
    },
    'safety-workshop': {
      id: 'safety-workshop',
      title: 'Safety Workshop',
      date: 'January 5, 2025 • 2:00 PM',
      location: 'Club House',
      price: '৳500',
      description: 'Learn essential riding safety tips and techniques from professional instructors.',
      fullDescription: 'A comprehensive workshop covering all aspects of motorcycle safety. Learn from certified instructors about defensive riding techniques, emergency braking, cornering safety, and road hazard awareness. The workshop includes both theoretical sessions and practical demonstrations.',
      requirements: ['Own motorcycle for practical session', 'Safety gear', 'Notebook for taking notes'],
      duration: '4 hours',
      difficulty: 'All levels',
      maxParticipants: 30,
      currentJoined: 18,
      organizer: 'Safety Committee'
    },
    'coxs-bazar-tour': {
      id: 'coxs-bazar-tour',
      title: "Cox's Bazar Tour",
      date: 'January 15-17, 2025',
      location: "Cox's Bazar",
      price: '৳15,000',
      description: '3-day adventure tour to Cox\'s Bazar. Accommodation and meals included.',
      fullDescription: 'An unforgettable 3-day motorcycle tour to the world\'s longest natural sea beach. The package includes accommodation at a beachfront resort, all meals, guided tours to local attractions, and support vehicle throughout the journey. Experience the beauty of Cox\'s Bazar, visit Inani Beach, and enjoy group bonding activities.',
      requirements: ['Long-distance riding experience', 'Valid documents for travel', 'Personal medications', 'Casual and riding gear'],
      duration: '3 days, 2 nights',
      difficulty: 'Intermediate',
      maxParticipants: 25,
      currentJoined: 12,
      organizer: 'Tour Committee'
    }
  };

  const openEventModal = (eventId: string) => {
    setSelectedEvent(eventData[eventId as keyof typeof eventData]);
    setShowEventModal(true);
  };


  const handleLogout = async () => {
    try {
      await apiService.logout();
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if logout fails
      router.push('/');
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordData.new_password.length < 6) {
      setPasswordError('New password must be at least 6 characters long');
      return;
    }

    setIsChangingPassword(true);    try {
      await apiService.changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password,
      });
      setPasswordSuccess('Password changed successfully!');
      setPasswordData({
        old_password: '',
        new_password: '',
        confirm_password: '',
      });
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess('');
      }, 2000);
    } catch (error) {
      console.error('Password change error:', error);
      setPasswordError(error instanceof Error ? error.message : 'Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear errors when user starts typing
    if (passwordError) {
      setPasswordError('');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-purple-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-white text-lg">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-6 rounded-lg max-w-md mx-auto">
            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
            <Link href="/login" className="inline-block mt-4 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Mobile App Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 backdrop-blur-xl border-b border-purple-500/30">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>            <div>
              <h1 className="text-lg font-bold text-white">Rider's club Bangladesh</h1>
              <p className="text-xs text-purple-300">Member</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>      {/* Main Content */}
      <div className="p-2 sm:p-4 pb-20">
        {/* Profile Card - Enhanced Design */}
        <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl p-3 mb-6 border border-white/30 shadow-2xl">          {/* Profile Header */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl p-1">
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-1">
                {user?.full_name || user?.phone}
              </h3>
              <div className="space-y-2">
                {/* Phone and Blood Group */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <span className="text-blue-300 text-sm font-medium">{user?.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-rose-400 to-pink-500 rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <span className="text-rose-300 text-sm font-medium">{user?.blood_group || 'Not provided'}</span>
                  </div>
                </div>
                
                {/* Zone and Bike */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-lg flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="text-purple-300 text-sm font-medium">{user?.zone?.name || 'Not assigned'}</span>
                  </div>
                  {user?.bike_model && (
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-amber-500 rounded-lg flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-orange-300 text-sm font-medium">{user.bike_model}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>          
            </div>

        {/* Events Section with Tabs */}
        <div className="mb-6">
          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl p-3 border border-white/30 shadow-2xl">
            {/* Tab Headers */}
            <div className="flex bg-white/10 backdrop-blur-sm rounded-2xl p-1 mb-6">
              <button 
                onClick={() => setActiveEventTab('upcoming')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeEventTab === 'upcoming' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                    : 'text-blue-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Upcoming Events</span>
                </div>
              </button>
              <button 
                onClick={() => setActiveEventTab('previous')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 ${
                  activeEventTab === 'previous' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                    : 'text-blue-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Previous Events</span>
                </div>
              </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px]">
              {activeEventTab === 'upcoming' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Upcoming Events</h3>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-blue-400 text-xs font-medium">3 Events Scheduled</span>
                    </div>
                  </div>
                  
                  {/* Sample Upcoming Events */}
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-4 border border-blue-400/30">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-white font-bold text-lg">Dhaka Night Ride</h4>
                              <p className="text-blue-300 text-sm">December 30, 2024 • 8:00 PM</p>
                            </div>
                          </div>                          <p className="text-gray-300 text-sm mb-2">Join us for an exciting night ride through the streets of Dhaka. Safety gear mandatory.</p>
                          <div className="flex items-center space-x-4 text-xs">
                            <span className="bg-blue-500/30 text-blue-300 px-2 py-1 rounded-full">📍 Dhanmondi 27</span>
                            <span className="bg-green-500/30 text-green-300 px-2 py-1 rounded-full">🎫 Free</span>
                            <span className="bg-purple-500/30 text-purple-300 px-2 py-1 rounded-full">👥 23/50 Joined</span>
                          </div>
                          <button 
                            onClick={() => openEventModal('dhaka-night-ride')}
                            className="mt-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                          >
                            Read More →
                          </button></div>                        <button 
                          onClick={() => handleJoinEvent('dhaka-night-ride', 'Dhaka Night Ride')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            registeredEvents.has('dhaka-night-ride')
                              ? 'bg-green-500 hover:bg-red-500 text-white'
                              : 'bg-blue-500 hover:bg-blue-600 text-white'
                          }`}
                        >
                          {registeredEvents.has('dhaka-night-ride') ? 'Registered' : "I'll Join"}
                        </button>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-sm rounded-2xl p-4 border border-emerald-400/30">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center mr-3">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-white font-bold text-lg">Safety Workshop</h4>
                              <p className="text-emerald-300 text-sm">January 5, 2025 • 2:00 PM</p>
                            </div>
                          </div>                          <p className="text-gray-300 text-sm mb-2">Learn essential riding safety tips and techniques from professional instructors.</p>
                          <div className="flex items-center space-x-4 text-xs">
                            <span className="bg-emerald-500/30 text-emerald-300 px-2 py-1 rounded-full">📍 Club House</span>
                            <span className="bg-yellow-500/30 text-yellow-300 px-2 py-1 rounded-full">🎫 ৳500</span>
                            <span className="bg-purple-500/30 text-purple-300 px-2 py-1 rounded-full">👥 18/30 Joined</span>
                          </div>
                          <button 
                            onClick={() => openEventModal('safety-workshop')}
                            className="mt-2 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                          >
                            Read More →
                          </button></div>                        <button 
                          onClick={() => handleJoinEvent('safety-workshop', 'Safety Workshop')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            registeredEvents.has('safety-workshop')
                              ? 'bg-green-500 hover:bg-red-500 text-white'
                              : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                          }`}
                        >
                          {registeredEvents.has('safety-workshop') ? 'Registered' : "I'll Join"}
                        </button>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl p-4 border border-orange-400/30">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mr-3">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-white font-bold text-lg">Cox's Bazar Tour</h4>
                              <p className="text-orange-300 text-sm">January 15-17, 2025</p>
                            </div>
                          </div>                          <p className="text-gray-300 text-sm mb-2">3-day adventure tour to Cox's Bazar. Accommodation and meals included.</p>
                          <div className="flex items-center space-x-4 text-xs">
                            <span className="bg-orange-500/30 text-orange-300 px-2 py-1 rounded-full">🏖️ Cox's Bazar</span>
                            <span className="bg-red-500/30 text-red-300 px-2 py-1 rounded-full">🎫 ৳15,000</span>
                            <span className="bg-purple-500/30 text-purple-300 px-2 py-1 rounded-full">👥 12/25 Joined</span>
                          </div>
                          <button 
                            onClick={() => openEventModal('coxs-bazar-tour')}
                            className="mt-2 text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors"
                          >
                            Read More →
                          </button></div>                        <button 
                          onClick={() => handleJoinEvent('coxs-bazar-tour', "Cox's Bazar Tour")}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            registeredEvents.has('coxs-bazar-tour')
                              ? 'bg-green-500 hover:bg-red-500 text-white'
                              : 'bg-orange-500 hover:bg-orange-600 text-white'
                          }`}
                        >
                          {registeredEvents.has('coxs-bazar-tour') ? 'Registered' : "I'll Join"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeEventTab === 'previous' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white">Previous Events</h3>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-gray-400 text-xs font-medium">5 Events Completed</span>
                    </div>
                  </div>
                  
                  {/* Sample Previous Events */}
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-gray-500/20 to-slate-500/20 backdrop-blur-sm rounded-2xl p-4 border border-gray-400/30">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl flex items-center justify-center mr-3">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-white font-bold text-lg">Annual Club Meet 2024</h4>
                              <p className="text-gray-300 text-sm">December 15, 2024 • Completed</p>
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm mb-2">Successful annual meetup with 150+ members. Great networking and fun activities.</p>                          <div className="flex items-center space-x-4 text-xs">
                            <span className="bg-green-500/30 text-green-300 px-2 py-1 rounded-full">✅ 150 Attended</span>
                            <span className="bg-blue-500/30 text-blue-300 px-2 py-1 rounded-full">📸 Photos Available</span>
                          </div>
                        </div>
                      </div>
                    </div>                    <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-sm rounded-2xl p-4 border border-purple-400/30">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-white font-bold text-lg">Chittagong Hill Ride</h4>
                              <p className="text-purple-300 text-sm">November 28, 2024 • Completed</p>
                            </div>
                          </div>                          <p className="text-gray-300 text-sm mb-2">Amazing hill track adventure with scenic views and challenging routes.</p>
                          <div className="flex items-center space-x-4 text-xs">
                            <span className="bg-green-500/30 text-green-300 px-2 py-1 rounded-full">✅ 45 Riders</span>
                          </div>
                        </div>
                      </div>
                    </div>                    <div className="bg-gradient-to-r from-teal-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl p-4 border border-teal-400/30">
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-600 rounded-xl flex items-center justify-center mr-3">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="text-white font-bold text-lg">Maintenance Workshop</h4>
                              <p className="text-teal-300 text-sm">October 20, 2024 • Completed</p>
                            </div>
                          </div>                          <p className="text-gray-300 text-sm mb-2">Hands-on motorcycle maintenance and repair workshop for all skill levels.</p>
                          <div className="flex items-center space-x-4 text-xs">
                            <span className="bg-green-500/30 text-green-300 px-2 py-1 rounded-full">✅ 80 Participants</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Special Offers Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3 px-2">
            <h3 className="text-xl font-bold text-white">All Benefits For Rider's Club Members</h3>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-emerald-400 text-xs font-medium">{benefits.length} Available</span>
            </div>
          </div>
          
          {benefitsLoading ? (
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20">
              <div className="animate-pulse flex items-center space-x-4">
                <div className="w-14 h-14 bg-gray-300 rounded-2xl"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </div>          ) : benefits.length > 0 ? (
            <div className="space-y-4">
              {benefits.map((benefit) => (
                <div key={benefit.id} className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-sm opacity-20"></div>
                  <div className="relative bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-xl rounded-3xl p-3 border border-emerald-200/50 shadow-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">                  
                        <div className="flex items-center mb-1">
                          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-3 shadow-xl">
                            <i className={`${benefit.category_icon} text-white text-lg`}></i>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-gray-900 font-black text-lg">
                              {benefit.discount_percentage 
                                ? `${benefit.discount_percentage}% Discount`
                                : benefit.discount_amount 
                                ? `৳${benefit.discount_amount} Off`
                                : 'Special Offer'
                              }
                            </h4>
                            <div className="px-2 py-1 bg-emerald-100 rounded-full inline-block">
                              <span className="text-emerald-700 text-xs font-bold">
                                {benefit.valid_until 
                                  ? `Valid till ${new Date(benefit.valid_until).toLocaleDateString()}`
                                  : 'Limited Time'
                                }
                              </span>
                            </div>
                          </div>
                          <div className="ml-2">
                            <div className="relative">
                              <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-xl p-2 text-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
                                <div className="text-lg font-black text-white">
                                  {benefit.discount_percentage || benefit.discount_amount || '★'}
                                </div>
                                <div className="text-xs text-emerald-100 uppercase tracking-wide font-bold">
                                  {benefit.discount_percentage ? 'OFF' : benefit.discount_amount ? 'OFF' : 'DEAL'}
                                </div>
                              </div>
                              {benefit.is_featured && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center">
                                  <span className="text-yellow-900 text-xs font-bold">★</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <h5 className="text-gray-800 font-black text-lg mb-1 flex items-center">
                            <span className="mr-2">🏍️</span>
                            {benefit.partner_name}
                          </h5>
                          <p className="text-gray-600 text-sm font-medium line-clamp-2">{benefit.description}</p>
                        </div>
                        
                        <div className="flex items-center text-sm text-emerald-700 bg-gradient-to-r from-emerald-50 to-teal-50 px-3 py-2 rounded-xl inline-flex border border-emerald-200 mb-2">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-semibold">{benefit.title}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-gray-500">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium">Show membership card</span>
                          </div>
                          
                          {benefit.website_url && (
                            <button
                              onClick={() => handleUseBenefit(benefit.id, benefit.website_url)}
                              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-1.5 px-3 rounded-lg transition-all duration-300 text-xs"
                            >
                              Visit Shop
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* View Detailed Benefits Link */}
              <div className="text-center pt-4">
                <Link 
                  href="/benefits" 
                  className="inline-flex items-center bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/40 hover:to-blue-600/40 border border-purple-500/30 text-purple-300 hover:text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
                >
                  <span>View Detailed Benefits Page</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 text-center">
              <div className="text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-2.172a1 1 0 01-.707-.293l-2.414-2.414a1 1 0 00-.707-.293H8" />
                </svg>
                <p className="text-white font-medium">No benefits available at the moment</p>
                <p className="text-sm mt-1">Check back later for exclusive offers!</p>
              </div>
            </div>
          )}
        </div>

        {/* Pending Application Message */}
        {user?.membership_status === 'pending' && (
          <div className="bg-amber-500/10 backdrop-blur-xl rounded-3xl p-6 mb-6 border border-amber-500/20">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Application Under Review</h3>
              <p className="text-amber-300 text-sm leading-relaxed">
                Your membership application is being reviewed by our team. We'll notify you once it's processed.
              </p>
            </div>
          </div>
        )}        {/* Enhanced Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button className="group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-xl rounded-3xl p-6 border border-blue-400/30 hover:border-blue-400/60 transition-all hover:scale-105 shadow-lg hover:shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-white text-sm font-bold">Help & Support</p>
              <p className="text-blue-300 text-xs mt-1">Get assistance</p>
            </div>
          </button>
          
          <button 
            onClick={() => setShowPasswordModal(true)}
            className="group bg-gradient-to-br from-emerald-500/10 to-green-500/10 backdrop-blur-xl rounded-3xl p-6 border border-emerald-400/30 hover:border-emerald-400/60 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <p className="text-white text-sm font-bold">Change Password</p>
              <p className="text-emerald-300 text-xs mt-1">Security settings</p>
            </div>
          </button>        </div>
      </div>

      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-2 sm:p-6 shadow-2xl border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">{selectedEvent.title}</h2>
              <button
                onClick={() => setShowEventModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Event Header Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center text-blue-300 mb-1">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium">Date & Time</span>
                  </div>
                  <p className="text-white font-semibold">{selectedEvent.date}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center text-purple-300 mb-1">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span className="text-sm font-medium">Location</span>
                  </div>
                  <p className="text-white font-semibold">{selectedEvent.location}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center text-green-300 mb-1">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span className="text-sm font-medium">Price</span>
                  </div>
                  <p className="text-white font-semibold">{selectedEvent.price}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <div className="flex items-center text-orange-300 mb-1">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="text-sm font-medium">Participants</span>
                  </div>
                  <p className="text-white font-semibold">{selectedEvent.currentJoined}/{selectedEvent.maxParticipants}</p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-white font-bold mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Event Description
                </h3>
                <p className="text-gray-300 leading-relaxed">{selectedEvent.fullDescription}</p>
              </div>              {/* Event Details */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-bold mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Duration
                </h4>
                <p className="text-gray-300">{selectedEvent.duration}</p>
              </div>

              {/* Requirements */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-bold mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Requirements
                </h4>
                <ul className="space-y-1">
                  {selectedEvent.requirements.map((req: string, index: number) => (
                    <li key={index} className="text-gray-300 flex items-center">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Organizer */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-bold mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Organized by
                </h4>
                <p className="text-gray-300">{selectedEvent.organizer}</p>
              </div>

              {/* Action Button */}
              <div className="flex justify-center pt-4">
                <button 
                  onClick={() => {
                    handleJoinEvent(selectedEvent.id, selectedEvent.title);
                    setShowEventModal(false);
                  }}
                  className={`px-8 py-3 rounded-lg text-lg font-medium transition-colors ${
                    registeredEvents.has(selectedEvent.id)
                      ? 'bg-green-500 hover:bg-red-500 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {registeredEvents.has(selectedEvent.id) ? 'Registered - Click to Unregister' : "Join This Event"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Change Password</h2>             
               <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordError('');
                  setPasswordSuccess('');
                  setPasswordData({
                    old_password: '',
                    new_password: '',
                    confirm_password: '',
                  });
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  Current Password
                </label>                <input
                  type="password"
                  name="old_password"
                  value={passwordData.old_password}
                  onChange={handlePasswordInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordInputChange}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Confirm new password"
                  required
                />
              </div>

              {passwordError && (
                <div className="bg-red-500/20 border border-red-500/30 text-red-300 p-4 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="font-medium">{passwordError}</span>
                  </div>
                </div>
              )}

              {passwordSuccess && (
                <div className="bg-green-500/20 border border-green-500/30 text-green-300 p-4 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium">{passwordSuccess}</span>
                  </div>
                </div>
              )}

              <div className="flex space-x-4">
                <button
                  type="button"                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordError('');
                    setPasswordSuccess('');
                    setPasswordData({
                      old_password: '',
                      new_password: '',
                      confirm_password: '',
                    });
                  }}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
                >
                  {isChangingPassword ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Changing...
                    </div>
                  ) : (
                    'Change Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
