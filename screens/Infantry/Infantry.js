import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { db, auth, storage } from '../../lib/firebase';
import { collection, onSnapshot, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { Audio } from 'expo-av';
import RecruitForm from './RecruitForm';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;

// Card dimensions for desktop and mobile (matched with ShipYardScreen.js)
const cardSizes = {
  desktop: { width: 300, height: 450 },
  mobile: { width: 200, height: 300 },
};
const horizontalSpacing = isDesktop ? 20 : 10;
const verticalSpacing = isDesktop ? 20 : 10;

// Hardcoded infantry data with images, gold border color, and descriptions
const hardcodedInfantry = [
  {
    id: 'infantry-1',
    name: 'ARC Commander',
    screen: '',
    image: require('../../assets/Armor/Infantry/ArcCommander.jpg'),
    clickable: true,
    borderColor: '#a59434', // Gold for hardcoded
    hardcoded: true,
    description: '',
  },
];

const ALLOWED_EMAILS = ["will@test.com", "c1wcummings@gmail.com"];
const RESTRICT_ACCESS = false; // Allow anyone to add/edit/delete infantry

const InfantryScreen = () => {
  const navigation = useNavigation();
  const [previewInfantry, setPreviewInfantry] = useState(null);
  const [infantry, setInfantry] = useState(hardcodedInfantry);
  const [deleteModal, setDeleteModal] = useState({ visible: false, infantry: null });
  const [currentSound, setCurrentSound] = useState(null);
  const [pausedPosition, setPausedPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const canMod = RESTRICT_ACCESS ? auth.currentUser && ALLOWED_EMAILS.includes(auth.currentUser.email) : true;

  // Initialize sound on mount
  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/audio/SourceOfStrengthNinjagoMyVersion.mp4'),
          { shouldPlay: true, isLooping: true, volume: 1.0 }
        );
        setCurrentSound(sound);
      } catch (error) {
        console.error('Failed to load audio file:', error);
        Alert.alert('Audio Error', 'Failed to load background music. Please check the audio file path: ../../assets/audio/ForDemocracy.mp4');
      }
    };

    loadSound();

    // Cleanup sound on unmount
    return () => {
      if (currentSound) {
        currentSound.stopAsync().catch((error) => console.error('Error stopping sound:', error));
        currentSound.unloadAsync().catch((error) => console.error('Error unloading sound:', error));
        setCurrentSound(null);
        setPausedPosition(0);
        setIsPaused(false);
      }
    };
  }, []);

  // Handle screen focus to resume/pause audio
  useFocusEffect(
    useCallback(() => {
      const resumeSound = async () => {
        if (currentSound && isPaused && pausedPosition >= 0) {
          try {
            await currentSound.setPositionAsync(pausedPosition);
            await currentSound.playAsync();
            setIsPaused(false);
          } catch (error) {
            console.error('Error resuming sound:', error);
          }
        }
      };

      resumeSound();

      return () => {
        if (currentSound && !isPaused) {
          currentSound.pauseAsync().then(async () => {
            try {
              const status = await currentSound.getStatusAsync();
              setPausedPosition(status.positionMillis || 0);
              setIsPaused(true);
            } catch (error) {
              console.error('Error pausing sound:', error);
            }
          }).catch((error) => console.error('Error pausing sound:', error));
        }
      };
    }, [currentSound, isPaused, pausedPosition])
  );

  // Fetch dynamic infantry from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'infantry'), (snap) => {
      const dynamicInfantry = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        clickable: true,
        borderColor: doc.data().borderColor || '#FFFFFF', // White for dynamic
        hardcoded: false,
      }));
      console.log('Fetched dynamic infantry:', dynamicInfantry);
      setInfantry([...hardcodedInfantry, ...dynamicInfantry]);
    }, (e) => {
      console.error('Firestore error:', e.message);
      Alert.alert('Error', 'Failed to fetch infantry: ' + e.message);
    });
    return () => unsub();
  }, []);

  const handleInfantryPress = async (infantryItem) => {
    if (infantryItem.clickable) {
      if (currentSound) {
        try {
          const status = await currentSound.getStatusAsync();
          if (status.isPlaying) {
            await currentSound.pauseAsync();
            setPausedPosition(status.positionMillis || 0);
            setIsPaused(true);
          }
        } catch (error) {
          console.error('Error pausing sound on infantry press:', error);
        }
      }
      if (infantryItem.screen) {
        console.log('Navigating to screen:', infantryItem.screen);
        navigation.navigate(infantryItem.screen);
      } else {
        setPreviewInfantry(infantryItem);
        console.log('Preview infantry:', infantryItem);
      }
    }
  };

  const confirmDelete = async (id) => {
    if (!auth.currentUser || !ALLOWED_EMAILS.includes(auth.currentUser.email)) {
      Alert.alert('Access Denied', 'Only authorized users can delete infantry.');
      return;
    }
    try {
      const infantryItem = infantry.find(i => i.id === id);
      if (infantryItem.hardcoded) {
        Alert.alert('Error', 'Cannot delete hardcoded infantry!');
        return;
      }
      const infantryRef = doc(db, 'infantry', id);
      const snap = await getDoc(infantryRef);
      if (!snap.exists()) {
        Alert.alert('Error', 'Infantry not found');
        return;
      }
      const { imageUrl } = snap.data();
      if (imageUrl && imageUrl !== 'placeholder') {
        let path = '';
        try {
          console.log('Raw imageUrl:', imageUrl); // Debug raw URL
          const urlParts = imageUrl.split('/o/');
          if (urlParts.length > 1) {
            path = decodeURIComponent(urlParts[1].split('?')[0]);
          }
          if (!path) {
            console.warn('No valid path extracted from imageUrl:', imageUrl);
          } else {
            console.log('Attempting to delete image:', path);
            await deleteObject(ref(storage, path)).catch(e => {
              if (e.code !== 'storage/object-not-found') {
                throw e; // Rethrow errors except "not found"
              }
              console.warn('Image not found in storage:', path);
            });
            console.log('Image deleted or not found:', path);
          }
        } catch (e) {
          console.error('Delete image error:', e.message, 'Path:', path, 'URL:', imageUrl);
          Alert.alert('Warning', `Failed to delete image from storage: ${e.message}. Infantry will still be deleted.`);
          // Continue with Firestore deletion even if image deletion fails
        }
      }
      await deleteDoc(infantryRef);
      console.log('Infantry deleted from Firestore:', id);
      setInfantry(infantry.filter(i => i.id !== id));
      setDeleteModal({ visible: false, infantry: null });
      Alert.alert('Success', 'Infantry deleted successfully!');
    } catch (e) {
      console.error('Delete infantry error:', e.message);
      Alert.alert('Error', `Failed to delete infantry: ${e.message}`);
    }
  };

  // Render Each Infantry Card
  const renderInfantryCard = (infantryItem) => (
    <View key={infantryItem.id || infantryItem.name} style={styles.infantryCont}>
      <TouchableOpacity
        style={[
          styles.infantryCard,
          {
            width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
            height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height,
          },
          infantryItem.clickable && infantryItem.borderColor ? styles.clickable(infantryItem.borderColor) : styles.notClickable,
        ]}
        onPress={() => handleInfantryPress(infantryItem)}
        disabled={!infantryItem.clickable}
      >
        <Image
          source={infantryItem.image || (infantryItem.imageUrl && infantryItem.imageUrl !== 'placeholder' ? { uri: infantryItem.imageUrl } : require('../../assets/Armor/PlaceHolder.jpg'))}
          style={styles.infantryImg}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        <Text style={styles.infantryName}>{infantryItem.name}</Text>
        {!infantryItem.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
      </TouchableOpacity>
      {!infantryItem.hardcoded && (
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => setPreviewInfantry({ ...infantryItem, isEditing: true })}
            style={[styles.edit, !canMod && styles.disabled]}
            disabled={!canMod}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDeleteModal({ visible: true, infantry: { id: infantryItem.id, name: infantryItem.name } })}
            style={[styles.delete, !canMod && styles.disabled]}
            disabled={!canMod}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  // Render Preview Card
  const renderPreviewCard = (infantryItem) => (
    <TouchableOpacity
      style={[styles.previewCard(isDesktop, SCREEN_WIDTH), styles.clickable(infantryItem.borderColor)]}
      onPress={() => {
        console.log('Closing preview modal');
        if (currentSound) {
          currentSound.pauseAsync().then(async () => {
            try {
              const status = await currentSound.getStatusAsync();
              setPausedPosition(status.positionMillis || 0);
              setIsPaused(true);
            } catch (error) {
              console.error('Error pausing sound on preview close:', error);
            }
          }).catch((error) => console.error('Error pausing sound:', error));
        }
        setPreviewInfantry(null);
      }}
    >
      <Image
        source={infantryItem.image || (infantryItem.imageUrl && infantryItem.imageUrl !== 'placeholder' ? { uri: infantryItem.imageUrl } : require('../../assets/Armor/PlaceHolder.jpg'))}
        style={styles.previewImage}
        resizeMode="contain"
      />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {infantryItem.name || 'Unknown'}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Soldiers.jpg')}
      style={styles.bg}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          onPress={() => {
            console.log('Navigating back');
            if (currentSound) {
              currentSound.pauseAsync().then(async () => {
                try {
                  const status = await currentSound.getStatusAsync();
                  setPausedPosition(status.positionMillis || 0);
                  setIsPaused(true);
                } catch (error) {
                  console.error('Error pausing sound on back:', error);
                }
              }).catch((error) => console.error('Error pausing sound:', error));
            }
            navigation.goBack();
          }}
          style={styles.back}
        >
          <Text style={styles.backText}>⬅️</Text>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.header}>Infantry</Text>
          <View style={styles.scrollWrapper}>
            <ScrollView
              horizontal
              contentContainerStyle={styles.hScroll}
              showsHorizontalScrollIndicator={false}
            >
              {infantry.length > 0 ? (
                infantry.map(renderInfantryCard)
              ) : (
                <Text style={styles.noInfantryText}>No infantry available</Text>
              )}
            </ScrollView>
          </View>
          <RecruitForm
            collectionPath="infantry"
            placeholderImage={require('../../assets/Armor/PlaceHolder.jpg')}
            infantry={infantry}
            setInfantry={setInfantry}
            hardcodedInfantry={hardcodedInfantry}
            editingInfantry={previewInfantry?.isEditing ? previewInfantry : null}
            setEditingInfantry={setPreviewInfantry}
          />
          <Modal
            visible={!!previewInfantry && !previewInfantry.isEditing}
            transparent
            animationType="fade"
            onRequestClose={() => {
              console.log('Closing preview modal');
              if (currentSound) {
                currentSound.pauseAsync().then(async () => {
                  try {
                    const status = await currentSound.getStatusAsync();
                    setPausedPosition(status.positionMillis || 0);
                    setIsPaused(true);
                  } catch (error) {
                    console.error('Error pausing sound on modal close:', error);
                  }
                }).catch((error) => console.error('Error pausing sound:', error));
              }
              setPreviewInfantry(null);
            }}
          >
            <View style={styles.modalBackground}>
              <TouchableOpacity
                style={styles.modalOuterContainer}
                activeOpacity={1}
                onPress={() => {
                  console.log('Closing preview modal');
                  if (currentSound) {
                    currentSound.pauseAsync().then(async () => {
                      try {
                        const status = await currentSound.getStatusAsync();
                        setPausedPosition(status.positionMillis || 0);
                        setIsPaused(true);
                      } catch (error) {
                        console.error('Error pausing sound on modal outer press:', error);
                      }
                    }).catch((error) => console.error('Error pausing sound:', error));
                  }
                  setPreviewInfantry(null);
                }}
              >
                <View style={styles.imageContainer}>
                  <ScrollView
                    horizontal
                    contentContainerStyle={styles.imageScrollContainer}
                    showsHorizontalScrollIndicator={false}
                    snapToAlignment="center"
                    snapToInterval={SCREEN_WIDTH * 0.8 + 20}
                    decelerationRate="fast"
                    centerContent={true}
                  >
                    {previewInfantry && renderPreviewCard(previewInfantry)}
                  </ScrollView>
                </View>
                <View style={styles.previewAboutSection}>
                  <Text style={styles.previewName}>{previewInfantry?.name || 'Unknown'}</Text>
                  <Text style={styles.previewDesc}>{previewInfantry?.description || 'No description available'}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('Closing preview modal');
                      if (currentSound) {
                        currentSound.pauseAsync().then(async () => {
                          try {
                            const status = await currentSound.getStatusAsync();
                            setPausedPosition(status.positionMillis || 0);
                            setIsPaused(true);
                          } catch (error) {
                            console.error('Error pausing sound on close button:', error);
                          }
                        }).catch((error) => console.error('Error pausing sound:', error));
                      }
                      setPreviewInfantry(null);
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
            onRequestClose={() => setDeleteModal({ visible: false, infantry: null })}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>{`Delete "${deleteModal.infantry?.name || ''}" and its image?`}</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalCancel}
                    onPress={() => setDeleteModal({ visible: false, infantry: null })}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalDelete}
                    onPress={() => deleteModal.infantry && confirmDelete(deleteModal.infantry.id)}
                  >
                    <Text style={styles.modalDeleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

// Styles
const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingTop: 50,
  },
  scroll: {
    paddingBottom: 20,
  },
  back: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(17,25,40,0.6)',
    padding: 10,
    borderRadius: 8,
    zIndex: 10,
  },
  backText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginVertical: 20,
    textShadowColor: '#FFD700', // Gold to match hardcoded border
    textShadowRadius: 15,
  },
  scrollWrapper: {
    width: SCREEN_WIDTH,
  },
  hScroll: {
    paddingHorizontal: horizontalSpacing,
    paddingVertical: verticalSpacing,
  },
  infantryCont: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  infantryCard: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.7)',
    elevation: 5,
  },
  clickable: (borderColor) => ({
    borderColor: borderColor || '#FFD700', // Default to gold
    borderWidth: 2,
  }),
  notClickable: {
    opacity: 0.7,
  },
  infantryImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1,
  },
  infantryName: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  disabledText: {
    fontSize: 12,
    color: '#FFD700', // Gold to match hardcoded border
    marginTop: 5,
    textAlign: 'center',
  },
  noInfantryText: {
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
    backgroundColor: '#FFC107',
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
    paddingVertical: 10,
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
    width: isDesktop ? windowWidth * 0.5 : SCREEN_WIDTH * 0.8,
    height: isDesktop ? SCREEN_HEIGHT * 0.6 : SCREEN_HEIGHT * 0.3,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    marginRight: 20,
  }),
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
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
    marginTop: 10,
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
});

export default InfantryScreen;