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
  { name: '', codename: 'TBA', screen: '', clickable: false, position: [0, 0], image: require('../../assets/Armor/PlaceHolder.jpg') },
  { name: 'James', codename: 'Guarduan', screen: 'James', clickable: true, position: [0, 2], image: require('../../assets/Armor/James.jpg') },
  { name: '', codename: 'TBA', screen: '', clickable: false, position: [1, 0], image: require('../../assets/Armor/PlaceHolder.jpg') },
  { name: 'Aileen', codename: 'Ariata', screen: 'Aileen', clickable: true, position: [1, 1], image: require('../../assets/Armor/AileenAriata.jpg') },
  { name: '', codename: 'TBA', screen: '', clickable: false, position: [1, 2], image: require('../../assets/Armor/PlaceHolder.jpg') },
  { name: 'Myran', codename: 'Cyber', screen: 'Myran', clickable: true, position: [2, 0], image: require('../../assets/Armor/Myran.jpg') },
  { name: '', codename: 'TBA', screen: '', clickable: false, position: [2, 2], image: require('../../assets/Armor/PlaceHolder.jpg') },
];

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

  const stopSound = async () => {
    if (currentSound) {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      setCurrentSound(null);
      setIsPlaying(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      return () => stopSound();
    }, [currentSound])
  );

  const goToChat = async () => {
    await stopSound();
    navigation.navigate('TeamChat');
  };

  const isDesktop = SCREEN_WIDTH > 600;
  const cardSize = isDesktop ? 200 : Math.min(120, SCREEN_WIDTH / 3 - 20);
  const cardSpacing = isDesktop ? 35 : Math.min(15, (SCREEN_WIDTH - 3 * cardSize) / 4);

  const renderCard = (member) => (
    <TouchableOpacity
      key={`${member.position[0]}-${member.position[1]}`}
      style={[
        styles.card,
        {
          width: cardSize,
          height: cardSize * 1.6,
          borderWidth: 2,
          borderColor: '#00b3ff',
          backgroundColor: 'rgba(0, 179, 255, 0.1)',
          shadowColor: '#00b3ff',
          shadowOpacity: 0.8,
          shadowRadius: 10,
          elevation: 10,
        },
        !member.clickable && styles.disabledCard,
      ]}
      onPress={() => member.clickable && navigation.navigate(member.screen)}
      disabled={!member.clickable}
    >
      <Image source={member.image} style={styles.characterImage} resizeMode="cover" />

      {/* YOUR ORIGINAL LOOK — NOW RESPONSIVE & PERFECT */}
      <View style={styles.textWrapper}>
        {/* Real Name — moves up when codename wraps */}
        <Text style={[styles.name, isDesktop ? styles.nameDesktop : styles.nameMobile]}>
          {member.name || ''}
        </Text>

        {/* Codename — wraps cleanly on mobile */}
        <Text
          style={[styles.codename, isDesktop ? styles.codenameDesktop : styles.codenameMobile]}
          numberOfLines={isDesktop ? 1 : 3}
        >
          {member.codename || 'TBA'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Eclipse.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={async () => { await stopSound(); navigation.goBack(); }}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Eclipse</Text>
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

        {/* Content */}
        <View style={styles.contentCenter}>
          {isDesktop ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                padding: 20,
                gap: cardSpacing,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {members.map(renderCard)}
            </ScrollView>
          ) : (
            <ScrollView contentContainerStyle={{ padding: 10 }}>
              <View style={{ gap: cardSpacing, alignItems: 'center' }}>
                {[0, 1, 2].map((row) => (
                  <View key={row} style={{ flexDirection: 'row', gap: cardSpacing }}>
                    {[0, 1, 2].map((col) => {
                      if (isEmpty(row, col)) {
                        return <View key={col} style={{ width: cardSize, height: cardSize * 1.6 }} />;
                      }
                      const member = getMemberAtPosition(row, col);
                      return member ? renderCard(member) : null;
                    })}
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { width: '100%', height: '100%' },
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  contentCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  backButton: { padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 5 },
  backText: { fontSize: 18, color: '#00b4ff', fontWeight: 'bold' },
  header: { fontSize: 28, fontWeight: 'bold', color: 'rgba(107,107,107,1)', textAlign: 'center', flex: 1, textShadowColor: '#00b3ff', textShadowRadius: 35 },
  chatButton: { padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 5 },
  chatText: { fontSize: 20, color: '#00b3ff' },

  musicControls: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10 },
  musicButton: { padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, marginHorizontal: 10 },
  musicButtonText: { fontSize: 12, color: '#00b3ff', fontWeight: 'bold' },

  card: { borderRadius: 10, overflow: 'hidden', position: 'relative' },
  characterImage: { width: '100%', height: '100%' },

  // MAGIC WRAPPER — KEEPS YOUR EXACT STYLE
  textWrapper: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    padding: 4,
  },

  // BASE TEXT STYLES
  codename: {
    fontWeight: 'bold',
    color: '#00b3ff',
    textShadowColor: '#00b3ff',
    textShadowRadius: 12,
    zIndex: 2,
  },
  name: {
    color: '#fff',
    textShadowColor: '#00b3ff',
    textShadowRadius: 12,
    zIndex: 2,
  },

  // DESKTOP — 100% YOUR ORIGINAL EPIC LOOK
  codenameDesktop: { position: 'absolute', bottom: 12, left: 10, fontSize: 16 },
  nameDesktop:    { position: 'absolute', bottom: 34, left: 10, fontSize: 14 },

  // MOBILE — WRAPS BEAUTIFULLY, NAME MOVES UP
  codenameMobile: {
    fontSize: 13,
    lineHeight: 16,
    textAlign: 'left',
  },
  nameMobile: {
    fontSize: 11,
    marginBottom: 2,
    textAlign: 'left',
  },

  disabledCard: { opacity: 0.6 },
});

export default EclipseScreen;