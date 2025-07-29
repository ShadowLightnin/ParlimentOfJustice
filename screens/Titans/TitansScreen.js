import React, { useEffect, useState, useCallback } from 'react';
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
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';

// Screen dimensions
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// Member Data
const members = [
  { name: 'Spencer McNeil', codename: 'Annihilator', screen: 'Spencer', clickable: true, position: [0, 0], image: require('../../assets/Armor/Spencer5.jpg') },
  { name: 'Azure Briggs', codename: 'Mediateir', screen: 'Azure', clickable: true, position: [0, 2], image: require('../../assets/Armor/Azure3.jpg') },
  { name: 'Jared McNeil', codename: 'Spector', screen: 'Jared', clickable: true, position: [1, 0], image: require('../../assets/Armor/JaredLegacy.jpg') },
  { name: 'Will Cummings', codename: 'Night Hawk', screen: 'Will', clickable: true, position: [1, 1], image: require('../../assets/Armor/WillNightHawk2.jpg') },
  { name: 'Ben Briggs', codename: 'Nuscus', screen: 'Ben', clickable: true, position: [1, 2], image: require('../../assets/Armor/BenLegacy.jpg') },
  { name: 'Jennifer McNeil', codename: 'Kintsugi', screen: 'Jennifer', clickable: true, position: [2, 0], image: require('../../assets/Armor/JenniferLegacy.jpg') },
  { name: 'Emma Cummings', codename: 'Kintsunera', screen: 'Emma', clickable: true, position: [2, 2], image: require('../../assets/Armor/EmmaLegacy.jpg') },
];

// Empty cell checker
const isEmpty = (row, col) => (row === 0 && col === 1) || (row === 2 && col === 1);
const getMemberAtPosition = (row, col) =>
  members.find((member) => member.position[0] === row && member.position[1] === col);

const TitansScreen = () => {
  const navigation = useNavigation();
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Handle music playback
  const playTheme = async () => {
    if (!currentSound) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/audio/AvengerXJL.mp4'),
          { shouldPlay: true, isLooping: true, volume: 1.0 }
        );
        setCurrentSound(sound);
        await sound.playAsync();
        setIsPlaying(true);
      } catch (error) {
        console.error('Failed to load audio file:', error);
        Alert.alert('Audio Error', 'Failed to load background music. Please check the audio file path: ../../assets/audio/AvengerXJL.mp4');
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

  // Cleanup sound on unmount or navigation
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (currentSound) {
          currentSound.stopAsync().catch((error) => console.error('Error stopping sound:', error));
          currentSound.unloadAsync().catch((error) => console.error('Error unloading sound:', error));
          setCurrentSound(null);
          setIsPlaying(false);
        }
      };
    }, [currentSound])
  );

  const goToChat = async () => {
    if (currentSound) {
      try {
        await currentSound.stopAsync();
        await currentSound.unloadAsync();
        setCurrentSound(null);
        setIsPlaying(false);
      } catch (error) {
        console.error('Error stopping sound for chat:', error);
      }
    }
    navigation.navigate('TeamChat');
  };

  const isDesktop = SCREEN_WIDTH > 600;
  const cardSize = isDesktop ? 200 : Math.min(120, SCREEN_WIDTH / 3 - 20); // Dynamic card size for mobile
  const cardSpacing = isDesktop ? 30 : Math.min(15, (SCREEN_WIDTH - 3 * cardSize) / 4); // Dynamic spacing

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Titans.jpg')}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={async () => {
              console.log('Navigating to Home');
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
              navigation.navigate('Home');
            }}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Titans</Text>
          <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
            <Text style={styles.chatText}>🛡️</Text>
          </TouchableOpacity>
        </View>

        {/* Music Controls */}
        <View style={styles.musicControls}>
          <TouchableOpacity style={styles.musicButton} onPress={playTheme}>
            <Text style={styles.musicButtonText}>Theme</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.musicButton} onPress={pauseTheme}>
            <Text style={styles.musicButtonText}>Pause</Text>
          </TouchableOpacity>
        </View>

        {/* Layout based on device */}
        {isDesktop ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.horizontalScroll, { gap: cardSpacing }]}
          >
            {members.map((member, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.card,
                  { width: cardSize, height: cardSize * 1.6 },
                  !member.clickable && styles.disabledCard,
                ]}
                onPress={async () => {
                  if (member.clickable) {
                    if (currentSound) {
                      try {
                        await currentSound.stopAsync();
                        await currentSound.unloadAsync();
                        setCurrentSound(null);
                        setIsPlaying(false);
                      } catch (error) {
                        console.error('Error stopping sound for member navigation:', error);
                      }
                    }
                    navigation.navigate(member.screen);
                  }
                }}
                disabled={!member.clickable}
              >
                {member.image && (
                  <>
                    <Image
                      source={member.image}
                      style={[styles.characterImage, { width: '100%', height: cardSize * 1.2 }]}
                    />
                    <View style={styles.transparentOverlay} />
                  </>
                )}
                <Text style={styles.codename}>{member.codename}</Text>
                <Text style={styles.name}>{member.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <ScrollView
            vertical
            showsVerticalScrollIndicator={true}
            contentContainerStyle={[styles.verticalScroll, { gap: cardSpacing, paddingVertical: 10 }]}
          >
            <View style={[styles.grid, { gap: cardSpacing }]}>
              {[0, 1, 2].map((row) => (
                <View key={row} style={[styles.row, { gap: cardSpacing }]}>
                  {[0, 1, 2].map((col) => {
                    if (isEmpty(row, col)) {
                      return <View key={col} style={{ width: cardSize, height: cardSize * 1.4 }} />;
                    }
                    const member = getMemberAtPosition(row, col);
                    return (
                      <TouchableOpacity
                        key={col}
                        style={[
                          styles.card,
                          { width: cardSize, height: cardSize * 1.6 },
                          !member?.clickable && styles.disabledCard,
                        ]}
                        onPress={async () => {
                          if (member?.clickable) {
                            if (currentSound) {
                              try {
                                await currentSound.stopAsync();
                                await currentSound.unloadAsync();
                                setCurrentSound(null);
                                setIsPlaying(false);
                              } catch (error) {
                                console.error('Error stopping sound for member navigation:', error);
                              }
                            }
                            navigation.navigate(member.screen);
                          }
                        }}
                        disabled={!member?.clickable}
                      >
                        {member?.image && (
                          <>
                            <Image
                              source={member.image}
                              style={[styles.characterImage, { width: '100%', height: cardSize * 1.2 }]}
                            />
                            <View style={styles.transparentOverlay} />
                          </>
                        )}
                        <Text style={styles.codename}>{member?.codename || ''}</Text>
                        <Text style={styles.name}>{member?.name || ''}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1,
  },
  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
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
    textShadowColor: '#00b3ff',
    textShadowRadius: 15,
    flex: 1,
    paddingRight: 20,
  },
  chatButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
  },
  chatText: {
    fontSize: 20,
    color: '#00b3ff',
  },
  grid: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalScroll: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  horizontalScroll: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  card: {
    backgroundColor: '#1c1c1c',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: '#00b3ff',
    shadowOpacity: 1.5,
    shadowRadius: 10,
    elevation: 5,
    padding: 5,
  },
  characterImage: {
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
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
  disabledCard: {
    backgroundColor: '#444',
    shadowColor: 'transparent',
  },
  musicControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  musicButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  musicButtonText: {
    fontSize: 12,
    color: '#00b3ff',
    fontWeight: 'bold',
  },
});

export default TitansScreen;