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
import EnlightedInvite from './EnlightenedInvite';

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

// Hardcoded big bads data with images, purple border color
const hardcodedBigBads = [
  { id: 'bigbad-1', name: 'Hextator', screen: '', image: require('../../assets/Villains/Hextator.jpg'), clickable: true, borderColor: 'purple', hardcoded: true, description: "Ruler and beloved by his land and people. Wields Archaic magics." },
];

const ALLOWED_EMAILS = ["will@test.com", "c1wcummings@gmail.com"];
const RESTRICT_ACCESS = true; // Restrict edit/delete to ALLOWED_EMAILS

const BigBossScreen = () => {
  const navigation = useNavigation();
  const [previewBigBad, setPreviewBigBad] = useState(null);
  const [bigBads, setBigBads] = useState(hardcodedBigBads);
  const [deleteModal, setDeleteModal] = useState({ visible: false, bigBad: null });
  const canMod = RESTRICT_ACCESS ? auth.currentUser && ALLOWED_EMAILS.includes(auth.currentUser.email) : true;

  // Fetch dynamic big bads from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'bigbad'), (snap) => {
      const dynamicBigBads = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        clickable: true,
        borderColor: doc.data().borderColor || 'purple', // Purple for dynamic
        hardcoded: false,
      }));
      console.log('Fetched dynamic big bads:', dynamicBigBads);
      setBigBads([...hardcodedBigBads, ...dynamicBigBads]);
    }, (e) => {
      console.error('Firestore error:', e.message);
      Alert.alert('Error', 'Failed to fetch big bads: ' + e.message);
    });
    return () => unsub();
  }, []);

  const handleBigBadPress = (bigBad) => {
    if (bigBad.clickable) {
      if (bigBad.screen) {
        console.log('Navigating to screen:', bigBad.screen);
        navigation.navigate(bigBad.screen);
      } else {
        console.log('Showing preview for big bad:', bigBad.name || bigBad.codename || 'Unknown');
        setPreviewBigBad(bigBad);
      }
    }
  };

  const confirmDelete = async (id) => {
    if (!canMod) {
      Alert.alert('Access Denied', 'Only authorized users can delete big bads.');
      return;
    }
    try {
      const bigBadItem = bigBads.find(b => b.id === id);
      if (bigBadItem.hardcoded) {
        Alert.alert('Error', 'Cannot delete hardcoded big bads!');
        return;
      }
      const bigBadRef = doc(db, 'bigbad', id);
      const snap = await getDoc(bigBadRef);
      if (!snap.exists()) {
        Alert.alert('Error', 'Big Bad not found');
        return;
      }
      const { imageUrl } = snap.data();
      await deleteDoc(bigBadRef);
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
      setBigBads(bigBads.filter(b => b.id !== id));
      setDeleteModal({ visible: false, bigBad: null });
      Alert.alert('Success', 'Big Bad deleted!');
    } catch (e) {
      console.error('Delete big bad error:', e.message);
      Alert.alert('Error', `Failed to delete big bad: ${e.message}`);
    }
  };

  // Render Each Big Bad Card
  const renderBigBadCard = (bigBad) => (
    <View key={bigBad.id || bigBad.name || bigBad.codename || bigBad.image.toString()} style={styles.bigBadCont}>
      <TouchableOpacity
        style={[
          styles.bigBadCard,
          {
            width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
            height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height,
          },
          bigBad.clickable && bigBad.borderColor ? styles.clickable(bigBad.borderColor) : styles.notClickable,
        ]}
        onPress={() => handleBigBadPress(bigBad)}
        disabled={!bigBad.clickable}
      >
        <Image
          source={bigBad.image || (bigBad.imageUrl && bigBad.imageUrl !== 'placeholder' ? { uri: bigBad.imageUrl } : require('../../assets/Armor/PlaceHolder.jpg'))}
          style={styles.bigBadImg}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        <Text style={styles.bigBadName}>{bigBad.name || bigBad.codename || 'Unknown'}</Text>
        {!bigBad.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
      </TouchableOpacity>
      {!bigBad.hardcoded && (
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => setPreviewBigBad({ ...bigBad, isEditing: true })}
            style={[styles.edit, !canMod && styles.disabled]}
            disabled={!canMod}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDeleteModal({ visible: true, bigBad: { id: bigBad.id, name: bigBad.name || bigBad.codename || 'Unknown' } })}
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
  const renderPreviewCard = (bigBad) => (
    <TouchableOpacity
      style={[styles.previewCard(isDesktop, SCREEN_WIDTH), styles.clickable(bigBad.borderColor || 'purple')]}
      onPress={() => {
        console.log('Closing preview modal');
        setPreviewBigBad(null);
      }}
    >
      <Image
        source={bigBad.image || (bigBad.imageUrl && bigBad.imageUrl !== 'placeholder' ? { uri: bigBad.imageUrl } : require('../../assets/Armor/PlaceHolder.jpg'))}
        style={styles.previewImage}
        resizeMode="cover"
      />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {bigBad.name || bigBad.codename || 'Unknown'}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/BackGround/BigBad.jpg')}
      style={styles.bg}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          onPress={() => {
            console.log('Navigating to VillainsScreen');
            navigation.navigate('Villains');
          }}
          style={styles.back}
        >
          <Text style={styles.backText}>⬅️ Back</Text>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scroll}>
          <TouchableOpacity
            onPress={() => {
              console.log('Navigating to BigBadsTab');
              navigation.navigate('BigBadsTab');
            }}
          >
            <Text style={styles.header}>Big Bads</Text>
          </TouchableOpacity>
          <View style={styles.scrollWrapper}>
            <ScrollView
              horizontal
              contentContainerStyle={styles.hScroll}
              showsHorizontalScrollIndicator={true}
            >
              {bigBads.length > 0 ? (
                bigBads.map(renderBigBadCard)
              ) : (
                <Text style={styles.noBigBadsText}>No big bads available</Text>
              )}
            </ScrollView>
          </View>
          <EnlightedInvite
            collectionPath="bigbad"
            placeholderImage={require('../../assets/Armor/PlaceHolder.jpg')}
            villain={bigBads}
            setVillain={setBigBads}
            hardcodedVillain={hardcodedBigBads}
            editingVillain={previewBigBad?.isEditing ? previewBigBad : null}
            setEditingVillain={setPreviewBigBad}
          />
          <Modal
            visible={!!previewBigBad && !previewBigBad.isEditing}
            transparent
            animationType="fade"
            onRequestClose={() => {
              console.log('Closing preview modal');
              setPreviewBigBad(null);
            }}
          >
            <View style={styles.modalBackground}>
              <TouchableOpacity
                style={styles.modalOuterContainer}
                activeOpacity={1}
                onPress={() => {
                  console.log('Closing preview modal');
                  setPreviewBigBad(null);
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
                    {previewBigBad && renderPreviewCard(previewBigBad)}
                  </ScrollView>
                </View>
                <View style={styles.previewAboutSection}>
                  <Text style={styles.previewName}>{previewBigBad?.name || previewBigBad?.codename || 'Unknown'}</Text>
                  <Text style={styles.previewDesc}>{previewBigBad?.description || 'No description available'}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('Closing preview modal');
                      setPreviewBigBad(null);
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
            onRequestClose={() => setDeleteModal({ visible: false, bigBad: null })}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>{`Delete "${deleteModal.bigBad?.name || ''}" and its image?`}</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalCancel}
                    onPress={() => setDeleteModal({ visible: false, bigBad: null })}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalDelete}
                    onPress={() => deleteModal.bigBad && confirmDelete(deleteModal.bigBad.id)}
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
    color: '#1b084d',
    textAlign: 'center',
    textShadowColor: '#9561f5',
    textShadowRadius: 25,
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
  bigBadCont: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  bigBadCard: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.7)',
    elevation: 5,
  },
  clickable: (borderColor) => ({
    borderColor: borderColor || 'purple',
    borderWidth: 2,
  }),
  notClickable: {
    opacity: 0.7,
  },
  bigBadImg: {
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
  bigBadName: {
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
  noBigBadsText: {
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

export default BigBossScreen;