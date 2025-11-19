import React, { useEffect, useRef } from 'react';
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

let backgroundSound;

const playBackgroundMusic = async () => {
  if (!backgroundSound) {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/audio/Halo2.wav'),
      { shouldPlay: true, isLooping: true }
    );
    backgroundSound = sound;
    await sound.playAsync();
  }
};

const stopBackgroundMusic = async () => {
  if (backgroundSound) {
    await backgroundSound.stopAsync();
    await backgroundSound.unloadAsync();
    backgroundSound = null;
  }
};

const ASTCScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const keyTop = useRef(new Animated.Value(-SCREEN_HEIGHT)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const buttonOpacity = useRef(new Animated.Value(1)).current;

  const [backgroundImage, setBackgroundImage] = React.useState(backgroundImages[0]);
  const [buttonImage, setButtonImage] = React.useState(buttonImages[0]);
  const [isAnimating, setIsAnimating] = React.useState(false);

  const KEY_STOP_POSITION = SCREEN_HEIGHT * 0.35;
  const KEY_SIZE = 220;
  const centeredLeft = SCREEN_WIDTH / 2 - KEY_SIZE / 2;

  useEffect(() => {
    if (isFocused) {
      const bg = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
      const btn = buttonImages[Math.floor(Math.random() * buttonImages.length)];
      setBackgroundImage(bg);
      setButtonImage(btn);
      playBackgroundMusic();

      keyTop.setValue(-SCREEN_HEIGHT);
      buttonScale.setValue(1);
      buttonOpacity.setValue(1);
      setIsAnimating(false);
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
      Animated.timing(buttonScale, { toValue: 1.3, duration: 200, useNativeDriver: true }),
      Animated.timing(buttonOpacity, { toValue: 0, duration: 3300, delay: 200, useNativeDriver: true }),
    ]).start();

    // Key descends — stops exactly at sacred position
    Animated.timing(keyTop, {
      toValue: KEY_STOP_POSITION,
      duration: 3500,
      useNativeDriver: true,
    }).start(() => {
      navigation.navigate('SpartansScreen');
    });
  };

  const cardSize = SCREEN_WIDTH > 600 ? 300 : 170;

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <SafeAreaView style={styles.container}>

        {/* The Key — No border, no shadow, pure divine descent */}
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
            style={styles.keyImage}
          />
        </Animated.View>

        {/* Header */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Advanced Spartan 3 Corp</Text>
          <View style={{ width: 50 }} />
        </View>

        {/* Center of the Ritual */}
        <View style={styles.centerContent}>

          {/* "PRESS & WAIT" — Above the card */}
          <Text style={styles.pressLabel}>
            {isAnimating ? '' : 'PRESS & WAIT'}
          </Text>

          {/* The Activation Card */}
          <TouchableOpacity
            style={[
              styles.card,
              {
                width: cardSize,
                height: cardSize * 1.6,
                borderWidth: 3,
                borderColor: isAnimating ? '#ff3333' : '#00b3ff',
                backgroundColor: isAnimating ? 'rgba(255,51,51,0.2)' : 'rgba(0,179,255,0.15)',
                shadowColor: isAnimating ? '#ff3333' : '#00b3ff',
                shadowOpacity: 1,
                shadowRadius: isAnimating ? 35 : 25,
                elevation: isAnimating ? 35 : 20,
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
              <Image source={buttonImage} style={styles.cardImage} resizeMode="cover" />
            </Animated.View>

            {/* "ACTIVATING..." — Bottom center */}
            {isAnimating && (
              <Text style={styles.activatingText}>ACTIVATING...</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.instruction}>
            Press to activate{'\n'}And deploy the Spartans
          </Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  headerWrapper: {
    position: 'absolute',
    top: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 10,
  },
  backButton: {
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
  },
  backText: { fontSize: 20, color: '#00b3ff', fontWeight: 'bold' },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#00b3ff',
    textShadowRadius: 20,
    textAlign: 'center',
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressLabel: {
    position: 'absolute',
    top: -60,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00b3ff',
    textShadowColor: '#00b3ff',
    textShadowRadius: 16,
    letterSpacing: 2,
  },
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  activatingText: {
    position: 'absolute',
    bottom: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff3333',
    textShadowColor: '#000',
    textShadowRadius: 10,
    letterSpacing: 1,
  },
  keyImage: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
  },
  instruction: {
    marginTop: 50,
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
    textShadowColor: '#000',
    textShadowRadius: 8,
  },
});

export default ASTCScreen;