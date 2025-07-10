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
  { name: 'Azure Briggs', codename: 'Mediateir', screen: 'Azure', clickable: true, position: [0, 2], image: require('../../assets/Armor/Azure.jpg') },
  { name: 'Jared McNeil', codename: 'Spector', screen: 'Jared', clickable: true, position: [1, 0], image: require('../../assets/Armor/Jared.jpg') },
  { name: 'Will Cummings', codename: 'Night Hawk', screen: 'Will', clickable: true, position: [1, 1], image: require('../../assets/NightHawkWillBeBorn.jpg') },
  { name: 'Ben Briggs', codename: 'Nuscus', screen: 'Ben', clickable: true, position: [1, 2], image: require('../../assets/Armor/Ben3.jpg') },
  { name: 'Jennifer McNeil', codename: 'Kintsugi', screen: 'Jennifer', clickable: true, position: [2, 0], image: require('../../assets/Armor/Jennifer2.jpg') },
  { name: 'Emma Cummings', codename: 'Kintsunera', screen: 'Emma', clickable: true, position: [2, 2], image: require('../../assets/Armor/Emma.jpg') },
];

// Empty cell checker
const isEmpty = (row, col) => (row === 0 && col === 1) || (row === 2 && col === 1);
const getMemberAtPosition = (row, col) =>
  members.find((member) => member.position[0] === row && member.position[1] === col);

const TitansScreen = () => {
  const navigation = useNavigation();
  const [currentSound, setCurrentSound] = useState(null);
  const [pausedPosition, setPausedPosition] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Initialize sound on mount
  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/audio/SourceOfStrengthNinjagoMyVersion.mp4'),
          { shouldPlay: true, isLooping: false, volume: 1.0 }
        );
        setCurrentSound(sound);
      } catch (error) {
        console.error('Failed to load audio file:', error);
        Alert.alert('Audio Error', 'Failed to load background music. Please check the audio file path: ../../assets/audio/AvengerXJL.mp4');
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

      // Handle navigation to stop audio when going to Home
      const unsubscribe = navigation.addListener('beforeRemove', (e) => {
        if (e.data.action.type === 'NAVIGATE' && e.data.action.payload.name === 'Home') {
          if (currentSound) {
            currentSound.stopAsync().catch((error) => console.error('Error stopping sound:', error));
            currentSound.unloadAsync().catch((error) => console.error('Error unloading sound:', error));
            setCurrentSound(null);
            setPausedPosition(0);
            setIsPaused(false);
          }
        } else if (currentSound && !isPaused) {
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
      });

      return () => {
        unsubscribe();
      };
    }, [currentSound, isPaused, pausedPosition, navigation])
  );

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
    navigation.navigate('TeamChat');
  };

  const isDesktop = SCREEN_WIDTH > 600;
  const cardSize = isDesktop ? 200 : 100; // Larger cards on desktop
  const cardSpacing = isDesktop ? 30 : 10; // More spacing on desktop

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
                  setPausedPosition(0);
                  setIsPaused(false);
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
                        const status = await currentSound.getStatusAsync();
                        if (status.isPlaying) {
                          await currentSound.pauseAsync();
                          setPausedPosition(status.positionMillis || 0);
                          setIsPaused(true);
                        }
                      } catch (error) {
                        console.error('Error pausing sound for member navigation:', error);
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
          <View style={[styles.grid, { gap: cardSpacing }]}
>
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
                              const status = await currentSound.getStatusAsync();
                              if (status.isPlaying) {
                                await currentSound.pauseAsync();
                                setPausedPosition(status.positionMillis || 0);
                                setIsPaused(true);
                              }
                            } catch (error) {
                              console.error('Error pausing sound for member navigation:', error);
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default TitansScreen;