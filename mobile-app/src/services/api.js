import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl, APP_CONFIG } from '../config/config';

const BASE_URL = getApiUrl();

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add JWT token
    this.api.interceptors.request.use(
      async (config) => {
        try {
          const token = await AsyncStorage.getItem('token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        } catch (error) {
          console.error('Error getting token from storage:', error);
          return config;
        }
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid - clear storage
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication APIs
  async register(userData) {
    console.log('🚀 Attempting registration with URL:', this.api.defaults.baseURL);
    console.log('📤 Registration data:', userData);
    try {
      const response = await this.api.post('/auth/register', userData);
      console.log('✅ Registration successful:', response.data);
      return response.data;
    } catch (error) {
      console.log('❌ Registration failed:', error.message);
      console.log('🔍 Error details:', error.response?.data || error);
      throw error;
    }
  }

  async login(credentials) {
    const response = await this.api.post('/auth/login', credentials);
    return response.data;
  }

  // Task APIs
  async getTasks() {
    const response = await this.api.get('/tasks');
    return response.data;
  }

  async createTask(taskData) {
    console.log('�� Creating task with data:', taskData);
    try {
      const response = await this.api.post('/tasks', taskData);
      console.log('✅ Task created successfully:', response.data);
      
      // Schedule reminder if reminder time is set
      if (taskData.reminderTime) {
        const notificationService = require('./notificationService').default;
        await notificationService.scheduleTaskReminder(
          response.data.task._id,
          taskData.title,
          new Date(taskData.reminderTime),
          taskData.dueDate ? new Date(taskData.dueDate) : null
        );
      }
      
      return response.data;
    } catch (error) {
      console.log('❌ Task creation failed:', error.message);
      console.log('🔍 Error details:', error.response?.data || error);
      throw error;
    }
  }
  
  async updateTask(taskId, updateData) {
    const response = await this.api.put(`/tasks/${taskId}`, updateData);
    
    // Update reminders if due date or reminder time changed
    if (updateData.reminderTime || updateData.dueDate) {
      const notificationService = require('./notificationService').default;
      await notificationService.cancelTaskReminder(taskId);
      
      if (updateData.reminderTime) {
        await notificationService.scheduleTaskReminder(
          taskId,
          updateData.title,
          new Date(updateData.reminderTime),
          updateData.dueDate ? new Date(updateData.dueDate) : null
        );
      }
    }
    
    return response.data;
  }
  
  async deleteTask(taskId) {
    const response = await this.api.delete(`/tasks/${taskId}`);
    
    // Cancel any scheduled reminders for this task
    const notificationService = require('./notificationService').default;
    await notificationService.cancelTaskReminder(taskId);
    
    return response.data;
  }

  // Utility methods
  async storeAuthData(token, user) {
    try {
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
      console.error('Error storing auth data:', error);
    }
  }

  async getStoredAuthData() {
    try {
      const token = await AsyncStorage.getItem('token');
      const userStr = await AsyncStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      return { token, user };
    } catch (error) {
      console.error('Error getting stored auth data:', error);
      return { token: null, user: null };
    }
  }

  async clearAuthData() {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }
}

export default new ApiService();
