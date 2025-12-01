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
import DarkLords from './DarkLords';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;

// Statues data with images & respective screens
const hardcodedStatues = [
  {
    id: 'statue-1',
    name: 'Weeping Angel',
    screen: '',
    image: require('../../../assets/BackGround/Statue.jpg'),
    clickable: true,
    borderColor: '#c0c0c0',
    hardcoded: true,
    showSummonPopup: true,
    description: 'A quantum-locked statue that moves when unseen.',
    collectionPath: 'statues',
  },
];

// Card dimensions for desktop and mobile
const cardSizes = {
  desktop: { width: 400, height: 600 },
  mobile: { width: 350, height: 500 },
};
const horizontalSpacing = isDesktop ? 40 : 20;
const verticalSpacing = isDesktop ? 50 : 20;

// Permissions
const ALLOWED_EMAILS = [
  'will@test.com',
  'c1wcummings@gmail.com',
  'samuelp.woodwell@gmail.com',
];
const RESTRICT_ACCESS = true;

const StatuesScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStatue, setSelectedStatue] = useState(null);
  const [currentSound, setCurrentSound] = useState(null);
  const [friend, setFriend] = useState(hardcodedStatues);
  const [deleteModal, setDeleteModal] = useState({ visible: false, statue: null });
  const [previewStatue, setPreviewStatue] = useState(null);
  const [editingFriend, setEditingFriend] = useState(null);

  const canMod = RESTRICT_ACCESS
    ? auth.currentUser?.email && ALLOWED_EMAILS.includes(auth.currentUser.email)
    : true;

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      if (currentSound) {
        currentSound.stopAsync().catch((e) =>
          console.error('Audio stop error:', e.message)
        );
        currentSound.unloadAsync().catch((e) =>
          console.error('Audio unload error:', e.message)
        );
      }
    };
  }, [currentSound]);

  // Fetch dynamic statues from Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'statues'),
      (snap) => {
        if (snap.empty) {
          console.log('No statues found in Firestore');
          setFriend(hardcodedStatues);
          return;
        }

        const dynamicStatues = snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
          clickable: true,
          borderColor: docSnap.data().borderColor || '#c0c0c0',
          hardcoded: false,
          showSummonPopup: docSnap.data().showSummonPopup || false,
          collectionPath: 'statues',
        }));

        const idCounts = {};
        const nameCounts = {};
        dynamicStatues.forEach((s) => {
          idCounts[s.id] = (idCounts[s.id] || 0) + 1;
          nameCounts[s.name || s.codename || 'Unknown'] =
            (nameCounts[s.name || s.codename || 'Unknown'] || 0) + 1;
        });
        Object.entries(idCounts).forEach(([id, count]) => {
          if (count > 1)
            console.warn(`Duplicate Firestore ID: ${id}, count: ${count}`);
        });
        Object.entries(nameCounts).forEach(([name, count]) => {
          if (count > 1)
            console.warn(`Duplicate Firestore name: ${name}, count: ${count}`);
        });

        // Filter out dynamic statues that match hardcodedStatues by id or name
        const filteredDynamic = dynamicStatues.filter(
          (dynamic) =>
            !hardcodedStatues.some(
              (statue) =>
                statue.id === dynamic.id ||
                statue.name === (dynamic.name || dynamic.codename)
            )
        );

        // Combine and deduplicate by id
        const combinedMap = new Map();
        [...hardcodedStatues, ...filteredDynamic].forEach((statue) => {
          combinedMap.set(statue.id, statue);
        });
        const combined = Array.from(combinedMap.values());
        setFriend(combined);
      },
      (e) => {
        console.error('Firestore error:', e.code, e.message);
        Alert.alert('Error', `Failed to fetch statues: ${e.message}`);
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
      console.log(`Playing audio for ${screen || 'statue'}`);
      if (screen) {
        setTimeout(() => {
          console.log(`Navigating to ${screen}`);
          navigation.navigate(screen);
        }, 3000);
      }
    } catch (error) {
      console.error('Audio error:', error.message);
      Alert.alert('Error', 'Failed to play audio: ' + error.message);
    }
  };

  const handlePress = async (statue) => {
    console.log('Card pressed:', {
      id: statue.id,
      name: statue.name || statue.codename,
      hardcoded: statue.hardcoded,
    });
    try {
      const statueName = statue.name || statue.codename || 'Unknown';
      if (statue.audio) {
        console.log('Playing audio for:', statueName);
        await playDemonSound(statue.audio, statue.screen);
      } else if (statue.screen) {
        console.log(`Navigating to ${statue.screen}`);
        navigation.navigate(statue.screen);
      } else if (statue.showSummonPopup) {
        console.log('Showing summon popup for:', statueName);
        setSelectedStatue(statue);
        setModalVisible(true);
      } else {
        console.log('Opening preview for statue:', statueName);
        setPreviewStatue(statue);
      }
    } catch (error) {
      console.error('Handle press error:', error.message);
      Alert.alert('Error', 'Failed to handle press: ' + error.message);
    }
  };

  const confirmDelete = async (id) => {
    if (!auth.currentUser || !ALLOWED_EMAILS.includes(auth.currentUser.email)) {
      Alert.alert('Access Denied', 'Only authorized users can delete statues.');
      return;
    }
    try {
      const statueItem = friend.find((s) => s.id === id);
      if (statueItem?.hardcoded) {
        Alert.alert('Error', 'Cannot delete hardcoded statues!');
        return;
      }
      const statueRef = doc(db, 'statues', id);
      const snap = await getDoc(statueRef);
      if (!snap.exists()) {
        Alert.alert('Error', 'Statue not found');
        return;
      }
      const { imageUrl } = snap.data();
      if (imageUrl && imageUrl !== 'placeholder') {
        let path = '';
        try {
          console.log('Raw imageUrl:', imageUrl);
          if (typeof imageUrl !== 'string' || !imageUrl.includes('/o/')) {
            console.warn('Invalid imageUrl format:', imageUrl);
          } else {
            const urlParts = imageUrl.split('/o/');
            path = decodeURIComponent(urlParts[1].split('?')[0]);
            console.log('Attempting to delete image:', path);
            await deleteObject(ref(storage, path)).catch((e) => {
              if (e.code !== 'storage/object-not-found') {
                throw e; // Rethrow errors except "not found"
              }
              console.warn('Image not found in storage:', path);
            });
            console.log('Image deleted or not found:', path);
          }
        } catch (e) {
          console.error(
            'Delete image error:',
            e.message,
            'Path:',
            path,
            'URL:',
            imageUrl
          );
          Alert.alert(
            'Warning',
            `Failed to delete image from storage: ${e.message}. Statue will still be deleted.`
          );
        }
      } else {
        console.log('No image to delete or imageUrl is placeholder:', imageUrl);
      }
      await deleteDoc(statueRef);
      console.log('Statue deleted from Firestore:', id);
      setFriend(friend.filter((s) => s.id !== id));
      setDeleteModal({ visible: false, statue: null });
      Alert.alert('Success', 'Statue deleted successfully!');
    } catch (e) {
      console.error('Delete statue error:', e.message);
      Alert.alert('Error', `Failed to delete statue: ${e.message}`);
    }
  };

  const renderStatueCard = (statue) => (
    <View key={statue.id} style={styles.statueCont}>
      <TouchableOpacity
        style={[
          styles.statueCard,
          {
            width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
            height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height,
          },
          statue.clickable
            ? styles.clickable(statue.borderColor)
            : styles.notClickable,
        ]}
        onPress={() => handlePress(statue)}
        disabled={!statue.clickable}
        activeOpacity={0.9}
      >
        <Image
          source={
            statue.image ||
            (statue.imageUrl && statue.imageUrl !== 'placeholder'
              ? { uri: statue.imageUrl }
              : require('../../../assets/BackGround/Statue.jpg'))
          }
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.cardOverlay} />
        <Text style={styles.name}>
          {statue.name || statue.codename || 'Unknown'}
        </Text>
        {!statue.clickable && (
          <Text style={styles.disabledText}>Not Clickable</Text>
        )}
      </TouchableOpacity>
      {statue.hardcoded === false && (
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => setEditingFriend(statue)}
            style={[styles.edit, !canMod && styles.disabled]}
            disabled={!canMod}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setDeleteModal({
                visible: true,
                statue: {
                  id: statue.id,
                  name: statue.name || statue.codename || 'Unknown',
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

  const renderPreviewCard = (statue) => (
    <TouchableOpacity
      style={[
        styles.previewCard(isDesktop, SCREEN_WIDTH),
        styles.clickable(statue.borderColor || '#c0c0c0'),
      ]}
      onPress={() => setPreviewStatue(null)}
      activeOpacity={0.9}
    >
      <Image
        source={
          statue.image ||
          (statue.imageUrl && statue.imageUrl !== 'placeholder'
            ? { uri: statue.imageUrl }
            : require('../../../assets/BackGround/Statue.jpg'))
        }
        style={styles.previewImage}
        resizeMode="cover"
      />
      <View style={styles.cardOverlay} />
      <Text style={styles.cardName}>
        © {statue.name || statue.codename || 'Unknown'}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../../assets/BackGround/Statue.jpg')}
      style={styles.background}
    >
      {/* Dim + glass overlay */}
      <View style={styles.screenDimOverlay}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => {
              console.log('Navigating back');
              navigation.goBack();
            }}
            style={styles.iconButton}
          >
            <Text style={styles.iconButtonText}>⬅️</Text>
          </TouchableOpacity>

          <View style={styles.titleBlock}>
            <Text style={styles.titleLabel}>Origin • The Maw</Text>
            <TouchableOpacity
              onPress={() => {
                console.log('Navigating to StatuesTab');
                navigation.navigate('StatuesTab');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.header}>Statues</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.rightSpacer} />
        </View>

        {/* Main scroll */}
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Horizontal cards */}
          <View style={styles.scrollWrapper}>
            <ScrollView
              horizontal
              contentContainerStyle={styles.scrollContainer}
              showsHorizontalScrollIndicator={false}
            >
              {friend.length > 0 ? (
                friend.map(renderStatueCard)
              ) : (
                <Text style={styles.noStatuesText}>No statues available</Text>
              )}
            </ScrollView>
          </View>

          {/* Glass section for DarkLords form */}
          <View style={styles.glassSection}>
            <Text style={styles.sectionTitle}>Summon & Manage</Text>
            <View style={styles.sectionLine} />
            <DarkLords
              collectionPath="statues"
              placeholderImage={require('../../../assets/BackGround/Statue.jpg')}
              friend={friend}
              setFriend={setFriend}
              hardcodedFriend={hardcodedStatues}
              editingFriend={editingFriend}
              setEditingFriend={setEditingFriend}
            />
          </View>
        </ScrollView>

        {/* Preview Modal */}
        <Modal
          visible={!!previewStatue}
          transparent
          animationType="fade"
          onRequestClose={() => {
            console.log('Closing preview modal');
            setPreviewStatue(null);
          }}
        >
          <View style={styles.modalBackground}>
            <TouchableOpacity
              style={styles.modalOuterContainer}
              activeOpacity={1}
              onPress={() => setPreviewStatue(null)}
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
                    {previewStatue && renderPreviewCard(previewStatue)}
                  </ScrollView>
                </View>
                <View style={styles.previewAboutSection}>
                  <Text style={styles.previewName}>
                    {previewStatue?.name ||
                      previewStatue?.codename ||
                      'Unknown'}
                  </Text>
                  <Text style={styles.previewDesc}>
                    {previewStatue?.description || 'No description available'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setPreviewStatue(null)}
                    style={styles.close}
                  >
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* Delete Modal */}
        <Modal
          visible={deleteModal.visible}
          transparent
          animationType="fade"
          onRequestClose={() =>
            setDeleteModal({ visible: false, statue: null })
          }
        >
          <View style={styles.modalOverlay}>
            <View style={styles.deleteGlass}>
              <Text style={styles.modalText}>
                {`Delete "${deleteModal.statue?.name || ''}" and its image?`}
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() =>
                    setDeleteModal({ visible: false, statue: null })
                  }
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalDelete}
                  onPress={() =>
                    deleteModal.statue &&
                    confirmDelete(deleteModal.statue.id)
                  }
                >
                  <Text style={styles.modalDeleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Summon Modal */}
        <Modal
          transparent
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => {
            console.log('Closing summon modal');
            setModalVisible(false);
            setSelectedStatue(null);
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              console.log('Closing summon modal via background tap');
              setModalVisible(false);
              setSelectedStatue(null);
            }}
          >
            <View style={styles.summonModalContainer}>
              <View style={styles.summonGlass}>
                <Text style={styles.summonModalText}>
                  👁 You have summoned:{' '}
                  <Text style={styles.summonNameText}>
                    {selectedStatue?.name ||
                      selectedStatue?.codename ||
                      'Unknown'}
                  </Text>{' '}
                  👁
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

  // Main dim overlay
  screenDimOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
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
  iconButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  titleBlock: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  titleLabel: {
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.7)',
  },
  header: {
    fontSize: isDesktop ? 30 : 24,
    fontWeight: '900',
    color: '#d2d2ff',
    textAlign: 'center',
    textShadowColor: 'rgba(210,210,255,0.9)',
    textShadowRadius: 14,
    textShadowOffset: { width: 0, height: 0 },
  },
  rightSpacer: {
    width: 40,
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

  // STATUE CARDS
  statueCont: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  statueCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(10, 10, 15, 0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
  },
  clickable: (borderColor) => ({
    borderColor: borderColor || 'rgba(220,220,220,0.95)',
    shadowColor: borderColor || '#e0e0e0',
  }),
  notClickable: {
    opacity: 0.65,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  name: {
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
  noStatuesText: {
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

  // GLASS SECTION
  glassSection: {
    marginTop: 10,
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(15, 15, 20, 0.8)',
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
    backgroundColor: 'rgba(210,210,255,0.65)',
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
    backgroundColor: 'rgba(10,10,15,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: 'rgba(0,0,0,0.85)',
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
    resizeMode: 'cover',
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
    backgroundColor: 'rgba(15,15,20,0.9)',
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
    backgroundColor: 'rgba(15,15,20,0.96)',
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
    backgroundColor: 'rgba(5,5,10,0.95)',
    padding: 22,
    borderRadius: 20,
    width: '80%',
    borderWidth: 1,
    borderColor: 'rgba(210,210,255,0.6)',
  },
  summonModalText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    textShadowColor: '#d2d2ff',
    textShadowRadius: 15,
  },
  summonNameText: {
    color: '#f0f0ff',
    fontWeight: 'bold',
  },
});

export default StatuesScreen;
