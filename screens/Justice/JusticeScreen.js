import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  ImageBackground
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;

// Card dimensions for desktop and mobile (Matching Big Bads)
const cardSizes = {
  desktop: { width: 400, height: 600 },
  mobile: { width: 350, height: 500 },
};
const horizontalSpacing = isDesktop ? 40 : 20; 
const verticalSpacing = isDesktop ? 50 : 20;


// Villains data with images & respective screens
const villains = [
  { name: 'Ranger', screen: '', image: require('../../assets/Armor/LoneRanger.jpg'), clickable: true },

];

const JusticeScreen = () => {
  const navigation = useNavigation();

  // Render Each Hero Card
  const renderHeroCard = (villain) => (
    <TouchableOpacity
      key={villain.name}
      style={[
        styles.card,
        {
          width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
          height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height
        },
        villain.clickable ? styles.clickable : styles.notClickable
      ]}
      onPress={() => villain.clickable && navigation.navigate(villain.screen)}
      disabled={!villain.clickable}
    >
      <Image source={villain.image} style={styles.image} />
      <Text style={styles.name}>{villain.name}</Text>
      {!villain.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Justice.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>⬅️</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.header}>Guardians of Justice</Text>

        {/* Horizontal Scrollable Villains Grid */}
        <View style={styles.scrollWrapper}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.scrollContainer}
            showsHorizontalScrollIndicator={true}
          >
            {villains.map(renderHeroCard)}
          </ScrollView>
        </View>
      </View>
    </ImageBackground>
  );
};

// Styles
const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingTop: 40,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(17, 25, 40, 0.6)',
    paddingVertical: 15,
    // paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 5,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    textShadowColor: 'yellow',
    textShadowRadius: 15,
    marginBottom: 20,
  },
  scrollWrapper: {
    width: SCREEN_WIDTH,  // Ensures scroll space
    flex: 1,
  },
  scrollContainer: {
    flexDirection: 'row',
    flexGrow: 1, // Ensures scrollable content expands naturally
    width: 'auto',
    paddingVertical: verticalSpacing,
    alignItems: 'center',
  },
  card: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    marginRight: horizontalSpacing,
  },
  clickable: {
    borderColor: 'yellow',
    borderWidth: 2,
  },
  notClickable: {
    opacity: 0.8,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  name: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  disabledText: {
    fontSize: 12,
    color: 'yellow',
    marginTop: 5,
  },
});

export default JusticeScreen;