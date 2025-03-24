import React from 'react';
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
import { useNavigation } from '@react-navigation/native';

// Screen dimensions
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// Member Data with Unique Image Paths
const members = [
  { name: 'Tanner Despain', codename: 'Titanium', screen: '', clickable: false, image: require('../../assets/Armor/TannerDPlaceHolder.jpg') },
  { name: 'Wesley Holbrook', codename: 'Warlock', screen: '', clickable: false, image: require('../../assets/Armor/WesleyHPlaceHolder.jpg') },
  { name: 'Josh Larson', codename: 'Juggernaut', screen: '', clickable: false, image: require('../../assets/Armor/JoshLPlaceHolder.jpg') },
  // { name: 'Ethan Workman', codename: '', screen: '', clickable: false, image: require('../../assets/Armor/PlaceHolder.jpg') },
  { name: 'Jonah Gray', codename: 'Echo Song', screen: '', clickable: false, image: require('../../assets/Armor/JonahPlaceHolder.jpg') },
  { name: 'Joseph Slack', codename: 'Caster', screen: '', clickable: false, image: require('../../assets/Armor/JosephSPlaceHolder_cleanup.jpg') },
  { name: 'Jaden Boyer', codename: 'Socialation', screen: '', clickable: false, image: require('../../assets/Armor/JadenPlaceHolder.jpg') },
  { name: 'Jonas Boyer', codename: 'Sports Master', screen: '', clickable: false, image: require('../../assets/Armor/JonasPlaceHolder.jpg') },
  { name: 'Andrew DeDen', codename: 'Loneman', screen: '', clickable: false, image: require('../../assets/Armor/AndrewDPlaceHolder.jpg') },
  { name: 'Jimmy Larson', codename: 'Renaissance', screen: '', clickable: false, image: require('../../assets/Armor/JimmyPlaceHolder.jpg') },
  { name: 'Johnathon Gray', codename: 'Voice Fry', screen: '', clickable: false, image: require('../../assets/Armor/JohnathonPlaceHolder_cleanup.jpg') },
  { name: 'Nick Larsen', codename: 'Iron Quard', screen: '', clickable: false, image: require('../../assets/Armor/NickPlaceHolder.jpg') },
  { name: 'Vanner Johnson', codename: 'Viral', screen: '', clickable: false, image: require('../../assets/Armor/Vanner3PlaceHolder.jpg') },
  { name: 'Tommy Holbrook', codename: 'Swift Shadow', screen: '', clickable: false, image: require('../../assets/Armor/TommyHPlaceHolder.jpg') },
  // { name: 'Alex Wood', codename: 'Vortex Flash', screen: '', clickable: false, image: require('../../assets/Armor/PlaceHolder.jpg') },
  { name: 'Rick Holly', codename: 'Valor Knight', screen: '', clickable: false, image: require('../../assets/Armor/RickPlaceHolder.jpg') },
  { name: 'Trent Cook', codename: 'Captain', screen: '', clickable: false, image: require('../../assets/Armor/TrentPlaceHolder.jpg') },
  { name: 'Robbie Petersen', codename: 'Quickstike', screen: '', clickable: false, image: require('../../assets/Armor/RobbiePlaceHolder.jpg') },
  { name: 'Micheal', codename: 'Guardian Sentinel', screen: '', clickable: false, image: require('../../assets/Armor/MichealPlaceHolder.jpg') },
  // { name: 'Kyle', codename: '', screen: '', clickable: false, image: require('../../assets/Armor/PlaceHolder.jpg') },
];

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;
const columns = isDesktop ? 5 : 3;
const rows = Math.ceil(members.length / columns);
const cardSize = isDesktop ? 160 : 100;
const cardHeightMultiplier = 1.6;
const horizontalSpacing = isDesktop ? 40 : 10;
const verticalSpacing = isDesktop ? 50 : 20;

export const CobrosScreen = () => {
  const navigation = useNavigation();

  const goToChat = () => {
    navigation.navigate('TeamChat');
  };

  return (
    <ImageBackground source={require('../../assets/BackGround/Cobros.jpg')} style={styles.background}>
      <SafeAreaView style={styles.container}>
        {/* Header & Back Button */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Cobros</Text>
          <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
            <Text style={styles.chatText}>🛡️</Text>
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

                return (
                  <TouchableOpacity 
                    key={colIndex} 
                    style={[
                      styles.card, 
                      { width: cardSize, height: cardSize * cardHeightMultiplier },
                      !member.clickable && styles.disabledCard
                    ]}
                    onPress={() => member?.clickable && navigation.navigate(member.screen)}
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
              })}
            </View>
          ))}
        </ScrollView>
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
    zIndex: 1, // Ensures overlay blocks saving but maintains button clicks
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    color: '#fff',
    textAlign: 'center',
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
    shadowColor: '#00b3ff',
    shadowOpacity: 1.5,
    shadowRadius: 10,
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
  disabledText: {
    fontSize: 10,
    color: '#ff4444',
    marginTop: 5,
  },
});

export default CobrosScreen;