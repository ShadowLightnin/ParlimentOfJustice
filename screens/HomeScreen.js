import React, { useRef, useEffect, useContext, useState, useCallback } from 'react';
import { 
  View, Text, ImageBackground, TouchableOpacity, StyleSheet, FlatList, 
  Animated, Alert, Dimensions, ScrollView 
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { AuthContext } from '../context/auth-context';
import { Audio } from 'expo-av';

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

export const HomeScreen = () => {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [currentSound, setCurrentSound] = useState(null);
  const [pausedPosition, setPausedPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const numColumns = isDesktop ? 3 : 2;

  // Initialize sound on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/audio/SourceOfStrengthNinjagoMyVersion.mp4'),
          { shouldPlay: true, isLooping: false, volume: 1.0 }
        );
        setCurrentSound(sound);
      } catch (error) {
        console.error('Failed to load audio file:', error);
        Alert.alert('Audio Error', 'Failed to load background music. Please check the audio file path: ../assets/audio/StarTrekEnterprise.mp4');
      }
    };

    loadSound();

    // Cleanup sound on unmount
    return () => {
      if (currentSound) {
        currentSound.stopAsync().catch((error) => console.error('Error stopping sound:', error));
        currentSound.unloadAsync().catch((error) => console.error('Error unloading sound:', error));
        setCurrentSound(null);
        setPausedPosition(0);
        setIsPaused(false);
      }
    };
  }, []);

  // Handle screen focus to resume/pause audio
  useFocusEffect(
    useCallback(() => {
      const resumeSound = async () => {
        if (currentSound && isPaused && pausedPosition >= 0) {
          try {
            await currentSound.setPositionAsync(pausedPosition);
            await currentSound.playAsync();
            setIsPaused(false);
          } catch (error) {
            console.error('Error resuming sound:', error);
          }
        }
      };

      resumeSound();

      return () => {
        if (currentSound && !isPaused) {
          currentSound.pauseAsync().then(async () => {
            try {
              const status = await currentSound.getStatusAsync();
              setPausedPosition(status.positionMillis || 0);
              setIsPaused(true);
            } catch (error) {
              console.error('Error pausing sound:', error);
            }
          }).catch((error) => console.error('Error pausing sound:', error));
        }
      };
    }, [currentSound, isPaused, pausedPosition])
  );

  const handleLogout = async () => {
    if (currentSound) {
      try {
        const status = await currentSound.getStatusAsync();
        if (status.isPlaying) {
          await currentSound.pauseAsync();
          setPausedPosition(status.positionMillis || 0);
          setIsPaused(true);
        }
      } catch (error) {
        console.error('Error pausing sound on logout:', error);
      }
    }
    try {
      await signOut(auth);
      authCtx.logout(); 
    } catch (error) {
      Alert.alert('Logout Failed', error.message);
    }
  };

  const goToChat = async () => {
    if (currentSound) {
      try {
        const status = await currentSound.getStatusAsync();
        if (status.isPlaying) {
          await currentSound.pauseAsync();
          setPausedPosition(status.positionMillis || 0);
          setIsPaused(true);
        }
      } catch (error) {
        console.error('Error pausing sound for chat:', error);
      }
    }
    navigation.navigate('PublicChat');
  };

  const renderFaction = ({ item }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Text style={styles.factionTitle}>
        {item.name ? item.name : ''}
      </Text>
      <TouchableOpacity
        style={[
          styles.card,
          { width: cardWidth, height: cardHeight, margin: cardSpacing / 2 },
          !item.clickable && styles.disabledCard,
        ]}
        onPress={() => item.clickable && item.screen && navigation.navigate(item.screen)}
        disabled={!item.clickable || !item.screen}
      >
        <ImageBackground 
          source={item.image} 
          style={styles.imageBackground} 
          imageStyle={styles.imageOverlay}
        >
          <View style={styles.transparentOverlay} />
          {!item.clickable && <Text style={styles.disabledText}>Not Clickable at the moment</Text>}
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderWorldBuildingGrid = () => {
    // Split factions into top (2), middle (1), and bottom (2)
    const topFactions = worldBuildingFactions.slice(0, 2);
    const middleFaction = worldBuildingFactions[2] ? worldBuildingFactions[2] : null;
    const bottomFactions = worldBuildingFactions.slice(3, 5);

    return (
      <View style={styles.gridContainer}>
        {/* Top Row: 2 Cards */}
        <View style={styles.row}>
          {topFactions.map((item) => (
            <View key={item.name} style={styles.gridItem}>
              {renderFaction({ item })}
            </View>
          ))}
          {topFactions.length < 2 && <View style={styles.gridItem} />} {/* Empty placeholder */}
        </View>
        {/* Middle Row: 1 Centered Card */}
        {middleFaction && (
          <View style={styles.middleRow}>
            {renderFaction({ item: middleFaction })}
          </View>
        )}
        {/* Bottom Row: 2 Cards */}
        <View style={styles.row}>
          {bottomFactions.map((item) => (
            <View key={item.name} style={styles.gridItem}>
              {renderFaction({ item })}
            </View>
          ))}
          {bottomFactions.length < 2 && <View style={styles.gridItem} />} {/* Empty placeholder */}
        </View>
      </View>
    );
  };

  return (
    <ImageBackground source={require('../assets/BackGround/Parliment.png')} style={styles.background}>
      <View style={styles.container}>
        {/* Header and Buttons */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>🚪</Text>
          </TouchableOpacity>
          <Text style={styles.header}>The Parliament of Justice</Text>
          <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
            <Text style={styles.chatText}>🗨️</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Content */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Homage Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.headerContainer}>
              {/* <Text style={styles.sectionHeader}>Homage</Text>
              <View style={styles.separatorLine} /> */}
            </View>
            <FlatList
              data={homageFactions}
              keyExtractor={(item) => item.name}
              renderItem={renderFaction}
              numColumns={numColumns}
              contentContainerStyle={styles.listContainer}
            />
          </View>

          {/* World Building Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.sectionHeader}>World Building</Text>
              <View style={styles.separatorLine} />
            </View>
            {renderWorldBuildingGrid()}
          </View>

          {/* Others Section */}
          <View style={styles.sectionContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.sectionHeader}>Others</Text>
              <View style={styles.separatorLine} />
            </View>
            <FlatList
              data={otherFactions}
              keyExtractor={(item) => item.name}
              renderItem={renderFaction}
              numColumns={numColumns}
              contentContainerStyle={styles.listContainer}
            />
          </View>
        </ScrollView>
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
});