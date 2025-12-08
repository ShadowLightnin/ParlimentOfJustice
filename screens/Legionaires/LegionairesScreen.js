import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { memberCategories } from './LegionairesMembers';
import legionImages from './LegionairesImages';
import descriptions from './LegionDescription';
import LegionFriends from './LegionFriends';
import { Audio } from 'expo-av';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const isDesktop = SCREEN_WIDTH > 600;
const columns = isDesktop ? 7 : 3;
const cardSize = isDesktop ? 160 : 110;
const cardHeightMultiplier = 1.6;
const horizontalSpacing = isDesktop ? 40 : 12;
const verticalSpacing = isDesktop ? 24 : 12;

export const LegionairesScreen = () => {
  const navigation = useNavigation();
  const [members, setMembers] = useState(memberCategories);
  const [editingMember, setEditingMember] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ visible: false, member: null });
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [background, setBackground] = useState(null);
  const [audioFile, setAudioFile] = useState(null);

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

  // Random background + audio (your original behavior)
  useEffect(() => {
    const random = Math.random();
    if (random < 0.4) {
      setBackground(require('../../assets/BackGround/Legionaires2.jpg'));
      setAudioFile(require('../../assets/audio/BlueBloodsExtend.mp4'));
    } else {
      setBackground(require('../../assets/BackGround/AnimatedLegion.gif'));
      setAudioFile(require('../../assets/audio/Legion2.mp4'));
    }
  }, []);

  const playTheme = async () => {
    if (!audioFile || currentSound) return;
    try {
      const { sound } = await Audio.Sound.createAsync(audioFile, {
        shouldPlay: true,
        isLooping: true,
        volume: 1.0,
      });
      setCurrentSound(sound);
      await sound.playAsync();
      setIsPlaying(true);
    } catch (error) {
      Alert.alert('Audio Error', 'Failed to load background music.');
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

  useFocusEffect(
    useCallback(() => {
      return () => stopSound();
    }, [currentSound])
  );

  // Firestore sync
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'LegionairesMembers'), snapshot => {
      const fetched = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

      const updated = memberCategories.map(cat => ({
        ...cat,
        members: [
          // keep hardcoded or non-overwritten originals
          ...cat.members.filter(
            m => legionImages[m.name]?.hardcoded || !fetched.some(f => f.name === m.name)
          ),
          // add dynamic ones per category
          ...fetched.filter(m => m.category === cat.category && !m.hardcoded),
        ],
      }));

      setMembers(updated);
    });

    return () => unsubscribe();
  }, []);

  const goToChat = async () => {
    await stopSound();
    navigation.navigate('TeamChat');
  };

  const handleBack = async () => {
    await stopSound();
    navigation.goBack();
  };

  const handleMemberPress = async member => {
    if (!member.clickable) return;
    await stopSound();
    if (member.screen) {
      navigation.navigate(member.screen);
    } else {
      navigation.navigate('LegionairesCharacterDetail', { member });
    }
  };

  const renderMemberCard = member => (
    <View key={member.name} style={styles.cardContainer}>
      <TouchableOpacity
        style={[
          styles.card,
          {
            width: cardSize,
            height: cardSize * cardHeightMultiplier,
            marginHorizontal: horizontalSpacing / 2,
          },
          !member.clickable && styles.disabledCard,
        ]}
        onPress={() => handleMemberPress(member)}
        disabled={!member.clickable}
        activeOpacity={0.9}
      >
        <Image source={member.image} style={styles.characterImage} resizeMode="cover" />
        <View style={styles.cardOverlay} />

        {/* Glassy, responsive text */}
        <View style={styles.textWrapper}>
          <Text
            style={[styles.name, isDesktop ? styles.nameDesktop : styles.nameMobile]}
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
            {member.codename || ''}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Admin buttons */}
      {!legionImages[member.name]?.hardcoded && !member.hardcoded && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditingMember(member)}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() =>
              member.id && setDeleteModal({ visible: true, member })
            }
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const confirmDelete = async id => {
    try {
      await deleteDoc(doc(db, 'LegionairesMembers', id));
      setMembers(prev =>
        prev.map(cat => ({
          ...cat,
          members: cat.members.filter(m => m.id !== id),
        }))
      );
      Alert.alert('Success', 'Member deleted successfully!');
    } catch (err) {
      Alert.alert('Error', 'Failed to delete member.');
    } finally {
      setDeleteModal({ visible: false, member: null });
    }
  };

  return (
    <ImageBackground
      source={background || require('../../assets/BackGround/Legionaires2.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}  edges={['bottom', 'left', 'right']}>
        <View style={styles.overlay}>
          {/* HEADER — clean + glassy, blue/silver */}
          <View style={styles.headerWrapper}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.85}
            >
              <Text style={styles.backText}>⬅️ Back</Text>
            </TouchableOpacity>

            {/* Tap the title to open lore panel */}
            <TouchableOpacity
              style={styles.headerTitleWrapper}
              onPress={toggleInfo}
              activeOpacity={0.9}
            >
              <View style={styles.headerGlass}>
                <Text style={styles.header}>Legionnaires</Text>
                {/* <Text style={styles.headerSub}>Friends • Mentors • Legends</Text> */}
                <Text style={styles.headerSub}>
                  The law enforcements of The Parliament
                </Text>
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

          {/* MUSIC CONTROLS — sleek chips */}
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
            {members.map((categoryData, categoryIndex) => {
              const rows = Math.ceil(categoryData.members.length / columns);

              return (
                <View key={categoryIndex} style={styles.categorySection}>
                  {/* Category title + divider */}
                  <Text style={styles.categoryHeader}>{categoryData.category}</Text>
                  <View style={styles.divider} />

                  {Array.from({ length: rows }).map((_, rowIndex) => (
                    <View
                      key={rowIndex}
                      style={[styles.row, { marginBottom: verticalSpacing }]}
                    >
                      {Array.from({ length: columns }).map((_, colIndex) => {
                        const memberObj =
                          categoryData.members[rowIndex * columns + colIndex];
                        if (!memberObj?.name) {
                          return (
                            <View
                              key={colIndex}
                              style={styles.cardSpacer}
                            />
                          );
                        }

                        const member = {
                          ...memberObj,
                          image:
                            memberObj.imageUrl && memberObj.imageUrl !== 'placeholder'
                              ? { uri: memberObj.imageUrl }
                              : (legionImages[memberObj.name]?.images?.[0]?.uri ||
                                require('../../assets/Armor/PlaceHolder.jpg')),

                          // ⭐ pass full image array into the member object
                          images:
                            legionImages[memberObj.name]?.images ||
                            memberObj.images ||
                            [],

                          clickable:
                            memberObj.clickable !== undefined
                              ? memberObj.clickable
                              : true,
                        };
                        return renderMemberCard(member);
                      })}
                    </View>
                  ))}
                </View>
              );
            })}

            {/* Admin / add friends section */}
            <LegionFriends
              collectionPath="LegionairesMembers"
              placeholderImage={require('../../assets/Armor/PlaceHolder.jpg')}
              hero={members}
              setHero={setMembers}
              hardcodedHero={memberCategories}
              editingHero={editingMember}
              setEditingHero={setEditingMember}
              onDelete={m =>
                m?.id && setDeleteModal({ visible: true, member: m })
              }
            />
          </ScrollView>

          {/* 🔵 LORE OVERLAY — ON TOP OF EVERYTHING */}
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
                  <Text style={styles.infoTitle}>Legionnaires</Text>
                  <TouchableOpacity
                    onPress={toggleInfo}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Text style={styles.infoClose}>✕</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.infoText}>
                  The Legionnaires are the Parliament&apos;s extended shield —
                  friends, classmates, mentors, and legends who chose to stand
                  between Zion City and the chaos outside its walls. They aren&apos;t
                  just backup; they are the law keepers, responders, and first
                  boots on the ground when everything goes sideways.
                </Text>

                <Text style={styles.infoLabel}>What they represent</Text>
                <Text style={styles.infoText}>
                  Loyalty, accountability, and everyday heroism. The
                  Legionnaires prove that you don&apos;t need cosmic powers or a
                  badge to matter — you just need the courage to act when
                  others freeze.
                </Text>

                <Text style={styles.infoLabel}>
                  Threats they specialize against
                </Text>
                <Text style={styles.infoText}>
                  • Street-level and major threats, crime and gang uprisings in Zion City{'\n'}
                  • Civil discourse, evacuations, and disaster response{'\n'}
                  • Coordinating with Parliament teams during incursions and crisis,
                  terror attacks, and major villain events
                </Text>
              </View>
            )}
          </Animated.View>

          {/* DELETE MODAL */}
          <Modal visible={deleteModal.visible} transparent animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  {`Delete "${deleteModal.member?.name || ''}"?`}
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalCancel}
                    onPress={() =>
                      setDeleteModal({ visible: false, member: null })
                    }
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalDelete}
                    onPress={() =>
                      deleteModal.member?.id &&
                      confirmDelete(deleteModal.member.id)
                    }
                  >
                    <Text style={styles.modalDeleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
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
    backgroundColor: 'rgba(1, 4, 15, 0.85)',
    alignItems: 'center',
  },

  /* HEADER */
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 8,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(10,25,50,0.9)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(160,210,255,0.9)',
  },
  backText: {
    fontSize: 14,
    color: '#e6f3ff',
    fontWeight: 'bold',
  },
  headerTitleWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  headerGlass: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(5,20,40,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(120,190,255,0.95)',
  },
  header: {
    fontSize: isDesktop ? 30 : 24,
    fontWeight: '900',
    color: '#e8f6ff',
    textShadowColor: '#54c3ff',
    textShadowRadius: 20,
    textAlign: 'center',
  },
  headerSub: {
    marginTop: 2,
    fontSize: isDesktop ? 12 : 10,
    color: 'rgba(205,235,255,0.9)',
    textAlign: 'center',
  },
  infoHint: {
    marginTop: 2,
    fontSize: 10,
    color: 'rgba(205,235,255,0.9)',
    textAlign: 'center',
  },
  chatButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(10,25,50,0.9)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(160,210,255,0.9)',
  },
  chatText: { fontSize: 16, color: '#e6f3ff' },

  /* MUSIC */
  musicControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  musicButton: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    backgroundColor: 'rgba(0,139,255,0.55)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#00b3ff',
    marginHorizontal: 6,
  },
  musicButtonAlt: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(190,230,255,0.6)',
    marginHorizontal: 6,
  },
  musicButtonText: {
    fontSize: 13,
    color: '#f4fbff',
    fontWeight: 'bold',
  },
  musicButtonTextAlt: {
    fontSize: 13,
    color: '#e0f4ff',
    fontWeight: 'bold',
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
    backgroundColor: 'rgba(3,10,25,0.97)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(120,190,255,0.95)',
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
    color: '#e8f6ff',
  },
  infoClose: {
    fontSize: 16,
    color: '#e8f6ff',
  },
  infoLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8fd7ff',
  },
  infoText: {
    fontSize: 12,
    color: 'rgba(225,242,255,0.98)',
    marginTop: 2,
    lineHeight: 16,
  },

  /* CONTENT */
  scrollContainer: {
    paddingBottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  categorySection: {
    marginBottom: verticalSpacing * 2,
    width: '100%',
  },
  categoryHeader: {
    fontSize: 22,
    fontWeight: '700',
    color: '#e6f3ff',
    textAlign: 'center',
    marginBottom: 6,
    textShadowColor: '#00b3ff',
    textShadowRadius: 16,
  },
  divider: {
    height: 2,
    backgroundColor: 'rgba(120,190,255,0.9)',
    marginHorizontal: 30,
    marginBottom: 10,
    borderRadius: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },

  /* CARDS */
  cardContainer: { alignItems: 'center', marginBottom: verticalSpacing },
  card: {
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: 'rgba(2, 8, 20, 0.95)',
    borderWidth: 2,
    borderColor: '#00b3ff',
    shadowColor: '#00b3ff',
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 10,
  },
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
    padding: 4,
  },
  name: {
    color: '#f5fbff',
    textShadowColor: '#00b3ff',
    textShadowRadius: 12,
    zIndex: 2,
  },
  codename: {
    fontWeight: 'bold',
    color: '#88ddff',
    textShadowColor: '#00b3ff',
    textShadowRadius: 14,
    zIndex: 2,
  },

  // Desktop: stacked neatly
  nameDesktop: {
    fontSize: 12,
    marginBottom: 2,
  },
  codenameDesktop: {
    fontSize: 14,
  },

  // Mobile: wraps cleanly, no overlap
  nameMobile: {
    fontSize: 11,
    marginBottom: 2,
  },
  codenameMobile: {
    fontSize: 12,
    lineHeight: 16,
  },

  disabledCard: { opacity: 0.6 },
  cardSpacer: {
    width: cardSize,
    height: cardSize * cardHeightMultiplier,
    marginHorizontal: horizontalSpacing / 2,
  },

  // Admin buttons
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
    width: cardSize,
  },
  editButton: {
    backgroundColor: '#3b82f6',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    width: '45%',
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
    width: '45%',
  },
  buttonText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },

  // Delete modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(240,248,255,0.98)',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    color: '#02203a',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  modalCancel: {
    backgroundColor: '#2563eb',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 10,
  },
  modalCancelText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalDelete: {
    backgroundColor: '#b91c1c',
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 10,
  },
  modalDeleteText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LegionairesScreen;
