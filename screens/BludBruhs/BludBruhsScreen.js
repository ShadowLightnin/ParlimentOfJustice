import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const members = [
  { name: 'Sam', codename: 'Void Walker', screen: 'Sam', clickable: true, position: [0, 0], image: require('../../assets/Armor/SamPlaceHolder.jpg') },
  { name: 'Taylor', codename: '', screen: '', clickable: false, position: [0, 1], image: require('../../assets/Armor/PlaceHolder.jpg') },
  { name: 'Cole', codename: 'Cruiser', screen: 'Cole', clickable: true, position: [0, 2], image: require('../../assets/Armor/ColePlaceHolder.jpg') },
  { name: 'Joseph', codename: 'Technoman', screen: 'JosephD', clickable: true, position: [1, 0], image: require('../../assets/Armor/JosephDPlaceHolder.jpg') },
  { name: 'James', codename: 'Shadowmind', screen: 'JamesBb', clickable: true, position: [1, 1], image: require('../../assets/Armor/JamesBbPlaceHolder.jpg') },
  { name: 'Tanner', codename: 'Wolff', screen: 'TannerBb', clickable: true, position: [1, 2], image: require('../../assets/Armor/TannerBbPlaceHolder.jpg') },
  { name: '', codename: 'Ranger Squad', screen: 'RangerSquad', clickable: true, position: [2, 0], image: require('../../assets/BackGround/RangerSquad.jpg') },
  { name: ' ', codename: '', screen: 'MontroseManorTab', clickable: true, position: [2, 1], image: require('../../assets/MontroseManorPlaceHolder.jpg') }, // Subtle button
  { name: '', codename: 'MonkeAlliance', screen: 'MonkeAllianceScreen', clickable: true, position: [2, 2], image: require('../../assets/BackGround/Monke.jpg') },
];

const isEmpty = (row, col) => false; // No empty spots now
const getMemberAtPosition = (row, col) =>
  members.find((member) => member.position[0] === row && member.position[1] === col);

const BludBruhsScreen = () => {
  const navigation = useNavigation();

  const goToChat = () => {
    navigation.navigate('TeamChat');
  };

  const goToHomeScreen = () => {
    console.log("Navigating to HomeScreen from BludBruhsScreen at:", new Date().toISOString());
    navigation.navigate('Home');
  };

  const isDesktop = SCREEN_WIDTH > 600;
  const cardSize = isDesktop ? 160 : 100;
  const cardSpacing = isDesktop ? 25 : 10;

  return (
    <ImageBackground 
      source={require('../../assets/BackGround/Bludbruh2.jpg')} 
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        {/* Header & Back Button */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={goToHomeScreen}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Thunder Born</Text>
          <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
            <Text style={styles.chatText}>🛡️</Text>
          </TouchableOpacity>
        </View>

        {/* Grid Layout */}
        <View style={[styles.grid, { gap: cardSpacing }]}>
          {[0, 1, 2].map((row) => (
            <View key={row} style={[styles.row, { gap: cardSpacing }]}>
              {[0, 1, 2].map((col) => {
                const member = getMemberAtPosition(row, col);
                return (
                  <TouchableOpacity
                    key={col}
                    style={[
                      styles.card,
                      { width: cardSize, height: cardSize * 1.6 },
                      !member?.clickable && styles.disabledCard,
                      member?.name === ' ' && styles.subtleButton,
                    ]}
                    onPress={() => member?.clickable && navigation.navigate(member.screen, { from: 'BludBruhsHome' })}
                    disabled={!member?.clickable}
                  >
                    {member?.image && (
                      <>
                        <Image source={member.image} style={styles.characterImage} />
                        <View style={styles.transparentOverlay} />
                      </>
                    )}
                    <Text style={styles.codename}>{member?.codename || ''}</Text>
                    <Text style={styles.name}>{member?.name || ''}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', 
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1,
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#00FFFF',
    textAlign: 'center',
    textShadowColor: '#fffb00', // Electric cyan glow
    textShadowOffset: { width: 1, height: 2 }, // Centered glow
    textShadowRadius: 20, // Stronger glow effect
    flex: 1,
  },
  chatButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
  },
  chatText: {
    fontSize: 20,
    color: '#00b3ff',
  },
  grid: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  card: {
    backgroundColor: '#1c1c1c',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: '#00FFFF',
    shadowOpacity: 1.5,
    shadowRadius: 10,
    elevation: 5,
    padding: 5,
  },
  subtleButton: {
    backgroundColor: '#2a2a2a00', // Transparent subtle button
    shadowColor: '#444',
    shadowOpacity: 0.1,
    elevation: 2,
    opacity: 0.2,
  },
  characterImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  name: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#aaa',
    textAlign: 'center',
  },
  codename: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  disabledCard: {
    backgroundColor: '#444',
    shadowColor: 'transparent',
  },
});

export default BludBruhsScreen;