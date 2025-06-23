'use client';

import { useEffect, useState } from 'react';
import { Post } from '@/types';
import { postsApi } from '@/services/api';
import { HeartIcon, UserIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await postsApi.getAll();
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLike = async (postId: number) => {
    try {
      await postsApi.like(postId);
      // Refresh posts to get updated like count
      const response = await postsApi.getAll();
      setPosts(response.data);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Posts</h1>
        <p className="text-gray-600">
          Share your riding experiences and connect with fellow riders
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                  {post.author.profile_image ? (
                    <img 
                      src={post.author.profile_image} 
                      alt={post.author.user.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-6 w-6 text-gray-500" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-900">{post.author.user.username}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-3">{post.title}</h2>
              <div className="prose max-w-none mb-4">
                <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
              </div>

              {post.image && (
                <div className="mb-4">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="rounded-lg max-w-full h-auto"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
                >
                  <HeartIcon className="h-5 w-5" />
                  <span>{post.likes_count}</span>
                </button>
                
                <div className="text-sm text-gray-500">
                  {post.author.bike_model && `Rides: ${post.author.bike_model}`}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No posts available</div>
          <p className="text-gray-400">Be the first to share something with the community!</p>
        </div>
      )}
    </div>
  );
}
