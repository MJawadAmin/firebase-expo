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
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Importing eye icon from Ionicons

const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setPasswordVisibility] = useState(false);
    const [isConfirmPasswordVisible, setConfirmPasswordVisibility] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordVisibility(!isPasswordVisible);
    };

    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordVisibility(!isConfirmPasswordVisible);
    };

    const signUp = async () => {
        if (!username || !email || !password || !confirmPassword) {
            alert("Please fill in all fields.");
            return;
        }

        if (!email.includes("@") || !email.includes(".")) {
            alert("Invalid email format. Please enter a valid email.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
            const user = userCredential.user;

            // Save the username as displayName in Firebase Auth
            await updateProfile(user, { displayName: username.trim() });

            alert("Account created successfully!");
            router.replace('/'); // Redirect to the main screen after signup
        } catch (error: any) {
            if (error.code === "auth/email-already-in-use") {
                alert("Email is already registered. Please log in.");
                router.replace('/');
            } else {
                alert("Sign up failed: " + error.message);
            }
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Create an Account</Text>
                
                {/* Username Field */}
                <TextInput
                    style={styles.input}
                    placeholder="Enter your username"
                    placeholderTextColor="#aaa"
                    onChangeText={setUsername}
                    value={username}
                />
                
                {/* Email Field */}
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    placeholderTextColor="#aaa"
                    onChangeText={setEmail}
                    value={email}
                />
                
                {/* Password Field */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        placeholderTextColor="#aaa"
                        secureTextEntry={!isPasswordVisible}
                        onChangeText={setPassword}
                        value={password}
                    />
                    <TouchableOpacity style={styles.icon} onPress={togglePasswordVisibility}>
                        <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={20} color="#aaa" />
                    </TouchableOpacity>
                </View>
                
                {/* Confirm Password Field */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.inputWithIcon}
                        placeholder="Confirm your password"
                        placeholderTextColor="#aaa"
                        secureTextEntry={!isConfirmPasswordVisible}
                        onChangeText={setConfirmPassword}
                        value={confirmPassword}
                    />
                    <TouchableOpacity style={styles.icon} onPress={toggleConfirmPasswordVisibility}>
                        <Ionicons name={isConfirmPasswordVisible ? 'eye-off' : 'eye'} size={20} color="#aaa" />
                    </TouchableOpacity>
                </View>

                {/* Sign Up Button */}
                <TouchableOpacity style={styles.button} onPress={signUp}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>

                {/* Login Redirect */}
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
    inputContainer: {
        width: '100%',
        marginVertical: 10,
        position: 'relative',
    },
    inputWithIcon: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#fff',
        fontSize: 16,
        paddingRight: 40, // Ensure enough space for the icon
    },
    icon: {
        position: 'absolute',
        right: 15,
        top: '50%',
        transform: [{ translateY: -10 }], // Center the icon vertically
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
    signupText: {
        color: '#007bff',
        fontSize: 16,
    },
});

export default Signup;
