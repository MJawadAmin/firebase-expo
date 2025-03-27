import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";

export default function EditItemScreen() {
  const router = useRouter();
  const { id, name, details } = useLocalSearchParams();
  const [newName, setNewName] = useState(name as string);
  const [newDetails, setNewDetails] = useState(details as string);

  const handleUpdate = async () => {
    try {
      const itemRef = doc(db, "items", id as string);
      await updateDoc(itemRef, {
        name: newName,
        details: newDetails,
      });

      Alert.alert("Success", "Item updated successfully!");
      router.back(); // Navigate back after update
    } catch (error) {
      console.error("Error updating item:", error);
      Alert.alert("Error", "Failed to update item.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Product</Text>

      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={newName}
        onChangeText={setNewName}
      />
      <TextInput
        style={styles.input}
        placeholder="Product Details"
        value={newDetails}
        onChangeText={setNewDetails}
      />

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Product</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  updateButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
