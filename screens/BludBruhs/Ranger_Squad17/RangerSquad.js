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
  { name: '', codename: 'Captain Zardo', screen: '', clickable: false, image: require('../../../assets/Armor/Ranger12.jpg') },
  { name: '', codename: '', screen: '', clickable: false, image: require('../../../assets/Armor/Ranger1.jpg') },
  { name: '', codename: '', screen: '', clickable: false, image: require('../../../assets/Armor/Ranger2.jpg') },
  { name: '', codename: '', screen: '', clickable: false, image: require('../../../assets/Armor/Ranger7.jpg') },
  { name: '', codename: '', screen: '', clickable: false, image: require('../../../assets/Armor/Ranger8.jpg') },
  { name: '', codename: '', screen: '', clickable: false, image: require('../../../assets/Armor/Ranger9.jpg') },
  { name: '', codename: '', screen: '', clickable: false, image: require('../../../assets/Armor/Ranger10.jpg') },
  { name: '', codename: '', screen: '', clickable: false, image: require('../../../assets/Armor/Ranger11.jpg') },
  { name: '', codename: '', screen: '', clickable: false, image: require('../../../assets/Armor/Ranger3.jpg') },
  { name: '', codename: '', screen: '', clickable: false, image: require('../../../assets/Armor/Ranger4.jpg') },
  { name: '', codename: '', screen: '', clickable: false, image: require('../../../assets/Armor/Ranger5.jpg') },
  { name: '', codename: '', screen: '', clickable: false, image: require('../../../assets/Armor/Ranger6.jpg') },

];

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;
const columns = isDesktop ? 5 : 3; 
const rows = Math.ceil(members.length / columns);
const cardSize = isDesktop ? 160 : 110;
const cardHeightMultiplier = 2;
const horizontalSpacing = isDesktop ? 40 : 20;
const verticalSpacing = isDesktop ? 50 : 30; // Adjust vertical spacing here

export const RangerSquad = () => {
  const navigation = useNavigation();

  const goToChat = () => {
    navigation.navigate('TeamChat');
  };

  return (
    <ImageBackground source={require('../../../assets/BackGround/RangerSquad.jpg')} style={styles.background}>
      <SafeAreaView style={styles.container}>
        {/* Header & Back Button */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Ranger Squad 17</Text>
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
                    disabled={!member.clickable}
                  >
                    <Image 
                      source={member.image || require('../../../assets/Armor/PlaceHolder.jpg')} 
                      style={styles.characterImage} 
                    />
                    <Text style={styles.codename}>{member.codename}</Text>
                    <Text style={styles.name}>{member.name}</Text>
                    {/* {!member.clickable && <Text style={styles.disabledText}>Not Clickable</Text>} */}
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
  disabledCard: {
    shadowColor: 'transparent',
    backgroundColor: '#444',
  },
  characterImage: {
    width: '100%',
    height: '86%',
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
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
  disabledText: {
    fontSize: 10,
    color: '#ff4444',
    marginTop: 5,
  },
});

export default RangerSquad;
