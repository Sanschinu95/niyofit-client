const API_BASE_URL = 'http://localhost:4170/api/v1';

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Add gym search functions
export const searchGyms = async (params: { 
  near?: string,
  radius?: number,
  page?: number,
  limit?: number
}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/gyms?${new URLSearchParams(params as any)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching gyms:', error);
    throw error;
  }
};

export const searchGymsByLocation = async (latitude: number, longitude: number, radius: number = 10) => {
  try {
    const params = new URLSearchParams({
      near: `${latitude},${longitude}`,
      radius: radius.toString(),
      page: '1',
      limit: '20'
    });
    const response = await fetch(`${API_BASE_URL}/locations?${params}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching gyms by location:', error);
    throw error;
  }
};

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  userType: 'member' | 'admin' | 'superadmin';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  _id: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    pinCode: string;
    country: string;
  };
  coordinates: {
    type: string;
    coordinates: [number, number];
  };
}

export interface Gym {
  _id: string;
  name: string;
  description?: string;
  locationId: string;
  location?: Location;
  facilities?: string[];
  openingHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  rating?: number;
  priceRange?: 'budget' | 'mid-range' | 'premium';
  isActive: boolean;
  pictures?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionListing {
  _id: string;
  name: string;
  description?: string;
  type: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'custom';
  durationInDays: number;
  gymId: string;
  cost: number;
  currency: string;
  discount?: {
    amount: number;
    type: 'percentage' | 'fixed';
    validUntil: string;
  };
  isActive: boolean;
  features?: string[];
}

export interface GymReview {
  _id: string;
  gymId: string;
  userId: string;
  rating: number;
  comment?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = typeof window !== 'undefined' ? localStorage.getItem('niyofit_auth_token') : null;
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  // Auth endpoints
  async registerUser(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    userType?: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await fetch(`${this.baseURL}/auth/register-user`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        ...userData,
        userType: userData.userType || 'customer'
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async loginUser(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await fetch(`${this.baseURL}/auth/login-user`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async logoutUser(): Promise<void> {
    await fetch(`${this.baseURL}/auth/logout`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
  }

  async verifyToken(): Promise<ApiResponse<{ user: User }>> {
    const response = await fetch(`${this.baseURL}/auth/verify-token`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return response.json();
  }

  // Gym endpoints
  async getGyms(params?: {
    page?: number;
    limit?: number;
    sort?: string;
  }): Promise<ApiResponse<{ gyms: Gym[]; total: number; page: number; pages: number }>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.sort) queryParams.append('sort', params.sort);

    const response = await fetch(`${this.baseURL}/gyms?${queryParams}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return response.json();
  }

  async createGym(gymData: {
    name: string;
    description?: string;
    locationId: string;
    facilities?: string[];
    similarGyms?: string[];
    openingHours?: any;
    contact?: {
      phone?: string;
      email?: string;
      website?: string;
    };
    rating?: number;
    priceRange?: string;
    isActive?: boolean;
  }): Promise<ApiResponse<Gym>> {
    const response = await fetch(`${this.baseURL}/gyms`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(gymData),
    });

    return response.json();
  }

  async updateGym(id: string, gymData: {
    name?: string;
    description?: string;
    openingHours?: any;
    contact?: any;
    priceRange?: string;
    isActive?: boolean;
  }): Promise<ApiResponse<Gym>> {
    const response = await fetch(`${this.baseURL}/gyms/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(gymData),
    });

    return response.json();
  }

  async deleteGym(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await fetch(`${this.baseURL}/gyms/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return response.json();
  }

  async getGymById(id: string): Promise<ApiResponse<Gym>> {
    const response = await fetch(`${this.baseURL}/gyms/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return response.json();
  }

  async getGymSubscriptionListings(gymId: string): Promise<ApiResponse<SubscriptionListing[]>> {
    const response = await fetch(`${this.baseURL}/gyms/${gymId}/subscription-listings`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return response.json();
  }

  // Location endpoints
  async getLocations(params?: {
    page?: number;
    limit?: number;
    near?: string;
    radius?: number;
  }): Promise<ApiResponse<{ locations: Location[]; total: number; page: number; pages: number }>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.near) queryParams.append('near', params.near);
    if (params?.radius) queryParams.append('radius', params.radius.toString());

    const response = await fetch(`${this.baseURL}/locations?${queryParams}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return response.json();
  }

  async createLocation(locationData: {
    name: string;
    address: {
      street: string;
      city: string;
      state: string;
      pinCode: string;
      country: string;
    };
    latitude: number;
    longitude: number;
  }): Promise<ApiResponse<Location>> {
    const response = await fetch(`${this.baseURL}/locations`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(locationData),
    });

    return response.json();
  }

  async updateLocation(id: string, locationData: {
    name?: string;
    address?: {
      street?: string;
      city?: string;
      state?: string;
      pinCode?: string;
      country?: string;
    };
    latitude?: number;
    longitude?: number;
  }): Promise<ApiResponse<Location>> {
    const response = await fetch(`${this.baseURL}/locations/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(locationData),
    });

    return response.json();
  }

  async deleteLocation(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await fetch(`${this.baseURL}/locations/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    return response.json();
  }

  // Subscription endpoints
  async getSubscriptionListings(params?: {
    gymId?: string;
    type?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<{ subscriptions: SubscriptionListing[]; total: number; page: number; pages: number }>> {
    const queryParams = new URLSearchParams();
    if (params?.gymId) queryParams.append('gymId', params.gymId);
    if (params?.type) queryParams.append('type', params.type);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await fetch(`${this.baseURL}/subscription-listings?${queryParams}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return response.json();
  }

  // Review endpoints
  async getGymReviews(gymId: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<GymReview[]>> {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await fetch(`${this.baseURL}/gym-reviews/gym/${gymId}?${queryParams}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return response.json();
  }

  async createGymReview(reviewData: {
    gymId: string;
    rating: number;
    comment?: string;
  }): Promise<ApiResponse<GymReview>> {
    const response = await fetch(`${this.baseURL}/gym-reviews`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(reviewData),
    });

    return response.json();
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string; uptime: number; environment: string }>> {
    const response = await fetch(`${this.baseURL}/health`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return response.json();
  }
}

export const apiService = new ApiService();
