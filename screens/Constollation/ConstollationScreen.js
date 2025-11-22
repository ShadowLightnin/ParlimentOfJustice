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
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { memberCategories } from './ConstollationMembers';
import constollationImages from './ConstollationImages';
import ConstollationDescription from './ConstollationDescription';
import { Audio } from 'expo-av';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isDesktop = SCREEN_WIDTH > 600;
const columns = isDesktop ? 6 : 3;
const cardSize = isDesktop ? 160 : 100;
const cardHeightMultiplier = 1.6;
const horizontalSpacing = isDesktop ? 40 : 10;
const verticalSpacing = isDesktop ? 50 : 20;

const background = require('../../assets/BackGround/Constollation.jpg');
// const themeAudio = require('../../assets/audio/CelestialTheme.mp4');

export const ConstollationScreen = () => {
  const navigation = useNavigation();
  const [members, setMembers] = useState(memberCategories);
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // ── AUDIO ─────────────────────────────────────
  const playTheme = async () => {
    if (currentSound) {
      await currentSound.playAsync();
      setIsPlaying(true);
      return;
    }
    try {
      const { sound } = await Audio.Sound.createAsync(themeAudio, {
        shouldPlay: true,
        isLooping: true,
        volume: 0.9,
      });
      setCurrentSound(sound);
      setIsPlaying(true);
    } catch (e) {}
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

  // ── LOAD STARS + FULL MEMBER DATA FOR DETAIL SCREEN ─────────────────────
  useEffect(() => {
    const updated = memberCategories.map(cat => {
      const processed = cat.members.map(m => {
        const imgData = constollationImages[m.name];
        const images = imgData?.images || [{ uri: require('../../assets/Armor/PlaceHolder.jpg') }];
        const description = ConstollationDescription[m.name] || 'A star whose light speaks for itself.';

        return {
          ...m,
          images,
          description,
          clickable: true,
        };
      });

      return { ...cat, members: processed };
    });

    setMembers(updated);
  }, []);

  const goToChat = async () => {
    await stopSound();
    navigation.navigate('TeamChat');
  };

  const handleMemberPress = async (member) => {
    await stopSound();
    navigation.navigate('ConstollationCharacterDetail', { member });
  };

  const renderStar = (member) => {
    if (!member) return <View key={Math.random()} style={styles.cardSpacer} />;

    const primaryImage = member.images?.[0]?.uri || require('../../assets/Armor/PlaceHolder.jpg');

    return (
      <TouchableOpacity
        key={member.name}
        style={styles.card}
        onPress={() => handleMemberPress(member)}
        activeOpacity={0.8}
      >
        <Image source={primaryImage} style={styles.starImage} resizeMode="cover" />

        <View style={styles.textWrapper}>
          <Text style={[styles.name, isDesktop ? styles.nameDesktop : styles.nameMobile]}>
            {member.name}
          </Text>
          {member.codename && (
            <Text style={[styles.codename, isDesktop ? styles.codenameDesktop : styles.codenameMobile]} numberOfLines={3}>
              {member.codename}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground source={background} style={styles.background}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={async () => { await stopSound(); navigation.goBack(); }}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Constollation</Text>
          <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
            <Text style={styles.chatText}>🛡️</Text>
          </TouchableOpacity>
        </View>

        {/* Music */}
        <View style={styles.musicControls}>
          <TouchableOpacity style={styles.musicButton} onPress={playTheme}>
            <Text style={styles.musicButtonText}>Theme</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.musicButton} onPress={pauseTheme}>
            <Text style={styles.musicButtonText}>Pause</Text>
          </TouchableOpacity>
        </View>

        {/* THE STARS — CLICKABLE, GLORIOUS */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {members.map((cat) => {
            const rows = Math.ceil(cat.members.length / columns);
            return (
              <View key={cat.category} style={styles.categorySection}>
                <Text style={styles.categoryHeader}>{cat.category}</Text>
                <View style={styles.divider} />

                {Array.from({ length: rows }).map((_, i) => (
                  <View key={i} style={[styles.row, { gap: horizontalSpacing, marginBottom: verticalSpacing }]}>
                    {Array.from({ length: columns }).map((_, j) => {
                      const member = cat.members[i * columns + j];
                      return <View key={j} style={styles.starWrapper}>{renderStar(member)}</View>;
                    })}
                  </View>
                ))}
              </View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { width: '100%', height: '100%' },
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' },

  headerWrapper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingTop: 10 },
  backButton: { padding: 12, backgroundColor: 'rgba(0,179,255,0.25)', borderRadius: 12, borderWidth: 1, borderColor: '#00b3ff' },
  backText: { fontSize: 18, color: '#00ffff', fontWeight: 'bold' },
  header: { fontSize: 38, fontWeight: '900', color: '#00ffff', textAlign: 'center', flex: 1, textShadowColor: '#00b3ff', textShadowRadius: 20 },
  chatButton: { padding: 12, backgroundColor: 'rgba(0,179,255,0.25)', borderRadius: 12, borderWidth: 1, borderColor: '#00b3ff' },
  chatText: { fontSize: 22, color: '#00ffff', fontWeight: 'bold' },

  musicControls: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginVertical: 15 },
  musicButton: { paddingHorizontal: 28, paddingVertical: 12, backgroundColor: 'rgba(0,179,255,0.3)', borderRadius: 30, borderWidth: 1, borderColor: '#00b3ff' },
  musicButtonText: { color: '#00ffff', fontWeight: 'bold', fontSize: 15 },

  scrollContainer: { paddingBottom: 100, alignItems: 'center' },
  categorySection: { marginBottom: 50, width: '95%' },
  categoryHeader: { fontSize: 30, fontWeight: 'bold', color: '#00ffff', textAlign: 'center', marginBottom: 10, textShadowColor: '#00b3ff', textShadowRadius: 18 },
  divider: { height: 3, backgroundColor: '#00b3ff', marginHorizontal: 40, marginBottom: 20, borderRadius: 2 },
  row: { flexDirection: 'row', justifyContent: 'center' },
  starWrapper: { alignItems: 'center' },

  card: {
    width: cardSize,
    height: cardSize * cardHeightMultiplier,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#00b3ff',
    backgroundColor: 'rgba(0, 179, 255, 0.1)',
    shadowColor: '#00b3ff',
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 15,
  },
  starImage: { width: '100%', height: '100%' },
  textWrapper: { position: 'absolute', bottom: 10, left: 10, right: 10 },
  name: { color: '#ffffff', fontWeight: 'bold', textShadowColor: '#000', textShadowRadius: 10 },
  codename: { color: '#00ffff', fontWeight: 'bold', textShadowColor: '#000', textShadowRadius: 12 },
  nameDesktop: { fontSize: 16 },
  codenameDesktop: { fontSize: 19 },
  nameMobile: { fontSize: 12 },
  codenameMobile: { fontSize: 14 },
  cardSpacer: { width: cardSize, height: cardSize * cardHeightMultiplier },
});

export default ConstollationScreen;