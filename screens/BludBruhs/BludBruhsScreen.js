import React, { useState, useEffect, useCallback } from 'react';
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
  Modal,
} from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const isDesktop = SCREEN_WIDTH > 600;
const cardSize = isDesktop ? 160 : 100;
const cardSpacing = isDesktop ? 25 : 10;

const scrollableMembersBase = [
  { id: 'sam', name: 'Sam', codename: 'Void Walker', screen: 'Sam', clickable: true, image: require('../../assets/Armor/SamVoidWalker.jpg') },
  { id: 'cole', name: 'Cole', codename: 'Cruiser', screen: 'Cole', clickable: true, image: require('../../assets/Armor/ColeR.jpg') },
  {
    id: 'taylor',
    name: 'Taylor',
    codename: 'Stellar',
    screen: '',
    clickable: true,
    posterImage: require('../../assets/Armor/Taylor.jpg'),
    images: [
      require('../../assets/Armor/Taylor.jpg'),
      require('../../assets/Armor/PlaceHolder.jpg'),
    ],
    description: 'A star that burns brighter than the rest. Her presence commands silence, her will bends reality.',
  },
  { id: 'james', name: 'James', codename: 'Shadowmind', screen: 'JamesBb', clickable: true, image: require('../../assets/Armor/JamesBb.jpg') },
  { id: 'tanner', name: 'Tanner', codename: 'Wolff', screen: 'TannerBb', clickable: true, image: require('../../assets/Armor/TannerBb.jpg') },
  {
    id: 'adin',
    name: 'Adin',
    codename: 'Aotearoa',
    screen: '',
    clickable: true,
    posterImage: require('../../assets/Armor/Adin.jpg'),
    images: [
      require('../../assets/Armor/Adin.jpg'),
      require('../../assets/Armor/PlaceHolder.jpg'),
    ],
    description: 'Born under the southern cross. Guardian of forgotten oaths. His footsteps shake the earth.',
  },
  {
    id: 'justin',
    name: 'Justin Platt',
    codename: 'Echo Wood',
    screen: '',
    clickable: true,
    posterImage: require('../../assets/Armor/Justin2.jpg'),
    images: [
      require('../../assets/Armor/Justin2.jpg'),
      require('../../assets/Armor/PlaceHolder.jpg'),
    ],
    description: 'Echo Wood — the voice that lingers in the forest long after he’s gone.',
  },
  {
    id: 'zack',
    name: 'Zack Dustin',
    codename: 'Carved Echo',
    screen: '',
    clickable: true,
    posterImage: require('../../assets/Armor/Zack2_cleanup.jpg'),
    images: [
      require('../../assets/Armor/Zack2_cleanup.jpg'),
      require('../../assets/Armor/PlaceHolder.jpg'),
    ],
    description: 'Carved Echo — a soul etched into the world itself.',
  },
  { id: 'joseph', name: 'Joseph', codename: 'Technoman', screen: 'JosephD', clickable: true, image: require('../../assets/Armor/JosephD.jpg') },
  { id: 'thunder', name: 'Thunder Born', codename: 'Rolling Thunder', screen: 'RollingThunderScreen', clickable: true, image: require('../../assets/BackGround/RollingThunder.jpg') },
];

const fixedMembers = [
  { id: 'ranger', name: '', codename: 'Ranger Squad', screen: 'RangerSquad', clickable: true, image: require('../../assets/BackGround/RangerSquad.jpg') },
  { id: 'montrose', name: '', codename: 'Montrose Manor', screen: 'MontroseManorTab', clickable: true, image: require('../../assets/TheMontroseManor.jpg') },
  { id: 'monke', name: '', codename: 'Monke Alliance', screen: 'MonkeAllianceScreen', clickable: true, image: require('../../assets/BackGround/Monke.jpg') },
];

const BludBruhsScreen = ({ route }) => {
  const navigation = useNavigation();
  const [currentSound, setCurrentSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isYourUniverse, setIsYourUniverse] = useState(route.params?.isYourUniverse ?? true);

  useEffect(() => {
    const load = async () => {
      try {
        const saved = await AsyncStorage.getItem('selectedUniverse');
        setIsYourUniverse(saved ? saved === 'your' : route.params?.isYourUniverse ?? true);
      } catch (e) {}
    };
    load();
  }, []);

  const getJoseph = () => {
    if (isYourUniverse) return { id: 'joseph', name: 'Joseph', codename: 'Technoman', screen: 'JosephD', clickable: true, image: require('../../assets/Armor/JosephD.jpg') };
    const r = Math.random();
    if (r < 0.02) return { id: 'joseph', name: 'Joseph', codename: 'The Betrayer', screen: 'JosephD', clickable: false, image: require('../../assets/Armor/JosephD4.jpg') };
    if (r < 0.51) return { id: 'joseph', name: 'Joseph', codename: 'The Betrayer', screen: 'JosephD', clickable: false, image: require('../../assets/Armor/JosephD2.jpg') };
    return { id: 'joseph', name: 'Joseph', codename: 'The Betrayer', screen: 'JosephD', clickable: false, image: require('../../assets/Armor/JosephD3.jpg') };
  };

  const finalMembers = scrollableMembersBase
    .filter(m => isYourUniverse ? !['Justin Platt', 'Zack Dustin'].includes(m.name) : true)
    .map(m => m.name === 'Joseph' ? getJoseph() : m);

  const killMusic = async () => {
    if (currentSound) {
      try { await currentSound.stopAsync(); } catch {}
      try { await currentSound.unloadAsync(); } catch {}
      setCurrentSound(null);
      setIsPlaying(false);
    }
  };

  useFocusEffect(useCallback(() => () => killMusic(), [currentSound]));

  const playTheme = async () => {
    if (currentSound) { await currentSound.playAsync(); setIsPlaying(true); return; }
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/audio/ThunderBorn.m4a'),
        { shouldPlay: true, isLooping: true, volume: 1.0 }
      );
      setCurrentSound(sound);
      setIsPlaying(true);
    } catch (e) {
      console.log('ThunderBorn theme failed (web is fine)');
    }
  };

  const pauseTheme = async () => {
    if (currentSound) await currentSound.pauseAsync();
    setIsPlaying(false);
  };

  const handleMemberPress = async (member) => {
    if (!member.clickable) return;
    await killMusic();

    if (member.screen && member.screen !== '') {
      navigation.navigate(member.screen, { isYourUniverse });
    } else {
      navigation.navigate('CharacterDetailScreen', {
        member: {
          ...member,
          images: member.images || (member.image ? [member.image] : [require('../../assets/Armor/PlaceHolder.jpg')]),
          universe: isYourUniverse ? 'thunderborn' : 'shattered',
        },
      });
    }
  };

  const renderMemberCard = (member) => {
    const cardImage = member.posterImage 
      || (member.images ? member.images[0] : null)
      || member.image 
      || require('../../assets/Armor/PlaceHolder.jpg');

    return (
      <TouchableOpacity
        key={member.id}
        style={[
          styles.card,
          { width: cardSize, height: cardSize * 1.6 },
          !member.clickable && styles.disabledCard,
          {
            borderWidth: 2,
            borderColor: isYourUniverse ? '#00b3ff' : '#800080',
            backgroundColor: isYourUniverse ? 'rgba(0, 179, 255, 0.1)' : 'rgba(128, 0, 128, 0.1)',
            shadowColor: isYourUniverse ? '#00b3ff' : '#800080',
            shadowOpacity: 0.8,
            shadowRadius: 10,
            elevation: 5,
          },
        ]}
        onPress={() => handleMemberPress(member)}
        disabled={!member.clickable}
      >
        <Image source={cardImage} style={styles.characterImage} resizeMode="cover" />
        <View style={styles.transparentOverlay} />

        <View style={styles.textWrapper}>
          {member.name ? (
            <Text style={[
              styles.name,
              isYourUniverse ? { color: '#fff', textShadowColor: '#00b3ff' } : { color: '#ddd', textShadowColor: '#800080' },
              isDesktop ? styles.nameDesktop : styles.nameMobile
            ]}>
              {member.name}
            </Text>
          ) : null}
          {member.codename && (
            <Text style={[
              styles.codename,
              isYourUniverse ? { color: '#00b3ff', textShadowColor: '#00b3ff' } : { color: '#df45df', textShadowColor: '#800080' },
              isDesktop ? styles.codenameDesktop : styles.codenameMobile
            ]} numberOfLines={isDesktop ? 1 : 3}>
              {member.codename}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const rows = [];
  const initialScrollable = finalMembers.slice(0, 9);
  for (let i = 0; i < Math.ceil(initialScrollable.length / 3); i++) {
    rows.push(initialScrollable.slice(i * 3, (i + 1) * 3));
  }
  const additionalScrollable = finalMembers.slice(9);
  for (let i = 0; i < Math.ceil(additionalScrollable.length / 3); i++) {
    rows.push(additionalScrollable.slice(i * 3, (i + 1) * 3));
  }

  return (
    <ImageBackground source={require('../../assets/BackGround/Bludbruh2.jpg')} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={() => { killMusic(); navigation.navigate('Home'); }}>
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <Text style={[styles.header, {
            color: '#00FFFF',
            textShadowColor: '#fffb00',
            textShadowOffset: { width: 1, height: 2 },
            textShadowRadius: 20
          }]}>
            {isYourUniverse ? 'Thunder Born' : 'Shattered Realm:\n    Thunder Born'}
          </Text>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => navigation.navigate('TeamChat')} style={styles.chatButton}>
              <Text style={[styles.chatText, { color: isYourUniverse ? '#00b3ff' : '#800080' }]}>🛡️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('AddMember')} style={styles.plusButton}>
              <Text style={[styles.plusText, { color: isYourUniverse ? '#00b3ff' : '#800080' }]}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.musicControls}>
          <TouchableOpacity style={styles.musicButton} onPress={playTheme}>
            <Text style={[styles.musicButtonText, { color: isYourUniverse ? '#00b3ff' : '#800080' }]}>Theme</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.musicButton} onPress={pauseTheme}>
            <Text style={[styles.musicButtonText, { color: isYourUniverse ? '#00b3ff' : '#800080' }]}>Pause</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={[styles.grid, { gap: cardSpacing }]}>
            {rows.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={[styles.row, { gap: cardSpacing }]}>
                {row.map(renderMemberCard)}
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={[styles.fixedRow, { gap: cardSpacing }]}>
          {fixedMembers.map(renderMemberCard)}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
  container: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  headerWrapper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingTop: 10, backgroundColor: 'rgba(0,0,0,0.56)' },
  backButton: { padding: 10 },
  backText: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center' },
  headerRight: { flexDirection: 'row' },
  chatButton: { padding: 10 },
  chatText: { fontSize: 20 },
  plusButton: { padding: 10 },
  plusText: { fontSize: 24, fontWeight: 'bold' },
  musicControls: { flexDirection: 'row', justifyContent: 'center', marginVertical: 5 },
  musicButton: { padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, marginHorizontal: 10 },
  musicButtonText: { fontSize: 12, fontWeight: 'bold' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 10 },
  grid: { flexDirection: 'column', alignItems: 'center' },
  row: { flexDirection: 'row', justifyContent: 'center' },
  fixedRow: { flexDirection: 'row', justifyContent: 'center', paddingVertical: 10, backgroundColor: 'rgba(0,0,0,0.4)' },
  card: { borderRadius: 10, overflow: 'hidden' },
  disabledCard: { opacity: 0.7 },
  characterImage: { width: '100%', height: '100%' },
  transparentOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
  textWrapper: { position: 'absolute', bottom: 8, left: 8, right: 8 },
  name: { fontSize: 11, fontWeight: 'bold', textShadowRadius: 10 },
  codename: { fontSize: 12, fontWeight: 'bold', textShadowRadius: 10 },
  nameDesktop: { bottom: 25, left: 5 },
  codenameDesktop: { bottom: 10, left: 5 },
  nameMobile: { marginBottom: 2 },
  codenameMobile: { lineHeight: 16 },
});

export default BludBruhsScreen;