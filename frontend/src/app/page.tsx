'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarIcon, UserGroupIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { RideEvent, Post } from '@/types';
import { eventsApi, postsApi } from '@/services/api';

export default function Home() {
  const [events, setEvents] = useState<RideEvent[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsResponse, postsResponse] = await Promise.all([
          eventsApi.getAll(),
          postsApi.getAll(),
        ]);
        setEvents(eventsResponse.data.slice(0, 3)); // Show latest 3 events
        setPosts(postsResponse.data.slice(0, 3)); // Show latest 3 posts
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg px-8 py-12 mb-12">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to Riders Club</h1>
          <p className="text-xl mb-8 text-blue-100">
            Connect with fellow motorcycle enthusiasts, join exciting rides, and share your passion
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/events"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Events
            </Link>
            <Link
              href="/posts"
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View Posts
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <CalendarIcon className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Ride Events</h3>
          <p className="text-gray-600">
            Discover and join exciting motorcycle events in your area
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <UserGroupIcon className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Community</h3>
          <p className="text-gray-600">
            Connect with riders who share your passion for motorcycles
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <DocumentTextIcon className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Share Stories</h3>
          <p className="text-gray-600">
            Share your riding experiences and tips with the community
          </p>
        </div>
      </div>

      {/* Recent Events */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
          <Link
            href="/events"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View all →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-3">{event.description.substring(0, 100)}...</p>
                <div className="text-sm text-gray-500">
                  <p>📍 {event.location}</p>
                  <p>📅 {new Date(event.date).toLocaleDateString()}</p>
                  <p>👥 {event.participant_count}/{event.max_participants} participants</p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-500">
              No events available. Check back later!
            </div>
          )}
        </div>
      </section>

      {/* Recent Posts */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Recent Posts</h2>
          <Link
            href="/posts"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View all →
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-3">{post.content.substring(0, 100)}...</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>By {post.author.user.username}</span>
                  <span>❤️ {post.likes_count}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-500">
              No posts available. Be the first to share something!
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
