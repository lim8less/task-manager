// mobile-app/src/services/notificationService.js - Enhanced version
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
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
        });
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  async scheduleTaskReminder(taskId, taskTitle, reminderTime, dueDate) {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      // Cancel any existing notification for this task
      await this.cancelTaskReminder(taskId);

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Task Reminder',
          body: `Don't forget: ${taskTitle}`,
          data: { taskId, taskTitle, dueDate },
        },
        trigger: {
          date: reminderTime,
        },
      });

      return identifier;
    } catch (error) {
      console.error('Error scheduling task reminder:', error);
      return null;
    }
  }

  async scheduleDueDateReminder(taskId, taskTitle, dueDate) {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return null;

      // Schedule reminder 1 hour before due date
      const reminderTime = new Date(dueDate);
      reminderTime.setHours(reminderTime.getHours() - 1);

      if (reminderTime > new Date()) {
        const identifier = await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Task Due Soon',
            body: `${taskTitle} is due in 1 hour`,
            data: { taskId, taskTitle, dueDate },
          },
          trigger: {
            date: reminderTime,
          },
        });

        return identifier;
      }
    } catch (error) {
      console.error('Error scheduling due date reminder:', error);
      return null;
    }
  }

  async sendTaskCompletedNotification(taskTitle) {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) return;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Task Completed! 🎉',
          body: `Great job! You completed: ${taskTitle}`,
          data: { taskTitle },
        },
        trigger: null, // Send immediately
      });
    } catch (error) {
      console.error('Error sending completion notification:', error);
    }
  }

  async cancelTaskReminder(taskId) {
    try {
      // Get all scheduled notifications
      const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      
      // Find and cancel notifications for this task
      for (const notification of scheduledNotifications) {
        if (notification.content.data?.taskId === taskId) {
          await Notifications.cancelScheduledNotificationAsync(notification.identifier);
        }
      }
    } catch (error) {
      console.error('Error canceling task reminder:', error);
    }
  }

  async cancelNotification(identifier) {
    try {
      if (identifier) {
        await Notifications.cancelScheduledNotificationAsync(identifier);
      }
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  }

  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error canceling all notifications:', error);
    }
  }
}

export default new NotificationService();