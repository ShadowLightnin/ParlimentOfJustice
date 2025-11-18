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
  { name: '', codename: 'TBA', screen: '', clickable: false, position: [0, 0], image: require('../../assets/Armor/PlaceHolder.jpg') },
  { name: 'James', codename: 'Gentle Hand', screen: 'James', clickable: true, position: [0, 2], image: require('../../assets/Armor/James.jpg') },
  // { name: 'Kelsie', codename: 'Eliptic-Dancer', screen: 'Kelsie', clickable: true, position: [1, 0], image: require('../../assets/Armor/Kelsie2.jpg') },
  { name: '', codename: 'TBA', screen: '', clickable: false, position: [1, 0], image: require('../../assets/Armor/PlaceHolder.jpg') },
  { name: 'Aileen', codename: 'Ariata', screen: 'Aileen', clickable: true, position: [1, 1], image: require('../../assets/Armor/AileenAriata.jpg') },
  { name: '', codename: 'TBA', screen: '', clickable: false, position: [1, 2], image: require('../../assets/Armor/PlaceHolder.jpg') },
  { name: 'Myran', codename: 'Techno Guard', screen: 'Myran', clickable: true, position: [2, 0], image: require('../../assets/Armor/Myran.jpg') },
  { name: '', codename: 'TBA', screen: '', clickable: false, position: [2, 2], image: require('../../assets/Armor/PlaceHolder.jpg') },
];

// Empty cell checker
const isEmpty = (row, col) => (row === 0 && col === 1) || (row === 2 && col === 1);
const getMemberAtPosition = (row, col) =>
  members.find((member) => member.position[0] === row && member.position[1] === col);

const EclipseScreen = () => {
  const navigation = useNavigation();
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playTheme = async () => {
    if (!currentSound) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/audio/CaptainAmericaEpic.mp4'),
          { shouldPlay: true, isLooping: true, volume: 1.0 }
        );
        setCurrentSound(sound);
        await sound.playAsync();
        setIsPlaying(true);
      } catch (error) {
        console.error('Failed to load audio file:', error);
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

  // Cleanup sound on unmount or navigation
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (currentSound) {
          currentSound.stopAsync().catch(() => {});
          currentSound.unloadAsync().catch(() => {});
          setCurrentSound(null);
          setIsPlaying(false);
        }
      };
    }, [currentSound])
  );

  const goToChat = () => {
    navigation.navigate('TeamChat');
  };

  const isDesktop = SCREEN_WIDTH > 600;
  // Now using the EXACT same dynamic sizing as Titans — big, bold cards
  const cardSize = isDesktop ? 200 : Math.min(120, SCREEN_WIDTH / 3 - 20);
  const cardSpacing = isDesktop ? 35 : Math.min(15, (SCREEN_WIDTH - 3 * cardSize) / 4);

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Eclipse.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Eclipse</Text>
          <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
            <Text style={styles.chatText}>🛡️</Text>
          </TouchableOpacity>
        </View>

        {/* Music Controls */}
        <View style={styles.musicControls}>
          <TouchableOpacity style={styles.musicButton} onPress={playTheme}>
            <Text style={ styles.musicButtonText}>Theme</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.musicButton} onPress={pauseTheme}>
            <Text style={styles.musicButtonText}>Pause</Text>
          </TouchableOpacity>
        </View>

        {/* Desktop Horizontal Scroll */}
        {isDesktop ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ padding: 20, gap: cardSpacing, alignItems: 'center' }}
          >
            {members.map((member, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.card,
                  { width: cardSize, height: cardSize * 1.6 },
                  !member.clickable && styles.disabledCard,
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
                onPress={() => member.clickable && navigation.navigate(member.screen)}
                disabled={!member.clickable}
              >
                {member.image && <Image source={member.image} style={styles.characterImage} resizeMode="cover" />}
                <Text style={styles.codename}>{member.codename || 'TBA'}</Text>
                <Text style={styles.name}>{member.name || ''}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          /* Mobile 3x3 Grid */
          <ScrollView contentContainerStyle={{ padding: 10 }}>
            <View style={{ gap: cardSpacing, alignItems: 'center' }}>
              {[0, 1, 2].map((row) => (
                <View key={row} style={{ flexDirection: 'row', gap: cardSpacing }}>
                  {[0, 1, 2].map((col) => {
                    if (isEmpty(row, col)) {
                      return <View key={col} style={{ width: cardSize, height: cardSize * 1.6 }} />;
                    }
                    const member = getMemberAtPosition(row, col);
                    return (
                      <TouchableOpacity
                        key={col}
                        style={[
                          styles.card,
                          { width: cardSize, height: cardSize * 1.6 },
                          !member?.clickable && styles.disabledCard,
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
                        onPress={() => member?.clickable && navigation.navigate(member.screen)}
                        disabled={!member?.clickable}
                      >
                        {member?.image && <Image source={member.image} style={styles.characterImage} resizeMode="cover" />}
                        <Text style={styles.codename}>{member?.codename || 'TBA'}</Text>
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
    color: '#00b4ff',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'rgba(107, 107, 107, 1)',
    textAlign: 'center',
    textShadowColor: '#00b3ff',
    textShadowRadius: 35,
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
    elevation: 5,
  },
  // नए
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

export default EclipseScreen;