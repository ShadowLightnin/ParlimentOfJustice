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

// Hardcoded villains data
const hardcodedVillains = [
  // { id: 'villain-1', name: 'BlackOut', screen: '', image: require('../../assets/Villains/BlackOut.jpg'), clickable: true, borderColor: 'red', hardcoded: true, description: "Red Mercury's personal assassin." },
  // { id: 'villain-2', name: 'Void Consumer', screen: '', image: require('../../assets/Villains/VoidConsumer.jpg'), clickable: true, borderColor: 'red', hardcoded: true, description: "Her hunger is endless." },
];

const ALLOWED_EMAILS = [
  'samuelp.woodwell@gmail.com',
  'cummingsnialla@gmail.com',
  'will@test.com',
  'c1wcummings@gmail.com',
  'aileen@test.com',
];
const RESTRICT_ACCESS = true; // Restrict edit/delete to ALLOWED_EMAILS

const VillainyScreen = () => {
  const navigation = useNavigation();
  const [previewVillain, setPreviewVillain] = useState(null);
  const [villains, setVillains] = useState(hardcodedVillains);
  const [montroseVillains, setMontroseVillains] = useState([]);
  const [deleteModal, setDeleteModal] = useState({
    visible: false,
    villain: null,
    collection: 'villain',
  });

  const unsubscribeRef = useRef({
    villain: null,
    powerVillainsMembers: null,
  });

  const canMod =
    auth.currentUser && RESTRICT_ACCESS
      ? ALLOWED_EMAILS.includes(auth.currentUser.email)
      : true;

  // Fetch dynamic villains from Firestore
  useEffect(() => {
    const checkAuthAndFetch = () => {
      const user = auth.currentUser;

      if (unsubscribeRef.current.villain) unsubscribeRef.current.villain();
      if (unsubscribeRef.current.powerVillainsMembers)
        unsubscribeRef.current.powerVillainsMembers();

      // Main villain collection
      unsubscribeRef.current.villain = onSnapshot(
        collection(db, 'villain'),
        snap => {
          const dynamicVillains = snap.docs.map(d => ({
            id: d.id,
            ...d.data(),
            clickable: true,
            borderColor: d.data().borderColor || 'gold',
            hardcoded: false,
          }));
          console.log('Fetched dynamic villains (villain collection):', dynamicVillains);
          setVillains([...hardcodedVillains, ...dynamicVillains]);
        },
        e => {
          console.error('Firestore error (villain collection):', e.message);
          Alert.alert('Error', `Failed to fetch villains: ${e.message}`);
        }
      );

      // Pinnacle Montrose villains
      if (user) {
        unsubscribeRef.current.powerVillainsMembers = onSnapshot(
          collection(db, 'powerVillainsMembers'),
          snap => {
            const dynamicMontroseVillains = snap.docs.map(d => ({
              id: d.id,
              name: d.data().name || 'Unnamed Villain',
              description: d.data().description || '',
              screen: 'VillainCharacterDetail',
              images: d.data().images || [],
              image: d.data().images?.[0]?.uri
                ? { uri: d.data().images[0].uri }
                : require('../../assets/Armor/PlaceHolder.jpg'),
              clickable: true,
              borderColor: 'red',
              hardcoded: false,
              mediaUri: d.data().mediaUri || null,
              mediaType: d.data().mediaType || null,
            }));
            console.log('Fetched dynamic villains (powerVillainsMembers):', dynamicMontroseVillains);
            setMontroseVillains(dynamicMontroseVillains);
          },
          e => {
            console.error('Firestore error (powerVillainsMembers):', e.message);
            Alert.alert('Error', `Failed to fetch Montrose villains: ${e.message}`);
          }
        );
      } else {
        setMontroseVillains([]);
        console.warn('No authenticated user. Skipping powerVillainsMembers fetch.');
      }
    };

    checkAuthAndFetch();
    const unsubscribeAuth = auth.onAuthStateChanged(checkAuthAndFetch);

    return () => {
      if (unsubscribeRef.current.villain) unsubscribeRef.current.villain();
      if (unsubscribeRef.current.powerVillainsMembers)
        unsubscribeRef.current.powerVillainsMembers();
      unsubscribeAuth();
    };
  }, []);

  // Handle updates from VillainCharacterDetail
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener('focus', () => {
        const routeWithMember = navigation
          .getState()
          .routes.find(r => r.params?.member);

        const newMember = routeWithMember?.params?.member;
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
                      image: newMember.images?.[0]?.uri
                        ? { uri: newMember.images[0].uri }
                        : m.image,
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
                  image: newMember.images?.[0]?.uri
                    ? { uri: newMember.images[0].uri }
                    : require('../../assets/Armor/PlaceHolder.jpg'),
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
    if (!villain.clickable) return;

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
    if (
      !auth.currentUser ||
      (RESTRICT_ACCESS && !ALLOWED_EMAILS.includes(auth.currentUser.email))
    ) {
      console.log('Delete blocked: unauthorized user');
      Alert.alert('Access Denied', 'Only authorized users can delete villains.');
      return;
    }

    try {
      const isMontrose = collection === 'powerVillainsMembers';
      const villainList = isMontrose ? montroseVillains : villains;
      const villain = villainList.find(v => v.id === id);

      if (villain?.hardcoded) {
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
        setMontroseVillains(prev => prev.filter(v => v.id !== id));
      } else {
        setVillains(prev => prev.filter(v => v.id !== id));
      }

      setDeleteModal({ visible: false, villain: null, collection: 'villain' });
      Alert.alert('Success', 'Villain deleted successfully!');
    } catch (e) {
      console.error(`Delete villain error (${collection}):`, e.message, e.stack);
      Alert.alert('Error', `Failed to delete villain: ${e.message}`);
    }
  };

  // Render each villain card
  const renderVillainCard = ({ item, isMontrose = false }) => {
    console.log(`Rendering card for ${isMontrose ? 'Montrose' : 'Regular'} villain:`, {
      name: item.name,
      id: item.id,
      hardcoded: item.hardcoded,
      canMod: canMod,
      collection: isMontrose ? 'powerVillainsMembers' : 'villain',
    });

    const cardWidth =
      isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width;
    const cardHeight =
      isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height;

    return (
      <View
        key={
          item.id ||
          item.name ||
          item.codename ||
          (item.image && item.image.toString()) ||
          Math.random()
        }
        style={styles.villainCont}
      >
        <TouchableOpacity
          style={[
            styles.villainCard,
            { width: cardWidth, height: cardHeight },
            item.clickable && item.borderColor
              ? styles.clickable(item.borderColor)
              : styles.notClickable,
          ]}
          onPress={() => handleVillainPress(item, isMontrose)}
          disabled={!item.clickable}
          activeOpacity={0.9}
        >
          <Image
            source={
              isMontrose
                ? item.image ||
                  (item.images?.[0]?.uri && item.images[0].uri !== 'placeholder'
                    ? { uri: item.images[0].uri }
                    : require('../../assets/Armor/PlaceHolder.jpg'))
                : item.image ||
                  (item.imageUrl && item.imageUrl !== 'placeholder'
                    ? { uri: item.imageUrl }
                    : require('../../assets/Armor/PlaceHolder.jpg'))
            }
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
            onError={e => {
              console.error(
                'Image load error:',
                e.nativeEvent.error,
                'URI:',
                isMontrose ? item.images?.[0]?.uri : item.imageUrl
              );
            }}
          />
          <View style={styles.cardOverlay} />
          <Text style={styles.villainName}>
            {item.name || item.codename || 'Unknown'}
          </Text>
          {!item.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
        </TouchableOpacity>

        {!item.hardcoded && (
          <View
            style={[
              styles.buttons,
              { width: cardWidth },
            ]}
          >
            <TouchableOpacity
              onPress={() => handleEdit(item, isMontrose)}
              style={[
                styles.edit,
                !canMod && styles.disabled,
                isMontrose && { backgroundColor: '#FFC107' },
              ]}
              disabled={!canMod}
            >
              <Text style={styles.buttonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setDeleteModal({
                  visible: true,
                  villain: {
                    id: item.id,
                    name: item.name || item.codename || 'Unknown',
                  },
                  collection: isMontrose ? 'powerVillainsMembers' : 'villain',
                })
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

  const renderPreviewCard = villain => (
    <TouchableOpacity
      style={[
        styles.previewCard(isDesktop, SCREEN_WIDTH),
        styles.clickable(villain.borderColor || 'gold'),
      ]}
      onPress={() => {
        console.log('Closing preview modal');
        setPreviewVillain(null);
      }}
      activeOpacity={0.95}
    >
      <Image
        source={
          villain.image ||
          (villain.imageUrl && villain.imageUrl !== 'placeholder'
            ? { uri: villain.imageUrl }
            : require('../../assets/Armor/PlaceHolder.jpg'))
        }
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
      <View style={styles.screenOverlay}>
        {/* Header */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity
            onPress={() => {
              console.log('Navigating to VillainsTab');
              navigation.navigate('VillainsTab');
            }}
            style={styles.back}
            activeOpacity={0.85}
          >
            <Text style={styles.backText}>⬅️ Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              console.log('Navigating to VillainsTab');
              navigation.navigate('VillainsTab');
            }}
            style={styles.headerTitle}
            activeOpacity={0.9}
          >
            <View style={styles.headerGlass}>
              <Text style={styles.header}>Villains</Text>
              <Text style={styles.headerSub}>Prime & Pinnacle rogues gallery</Text>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          onContentSizeChange={(width, height) => {
            console.log('ScrollView content size:', { width, height });
          }}
        >
          {/* PRIME VILLAINS */}
          <View style={styles.scrollWrapper}>
            {villains.length === 0 ? (
              <Text style={styles.noVillainsText}>No villains available</Text>
            ) : (
              <FlatList
                horizontal
                data={villains}
                renderItem={({ item }) =>
                  renderVillainCard({ item, isMontrose: false })
                }
                keyExtractor={item =>
                  item.id || item.name || item.codename || Math.random().toString()
                }
                showsHorizontalScrollIndicator={false}
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

          {/* PINNACLE SECTION */}
          <Text style={styles.sectionHeader}>Pinnacle: Shadows of Zardionine</Text>

          <View style={styles.plusButtonContainer}>
            <TouchableOpacity
              onPress={() => {
                console.log('Navigating to VillainCharacterDetail to add new villain');
                navigation.navigate('VillainCharacterDetail', { mode: 'add' });
              }}
              style={styles.plusButton}
              activeOpacity={0.9}
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
                renderItem={({ item }) =>
                  renderVillainCard({ item, isMontrose: true })
                }
                keyExtractor={item => item.id}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={[styles.hScroll, { gap: horizontalSpacing }]}
              />
            )}
          </View>

          {/* PREVIEW MODAL */}
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
                  <Text style={styles.previewName}>
                    {previewVillain?.name ||
                      previewVillain?.codename ||
                      'Unknown'}
                  </Text>
                  <Text style={styles.previewDesc}>
                    {previewVillain?.description || 'No description available'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('Closing preview modal');
                      setPreviewVillain(null);
                    }}
                    style={styles.close}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>

          {/* DELETE CONFIRM MODAL */}
          <Modal
            visible={deleteModal.visible}
            transparent
            animationType="slide"
            onRequestClose={() =>
              setDeleteModal({
                visible: false,
                villain: null,
                collection: 'villain',
              })
            }
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  {`Delete "${deleteModal.villain?.name || ''}" and its associated media?`}
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalCancel}
                    onPress={() =>
                      setDeleteModal({
                        visible: false,
                        villain: null,
                        collection: 'villain',
                      })
                    }
                    activeOpacity={0.85}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalDelete}
                    onPress={() =>
                      deleteModal.villain &&
                      confirmDelete(deleteModal.villain.id, deleteModal.collection)
                    }
                    activeOpacity={0.85}
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
  screenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 0, 0, 0.78)',
    paddingTop: 40,
    alignItems: 'center',
  },
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    marginBottom: 10,
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
  },
  headerGlass: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255,50,50,0.4)',
  },
  header: {
    fontSize: isDesktop ? 32 : 26,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: '#ff4d4dff',
    textShadowRadius: 20,
  },
  headerSub: {
    marginTop: 3,
    fontSize: isDesktop ? 12 : 10,
    color: 'rgba(255,200,200,0.8)',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  sectionHeader: {
    fontSize: isDesktop ? 24 : 20,
    fontWeight: 'bold',
    color: '#ffb3b3',
    textAlign: 'center',
    textShadowColor: '#ff1c1c',
    textShadowRadius: 15,
    marginVertical: 16,
  },
  back: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(120,0,0,0.85)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,80,80,0.5)',
  },
  backText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  plusButtonContainer: {
    alignItems: 'center',
    marginBottom: 4,
  },
  plusButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,80,80,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  plusText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6666',
  },
  plusLabel: {
    fontSize: 14,
    color: '#ffd6d6',
    fontWeight: '600',
  },
  scroll: {
    paddingBottom: 40,
  },
  scrollWrapper: {
    width: SCREEN_WIDTH,
    flex: 1,
    marginBottom: 16,
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
    minHeight: isDesktop
      ? cardSizes.desktop.height + 80
      : cardSizes.mobile.height + 80,
  },
  villainCard: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.7)',
    elevation: 6,
  },
  clickable: borderColor => ({
    borderColor: borderColor || 'gold',
    borderWidth: 1.5,
    shadowColor: borderColor === 'red' ? '#ff4444aa' : '#ffdd55aa',
    shadowOpacity: 0.9,
    shadowRadius: 12,
  }),
  notClickable: {
    opacity: 0.7,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 1,
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 1,
  },
  villainName: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowRadius: 8,
    zIndex: 2,
  },
  disabledText: {
    fontSize: 12,
    color: '#ffea70',
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
    marginTop: 14,
    zIndex: 2,
  },
  edit: {
    backgroundColor: '#7b3bed',
    padding: 10,
    borderRadius: 999,
    flex: 1,
    marginRight: 6,
    alignItems: 'center',
  },
  delete: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 999,
    flex: 1,
    marginLeft: 6,
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#555',
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
    backgroundColor: 'rgba(10,10,10,0.9)',
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,80,80,0.4)',
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
    borderRadius: 18,
    overflow: 'hidden',
    elevation: 6,
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
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowRadius: 8,
  },
  previewAboutSection: {
    marginTop: 0,
    padding: 14,
    backgroundColor: 'rgba(15,15,15,0.95)',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    width: '100%',
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: 'rgba(255,80,80,0.4)',
  },
  previewName: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  previewDesc: {
    fontSize: 14,
    color: '#ffeaea',
    textAlign: 'center',
    marginVertical: 10,
  },
  close: {
    backgroundColor: '#2196F3',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignSelf: 'center',
    marginTop: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(20,20,20,0.95)',
    padding: 20,
    borderRadius: 14,
    alignItems: 'center',
    width: '85%',
    borderWidth: 1,
    borderColor: 'rgba(255,100,100,0.4)',
  },
  modalText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  modalCancel: {
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 999,
    flex: 1,
  },
  modalCancelText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalDelete: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 999,
    flex: 1,
  },
  modalDeleteText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default VillainyScreen;
