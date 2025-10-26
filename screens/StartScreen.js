import { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions, SafeAreaView, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const factions = [
  'The Parliament of Justice', 'Titans', 'Eclipse', 'Olympians', 'Cobros',
  'Advanced Spartan 3 Corp', 'Thunder Born', 'Legionaires', 'Constellation'
];

export const StartScreen = () => {
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const popupAnim = useRef(new Animated.Value(-100)).current;
  const buttonGlowAnim = useRef(new Animated.Value(0)).current;

  // Handle music playback
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
        Alert.alert('Audio Error', 'Failed to load background music. Please check the audio file path: ../assets/audio/Omni.mp4');
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

  // Handle music pause
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

  // Cleanup sound on unmount
  useFocusEffect(
    useCallback(() => {
      playTheme(); // Play automatically on mount
      return () => {
        if (currentSound) {
          currentSound.stopAsync().catch((error) => console.error('Error stopping sound:', error));
          currentSound.unloadAsync().catch((error) => console.error('Error unloading sound:', error));
          setCurrentSound(null);
          setIsPlaying(false);
        }
      };
    }, [currentSound])
  );

  useEffect(() => {
    // Typewriter effect with typing and faster deletion
    let charIndex = isTyping ? 0 : displayedText.length - 1;
    const currentFaction = factions[index];
    const typingSpeed = 100; // ms per character for typing
    const deletingSpeed = 30; // ms per character for deleting (faster)
    const pauseDuration = 1000; // 1-second pause after typing

    const typingInterval = setInterval(() => {
      if (isTyping) {
        if (charIndex < currentFaction.length) {
          setDisplayedText(currentFaction.slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typingInterval);
          setTimeout(() => {
            setIsTyping(false); // Start deleting
          }, pauseDuration);
        }
      } else {
        if (charIndex >= 0) {
          setDisplayedText(currentFaction.slice(0, charIndex));
          charIndex--;
        } else {
          clearInterval(typingInterval);
          setIsTyping(true); // Reset to typing
          setIndex((prevIndex) => (prevIndex + 1) % factions.length);
        }
      }
    }, isTyping ? typingSpeed : deletingSpeed);

    // Button glow animation
    const glowAnimation = () => {
      Animated.loop(
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
      ).start();
    };

    // Popup animation
    const popupTimer = setTimeout(() => {
      setShowPopup(true);
      Animated.timing(popupAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
      setTimeout(() => {
        Animated.timing(popupAnim, {
          toValue: -100,
          duration: 500,
          useNativeDriver: true,
        }).start(() => setShowPopup(false));
      }, 3500);
    }, 10000);

    glowAnimation();

    return () => {
      clearInterval(typingInterval);
      clearTimeout(popupTimer);
    };
  }, [index, isTyping]);

  const handlePress = useCallback(() => {
    // Do not stop/unload audio; pass it to LoginScreen
    navigation.replace('Login', { currentSound, isPlaying });
  }, [navigation, currentSound, isPlaying]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.gridBackground}>
        {[...Array(10)].map((_, i) => (
          <View
            key={`h${i}`}
            style={{
              position: 'absolute',
              top: (SCREEN_HEIGHT / 10) * i,
              width: SCREEN_WIDTH,
              height: 0.5,
              backgroundColor: '#00FFFF',
              opacity: 0.1,
            }}
          />
        ))}
        {[...Array(10)].map((_, i) => (
          <View
            key={`v${i}`}
            style={{
              position: 'absolute',
              left: (SCREEN_WIDTH / 10) * i,
              height: SCREEN_HEIGHT,
              width: 0.5,
              backgroundColor: '#00FFFF',
              opacity: 0.1,
            }}
          />
        ))}
      </View>
      <View style={styles.content}>
        <View style={styles.dynamicTextContainer}>
          <Text style={styles.dynamicText} numberOfLines={2} adjustsFontSizeToFit>
            {displayedText}
          </Text>
        </View>
      </View>
      <View style={styles.musicControls}>
        <TouchableOpacity style={styles.musicButton} onPress={playTheme}>
          <Text style={styles.musicButtonText}>Theme</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.musicButton} onPress={pauseTheme}>
          <Text style={styles.musicButtonText}>Pause</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.startButton} onPress={handlePress}>
        <Animated.View
          style={{
            ...styles.glowEffect,
            opacity: buttonGlowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.3, 0.8],
            }),
          }}
        />
        <Text style={styles.startButtonText}>Initiate Omni-drive</Text>
      </TouchableOpacity>
      {showPopup && (
        <Animated.View
          style={{
            ...styles.popup,
            transform: [{ translateY: popupAnim }],
          }}
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
    backgroundColor: '#0A0F1C', // Dark Tron-like background
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  gridBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  dynamicTextContainer: {
    position: 'relative',
    overflow: 'hidden',
    width: SCREEN_WIDTH * 0.8,
  },
  dynamicText: {
    fontSize: SCREEN_WIDTH > 600 ? 40 : 24,
    fontWeight: '700',
    letterSpacing: SCREEN_WIDTH > 600 ? 3 : 1.5,
    color: '#00FFFF', // Neon cyan
    fontFamily: 'monospace',
    textShadowColor: '#00B7EB', // Electric blue glow
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
    textAlign: 'center',
  },
  popup: {
    position: 'absolute',
    top: 20,
    width: '70%',
    backgroundColor: 'rgba(0, 15, 28, 0.7)',
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#00FFFF',
    alignItems: 'center',
    shadowColor: '#00B7EB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  popupText: {
    fontSize: SCREEN_WIDTH > 600 ? 18 : 14,
    color: '#00FFFF',
    fontWeight: '700',
    fontFamily: 'monospace',
    textShadowColor: '#00B7EB',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
    textAlign: 'center',
  },
  startButton: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.1,
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#00FFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  glowEffect: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    borderRadius: 5,
    backgroundColor: '#00FFFF',
    opacity: 0.3,
    shadowColor: '#00B7EB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  startButtonText: {
    fontSize: SCREEN_WIDTH > 600 ? 22 : 16,
    color: '#00FFFF',
    fontWeight: '700',
    fontFamily: 'monospace',
    textAlign: 'center',
    textShadowColor: '#00B7EB',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  musicControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.2,
  },
  musicButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    marginHorizontal: 10,
    borderWidth: 1,
    borderColor: '#00FFFF',
  },
  musicButtonText: {
    fontSize: 12,
    color: '#00FFFF',
    fontWeight: 'bold',
  },
});