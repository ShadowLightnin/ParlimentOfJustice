import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isDesktop = SCREEN_WIDTH > 600;
const cardSize = isDesktop ? 160 : 110;
const cardSpacing = isDesktop ? 25 : 12;

// Jungle / tribal gold palette
const JUNGLE = {
  bark: '#4A2A14',
  barkDark: '#2a160a',
  gold: '#FFD700',
  ember: '#DAA520',
  leafGlow: '#9ACD32',
};

const members = [
  { id: 'zeke', name: 'Zeke', codename: 'Enderstrike', screen: 'Zeke', clickable: true, image: require('../../../assets/Armor/Zeke.jpg') },
  { id: 'elijah', name: 'Elijah Potter', codename: 'Chaos Wither', screen: 'Elijah', clickable: true, image: require('../../../assets/Armor/Elijah.jpg') },
  { id: 'tom', name: 'Tom C', codename: 'Thunder Whisperer', screen: 'TomBb', clickable: true, image: require('../../../assets/Armor/TomC3.jpg') },
  { id: 'ammon', name: 'Ammon T', codename: 'Quick Wit', screen: 'AmmonT', clickable: true, image: require('../../../assets/Armor/AmmonT.jpg') },
  { id: 'eli', name: 'Eli C', codename: 'Shadow Hunter', screen: 'Eli', clickable: true, image: require('../../../assets/Armor/Eli.jpg') },
  { id: 'ethan', name: 'Ethan T', codename: 'Bolt Watcher', screen: 'EthanT', clickable: true, image: require('../../../assets/Armor/Ethan2.jpg') },
  { id: 'alex', name: 'Alex M', codename: 'Swiftmind', screen: 'AlexM', clickable: true, image: require('../../../assets/Armor/AlexM2.jpg') },
  { id: 'damon', name: 'Damon', codename: 'Pixel Maverick', screen: 'Damon', clickable: true, image: require('../../../assets/Armor/Damon2.jpg') },

  // MONKE LEGENDS — FULL GALLERY + CUSTOM POSTER IMAGE
  {
    id: 'lauren',
    name: 'Lauren',
    codename: 'Stealth Queen',
    screen: '',
    clickable: true,
    posterImage: require('../../../assets/Armor/Lauren3.jpg'),
    images: [
      require('../../../assets/Armor/Lauren2.jpg'),
      require('../../../assets/Armor/Lauren3.jpg'),
      require('../../../assets/Armor/Lauren4.jpg'),
      require('../../../assets/Armor/Lauren.jpg'),
    ],
  },
  {
    id: 'lizzie',
    name: 'Lizzie',
    codename: 'Seriene',
    screen: '',
    clickable: true,
    posterImage: require('../../../assets/Armor/LizzieTB.jpg'),
    images: [
      require('../../../assets/Armor/LizzieTB.jpg'),
      require('../../../assets/Armor/PlaceHolder.jpg'),
    ],
  },
  {
    id: 'rachel',
    name: 'Rachel',
    codename: 'Neon',
    screen: '',
    clickable: true,
    posterImage: require('../../../assets/Armor/RachelTB.jpg'),
    images: [
      require('../../../assets/Armor/RachelTB.jpg'),
      require('../../../assets/Armor/PlaceHolder.jpg'),
    ],
  },
  {
    id: 'keith',
    name: 'Keith',
    codename: 'Operative',
    screen: '',
    clickable: true,
    posterImage: require('../../../assets/Armor/Keith.jpg'),
    images: [
      require('../../../assets/Armor/Keith.jpg'),
      require('../../../assets/Armor/PlaceHolder.jpg'),
    ],
  },
  {
    id: 'sandra',
    name: 'Sandra',
    codename: 'Informant',
    screen: '',
    clickable: true,
    posterImage: require('../../../assets/Armor/Sandra.jpg'),
    images: [
      require('../../../assets/Armor/Sandra.jpg'),
      require('../../../assets/Armor/PlaceHolder.jpg'),
    ],
  },
  {
    id: 'shadow',
    name: 'Shadow',
    codename: 'Gray Hound',
    screen: '',
    clickable: true,
    posterImage: require('../../../assets/Armor/SamsShadow.jpg'),
    images: [
      require('../../../assets/Armor/SamsShadow.jpg'),
      require('../../../assets/Armor/PlaceHolder.jpg'),
    ],
  },
];

const MonkeAllianceScreen = () => {
  const navigation = useNavigation();
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // ⭐ Lore panel state + animation (same pattern as Constollation / Forge)
  const [infoOpen, setInfoOpen] = useState(false);
  const infoAnim = useRef(new Animated.Value(0)).current;

  const toggleInfo = () => {
    if (infoOpen) {
      Animated.timing(infoAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start(() => setInfoOpen(false));
    } else {
      setInfoOpen(true);
      Animated.timing(infoAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  };

  const killMonke = async () => {
    if (currentSound) {
      try { await currentSound.stopAsync(); } catch {}
      try { await currentSound.unloadAsync(); } catch {}
      setCurrentSound(null);
      setIsPlaying(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => killMonke();
    }, [currentSound])
  );

  const playTheme = async () => {
    if (currentSound) {
      await currentSound.playAsync();
      setIsPlaying(true);
      return;
    }
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../../assets/audio/monke.m4a'),
        { shouldPlay: true, isLooping: true, volume: 1.0 }
      );
      setCurrentSound(sound);
      setIsPlaying(true);
    } catch (e) {
      console.log('Monke theme failed (web is fine):', e);
    }
  };

  const pauseTheme = async () => {
    if (currentSound) await currentSound.pauseAsync();
    setIsPlaying(false);
  };

  const handleMemberPress = async (member) => {
    if (!member.clickable) return;
    await killMonke();

    if (member.screen && member.screen !== '') {
      navigation.navigate(member.screen);
    } else {
      navigation.navigate('CharacterDetailScreen', {
        member: {
          ...member,
          images:
            member.images ||
            (member.image
              ? [member.image]
              : [require('../../../assets/Armor/PlaceHolder.jpg')]),
          universe: 'monke',
        },
      });
    }
  };

  const renderCard = (member) => {
    const cardImage =
      member.posterImage ||
      (member.images ? member.images[0] : null) ||
      member.image ||
      require('../../../assets/Armor/PlaceHolder.jpg');

    return (
      <TouchableOpacity
        key={member.id}
        style={[
          styles.card,
          { width: cardSize, height: cardSize * 1.6 },
          !member.clickable && styles.disabledCard,
        ]}
        onPress={() => handleMemberPress(member)}
        disabled={!member.clickable}
        activeOpacity={0.9}
      >
        <Image
          source={cardImage}
          style={styles.characterImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />

        <View style={styles.textWrapper}>
          {/* Name on top */}
          <Text
            style={[
              styles.name,
              isDesktop ? styles.nameDesktop : styles.nameMobile,
            ]}
            numberOfLines={1}
          >
            {member.name}
          </Text>

          {/* Codename below */}
          {member.codename ? (
            <Text
              style={[
                styles.codename,
                isDesktop ? styles.codenameDesktop : styles.codenameMobile,
              ]}
              numberOfLines={isDesktop ? 1 : 3}
            >
              {member.codename}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const rows = [];
  for (let i = 0; i < members.length; i += 3) {
    rows.push(members.slice(i, i + 3));
  }

  return (
    <ImageBackground
      source={require('../../../assets/BackGround/Monke.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              killMonke();
              navigation.goBack();
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.backText}>⬅️ Back</Text>
          </TouchableOpacity>

          {/* Tap center to toggle lore panel */}
          <TouchableOpacity
            style={styles.headerCenter}
            onPress={toggleInfo}
            activeOpacity={0.9}
          >
            <View style={styles.headerGlass}>
              <Text style={styles.header}>Monke Alliance</Text>
              <Text style={styles.headerSubtitle}>
                The Anti-heroes & Hunters of The Parliament
              </Text>
              <Text style={styles.infoHint}>Tap for team lore ⬇</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              killMonke();
              navigation.navigate('TeamChat');
            }}
            style={styles.chatButton}
            activeOpacity={0.85}
          >
            <Text style={styles.chatText}>🛡️</Text>
          </TouchableOpacity>
        </View>

        {/* Music controls */}
        <View style={styles.musicControls}>
          {!isPlaying ? (
            <TouchableOpacity style={styles.musicButton} onPress={playTheme}>
              <Text style={styles.musicButtonText}>Theme</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.musicButton} onPress={pauseTheme}>
              <Text style={styles.musicButtonText}>Pause</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Grid */}
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.grid, { gap: cardSpacing }]}>
            {rows.map((row, rowIndex) => (
              <View
                key={`row-${rowIndex}`}
                style={[styles.row, { gap: cardSpacing }]}
              >
                {row.map(renderCard)}
                {row.length < 3 &&
                  Array(3 - row.length)
                    .fill()
                    .map((_, k) => (
                      <View
                        key={`empty-${rowIndex}-${k}`}
                        style={{ width: cardSize, height: cardSize * 1.6 }}
                      />
                    ))}
              </View>
            ))}
          </View>
        </ScrollView>

        {/* 🍌 LORE PANEL (dropdown-style like others) */}
        <Animated.View
          pointerEvents={infoOpen ? 'auto' : 'none'}
          style={[
            styles.infoPanelContainer,
            {
              opacity: infoAnim,
              transform: [
                {
                  translateY: infoAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {infoOpen && (
            <View style={styles.infoPanel}>
              <View style={styles.infoHeaderRow}>
                <Text style={styles.infoTitle}>Monke Alliance</Text>
                <TouchableOpacity
                  onPress={toggleInfo}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Text style={styles.infoClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.infoText}>
                The Monke Alliance are almost the polar opposite of The Thunder Born —
                anti-heroes who go and fight the supernatural by any means but make sures no ones gets hurt. They
                frequently clash with Thunder Born after a falling out in the original team named BludBruhs but split in half
                after some members like Void Walker used his tremendous dark powers and had difficulty controlling them, as well as how
                the all the team members should use their powers that they got from The Maw.
              </Text>

              <Text style={styles.infoLabel}>What they fight</Text>
              <Text style={styles.infoText}>
                • Maw corruption incursions{'\n'}
                • Supernatural threats, curses, and hauntings{'\n'}
                • Cults, anomalies, and entities too messy for public heroes
              </Text>

              <Text style={styles.infoLabel}>How they operate</Text>
              <Text style={styles.infoText}>
                • Hit hard, vanish into the dark, no press conferences{'\n'}
                • Use questionable methods for the right reasons{'\n'}
                • They work in the shadows and gather information and intel before striking.
              </Text>
            </View>
          )}
        </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { width: '100%', height: '100%' },
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)' },

  // HEADER
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.8)',
    backgroundColor: 'rgba(40,20,8,0.95)',
  },
  backText: { fontSize: 13, color: '#fff7df', fontWeight: 'bold' },

  headerCenter: { flex: 1, alignItems: 'center' },
  headerGlass: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 22,
    backgroundColor: 'rgba(20,10,3,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(218,165,32,0.9)',
  },
  header: {
    fontSize: isDesktop ? 28 : 24,
    fontWeight: '900',
    color: JUNGLE.gold,
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowRadius: 18,
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
    color: '#ffeebb',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  infoHint: {
    marginTop: 2,
    fontSize: 10,
    textAlign: 'center',
    color: '#ffefc0',
  },

  chatButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  chatText: { fontSize: 22, color: '#fff' },

  // MUSIC
  musicControls: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10 },
  musicButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: 'rgba(74,42,20,0.9)',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: JUNGLE.ember,
  },
  musicButtonText: {
    color: JUNGLE.gold,
    fontWeight: 'bold',
    fontSize: 13,
  },

  // GRID
  scrollContent: { paddingVertical: 8, paddingHorizontal: 10 },
  grid: { flexDirection: 'column', alignItems: 'center' },
  row: { flexDirection: 'row', justifyContent: 'center' },

  // CARDS
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: JUNGLE.ember,
    shadowColor: JUNGLE.gold,
    shadowOpacity: 0.9,
    shadowRadius: 14,
    elevation: 10,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  disabledCard: { opacity: 0.6 },
  characterImage: { width: '100%', height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  // TEXT WRAPPER
  textWrapper: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    padding: 2,
  },

  // BASE TEXT
  codename: {
    fontWeight: 'bold',
    color: JUNGLE.gold,
    textShadowColor: JUNGLE.bark,
    textShadowRadius: 10,
  },
  name: {
    color: '#fff',
    textShadowColor: JUNGLE.bark,
    textShadowRadius: 10,
  },

  // DESKTOP LAYOUT (overlay stays in bottom band)
  codenameDesktop: {
    fontSize: 13,
    lineHeight: 17,
  },
  nameDesktop: {
    fontSize: 11,
    marginBottom: 2,
  },

  // MOBILE LAYOUT — wraps cleanly
  codenameMobile: {
    fontSize: 12,
    lineHeight: 16,
  },
  nameMobile: {
    fontSize: 11,
    marginBottom: 2,
  },

  // Lore panel
  infoPanelContainer: {
    position: 'absolute',
    top: 90,
    left: 10,
    right: 10,
    zIndex: 1000,
  },
  infoPanel: {
    backgroundColor: 'rgba(20, 10, 3, 0.97)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: JUNGLE.ember,
  },
  infoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffe7c0',
  },
  infoClose: {
    fontSize: 16,
    color: '#ffe7c0',
  },
  infoLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: 'bold',
    color: JUNGLE.gold,
  },
  infoText: {
    fontSize: 12,
    color: 'rgba(255,240,220,0.98)',
    marginTop: 2,
    lineHeight: 16,
  },
});

export default MonkeAllianceScreen;
