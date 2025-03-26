import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TextInput, 
  TouchableOpacity 
} from 'react-native';
import { auth } from '@/firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { router } from 'expo-router';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signUp = async () => {
        if (!email || !password) {
            alert('Please enter both email and password.');
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            alert("Invalid email format. Please enter a valid email.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
            alert('Account created successfully!');
            router.replace('/'); // Redirect to login page after signup
        } catch (error: any) {
            if (error.code === 'auth/email-already-in-use') {
                alert('Email is already registered. Please log in.');
                router.replace('/');
            } else {
                alert('Sign up failed: ' + error.message);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Create an Account</Text>
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
                <TouchableOpacity style={styles.button} onPress={signUp}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.signupLink} onPress={() => router.replace('/')}>
                    <Text style={styles.signupText}>Already have an account? Log in</Text>
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
        backgroundColor: '#28a745',
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
    signupLink: {
        marginTop: 10,
    },
    signupText: {
        color: '#007bff',
        fontSize: 16,
    }
});

export default Signup;
