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

// Pirates data with images & respective screens
const hardcodedPirates = [
  {
    id: 'pirate-1',
    name: 'Blackfang',
    screen: '',
    image: require('../../../assets/BackGround/Pirates.jpg'),
    clickable: true,
    borderColor: '#f3d37a',
    hardcoded: true,
    showSummonPopup: true,
    description: 'A ruthless pirate captain of the high seas.',
    collectionPath: 'pirates',
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

const PiratesScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPirate, setSelectedPirate] = useState(null);
  const [currentSound, setCurrentSound] = useState(null);
  const [friend, setFriend] = useState(hardcodedPirates);
  const [deleteModal, setDeleteModal] = useState({ visible: false, pirate: null });
  const [previewPirate, setPreviewPirate] = useState(null);
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

  // Fetch dynamic pirates from Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'pirates'),
      (snap) => {
        if (snap.empty) {
          console.log('No pirates found in Firestore');
          setFriend(hardcodedPirates);
          return;
        }

        const dynamicPirates = snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
          clickable: true,
          borderColor: docSnap.data().borderColor || '#f3d37a',
          hardcoded: false,
          showSummonPopup: docSnap.data().showSummonPopup || false,
          collectionPath: 'pirates',
        }));

        // Duplicate checks
        const idCounts = {};
        const nameCounts = {};
        dynamicPirates.forEach((p) => {
          idCounts[p.id] = (idCounts[p.id] || 0) + 1;
          nameCounts[p.name || p.codename || 'Unknown'] =
            (nameCounts[p.name || p.codename || 'Unknown'] || 0) + 1;
        });
        Object.entries(idCounts).forEach(([id, count]) => {
          if (count > 1) console.warn(`Duplicate Firestore ID: ${id}, count: ${count}`);
        });
        Object.entries(nameCounts).forEach(([name, count]) => {
          if (count > 1) console.warn(`Duplicate Firestore name: ${name}, count: ${count}`);
        });

        // Filter out dynamic pirates that match hardcodedPirates by id or name
        const filteredDynamic = dynamicPirates.filter(
          (dynamic) =>
            !hardcodedPirates.some(
              (pirate) =>
                pirate.id === dynamic.id ||
                pirate.name === (dynamic.name || dynamic.codename)
            )
        );

        // Combine and deduplicate by id
        const combinedMap = new Map();
        [...hardcodedPirates, ...filteredDynamic].forEach((pirate) => {
          combinedMap.set(pirate.id, pirate);
        });
        const combined = Array.from(combinedMap.values());
        setFriend(combined);
      },
      (e) => {
        console.error('Firestore error:', e.code, e.message);
        Alert.alert('Error', `Failed to fetch pirates: ${e.message}`);
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
      console.log(`Playing audio for ${screen || 'pirate'}`);
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

  const handlePress = async (pirate) => {
    console.log('Card pressed:', {
      id: pirate.id,
      name: pirate.name || pirate.codename,
      hardcoded: pirate.hardcoded,
    });
    try {
      const pirateName = pirate.name || pirate.codename || 'Unknown';
      if (pirate.audio) {
        console.log('Playing audio for:', pirateName);
        await playDemonSound(pirate.audio, pirate.screen);
      } else if (pirate.screen) {
        console.log(`Navigating to ${pirate.screen}`);
        navigation.navigate(pirate.screen);
      } else if (pirate.showSummonPopup) {
        console.log('Showing summon popup for:', pirateName);
        setSelectedPirate(pirate);
        setModalVisible(true);
      } else {
        console.log('Opening preview for pirate:', pirateName);
        setPreviewPirate(pirate);
      }
    } catch (error) {
      console.error('Handle press error:', error.message);
      Alert.alert('Error', 'Failed to handle press: ' + error.message);
    }
  };

  const confirmDelete = async (id) => {
    if (!auth.currentUser || !ALLOWED_EMAILS.includes(auth.currentUser.email)) {
      Alert.alert('Access Denied', 'Only authorized users can delete pirates.');
      return;
    }
    try {
      const pirateItem = friend.find((p) => p.id === id);
      if (pirateItem?.hardcoded) {
        Alert.alert('Error', 'Cannot delete hardcoded pirates!');
        return;
      }
      const pirateRef = doc(db, 'pirates', id);
      const snap = await getDoc(pirateRef);
      if (!snap.exists()) {
        Alert.alert('Error', 'Pirate not found');
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
                throw e;
              }
              console.warn('Image not found in storage:', path);
            });
            console.log('Image deleted or not found:', path);
          }
        } catch (e) {
          console.error('Delete image error:', e.message, 'Path:', path, 'URL:', imageUrl);
          Alert.alert(
            'Warning',
            `Failed to delete image from storage: ${e.message}. Pirate will still be deleted.`
          );
        }
      } else {
        console.log('No image to delete or imageUrl is placeholder:', imageUrl);
      }
      await deleteDoc(pirateRef);
      console.log('Pirate deleted from Firestore:', id);
      setFriend(friend.filter((p) => p.id !== id));
      setDeleteModal({ visible: false, pirate: null });
      Alert.alert('Success', 'Pirate deleted successfully!');
    } catch (e) {
      console.error('Delete pirate error:', e.message);
      Alert.alert('Error', `Failed to delete pirate: ${e.message}`);
    }
  };

  const renderPirateCard = (pirate) => {
    const imageSource =
      pirate.image ||
      (pirate.imageUrl && pirate.imageUrl !== 'placeholder'
        ? { uri: pirate.imageUrl }
        : require('../../../assets/BackGround/Pirates.jpg'));

    console.log('Rendering pirate card:', {
      id: pirate.id,
      name: pirate.name || pirate.codename,
      imageSource: JSON.stringify(imageSource),
    });

    return (
      <View key={pirate.id} style={styles.pirateCont}>
        <TouchableOpacity
          style={[
            styles.pirateCard,
            {
              width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
              height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height,
            },
            pirate.clickable ? styles.clickable(pirate.borderColor) : styles.notClickable,
          ]}
          onPress={() => handlePress(pirate)}
          disabled={!pirate.clickable}
          activeOpacity={0.9}
        >
          <Image source={imageSource} style={styles.image} resizeMode="cover" />
          <View style={styles.cardOverlay} />
          <Text style={styles.name}>{pirate.name || pirate.codename || 'Unknown'}</Text>
          {!pirate.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
        </TouchableOpacity>
        {pirate.hardcoded === false && (
          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={() => setEditingFriend(pirate)}
              style={[styles.edit, !canMod && styles.disabled]}
              disabled={!canMod}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setDeleteModal({
                  visible: true,
                  pirate: {
                    id: pirate.id,
                    name: pirate.name || pirate.codename || 'Unknown',
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
  };

  const renderPreviewCard = (pirate) => (
    <TouchableOpacity
      style={[
        styles.previewCard(isDesktop, SCREEN_WIDTH),
        styles.clickable(pirate.borderColor || '#f3d37a'),
      ]}
      onPress={() => {
        console.log('Closing preview modal');
        setPreviewPirate(null);
      }}
      activeOpacity={0.9}
    >
      <Image
        source={
          pirate.image ||
          (pirate.imageUrl && pirate.imageUrl !== 'placeholder'
            ? { uri: pirate.imageUrl }
            : require('../../../assets/BackGround/Pirates.jpg'))
        }
        style={styles.previewImage}
        resizeMode="cover"
      />
      <View style={styles.cardOverlay} />
      <Text style={styles.cardName}>
        © {pirate.name || pirate.codename || 'Unknown'}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../../assets/BackGround/Pirates.jpg')}
      style={styles.background}
    >
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
            <Text style={styles.titleLabel}>Enemy • Faction</Text>
            <TouchableOpacity
              onPress={() => {
                console.log('Navigating to PiratesTab');
                navigation.navigate('PiratesTab');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.header}>Pirates</Text>
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
                friend.map(renderPirateCard)
              ) : (
                <Text style={styles.noPiratesText}>No pirates available</Text>
              )}
            </ScrollView>
          </View>

          {/* Glass section for DarkLords form */}
          <View style={styles.glassSection}>
            <Text style={styles.sectionTitle}>Recruit & Manage Crew</Text>
            <View style={styles.sectionLine} />
            <DarkLords
              collectionPath="pirates"
              placeholderImage={require('../../../assets/BackGround/Pirates.jpg')}
              friend={friend}
              setFriend={setFriend}
              hardcodedFriend={hardcodedPirates}
              editingFriend={editingFriend}
              setEditingFriend={setEditingFriend}
            />
          </View>
        </ScrollView>

        {/* Preview Modal */}
        <Modal
          visible={!!previewPirate}
          transparent
          animationType="fade"
          onRequestClose={() => {
            console.log('Closing preview modal');
            setPreviewPirate(null);
          }}
        >
          <View style={styles.modalBackground}>
            <TouchableOpacity
              style={styles.modalOuterContainer}
              activeOpacity={1}
              onPress={() => {
                console.log('Closing preview modal');
                setPreviewPirate(null);
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
                    {previewPirate && renderPreviewCard(previewPirate)}
                  </ScrollView>
                </View>
                <View style={styles.previewAboutSection}>
                  <Text style={styles.previewName}>
                    {previewPirate?.name || previewPirate?.codename || 'Unknown'}
                  </Text>
                  <Text style={styles.previewDesc}>
                    {previewPirate?.description || 'No description available'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('Closing preview modal');
                      setPreviewPirate(null);
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
          onRequestClose={() => setDeleteModal({ visible: false, pirate: null })}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.deleteGlass}>
              <Text style={styles.modalText}>
                {`Delete "${deleteModal.pirate?.name || ''}" and its image?`}
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() => setDeleteModal({ visible: false, pirate: null })}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalDelete}
                  onPress={() =>
                    deleteModal.pirate && confirmDelete(deleteModal.pirate.id)
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
            setSelectedPirate(null);
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              console.log('Closing summon modal via background tap');
              setModalVisible(false);
              setSelectedPirate(null);
            }}
          >
            <View style={styles.summonModalContainer}>
              <View style={styles.summonGlass}>
                <Text style={styles.summonModalText}>
                  ☠️ You have summoned:{' '}
                  <Text style={styles.summonNameText}>
                    {selectedPirate?.name || selectedPirate?.codename || 'Unknown'}
                  </Text>{' '}
                  ☠️
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
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
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
    backgroundColor: 'rgba(10, 10, 20, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(240, 210, 140, 0.7)',
  },
  iconButtonText: {
    color: '#FFF9E6',
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
    color: 'rgba(255,240,200,0.8)',
  },
  header: {
    fontSize: isDesktop ? 30 : 24,
    fontWeight: '900',
    color: '#f3d37a',
    textAlign: 'center',
    textShadowColor: 'rgba(243,211,122,0.95)',
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

  // PIRATE CARDS
  pirateCont: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  pirateCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(5, 8, 15, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(240, 210, 140, 0.6)',
    shadowColor: '#000',
    shadowOpacity: 0.7,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 22,
  },
  clickable: (borderColor) => ({
    borderColor: borderColor || 'rgba(240, 210, 140, 0.95)',
    shadowColor: borderColor || '#f3d37a',
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
  noPiratesText: {
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
    backgroundColor: 'rgba(8, 10, 18, 0.96)',
    borderWidth: 1,
    borderColor: 'rgba(240, 210, 140, 0.6)',
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255, 248, 230, 0.98)',
    textAlign: 'center',
    marginBottom: 4,
  },
  sectionLine: {
    height: 1,
    backgroundColor: 'rgba(243,211,122,0.9)',
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
    backgroundColor: 'rgba(8, 10, 18, 0.96)',
    borderWidth: 1,
    borderColor: 'rgba(240, 210, 140, 0.7)',
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
    borderColor: 'rgba(240,210,140,0.7)',
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
    backgroundColor: 'rgba(8,10,18,0.96)',
    borderTopWidth: 1,
    borderColor: 'rgba(240,210,140,0.5)',
  },
  previewName: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
  previewDesc: {
    fontSize: 14,
    color: '#fff7f0',
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
    backgroundColor: 'rgba(8,10,18,0.96)',
    padding: 20,
    borderRadius: 18,
    alignItems: 'center',
    width: '85%',
    borderWidth: 1,
    borderColor: 'rgba(240,210,140,0.7)',
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
    backgroundColor: 'rgba(8,10,18,0.96)',
    padding: 22,
    borderRadius: 20,
    width: '80%',
    borderWidth: 1,
    borderColor: 'rgba(243,211,122,0.9)',
  },
  summonModalText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    textShadowColor: '#f3d37a',
    textShadowRadius: 15,
  },
  summonNameText: {
    color: '#FFF9E6',
    fontWeight: 'bold',
  },
});

export default PiratesScreen;
