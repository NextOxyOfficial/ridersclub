'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  bloodGroup: string;
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
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    bloodGroup: '',
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
  const [zones, setZones] = useState<{ id: string; name: string }[]>([]);

  // Mock zones data - replace with API call
  const mockZones = [
    { id: '1', name: 'Dhaka North' },
    { id: '2', name: 'Dhaka South' },
    { id: '3', name: 'Chittagong' },
    { id: '4', name: 'Sylhet' },
    { id: '5', name: 'Rajshahi' },
    { id: '6', name: 'Khulna' },
    { id: '7', name: 'Barisal' },
    { id: '8', name: 'Rangpur' },
    { id: '9', name: 'Mymensingh' },
    { id: '10', name: 'Comilla' },
    { id: '11', name: 'Cox\'s Bazar' },
    { id: '12', name: 'Gazipur' },
  ];

  // Load zones on component mount
  React.useEffect(() => {
    // TODO: Replace with actual API call
    // fetchZones().then(setZones);
    setZones(mockZones);
  }, []);

  const calculateAge = (dateOfBirth: string): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Required fields validation
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!formData.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
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
    }

    // ID Document validation based on type
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
      }
    }

    // File size validation (max 5MB)
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
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const files = (e.target as HTMLInputElement).files;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'file' ? (files ? files[0] : null) : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - redirect or show success message
      alert('Application submitted successfully! We will contact you soon.');      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        bloodGroup: '',
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
      
    } catch (error) {
      alert('Something went wrong. Please try again.');
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
        </div>

        {/* Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 shadow-2xl border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">            {/* Personal Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-purple-500/30 pb-2">
                Personal Information
              </h2>
              
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
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
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
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Blood Group *
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                  {errors.bloodGroup && <p className="text-red-400 text-sm mt-1">{errors.bloodGroup}</p>}
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Zone *
                  </label>
                  <select
                    name="zone"
                    value={formData.zone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select Zone</option>
                    {zones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        {zone.name}
                      </option>
                    ))}
                  </select>
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
                  </label>
                  <select
                    name="idDocumentType"
                    value={formData.idDocumentType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="nid">National ID (NID)</option>
                    <option value="birth_certificate">Birth Certificate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    {formData.idDocumentType === 'nid' ? 'NID Number *' : 'Birth Certificate Number *'}
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
                        : 'Birth Certificate Number'
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
                    </label>
                    <select
                      name="ridingExperience"
                      value={formData.ridingExperience}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="beginner">Beginner (0-1 years)</option>
                      <option value="intermediate">Intermediate (1-5 years)</option>
                      <option value="advanced">Advanced (5+ years)</option>
                      <option value="expert">Expert (10+ years)</option>
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
