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
    try {
      const response = await this.api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
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
    try {
      const response = await this.api.post('/tasks', taskData);
      
      // Schedule reminder if reminder time is set
      if (taskData.reminderTime) {
        const notificationService = require('./notificationService').default;
        await notificationService.scheduleTaskReminder(
          response.data.task._id,
          taskData.title,
          taskData.reminderTime,
          taskData.dueDate
        );
      }
      
      return response.data;
    } catch (error) {
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
          updateData.reminderTime,
          updateData.dueDate
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
      // Storage failed
    }
  }

  async getStoredAuthData() {
    try {
      const token = await AsyncStorage.getItem('token');
      const userStr = await AsyncStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      return { token, user };
    } catch (error) {
      return { token: null, user: null };
    }
  }

  async clearAuthData() {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    } catch (error) {
      // Clear failed
    }
  }
}

export default new ApiService();
