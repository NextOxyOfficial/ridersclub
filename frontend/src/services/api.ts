import api from '@/lib/api';
import { Rider, RideEvent, Post } from '@/types';

// Riders API
export const ridersApi = {
  getAll: () => api.get<Rider[]>('/api/riders/'),
  getById: (id: number) => api.get<Rider>(`/api/riders/${id}/`),
  create: (data: Partial<Rider>) => api.post<Rider>('/api/riders/', data),
  update: (id: number, data: Partial<Rider>) => api.patch<Rider>(`/api/riders/${id}/`, data),
  delete: (id: number) => api.delete(`/api/riders/${id}/`),
};

// Events API
export const eventsApi = {
  getAll: () => api.get<RideEvent[]>('/api/events/'),
  getById: (id: number) => api.get<RideEvent>(`/api/events/${id}/`),
  create: (data: Partial<RideEvent>) => api.post<RideEvent>('/api/events/', data),
  update: (id: number, data: Partial<RideEvent>) => api.patch<RideEvent>(`/api/events/${id}/`, data),
  delete: (id: number) => api.delete(`/api/events/${id}/`),
  join: (id: number) => api.post(`/api/events/${id}/join/`),
  leave: (id: number) => api.post(`/api/events/${id}/leave/`),
};

// Posts API
export const postsApi = {
  getAll: () => api.get<Post[]>('/api/posts/'),
  getById: (id: number) => api.get<Post>(`/api/posts/${id}/`),
  create: (data: Partial<Post>) => api.post<Post>('/api/posts/', data),
  update: (id: number, data: Partial<Post>) => api.patch<Post>(`/api/posts/${id}/`, data),
  delete: (id: number) => api.delete(`/api/posts/${id}/`),
  like: (id: number) => api.post(`/api/posts/${id}/like/`),
};
