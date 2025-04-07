import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import ProductsScreen from "../components/ProductListPage";

export default function HomeScreen() {
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserName = () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUserName(currentUser.displayName || "User");
      }
    };
    fetchUserName();
  }, []);
  

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/index");
      Alert.alert("Logged out");
    } catch (error: any) {
      console.error("Logout failed:", error.message);
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>👋 Hello, {userName}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>🛒 Welcome to MyShop</Text>

      {/* Button Row */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => router.push("/components/AddItemScreen")}
        >
          <Text style={styles.buttonText}>+ Add Product</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.smallButtonSecondary}
          onPress={() => Alert.alert("Show My Products pressed")}
        >
          <Text style={styles.buttonText}>👀 My Products</Text>
        </TouchableOpacity>
      </View>

      {/* Products List Area (60–70%) */}
      <View style={styles.productsWrapper}>
        <ProductsScreen />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 15,
    color: "#007bff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  smallButton: {
    backgroundColor: "#28a745",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  smallButtonSecondary: {
    backgroundColor: "#17a2b8",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  productsWrapper: {
    flex: 0.8, // Increased from 0.65 to 0.8 (80% of available space)
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

});
