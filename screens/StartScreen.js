// screens/start/StartScreen.js
import { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isWide = SCREEN_WIDTH > 700;

const factions = [
  'The Parliament of Justice',
  'Titans',
  'Eclipse',
  'Olympians',
  'Cobros',
  'Advanced Spartan 3 Corp',
  'Thunder Born',
  'Legionaires',
  'Constellation',
];

export const StartScreen = () => {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [displayedText, setDisplayedText] = useState('');

  const popupAnim = useRef(new Animated.Value(-100)).current;
  const buttonGlowAnim = useRef(new Animated.Value(0)).current;
  const gridAnim = useRef(new Animated.Value(0)).current;

  // ───────────────────────── MUSIC ─────────────────────────

  const playTheme = async () => {
    if (!currentSound) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/audio/Omni.mp4'),
          { shouldPlay: true, isLooping: true, volume: 1.0 }
        );
        setCurrentSound(sound);
        await sound.playAsync();
        setIsPlaying(true);
      } catch (error) {
        console.error('Failed to load audio file:', error);
        Alert.alert(
          'Audio Error',
          'Failed to load background music. Please check the audio file path: ../assets/audio/Omni.mp4'
        );
      }
    } else if (!isPlaying) {
      try {
        await currentSound.playAsync();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error resuming sound:', error);
      }
    }
  };

  const pauseTheme = async () => {
    if (currentSound && isPlaying) {
      try {
        await currentSound.pauseAsync();
        setIsPlaying(false);
      } catch (error) {
        console.error('Error pausing sound:', error);
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (currentSound) {
          currentSound
            .stopAsync()
            .catch(err => console.error('Error stopping sound:', err));
          currentSound
            .unloadAsync()
            .catch(err => console.error('Error unloading sound:', err));
          setCurrentSound(null);
          setIsPlaying(false);
        }
      };
    }, [currentSound])
  );

  // ───────────────────── TYPEWRITER (fixed) ─────────────────────
  // Always types full string, pauses, then deletes, then moves to next faction
  useEffect(() => {
    let cancelled = false;
    const currentFaction = factions[index];
    const typingSpeed = 100;
    const deletingSpeed = 30;
    const pauseDuration = 1000;

    const typeForward = (i) => {
      if (cancelled) return;
      if (i <= currentFaction.length) {
        setDisplayedText(currentFaction.slice(0, i));
        setTimeout(() => typeForward(i + 1), typingSpeed);
      } else {
        // finished typing → pause, then start deleting
        setTimeout(() => deleteBackward(currentFaction.length - 1), pauseDuration);
      }
    };

    const deleteBackward = (i) => {
      if (cancelled) return;
      if (i >= 0) {
        setDisplayedText(currentFaction.slice(0, i));
        setTimeout(() => deleteBackward(i - 1), deletingSpeed);
      } else {
        // move to next faction
        setIndex(prev => (prev + 1) % factions.length);
      }
    };

    typeForward(0);

    return () => {
      cancelled = true;
    };
  }, [index]);

  // ───────────────────── BUTTON GLOW ─────────────────────
  useEffect(() => {
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(buttonGlowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(buttonGlowAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    glowLoop.start();

    return () => {
      glowLoop.stop();
    };
  }, [buttonGlowAnim]);

  // ───────────────────── MOVING GRID ─────────────────────
  useEffect(() => {
    Animated.loop(
      Animated.timing(gridAnim, {
        toValue: 1,
        duration: 8000,
        useNativeDriver: true,
      })
    ).start();
  }, [gridAnim]);

  const gridTranslate = {
    transform: [
      {
        translateX: gridAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 40], // slight drift right
        }),
      },
      {
        translateY: gridAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 40], // slight drift down
        }),
      },
    ],
  };

  // ───────────────────── POPUP ─────────────────────
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setShowPopup(true);
  //     Animated.timing(popupAnim, {
  //       toValue: 0,
  //       duration: 500,
  //       useNativeDriver: true,
  //     }).start(() => {
  //       setTimeout(() => {
  //         Animated.timing(popupAnim, {
  //           toValue: -100,
  //           duration: 500,
  //           useNativeDriver: true,
  //         }).start(() => setShowPopup(false));
  //       }, 3500);
  //     });
  //   }, 10000);

  //   return () => clearTimeout(timer);
  // }, [popupAnim]);

  // ───────────────────── NAVIGATION ─────────────────────
  const handlePress = useCallback(() => {
    navigation.replace('Login', { currentSound, isPlaying });
  }, [navigation, currentSound, isPlaying]);

  // ───────────────────── RENDER ─────────────────────
  return (
    <SafeAreaView style={styles.container}>
      {/* Tron grid background (moving) */}
      <Animated.View style={[styles.gridBackground, gridTranslate]}>
        {[...Array(10)].map((_, i) => (
          <View
            key={`h${i}`}
            style={[
              styles.gridLineHorizontal,
              { top: (SCREEN_HEIGHT / 10) * i },
            ]}
          />
        ))}
        {[...Array(10)].map((_, i) => (
          <View
            key={`v${i}`}
            style={[
              styles.gridLineVertical,
              { left: (SCREEN_WIDTH / 10) * i },
            ]}
          />
        ))}
      </Animated.View>

      {/* Dark glass overlay over everything */}
      <View style={styles.screenOverlay} />

      {/* Main glass card */}
      <View style={styles.contentWrapper}>
        <View style={[styles.glassCard, isWide && styles.glassCardWide]}>
          <View style={styles.cardHeader}>
            <Text style={styles.logoText}>Omni-Drive</Text>
            <Text style={styles.logoSub}>Parliament Jump Interface</Text>
          </View>

          <View style={styles.dynamicTextContainer}>
            <Text
              style={styles.dynamicText}
              numberOfLines={2}
              adjustsFontSizeToFit
            >
              {displayedText}
            </Text>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.musicControls}>
              <TouchableOpacity style={styles.musicButton} onPress={playTheme}>
                <Text style={styles.musicButtonText}>Theme</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.musicButton} onPress={pauseTheme}>
                <Text style={styles.musicButtonText}>Pause</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.startButton}
              onPress={handlePress}
              activeOpacity={0.85}
            >
              <Animated.View
                style={[
                  styles.glowEffect,
                  {
                    opacity: buttonGlowAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.2, 0.8],
                    }),
                  },
                ]}
              />
              <Text style={styles.startButtonText}>Initiate Omni-drive</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {showPopup && (
        <Animated.View
          style={[
            styles.popup,
            {
              transform: [{ translateY: popupAnim }],
            },
          ]}
        >
          <Text style={styles.popupText} numberOfLines={1} adjustsFontSizeToFit>
            Omni-jump ready to engage
          </Text>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Grid
  // gridBackground: {
  //   position: 'absolute',
  //   width: '100%',
  //   height: '100%',
  // },
  // gridLineHorizontal: {
  //   position: 'absolute',
  //   width: SCREEN_WIDTH,
  //   height: 0.5,
  //   backgroundColor: '#22D3EE',
  //   opacity: 0.08,
  // },
  // gridLineVertical: {
  //   position: 'absolute',
  //   height: SCREEN_HEIGHT,
  //   width: 0.5,
  //   backgroundColor: '#22D3EE',
  //   opacity: 0.08,
  // },

  // Dim overlay
  screenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,23,42,0.82)',
  },

  // Center wrapper
  contentWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },

  // Glass card
  glassCard: {
    width: '95%',
    maxWidth: 700,
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(15,23,42,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.45)',
    shadowColor: '#22D3EE',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.35,
    shadowRadius: 32,
    elevation: 18,
  },
  glassCardWide: {
    paddingHorizontal: 28,
    paddingVertical: 22,
  },

  cardHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#E0F2FE',
    letterSpacing: 1.2,
    textShadowColor: '#0F172A',
    textShadowRadius: 10,
  },
  logoSub: {
    fontSize: 12,
    color: 'rgba(148,163,184,0.9)',
    marginTop: 2,
  },

  dynamicTextContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  dynamicText: {
    width: SCREEN_WIDTH * 0.8,
    fontSize: SCREEN_WIDTH > 600 ? 36 : 22,
    fontWeight: '700',
    letterSpacing: SCREEN_WIDTH > 600 ? 3 : 1.6,
    color: '#A5F3FC',
    fontFamily: 'monospace',
    textShadowColor: '#22D3EE',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
    textAlign: 'center',
  },

  cardFooter: {
    marginTop: 8,
    alignItems: 'center',
  },

  musicControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 14,
  },
  musicButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(15,23,42,0.9)',
    borderRadius: 999,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(45,212,191,0.8)',
  },
  musicButtonText: {
    fontSize: 12,
    color: '#5EEAD4',
    fontWeight: '700',
  },

  startButton: {
    marginTop: 4,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.9)',
    backgroundColor: 'rgba(8,47,73,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  glowEffect: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 999,
    backgroundColor: '#22D3EE',
    shadowColor: '#22D3EE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 18,
    elevation: 10,
  },
  startButtonText: {
    fontSize: SCREEN_WIDTH > 600 ? 20 : 16,
    color: '#E0F2FE',
    fontWeight: '800',
    fontFamily: 'monospace',
    textAlign: 'center',
    textShadowColor: '#0F172A',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },

  popup: {
    position: 'absolute',
    top: 24,
    alignSelf: 'center',
    width: '70%',
    backgroundColor: 'rgba(15,23,42,0.96)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(56,189,248,0.8)',
    alignItems: 'center',
    shadowColor: '#22D3EE',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 12,
  },
  popupText: {
    fontSize: SCREEN_WIDTH > 600 ? 16 : 13,
    color: '#BAE6FD',
    fontWeight: '700',
    fontFamily: 'monospace',
    textShadowColor: '#0F172A',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
    textAlign: 'center',
  },
});
