// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  Auth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBZQY903YUsaPdBa7C_PrWlw9nHOZELXAI",
  authDomain: "crudwithfirebase-b0108.firebaseapp.com",
  projectId: "crudwithfirebase-b0108",
  storageBucket: "crudwithfirebase-b0108.appspot.com",
  messagingSenderId: "101489804369",
  appId: "1:101489804369:web:14ab989533e12d9e2f2470",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Declare `auth` properly with type `Auth`
let auth: Auth;

if (Platform.OS === "web") {
  // On web, use getAuth directly (no persistence handling needed here)
  auth = getAuth(app);
} else {
  // On native, use React Native persistence
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);
