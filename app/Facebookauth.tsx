import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Facebook from "expo-auth-session/providers/facebook";
import { signInWithCredential, FacebookAuthProvider } from "firebase/auth";
import { auth } from "../firebaseConfig";
import * as Linking from "expo-linking";

WebBrowser.maybeCompleteAuthSession();

export default function FacebookLoginScreen() {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const router = useRouter();

  const redirectUri =
    Platform.OS === "web"
      ? Linking.createURL("/auth/facebook")
      : "https://auth.expo.io/@jawadamin/firebase-expo";

  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: "971415111424816",
    redirectUri,
    scopes: ["public_profile", "email"],
    extraParams: {
      auth_type: "rerequest",
      display: "popup",
    },
  });
  useEffect(() => {
    console.log("📩 Facebook login response:", response);
  
    const authenticate = async (accessToken: string) => {
      try {
        console.log("🔑 Received access token:", accessToken);
        setLoading(true);
        const credential = FacebookAuthProvider.credential(accessToken);
        console.log("🧾 Firebase credential created:", credential);
  
        const userCredential = await signInWithCredential(auth, credential);
        console.log("✅ Firebase sign-in successful:", userCredential.user);
  
        router.replace("/(tabs)/HomeSceen");
      } catch (error: any) {
        console.error("🔥 Firebase sign-in error:", error);
        Alert.alert("Login Error", error.message || "Something went wrong.");
        setAuthError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    if (!response) {
      console.log("⌛ Waiting for Facebook login response...");
      return;
    }
  
    if (response.type === "success") {
      const accessToken = response.authentication?.accessToken;
      console.log("📦 Facebook response success. Access Token:", accessToken);
  
      if (accessToken) {
        authenticate(accessToken);
      } else {
        console.warn("⚠️ No access token in authentication response:", response.authentication);
        Alert.alert("Login Error", "No access token received from Facebook.");
      }
    } else if (response.type === "error") {
      console.error("❌ Facebook response error:", response.error);
      Alert.alert("Login Error", "Something went wrong during Facebook login.");
    } else {
      console.log("🌀 Facebook response type:", response.type);
    }
  }, [response]);
  

  return (
    <View style={styles.container}>
      {authError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{authError}</Text>
        </View>
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#1877F2" />
      ) : (
        <TouchableOpacity
          style={styles.button}
          disabled={!request}
          onPress={() => {
            setAuthError(null);
            promptAsync();
          }}
        >
          <Text style={styles.buttonText}>Continue with Facebook</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  button: {
    backgroundColor: "#1877F2",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    maxWidth: 300,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: "#fee",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#f99",
  },
  errorText: {
    color: "#d33",
    textAlign: "center",
  },
});
