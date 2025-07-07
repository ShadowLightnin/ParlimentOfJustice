import React, { useState, useEffect } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { db, auth, storage } from '../../lib/firebase';
import { collection, onSnapshot, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import EnlightenedInvite from './EnlightenedInvite';

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

// Hardcoded villains data with images, red border color
const hardcodedVillains = [
  { id: 'villain-1', name: 'BlackOut', screen: '', image: require('../../assets/Villains/BlackOut.jpg'), clickable: true, borderColor: 'red', hardcoded: true, description: "Red Murcury's personal assassin." },
  { id: 'villain-2', name: 'Void Consumer', screen: '', image: require('../../assets/Villains/VoidConsumer.jpg'), clickable: true, borderColor: 'red', hardcoded: true, description: "Her hunger is endless." },
];

const ALLOWED_EMAILS = ["will@test.com", "c1wcummings@gmail.com"];
const RESTRICT_ACCESS = true; // Restrict edit/delete to ALLOWED_EMAILS

const VillainyScreen = () => {
  const navigation = useNavigation();
  const [previewVillain, setPreviewVillain] = useState(null);
  const [villains, setVillains] = useState(hardcodedVillains);
  const [deleteModal, setDeleteModal] = useState({ visible: false, villain: null });
  const canMod = RESTRICT_ACCESS ? auth.currentUser && ALLOWED_EMAILS.includes(auth.currentUser.email) : true;

  // Fetch dynamic villains from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'villain'), (snap) => {
      const dynamicVillains = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        clickable: true,
        borderColor: doc.data().borderColor || 'gold', // Gold for dynamic
        hardcoded: false,
      }));
      console.log('Fetched dynamic villains:', dynamicVillains);
      setVillains([...hardcodedVillains, ...dynamicVillains]);
    }, (e) => {
      console.error('Firestore error:', e.message);
      Alert.alert('Error', 'Failed to fetch villains: ' + e.message);
    });
    return () => unsub();
  }, []);

  const handleVillainPress = (villain) => {
    if (villain.clickable) {
      if (villain.screen) {
        console.log('Navigating to screen:', villain.screen);
        navigation.navigate(villain.screen);
      } else {
        console.log('Showing preview for villain:', villain.name || villain.codename || 'Unknown');
        setPreviewVillain(villain);
      }
    }
  };

  const confirmDelete = async (id) => {
    if (!auth.currentUser || !ALLOWED_EMAILS.includes(auth.currentUser.email)) {
      Alert.alert('Access Denied', 'Only authorized users can delete villains.');
      return;
    }
    try {
      const villainItem = villains.find(v => v.id === id);
      if (villainItem.hardcoded) {
        Alert.alert('Error', 'Cannot delete hardcoded villains!');
        return;
      }
      const villainRef = doc(db, 'villain', id);
      const snap = await getDoc(villainRef);
      if (!snap.exists()) {
        Alert.alert('Error', 'Villain not found');
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
          Alert.alert('Warning', `Failed to delete image from storage: ${e.message}. Villain will still be deleted.`);
          // Continue with Firestore deletion even if image deletion fails
        }
      }
      await deleteDoc(villainRef);
      console.log('Villain deleted from Firestore:', id);
      setVillains(villains.filter(v => v.id !== id));
      setDeleteModal({ visible: false, villain: null });
      Alert.alert('Success', 'Villain deleted successfully!');
    } catch (e) {
      console.error('Delete villain error:', e.message);
      Alert.alert('Error', `Failed to delete villain: ${e.message}`);
    }
  };

  // Render Each Villain Card
  const renderVillainCard = (villain) => (
    <View key={villain.id || villain.name || villain.codename || villain.image.toString()} style={styles.villainCont}>
      <TouchableOpacity
        style={[
          styles.villainCard,
          {
            width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
            height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height,
          },
          villain.clickable && villain.borderColor ? styles.clickable(villain.borderColor) : styles.notClickable,
        ]}
        onPress={() => handleVillainPress(villain)}
        disabled={!villain.clickable}
      >
        <Image
          source={villain.image || (villain.imageUrl && villain.imageUrl !== 'placeholder' ? { uri: villain.imageUrl } : require('../../assets/Armor/PlaceHolder.jpg'))}
          style={styles.villainImg}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        <Text style={styles.villainName}>{villain.name || villain.codename || 'Unknown'}</Text>
        {!villain.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
      </TouchableOpacity>
      {!villain.hardcoded && (
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => setPreviewVillain({ ...villain, isEditing: true })}
            style={[styles.edit, !canMod && styles.disabled]}
            disabled={!canMod}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDeleteModal({ visible: true, villain: { id: villain.id, name: villain.name || villain.codename || 'Unknown' } })}
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
  const renderPreviewCard = (villain) => (
    <TouchableOpacity
      style={[styles.previewCard(isDesktop, SCREEN_WIDTH), styles.clickable(villain.borderColor || 'red')]}
      onPress={() => {
        console.log('Closing preview modal');
        setPreviewVillain(null);
      }}
    >
      <Image
        source={villain.image || (villain.imageUrl && villain.imageUrl !== 'placeholder' ? { uri: villain.imageUrl } : require('../../assets/Armor/PlaceHolder.jpg'))}
        style={styles.previewImage}
        resizeMode="cover"
      />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {villain.name || villain.codename || 'Unknown'}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Villains.jpg')}
      style={styles.bg}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          onPress={() => {
            console.log('Navigating to Home');
            navigation.navigate('Home');
          }}
          style={styles.back}
        >
          <Text style={styles.backText}>⬅️ Back</Text>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scroll}>
          <TouchableOpacity
            onPress={() => {
              console.log('Navigating to VillainsTab');
              navigation.navigate('VillainsTab');
            }}
          >
            <Text style={styles.header}>Villains</Text>
          </TouchableOpacity>
          <View style={styles.scrollWrapper}>
            <ScrollView
              horizontal
              contentContainerStyle={styles.hScroll}
              showsHorizontalScrollIndicator={true}
            >
              {villains.length > 0 ? (
                villains.map(renderVillainCard)
              ) : (
                <Text style={styles.noVillainsText}>No villains available</Text>
              )}
            </ScrollView>
          </View>
          <EnlightenedInvite
            collectionPath="villain"
            placeholderImage={require('../../assets/Armor/PlaceHolder.jpg')}
            villain={villains}
            setVillain={setVillains}
            hardcodedVillain={hardcodedVillains}
            editingVillain={previewVillain?.isEditing ? previewVillain : null}
            setEditingVillain={setPreviewVillain}
          />
          <Modal
            visible={!!previewVillain && !previewVillain.isEditing}
            transparent
            animationType="fade"
            onRequestClose={() => {
              console.log('Closing preview modal');
              setPreviewVillain(null);
            }}
          >
            <View style={styles.modalBackground}>
              <TouchableOpacity
                style={styles.modalOuterContainer}
                activeOpacity={1}
                onPress={() => {
                  console.log('Closing preview modal');
                  setPreviewVillain(null);
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
                    {previewVillain && renderPreviewCard(previewVillain)}
                  </ScrollView>
                </View>
                <View style={styles.previewAboutSection}>
                  <Text style={styles.previewName}>{previewVillain?.name || previewVillain?.codename || 'Unknown'}</Text>
                  <Text style={styles.previewDesc}>{previewVillain?.description || 'No description available'}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('Closing preview modal');
                      setPreviewVillain(null);
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
            onRequestClose={() => setDeleteModal({ visible: false, villain: null })}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>{`Delete "${deleteModal.villain?.name || ''}" and its image?`}</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalCancel}
                    onPress={() => setDeleteModal({ visible: false, villain: null })}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalDelete}
                    onPress={() => deleteModal.villain && confirmDelete(deleteModal.villain.id)}
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingTop: 40,
    alignItems: 'center',
  },
  scroll: {
    paddingBottom: 20,
  },
  back: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#750000',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 5,
  },
  backText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'rgba(63, 0, 0, 0.897)',
    textAlign: 'center',
    textShadowColor: '#ff4d4dff',
    textShadowRadius: 20,
    marginBottom: 20,
  },
  scrollWrapper: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  hScroll: {
    flexDirection: 'row',
    paddingHorizontal: horizontalSpacing,
    paddingVertical: verticalSpacing,
    alignItems: 'center',
  },
  villainCont: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  villainCard: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.7)',
    elevation: 5,
  },
  clickable: (borderColor) => ({
    borderColor: borderColor || 'red',
    borderWidth: 2,
  }),
  notClickable: {
    opacity: 0.7,
  },
  villainImg: {
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
  villainName: {
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
  noVillainsText: {
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
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
});

export default VillainyScreen;