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
import { useNavigation } from '@react-navigation/native';
import { Audio } from 'expo-av'; // Import expo-av for audio

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
  const [sound, setSound] = useState(null); // State to manage audio object

  useEffect(() => {
    // Load and play background music
    async function loadSound() {
      console.log('Loading Sound at:', new Date().toISOString());
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/audio/JusticeGang.mp4'), // Replace with your audio file path
        { shouldPlay: true, isLooping: false }
      );
      setSound(sound);
      console.log('Playing Sound at:', new Date().toISOString());
      await sound.playAsync();
    }
    loadSound();

    return () => {
      if (sound) {
        console.log('Unloading Sound at:', new Date().toISOString());
        sound.unloadAsync();
      }
    };
  }, []);

  const goToChat = () => {
    if (sound) {
      sound.stopAsync();
      sound.unloadAsync();
    }
    navigation.navigate('ASTC');
  };

  const handleMemberPress = (member) => {
    if (member.clickable) {
      if (member.screen) {
        navigation.navigate(member.screen); // Navigate to the defined screen if it exists
      } else {
        setPreviewMember(member); // Show modal if no screen is defined
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
      onPress={() => setPreviewMember(null)} // Close modal on card press
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
        {/* Header & Back Button */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={() => {
            if (sound) {
              sound.stopAsync();
              sound.unloadAsync();
            }
            navigation.goBack();
          }}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Cobros</Text>
          <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
            <Image
              source={require('../../assets/BackGround/26.jpg')}
              style={styles.chatImage}
            />
          </TouchableOpacity>
        </View>

        {/* Grid Layout */}
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
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1,
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
    padding: 5,
    // backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    color: '#7d1a1a',
    textAlign: 'center',
    textShadowColor: '#e0cd22', 
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 40,
    flex: 1,
  },
  chatButton: {
    padding: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
  },
  chatImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  scrollContainer: {
    paddingBottom: 20,
    flexGrow: 1,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#1c1c1c',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 5,
    shadowColor: 'rgba(82, 17, 17, 1)',
    shadowOpacity: 1.5,
    shadowRadius: 20,
    elevation: 5,
  },
  disabledCard: {
    shadowColor: 'transparent',
    backgroundColor: '#444',
  },
  characterImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
  },
  codename: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  name: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#aaa',
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOuterContainer: {
    width: '90%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    paddingVertical: 20,
    backgroundColor: '#111',
    alignItems: 'center',
    paddingLeft: 20,
  },
  imageScrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewCard: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.2 : SCREEN_WIDTH * 0.8,
    height: isDesktop ? SCREEN_HEIGHT * 0.7 : SCREEN_HEIGHT * 0.6,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    marginRight: 20,
  }),
  clickable: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardName: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  previewAboutSection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#222',
    borderRadius: 10,
    width: '100%',
  },
  previewCodename: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00b3ff',
    textAlign: 'center',
  },
  previewName: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default PowerCobros;