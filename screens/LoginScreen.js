import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import upload from '../lib/upload';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../context/auth-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isWide = SCREEN_WIDTH > 700;

const backgroundImages = [
  require('../assets/BackGround/Parliament.jpg'),
  require('../assets/BackGround/Titans.jpg'),
  require('../assets/BackGround/Eclipse.jpg'),
  require('../assets/BackGround/Olympians.jpg'),
  require('../assets/BackGround/Cobros.jpg'),
  require('../assets/BackGround/ASTC.jpg'),
  require('../assets/BackGround/Bludbruh2.jpg'),
  require('../assets/BackGround/RollingThunder.jpg'),
  require('../assets/BackGround/RangerSquad.jpg'),
  require('../assets/BackGround/Monke.jpg'),
  require('../assets/BackGround/Legionaires2.jpg'),
  require('../assets/BackGround/Legionaires.jpg'),
  require('../assets/BackGround/Forge.jpg'),
  require('../assets/BackGround/Constollation.jpg'),
  require('../assets/BackGround/ShipYard.jpg'),
  require('../assets/BackGround/Soldiers.jpg'),
  require('../assets/BackGround/Vigilantes.jpg'),
  require('../assets/BackGround/Justice.jpg'),
  require('../assets/BackGround/VillainsHub.jpg'),
  require('../assets/BackGround/Villains.jpg'),
  require('../assets/BackGround/VillainShipYard.jpg'),
  require('../assets/BackGround/BigBad.jpg'),
  require('../assets/BackGround/NateEmblem.jpg'),
  require('../assets/BackGround/Enlightened.jpg'),
  require('../assets/BackGround/PowerBorn.jpg'),
  require('../assets/BackGround/PowerTitans.jpg'),
  require('../assets/BackGround/PowerMonke.jpg'),
  require('../assets/BackGround/Power.jpg'),
];

const LoginScreen = () => {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);

  const [avatar, setAvatar] = useState({ file: null, url: '' });

  // 🔐 SEPARATE state for login vs signup so they don't overwrite each other
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [username, setUsername] = useState('');

  const [loading, setLoading] = useState(false);

  // Animated background
  const fadeAnim = useState(new Animated.Value(1))[0];
  const [bgIndex, setBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 0, duration: 20, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]).start();

      setBgIndex(prev => (prev + 1) % backgroundImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [fadeAnim]);

  const handleAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
      });

      if (!result.canceled) {
        setAvatar({
          file: result.assets[0].uri,
          url: result.assets[0].uri,
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
      const imgUrl = avatar.file ? await upload(avatar.file) : './avatar.png';

      // use signupEmail / signupPassword ONLY for registration
      const res = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);

      await setDoc(doc(db, 'users', res.user.uid), {
        username,
        email: signupEmail,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });

      await setDoc(doc(db, 'userchats', res.user.uid), { chats: [] });

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
      // use loginEmail / loginPassword ONLY for sign in
      const res = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
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

  const renderGlassButton = (label, onPress, variant = 'primary') => (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      style={[
        styles.button,
        variant === 'secondary' && styles.buttonSecondary,
        loading && styles.buttonDisabled,
      ]}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>{loading ? 'Loading…' : label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.wrapper}>
      {/* Animated Background */}
      <Animated.Image
        source={backgroundImages[bgIndex]}
        style={[styles.background, { opacity: fadeAnim }]}
        resizeMode="cover"
        pointerEvents="none"
      />

      {/* Dark glass overlay over everything */}
      <View style={styles.screenOverlay} />

      {/* Content */}
      <View style={styles.content}>
        <View style={[styles.card, isWide && styles.cardWide]}>
          {/* LEFT: Sign In */}
          <View style={[styles.column, isWide && styles.columnSplit]}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subTitle}>Sign in to the Parliament</Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="rgba(226,232,240,0.6)"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setLoginEmail}
              value={loginEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="rgba(226,232,240,0.6)"
              secureTextEntry
              onChangeText={setLoginPassword}
              value={loginPassword}
            />

            {renderGlassButton('Sign In', handleLogin, 'primary')}
          </View>

          {/* Divider */}
          {/* <View style={styles.verticalDivider} /> */}

          {/* RIGHT: Sign Up */}
          <View style={[styles.column, isWide && styles.columnSplit]}>
            <Text style={styles.title}>Create an Account</Text>
            <Text style={styles.subTitle}>Join the Parliament roster</Text>

            <TouchableOpacity onPress={handleAvatar} activeOpacity={0.85} style={styles.avatarWrapper}>
              <Image
                source={avatar.url ? { uri: avatar.url } : require('../assets/coolApple.jpeg')}
                style={styles.avatar}
              />
              <Text style={styles.avatarText}>Upload Image (Optional)</Text>
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="First and Last name"
              placeholderTextColor="rgba(226,232,240,0.6)"
              onChangeText={setUsername}
              value={username}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="rgba(226,232,240,0.6)"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setSignupEmail}
              value={signupEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="rgba(226,232,240,0.6)"
              secureTextEntry
              onChangeText={setSignupPassword}
              value={signupPassword}
            />

            {renderGlassButton('Sign Up', handleRegister, 'secondary')}
          </View>
        </View>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#38BDF8" />
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#020617',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  screenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,23,42,0.75)',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  card: {
    width: '95%',
    maxWidth: 900,
    borderRadius: 24,
    padding: 18,
    flexDirection: 'column',
    backgroundColor: 'rgba(15,23,42,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.55)',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.35,
    shadowRadius: 32,
    elevation: 16,
  },
  cardWide: {
    flexDirection: 'row',
    paddingHorizontal: 26,
    paddingVertical: 24,
  },

  column: {
    // flex: 1,
    alignItems: 'stretch',
  },
  columnSplit: {
    paddingHorizontal: 8,
  },

  verticalDivider: {
    width: 1,
    backgroundColor: 'rgba(148,163,184,0.5)',
    marginVertical: 8,
    marginHorizontal: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#E5F2FF',
    marginBottom: 4,
    textShadowColor: 'rgba(15,23,42,0.9)',
    textShadowRadius: 10,
  },
  subTitle: {
    fontSize: 13,
    color: 'rgba(226,232,240,0.85)',
    marginBottom: 14,
  },

  input: {
    backgroundColor: 'rgba(15,23,42,0.9)',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#E5F2FF',
    marginVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.7)',
    fontSize: 14,
  },

  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#38BDF8',
    marginBottom: 6,
  },
  avatarText: {
    fontSize: 12,
    color: 'rgba(226,232,240,0.9)',
  },

  button: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(56,189,248,0.9)', // cyan
    borderWidth: 1,
    borderColor: 'rgba(125,211,252,0.9)',
  },
  buttonSecondary: {
    backgroundColor: 'rgba(139,92,246,0.9)', // violet
    borderColor: 'rgba(196,181,253,0.9)',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#0B1220',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 0.5,
  },

  loadingOverlay: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
});

export default LoginScreen;
