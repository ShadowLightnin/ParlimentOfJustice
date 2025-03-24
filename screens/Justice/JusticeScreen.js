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

// Card dimensions for desktop and mobile
const cardSizes = {
  desktop: { width: 400, height: 600 },
  mobile: { width: 350, height: 500 },
};
const horizontalSpacing = isDesktop ? 40 : 20;
const verticalSpacing = isDesktop ? 50 : 20;

// Heroes data with images & respective screens
const heroes = [
  { name: 'Ranger', screen: '', image: require('../../assets/Armor/LoneRanger.jpg'), clickable: false },
  { name: 'Inspired Superman', screen: '', clickable: false },
  { name: 'Inspired Batman', screen: '', clickable: false },
  { name: 'Inspired Flash', screen: '', clickable: false },
  { name: 'Inspired Green Lantern', screen: '', clickable: false },
  { name: 'Inspired Wonder Woman', screen: '', clickable: false },
  { name: 'Inspired Martian Manhunter', screen: '', clickable: false },
  { name: 'Inspired Hawkgirl', screen: '', clickable: false },
  { name: 'Inspired Night Wing', screen: '', clickable: false },
  { name: 'Inspired Wally West Flash', screen: '', clickable: false },
  { name: 'Inspired Iron Man', screen: '', clickable: false },
  { name: 'Inspired Captain America', screen: '', clickable: false },
  { name: 'Inspired Thor', screen: '', clickable: false },
  { name: 'Inspired Hulk', screen: '', clickable: false },
  { name: 'Inspired Black Widow', screen: '', clickable: false },
  { name: 'Inspired Spider-Man', screen: '', clickable: false },
  { name: 'Inspired Wolverine', screen: '', clickable: false },
  { name: 'Inspired Deadpool', screen: '', clickable: false },
  { name: 'Inspired Hawkeye', screen: '', clickable: false },
  { name: 'Inspired Cyclops', screen: '', clickable: false },
  { name: 'Inspired Gambit', screen: '', clickable: false },
  { name: 'Inspired Ant-Man', screen: '', clickable: false },
  { name: 'Inspired Falcon', screen: '', clickable: false },
  { name: 'Inspired Dr. Strange', screen: '', clickable: false },
  { name: 'Inspired Black Panther', screen: '', clickable: false },
  { name: 'Inspired Vision', screen: '', clickable: false },
  { name: 'Inspired Loki', screen: '', clickable: false },
  { name: 'Inspired Groot', screen: '', clickable: false },
  { name: 'Inspired Mystique', screen: '', clickable: false },
  { name: 'Inspired Quicksilver', screen: '', clickable: false },
  { name: 'Inspired Gamora', screen: '', clickable: false },
  { name: 'Inspired Rocket Raccoon', screen: '', clickable: false },
  { name: 'Inspired Nebula', screen: '', clickable: false },
  { name: 'Inspired Star Lord', screen: '', clickable: false },
  { name: 'Inspired Daredevil', screen: '', clickable: false },
  { name: 'Inspired Shuri', screen: '', clickable: false },
  { name: 'Inspired Robin', screen: '', clickable: false },
  { name: 'Inspired Batgirl', screen: '', clickable: false },
];

const JusticeScreen = () => {
  const navigation = useNavigation();

  // Render Each Hero Card
  const renderHeroCard = (hero) => (
    <TouchableOpacity
      key={hero.name}
      style={[
        styles.card,
        {
          width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
          height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height,
        },
        hero.clickable ? styles.clickable : styles.notClickable,
      ]}
      onPress={() => hero.clickable && navigation.navigate(hero.screen)}
      disabled={!hero.clickable}
    >
      {hero?.image && (
        <>
          {/* Image */}
          <Image source={hero.image} style={styles.image} />
          {/* Transparent Overlay to Prevent Image Save */}
          <View style={styles.transparentOverlay} />
        </>
      )}
      <Text style={styles.name}>{hero.name}</Text>
      {!hero.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
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

        {/* Horizontal Scrollable Heroes Grid */}
        <View style={styles.scrollWrapper}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.scrollContainer}
            showsHorizontalScrollIndicator={true}
          >
            {heroes.map(renderHeroCard)}
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
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1, // Prevents saving while still allowing click interactions
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(17, 25, 40, 0.6)',
    paddingVertical: 15,
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
    width: SCREEN_WIDTH,
    flex: 1,
  },
  scrollContainer: {
    flexDirection: 'row',
    flexGrow: 1,
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
