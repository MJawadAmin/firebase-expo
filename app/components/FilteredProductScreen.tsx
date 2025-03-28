import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router"; // Correct hook to access query parameters
import { deleteDoc, doc, collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { getAuth } from "firebase/auth"; // Firebase authentication

// Define the type for each item
interface Item {
  id: string;
  name: string;
  details: string;
  userId?: string; // Include userId to identify ownership
  timestamp?: string;
}

export default function FilteredProductScreen() {
  const router = useRouter();
  const { myItems } = useLocalSearchParams<{ myItems?: string }>(); // Add type for useLocalSearchParams
  const auth = getAuth(); // Get Firebase auth instance
  const currentUser = auth.currentUser; // Get the currently authenticated user

  // State for items with proper type
  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(""); // State for search query
  const [filteredItems, setFilteredItems] = useState<Item[]>([]); // State for filtered items

  useEffect(() => {
    // Real-time listener for Firestore changes
    const unsubscribe = onSnapshot(collection(db, "items"), (snapshot) => {
      const updatedItems: Item[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        details: doc.data().details,
        userId: doc.data().userId,
        timestamp: doc.data().timestamp
          ? new Date(doc.data().timestamp.seconds * 1000).toLocaleString()
          : "No Date",
      }));
      setItems(updatedItems);
      setFilteredItems(
        updatedItems.filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.details.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ); // Update filtered items based on current search query
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [searchQuery]);

  const deleteItem = async (id: string) => {
    try {
      await deleteDoc(doc(db, "items", id)); // Delete from Firestore
    } catch (error) {
      console.error("Error deleting item:", error);
      Alert.alert("Error", "Failed to delete item.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Products</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)} // Update search query state
      />
      {filteredItems.length === 0 ? (
        <Text style={styles.noData}>No items found.</Text>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id || Math.random().toString()} // Ensure unique key for each item
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetails}>{item.details}</Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
              {/* Render Edit/Delete buttons only for items owned by the current user */}
              {item.userId === currentUser?.uid && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() =>
                      router.push({
                        pathname: "/components/EditItemScreen",
                        params: { id: item.id, name: item.name, details: item.details },
                      })
                    }
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteItem(item.id)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f8f9fa" },
  header: { fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 15 },
  searchBar: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 15,
    fontSize: 16,
  },
  noData: { textAlign: "center", fontSize: 18, color: "gray", marginTop: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 8,
    elevation: 3,
  },
  itemName: { fontSize: 18, fontWeight: "bold", color: "#333" },
  itemDetails: { fontSize: 14, color: "#666", marginVertical: 4 },
  timestamp: { fontSize: 12, color: "gray" },
  buttonContainer: { flexDirection: "row", marginTop: 8 },
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
  buttonText: { color: "#fff", fontSize: 14 },
});
