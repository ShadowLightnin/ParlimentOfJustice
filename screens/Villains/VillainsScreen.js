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
    desktopWidth: 260,
    desktopHeight: 260,
    primeShadowColor: '#800080',      // Purple for card shadow in Prime
    pinnacleShadowColor: '#4b0082',   // Corrupted purple for card shadow in Pinnacle
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
    desktopWidth: 260,
    desktopHeight: 260,
    primeShadowColor: '#b8860b',      // Ominous gold for card shadow in Prime
    pinnacleShadowColor: '#4b0082',   // Corrupted purple for card shadow in Pinnacle
  },
  {
    name: 'Villain Fleet',
    screen: 'VillainFleet',
    clickable: true,
    image: require('../../assets/BackGround/VillainShipYard.jpg'),
    mobileWidth: 160,
    mobileHeight: 170,
    desktopWidth: 320,
    desktopHeight: 260,
    primeShadowColor: '#ff0000',      // Red for card shadow in Prime
    pinnacleShadowColor: '#4b0082',   // Corrupted purple for card shadow in Pinnacle
  },
  {
    name: 'Other Worldly',
    screen: 'DemonsSection',
    clickable: true,
    image: require('../../assets/BackGround/OtherWorldly.jpg'),
    mobileWidth: 190,
    mobileHeight: 180,
    desktopWidth: 340,
    desktopHeight: 280,
    primeShadowColor: '#ff4500',      // Fiery orange-red for card shadow in Prime
    pinnacleShadowColor: '#4b0082',   // Corrupted purple for card shadow in Pinnacle
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

  const goHome = () => {
    navigation.navigate('Home');
  };

  return (
    <ImageBackground
      source={require('../../assets/BackGround/VillainsHub.jpg')}
      style={styles.background}
    >
      {/* Dim + glass overlay */}
      <View style={styles.overlay}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header and Back Button Row */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={goHome} style={styles.backButton}>
              <Text style={styles.backButtonText}>⬅️</Text>
            </TouchableOpacity>

            <View style={styles.titleBlock}>
              <Text style={styles.titleLabel}>
                {isYourUniverse ? 'Prime Universe' : 'Pinnacle Universe'}
              </Text>
              <Text style={styles.header}>
                {isYourUniverse ? 'The Enlightened' : 'The Darkness'}
              </Text>
            </View>

            {/* Spacer to balance back button width */}
            <View style={styles.headerSpacer} />
          </View>

          {/* Subtle divider */}
          <View style={styles.headerDivider} />

          {/* Cards Layout */}
          <View style={styles.cardContainer}>
            {/* Top Row: Villains and Big Bads */}
            <View style={styles.topRow}>
              {villainsFactions.slice(0, 2).map((item) => (
                <Card
                  key={item.name}
                  image={item.image}
                  name={isYourUniverse || !item.pinnacleName ? item.name : item.pinnacleName}
                  onPress={() => {
                    navigation.navigate(
                      isYourUniverse || !item.pinnacleScreen ? item.screen : item.pinnacleScreen
                    );
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

            {/* Middle Row: Villain Fleet */}
            <View style={styles.middleRow}>
              <Card
                image={villainsFactions[2].image}
                name={villainsFactions[2].name}
                onPress={() => navigation.navigate(villainsFactions[2].screen)}
                mobileWidth={villainsFactions[2].mobileWidth}
                mobileHeight={villainsFactions[2].mobileHeight}
                desktopWidth={villainsFactions[2].desktopWidth}
                desktopHeight={villainsFactions[2].desktopHeight}
                shadowColor={
                  isYourUniverse
                    ? villainsFactions[2].primeShadowColor
                    : villainsFactions[2].pinnacleShadowColor
                }
                isYourUniverse={isYourUniverse}
              />
            </View>

            {/* Bottom Row: Demons Section */}
            <View style={styles.bottomRow}>
              <Card
                image={villainsFactions[3].image}
                name={villainsFactions[3].name}
                onPress={() => navigation.navigate(villainsFactions[3].screen)}
                mobileWidth={villainsFactions[3].mobileWidth}
                mobileHeight={villainsFactions[3].mobileHeight}
                desktopWidth={villainsFactions[3].desktopWidth}
                desktopHeight={villainsFactions[3].desktopHeight}
                shadowColor={
                  isYourUniverse
                    ? villainsFactions[3].primeShadowColor
                    : villainsFactions[3].pinnacleShadowColor
                }
                isYourUniverse={isYourUniverse}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

// Card Component with Name Above + glass styling
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
      <Text
        style={[
          styles.factionTitle,
          {
            textShadowColor: isYourUniverse ? '#00b3ff' : '#da1cda',
          },
        ]}
      >
        {name}
      </Text>

      <TouchableOpacity
        style={[
          styles.card,
          {
            width: cardWidth,
            height: cardHeight,
            borderColor: shadowColor,
            shadowColor: shadowColor,
          },
        ]}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <Image source={image} style={styles.cardImage} />
        <View style={styles.cardGradientOverlay} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    alignItems: 'center',
    paddingTop: IS_DESKTOP ? 10 : 20,
  },
  scrollContent: {
    paddingBottom: 30,
    alignItems: 'center',
    width: '100%',
  },

  // HEADER
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    marginTop: HEADER_MARGIN_TOP,
  },
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  titleBlock: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  titleLabel: {
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.7)',
  },
  header: {
    fontSize: IS_DESKTOP ? 30 : 24,
    fontWeight: '900',
    color: '#630404',
    textAlign: 'center',
    textShadowColor: '#ff1c1c',
    textShadowRadius: 26,
    textShadowOffset: { width: 0, height: 0 },
  },
  headerSpacer: {
    width: 40, // visual balance with back button
  },
  headerDivider: {
    width: '80%',
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
    marginTop: 12,
    marginBottom: 10,
  },

  // CARD GRID
  cardContainer: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
    marginTop: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
    flexWrap: 'wrap',
  },
  middleRow: {
    alignItems: 'center',
    marginTop: 5,
  },
  bottomRow: {
    alignItems: 'center',
    marginTop: 5,
  },

  // CARD
  cardWrapper: {
    alignItems: 'center',
    marginBottom: 10,
  },
  factionTitle: {
    fontSize: IS_DESKTOP ? 18 : 14,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 6,
    textShadowRadius: 10,
  },
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 6,
    backgroundColor: 'rgba(10, 10, 10, 0.78)', // glassy dark
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.7,
    shadowRadius: 16,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardGradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
});

export default VillainsScreen;
