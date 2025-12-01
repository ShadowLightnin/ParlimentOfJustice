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
  const [isPlaying, setIsPlaying] = useState(false);
  const canMod = RESTRICT_ACCESS ? auth.currentUser && ALLOWED_EMAILS.includes(auth.currentUser.email) : true;

  // Initialize sound on mount
  // Handle music playback
  const playTheme = async () => {
    if (!currentSound) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/audio/ForDemocracy.mp4'),
          { shouldPlay: true, isLooping: true, volume: 1.0 }
        );
        setCurrentSound(sound);
        await sound.playAsync();
        setIsPlaying(true);
        console.log('ForDemocracy.mp4 started playing at:', new Date().toISOString());
      } catch (error) {
        console.error('Failed to load audio file:', error);
        Alert.alert('Audio Error', 'Failed to load background music. Please check the audio file path: ../../assets/audio/ForDemocracy.mp4');
      }
    } else if (!isPlaying) {
      try {
        await currentSound.playAsync();
        setIsPlaying(true);
        console.log('Audio resumed at:', new Date().toISOString());
      } catch (error) {
        console.error('Error resuming sound:', error);
      }
    }
  };

  // Handle music pause
  const pauseTheme = async () => {
    if (currentSound && isPlaying) {
      try {
        await currentSound.pauseAsync();
        setIsPlaying(false);
        console.log('Audio paused at:', new Date().toISOString());
      } catch (error) {
        console.error('Error pausing sound:', error);
      }
    }
  };

  // Handle screen focus to resume/pause audio
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (currentSound) {
          currentSound.stopAsync().catch((error) => console.error('Error stopping sound:', error));
          currentSound.unloadAsync().catch((error) => console.error('Error unloading sound:', error));
          setCurrentSound(null);
          setIsPlaying(false);
          console.log('ForDemocracy.mp4 stopped at:', new Date().toISOString());
        }
      };
    }, [currentSound])
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
          await currentSound.stopAsync();
          await currentSound.unloadAsync();
          setCurrentSound(null);
          setIsPlaying(false);
          console.log('ForDemocracy.mp4 stopped at:', new Date().toISOString());
        } catch (error) {
          console.error('Error stopping/unloading sound:', error);
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
          Alert.alert('Warning', `Failed to delete image from storage: ${e.message}. Commander will still be deleted.`);
          // Continue with Firestore deletion even if image deletion fails
        }
      }
      await deleteDoc(infantryRef);
      console.log('Commander deleted from Firestore:', id);
      setInfantry(infantry.filter(i => i.id !== id));
      setDeleteModal({ visible: false, infantry: null });
      Alert.alert('Success', 'Commander deleted successfully!');
    } catch (e) {
      console.error('Delete Commander error:', e.message);
      Alert.alert('Error', `Failed to delete Commander: ${e.message}`);
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
        <View style={styles.cardOverlay} />
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
          currentSound.stopAsync().then(async () => {
            try {
              await currentSound.unloadAsync();
              setCurrentSound(null);
              setIsPlaying(false);
              console.log('ForDemocracy.mp4 stopped at:', new Date().toISOString());
            } catch (error) {
              console.error('Error unloading sound on preview close:', error);
            }
          }).catch((error) => console.error('Error stopping sound:', error));
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
      <View style={styles.screenOverlay}>
        <TouchableOpacity
          onPress={() => {
            console.log('Navigating back');
            if (currentSound) {
              currentSound.stopAsync().then(async () => {
                try {
                  await currentSound.unloadAsync();
                  setCurrentSound(null);
                  setIsPlaying(false);
                  console.log('ForDemocracy.mp4 stopped at:', new Date().toISOString());
                } catch (error) {
                  console.error('Error unloading sound on back:', error);
                }
              }).catch((error) => console.error('Error stopping sound:', error));
            }
            navigation.goBack();
          }}
          style={styles.back}
        >
          <Text style={styles.backText}>⬅️</Text>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.header}>Command Eagle Rapid Response Team</Text>
          <View style={styles.musicControls}>
            <TouchableOpacity style={styles.musicButton} onPress={playTheme}>
              <Text style={styles.musicButtonText}>
                {isPlaying ? 'Playing…' : 'Theme'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.musicButton} onPress={pauseTheme}>
              <Text style={styles.musicButtonText}>Pause</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.scrollWrapper}>
            <ScrollView
              horizontal
              contentContainerStyle={styles.hScroll}
              showsHorizontalScrollIndicator={false}
            >
              {infantry.length > 0 ? (
                infantry.map(renderInfantryCard)
              ) : (
                <Text style={styles.noInfantryText}>No Commander available</Text>
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
                currentSound.stopAsync().then(async () => {
                  try {
                    await currentSound.unloadAsync();
                    setCurrentSound(null);
                    setIsPlaying(false);
                    console.log('ForDemocracy.mp4 stopped at:', new Date().toISOString());
                  } catch (error) {
                    console.error('Error unloading sound on modal close:', error);
                  }
                }).catch((error) => console.error('Error stopping sound:', error));
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
                    currentSound.stopAsync().then(async () => {
                      try {
                        await currentSound.unloadAsync();
                        setCurrentSound(null);
                        setIsPlaying(false);
                        console.log('ForDemocracy.mp4 stopped at:', new Date().toISOString());
                      } catch (error) {
                        console.error('Error unloading sound on modal outer press:', error);
                      }
                    }).catch((error) => console.error('Error stopping sound:', error));
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
                        currentSound.stopAsync().then(async () => {
                          try {
                            await currentSound.unloadAsync();
                            setCurrentSound(null);
                            setIsPlaying(false);
                            console.log('ForDemocracy.mp4 stopped at:', new Date().toISOString());
                          } catch (error) {
                            console.error('Error unloading sound on close button:', error);
                          }
                        }).catch((error) => console.error('Error stopping sound:', error));
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

  // Full-screen dark glass overlay
  screenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 7, 18, 0.8)', // deep navy glass
    paddingTop: 50,
  },

  scroll: {
    paddingBottom: 20,
  },

  back: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    padding: 10,
    borderRadius: 999,
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.7)',
  },
  backText: {
    color: '#E5F2FF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  header: {
    fontSize: 30,
    fontWeight: '900',
    color: '#F9FAFB',
    textAlign: 'center',
    marginVertical: 20,
    textShadowColor: '#FACC15', // warm gold glow
    textShadowRadius: 22,
    letterSpacing: 1,
  },

  // Music buttons – glassy pills
  musicControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 10,
  },
  musicButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(250, 204, 21, 0.65)', // soft gold
  },
  musicButtonText: {
    fontSize: 12,
    color: '#FACC15',
    fontWeight: 'bold',
    letterSpacing: 0.5,
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

  // Glassy infantry card
  infantryCard: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(15, 23, 42, 0.9)', // navy glass
    elevation: 12,
    shadowColor: '#FACC15',
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },

  clickable: (borderColor) => ({
    borderColor: borderColor || '#FACC15', // default gold
    borderWidth: 2,
  }),

  notClickable: {
    opacity: 0.6,
  },

  infantryImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // Soft overlay on the card image so text pops
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    zIndex: 1,
  },

  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 1,
  },

  infantryName: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    fontSize: 16,
    color: '#F9FAFB',
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowRadius: 8,
    zIndex: 2,
  },

  disabledText: {
    fontSize: 12,
    color: '#FACC15',
    marginTop: 5,
    textAlign: 'center',
  },

  noInfantryText: {
    fontSize: 16,
    color: '#E5F2FF',
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
    backgroundColor: 'rgba(234, 179, 8, 0.95)', // amber
    padding: 6,
    borderRadius: 999,
    flex: 1,
    marginRight: 6,
    alignItems: 'center',
  },
  delete: {
    backgroundColor: 'rgba(239, 68, 68, 0.95)',
    padding: 6,
    borderRadius: 999,
    flex: 1,
    marginLeft: 6,
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  buttonText: {
    color: '#F9FAFB',
    fontWeight: '700',
    fontSize: 13,
  },

  // Preview modal – dark glass
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
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
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    alignItems: 'center',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  imageScrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Glassy preview card
  previewCard: (isDesktopValue, windowWidth) => ({
    width: isDesktopValue ? windowWidth * 0.5 : SCREEN_WIDTH * 0.8,
    height: isDesktopValue ? SCREEN_HEIGHT * 0.6 : SCREEN_HEIGHT * 0.35,
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    marginRight: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(250, 204, 21, 0.85)', // soft gold frame
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
    right: 10,
    fontSize: 15,
    color: '#F9FAFB',
    fontWeight: '700',
    zIndex: 2,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowRadius: 8,
  },

  previewAboutSection: {
    marginTop: 10,
    padding: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.98)',
    borderRadius: 18,
    width: '90%',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.7)',
  },
  previewName: {
    fontSize: 18,
    color: '#E5F2FF',
    textAlign: 'center',
    fontWeight: '700',
  },
  previewDesc: {
    fontSize: 14,
    color: '#E5E7EB',
    textAlign: 'center',
    marginVertical: 10,
  },
  close: {
    backgroundColor: '#0EA5E9',
    paddingVertical: 8,
    paddingHorizontal: 22,
    borderRadius: 999,
    alignSelf: 'center',
    marginTop: 6,
  },

  // Delete confirmation modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(248, 250, 252, 0.98)',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    width: '85%',
    maxWidth: 420,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.7)',
  },
  modalText: {
    fontSize: 18,
    color: '#0F172A',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  modalCancel: {
    backgroundColor: '#0EA5E9',
    padding: 10,
    borderRadius: 999,
    flex: 1,
    marginRight: 10,
  },
  modalCancelText: {
    color: '#F9FAFB',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalDelete: {
    backgroundColor: '#EF4444',
    padding: 10,
    borderRadius: 999,
    flex: 1,
    marginLeft: 10,
  },
  modalDeleteText: {
    color: '#F9FAFB',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default InfantryScreen;