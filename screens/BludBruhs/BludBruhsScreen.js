import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const isDesktop = SCREEN_WIDTH > 600;
const cardSize = isDesktop ? 160 : 110;
const cardSpacing = isDesktop ? 25 : 10;

// ⚡ Lightning storm palette
const THUNDER = {
  bolt: '#00e5ff',        // bright lightning blue
  core: '#00b3ff',        // electric cyan
  storm: '#4b6cff',       // stormy blue
  violet: '#9b5bff',      // shattered realm purple
  stormDark: 'rgba(3, 8, 25, 0.92)',
  stormGlass: 'rgba(8, 20, 45, 0.85)',
};

const scrollableMembersBase = [
  { id: 'sam', name: 'Sam', codename: 'Void Walker', screen: 'Sam', clickable: true, image: require('../../assets/Armor/SamVoidWalker.jpg') },
  { id: 'cole', name: 'Cole', codename: 'Cruiser', screen: 'Cole', clickable: true, image: require('../../assets/Armor/ColeR.jpg') },
  {
    id: 'taylor',
    name: 'Taylor',
    codename: 'Stellar',
    screen: '',
    clickable: true,
    posterImage: require('../../assets/Armor/Taylor.jpg'),
    images: [
      require('../../assets/Armor/Taylor.jpg'),
      require('../../assets/Armor/PlaceHolder.jpg'),
    ],
  },
  { id: 'james', name: 'James', codename: 'Shadowmind', screen: 'JamesBb', clickable: true, image: require('../../assets/Armor/JamesBb.jpg') },
  { id: 'tanner', name: 'Tanner', codename: 'Wolff', screen: 'TannerBb', clickable: true, image: require('../../assets/Armor/TannerBb.jpg') },
  {
    id: 'adin',
    name: 'Adin',
    codename: 'Aotearoa',
    screen: '',
    clickable: true,
    posterImage: require('../../assets/Armor/Adin.jpg'),
    images: [
      require('../../assets/Armor/Adin.jpg'),
      require('../../assets/Armor/PlaceHolder.jpg'),
    ],
  },
  {
    id: 'justin',
    name: 'Justin Platt',
    codename: 'Echo Wood',
    screen: '',
    clickable: true,
    posterImage: require('../../assets/Armor/Justin2.jpg'),
    images: [
      require('../../assets/Armor/Justin2.jpg'),
      require('../../assets/Armor/PlaceHolder.jpg'),
    ],
  },
  {
    id: 'zack',
    name: 'Zack Dustin',
    codename: 'Carved Echo',
    screen: '',
    clickable: true,
    posterImage: require('../../assets/Armor/Zack2_cleanup.jpg'),
    images: [
      require('../../assets/Armor/Zack2_cleanup.jpg'),
      require('../../assets/Armor/PlaceHolder.jpg'),
    ],
  },
  { id: 'joseph', name: 'Joseph', codename: 'Technoman', screen: 'JosephD', clickable: true, image: require('../../assets/Armor/JosephD.jpg') },
  { id: 'thunder', name: 'Thunder Born', codename: 'Rolling Thunder', screen: 'RollingThunderScreen', clickable: true, image: require('../../assets/BackGround/RollingThunder.jpg') },
];

const fixedMembers = [
  { id: 'ranger', name: '', codename: 'Ranger Squad', screen: 'RangerSquad', clickable: true, image: require('../../assets/BackGround/RangerSquad.jpg') },
  { id: 'montrose', name: '', codename: 'Montrose Manor', screen: 'MontroseManorTab', clickable: true, image: require('../../assets/TheMontroseManor.jpg') },
  { id: 'monke', name: '', codename: 'Monke Alliance', screen: 'MonkeAllianceScreen', clickable: true, image: require('../../assets/BackGround/Monke.jpg') },
];

const BludBruhsScreen = ({ route }) => {
  const navigation = useNavigation();
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isYourUniverse, setIsYourUniverse] = useState(
    route.params?.isYourUniverse ?? true
  );

  // ⚡ lightning flash animation
  const [flashAnim] = useState(new Animated.Value(0));
  const [flashAnim2] = useState(new Animated.Value(0));

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem('selectedUniverse');
        setIsYourUniverse(
          saved ? saved === 'your' : route.params?.isYourUniverse ?? true
        );
      } catch (e) {}
    };
    load();
  }, []);

  // Start looping "lightning flashes"
  useEffect(() => {
    const flashLoop = Animated.loop(
      Animated.sequence([
        Animated.delay(600),
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(flashAnim, {
          toValue: 0,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.delay(900),
      ])
    );

    const flashLoop2 = Animated.loop(
      Animated.sequence([
        Animated.delay(1300),
        Animated.timing(flashAnim2, {
          toValue: 1,
          duration: 60,
          useNativeDriver: true,
        }),
        Animated.timing(flashAnim2, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.delay(1400),
      ])
    );

    flashLoop.start();
    flashLoop2.start();

    return () => {
      flashLoop.stop();
      flashLoop2.stop();
    };
  }, [flashAnim, flashAnim2]);

  const getJoseph = () => {
    if (isYourUniverse)
      return {
        id: 'joseph',
        name: 'Joseph',
        codename: 'Technoman',
        screen: 'JosephD',
        clickable: true,
        image: require('../../assets/Armor/JosephD.jpg'),
      };

    const r = Math.random();
    if (r < 0.02)
      return {
        id: 'joseph',
        name: 'Joseph',
        codename: 'The Betrayer',
        screen: 'JosephD',
        clickable: false,
        image: require('../../assets/Armor/JosephD4.jpg'),
      };
    if (r < 0.51)
      return {
        id: 'joseph',
        name: 'Joseph',
        codename: 'The Betrayer',
        screen: 'JosephD',
        clickable: false,
        image: require('../../assets/Armor/JosephD2.jpg'),
      };
    return {
      id: 'joseph',
      name: 'Joseph',
      codename: 'The Betrayer',
      screen: 'JosephD',
      clickable: false,
      image: require('../../assets/Armor/JosephD3.jpg'),
    };
  };

  const finalMembers = scrollableMembersBase
    .filter(m =>
      isYourUniverse ? !['Justin Platt', 'Zack Dustin'].includes(m.name) : true
    )
    .map(m => (m.name === 'Joseph' ? getJoseph() : m));

  const killMusic = async () => {
    if (currentSound) {
      try {
        await currentSound.stopAsync();
      } catch {}
      try {
        await currentSound.unloadAsync();
      } catch {}
      setCurrentSound(null);
      setIsPlaying(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => killMusic();
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
        require('../../assets/audio/ThunderBorn.m4a'),
        { shouldPlay: true, isLooping: true, volume: 1.0 }
      );
      setCurrentSound(sound);
      setIsPlaying(true);
    } catch (e) {
      console.log('ThunderBorn theme failed (web is fine)');
    }
  };

  const pauseTheme = async () => {
    if (currentSound) await currentSound.pauseAsync();
    setIsPlaying(false);
  };

  const handleMemberPress = async member => {
    if (!member.clickable) return;
    await killMusic();

    if (member.screen && member.screen !== '') {
      navigation.navigate(member.screen, { isYourUniverse });
    } else {
      navigation.navigate('CharacterDetailScreen', {
        member: {
          ...member,
          images:
            member.images ||
            (member.image
              ? [member.image]
              : [require('../../assets/Armor/PlaceHolder.jpg')]),
          universe: isYourUniverse ? 'thunderborn' : 'shattered',
        },
      });
    }
  };

  const renderMemberCard = member => {
    const cardImage =
      member.posterImage ||
      (member.images ? member.images[0] : null) ||
      member.image ||
      require('../../assets/Armor/PlaceHolder.jpg');

    const borderColor = isYourUniverse ? THUNDER.bolt : THUNDER.violet;
    const glowColor = isYourUniverse ? THUNDER.core : THUNDER.violet;

    return (
      <TouchableOpacity
        key={member.id}
        style={[
          styles.card,
          {
            width: cardSize,
            height: cardSize * 1.6,
            borderColor,
            shadowColor: glowColor,
          },
          !member.clickable && styles.disabledCard,
        ]}
        onPress={() => handleMemberPress(member)}
        disabled={!member.clickable}
        activeOpacity={0.9}
      >
        <Image source={cardImage} style={styles.characterImage} resizeMode="cover" />
        <View
          style={[
            styles.transparentOverlay,
            isYourUniverse ? styles.overlayYour : styles.overlayShattered,
          ]}
        />

        <View style={styles.textWrapper}>
          {member.name ? (
            <Text
              style={[
                styles.name,
                isDesktop ? styles.nameDesktop : styles.nameMobile,
                isYourUniverse ? styles.nameYour : styles.nameShattered,
              ]}
              numberOfLines={1}
            >
              {member.name}
            </Text>
          ) : null}

          {member.codename && (
            <Text
              style={[
                styles.codename,
                isDesktop ? styles.codenameDesktop : styles.codenameMobile,
                isYourUniverse ? styles.codenameYour : styles.codenameShattered,
              ]}
              numberOfLines={isDesktop ? 1 : 3}
            >
              {member.codename}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Build rows
  const rows = [];
  const initialScrollable = finalMembers.slice(0, 9);
  for (let i = 0; i < Math.ceil(initialScrollable.length / 3); i++) {
    rows.push(initialScrollable.slice(i * 3, (i + 1) * 3));
  }
  const additionalScrollable = finalMembers.slice(9);
  for (let i = 0; i < Math.ceil(additionalScrollable.length / 3); i++) {
    rows.push(additionalScrollable.slice(i * 3, (i + 1) * 3));
  }

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Bludbruh2.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.overlay}>
          {/* ⚡ LIGHTNING FLASH LAYERS OVER HEADER AREA */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.lightningFlashMain,
              {
                opacity: flashAnim,
                transform: [
                  {
                    translateY: flashAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-10, 6],
                    }),
                  },
                ],
              },
            ]}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              styles.lightningFlashDiag,
              {
                opacity: flashAnim2,
              },
            ]}
          />

          {/* HEADER — glassy lightning bar */}
          <View style={styles.headerWrapper}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                killMusic();
                navigation.navigate('Home');
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.backText}>⬅️ Back</Text>
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <View style={styles.headerGlass}>
                <Text style={styles.headerTitle}>
                  {isYourUniverse ? 'Thunder Born' : 'Shattered Realm'}
                </Text>

                {/* Universe-specific small line (Thunder Born for shattered) */}
                {!isYourUniverse && (
                  <Text style={styles.headerSubtitleTop}>Thunder Born</Text>
                )}

                {/* Shared subtitle for BOTH universes */}
                <Text style={styles.headerSubtitleJudgement}>
                  The judgement of The Parliament
                </Text>
              </View>
            </View>

            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={() => navigation.navigate('TeamChat')}
                style={styles.iconButton}
                activeOpacity={0.85}
              >
                <Text style={styles.chatText}>⚡</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('AddMember')}
                style={styles.iconButton}
                activeOpacity={0.85}
              >
                <Text style={styles.plusText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* MUSIC CONTROLS */}
          <View style={styles.musicControls}>
            <TouchableOpacity
              style={styles.musicButtonPrimary}
              onPress={playTheme}
            >
              <Text style={styles.musicButtonTextPrimary}>
                {isPlaying ? 'Playing…' : 'Theme'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.musicButtonSecondary}
              onPress={pauseTheme}
            >
              <Text style={styles.musicButtonTextSecondary}>Pause</Text>
            </TouchableOpacity>
          </View>

          {/* GRID SCROLL */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={[styles.grid, { gap: cardSpacing }]}>
              {rows.map((row, rowIndex) => (
                <View
                  key={`row-${rowIndex}`}
                  style={[styles.row, { gap: cardSpacing }]}
                >
                  {row.map(renderMemberCard)}
                </View>
              ))}
            </View>
          </ScrollView>

          {/* FIXED BOTTOM ROW */}
          <View style={[styles.fixedRow, { gap: cardSpacing }]}>
            {fixedMembers.map(renderMemberCard)}
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
  safeArea: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: THUNDER.stormDark,
  },

  /* ⚡ LIGHTNING FLASHES */
  lightningFlashMain: {
    position: 'absolute',
    top: 0,
    left: -20,
    right: -20,
    height: 120,
    backgroundColor: 'rgba(255,255,255,0.16)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,229,255,0.9)',
    shadowColor: THUNDER.bolt,
    shadowOpacity: 1,
    shadowRadius: 30,
    zIndex: 0,
  },
  lightningFlashDiag: {
    position: 'absolute',
    top: -40,
    right: -60,
    width: 180,
    height: 140,
    backgroundColor: 'rgba(0,229,255,0.25)',
    transform: [{ rotate: '-22deg' }],
    shadowColor: THUNDER.bolt,
    shadowOpacity: 1,
    shadowRadius: 28,
    zIndex: 0,
  },

  /* HEADER */
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 6,
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 2,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(180,225,255,0.9)',
    backgroundColor: 'rgba(4,18,40,0.95)',
  },
  backText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#e6f5ff',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerGlass: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 22,
    backgroundColor: THUNDER.stormGlass,
    borderWidth: 1,
    borderColor: 'rgba(120,190,255,0.95)',
  },
  headerTitle: {
    fontSize: isDesktop ? 26 : 22,
    fontWeight: '900',
    color: '#ecf8ff',
    textAlign: 'center',
    textShadowColor: THUNDER.bolt,
    textShadowRadius: 22,
  },
  headerSubtitleTop: {
    fontSize: 12,
    color: '#bedfff',
    textAlign: 'center',
    marginTop: 1,
    textShadowColor: THUNDER.storm,
    textShadowRadius: 12,
  },
  headerSubtitleJudgement: {
    fontSize: 11,
    color: '#e2f1ff',
    textAlign: 'center',
    marginTop: 3,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowRadius: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 6,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(150,210,255,0.9)',
    backgroundColor: 'rgba(5,20,45,0.95)',
  },
  chatText: {
    fontSize: 16,
    color: '#e8f8ff',
  },
  plusText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THUNDER.bolt,
  },

  /* MUSIC */
  musicControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  musicButtonPrimary: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 999,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: THUNDER.bolt,
    backgroundColor: 'rgba(0,160,255,0.65)',
  },
  musicButtonSecondary: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 999,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(200,210,255,0.8)',
    backgroundColor: 'rgba(3,10,30,0.85)',
  },
  musicButtonTextPrimary: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#f3fbff',
  },
  musicButtonTextSecondary: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#d6e9ff',
  },

  /* GRID */
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: 10, paddingBottom: 12 },
  grid: { flexDirection: 'column', alignItems: 'center' },
  row: { flexDirection: 'row', justifyContent: 'center' },

  fixedRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(130,190,255,0.8)',
  },

  /* CARDS */
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 2,
    backgroundColor: 'rgba(0,0,0,0.75)',
    shadowOpacity: 0.95,
    shadowRadius: 12,
    elevation: 10,
  },
  disabledCard: { opacity: 0.7 },
  characterImage: { width: '100%', height: '100%' },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayYour: {
    backgroundColor: 'rgba(0, 10, 25, 0.55)',
  },
  overlayShattered: {
    backgroundColor: 'rgba(10, 0, 25, 0.6)',
  },

  textWrapper: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
  },

  // base text
  name: {
    zIndex: 2,
    textShadowRadius: 14,
  },
  codename: {
    fontWeight: 'bold',
    zIndex: 2,
    textShadowRadius: 14,
  },

  // universe variants
  nameYour: {
    color: '#f7fbff',
    textShadowColor: THUNDER.core,
  },
  nameShattered: {
    color: '#f2e6ff',
    textShadowColor: THUNDER.violet,
  },
  codenameYour: {
    color: THUNDER.bolt,
    textShadowColor: THUNDER.bolt,
  },
  codenameShattered: {
    color: '#df7cff',
    textShadowColor: THUNDER.violet,
  },

  // desktop text layout
  nameDesktop: {
    fontSize: 12,
    marginBottom: 2,
  },
  codenameDesktop: {
    fontSize: 14,
  },

  // mobile text layout
  nameMobile: {
    fontSize: 11,
    marginBottom: 2,
  },
  codenameMobile: {
    fontSize: 12,
    lineHeight: 16,
  },
});

export default BludBruhsScreen;
