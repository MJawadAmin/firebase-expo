import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, Alert 
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db } from "@/firebaseConfig"; // Firebase config
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AddItemScreen() {
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const navigation = useNavigation();

  // Add item to Firestore
  const addItem = async () => {
    if (!name || !details) {
      Alert.alert("Error", "Please fill all fields!");
      return;
    }
  
    try {
      // Save item in Firestore
      await addDoc(collection(db, "items"), {
        name,
        details,
        timestamp: serverTimestamp(),
      });
  
      // Reset fields
      setName("");
      setDetails("");
  
      Alert.alert("Success", "Item added successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      console.error("Error adding item:", error.message);
      Alert.alert("Error", "Failed to add item. Please try again.");
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Item</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, styles.detailsInput]}
        placeholder="Enter Details"
        value={details}
        onChangeText={setDetails}
        multiline
      />
      <TouchableOpacity style={styles.addButton} onPress={addItem}>
        <Text style={styles.buttonText}>Add Item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { 
    width: "100%", padding: 10, borderWidth: 1, borderColor: "#ddd", 
    borderRadius: 8, backgroundColor: "#fff", marginBottom: 10 
  },
  detailsInput: { height: 80, textAlignVertical: "top" },
  addButton: { backgroundColor: "#28a745", padding: 10, borderRadius: 8, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 16 },
});