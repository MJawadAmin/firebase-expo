import React from "react";
import { TouchableOpacity, Text, StyleSheet, Image, View } from "react-native";

interface Props {
  onPress: () => void;
}

const FacebookLoginButton: React.FC<Props> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Image
          source={{ uri: "https://img.icons8.com/color/48/facebook-new.png" }}
          style={styles.icon}
        />
      </View>
      <Text style={styles.text}>Continue with Facebook</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#1877F2",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  iconContainer: {
    marginRight: 10, // Adding margin to align icon properly
  },
  icon: {
    width: 24,
    height: 24,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default FacebookLoginButton;
