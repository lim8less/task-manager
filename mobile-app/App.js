import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import notificationService from './src/services/notificationService';
import * as Notifications from 'expo-notifications';

export default function App() {
  useEffect(() => {
    // Initialize notification permissions when app starts
    const initNotifications = async () => {
      try {
        await notificationService.requestPermissions();
        await notificationService.restorePendingNotifications();
      } catch (error) {
        // Notification initialization failed
      }
    };

    // Set up background notification handler
    const backgroundNotificationHandler = (notification) => {
      // Handle background notifications here if needed
    };

    // Add background notification listener
    const backgroundSubscription = Notifications.addNotificationReceivedListener(backgroundNotificationHandler);

    initNotifications();

    // Cleanup subscription on unmount
    return () => {
      if (backgroundSubscription) {
        backgroundSubscription.remove();
      }
    };
  }, []);

  return (
    <AuthProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
