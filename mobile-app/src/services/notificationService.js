// mobile-app/src/services/notificationService.js - Production Ready
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    // If trigger is null, it's an immediate notification - show it
    if (notification.request.trigger === null) {
      return {
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      };
    }
    
    // For scheduled notifications, check if it's time to show them
    const scheduledFor = notification.request.content.data?.scheduledFor;
    if (scheduledFor) {
      const scheduledTime = new Date(scheduledFor);
      const now = new Date();
      const timeDiff = scheduledTime - now;
      
      // If it's a fallback notification, show it immediately
      if (notification.request.content.data?.fallback) {
        return {
          shouldShowBanner: true,
          shouldShowList: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
        };
      }
      
      // Only show if the scheduled time has passed (with 30 second tolerance)
      if (timeDiff > 30) {
        return {
          shouldShowBanner: false,
          shouldShowList: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        };
      }
    }
    
    // For all other notifications, show them (including background notifications)
    return {
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    };
  },
});

class NotificationService {
  async requestPermissions() {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          enableVibrate: true,
          enableLights: true,
          showBadge: false,
        });
        
        // Create a specific channel for scheduled notifications
        await Notifications.setNotificationChannelAsync('scheduled', {
          name: 'Scheduled Reminders',
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
          enableVibrate: true,
          enableLights: true,
          showBadge: false,
          lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
          bypassDnd: true,
        });
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async scheduleTaskReminder(taskId, taskTitle, reminderTime, dueDate) {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return null;
      }

      // Cancel any existing notification for this task
      await this.cancelTaskReminder(taskId);

      // Calculate the notification time
      const now = new Date();
      let notificationTime;
      
      if (dueDate && reminderTime) {
        // Combine due date with reminder time
        const dueDateObj = new Date(dueDate);
        const reminderTimeObj = new Date(reminderTime);
        
        notificationTime = new Date(dueDateObj);
        notificationTime.setHours(reminderTimeObj.getHours(), reminderTimeObj.getMinutes(), 0, 0);
      } else {
        // Fallback to just using reminder time
        notificationTime = new Date(reminderTime);
      }

      // Only schedule if the notification time is in the future
      if (notificationTime > now) {
        // Store notification data for persistence
        await this.storeNotificationData(taskId, taskTitle, dueDate, notificationTime);
        
        // Try Expo scheduling first (works better in production)
        let expoIdentifier = null;
        try {
          expoIdentifier = await Notifications.scheduleNotificationAsync({
            content: {
              title: 'Task Reminder',
              body: `Don't forget: ${taskTitle}`,
              data: { taskId, taskTitle, dueDate, scheduledFor: notificationTime.toISOString() },
              sound: true,
              priority: 'high',
            },
            trigger: {
              date: notificationTime,
            },
            android: {
              channelId: 'scheduled',
              priority: 'high',
              sound: true,
              vibrate: [0, 250, 250, 250],
              icon: './assets/icon.png',
              color: '#007AFF',
            },
          });
        } catch (error) {
          // Expo scheduling failed, will use fallback
        }
        
        // Always set up a fallback timer for reliability
        const timeUntilNotification = notificationTime.getTime() - now.getTime();
        
        if (timeUntilNotification > 0) {
          setTimeout(async () => {
            try {
              await Notifications.scheduleNotificationAsync({
                content: {
                  title: 'Task Reminder',
                  body: `Don't forget: ${taskTitle}`,
                  data: { taskId, taskTitle, dueDate, scheduledFor: notificationTime.toISOString(), fallback: true },
                  sound: true,
                  priority: 'high',
                },
                trigger: null, // Immediate
                android: {
                  channelId: 'scheduled',
                  priority: 'high',
                  sound: true,
                  vibrate: [0, 250, 250, 250],
                  icon: './assets/icon.png',
                  color: '#007AFF',
                },
              });
              
              // Remove from stored notifications
              const pendingNotifications = await AsyncStorage.getItem('pendingNotifications') || '[]';
              const notifications = JSON.parse(pendingNotifications);
              const updatedNotifications = notifications.filter(n => n.taskId !== taskId);
              await AsyncStorage.setItem('pendingNotifications', JSON.stringify(updatedNotifications));
            } catch (error) {
              // Fallback notification failed
            }
          }, timeUntilNotification);
        }
        
        return expoIdentifier || `fallback_${taskId}`;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async storeNotificationData(taskId, taskTitle, dueDate, notificationTime) {
    try {
      const pendingNotifications = await AsyncStorage.getItem('pendingNotifications') || '[]';
      const notifications = JSON.parse(pendingNotifications);
      
      // Remove any existing notification for this task
      const filteredNotifications = notifications.filter(n => n.taskId !== taskId);
      
      // Add the new notification
      filteredNotifications.push({
        taskId,
        taskTitle,
        dueDate,
        scheduledFor: notificationTime.toISOString(),
        createdAt: new Date().toISOString()
      });
      
      await AsyncStorage.setItem('pendingNotifications', JSON.stringify(filteredNotifications));
    } catch (error) {
      // Storage failed, continue without persistence
    }
  }

  async cancelTaskReminder(taskId) {
    try {
      // Cancel Expo notification
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      const notificationToCancel = scheduledNotifications.find(
        notification => notification.content.data?.taskId === taskId
      );
      
      if (notificationToCancel) {
        await Notifications.cancelScheduledNotificationAsync(notificationToCancel.identifier);
      }
      
      // Remove from stored notifications
      const pendingNotifications = await AsyncStorage.getItem('pendingNotifications') || '[]';
      const notifications = JSON.parse(pendingNotifications);
      const updatedNotifications = notifications.filter(n => n.taskId !== taskId);
      await AsyncStorage.setItem('pendingNotifications', JSON.stringify(updatedNotifications));
    } catch (error) {
      // Cancellation failed
    }
  }

  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      await AsyncStorage.removeItem('pendingNotifications');
    } catch (error) {
      // Cancellation failed
    }
  }

  async testNotification() {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return false;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Test Notification',
          body: 'This is a test notification',
          data: { test: true },
        },
        trigger: null, // Immediate
      });
      
      return true;
    } catch (error) {
      return false;
    }
  }

  async testScheduledNotification(minutes = 2) {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        return false;
      }

      const scheduledTime = new Date();
      scheduledTime.setMinutes(scheduledTime.getMinutes() + minutes);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Test Scheduled Notification',
          body: `This notification was scheduled for ${minutes} minutes from now`,
          data: { test: true, scheduledFor: scheduledTime.toISOString() },
        },
        trigger: {
          date: scheduledTime,
        },
      });
      
      return true;
    } catch (error) {
      return false;
    }
  }

  async listScheduledNotifications() {
    try {
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      return scheduledNotifications;
    } catch (error) {
      return [];
    }
  }

  async restorePendingNotifications() {
    try {
      const pendingNotifications = await AsyncStorage.getItem('pendingNotifications') || '[]';
      const notifications = JSON.parse(pendingNotifications);
      
      const now = new Date();
      const validNotifications = [];
      
      for (const notification of notifications) {
        const scheduledTime = new Date(notification.scheduledFor);
        
        // Only restore notifications that are still in the future
        if (scheduledTime > now) {
          validNotifications.push(notification);
          
          // Reschedule the notification
          await this.scheduleTaskReminder(
            notification.taskId,
            notification.taskTitle,
            notification.scheduledFor, // Use scheduledFor as reminderTime
            notification.dueDate
          );
        }
      }
      
      // Update stored notifications with only valid ones
      await AsyncStorage.setItem('pendingNotifications', JSON.stringify(validNotifications));
    } catch (error) {
      // Restoration failed
    }
  }
}

export default new NotificationService();