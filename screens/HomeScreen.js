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
  { name: 'ASTC (Spartans)', screen: 'ASTC', clickable: true, image: require('../assets/BackGround/ASTC.jpg') },
  { name: 'Thunder Born', screen: 'BludBruhs', clickable: true, image: require('../assets/BackGround/Bludbruh2.jpg') },
  { name: 'Legionaires', screen: 'Legionaires', clickable: true, image: require('../assets/BackGround/Legionaires2.jpg') },
  { name: 'The Forge', screen: 'ForgeScreen', clickable: true, image: require('../assets/BackGround/Forge.jpg') },
  { name: 'Constollation', screen: 'Constollation', clickable: true, image: require('../assets/BackGround/Constollation.jpg') },
];

const pinnacleHomageFactions = [
  { name: 'Thunder Born', screen: 'BludBruhs', clickable: true, image: require('../assets/BackGround/PowerBorn.jpg'), pinnacleScreen: 'PowerBorn' },
  { name: 'Monke Alliance', screen: 'BludBruhs', clickable: true, image: require('../assets/BackGround/PowerMonke.jpg'), pinnacleScreen: 'PowerMonke' },
  { name: 'Titans', screen: 'Titans', clickable: true, image: require('../assets/BackGround/Titans.jpg'), pinnacleScreen: 'PowerTitans' },
  { name: 'Olympians', screen: 'Olympians', clickable: true, image: require('../assets/BackGround/Olympians.jpg') },
  { name: 'Cobros', screen: 'Cobros', clickable: true, image: require('../assets/BackGround/Cobros.jpg'), pinnacleScreen: 'PowerCobros' },
  { name: 'Legionaires', screen: 'Legionaires', clickable: true, image: require('../assets/BackGround/Legionaires.jpg') },
];

// Define desktop-specific order for Pinnacle Universe
const desktopPinnacleHomageFactions = [
  { name: 'Thunder Born', screen: 'BludBruhs', clickable: true, image: require('../assets/BackGround/PowerBorn.jpg'), pinnacleScreen: 'PowerBorn' },
  { name: 'Titans', screen: 'Titans', clickable: true, image: require('../assets/BackGround/Titans.jpg'), pinnacleScreen: 'PowerTitans' },
  { name: 'Monke Alliance', screen: 'BludBruhs', clickable: true, image: require('../assets/BackGround/PowerMonke.jpg'), pinnacleScreen: 'PowerMonke' },
  { name: 'Cobros', screen: 'Cobros', clickable: true, image: require('../assets/BackGround/Cobros.jpg'), pinnacleScreen: 'PowerCobros' },
  { name: 'Olympians', screen: 'Olympians', clickable: true, image: require('../assets/BackGround/Olympians.jpg') },
  { name: 'Legionaires', screen: 'Legionaires', clickable: true, image: require('../assets/BackGround/Legionaires.jpg') },
];

const worldBuildingFactions = [
  { name: 'Guardians of Justice', screen: 'JusticeScreen', clickable: true, image: require('../assets/BackGround/Justice.jpg') },
  { name: 'Ship Yard', screen: 'ShipYardScreen', clickable: true, image: require('../assets/BackGround/ShipYard.jpg') },
  { name: 'Zion Metropolitan', screen: '', clickable: true, image: require('../assets/ParliamentTower.jpg') },
  { name: 'Infantry', screen: 'Infantry', clickable: true, image: require('../assets/BackGround/Soldiers.jpg') },
  { name: 'Villains', screen: 'VillainsScreen', clickable: true, image: require('../assets/BackGround/VillainsHub.jpg') },
];

// Reorder worldBuildingFactions for Pinnacle Universe
const getPinnacleWorldBuildingFactions = () => [
  { name: 'Guardians of Justice', screen: 'JusticeScreen', clickable: true, image: require('../assets/BackGround/Justice.jpg') },
  { name: 'Villains', screen: 'VillainsScreen', clickable: true, image: require('../assets/BackGround/VillainsHub.jpg') },
  { name: 'Zion Metropolitan', screen: '', clickable: true, image: require('../assets/ParliamentTower.jpg') },
  { name: 'Ship Yard', screen: 'ShipYardScreen', clickable: true, image: require('../assets/BackGround/ShipYard.jpg') },
  { name: 'Infantry', screen: 'Infantry', clickable: true, image: require('../assets/BackGround/Soldiers.jpg') },
];

const otherFactions = [
  { name: 'Designs', screen: 'Designs', clickable: true, image: require('../assets/BackGround/donut_hologram.png') },
];

const YOUR_EMAIL = "will@test.com";
const FRIEND_EMAIL = "samuelp.woodwell@gmail.com";
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
        setIsYourUniverse(savedUniverse ? savedUniverse === 'your' : true);
      } catch (error) {
        console.error('Error loading universe preference:', error);
        setIsYourUniverse(true);
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
    navigation.navigate('PublicChat', { isYourUniverse });
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

  const handleQuadrantPress = async (isYour) => {
    await stopAndUnloadAudio();
    switchUniverse(isYour);
  };

  const renderFaction = ({ item }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Text style={[styles.factionTitle, { textShadowColor: isYourUniverse ? '#00b3ff' : '#800080', textShadowRadius: 10 }]}>{item.name || ''}</Text>
      <TouchableOpacity
        style={[
          styles.card,
          { width: cardWidth, height: cardHeight, margin: cardSpacing / 2 },
          !item.clickable && styles.disabledCard,
          {
            borderWidth: 2,
            borderColor: isYourUniverse ? '#00b3ff35' : '#800080',
            backgroundColor: isYourUniverse ? 'rgba(0, 179, 255, 0.1)' : 'rgba(128, 0, 128, 0.1)',
            shadowColor: isYourUniverse ? '#00b3ff35' : '#800080',
            shadowOpacity: 0.8,
            shadowRadius: 10,
          },
        ]}
        onPress={async () => {
          if (item.clickable && item.screen) {
            await stopAndUnloadAudio();
            if (isYourUniverse || !item.pinnacleScreen) {
              navigation.navigate(item.screen);
            } else {
              navigation.navigate(item.screen, { screen: item.pinnacleScreen });
            }
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
    const factionsToShow = isYourUniverse ? worldBuildingFactions : getPinnacleWorldBuildingFactions();
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
        </View>
      </View>
    );
  };

  // Use desktop-specific order for Pinnacle Universe on desktop
  const filteredHomageFactions = isYourUniverse ? homageFactions : (isDesktop ? desktopPinnacleHomageFactions : pinnacleHomageFactions);
  const filteredOtherFactions = isYourUniverse ? otherFactions : [];

  return (
    <ImageBackground 
      source={isYourUniverse ? require('../assets/BackGround/Parliament.jpg') : require('../assets/BackGround/Power.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>🚪</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleUniverse} style={styles.headerButton}>
            <Text style={[styles.header, { textShadowColor: isYourUniverse ? '#00b3ff' : '#da1cda', textShadowRadius: 10 }]}>
              {isYourUniverse ? 'The Parliament of Justice' : 'Shadows of Montrose: \nThe Parliament of Power'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
            <Text style={styles.chatText}>🗨️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.musicControls}>
          <TouchableOpacity style={styles.musicButton} onPress={playTheme}>
            <Text style={[styles.musicButtonText, { color: isYourUniverse ? '#00b3ff' : '#800080' }]}>Theme</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.musicButton} onPress={pauseTheme}>
            <Text style={[styles.musicButtonText, { color: isYourUniverse ? '#00b3ff' : '#800080' }]}>Pause</Text>
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
              key={isYourUniverse ? 'prime' : 'pinnacle'} // Force re-render on universe change
            />
          </View>

          <View style={styles.sectionContainer}>
            <View style={styles.headerContainer}>
              <Text style={[styles.sectionHeader, { textShadowColor: isYourUniverse ? '#00b3ff' : '#800080', textShadowRadius: 10 }]}>World Building</Text>
              <View style={[styles.separatorLine, { borderBottomColor: isYourUniverse ? '#79cbee77' : '#c553c577' }]} />
            </View>
            {renderWorldBuildingGrid()}
          </View>

          {isYourUniverse && (
            <View style={styles.sectionContainer}>
              <View style={styles.headerContainer}>
                <Text style={[styles.sectionHeader, { textShadowColor: isYourUniverse ? '#00b3ff' : '#800080', textShadowRadius: 10 }]}>Others</Text>
                <View style={[styles.separatorLine, { borderBottomColor: isYourUniverse ? '#79cbee77' : '#c553c577' }]} />
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
              <Text style={styles.modalTitle}>Choose Your Universe</Text>
              <ImageBackground
                source={require('../assets/Space/Mirror.jpg')}
                style={styles.mirrorImage}
                imageStyle={styles.mirrorImageStyle}
              >
                <View style={styles.quadrantContainer}>
                  {/* Top Left Quadrant: Prime Universe (Clickable) */}
                  <TouchableOpacity
                    style={styles.quadrantTopLeft}
                    onPress={() => handleQuadrantPress(true)}
                  >
                    <View style={styles.transparentOverlay} />
                  </TouchableOpacity>
                  {/* Top Right Quadrant: Prime Universe Text */}
                  <View style={styles.quadrantTopRight}>
                    <Text style={[styles.universeText, styles.primeText]}>Prime Universe</Text>
                  </View>
                  {/* Bottom Left Quadrant: Pinnacle Universe Text */}
                  <View style={styles.quadrantBottomLeft}>
                    <Text style={[styles.universeText, styles.pinnacleText]}>Pinnacle Universe</Text>
                  </View>
                  {/* Bottom Right Quadrant: Pinnacle Universe (Clickable) */}
                  <TouchableOpacity
                    style={styles.quadrantBottomRight}
                    onPress={() => handleQuadrantPress(false)}
                  >
                    <View style={styles.transparentOverlay} />
                  </TouchableOpacity>
                </View>
              </ImageBackground>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setUniverseModalVisible(false)}
              >
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
    textShadowRadius: 10,
    textAlign: 'center',
    marginBottom: 5,
  },
  separatorLine: {
    width: SCREEN_WIDTH - 40,
    borderBottomWidth: 2,
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
    width: '90%',
    maxWidth: 600,
  },
  modalTitle: {
    fontSize: isDesktop ? 24 : 20,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  mirrorImage: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.5,
    maxHeight: 400,
    borderRadius: 10,
    overflow: 'hidden',
  },
  mirrorImageStyle: {
    resizeMode: 'contain',
  },
  quadrantContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
  },
  quadrantTopLeft: {
    width: '50%',
    height: '50%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  quadrantTopRight: {
    width: '50%',
    height: '50%',
    position: 'absolute',
    top: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quadrantBottomLeft: {
    width: '50%',
    height: '50%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 30,
  },
  quadrantBottomRight: {
    width: '50%',
    height: '50%',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  universeText: {
    fontSize: isDesktop ? 20 : 16,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  primeText: {
    textShadowColor: '#00b3ff',
    textShadowRadius: 10,
    shadowColor: '#30675c',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  pinnacleText: {
    textShadowColor: '#800080',
    textShadowRadius: 10,
    shadowColor: '#c553c5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
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
    backgroundColor: '#174e43',
    shadowColor: '#30675c',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  pinnacleButton: {
    backgroundColor: '#800080',
    shadowColor: '#c553c5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
});