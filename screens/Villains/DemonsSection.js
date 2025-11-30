import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Layout
const isDesktop = SCREEN_WIDTH > 600;
const cardSize = isDesktop ? 360 : 280;

// Demon factions data
const demonLords = [
  { name: 'Skinwalkers', screen: 'SkinwalkerScreen', image: require('../../assets/BackGround/Skinwalkers.jpg'), clickable: true },
  { name: 'Weeping Angels', screen: 'StatuesScreen', image: require('../../assets/BackGround/Statue.jpg'), clickable: true },
  { name: 'Oni', screen: 'OniScreen', image: require('../../assets/BackGround/Oni.jpg'), clickable: true },
  { name: 'Ghosts', screen: 'GhostsScreen', image: require('../../assets/BackGround/Ghosts2.jpg'), clickable: true },
  { name: 'Arcane Lords of Chaos', screen: '', image: require('../../assets/BackGround/ChaosLords.jpg'), clickable: true },
];

const otherEvilThreats = [
  { name: 'Aliens', screen: 'AliensScreen', image: require('../../assets/BackGround/Aliens.jpg'), clickable: true },
  { name: 'Metalmen', screen: 'RobotsScreen', image: require('../../assets/BackGround/Robots.jpg'), clickable: true },
  { name: 'Bugs', screen: 'BugsScreen', image: require('../../assets/BackGround/Bugs.jpg'), clickable: true },
  { name: 'Pirates', screen: 'PiratesScreen', image: require('../../assets/BackGround/Pirates.jpg'), clickable: true },
];

const DemonsSectionScreen = () => {
  const navigation = useNavigation();
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Handle music playback
  const playTheme = async () => {
    if (!currentSound) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/audio/HelldiverForEarth.mp4'),
          { shouldPlay: true, isLooping: false, volume: 1.0 }
        );
        setCurrentSound(sound);
        await sound.playAsync();
        setIsPlaying(true);
        console.log('HelldiverForEarth.mp4 started playing at:', new Date().toISOString());
      } catch (error) {
        console.error('Failed to load audio file:', error);
        Alert.alert('Audio Error', 'Failed to load background music: ' + error.message);
      }
    } else if (!isPlaying) {
      try {
        await currentSound.playAsync();
        setIsPlaying(true);
        console.log('Audio resumed at:', new Date().toISOString());
      } catch (error) {
        console.error('Error resuming sound:', error);
      }
    }
  };

  // Handle music pause
  const pauseTheme = async () => {
    if (currentSound && isPlaying) {
      try {
        await currentSound.pauseAsync();
        setIsPlaying(false);
        console.log('Audio paused at:', new Date().toISOString());
      } catch (error) {
        console.error('Error pausing sound:', error);
      }
    }
  };

  // Cleanup audio on blur/unmount
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (currentSound) {
          currentSound.stopAsync().catch((error) => console.error('Error stopping sound:', error));
          currentSound.unloadAsync().catch((error) => console.error('Error unloading sound:', error));
          setCurrentSound(null);
          setIsPlaying(false);
          console.log('HelldiverForEarth.mp4 stopped at:', new Date().toISOString());
        }
      };
    }, [currentSound])
  );

  // Navigate regardless of audio state; stop/unload if playing
  const handleFactionPress = async (faction) => {
    if (!faction.clickable || !faction.screen) return;

    try {
      if (currentSound) {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
        setCurrentSound(null);
        setIsPlaying(false);
        console.log('HelldiverForEarth.mp4 stopped at:', new Date().toISOString());
      }

      navigation.navigate(faction.screen);
    } catch (error) {
      console.error('Error in handleFactionPress:', error);
    }
  };

  // Pause audio before navigating back
  const handleBackPress = async () => {
    if (currentSound) {
      try {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
        setCurrentSound(null);
        setIsPlaying(false);
        console.log('HelldiverForEarth.mp4 stopped at:', new Date().toISOString());
      } catch (error) {
        console.error('Error in handleBackPress:', error);
      }
    }
    navigation.goBack();
  };

  // Render each faction card
  const renderFactionCard = (faction) => (
    <TouchableOpacity
      key={faction.name}
      style={[
        styles.factionCard,
        faction.clickable ? styles.cardClickable : styles.cardNotClickable,
      ]}
      onPress={() => handleFactionPress(faction)}
      disabled={!faction.clickable || !faction.screen}
      activeOpacity={0.9}
    >
      <Image
        source={faction.image}
        style={[styles.factionImage, { width: cardSize, height: cardSize * 1.25 }]}
      />

      {/* Dark gradient overlay on image */}
      <View style={styles.cardOverlay} />

      <View style={styles.textContainer}>
        <Text style={styles.factionName}>{faction.name}</Text>
        {!faction.clickable && (
          <Text style={styles.disabledText}>Not Clickable</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/BackGround/NateEmblem.jpg')}
      style={styles.background}
    >
      {/* Dim + glass overlay over background */}
      <View style={styles.screenDimOverlay}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={handleBackPress}
            style={styles.iconButton}
          >
            <Text style={styles.iconButtonText}>⬅️</Text>
          </TouchableOpacity>

          <View style={styles.titleBlock}>
            <Text style={styles.titleLabel}>Maw Factions</Text>
            <Text style={styles.mainTitle}>Faction Legions</Text>
          </View>

          <View style={styles.musicControls}>
            <TouchableOpacity style={styles.musicButton} onPress={playTheme}>
              <Text style={styles.musicButtonText}>Theme</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.musicButton} onPress={pauseTheme}>
              <Text style={styles.musicButtonText}>Pause</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Vertical ScrollView for sections */}
        <ScrollView
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* Demon Lords Section */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>⚡️ Demon Lords ⚡️</Text>
              <View style={styles.sectionLine} />
              <View style={styles.scrollWrapper}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={[
                    styles.scrollContainer,
                    { gap: isDesktop ? 32 : 18 },
                  ]}
                >
                  {demonLords.map(renderFactionCard)}
                </ScrollView>
              </View>
            </View>

            {/* Dark Forces Section */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Enemy Factions</Text>
              <View style={styles.sectionLine} />
              <View style={styles.scrollWrapper}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={[
                    styles.scrollContainer,
                    { gap: isDesktop ? 32 : 18 },
                  ]}
                >
                  {otherEvilThreats.map(renderFactionCard)}
                </ScrollView>
              </View>
            </View>
          </View>
        </ScrollView>
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
    flex: 1,
  },
  screenDimOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
  },

  // TOP BAR
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  iconButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  iconButtonText: {
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
  mainTitle: {
    fontSize: isDesktop ? 26 : 22,
    fontWeight: '900',
    color: '#f1632b',
    textAlign: 'center',
    textShadowColor: 'rgba(241, 99, 43, 0.9)',
    textShadowRadius: 16,
    textShadowOffset: { width: 0, height: 0 },
  },

  musicControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  musicButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(241, 99, 43, 0.6)',
  },
  musicButtonText: {
    fontSize: 11,
    color: '#ffb36b',
    fontWeight: '700',
  },

  // MAIN SCROLL
  scrollContentContainer: {
    paddingTop: 10,
    paddingBottom: 40,
  },

  container: {
    paddingHorizontal: 12,
  },

  section: {
    marginTop: 20,
    marginBottom: 10,
    padding: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(15, 15, 15, 0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
    marginBottom: 4,
  },
  sectionLine: {
    height: 1,
    width: '35%',
    alignSelf: 'center',
    backgroundColor: 'rgba(241, 99, 43, 0.65)',
    marginBottom: 10,
  },

  scrollWrapper: {
    width: '100%',
    height: cardSize * 1.25 + 80,
  },
  scrollContainer: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
  },

  factionCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  cardClickable: {
    borderColor: 'rgba(226, 88, 34, 0.9)',
  },
  cardNotClickable: {
    opacity: 0.65,
  },
  factionImage: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  textContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  factionName: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowRadius: 10,
  },
  disabledText: {
    marginTop: 4,
    color: '#ff8888',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default DemonsSectionScreen;
