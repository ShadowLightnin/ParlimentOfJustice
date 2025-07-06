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
  mobile: { width: 350, height: 500 },
};
const horizontalSpacing = isDesktop ? 40 : 20;
const verticalSpacing = isDesktop ? 50 : 20;

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
    // Ensure demonLords have unique IDs, hardcoded flag, and showSummonPopup
    const validatedDemonLords = demonLords.map((lord, index) => ({
      ...lord,
      id: lord.id || `hardcoded-${index + 1}`,
      hardcoded: true,
      showSummonPopup: lord.showSummonPopup !== undefined ? lord.showSummonPopup : true,
      collectionPath: 'skinwalkers',
    }));
    console.log('Validated DemonLords:', validatedDemonLords.map(l => ({ id: l.id, name: l.name, showSummonPopup: l.showSummonPopup })));
    setFriend(validatedDemonLords);

    const unsub = onSnapshot(collection(db, 'skinwalkers'), (snap) => {
      if (snap.empty) {
        console.log('No skinwalkers found in Firestore');
        setFriend(validatedDemonLords);
        return;
      }
      // Check for duplicate IDs or names in Firestore
      const dynamicSkinwalkers = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        clickable: true,
        borderColor: doc.data().borderColor || '#e25822',
        hardcoded: false,
        showSummonPopup: doc.data().showSummonPopup || false,
        collectionPath: 'skinwalkers',
      }));
      console.log('Fetched dynamic skinwalkers:', dynamicSkinwalkers.map(s => ({ id: s.id, name: s.name || s.codename, showSummonPopup: s.showSummonPopup })));

      // Filter out dynamic skinwalkers that match demonLords by id or name
      const filteredDynamic = dynamicSkinwalkers.filter(
        (dynamic) => !validatedDemonLords.some(
          (lord) => lord.id === dynamic.id || lord.name === (dynamic.name || dynamic.codename)
        )
      );
      console.log('Filtered dynamic skinwalkers:', filteredDynamic.map(s => ({ id: s.id, name: s.name || s.codename, showSummonPopup: s.showSummonPopup })));

      // Combine and deduplicate by id
      const combinedMap = new Map();
      [...validatedDemonLords, ...filteredDynamic].forEach((skinwalker) => {
        combinedMap.set(skinwalker.id, skinwalker);
      });
      const combined = Array.from(combinedMap.values());
      console.log('Combined skinwalkers:', combined.map(s => ({ id: s.id, name: s.name || s.codename, showSummonPopup: s.showSummonPopup })));
      setFriend(combined);
      console.log('Updated friend state:', combined.map(s => ({ id: s.id, name: s.name || s.codename, showSummonPopup: s.showSummonPopup })));
    }, (e) => {
      console.error('Firestore error:', e.code, e.message);
      Alert.alert('Error', `Failed to fetch skinwalkers: ${e.message}`);
    });
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
      console.log(`Playing audio for ${screen || 'skinwalker'}`);
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

  const handlePress = async (skinwalker) => {
    console.log('Card pressed:', { id: skinwalker.id, name: skinwalker.name || skinwalker.codename, hardcoded: skinwalker.hardcoded });
    try {
      const demonName = skinwalker.name || skinwalker.codename || 'Unknown';
      console.log('Showing summon popup for:', demonName);
      setSelectedDemon(demonName);
      setModalVisible(true);
      console.log('Modal state set:', { modalVisible: true, selectedDemon: demonName });

      if (skinwalker.hardcoded && skinwalker.audio && skinwalker.screen) {
        console.log('Playing audio and navigating for hardcoded skinwalker:', demonName);
        await playDemonSound(skinwalker.audio, skinwalker.screen);
      } else {
        console.log('Opening preview for dynamic skinwalker:', demonName);
        setTimeout(() => {
          setModalVisible(false);
          setSelectedDemon(null);
          setPreviewSkinwalker(skinwalker);
          console.log('Preview modal opened for:', demonName);
        }, 2000);
      }
    } catch (error) {
      console.error('Handle press error:', error.message);
      Alert.alert('Error', 'Failed to handle press: ' + error.message);
    }
  };

  const confirmDelete = async (id) => {
    if (!canMod) {
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
      await deleteDoc(skinwalkerRef);
      if (imageUrl && imageUrl !== 'placeholder') {
        const path = imageUrl.split('/o/')[1]?.split('?')[0];
        if (path) {
          await deleteObject(ref(storage, path)).catch(e => {
            if (e.code !== 'storage/object-not-found') {
              console.error('Delete image error:', e.message);
            }
          });
        }
      }
      setDeleteModal({ visible: false, skinwalker: null });
      Alert.alert('Success', 'Skinwalker deleted!');
    } catch (e) {
      console.error('Delete skinwalker error:', e.code, e.message);
      Alert.alert('Error', `Failed to delete skinwalker: ${e.message}`);
    }
  };

  // Temporary test button to force summon popup
  const testSummonPopup = () => {
    console.log('Test summon popup triggered');
    setSelectedDemon('Unknown');
    setModalVisible(true);
    console.log('Modal state set:', { modalVisible: true, selectedDemon: 'Test Demon' });
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
          skinwalker.clickable ? styles.clickable(skinwalker.borderColor) : styles.notClickable,
        ]}
        onPress={() => {
          console.log('TouchableOpacity pressed for skinwalker:', skinwalker.id);
          handlePress(skinwalker);
        }}
        disabled={!skinwalker.clickable}
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
        <View style={styles.overlay} />
        <Text style={styles.demonName}>{skinwalker.name || skinwalker.codename || 'Unknown'}</Text>
        {!skinwalker.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
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
            onPress={() => setDeleteModal({ visible: true, skinwalker: { id: skinwalker.id, name: skinwalker.name || skinwalker.codename || 'Unknown' } })}
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
      style={[styles.previewCard(isDesktop, SCREEN_WIDTH), styles.clickable(skinwalker.borderColor || '#e25822')]}
      onPress={() => {
        console.log('Closing preview modal');
        setPreviewSkinwalker(null);
      }}
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
      <View style={styles.overlay} />
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
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <TouchableOpacity
            onPress={() => {
              console.log('Navigating back');
              navigation.goBack();
            }}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>⬅️ Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              console.log('Navigating to SkinwalkersTab');
              navigation.navigate('SkinwalkersTab');
            }}
          >
            <Text style={styles.header}>Skinwalkers</Text>
          </TouchableOpacity>
          {/* Temporary test button for summon popup */}
          <TouchableOpacity
            onPress={testSummonPopup}
            style={[styles.backButton, { top: 40, left: 120 }]}
          >
            <Text style={styles.backButtonText}>Summon</Text>
          </TouchableOpacity>
          <View style={styles.scrollWrapper}>
            <ScrollView
              horizontal
              contentContainerStyle={styles.scrollContainer}
              showsHorizontalScrollIndicator={true}
            >
              {friend.length > 0 ? (
                friend.map(renderSkinwalkerCard)
              ) : (
                <Text style={styles.noSkinwalkersText}>No skinwalkers available</Text>
              )}
            </ScrollView>
          </View>
          <DarkLords
            collectionPath="skinwalkers"
            placeholderImage={require('../../../assets/BackGround/Skinwalkers.jpg')}
            friend={friend}
            setFriend={setFriend}
            hardcodedFriend={demonLords}
            editingFriend={editingFriend}
            setEditingFriend={setEditingFriend}
          />
        </ScrollView>
        <Modal
          visible={!!previewSkinwalker}
          transparent
          animationType="fade"
          onRequestClose={() => {
            console.log('Closing preview modal');
            setPreviewSkinwalker(null);
          }}
        >
          <View style={styles.modalBackground}>
            <TouchableOpacity
              style={styles.modalOuterContainer}
              activeOpacity={1}
              onPress={() => {
                console.log('Closing preview modal');
                setPreviewSkinwalker(null);
              }}
            >
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
                  {previewSkinwalker && renderPreviewCard(previewSkinwalker)}
                </ScrollView>
              </View>
              <View style={styles.previewAboutSection}>
                <Text style={styles.previewName}>{previewSkinwalker?.name || previewSkinwalker?.codename || 'Unknown'}</Text>
                <Text style={styles.previewDesc}>{previewSkinwalker?.description || 'No description available'}</Text>
                <TouchableOpacity
                  onPress={() => {
                    console.log('Closing preview modal');
                    setPreviewSkinwalker(null);
                  }}
                  style={styles.close}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal
          visible={deleteModal.visible}
          transparent
          animationType="slide"
          onRequestClose={() => setDeleteModal({ visible: false, skinwalker: null })}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{`Delete "${deleteModal.skinwalker?.name || ''}" and its image?`}</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() => setDeleteModal({ visible: false, skinwalker: null })}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalDelete}
                  onPress={() => deleteModal.skinwalker && confirmDelete(deleteModal.skinwalker.id)}
                >
                  <Text style={styles.modalDeleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => {
            console.log('Closing summon modal');
            setModalVisible(false);
            setSelectedDemon(null);
          }}
        >
          <TouchableWithoutFeedback onPress={() => {
            console.log('Closing summon modal via background tap');
            setModalVisible(false);
            setSelectedDemon(null);
          }}>
            <View style={styles.summonModalContainer}>
              <View style={styles.summonModalContent}>
                <Text style={styles.summonModalText}>
                  🔥 You have summoned: {selectedDemon || 'Unknown'} 🔥
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingTop: 40,
    alignItems: 'center',
  },
  scroll: {
    paddingBottom: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#750000',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 5,
    zIndex: 2,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'rgba(107, 9, 9, 1)',
    textAlign: 'center',
    textShadowColor: 'rgba(241, 99, 43, 1)',
    textShadowRadius: 20,
    marginBottom: 20,
  },
  scrollWrapper: {
    width: SCREEN_WIDTH,
    flexGrow: 0,
  },
  scrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: horizontalSpacing,
    paddingVertical: verticalSpacing,
    alignItems: 'center',
  },
  skinwalkerCont: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  demonCard: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.7)',
    elevation: 5,
  },
  clickable: (borderColor) => ({
    borderColor: borderColor || '#e25822',
    borderWidth: 2,
  }),
  notClickable: {
    opacity: 0.7,
  },
  demonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1,
  },
  demonName: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  disabledText: {
    fontSize: 12,
    color: 'yellow',
    marginTop: 5,
    textAlign: 'center',
  },
  noSkinwalkersText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    padding: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
    marginTop: 10,
  },
  edit: {
    backgroundColor: '#5913bc',
    padding: 5,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  delete: {
    backgroundColor: '#F44336',
    padding: 5,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOuterContainer: {
    width: '90%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    paddingVertical: 20,
    backgroundColor: '#111',
    alignItems: 'center',
  },
  imageScrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewCard: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.2 : SCREEN_WIDTH * 0.8,
    height: isDesktop ? SCREEN_HEIGHT * 0.7 : SCREEN_HEIGHT * 0.6,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: 'rgba(0,0,0,0.7)',
    marginRight: 20,
  }),
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardName: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    zIndex: 2,
  },
  previewAboutSection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#222',
    borderRadius: 10,
    width: '90%',
  },
  previewName: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  previewDesc: {
    fontSize: 16,
    color: '#fff7f7',
    textAlign: 'center',
    marginVertical: 10,
  },
  close: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  modalCancel: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  modalCancelText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalDelete: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
  },
  modalDeleteText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  summonModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  summonModalContent: {
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  summonModalText: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    textShadowColor: '#e25822',
    textShadowRadius: 15,
  },
});

export default SkinwalkersScreen;