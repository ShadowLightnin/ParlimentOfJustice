import React, { useEffect, useState } from 'react';
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

// Screen dimensions
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// 🎵 Background Music
let backgroundSound;

// 🌄 Background Images Array
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

// 🖼️ Button Images Array
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

// Member Data
const members = [
  { name: '(Animation Trigger)', codename: '', screen: 'SpartansScreen', clickable: true, position: [1, 1] },
];

// Empty cell checker
const isEmpty = (row, col) =>
  (row === 0 && col === 0) || 
  (row === 0 && col === 1) || 
  (row === 0 && col === 2) || 
  (row === 1 && col === 0) || 
  (row === 1 && col === 2) || 
  (row === 2 && col === 0) || 
  (row === 2 && col === 1) || 
  (row === 2 && col === 2);

const getMemberAtPosition = (row, col) =>
  members.find((member) => member.position[0] === row && member.position[1] === col);

const ASTCScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const topPosition = useState(new Animated.Value(-SCREEN_HEIGHT * 1))[0]; 
  const [backgroundImage, setBackgroundImage] = useState(
    backgroundImages[Math.floor(Math.random() * backgroundImages.length)]
  );
  const [buttonImage, setButtonImage] = useState(
    buttonImages[Math.floor(Math.random() * buttonImages.length)]
  );

  // 🎯 Control key stopping point (vertical center-ish)
  const keyStopPosition = SCREEN_HEIGHT * 0.35;
  const imageWidth = 200;
  const centeredLeftPosition = SCREEN_WIDTH / 2 - imageWidth / 2;

  useEffect(() => {
    if (isFocused) {
      setBackgroundImage(backgroundImages[Math.floor(Math.random() * backgroundImages.length)]);
      setButtonImage(buttonImages[Math.floor(Math.random() * buttonImages.length)]);
      playBackgroundMusic();
    }
    return () => {};
  }, [isFocused]);

  const handleCardPress = () => {
    Animated.timing(topPosition, {
      toValue: keyStopPosition,
      duration: 3500,
      useNativeDriver: true,
    }).start(() => navigation.navigate('SpartansScreen'));
  };

  const handleBackPress = async () => {
    await stopBackgroundMusic();
    navigation.goBack();
  };

  const cardSize = SCREEN_WIDTH > 600 ? 200 : 120; 
  const cardHeightMultiplier = SCREEN_WIDTH > 600 ? 1.6 : 1.6; 
  const cardSpacing = SCREEN_WIDTH > 600 ? 40 : 10; 

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <SafeAreaView style={styles.container}>
        {/* Spartan Activation Animation */}
        <Animated.View 
          style={[
            styles.imageContainer, 
            { top: topPosition, left: centeredLeftPosition }
          ]}
        >
          <Image source={require('../../assets/Halo/Activation_Index.jpg')} style={styles.image} />
        </Animated.View>

        {/* Header Section */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Advanced Spartan 3 Corp</Text>
        </View>

        {/* Grid Layout */}
        <View style={[styles.grid, { gap: cardSpacing }]}>
          {[0, 1, 2].map((row) => (
            <View key={row} style={[styles.row, { gap: cardSpacing }]}>
              {[0, 1, 2].map((col) => {
                if (isEmpty(row, col)) {
                  return <View key={col} style={{ width: cardSize, height: cardSize * 1.0 }} />;
                }

                const member = getMemberAtPosition(row, col);
                return (
                  <TouchableOpacity
                    key={col}
                    style={[
                      styles.card, 
                      { width: cardSize, height: cardSize * cardHeightMultiplier }
                    ]}
                    onPress={handleCardPress}
                  >
                    <Image source={buttonImage} style={styles.cardImage} />
                    <Text style={styles.name}>{member.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover', justifyContent: 'center' },
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: 'rgba(0, 0, 0, 0.6)', alignItems: 'center' },
  headerWrapper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginTop: 50, paddingHorizontal: 20, marginBottom: 20 },
  backButton: { padding: 10, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 5 },
  backText: { fontSize: 18, color: '#00b3ff', fontWeight: 'bold' },
  header: { fontSize: 28, fontWeight: 'bold', color: '#fff', textShadowColor: '#00b3ff', textShadowRadius: 15, textAlign: 'center', flex: 1 },
  grid: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  row: { flexDirection: 'row' },
  card: { 
    backgroundColor: '#1c1c1c', 
    justifyContent: 'center', 
    alignItems: 'center', 
    borderRadius: 8, 
    padding: 5,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    height: '90%',
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  name: { 
    fontSize: 10, 
    fontWeight: 'bold', 
    color: '#fff', 
    textAlign: 'center', 
    marginTop: 5 
  },
  imageContainer: { position: 'absolute' },
  image: { width: 200, height: 200, resizeMode: 'contain' },
});

export default ASTCScreen;