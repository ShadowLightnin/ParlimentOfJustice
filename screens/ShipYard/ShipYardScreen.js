import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
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

const ALLOWED_EMAILS = ['will@test.com', 'c1wcummings@gmail.com'];
const RESTRICT_ACCESS = true; // Enforce authentication and email check

// Simple helper for card border styles
const getBorderStyle = (borderColor) => ({
  borderColor: borderColor || 'rgba(250, 204, 21, 0.9)', // soft yellow
  borderWidth: 2,
});

const ShipYardScreen = () => {
  const navigation = useNavigation();
  const [previewShip, setPreviewShip] = useState(null);
  const [ships, setShips] = useState(hardcodedShips);
  const [deleteModal, setDeleteModal] = useState({ visible: false, ship: null });

  const canMod = RESTRICT_ACCESS
    ? auth.currentUser && ALLOWED_EMAILS.includes(auth.currentUser.email)
    : true;

  // 🔽 Info panel state + animation (like Titans)
  const [infoOpen, setInfoOpen] = useState(false);
  const infoAnim = useRef(new Animated.Value(0)).current;

  const toggleInfo = () => {
    if (infoOpen) {
      Animated.timing(infoAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start(() => {
        setInfoOpen(false);
      });
    } else {
      setInfoOpen(true);
      Animated.timing(infoAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  };

  // Fetch dynamic ships from Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'ships'),
      (snap) => {
        const dynamicShips = snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
          clickable: true,
          borderColor: docSnap.data().borderColor || 'blue',
          hardcoded: false,
        }));
        console.log('Fetched dynamic ships:', dynamicShips);
        setShips([...hardcodedShips, ...dynamicShips]);
      },
      (e) => {
        console.error('Firestore error:', e.message);
        Alert.alert('Error', 'Failed to fetch ships: ' + e.message);
      }
    );
    return () => unsub();
  }, []);

  const handleShipPress = (ship) => {
    if (!ship.clickable) return;

    if (ship.screen) {
      console.log('Navigating to screen:', ship.screen);
      navigation.navigate(ship.screen);
    } else {
      setPreviewShip(ship);
      console.log('Preview ship:', ship);
    }
  };

  const confirmDelete = async (id) => {
    if (!auth.currentUser || !ALLOWED_EMAILS.includes(auth.currentUser.email)) {
      Alert.alert('Access Denied', 'Only authorized users can delete ships.');
      return;
    }

    try {
      const ship = ships.find((s) => s.id === id);
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
          console.log('Raw imageUrl:', imageUrl);
          const urlParts = imageUrl.split('/o/');
          if (urlParts.length > 1) {
            path = decodeURIComponent(urlParts[1].split('?')[0]);
          }

          if (!path) {
            console.warn('No valid path extracted from imageUrl:', imageUrl);
          } else {
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
            `Failed to delete image from storage: ${e.message}. Ship will still be deleted.`
          );
        }
      }

      await deleteDoc(shipRef);
      console.log('Ship deleted from Firestore:', id);
      setShips((prev) => prev.filter((s) => s.id !== id));
      setDeleteModal({ visible: false, ship: null });
      Alert.alert('Success', 'Ship deleted successfully!');
    } catch (e) {
      console.error('Delete ship error:', e.message);
      Alert.alert('Error', `Failed to delete ship: ${e.message}`);
    }
  };

  // Render Each Ship Card
  const renderShipCard = (ship) => {
    const imageSource =
      ship.image ||
      (ship.imageUrl && ship.imageUrl !== 'placeholder'
        ? { uri: ship.imageUrl }
        : require('../../assets/ShipYard/PlaceHolder.jpg'));

    return (
      <View key={ship.id || ship.name} style={styles.shipCont}>
        <TouchableOpacity
          style={[
            styles.shipCard,
            {
              width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
              height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height,
            },
            ship.clickable ? getBorderStyle(ship.borderColor) : styles.notClickable,
          ]}
          onPress={() => handleShipPress(ship)}
          disabled={!ship.clickable}
          activeOpacity={0.9}
        >
          <Image source={imageSource} style={styles.shipImg} resizeMode="cover" />
          <View style={styles.cardOverlay} />
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
              onPress={() =>
                setDeleteModal({ visible: true, ship: { id: ship.id, name: ship.name } })
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

  // Render Preview Card
  const renderPreviewCard = (ship) => {
    const imageSource =
      ship.image ||
      (ship.imageUrl && ship.imageUrl !== 'placeholder'
        ? { uri: ship.imageUrl }
        : require('../../assets/ShipYard/PlaceHolder.jpg'));

    return (
      <TouchableOpacity
        style={[styles.previewCard(isDesktop, SCREEN_WIDTH), styles.previewBorder]}
        onPress={() => {
          console.log('Closing preview modal');
          setPreviewShip(null);
        }}
        activeOpacity={0.9}
      >
        <Image source={imageSource} style={styles.previewImage} resizeMode="contain" />
        <View style={styles.transparentOverlay} />
        <Text style={styles.cardName}>
          © {ship.name || 'Unknown'}; William Cummings
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/BackGround/ShipYard.jpg')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.screenOverlay}>
        {/* 🔵 Glassy header like Titans */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity
            onPress={() => {
              console.log('Navigating back');
              navigation.goBack();
            }}
            style={styles.back}
            activeOpacity={0.85}
          >
            <Text style={styles.backText}>⬅️ Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerTitle}
            onPress={toggleInfo}
            activeOpacity={0.9}
          >
            <View style={styles.headerGlass}>
              <Text style={styles.header}>Ship Yard</Text>
              <Text style={styles.headerSub}>
                Primary Shipyard for the Parliament at The Aegis Compound
              </Text>
              <Text style={styles.infoHint}>Tap for hangar lore ⬇</Text>
            </View>
          </TouchableOpacity>

          {/* Right side spacer (future button spot) */}
          <View style={{ width: 40 }} />
        </View>

        {/* 🔽 Info dropdown panel */}
        <Animated.View
          pointerEvents={infoOpen ? 'auto' : 'none'}
          style={[
            styles.infoPanelContainer,
            {
              opacity: infoAnim,
              transform: [
                {
                  translateY: infoAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {infoOpen && (
            <View style={styles.infoPanel}>
              <View style={styles.infoHeaderRow}>
                <Text style={styles.infoTitle}>Ship Yard</Text>
                <TouchableOpacity
                  onPress={toggleInfo}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Text style={styles.infoClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.infoText}>
                The Ship Yard is the central dock for Parliament capital ships,
                flagships, and personal vessels — from the USS Coalescence to
                experimental star-warp prototypes.
              </Text>

              <Text style={styles.infoLabel}>What it represents</Text>
              <Text style={styles.infoText}>
                Exploration, defense, and legacy. Every hull here carries a
                story — family names, fallen missions, and the future of Zion&apos;s
                reach into the stars.
              </Text>

              <Text style={styles.infoLabel}>Primary uses in the lore</Text>
              <Text style={styles.infoText}>
                • Deployment point for Parliament fleets{'\n'}
                • Safe harbor between cosmic campaigns{'\n'}
                • Museum bay for legendary starships and relic craft
              </Text>
            </View>
          )}
        </Animated.View>

        {/* Main content */}
        <ScrollView contentContainerStyle={styles.scroll}>
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

          {/* Preview Modal */}
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
                    centerContent
                  >
                    {previewShip && renderPreviewCard(previewShip)}
                  </ScrollView>
                </View>
                <View style={styles.previewAboutSection}>
                  <Text style={styles.previewName}>
                    {previewShip?.name || 'Unknown'}
                  </Text>
                  <Text style={styles.previewDesc}>
                    {previewShip?.description || 'No description available'}
                  </Text>
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

          {/* Delete Modal */}
          <Modal
            visible={deleteModal.visible}
            transparent
            animationType="slide"
            onRequestClose={() => setDeleteModal({ visible: false, ship: null })}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  {`Delete "${deleteModal.ship?.name || ''}" and its image?`}
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalCancel}
                    onPress={() => setDeleteModal({ visible: false, ship: null })}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalDelete}
                    onPress={() =>
                      deleteModal.ship && confirmDelete(deleteModal.ship.id)
                    }
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
  },

  // Full-screen dark glass overlay
  screenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(3, 7, 18, 0.78)', // deep navy glass
    paddingTop: 12,
  },

  // HEADER (matching Titans style)
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 8,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  back: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0, 40, 80, 0.85)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0, 200, 255, 0.6)',
  },
  backText: {
    color: '#E5F2FF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerGlass: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(0, 200, 255, 0.4)',
  },
  header: {
    fontSize: SCREEN_WIDTH > 600 ? 30 : 24,
    fontWeight: '900',
    color: '#F9FAFB',
    textAlign: 'center',
    textShadowColor: '#FACC15',
    textShadowRadius: 18,
    letterSpacing: 1,
  },
  headerSub: {
    marginTop: 2,
    fontSize: SCREEN_WIDTH > 600 ? 12 : 10,
    color: 'rgba(190, 240, 255, 0.9)',
    textAlign: 'center',
    letterSpacing: 0.4,
  },
  infoHint: {
    marginTop: 2,
    fontSize: 10,
    color: 'rgba(190, 240, 255, 0.9)',
    textAlign: 'center',
  },

  // Info dropdown panel
  infoPanelContainer: {
    position: 'absolute',
    top: 70,
    left: 12,
    right: 12,
    zIndex: 20,
  },
  infoPanel: {
    backgroundColor: 'rgba(1, 15, 30, 0.96)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(0, 200, 255, 0.85)',
  },
  infoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#EFFFFF',
  },
  infoClose: {
    fontSize: 16,
    color: '#A8E4FF',
  },
  infoLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#7CEBFF',
  },
  infoText: {
    fontSize: 12,
    color: '#CFEFFF',
    marginTop: 2,
    lineHeight: 16,
  },

  scroll: {
    paddingBottom: 20,
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

  // Glassy ship card
  shipCard: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(15, 23, 42, 0.85)', // navy glass
    elevation: 12,
    shadowColor: '#0EA5E9',
    shadowOpacity: 0.4,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  },

  notClickable: {
    opacity: 0.6,
  },

  shipImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // Soft dark overlay so text pops
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

  shipName: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    fontSize: 16,
    color: '#F9FAFB',
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowRadius: 8,
    zIndex: 2,
  },

  disabledText: {
    fontSize: 12,
    color: '#FACC15',
    marginTop: 5,
    textAlign: 'center',
  },

  noShipsText: {
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
    backgroundColor: 'rgba(234, 179, 8, 0.95)',
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

  // Preview modal background
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
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
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
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    marginRight: 20,
  }),

  previewBorder: {
    borderWidth: 1.5,
    borderColor: 'rgba(250, 204, 21, 0.85)', // softer yellow
  },

  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  cardName: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    fontSize: 15,
    color: '#F9FAFB',
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowRadius: 8,
    zIndex: 2,
  },

  previewAboutSection: {
    marginTop: 10,
    padding: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: 18,
    width: '90%',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.6)',
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

  // Delete modal
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

export default ShipYardScreen;
