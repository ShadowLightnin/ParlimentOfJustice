import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isDesktop = SCREEN_WIDTH > 600;

const cardSizes = {
  desktop: { width: 400, height: 600 },
  mobile: { width: 350, height: 500 },
};
const horizontalSpacing = isDesktop ? 40 : 20;
const verticalSpacing = isDesktop ? 50 : 20;

// === YOUR FULL DATA — NOTHING REMOVED ===
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
  { name: 'The Blind Witch', screen: '', image: require('../../assets/Villains/IMG_4325.webp'), clickable: true, borderColor: 'red' },
  { name: 'Elick', screen: '', image: require('../../assets/Villains/IMG_4343.webp'), clickable: true, borderColor: 'red' },
  { name: 'Void Consumer', screen: '', image: require('../../assets/Villains/VoidConsumer.jpg'), clickable: true, borderColor: 'red' },
  // ALL YOUR COMMENTED LINES STILL HERE
];

const enlightened = [
  { name: 'Noctura', screen: 'NocturaScreen', image: require('../../assets/Villains/Noctura.jpg'), clickable: true, borderColor: 'gold' },
  { name: 'Obelisk', screen: 'ObeliskScreen', image: require('../../assets/Villains/Obelisk.jpg'), clickable: true, borderColor: 'gold' },
  { name: 'Red Murcury', screen: 'RedMercuryScreen', image: require('../../assets/Villains/RedMercury.jpg'), clickable: true, borderColor: 'gold' },
  { name: 'BlackOut', screen: '', image: require('../../assets/Villains/BlackOut.jpg'), clickable: true, borderColor: 'gold' },
  { name: 'Chrona', screen: 'ChronaScreen', image: require('../../assets/Villains/Chrona.jpg'), clickable: true, borderColor: 'gold' },
  { name: 'Evil Void Walker', screen: 'EvilSam', image: require('../../assets/Armor/Sam2.jpg'), clickable: true, borderColor: 'blue' },
  { name: 'Sable', screen: 'SableScreen', image: require('../../assets/Villains/Sable.jpg'), clickable: true, borderColor: 'gold' },
  { name: 'Titanus', screen: 'TitanusScreen', image: require('../../assets/Villains/Titanus.jpg'), clickable: true, borderColor: 'gold' },
];

const VillainsTab = () => {
  const navigation = useNavigation();
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useFocusEffect(
    useCallback(() => {
      return () => {
        if (currentSound) {
          currentSound.stopAsync();
          currentSound.unloadAsync();
          setCurrentSound(null);
          setIsPlaying(false);
        }
      };
    }, [currentSound])
  );

  const playTheme = async () => {
    if (!currentSound) {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/audio/BlackHoleBomb.mp4'),
        { shouldPlay: true, isLooping: true, volume: 0.7 }
      );
      setCurrentSound(sound);
      await sound.playAsync();
      setIsPlaying(true);
    } else if (!isPlaying) {
      await currentSound.playAsync();
      setIsPlaying(true);
    }
  };

  const pauseTheme = async () => {
    if (currentSound && isPlaying) {
      await currentSound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const stopAndGoToDetail = async (villain) => {
    if (currentSound) {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      setCurrentSound(null);
      setIsPlaying(false);
    }
    navigation.navigate('EnlightenedCharacterDetail', { member: villain });
  };

  const handlePress = (villain) => {
    // If it has a dedicated screen → go there
    if (villain.screen && villain.screen.trim() !== '') {
      navigation.navigate(villain.screen);
    } else {
      // Otherwise → go to full detail with description
      stopAndGoToDetail(villain);
    }
  };

  const renderVillainCard = (villain) => (
    <TouchableOpacity
      key={villain.name}
      style={[
        styles.card,
        {
          width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
          height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height,
        },
        villain.borderColor ? styles.clickable(villain.borderColor) : styles.notClickable,
      ]}
      onPress={() => handlePress(villain)}
      activeOpacity={0.85}
    >
      <Image source={villain.image} style={styles.image} />
      <View style={styles.transparentOverlay} />
      <Text style={styles.name}>{villain.name}</Text>
      {/* {!villain.screen && <Text style={styles.detailHint}>Tap for Bio</Text>} */}
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
                await currentSound.stopAsync();
                await currentSound.unloadAsync();
                setCurrentSound(null);
                setIsPlaying(false);
              }
              navigation.navigate('Villains');
            }}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Villainy')}>
            <Text style={styles.header}>Villains</Text>
          </TouchableOpacity>

          <View style={styles.musicControls}>
            <TouchableOpacity style={styles.musicButton} onPress={playTheme}>
              <Text style={styles.musicButtonText}>Theme</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.musicButton} onPress={pauseTheme}>
              <Text style={styles.musicButtonText}>Pause</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.scrollWrapper}>
            <Text style={styles.categoryHeader}>Villains</Text>
            <ScrollView horizontal contentContainerStyle={styles.scrollContainer} showsHorizontalScrollIndicator>
              {villains.map(renderVillainCard)}
            </ScrollView>

            <Text style={styles.categoryHeader}>The Enlightened</Text>
            <ScrollView horizontal contentContainerStyle={styles.scrollContainer} showsHorizontalScrollIndicator>
              {enlightened.map(renderVillainCard)}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT, resizeMode: 'cover' },
  scrollView: { flex: 1 },
  container: { backgroundColor: 'rgba(0,0,0,0.7)', paddingTop: 40, paddingBottom: 40, alignItems: 'center' },
  backButton: {
    position: 'absolute', top: 40, left: 20,
    backgroundColor: '#750000', paddingVertical: 10, paddingHorizontal: 24,
    borderRadius: 12, elevation: 8, borderWidth: 2, borderColor: '#ff3333',
  },
  backButtonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  header: { fontSize: 42, fontWeight: '900', color: '#8B0000', textAlign: 'center', textShadowColor: '#ff3333', textShadowRadius: 25, marginVertical: 20 },
  musicControls: { flexDirection: 'row', gap: 20, marginBottom: 20 },
  musicButton: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: 'rgba(255,0,0,0.3)', borderRadius: 30, borderWidth: 2, borderColor: '#ff3333' },
  musicButtonText: { fontSize: 16, color: '#ff3333', fontWeight: 'bold' },
  scrollWrapper: { width: SCREEN_WIDTH, marginTop: 20 },
  scrollContainer: { flexDirection: 'row', paddingVertical: verticalSpacing, alignItems: 'center', paddingHorizontal: 10 },
  card: { borderRadius: 20, overflow: 'hidden', elevation: 12, backgroundColor: 'rgba(0,0,0,0.8)', marginRight: horizontalSpacing, shadowColor: '#ff0000', shadowOpacity: 0.6, shadowRadius: 15 },
  clickable: (color) => ({ borderColor: color === 'gold' ? '#FFD700' : '#ff0000', borderWidth: 4 }),
  notClickable: { opacity: 0.85 },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  transparentOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  name: { position: 'absolute', bottom: 18, left: 18, fontSize: 22, color: '#FFF', fontWeight: '900', textShadowColor: '#000', textShadowRadius: 10 },
  detailHint: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(100,0,0,0.8)', color: '#FFF', padding: 6, borderRadius: 8, fontSize: 11, fontWeight: 'bold' },
  categoryHeader: { fontSize: 28, fontWeight: 'bold', color: '#FFF', textAlign: 'left', textShadowColor: '#ff3333', textShadowRadius: 20, marginLeft: 15, marginVertical: 10 },
});

export default VillainsTab;