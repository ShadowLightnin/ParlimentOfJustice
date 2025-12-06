// JusticeScreen.js
import React, { useState, useCallback, useRef } from 'react';
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
  Animated,
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

  // 🔽 INFO DROPDOWN – for the four teams
  const [infoOpen, setInfoOpen] = useState(false);
  const infoAnim = useRef(new Animated.Value(0)).current;

  const toggleInfo = useCallback(() => {
    if (infoOpen) {
      Animated.timing(infoAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setInfoOpen(false));
    } else {
      setInfoOpen(true);
      Animated.timing(infoAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [infoOpen, infoAnim]);

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
      try {
        await currentSound.pauseAsync();
        setIsPlaying(false);
      } catch {}
    }
  };

  const stopAndUnload = async () => {
    if (currentSound) {
      try {
        await currentSound.stopAsync();
      } catch {}
      try {
        await currentSound.unloadAsync();
      } catch {}
      currentSound = null;
      setIsPlaying(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        stopAndUnload();
      };
    }, [])
  );

  const goToDetail = async (hero) => {
    await stopAndUnload();
    navigation.navigate('JusticeCharacterDetail', { member: hero } );
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
        onPress={() => (clickable ? goToDetail(item) : openPreview(item))}
      >
        <Image
          source={item.image || require('../../assets/Armor/PlaceHolder.jpg')}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        <Text style={styles.heroName}>
          {item.name || item.codename || 'Unknown'}
        </Text>
        {!clickable && (
          <Text style={styles.comingSoon}>Coming Soon</Text>
        )}
      </TouchableOpacity>
    );
  };

  const renderPreviewCard = () => {
    if (!previewHero) return null;
    return (
      <TouchableOpacity style={styles.previewCard} onPress={closePreview}>
        <Image
          source={
            previewHero.image || require('../../assets/Armor/LoneRanger.jpg')
          }
          style={styles.previewImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        <Text style={styles.cardName}>
          © {previewHero.name || previewHero.codename || 'Unknown'} — William
          Cummings
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Justice.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlayContainer}>
        {/* HEADER ROW like Titans: back, glass card, vigilantes */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={async () => {
              await stopAndUnload();
              navigation.navigate('Home');
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.backIcon}>⬅️</Text>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <View style={styles.headerGlass}>
              {/* Title – tap to go to Heroes */}
              <TouchableOpacity onPress={goToHeroes} activeOpacity={0.9}>
                <Text style={styles.headerTitle}>Guardians of Justice</Text>
              </TouchableOpacity>

              <Text style={styles.headerSubtitle}>
                Prime Parliament hero coalition
              </Text>

              {/* Lore toggle line */}
              <TouchableOpacity onPress={toggleInfo} activeOpacity={0.85}>
                <Text style={styles.headerHint}>
                  {infoOpen ? 'Hide team lore ⬆️' : 'Tap for team lore ⬇️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.vigilanteButton}
            onPress={async () => {
              await stopAndUnload();
              navigation.navigate('VigilanteScreen');
            }}
            activeOpacity={0.85}
          >
            <Image
              source={require('../../assets/BackGround/Vigilantes.jpg')}
              style={styles.vigilanteImg}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>

        {/* DROPDOWN PANEL just under header */}
<Animated.View
  pointerEvents={infoOpen ? 'auto' : 'none'}
  style={[
    styles.infoPanel,
    {
      opacity: infoAnim,
      transform: [
        {
          translateY: infoAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-10, 0],
          }),
        },
      ],
    },
  ]}
>
  {infoOpen && (
    <ScrollView
      style={styles.infoScroll}
      contentContainerStyle={styles.infoScrollContent}
      nestedScrollEnabled
    >
      {/* Header row with X */}
      <View style={styles.infoHeaderRow}>
        <Text style={styles.infoHeaderTitle}>
          Guardians of Justice — Team Lore
        </Text>
        <TouchableOpacity
          onPress={toggleInfo}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Text style={styles.infoClose}>✕</Text>
        </TouchableOpacity>
      </View>
              {/* GUARDIANS */}
              <Text style={styles.infoSectionTitle}>Guardians</Text>
              <Text style={styles.infoText}>
                The Guardians are the public-facing protectors of Zion City,
                the wider world and galaxy — the capes and symbols most citizens
                actually recognize. They stand in the open when the streets are
                on fire.
              </Text>
              <Text style={styles.infoLabel}>What they represent</Text>
              <Text style={styles.infoText}>
                Hope, visibility, and everyday heroism. They prove heroes
                aren&apos;t just cosmic gods and secret councils — they&apos;re
                the ones who actually show up.
              </Text>
              <Text style={styles.infoLabel}>
                Enemy types they specialize against
              </Text>
              <Text style={styles.infoText}>
                • City-level threats and organized crime syndicates{'\n'}
                • Rogue supers and corrupted former heroes{'\n'}
                • Public crises where rescue, optics, and morale matter
              </Text>

              {/* ELEMENTAL MASTERS */}
              <Text style={styles.infoSectionTitle}>Elemental Masters</Text>
              <Text style={styles.infoText}>
                The Elemental Masters are living forces of nature — wielders of
                fire, water, air, earth, and stranger cosmic elements. When a
                problem is too huge or too wild for normal tactics, they&apos;re
                the ones unleashed.
              </Text>
              <Text style={styles.infoLabel}>What they represent</Text>
              <Text style={styles.infoText}>
                Balance between overwhelming power and restraint. Every fight is
                a tightrope between cataclysm and salvation.
              </Text>
              <Text style={styles.infoLabel}>
                Enemy types they specialize against
              </Text>
              <Text style={styles.infoText}>
                • Disasters amplified by villain interference{'\n'}
                • Elemental beasts, avatars, and corrupted guardians{'\n'}
                • Battlefields where terrain and weather must be rewritten
              </Text>

              {/* JUSTICE LEAGUE */}
              <Text style={styles.infoSectionTitle}>Justice League</Text>
              <Text style={styles.infoText}>
                The Justice League are the icons — the legendary blueprint for
                hero teams across realities. When the stakes jump from
                &quot;city&quot; to &quot;world&quot;, these are the capes that
                answer first.
              </Text>
              <Text style={styles.infoLabel}>What they represent</Text>
              <Text style={styles.infoText}>
                Legacy, responsibility, and the heroic ideal. They&apos;re the
                standard every other team gets compared to.
              </Text>
              <Text style={styles.infoLabel}>
                Enemy types they specialize against
              </Text>
              <Text style={styles.infoText}>
                • Planetary-scale invasions and extinction events{'\n'}
                • Cosmic tyrants and reality-warping overlords{'\n'}
                • Threats that demand multiple power sets in perfect sync
              </Text>

              {/* OMNI JUMPERS */}
              <Text style={styles.infoSectionTitle}>Omni Jumpers</Text>
              <Text style={styles.infoText}>
                The Omni Jumpers are an Omniveral team of heroes —
                hopping between timelines and realies to where they are needed the most 
                and when reality itself starts to crack.
              </Text>
              <Text style={styles.infoLabel}>What they represent</Text>
              <Text style={styles.infoText}>
                Adaptability, sacrifice, and perspective. They&apos;ve seen
                worlds survive and worlds die and fight to make sure this one
                doesn&apos;t repeat the worst endings. They fight to save reality and all of creation.
              </Text>
              <Text style={styles.infoLabel}>
                Enemy types they specialize against
              </Text>
              <Text style={styles.infoText}>
                • Timeline anomalies and paradox-born entities{'\n'}
                • The Imagine Order and Geno who want to control and perfect realities{'\n'}
                • Omniversal threats like The Last Reality and The Nothing.
                {'\n'}
                • Crises where saving one universe means understanding a dozen
                others
              </Text>
            </ScrollView>
          )}
        </Animated.View>

        {/* MAIN SCROLL CONTENT */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Music Controls */}
          <View style={styles.musicControls}>
            <TouchableOpacity style={styles.musicBtn} onPress={playTheme}>
              <Text style={styles.musicText}>
                {isPlaying ? 'Playing…' : 'Theme'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.musicBtn} onPress={pauseTheme}>
              <Text style={styles.musicText}>Pause</Text>
            </TouchableOpacity>
          </View>

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
      <Modal
        visible={!!previewHero}
        transparent
        animationType="fade"
        onRequestClose={closePreview}
      >
        <TouchableOpacity
          style={styles.modalBg}
          activeOpacity={1}
          onPress={closePreview}
        >
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
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    position: 'relative', 
  },
  // HEADER ROW (Back • Glass Card • Vigilantes)
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: isDesktop ? 40 : 30,
    paddingBottom: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(191,219,254,0.95)',
    backgroundColor: 'rgba(15,23,42,0.92)',
  },
  backIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  backText: {
    color: '#E5F2FF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerGlass: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 26,
    backgroundColor: 'rgba(15,23,42,0.96)',
    borderWidth: 1.5,
    borderColor: 'rgba(251,191,36,0.95)',
    shadowColor: '#FACC15',
    shadowOpacity: 0.75,
    shadowRadius: 20,
  },
  headerTitle: {
    fontSize: isDesktop ? 30 : 24,
    fontWeight: '900',
    color: '#F9FAFB',
    textAlign: 'center',
    textShadowColor: '#FACC15',
    textShadowRadius: 18,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#E5E7EB',
    textAlign: 'center',
    marginTop: 2,
  },
  headerHint: {
    fontSize: 11,
    color: '#BFDBFE',
    textAlign: 'center',
    marginTop: 4,
  },
  vigilanteButton: {
    marginLeft: 8,
    padding: 3,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#FACC15',
    backgroundColor: 'rgba(15,23,42,0.9)',
  },
  vigilanteImg: {
    width: 50,
    height: 50,
    borderRadius: 999,
  },

  // INFO PANEL
  infoPanel: {
    position: 'absolute',                     // <--
    top: isDesktop ? 100 : 90,                // <– sits just under headerGlass
    left: 10,
    right: 10,
    zIndex: 20,                               // <– above everything
    elevation: 20,

    borderRadius: 18,
    backgroundColor: 'rgba(15,23,42,0.97)',
    borderWidth: 1,
    borderColor: 'rgba(96,165,250,0.85)',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
    infoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoHeaderTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#E5F2FF',
  },
  infoClose: {
    fontSize: 16,
    color: '#E5F2FF',
  },


  infoScroll: {
    maxHeight: SCREEN_HEIGHT * 0.5,
  },
  infoScrollContent: {
    paddingBottom: 4,
  },
  infoSectionTitle: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '900',
    color: '#7DD3FC',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  infoLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#60A5FA',
  },
  infoText: {
    fontSize: 12,
    color: '#E5E7EB',
    marginTop: 2,
    lineHeight: 16,
  },

  scrollContainer: {
    paddingBottom: 120,
    alignItems: 'center',
  },

  musicControls: {
    flexDirection: 'row',
    gap: 30,
    marginTop: 18,
    marginBottom: 25,
  },
  musicBtn: {
    backgroundColor: 'rgba(0,179,255,0.25)',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#00B3FF',
  },
  musicText: { color: '#00FFFF', fontSize: 18, fontWeight: 'bold' },

  sections: { width: '100%', marginTop: 10 },
  sectionTitle: {
    fontSize: 32,
    color: '#FFFD',
    fontWeight: 'bold',
    marginLeft: 25,
    marginTop: 40,
    marginBottom: 15,
    textShadowColor: '#FFD700',
    textShadowRadius: 12,
  },
  list: { paddingLeft: 20, paddingRight: 40 },

  card: {
    borderRadius: 22,
    overflow: 'hidden',
    marginRight: horizontalSpacing,
    elevation: 20,
  },
  clickable: { borderWidth: 5, borderColor: '#FFD700' },
  notClickable: { opacity: 0.65 },
  heroImage: { width: '100%', height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.42)',
  },
  heroName: {
    position: 'absolute',
    bottom: 25,
    left: 25,
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowRadius: 10,
  },
  comingSoon: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(220,0,0,0.8)',
    color: '#FFF',
    padding: 8,
    borderRadius: 10,
    fontSize: 13,
  },

  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.97)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: { alignItems: 'center' },
  previewCard: {
    width: SCREEN_WIDTH * 0.88,
    height: SCREEN_HEIGHT * 0.72,
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 25,
  },
  previewImage: { width: '100%', height: '100%' },
  cardName: {
    position: 'absolute',
    bottom: 35,
    left: 35,
    fontSize: 22,
    color: '#FFF',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowRadius: 12,
  },
  previewFooter: {
    marginTop: 35,
    padding: 22,
    backgroundColor: 'rgba(255,215,0,0.25)',
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  previewName: {
    fontSize: 30,
    color: '#FFD700',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default JusticeScreen;
