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

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;

// Varied card dimensions for chaotic feel
const cardSizes = {
  desktop: { width: [350, 400, 450], height: [500, 550, 600] },
  mobile: { width: [300, 350, 400], height: [450, 500, 550] },
};
const horizontalSpacing = isDesktop ? [20, 30, 40] : [10, 15, 20];
const verticalSpacing = isDesktop ? [30, 40, 50] : [20, 25, 30];

// Hardcoded vigilantes data with broken theme
const hardcodedVigilantes = [
//   { id: 'vig-1', name: '', screen: '', image: require('../../assets/Armor/BatmanBroken.jpg'), clickable: true, borderColor: '#8B0000', hardcoded: true, description: 'Shattered protector' },
//   { id: 'vig-2', name: '', screen: '', image: require('../../assets/Armor/DarkVigilante.jpg'), clickable: true, borderColor: '#4B0082', hardcoded: true, description: 'Lost in shadows' },
];

const ALLOWED_EMAILS = ["will@test.com", "c1wcummings@gmail.com"];
const RESTRICT_ACCESS = true; // Restrict edit/delete to ALLOWED_EMAILS

const VigilanteScreen = () => {
  const navigation = useNavigation();
  const [previewVigilante, setPreviewVigilante] = useState(null);
  const [vigilantes, setVigilantes] = useState(hardcodedVigilantes);
  const [deleteModal, setDeleteModal] = useState({ visible: false, vigilante: null });
  const canMod = RESTRICT_ACCESS ? auth.currentUser && ALLOWED_EMAILS.includes(auth.currentUser.email) : true;

  // Fetch dynamic vigilantes from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'vigilante'), (snap) => {
      const dynamicVigilantes = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        clickable: true,
        borderColor: doc.data().borderColor || '#C0C0C0', // Silver for dynamic
        hardcoded: false,
      }));
      console.log('Fetched dynamic vigilantes:', dynamicVigilantes);
      setVigilantes([...hardcodedVigilantes, ...dynamicVigilantes]);
    }, (e) => {
      console.error('Firestore error:', e.message);
      Alert.alert('Error', 'Failed to fetch vigilantes: ' + e.message);
    });
    return () => unsub();
  }, []);

  const handleVigilantePress = (vigilante) => {
    if (vigilante.clickable) {
      if (vigilante.screen) {
        console.log('Navigating to screen:', vigilante.screen);
        navigation.navigate(vigilante.screen);
      } else {
        console.log('Showing preview for vigilante:', vigilante.name || vigilante.codename || 'Unknown');
        setPreviewVigilante(vigilante);
      }
    }
  };

  const confirmDelete = async (id) => {
    if (!auth.currentUser || !ALLOWED_EMAILS.includes(auth.currentUser.email)) {
      Alert.alert('Access Denied', 'Only authorized users can delete vigilantes.');
      return;
    }
    try {
      const vigilanteItem = vigilantes.find(v => v.id === id);
      if (vigilanteItem.hardcoded) {
        Alert.alert('Error', 'Cannot delete hardcoded vigilantes!');
        return;
      }
      const vigilanteRef = doc(db, 'vigilante', id);
      const snap = await getDoc(vigilanteRef);
      if (!snap.exists()) {
        Alert.alert('Error', 'Vigilante not found');
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
            await deleteObject(ref(storage, path)).catch(e => {
              if (e.code !== 'storage/object-not-found') {
                throw e;
              }
              console.warn('Image not found in storage:', path);
            });
            console.log('Image deleted or not found:', path);
          }
        } catch (e) {
          console.error('Delete image error:', e.message, 'Path:', path, 'URL:', imageUrl);
          Alert.alert('Warning', `Failed to delete image from storage: ${e.message}. Vigilante will still be deleted.`);
        }
      }
      await deleteDoc(vigilanteRef);
      console.log('Vigilante deleted from Firestore:', id);
      setVigilantes(vigilantes.filter(v => v.id !== id));
      setDeleteModal({ visible: false, vigilante: null });
      Alert.alert('Success', 'Vigilante deleted successfully!');
    } catch (e) {
      console.error('Delete vigilante error:', e.message);
      Alert.alert('Error', `Failed to delete vigilante: ${e.message}`);
    }
  };

  // Render Each Vigilante Card
  const renderVigilanteCard = (vigilante) => {
    const randomWidthIdx = Math.floor(Math.random() * cardSizes[isDesktop ? 'desktop' : 'mobile'].width.length);
    const randomHeightIdx = Math.floor(Math.random() * cardSizes[isDesktop ? 'desktop' : 'mobile'].height.length);
    const randomHSpacingIdx = Math.floor(Math.random() * horizontalSpacing.length);
    const randomVSpacingIdx = Math.floor(Math.random() * verticalSpacing.length);

    return (
      <View key={vigilante.id || vigilante.name || vigilante.codename || vigilante.image.toString()} style={[styles.vigilanteCont, { marginLeft: Math.random() * 20 }]}>
        <TouchableOpacity
          style={[
            styles.vigilanteCard,
            {
              width: cardSizes[isDesktop ? 'desktop' : 'mobile'].width[randomWidthIdx],
              height: cardSizes[isDesktop ? 'desktop' : 'mobile'].height[randomHeightIdx],
            },
            vigilante.clickable && vigilante.borderColor ? styles.clickable(vigilante.borderColor) : styles.notClickable,
          ]}
          onPress={() => handleVigilantePress(vigilante)}
          disabled={!vigilante.clickable}
        >
          <Image
            source={vigilante.image || (vigilante.imageUrl && vigilante.imageUrl !== 'placeholder' ? { uri: vigilante.imageUrl } : require('../../assets/Armor/PlaceHolder.jpg'))}
            style={styles.vigilanteImg}
            resizeMode="cover"
          />
          <View style={styles.overlay} />
          <Text style={[styles.vigilanteName, { marginLeft: Math.random() * 10 }]}>{vigilante.name || vigilante.codename || 'Broken'}</Text>
          {!vigilante.clickable && <Text style={styles.disabledText}>Unusable</Text>}
        </TouchableOpacity>
        {!vigilante.hardcoded && (
          <View style={[styles.buttons, { marginTop: Math.random() * 15 }]}>
            <TouchableOpacity
              onPress={() => setPreviewVigilante({ ...vigilante, isEditing: true })}
              style={[styles.edit, !canMod && styles.disabled]}
              disabled={!canMod}
            >
              <Text style={styles.buttonText}>Fix</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setDeleteModal({ visible: true, vigilante: { id: vigilante.id, name: vigilante.name || vigilante.codename || 'Broken' } })}
              style={[styles.delete, !canMod && styles.disabled]}
              disabled={!canMod}
            >
              <Text style={styles.buttonText}>Destroy</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };

  // Render Preview Card
  const renderPreviewCard = (vigilante) => (
    <TouchableOpacity
      style={[styles.previewCard(isDesktop, SCREEN_WIDTH), styles.clickable(vigilante.borderColor || '#C0C0C0')]}
      onPress={() => {
        console.log('Closing preview modal');
        setPreviewVigilante(null);
      }}
    >
      <Image
        source={vigilante.image || (vigilante.imageUrl && vigilante.imageUrl !== 'placeholder' ? { uri: vigilante.imageUrl } : require('../../assets/Armor/PlaceHolder.jpg'))}
        style={styles.previewImage}
        resizeMode="cover"
      />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {vigilante.name || vigilante.codename || 'Shattered'}; Broken Legacy
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Vigilantes.jpg')} // Darker background
      style={styles.bg}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          onPress={() => {
            console.log('Navigating to Justice');
            navigation.navigate('Justice');
          }}
          style={styles.back}
        >
          <Text style={styles.backText}>⬅️</Text>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scroll}>
          <TouchableOpacity
            onPress={() => {
              console.log('Navigating to Justice');
              navigation.navigate('Justice');
            }}
          >
            <Text style={styles.header}>Broken Vigilantes</Text>
          </TouchableOpacity>
          <View style={styles.scrollWrapper}>
            <ScrollView
              horizontal
              contentContainerStyle={[styles.hScroll, { paddingHorizontal: horizontalSpacing[Math.floor(Math.random() * horizontalSpacing.length)] }]}
              showsHorizontalScrollIndicator={true}
            >
              {vigilantes.length > 0 ? (
                vigilantes.map(renderVigilanteCard)
              ) : (
                <Text style={styles.noVigilantesText}>No vigilantes left...</Text>
              )}
            </ScrollView>
          </View>
          <Modal
            visible={!!previewVigilante && !previewVigilante.isEditing}
            transparent
            animationType="fade"
            onRequestClose={() => {
              console.log('Closing preview modal');
              setPreviewVigilante(null);
            }}
          >
            <View style={styles.modalBackground}>
              <TouchableOpacity
                style={styles.modalOuterContainer}
                activeOpacity={1}
                onPress={() => {
                  console.log('Closing preview modal');
                  setPreviewVigilante(null);
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
                    {previewVigilante && renderPreviewCard(previewVigilante)}
                  </ScrollView>
                </View>
                <View style={styles.previewAboutSection}>
                  <Text style={styles.previewName}>{previewVigilante?.name || previewVigilante?.codename || 'Unknown'}</Text>
                  <Text style={styles.previewDesc}>{previewVigilante?.description || 'A fractured soul'}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('Closing preview modal');
                      setPreviewVigilante(null);
                    }}
                    style={styles.close}
                  >
                    <Text style={styles.buttonText}>Escape</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
          <Modal
            visible={deleteModal.visible}
            transparent
            animationType="slide"
            onRequestClose={() => setDeleteModal({ visible: false, vigilante: null })}
          >
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { backgroundColor: '#2F2F2F' }]}>
                <Text style={[styles.modalText, { color: '#C0C0C0' }]}>{`Erase "${deleteModal.vigilante?.name || ''}"?`}</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalCancel, { backgroundColor: '#4B0082' }]}
                    onPress={() => setDeleteModal({ visible: false, vigilante: null })}
                  >
                    <Text style={styles.modalCancelText}>Abort</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalDelete, { backgroundColor: '#8B0000' }]}
                    onPress={() => deleteModal.vigilante && confirmDelete(deleteModal.vigilante.id)}
                  >
                    <Text style={styles.modalDeleteText}>Obliterate</Text>
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
    backgroundColor: 'rgba(0,0,0,0.9)', // Darker overlay
    paddingTop: 20 + Math.random() * 20, // Unorganized padding
  },
  scroll: {
    paddingBottom: 10 + Math.random() * 20,
  },
  back: {
    position: 'absolute',
    top: 20 + Math.random() * 20,
    left: 10 + Math.random() * 20,
    backgroundColor: '#2F2F2F',
    padding: 10 + Math.random() * 5,
    borderRadius: 5,
    elevation: 3,
  },
  backText: {
    color: '#C0C0C0',
    fontSize: 14 + Math.random() * 4,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 28 + Math.random() * 6,
    fontWeight: 'bold',
    color: '#8B0000',
    textAlign: 'center', // Centered title
    textShadowColor: 'rgba(139, 0, 0, 0.7)', // Glowing red-purple shadow
    textShadowRadius: 15,
    marginVertical: 10 + Math.random() * 20,
  },
  scrollWrapper: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  hScroll: {
    flexDirection: 'row',
    paddingHorizontal: horizontalSpacing[Math.floor(Math.random() * horizontalSpacing.length)],
    paddingVertical: verticalSpacing[Math.floor(Math.random() * verticalSpacing.length)],
    alignItems: 'flex-start', // Unorganized alignment
  },
  vigilanteCont: {
    marginHorizontal: 5 + Math.random() * 15,
    alignItems: 'flex-start',
  },
  vigilanteCard: {
    borderRadius: 10 + Math.random() * 10,
    overflow: 'hidden',
    backgroundColor: '#2F2F2F',
    elevation: 3,
  },
  clickable: (borderColor) => ({
    borderColor: borderColor || '#C0C0C0',
    borderWidth: 1 + Math.random() * 2,
  }),
  notClickable: {
    opacity: 0.5,
  },
  vigilanteImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.8, // Slightly faded for broken feel
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1,
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1,
  },
  vigilanteName: {
    position: 'absolute',
    bottom: 5 + Math.random() * 10,
    left: 5 + Math.random() * 10,
    fontSize: 14 + Math.random() * 4,
    color: '#C0C0C0',
    fontWeight: '500',
    textShadowColor: '#2F2F2F',
    textShadowRadius: 5,
  },
  disabledText: {
    fontSize: 10 + Math.random() * 4,
    color: '#8B0000',
    marginTop: 5 + Math.random() * 10,
    textAlign: 'left',
  },
  noVigilantesText: {
    fontSize: 14 + Math.random() * 4,
    color: '#C0C0C0',
    textAlign: 'left',
    padding: 10 + Math.random() * 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: isDesktop ? cardSizes.desktop.width[0] : cardSizes.mobile.width[0],
    marginTop: 5 + Math.random() * 15,
  },
  edit: {
    backgroundColor: '#4B0082',
    padding: 3 + Math.random() * 5,
    borderRadius: 3 + Math.random() * 5,
    flex: 1,
    marginRight: 5 + Math.random() * 5,
    alignItems: 'center',
  },
  delete: {
    backgroundColor: '#8B0000',
    padding: 3 + Math.random() * 5,
    borderRadius: 3 + Math.random() * 5,
    flex: 1,
    marginLeft: 5 + Math.random() * 5,
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#555',
    opacity: 0.4,
  },
  buttonText: {
    color: '#C0C0C0',
    fontWeight: '500',
    fontSize: 12 + Math.random() * 4,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOuterContainer: {
    width: '85% + Math.random() * 10%',
    height: '75% + Math.random() * 10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    paddingVertical: 10 + Math.random() * 10,
    backgroundColor: '#2F2F2F',
    alignItems: 'center',
  },
  imageScrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5 + Math.random() * 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  previewCard: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.18 + Math.random() * 0.05 * windowWidth : SCREEN_WIDTH * 0.75 + Math.random() * 0.05 * SCREEN_WIDTH,
    height: isDesktop ? SCREEN_HEIGHT * 0.65 + Math.random() * 0.05 * SCREEN_HEIGHT : SCREEN_HEIGHT * 0.55 + Math.random() * 0.05 * SCREEN_HEIGHT,
    borderRadius: 10 + Math.random() * 10,
    overflow: 'hidden',
    elevation: 3,
    backgroundColor: '#2F2F2F',
    marginRight: 10 + Math.random() * 10,
  }),
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    opacity: 0.7,
  },
  cardName: {
    position: 'absolute',
    bottom: 5 + Math.random() * 10,
    left: 5 + Math.random() * 10,
    fontSize: 14 + Math.random() * 4,
    color: '#C0C0C0',
    fontWeight: '500',
    zIndex: 2,
  },
  previewAboutSection: {
    marginTop: 10 + Math.random() * 10,
    padding: 5 + Math.random() * 10,
    backgroundColor: '#2F2F2F',
    borderRadius: 5 + Math.random() * 5,
    width: '85% + Math.random() * 10%',
  },
  previewName: {
    fontSize: 14 + Math.random() * 4,
    color: '#C0C0C0',
    textAlign: 'left',
  },
  previewDesc: {
    fontSize: 12 + Math.random() * 4,
    color: '#8B0000',
    textAlign: 'left',
    marginVertical: 5 + Math.random() * 10,
  },
  close: {
    backgroundColor: '#4B0082',
    padding: 5 + Math.random() * 5,
    borderRadius: 3 + Math.random() * 5,
    alignSelf: 'flex-start',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#2F2F2F',
    padding: 10 + Math.random() * 10,
    borderRadius: 5 + Math.random() * 5,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16 + Math.random() * 4,
    color: '#C0C0C0',
    marginBottom: 10 + Math.random() * 10,
    textAlign: 'left',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80% + Math.random() * 10%',
  },
  modalCancel: {
    backgroundColor: '#4B0082',
    padding: 5 + Math.random() * 5,
    borderRadius: 3 + Math.random() * 5,
    flex: 1,
    marginRight: 5 + Math.random() * 5,
  },
  modalCancelText: {
    color: '#C0C0C0',
    fontWeight: '500',
    textAlign: 'center',
  },
  modalDelete: {
    backgroundColor: '#8B0000',
    padding: 5 + Math.random() * 5,
    borderRadius: 3 + Math.random() * 5,
    flex: 1,
    marginLeft: 5 + Math.random() * 5,
  },
  modalDeleteText: {
    color: '#C0C0C0',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default VigilanteScreen;