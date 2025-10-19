
import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar
        ]}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <IconSymbol name="person.circle.fill" size={100} color={colors.primary} />
          </View>
          <Text style={styles.name}>Sarah Johnson</Text>
          <Text style={styles.email}>sarah.j@example.com</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <IconSymbol name="calendar.badge.checkmark" size={32} color={colors.accent} />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Appointments</Text>
          </View>
          <View style={styles.statCard}>
            <IconSymbol name="star.fill" size={32} color={colors.accent} />
            <Text style={styles.statValue}>4.9</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Contact Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <IconSymbol name="phone.fill" size={20} color={colors.textSecondary} />
              <Text style={styles.infoText}>+1 (555) 123-4567</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <IconSymbol name="location.fill" size={20} color={colors.textSecondary} />
              <Text style={styles.infoText}>San Francisco, CA</Text>
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <IconSymbol name="bell.fill" size={20} color={colors.textSecondary} />
              <Text style={styles.infoText}>Notifications</Text>
              <Text style={styles.infoValue}>Enabled</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <IconSymbol name="heart.fill" size={20} color={colors.textSecondary} />
              <Text style={styles.infoText}>Favorite Service</Text>
              <Text style={styles.infoValue}>Haircut</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.section}>
          <Pressable style={styles.actionButton}>
            <IconSymbol name="clock.arrow.circlepath" size={20} color={colors.card} />
            <Text style={styles.actionButtonText}>Booking History</Text>
          </Pressable>
          
          <Pressable style={[styles.actionButton, styles.actionButtonSecondary]}>
            <IconSymbol name="gearshape.fill" size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>Settings</Text>
          </Pressable>
        </View>

        {/* Loyalty Section */}
        <View style={styles.loyaltyCard}>
          <View style={styles.loyaltyHeader}>
            <IconSymbol name="gift.fill" size={32} color={colors.primary} />
            <Text style={styles.loyaltyTitle}>Loyalty Rewards</Text>
          </View>
          <Text style={styles.loyaltyText}>
            You have 3 more visits until your next free haircut!
          </Text>
          <View style={styles.loyaltyProgress}>
            <View style={styles.loyaltyProgressFill} />
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
  profileHeader: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 30,
    marginBottom: 20,
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  infoText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.highlight,
    marginVertical: 8,
  },
  actionButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
    boxShadow: '0px 2px 4px rgba(255, 105, 180, 0.3)',
    elevation: 3,
  },
  actionButtonSecondary: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  actionButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtonTextSecondary: {
    color: colors.primary,
  },
  loyaltyCard: {
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 20,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  loyaltyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  loyaltyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
  loyaltyText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 22,
  },
  loyaltyProgress: {
    height: 8,
    backgroundColor: colors.card,
    borderRadius: 4,
    overflow: 'hidden',
  },
  loyaltyProgressFill: {
    height: '100%',
    width: '70%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
});
