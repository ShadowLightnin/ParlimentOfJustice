import React, { useCallback, useState, useRef } from 'react';
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
  Alert,
  Animated,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const members = [
  {
    name: 'Spencer McNeil',
    codename: 'Annihilator',
    screen: 'Spencer',
    clickable: true,
    position: [0, 0],
    image: require('../../assets/Armor/Spencer5.jpg'),
  },
  {
    name: 'Azure Briggs',
    codename: 'Mediateir',
    screen: 'Azure',
    clickable: true,
    position: [0, 2],
    image: require('../../assets/Armor/Azure3.jpg'),
  },
  {
    name: 'Jared McNeil',
    codename: 'Spector',
    screen: 'Jared',
    clickable: true,
    position: [1, 0],
    image: require('../../assets/Armor/Jared3.jpg'),
  },
  {
    name: 'Will Cummings',
    codename: 'Night Hawk',
    screen: 'Will',
    clickable: true,
    position: [1, 1],
    image: require('../../assets/Armor/WillNightHawk3.jpg'),
  },
  {
    name: 'Ben Briggs',
    codename: 'Nuscus',
    screen: 'Ben',
    clickable: true,
    position: [1, 2],
    image: require('../../assets/Armor/Ben4.jpg'),
  },
  {
    name: 'Jennifer McNeil',
    codename: 'Kintsugi',
    screen: 'Jennifer',
    clickable: true,
    position: [2, 0],
    image: require('../../assets/Armor/JenniferLegacy.jpg'),
  },
  {
    name: 'Emma Cummings',
    codename: 'Kintsunera',
    screen: 'Emma',
    clickable: true,
    position: [2, 2],
    image: require('../../assets/Armor/EmmaLegacy.jpg'),
  },
];

const isEmpty = (row, col) =>
  (row === 0 && col === 1) || (row === 2 && col === 1);

const getMemberAtPosition = (row, col) =>
  members.find(m => m.position[0] === row && m.position[1] === col);

const TitansScreen = () => {
  const navigation = useNavigation();
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 🔽 Info panel state + animation
  const [infoOpen, setInfoOpen] = useState(false);
  const infoAnim = useRef(new Animated.Value(0)).current;

  const toggleInfo = () => {
    if (infoOpen) {
      Animated.timing(infoAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start(() => {
        setInfoOpen(false);
      });
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
          require('../../assets/audio/AvengerXJL.mp4'),
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
      } catch (e) {
        // ignore audio errors on cleanup
      }
      setCurrentSound(null);
      setIsPlaying(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        stopSound();
      };
    }, [currentSound])
  );

  const isDesktop = SCREEN_WIDTH > 600;
  const cardSize = isDesktop ? 210 : Math.min(130, SCREEN_WIDTH / 3 - 20);
  const cardSpacing = isDesktop
    ? 30
    : Math.min(18, (SCREEN_WIDTH - 3 * cardSize) / 4);

  const renderCard = m => (
    <TouchableOpacity
      key={m.name}
      style={[
        styles.card,
        {
          width: cardSize,
          height: cardSize * 1.6,
        },
        !m.clickable && styles.disabledCard,
      ]}
      onPress={async () => {
        if (m.clickable) {
          await stopSound();
          navigation.navigate(m.screen);
        }
      }}
      disabled={!m.clickable}
      activeOpacity={0.9}
    >
      <Image
        source={m.image}
        style={styles.characterImage}
        resizeMode="cover"
      />

      {/* Glass overlay */}
      <View style={styles.cardOverlay} />

      {/* Text wrapper */}
      <View style={styles.textWrapper}>
        <Text
          style={[
            styles.name,
            isDesktop ? styles.nameDesktop : styles.nameMobile,
          ]}
          numberOfLines={1}
        >
          {m.name}
        </Text>

        <Text
          style={[
            styles.codename,
            isDesktop ? styles.codenameDesktop : styles.codenameMobile,
          ]}
          numberOfLines={isDesktop ? 1 : 2}
        >
          {m.codename}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Titans.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.overlay}>
          {/* Glassy Header */}
          <View style={styles.headerWrapper}>
            <TouchableOpacity
              style={styles.back}
              onPress={async () => {
                await stopSound();
                navigation.navigate('Home');
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.backText}>⬅️ Back</Text>
            </TouchableOpacity>

            {/* Tap the title to open lore panel */}
            <TouchableOpacity
              style={styles.headerTitle}
              onPress={toggleInfo}
              activeOpacity={0.9}
            >
              <View style={styles.headerGlass}>
                <Text style={styles.header}>Titans</Text>
                <Text style={styles.headerSub}>
                  Prime Parliament hero team
                </Text>
                <Text style={styles.infoHint}>Tap for team lore ⬇</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={async () => {
                await stopSound();
                navigation.navigate('TeamChat');
              }}
              style={styles.chatButton}
              activeOpacity={0.85}
            >
              <Text style={styles.chatText}>💬</Text>
            </TouchableOpacity>
          </View>

          {/* Team Info Overlay (on top of everything) */}
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
                  <Text style={styles.infoTitle}>Titans</Text>
                  <TouchableOpacity
                    onPress={toggleInfo}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Text style={styles.infoClose}>✕</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.infoText}>
                  The Titans are the Prime Parliament&apos;s frontline hero
                  team — the original squad that stood together during The
                  Incident and became legends in Zion City.
                </Text>

                <Text style={styles.infoLabel}>What they represent</Text>
                <Text style={styles.infoText}>
                  Family, leadership, and unity. Each Titan carries the weight
                  of their family legacy while protecting the Justiceverse as
                  its core symbol of hope and resilience.
                </Text>

                <Text style={styles.infoLabel}>
                  Enemy types they specialize against
                </Text>
                <Text style={styles.infoText}>
                  • World-ending threats and cosmic invaders{'\n'}
                  • Maw-related incursions and void entities{'\n'}
                  • High-tier villains tied to Erevos, Torath, and the
                  Enlightened
                </Text>
              </View>
            )}
          </Animated.View>

          {/* Music Controls */}
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

          {/* Content */}
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
                    <View
                      key={row}
                      style={{ flexDirection: 'row', gap: cardSpacing }}
                    >
                      {[0, 1, 2].map(col => {
                        if (isEmpty(row, col)) {
                          return (
                            <View
                              key={col}
                              style={{
                                width: cardSize,
                                height: cardSize * 1.6,
                              }}
                            />
                          );
                        }
                        const m = getMemberAtPosition(row, col);
                        return m ? renderCard(m) : null;
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

const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  safeArea: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 5, 15, 0.78)',
  },

  // HEADER
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
    backgroundColor: 'rgba(0, 40, 80, 0.85)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0, 200, 255, 0.6)',
  },
  backText: {
    color: '#E6F7FF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerGlass: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(0, 200, 255, 0.4)',
  },
  header: {
    fontSize: SCREEN_WIDTH > 600 ? 30 : 24,
    fontWeight: 'bold',
    color: '#EFFFFF',
    textAlign: 'center',
    textShadowColor: '#00c8ff',
    textShadowRadius: 18,
  },
  headerSub: {
    marginTop: 2,
    fontSize: SCREEN_WIDTH > 600 ? 12 : 10,
    color: 'rgba(190, 240, 255, 0.9)',
    textAlign: 'center',
    letterSpacing: 0.4,
  },
  infoHint: {
    marginTop: 2,
    fontSize: 10,
    color: 'rgba(190, 240, 255, 0.9)',
    textAlign: 'center',
  },
  chatButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0, 40, 80, 0.85)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0, 200, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatText: {
    fontSize: 16,
    color: '#E6F7FF',
  },

  // INFO PANEL OVERLAY
  infoPanelContainer: {
    position: 'absolute',
    top: 70,          // just under the header
    left: 12,
    right: 12,
    zIndex: 20,
  },
  infoPanel: {
    backgroundColor: 'rgba(1, 15, 30, 0.96)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 200, 255, 0.85)',
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
    color: '#EFFFFF',
  },
  infoClose: {
    fontSize: 16,
    color: '#A8E4FF',
  },
  infoLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7CEBFF',
  },
  infoText: {
    fontSize: 12,
    color: '#CFEFFF',
    marginTop: 2,
    lineHeight: 16,
  },

  // MUSIC CONTROLS
  musicControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  musicButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 30, 70, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(0, 200, 255, 0.7)',
    marginHorizontal: 6,
  },
  musicButtonSecondary: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(120, 180, 200, 0.5)',
    marginHorizontal: 6,
  },
  musicButtonText: {
    fontSize: 13,
    color: '#CFF6FF',
    fontWeight: 'bold',
  },
  musicButtonTextSecondary: {
    fontSize: 13,
    color: '#A9C7D6',
    fontWeight: 'bold',
  },

  contentCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // CARDS
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'rgba(3, 10, 25, 0.9)',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 200, 255, 0.7)',
    shadowColor: '#00c8ff',
    shadowOpacity: 0.75,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
  characterImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },

  textWrapper: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
  },

  name: {
    color: '#EFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowRadius: 10,
    zIndex: 2,
  },
  codename: {
    fontWeight: 'bold',
    color: '#27E0FF',
    textShadowColor: '#00b3ff',
    textShadowRadius: 12,
    zIndex: 2,
  },

  // Desktop sizing
  nameDesktop: {
    fontSize: 14,
    marginBottom: 2,
  },
  codenameDesktop: {
    fontSize: 16,
  },

  // Mobile sizing / wrapping
  nameMobile: {
    fontSize: 11,
    marginBottom: 2,
  },
  codenameMobile: {
    fontSize: 13,
    lineHeight: 16,
  },

  disabledCard: {
    opacity: 0.6,
  },
});

export default TitansScreen;
