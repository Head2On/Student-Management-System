import api from '@/lib/api';

// 1. Define the User object that matches your backend
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
}

export interface LoginCredentials {
  username: string;
  password: string;
  role : string;
}

// 2. Update AuthResponse to match the backend (from users/views.py)
export interface AuthResponse {
  access: string;
  refresh: string;
  user: User; // <-- It's a nested object that includes the 'id'
}

export const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    console.log('Sending credentials:', credentials);
    
    // 3. Make the API call
    const response = await api.post<AuthResponse>('/api/users/login/', credentials);
    
    // 4. REMOVE all localStorage logic from here.
    // The component (Login.tsx) should handle this.
    
    // 5. Return the full response data
    return response.data;

  } catch (error) {
    console.error('Login failed:', error);
    // Re-throw the error so the component can catch it
    throw error;
  }
};

export const logoutUser = () => {
  // Make sure to remove both items on logout
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};