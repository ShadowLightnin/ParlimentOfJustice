import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Alert
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;

// Big Bads data with images, respective screens, and border colors
const bigBads = [
  { name: 'Obsian', screen: 'ObsidianScreen', image: require('../../assets/Villains/Obsidian.jpg'), clickable: true, borderColor: 'purple' },
  { name: 'Umbra Nex', screen: 'UmbraNexScreen', image: require('../../assets/Villains/UmbraNex.jpg'), clickable: true, borderColor: 'purple' },
  { name: 'Kaidan Vyros', screen: 'KaidanVyrosScreen', image: require('../../assets/Villains/KaidanVyros.jpg'), clickable: true, borderColor: 'purple' },
  { name: 'Stormshade', screen: 'StormshadeScreen', image: require('../../assets/Villains/Stormshade.jpg'), clickable: true, borderColor: 'purple' },
  { name: 'Void Conqueror', screen: 'VoidConquerorScreen', image: require('../../assets/Villains/Kharon.jpg'), clickable: true, borderColor: 'purple' },
  { name: 'Erevos', screen: 'ErevosScreen', image: require('../../assets/Villains/Erevos.jpg'), clickable: true, borderColor: 'gold' },
  { name: 'Almarra', screen: 'AlmarraScreen', image: require('../../assets/Villains/Almarra.jpg'), clickable: true, borderColor: 'purple' },
  { name: 'Vortigar', screen: 'VortigarScreen', image: require('../../assets/Villains/Vortigar.jpg'), clickable: true, borderColor: 'purple' },
  { name: 'Torath', screen: 'Torath', image: require('../../assets/Villains/Torath.jpg'), clickable: true, borderColor: 'purple' },
  { name: 'Hextator', screen: '', image: require('../../assets/Villains/Hextator.jpg'), clickable: true, borderColor: null, hardcoded: true },
  { name: 'Lord Dravak', screen: '', image: require('../../assets/Villains/Dravak.jpg'), clickable: false, borderColor: null },
  { name: 'Arcane Devos', screen: 'VortigarScreen', image: require('../../assets/Villains/Devos.jpg'), clickable: false, borderColor: null },
  { name: 'Archon Ultivax', screen: '', image: require('../../assets/Villains/Ultivax.jpg'), clickable: false, borderColor: null },
  { name: 'Sovereign Xal-Zor', screen: '', image: require('../../assets/Villains/XalZor.jpg'), clickable: false, borderColor: null },
  { name: 'Emperor Obsidian', screen: '', image: require('../../assets/Villains/EmperorObsidian.jpg'), clickable: false, borderColor: null },
  { name: 'Admiral Scyphos', screen: '', image: require('../../assets/Villains/Scyphos.jpg'), clickable: false, borderColor: null },
  { name: 'Admiral', screen: '', image: require('../../assets/Villains/Admiral.jpg'), clickable: false, borderColor: null },
  { name: "Zein'roe", screen: '', image: require('../../assets/Villains/Zeinroe.jpg'), clickable: false, borderColor: null },
  { name: 'Devoes', screen: '', image: require('../../assets/Villains/Devoes.jpg'), clickable: false, borderColor: null },
  { name: 'Cronos', screen: '', image: require('../../assets/Villains/Cronos.jpg'), clickable: false, borderColor: null },
  { name: "Cor'vas", screen: '', image: require('../../assets/Villains/Corvas.jpg'), clickable: false, borderColor: null },

  // { name: '', screen: '', image: require('../../assets/Villains/.jpg'), clickable: false },
];

// Card dimensions for desktop and mobile
const cardSizes = {
  desktop: { width: 400, height: 600 },
  mobile: { width: 350, height: 500 },
};

// Background music (shared across screens)
let backgroundSound = null;

const playTheme = async () => {
  if (!backgroundSound) {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/audio/BigThreat.mp4'),
        { shouldPlay: true, isLooping: true, volume: 0.7 }
      );
      backgroundSound = sound;
      await sound.playAsync();
      console.log('BigThreat.mp4 started playing at:', new Date().toISOString());
    } catch (error) {
      console.error('Failed to load audio file:', error);
      Alert.alert('Audio Error', 'Failed to load background music: ' + error.message);
    }
  } else if (!isPlaying) {
    try {
      await backgroundSound.playAsync();
      setIsPlaying(true);
      console.log('Audio resumed at:', new Date().toISOString());
    } catch (error) {
      console.error('Error resuming sound:', error);
    }
  }
};

const pauseTheme = async () => {
  if (backgroundSound && isPlaying) {
    try {
      await backgroundSound.pauseAsync();
      setIsPlaying(false);
      console.log('Audio paused at:', new Date().toISOString());
    } catch (error) {
      console.error('Error pausing sound:', error);
    }
  }
};

const stopBackgroundMusic = async () => {
  if (backgroundSound) {
    try {
      await backgroundSound.stopAsync();
      await backgroundSound.unloadAsync();
      backgroundSound = null;
      console.log('BigThreat.mp4 stopped at:', new Date().toISOString());
    } catch (error) {
      console.error('Error stopping/unloading sound:', error);
    }
  }
};

const BigBadsTab = () => {
  const navigation = useNavigation();
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Handle audio based on focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (currentSound) {
          currentSound.stopAsync().catch((error) => console.error('Error stopping sound:', error));
          currentSound.unloadAsync().catch((error) => console.error('Error unloading sound:', error));
          setCurrentSound(null);
          setIsPlaying(false);
          console.log('BigThreat.mp4 stopped at:', new Date().toISOString());
        }
      };
    }, [currentSound])
  );

  // Handle big bad card press
  const handleBigBadPress = async (bigBad) => {
    if (bigBad.clickable && bigBad.screen) {
      if (currentSound) {
        try {
          await currentSound.stopAsync();
          await currentSound.unloadAsync();
          setCurrentSound(null);
          setIsPlaying(false);
          console.log('BigThreat.mp4 stopped at:', new Date().toISOString());
        } catch (error) {
          console.error('Error stopping/unloading sound:', error);
        }
      }
      navigation.navigate(bigBad.screen);
    }
  };

  // Render Each Big Bad Card
  const renderBigBadCard = (bigBad) => (
    <TouchableOpacity
      key={bigBad.name}
      style={[
        styles.card,
        {
          width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
          height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height
        },
        bigBad.clickable && bigBad.borderColor ? styles.clickable(bigBad.borderColor) : styles.notClickable
      ]}
      onPress={() => handleBigBadPress(bigBad)}
      disabled={!bigBad.clickable}
    >
      <Image source={bigBad.image} style={styles.image} />
      <View style={styles.transparentOverlay} />
      <Text style={styles.name}>{bigBad.name}</Text>
      {!bigBad.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/BackGround/BigBad.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={async () => {
            if (currentSound) {
              try {
                await currentSound.stopAsync();
                await currentSound.unloadAsync();
                setCurrentSound(null);
                setIsPlaying(false);
                console.log('BigThreat.mp4 stopped at:', new Date().toISOString());
              } catch (error) {
                console.error('Error stopping/unloading sound:', error);
              }
            }
            navigation.navigate('Villains');
          }}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>⬅️ Back</Text>
        </TouchableOpacity>

        {/* Title */}
        <TouchableOpacity
          onPress={() => navigation.navigate('BigBoss')}
        >
          <Text style={styles.header}>Big Bads</Text>
        </TouchableOpacity>

        {/* Music Controls */}
        <View style={styles.musicControls}>
          <TouchableOpacity style={styles.musicButton} onPress={playTheme}>
            <Text style={styles.musicButtonText}>Theme</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.musicButton} onPress={pauseTheme}>
            <Text style={styles.musicButtonText}>Pause</Text>
          </TouchableOpacity>
        </View>

        {/* Horizontal Scrollable Cards */}
        <View style={styles.scrollWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={[styles.scrollContainer, { gap: isDesktop ? 40 : 20 }]}
          >
            {bigBads.map(renderBigBadCard)}
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
    paddingHorizontal: 20,
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
    color: '#1b084d',
    textAlign: 'center',
    textShadowColor: '#9561f5',
    textShadowRadius: 25,
    marginBottom: 20,
  },
  musicControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  musicButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  musicButtonText: {
    fontSize: 12,
    color: '#8800ff',
    fontWeight: 'bold',
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
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  clickable: (borderColor) => ({
    borderColor: borderColor || 'purple',
    borderWidth: 2,
  }),
  notClickable: {
    opacity: 0.5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1,
  },
  name: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  disabledText: {
    fontSize: 12,
    color: '#ff4444',
    marginTop: 5,
  },
});

export default BigBadsTab;