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

// Layout settings
const isDesktop = SCREEN_WIDTH > 600;

// Aliens data with images & respective screens
const hardcodedAliens = [
  {
    id: 'alien-1',
    name: 'Zorath',
    screen: '',
    image: require('../../../assets/BackGround/Aliens.jpg'),
    clickable: true,
    borderColor: '#c0c0c0',
    hardcoded: true,
    showSummonPopup: true,
    description: 'An extraterrestrial warlord from a distant galaxy.',
    collectionPath: 'aliens',
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
const ALLOWED_EMAILS = ['will@test.com', 'c1wcummings@gmail.com', 'samuelp.woodwell@gmail.com'];
const RESTRICT_ACCESS = true;

const AliensScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAlien, setSelectedAlien] = useState(null);
  const [currentSound, setCurrentSound] = useState(null);
  const [friend, setFriend] = useState(hardcodedAliens);
  const [deleteModal, setDeleteModal] = useState({ visible: false, alien: null });
  const [previewAlien, setPreviewAlien] = useState(null);
  const [editingFriend, setEditingFriend] = useState(null);

  const canMod = RESTRICT_ACCESS
    ? auth.currentUser?.email && ALLOWED_EMAILS.includes(auth.currentUser.email)
    : true;

  // Cleanup audio on component unmount
  useEffect(() => {
    return () => {
      if (currentSound) {
        currentSound.stopAsync().catch((e) => console.error('Audio stop error:', e.message));
        currentSound.unloadAsync().catch((e) => console.error('Audio unload error:', e.message));
      }
    };
  }, [currentSound]);

  // Fetch dynamic aliens from Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'aliens'),
      (snap) => {
        if (snap.empty) {
          console.log('No aliens found in Firestore');
          setFriend(hardcodedAliens);
          return;
        }

        const dynamicAliens = snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
          clickable: true,
          borderColor: docSnap.data().borderColor || '#c0c0c0',
          hardcoded: false,
          showSummonPopup: docSnap.data().showSummonPopup || false,
          collectionPath: 'aliens',
        }));

        const idCounts = {};
        const nameCounts = {};
        dynamicAliens.forEach((a) => {
          idCounts[a.id] = (idCounts[a.id] || 0) + 1;
          nameCounts[a.name || a.codename || 'Unknown'] =
            (nameCounts[a.name || a.codename || 'Unknown'] || 0) + 1;
        });
        Object.entries(idCounts).forEach(([id, count]) => {
          if (count > 1) console.warn(`Duplicate Firestore ID: ${id}, count: ${count}`);
        });
        Object.entries(nameCounts).forEach(([name, count]) => {
          if (count > 1) console.warn(`Duplicate Firestore name: ${name}, count: ${count}`);
        });

        // Filter out dynamic aliens that match hardcodedAliens by id or name
        const filteredDynamic = dynamicAliens.filter(
          (dynamic) =>
            !hardcodedAliens.some(
              (alien) =>
                alien.id === dynamic.id ||
                alien.name === (dynamic.name || dynamic.codename)
            )
        );

        // Combine and deduplicate by id
        const combinedMap = new Map();
        [...hardcodedAliens, ...filteredDynamic].forEach((alien) => {
          combinedMap.set(alien.id, alien);
        });
        const combined = Array.from(combinedMap.values());
        setFriend(combined);
      },
      (e) => {
        console.error('Firestore error:', e.code, e.message);
        Alert.alert('Error', `Failed to fetch aliens: ${e.message}`);
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
      console.log(`Playing audio for ${screen || 'alien'}`);
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

  const handlePress = async (alien) => {
    console.log('Card pressed:', {
      id: alien.id,
      name: alien.name || alien.codename,
      hardcoded: alien.hardcoded,
    });
    try {
      const alienName = alien.name || alien.codename || 'Unknown';
      if (alien.audio) {
        console.log('Playing audio for:', alienName);
        await playDemonSound(alien.audio, alien.screen);
      } else if (alien.screen) {
        console.log(`Navigating to ${alien.screen}`);
        navigation.navigate(alien.screen);
      } else if (alien.showSummonPopup) {
        console.log('Showing summon popup for:', alienName);
        setSelectedAlien(alien);
        setModalVisible(true);
      } else {
        console.log('Opening preview for alien:', alienName);
        setPreviewAlien(alien);
      }
    } catch (error) {
      console.error('Handle press error:', error.message);
      Alert.alert('Error', 'Failed to handle press: ' + error.message);
    }
  };

  const confirmDelete = async (id) => {
    if (!auth.currentUser || !ALLOWED_EMAILS.includes(auth.currentUser.email)) {
      Alert.alert('Access Denied', 'Only authorized users can delete aliens.');
      return;
    }
    try {
      const alienItem = friend.find((a) => a.id === id);
      if (alienItem?.hardcoded) {
        Alert.alert('Error', 'Cannot delete hardcoded aliens!');
        return;
      }
      const alienRef = doc(db, 'aliens', id);
      const snap = await getDoc(alienRef);
      if (!snap.exists()) {
        Alert.alert('Error', 'Alien not found');
        return;
      }
      const { imageUrl } = snap.data();
      if (imageUrl && imageUrl !== 'placeholder') {
        let path = '';
        try {
          console.log('Raw imageUrl:', imageUrl); // Debug raw URL
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
          console.error('Delete image error:', e.message, 'Path:', path, 'URL:', imageUrl);
          Alert.alert(
            'Warning',
            `Failed to delete image from storage: ${e.message}. Alien will still be deleted.`
          );
        }
      } else {
        console.log('No image to delete or imageUrl is placeholder:', imageUrl);
      }
      await deleteDoc(alienRef);
      console.log('Alien deleted from Firestore:', id);
      setFriend(friend.filter((a) => a.id !== id));
      setDeleteModal({ visible: false, alien: null });
      Alert.alert('Success', 'Alien deleted successfully!');
    } catch (e) {
      console.error('Delete alien error:', e.message);
      Alert.alert('Error', `Failed to delete alien: ${e.message}`);
    }
  };

  const renderAlienCard = (alien) => {
    const imageSource =
      alien.image ||
      (alien.imageUrl && alien.imageUrl !== 'placeholder'
        ? { uri: alien.imageUrl }
        : require('../../../assets/BackGround/Aliens.jpg'));

    console.log('Rendering alien card:', {
      id: alien.id,
      name: alien.name || alien.codename,
      imageSource: JSON.stringify(imageSource),
    });

    return (
      <View key={alien.id} style={styles.alienCont}>
        <TouchableOpacity
          style={[
            styles.alienCard,
            {
              width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
              height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height,
            },
            alien.clickable ? styles.clickable(alien.borderColor) : styles.notClickable,
          ]}
          onPress={() => handlePress(alien)}
          disabled={!alien.clickable}
          activeOpacity={0.9}
        >
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.cardOverlay} />
          <Text style={styles.name}>{alien.name || alien.codename || 'Unknown'}</Text>
          {!alien.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
        </TouchableOpacity>
        {alien.hardcoded === false && (
          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={() => setEditingFriend(alien)}
              style={[styles.edit, !canMod && styles.disabled]}
              disabled={!canMod}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setDeleteModal({
                  visible: true,
                  alien: { id: alien.id, name: alien.name || alien.codename || 'Unknown' },
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
  };

  const renderPreviewCard = (alien) => (
    <TouchableOpacity
      style={[
        styles.previewCard(isDesktop, SCREEN_WIDTH),
        styles.clickable(alien.borderColor || '#c0c0c0'),
      ]}
      onPress={() => {
        console.log('Closing preview modal');
        setPreviewAlien(null);
      }}
      activeOpacity={0.9}
    >
      <Image
        source={
          alien.image ||
          (alien.imageUrl && alien.imageUrl !== 'placeholder'
            ? { uri: alien.imageUrl }
            : require('../../../assets/BackGround/Aliens.jpg'))
        }
        style={styles.previewImage}
        resizeMode="cover"
      />
      <View style={styles.cardOverlay} />
      <Text style={styles.cardName}>
        © {alien.name || alien.codename || 'Unknown'}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../../assets/BackGround/Aliens.jpg')}
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
            <Text style={styles.titleLabel}>Demon Lords • Aliens</Text>
            <TouchableOpacity
              onPress={() => {
                console.log('Navigating to AliensTab');
                navigation.navigate('AliensTab');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.header}>Aliens</Text>
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
                friend.map(renderAlienCard)
              ) : (
                <Text style={styles.noAliensText}>No aliens available</Text>
              )}
            </ScrollView>
          </View>

          {/* Glass section for DarkLords form */}
          <View style={styles.glassSection}>
            <Text style={styles.sectionTitle}>Summon & Manage</Text>
            <View style={styles.sectionLine} />
            <DarkLords
              collectionPath="aliens"
              placeholderImage={require('../../../assets/BackGround/Aliens.jpg')}
              friend={friend}
              setFriend={setFriend}
              hardcodedFriend={hardcodedAliens}
              editingFriend={editingFriend}
              setEditingFriend={setEditingFriend}
            />
          </View>
        </ScrollView>

        {/* Preview Modal */}
        <Modal
          visible={!!previewAlien}
          transparent
          animationType="fade"
          onRequestClose={() => {
            console.log('Closing preview modal');
            setPreviewAlien(null);
          }}
        >
          <View style={styles.modalBackground}>
            <TouchableOpacity
              style={styles.modalOuterContainer}
              activeOpacity={1}
              onPress={() => {
                console.log('Closing preview modal');
                setPreviewAlien(null);
              }}
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
                    centerContent={true}
                  >
                    {previewAlien && renderPreviewCard(previewAlien)}
                  </ScrollView>
                </View>
                <View style={styles.previewAboutSection}>
                  <Text style={styles.previewName}>
                    {previewAlien?.name || previewAlien?.codename || 'Unknown'}
                  </Text>
                  <Text style={styles.previewDesc}>
                    {previewAlien?.description || 'No description available'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('Closing preview modal');
                      setPreviewAlien(null);
                    }}
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
          onRequestClose={() => setDeleteModal({ visible: false, alien: null })}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.deleteGlass}>
              <Text style={styles.modalText}>
                {`Delete "${deleteModal.alien?.name || ''}" and its image?`}
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() => setDeleteModal({ visible: false, alien: null })}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalDelete}
                  onPress={() =>
                    deleteModal.alien && confirmDelete(deleteModal.alien.id)
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
          transparent={true}
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => {
            console.log('Closing summon modal');
            setModalVisible(false);
            setSelectedAlien(null);
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              console.log('Closing summon modal via background tap');
              setModalVisible(false);
              setSelectedAlien(null);
            }}
          >
            <View style={styles.summonModalContainer}>
              <View style={styles.summonGlass}>
                <Text style={styles.summonModalText}>
                  🔥 You have summoned:{' '}
                  <Text style={styles.summonNameText}>
                    {selectedAlien?.name || selectedAlien?.codename || 'Unknown'}
                  </Text>{' '}
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

  // Main dim overlay
  screenDimOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
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
    color: 'rgba(200,255,255,0.7)',
  },
  header: {
    fontSize: isDesktop ? 30 : 24,
    fontWeight: '900',
    color: '#8cf0ff',
    textAlign: 'center',
    textShadowColor: 'rgba(140, 240, 255, 0.9)',
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

  // ALIEN CARDS
  alienCont: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  alienCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(3, 10, 20, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(180, 220, 255, 0.4)',
    shadowColor: '#000',
    shadowOpacity: 0.65,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
  },
  clickable: (borderColor) => ({
    borderColor: borderColor || 'rgba(180, 220, 255, 0.9)',
    shadowColor: borderColor || '#8cf0ff',
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
    backgroundColor: 'rgba(0, 10, 25, 0.35)',
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
  noAliensText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    padding: 20,
  },

  // EDIT / DELETE BUTTONS
  buttons: {
    flexDirection: 'row',
    justifyContent: 'spaceBetween',
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
    backgroundColor: 'rgba(3, 8, 18, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(180,220,255,0.4)',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(220, 245, 255, 0.95)',
    textAlign: 'center',
    marginBottom: 4,
  },
  sectionLine: {
    height: 1,
    backgroundColor: 'rgba(140, 240, 255, 0.8)',
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
    backgroundColor: 'rgba(3,8,18,0.96)',
    borderWidth: 1,
    borderColor: 'rgba(180, 220, 255, 0.5)',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: 'rgba(0,0,0,0.9)',
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
    borderColor: 'rgba(180,220,255,0.4)',
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
    backgroundColor: 'rgba(5,15,30,0.95)',
    borderTopWidth: 1,
    borderColor: 'rgba(180,220,255,0.35)',
  },
  previewName: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
  previewDesc: {
    fontSize: 14,
    color: '#e6f7ff',
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
    backgroundColor: 'rgba(5,15,30,0.96)',
    padding: 20,
    borderRadius: 18,
    alignItems: 'center',
    width: '85%',
    borderWidth: 1,
    borderColor: 'rgba(180,220,255,0.4)',
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
    backgroundColor: 'rgba(5,15,30,0.96)',
    padding: 22,
    borderRadius: 20,
    width: '80%',
    borderWidth: 1,
    borderColor: 'rgba(140,240,255,0.7)',
  },
  summonModalText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    textShadowColor: '#8cf0ff',
    textShadowRadius: 15,
  },
  summonNameText: {
    color: '#e0f9ff',
    fontWeight: 'bold',
  },
});

export default AliensScreen;
