'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiService, Zone, MembershipApplicationData } from '../../services/api';

interface FormData {
  profilePhoto: File | null;
  fullName: string;
  email: string;
  phone: string;
  alternativePhone: string;
  dateOfBirth: string;
  bloodGroup: string;
  profession: string;
  hobbies: string;
  idDocumentType: string;
  idDocumentNumber: string;
  idDocumentPhoto: File | null;
  holdingIdPhoto: File | null;
  address: string;
  zone: string;
  emergencyContact: string;
  emergencyPhone: string;
  hasMotorbike: boolean;
  motorcycleBrand: string;
  motorcycleModel: string;
  motorcycleYear: string;
  ridingExperience: string;
  agreeTerms: boolean;
  citizenshipConfirm: boolean;
}

export default function JoinPage() {  const [formData, setFormData] = useState<FormData>({
    profilePhoto: null,
    fullName: '',
    email: '',
    phone: '',
    alternativePhone: '',
    dateOfBirth: '',
    bloodGroup: '',
    profession: '',
    hobbies: '',
    idDocumentType: 'nid',
    idDocumentNumber: '',
    idDocumentPhoto: null,
    holdingIdPhoto: null,
    address: '',
    zone: '',
    emergencyContact: '',
    emergencyPhone: '',
    hasMotorbike: false,
    motorcycleBrand: '',
    motorcycleModel: '',
    motorcycleYear: '',
    ridingExperience: 'beginner',
    agreeTerms: false,
    citizenshipConfirm: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [zones, setZones] = useState<Zone[]>([]);
  const [isLoadingZones, setIsLoadingZones] = useState(true);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [zonesError, setZonesError] = useState<string | null>(null);  // Fetch zones from backend API
  useEffect(() => {
    const fetchZones = async () => {
      try {
        setZonesError(null);
        const data = await apiService.fetchZones();
        setZones(data);
      } catch (error) {
        console.error('Error fetching zones:', error);
        setZonesError('Failed to load zones. Using offline data.');
        // Fallback to mock data if API fails
        setZones([
          { id: 1, name: 'Dhaka North', description: '', is_active: true },
          { id: 2, name: 'Dhaka South', description: '', is_active: true },
          { id: 3, name: 'Chittagong', description: '', is_active: true },
          { id: 4, name: 'Sylhet', description: '', is_active: true },
          { id: 5, name: 'Rajshahi', description: '', is_active: true },
          { id: 6, name: 'Khulna', description: '', is_active: true },
          { id: 7, name: 'Barisal', description: '', is_active: true },
          { id: 8, name: 'Rangpur', description: '', is_active: true },
          { id: 9, name: 'Mymensingh', description: '', is_active: true },
          { id: 10, name: 'Comilla', description: '', is_active: true },
          { id: 11, name: "Cox's Bazar", description: '', is_active: true },
          { id: 12, name: 'Gazipur', description: '', is_active: true },
        ]);
      } finally {
        setIsLoadingZones(false);
      }
    };

    fetchZones();
  }, []);
  const retryLoadZones = () => {
    setIsLoadingZones(true);
    setZonesError(null);
    // Trigger useEffect again
    const fetchZones = async () => {
      try {
        const data = await apiService.fetchZones();
        setZones(data);
        setZonesError(null);
      } catch (error) {
        console.error('Error fetching zones:', error);
        setZonesError('Failed to load zones. Using offline data.');
      } finally {
        setIsLoadingZones(false);
      }
    };
    fetchZones();
  };

  // Calculate form completion percentage
  const calculateProgress = (): number => {
    const requiredFields = [
      'profilePhoto', 'fullName', 'phone', 'dateOfBirth', 'bloodGroup', 
      'profession', 'idDocumentNumber', 'idDocumentPhoto', 'holdingIdPhoto',
      'address', 'zone', 'emergencyContact', 'emergencyPhone'
    ];
    
    let completed = 0;
    requiredFields.forEach(field => {
      if (formData[field as keyof FormData]) {
        completed++;
      }
    });
    
    // Add checkboxes
    if (formData.agreeTerms) completed++;
    if (formData.citizenshipConfirm) completed++;
    
    return Math.round((completed / (requiredFields.length + 2)) * 100);
  };

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};    // Required fields validation
    if (!formData.profilePhoto) newErrors.profilePhoto = 'Profile photo is required';
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    if (!formData.profession.trim()) newErrors.profession = 'Profession is required';
    if (!formData.idDocumentNumber.trim()) newErrors.idDocumentNumber = 'ID document number is required';
    if (!formData.idDocumentPhoto) newErrors.idDocumentPhoto = 'ID document photo is required';
    if (!formData.holdingIdPhoto) newErrors.holdingIdPhoto = 'Photo holding ID is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.zone) newErrors.zone = 'Zone is required';
    if (!formData.emergencyContact.trim()) newErrors.emergencyContact = 'Emergency contact is required';
    if (!formData.emergencyPhone.trim()) newErrors.emergencyPhone = 'Emergency phone is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation (Bangladesh format)
    const phoneRegex = /^(\+8801|01)[3-9]\d{8}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid Bangladesh phone number';
    }

    // Age validation
    if (formData.dateOfBirth) {
      const age = calculateAge(formData.dateOfBirth);
      if (age < 15) {
        newErrors.dateOfBirth = 'You must be at least 15 years old to join';
      }
    }    // ID Document validation based on type
    if (formData.idDocumentNumber) {
      if (formData.idDocumentType === 'nid') {
        const nidRegex = /^\d{10}$|^\d{13}$|^\d{17}$/;
        if (!nidRegex.test(formData.idDocumentNumber)) {
          newErrors.idDocumentNumber = 'Please enter a valid Bangladesh NID number';
        }
      } else if (formData.idDocumentType === 'birth_certificate') {
        const birthCertRegex = /^\d{17}$/;
        if (!birthCertRegex.test(formData.idDocumentNumber)) {
          newErrors.idDocumentNumber = 'Please enter a valid birth certificate number';
        }
      } else if (formData.idDocumentType === 'passport') {
        const passportRegex = /^[A-Z]{2}\d{7}$/;
        if (!passportRegex.test(formData.idDocumentNumber)) {
          newErrors.idDocumentNumber = 'Please enter a valid passport number (e.g., AB1234567)';
        }
      }
    }// File size validation (max 5MB)
    if (formData.profilePhoto && formData.profilePhoto.size > 5 * 1024 * 1024) {
      newErrors.profilePhoto = 'Profile photo must be less than 5MB';
    }
    if (formData.idDocumentPhoto && formData.idDocumentPhoto.size > 5 * 1024 * 1024) {
      newErrors.idDocumentPhoto = 'ID document photo must be less than 5MB';
    }
    if (formData.holdingIdPhoto && formData.holdingIdPhoto.size > 5 * 1024 * 1024) {
      newErrors.holdingIdPhoto = 'Photo holding ID must be less than 5MB';
    }

    // Checkbox validations
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms and conditions';
    if (!formData.citizenshipConfirm) newErrors.citizenshipConfirm = 'You must confirm your Bangladesh citizenship';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const files = (e.target as HTMLInputElement).files;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? (files ? files[0] : null) : value
    }));

    // Clear error when user starts typing/changing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear submit message when user starts making changes
    if (submitMessage) {
      setSubmitMessage(null);
    }

    // Real-time validation feedback for some fields
    if (name === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      }
    }

    if (name === 'phone' && value) {
      const phoneRegex = /^(\+8801|01)[3-9]\d{8}$/;
      if (!phoneRegex.test(value)) {
        setErrors(prev => ({ ...prev, phone: 'Please enter a valid Bangladesh phone number' }));
      }
    }

    if (name === 'dateOfBirth' && value) {
      const age = calculateAge(value);
      if (age < 15) {
        setErrors(prev => ({ ...prev, dateOfBirth: 'You must be at least 15 years old to join' }));
      }
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Convert FormData to MembershipApplicationData
      const applicationData: MembershipApplicationData = {
        profilePhoto: formData.profilePhoto,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        alternativePhone: formData.alternativePhone,
        dateOfBirth: formData.dateOfBirth,
        bloodGroup: formData.bloodGroup,
        profession: formData.profession,
        hobbies: formData.hobbies,
        idDocumentType: formData.idDocumentType,
        idDocumentNumber: formData.idDocumentNumber,
        idDocumentPhoto: formData.idDocumentPhoto,
        holdingIdPhoto: formData.holdingIdPhoto,
        address: formData.address,
        zone: formData.zone,
        emergencyContact: formData.emergencyContact,
        emergencyPhone: formData.emergencyPhone,
        hasMotorbike: formData.hasMotorbike,
        motorcycleBrand: formData.motorcycleBrand,
        motorcycleModel: formData.motorcycleModel,
        motorcycleYear: formData.motorcycleYear,
        ridingExperience: formData.ridingExperience,
        agreeTerms: formData.agreeTerms,
        citizenshipConfirm: formData.citizenshipConfirm,
      };      // Submit to backend API
      const response = await apiService.submitMembershipApplication(applicationData);
      
      // Success - show success message
      setSubmitMessage({
        type: 'success',
        message: response.message || 'Application submitted successfully! We will contact you soon.'
      });
      
      // Reset form after a short delay
      setTimeout(() => {
        setFormData({
          profilePhoto: null,
          fullName: '',
          email: '',
          phone: '',
          alternativePhone: '',
          dateOfBirth: '',
          bloodGroup: '',
          profession: '',
          hobbies: '',
          idDocumentType: 'nid',
          idDocumentNumber: '',
          idDocumentPhoto: null,
          holdingIdPhoto: null,
          address: '',
          zone: '',
          emergencyContact: '',
          emergencyPhone: '',
          hasMotorbike: false,
          motorcycleBrand: '',
          motorcycleModel: '',
          motorcycleYear: '',
          ridingExperience: 'beginner',
          agreeTerms: false,
          citizenshipConfirm: false,
        });
        
        // Clear any existing errors
        setErrors({});
        setSubmitMessage(null);
      }, 3000);
      
    } catch (error) {
      console.error('Submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setSubmitMessage({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link 
            href="/" 
            className="inline-flex items-center text-purple-300 hover:text-white mb-6 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Join Riders Club Bangladesh
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Fill out the application form below to become a member of our motorcycle community
          </p>
        </div>        {/* Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-2xl border border-white/20">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-white">Form Progress</span>
              <span className="text-sm font-medium text-white">{calculateProgress()}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${calculateProgress()}%` }}
              ></div>
            </div>
          </div>

          {/* Success/Error Message */}
          {submitMessage && (
            <div className={`mb-6 p-4 rounded-lg ${
              submitMessage.type === 'success' 
                ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
                : 'bg-red-500/20 border border-red-500/30 text-red-300'
            }`}>
              <div className="flex items-center">
                {submitMessage.type === 'success' ? (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <span className="font-medium">{submitMessage.message}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">{/* Personal Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-purple-500/30 pb-2">
                Personal Information
              </h2>
                {/* Profile Photo Upload */}
              <div className="mb-6">
                <label className="block text-white font-medium mb-2">
                  Upload Your Photo *
                </label>
                <input
                  type="file"
                  name="profilePhoto"
                  onChange={handleInputChange}
                  accept="image/*"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <p className="text-gray-400 text-sm mt-1">Maximum file size: 5MB. Accepted formats: JPG, PNG, JPEG</p>
                {errors.profilePhoto && <p className="text-red-400 text-sm mt-1">{errors.profilePhoto}</p>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
                </div>                <div>
                  <label className="block text-white font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="your.email@example.com (Optional)"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div><div>
                  <label className="block text-white font-medium mb-2">
                    Phone Number * 
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="01XXXXXXXXX or +8801XXXXXXXXX"
                  />
                  {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Alternative Phone Number
                  </label>
                  <input
                    type="tel"
                    name="alternativePhone"
                    value={formData.alternativePhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="01XXXXXXXXX or +8801XXXXXXXXX (Optional)"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Date of Birth * (Must be 15+ years old)
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {errors.dateOfBirth && <p className="text-red-400 text-sm mt-1">{errors.dateOfBirth}</p>}
                </div>                <div>
                  <label className="block text-white font-medium mb-2">
                    Blood Group *
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="" className="bg-white text-black">Select Blood Group</option>
                    <option value="A+" className="bg-white text-black">A+</option>
                    <option value="A-" className="bg-white text-black">A-</option>
                    <option value="B+" className="bg-white text-black">B+</option>
                    <option value="B-" className="bg-white text-black">B-</option>
                    <option value="AB+" className="bg-white text-black">AB+</option>
                    <option value="AB-" className="bg-white text-black">AB-</option>
                    <option value="O+" className="bg-white text-black">O+</option>
                    <option value="O-" className="bg-white text-black">O-</option>
                  </select>
                  {errors.bloodGroup && <p className="text-red-400 text-sm mt-1">{errors.bloodGroup}</p>}
                </div>                <div>
                  <label className="block text-white font-medium mb-2">
                    Profession *
                  </label>
                  <input
                    type="text"
                    name="profession"
                    value={formData.profession}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Software Engineer, Doctor, Student"
                  />
                  {errors.profession && <p className="text-red-400 text-sm mt-1">{errors.profession}</p>}
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Hobbies
                  </label>
                  <input
                    type="text"
                    name="hobbies"
                    value={formData.hobbies}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Photography, Reading, Traveling (Optional)"
                  />
                  {errors.hobbies && <p className="text-red-400 text-sm mt-1">{errors.hobbies}</p>}
                </div>                <div>
                  <label className="block text-white font-medium mb-2">
                    Zone *
                  </label>
                  <select
                    name="zone"
                    value={formData.zone}
                    onChange={handleInputChange}
                    disabled={isLoadingZones}
                    className="w-full px-4 py-3 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="" className="bg-white text-black">
                      {isLoadingZones ? 'Loading zones...' : 'Select Zone'}
                    </option>
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id} className="bg-white text-black">
                        {zone.name}
                      </option>
                    ))}
                  </select>
                  {zonesError && (
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-yellow-400 text-sm">{zonesError}</p>
                      <button
                        type="button"
                        onClick={retryLoadZones}
                        disabled={isLoadingZones}
                        className="text-purple-400 hover:text-purple-300 text-sm underline disabled:opacity-50"
                      >
                        {isLoadingZones ? 'Retrying...' : 'Retry'}
                      </button>
                    </div>
                  )}
                  {errors.zone && <p className="text-red-400 text-sm mt-1">{errors.zone}</p>}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-white font-medium mb-2">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Your full address in Bangladesh"
                />
                {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
              </div>
            </div>

            {/* Identity Verification */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-purple-500/30 pb-2">
                Identity Verification
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    ID Document Type *
                  </label>                  <select
                    name="idDocumentType"
                    value={formData.idDocumentType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="nid" className="bg-white text-black">National ID (NID)</option>
                    <option value="birth_certificate" className="bg-white text-black">Birth Certificate</option>
                    <option value="passport" className="bg-white text-black">Passport</option>
                  </select>
                </div>                <div>
                  <label className="block text-white font-medium mb-2">
                    {formData.idDocumentType === 'nid' ? 'NID Number *' : 
                     formData.idDocumentType === 'birth_certificate' ? 'Birth Certificate Number *' : 
                     'Passport Number *'}
                  </label>
                  <input
                    type="text"
                    name="idDocumentNumber"
                    value={formData.idDocumentNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={
                      formData.idDocumentType === 'nid' 
                        ? 'Bangladesh NID Number' 
                        : formData.idDocumentType === 'birth_certificate'
                        ? 'Birth Certificate Number'
                        : 'Passport Number'
                    }
                  />
                  {errors.idDocumentNumber && <p className="text-red-400 text-sm mt-1">{errors.idDocumentNumber}</p>}
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Upload ID Document Photo *
                  </label>
                  <input
                    type="file"
                    name="idDocumentPhoto"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                  />
                  <p className="text-gray-400 text-xs mt-1">Clear photo of your ID document (max 5MB)</p>
                  {errors.idDocumentPhoto && <p className="text-red-400 text-sm mt-1">{errors.idDocumentPhoto}</p>}
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Upload Photo Holding ID *
                  </label>
                  <input
                    type="file"
                    name="holdingIdPhoto"
                    onChange={handleInputChange}
                    accept="image/*"
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                  />
                  <p className="text-gray-400 text-xs mt-1">Photo of you holding your ID document (max 5MB)</p>
                  {errors.holdingIdPhoto && <p className="text-red-400 text-sm mt-1">{errors.holdingIdPhoto}</p>}
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-purple-500/30 pb-2">
                Emergency Contact
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Emergency Contact Name *
                  </label>
                  <input
                    type="text"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Emergency contact person"
                  />
                  {errors.emergencyContact && <p className="text-red-400 text-sm mt-1">{errors.emergencyContact}</p>}
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Emergency Contact Phone *
                  </label>
                  <input
                    type="tel"
                    name="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Emergency contact phone"
                  />
                  {errors.emergencyPhone && <p className="text-red-400 text-sm mt-1">{errors.emergencyPhone}</p>}
                </div>
              </div>            </div>

            {/* Motorcycle Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-purple-500/30 pb-2">
                Motorcycle Information (Optional)
              </h2>
              
              {/* Checkbox for owning a motorbike */}
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="hasMotorbike"
                    id="hasMotorbike"
                    checked={formData.hasMotorbike}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hasMotorbike" className="ml-3 text-white font-medium">
                    I have a motorbike
                  </label>
                </div>
              </div>

              {/* Show motorcycle details only if checkbox is checked */}
              {formData.hasMotorbike && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Motorcycle Brand
                      </label>
                      <input
                        type="text"
                        name="motorcycleBrand"
                        value={formData.motorcycleBrand}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., Yamaha, Honda, Suzuki"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        Model
                      </label>
                      <input
                        type="text"
                        name="motorcycleModel"
                        value={formData.motorcycleModel}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="e.g., R15, CBR, GSX"
                      />
                    </div>

                    <div>
                      <label className="block text-white font-medium mb-2">
                        Year
                      </label>
                      <input
                        type="number"
                        name="motorcycleYear"
                        value={formData.motorcycleYear}
                        onChange={handleInputChange}
                        min="1990"
                        max="2025"
                        className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="2024"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-white font-medium mb-2">
                      Riding Experience
                    </label>                    <select
                      name="ridingExperience"
                      value={formData.ridingExperience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="beginner" className="bg-white text-black">Beginner (0-1 years)</option>
                      <option value="intermediate" className="bg-white text-black">Intermediate (1-5 years)</option>
                      <option value="advanced" className="bg-white text-black">Advanced (5+ years)</option>
                      <option value="expert" className="bg-white text-black">Expert (10+ years)</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-purple-500/30 pb-2">
                Terms & Conditions
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="citizenshipConfirm"
                    id="citizenshipConfirm"
                    checked={formData.citizenshipConfirm}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="citizenshipConfirm" className="ml-3 text-white">
                    I confirm that I am a citizen of Bangladesh *
                  </label>
                </div>
                {errors.citizenshipConfirm && <p className="text-red-400 text-sm">{errors.citizenshipConfirm}</p>}

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="agreeTerms" className="ml-3 text-white">
                    I agree to the terms and conditions of Riders Club Bangladesh *
                  </label>
                </div>
                {errors.agreeTerms && <p className="text-red-400 text-sm">{errors.agreeTerms}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting Application...
                  </div>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
