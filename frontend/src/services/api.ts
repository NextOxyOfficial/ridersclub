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

export const apiService = {
  // Fetch zones
  async fetchZones(): Promise<Zone[]> {
    const response = await fetch(`${API_BASE_URL}/zones/`);
    if (!response.ok) {
      throw new Error('Failed to fetch zones');
    }
    return response.json();
  },

  // Submit membership application
  async submitMembershipApplication(data: MembershipApplicationData): Promise<any> {
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
    
    // Add file fields
    if (data.profilePhoto) {
      formData.append('profile_photo', data.profilePhoto);
    }
    if (data.idDocumentPhoto) {
      formData.append('id_document_photo', data.idDocumentPhoto);
    }
    if (data.holdingIdPhoto) {
      formData.append('holding_id_photo', data.holdingIdPhoto);
    }

    const response = await fetch(`${API_BASE_URL}/membership-applications/`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to submit application');
    }

    return response.json();
  },
};
