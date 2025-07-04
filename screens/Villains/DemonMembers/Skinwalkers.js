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
} from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { demonLords } from './DemonData'; // Import data dynamically
import EnlightedInvite from '../EnlightenedInvite';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;
const cardSize = isDesktop ? 450 : 300;
const imageSize = isDesktop ? 400 : 280;

const SkinwalkersScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDemon, setSelectedDemon] = useState(null);
  const [currentSound, setCurrentSound] = useState(null);
  const [skinwalkers, setSkinwalkers] = useState(demonLords);

  // Fetch dynamic skinwalkers from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'skinwalkers'), (snap) => {
      const dynamicSkinwalkers = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        clickable: true,
        borderColor: doc.data().borderColor || '#e25822',
        hardcoded: false,
      }));
      console.log('Fetched dynamic skinwalkers:', dynamicSkinwalkers);
      setSkinwalkers([...demonLords, ...dynamicSkinwalkers]);
    }, (e) => {
      console.error('Firestore error:', e.message);
    });
    return () => unsub();
  }, []);

  // Dynamic Sound Handler with Cleanup
  const playDemonSound = async (audio, screen) => {
    try {
      if (currentSound) {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(audio);
      setCurrentSound(sound);
      await sound.playAsync();
      console.log(`Playing audio for ${screen || 'skinwalker'}`);

      if (screen) {
        setTimeout(() => {
          console.log(`Navigating to ${screen}`);
          navigation.navigate(screen);
        }, 3000);
      }
    } catch (error) {
      console.error('Audio error:', error.message);
    }
  };

  const handlePress = async (skinwalker) => {
    try {
      if (skinwalker.audio) {
        await playDemonSound(skinwalker.audio, skinwalker.screen); // 🔊 For skinwalkers with audio
      } else if (skinwalker.screen) {
        console.log(`Navigating to ${skinwalker.screen}`);
        navigation.navigate(skinwalker.screen); // 🚀 For skinwalkers with only a screen
      }

      if (skinwalker.showSummonPopup) { // ✅ Show popup only if enabled
        setSelectedDemon(skinwalker.name || 'Unknown');
        setModalVisible(true);
      }
    } catch (error) {
      console.error('Handle press error:', error.message);
    }
  };

  const renderSkinwalkerCard = (skinwalker) => (
    <TouchableOpacity
      key={skinwalker.name || skinwalker.id || Math.random().toString()}
      style={[
        styles.demonCard,
        { width: cardSize, height: cardSize * 1.2 },
        skinwalker.clickable ? styles.clickable(skinwalker.borderColor) : styles.notClickable,
      ]}
      onPress={() => skinwalker.clickable && handlePress(skinwalker)}
      disabled={!skinwalker.clickable}
    >
      <Image
        source={
          skinwalker.image ||
          (skinwalker.imageUrl && skinwalker.imageUrl !== 'placeholder'
            ? { uri: skinwalker.imageUrl }
            : require('../../../assets/BackGround/Skinwalkers.jpg'))
        }
        style={[styles.demonImage, { width: imageSize, height: imageSize }]}
        resizeMode="cover"
      />
      <View style={styles.transparentOverlay} />
      <Text style={styles.demonName}>{skinwalker.name || skinwalker.codename || 'Unknown'}</Text>
      {!skinwalker.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../../assets/BackGround/Skinwalkers.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => {
            console.log('Navigating back');
            navigation.goBack();
          }}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>⬅️</Text>
        </TouchableOpacity>

        {/* Title */}
        <TouchableOpacity
          onPress={() => {
            console.log('Navigating to SkinwalkersTab');
            navigation.navigate('SkinwalkersTab');
          }}
        >
          <Text style={styles.header}>Skinwalkers</Text>
        </TouchableOpacity>

        {/* Horizontal Scrollable Cards */}
        <View style={styles.scrollWrapper}>
          <ScrollView
            horizontal
            contentContainerStyle={[styles.scrollContainer, { gap: isDesktop ? 40 : 20 }]}
            showsHorizontalScrollIndicator={true}
          >
            {skinwalkers.length > 0 ? (
              skinwalkers.map(renderSkinwalkerCard)
            ) : (
              <Text style={styles.noSkinwalkersText}>No skinwalkers available</Text>
            )}
          </ScrollView>
        </View>

        {/* Modal for Skinwalker Info */}
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  🔥 You have summoned: {selectedDemon || 'Unknown'} 🔥
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Form for Adding Skinwalkers */}
        <EnlightedInvite
          collectionPath="skinwalkers"
          placeholderImage={require('../../../assets/BackGround/Skinwalkers.jpg')}
          villain={skinwalkers}
          setVillain={setSkinwalkers}
          hardcodedVillain={demonLords}
          editingVillain={null}
          setEditingVillain={() => {}}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingTop: 40,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 0,
    backgroundColor: '#750000',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    elevation: 5,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'rgba(107, 9, 9, 1)',
    textAlign: 'center',
    textShadowColor: 'rgba(241, 99, 43, 1)',
    textShadowRadius: 20,
    marginBottom: 20,
  },
  scrollWrapper: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  scrollContainer: {
    flexDirection: 'row',
    flexGrow: 1,
    width: 'auto',
    paddingVertical: 20,
    alignItems: 'center',
  },
  demonCard: {
    alignItems: 'center',
    backgroundColor: '#660000dc',
    padding: 20,
    borderRadius: 15,
    marginRight: 20,
  },
  clickable: (borderColor) => ({
    borderColor: borderColor || '#e25822',
    borderWidth: 4,
  }),
  notClickable: {
    opacity: 0.5,
  },
  demonImage: {
    borderRadius: 10,
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1,
  },
  demonName: {
    marginTop: 15,
    color: 'white',
    fontSize: 20,
  },
  disabledText: {
    marginTop: 10,
    color: '#ff4444',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
    textShadowColor: '#e25822',
    textShadowRadius: 15,
  },
  noSkinwalkersText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    padding: 20,
  },
});

export default SkinwalkersScreen;