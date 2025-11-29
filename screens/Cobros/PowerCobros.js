import React, { useState, useEffect } from 'react';
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
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Audio } from 'expo-av';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const members = [
  { name: 'Tanner Despain', codename: 'Titanium', screen: '', clickable: true, image: require('../../assets/Armor/TannerD.jpg') },
  { name: 'Ethan Workman', codename: 'Schriker', screen: '', clickable: true, image: require('../../assets/Armor/EthanW.jpg') },
  { name: 'Wesley Holbrook', codename: 'Warlock', screen: '', clickable: true, image: require('../../assets/Armor/WesleyH.jpg') },
  { name: 'Josh Larson', codename: 'Juggernaut', screen: '', clickable: true, image: require('../../assets/Armor/JoshL.jpg') },
  { name: 'Jonah Gray', codename: 'Echo Song', screen: '', clickable: true, image: require('../../assets/Armor/Jonah.jpg') },
  { name: 'Joseph Slack', codename: 'Caster', screen: '', clickable: true, image: require('../../assets/Armor/JosephS_cleanup.jpg') },
  { name: 'Jaden Boyer', codename: 'Aether Blaze', screen: '', clickable: true, image: require('../../assets/Armor/Jaden3.jpg') },
  { name: 'Jonas Boyer', codename: 'Sports Master', screen: '', clickable: true, image: require('../../assets/Armor/Jonas3.jpg') },
  { name: 'Andrew DeDen', codename: 'Loneman', screen: '', clickable: true, image: require('../../assets/Armor/AndrewD.jpg') },
  { name: 'Jimmy Larson', codename: 'Renaissance', screen: '', clickable: true, image: require('../../assets/Armor/Jimmy.jpg') },
  { name: 'Johnathon Gray', codename: 'Vocalnought', screen: '', clickable: true, image: require('../../assets/Armor/Johnathon3.jpg') },
  { name: 'Nick Larsen', codename: 'Iron Guard', screen: '', clickable: true, image: require('../../assets/Armor/Nick2.jpg') },
  { name: 'Vanner Johnson', codename: 'Viral', screen: '', clickable: true, image: require('../../assets/Armor/Vanner.jpg') },
  { name: 'Tommy Holbrook', codename: 'Swift Shadow', screen: '', clickable: true, image: require('../../assets/Armor/TommyH.jpg') },
  { name: 'Alex Wood', codename: 'Vortex Flash', screen: '', clickable: true, image: require('../../assets/Armor/AlexW.jpg') },
  { name: 'Rick Holly', codename: 'Valor Knight', screen: '', clickable: true, image: require('../../assets/Armor/Rick.jpg') },
  { name: 'Trent Cook', codename: 'Captain', screen: '', clickable: true, image: require('../../assets/Armor/Trent.jpg') },
  { name: 'Robbie Petersen', codename: 'Quickstike', screen: '', clickable: true, image: require('../../assets/Armor/Robbie.jpg') },
  { name: 'Micheal', codename: 'Guardian Sentinel', screen: '', clickable: true, image: require('../../assets/Armor/Micheal.jpg') },
  { name: 'Kyle', codename: 'Jugridge', screen: '', clickable: true, image: require('../../assets/Armor/KyleP.jpg') },
];

const isDesktop = SCREEN_WIDTH > 600;
const columns = isDesktop ? 5 : 3;
const rows = Math.ceil(members.length / columns);
const cardSize = isDesktop ? 160 : 100;
const cardHeightMultiplier = 1.6;
const horizontalSpacing = isDesktop ? 40 : 10;
const verticalSpacing = isDesktop ? 50 : 20;

export const PowerCobros = () => {
  const navigation = useNavigation();
  const [previewMember, setPreviewMember] = useState(null);

  // SACRED JUSTICE GANG THEME — NOW ON DEMAND
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load sound once
  useEffect(() => {
    let isMounted = true;
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../../assets/audio/JusticeGang.mp4'),
          { isLooping: true, volume: 0.9 }
        );
        if (isMounted) setSound(sound);
      } catch (error) {
        console.error('Failed to load JusticeGang.mp4:', error);
      }
    };
    loadSound();

    return () => {
      isMounted = false;
      sound?.unloadAsync();
    };
  }, []);

  // Stop music when screen loses focus
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        if (sound && isPlaying) {
          sound.stopAsync();
          setIsPlaying(false);
        }
      };
    }, [sound, isPlaying])
  );

  const playTheme = async () => {
    if (!sound) return;
    await sound.playAsync();
    setIsPlaying(true);
  };

  const pauseTheme = async () => {
    if (!sound || !isPlaying) return;
    await sound.pauseAsync();
    setIsPlaying(false);
  };

  const stopAndUnload = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setIsPlaying(false);
    }
  };

  const goToChat = async () => {
    await stopAndUnload();
    navigation.navigate('ASTC');
  };

  const handleBack = async () => {
    await stopAndUnload();
    navigation.goBack();
  };

  const handleMemberPress = (member) => {
    if (member.clickable) {
      if (member.screen) {
        stopAndUnload();
        navigation.navigate(member.screen);
      } else {
        setPreviewMember(member);
      }
    }
  };

  const renderMemberCard = (member) => (
    <TouchableOpacity 
      key={member.name} 
      style={[
        styles.card, 
        { width: cardSize, height: cardSize * cardHeightMultiplier },
        !member.clickable && styles.disabledCard
      ]}
      onPress={() => handleMemberPress(member)}
      disabled={!member.clickable}
    >
      {member?.image && (
        <>
          <Image 
            source={member.image || require('../../assets/Armor/PlaceHolder.jpg')} 
            style={styles.characterImage} 
          />
          <View style={styles.transparentOverlay} />
        </>
      )}
      <Text style={styles.codename}>{member.codename}</Text>
      <Text style={styles.name}>{member.name}</Text>
    </TouchableOpacity>
  );

  const renderPreviewCard = (member) => (
    <TouchableOpacity
      key={member.name}
      style={[styles.previewCard(isDesktop, SCREEN_WIDTH), styles.clickable]}
      onPress={() => setPreviewMember(null)}
    >
      <Image
        source={member.image || require('../../assets/Armor/PlaceHolder.jpg')}
        style={styles.previewImage}
        resizeMode="cover"
      />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {member.codename || 'Unknown'}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={require('../../assets/BackGround/Cobros.jpg')} style={styles.background}>
      <SafeAreaView style={styles.container}>

        {/* Header with Back & Chat */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Cobros</Text>
          <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
            <Image source={require('../../assets/BackGround/ASTC.jpg')} style={styles.chatImage} />
          </TouchableOpacity>
        </View>

        {/* DOOM-STYLE MUSIC CONTROLS — UNDER TITLE, NO OVERLAP */}
        <View style={styles.musicControls}>
          <TouchableOpacity 
            style={[styles.musicButton, isPlaying && styles.musicButtonActive]} 
            onPress={playTheme} 
            disabled={isPlaying}
          >
            <Text style={styles.musicButtonText}>Theme</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.musicButton, !isPlaying && styles.musicButtonActive]} 
            onPress={pauseTheme} 
            disabled={!isPlaying}
          >
            <Text style={styles.musicButtonText}>Pause</Text>
          </TouchableOpacity>
        </View>

        {/* Member Grid */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <View 
              key={rowIndex} 
              style={[styles.row, { gap: horizontalSpacing, marginBottom: verticalSpacing }]}
            >
              {Array.from({ length: columns }).map((_, colIndex) => {
                const memberIndex = rowIndex * columns + colIndex;
                const member = members[memberIndex];

                if (!member) return (
                  <View 
                    key={colIndex} 
                    style={{ width: cardSize, height: cardSize * cardHeightMultiplier }} 
                  />
                );

                return renderMemberCard(member);
              })}
            </View>
          ))}
        </ScrollView>

        {/* Preview Modal */}
        <Modal
          visible={!!previewMember}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setPreviewMember(null)}
        >
          <View style={styles.modalBackground}>
            <TouchableOpacity
              style={styles.modalOuterContainer}
              activeOpacity={1}
              onPress={() => setPreviewMember(null)}
            >
              <View style={styles.imageContainer}>
                <ScrollView
                  horizontal
                  contentContainerStyle={styles.imageScrollContainer}
                  showsHorizontalScrollIndicator={false}
                  snapToAlignment="center"
                  snapToInterval={SCREEN_WIDTH * 0.7 + 20}
                  decelerationRate="fast"
                  centerContent={true}
                >
                  {previewMember && renderPreviewCard(previewMember)}
                </ScrollView>
              </View>
              <View style={styles.previewAboutSection}>
                <Text style={styles.previewCodename}>{previewMember?.codename || 'N/A'}</Text>
                <Text style={styles.previewName}> {previewMember?.name || 'Unknown'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { width: '100%', height: '100%' },
  container: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)' },
  transparentOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0)', zIndex: 1 },

  headerWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  backButton: { padding: 10, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 8 },
  backText: { fontSize: 18, color: '#00b3ff', fontWeight: 'bold' },
  header: { fontSize: 32, fontWeight: 'bold', color: '#7d1a1a', textAlign: 'center', flex: 1, textShadowColor: '#e0cd22', textShadowRadius: 40 },
  chatButton: { padding: 5, backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 5 },
  chatImage: { width: 60, height: 60, resizeMode: 'contain' },

  // DOOM-STYLE MUSIC BAR — BLOOD RED, GOTHIC, IMMORTAL
  musicControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    marginVertical: 16,
    // backgroundColor: 'rgba(50, 0, 0, 0.97)',
    // borderWidth: 2,
    // borderColor: '#8B0000',
    // borderRadius: 12,
    alignSelf: 'center',
    // shadowColor: '#8B0000',
    // shadowOffset: { width: 0, height: 6 },
    // shadowOpacity: 1,
    // shadowRadius: 12,
    elevation: 12,
  },
  musicButton: {
    backgroundColor: 'rgba(139, 0, 0, 0.9)',
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: '#DC143C',
  },
  musicButtonActive: {
    backgroundColor: 'rgba(200, 0, 0, 0.95)',
    shadowColor: '#FF0000',
    shadowOpacity: 1,
    elevation: 15,
  },
  musicButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    textShadowColor: '#8B0000',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  scrollContainer: { paddingBottom: 60, alignItems: 'center' },
  row: { flexDirection: 'row', justifyContent: 'center' },
  card: { backgroundColor: '#1c1c1c', justifyContent: 'center', alignItems: 'center', borderRadius: 8, padding: 5, shadowColor: 'rgba(82, 17, 17, 1)', shadowOpacity: 1.5, shadowRadius: 20, elevation: 5 },
  disabledCard: { shadowColor: 'transparent', backgroundColor: '#444' },
  characterImage: { width: '100%', height: '70%', resizeMode: 'cover' },
  codename: { fontSize: 12, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginTop: 5 },
  name: { fontSize: 10, fontStyle: 'italic', color: '#aaa', textAlign: 'center' },

  modalBackground: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center' },
  modalOuterContainer: { width: '90%', height: '80%', justifyContent: 'center', alignItems: 'center' },
  imageContainer: { width: '100%', paddingVertical: 20, backgroundColor: '#111', alignItems: 'center', paddingLeft: 20 },
  imageScrollContainer: { flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center' },
  previewCard: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.2 : SCREEN_WIDTH * 0.8,
    height: isDesktop ? SCREEN_HEIGHT * 0.7 : SCREEN_HEIGHT * 0.6,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    marginRight: 20,
  }),
  clickable: { borderWidth: 2, borderColor: 'rgba(255, 255, 255, 0.1)' },
  previewImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  cardName: { position: 'absolute', bottom: 10, left: 10, fontSize: 16, color: 'white', fontWeight: 'bold' },
  previewAboutSection: { marginTop: 20, padding: 10, backgroundColor: '#222', borderRadius: 10, width: '100%' },
  previewCodename: { fontSize: 18, fontWeight: 'bold', color: '#00b3ff', textAlign: 'center' },
  previewName: { fontSize: 16, color: '#fff', textAlign: 'center', marginTop: 5 },
});

export default PowerCobros;