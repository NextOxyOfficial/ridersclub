'use client';

import { useEffect, useState } from 'react';
import { RideEvent } from '@/types';
import { eventsApi } from '@/services/api';
import { CalendarIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function EventsPage() {
  const [events, setEvents] = useState<RideEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventsApi.getAll();
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Ride Events</h1>
        <p className="text-gray-600">
          Discover and join exciting motorcycle events in your area
        </p>
      </div>

      {events.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-3">{event.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{event.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {new Date(event.date).toLocaleString()}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPinIcon className="h-4 w-4 mr-2" />
                  {event.location}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <UserGroupIcon className="h-4 w-4 mr-2" />
                  {event.participant_count}/{event.max_participants} participants
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Organized by {event.organizer.user.username}
                </div>
                <button 
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  disabled={event.participant_count >= event.max_participants}
                >
                  {event.participant_count >= event.max_participants ? 'Full' : 'Join Event'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No events available at the moment</div>
          <p className="text-gray-400">Check back later for new events!</p>
        </div>
      )}
    </div>
  );
}
