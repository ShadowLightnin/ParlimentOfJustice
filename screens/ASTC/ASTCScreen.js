import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  Animated,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
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

// global sound instance for this screen
let backgroundSound;

const playBackgroundMusic = async () => {
  try {
    if (!backgroundSound) {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/audio/Halo2.wav'),
        { shouldPlay: true, isLooping: true, volume: 1.0 }
      );
      backgroundSound = sound;
      await sound.playAsync();
    } else {
      await backgroundSound.playAsync();
    }
  } catch (e) {
    console.log('ASTC music failed to load/play:', e);
  }
};

const stopBackgroundMusic = async () => {
  try {
    if (backgroundSound) {
      await backgroundSound.stopAsync();
      await backgroundSound.unloadAsync();
      backgroundSound = null;
    }
  } catch (e) {
    console.log('ASTC music stop/unload error:', e);
  }
};

const ASTCScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const keyTop = useRef(new Animated.Value(-SCREEN_HEIGHT)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const buttonOpacity = useRef(new Animated.Value(1)).current;

  const [backgroundImage, setBackgroundImage] = useState(backgroundImages[0]);
  const [buttonImage, setButtonImage] = useState(buttonImages[0]);
  const [isAnimating, setIsAnimating] = useState(false);

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

      playBackgroundMusic();
    } else {
      // leaving screen
      stopBackgroundMusic();
    }
  }, [isFocused]);

  const handleBackPress = async () => {
    await stopBackgroundMusic();
    navigation.goBack();
  };

  const handleCardPress = () => {
    if (isAnimating) return;
    setIsAnimating(true);

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

    // Key descends — stops exactly at sacred position, then navigates
    Animated.timing(keyTop, {
      toValue: KEY_STOP_POSITION,
      duration: 3500,
      useNativeDriver: false, // using "top" so keep this false
    }).start(() => {
      navigation.navigate('SpartansScreen');
    });
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.container}>
        {/* FORERUNNER KEY — descending from the heavens */}
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

        {/* HEADER BAR — glassy UNSC / Forerunner console */}
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

          {/* Spacer to balance layout */}
          <View style={{ width: 56 }} />
        </View>

        {/* CENTER PANEL */}
        <View style={styles.centerContent}>
          {/* “PRESS & HOLD” style label */}
          {!isAnimating && (
            <Text style={styles.pressLabel}>
              PRESS & WAIT
            </Text>
          )}

          {/* ACTIVATION CARD — glassy, glowing */}
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
            {/* Holographic image layer */}
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
              {/* subtle inner glass vignette */}
              <View style={styles.cardOverlay} />
            </Animated.View>

            {/* ACTIVATING text */}
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

  // HEADER
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

  // CENTER CONTENT
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

  // CARD
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

  // KEY
  keyImage: {
    resizeMode: 'contain',
  },

  // INSTRUCTIONS
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
