import React, { useState, useCallback, useRef } from 'react';
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
  { name: 'Arcane Devos', screen: '', image: require('../../assets/Villains/Devos.jpg'), clickable: true, borderColor: 'purple' },
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

  // keep the actual Audio.Sound instance in a ref (doesn't trigger re-renders)
  const soundRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // stop/unload theme
  const stopTheme = useCallback(async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    } catch (e) {
      console.error('Error stopping theme:', e);
    } finally {
      setIsPlaying(false);
    }
  }, []);

  // kill audio when leaving this screen
  useFocusEffect(
    useCallback(() => {
      return () => {
        stopTheme();
      };
    }, [stopTheme])
  );

  const playTheme = async () => {
    try {
      if (!soundRef.current) {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/audio/BigThreat.mp4'),
          {
            isLooping: true,
            volume: 0.7,
          }
        );
        soundRef.current = sound;
        await soundRef.current.playAsync();
      } else {
        await soundRef.current.playAsync();
      }
      setIsPlaying(true);
    } catch (e) {
      console.error('Error playing theme:', e);
      setIsPlaying(false);
    }
  };

  const pauseTheme = async () => {
    try {
      if (soundRef.current && isPlaying) {
        await soundRef.current.pauseAsync();
        setIsPlaying(false);
      }
    } catch (e) {
      console.error('Error pausing theme:', e);
    }
  };

  // use screen if present, otherwise shared detail screen
  const handlePress = async (bigBad) => {
    if (!bigBad.clickable) return;

    await stopTheme();

    if (bigBad.screen && bigBad.screen.trim() !== '') {
      navigation.navigate(bigBad.screen);
    } else {
      navigation.navigate('EnlightenedCharacterDetail', { member: bigBad });
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
        bigBad.borderColor
          ? styles.clickable(bigBad.borderColor)
          : styles.notClickable,
      ]}
      onPress={() => handlePress(bigBad)}
      activeOpacity={0.88}
    >
      <Image source={bigBad.image} style={styles.image} />
      <View style={styles.cardOverlay} />
      <Text style={styles.name}>{bigBad.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/BackGround/BigBad.jpg')}
      style={styles.background}
    >
      <View style={styles.screenOverlay}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          {/* HEADER ROW */}
          <View style={styles.headerWrapper}>
            <TouchableOpacity
              onPress={async () => {
                await stopTheme();
                navigation.navigate('Villains');
              }}
              style={styles.backButton}
              activeOpacity={0.9}
            >
              <Text style={styles.backButtonText}>⬅️ Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('BigBoss')}
              style={styles.headerTitle}
              activeOpacity={0.9}
            >
              <View style={styles.headerGlass}>
                <Text style={styles.header}>Big Bads</Text>
                <Text style={styles.headerSub}>
                  Tyrants, reality-breakers, and endgame threats
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* MUSIC CONTROLS */}
          <View style={styles.musicControls}>
            <TouchableOpacity
              style={styles.musicButton}
              onPress={playTheme}
              activeOpacity={0.9}
            >
              <Text style={styles.musicButtonText}>
                {isPlaying ? 'Playing…' : 'Theme'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.musicButton}
              onPress={pauseTheme}
              activeOpacity={0.9}
            >
              <Text style={styles.musicButtonText}>Pause</Text>
            </TouchableOpacity>
          </View>

          {/* CATEGORY + SCROLLER */}
          <View style={styles.scrollWrapper}>
            <Text style={styles.categoryHeader}>Tyrants</Text>
            <ScrollView
              horizontal
              contentContainerStyle={styles.scrollContainer}
              showsHorizontalScrollIndicator={false}
            >
              {bigBads.map(renderBigBadCard)}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
    flex: 1,
  },
  screenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(6, 0, 18, 0.85)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 40,
    marginBottom: 10,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(70,0,100,0.9)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(200,120,255,0.7)',
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerGlass: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(180,60,255,0.7)',
  },
  header: {
    fontSize: isDesktop ? 32 : 26,
    fontWeight: '900',
    color: '#f4e6ff',
    textAlign: 'center',
    textShadowColor: '#d06bff',
    textShadowRadius: 20,
  },
  headerSub: {
    marginTop: 2,
    fontSize: isDesktop ? 12 : 10,
    color: 'rgba(240,220,255,0.85)',
    textAlign: 'center',
    letterSpacing: 0.4,
  },
  musicControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  musicButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(138, 43, 226, 0.28)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(186,85,211,0.9)',
  },
  musicButtonText: {
    fontSize: 14,
    color: '#f0d0ff',
    fontWeight: 'bold',
  },
  scrollWrapper: {
    width: SCREEN_WIDTH,
    marginTop: 16,
  },
  scrollContainer: {
    flexDirection: 'row',
    paddingVertical: verticalSpacing,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 12,
    backgroundColor: 'rgba(10, 0, 30, 0.95)',
    marginRight: horizontalSpacing,
    shadowColor: '#9932CC',
    shadowOpacity: 0.9,
    shadowRadius: 20,
  },
  clickable: (color) => ({
    borderColor: color === 'gold' ? '#f7d259' : '#BA55D3',
    borderWidth: 2,
    shadowColor: color === 'gold' ? '#f7d259aa' : '#BA55D3aa',
  }),
  notClickable: {
    opacity: 0.88,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
  },
  name: {
    position: 'absolute',
    bottom: 18,
    left: 16,
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '900',
    textShadowColor: '#000',
    textShadowRadius: 12,
  },
  categoryHeader: {
    fontSize: isDesktop ? 26 : 22,
    fontWeight: 'bold',
    color: '#E6E6FA',
    textAlign: 'left',
    textShadowColor: '#BA55D3',
    textShadowRadius: 18,
    marginLeft: 18,
    marginVertical: 10,
  },
});

export default BigBadsTab;
