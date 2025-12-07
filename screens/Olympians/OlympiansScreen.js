import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { olympiansCategories } from './OlympiansMembers';
import { Audio } from 'expo-av';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const isDesktop = SCREEN_WIDTH > 600;
const columns = isDesktop ? 6 : 3;
const cardSize = isDesktop ? 160 : 110;
const cardHeightMultiplier = 1.6;
const horizontalSpacing = isDesktop ? 40 : 12;
const verticalSpacing = isDesktop ? 50 : 22;

// Phoenix colors for Olympians (Jennifer keeps her original red)
const PHOENIX = {
  fire: '#FF4500',
  gold: '#FFD700',
  ember: '#FF8C00',
};

export const OlympiansScreen = () => {
  const navigation = useNavigation();
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // 🔽 Lore overlay state + animation
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
          require('../../assets/audio/SupermanTrailer.mp4'),
          { shouldPlay: true, isLooping: true, volume: 1.0 }
        );
        setCurrentSound(sound);
        await sound.playAsync();
        setIsPlaying(true);
      } catch (error) {
        Alert.alert('Audio Error', 'Failed to load background music.');
      }
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

  const handleMemberPress = async member => {
    if (member.clickable === false) return;

    await stopSound();

    if (member.screen && member.screen !== '') {
      navigation.navigate(member.screen);
    } else {
      navigation.navigate('OlympiansCharacterDetail', { member });
    }
  };

  // Regular Olympian cards — Phoenix fire theme, responsive text layout
  const renderMemberCard = member => {
    const enhancedMember = {
      ...member,
      image:
        member.images?.[0]?.uri ||
        member.image ||
        require('../../assets/Armor/PlaceHolder.jpg'),
      clickable: member.clickable !== false,
    };

    return (
      <TouchableOpacity
        key={enhancedMember.name}
        style={[
          styles.card,
          {
            width: cardSize,
            height: cardSize * cardHeightMultiplier,
          },
          !enhancedMember.clickable && styles.disabledCard,
        ]}
        onPress={() => handleMemberPress(enhancedMember)}
        disabled={!enhancedMember.clickable}
        activeOpacity={0.9}
      >
        <Image
          source={
            typeof enhancedMember.image === 'string'
              ? { uri: enhancedMember.image }
              : enhancedMember.image
          }
          style={styles.characterImage}
          resizeMode="cover"
        />

        <View style={styles.cardOverlay} />

        <View style={styles.textWrapper}>
          {/* Name */}
          <Text
            style={[
              styles.name,
              isDesktop ? styles.nameDesktop : styles.nameMobile,
            ]}
            numberOfLines={1}
          >
            {enhancedMember.name}
          </Text>

          {/* Codename */}
          <Text
            style={[
              styles.codename,
              isDesktop ? styles.codenameDesktop : styles.codenameMobile,
            ]}
            numberOfLines={isDesktop ? 1 : 3}
          >
            {enhancedMember.codename || ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Jennifer — memorial card, stays special
  const renderJenniferCard = member => {
    const enhancedMember = {
      ...member,
      image:
        member.images?.[0]?.uri ||
        member.image ||
        require('../../assets/Armor/PlaceHolder.jpg'),
      clickable: member.clickable !== false,
    };

    return (
      <TouchableOpacity
        key={enhancedMember.name}
        style={[
          styles.jenniferCard,
          {
            width: 2 * cardSize + horizontalSpacing,
            height: cardSize * 2.5,
          },
        ]}
        onPress={() => handleMemberPress(enhancedMember)}
        activeOpacity={0.9}
      >
        <Image
          source={
            typeof enhancedMember.image === 'string'
              ? { uri: enhancedMember.image }
              : enhancedMember.image
          }
          style={styles.jenniferImage}
          resizeMode="cover"
        />
        <View style={styles.jenniferOverlay} />
        <Text style={styles.jenniferCodename}>
          {enhancedMember.codename || ''}
        </Text>
        <Text style={styles.jenniferName}>{enhancedMember.name}</Text>
      </TouchableOpacity>
    );
  };

  const jenniferMember = olympiansCategories
    .flatMap(c => c.members)
    .find(m => m.name === 'Jennifer');

  const eduriaMembers =
    olympiansCategories.find(c => c.family === 'Eduria')?.members || [];

  const nonEduriaMembers = olympiansCategories
    .filter(c => c.family !== 'Eduria')
    .flatMap(c => c.members)
    .filter(m => m.name !== 'Jennifer');

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Olympians.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.screenOverlay}>
          {/* HEADER — glassy, phoenix-themed */}
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

            {/* Tap title for lore */}
            <TouchableOpacity
              style={styles.headerTitle}
              onPress={toggleInfo}
              activeOpacity={0.9}
            >
              <View style={styles.headerGlass}>
                <Text style={styles.header}>Olympians</Text>
                <Text style={styles.headerSub}>Family of Heroes</Text>
                <Text style={styles.infoHint}>Tap for team lore ⬇</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={goToChat}
              style={styles.chatButton}
              activeOpacity={0.85}
            >
              <Text style={styles.chatText}>💬</Text>
            </TouchableOpacity>
          </View>

          {/* MUSIC */}
          <View style={styles.musicControls}>
            <TouchableOpacity style={styles.musicButton} onPress={playTheme}>
              <Text style={styles.musicButtonText}>
                {isPlaying ? 'Playing…' : 'Theme'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.musicButtonAlt} onPress={pauseTheme}>
              <Text style={styles.musicButtonTextAlt}>Pause</Text>
            </TouchableOpacity>
          </View>

          {/* CONTENT */}
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* Jennifer featured */}
            {jenniferMember && (
              <View style={styles.jenniferCardContainer}>
                {renderJenniferCard(jenniferMember)}
              </View>
            )}
            <View style={styles.spacingBelowJennifer} />

            <View style={styles.membersContainer}>
              {/* Non-Eduria rows */}
              {Array.from({
                length: Math.ceil(nonEduriaMembers.length / columns),
              }).map((_, rowIndex) => (
                <View
                  key={rowIndex}
                  style={[
                    styles.row,
                    {
                      marginBottom: verticalSpacing,
                      gap: horizontalSpacing,
                    },
                  ]}
                >
                  {Array.from({ length: columns }).map((_, colIndex) => {
                    const member =
                      nonEduriaMembers[rowIndex * columns + colIndex];
                    return member ? (
                      renderMemberCard(member)
                    ) : (
                      <View
                        key={colIndex}
                        style={{
                          width: cardSize,
                          height: cardSize * cardHeightMultiplier,
                        }}
                      />
                    );
                  })}
                </View>
              ))}

              {/* THE DIWATAS section */}
              {eduriaMembers.length > 0 && (
                <>
                  <View style={styles.diwataLine} />
                  <Text style={styles.diwataTitle}>The Diwatas</Text>
                  <View style={styles.diwataLine} />

                  {Array.from({
                    length: Math.ceil(eduriaMembers.length / columns),
                  }).map((_, rowIndex) => (
                    <View
                      key={`diwata-${rowIndex}`}
                      style={[
                        styles.row,
                        {
                          marginBottom: verticalSpacing,
                          gap: horizontalSpacing,
                        },
                      ]}
                    >
                      {Array.from({ length: columns }).map((_, colIndex) => {
                        const member =
                          eduriaMembers[rowIndex * columns + colIndex];
                        return member ? (
                          renderMemberCard(member)
                        ) : (
                          <View
                            key={colIndex}
                            style={{
                              width: cardSize,
                              height: cardSize * cardHeightMultiplier,
                            }}
                          />
                        );
                      })}
                    </View>
                  ))}
                </>
              )}
            </View>
          </ScrollView>

          {/* 🔥 LORE OVERLAY — ON TOP OF EVERYTHING */}
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
                  <Text style={styles.infoTitle}>Olympians</Text>
                  <TouchableOpacity
                    onPress={toggleInfo}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Text style={styles.infoClose}>✕</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.infoText}>
                  The Olympians are the Parliament&apos;s living legacy — an
                  entire family tree of heroes, mentors, and guardians stretching
                  across generations. From parents and cousins to future
                  prodigies, they are the beating heart behind every frontline
                  team.
                </Text>

                <Text style={styles.infoLabel}>What they represent</Text>
                <Text style={styles.infoText}>
                  Legacy, unity, and resurrection. The Olympians prove that the
                  mantle of heroism is inherited not just by blood, but by love,
                  sacrifice, and the choice to stand back up when worlds fall
                  apart.
                </Text>

                <Text style={styles.infoLabel}>
                  Threats they stand against
                </Text>
                <Text style={styles.infoText}>
                  • Multi-front crises that endanger whole families and cities{'\n'}
                  • Dark forces and emotional and mental manipulation and turmoil{'\n'}
                  • Any enemy that tries to break the bonds of home, faith, and
                  family
                </Text>
              </View>
            )}
          </Animated.View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
  safeArea: { flex: 1 },
  screenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5,0,0,0.78)',
  },

  /* HEADER ------------------------------ */
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  back: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(80,20,0,0.85)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,160,80,0.8)',
  },
  backText: {
    color: PHOENIX.gold,
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerTitle: { flex: 1, alignItems: 'center' },
  headerGlass: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(25,5,0,0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255,180,90,0.7)',
  },
  header: {
    fontSize: isDesktop ? 30 : 24,
    fontWeight: '900',
    color: PHOENIX.gold,
    textShadowColor: PHOENIX.fire,
    textShadowRadius: 22,
    textAlign: 'center',
  },
  headerSub: {
    marginTop: 2,
    fontSize: isDesktop ? 12 : 10,
    color: 'rgba(255,230,200,0.9)',
    textAlign: 'center',
  },
  infoHint: {
    marginTop: 2,
    fontSize: 10,
    color: 'rgba(255,230,200,0.9)',
    textAlign: 'center',
  },
  chatButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(80,20,0,0.85)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,160,80,0.8)',
  },
  chatText: { fontSize: 16, color: PHOENIX.gold },

  /* MUSIC ------------------------------ */
  musicControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 8,
  },
  musicButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: 'rgba(255,69,0,0.25)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: PHOENIX.ember,
  },
  musicButtonAlt: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,200,160,0.6)',
  },
  musicButtonText: {
    fontSize: 13,
    color: PHOENIX.gold,
    fontWeight: 'bold',
  },
  musicButtonTextAlt: {
    fontSize: 13,
    color: '#ffe0c4',
    fontWeight: 'bold',
  },

  /* INFO PANEL OVERLAY ----------------- */
  infoPanelContainer: {
    position: 'absolute',
    top: 78, // just under header
    left: 10,
    right: 10,
    zIndex: 20,
  },
  infoPanel: {
    backgroundColor: 'rgba(25,5,0,0.96)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255,180,90,0.9)',
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
    color: PHOENIX.gold,
  },
  infoClose: {
    fontSize: 16,
    color: PHOENIX.gold,
  },
  infoLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: 'bold',
    color: PHOENIX.fire,
  },
  infoText: {
    fontSize: 12,
    color: 'rgba(255,235,210,0.96)',
    marginTop: 2,
    lineHeight: 16,
  },

  /* SCROLL + GRID ---------------------- */
  scrollContainer: {
    paddingBottom: 24,
    alignItems: 'center',
  },
  membersContainer: {
    width: '100%',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },

  /* CARD ------------------------------- */
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'rgba(20,5,0,0.9)',
    borderWidth: 2,
    borderColor: PHOENIX.fire,
    shadowColor: PHOENIX.fire,
    shadowOpacity: 0.9,
    shadowRadius: 14,
    elevation: 12,
  },
  disabledCard: { opacity: 0.6 },
  characterImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  /* TEXT ON CARDS ---------------------- */
  textWrapper: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
  },
  name: {
    color: '#fff',
    textShadowColor: PHOENIX.fire,
    textShadowRadius: 12,
    zIndex: 2,
  },
  codename: {
    fontWeight: 'bold',
    color: PHOENIX.gold,
    textShadowColor: PHOENIX.fire,
    textShadowRadius: 14,
    zIndex: 2,
  },
  // desktop: codename at bottom, name above (non-overlapping)
  nameDesktop: {
    fontSize: 12,
    marginBottom: 2,
  },
  codenameDesktop: {
    fontSize: 14,
  },
  // mobile: stacked & wrapping cleanly
  nameMobile: {
    fontSize: 11,
    marginBottom: 2,
  },
  codenameMobile: {
    fontSize: 12,
    lineHeight: 16,
  },

  /* DIWATAS SEPARATOR ------------------ */
  diwataLine: {
    height: 5,
    backgroundColor: PHOENIX.fire,
    marginHorizontal: 60,
    marginVertical: 24,
    borderRadius: 3,
    shadowColor: PHOENIX.fire,
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 12,
  },
  diwataTitle: {
    fontSize: isDesktop ? 36 : 30,
    fontWeight: '900',
    color: PHOENIX.gold,
    textShadowColor: PHOENIX.fire,
    textShadowRadius: 30,
    textAlign: 'center',
  },

  /* JENNIFER MEMORIAL CARD ------------- */
  jenniferCardContainer: {
    alignItems: 'center',
    marginTop: verticalSpacing,
  },
  spacingBelowJennifer: { height: verticalSpacing * 2 },
  jenniferCard: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(40,0,0,0.9)',
    borderWidth: 3,
    borderColor: '#ff9999',
    shadowColor: '#ff9999',
    shadowOpacity: 0.9,
    shadowRadius: 16,
    elevation: 15,
  },
  jenniferImage: { width: '100%', height: '100%' },
  jenniferOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  jenniferCodename: {
    position: 'absolute',
    bottom: 20,
    left: 15,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ff9999',
    textShadowColor: '#ff9999',
    textShadowRadius: 15,
    zIndex: 2,
  },
  jenniferName: {
    position: 'absolute',
    bottom: 50,
    left: 15,
    fontSize: 18,
    color: '#fff',
    textShadowColor: '#ff9999',
    textShadowRadius: 15,
    zIndex: 2,
  },
});

export default OlympiansScreen;
