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
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isDesktop = SCREEN_WIDTH > 600;

const cardSizes = {
  desktop: { width: 400, height: 600 },
  mobile: { width: 350, height: 500 },
};
const horizontalSpacing = isDesktop ? 40 : 20;
const verticalSpacing = isDesktop ? 50 : 20;

// === ALL YOUR BIG BADS — FULLY PRESERVED ===
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
  { name: 'Hextator', screen: '', image: require('../../assets/Villains/Hextator.jpg'), clickable: true, borderColor: 'purple' },
  { name: 'Lord Dravak', screen: '', image: require('../../assets/Villains/Dravak.jpg'), clickable: true, borderColor: 'purple' },
  { name: 'Arcane Devos', screen: 'VortigarScreen', image: require('../../assets/Villains/Devos.jpg'), clickable: true, borderColor: 'purple' },
  { name: 'Archon Ultivax', screen: '', image: require('../../assets/Villains/Ultivax.jpg'), clickable: true, borderColor: 'purple' },
  { name: 'Sovereign Xal-Zor', screen: '', image: require('../../assets/Villains/XalZor.jpg'), clickable: true, borderColor: null },
  { name: 'Emperor Obsidian', screen: '', image: require('../../assets/Villains/EmperorObsidian.jpg'), clickable: true, borderColor: 'purple' },
  { name: 'Admiral Scyphos', screen: '', image: require('../../assets/Villains/Scyphos.jpg'), clickable: true, borderColor: 'purple' },
  { name: 'Admiral', screen: '', image: require('../../assets/Villains/Admiral.jpg'), clickable: true, borderColor: 'purple' },
  { name: "Zein'roe", screen: '', image: require('../../assets/Villains/Zeinroe.jpg'), clickable: true, borderColor: 'purple' },
  { name: 'Devoes', screen: '', image: require('../../assets/Villains/Devoes.jpg'), clickable: true, borderColor: 'purple' },
  { name: 'Cronos', screen: '', image: require('../../assets/Villains/Cronos.jpg'), clickable: true, borderColor: 'purple' },
  { name: "Cor'vas", screen: '', image: require('../../assets/Villains/Corvas.jpg'), clickable: true, borderColor: 'purple' },
];

const BigBadsTab = () => {
  const navigation = useNavigation();
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (currentSound) {
          currentSound.stopAsync();
          currentSound.unloadAsync();
          setCurrentSound(null);
          setIsPlaying(false);
        }
      };
    }, [currentSound])
  );

  const playTheme = async () => {
    if (!currentSound) {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/audio/BigThreat.mp4'),
        { shouldPlay: true, isLooping: true, volume: 0.7 }
      );
      setCurrentSound(sound);
      await sound.playAsync();
      setIsPlaying(true);
    } else if (!isPlaying) {
      await currentSound.playAsync();
      setIsPlaying(true);
    }
  };

  const pauseTheme = async () => {
    if (currentSound && isPlaying) {
      await currentSound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const stopAndGoToDetail = async (character) => {
    if (currentSound) {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      setCurrentSound(null);
      setIsPlaying(false);
    }
    navigation.navigate('EnlightenedCharacterDetail', { member: character });
  };

  const handlePress = (bigBad) => {
    // If has a dedicated screen → go there
    if (bigBad.screen && bigBad.screen.trim() !== '') {
      stopAndGoToDetail(bigBad); // Reuse detail screen with correct theme
    } else {
      // Otherwise → full bio in detail screen
      stopAndGoToDetail(bigBad);
    }
  };

  const renderBigBadCard = (bigBad) => (
    <TouchableOpacity
      key={bigBad.name}
      style={[
        styles.card,
        {
          width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
          height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height,
        },
        bigBad.borderColor ? styles.clickable(bigBad.borderColor) : styles.notClickable,
      ]}
      onPress={() => handlePress(bigBad)}
      activeOpacity={0.85}
    >
      <Image source={bigBad.image} style={styles.image} />
      <View style={styles.transparentOverlay} />
      <Text style={styles.name}>{bigBad.name}</Text>
      {/* {!bigBad.screen && <Text style={styles.detailHint}>Tap for Bio</Text>} */}
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/BackGround/BigBad.jpg')}
      style={styles.background}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={async () => {
              if (currentSound) {
                await currentSound.stopAsync();
                await currentSound.unloadAsync();
                setCurrentSound(null);
                setIsPlaying(false);
              }
              navigation.navigate('Villains');
            }}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('BigBoss')}>
            <Text style={styles.header}>Big Bads</Text>
          </TouchableOpacity>

          <View style={styles.musicControls}>
            <TouchableOpacity style={styles.musicButton} onPress={playTheme}>
              <Text style={styles.musicButtonText}>Theme</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.musicButton} onPress={pauseTheme}>
              <Text style={styles.musicButtonText}>Pause</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.scrollWrapper}>
            <Text style={styles.categoryHeader}>Cosmic Tyrants</Text>
            <ScrollView
              horizontal
              contentContainerStyle={styles.scrollContainer}
              showsHorizontalScrollIndicator={true}
            >
              {bigBads.map(renderBigBadCard)}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT, resizeMode: 'cover' },
  scrollView: { flex: 1 },
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#4B0082',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    elevation: 8,
    borderWidth: 2,
    borderColor: '#9932CC',
  },
  backButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  header: {
    fontSize: 48,
    fontWeight: '900',
    color: '#4B0082',
    textAlign: 'center',
    textShadowColor: '#BA55D3',
    textShadowRadius: 30,
    marginVertical: 20,
  },
  musicControls: { flexDirection: 'row', gap: 20, marginBottom: 20 },
  musicButton: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    backgroundColor: 'rgba(138, 43, 226, 0.3)',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#BA55D3',
  },
  musicButtonText: { fontSize: 16, color: '#DA70D6', fontWeight: 'bold' },
  scrollWrapper: { width: SCREEN_WIDTH, marginTop: 20 },
  scrollContainer: {
    flexDirection: 'row',
    paddingVertical: verticalSpacing,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 15,
    backgroundColor: 'rgba(10, 0, 30, 0.9)',
    marginRight: horizontalSpacing,
    shadowColor: '#9932CC',
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  clickable: (color) => ({
    borderColor: color === 'gold' ? '#FFD700' : '#BA55D3',
    borderWidth: 5,
  }),
  notClickable: { opacity: 0.88 },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  transparentOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.45)' },
  name: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '900',
    textShadowColor: '#000',
    textShadowRadius: 12,
  },
  detailHint: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(138, 43, 226, 0.8)',
    color: '#FFF',
    padding: 8,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoryHeader: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#E6E6FA',
    textAlign: 'left',
    textShadowColor: '#BA55D3',
    textShadowRadius: 20,
    marginLeft: 15,
    marginVertical: 15,
  },
});

export default BigBadsTab;