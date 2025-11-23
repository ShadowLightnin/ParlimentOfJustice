import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { olympiansCategories } from './OlympiansMembers';
import { Audio } from 'expo-av';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const isDesktop = SCREEN_WIDTH > 600;
const columns = isDesktop ? 6 : 3;
const cardSize = isDesktop ? 160 : 100;
const cardHeightMultiplier = 1.6;
const horizontalSpacing = isDesktop ? 40 : 10;
const verticalSpacing = isDesktop ? 50 : 20;

// Phoenix colors for Olympians (Jennifer keeps her original red)
const PHOENIX = {
  fire: '#FF4500',
  gold: '#FFD700',
  ember: '#FF8C00',
};

export const OlympiansScreen = () => {
  const navigation = useNavigation();
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Audio functions unchanged
  const playTheme = async () => {
    if (!currentSound) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/audio/SupermanTrailer.mp4'),
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

  const goToChat = async () => {
    await stopSound();
    navigation.navigate('TeamChat');
  };

  const handleMemberPress = async (member) => {
    if (member.clickable !== false) {
      await stopSound();
      if (member.screen && member.screen !== '') {
        navigation.navigate(member.screen);
      } else {
        navigation.navigate('OlympiansCharacterDetail', { member });
      }
    }
  };

  // Regular Olympian cards — Phoenix fire
  const renderMemberCard = (member) => {
    const enhancedMember = {
      ...member,
      image: member.images?.[0]?.uri || require('../../assets/Armor/PlaceHolder.jpg'),
      clickable: member.clickable !== false,
    };

    return (
      <TouchableOpacity
        key={enhancedMember.name}
        style={[
          styles.card,
          {
            width: cardSize,
            height: cardSize * cardHeightMultiplier,
            borderWidth: 2,
            borderColor: PHOENIX.fire,
            backgroundColor: 'rgba(255, 69, 0, 0.15)',
            shadowColor: PHOENIX.fire,
            shadowOpacity: 0.9,
            shadowRadius: 14,
            elevation: 12,
          },
          !enhancedMember.clickable && styles.disabledCard,
        ]}
        onPress={() => handleMemberPress(enhancedMember)}
        disabled={!enhancedMember.clickable}
      >
        <Image
          source={typeof enhancedMember.image === 'string' ? { uri: enhancedMember.image } : enhancedMember.image}
          style={styles.characterImage}
          resizeMode="cover"
        />

        <View style={styles.textWrapper}>
          <Text style={[styles.name, isDesktop ? styles.nameDesktop : styles.nameMobile]}>
            {enhancedMember.name}
          </Text>
          <Text
            style={[styles.codename, isDesktop ? styles.codenameDesktop : styles.codenameMobile]}
            numberOfLines={isDesktop ? 1 : 3}
          >
            {enhancedMember.codename || ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Jennifer — 100% original memorial red (untouched)
  const renderJenniferCard = (member) => {
    const enhancedMember = {
      ...member,
      image: member.images?.[0]?.uri || require('../../assets/Armor/PlaceHolder.jpg'),
      clickable: member.clickable !== false,
    };

    return (
      <TouchableOpacity
        key={enhancedMember.name}
        style={[
          styles.jenniferCard,
          {
            width: 2 * cardSize + horizontalSpacing,
            height: cardSize * 2.5,
            borderWidth: 3,
            borderColor: '#ff9999',
            backgroundColor: 'rgba(255, 153, 153, 0.1)',
            shadowColor: '#ff9999',
            shadowOpacity: 0.9,
            shadowRadius: 15,
            elevation: 15,
          },
        ]}
        onPress={() => handleMemberPress(enhancedMember)}
      >
        <Image
          source={typeof enhancedMember.image === 'string' ? { uri: enhancedMember.image } : enhancedMember.image}
          style={styles.jenniferImage}
          resizeMode="cover"
        />
        <Text style={styles.jenniferCodename}>{enhancedMember.codename || ''}</Text>
        <Text style={styles.jenniferName}>{enhancedMember.name}</Text>
      </TouchableOpacity>
    );
  };

  const jenniferMember = olympiansCategories.flatMap(c => c.members).find(m => m.name === 'Jennifer');
  const eduriaMembers = olympiansCategories.find(c => c.family === 'Eduria')?.members || [];
  const nonEduriaMembers = olympiansCategories
    .filter(c => c.family !== 'Eduria')
    .flatMap(c => c.members)
    .filter(m => m.name !== 'Jennifer');

  return (
    <ImageBackground source={require('../../assets/BackGround/Olympians.jpg')} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={async () => { await stopSound(); navigation.goBack(); }}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Olympians</Text>
          <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
            <Text style={styles.chatText}>🛡️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.musicControls}>
          <TouchableOpacity style={styles.musicButton} onPress={playTheme}><Text style={styles.musicButtonText}>Theme</Text></TouchableOpacity>
          <TouchableOpacity style={styles.musicButton} onPress={pauseTheme}><Text style={styles.musicButtonText}>Pause</Text></TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {jenniferMember && <View style={styles.jenniferCardContainer}>{renderJenniferCard(jenniferMember)}</View>}
          <View style={styles.spacingBelowJennifer} />

          <View style={styles.membersContainer}>
            {Array.from({ length: Math.ceil(nonEduriaMembers.length / columns) }).map((_, rowIndex) => (
              <View key={rowIndex} style={[styles.row, { marginBottom: verticalSpacing, gap: horizontalSpacing }]}>
                {Array.from({ length: columns }).map((_, colIndex) => {
                  const member = nonEduriaMembers[rowIndex * columns + colIndex];
                  return member
                    ? renderMemberCard(member)
                    : <View key={colIndex} style={{ width: cardSize, height: cardSize * cardHeightMultiplier }} />;
                })}
              </View>
            ))}

            {/* THE DIWATAS — NOW WITH VISIBLE PHOENIX LINE */}
            {eduriaMembers.length > 0 && (
              <>
                <View style={styles.diwataLine} />
                <Text style={styles.diwataTitle}>The Diwatas</Text>
                <View style={styles.diwataLine} />

                {Array.from({ length: Math.ceil(eduriaMembers.length / columns) }).map((_, rowIndex) => (
                  <View key={`diwata-${rowIndex}`} style={[styles.row, { marginBottom: verticalSpacing, gap: horizontalSpacing }]}>
                    {Array.from({ length: columns }).map((_, colIndex) => {
                      const member = eduriaMembers[rowIndex * columns + colIndex];
                      return member
                        ? renderMemberCard(member)
                        : <View key={colIndex} style={{ width: cardSize, height: cardSize * cardHeightMultiplier }} />;
                    })}
                  </View>
                ))}
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { width: '100%', height: '100%' },
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },

  // Header & buttons — Phoenix fire
  headerWrapper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingTop: 10 },
  backButton: { padding: 12, backgroundColor: 'rgba(255,69,0,0.3)', borderRadius: 8, borderWidth: 2, borderColor: PHOENIX.fire },
  backText: { fontSize: 18, color: PHOENIX.gold, fontWeight: 'bold' },
  header: { fontSize: 32, fontWeight: '900', color: PHOENIX.gold, textShadowColor: PHOENIX.fire, textShadowRadius: 20, textAlign: 'center', flex: 1 },
  chatButton: { padding: 12, backgroundColor: 'rgba(255,69,0,0.3)', borderRadius: 8, borderWidth: 2, borderColor: PHOENIX.fire },
  chatText: { fontSize: 24, color: PHOENIX.gold },

  musicControls: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10 },
  musicButton: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: 'rgba(255,69,0,0.25)', borderRadius: 30, marginHorizontal: 12, borderWidth: 1, borderColor: PHOENIX.ember },
  musicButtonText: { fontSize: 13, color: PHOENIX.gold, fontWeight: 'bold' },

  scrollContainer: { paddingBottom: 20, alignItems: 'center' },
  membersContainer: { width: '100%', alignItems: 'center' },
  row: { flexDirection: 'row', justifyContent: 'center' },

  card: { borderRadius: 10, overflow: 'hidden', position: 'relative' },
  characterImage: { width: '100%', height: '100%', resizeMode: 'cover' },

  // DIWATAS LINE — NOW VISIBLE AND GLOWING
  diwataLine: {
    height: 5,
    backgroundColor: PHOENIX.fire,
    marginHorizontal: 60,
    marginVertical: 25,
    borderRadius: 3,
    shadowColor: PHOENIX.fire,
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 12,
  },
  diwataTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: PHOENIX.gold,
    textShadowColor: PHOENIX.fire,
    textShadowRadius: 30,
    textAlign: 'center',
  },

  textWrapper: { position: 'absolute', bottom: 8, left: 8, right: 8, padding: 4 },
  codename: { fontWeight: 'bold', color: PHOENIX.gold, textShadowColor: PHOENIX.fire, textShadowRadius: 14, zIndex: 2 },
  name: { color: '#fff', textShadowColor: PHOENIX.fire, textShadowRadius: 12, zIndex: 2 },
  codenameDesktop: { position: 'absolute', bottom: 12, left: 10, fontSize: 14 },
  nameDesktop: { position: 'absolute', bottom: 34, left: 10, fontSize: 12 },
  codenameMobile: { fontSize: 13, lineHeight: 16, textAlign: 'left' },
  nameMobile: { fontSize: 11, marginBottom: 2, textAlign: 'left' },

  disabledCard: { opacity: 0.6 },

  // JENNIFER — 100% ORIGINAL MEMORIAL RED (unchanged)
  jenniferCard: { borderRadius: 15, overflow: 'hidden', marginHorizontal: 10 },
  jenniferImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  jenniferCodename: { position: 'absolute', bottom: 20, left: 15, fontSize: 22, fontWeight: 'bold', color: '#ff9999', textShadowColor: '#ff9999', textShadowRadius: 15, zIndex: 2 },
  jenniferName: { position: 'absolute', bottom: 50, left: 15, fontSize: 18, color: '#fff', textShadowColor: '#ff9999', textShadowRadius: 15, zIndex: 2 },

  jenniferCardContainer: { alignItems: 'center', marginTop: verticalSpacing },
  spacingBelowJennifer: { height: verticalSpacing * 2 },
});

export default OlympiansScreen;