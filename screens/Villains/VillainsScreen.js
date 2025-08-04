import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screen dimensions
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const IS_DESKTOP = SCREEN_WIDTH > 600; // Desktop width breakpoint

// Dynamic spacing for mobile and larger screens
const HEADER_MARGIN_TOP = IS_DESKTOP ? 20 : 30;

// Villains factions data with pinnacleScreen and shadow colors
const villainsFactions = [
  {
    name: 'Villains',
    pinnacleName: 'The Darkness: Villains',
    screen: 'VillainsTab',
    pinnacleScreen: 'PowerVillains',
    clickable: true,
    image: require('../../assets/BackGround/Villains.jpg'),
    mobileWidth: 140,
    mobileHeight: 160,
    desktopWidth: 290,
    desktopHeight: 300,
    primeShadowColor: '#800080', // Purple for card shadow in Prime
    pinnacleShadowColor: '#4b0082', // Corrupted purple for card shadow in Pinnacle
  },
  {
    name: 'Big Bads',
    pinnacleName: 'The Darkness: Big Bads',
    screen: 'BigBadsTab',
    pinnacleScreen: 'PowerBoss',
    clickable: true,
    image: require('../../assets/BackGround/BigBad.jpg'),
    mobileWidth: 140,
    mobileHeight: 160,
    desktopWidth: 290,
    desktopHeight: 300,
    primeShadowColor: '#b8860b', // Ominous gold for card shadow in Prime
    pinnacleShadowColor: '#4b0082', // Corrupted purple for card shadow in Pinnacle
  },
  {
    name: 'Villain Fleet',
    screen: 'VillainFleet',
    clickable: true,
    image: require('../../assets/BackGround/VillainShipYard.jpg'),
    mobileWidth: 140,
    mobileHeight: 160,
    desktopWidth: 290,
    desktopHeight: 300,
    primeShadowColor: '#ff0000', // Red for card shadow in Prime
    pinnacleShadowColor: '#4b0082', // Corrupted purple for card shadow in Pinnacle
  },
  {
    name: 'Demons Section',
    screen: 'DemonsSection',
    clickable: true,
    image: require('../../assets/BackGround/NateEmblem.jpg'),
    mobileWidth: 180,
    mobileHeight: 160,
    desktopWidth: 340,
    desktopHeight: 400,
    primeShadowColor: '#ff4500', // Fiery orange-red for card shadow in Prime
    pinnacleShadowColor: '#4b0082', // Corrupted purple for card shadow in Pinnacle
  },
];

const VillainsScreen = () => {
  const navigation = useNavigation();
  const [isYourUniverse, setIsYourUniverse] = useState(true);

  // Load universe preference on mount, default to Prime
  useEffect(() => {
    const loadUniversePreference = async () => {
      try {
        const savedUniverse = await AsyncStorage.getItem('selectedUniverse');
        setIsYourUniverse(savedUniverse ? savedUniverse === 'your' : true);
      } catch (error) {
        console.error('Error loading universe preference:', error);
        setIsYourUniverse(true);
      }
    };
    loadUniversePreference();
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/BackGround/VillainsHub.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          {/* Header and Back Button Row */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Home')}
              style={styles.backButton}
            >
              <Text style={styles.backButtonText}>⬅️</Text>
            </TouchableOpacity>
            <Text style={styles.header}>
              {isYourUniverse ? 'The Enlightened' : 'The Darkness'}
            </Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Three-Row Layout */}
          <View style={styles.cardContainer}>
            {/* Top Row: Villains and Big Bads */}
            <View style={styles.topRow}>
              {villainsFactions.slice(0, 2).map((item) => (
                <Card
                  key={item.name}
                  image={item.image}
                  name={isYourUniverse || !item.pinnacleName ? item.name : item.pinnacleName}
                  onPress={() => {
                    navigation.navigate(isYourUniverse || !item.pinnacleScreen ? item.screen : item.pinnacleScreen);
                  }}
                  mobileWidth={item.mobileWidth}
                  mobileHeight={item.mobileHeight}
                  desktopWidth={item.desktopWidth}
                  desktopHeight={item.desktopHeight}
                  shadowColor={isYourUniverse ? item.primeShadowColor : item.pinnacleShadowColor}
                  isYourUniverse={isYourUniverse}
                />
              ))}
            </View>

            {/* Middle Row: Ships */}
            <View style={styles.middleRow}>
              <Card
                image={villainsFactions[2].image}
                name={villainsFactions[2].name}
                onPress={() => navigation.navigate(villainsFactions[2].screen)}
                mobileWidth={villainsFactions[2].mobileWidth}
                mobileHeight={villainsFactions[2].mobileHeight}
                desktopWidth={villainsFactions[2].desktopWidth}
                desktopHeight={villainsFactions[2].desktopHeight}
                shadowColor={isYourUniverse ? villainsFactions[2].primeShadowColor : villainsFactions[2].pinnacleShadowColor}
                isYourUniverse={isYourUniverse}
              />
            </View>

            {/* Bottom Row: Demons */}
            <View style={styles.bottomRow}>
              <Card
                image={villainsFactions[3].image}
                name={villainsFactions[3].name}
                onPress={() => navigation.navigate(villainsFactions[3].screen)}
                mobileWidth={villainsFactions[3].mobileWidth}
                mobileHeight={villainsFactions[3].mobileHeight}
                desktopWidth={villainsFactions[3].desktopWidth}
                desktopHeight={villainsFactions[3].desktopHeight}
                shadowColor={isYourUniverse ? villainsFactions[3].primeShadowColor : villainsFactions[3].pinnacleShadowColor}
                isYourUniverse={isYourUniverse}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

// Card Component with Name Above
const Card = ({
  image,
  name,
  onPress,
  mobileWidth,
  mobileHeight,
  desktopWidth,
  desktopHeight,
  shadowColor,
  isYourUniverse,
}) => {
  const cardWidth = IS_DESKTOP ? desktopWidth : mobileWidth;
  const cardHeight = IS_DESKTOP ? desktopHeight : mobileHeight;

  return (
    <View style={styles.cardWrapper}>
      <Text style={[styles.factionTitle, { textShadowColor: isYourUniverse ? '#00b3ff' : '#800080' }]}>{name}</Text>
      <TouchableOpacity
        style={[
          styles.card,
          { 
            width: cardWidth, 
            height: cardHeight, 
            borderColor: shadowColor, 
            shadowColor: shadowColor,
            backgroundColor: `rgba(${parseInt(shadowColor.slice(1, 3), 16)}, ${parseInt(shadowColor.slice(3, 5), 16)}, ${parseInt(shadowColor.slice(5, 7), 16)}, 0.1)`,
            borderWidth: 2,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 10,
          }
        ]}
        onPress={onPress}
      >
        <Image source={image} style={styles.cardImage} />
        <View style={styles.transparentOverlay} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    paddingTop: IS_DESKTOP ? 20 : 30,
  },
  scrollContent: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: HEADER_MARGIN_TOP,
  },
  backButton: {
    backgroundColor: '#750000',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    elevation: 5,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flex: 1,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#630404',
    textAlign: 'center',
    textShadowColor: '#ff1c1c',
    textShadowRadius: 30,
  },
  headerSpacer: {
    width: 60, // Matches back button width for symmetry
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
    marginTop: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  middleRow: {
    alignItems: 'center',
    marginTop: 5,
  },
  bottomRow: {
    alignItems: 'center',
    marginTop: 5,
  },
  cardWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)', // No overlay color, just for interaction
    zIndex: 1,
  },
  factionTitle: {
    fontSize: IS_DESKTOP ? 20 : 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
    textShadowRadius: 10,
  },
});

export default VillainsScreen;