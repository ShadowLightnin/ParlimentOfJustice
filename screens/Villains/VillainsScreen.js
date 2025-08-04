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

// Villains factions data with pinnacleScreen for alternate universe
const villainsFactions = [
  {
    name: 'Villains',
    screen: 'VillainsTab',
    pinnacleScreen: 'PowerVillains',
    clickable: true,
    image: require('../../assets/BackGround/Villains.jpg'),
    mobileWidth: 140,
    mobileHeight: 160,
    desktopWidth: 290,
    desktopHeight: 300,
  },
  {
    name: 'Big Bads',
    screen: 'BigBadsTab',
    pinnacleScreen: 'PowerBoss',
    clickable: true,
    image: require('../../assets/BackGround/BigBad.jpg'),
    mobileWidth: 140,
    mobileHeight: 160,
    desktopWidth: 290,
    desktopHeight: 300,
  },
  {
    name: 'Villain Ship Yard',
    screen: 'VillainFleet',
    clickable: true,
    image: require('../../assets/BackGround/VillainShipYard.jpg'),
    mobileWidth: 140,
    mobileHeight: 160,
    desktopWidth: 290,
    desktopHeight: 300,
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
            <Text style={styles.header}>  The Enlightened</Text>
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
                  onPress={() => {
                    navigation.navigate(isYourUniverse || !item.pinnacleScreen ? item.screen : item.pinnacleScreen);
                  }}
                  mobileWidth={item.mobileWidth}
                  mobileHeight={item.mobileHeight}
                  desktopWidth={item.desktopWidth}
                  desktopHeight={item.desktopHeight}
                />
              ))}
            </View>

            {/* Middle Row: Ships */}
            <View style={styles.middleRow}>
              <Card
                image={villainsFactions[2].image}
                onPress={() => navigation.navigate(villainsFactions[2].screen)}
                mobileWidth={villainsFactions[2].mobileWidth}
                mobileHeight={villainsFactions[2].mobileHeight}
                desktopWidth={villainsFactions[2].desktopWidth}
                desktopHeight={villainsFactions[2].desktopHeight}
              />
            </View>

            {/* Bottom Row: Demons */}
            <View style={styles.bottomRow}>
              <Card
                image={villainsFactions[3].image}
                onPress={() => navigation.navigate(villainsFactions[3].screen)}
                mobileWidth={villainsFactions[3].mobileWidth}
                mobileHeight={villainsFactions[3].mobileHeight}
                desktopWidth={villainsFactions[3].desktopWidth}
                desktopHeight={villainsFactions[3].desktopHeight}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

// Card Component with Transparent Overlay
const Card = ({
  image,
  onPress,
  mobileWidth,
  mobileHeight,
  desktopWidth,
  desktopHeight,
}) => {
  const cardWidth = IS_DESKTOP ? desktopWidth : mobileWidth;
  const cardHeight = IS_DESKTOP ? desktopHeight : mobileHeight;

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth, height: cardHeight }]}
      onPress={onPress}
    >
      <Image source={image} style={styles.cardImage} />
      {/* Transparent Overlay to Prevent Saving */}
      <View style={styles.transparentOverlay} />
    </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1, // Ensures overlay blocks saving but keeps interaction intact
  },
});

export default VillainsScreen;