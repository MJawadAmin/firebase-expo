import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "@/firebaseConfig";

interface Item {
  id: string;
  name: string;
  details: string;
  userId: string;
  timestamp?: string;
}

export default function ProductsScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      if (!user) {
        router.replace("/");
        return;
      }
      setCurrentUser(user.uid);
    });

    const unsubscribeFirestore = onSnapshot(collection(db, "items"), 
      (querySnapshot) => {
        try {
          const itemsList = querySnapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name,
            details: doc.data().details,
            userId: doc.data().userId,
            timestamp: doc.data().timestamp?.toDate().toLocaleString() || "No Date"
          }));

          setItems(itemsList);
        } catch (error) {
          console.error("Error:", error);
          Alert.alert("Error", "Failed to load items");
        }
      });

    return () => {
      unsubscribeAuth();
      unsubscribeFirestore();
    };
  }, []);

  const handleDelete = async (itemId: string, itemUserId: string) => {
    if (!currentUser || currentUser !== itemUserId) {
      Alert.alert("Unauthorized", "You can only delete your own items");
      return;
    }

    try {
      await deleteDoc(doc(db, "items", itemId));
      setItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error("Delete error:", error);
      Alert.alert("Error", "Failed to delete item");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Product List</Text>
      
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.noData}>No items found</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.textContainer}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetails}>{item.details}</Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
              
              {currentUser === item.userId && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => router.push({
                      pathname: "/components/EditItemScreen",
                      params: {
                        id: item.id,
                        name: item.name,
                        details: item.details,
                        userId: item.userId
                      }
                    })}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.id, item.userId)}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  textContainer: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  itemDetails: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },
  editButton: {
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  noData: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
    marginTop: 20,
  },
});