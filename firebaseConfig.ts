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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

// ✅ Your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyBZQY903YUsaPdBa7C_PrWlw9nHOZELXAI",
  authDomain: "crudwithfirebase-b0108.firebaseapp.com",
  projectId: "crudwithfirebase-b0108",
  storageBucket: "crudwithfirebase-b0108.appspot.com",
  messagingSenderId: "101489804369",
  appId: "1:101489804369:web:14ab989533e12d9e2f2470",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Typed `auth`
let auth: Auth;

if (Platform.OS === "web") {
  auth = getAuth(app);
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

// ✅ Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Export all
export { auth, db, storage };
