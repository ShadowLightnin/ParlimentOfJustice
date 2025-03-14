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

// Member Data
const members = [
  { name: 'Tanner Despain', codename: '', screen: '', clickable: false },
  { name: 'Wesley Holbrook', codename: '', screen: '', clickable: false },
  { name: 'Josh Larson', codename: '', screen: '', clickable: false },
  { name: 'Ethan Workman', codename: '', screen: '', clickable: false },
  { name: 'Jonah Gray', codename: '', screen: '', clickable: false },
  { name: 'Joseph Slack', codename: '', screen: '', clickable: false },
  { name: 'Jaden Boyer', codename: '', screen: '', clickable: false },
  { name: 'Jonas Boyer', codename: '', screen: '', clickable: false },
  { name: 'Andrew DeDen', codename: '', screen: '', clickable: false },
  { name: 'Jimmy Larson', codename: '', screen: '', clickable: false },
  { name: 'Johnathon Gray', codename: '', screen: '', clickable: false },
  { name: 'Nick Larsen', codename: '', screen: '', clickable: false },
  { name: 'Vanner Johnson', codename: '', screen: '', clickable: false },
  { name: 'Tommy Holbrook', codename: '', screen: '', clickable: false },
  { name: 'Alex Wood', codename: '', screen: '', clickable: false },
  { name: 'Rick Holly', codename: '', screen: '', clickable: false },
  { name: 'Trent Cook', codename: '', screen: '', clickable: false },
  { name: 'Robbie Petersen', codename: '', screen: '', clickable: false },
  { name: 'Micheal', codename: '', screen: '', clickable: false },
  { name: 'Kyle', codename: '', screen: '', clickable: false },
];

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;
const columns = isDesktop ? 5 : 3; 
const rows = isDesktop ? 4 : Math.ceil(members.length / 3);
const cardSize = isDesktop ? 160 : 100;
const cardHeightMultiplier = 1.6;
const horizontalSpacing = isDesktop ? 40 : 10;
const verticalSpacing = isDesktop ? 50 : 20; // Adjust vertical spacing here

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
              style={[
                styles.row, 
                { gap: horizontalSpacing, marginBottom: verticalSpacing }
              ]}
            >
              {Array.from({ length: columns }).map((_, colIndex) => {
                const memberIndex = rowIndex * columns + colIndex;
                const member = members[memberIndex];

                if (!member) return <View key={colIndex} style={{ width: cardSize, height: cardSize * cardHeightMultiplier }} />;

                return (
                  <TouchableOpacity 
                    key={colIndex} 
                    style={[styles.card, { width: cardSize, height: cardSize * cardHeightMultiplier }]} 
                    disabled={!member.clickable}
                  >
                    <Image source={require('../../assets/Armor/DefaultPlaceholder.jpg')} style={styles.characterImage} />
                    <Text style={styles.name}>{member.name}</Text>
                    <Text style={styles.codename}>{member.codename}</Text>
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
  characterImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  name: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  codename: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#aaa',
    textAlign: 'center',
  },
});

export default CobrosScreen;
