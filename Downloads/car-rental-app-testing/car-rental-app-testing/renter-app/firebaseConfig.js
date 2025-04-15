import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPTp6n5k7ULMDFINb0bQBPyNI97_eOEc4",
  authDomain: "car-rental-app-d8bad.firebaseapp.com",
  projectId: "car-rental-app-d8bad",
  storageBucket: "car-rental-app-d8bad.firebasestorage.app",
  messagingSenderId: "291130184883",
  appId: "1:291130184883:web:f6442a127f2064362c4cc6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };