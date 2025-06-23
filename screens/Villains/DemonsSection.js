import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  ImageBackground
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;
const cardSize = isDesktop ? 400 : 300;

// Demon factions data
const demonFactions = [
  { name: 'Skinwalkers', screen: 'SkinwalkerScreen', image: require('../../assets/BackGround/Skinwalkers.jpg'), clickable: true },
  { name: 'Weeping Angels', screen: 'StatuesScreen', image: require('../../assets/BackGround/Statue.jpg'), clickable: true },
  { name: 'Oni', screen: 'OniScreen', image: require('../../assets/BackGround/Oni.jpg'), clickable: true },
  { name: 'Aliens', screen: 'AliensScreen', image: require('../../assets/BackGround/Aliens.jpg'), clickable: true },
  { name: 'Metalmen', screen: 'RobotsScreen', image: require('../../assets/BackGround/Robots.jpg'), clickable: true },
  { name: 'Ghosts', screen: 'GhostsScreen', image: require('../../assets/BackGround/Ghosts2.jpg'), clickable: true },
  { name: 'Bugs', screen: 'BugsScreen', image: require('../../assets/BackGround/Bugs.jpg'), clickable: true },
  { name: 'Pirates', screen: 'PiratesScreen', image: require('../../assets/BackGround/Pirates.jpg'), clickable: true },
];

const DemonsSectionScreen = () => {
  const navigation = useNavigation();
  const [currentSound, setCurrentSound] = useState(null);
  const [pausedPosition, setPausedPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Initialize sound on first mount
  useEffect(() => {
    const loadSound = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/audio/HelldiverForEarth.mp4'),
        { shouldPlay: true, isLooping: false, volume: 1.0 }
      );
      setCurrentSound(sound);
    };

    loadSound();

    // Cleanup sound on unmount
    return () => {
      if (currentSound) {
        currentSound.stopAsync();
        currentSound.unloadAsync();
        setCurrentSound(null);
      }
    };
  }, []);

  // Handle screen focus to resume audio
  useFocusEffect(
    useCallback(() => {
      const resumeSound = async () => {
        if (currentSound && isPaused && pausedPosition >= 0) {
          await currentSound.setPositionAsync(pausedPosition);
          await currentSound.playAsync();
          setIsPaused(false);
        }
      };

      resumeSound();

      return () => {
        if (currentSound) {
          currentSound.pauseAsync().then(async () => {
            const status = await currentSound.getStatusAsync();
            setPausedPosition(status.positionMillis || 0);
            setIsPaused(true);
          });
        }
      };
    }, [currentSound, isPaused, pausedPosition])
  );

  // Pause audio and save position before navigating to faction screen
  const handleFactionPress = async (faction) => {
    if (faction.clickable && currentSound) {
      const status = await currentSound.getStatusAsync();
      if (status.isPlaying) {
        await currentSound.pauseAsync();
        setPausedPosition(status.positionMillis || 0);
        setIsPaused(true);
      }
      navigation.navigate(faction.screen);
    }
  };

  // Stop audio before navigating back
  const handleBackPress = async () => {
    if (currentSound) {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      setCurrentSound(null);
      setPausedPosition(0);
      setIsPaused(false);
    }
    navigation.goBack();
  };

  // Render each faction card
  const renderFactionCard = (faction) => (
    <TouchableOpacity
      key={faction.name}
      style={[
        styles.factionCard,
        { width: cardSize, height: cardSize * 1.2 + 60 }, // Extra height for text
        faction.clickable ? styles.clickable : styles.notClickable
      ]}
      onPress={() => handleFactionPress(faction)}
      disabled={!faction.clickable}
    >
      <Image
        source={faction.image}
        style={[styles.factionImage, { width: cardSize, height: cardSize * 1.2 }]}
      />
      
      {/* Transparent Overlay for Image Protection */}
      <View style={styles.transparentOverlay} />

      <View style={styles.textContainer}>
        <Text style={styles.factionName}>{faction.name}</Text>
        {!faction.clickable && <Text style={styles.disabledText}> </Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/BackGround/NateEmblem.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>⬅️</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.header}>⚡️ Demon Lords ⚡️</Text>

        {/* Horizontal Scrollable Cards */}
        <View style={styles.scrollWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={[styles.scrollContainer, { gap: isDesktop ? 40 : 20 }]}
          >
            {demonFactions.map(renderFactionCard)}
          </ScrollView>
        </View>
      </View>
    </ImageBackground>
  );
};

// Styles
const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingTop: 40,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#750000',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    elevation: 5,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'rgba(107, 9, 9, 1)',
    textAlign: 'center',
    textShadowColor: 'rgba(241, 99, 43, 1)',
    textShadowRadius: 20,
    marginBottom: 20,
  },
  scrollWrapper: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  scrollContainer: {
    flexDirection: 'row',
    flexGrow: 1,
    width: 'auto',
    paddingVertical: 20,
    alignItems: 'center',
  },
  factionCard: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: 'rgba(0, 0, 0, 0)', // Transparent to remove red background
    alignItems: 'center',
    marginRight: 20,
  },
  clickable: {
    borderColor: 'transparent',
    borderWidth: 4,
  },
  notClickable: {
    opacity: 0.7,
  },
  factionImage: {
    borderRadius: 15, // Match card border radius
    resizeMode: 'contain',
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1,
  },
  textContainer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  factionName: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  disabledText: {
    marginTop: 5,
    color: '#ff4444',
    fontSize: 14,
  },
});

export default DemonsSectionScreen;