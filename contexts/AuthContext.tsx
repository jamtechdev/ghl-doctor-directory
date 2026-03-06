'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'doctor';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      fetchUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Intercept fetch to handle 401 errors globally
  useEffect(() => {
    if (!token) return; // Only intercept if we have a token
    
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      
      // Clone response to avoid "body already read" errors
      const clonedResponse = response.clone();
      
      // If we get a 401 Unauthorized and we're not already logging out
      if (response.status === 401 && !isLoggingOut && token) {
        // Auto logout on 401 errors (except during logout/login/auth endpoints)
        const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request)?.url || '';
        const isAuthEndpoint = url.includes('/api/auth/') || url.includes('/auth/login') || url.includes('/auth/register');
        
        if (!isAuthEndpoint) {
          handleAutoLogout();
        }
      }
      
      return clonedResponse;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [isLoggingOut, token]);

  const handleAutoLogout = () => {
    if (isLoggingOut) return; // Prevent multiple logout calls
    setIsLoggingOut(true);
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    router.push('/auth/login');
    setTimeout(() => setIsLoggingOut(false), 1000);
  };

  const fetchUser = async (authToken: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        // Only auto-logout on 401, not on other errors
        if (response.status === 401) {
          handleAutoLogout();
        } else {
          localStorage.removeItem('token');
          setToken(null);
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      router.push('/dashboard');
    } catch (error: any) {
      throw error;
    }
  };

  const logout = () => {
    // Prevent logout from triggering auto-logout
    setIsLoggingOut(true);
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    router.push('/');
    setTimeout(() => setIsLoggingOut(false), 1000);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
