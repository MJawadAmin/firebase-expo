// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZQY903YUsaPdBa7C_PrWlw9nHOZELXAI",
  authDomain: "crudwithfirebase-b0108.firebaseapp.com",
  projectId: "crudwithfirebase-b0108",
  storageBucket: "crudwithfirebase-b0108.appspot.com", // ✅ Fixed storageBucket URL
  messagingSenderId: "101489804369",
  appId: "1:101489804369:web:14ab989533e12d9e2f2470",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Ensure React Native AsyncStorage is used for Firebase Auth (for persistence)
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);
