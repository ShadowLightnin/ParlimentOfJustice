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

// Hardcoded villains data with images, red border color
const hardcodedVillains = [
  // { id: 'villain-1', name: 'BlackOut', screen: '', image: require('../../assets/Villains/BlackOut.jpg'), clickable: true, borderColor: 'red', hardcoded: true, description: "Red Murcury's personal assassin." },
  // { id: 'villain-2', name: 'Void Consumer', screen: '', image: require('../../assets/Villains/VoidConsumer.jpg'), clickable: true, borderColor: 'red', hardcoded: true, description: "Her hunger is endless." },
];

const ALLOWED_EMAILS = ['samuelp.woodwell@gmail.com', 'cummingsnialla@gmail.com', 'will@test.com', 'c1wcummings@gmail.com', 'aileen@test.com'];
const RESTRICT_ACCESS = true; // Restrict edit/delete to ALLOWED_EMAILS

const VillainyScreen = () => {
  const navigation = useNavigation();
  const [previewVillain, setPreviewVillain] = useState(null);
  const [villains, setVillains] = useState(hardcodedVillains);
  const [montroseVillains, setMontroseVillains] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ visible: false, villain: null, collection: 'villain' });
  const unsubscribeRef = useRef({ villain: null, powerVillainsMembers: null });
  const canMod = auth.currentUser && RESTRICT_ACCESS ? ALLOWED_EMAILS.includes(auth.currentUser.email) : true;

  // Fetch dynamic villains from Firestore
  useEffect(() => {
    const checkAuthAndFetch = () => {
      const user = auth.currentUser;
      if (unsubscribeRef.current.villain) unsubscribeRef.current.villain();
      if (unsubscribeRef.current.powerVillainsMembers) unsubscribeRef.current.powerVillainsMembers();

      // Fetch from villain collection
      unsubscribeRef.current.villain = onSnapshot(collection(db, 'villain'), (snap) => {
        const dynamicVillains = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          clickable: true,
          borderColor: doc.data().borderColor || 'gold',
          hardcoded: false,
        }));
        console.log('Fetched dynamic villains (villain collection):', dynamicVillains);
        setVillains([...hardcodedVillains, ...dynamicVillains]);
      }, (e) => {
        console.error('Firestore error (villain collection):', e.message);
        Alert.alert('Error', `Failed to fetch villains: ${e.message}`);
      });

      // Fetch from powerVillainsMembers collection
      if (user) {
        unsubscribeRef.current.powerVillainsMembers = onSnapshot(collection(db, 'powerVillainsMembers'), (snap) => {
          const dynamicMontroseVillains = snap.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name || 'Unnamed Villain',
            description: doc.data().description || '',
            screen: 'VillainCharacterDetail',
            images: doc.data().images || [],
            image: doc.data().images?.[0]?.uri ? { uri: doc.data().images[0].uri } : require('../../assets/Armor/PlaceHolder.jpg'),
            clickable: true,
            borderColor: 'red',
            hardcoded: false,
            mediaUri: doc.data().mediaUri || null,
            mediaType: doc.data().mediaType || null,
          }));
          console.log('Fetched dynamic villains (powerVillainsMembers):', dynamicMontroseVillains);
          setMontroseVillains(dynamicMontroseVillains);
        }, (e) => {
          console.error('Firestore error (powerVillainsMembers):', e.message);
          Alert.alert('Error', `Failed to fetch Montrose villains: ${e.message}`);
        });
      } else {
        setMontroseVillains([]);
        console.warn('No authenticated user. Skipping powerVillainsMembers fetch.');
      }
    };

    checkAuthAndFetch();
    const unsubscribeAuth = auth.onAuthStateChanged(checkAuthAndFetch);

    return () => {
      if (unsubscribeRef.current.villain) unsubscribeRef.current.villain();
      if (unsubscribeRef.current.powerVillainsMembers) unsubscribeRef.current.powerVillainsMembers();
      unsubscribeAuth();
    };
  }, []);

  // Handle updates from VillainCharacterDetail
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        const newMember = navigation.getState().routes.find(r => r.params?.member)?.params?.member;
        if (newMember && newMember.id) {
          console.log('Received new/updated member from VillainCharacterDetail:', newMember);
          setMontroseVillains(prev => {
            const memberExists = prev.some(m => m.id === newMember.id);
            if (memberExists) {
              return prev.map(m =>
                m.id === newMember.id
                  ? {
                      ...m,
                      name: newMember.name,
                      description: newMember.description,
                      screen: 'VillainCharacterDetail',
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
                  screen: 'VillainCharacterDetail',
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

  const handleVillainPress = (villain, isMontrose = false) => {
    if (villain.clickable) {
      if (isMontrose && villain.screen) {
        console.log('Navigating to VillainCharacterDetail for:', villain.name);
        navigation.navigate('VillainCharacterDetail', { member: villain, mode: 'view' });
      } else if (villain.screen) {
        console.log('Navigating to screen:', villain.screen);
        navigation.navigate(villain.screen);
      } else {
        console.log('Showing preview for villain:', villain.name || villain.codename || 'Unknown');
        setPreviewVillain(villain);
      }
    }
  };

  const handleEdit = (villain, isMontrose = false) => {
    if (isMontrose && villain.clickable && villain.screen) {
      console.log('Navigating to edit mode for Montrose villain:', villain.name);
      navigation.navigate('VillainCharacterDetail', { member: villain, mode: 'edit' });
    } else {
      console.log('Opening edit preview for villain:', villain.name || villain.codename || 'Unknown');
      setPreviewVillain({ ...villain, isEditing: true });
    }
  };

  const confirmDelete = async (id, collection) => {
    if (!auth.currentUser || (RESTRICT_ACCESS && !ALLOWED_EMAILS.includes(auth.currentUser.email))) {
      console.log('Delete blocked: unauthorized user');
      Alert.alert('Access Denied', 'Only authorized users can delete villains.');
      return;
    }
    try {
      const isMontrose = collection === 'powerVillainsMembers';
      const villainList = isMontrose ? montroseVillains : villains;
      const villain = villainList.find(v => v.id === id);
      if (villain.hardcoded) {
        console.log('Delete blocked: attempted to delete hardcoded villain:', id);
        Alert.alert('Error', 'Cannot delete hardcoded villains!');
        return;
      }
      const villainRef = doc(db, collection, id);
      const snap = await getDoc(villainRef);
      if (!snap.exists()) {
        Alert.alert('Error', 'Villain not found');
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
      await deleteDoc(villainRef);
      console.log(`Villain deleted from ${collection}:`, id);
      if (isMontrose) {
        setMontroseVillains(montroseVillains.filter(v => v.id !== id));
      } else {
        setVillains(villains.filter(v => v.id !== id));
      }
      setDeleteModal({ visible: false, villain: null, collection: 'villain' });
      Alert.alert('Success', 'Villain deleted successfully!');
    } catch (e) {
      console.error(`Delete villain error (${collection}):`, e.message, e.stack);
      Alert.alert('Error', `Failed to delete villain: ${e.message}`);
    }
  };

  // Render Each Villain Card
  const renderVillainCard = ({ item, isMontrose = false }) => {
    console.log(`Rendering card for ${isMontrose ? 'Montrose' : 'Regular'} villain:`, {
      name: item.name,
      id: item.id,
      hardcoded: item.hardcoded,
      canMod: canMod,
      collection: isMontrose ? 'powerVillainsMembers' : 'villain',
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
          onPress={() => handleVillainPress(item, isMontrose)}
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
                collection: isMontrose ? 'powerVillainsMembers' : 'villain'
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
  const renderPreviewCard = (villain) => (
    <TouchableOpacity
      style={[styles.previewCard(isDesktop, SCREEN_WIDTH), styles.clickable(villain.borderColor || 'gold')]}
      onPress={() => {
        console.log('Closing preview modal');
        setPreviewVillain(null);
      }}
    >
      <Image
        source={villain.image || (villain.imageUrl && villain.imageUrl !== 'placeholder' ? { uri: villain.imageUrl } : require('../../assets/Armor/PlaceHolder.jpg'))}
        style={{ width: '100%', height: '100%' }}
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
        <View style={styles.headerWrapper}>
          <TouchableOpacity
            onPress={() => {
              console.log('Navigating to Home');
              navigation.navigate('VillainsTab');
            }}
            style={styles.back}
          >
            <Text style={styles.backText}>⬅️ Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              console.log('Navigating to VillainsTab');
              navigation.navigate('VillainsTab');
            }}
            style={styles.headerTitle}
          >
            <Text style={styles.header}>Villains</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={styles.scroll}
          onContentSizeChange={(width, height) => {
            console.log('ScrollView content size:', { width, height });
          }}
        >
          <View style={styles.scrollWrapper}>
            {villains.length === 0 ? (
              <Text style={styles.noVillainsText}>No villains available</Text>
            ) : (
              <FlatList
                horizontal
                data={villains}
                renderItem={({ item }) => renderVillainCard({ item, isMontrose: false })}
                keyExtractor={(item) => item.id || item.name || item.codename || Math.random().toString()}
                showsHorizontalScrollIndicator={true}
                contentContainerStyle={[styles.hScroll, { gap: horizontalSpacing }]}
              />
            )}
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
          <Text style={styles.sectionHeader}>Pinnacle: Shadows of Zardionine</Text>
          <View style={styles.plusButtonContainer}>
            <TouchableOpacity
              onPress={() => {
                console.log('Navigating to VillainCharacterDetail to add new villain');
                navigation.navigate('VillainCharacterDetail', { mode: 'add' });
              }}
              style={styles.plusButton}
            >
              <Text style={styles.plusText}>+</Text>
              <Text style={styles.plusLabel}>Add Villain</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.scrollWrapper}>
            {montroseVillains.length === 0 ? (
              <Text style={styles.noVillainsText}>No Montrose villains available</Text>
            ) : (
              <FlatList
                horizontal
                data={montroseVillains}
                renderItem={({ item }) => renderVillainCard({ item, isMontrose: true })}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={true}
                contentContainerStyle={[styles.hScroll, { gap: horizontalSpacing }]}
              />
            )}
          </View>
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
                  <View style={styles.imageScrollContainer}>
                    {previewVillain && renderPreviewCard(previewVillain)}
                  </View>
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
            onRequestClose={() => setDeleteModal({ visible: false, villain: null, collection: 'villain' })}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>{`Delete "${deleteModal.villain?.name || ''}" and its associated media?`}</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalCancel}
                    onPress={() => setDeleteModal({ visible: false, villain: null, collection: 'villain' })}
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
    borderColor: borderColor || 'gold',
    borderWidth: 2,
  }),
  notClickable: {
    opacity: 0.7,
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

export default VillainyScreen;