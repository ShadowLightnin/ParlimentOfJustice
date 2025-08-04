import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  FlatList,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
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
  desktop: { width: 450, height: 650 },
  mobile: { width: 380, height: 550 },
};
const horizontalSpacing = isDesktop ? 50 : 30;
const verticalSpacing = isDesktop ? 60 : 30;

// Hardcoded big bads data with images, purple border color
const hardcodedBigBads = [
  // { id: 'bigbad-1', name: 'Hextator', screen: '', image: require('../../assets/Villains/Hextator.jpg'), clickable: true, borderColor: 'purple', hardcoded: true, description: "Ruler and beloved by his land and people. Wields Archaic magics." },
];

const ALLOWED_EMAILS = ['samuelp.woodwell@gmail.com', 'cummingsnialla@gmail.com', 'will@test.com', 'c1wcummings@gmail.com', 'aileen@test.com'];
const RESTRICT_ACCESS = true; // Restrict edit/delete to ALLOWED_EMAILS

const BigBossScreen = () => {
  const navigation = useNavigation();
  const [previewBigBad, setPreviewBigBad] = useState(null);
  const [bigBads, setBigBads] = useState(hardcodedBigBads);
  const [montroseBigBads, setMontroseBigBads] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ visible: false, villain: null, collection: 'bigbad' });
  const unsubscribeRef = useRef({ bigbad: null, powerBossMembers: null });
  const canMod = auth.currentUser && RESTRICT_ACCESS ? ALLOWED_EMAILS.includes(auth.currentUser.email) : true;

  // Fetch dynamic big bads from Firestore
  useEffect(() => {
    const checkAuthAndFetch = () => {
      const user = auth.currentUser;
      if (unsubscribeRef.current.bigbad) unsubscribeRef.current.bigbad();
      if (unsubscribeRef.current.powerBossMembers) unsubscribeRef.current.powerBossMembers();

      // Fetch from bigbad collection
      unsubscribeRef.current.bigbad = onSnapshot(collection(db, 'bigbad'), (snap) => {
        const dynamicBigBads = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          clickable: true,
          borderColor: doc.data().borderColor || 'purple',
          hardcoded: false,
        }));
        console.log('Fetched dynamic big bads (bigbad collection):', dynamicBigBads);
        setBigBads([...hardcodedBigBads, ...dynamicBigBads]);
      }, (e) => {
        console.error('Firestore error (bigbad collection):', e.message);
        Alert.alert('Error', `Failed to fetch big bads: ${e.message}`);
      });

      // Fetch from powerBossMembers collection
      if (user) {
        unsubscribeRef.current.powerBossMembers = onSnapshot(collection(db, 'powerBossMembers'), (snap) => {
          const dynamicMontroseBigBads = snap.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name || 'Unnamed Big Bad',
            description: doc.data().description || '',
            screen: 'PowerBossDetail',
            images: doc.data().images || [],
            image: doc.data().images?.[0]?.uri ? { uri: doc.data().images[0].uri } : require('../../assets/Armor/PlaceHolder.jpg'),
            clickable: true,
            borderColor: 'red',
            hardcoded: false,
            mediaUri: doc.data().mediaUri || null,
            mediaType: doc.data().mediaType || null,
          }));
          console.log('Fetched dynamic big bads (powerBossMembers):', dynamicMontroseBigBads);
          setMontroseBigBads(dynamicMontroseBigBads);
        }, (e) => {
          console.error('Firestore error (powerBossMembers):', e.message);
          Alert.alert('Error', `Failed to fetch Montrose big bads: ${e.message}`);
        });
      } else {
        setMontroseBigBads([]);
        console.warn('No authenticated user. Skipping powerBossMembers fetch.');
      }
    };

    checkAuthAndFetch();
    const unsubscribeAuth = auth.onAuthStateChanged(checkAuthAndFetch);

    return () => {
      if (unsubscribeRef.current.bigbad) unsubscribeRef.current.bigbad();
      if (unsubscribeRef.current.powerBossMembers) unsubscribeRef.current.powerBossMembers();
      unsubscribeAuth();
    };
  }, []);

  // Handle updates from PowerBossDetail
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        const newMember = navigation.getState().routes.find(r => r.params?.member)?.params?.member;
        if (newMember && newMember.id) {
          console.log('Received new/updated member from PowerBossDetail:', newMember);
          setMontroseBigBads(prev => {
            const memberExists = prev.some(m => m.id === newMember.id);
            if (memberExists) {
              return prev.map(m =>
                m.id === newMember.id
                  ? {
                      ...m,
                      name: newMember.name,
                      description: newMember.description,
                      screen: 'PowerBossDetail',
                      images: newMember.images || [],
                      image: newMember.images?.[0]?.uri ? { uri: newMember.images[0].uri } : m.image,
                      mediaUri: newMember.mediaUri || null,
                      mediaType: newMember.mediaType || null,
                      clickable: true,
                      borderColor: 'red',
                      hardcoded: false,
                    }
                  : m
              );
            } else {
              return [
                ...prev,
                {
                  id: newMember.id,
                  name: newMember.name,
                  description: newMember.description,
                  screen: 'PowerBossDetail',
                  images: newMember.images || [],
                  image: newMember.images?.[0]?.uri ? { uri: newMember.images[0].uri } : require('../../assets/Armor/PlaceHolder.jpg'),
                  clickable: true,
                  borderColor: 'red',
                  hardcoded: false,
                  mediaUri: newMember.mediaUri || null,
                  mediaType: newMember.mediaType || null,
                },
              ];
            }
          });
          navigation.setParams({ member: undefined });
        }
      });
      return unsubscribe;
    }, [navigation])
  );

  const handleBigBadPress = (bigBad, isMontrose = false) => {
    if (bigBad.clickable) {
      if (isMontrose && bigBad.screen) {
        console.log('Navigating to PowerBossDetail for:', bigBad.name);
        navigation.navigate('PowerBossDetail', { member: bigBad, mode: 'view' });
      } else if (bigBad.screen) {
        console.log('Navigating to screen:', bigBad.screen);
        navigation.navigate(bigBad.screen);
      } else {
        console.log('Showing preview for big bad:', bigBad.name || bigBad.codename || 'Unknown');
        setPreviewBigBad(bigBad);
      }
    }
  };

  const handleEdit = (bigBad, isMontrose = false) => {
    if (isMontrose && bigBad.clickable && bigBad.screen) {
      console.log('Navigating to edit mode for Montrose big bad:', bigBad.name);
      navigation.navigate('PowerBossDetail', { member: bigBad, mode: 'edit' });
    } else {
      console.log('Opening edit preview for big bad:', bigBad.name || bigBad.codename || 'Unknown');
      setPreviewBigBad({ ...bigBad, isEditing: true });
    }
  };

  const confirmDelete = async (id, collection) => {
    if (!auth.currentUser || (RESTRICT_ACCESS && !ALLOWED_EMAILS.includes(auth.currentUser.email))) {
      console.log('Delete blocked: unauthorized user');
      Alert.alert('Access Denied', 'Only authorized users can delete big bads.');
      return;
    }
    try {
      const isMontrose = collection === 'powerBossMembers';
      const bigBadList = isMontrose ? montroseBigBads : bigBads;
      const bigBad = bigBadList.find(b => b.id === id);
      if (bigBad.hardcoded) {
        console.log('Delete blocked: attempted to delete hardcoded big bad:', id);
        Alert.alert('Error', 'Cannot delete hardcoded big bads!');
        return;
      }
      const bigBadRef = doc(db, collection, id);
      const snap = await getDoc(bigBadRef);
      if (!snap.exists()) {
        Alert.alert('Error', 'Big Bad not found');
        return;
      }
      const { imageUrl, images, mediaUri } = snap.data();
      const mediaDeletionPromises = [];

      if (isMontrose) {
        (images || []).forEach(img => {
          if (img.uri && img.uri.startsWith('http')) {
            const path = decodeURIComponent(img.uri.split('/o/')[1].split('?')[0]);
            console.log('Attempting to delete image:', path);
            mediaDeletionPromises.push(
              deleteObject(ref(storage, path)).catch(e => {
                if (e.code !== 'storage/object-not-found') throw e;
                console.warn('Image not found in storage:', path);
              })
            );
          }
        });
        if (mediaUri && mediaUri.startsWith('http')) {
          const path = decodeURIComponent(mediaUri.split('/o/')[1].split('?')[0]);
          console.log('Attempting to delete video:', path);
          mediaDeletionPromises.push(
            deleteObject(ref(storage, path)).catch(e => {
              if (e.code !== 'storage/object-not-found') throw e;
              console.warn('Video not found in storage:', path);
            })
          );
        }
      } else {
        if (imageUrl && imageUrl !== 'placeholder') {
          const path = decodeURIComponent(imageUrl.split('/o/')[1].split('?')[0]);
          console.log('Attempting to delete image:', path);
          mediaDeletionPromises.push(
            deleteObject(ref(storage, path)).catch(e => {
              if (e.code !== 'storage/object-not-found') throw e;
              console.warn('Image not found in storage:', path);
            })
          );
        }
      }

      await Promise.all(mediaDeletionPromises);
      await deleteDoc(bigBadRef);
      console.log(`Big Bad deleted from ${collection}:`, id);
      if (isMontrose) {
        setMontroseBigBads(montroseBigBads.filter(b => b.id !== id));
      } else {
        setBigBads(bigBads.filter(b => b.id !== id));
      }
      setDeleteModal({ visible: false, villain: null, collection: 'bigbad' });
      Alert.alert('Success', 'Big Bad deleted successfully!');
    } catch (e) {
      console.error(`Delete big bad error (${collection}):`, e.message, e.stack);
      Alert.alert('Error', `Failed to delete big bad: ${e.message}`);
    }
  };

  // Render Each Big Bad Card
  const renderBigBadCard = ({ item, isMontrose = false }) => {
    console.log(`Rendering card for ${isMontrose ? 'Montrose' : 'Regular'} big bad:`, {
      name: item.name,
      id: item.id,
      hardcoded: item.hardcoded,
      canMod: canMod,
      collection: isMontrose ? 'powerBossMembers' : 'bigbad',
    });
    return (
      <View key={item.id || item.name || item.codename || (item.image && item.image.toString()) || Math.random()} style={styles.villainCont}>
        <TouchableOpacity
          style={[
            styles.villainCard,
            {
              width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
              height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height,
            },
            item.clickable && item.borderColor ? styles.clickable(item.borderColor) : styles.notClickable,
          ]}
          onPress={() => handleBigBadPress(item, isMontrose)}
          disabled={!item.clickable}
        >
          <Image
            source={
              isMontrose
                ? (item.image || (item.images?.[0]?.uri && item.images[0].uri !== 'placeholder' ? { uri: item.images[0].uri } : require('../../assets/Armor/PlaceHolder.jpg')))
                : (item.image || (item.imageUrl && item.imageUrl !== 'placeholder' ? { uri: item.imageUrl } : require('../../assets/Armor/PlaceHolder.jpg')))
            }
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
            onError={(e) => {
              console.error('Image load error:', e.nativeEvent.error, 'URI:', isMontrose ? item.images?.[0]?.uri : item.imageUrl);
            }}
          />
          <View style={styles.overlay} />
          <Text style={styles.villainName}>{item.name || item.codename || 'Unknown'}</Text>
          {!item.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
        </TouchableOpacity>
        {!item.hardcoded && (
          <View style={[styles.buttons, { width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width }]}>
            <TouchableOpacity
              onPress={() => handleEdit(item, isMontrose)}
              style={[styles.edit, !canMod && styles.disabled, isMontrose && { backgroundColor: '#FFC107' }]}
              disabled={!canMod}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setDeleteModal({
                visible: true,
                villain: { id: item.id, name: item.name || item.codename || 'Unknown' },
                collection: isMontrose ? 'powerBossMembers' : 'bigbad'
              })}
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
        style={{ width: '100%', height: '100%' }}
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
        <View style={styles.headerWrapper}>
          <TouchableOpacity
            onPress={() => {
              console.log('Navigating to VillainsScreen');
              navigation.navigate('BigBadsTab');
            }}
            style={styles.back}
          >
            <Text style={styles.backText}>⬅️ Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              console.log('Navigating to BigBadsTab');
              navigation.navigate('BigBadsTab');
            }}
            style={styles.headerTitle}
          >
            <Text style={styles.header}>Big Bads</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={styles.scroll}
          onContentSizeChange={(width, height) => {
            console.log('ScrollView content size:', { width, height });
          }}
        >
          <View style={styles.scrollWrapper}>
            {bigBads.length === 0 ? (
              <Text style={styles.noVillainsText}>No big bads available</Text>
            ) : (
              <FlatList
                horizontal
                data={bigBads}
                renderItem={({ item }) => renderBigBadCard({ item, isMontrose: false })}
                keyExtractor={(item) => item.id || item.name || item.codename || Math.random().toString()}
                showsHorizontalScrollIndicator={true}
                contentContainerStyle={[styles.hScroll, { gap: horizontalSpacing }]}
              />
            )}
          </View>
          <EnlightenedInvite
            collectionPath="bigbad"
            placeholderImage={require('../../assets/Armor/PlaceHolder.jpg')}
            villain={bigBads}
            setVillain={setBigBads}
            hardcodedVillain={hardcodedBigBads}
            editingVillain={previewBigBad?.isEditing ? previewBigBad : null}
            setEditingVillain={setPreviewBigBad}
          />
          <Text style={styles.sectionHeader}>Pinnacle: Shadows of Zardionine</Text>
          <View style={styles.plusButtonContainer}>
            <TouchableOpacity
              onPress={() => {
                console.log('Navigating to PowerBossDetail to add new big bad');
                navigation.navigate('PowerBossDetail', { mode: 'add' });
              }}
              style={styles.plusButton}
            >
              <Text style={styles.plusText}>+</Text>
              <Text style={styles.plusLabel}>Add Big Bad</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.scrollWrapper}>
            {montroseBigBads.length === 0 ? (
              <Text style={styles.noVillainsText}>No Montrose big bads available</Text>
            ) : (
              <FlatList
                horizontal
                data={montroseBigBads}
                renderItem={({ item }) => renderBigBadCard({ item, isMontrose: true })}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={true}
                contentContainerStyle={[styles.hScroll, { gap: horizontalSpacing }]}
              />
            )}
          </View>
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
                  <View style={styles.imageScrollContainer}>
                    {previewBigBad && renderPreviewCard(previewBigBad)}
                  </View>
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
            onRequestClose={() => setDeleteModal({ visible: false, villain: null, collection: 'bigbad' })}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>{`Delete "${deleteModal.villain?.name || ''}" and its associated media?`}</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalCancel}
                    onPress={() => setDeleteModal({ visible: false, villain: null, collection: 'bigbad' })}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalDelete}
                    onPress={() => deleteModal.villain && confirmDelete(deleteModal.villain.id, deleteModal.collection)}
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
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  headerTitle: {
    flex: 1,
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
  sectionHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#630404',
    textAlign: 'center',
    textShadowColor: '#ff1c1c',
    textShadowRadius: 15,
    marginVertical: 20,
  },
  back: {
    padding: 10,
    backgroundColor: '#750000',
    borderRadius: 8,
    elevation: 5,
  },
  backText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  plusButtonContainer: {
    alignItems: 'center',
  },
  plusButton: {
    padding: 10,
  },
  plusText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff1c1c',
  },
  plusLabel: {
    fontSize: 14,
    color: '#ff1c1c',
    fontWeight: 'bold',
    marginTop: 5,
  },
  scroll: {
    paddingBottom: 40,
  },
  scrollWrapper: {
    width: SCREEN_WIDTH,
    flex: 1,
    marginBottom: 20,
  },
  hScroll: {
    flexDirection: 'row',
    flexGrow: 1,
    width: 'auto',
    paddingHorizontal: horizontalSpacing,
    paddingVertical: verticalSpacing,
    alignItems: 'center',
  },
  villainCont: {
    marginHorizontal: 10,
    alignItems: 'center',
    flexGrow: 1,
    minHeight: isDesktop ? cardSizes.desktop.height + 80 : cardSizes.mobile.height + 80,
  },
  villainCard: {
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',

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
    marginTop: 20,
    zIndex: 2,
  },
  edit: {
    backgroundColor: '#5913bc',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  delete: {
    backgroundColor: '#F44336',
    padding: 10,
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
    width: isDesktop ? windowWidth * 0.25 : SCREEN_WIDTH * 0.85,
    height: isDesktop ? SCREEN_HEIGHT * 0.75 : SCREEN_HEIGHT * 0.65,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    marginRight: 20,
  }),
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