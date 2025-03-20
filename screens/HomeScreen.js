import React, { useRef, useEffect, useContext } from 'react';
import { 
  View, Text, ImageBackground, TouchableOpacity, StyleSheet, FlatList, 
  Animated, Alert, Dimensions 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth } from '../api/firebaseConfig';
import { AuthContext } from '../context/auth-context';

// Screen dimensions
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// Desktop or Mobile
const isDesktop = SCREEN_WIDTH > 600;

// Adjustable Card Dimensions
const cardWidth = isDesktop ? 300 : 180; 
const cardHeight = isDesktop ? 240 : 140; 
const cardSpacing = isDesktop ? 30 : 5;

const factions = [
  { name: 'Titans', screen: 'Titans', clickable: true, image: require('../assets/BackGround/TitansPlaceHolder.jpg') },
  { name: 'Eclipse', screen: 'Eclipse', clickable: true, image: require('../assets/BackGround/EclipsePlaceHolder.jpg') },
  { name: 'Olympians', screen: 'Olympians', clickable: true, image: require('../assets/BackGround/Olympians.jpg') },
  { name: 'Cobros', screen: 'Cobros', clickable: true, image: require('../assets/BackGround/Cobros.jpg') },
  { name: 'ASTC (Spartans)', screen: 'ASTC', clickable: true, image: require('../assets/BackGround/26.jpg') },
  { name: 'BludBruhs', screen: 'BludBruhs', clickable: true, image: require('../assets/BackGround/Bludbruh2.jpg') },
  { name: 'Legionaires', screen: 'Legionaires', clickable: true, image: require('../assets/BackGround/League.jpg') },
  { name: 'Constollation', screen: 'Constollation', clickable: true, image: require('../assets/BackGround/Constollation.jpg') },
  { name: 'Designs', screen: 'Designs', clickable: true, image: require('../assets/BackGround/donut_hologram.png') },
  { name: 'Villains', screen: 'VillainsScreen', clickable: true, image: require('../assets/BackGround/VillainsHub.jpg') },
];

export const HomeScreen = () => {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const numColumns = isDesktop ? 3 : 2;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      authCtx.logout(); 
    } catch (error) {
      Alert.alert('Logout Failed', error.message);
    }
  };

  const goToChat = () => {
    navigation.navigate('PublicChat');
  };

  const renderFaction = ({ item }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.factionTitle}>
            {item.name ? item.name : ''}
          </Text>
       <TouchableOpacity
          style={[
            styles.card,
            { width: cardWidth, height: cardHeight, margin: cardSpacing / 2 },
            !item.clickable && styles.disabledCard
          ]}
          onPress={() => item.clickable && navigation.navigate(item.screen)}
          disabled={!item.clickable}
        >
          <ImageBackground source={item.image} style={styles.imageBackground} imageStyle={styles.imageOverlay}>
            {!item.clickable && <Text style={styles.disabledText}>Not Clickable at the moment</Text>}
          </ImageBackground>
        </TouchableOpacity>
    </Animated.View>
  );
  

  return (
    <ImageBackground source={require('../assets/BackGround/Parliment.png')} style={styles.background}>
      <View style={styles.container}>
        {/* Header and Buttons */}
        <View style={styles.topBar}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>🚪</Text>
          </TouchableOpacity>
          <Text style={styles.header}>The Parliament of Justice</Text>
          <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
            <Text style={styles.chatText}>🗨️</Text>
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
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
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
    fontSize: isDesktop ? 28 : 18,  // Larger for desktop, smaller for mobile
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#00b3ff',
    textShadowRadius: 10,
    textAlign: 'center',  // Ensures it’s centered across screen sizes
    flexShrink: 1,         // Prevents text overflow
  },
  listContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',  // Center the image inside the card
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    opacity: 0.9,
  },
  factionTitle: {
    fontSize: isDesktop ? 20 : 14, // Adjust for screen size
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5, // Adds spacing above the card
    textShadowColor: '#00b3ff',
    textShadowRadius: 10,
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
