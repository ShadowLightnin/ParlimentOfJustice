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

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const members = [
  { name: 'Spencer McNeil', codename: 'Annihilator', screen: 'Spencer', clickable: true, position: [0, 0], image: require('../../assets/Armor/Spencer5.jpg') },
  { name: 'Azure Briggs', codename: 'Mediateir', screen: 'Azure', clickable: true, position: [0, 2], image: require('../../assets/Armor/Azure3.jpg') },
  { name: 'Jared McNeil', codename: 'Spector', screen: 'Jared', clickable: true, position: [1, 0], image: require('../../assets/Armor/Jared3.jpg') },
  { name: 'Will Cummings', codename: 'Night Hawk', screen: 'Will', clickable: true, position: [1, 1], image: require('../../assets/Armor/WillNightHawk3.jpg') },
  { name: 'Ben Briggs', codename: 'Nuscus', screen: 'Ben', clickable: true, position: [1, 2], image: require('../../assets/Armor/Ben4.jpg') },
  { name: 'Jennifer McNeil', codename: 'Kintsugi', screen: 'Jennifer', clickable: true, position: [2, 0], image: require('../../assets/Armor/JenniferLegacy.jpg') },
  { name: 'Emma Cummings', codename: 'Kintsunera', screen: 'Emma', clickable: true, position: [2, 2], image: require('../../assets/Armor/EmmaLegacy.jpg') },
];

const isEmpty = (row, col) => (row === 0 && col === 1) || (row === 2 && col === 1);
const getMemberAtPosition = (row, col) =>
  members.find(m => m.position[0] === row && m.position[1] === col);

const TitansScreen = () => {
  const navigation = useNavigation();
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
        Alert.alert('Audio Error', 'Failed to load background music.');
      }
    } else if (!isPlaying) {
      await currentSound.playAsync();
      setIsPlaying(true);
    }
  };

  const pauseTheme = async () => {
    if (currentSound && isPlaying) {
      await currentSound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const stopSound = async () => {
    if (currentSound) {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      setCurrentSound(null);
      setIsPlaying(false);
    }
  };

  useFocusEffect(useCallback(() => () => stopSound(), [currentSound]));

  const isDesktop = SCREEN_WIDTH > 600;
  
  // EXACT same dynamic sizing as your original
  const cardSize = isDesktop ? 200 : Math.min(120, SCREEN_WIDTH / 3 - 20);
  const cardSpacing = isDesktop ? 30 : Math.min(15, (SCREEN_WIDTH - 3 * cardSize) / 4);

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Titans.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={async () => {
              await stopSound();
              navigation.navigate('Home');
            }}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Titans</Text>
          <TouchableOpacity
            onPress={async () => {
              await stopSound();
              navigation.navigate('TeamChat');
            }}
            style={styles.chatButton}
          >
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

        {/* Desktop: Horizontal Scroll */}
        {isDesktop ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ padding: 20, gap: cardSpacing, alignItems: 'center' }}
          >
            {members.map((m, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  styles.card,
                  { width: cardSize, height: cardSize * 1.6 },
                  !m.clickable && styles.disabledCard,
                  {
                    borderWidth: 2,
                    borderColor: '#00b3ff',
                    backgroundColor: 'rgba(0, 179, 255, 0.1)',
                    shadowColor: '#00b3ff',
                    shadowOpacity: 0.8,
                    shadowRadius: 10,
                    elevation: 10,
                  },
                ]}
                onPress={async () => {
                  if (m.clickable) {
                    await stopSound();
                    navigation.navigate(m.screen);
                  }
                }}
                disabled={!m.clickable}
              >
                <Image source={m.image} style={styles.characterImage} resizeMode="cover" />
                <Text style={styles.codename}>{m.codename}</Text>
                <Text style={styles.name}>{m.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          /* Mobile: 3×3 Grid — EXACT same layout as original */
          <ScrollView contentContainerStyle={{ padding: 10 }}>
            <View style={{ gap: cardSpacing, alignItems: 'center' }}>
              {[0, 1, 2].map(row => (
                <View key={row} style={{ flexDirection: 'row', gap: cardSpacing }}>
                  {[0, 1, 2].map(col => {
                    if (isEmpty(row, col)) {
                      return <View key={col} style={{ width: cardSize, height: cardSize * 1.6 }} />;
                    }
                    const m = getMemberAtPosition(row, col);
                    return (
                      <TouchableOpacity
                        key={col}
                        style={[
                          styles.card,
                          { width: cardSize, height: cardSize * 1.6 },
                          !m?.clickable && styles.disabledCard,
                          {
                            borderWidth: 2,
                            borderColor: '#00b3ff',
                            backgroundColor: 'rgba(0, 179, 255, 0.1)',
                            shadowColor: '#00b3ff',
                            shadowOpacity: 0.8,
                            shadowRadius: 10,
                            elevation: 10,
                          },
                        ]}
                        onPress={async () => {
                          if (m?.clickable) {
                            await stopSound();
                            navigation.navigate(m.screen);
                          }
                        }}
                        disabled={!m?.clickable}
                      >
                        <Image source={m.image} style={styles.characterImage} resizeMode="cover" />
                        <Text style={styles.codename}>{m.codename}</Text>
                        <Text style={styles.name}>{m.name}</Text>
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
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
    textShadowColor: '#00b3ff',
    textShadowRadius: 20,
    textAlign: 'center',
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
  musicControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  musicButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    marginHorizontal: 10,
  },
  musicButtonText: {
    fontSize: 12,
    color: '#00b3ff',
    fontWeight: 'bold',
  },
  card: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  characterImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  codename: {
    position: 'absolute',
    bottom: 12,
    left: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00b3ff',
    textShadowColor: '#00b3ff',
    textShadowRadius: 12,
    zIndex: 2,
  },
  name: {
    position: 'absolute',
    bottom: 34,
    left: 10,
    fontSize: 14,
    color: '#fff',
    textShadowColor: '#00b3ff',
    textShadowRadius: 12,
    zIndex: 2,
  },
  disabledCard: {
    opacity: 0.6,
  },
});

export default TitansScreen;