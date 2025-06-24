const API_BASE_URL = 'http://localhost:8000/api';

export interface Zone {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
}

export interface MembershipApplicationData {
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

export interface LoginCredentials {
  phone: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    phone: string;
    full_name: string;
  };
}

export interface UserProfile {
  id: number;
  phone: string;
  full_name: string;
  membership_status: string;
  zone: {
    id: number;
    name: string;
  } | null;
  blood_group: string | null;
  bike_model?: string; // Optional field, only present if user has motorcycle data
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
}

export interface BenefitCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  is_active: boolean;
  order: number;
  benefits_count: number;
  created_at: string;
  updated_at: string;
}

export interface Benefit {
  id: number;
  title: string;
  description: string;
  category: number;
  category_name: string;
  category_icon: string;
  category_color: string;
  image?: string;
  membership_level: string;
  partner_name: string;
  partner_logo?: string;
  discount_percentage?: number;
  discount_amount?: number;
  contact_info: string;
  location: string;
  website_url?: string;
  terms_conditions: string;
  valid_from?: string;
  valid_until?: string;
  usage_limit?: number;
  available_zones_list: Zone[];
  is_active: boolean;
  is_featured: boolean;
  order: number;
  usage_count: number;
  is_available_in_zone: boolean;
  created_at: string;
  updated_at: string;
}

export interface BenefitUsage {
  id: number;
  rider: number;
  rider_name: string;
  benefit: number;
  benefit_title: string;
  partner_name: string;
  used_at: string;
  notes: string;
}

export interface BenefitsByCategory {
  category: BenefitCategory;
  benefits: Benefit[];
}

export interface EventPhoto {
  type: 'url' | 'upload';
  url: string;
  caption: string;
  uploaded_at: string | null;
  uploaded_by?: string | null;
}

export interface RideEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  duration: string;
  requirements: string;
  max_participants: number;
  organizer_name: string;
  status: string;
  photos: string[];
  all_photos: EventPhoto[];
  current_joined: number;
  is_upcoming: boolean;
  is_past: boolean;
  can_join: boolean;
  user_registered: boolean;
  created_at: string;
  updated_at: string;
}

export const apiService = {
  // Fetch zones
  async fetchZones(): Promise<Zone[]> {
    const response = await fetch(`${API_BASE_URL}/zones/`);
    if (!response.ok) {
      throw new Error('Failed to fetch zones');
    }
    return response.json();
  },

  // Submit membership application with user creation
  async submitMembershipApplication(data: MembershipApplicationData & { password: string }): Promise<any> {
    console.log('API Service: Starting form submission...');
    console.log('API Service: Input data:', data);
    
    const formData = new FormData();
    
    // Add text fields
    formData.append('full_name', data.fullName);
    formData.append('email', data.email || '');
    formData.append('phone', data.phone);
    formData.append('alternative_phone', data.alternativePhone || '');
    formData.append('date_of_birth', data.dateOfBirth);
    formData.append('blood_group', data.bloodGroup);
    formData.append('profession', data.profession);
    formData.append('hobbies', data.hobbies || '');
    formData.append('address', data.address);
    formData.append('zone', data.zone);
    formData.append('id_document_type', data.idDocumentType);
    formData.append('id_document_number', data.idDocumentNumber);
    formData.append('emergency_contact', data.emergencyContact);
    formData.append('emergency_phone', data.emergencyPhone);
    formData.append('has_motorbike', data.hasMotorbike.toString());
    formData.append('motorcycle_brand', data.motorcycleBrand || '');
    formData.append('motorcycle_model', data.motorcycleModel || '');
    formData.append('motorcycle_year', data.motorcycleYear || '');
    formData.append('riding_experience', data.ridingExperience);
    formData.append('citizenship_confirm', data.citizenshipConfirm.toString());
    formData.append('agree_terms', data.agreeTerms.toString());
    
    // Add password for user creation
    formData.append('password', data.password);
    
    // Add file fields
    if (data.profilePhoto) {
      formData.append('profile_photo', data.profilePhoto);
      console.log('API Service: Profile photo added:', data.profilePhoto.name);
    }
    if (data.idDocumentPhoto) {
      formData.append('id_document_photo', data.idDocumentPhoto);
      console.log('API Service: ID document photo added:', data.idDocumentPhoto.name);
    }
    if (data.holdingIdPhoto) {
      formData.append('holding_id_photo', data.holdingIdPhoto);
      console.log('API Service: Holding ID photo added:', data.holdingIdPhoto.name);
    }

    console.log('API Service: FormData prepared, making request to:', `${API_BASE_URL}/membership-applications/`);

    try {
      const response = await fetch(`${API_BASE_URL}/membership-applications/`, {
        method: 'POST',
        body: formData,
      });

      console.log('API Service: Response status:', response.status);
      console.log('API Service: Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('API Service: Error response text:', errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          console.log('API Service: Parsed error data:', errorData);
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        } catch (parseError) {
          throw new Error(`HTTP ${response.status}: ${errorText || response.statusText}`);
        }
      }

      const responseData = await response.json();
      console.log('API Service: Success response data:', responseData);
      return responseData;
    } catch (networkError) {
      console.error('API Service: Network error:', networkError);
      const errorMessage = networkError instanceof Error ? networkError.message : 'Unknown error occurred';
      
      if (errorMessage.includes('fetch') || errorMessage.includes('Failed to fetch')) {
        throw new Error('Cannot connect to server. Please make sure the backend is running on http://localhost:8000');
      }
      throw new Error(errorMessage);
    }
  },

  // Authentication methods
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Invalid credentials');
    }

    return response.json();
  },

  async logout(): Promise<void> {
    const token = localStorage.getItem('refresh_token');
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh: token }),
        });
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
  async getCurrentUser(): Promise<UserProfile> {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/auth/user/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return response.json();
  },

  async changePassword(data: ChangePasswordData): Promise<void> {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/auth/change-password/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to change password');
    }
  },

  async updateProfile(data: { zone_id?: string | number; bike_model?: string }): Promise<UserProfile> {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/auth/update-profile/`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to update profile');
    }

    const result = await response.json();
    return result.user;
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },

  // Benefit-related API functions
  async fetchBenefitCategories(): Promise<BenefitCategory[]> {
    const response = await fetch(`${API_BASE_URL}/benefit-categories/`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch benefit categories');
    }
    
    return response.json();
  },

  async fetchBenefits(categoryId?: number, featured?: boolean): Promise<Benefit[]> {
    let url = `${API_BASE_URL}/benefits/`;
    const params = new URLSearchParams();
    
    if (categoryId) {
      params.append('category', categoryId.toString());
    }
    
    if (featured) {
      params.append('featured', 'true');
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch benefits');
    }
    
    return response.json();
  },

  async fetchFeaturedBenefits(): Promise<Benefit[]> {
    const response = await fetch(`${API_BASE_URL}/benefits/featured/`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch featured benefits');
    }
    
    return response.json();
  },

  async fetchBenefitsByCategory(): Promise<BenefitsByCategory[]> {
    const response = await fetch(`${API_BASE_URL}/benefits/by_category/`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch benefits by category');
    }
    
    return response.json();
  },

  async fetchBenefitDetails(benefitId: number): Promise<Benefit> {
    const response = await fetch(`${API_BASE_URL}/benefits/${benefitId}/`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch benefit details');
    }
    
    return response.json();
  },

  async useBenefit(benefitId: number, notes?: string): Promise<{ message: string; usage: BenefitUsage }> {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/benefits/${benefitId}/use_benefit/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ notes: notes || '' }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to use benefit');
    }

    return response.json();
  },

  async fetchMyBenefitUsage(): Promise<BenefitUsage[]> {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/benefit-usage/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch benefit usage');
    }

    return response.json();
  },

  // Event-related methods
  async fetchEvents(): Promise<RideEvent[]> {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/events/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }

    return response.json();
  },

  async fetchUpcomingEvents(): Promise<RideEvent[]> {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/events/upcoming/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch upcoming events');
    }

    return response.json();
  },

  async fetchPastEvents(): Promise<RideEvent[]> {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/events/past/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch past events');
    }

    return response.json();
  },

  async joinEvent(eventId: number): Promise<{ message: string }> {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/join/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.detail || 'Failed to join event');
    }

    return response.json();
  },

  async leaveEvent(eventId: number): Promise<{ message: string }> {
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/leave/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.detail || 'Failed to leave event');
    }

    return response.json();
  },
};
