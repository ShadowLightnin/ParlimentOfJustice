// JusticeScreen.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Modal,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';

import Guardians from './Guardians';
import Elementals from './Elementals';
import JusticeLeague from './JusticeLeague';
import TheSeven from './TheSeven';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isDesktop = SCREEN_WIDTH > 600;

const cardSizes = {
  desktop: { width: 420, height: 620 },
  mobile: { width: 360, height: 540 },
};
const horizontalSpacing = isDesktop ? 50 : 25;

let currentSound = null;

const JusticeScreen = () => {
  const navigation = useNavigation();
  const [previewHero, setPreviewHero] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playTheme = async () => {
    if (currentSound) {
      await currentSound.playAsync();
      setIsPlaying(true);
      return;
    }
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/audio/Superman.mp4'),
        { shouldPlay: true, isLooping: true, volume: 1.0 }
      );
      currentSound = sound;
      setIsPlaying(true);
    } catch (e) {
      Alert.alert('Audio Error', 'Could not play theme.');
    }
  };

  const pauseTheme = async () => {
    if (currentSound && isPlaying) {
      await currentSound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const stopAndUnload = async () => {
    if (currentSound) {
      try { await currentSound.stopAsync(); await currentSound.unloadAsync(); } catch (e) {}
      currentSound = null;
      setIsPlaying(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => stopAndUnload();
    }, [])
  );

  const goToDetail = async (hero) => {
    await stopAndUnload();
    navigation.navigate('JusticeCharacterDetail', { member: hero });
  };

  const goToHeroes = async () => {
    await stopAndUnload();
    navigation.navigate('Heroes');
  };

  const openPreview = (hero) => setPreviewHero(hero);
  const closePreview = async () => {
    await stopAndUnload();
    await playTheme();
    setPreviewHero(null);
  };

  const renderHeroCard = ({ item }) => {
    const clickable = item.clickable !== false;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
            height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height,
          },
          clickable ? styles.clickable : styles.notClickable,
        ]}
        onPress={() => clickable ? goToDetail(item) : openPreview(item)}
      >
        <Image
          source={item.image || require('../../assets/Armor/PlaceHolder.jpg')}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        <Text style={styles.heroName}>{item.name || item.codename || 'Unknown'}</Text>
        {!clickable && <Text style={styles.comingSoon}>Coming Soon</Text>}
      </TouchableOpacity>
    );
  };

  const renderPreviewCard = () => {
    if (!previewHero) return null;
    return (
      <TouchableOpacity style={styles.previewCard} onPress={closePreview}>
        <Image
          source={previewHero.image || require('../../assets/Armor/LoneRanger.jpg')}
          style={styles.previewImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        <Text style={styles.cardName}>
          © {previewHero.name || previewHero.codename || 'Unknown'} — William Cummings
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Justice.jpg')}
      style={styles.background}
      resizeMode="cover"           // Ensures full coverage on desktop & mobile
    >
      <View style={styles.overlayContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>

          {/* Clickable Title → Heroes Screen */}
          <TouchableOpacity onPress={goToHeroes} activeOpacity={0.8}>
            <Text style={styles.mainTitle}>Guardians of Justice</Text>
          </TouchableOpacity>

          {/* Music Controls */}
          <View style={styles.musicControls}>
            <TouchableOpacity style={styles.musicBtn} onPress={playTheme}>
              <Text style={styles.musicText}>Play Theme</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.musicBtn} onPress={pauseTheme}>
              <Text style={styles.musicText}>Pause</Text>
            </TouchableOpacity>
          </View>

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={async () => {
              await stopAndUnload();
              navigation.navigate('Home');
            }}
          >
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          {/* Vigilante Button */}
          <TouchableOpacity
            style={styles.vigilanteButton}
            onPress={async () => {
              await stopAndUnload();
              navigation.navigate('VigilanteScreen');
            }}
          >
            <Image
              source={require('../../assets/BackGround/Vigilantes.jpg')}
              style={styles.vigilanteImg}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* Hero Sections */}
          <View style={styles.sections}>

            <Text style={styles.sectionTitle}>Guardians</Text>
            <FlatList
              horizontal
              data={Guardians}
              renderItem={renderHeroCard}
              keyExtractor={(_, i) => `g-${i}`}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.list}
            />

            <Text style={styles.sectionTitle}>Elemental Masters</Text>
            <FlatList
              horizontal
              data={Elementals}
              renderItem={renderHeroCard}
              keyExtractor={(_, i) => `e-${i}`}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.list}
            />

            <Text style={styles.sectionTitle}>Justice League</Text>
            <FlatList
              horizontal
              data={JusticeLeague}
              renderItem={renderHeroCard}
              keyExtractor={(_, i) => `jl-${i}`}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.list}
            />

            <Text style={styles.sectionTitle}>Omni Jumpers</Text>
            <FlatList
              horizontal
              data={TheSeven}
              renderItem={renderHeroCard}
              keyExtractor={(_, i) => `ts-${i}`}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.list}
            />
          </View>

        </ScrollView>
      </View>

      {/* Preview Modal */}
      <Modal visible={!!previewHero} transparent animationType="fade" onRequestClose={closePreview}>
        <TouchableOpacity style={styles.modalBg} activeOpacity={1} onPress={closePreview}>
          <View style={styles.modalContent}>
            {renderPreviewCard()}
            <View style={styles.previewFooter}>
              <Text style={styles.previewName}>
                {previewHero?.name || previewHero?.codename || 'Unknown Hero'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { width: '100%', height: '100%' },
  overlayContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)' },
  scrollContainer: { paddingBottom: 120, alignItems: 'center' },

  mainTitle: {
    fontSize: isDesktop ? 56 : 40,
    fontWeight: '900',
    color: '#FFF',
    textAlign: 'center',
    marginTop: isDesktop ? 60 : 80,
    marginBottom: 20,
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },

  musicControls: { flexDirection: 'row', gap: 30, marginBottom: 30 },
  musicBtn: {
    backgroundColor: 'rgba(0,179,255,0.25)',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#00B3FF',
  },
  musicText: { color: '#00FFFF', fontSize: 18, fontWeight: 'bold' },

  backButton: {
    position: 'absolute',
    top: isDesktop ? 60 : 30,
    left: 20,
    backgroundColor: 'rgba(17,25,40,0.9)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  backText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },

  vigilanteButton: { position: 'absolute', top: isDesktop ? 60 : 20, right: 20 },
  vigilanteImg: { width: 65, height: 65, borderRadius: 40, borderWidth: 4, borderColor: '#FFD700' },

  sections: { width: '100%', marginTop: 20 },
  sectionTitle: {
    fontSize: 32,
    color: '#FFD',
    fontWeight: 'bold',
    marginLeft: 25,
    marginTop: 40,
    marginBottom: 15,
    textShadowColor: '#FFD700',
    textShadowRadius: 12,
  },
  list: { paddingLeft: 20, paddingRight: 40 },

  card: { borderRadius: 22, overflow: 'hidden', marginRight: horizontalSpacing, elevation: 20 },
  clickable: { borderWidth: 5, borderColor: '#FFD700' },
  notClickable: { opacity: 0.65 },
  heroImage: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.42)' },
  heroName: { position: 'absolute', bottom: 25, left: 25, fontSize: 24, color: '#FFF', fontWeight: 'bold', textShadowColor: '#000', textShadowRadius: 10 },
  comingSoon: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(220,0,0,0.8)', color: '#FFF', padding: 8, borderRadius: 10, fontSize: 13 },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.97)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { alignItems: 'center' },
  previewCard: { width: SCREEN_WIDTH * 0.88, height: SCREEN_HEIGHT * 0.72, borderRadius: 28, overflow: 'hidden', elevation: 25 },
  previewImage: { width: '100%', height: '100%' },
  cardName: { position: 'absolute', bottom: 35, left: 35, fontSize: 22, color: '#FFF', fontWeight: 'bold', textShadowColor: '#000', textShadowRadius: 12 },
  previewFooter: { marginTop: 35, padding: 22, backgroundColor: 'rgba(255,215,0,0.25)', borderRadius: 18, borderWidth: 3, borderColor: '#FFD700' },
  previewName: { fontSize: 30, color: '#FFD700', fontWeight: 'bold', textAlign: 'center' },
});

export default JusticeScreen;