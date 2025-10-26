import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window'); // Get device dimensions

const factions = [
  'The Parliament of Justice', 'Titans', 'Eclipse', 'Olympians', 'Cobros',
  'Advanced Spartan 3 Corp', 'Thunder Born', 'Legionaires', 'Constellation'
];

export const StartScreen = () => {
  const [index, setIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(-1)).current; // For faction text animation
  const popupAnim = useRef(new Animated.Value(-100)).current; // For popup slide animation
  const buttonGlowAnim = useRef(new Animated.Value(0)).current; // For button glow effect

  useEffect(() => {
    // Animation for sliding faction names
    const startAnimation = () => {
      Animated.sequence([
        Animated.timing(slideAnim, { toValue: 1, duration: 2500, useNativeDriver: false }),
        Animated.delay(500),
        Animated.timing(slideAnim, { toValue: -1, duration: 1500, useNativeDriver: false }),
        Animated.delay(500),
      ]).start(() => {
        setIndex((prevIndex) => (prevIndex + 1) % factions.length);
        startAnimation();
      });
    };

    // Button glow animation (pulsating effect)
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

    // Popup logic: show and slide down after 5 seconds, slide up and hide after 3 seconds
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
      }, 3500); // Hide after 3 seconds
    }, 10000); // Show after 5 seconds

    startAnimation();
    glowAnimation();

    return () => clearTimeout(popupTimer); // Cleanup timer
  }, []);

  const handlePress = () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.gridBackground} />
      <View style={styles.content}>
        <Text style={styles.staticText}></Text>
        <View style={styles.dynamicTextContainer}>
          <Text style={styles.dynamicText}>{factions[index]}</Text>
          <Animated.View
            style={[
              styles.slideBox,
              {
                left: slideAnim.interpolate({
                  inputRange: [-1, 1],
                  outputRange: ['-150%', '150%'],
                }),
              },
            ]}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.startButton} onPress={handlePress}>
        <Animated.View
          style={[
            styles.glowEffect,
            {
              opacity: buttonGlowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0.8],
              }),
            },
          ]}
        />
        <Text style={styles.startButtonText}>Initiate Omni-drive</Text>
      </TouchableOpacity>
      {showPopup && (
        <Animated.View
          style={[
            styles.popup,
            {
              transform: [{ translateY: popupAnim }],
            },
          ]}
        >
          <Text style={styles.popupText}>Omni-jump ready to engage</Text>
        </Animated.View>
      )}
    </View>
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
    backgroundColor: 'transparent',
    borderColor: '#00FFFF', // Neon cyan grid lines
    borderWidth: 0.5,
    opacity: 0.1,
    // Simulating a subtle grid pattern (React Native doesn't support CSS grid overlays, so this is a simplified effect)
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  staticText: {
    fontSize: SCREEN_WIDTH > 600 ? 40 : 20,
    color: '#00FFFF', // Neon cyan for Tron vibe
    fontWeight: '700',
    fontFamily: 'monospace', // Futuristic font
    textShadowColor: '#00B7EB', // Electric blue glow
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  dynamicTextContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  dynamicText: {
    fontSize: SCREEN_WIDTH > 600 ? 50 : 28,
    fontWeight: '700',
    letterSpacing: SCREEN_WIDTH > 600 ? 4 : 2,
    color: '#00FFFF', // Neon cyan
    fontFamily: 'monospace',
    textShadowColor: '#00B7EB', // Electric blue glow
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  slideBox: {
    position: 'absolute',
    top: 0,
    height: '100%',
    width: '500%',
    backgroundColor: '#0A0F1C', // Match container background
  },
  popup: {
    position: 'absolute',
    top: 20,
    width: '70%',
    backgroundColor: 'rgba(0, 15, 28, 0.7)', // Dark, semi-transparent Tron-like popup
    padding: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#00FFFF', // Neon cyan border
    alignItems: 'center',
    shadowColor: '#00B7EB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  popupText: {
    fontSize: SCREEN_WIDTH > 600 ? 20 : 16,
    color: '#00FFFF', // Neon cyan
    fontWeight: '700',
    fontFamily: 'monospace',
    textShadowColor: '#00B7EB',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  startButton: {
    position: 'absolute',
    bottom: SCREEN_HEIGHT * 0.1, // Place button 10% from bottom
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#00FFFF', // Neon cyan border
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
    backgroundColor: '#00FFFF', // Neon cyan glow
    opacity: 0.3,
    shadowColor: '#00B7EB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  startButtonText: {
    fontSize: SCREEN_WIDTH > 600 ? 24 : 18,
    color: '#00FFFF', // Neon cyan text
    fontWeight: '700',
    fontFamily: 'monospace',
    textAlign: 'center',
    textShadowColor: '#00B7EB',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
});