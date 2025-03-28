import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router"; // Correct hook to access query parameters

// Define the type for each item
interface Item {
  id: string;
  name: string;
  details: string;
  timestamp?: string;
}

export default function FilteredProductScreen() {
  const router = useRouter();
  const { myItems } = useLocalSearchParams<{ myItems?: string }>(); // Add type for useLocalSearchParams

  // State for items with proper type
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    try {
      // Safely parse myItems with error handling
      const parsedItems: Item[] = myItems ? JSON.parse(myItems) : [];
      setItems(parsedItems);
    } catch (error) {
      console.error("Error parsing myItems:", error);
      setItems([]); // Fallback to empty array if parsing fails
    }
  }, [myItems]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Products</Text>
      {items.length === 0 ? (
        <Text style={styles.noData}>No items found.</Text>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id || Math.random().toString()} // Ensure unique key for each item
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetails}>{item.details}</Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
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
});
