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
  { name: 'Zeke', codename: 'Enderstrike', screen: 'Zeke', clickable: true, image: require('../../../assets/Armor/ZekePlaceHolder.jpg') },
  { name: 'Elijah Potter', codename: 'Chaos Wither', screen: 'Elijah', clickable: true, image: require('../../../assets/Armor/ElijahPlaceHolder.jpg') },
  { name: 'Tom C', codename: 'Thunder Whisperer', screen: 'TomBb', clickable: true, image: require('../../../assets/Armor/TomCPlaceHolder.jpg') },
  { name: 'Ammon T', codename: 'Quick Wit', screen: 'AmmonT', clickable: true, image: require('../../../assets/Armor/AmmonTPlaceHolder.jpg') },
  { name: 'Eli C', codename: 'Shawdow Hunter', screen: 'Eli', clickable: true, image: require('../../../assets/Armor/EliPlaceHolder.jpg') },
  { name: 'Ethan T', codename: 'Bolt Watcher', screen: 'EthanT', clickable: true, image: require('../../../assets/Armor/EthanPlaceHolder.jpg') },
  { name: 'Alex M', codename: 'Swiftmind', screen: 'AlexM', clickable: true, image: require('../../../assets/Armor/AlexMPlaceHolder.jpg') },
  { name: 'Damon', codename: 'Pixel Maverick', screen: 'Damon', clickable: true, image: require('../../../assets/Armor/DamonPlaceHolder_cleanup.jpg') },
  { name: '', codename: 'Lumiel', screen: 'LumielScreen', clickable: true, image: require('../../../assets/Armor/LumielPhantom.jpg')  },
  { name: 'MIA', codename: '', screen: '', clickable: false },
];

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;
const columns = isDesktop ? 5 : 3; 
const rows = Math.ceil(members.length / columns);
const cardSize = isDesktop ? 160 : 100;
const cardHeightMultiplier = 1.6;
const horizontalSpacing = isDesktop ? 40 : 10;
const verticalSpacing = isDesktop ? 50 : 20;

export const MonkeAllianceScreen = () => {
  const navigation = useNavigation();

  const goToChat = () => {
    navigation.navigate('TeamChat');
  };

  return (
    <ImageBackground source={require('../../../assets/BackGround/Monke.jpg')} style={styles.background}>
      <SafeAreaView style={styles.container}>
        {/* Header & Back Button */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Monke Alliance</Text>
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

                if (!member) return <View key={colIndex} style={{ width: cardSize, height: cardSize * cardHeightMultiplier }} />;

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
                          source={member.image || require('../../../assets/Armor/PlaceHolder.jpg')} 
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
    width: SCREEN_WIDTH,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1, // Ensures overlay blocks long-press without affecting button clicks
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
    width: SCREEN_WIDTH,
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

export default MonkeAllianceScreen;
