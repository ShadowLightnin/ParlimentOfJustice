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
import LeagueMembers from './LeagueMembers';

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

// Hardcoded heroes data with images, yellow border color
const hardcodedHeroes = [
  { id: 'hero-1', name: '', screen: '', image: require('../../assets/Armor/TheOne.jpg'), clickable: true, borderColor: 'white', hardcoded: true, description: '' },
  { id: 'hero-2', name: '', screen: '', image: require('../../assets/Armor/TheOneness.jpg'), clickable: true, borderColor: 'white', hardcoded: true, description: '' },
];

const ALLOWED_EMAILS = ["will@test.com", "c1wcummings@gmail.com"];
const RESTRICT_ACCESS = true; // Restrict edit/delete to ALLOWED_EMAILS

const HeroesScreen = () => {
  const navigation = useNavigation();
  const [previewHero, setPreviewHero] = useState(null);
  const [heroes, setHeroes] = useState(hardcodedHeroes);
  const [deleteModal, setDeleteModal] = useState({ visible: false, hero: null });
  const canMod = RESTRICT_ACCESS ? auth.currentUser && ALLOWED_EMAILS.includes(auth.currentUser.email) : true;

  // Fetch dynamic heroes from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'heroes'), (snap) => {
      const dynamicHeroes = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        clickable: true,
        borderColor: doc.data().borderColor || 'gold', // Gold for dynamic
        hardcoded: false,
      }));
      console.log('Fetched dynamic heroes:', dynamicHeroes);
      setHeroes([...hardcodedHeroes, ...dynamicHeroes]);
    }, (e) => {
      console.error('Firestore error:', e.message);
      Alert.alert('Error', 'Failed to fetch heroes: ' + e.message);
    });
    return () => unsub();
  }, []);

  const handleHeroPress = (hero) => {
    if (hero.clickable) {
      if (hero.screen) {
        console.log('Navigating to screen:', hero.screen);
        navigation.navigate(hero.screen);
      } else {
        console.log('Showing preview for hero:', hero.name || hero.codename || 'Unknown');
        setPreviewHero(hero);
      }
    }
  };

  const confirmDelete = async (id) => {
    if (!canMod) {
      Alert.alert('Access Denied', 'Only authorized users can delete heroes.');
      return;
    }
    try {
      const heroItem = heroes.find(h => h.id === id);
      if (heroItem.hardcoded) {
        Alert.alert('Error', 'Cannot delete hardcoded heroes!');
        return;
      }
      const heroRef = doc(db, 'heroes', id);
      const snap = await getDoc(heroRef);
      if (!snap.exists()) {
        Alert.alert('Error', 'Hero not found');
        return;
      }
      const { imageUrl } = snap.data();
      await deleteDoc(heroRef);
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
      setHeroes(heroes.filter(h => h.id !== id));
      setDeleteModal({ visible: false, hero: null });
      Alert.alert('Success', 'Hero deleted!');
    } catch (e) {
      console.error('Delete hero error:', e.message);
      Alert.alert('Error', `Failed to delete hero: ${e.message}`);
    }
  };

  // Render Each Hero Card
  const renderHeroCard = (hero) => (
    <View key={hero.id || hero.name || hero.codename || hero.image.toString()} style={styles.heroCont}>
      <TouchableOpacity
        style={[
          styles.heroCard,
          {
            width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
            height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height,
          },
          hero.clickable && hero.borderColor ? styles.clickable(hero.borderColor) : styles.notClickable,
        ]}
        onPress={() => handleHeroPress(hero)}
        disabled={!hero.clickable}
      >
        <Image
          source={hero.image || (hero.imageUrl && hero.imageUrl !== 'placeholder' ? { uri: hero.imageUrl } : require('../../assets/Armor/LoneRanger.jpg'))}
          style={styles.heroImg}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        <Text style={styles.heroName}>{hero.name || hero.codename || 'Unknown'}</Text>
        {!hero.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
      </TouchableOpacity>
      {!hero.hardcoded && (
        <View style={styles.buttons}>
          <TouchableOpacity
            onPress={() => setPreviewHero({ ...hero, isEditing: true })}
            style={[styles.edit, !canMod && styles.disabled]}
            disabled={!canMod}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDeleteModal({ visible: true, hero: { id: hero.id, name: hero.name || hero.codename || 'Unknown' } })}
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
  const renderPreviewCard = (hero) => (
    <TouchableOpacity
      style={[styles.previewCard(isDesktop, SCREEN_WIDTH), styles.clickable(hero.borderColor || 'yellow')]}
      onPress={() => {
        console.log('Closing preview modal');
        setPreviewHero(null);
      }}
    >
      <Image
        source={hero.image || (hero.imageUrl && hero.imageUrl !== 'placeholder' ? { uri: hero.imageUrl } : require('../../assets/Armor/LoneRanger.jpg'))}
        style={styles.previewImage}
        resizeMode="cover"
      />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {hero.name || hero.codename || 'Unknown'}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Justice.jpg')}
      style={styles.bg}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          onPress={() => {
            console.log('Navigating to Home');
            navigation.navigate('Home');
          }}
          style={styles.back}
        >
          <Text style={styles.backText}>⬅️</Text>
        </TouchableOpacity>
        <ScrollView contentContainerStyle={styles.scroll}>
          <TouchableOpacity
            onPress={() => {
              console.log('Navigating to GuardiansOfJustice');
              navigation.navigate('Justice');
            }}
          >
            <Text style={styles.header}>Heroes</Text>
          </TouchableOpacity>
          <View style={styles.scrollWrapper}>
            <ScrollView
              horizontal
              contentContainerStyle={styles.hScroll}
              showsHorizontalScrollIndicator={true}
            >
              {heroes.length > 0 ? (
                heroes.map(renderHeroCard)
              ) : (
                <Text style={styles.noHeroesText}>No heroes available</Text>
              )}
            </ScrollView>
          </View>
          <LeagueMembers
            collectionPath="heroes"
            placeholderImage={require('../../assets/Armor/LoneRanger.jpg')}
            infantry={heroes}
            setInfantry={setHeroes}
            hardcodedInfantry={hardcodedHeroes}
            editingInfantry={previewHero?.isEditing ? previewHero : null}
            setEditingInfantry={setPreviewHero}
          />
          <Modal
            visible={!!previewHero && !previewHero.isEditing}
            transparent
            animationType="fade"
            onRequestClose={() => {
              console.log('Closing preview modal');
              setPreviewHero(null);
            }}
          >
            <View style={styles.modalBackground}>
              <TouchableOpacity
                style={styles.modalOuterContainer}
                activeOpacity={1}
                onPress={() => {
                  console.log('Closing preview modal');
                  setPreviewHero(null);
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
                    {previewHero && renderPreviewCard(previewHero)}
                  </ScrollView>
                </View>
                <View style={styles.previewAboutSection}>
                  <Text style={styles.previewName}>{previewHero?.name || previewHero?.codename || 'Unknown'}</Text>
                  <Text style={styles.previewDesc}>{previewHero?.description || 'No description available'}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      console.log('Closing preview modal');
                      setPreviewHero(null);
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
            onRequestClose={() => setDeleteModal({ visible: false, hero: null })}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>{`Delete "${deleteModal.hero?.name || ''}" and its image?`}</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.modalCancel}
                    onPress={() => setDeleteModal({ visible: false, hero: null })}
                  >
                    <Text style={styles.modalCancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalDelete}
                    onPress={() => deleteModal.hero && confirmDelete(deleteModal.hero.id)}
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
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingTop: 40,
  },
  scroll: {
    paddingBottom: 20,
  },
  back: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(17,25,40,0.6)',
    padding: 15,
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
    color: '#FFF',
    textAlign: 'center',
    textShadowColor: 'yellow',
    textShadowRadius: 15,
    marginVertical: 20,
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
  heroCont: {
    marginHorizontal: 10,
    alignItems: 'center',
  },
  heroCard: {
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.7)',
    elevation: 5,
  },
  clickable: (borderColor) => ({
    borderColor: borderColor || 'yellow',
    borderWidth: 2,
  }),
  notClickable: {
    opacity: 0.7,
  },
  heroImg: {
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
  heroName: {
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
  noHeroesText: {
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

export default HeroesScreen;