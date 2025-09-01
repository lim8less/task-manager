import React, { createContext, useContext, useReducer, useEffect } from 'react';
import ApiService from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for stored auth data on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { token, user } = await ApiService.getStoredAuthData();
      if (token && user) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user } });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await ApiService.login(credentials);
      
      if (response.success) {
        await ApiService.storeAuthData(response.token, response.user);
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: response.user } });
        return { success: true };
      } else {
        dispatch({ type: 'AUTH_ERROR' });
        return { success: false, message: response.message };
      }
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR' });
      const message = error.response?.data?.message || 'Login failed';
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await ApiService.register(userData);
      
      if (response.success) {
        await ApiService.storeAuthData(response.token, response.user);
        dispatch({ type: 'LOGIN_SUCCESS', payload: { user: response.user } });
        return { success: true };
      } else {
        dispatch({ type: 'AUTH_ERROR' });
        return { success: false, message: response.message };
      }
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR' });
      const message = error.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await ApiService.clearAuthData();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const value = {
    ...state,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
