import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import ProductsScreen from "../components/ProductListPage";

export default function HomeScreen() {
  const [userName, setUserName] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);
  const router = useRouter();

  // This should be outside of any condition or render logic
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName || user.email || "User");
        setError(false); // Reset error state if user is authenticated
      } else {
        setUserName(null);
        setError(true); // Set error state if no user is authenticated
        router.replace("/"); // Redirect to login screen if no user
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, []); // The effect runs only once on mount

  // Logout function with alert and redirect
  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Logout canceled"),
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await signOut(auth); // Clear the credentials from Firebase
              console.log("Logout successful");
              // The listener from `onAuthStateChanged` will handle the redirection
            } catch (error: any) {
              console.error("Logout failed:", error.message);
              Alert.alert("Error", "Failed to logout. Please try again.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        {error ? (
          <TouchableOpacity style={styles.logoutButton} onPress={() => router.push("/")}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        ) : (
          <>
            <Text style={styles.greeting}>Hello, {userName}!</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Title */}
      <Text style={styles.title}>Welcome to CRUD App</Text>

      {/* Add Product Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push("/components/AddItemScreen")}
      >
        <Text style={styles.buttonText}>Add Product</Text>
      </TouchableOpacity>

      {/* Product List Component */}
      <ProductsScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e9ecef",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#007bff",
  },
  addButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
