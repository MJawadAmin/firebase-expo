import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity, 
  Button 
} from 'react-native';
import { auth } from '@/firebaseConfig';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
  // Import router from expo-router
  import { router } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Google Sign-In
    const [request, response, promptAsync] = Google.useAuthRequest({
        clientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com", // Use only the web client ID
    });



// Handle Google sign-in response
useEffect(() => {
    if (response?.type === "success") {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        signInWithCredential(auth, credential)
            .then(() => {
                alert('Google Sign-In Successful!');
                router.replace("/(tabs)"); // Navigate to (tabs)
            })
            .catch((error) => {
                alert('Google Sign-In Failed: ' + error.message);
            });
    }
}, [response]);

// Email/Password Login
const signIn = async () => {
    if (!email || !password) {
        alert('Please enter both email and password.');
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email.trim(), password.trim());
        alert('Sign in successful!');
        router.replace("/(tabs)"); // Navigate to (tabs)
    } catch (error: any) {
        alert('Sign in failed: ' + error.message);
    }
};


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Welcome Back</Text>
                
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#aaa"
                    onChangeText={setEmail}
                    value={email}
                />
                
                <TextInput
                    style={styles.input}
                    placeholder="Enter your password"
                    placeholderTextColor="#aaa"
                    secureTextEntry
                    onChangeText={setPassword}
                    value={password}
                />
                
                <TouchableOpacity style={styles.button} onPress={signIn}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                {/* Google Sign-In Button */}
                <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
                    <Text style={styles.googleButtonText}>Sign in with Google</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        width: '100%',
        padding: 15,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginVertical: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    googleButton: {
        backgroundColor: '#db4437',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
        marginVertical: 10,
    },
    googleButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    }
});

export default Login;
