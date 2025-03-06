import React, { useRef, useEffect } from 'react';
import { 
  View, Text, ImageBackground, TouchableOpacity, StyleSheet, FlatList, 
  useWindowDimensions, Animated, Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth } from '../api/firebaseConfig'; // Import Firebase Auth

const factions = [
  { name: 'The Titans', screen: 'Titans', clickable: true, image: require('../assets/BackGround/Titans.jpg') },
  { name: 'The Eclipse', screen: 'Eclipse', clickable: true, image: require('../assets/BackGround/Enforcers.jpg') },
  { name: 'Olympians', screen: 'Olympians', clickable: true, image: require('../assets/BackGround/Kin.jpg') },
  { name: 'Cobros', screen: 'Cobros', clickable: true, image: require('../assets/BackGround/Cobros.jpg') },
  { name: 'ASTC (Spartans)', screen: 'ASTC', clickable: true, image: require('../assets/BackGround/26.jpg') },
  { name: 'BludBruhs', screen: 'BludBruhs', clickable: true, image: require('../assets/BackGround/bludbruh.jpg') },
  { name: 'Legionaires', screen: 'Legionaires', clickable: true, image: require('../assets/BackGround/League.jpg') },
  { name: 'Constollation', screen: 'Constollation', clickable: true, image: require('../assets/BackGround/helldivers.webp') },
  { name: 'Designs', screen: 'Designs', clickable: true, image: require('../assets/BackGround/donut_hologram.png') },
];

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const numColumns = width > 600 ? 3 : 2; // Use 3 columns if screen width > 600px, otherwise 2
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400, // Smooth transition
      useNativeDriver: true,
    }).start();
  }, [numColumns]);

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login'); // Redirect to Start screen after logout
    } catch (error) {
      Alert.alert('Logout Failed', error.message);
    }
  };

  // Navigate to Chat Screen
  const goToChat = () => {
    navigation.navigate('PublicChat'); // Ensure 'Chat' screen is registered in App.js
  };

  const renderFaction = ({ item }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        style={[styles.card, { width: width / numColumns - 30 }, !item.clickable && styles.disabledCard]}
        onPress={() => item.clickable && navigation.navigate(item.screen)}
        disabled={!item.clickable}
      >
        <ImageBackground source={item.image} style={styles.imageBackground} imageStyle={styles.imageOverlay}>
          <Text style={styles.factionName}>{item.name}</Text>
          {!item.clickable && <Text style={styles.disabledText}>Not Clickable at the moment</Text>}
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <ImageBackground source={require('../assets/BackGround/superhero.jpg')} style={styles.background}>
      <View style={styles.container}>
        {/* Header and Buttons */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
            <Text style={styles.chatText}>🗨️</Text>
          </TouchableOpacity>
          <Text style={styles.header}>The Parliament of Justice</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>🚪</Text>
          </TouchableOpacity>
        </View>

        {/* Factions List */}
        <FlatList
          data={factions}
          keyExtractor={(item) => item.name}
          renderItem={renderFaction}
          numColumns={numColumns}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  topBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#00b3ff',
    textShadowRadius: 10,
  },
  listContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  card: {
    aspectRatio: 1.3,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    opacity: 0.9,
  },
  factionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'black',
    textShadowRadius: 5,
  },
  disabledCard: {
    backgroundColor: '#555',
  },
  disabledText: {
    fontSize: 12,
    color: '#ff4444',
    marginTop: 5,
  },
  chatButton: {
    padding: 10,
    borderRadius: 8,
  },
  chatText: {
    fontSize: 22,
    color: "white",
  },
  logoutButton: {
    padding: 10,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 22,
    color: "white",
  },
});
