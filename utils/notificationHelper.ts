
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestNotificationPermissions() {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push notification permissions');
      return false;
    }

    // Set up notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('salon-notifications', {
        name: 'Salon Notifications',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF69B4',
        sound: 'default',
      });
    }

    return true;
  } catch (error) {
    console.log('Error requesting notification permissions:', error);
    return false;
  }
}

export async function scheduleQueueNotification(queueNumber: number, estimatedWaitTime: number) {
  try {
    // Schedule notification for when it's almost their turn (5 minutes before)
    const notificationTime = Math.max(estimatedWaitTime - 5, 1);
    
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Almost Your Turn! 💇',
        body: `Queue #${queueNumber} - You're next in line! Please head to the salon.`,
        data: { queueNumber },
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: notificationTime * 60,
        channelId: Platform.OS === 'android' ? 'salon-notifications' : undefined,
      },
    });

    console.log(`Notification scheduled for queue #${queueNumber} in ${notificationTime} minutes`);
  } catch (error) {
    console.log('Error scheduling notification:', error);
  }
}

export async function sendImmediateNotification(queueNumber: number) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'It\'s Your Turn! 🎉',
        body: `Queue #${queueNumber} - Please proceed to the salon now!`,
        data: { queueNumber },
        sound: 'default',
      },
      trigger: null,
    });

    console.log(`Immediate notification sent for queue #${queueNumber}`);
  } catch (error) {
    console.log('Error sending immediate notification:', error);
  }
}

export async function cancelAllNotifications() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cancelled');
  } catch (error) {
    console.log('Error cancelling notifications:', error);
  }
}
