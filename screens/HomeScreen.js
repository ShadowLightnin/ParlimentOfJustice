import React, { useRef, useEffect, useContext, useState, useCallback } from 'react';
import { 
  View, Text, ImageBackground, TouchableOpacity, StyleSheet, FlatList, 
  Animated, Alert, Dimensions, ScrollView, Modal 
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { AuthContext } from '../context/auth-context';
import { Audio } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  collection, onSnapshot, addDoc 
} from 'firebase/firestore';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const isDesktop = SCREEN_WIDTH > 600;

const cardWidth = isDesktop ? 300 : 180; 
const cardHeight = isDesktop ? 240 : 140; 
const cardSpacing = isDesktop ? 30 : 5;

const homageFactions = [
  { name: 'Titans', screen: 'Titans', clickable: true, image: require('../assets/BackGround/Titans.jpg') },
  { name: 'Eclipse', screen: 'Eclipse', clickable: true, image: require('../assets/BackGround/Eclipse.jpg') },
  { name: 'Olympians', screen: 'Olympians', clickable: true, image: require('../assets/BackGround/Olympians.jpg') },
  { name: 'Cobros', screen: 'Cobros', clickable: true, image: require('../assets/BackGround/Cobros.jpg') },
  { name: 'ASTC (Spartans)', screen: 'ASTC', clickable: true, image: require('../assets/BackGround/26.jpg') },
  { name: 'Thunder Born', screen: 'BludBruhs', clickable: true, image: require('../assets/BackGround/Bludbruh2.jpg') },
  { name: 'Legionaires', screen: 'Legionaires', clickable: true, image: require('../assets/BackGround/League.jpg') },
  { name: 'The Forge', screen: 'ForgeScreen', clickable: true, image: require('../assets/BackGround/Forge.jpg') },
  { name: 'Constollation', screen: 'Constollation', clickable: true, image: require('../assets/BackGround/Constollation.jpg') },
];

const worldBuildingFactions = [
  { name: 'Guardians of Justice', screen: 'JusticeScreen', clickable: true, image: require('../assets/BackGround/Justice.jpg') },
  { name: 'Infantry', screen: 'Infantry', clickable: true, image: require('../assets/BackGround/Soldiers.jpg') },
  { name: 'Zion Metropolitan', screen: '', clickable: true, image: require('../assets/ParliamentTower.jpg') },
  { name: 'Ship Yard', screen: 'ShipYardScreen', clickable: true, image: require('../assets/BackGround/ShipYard.jpg') },
  { name: 'Villains', screen: 'VillainsScreen', clickable: true, image: require('../assets/BackGround/VillainsHub.jpg') },
];

const otherFactions = [
  { name: 'Designs', screen: 'Designs', clickable: true, image: require('../assets/BackGround/donut_hologram.png') },
];

const YOUR_EMAIL = "will@test.com"; // Your email
const FRIEND_EMAIL = "samuelp.woodwell@gmail.com"; // Sam’s email
const mirrorRules = {
  [YOUR_EMAIL]: { 'Thunder Born': { targetCollection: `friend_ThunderBorn`, sameUniverse: true } },
  [FRIEND_EMAIL]: { 'Thunder Born': { targetCollection: `your_GuardiansOfJustice`, sameUniverse: false } },
};

export const HomeScreen = () => {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [universeModalVisible, setUniverseModalVisible] = useState(false);
  const userEmail = auth.currentUser?.email || '';
  const [isYourUniverse, setIsYourUniverse] = useState(null);

  const numColumns = isDesktop ? 3 : 2;

  // Load universe preference on mount, default to Prime (Justice)
  useEffect(() => {
    const loadUniversePreference = async () => {
      try {
        const savedUniverse = await AsyncStorage.getItem('selectedUniverse');
        // Default to Prime (Justice) unless a different preference is saved
        setIsYourUniverse(savedUniverse ? savedUniverse === 'your' : true);
      } catch (error) {
        console.error('Error loading universe preference:', error);
        setIsYourUniverse(true); // Default to Prime (Justice) on error
      }
    };
    loadUniversePreference();
  }, [userEmail]);

  // Initialize animation and mirroring
  useEffect(() => {
    if (isYourUniverse !== null) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();

      const userRules = mirrorRules[userEmail] || {};
      Object.entries(userRules).forEach(([sourceFaction, { targetCollection }]) => {
        const sourceRef = collection(db, `${userEmail.split('@')[0]}_${sourceFaction}`);
        const unsubscribe = onSnapshot(sourceRef, (snap) => {
          snap.docChanges().forEach(change => {
            if (change.type === 'added') {
              const data = change.doc.data();
              addDoc(collection(db, targetCollection), {
                ...data,
                mirroredFrom: `${userEmail}_${sourceFaction}`,
                timestamp: new Date().toISOString(),
              }).then(() => console.log(`Mirrored ${sourceFaction} to ${targetCollection}`))
                .catch(error => console.error('Mirror error:', error));
            }
          });
        });
        return () => unsubscribe();
      });
    }
  }, [fadeAnim, isYourUniverse, userEmail]);

  // Handle music playback
  const playTheme = async () => {
    const soundFile = isYourUniverse 
      ? require('../assets/audio/StarTrekEnterprise.mp4')
      : require('../assets/audio/parliamentofpower.m4a');
    if (!currentSound) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          soundFile,
          { shouldPlay: true, isLooping: true, volume: 1.0 }
        );
        setCurrentSound(sound);
        await sound.playAsync();
        setIsPlaying(true);
      } catch (error) {
        console.error('Failed to load audio file:', error);
        Alert.alert('Audio Error', 'Failed to load background music. Please check the file path.');
      }
    } else if (!isPlaying) {
      try {
        await currentSound.playAsync();
        setIsPlaying(true);
      } catch (error) {
        console.error('Error resuming sound:', error);
      }
    }
  };

  // Handle music pause
  const pauseTheme = async () => {
    if (currentSound && isPlaying) {
      try {
        await currentSound.pauseAsync();
        setIsPlaying(false);
      } catch (error) {
        console.error('Error pausing sound:', error);
      }
    }
  };

  // Cleanup sound when navigating away
  const stopAndUnloadAudio = async () => {
    if (currentSound) {
      try {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
        setCurrentSound(null);
        setIsPlaying(false);
      } catch (error) {
        console.error('Error stopping/unloading sound:', error);
      }
    }
  };

  // Cleanup sound on focus change
  useFocusEffect(
    useCallback(() => {
      return () => {
        stopAndUnloadAudio();
      };
    }, [currentSound])
  );

  const handleLogout = async () => {
    await stopAndUnloadAudio();
    try {
      await signOut(auth);
      authCtx.logout();
    } catch (error) {
      Alert.alert('Logout Failed', error.message);
    }
  };

  const goToChat = async () => {
    await stopAndUnloadAudio();
    navigation.navigate('PublicChat', { isYourUniverse }); // Pass universe state
  };

  const toggleUniverse = () => setUniverseModalVisible(true);
  const switchUniverse = async (isYour) => {
    setIsYourUniverse(isYour);
    try {
      await AsyncStorage.setItem('selectedUniverse', isYour ? 'your' : 'friend');
      console.log(`Switched to ${isYour ? 'Prime' : 'Pinnacle'} Universe`);
    } catch (error) {
      console.error('Error saving universe preference:', error);
    }
    setUniverseModalVisible(false);
  };

  const renderFaction = ({ item }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Text style={styles.factionTitle}>{item.name || ''}</Text>
      <TouchableOpacity
        style={[
          styles.card,
          { width: cardWidth, height: cardHeight, margin: cardSpacing / 2 },
          !item.clickable && styles.disabledCard,
        ]}
        onPress={async () => {
          if (item.clickable && item.screen) {
            await stopAndUnloadAudio();
            navigation.navigate(item.screen);
          }
        }}
        disabled={!item.clickable || !item.screen}
      >
        <ImageBackground source={item.image} style={styles.imageBackground} imageStyle={styles.imageOverlay}>
          <View style={styles.transparentOverlay} />
          {!item.clickable && <Text style={styles.disabledText}>Not Clickable at the moment</Text>}
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderWorldBuildingGrid = () => {
    const factionsToShow = worldBuildingFactions;
    const topFactions = factionsToShow.slice(0, 2);
    const middleFaction = factionsToShow[2] || null;
    const bottomFactions = factionsToShow.slice(3, 5);

    return (
      <View style={styles.gridContainer}>
        <View style={styles.row}>
          {topFactions.map((item) => (
            <View key={item.name} style={styles.gridItem}>
              {renderFaction({ item })}
            </View>
          ))}
          {topFactions.length < 2 && <View style={styles.gridItem} />}
        </View>
        {middleFaction && (
          <View style={styles.middleRow}>
            {renderFaction({ item: middleFaction })}
          </View>
        )}
        <View style={styles.row}>
          {bottomFactions.map((item) => (
            <View key={item.name} style={styles.gridItem}>
              {renderFaction({ item })}
            </View>
          ))}
          {bottomFactions.length < 2 && <View style={styles.gridItem} />}
        </View>
      </View>
    );
  };

  const filteredHomageFactions = isYourUniverse ? homageFactions : homageFactions.filter(f => f.name !== 'The Forge');
  const filteredOtherFactions = isYourUniverse ? otherFactions : [];

  return (
    <ImageBackground 
      source={isYourUniverse ? require('../assets/BackGround/Parliment.png') : require('../assets/BackGround/Power.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>🚪</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleUniverse} style={styles.headerButton}>
            <Text style={styles.header}>
              {isYourUniverse ? 'The Parliament of Justice' : 'The Parliament of Power'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
            <Text style={styles.chatText}>🗨️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.musicControls}>
          <TouchableOpacity style={styles.musicButton} onPress={playTheme}>
            <Text style={styles.musicButtonText}>Theme</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.musicButton} onPress={pauseTheme}>
            <Text style={styles.musicButtonText}>Pause</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.sectionContainer}>
            <FlatList
              data={filteredHomageFactions}
              keyExtractor={item => item.name}
              renderItem={renderFaction}
              numColumns={numColumns}
              contentContainerStyle={styles.listContainer}
            />
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.sectionHeader}>World Building</Text>
              <View style={styles.separatorLine} />
            </View>
            {renderWorldBuildingGrid()}
          </View>

          {isYourUniverse && (
            <View style={styles.sectionContainer}>
              <View style={styles.headerContainer}>
                <Text style={styles.sectionHeader}>Others</Text>
                <View style={styles.separatorLine} />
              </View>
              <FlatList
                data={filteredOtherFactions}
                keyExtractor={item => item.name}
                renderItem={renderFaction}
                numColumns={numColumns}
                contentContainerStyle={styles.listContainer}
              />
            </View>
          )}
        </ScrollView>

        <Modal
          visible={universeModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setUniverseModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>Select Universe</Text>
              <TouchableOpacity style={[styles.modalButton, styles.primeButton]} onPress={() => switchUniverse(true)}>
                <Text style={styles.modalButtonText}>Prime Universe</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.pinnacleButton]} onPress={() => switchUniverse(false)}>
                <Text style={styles.modalButtonText}>Pinnacle Universe</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setUniverseModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },

  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },

  topBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
    paddingTop: 20,
  },

  headerButton: {
    flex: 1,
    alignItems: 'center',
  },

  header: {
    fontSize: isDesktop ? 28 : 18,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#00b3ff',
    textShadowRadius: 10,
    textAlign: 'center',
    flexShrink: 1,
  },

  sectionContainer: {
    marginBottom: 30,
  },

  headerContainer: {
    alignItems: 'center',
  },

  sectionHeader: {
    fontSize: isDesktop ? 24 : 18,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#00b3ff',
    textShadowRadius: 10,
    textAlign: 'center',
    marginBottom: 5,
  },

  separatorLine: {
    width: SCREEN_WIDTH - 40,
    borderBottomWidth: 2,
    borderBottomColor: '#79cbee77',
    marginBottom: 10,
  },

  listContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  gridContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: cardWidth * 2 + cardSpacing * 2,
    marginVertical: cardSpacing / 2,
  },

  middleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: cardWidth * 2 + cardSpacing * 2,
    marginVertical: cardSpacing / 2,
  },

  gridItem: {
    width: cardWidth + cardSpacing,
    height: cardHeight + cardSpacing + 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  card: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
  },

  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },

  imageOverlay: {
    opacity: 0.9,
  },

  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1,
  },

  factionTitle: {
    fontSize: isDesktop ? 20 : 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
    textShadowColor: '#00b3ff',
    textShadowRadius: 10,
  },

  disabledCard: {
    backgroundColor: '#555',
  },

  disabledText: {
    fontSize: 12,
    color: '#ff4444',
    marginTop: 5,
  },

  chatButton: {
    padding: 10,
    borderRadius: 8,
  },

  chatText: {
    fontSize: 22,
    color: 'white',
  },

  logoutButton: {
    padding: 10,
    borderRadius: 8,
  },

  logoutText: {
    fontSize: 22,
    color: 'white',
  },

  musicControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 5,
  },

  musicButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    marginHorizontal: 10,
  },

  musicButtonText: {
    color: '#00b3ff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContent: {
    backgroundColor: 'rgba(33, 32, 32, 0.9)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },

  modalText: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center',
  },

  modalButton: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: 200,
    alignItems: 'center',
  },

  modalButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  modalCancel: {
    backgroundColor: '#F44336',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: 200,
    alignItems: 'center',
  },

  primeButton: {
    backgroundColor: '#174e43', // Teal base
    shadowColor: '#30675c',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },

  pinnacleButton: {
    backgroundColor: '#800080', // Purple base
    shadowColor: '#c553c5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
});

export default HomeScreen;