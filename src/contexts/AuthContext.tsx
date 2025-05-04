import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { AuthContextType, AuthState, User } from '../types';
import { API_URL } from '../config';
import { toast } from 'react-hot-toast';
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
type AuthProviderProps = { children: ReactNode };

function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [auth, setAuth] = useState<AuthState>(initialState);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        setAuth(prev => ({ ...prev, isLoading: true }));
        const response = await axios.get(`${API_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setAuth({
          user: response.data,
          token,
          isLoading: false,
          error: null
        });
      } catch (err) {
        localStorage.removeItem('token');
        setAuth({
          user: null,
          token: null,
          isLoading: false,
          error: 'Session expired. Please login again.'
        });
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setAuth(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      console.log("ressss",response.data.token)
      localStorage.setItem('token', response.data.token);
      
      setAuth({
        user: response.data.user,
        token: response.data.token,
        isLoading: false,
        error: null
      });
      toast.success('Login successful!');

      return true
    } catch (err: any) {
      setAuth(prev => ({
        ...prev,
        isLoading: false,
        error: err.response?.data?.message || 'Login failed. Please try again.'
      }));
      toast.error('Login failed. Please try again');

      return false
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setAuth(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password
      });
      
      localStorage.setItem('token', response.data.token);
      toast.success('Registration successful! Welcome!');

      
      setAuth({
        user: response.data.user,
        token: response.data.token,
        isLoading: false,
        error: null
      });

    } catch (err: any) {
      setAuth(prev => ({
        ...prev,
        isLoading: false,
        error: err.response?.data?.message || 'Registration failed. Please try again.'
      }));
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuth({
      user: null,
      token: null,
      isLoading: false,
      error: null
    });
    toast.success('Logged out successfully.');
  };

  const clearError = () => {
    setAuth(prev => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider value={{ auth, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export { AuthProvider };
