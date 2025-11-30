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

// Oni data with images & respective screens
const hardcodedOni = [
  {
    id: 'oni-1',
    name: 'Akuma',
    screen: '',
    image: require('../../../assets/BackGround/Oni.jpg'),
    clickable: true,
    borderColor: '#c0c0c0',
    hardcoded: true,
    showSummonPopup: true,
    description: 'A malevolent demon from ancient folklore.',
    collectionPath: 'oni',
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

const OniScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOni, setSelectedOni] = useState(null);
  const [currentSound, setCurrentSound] = useState(null);
  const [friend, setFriend] = useState(hardcodedOni);
  const [deleteModal, setDeleteModal] = useState({ visible: false, oni: null });
  const [previewOni, setPreviewOni] = useState(null);
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

  // Fetch dynamic oni from Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'oni'),
      (snap) => {
        if (snap.empty) {
          console.log('No oni found in Firestore');
          setFriend(hardcodedOni);
          return;
        }

        // Build dynamic oni list
        const dynamicOni = snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
          clickable: true,
          borderColor: docSnap.data().borderColor || '#c0c0c0',
          hardcoded: false,
          showSummonPopup: docSnap.data().showSummonPopup || false,
          collectionPath: 'oni',
        }));

        // Duplicate debug
        const idCounts = {};
        const nameCounts = {};
        dynamicOni.forEach((o) => {
          idCounts[o.id] = (idCounts[o.id] || 0) + 1;
          nameCounts[o.name || o.codename || 'Unknown'] =
            (nameCounts[o.name || o.codename || 'Unknown'] || 0) + 1;
        });
        Object.entries(idCounts).forEach(([id, count]) => {
          if (count > 1) console.warn(`Duplicate Firestore ID: ${id}, count: ${count}`);
        });
        Object.entries(nameCounts).forEach(([name, count]) => {
          if (count > 1) console.warn(`Duplicate Firestore name: ${name}, count: ${count}`);
        });

        // Filter out dynamic oni that match hardcodedOni by id or name
        const filteredDynamic = dynamicOni.filter(
          (dynamic) =>
            !hardcodedOni.some(
              (oni) =>
                oni.id === dynamic.id ||
                oni.name === (dynamic.name || dynamic.codename)
            )
        );

        // Combine and deduplicate by id
        const combinedMap = new Map();
        [...hardcodedOni, ...filteredDynamic].forEach((oni) => {
          combinedMap.set(oni.id, oni);
        });
        const combined = Array.from(combinedMap.values());
        setFriend(combined);
      },
      (e) => {
        console.error('Firestore error:', e.code, e.message);
        Alert.alert('Error', `Failed to fetch oni: ${e.message}`);
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
      console.log(`Playing audio for ${screen || 'oni'}`);
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

  const handlePress = async (oni) => {
    console.log('Card pressed:', {
      id: oni.id,
      name: oni.name || oni.codename,
      hardcoded: oni.hardcoded,
    });
    try {
      const oniName = oni.name || oni.codename || 'Unknown';
      if (oni.audio) {
        console.log('Playing audio for:', oniName);
        await playDemonSound(oni.audio, oni.screen);
      } else if (oni.screen) {
        console.log(`Navigating to ${oni.screen}`);
        navigation.navigate(oni.screen);
      } else if (oni.showSummonPopup) {
        console.log('Showing summon popup for:', oniName);
        setSelectedOni(oni);
        setModalVisible(true);
      } else {
        console.log('Opening preview for oni:', oniName);
        setPreviewOni(oni);
      }
    } catch (error) {
      console.error('Handle press error:', error.message);
      Alert.alert('Error', 'Failed to handle press: ' + error.message);
    }
  };

  const confirmDelete = async (id) => {
    if (!auth.currentUser || !ALLOWED_EMAILS.includes(auth.currentUser.email)) {
      Alert.alert('Access Denied', 'Only authorized users can delete oni.');
      return;
    }
    try {
      const oniItem = friend.find((o) => o.id === id);
      if (oniItem?.hardcoded) {
        Alert.alert('Error', 'Cannot delete hardcoded oni!');
        return;
      }
      const oniRef = doc(db, 'oni', id);
      const snap = await getDoc(oniRef);
      if (!snap.exists()) {
        Alert.alert('Error', 'Oni not found');
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
            `Failed to delete image from storage: ${e.message}. Oni will still be deleted.`
          );
        }
      } else {
        console.log('No image to delete or imageUrl is placeholder:', imageUrl);
      }
      await deleteDoc(oniRef);
      console.log('Oni deleted from Firestore:', id);
      setFriend(friend.filter((o) => o.id !== id));
      setDeleteModal({ visible: false, oni: null });
      Alert.alert('Success', 'Oni deleted successfully!');
    } catch (e) {
      console.error('Delete oni error:', e.message);
      Alert.alert('Error', `Failed to delete oni: ${e.message}`);
    }
  };

  const renderOniCard = (oni) => {
    const imageSource =
      oni.image ||
      (oni.imageUrl && oni.imageUrl !== 'placeholder'
        ? { uri: oni.imageUrl }
        : require('../../../assets/BackGround/Oni.jpg'));

    console.log('Rendering oni card:', {
      id: oni.id,
      name: oni.name || oni.codename,
      imageSource: JSON.stringify(imageSource),
    });

    return (
      <View key={oni.id} style={styles.oniCont}>
        <TouchableOpacity
          style={[
            styles.oniCard,
            {
              width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
              height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height,
            },
            oni.clickable ? styles.clickable(oni.borderColor) : styles.notClickable,
          ]}
          onPress={() => handlePress(oni)}
          disabled={!oni.clickable}
          activeOpacity={0.9}
        >
          <Image
            source={imageSource}
            style={styles.image}
            resizeMode="cover"
            onError={(e) =>
              console.error(
                'Image load error for oni:',
                oni.id,
                'Error:',
                e.nativeEvent.error,
                'Source:',
                JSON.stringify(imageSource)
              )
            }
          />
          <View style={styles.cardOverlay} />
          <Text style={styles.name}>{oni.name || oni.codename || 'Unknown'}</Text>
          {!oni.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
        </TouchableOpacity>
        {oni.hardcoded === false && (
          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={() => setEditingFriend(oni)}
              style={[styles.edit, !canMod && styles.disabled]}
              disabled={!canMod}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setDeleteModal({
                  visible: true,
                  oni: { id: oni.id, name: oni.name || oni.codename || 'Unknown' },
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

  const renderPreviewCard = (oni) => (
    <TouchableOpacity
      style={[
        styles.previewCard(isDesktop, SCREEN_WIDTH),
        styles.clickable(oni.borderColor || '#c0c0c0'),
      ]}
      onPress={() => {
        console.log('Closing preview modal');
        setPreviewOni(null);
      }}
      activeOpacity={0.9}
    >
      <Image
        source={
          oni.image ||
          (oni.imageUrl && oni.imageUrl !== 'placeholder'
            ? { uri: oni.imageUrl }
            : require('../../../assets/BackGround/Oni.jpg'))
        }
        style={styles.previewImage}
        resizeMode="cover"
      />
      <View style={styles.cardOverlay} />
      <Text style={styles.cardName}>
        © {oni.name || oni.codename || 'Unknown'}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../../assets/BackGround/Oni.jpg')}
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
            <Text style={styles.titleLabel}>Demon Lords • Oni</Text>
            <TouchableOpacity
              onPress={() => {
                console.log('Navigating to OniTab');
                navigation.navigate('OniTab');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.header}>Oni</Text>
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
                friend.map(renderOniCard)
              ) : (
                <Text style={styles.noOniText}>No oni available</Text>
              )}
            </ScrollView>
          </View>

          {/* Glass section for DarkLords form */}
          <View style={styles.glassSection}>
            <Text style={styles.sectionTitle}>Summon & Manage</Text>
            <View style={styles.sectionLine} />
            <DarkLords
              collectionPath="oni"
              placeholderImage={require('../../../assets/BackGround/Oni.jpg')}
              friend={friend}
              setFriend={setFriend}
              hardcodedFriend={hardcodedOni}
              editingFriend={editingFriend}
              setEditingFriend={setEditingFriend}
            />
          </View>
        </ScrollView>

        {/* Preview Modal */}
        <Modal
          visible={!!previewOni}
          transparent
          animationType="fade"
          onRequestClose={() => {
            console.log('Closing preview modal');
            setPreviewOni(null);
          }}
        >
          <View style={styles.modalBackground}>
            <TouchableOpacity
              style={styles.modalOuterContainer}
              activeOpacity={1}
              onPress={() => {
                console.log('Closing preview modal');
                setPreviewOni(null);
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
                    {previewOni && renderPreviewCard(previewOni)}
                  </ScrollView>
                </View>
                <View style={styles.previewAboutSection}>
                  <Text style={styles.previewName}>
                    {previewOni?.name || previewOni?.codename || 'Unknown'}
                  </Text>
                  <Text style={styles.previewDesc}>
                    {previewOni?.description || 'No description available'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('Closing preview modal');
                      setPreviewOni(null);
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
          onRequestClose={() => setDeleteModal({ visible: false, oni: null })}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.deleteGlass}>
              <Text style={styles.modalText}>
                {`Delete "${deleteModal.oni?.name || ''}" and its image?`}
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() => setDeleteModal({ visible: false, oni: null })}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalDelete}
                  onPress={() =>
                    deleteModal.oni && confirmDelete(deleteModal.oni.id)
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
            setSelectedOni(null);
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              console.log('Closing summon modal via background tap');
              setModalVisible(false);
              setSelectedOni(null);
            }}
          >
            <View style={styles.summonModalContainer}>
              <View style={styles.summonGlass}>
                <Text style={styles.summonModalText}>
                  🔥 You have summoned:{' '}
                  <Text style={styles.summonNameText}>
                    {selectedOni?.name || selectedOni?.codename || 'Unknown'}
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
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
    color: '#ffb4b4',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 180, 180, 0.9)',
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

  // ONI CARDS
  oniCont: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  oniCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(10, 5, 5, 0.82)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.65,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
  },
  clickable: (borderColor) => ({
    borderColor: borderColor || 'rgba(255,200,200,0.95)',
    shadowColor: borderColor || '#ff5555',
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
  noOniText: {
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
    backgroundColor: 'rgba(20, 5, 5, 0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255,230,230,0.95)',
    textAlign: 'center',
    marginBottom: 4,
  },
  sectionLine: {
    height: 1,
    backgroundColor: 'rgba(255,140,140,0.8)',
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
    backgroundColor: 'rgba(10,5,5,0.96)',
    borderWidth: 1,
    borderColor: 'rgba(255,200,200,0.3)',
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
    borderColor: 'rgba(255,200,200,0.35)',
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
    backgroundColor: 'rgba(25,5,5,0.95)',
    borderTopWidth: 1,
    borderColor: 'rgba(255,200,200,0.25)',
  },
  previewName: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
  previewDesc: {
    fontSize: 14,
    color: '#ffecec',
    textAlign: 'center',
    marginVertical: 10,
  },
  close: {
    backgroundColor: '#e53935',
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
    backgroundColor: 'rgba(25,5,5,0.96)',
    padding: 20,
    borderRadius: 18,
    alignItems: 'center',
    width: '85%',
    borderWidth: 1,
    borderColor: 'rgba(255,200,200,0.3)',
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
    backgroundColor: 'rgba(15,0,0,0.96)',
    padding: 22,
    borderRadius: 20,
    width: '80%',
    borderWidth: 1,
    borderColor: 'rgba(255,120,120,0.7)',
  },
  summonModalText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    textShadowColor: '#ff8888',
    textShadowRadius: 15,
  },
  summonNameText: {
    color: '#ffe0e0',
    fontWeight: 'bold',
  },
});

export default OniScreen;
