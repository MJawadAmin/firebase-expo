import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db } from "@/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AddItemScreen() {
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const navigation = useNavigation();

  // Pick image from gallery
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  // Add item to Firestore & AsyncStorage
  const addItem = async () => {
    if (!name || !details || !image) {
      Alert.alert("Error", "Please fill all fields!");
      return;
    }

    try {
      // Save item in Firestore
      const docRef = await addDoc(collection(db, "items"), {
        name,
        details,
        image, // Save image URL in Firestore too
        timestamp: serverTimestamp(),
      });

      // Save image in AsyncStorage
      const storedImages = await AsyncStorage.getItem("localImages");
      const localImages = storedImages ? JSON.parse(storedImages) : {};
      localImages[docRef.id] = image;

      await AsyncStorage.setItem("localImages", JSON.stringify(localImages));

      // Reset form fields
      setName("");
      setDetails("");
      setImage(null);

      Alert.alert("Success", "Item added successfully!");

      // Navigate to correct screen (adjust based on your navigation setup)
      navigation.navigate("product-list"); // 🔥 Ensure this name matches your registered screen
    } catch (error) {
      console.error("Error adding item:", error);
      Alert.alert("Error", "Failed to add item.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Item</Text>
      <TextInput style={styles.input} placeholder="Enter Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Enter Details" value={details} onChangeText={setDetails} />

      <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
        <Text style={styles.buttonText}>{image ? "Change Image" : "Pick Image"}</Text>
      </TouchableOpacity>

      {image && <Image source={{ uri: image }} style={styles.image} />}

      <TouchableOpacity style={styles.addButton} onPress={addItem}>
        <Text style={styles.buttonText}>Add Item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  title: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  input: { width: "100%", padding: 10, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, backgroundColor: "#fff", marginBottom: 10 },
  imageButton: { backgroundColor: "#007bff", padding: 10, borderRadius: 8, alignItems: "center" },
  addButton: { backgroundColor: "#28a745", padding: 10, borderRadius: 8, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontSize: 16 },
  image: { width: 100, height: 100, marginTop: 10, borderRadius: 8 },
});
