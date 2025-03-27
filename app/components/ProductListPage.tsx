import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { collection, getDocs, deleteDoc, doc,onSnapshot } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Item {
  id: string;
  name: string;
  details: string;
  imageUri: string;
  timestamp?: string;
}

export default function ProductsScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "items"), async (querySnapshot) => {
      try {
        const storedImages = await AsyncStorage.getItem("localImages");
        const localImages = storedImages ? JSON.parse(storedImages) : {};
  
        const itemsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          details: doc.data().details,
          imageUri: localImages[doc.id] || "",
          timestamp: doc.data().timestamp
            ? new Date(doc.data().timestamp.seconds * 1000).toLocaleString()
            : "No Date",
        }));
  
        setItems(itemsList);
      } catch (error) {
        console.error("Error fetching items:", error);
        Alert.alert("Error", "Failed to fetch items.");
      }
    });
  
    return () => unsubscribe(); // Cleanup the listener when unmounting
  }, []);
  

  const deleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, "items", id));

      const storedImages = await AsyncStorage.getItem("localImages");
      const localImages = storedImages ? JSON.parse(storedImages) : {};
      delete localImages[id];
      await AsyncStorage.setItem("localImages", JSON.stringify(localImages));

      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
      Alert.alert("Error", "Failed to delete item.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Product List</Text>
      {items.length === 0 ? (
        <Text style={styles.noData}>No items available.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.imageUri }} style={styles.image} />
              <View style={styles.textContainer}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetails}>{item.details}</Text>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.editButton} onPress={() => router.push({ pathname: "/components/EditItemScreen", params: { id: item.id, name: item.name, details: item.details, imageUri: item.imageUri } })}>
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => deleteItem(item.id)}>
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  noData: {
    textAlign: "center",
    fontSize: 18,
    color: "gray",
    marginTop: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  itemDetails: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "gray",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  editButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
});