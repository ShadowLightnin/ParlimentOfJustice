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
import EnlightenedInvite from '../EnlightenedInvite';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;

// Aliens data with images & respective screens
const hardcodedAliens = [
  { id: 'alien-1', name: 'Zorath', screen: '', image: require('../../../assets/BackGround/Aliens.jpg'), clickable: true, borderColor: '#c0c0c0', hardcoded: true, description: 'An extraterrestrial warlord from a distant galaxy.' },
];

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

const AliensScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAlien, setSelectedAlien] = useState(null);
  const [currentSound, setCurrentSound] = useState(null);
  const [aliens, setAliens] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ visible: false, alien: null });
  const [previewAlien, setPreviewAlien] = useState(null);
  const canMod = RESTRICT_ACCESS ? auth.currentUser && ALLOWED_EMAILS.includes(auth.currentUser.email) : true;

  // Fetch dynamic aliens from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'aliens'), (snap) => {
      // Check for duplicate IDs or names in Firestore
      const dynamicAliens = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        clickable: true,
        borderColor: doc.data().borderColor || '#c0c0c0',
        hardcoded: false,
      }));
      const idCounts = {};
      const nameCounts = {};
      dynamicAliens.forEach(a => {
        idCounts[a.id] = (idCounts[a.id] || 0) + 1;
        nameCounts[a.name] = (nameCounts[a.name] || 0) + 1;
      });
      Object.entries(idCounts).forEach(([id, count]) => {
        if (count > 1) console.warn(`Duplicate Firestore ID: ${id}, count: ${count}`);
      });
      Object.entries(nameCounts).forEach(([name, count]) => {
        if (count > 1) console.warn(`Duplicate Firestore name: ${name}, count: ${count}`);
      });
      console.log('Fetched dynamic aliens:', dynamicAliens.map(a => ({ id: a.id, name: a.name })));

      // Filter out dynamic aliens that match hardcodedAliens by id or name
      const filteredDynamic = dynamicAliens.filter(
        (dynamic) => !hardcodedAliens.some(
          (alien) => alien.id === dynamic.id || alien.name === dynamic.name
        )
      );
      console.log('Filtered dynamic aliens:', filteredDynamic.map(a => ({ id: a.id, name: a.name })));

      // Combine and deduplicate by id only
      const combinedMap = new Map();
      [...hardcodedAliens, ...filteredDynamic].forEach((alien) => {
        combinedMap.set(alien.id, alien);
      });
      const combined = Array.from(combinedMap.values());
      console.log('Combined aliens:', combined.map(a => ({ id: a.id, name: a.name })));
      setAliens(combined);
      console.log('Updated aliens state:', combined.map(a => ({ id: a.id, name: a.name })));
    }, (e) => {
      console.error('Firestore error:', e.message);
      Alert.alert('Error', 'Failed to fetch aliens: ' + e.message);
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
    try {
      if (alien.audio) {
        await playDemonSound(alien.audio, alien.screen);
      } else if (alien.screen) {
        console.log(`Navigating to ${alien.screen}`);
        navigation.navigate(alien.screen);
      } else if (alien.showSummonPopup) {
        console.log('Showing summon popup for:', alien.name || alien.codename || 'Unknown');
        setSelectedAlien(alien);
        setModalVisible(true);
      } else {
        console.log('Showing preview for alien:', alien.name || alien.codename || 'Unknown');
        setPreviewAlien(alien);
      }
    } catch (error) {
      console.error('Handle press error:', error.message);
      Alert.alert('Error', 'Failed to handle press: ' + error.message);
    }
  };

  const confirmDelete = async (id) => {
    if (!canMod) {
      Alert.alert('Access Denied', 'Only authorized users can delete aliens.');
      return;
    }
    try {
      const alienItem = aliens.find(a => a.id === id);
      if (alienItem.hardcoded) {
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
      await deleteDoc(alienRef);
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
      setDeleteModal({ visible: false, alien: null });
      Alert.alert('Success', 'Alien deleted!');
    } catch (e) {
      console.error('Delete alien error:', e.message);
      Alert.alert('Error', `Failed to delete alien: ${e.message}`);
    }
  };

  const renderAlienCard = (alien) => (
    <View key={alien.id} style={styles.alienCont}>
      <TouchableOpacity
        style={[
          styles.card,
          {
            width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
            height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height,
          },
          alien.clickable ? styles.clickable(alien.borderColor) : styles.notClickable,
        ]}
        onPress={() => handlePress(alien)}
        disabled={!alien.clickable}
      >
        <Image
          source={
            alien.image ||
            (alien.imageUrl && alien.imageUrl !== 'placeholder'
              ? { uri: alien.imageUrl }
              : require('../../../assets/BackGround/Aliens.jpg'))
          }
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        <Text style={styles.name}>{alien.name || alien.codename || 'Unknown'}</Text>
        {!alien.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
      </TouchableOpacity>
      {alien.hardcoded === false && (
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => setSelectedAlien({ ...alien, isEditing: true })}
            style={[styles.edit, !canMod && styles.disabled]}
            disabled={!canMod}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDeleteModal({ visible: true, alien: { id: alien.id, name: alien.name || alien.codename || 'Unknown' } })}
            style={[styles.delete, !canMod && styles.disabled]}
            disabled={!canMod}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderPreviewCard = (alien) => (
    <TouchableOpacity
      style={[styles.previewCard(isDesktop, SCREEN_WIDTH), styles.clickable(alien.borderColor || '#c0c0c0')]}
      onPress={() => {
        console.log('Closing preview modal');
        setPreviewAlien(null);
      }}
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
      <View style={styles.overlay} />
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
              console.log('Navigating to AliensTab');
              navigation.navigate('AliensTab');
            }}
          >
            <Text style={styles.header}>Aliens</Text>
          </TouchableOpacity>
          <View style={styles.scrollWrapper}>
            <ScrollView
              horizontal
              contentContainerStyle={styles.scrollContainer}
              showsHorizontalScrollIndicator={true}
            >
              {aliens.length > 0 ? (
                aliens.map(renderAlienCard)
              ) : (
                <Text style={styles.noAliensText}>No aliens available</Text>
              )}
            </ScrollView>
          </View>
          <EnlightenedInvite
            collectionPath="aliens"
            placeholderImage={require('../../../assets/BackGround/Aliens.jpg')}
            villain={aliens}
            setVillain={setAliens}
            hardcodedVillain={hardcodedAliens}
            editingVillain={selectedAlien?.isEditing ? selectedAlien : null}
            setEditingVillain={setSelectedAlien}
          />
        </ScrollView>
        <Modal
          visible={!!previewAlien && !previewAlien.isEditing}
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
                <Text style={styles.previewName}>{previewAlien?.name || previewAlien?.codename || 'Unknown'}</Text>
                <Text style={styles.previewDesc}>{previewAlien?.description || 'No description available'}</Text>
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
            </TouchableOpacity>
          </View>
        </Modal>
        <Modal
          visible={deleteModal.visible}
          transparent
          animationType="slide"
          onRequestClose={() => setDeleteModal({ visible: false, alien: null })}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{`Delete "${deleteModal.alien?.name || ''}" and its image?`}</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() => setDeleteModal({ visible: false, alien: null })}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalDelete}
                  onPress={() => deleteModal.alien && confirmDelete(deleteModal.alien.id)}
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
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.summonModalContainer}>
              <View style={styles.summonModalContent}>
                <Text style={styles.summonModalText}>
                  🔥 You have summoned: {selectedAlien?.name || selectedAlien?.codename || 'Unknown'} 🔥
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
    color: '#00b3ff',
    textAlign: 'center',
    textShadowColor: '#c0c0c0',
    textShadowRadius: 25,
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
  alienCont: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  card: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.7)',
    elevation: 5,
  },
  clickable: (borderColor) => ({
    borderColor: borderColor || '#c0c0c0',
    borderWidth: 2,
  }),
  notClickable: {
    opacity: 0.7,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1,
  },
  name: {
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
  noAliensText: {
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
    textShadowColor: '#c0c0c0',
    textShadowRadius: 15,
  },
});

export default AliensScreen;