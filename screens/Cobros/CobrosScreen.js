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
import { cobrosMembers } from './CobrosMembers';
import { Audio } from 'expo-av';
import descriptions from './CobrosDescription';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const isDesktop = SCREEN_WIDTH > 600;
const columns = isDesktop ? 5 : 3;
const cardSize = isDesktop ? 160 : 100;
const cardHeightMultiplier = 1.6;
const horizontalSpacing = isDesktop ? 40 : 10;
const verticalSpacing = isDesktop ? 50 : 20;

export const CobrosScreen = () => {
  const navigation = useNavigation();
  const [previewMember, setPreviewMember] = useState(null);
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // MUSIC SYSTEM — JUSTICE GANG NEVER DIES
  const playTheme = async () => {
    if (!currentSound) {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/audio/JusticeGang.mp4'),
          { shouldPlay: true, isLooping: true, volume: 1.0 }
        );
        setCurrentSound(sound);
        await sound.playAsync();
        setIsPlaying(true);
      } catch (error) {
        console.error('Justice Gang failed to load:', error);
        Alert.alert('Audio Error', 'Failed to load JusticeGang.mp4');
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

  const stopAndUnload = async () => {
    if (currentSound) {
      try { await currentSound.stopAsync(); } catch (e) {}
      try { await currentSound.unloadAsync(); } catch (e) {}
      setCurrentSound(null);
      setIsPlaying(false);
    }
  };

  useFocusEffect(useCallback(() => () => stopAndUnload(), [currentSound]));

  const goToChat = async () => {
    await stopAndUnload();
    navigation.navigate('TeamChat');
  };

  const handleBack = async () => {
    await stopAndUnload();
    navigation.goBack();
  };

  const handleMemberPress = async (member) => {
    if (member.clickable) {
      await stopAndUnload();
      if (member.screen && member.screen !== '') {
        navigation.navigate(member.screen);
      } else {
        navigation.navigate('CobrosCharacterDetail', { member });
      }
    }
  };

  const renderMemberCard = (member) => {
    const enhancedMember = {
      ...member,
      image: member.images?.[0]?.uri || require('../../assets/Armor/PlaceHolder.jpg'),
      clickable: member.clickable ?? true,
    };

    return (
      <TouchableOpacity
        key={member.name}
        style={[
          styles.card,
          {
            width: cardSize,
            height: cardSize * cardHeightMultiplier,
            borderWidth: 2,
            borderColor: '#e63946',
            backgroundColor: 'rgba(230, 57, 70, 0.15)',
            shadowColor: '#e63946',
            shadowOpacity: 1,
            shadowRadius: 15,
            elevation: 12,
          },
          !enhancedMember.clickable && styles.disabledCard,
        ]}
        onPress={() => handleMemberPress(enhancedMember)}
        disabled={!enhancedMember.clickable}
      >
        <Image source={enhancedMember.image} style={styles.characterImage} resizeMode="cover" />

        {/* THE COBROS TEXT SYSTEM — NOW IMMORTAL */}
        <View style={styles.textWrapper}>
          <Text style={[styles.name, isDesktop ? styles.nameDesktop : styles.nameMobile]}>
            {member.name}
          </Text>
          {member.codename ? (
            <Text
              style={[styles.codename, isDesktop ? styles.codenameDesktop : styles.codenameMobile]}
              numberOfLines={isDesktop ? 1 : 3}
            >
              {member.codename}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const renderGrid = () => {
    const rows = Math.ceil(cobrosMembers.length / columns);
    return Array.from({ length: rows }).map((_, i) => (
      <View key={i} style={[styles.row, { gap: horizontalSpacing, marginBottom: verticalSpacing }]}>
        {Array.from({ length: columns }).map((_, j) => {
          const member = cobrosMembers[i * columns + j];
          return member ? renderMemberCard(member) : <View key={j} style={{ width: cardSize, height: cardSize * cardHeightMultiplier }} />;
        })}
      </View>
    ));
  };

  const renderPreviewCard = (img) => (
    <TouchableOpacity style={[styles.previewCard(isDesktop), styles.clickable]} onPress={() => setPreviewMember(null)}>
      <Image source={typeof img.uri === 'string' ? { uri: img.uri } : img.uri} style={styles.previewImage} resizeMode="cover" />
      <Text style={styles.cardName}>© {img.name || 'Unknown'}; William Cummings</Text>
    </TouchableOpacity>
  );

  const renderModal = () => {
    if (!previewMember) return null;
    const images = previewMember.images?.length ? previewMember.images : [{ uri: previewMember.image }];
    return (
      <TouchableOpacity style={styles.modalOuter} activeOpacity={1} onPress={() => setPreviewMember(null)}>
        <View style={styles.imageContainer}>
          <ScrollView horizontal contentContainerStyle={styles.imageScroll} showsHorizontalScrollIndicator={false}>
            {images.map((img, i) => renderPreviewCard({ ...img, name: img.name || `Image ${i + 1}` }))}
          </ScrollView>
        </View>
        <View style={styles.previewAboutSection}>
          <Text style={styles.previewCodename}>{previewMember.codename || 'N/A'}</Text>
          <Text style={styles.previewName}>{previewMember.name}</Text>
          <Text style={styles.previewDescription}>
            {descriptions[previewMember.name] || 'No description available'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground source={require('../../assets/BackGround/Cobros.jpg')} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Cobros 314</Text>
          <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
            <Text style={styles.chatText}>🛡️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.musicControls}>
          <TouchableOpacity style={styles.musicButton} onPress={playTheme}>
            <Text style={styles.musicButtonText}>Theme</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.musicButton} onPress={pauseTheme}>
            <Text style={styles.musicButtonText}>Pause</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {renderGrid()}
        </ScrollView>

        <Modal visible={!!previewMember} transparent animationType="fade" onRequestClose={() => setPreviewMember(null)}>
          <View style={styles.modalBackground}>{renderModal()}</View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { width: '100%', height: '100%' },
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center' },

  headerWrapper: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingTop: 10 },
  backButton: { padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
  backText: { fontSize: 18, color: '#00b3ff', fontWeight: 'bold' },
  header: { fontSize: 32, fontWeight: 'bold', color: '#7d1a1a', textAlign: 'center', flex: 1, textShadowColor: '#e0cd22', textShadowRadius: 40 },
  chatButton: { padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
  chatText: { fontSize: 28, color: '#fff' },

  musicControls: { flexDirection: 'row', justifyContent: 'center', marginVertical: 15, gap: 20 },
  musicButton: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: 'rgba(230,57,70,0.5)', borderRadius: 10, borderWidth: 2, borderColor: '#e63946' },
  musicButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },

  scrollContainer: { paddingBottom: 60, alignItems: 'center' },
  row: { flexDirection: 'row', justifyContent: 'center' },

  card: { borderRadius: 12, overflow: 'hidden', position: 'relative' },
  disabledCard: { opacity: 0.6 },
  characterImage: { width: '100%', height: '100%' },

  textWrapper: { position: 'absolute', bottom: 8, left: 8, right: 8, padding: 4 },

  codename: { fontWeight: 'bold', color: '#e63946', textShadowColor: '#e63946', textShadowRadius: 14, zIndex: 2 },
  name: { color: '#fff', textShadowColor: '#e63946', textShadowRadius: 14, zIndex: 2 },

  codenameDesktop: { position: 'absolute', bottom: 12, left: 10, fontSize: 14 },
  nameDesktop:    { position: 'absolute', bottom: 34, left: 10, fontSize: 12 },

  codenameMobile: { fontSize: 12, lineHeight: 16, textAlign: 'left' },
  nameMobile:     { fontSize: 11, marginBottom: 2, textAlign: 'left' },

  modalBackground: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' },
  modalOuter: { width: '90%', height: '80%', backgroundColor: '#111', borderRadius: 20, overflow: 'hidden' },
  imageContainer: { flex: 1, paddingLeft: 20 },
  imageScroll: { alignItems: 'center' },
  previewCard: (desktop) => ({
    width: desktop ? SCREEN_WIDTH * 0.2 : SCREEN_WIDTH * 0.8,
    height: desktop ? SCREEN_HEIGHT * 0.7 : SCREEN_HEIGHT * 0.6,
    marginRight: 20,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.7)',
  }),
  clickable: { borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)' },
  previewImage: { width: '100%', height: '100%' },
  cardName: { position: 'absolute', bottom: 10, left: 10, color: '#fff', fontWeight: 'bold', fontSize: 16 },
  previewAboutSection: { padding: 20, backgroundColor: '#222', borderRadius: 20 },
  previewCodename: { fontSize: 22, fontWeight: 'bold', color: '#00b3ff', textAlign: 'center' },
  previewName: { fontSize: 18, color: '#fff', textAlign: 'center', marginTop: 8 },
  previewDescription: { fontSize: 15, color: '#aaa', textAlign: 'center', marginTop: 10 },
});

export default CobrosScreen;