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
import AddShipForm from './AddShipForm';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;

// Card dimensions for desktop and mobile
const cardSizes = {
  desktop: { width: 300, height: 450 },
  mobile: { width: 200, height: 300 },
};
const horizontalSpacing = isDesktop ? 20 : 10;
const verticalSpacing = isDesktop ? 20 : 10;

// Hardcoded ships data with images and border colors
const hardcodedShips = [
  { id: 'uss-coalescene', name: 'USS Coalescene', screen: '', image: require('../../assets/ShipYard/USSCoalescence.jpg'), clickable: true, borderColor: 'yellow', hardcoded: true, description: '' },
  { id: 'uss-angel-a', name: 'USS Angel-A', screen: '', image: require('../../assets/ShipYard/USSAngel-A.jpg'), clickable: true, borderColor: 'yellow', hardcoded: true, description: '' },
  { id: 'auroren', name: 'Auroren', screen: '', image: require('../../assets/ShipYard/Auroren.jpg'), clickable: true, borderColor: 'yellow', hardcoded: true, description: '' },
  { id: 'whale', name: 'Whale', screen: '', image: require('../../assets/ShipYard/Starship1.jpg'), clickable: true, borderColor: 'yellow', hardcoded: true, description: '' },
  { id: 'ecquisitor', name: 'Ecquisitor', screen: '', image: require('../../assets/ShipYard/Starship2.jpg'), clickable: true, borderColor: 'yellow', hardcoded: true, description: '' },
  { id: 'avenger', name: 'Avenger', screen: '', image: require('../../assets/ShipYard/Starship3.jpg'), clickable: true, borderColor: 'yellow', hardcoded: true, description: '' },
  { id: 'sky-tear', name: 'Sky Tear', screen: '', image: require('../../assets/ShipYard/Starship4.jpg'), clickable: true, borderColor: 'yellow', hardcoded: true, description: '' },
  { id: 'gaullion', name: 'Gaullion', screen: '', image: require('../../assets/ShipYard/Starship5.jpg'), clickable: true, borderColor: 'yellow', hardcoded: true, description: '' },
  { id: 'sovreign', name: 'Sovreign', screen: '', image: require('../../assets/ShipYard/Starship6.jpg'), clickable: true, borderColor: 'yellow', hardcoded: true, description: '' },
  { id: 'reaper', name: 'Reaper', screen: '', image: require('../../assets/ShipYard/Starship7.jpg'), clickable: true, borderColor: 'yellow', hardcoded: true, description: '' },
  { id: 'ambassador', name: 'Ambassador', screen: '', image: require('../../assets/ShipYard/Starship8.jpg'), clickable: true, borderColor: 'yellow', hardcoded: true, description: '' },
  { id: 'star-hunter', name: 'Star Hunter', screen: '', image: require('../../assets/ShipYard/Starship9.jpg'), clickable: true, borderColor: 'yellow', hardcoded: true, description: '' },
  { id: 'solar-ray', name: 'Solar Ray', screen: '', image: require('../../assets/ShipYard/Starship10.jpg'), clickable: true, borderColor: 'yellow', hardcoded: true, description: '' },
  { id: 'uss-stritan', name: 'USS Stritan', screen: '', image: require('../../assets/ShipYard/Starship11.jpg'), clickable: true, borderColor: 'yellow', hardcoded: true, description: '' },
  { id: 'uss-elegance', name: 'USS Elegance', screen: '', image: require('../../assets/ShipYard/Starship12.jpg'), clickable: true, borderColor: 'yellow', hardcoded: true, description: '' },
  { id: 'basktion', name: 'Basktion', screen: '', image: require('../../assets/ShipYard/Starship13.jpg'), clickable: true, borderColor: 'yellow', hardcoded: true, description: '' },
];

const ALLOWED_EMAILS = ["will@test.com", "c1wcummings@gmail.com"];
const RESTRICT_ACCESS = true; // Enforce authentication and email check

const ShipYardScreen = () => {
  const navigation = useNavigation();
  const [previewShip, setPreviewShip] = useState(null);
  const [ships, setShips] = useState(hardcodedShips);
  const [deleteModal, setDeleteModal] = useState({ visible: false, ship: null });
  const canMod = RESTRICT_ACCESS ? auth.currentUser && ALLOWED_EMAILS.includes(auth.currentUser.email) : true;

  // Fetch dynamic ships from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'ships'), (snap) => {
      const dynamicShips = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        clickable: true,
        borderColor: doc.data().borderColor || 'blue',
        hardcoded: false,
      }));
      console.log('Fetched dynamic ships:', dynamicShips);
      setShips([...hardcodedShips, ...dynamicShips]);
    }, (e) => {
      console.error('Firestore error:', e.message);
      Alert.alert('Error', 'Failed to fetch ships: ' + e.message);
    });
    return () => unsub();
  }, []);

  const handleShipPress = (ship) => {
    if (ship.clickable) {
      if (ship.screen) {
        console.log('Navigating to screen:', ship.screen);
        navigation.navigate(ship.screen);
      } else {
        setPreviewShip(ship);
        console.log('Preview ship:', ship);
      }
    }
  };

  const confirmDelete = async (id) => {
    if (!auth.currentUser || !ALLOWED_EMAILS.includes(auth.currentUser.email)) {
      Alert.alert('Access Denied', 'Only authorized users can delete ships.');
      return;
    }
    try {
      const ship = ships.find(s => s.id === id);
      if (ship.hardcoded) {
        Alert.alert('Error', 'Cannot delete hardcoded ships!');
        return;
      }
      const shipRef = doc(db, 'ships', id);
      const snap = await getDoc(shipRef);
      if (!snap.exists()) {
        Alert.alert('Error', 'Ship not found');
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
          Alert.alert('Warning', `Failed to delete image from storage: ${e.message}. Ship will still be deleted.`);
          // Continue with Firestore deletion even if image deletion fails
        }
      }
      await deleteDoc(shipRef);
      console.log('Ship deleted from Firestore:', id);
      setShips(ships.filter(s => s.id !== id));
      setDeleteModal({ visible: false, ship: null });
      Alert.alert('Success', 'Ship deleted successfully!');
    } catch (e) {
      console.error('Delete ship error:', e.message);
      Alert.alert('Error', `Failed to delete ship: ${e.message}`);
    }
  };

  // Render Each Ship Card
  const renderShipCard = (ship) => (
    <View key={ship.id || ship.name} style={styles.shipCont}>
      <TouchableOpacity
        style={[
          styles.shipCard,
          {
            width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
            height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height,
          },
          ship.clickable && ship.borderColor ? styles.clickable(ship.borderColor) : styles.notClickable,
        ]}
        onPress={() => handleShipPress(ship)}
        disabled={!ship.clickable}
      >
        <Image
          source={ship.image || (ship.imageUrl && ship.imageUrl !== 'placeholder' ? { uri: ship.imageUrl } : require('../../assets/ShipYard/PlaceHolder.jpg'))}
          style={styles.shipImg}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        <Text style={styles.shipName}>{ship.name}</Text>
        {!ship.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
      </TouchableOpacity>
      {!ship.hardcoded && (
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => setPreviewShip({ ...ship, isEditing: true })}
            style={[styles.edit, !canMod && styles.disabled]}
            disabled={!canMod}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDeleteModal({ visible: true, ship: { id: ship.id, name: ship.name } })}
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
  const renderPreviewCard = (ship) => (
    <TouchableOpacity
      style={[styles.previewCard(isDesktop, SCREEN_WIDTH), styles.clickable]}
      onPress={() => {
        console.log('Closing preview modal');
        setPreviewShip(null);
      }}
    >
      <Image
        source={ship.image || (ship.imageUrl && ship.imageUrl !== 'placeholder' ? { uri: ship.imageUrl } : require('../../assets/ShipYard/PlaceHolder.jpg'))}
        style={styles.previewImage}
        resizeMode="contain"
      />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {ship.name || 'Unknown'}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/BackGround/ShipYard.jpg')}
      style={styles.bg}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          onPress={() => {
            console.log('Navigating back');
            navigation.goBack();
          }}
          style={styles.back}
        >
          <Text style={styles.backText}>⬅️</Text>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.header}>Ship Yard</Text>
          <View style={styles.scrollWrapper}>
            <ScrollView
              horizontal
              contentContainerStyle={styles.hScroll}
              showsHorizontalScrollIndicator={false}
            >
              {ships.length > 0 ? (
                ships.map(renderShipCard)
              ) : (
                <Text style={styles.noShipsText}>No ships available</Text>
              )}
            </ScrollView>
          </View>
          <AddShipForm
            collectionPath="ships"
            placeholderImage={require('../../assets/ShipYard/PlaceHolder.jpg')}
            ships={ships}
            setShips={setShips}
            hardcodedShips={hardcodedShips}
            editingShip={previewShip?.isEditing ? previewShip : null}
            setEditingShip={setPreviewShip}
          />
          <Modal
            visible={!!previewShip && !previewShip.isEditing}
            transparent
            animationType="fade"
            onRequestClose={() => {
              console.log('Closing preview modal');
              setPreviewShip(null);
            }}
          >
            <View style={styles.modalBackground}>
              <TouchableOpacity
                style={styles.modalOuterContainer}
                activeOpacity={1}
                onPress={() => {
                  console.log('Closing preview modal');
                  setPreviewShip(null);
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
                    {previewShip && renderPreviewCard(previewShip)}
                  </ScrollView>
                </View>
                <View style={styles.previewAboutSection}>
                  <Text style={styles.previewName}>{previewShip?.name || 'Unknown'}</Text>
                  <Text style={styles.previewDesc}>{previewShip?.description || 'No description available'}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('Closing preview modal');
                      setPreviewShip(null);
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
            onRequestClose={() => setDeleteModal({ visible: false, ship: null })}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>{`Delete "${deleteModal.ship?.name || ''}" and its image?`}</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalCancel}
                    onPress={() => setDeleteModal({ visible: false, ship: null })}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalDelete}
                    onPress={() => deleteModal.ship && confirmDelete(deleteModal.ship.id)}
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
    textShadowColor: 'yellow',
    textShadowRadius: 15,
  },
  scrollWrapper: {
    width: SCREEN_WIDTH,
  },
  hScroll: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  shipCont: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  shipCard: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.7)',
    elevation: 5,
  },
  clickable: (borderColor) => ({
    borderColor: borderColor || 'yellow',
    borderWidth: 2,
  }),
  notClickable: {
    opacity: 0.7,
  },
  shipImg: {
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
  shipName: {
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
  noShipsText: {
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

export default ShipYardScreen;