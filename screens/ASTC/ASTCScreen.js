import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { Audio } from 'expo-av';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const isDesktop = SCREEN_WIDTH > 600;

const backgroundImages = [
  require('../../assets/Halo/6.jpg'),
  require('../../assets/Halo/2.jpg'),
  require('../../assets/Halo/7.jpg'),
  require('../../assets/Halo/8.jpg'),
  require('../../assets/Halo/18.jpg'),
  require('../../assets/Halo/12.jpg'),
  require('../../assets/Halo/33.jpg'),
  require('../../assets/Halo/14.jpg'),
  require('../../assets/Halo/19.jpg'),
];

const buttonImages = [
  require('../../assets/BackGround/ASTC.jpg'),
  require('../../assets/BackGround/ASTC.jpg'),
  require('../../assets/BackGround/ASTC.jpg'),
  require('../../assets/Halo/23.jpg'),
  require('../../assets/Halo/24.jpg'),
  require('../../assets/Halo/25.jpg'),
  require('../../assets/Halo/18.jpg'),
  require('../../assets/Halo/22.jpg'),
  require('../../assets/Halo/31.jpg'),
];

// 🎵 Multiple ASTC/Spartan themes (default = index 0)
// ✅ IMPORTANT: keep index 0 as your current/default theme.
export const TRACKS = [
  { id: 'astc_default', label: 'Halo Theme', source: require('../../assets/audio/Halo2.wav') },
  // Add more as you like:
  { id: 'astc_variant_1', label: 'Revival', source: require('../../assets/audio/Revival.mp4') },
  // { id: 'astc_variant_2', label: 'ASTC – Variant 2', source: require('../../assets/audio/YourOtherFile.wav') },
];

// 🔊 global sound instance for ASTC + Spartans
let backgroundSound = null;
// ✅ global selected track index (persists across ASTC + Spartans)
let backgroundTrackIndex = 0;
let loadedTrackId = null;

// 🔧 internal: unload current sound
const unloadBackgroundSound = async () => {
  try {
    if (backgroundSound) {
      try { await backgroundSound.stopAsync(); } catch {}
      try { await backgroundSound.unloadAsync(); } catch {}
      backgroundSound = null;
      loadedTrackId = null;
    }
  } catch (e) {
    console.log('ASTC unload error:', e);
  }
};

// 🔧 internal: load the selected track (and optionally play)
const loadSelectedTrack = async (shouldPlay = true) => {
  const track = TRACKS[backgroundTrackIndex] || TRACKS[0];
  try {
    await unloadBackgroundSound();

    const { sound } = await Audio.Sound.createAsync(
      track.source,
      { shouldPlay: false, isLooping: true, volume: 1.0 }
    );

    backgroundSound = sound;
    loadedTrackId = track.id;

    if (shouldPlay) {
      await sound.playAsync();
    }
  } catch (e) {
    console.log('ASTC failed to load selected track:', e);
  }
};

// ✅ Export: read selected track meta (for UI)
export const getBackgroundTrackMeta = () => {
  const t = TRACKS[backgroundTrackIndex] || TRACKS[0];
  return { index: backgroundTrackIndex, id: t?.id, label: t?.label };
};

// ✅ Export: set track index (optionally autoplay and/or hot-swap if currently playing)
export const setBackgroundTrackIndex = async (index, { autoplay = false, hotSwap = true } = {}) => {
  const safe = ((index % TRACKS.length) + TRACKS.length) % TRACKS.length;
  backgroundTrackIndex = safe;

  // If we already have a sound loaded and hotSwap is true, reload immediately
  if (hotSwap && backgroundSound) {
    await loadSelectedTrack(autoplay);
    return;
  }

  // If nothing loaded, only load if autoplay requested
  if (!backgroundSound && autoplay) {
    await loadSelectedTrack(true);
  }
};

// ✅ Export: cycle helper
export const cycleBackgroundTrack = async (direction = 1, opts = {}) => {
  const next = (backgroundTrackIndex + direction + TRACKS.length) % TRACKS.length;
  await setBackgroundTrackIndex(next, opts);
};

// 🔊 start / resume music (Spartans imports this)
export const playBackgroundMusic = async () => {
  try {
    const track = TRACKS[backgroundTrackIndex] || TRACKS[0];

    if (!backgroundSound) {
      await loadSelectedTrack(true);
      return;
    }

    // If something is loaded but wrong track, reload
    if (loadedTrackId !== track.id) {
      await loadSelectedTrack(true);
      return;
    }

    await backgroundSound.playAsync();
  } catch (e) {
    console.log('ASTC music failed to load/play:', e);
  }
};

// 🔊 pause (but don’t unload)
export const pauseBackgroundMusic = async () => {
  try {
    if (backgroundSound) {
      await backgroundSound.pauseAsync();
    }
  } catch (e) {
    console.log('ASTC music pause error:', e);
  }
};

// 🔊 full stop + unload – for leaving the ASTC “flow” entirely
export const stopBackgroundMusic = async () => {
  await unloadBackgroundSound();
};

// ✅ optional helper for Spartans/other screens: detect playing
export const getIsBackgroundMusicLoaded = () => !!backgroundSound;

const ASTCScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const keyTop = useRef(new Animated.Value(-SCREEN_HEIGHT)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const buttonOpacity = useRef(new Animated.Value(1)).current;

  const [backgroundImage, setBackgroundImage] = useState(backgroundImages[0]);
  const [buttonImage, setButtonImage] = useState(buttonImages[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  // 🎵 UI state for showing current track label
  const [trackMeta, setTrackMeta] = useState(getBackgroundTrackMeta());

  const KEY_STOP_POSITION = SCREEN_HEIGHT * 0.35;
  const KEY_SIZE = isDesktop ? 260 : 220;
  const centeredLeft = SCREEN_WIDTH / 2 - KEY_SIZE / 2;
  const cardSize = isDesktop ? 260 : 180;

  useEffect(() => {
    if (isFocused) {
      const bg = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
      const btn = buttonImages[Math.floor(Math.random() * buttonImages.length)];
      setBackgroundImage(bg);
      setButtonImage(btn);

      // reset animation state whenever screen refocuses
      keyTop.setValue(-SCREEN_HEIGHT);
      buttonScale.setValue(1);
      buttonOpacity.setValue(1);
      setIsAnimating(false);

      // refresh track label
      setTrackMeta(getBackgroundTrackMeta());
    }
    // ✅ NO automatic music start/stop here
  }, [isFocused, keyTop, buttonScale, buttonOpacity]);

  const handleBackPress = async () => {
    await stopBackgroundMusic(); // fully kill theme when leaving ASTC “tree”
    navigation.goBack();
  };

  const handleCardPress = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    // ✅ IMPORTANT: No random music.
    // Whatever you last selected is the one that plays.
    playBackgroundMusic();

    // Button: scale up → fade out
    Animated.parallel([
      Animated.timing(buttonScale, {
        toValue: 1.25,
        duration: 240,
        useNativeDriver: true,
      }),
      Animated.timing(buttonOpacity, {
        toValue: 0,
        duration: 3200,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Key descends — stops at position, then navigate
    Animated.timing(keyTop, {
      toValue: KEY_STOP_POSITION,
      duration: 3500,
      useNativeDriver: false,
    }).start(() => {
      navigation.navigate('SpartansScreen');
      // ❌ Do NOT stop music here – Spartans keeps it alive
    });
  };

  const changeTrack = async (dir) => {
    // Only change if not animating (optional safety)
    if (isAnimating) return;

    // If music is already loaded, hot swap but don't autoplay here (keeps behavior deterministic)
    await cycleBackgroundTrack(dir, { autoplay: false, hotSwap: true });
    setTrackMeta(getBackgroundTrackMeta());
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>

        {/* 🎵 TRACK SELECT (glassy mini bar) */}
        {/* <View style={styles.trackBar}>
          <TouchableOpacity style={styles.trackBtn} onPress={() => changeTrack(-1)} activeOpacity={0.85}>
            <Text style={styles.trackBtnText}>⟵</Text>
          </TouchableOpacity>

          <View style={styles.trackGlass}>
            <Text style={styles.trackLabel}>Theme:</Text>
            <Text style={styles.trackTitle} numberOfLines={1}>{trackMeta?.label || 'ASTC Theme'}</Text>
          </View>

          <TouchableOpacity style={styles.trackBtn} onPress={() => changeTrack(1)} activeOpacity={0.85}>
            <Text style={styles.trackBtnText}>⟶</Text>
          </TouchableOpacity>
        </View> */}

        {/* FORERUNNER KEY */}
        <Animated.View
          style={{
            position: 'absolute',
            top: keyTop,
            left: centeredLeft,
            zIndex: 20,
          }}
        >
          <Image
            source={require('../../assets/Halo/Activation_Index.jpg')}
            style={[styles.keyImage, { width: KEY_SIZE, height: KEY_SIZE }]}
          />
        </Animated.View>

        {/* HEADER */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
            activeOpacity={0.85}
          >
            <Text style={styles.backText}>⬅️ Back</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <View style={styles.headerGlass}>
              <Text style={styles.headerTitle}>Advanced Spartan 3 Corp</Text>
              <Text style={styles.headerSubtitle}>ASTC Deployment Console</Text>
            </View>
          </View>

          <View style={{ width: 56 }} />
        </View>

        {/* CENTER PANEL */}
        <View style={styles.centerContent}>
          {!isAnimating && (
            <Text style={styles.pressLabel}>
              PRESS & WAIT
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.card,
              {
                width: cardSize,
                height: cardSize * 1.4,
                borderColor: isAnimating ? '#ff5555' : '#00e1ff',
                shadowColor: isAnimating ? '#ff5555' : '#00e1ff',
                backgroundColor: isAnimating
                  ? 'rgba(255, 60, 60, 0.24)'
                  : 'rgba(0, 180, 255, 0.14)',
              },
            ]}
            onPress={handleCardPress}
            disabled={isAnimating}
            activeOpacity={0.9}
          >
            <Animated.View
              style={{
                ...StyleSheet.absoluteFillObject,
                transform: [{ scale: buttonScale }],
                opacity: buttonOpacity,
              }}
            >
              <Image
                source={buttonImage}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.cardOverlay} />
            </Animated.View>

            {isAnimating && (
              <Text style={styles.activatingText}>ACTIVATING...</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.instruction}>
            Press to initiate index sync{'\n'}
            and deploy the Spartans.
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' },

  // 🎵 TRACK BAR
  trackBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 6,
    paddingBottom: 6,
  },
  trackBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0,225,255,0.9)',
    backgroundColor: 'rgba(5,15,25,0.95)',
  },
  trackBtnText: { color: '#eaffff', fontWeight: '900' },
  trackGlass: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(5,20,40,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(0,240,255,0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  trackLabel: { fontSize: 11, color: 'rgba(190,240,255,0.95)', marginRight: 8 },
  trackTitle: { flex: 1, fontSize: 12, color: '#e6fbff', fontWeight: '800' },

  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0,225,255,0.9)',
    backgroundColor: 'rgba(5,15,25,0.95)',
  },
  backText: {
    fontSize: 13,
    color: '#eaffff',
    fontWeight: 'bold',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerGlass: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(5,20,40,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(0,240,255,0.9)',
  },
  headerTitle: {
    fontSize: isDesktop ? 22 : 18,
    fontWeight: '900',
    color: '#e6fbff',
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
    color: '#7be9ff',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },

  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressLabel: {
    marginBottom: 24,
    fontSize: 18,
    fontWeight: '700',
    color: '#7cf5ff',
    textShadowColor: '#002b3a',
    textShadowRadius: 14,
    letterSpacing: 4,
  },

  card: {
    borderRadius: 26,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowOpacity: 0.95,
    shadowRadius: 26,
    elevation: 22,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  activatingText: {
    position: 'absolute',
    bottom: 18,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#ff6666',
    textShadowColor: '#000',
    textShadowRadius: 12,
    letterSpacing: 2,
  },

  keyImage: { resizeMode: 'contain' },

  instruction: {
    marginTop: 26,
    fontSize: 15,
    color: '#9fb6c7',
    textAlign: 'center',
    fontStyle: 'italic',
    textShadowColor: '#000',
    textShadowRadius: 10,
    lineHeight: 22,
  },
});

export default ASTCScreen;
