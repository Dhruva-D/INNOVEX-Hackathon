import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Interface for the donation form data
export interface DonationFormData {
  foodName: string;
  quantityInPlates: number;
  location: string;
  expiryDate: string;

  foodImage?: File;
}

// Interface for the donation response from the API
export interface DonationResponse {
  _id: string;
  foodName: string;
  quantityInPlates: number;
  location: string;
  expiryDate: string;
  status: string;
  imageUrl?: string;
  timestamp: string;
}

// Submit a new food donation
export const submitDonation = async (donationData: DonationFormData): Promise<DonationResponse> => {
  try {
    // Create a FormData object to handle file upload
    const formData = new FormData();
    formData.append('foodName', donationData.foodName);
    formData.append('quantityInPlates', donationData.quantityInPlates.toString());
    formData.append('location', donationData.location);
    formData.append('expiryDate', donationData.expiryDate);

    
    if (donationData.foodImage) {
      formData.append('foodImage', donationData.foodImage);
    }

    // Using the test endpoint that doesn't require authentication
    const response = await axios.post(`${API_URL}/test/donation`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error submitting donation:', error);
    throw error;
  }
};

// Get all donations for the current donor
export const getDonorDonations = async (): Promise<DonationResponse[]> => {
  try {
    // Using the test endpoint that doesn't require authentication
    const response = await axios.get(`${API_URL}/test/donations`, {
      withCredentials: false,
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching donations:', error);
    throw error;
  }
};
