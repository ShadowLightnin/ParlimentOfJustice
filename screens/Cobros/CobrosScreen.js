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
  Modal,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { cobrosMembers } from './CobrosMembers';
import { Audio } from 'expo-av';
import descriptions from './CobrosDescription';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const isDesktop = SCREEN_WIDTH > 600;
const columns = isDesktop ? 5 : 3;
const cardSize = isDesktop ? 160 : 110;
const cardHeightMultiplier = 1.6;
const horizontalSpacing = isDesktop ? 40 : 12;
const verticalSpacing = isDesktop ? 50 : 22;

export const CobrosScreen = () => {
  const navigation = useNavigation();
  const [previewMember, setPreviewMember] = useState(null);
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

  // MUSIC SYSTEM — Justice Gang forever
  const playTheme = async () => {
    if (!currentSound) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/audio/JusticeGang.mp4'),
          { shouldPlay: true, isLooping: true, volume: 1.0 }
        );
        setCurrentSound(sound);
        await sound.playAsync();
        setIsPlaying(true);
      } catch (error) {
        console.error('Justice Gang failed to load:', error);
        Alert.alert('Audio Error', 'Failed to load JusticeGang.mp4');
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

  const stopAndUnload = async () => {
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
      return () => stopAndUnload();
    }, [currentSound])
  );

  const goToChat = async () => {
    await stopAndUnload();
    navigation.navigate('TeamChat');
  };

  const handleBack = async () => {
    await stopAndUnload();
    navigation.goBack();
  };

  const handleMemberPress = async member => {
    if (!member.clickable) return;
    await stopAndUnload();

    if (member.screen && member.screen !== '') {
      navigation.navigate(member.screen);
    } else {
      navigation.navigate('CobrosCharacterDetail', { member });
    }
  };

  const renderMemberCard = member => {
    const enhancedMember = {
      ...member,
      image:
        member.images?.[0]?.uri ||
        member.image ||
        require('../../assets/Armor/PlaceHolder.jpg'),
      clickable: member.clickable ?? true,
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
          <Text
            style={[
              styles.name,
              isDesktop ? styles.nameDesktop : styles.nameMobile,
            ]}
            numberOfLines={1}
          >
            {enhancedMember.name}
          </Text>

          {enhancedMember.codename ? (
            <Text
              style={[
                styles.codename,
                isDesktop ? styles.codenameDesktop : styles.codenameMobile,
              ]}
              numberOfLines={isDesktop ? 1 : 3}
            >
              {enhancedMember.codename}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const renderGrid = () => {
    const rows = Math.ceil(cobrosMembers.length / columns);
    return Array.from({ length: rows }).map((_, i) => (
      <View
        key={i}
        style={[
          styles.row,
          { gap: horizontalSpacing, marginBottom: verticalSpacing },
        ]}
      >
        {Array.from({ length: columns }).map((_, j) => {
          const member = cobrosMembers[i * columns + j];
          return member ? (
            renderMemberCard(member)
          ) : (
            <View
              key={j}
              style={{
                width: cardSize,
                height: cardSize * cardHeightMultiplier,
              }}
            />
          );
        })}
      </View>
    ));
  };

  const renderPreviewCard = img => (
    <TouchableOpacity
      key={img.name}
      style={[styles.previewCard(isDesktop), styles.previewClickable]}
      onPress={() => setPreviewMember(null)}
      activeOpacity={0.9}
    >
      <Image
        source={typeof img.uri === 'string' ? { uri: img.uri } : img.uri}
        style={styles.previewImage}
        resizeMode="cover"
      />
      <Text style={styles.cardName}>
        © {img.name || 'Unknown'}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  const renderModal = () => {
    if (!previewMember) return null;

    const images = previewMember.images?.length
      ? previewMember.images
      : [{ uri: previewMember.image }];

    return (
      <TouchableOpacity
        style={styles.modalOuter}
        activeOpacity={1}
        onPress={() => setPreviewMember(null)}
      >
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScroll}
            showsHorizontalScrollIndicator={false}
          >
            {images.map((img, i) =>
              renderPreviewCard({
                ...img,
                name: img.name || previewMember.name || `Image ${i + 1}`,
              })
            )}
          </ScrollView>
        </View>
        <View style={styles.previewAboutSection}>
          <Text style={styles.previewCodename}>
            {previewMember.codename || 'N/A'}
          </Text>
          <Text style={styles.previewName}>{previewMember.name}</Text>
          <Text style={styles.previewDescription}>
            {descriptions[previewMember.name] || 'No description available'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Cobros.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.screenOverlay}>
          {/* HEADER — glassy red justice look */}
          <View style={styles.headerWrapper}>
            <TouchableOpacity
              style={styles.back}
              onPress={handleBack}
              activeOpacity={0.85}
            >
              <Text style={styles.backText}>⬅️ Back</Text>
            </TouchableOpacity>

            {/* Tap header center to toggle lore */}
            <TouchableOpacity
              style={styles.headerTitle}
              onPress={toggleInfo}
              activeOpacity={0.9}
            >
              <View style={styles.headerGlass}>
                <Text style={styles.header}>Cobros 314</Text>
                <Text style={styles.headerSub}>
                  The rangers of The Parliament
                </Text>
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

          {/* MUSIC CONTROLS */}
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

          {/* GRID */}
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {renderGrid()}
          </ScrollView>

          {/* 🔴 LORE OVERLAY ON TOP OF EVERYTHING */}
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
                  <Text style={styles.infoTitle}>Cobros 314</Text>
                  <TouchableOpacity
                    onPress={toggleInfo}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Text style={styles.infoClose}>✕</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.infoText}>
                  Cobros 314 are the Parliament&apos;s rangers — scouts, trailblazers,
                  and rescue specialists forged out of real-world memories of
                  campouts, late-night drives, and Young Men adventures. They&apos;re
                  the guys you call when the path forward is unknown and the
                  terrain is hostile.
                </Text>

                <Text style={styles.infoLabel}>What they represent</Text>
                <Text style={styles.infoText}>
                  Brotherhood, grit, and loyalty. Cobros stand for the kind of
                  friendship that survives storms, bad choices, and near-disaster
                  hikes — then laughs about it around a fire the next night.
                </Text>

                <Text style={styles.infoLabel}>
                  Missions they specialize in
                </Text>
                <Text style={styles.infoText}>
                  • Recon runs and long-range scouting outside Zion City{'\n'}
                  • Escorting convoys, search-and-rescue, and extractions{'\n'}
                  • Hit-and-run strikes and field support for Titans and
                  Spartans
                </Text>
              </View>
            )}
          </Animated.View>

          {/* PREVIEW MODAL */}
          <Modal
            visible={!!previewMember}
            transparent
            animationType="fade"
            onRequestClose={() => setPreviewMember(null)}
          >
            <View style={styles.modalBackground}>{renderModal()}</View>
          </Modal>
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
    backgroundColor: 'rgba(5,0,0,0.8)',
    alignItems: 'center',
  },

  /* HEADER */
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
    backgroundColor: 'rgba(60,0,0,0.9)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,120,120,0.8)',
  },
  backText: {
    fontSize: 14,
    color: '#ffdddd',
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
    backgroundColor: 'rgba(10,0,0,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255,120,120,0.9)',
  },
  header: {
    fontSize: isDesktop ? 30 : 24,
    fontWeight: '900',
    color: '#ffdddd',
    textShadowColor: '#e0cd22',
    textShadowRadius: 28,
    textAlign: 'center',
  },
  headerSub: {
    marginTop: 2,
    fontSize: isDesktop ? 12 : 10,
    color: 'rgba(255,220,220,0.9)',
    textAlign: 'center',
  },
  infoHint: {
    marginTop: 2,
    fontSize: 10,
    color: 'rgba(255,220,220,0.9)',
    textAlign: 'center',
  },
  chatButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(60,0,0,0.9)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,120,120,0.8)',
  },
  chatText: { fontSize: 16, color: '#ffdddd' },

  /* MUSIC */
  musicControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
    gap: 8,
  },
  musicButton: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    backgroundColor: 'rgba(230,57,70,0.55)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e63946',
  },
  musicButtonAlt: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,180,180,0.6)',
  },
  musicButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  musicButtonTextAlt: {
    color: '#ffeaea',
    fontWeight: 'bold',
    fontSize: 13,
  },

  /* INFO PANEL OVERLAY */
  infoPanelContainer: {
    position: 'absolute',
    top: 78, // just under header
    left: 10,
    right: 10,
    zIndex: 20,
  },
  infoPanel: {
    backgroundColor: 'rgba(20,2,2,0.97)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(255,120,120,0.9)',
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
    color: '#ffdddd',
  },
  infoClose: {
    fontSize: 16,
    color: '#ffdddd',
  },
  infoLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffb3b3',
  },
  infoText: {
    fontSize: 12,
    color: 'rgba(255,235,235,0.98)',
    marginTop: 2,
    lineHeight: 16,
  },

  /* GRID */
  scrollContainer: { paddingBottom: 40, alignItems: 'center' },
  row: { flexDirection: 'row', justifyContent: 'center' },

  /* CARD */
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'rgba(15,0,0,0.95)',
    borderWidth: 2,
    borderColor: '#e63946',
    shadowColor: '#e63946',
    shadowOpacity: 1,
    shadowRadius: 15,
    elevation: 12,
  },
  disabledCard: { opacity: 0.6 },
  characterImage: { width: '100%', height: '100%' },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  textWrapper: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
  },
  name: {
    color: '#fff',
    textShadowColor: '#e63946',
    textShadowRadius: 14,
    zIndex: 2,
  },
  codename: {
    fontWeight: 'bold',
    color: '#e63946',
    textShadowColor: '#e63946',
    textShadowRadius: 14,
    zIndex: 2,
  },
  // desktop: stacked neatly
  nameDesktop: {
    fontSize: 12,
    marginBottom: 2,
  },
  codenameDesktop: {
    fontSize: 14,
  },
  // mobile: wraps cleanly, no overlap
  nameMobile: {
    fontSize: 11,
    marginBottom: 2,
  },
  codenameMobile: {
    fontSize: 12,
    lineHeight: 16,
  },

  /* MODAL */
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOuter: {
    width: '90%',
    height: '80%',
    backgroundColor: '#111',
    borderRadius: 20,
    overflow: 'hidden',
  },
  imageContainer: { flex: 1, paddingLeft: 20, paddingVertical: 20 },
  imageScroll: { alignItems: 'center', paddingRight: 20 },
  previewCard: desktop => ({
    width: desktop ? SCREEN_WIDTH * 0.22 : SCREEN_WIDTH * 0.8,
    height: desktop ? SCREEN_HEIGHT * 0.7 : SCREEN_HEIGHT * 0.55,
    marginRight: 20,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.7)',
  }),
  previewClickable: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  previewImage: { width: '100%', height: '100%' },
  cardName: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowRadius: 8,
  },
  previewAboutSection: {
    padding: 18,
    backgroundColor: '#222',
    borderTopWidth: 1,
    borderColor: '#444',
  },
  previewCodename: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#e63946',
    textAlign: 'center',
  },
  previewName: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginTop: 6,
  },
  previewDescription: {
    fontSize: 15,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default CobrosScreen;
