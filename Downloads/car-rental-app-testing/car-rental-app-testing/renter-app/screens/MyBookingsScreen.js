import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Alert,
  Image,
  ActivityIndicator
} from 'react-native';
import { db, auth } from '../firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  getDoc
} from 'firebase/firestore';

export default function MyBookingsScreen() {
  const [booking, setBooking] = useState(null);
  const [renterInfo, setRenterInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBooking = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Error", "User not logged in");
        return;
      }

      const renterId = user.uid;

      const bookingsQuery = query(
        collection(db, 'bookings'),
        where('renterId', '==', renterId)
      );
      const bookingsSnapshot = await getDocs(bookingsQuery);

      if (bookingsSnapshot.empty) {
        setBooking(null);
        setLoading(false);
        return;
      }

      const bookingDoc = bookingsSnapshot.docs[0];
      const bookingData = {
        id: bookingDoc.id,
        ...bookingDoc.data()
      };
      setBooking(bookingData);

      const renterRef = doc(db, 'users', renterId);
      const renterSnap = await getDoc(renterRef);

      if (renterSnap.exists()) {
        setRenterInfo(renterSnap.data());
      } else {
        console.warn("Renter info not found");
      }

    } catch (err) {
      console.error('Error fetching booking:', err);
      Alert.alert("Error", "Failed to load booking info");
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async () => {
    if (!booking) return;

    try {
      await deleteDoc(doc(db, 'bookings', booking.id));
      Alert.alert("Booking cancelled");
      setBooking(null);
    } catch (err) {
      console.error("Cancel error:", err);
      Alert.alert("Error", "Failed to cancel booking");
    }
  };

  useEffect(() => {
    fetchBooking();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!booking) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyMessage}>No active bookings found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Booking Confirmation</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Renter Info</Text>
        {renterInfo ? (
          <>
            <Text>First Name: {renterInfo.firstName}</Text>
            <Text>Last Name: {renterInfo.lastName}</Text>
          </>
        ) : (
          <Text>Renter info not available</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vehicle Details</Text>
        <Text>Make: {booking.make || 'N/A'}</Text>
        <Text>Model: {booking.model || 'N/A'}</Text>
        <Text>Plate: {booking.plate || 'N/A'}</Text>
        <Text>Rate: ${booking.cost || '0'}</Text>
        {booking.image ? (
        <Image
          source={{ uri: booking.photo }}
          style={styles.image}
          resizeMode="contain"
        onError={(e) => console.log('Image loading error:', e.nativeEvent.error)}
        />
        ) : (
          <Text>No image available</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pickup Location</Text>
        <Text>Address: {booking.address || 'N/A'}</Text>
        <Text>City: {booking.city || 'N/A'}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Booking Details</Text>
        <Text>Confirmation Code: {booking.confirmationCode || booking.id}</Text>
        <Text>Status: {booking.status || 'N/A'}</Text>
      </View>

      <Button
        title="Cancel Booking"
        onPress={cancelBooking}
        color="#ff4444"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 16,
    color: '#333',
  },
  carImage: {
    width: '100%',
    height: 150,
    marginTop: 10,
    borderRadius: 5,
  },
  emptyMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
});
