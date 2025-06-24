'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiService, BenefitsByCategory, Benefit, BenefitCategory } from '../../services/api';

export default function BenefitsPage() {
  const [benefitsByCategory, setBenefitsByCategory] = useState<BenefitsByCategory[]>([]);
  const [featuredBenefits, setFeaturedBenefits] = useState<Benefit[]>([]);
  const [categories, setCategories] = useState<BenefitCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [filteredBenefits, setFilteredBenefits] = useState<Benefit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchBenefitsByCategory(selectedCategory);
    } else {
      setFilteredBenefits([]);
    }
  }, [selectedCategory]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesData, featuredData, benefitsByCategoryData] = await Promise.all([
        apiService.fetchBenefitCategories(),
        apiService.fetchFeaturedBenefits(),
        apiService.fetchBenefitsByCategory(),
      ]);

      setCategories(categoriesData);
      setFeaturedBenefits(featuredData);
      setBenefitsByCategory(benefitsByCategoryData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load benefits');
    } finally {
      setLoading(false);
    }
  };

  const fetchBenefitsByCategory = async (categoryId: number) => {
    try {
      const benefits = await apiService.fetchBenefits(categoryId);
      setFilteredBenefits(benefits);
    } catch (err) {
      console.error('Error fetching benefits by category:', err);
    }
  };

  const filteredFeaturedBenefits = featuredBenefits.filter(benefit =>
    benefit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    benefit.partner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    benefit.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCategoryBenefits = filteredBenefits.filter(benefit =>
    benefit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    benefit.partner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    benefit.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUseBenefit = async (benefitId: number) => {
    if (!apiService.isAuthenticated()) {
      alert('Please login to use benefits');
      return;
    }

    try {
      await apiService.useBenefit(benefitId);
      alert('Benefit usage recorded successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to use benefit');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading Benefits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-white mb-4">Error Loading Benefits</h1>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={fetchData}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-6 sm:py-12 px-2 sm:px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-6">
            <Link 
              href="/" 
              className="inline-flex items-center text-purple-300 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
            
            <Link 
              href="/dashboard" 
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Dashboard
            </Link>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Exclusive Benefits
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Discover amazing discounts and exclusive offers available to Rider's Club Bangladesh members
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search benefits, partners..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <svg
                className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center ${
                  selectedCategory === category.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
                style={{ backgroundColor: selectedCategory === category.id ? category.color : undefined }}
              >
                <i className={`${category.icon} mr-2`}></i>
                {category.name}
                <span className="ml-2 bg-white/20 text-xs px-2 py-1 rounded-full">
                  {category.benefits_count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Benefits (shown when no category is selected) */}
        {!selectedCategory && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              🌟 Featured Benefits
            </h2>
            {filteredFeaturedBenefits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFeaturedBenefits.map((benefit) => (
                  <BenefitCard key={benefit.id} benefit={benefit} onUseBenefit={handleUseBenefit} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-300">
                <p>No featured benefits found matching your search.</p>
              </div>
            )}
          </div>
        )}

        {/* Category Benefits (shown when a category is selected) */}
        {selectedCategory && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              {categories.find(c => c.id === selectedCategory)?.name} Benefits
            </h2>
            {filteredCategoryBenefits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategoryBenefits.map((benefit) => (
                  <BenefitCard key={benefit.id} benefit={benefit} onUseBenefit={handleUseBenefit} />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-300">
                <p>No benefits found in this category matching your search.</p>
              </div>
            )}
          </div>
        )}

        {/* All Benefits by Category (shown when no category is selected and no search) */}
        {!selectedCategory && !searchTerm && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              All Benefits by Category
            </h2>
            {benefitsByCategory.map((categoryData) => (
              <div key={categoryData.category.id} className="mb-12">
                <div className="flex items-center mb-6">
                  <div
                    className="w-4 h-4 rounded-full mr-3"
                    style={{ backgroundColor: categoryData.category.color }}
                  ></div>
                  <h3 className="text-2xl font-bold text-white flex items-center">
                    <i className={`${categoryData.category.icon} mr-3`}></i>
                    {categoryData.category.name}
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {categoryData.benefits.map((benefit) => (
                    <BenefitCard key={benefit.id} benefit={benefit} onUseBenefit={handleUseBenefit} compact />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface BenefitCardProps {
  benefit: Benefit;
  onUseBenefit: (benefitId: number) => void;
  compact?: boolean;
}

function BenefitCard({ benefit, onUseBenefit, compact = false }: BenefitCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
      {/* Partner Logo/Image */}
      {(benefit.image || benefit.partner_logo) && (
        <div className="mb-4">
          <img
            src={benefit.image || benefit.partner_logo}
            alt={benefit.partner_name}
            className="w-full h-32 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Discount Badge */}
      {(benefit.discount_percentage || benefit.discount_amount) && (
        <div className="mb-4">
          <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold">
            {benefit.discount_percentage 
              ? `${benefit.discount_percentage}% OFF`
              : `৳${benefit.discount_amount} OFF`
            }
          </span>
        </div>
      )}

      {/* Category */}
      <div className="flex items-center mb-2">
        <i className={`${benefit.category_icon} text-sm mr-2`} style={{ color: benefit.category_color }}></i>
        <span className="text-xs text-gray-300">{benefit.category_name}</span>
      </div>

      {/* Title and Partner */}
      <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
      <p className="text-purple-300 font-medium mb-3">{benefit.partner_name}</p>

      {/* Description */}
      <p className={`text-gray-300 mb-4 ${compact ? 'text-sm line-clamp-2' : 'line-clamp-3'}`}>
        {benefit.description}
      </p>

      {/* Location */}
      {benefit.location && (
        <p className="text-xs text-gray-400 mb-4 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {benefit.location.length > 50 ? `${benefit.location.substring(0, 50)}...` : benefit.location}
        </p>
      )}

      {/* Usage Stats */}
      <div className="flex justify-between items-center mb-4 text-xs text-gray-400">
        <span>Used {benefit.usage_count} times</span>
        {!benefit.is_available_in_zone && (
          <span className="text-yellow-400">Not available in your zone</span>
        )}
        {benefit.usage_limit && (
          <span>Limit: {benefit.usage_limit} uses</span>
        )}
      </div>      {/* Actions */}
      <div className="flex gap-2">
        {benefit.website_url ? (
          <a
            href={benefit.website_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onUseBenefit(benefit.id)}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 text-sm text-center inline-flex items-center justify-center"
          >
            <span>Visit Shop & Use Benefit</span>
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ) : (
          <button
            onClick={() => onUseBenefit(benefit.id)}
            disabled={!benefit.is_available_in_zone}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
          >
            Use Benefit
          </button>
        )}
        
      </div>

      {/* Contact Info */}
      {benefit.contact_info && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-gray-300">
            {benefit.contact_info}
          </p>
        </div>
      )}
    </div>
  );
}
