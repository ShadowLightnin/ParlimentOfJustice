import React, { useState, useCallback } from 'react';
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
import { Audio } from 'expo-av';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const isDesktop = SCREEN_WIDTH > 600;
const cardSize = isDesktop ? 160 : 100;
const cardSpacing = isDesktop ? 25 : 10;

const members = [
  { id: 'zeke', name: 'Zeke', codename: 'Enderstrike', screen: 'Zeke', clickable: true, image: require('../../../assets/Armor/Zeke.jpg') },
  { id: 'elijah', name: 'Elijah Potter', codename: 'Chaos Wither', screen: 'Elijah', clickable: true, image: require('../../../assets/Armor/Elijah.jpg') },
  { id: 'tom', name: 'Tom C', codename: 'Thunder Whisperer', screen: 'TomBb', clickable: true, image: require('../../../assets/Armor/TomC3_cleanup.jpg') },
  { id: 'ammon', name: 'Ammon T', codename: 'Quick Wit', screen: 'AmmonT', clickable: true, image: require('../../../assets/Armor/AmmonT.jpg') },
  { id: 'eli', name: 'Eli C', codename: 'Shadow Hunter', screen: 'Eli', clickable: true, image: require('../../../assets/Armor/Eli.jpg') },
  { id: 'ethan', name: 'Ethan T', codename: 'Bolt Watcher', screen: 'EthanT', clickable: true, image: require('../../../assets/Armor/Ethan.jpg') },
  { id: 'alex', name: 'Alex M', codename: 'Swiftmind', screen: 'AlexM', clickable: true, image: require('../../../assets/Armor/AlexM.jpg') },
  { id: 'damon', name: 'Damon', codename: 'Pixel Maverick', screen: 'Damon', clickable: true, image: require('../../../assets/Armor/Damon_cleanup.jpg') },

  // MONKE LEGENDS — FULL GALLERY + CUSTOM POSTER IMAGE
  {
    id: 'lauren',
    name: 'Lauren',
    codename: 'Monke Queen',
    screen: '',
    clickable: true,
    posterImage: require('../../../assets/Armor/Lauren.jpg'),
    images: [
      require('../../../assets/Armor/Lauren.jpg'),
      require('../../../assets/Armor/PlaceHolder.jpg'),
    ],
    description: 'She rules the jungle with golden fury and unbreakable grace.',
  },
  {
    id: 'lizzie',
    name: 'Lizzie',
    codename: 'Golden Fury',
    screen: '',
    clickable: true,
    posterImage: require('../../../assets/Armor/LizzieTB.jpg'),
    images: [
      require('../../../assets/Armor/LizzieTB.jpg'),
      require('../../../assets/Armor/PlaceHolder.jpg'),
    ],
    description: 'Her roar shakes the canopy. Her claws carve destiny.',
  },
  {
    id: 'rachel',
    name: 'Rachel',
    codename: 'Vine Sovereign',
    screen: '',
    clickable: true,
    posterImage: require('../../../assets/Armor/RachelTB.jpg'),
    images: [
      require('../../../assets/Armor/RachelTB.jpg'),
      require('../../../assets/Armor/PlaceHolder.jpg'),
    ],
    description: 'The jungle itself bows to her will.',
  },
  {
    id: 'keith',
    name: 'Keith',
    codename: 'Ironback',
    screen: '',
    clickable: true,
    posterImage: require('../../../assets/Armor/Keith.jpg'),
    images: [
      require('../../../assets/Armor/Keith.jpg'),
      require('../../../assets/Armor/PlaceHolder.jpg'),
    ],
    description: 'Unmovable. Unbreakable. The shield of the Alliance.',
  },
  {
    id: 'sandra',
    name: 'Sandra',
    codename: 'Earth Mother',
    screen: '',
    clickable: true,
    posterImage: require('../../../assets/Armor/Sandra.jpg'),
    images: [
      require('../../../assets/Armor/Sandra.jpg'),
      require('../../../assets/Armor/PlaceHolder.jpg'),
    ],
    description: 'She speaks and the jungle listens. Wisdom older than the trees.',
  },
  {
    id: 'shadow',
    name: 'Shadow',
    codename: 'The Silent One',
    screen: '',
    clickable: true,
    posterImage: require('../../../assets/Armor/SamsShadow.jpg'),
    images: [
      require('../../../assets/Armor/SamsShadow.jpg'),
      require('../../../assets/Armor/PlaceHolder.jpg'),
    ],
    description: 'He was never here. But his presence lingers like smoke in the canopy.',
  },
];

const MonkeAllianceScreen = () => {
  const navigation = useNavigation();
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const killMonke = async () => {
    if (currentSound) {
      try { await currentSound.stopAsync(); } catch {}
      try { await currentSound.unloadAsync(); } catch {}
      setCurrentSound(null);
      setIsPlaying(false);
    }
  };

  useFocusEffect(useCallback(() => () => killMonke(), [currentSound]));

  const playTheme = async () => {
    if (currentSound) { await currentSound.playAsync(); setIsPlaying(true); return; }
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../../assets/audio/monke.m4a'),
        { shouldPlay: true, isLooping: true, volume: 1.0 }
      );
      setCurrentSound(sound);
      setIsPlaying(true);
    } catch (e) {
      console.log('Monke theme failed (web is fine):', e);
    }
  };

  const pauseTheme = async () => {
    if (currentSound) await currentSound.pauseAsync();
    setIsPlaying(false);
  };

  const handleMemberPress = async (member) => {
    if (!member.clickable) return;
    await killMonke();

    if (member.screen && member.screen !== '') {
      navigation.navigate(member.screen);
    } else {
      navigation.navigate('CharacterDetailScreen', {
        member: {
          ...member,
          images: member.images || (member.image ? [member.image] : [require('../../../assets/Armor/PlaceHolder.jpg')]),
          universe: 'monke',
        },
      });
    }
  };

  const renderCard = (member) => {
    const cardImage = member.posterImage 
      || (member.images ? member.images[0] : null)
      || member.image 
      || require('../../../assets/Armor/PlaceHolder.jpg');

    return (
      <TouchableOpacity
        key={member.id}
        style={[
          styles.card,
          { width: cardSize, height: cardSize * 1.6 },
          !member.clickable && styles.disabledCard,
        ]}
        onPress={() => handleMemberPress(member)}
        disabled={!member.clickable}
      >
        <Image source={cardImage} style={styles.characterImage} resizeMode="cover" />
        <View style={styles.overlay} />
        <View style={styles.textWrapper}>
          {member.codename ? (
            <Text style={[styles.codename, isDesktop ? styles.codenameDesktop : styles.codenameMobile]}>
              {member.codename}
            </Text>
          ) : null}
          <Text style={[styles.name, isDesktop ? styles.nameDesktop : styles.nameMobile]}>
            {member.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const rows = [];
  for (let i = 0; i < members.length; i += 3) {
    rows.push(members.slice(i, i + 3));
  }

  return (
    <ImageBackground source={require('../../../assets/BackGround/Monke.jpg')} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={() => { killMonke(); navigation.goBack(); }}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Monke Alliance</Text>
          <TouchableOpacity onPress={() => { killMonke(); navigation.navigate('TeamChat'); }} style={styles.chatButton}>
            <Text style={styles.chatText}>🛡️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.musicControls}>
          {!isPlaying ? (
            <TouchableOpacity style={styles.musicButton} onPress={playTheme}>
              <Text style={styles.musicButtonText}>Theme</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.musicButton} onPress={pauseTheme}>
              <Text style={styles.musicButtonText}>Pause</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={[styles.grid, { gap: cardSpacing }]}>
            {rows.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={[styles.row, { gap: cardSpacing }]}>
                {row.map(renderCard)}
                {row.length < 3 && Array(3 - row.length).fill().map((_, k) => (
                  <View key={`empty-${rowIndex}-${k}`} style={{ width: cardSize, height: cardSize * 1.6 }} />
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { width: '100%', height: '100%' },
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  headerWrapper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingTop: 10, backgroundColor: 'rgba(0,0,0,0.6)' },
  backButton: { padding: 10 },
  backText: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  header: { fontSize: 32, fontWeight: 'bold', color: '#8B4513', textShadowColor: '#FFD700', textShadowRadius: 20, flex: 1, textAlign: 'center' },
  chatButton: { padding: 10 },
  chatText: { fontSize: 24 },
  musicControls: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10 },
  musicButton: { paddingHorizontal: 24, paddingVertical: 12, backgroundColor: 'rgba(139,69,19,0.8)', borderRadius: 12, borderWidth: 2, borderColor: '#DAA520' },
  musicButtonText: { color: '#FFD700', fontWeight: 'bold', fontSize: 14 },
  scrollContent: { padding: 10 },
  grid: { flexDirection: 'column', alignItems: 'center' },
  row: { flexDirection: 'row', justifyContent: 'center' },
  card: { borderRadius: 12, overflow: 'hidden', borderWidth: 3, borderColor: '#DAA520', shadowColor: '#FFD700', shadowOpacity: 1, shadowRadius: 15, elevation: 12 },
  disabledCard: { opacity: 0.6 },
  characterImage: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  textWrapper: { position: 'absolute', bottom: 8, left: 8, right: 8 },
  codename: { fontSize: 15, fontWeight: 'bold', color: '#FFD700', textShadowColor: '#8B4513', textShadowRadius: 10 },
  name: { fontSize: 13, color: '#fff', textShadowColor: '#8B4513', textShadowRadius: 10 },
  codenameDesktop: { bottom: 30, left: 6 },
  nameDesktop: { bottom: 10, left: 6 },
  codenameMobile: { marginBottom: 2 },
  nameMobile: { lineHeight: 16 },
});

export default MonkeAllianceScreen;