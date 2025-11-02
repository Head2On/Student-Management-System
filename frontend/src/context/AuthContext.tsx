"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

// Define the shape of the user object
interface User {
  id: number; // <-- ADD THIS LINE
  username: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  // ... any other user fields
}

// Define the context shape
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      // If we have a token and user, parse the user and set state
      // This assumes 'id' is now part of the storedUser JSON
      setUser(JSON.parse(storedUser));
    } else {
      // If either is missing, and we're not on the login page, redirect
      if (pathname !== '/login') {
        router.push('/login');
      }
    }
    // Finished checking, set loading to false
    setIsLoading(false);
  }, [pathname, router]);

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to easily access the context
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}