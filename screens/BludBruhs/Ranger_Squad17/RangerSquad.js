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
const isDesktop = SCREEN_WIDTH > 600;

// Layout
const columns = isDesktop ? 5 : 3;
const cardSize = isDesktop ? 160 : 110;
const cardHeightMultiplier = 2;
const horizontalSpacing = isDesktop ? 32 : 16;
const verticalSpacing = isDesktop ? 40 : 26;

// ⚔️ Clone / UNSC palette
const CLONE = {
  cyan: '#00b3ff',
  cyanBright: '#00e5ff',
  steel: '#6fb7ff',
  darkGlass: 'rgba(5, 15, 30, 0.92)',
  glass: 'rgba(10, 25, 50, 0.86)',
};

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
  // { id: 'my-1', name: 'Split', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetroopersplit.jpg'), hardcoded: true },
  // { id: 'my-2', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetrooperdarkbluegreen.jpg'), hardcoded: true },
  // { id: 'my-3', name: 'Marine Commander', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetroopermarinecommander.jpg'), hardcoded: true },
  // { id: 'my-4', name: 'Lieutenant Truffel', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetrooperlutenietTruffel.jpg'), hardcoded: true },
  // { id: 'my-5', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetrooperblueishgray.jpg'), hardcoded: true },
  // { id: 'my-6', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetroopercrusade.jpg'), hardcoded: true },
  // { id: 'my-7', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetrooperdefault.jpg'), hardcoded: true },
  // { id: 'my-8', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetrooperdefault3.0.png'), hardcoded: true },
  // { id: 'my-9', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetrooperdevestation.jpg'), hardcoded: true },
  // { id: 'my-10', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetroopergreen.jpg'), hardcoded: true },
  // { id: 'my-11', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetroopergreencamo.jpg'), hardcoded: true },
  // { id: 'my-12', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetrooperlightbluegreen.jpg'), hardcoded: true },
  // { id: 'my-13', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetroopermustardyellow.jpg'), hardcoded: true },
  // { id: 'my-14', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetrooperorange.jpg'), hardcoded: true },
  // { id: 'my-15', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetroopersplitblack.jpg'), hardcoded: true },
  // { id: 'my-16', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetroopersplitgreen.jpg'), hardcoded: true },
  // { id: 'my-17', name: '', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Clone/clonetrooperyellow.jpg'), hardcoded: true },
];

// Permissions
const ALLOWED_EMAILS = [
  'will@test.com',
  'c1wcummings@gmail.com',
  'samuelp.woodwell@gmail.com',
];
const RESTRICT_ACCESS = true;

const RangerSquad = () => {
  const navigation = useNavigation();
  const [previewClone, setPreviewClone] = useState(null);
  const [samsSquad, setSamsSquad] = useState(samsClones);
  const [mySquad, setMySquad] = useState(myClones);
  const [deleteModal, setDeleteModal] = useState({ visible: false, clone: null });

  const canMod = RESTRICT_ACCESS
    ? auth.currentUser?.email && ALLOWED_EMAILS.includes(auth.currentUser.email)
    : true;

  // Setup + Firestore sync
  useEffect(() => {
    const validatedSamsClones = samsClones.map((clone, index) => ({
      ...clone,
      id: clone.id || `sam-${index + 1}`,
      hardcoded: true,
      clickable: true,
    }));
    setSamsSquad(validatedSamsClones);

    const validatedMyClones = myClones.map((clone, index) => ({
      ...clone,
      id: clone.id || `my-${index + 1}`,
      hardcoded: true,
      clickable: true,
    }));
    setMySquad(validatedMyClones);

    const unsub = onSnapshot(
      collection(db, 'rangerSquad'),
      (snap) => {
        if (snap.empty) {
          setSamsSquad(validatedSamsClones);
          return;
        }

        const dynamicClones = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          clickable: true,
          borderColor: d.data().borderColor || CLONE.cyan,
          hardcoded: false,
          collectionPath: 'rangerSquad',
        }));

        const filteredDynamic = dynamicClones.filter(
          (dynamic) =>
            !validatedSamsClones.some(
              (clone) =>
                clone.id === dynamic.id ||
                clone.name === (dynamic.name || dynamic.codename) ||
                clone.codename === (dynamic.name || dynamic.codename)
            )
        );

        const combinedMap = new Map();
        [...validatedSamsClones, ...filteredDynamic].forEach((clone) => {
          combinedMap.set(clone.id, clone);
        });
        const combined = Array.from(combinedMap.values());
        setSamsSquad(combined);
      },
      (e) => {
        console.error('Firestore error:', e.code, e.message);
        Alert.alert('Error', `Failed to fetch clones: ${e.message}`);
      }
    );
    return () => unsub();
  }, []);

  const goToChat = () => {
    try {
      navigation.navigate('TeamChat');
    } catch (error) {
      console.error('Navigation error to TeamChat:', error);
    }
  };

  const handleClonePress = (clone) => {
    if (!clone?.clickable) return;

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
      const cloneItem = samsSquad.find((c) => c.id === rangerSquadId);
      if (cloneItem?.hardcoded) {
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
          if (typeof imageUrl === 'string' && imageUrl.includes('/o/')) {
            const urlParts = imageUrl.split('/o/');
            path = decodeURIComponent(urlParts[1].split('?')[0]);
            await deleteObject(ref(storage, path)).catch((e) => {
              if (e.code !== 'storage/object-not-found') throw e;
              console.warn('Image not found in storage:', path);
            });
          } else {
            console.warn('Invalid imageUrl format:', imageUrl);
          }
        } catch (e) {
          console.error('Delete image error:', e.message, 'Path:', path, 'URL:', imageUrl);
          Alert.alert(
            'Warning',
            `Failed to delete image from storage: ${e.message}. Clone will still be deleted.`
          );
        }
      }

      await deleteDoc(cloneRef);
      setSamsSquad((prev) => prev.filter((c) => c.id !== rangerSquadId));
      setDeleteModal({ visible: false, clone: null });
      Alert.alert('Success', 'Clone deleted successfully!');
    } catch (e) {
      console.error('Delete clone error:', e.message);
      Alert.alert('Error', `Failed to delete clone: ${e.message}`);
    }
  };

  const renderGrid = (clones, numRows, section) =>
    Array.from({ length: numRows }).map((_, rowIndex) => (
      <View
        key={`${section}-${rowIndex}`}
        style={[styles.row, { marginBottom: verticalSpacing }]}
      >
        {Array.from({ length: columns }).map((_, colIndex) => {
          const memberIndex = rowIndex * columns + colIndex;
          const clone = clones[memberIndex];

          if (!clone) {
            return (
              <View
                key={`${section}-empty-${colIndex}`}
                style={{ width: cardSize, height: cardSize * cardHeightMultiplier }}
              />
            );
          }

          return (
            <View key={clone.id || `${section}-${colIndex}`} style={styles.cloneCont}>
              <TouchableOpacity
                style={[
                  styles.card,
                  { width: cardSize, height: cardSize * cardHeightMultiplier },
                  clone.clickable
                    ? styles.clickable(clone.borderColor || CLONE.cyan)
                    : styles.disabledCard,
                ]}
                onPress={() => handleClonePress(clone)}
                disabled={!clone.clickable}
                activeOpacity={0.9}
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
                />
                <View style={styles.cardOverlay} />
                {clone.codename ? (
                  <Text style={styles.codename} numberOfLines={1}>
                    {clone.codename}
                  </Text>
                ) : null}
                {clone.name ? (
                  <Text style={styles.name} numberOfLines={1}>
                    {clone.name}
                  </Text>
                ) : null}
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
                    onPress={() =>
                      setDeleteModal({
                        visible: true,
                        clone: {
                          id: clone.id,
                          name: clone.name || clone.codename || 'Unknown',
                        },
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
        })}
      </View>
    ));

  const renderPreviewCard = (clone) => {
    try {
      return (
        <View
          key={clone.id || clone.name || clone.codename}
          style={[
            styles.previewCard(isDesktop, SCREEN_WIDTH),
            styles.clickable(clone.borderColor || CLONE.cyan),
          ]}
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
          />
          <View style={styles.previewOverlay} />
          <Text style={styles.cardName}>
            © {clone.codename || clone.name || 'Unknown'}; Samuel Woodwell
          </Text>
        </View>
      );
    } catch (error) {
      console.error('Error rendering preview card:', clone.name || clone.codename, error);
      return null;
    }
  };

  return (
    <ImageBackground
      source={require('../../../assets/BackGround/RangerSquad.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.mainOverlay}>
          {/* HEADER — glassy UNSC bar */}
          <View style={styles.headerWrapper}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}
            >
              <Text style={styles.backText}>⬅️ Back</Text>
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <View style={styles.headerGlass}>
                <Text style={styles.headerTitle}>Ranger Squad 17</Text>
                <Text style={styles.headerSubtitleTop}>Rogue detachment of The Eagles that believed in Sam's mission.</Text>
                <Text style={styles.headerSubtitle}>
                  Forward Recon for the Thunder Born
                </Text>
              </View>
            </View>

            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={goToChat}
                style={styles.iconButton}
                activeOpacity={0.85}
              >
                <Text style={styles.chatIcon}>🛡️</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Sam's Clones */}
            {/* <Text style={styles.sectionTitle}>Sam&apos;s Clones</Text> */}
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

            {/* Divider */}
            {/* <View style={styles.separatorContainer}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorLabel}>Custom Detachment</Text>
              <View style={styles.separatorLine} />
            </View> */}

            {/* My Clones */}
            {/* <Text style={styles.sectionTitle}>My Clones</Text>
            {renderGrid(mySquad, Math.ceil(mySquad.length / columns), 'my')} */}
          </ScrollView>

          {/* Preview Modal */}
          {previewClone && !previewClone.isEditing && (
            <Modal
              visible={!!previewClone}
              transparent
              animationType="fade"
              onRequestClose={() => setPreviewClone(null)}
            >
              <View style={styles.modalBackground}>
                <View style={styles.modalInner}>
                  <View style={styles.imageContainer}>
                    <ScrollView
                      horizontal
                      contentContainerStyle={styles.imageScrollContainer}
                      showsHorizontalScrollIndicator={false}
                      snapToAlignment="center"
                      centerContent
                    >
                      {renderPreviewCard(previewClone)}
                    </ScrollView>
                  </View>
                  <View style={styles.previewAboutSection}>
                    <Text style={styles.previewCodename}>
                      {previewClone?.codename || 'No Codename'}
                    </Text>
                    <Text style={styles.previewName}>
                      {previewClone?.name || 'Unknown'}
                    </Text>
                    <Text style={styles.previewDesc}>
                      {previewClone?.description || 'No description available'}
                    </Text>
                    <TouchableOpacity
                      onPress={() => setPreviewClone(null)}
                      style={styles.close}
                    >
                      <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
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
                <Text style={styles.modalText}>
                  {`Delete "${deleteModal.clone?.name || ''}" and its image?`}
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalCancel}
                    onPress={() => setDeleteModal({ visible: false, clone: null })}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalDelete}
                    onPress={() =>
                      deleteModal.clone && confirmDelete(deleteModal.clone.id)
                    }
                  >
                    <Text style={styles.modalDeleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  safeArea: {
    flex: 1,
  },
  mainOverlay: {
    flex: 1,
    backgroundColor: CLONE.darkGlass,
  },

  /* HEADER */
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(140,200,255,0.9)',
    backgroundColor: 'rgba(4,18,40,0.95)',
  },
  backText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#e6f5ff',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerGlass: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 22,
    backgroundColor: CLONE.glass,
    borderWidth: 1,
    borderColor: 'rgba(130,210,255,0.95)',
  },
  headerTitle: {
    fontSize: isDesktop ? 26 : 22,
    fontWeight: '900',
    color: '#ecf8ff',
    textAlign: 'center',
    textShadowColor: CLONE.cyanBright,
    textShadowRadius: 18,
  },
  headerSubtitleTop: {
    fontSize: 12,
    color: '#cce5ff',
    textAlign: 'center',
    marginTop: 2,
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#e2f1ff',
    textAlign: 'center',
    marginTop: 3,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(150,210,255,0.9)',
    backgroundColor: 'rgba(5,20,45,0.95)',
  },
  chatIcon: {
    fontSize: 16,
    color: '#e8f8ff',
  },

  /* SCROLL / GRID */
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: CLONE.steel,
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: horizontalSpacing,
  },
  cloneCont: {
    alignItems: 'center',
  },

  card: {
    backgroundColor: 'rgba(0,0,0,0.78)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderRadius: 14,
    paddingBottom: 6,
    shadowColor: CLONE.cyanBright,
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 2,
  },
  disabledCard: {
    opacity: 0.65,
    shadowOpacity: 0.2,
  },
  clickable: (borderColor) => ({
    borderColor: borderColor || CLONE.cyan,
  }),
  characterImage: {
    width: '100%',
    height: '84%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 14,
  },
  codename: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#f5fbff',
    textAlign: 'center',
    textShadowColor: '#000',
    textShadowRadius: 10,
  },
  name: {
    fontSize: 11,
    color: '#b6c8dd',
    textAlign: 'center',
  },

  separatorContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    paddingHorizontal: 10,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(150,210,255,0.65)',
  },
  separatorLabel: {
    marginHorizontal: 10,
    fontSize: 12,
    color: '#e2f1ff',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  /* BUTTONS under cards */
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: cardSize,
    marginTop: 8,
  },
  edit: {
    backgroundColor: 'rgba(255,193,7,0.9)',
    paddingVertical: 5,
    borderRadius: 8,
    flex: 1,
    marginRight: 6,
    alignItems: 'center',
  },
  delete: {
    backgroundColor: 'rgba(244,67,54,0.9)',
    paddingVertical: 5,
    borderRadius: 8,
    flex: 1,
    marginLeft: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  disabled: {
    backgroundColor: '#666',
    opacity: 0.55,
  },

  /* PREVIEW MODAL */
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalInner: {
    width: '86%',
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(5,15,30,0.96)',
    borderWidth: 1,
    borderColor: 'rgba(130,210,255,0.85)',
  },
  imageContainer: {
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(3,10,25,0.96)',
  },
  imageScrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  previewCard: (isDesk, windowWidth) => ({
    width: isDesk ? windowWidth * 0.22 : windowWidth * 0.75,
    height: isDesk ? SCREEN_HEIGHT * 0.52 : SCREEN_HEIGHT * 0.45,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.85)',
  }),
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  cardName: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    fontSize: 14,
    color: '#f5fbff',
    fontWeight: '600',
    textShadowColor: '#000',
    textShadowRadius: 10,
  },
  previewAboutSection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  previewCodename: {
    fontSize: 18,
    fontWeight: '700',
    color: CLONE.steel,
    textAlign: 'center',
  },
  previewName: {
    fontSize: 15,
    color: '#e0ecff',
    textAlign: 'center',
    marginTop: 4,
  },
  previewDesc: {
    fontSize: 13,
    color: '#cbd8ee',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  close: {
    alignSelf: 'center',
    marginTop: 4,
    backgroundColor: CLONE.cyan,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 999,
  },
  closeText: {
    color: '#02101e',
    fontWeight: '700',
    fontSize: 13,
  },

  /* DELETE MODAL */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(5,15,30,0.96)',
    padding: 20,
    borderRadius: 14,
    alignItems: 'center',
    width: '82%',
    borderWidth: 1,
    borderColor: 'rgba(255,80,80,0.85)',
  },
  modalText: {
    fontSize: 16,
    color: '#f5f5f5',
    marginBottom: 18,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancel: {
    backgroundColor: 'rgba(130,180,255,0.9)',
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginRight: 6,
  },
  modalCancelText: {
    color: '#02101e',
    fontWeight: '600',
    textAlign: 'center',
  },
  modalDelete: {
    backgroundColor: 'rgba(244,67,54,0.9)',
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginLeft: 6,
  },
  modalDeleteText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default RangerSquad;
