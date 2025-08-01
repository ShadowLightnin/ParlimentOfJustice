import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// Scrollable characters (no position needed)
const scrollableMembersBase = [
  { name: 'Sam', codename: 'Void Walker', screen: 'Sam', clickable: true, image: require('../../assets/Armor/Sam.jpg') },
  { name: 'Cole', codename: 'Cruiser', screen: 'Cole', clickable: true, image: require('../../assets/Armor/ColeR.jpg') },
  { name: 'Taylor', codename: 'Stellar', screen: '', clickable: true, image: require('../../assets/Armor/Taylor.jpg') },
  { name: 'James', codename: 'Shadowmind', screen: 'JamesBb', clickable: true, image: require('../../assets/Armor/JamesBb.jpg') },
  { name: 'Tanner', codename: 'Wolff', screen: 'TannerBb', clickable: true, image: require('../../assets/Armor/TannerBb.jpg') },
  { name: 'Adin', codename: 'Aotearoa', screen: '', clickable: true, image: require('../../assets/Armor/Adin.jpg') },
  { name: 'Justin Platt', codename: 'Echo Wood', screen: '', clickable: true, image: require('../../assets/Armor/Justin2.jpg') },
  { name: 'Zack Dustin', codename: 'Carved Echo', screen: '', clickable: true, image: require('../../assets/Armor/Zack2_cleanup.jpg') },
  { name: 'Joseph', codename: 'Technoman', screen: 'JosephD', clickable: true, image: require('../../assets/Armor/JosephD.jpg') },
  { name: 'Thunder Born', codename: 'Rolling Thunder', screen: 'RollingThunderScreen', clickable: true, image: require('../../assets/BackGround/RollingThunder.jpg') },
];

// Fixed factions for bottom row
const fixedMembers = [
  { name: '', codename: 'Ranger Squad', screen: 'RangerSquad', clickable: true, image: require('../../assets/BackGround/RangerSquad.jpg') },
  { name: '', codename: 'Montrose Manor', screen: 'MontroseManorTab', clickable: true, image: require('../../assets/TheMontroseManor.jpg') },
  { name: '', codename: 'MonkeAlliance', screen: 'MonkeAllianceScreen', clickable: true, image: require('../../assets/BackGround/Monke.jpg') },
];

const BludBruhsScreen = ({ route }) => {
  const navigation = useNavigation();
  const [previewMember, setPreviewMember] = useState(null);
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isYourUniverse, setIsYourUniverse] = useState(route.params?.isYourUniverse ?? null);

  // Load universe preference on mount
  useEffect(() => {
    const loadUniversePreference = async () => {
      try {
        const savedUniverse = await AsyncStorage.getItem('selectedUniverse');
        setIsYourUniverse(savedUniverse ? savedUniverse === 'your' : route.params?.isYourUniverse ?? true);
      } catch (error) {
        console.error('Error loading universe preference:', error);
        setIsYourUniverse(route.params?.isYourUniverse ?? true);
      }
    };
    loadUniversePreference();
  }, [route.params]);

  // Filter scrollable members based on universe
  const dynamicScrollableMembers = isYourUniverse
    ? scrollableMembersBase.filter(member => member.name !== 'Justin Platt' && member.name !== 'Zack Dustin')
    : scrollableMembersBase;

  // Dynamically get Joseph based on universe with random image selection
  const getJosephMember = () => {
    if (isYourUniverse) {
      return { name: 'Joseph', codename: 'Technoman', screen: 'JosephD', clickable: true, image: require('../../assets/Armor/JosephD.jpg') };
    } else {
      const random = Math.random();
      if (random < 0.02) {
        return { name: 'Joseph', codename: 'The Betrayer', screen: 'JosephD', clickable: false, image: require('../../assets/Armor/JosephD4.jpg') };
      } else if (random < 0.51) {
        return { name: 'Joseph', codename: 'The Betrayer', screen: 'JosephD', clickable: false, image: require('../../assets/Armor/JosephD2.jpg') };
      } else {
        return { name: 'Joseph', codename: 'The Betrayer', screen: 'JosephD', clickable: false, image: require('../../assets/Armor/JosephD3.jpg') };
      }
    }
  };

  // Update Joseph in dynamicScrollableMembers
  const finalScrollableMembers = [...dynamicScrollableMembers];
  const josephIndex = finalScrollableMembers.findIndex(m => m.name === 'Joseph');
  if (josephIndex !== -1) {
    finalScrollableMembers[josephIndex] = getJosephMember();
  }

  // Handle music playback
  const playTheme = async () => {
    if (!currentSound) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/audio/ThunderBorn.m4a'),
          { shouldPlay: true, isLooping: true, volume: 1.0 }
        );
        setCurrentSound(sound);
        await sound.playAsync();
        setIsPlaying(true);
      } catch (error) {
        console.error('Failed to load audio file:', error);
        Alert.alert('Audio Error', 'Failed to load background music. Please check the audio file path: ../../assets/audio/ThunderBorn.m4a');
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

  // Unload and stop music
  const stopBackgroundMusic = async () => {
    if (currentSound) {
      console.log('Stopping Sound at:', new Date().toISOString());
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      setCurrentSound(null);
      setIsPlaying(false);
    }
  };

  // Cleanup sound on unmount or navigation
  useFocusEffect(
    useCallback(() => {
      return () => {
        stopBackgroundMusic();
      };
    }, [currentSound])
  );

  // Pause on modal open, resume on close
  useEffect(() => {
    if (previewMember) {
      pauseTheme();
    } else if (!previewMember && currentSound && !isPlaying) {
      playTheme();
    }
  }, [previewMember]);

  const goToChat = () => {
    stopBackgroundMusic();
    navigation.navigate('TeamChat', { isYourUniverse });
  };

  const goToHomeScreen = () => {
    console.log("Navigating to HomeScreen from BludBruhsScreen at:", new Date().toISOString());
    stopBackgroundMusic();
    navigation.navigate('Home');
  };

  const goToAddMemberScreen = () => {
    navigation.navigate('AddMember', { isYourUniverse });
  };

  const isDesktop = SCREEN_WIDTH > 600;
  const cardSize = isDesktop ? 160 : 100;
  const cardSpacing = isDesktop ? 25 : 10;

  // Prepare grid rows
  const rows = [];
  const initialScrollable = finalScrollableMembers.slice(0, 9);
  for (let i = 0; i < Math.ceil(initialScrollable.length / 3); i++) {
    rows.push(initialScrollable.slice(i * 3, (i + 1) * 3));
  }
  const additionalScrollable = finalScrollableMembers.slice(9);
  for (let i = 0; i < Math.ceil(additionalScrollable.length / 3); i++) {
    rows.push(additionalScrollable.slice(i * 3, (i + 1) * 3));
  }

  const renderMemberCard = (member, index) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.card,
        { width: cardSize, height: cardSize * 1.6 },
        !member?.clickable && styles.disabledCard,
        member?.name === ' ' && styles.subtleButton,
        {
          borderWidth: 2,
          borderColor: isYourUniverse ? '#00b3ff' : '#800080',
          backgroundColor: isYourUniverse ? 'rgba(0, 179, 255, 0.1)' : 'rgba(128, 0, 128, 0.1)',
          shadowColor: isYourUniverse ? '#00b3ff' : '#800080',
          shadowOpacity: 0.8,
          shadowRadius: 10,
        },
      ]}
      onPress={async () => {
        if (member?.clickable) {
          await stopBackgroundMusic();
          if (member.screen) {
            navigation.navigate(member.screen, { from: 'BludBruhsHome', isYourUniverse });
          } else {
            setPreviewMember(member);
          }
        }
      }}
      disabled={!member?.clickable}
    >
      {member?.image && (
        <>
          <Image source={member.image} style={styles.characterImage} />
          <View style={styles.transparentOverlay} />
        </>
      )}
      <Text style={[styles.codename, { color: isYourUniverse ? '#00b3ff' : '#df45df', textShadowColor: isYourUniverse ? '#00b3ff' : '#800080', textShadowRadius: 10 }]}>{member?.codename || ''}</Text>
      <Text style={[styles.name, { color: isYourUniverse ? '#fff' : '#ddd', textShadowColor: isYourUniverse ? '#00b3ff' : '#800080', textShadowRadius: 10 }]}>{member?.name || ''}</Text>
    </TouchableOpacity>
  );

  const renderPreviewCard = (member) => (
    <TouchableOpacity
      style={[
        styles.previewCard(isDesktop, SCREEN_WIDTH),
        styles.clickable,
        {
          borderColor: isYourUniverse ? '#00b3ff' : '#800080',
          backgroundColor: isYourUniverse ? 'rgba(0, 179, 255, 0.1)' : 'rgba(128, 0, 128, 0.1)',
          shadowColor: isYourUniverse ? '#00b3ff' : '#800080',
        },
      ]}
      onPress={() => setPreviewMember(null)}
    >
      <Image
        source={member.image || require('../../assets/Armor/PlaceHolder.jpg')}
        style={styles.previewImage}
        resizeMode="cover"
      />
      <View style={styles.transparentOverlay} />
      <Text style={[styles.cardName, { color: isYourUniverse ? '#00b3ff' : '#800080', textShadowColor: isYourUniverse ? '#00b3ff' : '#800080', textShadowRadius: 10 }]}>
        © {member.codename || 'Unknown'}; {isYourUniverse ? 'Thunder Born' : 'Thunder Born'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={isYourUniverse ? require('../../assets/BackGround/Bludbruh2.jpg') : require('../../assets/BackGround/Bludbruh2.jpg')}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={goToHomeScreen}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.header, isYourUniverse ? 
            { color: '#00FFFF', textShadowColor: '#fffb00', textShadowOffset: { width: 1, height: 2 }, textShadowRadius: 20 } : 
            { color: '#00FFFF', textShadowColor: '#fffb00', textShadowOffset: { width: 1, height: 2 }, textShadowRadius: 20 }]}>
              {isYourUniverse ? 'Thunder Born' : ' Shattered Realm: \n    Thunder Born'}
          </Text>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
              <Text style={[styles.chatText, { color: isYourUniverse ? '#00b3ff' : '#800080' }]}>🛡️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToAddMemberScreen} style={styles.plusButton}>
              <Text style={[styles.plusText, { color: isYourUniverse ? '#00b3ff' : '#800080' }]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.musicControls}>
          <TouchableOpacity style={styles.musicButton} onPress={playTheme}>
            <Text style={[styles.musicButtonText, { color: isYourUniverse ? '#00b3ff' : '#800080' }]}>Theme</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.musicButton} onPress={pauseTheme}>
            <Text style={[styles.musicButtonText, { color: isYourUniverse ? '#00b3ff' : '#800080' }]}>Pause</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={[styles.grid, { gap: cardSpacing }]}>
            {rows.map((row, rowIndex) => (
              <View key={rowIndex} style={[styles.row, { gap: cardSpacing }]}>
                {row.map((member, colIndex) => renderMemberCard(member, colIndex + rowIndex * 3))}
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={[styles.fixedRow, { gap: cardSpacing }]}>
          {fixedMembers.map((member, colIndex) => (
            <TouchableOpacity
              key={colIndex}
              style={[
                styles.card,
                { width: cardSize, height: cardSize * 1.6 },
                !member.clickable && styles.disabledCard,
                member.name === ' ' && styles.subtleButton,
                {
                  borderWidth: 2,
                  borderColor: isYourUniverse ? '#00b3ff' : '#800080',
                  backgroundColor: isYourUniverse ? 'rgba(0, 179, 255, 0.1)' : 'rgba(128, 0, 128, 0.1)',
                  shadowColor: isYourUniverse ? '#00b3ff' : '#800080',
                  shadowOpacity: 0.8,
                  shadowRadius: 10,
                },
              ]}
              onPress={async () => {
                if (member.clickable) {
                  await stopBackgroundMusic();
                  navigation.navigate(member.screen, { from: 'BludBruhsHome', isYourUniverse });
                }
              }}
              disabled={!member?.clickable}
            >
              {member.image && (
                <>
                  <Image source={member.image} style={styles.characterImage} />
                  <View style={styles.transparentOverlay} />
                </>
              )}
              <Text style={[styles.codename, { color: isYourUniverse ? '#00b3ff' : '#800080', textShadowColor: isYourUniverse ? '#00b3ff' : '#800080', textShadowRadius: 10 }]}>{member.codename || ''}</Text>
              <Text style={[styles.name, { color: isYourUniverse ? '#fff' : '#ddd', textShadowColor: isYourUniverse ? '#00b3ff' : '#800080', textShadowRadius: 10 }]}>{member.name || ''}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Modal
          visible={!!previewMember}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setPreviewMember(null)}
        >
          <View style={styles.modalBackground}>
            <TouchableOpacity
              style={styles.modalOuterContainer}
              activeOpacity={1}
              onPress={() => setPreviewMember(null)}
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
                  {previewMember && renderPreviewCard(previewMember)}
                </ScrollView>
              </View>
              <View style={styles.previewAboutSection}>
                <Text style={[styles.previewCodename, { color: isYourUniverse ? '#00b3ff' : '#800080', textShadowColor: isYourUniverse ? '#00b3ff' : '#800080', textShadowRadius: 10 }]}>{previewMember?.codename || 'N/A'}</Text>
                <Text style={[styles.previewName, { color: isYourUniverse ? '#fff' : '#ddd', textShadowColor: isYourUniverse ? '#00b3ff' : '#800080', textShadowRadius: 10 }]}>{previewMember?.name || 'Unknown'}</Text>
                <TouchableOpacity
                  onPress={() => setPreviewMember(null)}
                  style={styles.closeButton}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
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
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.564)',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 10,
  },
  backText: {
    fontSize: 18,
    color: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  chatButton: {
    padding: 10,
  },
  chatText: {
    fontSize: 20,
  },
  plusButton: {
    padding: 10,
  },
  plusText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  musicControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 10,
  },
  grid: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  fixedRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.406)',
  },
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
  },
  disabledCard: {
    opacity: 0.8,
    backgroundColor: '#555',
  },
  subtleButton: {
    opacity: 0.3,
  },
  emptyCard: {
    backgroundColor: 'transparent',
  },
  characterImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  codename: {
    position: 'absolute',
    bottom: 10,
    left: 5,
    fontSize: 14,
    fontWeight: 'bold',
  },
  name: {
    position: 'absolute',
    bottom: 25,
    left: 5,
    fontSize: 12,
  },
  previewCard: (isDesktop, width) => ({
    width: isDesktop ? width * 0.6 : width * 0.7,
    height: isDesktop ? SCREEN_HEIGHT * 0.6 : SCREEN_HEIGHT * 0.5,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
  }),
  clickable: {
    borderWidth: 2,
  },
  previewImage: {
    width: '100%',
    height: '100%',
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
    height: '70%',
  },
  imageScrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewAboutSection: {
    padding: 10,
    backgroundColor: '#222',
    borderRadius: 10,
    alignItems: 'center',
  },
  previewCodename: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  previewName: {
    fontSize: 16,
    marginVertical: 5,
  },
  closeButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  cardName: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default BludBruhsScreen;