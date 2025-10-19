
import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Platform,
  Animated,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import { Booking } from "@/types/booking";
import { sendImmediateNotification, cancelAllNotifications } from "@/utils/notificationHelper";

export default function QueueScreen() {
  const [currentQueue, setCurrentQueue] = useState(1);
  const [myQueueNumber, setMyQueueNumber] = useState(5);
  const [estimatedWaitTime, setEstimatedWaitTime] = useState(60);
  const [queueStatus, setQueueStatus] = useState<'waiting' | 'ready' | 'completed'>('waiting');
  const pulseAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    // Simulate queue progression
    const interval = setInterval(() => {
      setCurrentQueue((prev) => {
        const next = prev + 1;
        
        // Check if it's almost the user's turn
        if (next === myQueueNumber - 1) {
          setQueueStatus('ready');
          sendImmediateNotification(myQueueNumber);
        }
        
        // Check if it's the user's turn
        if (next === myQueueNumber) {
          setQueueStatus('ready');
          sendImmediateNotification(myQueueNumber);
        }
        
        return next;
      });

      setEstimatedWaitTime((prev) => Math.max(0, prev - 15));
    }, 10000); // Update every 10 seconds for demo purposes

    return () => clearInterval(interval);
  }, [myQueueNumber]);

  useEffect(() => {
    // Pulse animation for ready status
    if (queueStatus === 'ready') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [queueStatus]);

  const handleCancelBooking = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel your booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            cancelAllNotifications();
            setQueueStatus('completed');
            Alert.alert('Booking Cancelled', 'Your booking has been cancelled.');
          },
        },
      ]
    );
  };

  const peopleAhead = Math.max(0, myQueueNumber - currentQueue);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Queue Status</Text>
          <Text style={styles.headerSubtitle}>Track your position in real-time</Text>
        </View>

        {/* Current Queue Display */}
        <View style={styles.currentQueueCard}>
          <Text style={styles.currentQueueLabel}>Now Serving</Text>
          <Text style={styles.currentQueueNumber}>{currentQueue}</Text>
        </View>

        {/* User Queue Status */}
        <Animated.View 
          style={[
            styles.myQueueCard,
            queueStatus === 'ready' && styles.myQueueCardReady,
            queueStatus === 'ready' && { transform: [{ scale: pulseAnim }] }
          ]}
        >
          <View style={styles.myQueueHeader}>
            <IconSymbol 
              name={queueStatus === 'ready' ? 'bell.badge.fill' : 'person.fill'} 
              size={40} 
              color={queueStatus === 'ready' ? colors.card : colors.primary} 
            />
            <View style={styles.myQueueInfo}>
              <Text style={[
                styles.myQueueLabel,
                queueStatus === 'ready' && styles.myQueueLabelReady
              ]}>
                Your Queue Number
              </Text>
              <Text style={[
                styles.myQueueNumber,
                queueStatus === 'ready' && styles.myQueueNumberReady
              ]}>
                {myQueueNumber}
              </Text>
            </View>
          </View>

          {queueStatus === 'waiting' && (
            <>
              <View style={styles.divider} />
              <View style={styles.waitInfo}>
                <View style={styles.waitInfoItem}>
                  <IconSymbol name="person.2.fill" size={24} color={colors.accent} />
                  <Text style={styles.waitInfoLabel}>People Ahead</Text>
                  <Text style={styles.waitInfoValue}>{peopleAhead}</Text>
                </View>
                <View style={styles.waitInfoItem}>
                  <IconSymbol name="clock.fill" size={24} color={colors.accent} />
                  <Text style={styles.waitInfoLabel}>Est. Wait Time</Text>
                  <Text style={styles.waitInfoValue}>{estimatedWaitTime} min</Text>
                </View>
              </View>
            </>
          )}

          {queueStatus === 'ready' && (
            <>
              <View style={styles.divider} />
              <View style={styles.readyMessage}>
                <IconSymbol name="checkmark.circle.fill" size={48} color={colors.card} />
                <Text style={styles.readyMessageText}>It's Your Turn!</Text>
                <Text style={styles.readyMessageSubtext}>Please proceed to the salon</Text>
              </View>
            </>
          )}
        </Animated.View>

        {/* Progress Bar */}
        {queueStatus === 'waiting' && (
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>Queue Progress</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${Math.min(100, (currentQueue / myQueueNumber) * 100)}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round((currentQueue / myQueueNumber) * 100)}% Complete
            </Text>
          </View>
        )}

        {/* Info Cards */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <IconSymbol name="info.circle.fill" size={24} color={colors.primary} />
            <Text style={styles.infoCardTitle}>Stay Updated</Text>
            <Text style={styles.infoCardText}>
              You'll receive a notification when it's almost your turn
            </Text>
          </View>

          <View style={styles.infoCard}>
            <IconSymbol name="location.fill" size={24} color={colors.primary} />
            <Text style={styles.infoCardTitle}>Salon Location</Text>
            <Text style={styles.infoCardText}>
              123 Beauty Street, Downtown
            </Text>
          </View>
        </View>

        {/* Cancel Button */}
        {queueStatus !== 'completed' && (
          <Pressable style={styles.cancelButton} onPress={handleCancelBooking}>
            <IconSymbol name="xmark.circle" size={20} color={colors.card} />
            <Text style={styles.cancelButtonText}>Cancel Booking</Text>
          </Pressable>
        )}

        {/* Tips Section */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 Tips</Text>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>-</Text>
            <Text style={styles.tipText}>Arrive 5 minutes before your turn</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>-</Text>
            <Text style={styles.tipText}>Keep notifications enabled for updates</Text>
          </View>
          <View style={styles.tipItem}>
            <Text style={styles.tipBullet}>-</Text>
            <Text style={styles.tipText}>Contact us if you need to reschedule</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  currentQueueCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  currentQueueLabel: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  currentQueueNumber: {
    fontSize: 72,
    fontWeight: 'bold',
    color: colors.primary,
  },
  myQueueCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  myQueueCardReady: {
    backgroundColor: colors.primary,
  },
  myQueueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  myQueueInfo: {
    flex: 1,
  },
  myQueueLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  myQueueLabelReady: {
    color: colors.card,
  },
  myQueueNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
  },
  myQueueNumberReady: {
    color: colors.card,
  },
  divider: {
    height: 1,
    backgroundColor: colors.highlight,
    marginVertical: 20,
  },
  waitInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  waitInfoItem: {
    alignItems: 'center',
    gap: 8,
  },
  waitInfoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  waitInfoValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  readyMessage: {
    alignItems: 'center',
    gap: 12,
  },
  readyMessageText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.card,
  },
  readyMessageSubtext: {
    fontSize: 16,
    color: colors.card,
  },
  progressSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  progressBar: {
    height: 12,
    backgroundColor: colors.highlight,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  infoSection: {
    gap: 12,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  infoCardText: {
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  cancelButton: {
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginBottom: 20,
  },
  cancelButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
  tipsSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 8,
  },
  tipBullet: {
    fontSize: 16,
    color: colors.primary,
    marginRight: 8,
    fontWeight: 'bold',
  },
  tipText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
    lineHeight: 20,
  },
});
