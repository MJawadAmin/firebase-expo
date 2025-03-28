import React, { useEffect } from "react";
import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@/firebaseConfig"; // Import Firebase auth instance
import { useRouter } from "expo-router";

const GoogleSignInButton = () => {
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "101489804369-05nt5oqvg6tgd700ld2h464o7fjjqn4q.apps.googleusercontent.com", // Web Client ID
    redirectUri: AuthSession.makeRedirectUri(),
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          alert("Google Sign-In Successful!");
          router.replace("/(tabs)");
        })
        .catch((error) => {
          console.error("Google Sign-In Failed:", error.message);
          Alert.alert("Error", "Google Sign-In Failed: " + error.message);
        });
    }
  }, [response]);

  return (
    <TouchableOpacity
      style={styles.googleButton}
      onPress={() => promptAsync()}
      disabled={!request} // Disable button if request is not ready
    >
      <Text style={styles.googleButtonText}>Sign in with Google</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  googleButton: {
    backgroundColor: "#db4437",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default GoogleSignInButton;
