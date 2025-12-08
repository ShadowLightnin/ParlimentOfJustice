import React, { useState, useCallback, useRef } from 'react';
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
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const members = [
  { name: '', codename: 'TBA', screen: '', clickable: false, position: [0, 0], image: require('../../assets/Armor/PlaceHolder.jpg') },
  { name: 'James', codename: 'Guarduan', screen: 'James', clickable: true, position: [0, 2], image: require('../../assets/Armor/James.jpg') },
  { name: '', codename: 'TBA', screen: '', clickable: false, position: [1, 0], image: require('../../assets/Armor/PlaceHolder.jpg') },
  { name: 'Aileen', codename: 'Ariata', screen: 'Aileen', clickable: true, position: [1, 1], image: require('../../assets/Armor/AileenAriata.jpg') },
  { name: '', codename: 'TBA', screen: '', clickable: false, position: [1, 2], image: require('../../assets/Armor/PlaceHolder.jpg') },
  { name: 'Myran', codename: 'Cyber', screen: 'Myran', clickable: true, position: [2, 0], image: require('../../assets/Armor/Myran.jpg') },
  { name: '', codename: 'TBA', screen: '', clickable: false, position: [2, 2], image: require('../../assets/Armor/PlaceHolder.jpg') },
];

const isEmpty = (row, col) => (row === 0 && col === 1) || (row === 2 && col === 1);
const getMemberAtPosition = (row, col) =>
  members.find(m => m.position[0] === row && m.position[1] === col);

const EclipseScreen = () => {
  const navigation = useNavigation();
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 🔽 Info panel state + animation (overlay)
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

  const playTheme = async () => {
    if (!currentSound) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/audio/CaptainAmericaEpic.mp4'),
          { shouldPlay: true, isLooping: true, volume: 1.0 }
        );
        setCurrentSound(sound);
        await sound.playAsync();
        setIsPlaying(true);
      } catch (error) {
        Alert.alert('Audio Error', 'Failed to load background music.');
      }
    } else if (!isPlaying && currentSound) {
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

  const stopSound = async () => {
    if (currentSound) {
      try {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
      } catch {}
      setCurrentSound(null);
      setIsPlaying(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => stopSound();
    }, [currentSound])
  );

  const goToChat = async () => {
    await stopSound();
    navigation.navigate('TeamChat');
  };

  const isDesktop = SCREEN_WIDTH > 600;
  const cardSize = isDesktop ? 210 : Math.min(130, SCREEN_WIDTH / 3 - 20);
  const cardSpacing = isDesktop ? 35 : Math.min(18, (SCREEN_WIDTH - 3 * cardSize) / 4);

  const renderCard = member => (
    <TouchableOpacity
      key={`${member.position[0]}-${member.position[1]}`}
      style={[
        styles.card,
        { width: cardSize, height: cardSize * 1.6 },
        !member.clickable && styles.disabledCard,
      ]}
      onPress={async () => {
        if (member.clickable && member.screen) {
          await stopSound();
          navigation.navigate(member.screen);
        }
      }}
      disabled={!member.clickable}
      activeOpacity={0.9}
    >
      <Image source={member.image} style={styles.characterImage} resizeMode="cover" />

      <View style={styles.cardOverlay} />

      <View style={styles.textWrapper}>
        <Text
          style={[
            styles.name,
            isDesktop ? styles.nameDesktop : styles.nameMobile,
          ]}
          numberOfLines={1}
        >
          {member.name}
        </Text>

        <Text
          style={[
            styles.codename,
            isDesktop ? styles.codenameDesktop : styles.codenameMobile,
          ]}
          numberOfLines={isDesktop ? 1 : 3}
        >
          {member.codename}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Eclipse.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
        <View style={styles.overlay}>
          {/* HEADER */}
          <View style={styles.headerWrapper}>
            <TouchableOpacity
              style={styles.back}
              onPress={async () => {
                await stopSound();
                navigation.goBack();
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.backText}>⬅️ Back</Text>
            </TouchableOpacity>

            {/* Tap title to toggle lore overlay */}
            <TouchableOpacity
              style={styles.headerTitle}
              onPress={toggleInfo}
              activeOpacity={0.9}
            >
              <View style={styles.headerGlass}>
                <Text style={styles.header}>Eclipse</Text>
                <Text style={styles.headerSub}>The Hearts of the Titans</Text>
                <Text style={styles.infoHint}>Tap for team lore ⬇</Text>
              </View>
            </TouchableOpacity>

            {/* <TouchableOpacity
              onPress={goToChat}
              style={styles.chatButton}
              activeOpacity={0.85}
            >
              <Text style={styles.chatText}>💬</Text>
            </TouchableOpacity> */}
          </View>

          {/* LORE OVERLAY (on top of everything) */}
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
                  <Text style={styles.infoTitle}>Eclipse</Text>
                  <TouchableOpacity
                    onPress={toggleInfo}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Text style={styles.infoClose}>✕</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.infoText}>
                  Eclipse is the circle of partners, spouses, and soul-level allies
                  who stand beside the Titans. They are the emotional armor of the
                  Parliament — the ones who steady the heroes when the universe is
                  falling apart.
                </Text>

                <Text style={styles.infoLabel}>What they represent</Text>
                <Text style={styles.infoText}>
                  Love, grounding, and perspective. Eclipse members remind the Titans
                  what they&apos;re fighting for — real lives, real relationships,
                  and a future worth saving.
                </Text>

                <Text style={styles.infoLabel}>
                  Enemy types they specialize against
                </Text>
                <Text style={styles.infoText}>
                  • Psychological and emotional warfare{'\n'}
                  • Villains who target families, support networks, or civilians{'\n'}
                  • Manipulation, propaganda, street-level and major villains
                </Text>
              </View>
            )}
          </Animated.View>

          {/* MUSIC */}
          <View style={styles.musicControls}>
            <TouchableOpacity style={styles.musicButton} onPress={playTheme}>
              <Text style={styles.musicButtonText}>
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

          {/* CONTENT */}
          <View style={styles.contentCenter}>
            {isDesktop ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  padding: 24,
                  gap: cardSpacing,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {members.map(renderCard)}
              </ScrollView>
            ) : (
              <ScrollView contentContainerStyle={{ padding: 14 }}>
                <View style={{ gap: cardSpacing, alignItems: 'center' }}>
                  {[0, 1, 2].map(row => (
                    <View key={row} style={{ flexDirection: 'row', gap: cardSpacing }}>
                      {[0, 1, 2].map(col => {
                        if (isEmpty(row, col)) {
                          return (
                            <View
                              key={col}
                              style={{ width: cardSize, height: cardSize * 1.6 }}
                            />
                          );
                        }
                        const member = getMemberAtPosition(row, col);
                        return member ? renderCard(member) : null;
                      })}
                    </View>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const SILVER = 'rgba(200, 200, 220, 0.95)';
const BLUE = '#00c6ff';
const BLUE_GLOW = 'rgba(0,180,255,0.7)';
const DARK_GLASS = 'rgba(10,15,25,0.65)';

const styles = StyleSheet.create({
  background: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
  safeArea: { flex: 1 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)' },

  /* HEADER (Silver + Blue) -------------------- */
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  back: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(30,40,55,0.85)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(120,160,200,0.9)',
  },
  backText: {
    color: SILVER,
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerTitle: { flex: 1, alignItems: 'center' },
  headerGlass: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: DARK_GLASS,
    borderWidth: 1,
    borderColor: 'rgba(160,200,240,0.7)',
  },
  header: {
    fontSize: SCREEN_WIDTH > 600 ? 30 : 24,
    fontWeight: 'bold',
    color: SILVER,
    textAlign: 'center',
    textShadowColor: BLUE,
    textShadowRadius: 15,
  },
  headerSub: {
    marginTop: 2,
    fontSize: SCREEN_WIDTH > 600 ? 12 : 10,
    color: 'rgba(180,220,255,0.9)',
    textAlign: 'center',
  },
  infoHint: {
    marginTop: 2,
    fontSize: 10,
    color: 'rgba(200,220,255,0.9)',
    textAlign: 'center',
  },
  chatButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(30,40,55,0.85)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(120,160,200,0.9)',
  },
  chatText: { fontSize: 16, color: SILVER },

  /* INFO PANEL OVERLAY ------------------------ */
  infoPanelContainer: {
    position: 'absolute',
    top: 70, // under header
    left: 12,
    right: 12,
    zIndex: 20,
  },
  infoPanel: {
    backgroundColor: 'rgba(5,10,20,0.96)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(160,200,240,0.9)',
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
    color: SILVER,
  },
  infoClose: {
    fontSize: 16,
    color: BLUE,
  },
  infoLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: 'bold',
    color: BLUE,
  },
  infoText: {
    fontSize: 12,
    color: 'rgba(210,230,255,0.95)',
    marginTop: 2,
    lineHeight: 16,
  },

  /* MUSIC BUTTONS ----------------------------- */
  musicControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  musicButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(30,40,55,0.85)',
    borderWidth: 1,
    borderColor: BLUE,
    marginHorizontal: 6,
  },
  musicButtonSecondary: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(120,160,200,0.6)',
    marginHorizontal: 6,
  },
  musicButtonText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: BLUE,
  },
  musicButtonTextSecondary: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'rgba(200,220,255,0.9)',
  },

  /* CONTENT ------------------------------- */
  contentCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  /* CARDS -------------------------------- */
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'rgba(15,20,30,0.9)',
    borderWidth: 1.5,
    borderColor: 'rgba(200,200,220,0.9)',
    shadowColor: BLUE_GLOW,
    shadowOpacity: 0.75,
    shadowRadius: 12,
    elevation: 10,
  },
  disabledCard: { opacity: 0.5 },
  characterImage: { width: '100%', height: '100%' },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  /* TEXT -------------------------------- */
  textWrapper: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
  },
  name: {
    color: SILVER,
    textShadowColor: BLUE,
    textShadowRadius: 10,
  },
  codename: {
    fontWeight: 'bold',
    color: BLUE,
    textShadowColor: BLUE_GLOW,
    textShadowRadius: 12,
  },

  /* DESKTOP VS MOBILE -------------------- */
  nameDesktop: { fontSize: 14, marginBottom: 2 },
  codenameDesktop: { fontSize: 16 },

  nameMobile: { fontSize: 11, marginBottom: 2 },
  codenameMobile: { fontSize: 13, lineHeight: 16 },
});

export default EclipseScreen;
