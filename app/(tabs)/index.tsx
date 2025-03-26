import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to CRUD App</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/components/AddItemScreen")}
      >
        <Text style={styles.buttonText}>Go to Add Item</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/components/ProductListPage")}
      >
        <Text style={styles.buttonText}>View Products</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  button: { backgroundColor: "#007bff", padding: 15, borderRadius: 8, marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 16 },
});
