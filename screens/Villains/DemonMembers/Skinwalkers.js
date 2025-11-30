import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  ImageBackground,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { db, auth, storage } from '../../../lib/firebase';
import { collection, onSnapshot, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { demonLords } from './DemonData';
import DarkLords from './DarkLords';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;

// Card dimensions for desktop and mobile
const cardSizes = {
  desktop: { width: 400, height: 600 },
  mobile: { width: 320, height: 480 },
};
const horizontalSpacing = isDesktop ? 40 : 16;
const verticalSpacing = isDesktop ? 40 : 16;

// Permissions
const ALLOWED_EMAILS = ["will@test.com", "c1wcummings@gmail.com", "samuelp.woodwell@gmail.com"];
const RESTRICT_ACCESS = true;

const SkinwalkersScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDemon, setSelectedDemon] = useState(null);
  const [currentSound, setCurrentSound] = useState(null);
  const [friend, setFriend] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ visible: false, skinwalker: null });
  const [previewSkinwalker, setPreviewSkinwalker] = useState(null);
  const [editingFriend, setEditingFriend] = useState(null);
  const canMod = RESTRICT_ACCESS ? auth.currentUser?.email && ALLOWED_EMAILS.includes(auth.currentUser.email) : true;

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      if (currentSound) {
        currentSound.stopAsync().catch(e => console.error('Audio stop error:', e.message));
        currentSound.unloadAsync().catch(e => console.error('Audio unload error:', e.message));
      }
    };
  }, [currentSound]);

  // Fetch dynamic skinwalkers from Firestore
  useEffect(() => {
    const validatedDemonLords = demonLords.map((lord, index) => ({
      ...lord,
      id: lord.id || `hardcoded-${index + 1}`,
      hardcoded: true,
      showSummonPopup: lord.showSummonPopup !== undefined ? lord.showSummonPopup : true,
      collectionPath: 'skinwalkers',
    }));
    setFriend(validatedDemonLords);

    const unsub = onSnapshot(
      collection(db, 'skinwalkers'),
      (snap) => {
        if (snap.empty) {
          setFriend(validatedDemonLords);
          return;
        }

        const dynamicSkinwalkers = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          clickable: true,
          borderColor: d.data().borderColor || '#e25822',
          hardcoded: false,
          showSummonPopup: d.data().showSummonPopup || false,
          collectionPath: 'skinwalkers',
        }));

        const filteredDynamic = dynamicSkinwalkers.filter(
          (dynamic) =>
            !validatedDemonLords.some(
              (lord) => lord.id === dynamic.id || lord.name === (dynamic.name || dynamic.codename)
            )
        );

        const combinedMap = new Map();
        [...validatedDemonLords, ...filteredDynamic].forEach((skinwalker) => {
          combinedMap.set(skinwalker.id, skinwalker);
        });
        const combined = Array.from(combinedMap.values());
        setFriend(combined);
      },
      (e) => {
        console.error('Firestore error:', e.code, e.message);
        Alert.alert('Error', `Failed to fetch skinwalkers: ${e.message}`);
      }
    );

    return () => unsub();
  }, []);

  // Dynamic Sound Handler with Cleanup
  const playDemonSound = async (audio, screen) => {
    try {
      if (currentSound) {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(audio);
      setCurrentSound(sound);
      await sound.playAsync();

      if (screen) {
        setTimeout(() => {
          navigation.navigate(screen);
        }, 3000);
      }
    } catch (error) {
      console.error('Audio error:', error.message);
      Alert.alert('Error', 'Failed to play audio: ' + error.message);
    }
  };

  const handlePress = async (skinwalker) => {
    try {
      const demonName = skinwalker.name || skinwalker.codename || 'Unknown';
      setSelectedDemon(demonName);
      setModalVisible(true);

      if (skinwalker.hardcoded && skinwalker.audio && skinwalker.screen) {
        await playDemonSound(skinwalker.audio, skinwalker.screen);
      } else {
        setTimeout(() => {
          setModalVisible(false);
          setSelectedDemon(null);
          setPreviewSkinwalker(skinwalker);
        }, 2000);
      }
    } catch (error) {
      console.error('Handle press error:', error.message);
      Alert.alert('Error', 'Failed to handle press: ' + error.message);
    }
  };

  const confirmDelete = async (id) => {
    if (!auth.currentUser || !ALLOWED_EMAILS.includes(auth.currentUser.email)) {
      Alert.alert('Access Denied', 'Only authorized users can delete skinwalkers.');
      return;
    }
    try {
      const skinwalkerItem = friend.find(s => s.id === id);
      if (skinwalkerItem.hardcoded) {
        Alert.alert('Error', 'Cannot delete hardcoded skinwalkers!');
        return;
      }

      const skinwalkerRef = doc(db, 'skinwalkers', id);
      const snap = await getDoc(skinwalkerRef);
      if (!snap.exists()) {
        Alert.alert('Error', 'Skinwalker not found');
        return;
      }

      const { imageUrl } = snap.data();
      if (imageUrl && imageUrl !== 'placeholder') {
        let path = '';
        try {
          if (typeof imageUrl === 'string' && imageUrl.includes('/o/')) {
            const urlParts = imageUrl.split('/o/');
            path = decodeURIComponent(urlParts[1].split('?')[0]);
            await deleteObject(ref(storage, path)).catch(e => {
              if (e.code !== 'storage/object-not-found') {
                throw e;
              }
            });
          }
        } catch (e) {
          console.error('Delete image error:', e.message, 'Path:', path, 'URL:', imageUrl);
          Alert.alert(
            'Warning',
            `Failed to delete image from storage: ${e.message}. Skinwalker will still be deleted.`
          );
        }
      }

      await deleteDoc(skinwalkerRef);
      setFriend(friend.filter(s => s.id !== id));
      setDeleteModal({ visible: false, skinwalker: null });
      Alert.alert('Success', 'Skinwalker deleted successfully!');
    } catch (e) {
      console.error('Delete skinwalker error:', e.message);
      Alert.alert('Error', `Failed to delete skinwalker: ${e.message}`);
    }
  };

  // Temporary test button to force summon popup
  const testSummonPopup = () => {
    setSelectedDemon('Unknown');
    setModalVisible(true);
  };

  const renderSkinwalkerCard = (skinwalker) => (
    <View key={skinwalker.id} style={styles.skinwalkerCont}>
      <TouchableOpacity
        style={[
          styles.demonCard,
          {
            width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
            height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height,
          },
          skinwalker.clickable
            ? styles.clickable(skinwalker.borderColor)
            : styles.notClickable,
        ]}
        onPress={() => handlePress(skinwalker)}
        disabled={!skinwalker.clickable}
        activeOpacity={0.9}
      >
        <Image
          source={
            skinwalker.image ||
            (skinwalker.imageUrl && skinwalker.imageUrl !== 'placeholder'
              ? { uri: skinwalker.imageUrl }
              : require('../../../assets/BackGround/Skinwalkers.jpg'))
          }
          style={styles.demonImage}
          resizeMode="cover"
        />
        <View style={styles.cardOverlay} />
        <Text style={styles.demonName}>
          {skinwalker.name || skinwalker.codename || 'Unknown'}
        </Text>
        {!skinwalker.clickable && (
          <Text style={styles.disabledText}>Not Clickable</Text>
        )}
      </TouchableOpacity>

      {skinwalker.hardcoded === false && (
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => setEditingFriend(skinwalker)}
            style={[styles.edit, !canMod && styles.disabled]}
            disabled={!canMod}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setDeleteModal({
                visible: true,
                skinwalker: {
                  id: skinwalker.id,
                  name: skinwalker.name || skinwalker.codename || 'Unknown',
                },
              })
            }
            style={[styles.delete, !canMod && styles.disabled]}
            disabled={!canMod}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderPreviewCard = (skinwalker) => (
    <TouchableOpacity
      style={[
        styles.previewCard(isDesktop, SCREEN_WIDTH),
        styles.clickable(skinwalker.borderColor || '#e25822'),
      ]}
      onPress={() => setPreviewSkinwalker(null)}
      activeOpacity={0.9}
    >
      <Image
        source={
          skinwalker.image ||
          (skinwalker.imageUrl && skinwalker.imageUrl !== 'placeholder'
            ? { uri: skinwalker.imageUrl }
            : require('../../../assets/BackGround/Skinwalkers.jpg'))
        }
        style={styles.previewImage}
        resizeMode="cover"
      />
      <View style={styles.cardOverlay} />
      <Text style={styles.cardName}>
        © {skinwalker.name || skinwalker.codename || 'Unknown'}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../../assets/BackGround/Skinwalkers.jpg')}
      style={styles.background}
    >
      <View style={styles.screenDimOverlay}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
          >
            <Text style={styles.iconButtonText}>⬅️</Text>
          </TouchableOpacity>

          <View style={styles.titleBlock}>
            <Text style={styles.titleLabel}>Demon Lords • Faction</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SkinwalkersTab')}
              activeOpacity={0.8}
            >
              <Text style={styles.header}>Skinwalkers</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={testSummonPopup}
            style={[styles.iconButton, styles.summonButton]}
          >
            <Text style={styles.iconButtonText}>🔥</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Horizontal card scroller */}
          <View style={styles.scrollWrapper}>
            <ScrollView
              horizontal
              contentContainerStyle={styles.scrollContainer}
              showsHorizontalScrollIndicator={false}
            >
              {friend.length > 0 ? (
                friend.map(renderSkinwalkerCard)
              ) : (
                <Text style={styles.noSkinwalkersText}>
                  No skinwalkers available
                </Text>
              )}
            </ScrollView>
          </View>

          {/* Form / manager */}
          <View style={styles.glassSection}>
            <Text style={styles.sectionTitle}>Summon & Manage</Text>
            <View style={styles.sectionLine} />
            <DarkLords
              collectionPath="skinwalkers"
              placeholderImage={require('../../../assets/BackGround/Skinwalkers.jpg')}
              friend={friend}
              setFriend={setFriend}
              hardcodedFriend={demonLords}
              editingFriend={editingFriend}
              setEditingFriend={setEditingFriend}
            />
          </View>
        </ScrollView>

        {/* Preview modal */}
        <Modal
          visible={!!previewSkinwalker}
          transparent
          animationType="fade"
          onRequestClose={() => setPreviewSkinwalker(null)}
        >
          <View style={styles.modalBackground}>
            <TouchableOpacity
              style={styles.modalOuterContainer}
              activeOpacity={1}
              onPress={() => setPreviewSkinwalker(null)}
            >
              <View style={styles.previewGlass}>
                <View style={styles.imageContainer}>
                  <ScrollView
                    horizontal
                    contentContainerStyle={styles.imageScrollContainer}
                    showsHorizontalScrollIndicator={false}
                    snapToAlignment="center"
                    snapToInterval={SCREEN_WIDTH * 0.7 + 20}
                    decelerationRate="fast"
                    centerContent
                  >
                    {previewSkinwalker && renderPreviewCard(previewSkinwalker)}
                  </ScrollView>
                </View>
                <View style={styles.previewAboutSection}>
                  <Text style={styles.previewName}>
                    {previewSkinwalker?.name ||
                      previewSkinwalker?.codename ||
                      'Unknown'}
                  </Text>
                  <Text style={styles.previewDesc}>
                    {previewSkinwalker?.description ||
                      'No description available.'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setPreviewSkinwalker(null)}
                    style={styles.close}
                  >
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Delete modal */}
        <Modal
          visible={deleteModal.visible}
          transparent
          animationType="fade"
          onRequestClose={() =>
            setDeleteModal({ visible: false, skinwalker: null })
          }
        >
          <View style={styles.modalOverlay}>
            <View style={styles.deleteGlass}>
              <Text style={styles.modalText}>
                {`Delete "${deleteModal.skinwalker?.name || ''}" and its image?`}
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() =>
                    setDeleteModal({ visible: false, skinwalker: null })
                  }
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalDelete}
                  onPress={() =>
                    deleteModal.skinwalker &&
                    confirmDelete(deleteModal.skinwalker.id)
                  }
                >
                  <Text style={styles.modalDeleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Summon popup */}
        <Modal
          transparent
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => {
            setModalVisible(false);
            setSelectedDemon(null);
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              setModalVisible(false);
              setSelectedDemon(null);
            }}
          >
            <View style={styles.summonModalContainer}>
              <View style={styles.summonGlass}>
                <Text style={styles.summonModalText}>
                  🔥 You have summoned:{" "}
                  <Text style={styles.summonNameText}>
                    {selectedDemon || 'Unknown'}
                  </Text>{" "}
                  🔥
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
  },

  // Main dark overlay on top of background
  screenDimOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingTop: 40,
  },

  // TOP BAR
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  iconButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  summonButton: {
    borderColor: 'rgba(241, 99, 43, 0.8)',
    backgroundColor: 'rgba(241, 99, 43, 0.12)',
  },
  iconButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  titleBlock: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  titleLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  header: {
    fontSize: isDesktop ? 30 : 24,
    fontWeight: '900',
    color: '#f1632b',
    textAlign: 'center',
    textShadowColor: 'rgba(241, 99, 43, 0.9)',
    textShadowRadius: 16,
    textShadowOffset: { width: 0, height: 0 },
  },

  // MAIN SCROLL
  scroll: {
    paddingBottom: 40,
  },
  scrollWrapper: {
    width: SCREEN_WIDTH,
    flexGrow: 0,
    marginTop: 10,
  },
  scrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: horizontalSpacing,
    paddingVertical: verticalSpacing,
    alignItems: 'center',
  },

  // CARDS
  skinwalkerCont: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  demonCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(15, 15, 15, 0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
  },
  clickable: (borderColor) => ({
    borderColor: borderColor || 'rgba(226, 88, 34, 0.8)',
    shadowColor: borderColor || '#e25822',
  }),
  notClickable: {
    opacity: 0.65,
  },
  demonImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  demonName: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    fontSize: 18,
    color: 'white',
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowRadius: 8,
  },
  disabledText: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 11,
    color: 'rgba(255, 255, 0, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },

  noSkinwalkersText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    padding: 20,
  },

  // EDIT / DELETE BUTTONS
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
    marginTop: 10,
    paddingHorizontal: 4,
  },
  edit: {
    backgroundColor: 'rgba(89, 19, 188, 0.9)',
    padding: 8,
    borderRadius: 999,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  delete: {
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
    padding: 8,
    borderRadius: 999,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#555',
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // GLASS SECTION FOR DARKLORDS FORM
  glassSection: {
    marginTop: 10,
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(15, 15, 15, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 4,
  },
  sectionLine: {
    height: 1,
    backgroundColor: 'rgba(241, 99, 43, 0.6)',
    width: '40%',
    alignSelf: 'center',
    marginBottom: 8,
  },

  // PREVIEW MODAL
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOuterContainer: {
    width: '92%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewGlass: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backgroundColor: 'rgba(10,10,10,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
  },
  imageScrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewCard: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.28 : SCREEN_WIDTH * 0.8,
    height: isDesktop ? SCREEN_HEIGHT * 0.62 : SCREEN_HEIGHT * 0.6,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.75)',
    marginRight: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  }),
  previewImage: {
    width: '100%',
    height: '100%',
  },
  cardName: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowRadius: 8,
  },
  previewAboutSection: {
    marginTop: 10,
    padding: 12,
    backgroundColor: 'rgba(15,15,15,0.9)',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  previewName: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
  previewDesc: {
    fontSize: 14,
    color: '#f5eaea',
    textAlign: 'center',
    marginVertical: 10,
  },
  close: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 999,
    alignSelf: 'center',
    marginTop: 4,
  },

  // DELETE MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteGlass: {
    backgroundColor: 'rgba(20,20,20,0.95)',
    padding: 20,
    borderRadius: 18,
    alignItems: 'center',
    width: '85%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  modalText: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  modalCancel: {
    backgroundColor: 'rgba(33,150,243,0.9)',
    padding: 10,
    borderRadius: 999,
    flex: 1,
    marginRight: 10,
  },
  modalCancelText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalDelete: {
    backgroundColor: 'rgba(244,67,54,0.95)',
    padding: 10,
    borderRadius: 999,
    flex: 1,
    marginLeft: 10,
  },
  modalDeleteText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // SUMMON MODAL
  summonModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
  },
  summonGlass: {
    backgroundColor: 'rgba(0,0,0,0.95)',
    padding: 22,
    borderRadius: 20,
    width: '80%',
    borderWidth: 1,
    borderColor: 'rgba(241,99,43,0.6)',
  },
  summonModalText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    textShadowColor: '#e25822',
    textShadowRadius: 15,
  },
  summonNameText: {
    color: '#ffb36b',
    fontWeight: 'bold',
  },
});

export default SkinwalkersScreen;
