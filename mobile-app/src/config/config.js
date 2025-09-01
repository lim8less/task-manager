import Constants from 'expo-constants';

// Get API URL from Expo config extras (injected via app.config.js and .env)
export const getApiUrl = () => {
  const url = Constants.expoConfig?.extra?.apiUrl || Constants.manifest?.extra?.apiUrl;
  if (!url) {
    console.warn('API URL is not configured. Set API_URL in .env and wire via app.config.js');
  }
  return url;
};

// App Configuration
export const APP_CONFIG = {
  // JWT token expiry (should match backend)
  TOKEN_EXPIRY_DAYS: 7,
  
  // API timeout (in milliseconds)
  API_TIMEOUT: 10000,
  
  // Pagination
  TASKS_PER_PAGE: 20,
  
  // Validation
  MIN_PASSWORD_LENGTH: 6,
  MAX_TASK_TITLE_LENGTH: 100,
  MAX_TASK_DESCRIPTION_LENGTH: 500,
};
