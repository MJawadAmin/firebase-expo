import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { auth } from "@/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "expo-router";
import GoogleSignInButton from "./components/GoogleSignInButton"; // Import the new component
import { Ionicons } from "@expo/vector-icons"; // Importing eye icon from Ionicons

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setPasswordVisibility(!isPasswordVisible);
  };

  const signIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      Alert.alert("Success", "Sign in successful!");
      router.replace("/(tabs)");
    } catch (error: any) {
      console.error("Sign in failed:", error.message);
      Alert.alert("Error", "Sign in failed: " + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>

        {/* Email Input Field */}
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#aaa"
          onChangeText={setEmail}
          value={email}
        />

        {/* Password Input Field */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputWithIcon}
            placeholder="Enter your password"
            placeholderTextColor="#aaa"
            secureTextEntry={!isPasswordVisible}
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity style={styles.icon} onPress={togglePasswordVisibility}>
            <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={20} color="#aaa" />
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <TouchableOpacity style={styles.button} onPress={signIn}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        {/* Google Sign-In Button */}
        <GoogleSignInButton /> {/* Ensure this component returns valid JSX */}

        {/* Signup Link */}
        <TouchableOpacity
          style={styles.signupLink}
          onPress={() => router.push("/components/Signup")}
        >
          <Text>
            <Text style={styles.signupText}>
              Don't have an account?{" "}
            </Text>
            <Text style={styles.signupHighlight}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  inputContainer: {
    width: "100%",
    marginVertical: 10,
    position: "relative",
  },
  inputWithIcon: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    fontSize: 16,
    paddingRight: 40, // Ensure enough space for the icon
  },
  icon: {
    position: "absolute",
    right: 15,
    top: "50%",
    transform: [{ translateY: -10 }], // Center the icon vertically
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  signupLink: {
    marginTop: 20,
  },
  signupText: {
    fontSize: 16,
    color: "#333",
  },
  signupHighlight: {
    color: "#007bff",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    fontSize: 16,
  },
});

export default Login;




