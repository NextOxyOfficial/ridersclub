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
    email: string;
  };
}

export interface UserProfile {
  id: number;
  phone: string;
  full_name: string;
  email: string;
  membership_status: string;
  zone: {
    id: number;
    name: string;
  };
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
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

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },
};
