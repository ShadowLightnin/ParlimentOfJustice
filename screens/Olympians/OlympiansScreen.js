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
import descriptions from './OlympiansDescription';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const isDesktop = SCREEN_WIDTH > 600;
const columns = isDesktop ? 6 : 3;
const cardSize = isDesktop ? 160 : 100;
const cardHeightMultiplier = 1.6;
const horizontalSpacing = isDesktop ? 40 : 10;
const verticalSpacing = isDesktop ? 50 : 20;

export const OlympiansScreen = () => {
  const navigation = useNavigation();
  const [previewMember, setPreviewMember] = useState(null);
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Handle music playback
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

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowWidth(window.width);
    });
    return () => subscription?.remove();
  }, []);

  const goToChat = async () => {
    await stopSound();
    navigation.navigate('TeamChat');
  };

  const handleMemberPress = async (member) => {
    if (member.clickable) {
      await stopSound();
      if (member.screen && member.screen !== '') {
        navigation.navigate(member.screen);
      } else {
        navigation.navigate('OlympiansCharacterDetail', { member });
      }
    }
  };

  const renderMemberCard = (member) => {
    const enhancedMember = {
      ...member,
      image: member.images?.[0]?.uri || require('../../assets/Armor/PlaceHolder.jpg'),
      clickable: member.clickable !== undefined ? member.clickable : true,
      description: descriptions[member.name] || 'No description available',
      family: olympiansCategories.find(cat => cat.members.some(m => m.name === member.name))?.family || 'Unknown',
    };

    return (
      <TouchableOpacity
        key={member.name}
        style={[
          styles.card,
          { width: cardSize, height: cardSize * cardHeightMultiplier },
          !enhancedMember.clickable && styles.disabledCard,
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
        onPress={() => handleMemberPress(enhancedMember)}
        disabled={!enhancedMember.clickable}
      >
        <Image
          source={typeof enhancedMember.image === 'string' ? { uri: enhancedMember.image } : enhancedMember.image}
          style={styles.characterImage}
          resizeMode="cover"
        />
        <Text style={styles.codename}>{enhancedMember.codename || ''}</Text>
        <Text style={styles.name}>{enhancedMember.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderJenniferCard = (member) => {
    const enhancedMember = {
      ...member,
      image: member.images?.[0]?.uri || require('../../assets/Armor/PlaceHolder.jpg'),
      clickable: member.clickable !== undefined ? member.clickable : true,
    };

    return (
      <TouchableOpacity
        key={member.name}
        style={[
          styles.jenniferCard,
          { width: 2 * cardSize + horizontalSpacing, height: cardSize * 2.5 },
          {
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
        disabled={!enhancedMember.clickable}
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
  const allMembers = olympiansCategories.flatMap(c => c.members).filter(m => m.name !== 'Jennifer');

  return (
    <ImageBackground source={require('../../assets/BackGround/Olympians.jpg')} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.container}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={async () => { await stopSound(); navigation.goBack(); }}>
            <Text style={styles.backText}>← Back</Text>
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
            {Array.from({ length: Math.ceil(allMembers.length / columns) }).map((_, rowIndex) => (
              <View key={rowIndex} style={[styles.row, { marginBottom: verticalSpacing, gap: horizontalSpacing }]}>
                {Array.from({ length: columns }).map((_, colIndex) => {
                  const member = allMembers[rowIndex * columns + colIndex];
                  return member ? renderMemberCard(member) : <View key={colIndex} style={{ width: cardSize, height: cardSize * cardHeightMultiplier }} />;
                })}
              </View>
            ))}
          </View>
        </ScrollView>

        <Modal visible={!!previewMember} transparent animationType="fade" onRequestClose={() => setPreviewMember(null)}>
          <View style={styles.modalBackground}>
            <Text style={{ color: '#fff', fontSize: 24, marginBottom: 20 }}>Long-press disabled — images protected</Text>
            {/* Your existing modal content */}
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  headerWrapper: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingTop: 10 },
  backButton: { padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 5 },
  backText: { fontSize: 18, color: '#00b3ff', fontWeight: 'bold' },
  header: { fontSize: 28, fontWeight: 'bold', color: '#fff', textAlign: 'center', flex: 1 },
  chatButton: { padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 5 },
  chatText: { fontSize: 20, color: '#00b3ff' },
  musicControls: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10 },
  musicButton: { padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, marginHorizontal: 10 },
  musicButtonText: { fontSize: 12, color: '#00b3ff', fontWeight: 'bold' },
  scrollContainer: { paddingBottom: 20, alignItems: 'center' },
  membersContainer: { width: '100%', alignItems: 'center' },
  row: { flexDirection: 'row', justifyContent: 'center' },
  card: { borderRadius: 10, overflow: 'hidden' },
  characterImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  codename: { position: 'absolute', bottom: 12, left: 10, fontSize: 14, fontWeight: 'bold', color: '#00b3ff', textShadowColor: '#00b3ff', textShadowRadius: 12, zIndex: 2 },
  name: { position: 'absolute', bottom: 34, left: 10, fontSize: 12, color: '#fff', textShadowColor: '#00b3ff', textShadowRadius: 12, zIndex: 2 },
  disabledCard: { opacity: 0.6 },
  jenniferCard: { borderRadius: 15, overflow: 'hidden', marginHorizontal: 10 },
  jenniferImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  jenniferCodename: { position: 'absolute', bottom: 20, left: 15, fontSize: 22, fontWeight: 'bold', color: '#ff9999', textShadowColor: '#ff9999', textShadowRadius: 15, zIndex: 2 },
  jenniferName: { position: 'absolute', bottom: 50, left: 15, fontSize: 18, color: '#fff', textShadowColor: '#ff9999', textShadowRadius: 15, zIndex: 2 },
  jenniferCardContainer: { alignItems: 'center', marginTop: verticalSpacing },
  spacingBelowJennifer: { height: verticalSpacing * 2 },
  modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' },
});

export default OlympiansScreen;