// screens/villains/robots/RobotsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  ImageBackground,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { db, auth, storage } from '../../../lib/firebase';
import { collection, onSnapshot, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import DarkLords from './DarkLords';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Layout
const isDesktop = SCREEN_WIDTH > 600;

// Card dimensions for desktop and mobile
const cardSizes = {
  desktop: { width: 400, height: 600 },
  mobile: { width: 320, height: 480 },
};
const horizontalSpacing = isDesktop ? 40 : 16;
const verticalSpacing = isDesktop ? 40 : 16;

// Permissions
const ALLOWED_EMAILS = [
  'will@test.com',
  'c1wcummings@gmail.com',
  'samuelp.woodwell@gmail.com',
];
const RESTRICT_ACCESS = true;

// Hardcoded robots
const hardcodedRobots = [
  {
    id: 'robot-1',
    name: 'Thorax',
    screen: '',
    image: require('../../../assets/Villains/Thorax.jpg'),
    clickable: true,
    borderColor: '#c0c0c0',
    hardcoded: true,
    showSummonPopup: true,
    description: 'A sentient machine with destructive ambitions.',
    collectionPath: 'robots',
  },
];

const RobotsScreen = () => {
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRobot, setSelectedRobot] = useState(null);
  const [currentSound, setCurrentSound] = useState(null);
  const [friend, setFriend] = useState(hardcodedRobots);
  const [deleteModal, setDeleteModal] = useState({ visible: false, robot: null });
  const [previewRobot, setPreviewRobot] = useState(null);
  const [editingFriend, setEditingFriend] = useState(null);

  const canMod = RESTRICT_ACCESS
    ? auth.currentUser?.email && ALLOWED_EMAILS.includes(auth.currentUser.email)
    : true;

  // Cleanup audio
  useEffect(() => {
    return () => {
      if (currentSound) {
        currentSound.stopAsync().catch((e) =>
          console.error('Audio stop error:', e.message)
        );
        currentSound.unloadAsync().catch((e) =>
          console.error('Audio unload error:', e.message)
        );
      }
    };
  }, [currentSound]);

  // Fetch dynamic robots from Firestore
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, 'robots'),
      (snap) => {
        if (snap.empty) {
          setFriend(hardcodedRobots);
          return;
        }

        const dynamicRobots = snap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
          clickable: true,
          borderColor: docSnap.data().borderColor || '#c0c0c0',
          hardcoded: false,
          showSummonPopup: docSnap.data().showSummonPopup || false,
          collectionPath: 'robots',
        }));

        // Filter out dynamic robots that collide with hardcoded by id or name
        const filteredDynamic = dynamicRobots.filter(
          (dynamic) =>
            !hardcodedRobots.some(
              (r) =>
                r.id === dynamic.id ||
                r.name === (dynamic.name || dynamic.codename)
            )
        );

        // Combine & dedupe by id
        const combinedMap = new Map();
        [...hardcodedRobots, ...filteredDynamic].forEach((robot) => {
          combinedMap.set(robot.id, robot);
        });
        const combined = Array.from(combinedMap.values());
        setFriend(combined);
      },
      (e) => {
        console.error('Firestore error:', e.code, e.message);
        Alert.alert('Error', `Failed to fetch robots: ${e.message}`);
      }
    );

    return () => unsub();
  }, []);

  // Audio handler
  const playDemonSound = async (audio, screen) => {
    try {
      if (currentSound) {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(audio);
      setCurrentSound(sound);
      await sound.playAsync();

      if (screen) {
        setTimeout(() => {
          navigation.navigate(screen);
        }, 3000);
      }
    } catch (error) {
      console.error('Audio error:', error.message);
      Alert.alert('Error', 'Failed to play audio: ' + error.message);
    }
  };

  const handlePress = async (robot) => {
    try {
      const name = robot.name || robot.codename || 'Unknown';

      // If it has audio, play it and maybe navigate
      if (robot.audio) {
        await playDemonSound(robot.audio, robot.screen);
        return;
      }

      // If it has a dedicated screen, just navigate
      if (robot.screen) {
        navigation.navigate(robot.screen);
        return;
      }

      // If summon popup flag is set, show summon popup
      if (robot.showSummonPopup) {
        setSelectedRobot(robot);
        setModalVisible(true);
        return;
      }

      // Otherwise open preview
      setPreviewRobot(robot);
    } catch (error) {
      console.error('Handle press error:', error.message);
      Alert.alert('Error', 'Failed to handle press: ' + error.message);
    }
  };

  const confirmDelete = async (id) => {
    if (!auth.currentUser || !ALLOWED_EMAILS.includes(auth.currentUser.email)) {
      Alert.alert('Access Denied', 'Only authorized users can delete robots.');
      return;
    }

    try {
      const robotItem = friend.find((r) => r.id === id);
      if (robotItem?.hardcoded) {
        Alert.alert('Error', 'Cannot delete hardcoded robots!');
        return;
      }

      const robotRef = doc(db, 'robots', id);
      const snap = await getDoc(robotRef);
      if (!snap.exists()) {
        Alert.alert('Error', 'Robot not found');
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
              if (e.code !== 'storage/object-not-found') {
                throw e;
              }
            });
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
            `Failed to delete image from storage: ${e.message}. Robot will still be deleted.`
          );
        }
      }

      await deleteDoc(robotRef);
      setFriend(friend.filter((r) => r.id !== id));
      setDeleteModal({ visible: false, robot: null });
      Alert.alert('Success', 'Robot deleted successfully!');
    } catch (e) {
      console.error('Delete robot error:', e.message);
      Alert.alert('Error', `Failed to delete robot: ${e.message}`);
    }
  };

  // CARD RENDERERS
  const renderRobotCard = (robot) => (
    <View key={robot.id} style={styles.robotCont}>
      <TouchableOpacity
        style={[
          styles.robotCard,
          {
            width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
            height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height,
          },
          robot.clickable
            ? styles.clickable(robot.borderColor)
            : styles.notClickable,
        ]}
        onPress={() => handlePress(robot)}
        disabled={!robot.clickable}
        activeOpacity={0.9}
      >
        <Image
          source={
            robot.image ||
            (robot.imageUrl && robot.imageUrl !== 'placeholder'
              ? { uri: robot.imageUrl }
              : require('../../../assets/BackGround/Robots.jpg'))
          }
          style={styles.robotImage}
          resizeMode="cover"
        />
        <View style={styles.cardOverlay} />
        <Text style={styles.robotName}>
          {robot.name || robot.codename || 'Unknown'}
        </Text>
        {!robot.clickable && (
          <Text style={styles.disabledText}>Not Clickable</Text>
        )}
      </TouchableOpacity>

      {robot.hardcoded === false && (
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => setEditingFriend(robot)}
            style={[styles.edit, !canMod && styles.disabled]}
            disabled={!canMod}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              setDeleteModal({
                visible: true,
                robot: {
                  id: robot.id,
                  name: robot.name || robot.codename || 'Unknown',
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

  const renderPreviewCard = (robot) => (
    <TouchableOpacity
      key={robot.id}
      style={[
        styles.previewCard(isDesktop, SCREEN_WIDTH),
        styles.clickable(robot.borderColor || '#c0c0c0'),
      ]}
      onPress={() => setPreviewRobot(null)}
      activeOpacity={0.9}
    >
      <Image
        source={
          robot.image ||
          (robot.imageUrl && robot.imageUrl !== 'placeholder'
            ? { uri: robot.imageUrl }
            : require('../../../assets/BackGround/Robots.jpg'))
        }
        style={styles.previewImage}
        resizeMode="cover"
      />
      <View style={styles.cardOverlay} />
      <Text style={styles.cardName}>
        © {robot.name || robot.codename || 'Unknown'}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../../assets/BackGround/Robots.jpg')}
      style={styles.background}
    >
      {/* Dim / glass overlay */}
      <View style={styles.screenDimOverlay}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
          >
            <Text style={styles.iconButtonText}>⬅️</Text>
          </TouchableOpacity>

          <View style={styles.titleBlock}>
            <Text style={styles.titleLabel}>Enemy • Metalmen</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('RobotsTab')}
              activeOpacity={0.8}
            >
              <Text style={styles.header}>Metalmen</Text>
            </TouchableOpacity>
          </View>

          {/* Empty right side to balance layout (or add future icon) */}
          <View style={styles.rightSpacer} />
        </View>

        {/* Main vertical scroll */}
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Horizontal card scroller */}
          <View style={styles.scrollWrapper}>
            <ScrollView
              horizontal
              contentContainerStyle={styles.scrollContainer}
              showsHorizontalScrollIndicator={false}
            >
              {friend.length > 0 ? (
                friend.map(renderRobotCard)
              ) : (
                <Text style={styles.noRobotsText}>No robots available</Text>
              )}
            </ScrollView>
          </View>

          {/* Glass section with DarkLords manager */}
          <View style={styles.glassSection}>
            <Text style={styles.sectionTitle}>Forge & Manage</Text>
            <View style={styles.sectionLine} />
            <DarkLords
              collectionPath="robots"
              placeholderImage={require('../../../assets/BackGround/Robots.jpg')}
              friend={friend}
              setFriend={setFriend}
              hardcodedFriend={hardcodedRobots}
              editingFriend={editingFriend}
              setEditingFriend={setEditingFriend}
            />
          </View>
        </ScrollView>

        {/* PREVIEW MODAL */}
        <Modal
          visible={!!previewRobot}
          transparent
          animationType="fade"
          onRequestClose={() => setPreviewRobot(null)}
        >
          <View style={styles.modalBackground}>
            <TouchableOpacity
              style={styles.modalOuterContainer}
              activeOpacity={1}
              onPress={() => setPreviewRobot(null)}
            >
              <View style={styles.previewGlass}>
                <View style={styles.imageContainer}>
                  <ScrollView
                    horizontal
                    contentContainerStyle={styles.imageScrollContainer}
                    showsHorizontalScrollIndicator={false}
                    snapToAlignment="center"
                    snapToInterval={SCREEN_WIDTH * 0.7 + 20}
                    decelerationRate="fast"
                    centerContent
                  >
                    {previewRobot && renderPreviewCard(previewRobot)}
                  </ScrollView>
                </View>
                <View style={styles.previewAboutSection}>
                  <Text style={styles.previewName}>
                    {previewRobot?.name ||
                      previewRobot?.codename ||
                      'Unknown'}
                  </Text>
                  <Text style={styles.previewDesc}>
                    {previewRobot?.description || 'No description available.'}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setPreviewRobot(null)}
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
          animationType="fade"
          onRequestClose={() =>
            setDeleteModal({ visible: false, robot: null })
          }
        >
          <View style={styles.modalOverlay}>
            <View style={styles.deleteGlass}>
              <Text style={styles.modalText}>
                {`Delete "${deleteModal.robot?.name || ''}" and its image?`}
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() =>
                    setDeleteModal({ visible: false, robot: null })
                  }
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalDelete}
                  onPress={() =>
                    deleteModal.robot && confirmDelete(deleteModal.robot.id)
                  }
                >
                  <Text style={styles.modalDeleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* SUMMON MODAL */}
        <Modal
          transparent
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => {
            setModalVisible(false);
            setSelectedRobot(null);
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              setModalVisible(false);
              setSelectedRobot(null);
            }}
          >
            <View style={styles.summonModalContainer}>
              <View style={styles.summonGlass}>
                <Text style={styles.summonModalText}>
                  ⚙️ You have activated:{' '}
                  <Text style={styles.summonNameText}>
                    {selectedRobot?.name ||
                      selectedRobot?.codename ||
                      'Unknown'}
                  </Text>{' '}
                  ⚙️
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
  },

  // Main dim overlay
  screenDimOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    paddingTop: 40,
  },

  // TOP BAR
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  iconButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  iconButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  titleBlock: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  titleLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  header: {
    fontSize: isDesktop ? 30 : 24,
    fontWeight: '900',
    color: '#00b3ff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 179, 255, 0.9)',
    textShadowRadius: 16,
    textShadowOffset: { width: 0, height: 0 },
  },
  rightSpacer: {
    width: 40,
  },

  // MAIN SCROLL
  scroll: {
    paddingBottom: 40,
  },
  scrollWrapper: {
    width: SCREEN_WIDTH,
    flexGrow: 0,
    marginTop: 10,
  },
  scrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: horizontalSpacing,
    paddingVertical: verticalSpacing,
    alignItems: 'center',
  },

  // ROBOT CARDS
  robotCont: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  robotCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(10, 10, 15, 0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
  },
  clickable: (borderColor) => ({
    borderColor: borderColor || 'rgba(192,192,192,0.9)',
    shadowColor: borderColor || '#c0c0c0',
  }),
  notClickable: {
    opacity: 0.65,
  },
  robotImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  robotName: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    fontSize: 18,
    color: 'white',
    fontWeight: '700',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowRadius: 8,
  },
  disabledText: {
    position: 'absolute',
    top: 10,
    right: 10,
    fontSize: 11,
    color: 'rgba(255, 255, 0, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  noRobotsText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    padding: 20,
  },

  // EDIT / DELETE BUTTONS
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
    marginTop: 10,
    paddingHorizontal: 4,
  },
  edit: {
    backgroundColor: 'rgba(0, 122, 255, 0.9)',
    padding: 8,
    borderRadius: 999,
    flex: 1,
    marginRight: 5,
    alignItems: 'center',
  },
  delete: {
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
    padding: 8,
    borderRadius: 999,
    flex: 1,
    marginLeft: 5,
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

  // GLASS SECTION (DarkLords manager)
  glassSection: {
    marginTop: 10,
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(15, 20, 30, 0.78)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    shadowColor: '#000',
    shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 4,
  },
  sectionLine: {
    height: 1,
    backgroundColor: 'rgba(0,179,255,0.65)',
    width: '40%',
    alignSelf: 'center',
    marginBottom: 8,
  },

  // PREVIEW MODAL
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOuterContainer: {
    width: '92%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewGlass: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
    backgroundColor: 'rgba(10,10,15,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
  },
  imageScrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewCard: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.28 : SCREEN_WIDTH * 0.8,
    height: isDesktop ? SCREEN_HEIGHT * 0.62 : SCREEN_HEIGHT * 0.6,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.75)',
    marginRight: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  }),
  previewImage: {
    width: '100%',
    height: '100%',
  },
  cardName: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowRadius: 8,
  },
  previewAboutSection: {
    marginTop: 10,
    padding: 12,
    backgroundColor: 'rgba(15,15,20,0.9)',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  previewName: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
  previewDesc: {
    fontSize: 14,
    color: '#e5f0ff',
    textAlign: 'center',
    marginVertical: 10,
  },
  close: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 999,
    alignSelf: 'center',
    marginTop: 4,
  },

  // DELETE MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteGlass: {
    backgroundColor: 'rgba(15,20,30,0.96)',
    padding: 20,
    borderRadius: 18,
    alignItems: 'center',
    width: '85%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  modalText: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },
  modalCancel: {
    backgroundColor: 'rgba(33,150,243,0.9)',
    padding: 10,
    borderRadius: 999,
    flex: 1,
    marginRight: 10,
  },
  modalCancelText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalDelete: {
    backgroundColor: 'rgba(244,67,54,0.95)',
    padding: 10,
    borderRadius: 999,
    flex: 1,
    marginLeft: 10,
  },
  modalDeleteText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // SUMMON MODAL
  summonModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
  },
  summonGlass: {
    backgroundColor: 'rgba(5,10,20,0.95)',
    padding: 22,
    borderRadius: 20,
    width: '80%',
    borderWidth: 1,
    borderColor: 'rgba(0,179,255,0.6)',
  },
  summonModalText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    textShadowColor: '#00b3ff',
    textShadowRadius: 15,
  },
  summonNameText: {
    color: '#aee4ff',
    fontWeight: 'bold',
  },
});

export default RobotsScreen;
