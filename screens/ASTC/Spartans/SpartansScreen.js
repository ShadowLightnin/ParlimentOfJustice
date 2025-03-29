import React, { useState, useEffect } from 'react';
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
import { useNavigation, useIsFocused } from '@react-navigation/native';

// Screen dimensions
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// Background Images Array
const backgroundImages = [
  require('../../../assets/Halo/26.jpg'),
  require('../../../assets/Halo/26.jpg'),
  require('../../../assets/Halo/5.jpg'),  // Add more images as needed
  require('../../../assets/Halo/9.jpg'),
  require('../../../assets/Halo/9.png'),
  require('../../../assets/Halo/10.jpg'),
  require('../../../assets/Halo/26.jpg'),
  require('../../../assets/Halo/11.jpg'),
  require('../../../assets/Halo/13.jpg'),
  require('../../../assets/Halo/26.jpg'),
  require('../../../assets/Halo/15.jpg'),
  require('../../../assets/Halo/26.jpg'),
  require('../../../assets/Halo/26.jpg'),
  require('../../../assets/Halo/16.jpg'),
  require('../../../assets/Halo/18.jpg'),
  require('../../../assets/Halo/19.jpg'),
  require('../../../assets/Halo/20.png'),
  require('../../../assets/Halo/26.jpg'),
  require('../../../assets/Halo/21.jpg'),
  require('../../../assets/Halo/22.jpg'),
  require('../../../assets/Halo/23.jpg'),
  require('../../../assets/Halo/24.jpg'),
  require('../../../assets/Halo/26.jpg'),
  require('../../../assets/Halo/25.jpg'),
  require('../../../assets/Halo/26.jpg'),
  require('../../../assets/Halo/26.jpg'),
  require('../../../assets/Halo/27.jpg'),
  require('../../../assets/Halo/28.jpg'),
  require('../../../assets/Halo/29.jpg'),
  require('../../../assets/Halo/26.jpg'),
  require('../../../assets/Halo/30.jpg'),
  require('../../../assets/Halo/31.jpg'),
  require('../../../assets/Halo/32.png'),
  require('../../../assets/Halo/33.jpg'),

  // Add additional background image paths here based on your assets
];

// Member Data
const members = [
  { name: 'Cam', codename: '', screen: '', clickable: false, position: [1, 0], image: require('../../../assets/Armor/CamPlaceHolder.jpg') },
  { name: 'Ben', codename: '', screen: '', clickable: false, position: [1, 1], image: require('../../../assets/Armor/BenpPlaceHolder.jpg') },
  { name: 'Alex', codename: '', screen: '', clickable: false, position: [1, 2], image: require('../../../assets/Armor/AlexPlaceHolder.jpg') },
];

// Empty cell checker
const isEmpty = (row, col) =>
  (row === 0 && col === 0) || 
  (row === 0 && col === 1) || 
  (row === 0 && col === 2) || 
  (row === 2 && col === 0) || 
  (row === 2 && col === 1) || 
  (row === 2 && col === 2);

const getMemberAtPosition = (row, col) =>
  members.find((member) => member.position[0] === row && member.position[1] === col);

const SpartansScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [backgroundImage, setBackgroundImage] = useState(
    backgroundImages[Math.floor(Math.random() * backgroundImages.length)]
  );

  useEffect(() => {
    if (isFocused) {
      // Set new random background when screen is focused
      setBackgroundImage(backgroundImages[Math.floor(Math.random() * backgroundImages.length)]);
    }
  }, [isFocused]);

  const isDesktop = SCREEN_WIDTH > 600; 
  const cardSize = isDesktop ? 320 : 100; 
  const cardSpacing = isDesktop ? 120 : 30; 

  return (
    <ImageBackground 
      source={backgroundImage} 
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>The Spartans</Text>
        </View>

        {/* Grid Layout */}
        <View style={[styles.grid, { gap: cardSpacing }]}>
          {[0, 1, 2].map((row) => (
            <View key={row} style={[styles.row, { gap: cardSpacing }]}>
              {[0, 1, 2].map((col) => {
                if (isEmpty(row, col)) {
                  return <View key={col} style={{ width: cardSize, height: cardSize * 1.4 }} />;
                }

                const member = getMemberAtPosition(row, col);
                return (
                  <TouchableOpacity
                    key={col}
                    style={[
                      styles.card,
                      { width: cardSize, height: cardSize * 1.6 },
                      !member?.clickable && styles.disabledCard,
                    ]}
                    onPress={() => member?.clickable && navigation.navigate(member.screen)}
                    disabled={!member?.clickable}
                  >
                    {member?.image && (
                      <>
                        <Image source={member.image} style={styles.characterImage} />
                        {/* Transparent Overlay for Image Protection */}
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
    color: '#fff',
    textAlign: 'center',
    textShadowColor: '#00b3ff',
    textShadowRadius: 15,
    flex: 1,
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
    shadowColor: '#00b3ff',
    shadowOpacity: 1.5,
    shadowRadius: 10,
    elevation: 5,
    padding: 5,
  },
  characterImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1,
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
  disabledCard: {
    backgroundColor: '#444',
    shadowColor: 'transparent',
  },
  disabledText: {
    fontSize: 10,
    color: '#ff4444',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default SpartansScreen;