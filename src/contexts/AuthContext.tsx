import React, { createContext, useContext, useState, useEffect } from 'react';
import { registerUser, loginUser } from '../services/auth';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          setState({
            user,
            isLoading: false,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          setState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } else {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data = await loginUser({ email, password });
      
      if (data.token && data.user) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setState({
          user: data.user,
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        throw new Error('Login failed: Invalid response from server');
      }
    } catch (error) {
      console.error(error);
      throw new Error('Login failed');
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      await registerUser({ name, email, password });
      // For simplicity, we'll just alert the user
      alert('Registration successful! Please log in.');
    } catch (error) {
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};