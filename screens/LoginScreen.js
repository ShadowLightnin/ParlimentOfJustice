import React, { useState, useContext } from 'react';
import { View, Text, TextInput, Button, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import upload from '../lib/upload';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../context/auth-context'; // Import AuthContext

const LoginScreen = () => {
    const navigation = useNavigation();
    const authCtx = useContext(AuthContext); // Access AuthContext

    const [avatar, setAvatar] = useState({
        file: null,
        url: ""
    });
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAvatar = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions['Images'],
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled) {
                setAvatar({
                    file: result.assets[0].uri,
                    url: result.assets[0].uri
                });
            }
        } catch (error) {
            console.error(error);
            Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to pick an image.' });
        }
    };

    const handleRegister = async () => {
        setLoading(true);
        try {
            const imgUrl = avatar.file ? await upload(avatar.file) : "./avatar.png";
            const res = await createUserWithEmailAndPassword(auth, email, password);

            await setDoc(doc(db, "users", res.user.uid), {
                username,
                email,
                avatar: imgUrl,
                id: res.user.uid,
                blocked: [],
            });

            await setDoc(doc(db, "userchats", res.user.uid), {
                chats: []
            });

            // Update AuthContext with the token
            const token = await res.user.getIdToken();
            authCtx.authenticate(token);

            Toast.show({ type: 'success', text1: 'Success', text2: 'Account created! Welcome!' });
            // navigation.navigate('Home'); // No need to navigate manually now
        } catch (err) {
            console.error(err);
            Toast.show({ type: 'error', text1: 'Error', text2: err.message });
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        setLoading(true);
        try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            const token = await res.user.getIdToken(); // Get the Firebase ID token
            authCtx.authenticate(token); // Update AuthContext with the token

            Toast.show({ type: 'success', text1: 'Success', text2: 'Welcome back!' });
            // navigation.navigate('Home'); // No need to navigate manually now
        } catch (err) {
            console.error(err);
            Toast.show({ type: 'error', text1: 'Error', text2: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.login}>
                <Text style={styles.title}>Welcome back</Text>
                <TextInput 
                    style={styles.input} 
                    placeholder='Email' 
                    autoCapitalize='none' 
                    onChangeText={(text) => setEmail(text)} 
                />
                <TextInput 
                    style={styles.input} 
                    placeholder='Password' 
                    secureTextEntry 
                    onChangeText={(text) => setPassword(text)} 
                />
                <Button title={loading ? "Loading..." : "Sign In"} onPress={handleLogin} disabled={loading} />
            </View>

            <View style={styles.separator} />

            <View style={styles.signup}>
                <Text style={styles.title}>Create an Account</Text>
                <TouchableOpacity onPress={handleAvatar}>
                    <Image
                        source={{ uri: avatar.url || "https://example.com/default-avatar.png" }}
                        style={styles.avatar}
                    />
                    <Text>Upload Image (Optional)</Text>
                </TouchableOpacity>

                <TextInput 
                    style={styles.input} 
                    placeholder='First and Last name' 
                    onChangeText={(text) => setUsername(text)} 
                />
                <TextInput 
                    style={styles.input} 
                    placeholder='Email' 
                    autoCapitalize='none' 
                    onChangeText={(text) => setEmail(text)} 
                />
                <TextInput 
                    style={styles.input} 
                    placeholder='Password' 
                    secureTextEntry 
                    onChangeText={(text) => setPassword(text)} 
                />
                <Button title={loading ? "Loading..." : "Sign Up"} onPress={handleRegister} disabled={loading} />
            </View>

            {loading && <ActivityIndicator size="large" color="#fff" />}
        </View>
    );
};

// Styles remain unchanged
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#121828',
    },
    title: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
        marginBottom: 10
    },
    input: {
        backgroundColor: '#222',
        color: 'white',
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#fff',
        marginVertical: 10,
    },
    separator: {
        height: 1,
        backgroundColor: '#555',
        marginVertical: 20,
    }
});

export default LoginScreen;