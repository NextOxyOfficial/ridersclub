export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Rider {
  id: number;
  user: User;
  bio: string;
  location: string;
  bike_model: string;
  profile_image?: string;
  created_at: string;
  updated_at: string;
}

export interface RideEvent {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  organizer: Rider;
  participants: Rider[];
  participant_count: number;
  max_participants: number;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: number;
  author: Rider;
  title: string;
  content: string;
  image?: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
}
