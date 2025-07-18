import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, auth, storage } from '../../../lib/firebase';
import { collection, onSnapshot, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import SamsArmory from '../SamsArmory';

// Screen dimensions
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// Sam's Original Ranger Squad Clones
const samsClones = [
  { id: 'sam-1', name: '', codename: 'Captain Zardo', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/Ranger12.jpg'), hardcoded: true },
  { id: 'sam-2', name: 'CT-8949', codename: 'Blitz', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/Ranger1.jpg'), hardcoded: true },
  { id: 'sam-3', name: 'CT-7600', codename: 'Lt. Ridge', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/Ranger2.jpg'), hardcoded: true },
  { id: 'sam-4', name: 'CT-1276', codename: 'ARC Tarin', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/Ranger7.jpg'), hardcoded: true },
  { id: 'sam-5', name: 'CT-8681', codename: 'Venom', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/Ranger8.jpg'), hardcoded: true },
  { id: 'sam-6', name: 'CT-8949', codename: 'Rancor', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/Ranger9.jpg'), hardcoded: true },
  { id: 'sam-7', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/Ranger10.jpg'), hardcoded: true },
  { id: 'sam-8', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/Ranger11.jpg'), hardcoded: true },
  { id: 'sam-9', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/Ranger3.jpg'), hardcoded: true },
  { id: 'sam-10', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/Ranger4.jpg'), hardcoded: true },
  { id: 'sam-11', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/Ranger5.jpg'), hardcoded: true },
  { id: 'sam-12', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/Ranger6.jpg'), hardcoded: true },
];

// My Custom Clones
const myClones = [
  { id: 'my-1', name: 'Split', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetroopersplit.jpg'), hardcoded: true },
  { id: 'my-2', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetrooperdarkbluegreen.jpg'), hardcoded: true },
  { id: 'my-3', name: 'Marine Commander', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetroopermarinecommander.jpg'), hardcoded: true },
  { id: 'my-4', name: 'Lieutenant Truffel', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetrooperlutenietTruffel.jpg'), hardcoded: true },
  { id: 'my-5', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetrooperblueishgray.jpg'), hardcoded: true },
  { id: 'my-6', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetroopercrusade.jpg'), hardcoded: true },
  { id: 'my-7', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetrooperdefault.jpg'), hardcoded: true },
  { id: 'my-8', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetrooperdefault3.0.png'), hardcoded: true },
  { id: 'my-9', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetrooperdevestation.jpg'), hardcoded: true },
  { id: 'my-10', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetroopergreen.jpg'), hardcoded: true },
  { id: 'my-11', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetroopergreencamo.jpg'), hardcoded: true },
  { id: 'my-12', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetrooperlightbluegreen.jpg'), hardcoded: true },
  { id: 'my-13', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetroopermustardyellow.jpg'), hardcoded: true },
  { id: 'my-14', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetrooperorange.jpg'), hardcoded: true },
  { id: 'my-15', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetroopersplitblack.jpg'), hardcoded: true },
  { id: 'my-16', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetroopersplitgreen.jpg'), hardcoded: true },
  { id: 'my-17', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetrooperyellow.jpg'), hardcoded: true },
];

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;
const columns = isDesktop ? 5 : 3;
const cardSize = isDesktop ? 160 : 110;
const cardHeightMultiplier = 2;
const horizontalSpacing = isDesktop ? 40 : 20;
const verticalSpacing = isDesktop ? 50 : 30;

// Permissions
const ALLOWED_EMAILS = ['will@test.com', 'c1wcummings@gmail.com', 'samuelp.woodwell@gmail.com'];
const RESTRICT_ACCESS = true;

const RangerSquad = () => {
  const navigation = useNavigation();
  const [previewClone, setPreviewClone] = useState(null);
  const [samsSquad, setSamsSquad] = useState(samsClones);
  const [mySquad, setMySquad] = useState(myClones);
  const [deleteModal, setDeleteModal] = useState({ visible: false, clone: null });
  const canMod = RESTRICT_ACCESS ? auth.currentUser?.email && ALLOWED_EMAILS.includes(auth.currentUser.email) : true;

  // Fetch dynamic clones for Sam's Clones from Firestore
  useEffect(() => {
    // Validate hardcoded clones
    const validatedSamsClones = samsClones.map((clone, index) => ({
      ...clone,
      id: clone.id || `sam-${index + 1}`,
      hardcoded: true,
      clickable: true,
    }));
    console.log('Validated Sam\'s Clones:', validatedSamsClones.map(c => ({ id: c.id, name: c.name, codename: c.codename })));
    setSamsSquad(validatedSamsClones);

    const validatedMyClones = myClones.map((clone, index) => ({
      ...clone,
      id: clone.id || `my-${index + 1}`,
      hardcoded: true,
      clickable: true,
    }));
    setMySquad(validatedMyClones);

    const unsub = onSnapshot(collection(db, 'rangerSquad'), (snap) => {
      if (snap.empty) {
        console.log('No clones found in Firestore');
        setSamsSquad(validatedSamsClones);
        return;
      }
      const dynamicClones = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        clickable: true,
        borderColor: doc.data().borderColor || '#00b3ff',
        hardcoded: false,
        collectionPath: 'rangerSquad',
      }));
      console.log('Fetched dynamic clones:', dynamicClones.map(c => ({ id: c.id, name: c.name || c.codename })));

      // Filter out dynamic clones that match hardcoded by id or name/codename
      const filteredDynamic = dynamicClones.filter(
        (dynamic) => !validatedSamsClones.some(
          (clone) => clone.id === dynamic.id || clone.name === (dynamic.name || dynamic.codename) || clone.codename === (dynamic.name || dynamic.codename)
        )
      );
      console.log('Filtered dynamic clones:', filteredDynamic.map(c => ({ id: c.id, name: c.name || c.codename })));

      // Combine and deduplicate by id for Sam's Clones
      const combinedMap = new Map();
      [...validatedSamsClones, ...filteredDynamic].forEach((clone) => {
        combinedMap.set(clone.id, clone);
      });
      const combined = Array.from(combinedMap.values());
      console.log('Combined Sam\'s clones:', combined.map(c => ({ id: c.id, name: c.name || c.codename })));
      setSamsSquad(combined);
    }, (e) => {
      console.error('Firestore error:', e.code, e.message);
      Alert.alert('Error', `Failed to fetch clones: ${e.message}`);
    });
    return () => unsub();
  }, []);

  const goToChat = () => {
    console.log('Navigating to TeamChat:', new Date().toISOString());
    try {
      navigation.navigate('TeamChat');
    } catch (error) {
      console.error('Navigation error to TeamChat:', error);
    }
  };

  const handleClonePress = (clone) => {
    if (!clone?.clickable) {
      console.log('Card not clickable:', clone?.name || clone?.codename);
      return;
    }
    console.log('Card pressed:', clone.name || clone.codename, 'Screen:', clone.screen);
    if (clone.screen && clone.hardcoded) {
      try {
        navigation.navigate(clone.screen);
      } catch (error) {
        console.error('Navigation error to', clone.screen, ':', error);
      }
    } else {
      setPreviewClone(clone);
    }
  };

  const confirmDelete = async (rangerSquadId) => {
    if (!auth.currentUser || !ALLOWED_EMAILS.includes(auth.currentUser.email)) {
      Alert.alert('Access Denied', 'Only authorized users can delete clones.');
      return;
    }
    try {
      const cloneItem = samsSquad.find(c => c.id === rangerSquadId);
      if (cloneItem.hardcoded) {
        Alert.alert('Error', 'Cannot delete hardcoded clones!');
        return;
      }
      const cloneRef = doc(db, 'rangerSquad', rangerSquadId);
      const snap = await getDoc(cloneRef);
      if (!snap.exists()) {
        Alert.alert('Error', 'Clone not found');
        return;
      }
      const { imageUrl } = snap.data();
      if (imageUrl && imageUrl !== 'placeholder') {
        let path = '';
        try {
          console.log('Raw imageUrl:', imageUrl); // Debug raw URL
          if (typeof imageUrl !== 'string' || !imageUrl.includes('/o/')) {
            console.warn('Invalid imageUrl format:', imageUrl);
          } else {
            const urlParts = imageUrl.split('/o/');
            path = decodeURIComponent(urlParts[1].split('?')[0]);
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
          Alert.alert('Warning', `Failed to delete image from storage: ${e.message}. Clone will still be deleted.`);
        }
      } else {
        console.log('No image to delete or imageUrl is placeholder:', imageUrl);
      }
      await deleteDoc(cloneRef);
      console.log('Clone deleted from Firestore:', rangerSquadId);
      setSamsSquad(samsSquad.filter(c => c.id !== rangerSquadId));
      setDeleteModal({ visible: false, clone: null });
      Alert.alert('Success', 'Clone deleted successfully!');
    } catch (e) {
      console.error('Delete clone error:', e.message);
      Alert.alert('Error', `Failed to delete clone: ${e.message}`);
    }
  };

  const renderGrid = (clones, numRows, section) => {
    return Array.from({ length: numRows }).map((_, rowIndex) => (
      <View key={`${section}-${rowIndex}`} style={[styles.row, { gap: horizontalSpacing, marginBottom: verticalSpacing }]}>
        {Array.from({ length: columns }).map((_, colIndex) => {
          const memberIndex = rowIndex * columns + colIndex;
          const clone = clones[memberIndex];

          if (!clone) return <View key={colIndex} style={{ width: cardSize, height: cardSize * cardHeightMultiplier }} />;

          return (
            <View key={clone.id || `${section}-${colIndex}`} style={styles.cloneCont}>
              <TouchableOpacity
                style={[
                  styles.card,
                  { width: cardSize, height: cardSize * cardHeightMultiplier },
                  clone.clickable ? styles.clickable(clone.borderColor || '#00b3ff') : styles.disabledCard,
                ]}
                onPress={() => handleClonePress(clone)}
                disabled={!clone.clickable}
              >
                <Image
                  source={
                    clone.image ||
                    (clone.imageUrl && clone.imageUrl !== 'placeholder'
                      ? { uri: clone.imageUrl }
                      : require('../../../assets/Armor/PlaceHolder.jpg'))
                  }
                  style={styles.characterImage}
                  resizeMode="cover"
                  onError={(e) => console.error('Image load error:', clone.name || clone.codename, e.nativeEvent.error)}
                />
                <View style={styles.transparentOverlay} />
                <Text style={styles.codename}>{clone.codename || ''}</Text>
                <Text style={styles.name}>{clone.name || ''}</Text>
              </TouchableOpacity>
              {section === 'sams' && !clone.hardcoded && (
                <View style={styles.buttons}>
                  <TouchableOpacity
                    onPress={() => setPreviewClone({ ...clone, isEditing: true })}
                    style={[styles.edit, !canMod && styles.disabled]}
                    disabled={!canMod}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setDeleteModal({ visible: true, clone: { id: clone.id, name: clone.name || clone.codename || 'Unknown' } })}
                    style={[styles.delete, !canMod && styles.disabled]}
                    disabled={!canMod}
                  >
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </View>
    ));
  };

  const renderPreviewCard = (clone) => {
    try {
      return (
        <TouchableOpacity
          key={clone.id || clone.name || clone.codename}
          style={[styles.previewCard(isDesktop, SCREEN_WIDTH), styles.clickable(clone.borderColor || '#00b3ff')]}
          onPress={() => {
            console.log('Closing preview modal');
            setPreviewClone(null);
          }}
        >
          <Image
            source={
              clone.image ||
              (clone.imageUrl && clone.imageUrl !== 'placeholder'
                ? { uri: clone.imageUrl }
                : require('../../../assets/Armor/PlaceHolder.jpg'))
            }
            style={styles.previewImage}
            resizeMode="cover"
            onError={(e) => console.error('Preview image load error:', clone.name || clone.codename, e.nativeEvent.error)}
          />
          <View style={styles.transparentOverlay} />
          <Text style={styles.cardName}>
            © {clone.codename || clone.name || 'Unknown'}; Samuel Woodwell
          </Text>
        </TouchableOpacity>
      );
    } catch (error) {
      console.error('Error rendering preview card:', clone.name || clone.codename, error);
      return null;
    }
  };

  return (
    <ImageBackground source={require('../../../assets/BackGround/RangerSquad.jpg')} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={() => {
            console.log('Back button pressed:', new Date().toISOString());
            navigation.goBack();
          }}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Ranger Squad 17</Text>
          <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
            <Text style={styles.chatText}>🛡️</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Sam's Clones */}
          <Text style={styles.sectionTitle}>Sam's Clones</Text>
          {renderGrid(samsSquad, Math.ceil(samsSquad.length / columns), 'sams')}
          <SamsArmory
            collectionPath="rangerSquad"
            placeholderImage={require('../../../assets/Armor/PlaceHolder.jpg')}
            friend={samsSquad}
            setFriend={setSamsSquad}
            hardcodedFriend={samsClones}
            editingFriend={previewClone?.isEditing ? previewClone : null}
            setEditingFriend={setPreviewClone}
          />

          {/* Separator */}
          <View style={styles.separatorContainer}>
            <Text style={styles.separatorText}>
              ______________________________________________________________________________________________________________________________
            </Text>
          </View>

          {/* My Clones */}
          <Text style={styles.sectionTitle}>My Clones</Text>
          {renderGrid(mySquad, Math.ceil(mySquad.length / columns), 'my')}
        </ScrollView>

        {/* Preview Modal */}
        {previewClone && !previewClone.isEditing && (
          <Modal
            visible={!!previewClone}
            transparent={true}
            animationType="fade"
            onRequestClose={() => {
              console.log('Closing preview modal');
              setPreviewClone(null);
            }}
          >
            <View style={styles.modalBackground}>
              <TouchableOpacity
                style={styles.modalOuterContainer}
                activeOpacity={1}
                onPress={() => {
                  console.log('Closing preview modal');
                  setPreviewClone(null);
                }}
              >
                <View style={styles.imageContainer}>
                  <ScrollView
                    horizontal
                    contentContainerStyle={styles.imageScrollContainer}
                    showsHorizontalScrollIndicator={false}
                    snapToAlignment="center"
                    snapToInterval={isDesktop ? SCREEN_WIDTH * 0.15 : SCREEN_WIDTH * 0.6}
                    decelerationRate="fast"
                    centerContent={true}
                  >
                    {renderPreviewCard(previewClone)}
                  </ScrollView>
                </View>
                <View style={styles.previewAboutSection}>
                  <Text style={styles.previewCodename}>{previewClone?.codename || 'No Codename'}</Text>
                  <Text style={styles.previewName}>{previewClone?.name || 'Unknown'}</Text>
                  <Text style={styles.previewDesc}>{previewClone?.description || 'No description available'}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('Closing preview modal');
                      setPreviewClone(null);
                    }}
                    style={styles.close}
                  >
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          visible={deleteModal.visible}
          transparent
          animationType="slide"
          onRequestClose={() => setDeleteModal({ visible: false, clone: null })}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{`Delete "${deleteModal.clone?.name || ''}" and its image?`}</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() => setDeleteModal({ visible: false, clone: null })}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalDelete}
                  onPress={() => deleteModal.clone && confirmDelete(deleteModal.clone.id)}
                >
                  <Text style={styles.modalDeleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
  },
  backText: {
    fontSize: 18,
    color: '#00b3ff',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
  },
  chatButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
  },
  chatText: {
    fontSize: 18,
    color: '#00b3ff',
    fontWeight: 'bold',
  },
  scrollContainer: {
    paddingBottom: 20,
    flexGrow: 1,
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cloneCont: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#1c1c1c',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 5,
    shadowColor: '#00b3ff',
    shadowOpacity: 1.5,
    shadowRadius: 10,
    elevation: 5,
  },
  disabledCard: {
    shadowColor: 'transparent',
    backgroundColor: '#444',
  },
  clickable: (borderColor) => ({
    borderWidth: 2,
    borderColor: borderColor || '#00b3ff',
  }),
  characterImage: {
    width: '100%',
    height: '86%',
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1,
  },
  codename: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  name: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#aaa',
    textAlign: 'center',
  },
  separatorContainer: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
    marginBottom: verticalSpacing,
  },
  separatorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00b3ff',
    textAlign: 'center',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00b3ff',
    textAlign: 'center',
    marginVertical: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: cardSize,
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
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  disabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOuterContainer: {
    width: '80%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#1c1c1c',
    alignItems: 'center',
    paddingLeft: 10,
  },
  imageScrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewCard: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.15 : SCREEN_WIDTH * 0.6,
    height: isDesktop ? SCREEN_HEIGHT * 0.5 : SCREEN_HEIGHT * 0.4,
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
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  previewAboutSection: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
    width: '100%',
  },
  previewCodename: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00b3ff',
    textAlign: 'center',
  },
  previewName: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 5,
  },
  previewDesc: {
    fontSize: 14,
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

export default RangerSquad;