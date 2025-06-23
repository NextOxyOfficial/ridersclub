'use client';

import { useEffect, useState } from 'react';
import { Rider } from '@/types';
import { ridersApi } from '@/services/api';
import { UserIcon, MapPinIcon } from '@heroicons/react/24/outline';

export default function RidersPage() {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRiders = async () => {
      try {
        const response = await ridersApi.getAll();
        setRiders(response.data);
      } catch (error) {
        console.error('Error fetching riders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRiders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Riders</h1>
        <p className="text-gray-600">
          Connect with fellow motorcycle enthusiasts in our community
        </p>
      </div>

      {riders.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {riders.map((rider) => (
            <div key={rider.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="text-center mb-4">
                <div className="w-20 h-20 mx-auto mb-3 bg-gray-300 rounded-full flex items-center justify-center">
                  {rider.profile_image ? (
                    <img 
                      src={rider.profile_image} 
                      alt={rider.user.username}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-10 w-10 text-gray-500" />
                  )}
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900">
                  {rider.user.first_name && rider.user.last_name 
                    ? `${rider.user.first_name} ${rider.user.last_name}`
                    : rider.user.username
                  }
                </h3>
                <p className="text-sm text-gray-500">@{rider.user.username}</p>
              </div>

              {rider.bio && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">{rider.bio}</p>
              )}

              <div className="space-y-2">
                {rider.bike_model && (
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">🏍️ {rider.bike_model}</span>
                  </div>
                )}
                
                {rider.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    {rider.location}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-400">
                  Member since {new Date(rider.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No riders found</div>
          <p className="text-gray-400">Be the first to join our community!</p>
        </div>
      )}
    </div>
  );
}
