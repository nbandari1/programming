import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
  Modal,
  Pressable,
  TouchableOpacity,
  Image,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { db } from '../firebaseConfig';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

export default function SearchScreen() {
  const [city, setCity] = useState('');
  const [listings, setListings] = useState([]);
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      });
    })();
    fetchAllListings();
  }, []);

  const fetchAllListings = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, 'listings'));
      const results = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  
      const listingsWithExtras = await Promise.all(
        results.map(async (listing) => {
          try {
            let coordinate = null;
  
            if (listing.address && listing.address.trim().length > 0) {
              const geocoded = await Location.geocodeAsync(listing.address);
              if (geocoded.length > 0) {
                coordinate = geocoded[0];
              } else {
                console.warn(`Could not geocode address for ${listing.make}: ${listing.address}`);
              }
            }
  
            // If geocoding fails, use fallback coords (e.g. downtown Toronto)
            if (!coordinate) {
              coordinate = {
                latitude: 43.6532,
                longitude: -79.3832,
              };
            }
  
            // Fetch owner info
            let ownerName = 'N/A';
            if (listing.owner) {
              const ownerRef = doc(db, 'users', listing.owner);
              const ownerSnap = await getDoc(ownerRef);
              if (ownerSnap.exists()) {
                const ownerData = ownerSnap.data();
                ownerName = `${ownerData.firstName} ${ownerData.lastName}`;
              }
            }
  
            return {
              ...listing,
              coordinate,
              ownerName,
              imageUrl: listing.photo || null,
            };
          } catch (error) {
            console.warn('Listing skipped due to error:', error.message);
            return null;
          }
        })
      );
  
      setListings(listingsWithExtras.filter(Boolean));
    } catch (err) {
      console.error('Error loading listings:', err);
      Alert.alert('Error', 'Could not load listings.');
    } finally {
      setLoading(false);
    }
  };
  

  const centerMapToCity = async () => {
    try {
      const coords = await Location.geocodeAsync(city);
      if (coords.length > 0) {
        setRegion({
          latitude: coords[0].latitude,
          longitude: coords[0].longitude,
          latitudeDelta: 0.1,
          longitudeDelta: 0.1,
        });
      } else {
        Alert.alert('Not Found', 'City not found.');
      }
    } catch {
      Alert.alert('Error', 'Could not locate city.');
    }
  };

  const handleBooking = async (car) => {
    try {
      const auth = getAuth();
      const renterId = auth.currentUser?.uid;
  
      if (!renterId) {
        Alert.alert('Not logged in', 'You must be logged in to book.');
        return;
      }
  
      // Delete existing booking for this user
      const q = query(collection(db, 'bookings'), where('renterId', '==', renterId));
      const existing = await getDocs(q);
      existing.forEach(async (docu) => {
        await deleteDoc(doc(db, 'bookings', docu.id));
      });
  
      // Get renter's first and last name
      const userRef = doc(db, 'users', renterId);
      const userSnap = await getDoc(userRef);
      const renterFirstName = userSnap.exists() ? userSnap.data().firstName : 'N/A';
      const renterLastName = userSnap.exists() ? userSnap.data().lastName : 'N/A';
  
      const code = Math.floor(100000 + Math.random() * 900000); // 6-digit confirmation code
  
      // Create booking with image included
      await addDoc(collection(db, 'bookings'), {
        renterId,
        renterFirstName,
        renterLastName,
        carId: car.id,
        make: car.make,
        model: car.model,
        plate: car.plate,
        cost: car.cost,
        address: car.address,
        city: car.city,
        photo: car.imageUrl || null,  // 👈 Add image here
        confirmationCode: code,
        ownerId: car.owner,
        status: 'booked',
        date: new Date().toISOString(),
      });
  
      Alert.alert(
        'Booking Confirmed',
        `Confirmation code: ${code}\nPickup: ${car.address}, ${car.city}`
      );
      setShowPopup(false);
    } catch (err) {
      console.error(err);
      Alert.alert('Booking Failed', 'Try again later.');
    }
  };
  

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search by city"
        style={styles.input}
        value={city}
        onChangeText={setCity}
        onSubmitEditing={centerMapToCity}
      />

      {loading || !region ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : (
        <MapView style={styles.map} region={region}>
          {listings.map((car) => (
            <Marker
              key={car.id}
              coordinate={{
                latitude: car.coordinate.latitude,
                longitude: car.coordinate.longitude,
              }}
              onPress={() => {
                setSelectedCar(car);
                setShowPopup(true);
              }}
            >
              <View style={styles.customMarker}>
                <Text style={styles.markerText}>${car.cost}</Text>
              </View>
            </Marker>
          ))}
        </MapView>
      )}

      <Modal
        visible={showPopup}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPopup(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowPopup(false)}>
          <View style={styles.popupContainer}>
            {selectedCar && (
              <>
                {selectedCar.imageUrl && (
                  <Image
                    source={{ uri: selectedCar.imageUrl }}
                    style={styles.carImage}
                    resizeMode="cover"
                  />
                )}
                <Text style={styles.popupTitle}>
                  {selectedCar.make} {selectedCar.model}
                </Text>
                <Text>Plate: {selectedCar.plate}</Text>
                <Text>Owner: {selectedCar.ownerName}</Text>
                <Text style={styles.price}>${selectedCar.cost}</Text>
                <TouchableOpacity
                  style={styles.bookButton}
                  onPress={() => handleBooking(selectedCar)}
                >
                  <Text style={styles.bookButtonText}>BOOK NOW</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  input: {
    padding: 10,
    borderBottomWidth: 1,
    margin: 10,
  },
  map: {
    flex: 1,
    width,
    height,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  customMarker: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#ccc',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 1.5,
  },
  markerText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupContainer: {
    width: 280,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    elevation: 5,
  },
  carImage: {
    width: '100%',
    height: 150,
    marginBottom: 10,
    borderRadius: 6,
  },
  popupTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  price: {
    fontWeight: 'bold',
    fontSize: 16,
    marginVertical: 8,
  },
  bookButton: {
    backgroundColor: '#1e3d59',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  bookButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});