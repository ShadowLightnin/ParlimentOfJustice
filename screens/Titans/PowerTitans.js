import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Card dimensions
const cardSizes = {
  desktop: { width: 400, height: 600 },
  mobile: { width: 350, height: 500 },
};
const horizontalSpacing = SCREEN_WIDTH > 600 ? 40 : 20;

// Member Data
const members = [
  { name: 'Spencer McNeil', codename: 'Annihilator', screen: 'Spencer', clickable: true, image: require('../../assets/Armor/PowerSpencer.jpg'), borderColor: 'purple' },
  { name: 'Azure Briggs', codename: 'Mediateir', screen: 'Azure', clickable: true, image: require('../../assets/Armor/Azure3.jpg'), borderColor: 'purple' },
  { name: 'Jared McNeil', codename: 'Spector', screen: 'Jared', clickable: true, image: require('../../assets/Armor/JaredLegacy.jpg'), borderColor: 'purple' },
  { name: 'Will Cummings', codename: 'Night Hawk', screen: 'Will', clickable: true, image: require('../../assets/Armor/PowerWill.jpg'), borderColor: 'purple' },
  { name: 'Ben Briggs', codename: 'Nuscus', screen: 'Ben', clickable: true, image: require('../../assets/Armor/BenLegacy.jpg'), borderColor: 'purple' },
  { name: 'Jennifer McNeil', codename: 'Kintsugi', screen: 'Jennifer', clickable: true, image: require('../../assets/Armor/JenniferLegacy.jpg'), borderColor: 'purple' },
  { name: 'Emma Cummings', codename: 'Kintsunera', screen: 'Emma', clickable: true, image: require('../../assets/Armor/EmmaLegacy.jpg'), borderColor: 'purple' },
  { name: 'Add Character', screen: 'CharacterDetail', clickable: true, image: require('../../assets/Armor/PlaceHolder.jpg'), borderColor: 'green' },
];

// Background music (shared across screens)
let backgroundSound = null;

const playBackgroundMusic = async () => {
  if (!backgroundSound) {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/audio/FireAndAsh.mp4'),
        { shouldPlay: true, isLooping: true, volume: 0.7 }
      );
      backgroundSound = sound;
      await sound.playAsync();
      console.log('FireAndAsh.mp4 started playing at:', new Date().toISOString());
    } catch (error) {
      console.error('Failed to load audio file:', error);
      Alert.alert('Audio Error', 'Failed to load background music: ' + error.message);
    }
  }
};

const stopBackgroundMusic = async () => {
  if (backgroundSound) {
    try {
      await backgroundSound.stopAsync();
      await backgroundSound.unloadAsync();
      backgroundSound = null;
      console.log('FireAndAsh.mp4 stopped at:', new Date().toISOString());
    } catch (error) {
      console.error('Error stopping/unloading sound:', error);
    }
  }
};

const PowerTitans = () => {
  const navigation = useNavigation();

  // Handle audio based on focus
  useFocusEffect(
    useCallback(() => {
      playBackgroundMusic();
      return () => {
        if (navigation.getState().routes[navigation.getState().index].name === 'PowerTitans') {
          stopBackgroundMusic();
        }
      };
    }, [navigation])
  );

  // Handle member card press
  const handleMemberPress = async (member) => {
    if (member.clickable && member.screen) {
      navigation.navigate(member.screen, { member });
    }
  };

  // Render Each Member Card
  const renderMemberCard = (member) => (
    <TouchableOpacity
      key={member.name}
      style={[
        styles.card,
        {
          width: SCREEN_WIDTH > 600 ? cardSizes.desktop.width : cardSizes.mobile.width,
          height: SCREEN_WIDTH > 600 ? cardSizes.desktop.height : cardSizes.mobile.height,
        },
        member.clickable && member.borderColor ? styles.clickable(member.borderColor) : styles.notClickable,
      ]}
      onPress={() => handleMemberPress(member)}
      disabled={!member.clickable}
    >
      <Image source={member.image} style={styles.image} />
      <View style={styles.transparentOverlay} />
      <Text style={styles.name}>{member.name}</Text>
      {!member.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Titans.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={async () => {
            await stopBackgroundMusic();
            navigation.navigate('Home');
          }}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>⬅️ Back</Text>
        </TouchableOpacity>

        {/* Title */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Titans')}
        >
          <Text style={styles.header}>Titans</Text>
        </TouchableOpacity>

        {/* Horizontal Scrollable Cards */}
        <View style={styles.scrollWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={[styles.scrollContainer, { gap: horizontalSpacing }]}
          >
            {members.map(renderMemberCard)}
          </ScrollView>
        </View>
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
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingTop: 40,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#750000',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 5,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1b084d',
    textAlign: 'center',
    textShadowColor: '#9561f5',
    textShadowRadius: 25,
    marginBottom: 20,
  },
  scrollWrapper: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  scrollContainer: {
    flexDirection: 'row',
    flexGrow: 1,
    width: 'auto',
    paddingVertical: 20,
    alignItems: 'center',
  },
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  clickable: (borderColor) => ({
    borderColor: borderColor || 'purple',
    borderWidth: 2,
  }),
  notClickable: {
    opacity: 0.5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1,
  },
  name: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  disabledText: {
    fontSize: 12,
    color: '#ff4444',
    marginTop: 5,
  },
});

export default PowerTitans;