import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { memberCategories } from './ConstollationMembers';
import constollationImages from './ConstollationImages';
import ConstollationDescription from './ConstollationDescription';
import { Audio } from 'expo-av';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isDesktop = SCREEN_WIDTH > 600;
const columns = isDesktop ? 6 : 3;
const cardSize = isDesktop ? 160 : 100;
const cardHeightMultiplier = 1.6;
const horizontalSpacing = isDesktop ? 40 : 10;
const verticalSpacing = isDesktop ? 50 : 20;

const background = require('../../assets/BackGround/Constollation.jpg');
// const themeAudio = require('../../assets/audio/CelestialTheme.mp4');

export const ConstollationScreen = () => {
  const navigation = useNavigation();
  const [members, setMembers] = useState(memberCategories);
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 🔹 Lore panel state + animation
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

  // ── AUDIO ─────────────────────────────────────
  const playTheme = async () => {
    if (currentSound) {
      await currentSound.playAsync();
      setIsPlaying(true);
      return;
    }
    try {
      // NOTE: themeAudio is still commented out above, so this will be a no-op
      const { sound } = await Audio.Sound.createAsync(themeAudio, {
        shouldPlay: true,
        isLooping: true,
        volume: 0.9,
      });
      setCurrentSound(sound);
      setIsPlaying(true);
    } catch (e) {
      // silent fail to avoid crashes if themeAudio is not wired
    }
  };

  const pauseTheme = async () => {
    if (currentSound && isPlaying) {
      await currentSound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const stopSound = async () => {
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

  useFocusEffect(useCallback(() => () => stopSound(), [currentSound]));

  // ── LOAD STARS + FULL MEMBER DATA FOR DETAIL SCREEN ─────────────────────
  useEffect(() => {
    const updated = memberCategories.map(cat => {
      const processed = cat.members.map(m => {
        const imgData = constollationImages[m.name];

        // ⬇️ Original image structure
        const images = imgData?.images || [
          { uri: require('../../assets/Armor/PlaceHolder.jpg') },
        ];

        const description =
          ConstollationDescription[m.name] ||
          'A star whose light speaks for itself.';

        return {
          ...m,
          images,
          description,
          clickable: true,
        };
      });

      return { ...cat, members: processed };
    });

    setMembers(updated);
  }, []);

  const goToChat = async () => {
    await stopSound();
    navigation.navigate('TeamChat');
  };

  const handleMemberPress = async member => {
    await stopSound();
    navigation.navigate('ConstollationCharacterDetail', { member });
  };

  const renderStar = member => {
    if (!member) return <View key={Math.random()} style={styles.cardSpacer} />;

    const primaryImage =
      member.images?.[0]?.uri || require('../../assets/Armor/PlaceHolder.jpg');

    return (
      <TouchableOpacity
        key={member.name}
        style={styles.card}
        onPress={() => handleMemberPress(member)}
        activeOpacity={0.8}
      >
        <Image source={primaryImage} style={styles.starImage} resizeMode="cover" />

        <View style={styles.textWrapper}>
          <Text
            style={[
              styles.name,
              isDesktop ? styles.nameDesktop : styles.nameMobile,
            ]}
          >
            {member.name}
          </Text>
          {member.codename && (
            <Text
              style={[
                styles.codename,
                isDesktop ? styles.codenameDesktop : styles.codenameMobile,
              ]}
              numberOfLines={3}
            >
              {member.codename}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground source={background} style={styles.background}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={async () => {
              await stopSound();
              navigation.goBack();
            }}
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
              <Text style={styles.headerTitle}>Constollation</Text>
              <Text style={styles.headerSubtitle}>
                The Social Workers of The Parliament
              </Text>
              <Text style={styles.infoHint}>Tap for team lore ⬇</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
            <Text style={styles.chatText}>🛡️</Text>
          </TouchableOpacity>
        </View>

        {/* Music */}
        <View style={styles.musicControls}>
          <TouchableOpacity style={styles.musicButton} onPress={playTheme}>
            <Text style={styles.musicButtonText}>Theme</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.musicButton} onPress={pauseTheme}>
            <Text style={styles.musicButtonText}>Pause</Text>
          </TouchableOpacity>
        </View>

        {/* THE STARS — CLICKABLE */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {members.map(cat => {
            const rows = Math.ceil(cat.members.length / columns);
            return (
              <View key={cat.category} style={styles.categorySection}>
                <Text style={styles.categoryHeader}>{cat.category}</Text>
                <View style={styles.divider} />

                {Array.from({ length: rows }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.row,
                      { gap: horizontalSpacing, marginBottom: verticalSpacing },
                    ]}
                  >
                    {Array.from({ length: columns }).map((_, j) => {
                      const member = cat.members[i * columns + j];
                      return (
                        <View key={j} style={styles.starWrapper}>
                          {renderStar(member)}
                        </View>
                      );
                    })}
                  </View>
                ))}
              </View>
            );
          })}
        </ScrollView>

        {/* ⭐ Lore overlay on top of everything */}
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
                <Text style={styles.infoTitle}>Constollation</Text>
                <TouchableOpacity
                  onPress={toggleInfo}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Text style={styles.infoClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.infoText}>
                Constollation is made of the doctors, counselors, social workers,
                mentors, and teachers whose whole power set is people. They&apos;re
                the ones who patch up minds, families, and communities so the
                Parliament has something worth defending.
              </Text>

              <Text style={styles.infoLabel}>What they represent</Text>
              <Text style={styles.infoText}>
                Healing, advocacy, and quiet heroism. These are the heroes who show
                up in hospital corridors, school hallways, and therapy offices —
                the constellation of adults who helped you not fall apart.
              </Text>

              <Text style={styles.infoLabel}>How they operate</Text>
              <Text style={styles.infoText}>
                • On the ground with citizens before, during, and after crises{'\n'}
                • Coordinating shelters, outreach, and long-term recovery{'\n'}
                • Standing between systems and the people crushed by them
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
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)' },

  // HEADER
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0, 40, 80, 0.8)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#7de1ff',
  },
  backText: { fontSize: 14, color: '#e6fbff', fontWeight: 'bold' },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerGlass: {
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(5, 15, 35, 0.95)',
    borderWidth: 1,
    borderColor: '#7de1ff',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#f7fdff',
    textAlign: 'center',
    textShadowColor: '#00b3ff',
    textShadowRadius: 18,
    letterSpacing: 0.8,
  },
  headerSubtitle: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
    color: '#9fe9ff',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  infoHint: {
    marginTop: 2,
    fontSize: 10,
    textAlign: 'center',
    color: '#bfeeff',
  },

  chatButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0, 40, 80, 0.8)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#7de1ff',
  },
  chatText: { fontSize: 18, color: '#7de1ff', fontWeight: 'bold' },

  // MUSIC
  musicControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 18,
    marginVertical: 14,
  },
  musicButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 60, 120, 0.65)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#7de1ff',
  },
  musicButtonText: {
    color: '#e6fbff',
    fontWeight: 'bold',
    fontSize: 13,
  },

  // GRID
  scrollContainer: { paddingBottom: 100, alignItems: 'center' },
  categorySection: { marginBottom: 50, width: '95%' },
  categoryHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#eaf8ff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: '#00b3ff',
    textShadowRadius: 16,
  },
  divider: {
    height: 2,
    backgroundColor: '#7de1ff',
    marginHorizontal: 50,
    marginBottom: 20,
    borderRadius: 2,
  },
  row: { flexDirection: 'row', justifyContent: 'center' },
  starWrapper: { alignItems: 'center' },

  // STAR CARD
  card: {
    width: cardSize,
    height: cardSize * cardHeightMultiplier,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#00b3ff',
    backgroundColor: 'rgba(0, 179, 255, 0.1)',
    shadowColor: '#00b3ff',
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 15,
  },
  starImage: { width: '100%', height: '100%' },
  textWrapper: { position: 'absolute', bottom: 10, left: 10, right: 10 },
  name: {
    color: '#ffffff',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowRadius: 10,
  },
  codename: {
    color: '#00ffff',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowRadius: 12,
  },
  nameDesktop: { fontSize: 16 },
  codenameDesktop: { fontSize: 19 },
  nameMobile: { fontSize: 11 },
  codenameMobile: { fontSize: 12 },
  cardSpacer: { width: cardSize, height: cardSize * cardHeightMultiplier },

  // INFO PANEL
  infoPanelContainer: {
    position: 'absolute',
    top: 80,
    left: 10,
    right: 10,
    zIndex: 20,
  },
  infoPanel: {
    backgroundColor: 'rgba(3, 10, 30, 0.97)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: '#7de1ff',
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
    color: '#f7fdff',
  },
  infoClose: {
    fontSize: 16,
    color: '#f7fdff',
  },
  infoLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#9fe9ff',
  },
  infoText: {
    fontSize: 12,
    color: 'rgba(230,245,255,0.98)',
    marginTop: 2,
    lineHeight: 16,
  },
});

export default ConstollationScreen;
