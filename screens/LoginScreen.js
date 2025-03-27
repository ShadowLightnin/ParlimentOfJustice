import React, { useState, useContext, useEffect } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    Button, 
    Image, 
    TouchableOpacity, 
    ActivityIndicator, 
    StyleSheet, 
    Animated 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import upload from '../lib/upload';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../context/auth-context';

const backgroundImages = [
    require('../assets/BackGround/Parliment.png'),
    require('../assets/BackGround/TitansPlaceHolder.jpg'),
    require('../assets/BackGround/EclipsePlaceHolder.jpg'),
    require('../assets/BackGround/Olympians.jpg'),
    require('../assets/BackGround/Cobros.jpg'),
    require('../assets/BackGround/Bludbruh2.jpg'),
    require('../assets/BackGround/26.jpg'),
    require('../assets/BackGround/RangerSquad.jpg'),
    require('../assets/BackGround/Monke.jpg'),
    require('../assets/BackGround/League.jpg'),
    require('../assets/BackGround/Constollation.jpg'),
    require('../assets/BackGround/Justice.jpg'),
    require('../assets/BackGround/VillainsHub.jpg'),
    require('../assets/BackGround/Villains.jpg'),
    require('../assets/BackGround/BigBad.jpg'),
    require('../assets/BackGround/NateEmblem.jpg'),
    require('../assets/BackGround/Enlightened.jpg'),

];

const LoginScreen = () => {
    const navigation = useNavigation();
    const authCtx = useContext(AuthContext);

    const [avatar, setAvatar] = useState({ file: null, url: "" });
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);

    // Animated Background Logic
    const fadeAnim = useState(new Animated.Value(1))[0];
    const [bgIndex, setBgIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            Animated.sequence([
                Animated.timing(fadeAnim, { toValue: 0, duration: 10, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true })
            ]).start();

            setBgIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

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

            await setDoc(doc(db, "userchats", res.user.uid), { chats: [] });

            const token = await res.user.getIdToken();
            authCtx.authenticate(token);

            Toast.show({ type: 'success', text1: 'Success', text2: 'Account created! Welcome!' });
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
            const token = await res.user.getIdToken();
            authCtx.authenticate(token);

            Toast.show({ type: 'success', text1: 'Success', text2: 'Welcome back!' });
        } catch (err) {
            console.error(err);
            Toast.show({ type: 'error', text1: 'Error', text2: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.wrapper}>
            {/* Background Image with No Interaction */}
            <Animated.Image
                source={backgroundImages[bgIndex]}
                style={[styles.background, { opacity: fadeAnim }]}
                resizeMode="cover"
                pointerEvents="none"  // ✅ Prevents image saving without blocking UI
            />
    
            {/* Transparent Overlay for Image Protection */}
            <View style={styles.transparentOverlay} pointerEvents="box-none" />
    
            <View style={styles.container}>
                <View style={styles.login}>
                    <Text style={styles.title}>Welcome back</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder='Email' 
                        autoCapitalize='none' 
                        onChangeText={setEmail}
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder='Password' 
                        secureTextEntry 
                        onChangeText={setPassword} 
                    />
                    <Button title={loading ? "Loading..." : "Sign In"} onPress={handleLogin} disabled={loading} />
                </View>
    
                <View style={styles.separator} />
    
                <View style={styles.signup}>
                    <Text style={styles.title}>Create an Account</Text>
                    {/* <TouchableOpacity onPress={handleAvatar}> */}
                        <Image
                            source={{ uri: avatar.url || "https://example.com/default-avatar.png" }}
                            style={styles.avatar}
                        />
                        <Text style={styles.text}>Upload Image (Optional)</Text>
                    {/* </TouchableOpacity> */}
    
                    <TextInput 
                        style={styles.input} 
                        placeholder='First and Last name' 
                        onChangeText={setUsername} 
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder='Email' 
                        autoCapitalize='none' 
                        onChangeText={setEmail} 
                    />
                    <TextInput 
                        style={styles.input} 
                        placeholder='Password' 
                        secureTextEntry 
                        onChangeText={setPassword} 
                    />
                    <Button title={loading ? "Loading..." : "Sign Up"} onPress={handleRegister} disabled={loading} />
                </View>
    
                {loading && <ActivityIndicator size="large" color="#fff" />}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        position: 'relative'
    },
    background: {
        ...StyleSheet.absoluteFillObject, // Full-screen background
        width: '100%',                   // Ensures it scales appropriately
        height: '100%',                  // Covers the entire screen
        opacity: 0.5,                    // Slightly stronger fade effect for visibility
        resizeMode: 'contain',             // Ensures it scales proportionally
    },
    transparentOverlay: {
        ...StyleSheet.absoluteFillObject, // Covers the entire image
        backgroundColor: 'rgba(0, 0, 0, 0)', // Fully transparent
        zIndex: 1, // Ensures it sits above the image
        pointerEvents: 'box-none' // ✅ Blocks saving but allows UI interactions
    },    
    container: {
        flex: 1,
        width: '90%',                // More compact width to avoid stretching
        maxWidth: 400,               // Prevents it from becoming too wide on larger screens
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', // Transparent background
        borderRadius: 20,
        paddingVertical: 30,         // Added padding to create a spacious feel
        paddingHorizontal: 25,
        borderRadius: 20,
        alignSelf: 'center',         // Centers horizontally
        justifyContent: 'center',    // Centers vertically
        marginHorizontal: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 10,
        elevation: 5
    },
    title: {
        fontSize: 26,
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 15
    },
    text: {
        fontSize: 14,
        color: '#ddd',
        marginBottom: 5
    },
    input: {
        backgroundColor: '#222',
        color: 'white',
        padding: 10,
        borderRadius: 10,
        marginVertical: 5,
        width: '100%',
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
        height: 2,
        backgroundColor: '#555',
        marginVertical: 20,
        width: '80%'
    }
});

export default LoginScreen;
