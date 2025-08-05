import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Alert
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;

// Angels data with images, respective screens, and border colors
const angels = [
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0498.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0499.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0500.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0501.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0502.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0503.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0508.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0509.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0510.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0511.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0512.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0513.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0514.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0515.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0520.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0521.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0522.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0523.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0524.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0525.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0526.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0527.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0557.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0558.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0559.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0564.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0566.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0567.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0568.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0569.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0570.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0571.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0572.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0573.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0574.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0575.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0576.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0577.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0578.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_0579.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_5635.jpg'), clickable: true, borderColor: 'gold' },
  { name: '', screen: '', image: require('../../assets/Armor/Angels/IMG_6943.jpg'), clickable: true, borderColor: 'gold' },
    // { name: '', screen: '', image: require('../../assets/Angels/.jpg'), clickable: false, borderColor: null },
];

// Card dimensions for desktop and mobile
const cardSizes = {
  desktop: { width: 400, height: 600 },
  mobile: { width: 350, height: 500 },
};

// Background music (shared across screens)
// let backgroundSound = null;

// const playTheme = async (setCurrentSound, setIsPlaying) => {
//   if (!backgroundSound) {
//     try {
//       const { sound } = await Audio.Sound.createAsync(
//         require('../../assets/audio/AngelsTheme.mp4'),
//         { shouldPlay: true, isLooping: true, volume: 0.7 }
//       );
//       backgroundSound = sound;
//       setCurrentSound(sound);
//       await sound.playAsync();
//       setIsPlaying(true);
//       console.log('AngelsTheme.mp4 started playing at:', new Date().toISOString());
//     } catch (error) {
//       console.error('Failed to load audio file:', error);
//       Alert.alert('Audio Error', 'Failed to load background music: ' + error.message);
//     }
//   } else {
//     try {
//       await backgroundSound.playAsync();
//       setIsPlaying(true);
//       console.log('Audio resumed at:', new Date().toISOString());
//     } catch (error) {
//       console.error('Error resuming sound:', error);
//     }
//   }
// };

// const pauseTheme = async (setIsPlaying) => {
//   if (backgroundSound) {
//     try {
//       await backgroundSound.pauseAsync();
//       setIsPlaying(false);
//       console.log('Audio paused at:', new Date().toISOString());
//     } catch (error) {
//       console.error('Error pausing sound:', error);
//     }
//   }
// };

// const stopBackgroundMusic = async () => {
//   if (backgroundSound) {
//     try {
//       await backgroundSound.stopAsync();
//       await backgroundSound.unloadAsync();
//       backgroundSound = null;
//       console.log('AngelsTheme.mp4 stopped at:', new Date().toISOString());
//     } catch (error) {
//       console.error('Error stopping/unloading sound:', error);
//     }
//   }
// };

const Angels = () => {
  const navigation = useNavigation();
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Handle audio based on focus
//   useFocusEffect(
//     useCallback(() => {
//       playTheme(setCurrentSound, setIsPlaying);
//       return () => {
//         if (currentSound) {
//           currentSound.stopAsync().catch((error) => console.error('Error stopping sound:', error));
//           currentSound.unloadAsync().catch((error) => console.error('Error unloading sound:', error));
//           setCurrentSound(null);
//           setIsPlaying(false);
//           console.log('AngelsTheme.mp4 stopped at:', new Date().toISOString());
//         }
//       };
//     }, [])
//   );

  // Handle angel card press
//   const handleAngelPress = async (angel) => {
//     if (angel.clickable && angel.screen) {
//       if (currentSound) {
//         try {
//           await currentSound.stopAsync();
//           await currentSound.unloadAsync();
//           setCurrentSound(null);
//           setIsPlaying(false);
//           console.log('AngelsTheme.mp4 stopped at:', new Date().toISOString());
//         } catch (error) {
//           console.error('Error stopping/unloading sound:', error);
//         }
//       }
//       navigation.navigate(angel.screen);
//     } else if (angel.clickable) {
//       console.log(`${angel.name} clicked`);
//     }
//   };

  // Render Each Angel Card
  const renderAngelCard = (angel) => (
    <TouchableOpacity
      key={angel.name}
      style={[
        styles.card,
        {
          width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
          height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height
        },
        angel.clickable && angel.borderColor ? styles.clickable(angel.borderColor) : styles.notClickable
      ]}
      onPress={() => handleAngelPress(angel)}
      disabled={!angel.clickable}
    >
      <Image source={angel.image} style={styles.image} />
      <View style={styles.transparentOverlay} />
      <Text style={styles.name}>© William Cummings {angel.name}</Text>
      {!angel.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Angel.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={async () => {
            // if (currentSound) {
            //   try {
            //     await currentSound.stopAsync();
            //     await currentSound.unloadAsync();
            //     setCurrentSound(null);
            //     setIsPlaying(false);
            //     console.log('AngelsTheme.mp4 stopped at:', new Date().toISOString());
            //   } catch (error) {
            //     console.error('Error stopping/unloading sound:', error);
            //   }
            // }
            navigation.navigate('Aileen');
          }}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>⬅️ </Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.header}>Heaven's Guard</Text>

        {/* Music Controls */}
        {/* <View style={styles.musicControls}>
          <TouchableOpacity style={styles.musicButton} onPress={() => playTheme(setCurrentSound, setIsPlaying)}>
            <Text style={styles.musicButtonText}>Theme</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.musicButton} onPress={() => pauseTheme(setIsPlaying)}>
            <Text style={styles.musicButtonText}>Pause</Text>
          </TouchableOpacity>
        </View> */}

        {/* Horizontal Scrollable Cards */}
        <View style={styles.scrollWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={[styles.scrollContainer, { gap: isDesktop ? 40 : 20 }]}
          >
            {angels.map(renderAngelCard)}
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
    backgroundColor: '#FFD700',
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderRadius: 8,
    elevation: 5,
  },
  backButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    textShadowColor: '#FFD700',
    textShadowRadius: 25,
    marginBottom: 20,
  },
  musicControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  musicButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  musicButtonText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: 'bold',
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
    borderColor: borderColor || 'gold',
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

export default Angels;