
import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import { 
  ScrollView, 
  Pressable, 
  StyleSheet, 
  View, 
  Text, 
  Alert, 
  Platform,
  Modal,
  TextInput,
} from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import { services } from "@/data/services";
import { Service, TimeSlot, Booking } from "@/types/booking";
import DateTimePicker from '@react-native-community/datetimepicker';
import { requestNotificationPermissions, scheduleQueueNotification } from "@/utils/notificationHelper";

export default function HomeScreen() {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  const timeSlots: TimeSlot[] = [
    { id: '1', time: '09:00 AM', available: true },
    { id: '2', time: '10:00 AM', available: true },
    { id: '3', time: '11:00 AM', available: false },
    { id: '4', time: '12:00 PM', available: true },
    { id: '5', time: '01:00 PM', available: true },
    { id: '6', time: '02:00 PM', available: true },
    { id: '7', time: '03:00 PM', available: false },
    { id: '8', time: '04:00 PM', available: true },
    { id: '9', time: '05:00 PM', available: true },
  ];

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleBooking = () => {
    if (!selectedService || !selectedTime || !customerName.trim()) {
      Alert.alert('Missing Information', 'Please select a service, time, and enter your name.');
      return;
    }

    const queueNumber = bookings.length + 1;
    const estimatedWaitTime = queueNumber * 15; // 15 minutes per person

    const newBooking: Booking = {
      id: Date.now().toString(),
      service: selectedService,
      date: selectedDate.toDateString(),
      time: selectedTime,
      queueNumber,
      status: 'waiting',
      estimatedWaitTime,
    };

    setBookings([...bookings, newBooking]);
    scheduleQueueNotification(queueNumber, estimatedWaitTime);

    Alert.alert(
      'Booking Confirmed! 🎉',
      `Your queue number is ${queueNumber}\nEstimated wait: ${estimatedWaitTime} minutes\n\nYou'll receive a notification when it's almost your turn!`,
      [{ text: 'OK' }]
    );

    // Reset form
    setShowBookingModal(false);
    setSelectedService(null);
    setSelectedTime('');
    setCustomerName('');
  };

  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Glamour Hair Salon",
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.card,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.contentContainer,
            Platform.OS !== 'ios' && styles.contentContainerWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <IconSymbol name="scissors" size={60} color={colors.primary} />
            <Text style={styles.heroTitle}>Welcome to Glamour</Text>
            <Text style={styles.heroSubtitle}>Your beauty, our passion</Text>
          </View>

          {/* Book Appointment Button */}
          <Pressable
            style={styles.bookButton}
            onPress={() => setShowBookingModal(true)}
          >
            <IconSymbol name="calendar.badge.plus" size={24} color={colors.card} />
            <Text style={styles.bookButtonText}>Book Appointment</Text>
          </Pressable>

          {/* Services Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Services</Text>
            {services.map((service) => (
              <View key={service.id} style={styles.serviceCard}>
                <View style={styles.serviceIcon}>
                  <IconSymbol name="sparkles" size={24} color={colors.primary} />
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceDetails}>
                    {service.duration} min • ${service.price}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Info Cards */}
          <View style={styles.infoCardsContainer}>
            <View style={styles.infoCard}>
              <IconSymbol name="clock.fill" size={32} color={colors.accent} />
              <Text style={styles.infoCardTitle}>Opening Hours</Text>
              <Text style={styles.infoCardText}>Mon-Sat: 9AM-6PM</Text>
              <Text style={styles.infoCardText}>Sunday: Closed</Text>
            </View>

            <View style={styles.infoCard}>
              <IconSymbol name="location.fill" size={32} color={colors.accent} />
              <Text style={styles.infoCardTitle}>Location</Text>
              <Text style={styles.infoCardText}>123 Beauty Street</Text>
              <Text style={styles.infoCardText}>Downtown</Text>
            </View>
          </View>
        </ScrollView>

        {/* Booking Modal */}
        <Modal
          visible={showBookingModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowBookingModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Book Appointment</Text>
                <Pressable onPress={() => setShowBookingModal(false)}>
                  <IconSymbol name="xmark.circle.fill" size={28} color={colors.textSecondary} />
                </Pressable>
              </View>

              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                {/* Name Input */}
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>Your Name</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your name"
                    placeholderTextColor={colors.textSecondary}
                    value={customerName}
                    onChangeText={setCustomerName}
                  />
                </View>

                {/* Service Selection */}
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>Select Service</Text>
                  {services.map((service) => (
                    <Pressable
                      key={service.id}
                      style={[
                        styles.selectionCard,
                        selectedService?.id === service.id && styles.selectionCardActive
                      ]}
                      onPress={() => handleServiceSelect(service)}
                    >
                      <View style={styles.selectionCardContent}>
                        <Text style={[
                          styles.selectionCardTitle,
                          selectedService?.id === service.id && styles.selectionCardTitleActive
                        ]}>
                          {service.name}
                        </Text>
                        <Text style={styles.selectionCardSubtitle}>
                          {service.duration} min • ${service.price}
                        </Text>
                      </View>
                      {selectedService?.id === service.id && (
                        <IconSymbol name="checkmark.circle.fill" size={24} color={colors.primary} />
                      )}
                    </Pressable>
                  ))}
                </View>

                {/* Date Selection */}
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>Select Date</Text>
                  <Pressable
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <IconSymbol name="calendar" size={20} color={colors.primary} />
                    <Text style={styles.dateButtonText}>
                      {selectedDate.toDateString()}
                    </Text>
                  </Pressable>
                  {showDatePicker && (
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="default"
                      onChange={onDateChange}
                      minimumDate={new Date()}
                    />
                  )}
                </View>

                {/* Time Selection */}
                <View style={styles.inputSection}>
                  <Text style={styles.inputLabel}>Select Time</Text>
                  <View style={styles.timeGrid}>
                    {timeSlots.map((slot) => (
                      <Pressable
                        key={slot.id}
                        style={[
                          styles.timeSlot,
                          !slot.available && styles.timeSlotDisabled,
                          selectedTime === slot.time && styles.timeSlotActive
                        ]}
                        onPress={() => slot.available && handleTimeSelect(slot.time)}
                        disabled={!slot.available}
                      >
                        <Text style={[
                          styles.timeSlotText,
                          !slot.available && styles.timeSlotTextDisabled,
                          selectedTime === slot.time && styles.timeSlotTextActive
                        ]}>
                          {slot.time}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {/* Confirm Button */}
                <Pressable
                  style={[
                    styles.confirmButton,
                    (!selectedService || !selectedTime || !customerName.trim()) && styles.confirmButtonDisabled
                  ]}
                  onPress={handleBooking}
                  disabled={!selectedService || !selectedTime || !customerName.trim()}
                >
                  <Text style={styles.confirmButtonText}>Confirm Booking</Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: colors.card,
    borderRadius: 20,
    marginBottom: 20,
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 5,
  },
  bookButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 30,
    gap: 10,
    boxShadow: '0px 4px 6px rgba(255, 105, 180, 0.3)',
    elevation: 4,
  },
  bookButtonText: {
    color: colors.card,
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  serviceCard: {
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  serviceIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  serviceDetails: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoCardsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    backgroundColor: colors.card,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 10,
    marginBottom: 8,
  },
  infoCardText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.highlight,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  modalScroll: {
    padding: 20,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.highlight,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  },
  selectionCard: {
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectionCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.highlight,
  },
  selectionCardContent: {
    flex: 1,
  },
  selectionCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  selectionCardTitleActive: {
    color: colors.primary,
  },
  selectionCardSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  dateButton: {
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.highlight,
    gap: 10,
  },
  dateButtonText: {
    fontSize: 16,
    color: colors.text,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    backgroundColor: colors.background,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.highlight,
    minWidth: '30%',
    alignItems: 'center',
  },
  timeSlotActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeSlotDisabled: {
    backgroundColor: colors.textSecondary + '20',
    borderColor: colors.textSecondary + '40',
  },
  timeSlotText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  timeSlotTextActive: {
    color: colors.card,
  },
  timeSlotTextDisabled: {
    color: colors.textSecondary,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    boxShadow: '0px 4px 6px rgba(255, 105, 180, 0.3)',
    elevation: 4,
  },
  confirmButtonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
  confirmButtonText: {
    color: colors.card,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
