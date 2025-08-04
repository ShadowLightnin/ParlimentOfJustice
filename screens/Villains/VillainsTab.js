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

// Card dimensions for desktop and mobile
const cardSizes = {
  desktop: { width: 400, height: 600 },
  mobile: { width: 350, height: 500 },
};
const horizontalSpacing = isDesktop ? 40 : 20;
const verticalSpacing = isDesktop ? 50 : 20;

// Background music (shared across screens)
let backgroundSound = null;

const playTheme = async () => {
  if (!backgroundSound) {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/audio/BlackHoleBomb.mp4'),
        { shouldPlay: true, isLooping: true, volume: 0.7 }
      );
      backgroundSound = sound;
      await sound.playAsync();
      console.log('BlackHoleBomb.mp4 started playing at:', new Date().toISOString());
    } catch (error) {
      console.error('Failed to load audio file:', error);
      Alert.alert('Audio Error', 'Failed to load background music: ' + error.message);
    }
  } else if (!isPlaying) {
    try {
      await backgroundSound.playAsync();
      setIsPlaying(true);
      console.log('Audio resumed at:', new Date().toISOString());
    } catch (error) {
      console.error('Error resuming sound:', error);
    }
  }
};

const pauseTheme = async () => {
  if (backgroundSound && isPlaying) {
    try {
      await backgroundSound.pauseAsync();
      setIsPlaying(false);
      console.log('Audio paused at:', new Date().toISOString());
    } catch (error) {
      console.error('Error pausing sound:', error);
    }
  }
};

const stopBackgroundMusic = async () => {
  if (backgroundSound) {
    try {
      await backgroundSound.stopAsync();
      await backgroundSound.unloadAsync();
      backgroundSound = null;
      console.log('BlackHoleBomb.mp4 stopped at:', new Date().toISOString());
    } catch (error) {
      console.error('Error stopping/unloading sound:', error);
    }
  }
};

// Villains data with images, respective screens, and border colors
const villains = [
  { name: 'Fjord', screen: 'FjordScreen', image: require('../../assets/Villains/Fjord.jpg'), clickable: true, borderColor: 'red' },
  { name: 'Judge Hex', screen: 'JudgeHexScreen', image: require('../../assets/Villains/JudgeHex.jpg'), clickable: true, borderColor: 'red' },
  { name: 'Wraithblade', screen: 'WraithbladeScreen', image: require('../../assets/Villains/Wraithblade.jpg'), clickable: true, borderColor: 'red' },
  { name: 'Harbinger', screen: 'HarbingerScreen', image: require('../../assets/Villains/Harbinger.jpg'), clickable: true, borderColor: 'red' },
  { name: 'Venom Fang', screen: 'VenomFangScreen', image: require('../../assets/Villains/VenomFang.jpg'), clickable: true, borderColor: 'red' },
  { name: 'Shatterbloom', screen: 'ShatterbloomScreen', image: require('../../assets/Villains/Shatterbloom.jpg'), clickable: true, borderColor: 'red' },
  { name: 'Harbinger Dove', screen: 'HarbingerDoveScreen', image: require('../../assets/Villains/HarbingerDove.jpg'), clickable: true, borderColor: 'red' },
  { name: 'Byte Ruin', screen: 'ByteRuinScreen', image: require('../../assets/Villains/ByteRuin.jpg'), clickable: true, borderColor: 'red' },
  { name: 'Shade Weaver', screen: 'ShadeWeaverScreen', image: require('../../assets/Villains/ShadeWeaver.jpg'), clickable: true, borderColor: 'red' },
  { name: 'Rage Vortex', screen: 'RageVortexScreen', image: require('../../assets/Villains/RageVortex.jpg'), clickable: true, borderColor: 'red' },
  { name: "Mal'likhan", screen: 'MallikhanScreen', image: require('../../assets/Villains/Mallikhan.jpg'), clickable: true, borderColor: 'red' },
  { name: 'Elder Pyrrhus', screen: 'ElderPyrrhusScreen', image: require('../../assets/Villains/ElderPyrrhus.jpg'), clickable: true, borderColor: 'red' },
  { name: 'Dark Envoy', screen: 'DarkEnvoyScreen', image: require('../../assets/Villains/DarkEnvoy.jpg'), clickable: true, borderColor: 'red' },
  { name: 'Spectral Wraith', screen: 'SpectralWraithScreen', image: require('../../assets/Villains/SpectralWraith.jpg'), clickable: true, borderColor: 'red' },
  { name: 'Harrier', screen: 'HarrierScreen', image: require('../../assets/Villains/Harrier.jpg'), clickable: true, borderColor: 'red' },
  { name: 'Shade Widow', screen: 'ShadeWidowScreen', image: require('../../assets/Villains/ShadeWidow.jpg'), clickable: true, borderColor: 'red' },
  { name: 'Gilded Shard', screen: 'GildedShardScreen', image: require('../../assets/Villains/GildedShard.jpg'), clickable: true, borderColor: 'red' },
  { name: 'Chrome Phoenix', screen: 'ChromePhoenixScreen', image: require('../../assets/Villains/ChromePhoenix.jpg'), clickable: true, borderColor: 'red' },
  { name: 'Hades Ravage', screen: 'HadesRavageScreen', image: require('../../assets/Villains/HadesRavage.jpg'), clickable: true, borderColor: 'red' },
  { name: 'Spectral Warlord', screen: 'SpectralWarlordScreen', image: require('../../assets/Villains/SpectralWarlord.jpg'), clickable: true, borderColor: 'red' },
  { name: 'Virus Vortex', screen: 'VirusVortexScreen', image: require('../../assets/Villains/VirusVortex2.jpg'), clickable: true, borderColor: 'red' },
  { name: 'Shade Stalker', screen: 'ShadeStalkerScreen', image: require('../../assets/Villains/ShadeStalker.jpg'), clickable: true, borderColor: 'red' },
  { name: 'Volt Shade', screen: 'VoltShadeScreen', image: require('../../assets/Villains/VoltShade.jpg'), clickable: true, borderColor: 'red' },
  { name: 'Steel Juggernaut', screen: 'SteelJuggernautScreen', image: require('../../assets/Villains/SteelJuggernaut.jpg'), clickable: true, borderColor: 'red' },
  { name: 'Warhound', screen: 'WarhoundScreen', image: require('../../assets/Villains/Warhound.jpg'), clickable: true, borderColor: 'red' },
  { name: 'Overmind', screen: 'OvermindScreen', image: require('../../assets/Villains/Overmind.jpg'), clickable: true, borderColor: 'red' },
  { name: 'Obsidian Shroud', screen: 'ObsidianShroudScreen', image: require('../../assets/Villains/ObsidianShroud.jpg'), clickable: true, borderColor: 'red' },
  { name: 'Fangstrike', screen: 'FangstrikeScreen', image: require('../../assets/Villains/Fangstrike.jpg'), clickable: true, borderColor: 'red' },
  { name: 'Void Phantom', screen: 'VoidPhantomScreen', image: require('../../assets/Villains/VoidPhantom.jpg'), clickable: true, borderColor: 'red' },
  { name: 'The Blind Witch', screen: '', image: require('../../assets/Villains/IMG_4325.webp'), clickable: false, borderColor: null },
  { name: 'Elick', screen: '', image: require('../../assets/Villains/IMG_4343.webp'), clickable: false, borderColor: null },
  { name: 'BlackOut', screen: '', image: require('../../assets/Villains/BlackOut.jpg'), clickable: true, borderColor: null, hardcoded: true },
  { name: 'Void Consumer', screen: '', image: require('../../assets/Villains/VoidConsumer.jpg'), clickable: true, borderColor: null, hardcoded: true },

  
  // { name: 'Soulless Soul', screen: 'SoullessSoulScreen', image: require('../../assets/Villains/SoullessSoul.jpg'), clickable: true },
  // { name: 'The Void', screen: 'TheVoidScreen', image: require('../../assets/Villains/TheVoid.jpg'), clickable: true },
  // { name: 'Shadow Scribe', screen: 'ShadowScribeScreen', image: require('../../assets/Villains/ShadowScribe.jpg'), clickable: true },
  // { name: 'Bloody Harbinger', screen: 'BloodyHarbingerScreen', image: require('../../assets/Villains/BloodyHarbinger.jpg'), clickable: true },
  // { name: 'Unholy Vortex', screen: 'UnholyVortexScreen', image: require('../../assets/Villains/UnholyVortex.jpg'), clickable: true },
  // { name: 'Shadow Stalker', screen: 'ShadowStalkerScreen', image: require('../../assets/Villains/ShadowStalker.jpg'), clickable: true },
  // { name: '', screen: '', image: require('../../assets/Villains/.jpg'), clickable: false },
];

// Enlightened data with images, respective screens, and border colors
const enlightened = [
  { name: 'Noctura', screen: 'NocturaScreen', image: require('../../assets/Villains/Noctura.jpg'), clickable: true, borderColor: 'gold' },
  { name: 'Obelisk', screen: 'ObeliskScreen', image: require('../../assets/Villains/Obelisk.jpg'), clickable: true, borderColor: 'gold' },
  { name: 'Red Murcury', screen: 'RedMercuryScreen', image: require('../../assets/Villains/RedMercury.jpg'), clickable: true, borderColor: 'gold' },
  { name: 'Chrona', screen: 'ChronaScreen', image: require('../../assets/Villains/Chrona.jpg'), clickable: true, borderColor: 'gold' },
  { name: 'Evil Void Walker', screen: 'EvilSam', image: require('../../assets/Armor/Sam2.jpg'), clickable: true, borderColor: 'blue' },
  { name: 'Sable', screen: 'SableScreen', image: require('../../assets/Villains/Sable.jpg'), clickable: true, borderColor: 'gold' },
  { name: 'Titanus', screen: 'TitanusScreen', image: require('../../assets/Villains/Titanus.jpg'), clickable: true, borderColor: 'gold' },
];

const VillainsTab = () => {
  const navigation = useNavigation();
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Handle audio based on focus
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (currentSound) {
          currentSound.stopAsync().catch((error) => console.error('Error stopping sound:', error));
          currentSound.unloadAsync().catch((error) => console.error('Error unloading sound:', error));
          setCurrentSound(null);
          setIsPlaying(false);
          console.log('BlackHoleBomb.mp4 stopped at:', new Date().toISOString());
        }
      };
    }, [currentSound])
  );

  // Handle music playback
  const playTheme = async () => {
    if (!currentSound) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/audio/BlackHoleBomb.mp4'),
          { shouldPlay: true, isLooping: true, volume: 0.7 }
        );
        setCurrentSound(sound);
        await sound.playAsync();
        setIsPlaying(true);
        console.log('BlackHoleBomb.mp4 started playing at:', new Date().toISOString());
      } catch (error) {
        console.error('Failed to load audio file:', error);
        Alert.alert('Audio Error', 'Failed to load background music: ' + error.message);
      }
    } else if (!isPlaying) {
      try {
        await currentSound.playAsync();
        setIsPlaying(true);
        console.log('Audio resumed at:', new Date().toISOString());
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
        console.log('Audio paused at:', new Date().toISOString());
      } catch (error) {
        console.error('Error pausing sound:', error);
      }
    }
  };

  // Handle villain card press
  const handleVillainPress = async (villain) => {
    if (villain.clickable && villain.screen) {
      if (currentSound) {
        try {
          await currentSound.stopAsync();
          await currentSound.unloadAsync();
          setCurrentSound(null);
          setIsPlaying(false);
          console.log('BlackHoleBomb.mp4 stopped at:', new Date().toISOString());
        } catch (error) {
          console.error('Error stopping/unloading sound:', error);
        }
      }
      navigation.navigate(villain.screen);
    }
  };

  // Render Each Villain Card
  const renderVillainCard = (villain) => (
    <TouchableOpacity
      key={villain.name}
      style={[
        styles.card,
        {
          width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
          height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height
        },
        villain.clickable && villain.borderColor ? styles.clickable(villain.borderColor) : styles.notClickable
      ]}
      onPress={() => handleVillainPress(villain)}
      disabled={!villain.clickable}
    >
      <Image source={villain.image} style={styles.image} />
      <View style={styles.transparentOverlay} />
      <Text style={styles.name}>{villain.name}</Text>
      {!villain.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Villains.jpg')}
      style={styles.background}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* Back Button */}
          <TouchableOpacity
            onPress={async () => {
              if (currentSound) {
                try {
                  await currentSound.stopAsync();
                  await currentSound.unloadAsync();
                  setCurrentSound(null);
                  setIsPlaying(false);
                  console.log('BlackHoleBomb.mp4 stopped at:', new Date().toISOString());
                } catch (error) {
                  console.error('Error stopping/unloading sound:', error);
                }
              }
              navigation.navigate('Villains');
            }}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>⬅️ Back</Text>
          </TouchableOpacity>

          {/* Title */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Villainy')}
          >
            <Text style={styles.header}>Villains</Text>
          </TouchableOpacity>

          {/* Music Controls */}
          <View style={styles.musicControls}>
            <TouchableOpacity style={styles.musicButton} onPress={playTheme}>
              <Text style={styles.musicButtonText}>Theme</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.musicButton} onPress={pauseTheme}>
              <Text style={styles.musicButtonText}>Pause</Text>
            </TouchableOpacity>
          </View>

          {/* Scrollable Grids */}
          <View style={styles.scrollWrapper}>
            <Text style={styles.categoryHeader}>Villains</Text>
            <ScrollView
              horizontal
              contentContainerStyle={styles.scrollContainer}
              showsHorizontalScrollIndicator={true}
            >
              {villains.map(renderVillainCard)}
            </ScrollView>
            <Text style={styles.categoryHeader}>The Enlightened</Text>
            <ScrollView
              horizontal
              contentContainerStyle={styles.scrollContainer}
              showsHorizontalScrollIndicator={true}
            >
              {enlightened.map(renderVillainCard)}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingTop: 40,
    paddingBottom: 40,
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
    color: 'rgba(63, 0, 0, 0.897)',
    textAlign: 'center',
    textShadowColor: '#ff4d4dff',
    textShadowRadius: 20,
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
    color: '#ff0000',
    fontWeight: 'bold',
  },
  scrollWrapper: {
    width: SCREEN_WIDTH,
    marginTop: 20,
  },
  scrollContainer: {
    flexDirection: 'row',
    flexGrow: 1,
    width: 'auto',
    paddingVertical: verticalSpacing,
    alignItems: 'center',
  },
  card: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    marginRight: horizontalSpacing,
  },
  clickable: (borderColor) => ({
    borderColor: borderColor || 'red',
    borderWidth: 2,
  }),
  notClickable: {
    opacity: 0.8,
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
  categoryHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'left',
    textShadowColor: '#ff4d4d',
    textShadowRadius: 15,
    marginLeft: 10,
    marginBottom: 10,
  },
});

export default VillainsTab;