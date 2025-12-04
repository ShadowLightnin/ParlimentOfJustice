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
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db, auth, storage } from '../../lib/firebase';
import { collection, onSnapshot, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import VigilantesWanted from './VigilantesWanted';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isDesktop = SCREEN_WIDTH > 600;

// Card dimensions (clean + consistent)
const cardSizes = {
  desktop: { width: 360, height: 520 },
  mobile: { width: 280, height: 420 },
};

// Hardcoded vigilantes (currently empty – you can add later if needed)
const hardcodedVigilantes = [];

const ALLOWED_EMAILS = ['will@test.com', 'c1wcummings@gmail.com'];
const RESTRICT_ACCESS = true;

const VigilanteScreen = () => {
  const navigation = useNavigation();
  const [previewVigilante, setPreviewVigilante] = useState(null);
  const [vigilantes, setVigilantes] = useState(hardcodedVigilantes);
  const [deleteModal, setDeleteModal] = useState({ visible: false, vigilante: null });

  const canMod = RESTRICT_ACCESS
    ? auth.currentUser && ALLOWED_EMAILS.includes(auth.currentUser.email)
    : true;

  // 🔽 INCIDENT / LORE DROPDOWN
  const [infoOpen, setInfoOpen] = useState(false);
  const infoAnim = useRef(new Animated.Value(0)).current;

  const toggleInfo = useCallback(() => {
    if (infoOpen) {
      Animated.timing(infoAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setInfoOpen(false));
    } else {
      setInfoOpen(true);
      Animated.timing(infoAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [infoOpen, infoAnim]);

  // Fetch dynamic vigilantes
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'vigilantes'),
      (snap) => {
        const dynamicVigilantes = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          clickable: true,
          borderColor: d.data().borderColor || '#C0C0C0',
          hardcoded: false,
        }));

        setVigilantes([...hardcodedVigilantes, ...dynamicVigilantes]);
      },
      (e) => {
        console.error('Firestore error:', e.message);
        Alert.alert('Error', 'Failed to fetch vigilantes: ' + e.message);
      }
    );
    return () => unsub();
  }, []);

  const handleVigilantePress = (vigilante) => {
    if (!vigilante.clickable) return;

    if (vigilante.screen) {
      console.log('Navigating to screen:', vigilante.screen);
      navigation.navigate(vigilante.screen);
    } else {
      console.log(
        'Showing preview for vigilante:',
        vigilante.name || vigilante.codename || 'Unknown'
      );
      setPreviewVigilante(vigilante);
    }
  };

  const confirmDelete = async (id) => {
    if (!auth.currentUser || !ALLOWED_EMAILS.includes(auth.currentUser.email)) {
      Alert.alert('Access Denied', 'Only authorized users can delete vigilantes.');
      return;
    }
    try {
      const vigilanteItem = vigilantes.find((v) => v.id === id);
      if (vigilanteItem?.hardcoded) {
        Alert.alert('Error', 'Cannot delete hardcoded vigilantes!');
        return;
      }
      const vigilanteRef = doc(db, 'vigilantes', id);
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
            await deleteObject(ref(storage, path)).catch((e) => {
              if (e.code !== 'storage/object-not-found') {
                throw e;
              }
              console.warn('Image not found in storage:', path);
            });
            console.log('Image deleted or not found:', path);
          }
        } catch (e) {
          console.error('Delete image error:', e.message, 'Path:', path, 'URL:', imageUrl);
          Alert.alert(
            'Warning',
            `Failed to delete image from storage: ${e.message}. Vigilante will still be deleted.`
          );
        }
      }

      await deleteDoc(vigilanteRef);
      console.log('Vigilante deleted from Firestore:', id);
      setVigilantes((prev) => prev.filter((v) => v.id !== id));
      setDeleteModal({ visible: false, vigilante: null });
      Alert.alert('Success', 'Vigilante deleted successfully!');
    } catch (e) {
      console.error('Delete vigilante error:', e.message);
      Alert.alert('Error', `Failed to delete vigilante: ${e.message}`);
    }
  };

  // Card renderer
  const renderVigilanteCard = (vigilante) => {
    const cardWidth = isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width;
    const cardHeight = isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height;

    const key =
      vigilante.id ||
      vigilante.name ||
      vigilante.codename ||
      (vigilante.image ? vigilante.image.toString() : Math.random().toString());

    return (
      <View key={key} style={styles.vigilanteCont}>
        <TouchableOpacity
          style={[
            styles.vigilanteCard,
            { width: cardWidth, height: cardHeight },
            vigilante.clickable
              ? styles.clickable(vigilante.borderColor)
              : styles.notClickable,
          ]}
          onPress={() => handleVigilantePress(vigilante)}
          disabled={!vigilante.clickable}
        >
          <Image
            source={
              vigilante.image ||
              (vigilante.imageUrl && vigilante.imageUrl !== 'placeholder'
                ? { uri: vigilante.imageUrl }
                : require('../../assets/Armor/PlaceHolder.jpg'))
            }
            style={styles.vigilanteImg}
            resizeMode="cover"
          />
          <View style={styles.cardOverlay} />
          <Text style={styles.vigilanteName}>
            {vigilante.name || vigilante.codename || 'Unknown'}
          </Text>
          {!vigilante.clickable && <Text style={styles.disabledText}>Unusable</Text>}
        </TouchableOpacity>

        {!vigilante.hardcoded && (
          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={() => setPreviewVigilante({ ...vigilante, isEditing: true })}
              style={[styles.edit, !canMod && styles.disabled]}
              disabled={!canMod}
            >
              <Text style={styles.buttonText}>Fix</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                setDeleteModal({
                  visible: true,
                  vigilante: {
                    id: vigilante.id,
                    name: vigilante.name || vigilante.codename || 'Unknown',
                  },
                })
              }
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

  const renderPreviewCard = (vigilante) => (
    <View
      style={[
        styles.previewCard(isDesktop, SCREEN_WIDTH),
        styles.clickable(vigilante.borderColor || '#C0C0C0'),
      ]}
    >
      <Image
        source={
          vigilante.image ||
          (vigilante.imageUrl && vigilante.imageUrl !== 'placeholder'
            ? { uri: vigilante.imageUrl }
            : require('../../assets/Armor/PlaceHolder.jpg'))
        }
        style={styles.previewImage}
        resizeMode="cover"
      />
      <View style={styles.previewOverlay} />
      <Text style={styles.cardName}>
        © {vigilante.name || vigilante.codename || 'Unknown'}; William Cummings
      </Text>
    </View>
  );

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Vigilantes.jpg')}
      style={styles.bg}
    >
      <View style={styles.mainOverlay}>
        {/* HEADER */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity
            onPress={() => {
              console.log('Navigating to Justice');
              navigation.navigate('Justice');
            }}
            style={styles.backButton}
            activeOpacity={0.85}
          >
            <Text style={styles.backText}>⬅️ Back</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <View style={styles.headerGlass}>
              <Text style={styles.headerTitle}>The Vigilantes</Text>
              <Text style={styles.headerSubtitle}>
                The ones that caused The Incident
              </Text>
              <TouchableOpacity onPress={toggleInfo} activeOpacity={0.85}>
                <Text style={styles.headerHint}>
                  {infoOpen ? 'Hide incident dossier ⬆️' : 'Tap for incident dossier ⬇️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* right spacer for symmetry */}
          <View style={{ width: 60 }} />
        </View>

        {/* FLOATING INCIDENT / LORE PANEL */}
        <Animated.View
          pointerEvents={infoOpen ? 'auto' : 'none'}
          style={[
            styles.infoPanel,
            {
              opacity: infoAnim,
              transform: [
                {
                  translateY: infoAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-10, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {infoOpen && (
            <ScrollView
              style={styles.infoScroll}
              contentContainerStyle={styles.infoScrollContent}
              nestedScrollEnabled
            >
              <View style={styles.infoHeaderRow}>
                <Text style={styles.infoHeaderTitle}>
                  The Vigilantes — Incident Dossier
                </Text>
                <TouchableOpacity
                  onPress={toggleInfo}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Text style={styles.infoClose}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.infoSectionTitle}>Who they are</Text>
              <Text style={styles.infoText}>
                A scattered faction of broken heroes, failed sidekicks, and
                disillusioned soldiers who decided the systems meant to protect
                people were the real problem. They stopped asking permission and
                started writing their own rules in blood and neon.
              </Text>

              <Text style={styles.infoSectionTitle}>The Incident</Text>
              <Text style={styles.infoText}>
                What began as a &quot;final clean-up&quot; operation spiraled into
                a cascading catastrophe — collateral damage, chain reactions, and
                a dozen bad calls stacked on top of each other. The world saw
                mass destruction; the Parliament saw a warning.
              </Text>

              <Text style={styles.infoSectionTitle}>How the world sees them</Text>
              <Text style={styles.infoText}>
                • To governments: terrorists with capes and military-grade hardware.{'\n'}
                • To street-level citizens: folk monsters and whispered campfire
                stories.{'\n'}
                • To some heroes: the nightmare version of what they could become.
              </Text>

              <Text style={styles.infoSectionTitle}>Why they still matter</Text>
              <Text style={styles.infoText}>
                Even after The Incident, their tactics, tech, and ideology echo
                through the underground. Every time a hero crosses a line, every
                time a city cheers a brutal win, someone quietly asks:{' '}
                &quot;Are we becoming them?&quot;
              </Text>
            </ScrollView>
          )}
        </Animated.View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {/* HORIZONTAL LIST */}
          <View style={styles.scrollWrapper}>
            <ScrollView
              horizontal
              contentContainerStyle={styles.hScroll}
              showsHorizontalScrollIndicator={false}
            >
              {vigilantes.length > 0 ? (
                vigilantes.map(renderVigilanteCard)
              ) : (
                <Text style={styles.noVigilantesText}>No vigilantes found...</Text>
              )}
            </ScrollView>
          </View>

          {/* ADD / EDIT FORM */}
          <VigilantesWanted
            collectionPath="vigilantes"
            placeholderImage={require('../../assets/Armor/PlaceHolder.jpg')}
            hero={vigilantes}
            setHero={setVigilantes}
            hardcodedHero={hardcodedVigilantes}
            editingHero={previewVigilante?.isEditing ? previewVigilante : null}
            setEditingHero={setPreviewVigilante}
          />
        </ScrollView>

        {/* PREVIEW MODAL */}
        <Modal
          visible={!!previewVigilante && !previewVigilante.isEditing}
          transparent
          animationType="fade"
          onRequestClose={() => setPreviewVigilante(null)}
        >
          <View style={styles.modalBackground}>
            <TouchableOpacity
              style={styles.modalOuterContainer}
              activeOpacity={1}
              onPress={() => setPreviewVigilante(null)}
            >
              <View style={styles.modalInner}>
                {previewVigilante && renderPreviewCard(previewVigilante)}
                <View style={styles.previewAboutSection}>
                  <Text style={styles.previewName}>
                    {previewVigilante?.name ||
                      previewVigilante?.codename ||
                      'Unknown Vigilante'}
                  </Text>
                  <ScrollView
                    style={styles.descriptionScroll}
                    contentContainerStyle={styles.descriptionContent}
                  >
                    <Text style={styles.previewDesc}>
                      {previewVigilante?.description ||
                        'A fractured soul walking the line.'}
                    </Text>
                  </ScrollView>
                  <TouchableOpacity
                    onPress={() => setPreviewVigilante(null)}
                    style={styles.close}
                  >
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>

        {/* DELETE MODAL */}
        <Modal
          visible={deleteModal.visible}
          transparent
          animationType="slide"
          onRequestClose={() => setDeleteModal({ visible: false, vigilante: null })}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>
                {`Erase "${deleteModal.vigilante?.name || ''}" from the records?`}
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() => setDeleteModal({ visible: false, vigilante: null })}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalDelete}
                  onPress={() =>
                    deleteModal.vigilante && confirmDelete(deleteModal.vigilante.id)
                  }
                >
                  <Text style={styles.modalDeleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
  },
  mainOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    position: 'relative',           // so the info panel can be absolutely positioned
  },

  // HEADER
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 20,
    paddingBottom: 12,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: 'rgba(10,10,10,0.85)',
  },
  backText: {
    color: '#f5f5f5',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerGlass: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(30,30,40,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255,0,80,0.6)',
  },
  headerTitle: {
    fontSize: isDesktop ? 28 : 22,
    fontWeight: '900',
    color: '#ffe6ec',
    textAlign: 'center',
    letterSpacing: 1.2,
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
    color: '#ff9bb8',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  headerHint: {
    fontSize: 11,
    marginTop: 4,
    textAlign: 'center',
    color: '#fecaca',
  },

  // FLOATING INFO PANEL
  infoPanel: {
    position: 'absolute',
    top: 80,             // sits under header; tweak if needed
    left: 10,
    right: 10,
    zIndex: 20,
    elevation: 20,

    borderRadius: 18,
    backgroundColor: 'rgba(10,10,15,0.97)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  infoScroll: {
    maxHeight: SCREEN_HEIGHT * 0.5,
  },
  infoScrollContent: {
    paddingBottom: 4,
  },
  infoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoHeaderTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffe6ec',
  },
  infoClose: {
    fontSize: 16,
    color: '#ffe6ec',
  },
  infoSectionTitle: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '900',
    color: '#fecaca',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  infoText: {
    fontSize: 12,
    color: '#f9a8d4',
    marginTop: 2,
    lineHeight: 16,
  },

  scroll: {
    paddingBottom: 24,
  },

  scrollWrapper: {
    width: '100%',
    marginTop: 10,
  },
  hScroll: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },

  vigilanteCont: {
    marginRight: 16,
    alignItems: 'center',
  },
  vigilanteCard: {
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(20,20,30,0.9)',
    borderWidth: 1.5,
    elevation: 10,
    shadowColor: '#ff0040',
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  clickable: (borderColor) => ({
    borderColor: borderColor || '#C0C0C0',
  }),
  notClickable: {
    opacity: 0.6,
  },
  vigilanteImg: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  vigilanteName: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    right: 12,
    fontSize: 16,
    color: '#ffffff',
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowRadius: 8,
  },
  disabledText: {
    position: 'absolute',
    top: 10,
    right: 12,
    fontSize: 12,
    color: '#ff6666',
    fontWeight: '600',
  },

  noVigilantesText: {
    fontSize: 16,
    color: '#f0f0f0',
    paddingHorizontal: 16,
  },

  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
    marginTop: 8,
  },
  edit: {
    backgroundColor: 'rgba(75,0,130,0.9)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 6,
    alignItems: 'center',
  },
  delete: {
    backgroundColor: 'rgba(139,0,0,0.9)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    flex: 1,
    marginLeft: 6,
    alignItems: 'center',
  },
  disabled: {
    backgroundColor: '#555',
    opacity: 0.5,
  },
  buttonText: {
    color: '#f5f5f5',
    fontWeight: '600',
    fontSize: 13,
  },

  // PREVIEW MODAL
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOuterContainer: {
    width: '90%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalInner: {
    width: '100%',
    borderRadius: 18,
    backgroundColor: 'rgba(10,10,15,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255,0,80,0.7)',
    overflow: 'hidden',
  },
  previewCard: (isDesktopVal, windowWidth) => ({
    width: isDesktopVal ? windowWidth * 0.22 : windowWidth * 0.8,
    height: isDesktopVal ? SCREEN_HEIGHT * 0.55 : SCREEN_HEIGHT * 0.45,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(20,20,30,0.95)',
  }),
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  cardName: {
    position: 'absolute',
    bottom: 10,
    left: 12,
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },
  previewAboutSection: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  previewName: {
    fontSize: 18,
    color: '#ffe6ec',
    marginBottom: 6,
    fontWeight: '700',
  },
  descriptionScroll: {
    maxHeight: 120,
  },
  descriptionContent: {
    paddingVertical: 4,
  },
  previewDesc: {
    fontSize: 14,
    color: '#ff9bb8',
  },
  close: {
    marginTop: 10,
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(75,0,130,0.9)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 999,
  },

  // DELETE MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'rgba(20,20,30,0.95)',
    padding: 20,
    borderRadius: 14,
    alignItems: 'center',
    width: '80%',
    borderWidth: 1,
    borderColor: 'rgba(255,0,80,0.6)',
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
    backgroundColor: 'rgba(75,0,130,0.9)',
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginRight: 6,
  },
  modalCancelText: {
    color: '#f5f5f5',
    fontWeight: '600',
    textAlign: 'center',
  },
  modalDelete: {
    backgroundColor: 'rgba(139,0,0,0.9)',
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    marginLeft: 6,
  },
  modalDeleteText: {
    color: '#f5f5f5',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default VigilanteScreen;
