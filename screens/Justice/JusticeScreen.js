import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Modal,
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
  { name: 'Ranger', screen: '', image: require('../../assets/Armor/LoneRanger.jpg'), clickable: true },
  { name: 'Lloyd', screen: '', image: require('../../assets/Armor/Lloyd.jpg'), clickable: true },
  { name: 'Kai', screen: '', image: require('../../assets/Armor/Kai.jpg'), clickable: true },
  { name: 'Cole', screen: '', image: require('../../assets/Armor/Cole.jpg'), clickable: true },
  { name: 'Jay', screen: '', image: require('../../assets/Armor/Jay.jpg'), clickable: true },
  { name: 'Nya', screen: '', image: require('../../assets/Armor/Nya.jpg'), clickable: true },
  { name: 'Zane', screen: '', image: require('../../assets/Armor/Zane.jpg'), clickable: true },
  { name: 'Pixal', screen: '', image: require('../../assets/Armor/Pixal.jpg'), clickable: true },
  { name: 'Superman', screen: '', image: require('../../assets/Armor/Superman7.jpg'), clickable: true },
  { name: 'Batman', screen: '', image: require('../../assets/Armor/Batman.jpg'), clickable: true },
  { name: 'Flash', screen: '', image: require('../../assets/Armor/Flash2.jpg'), clickable: true },
  { name: 'Green Lantern', screen: '', image: require('../../assets/Armor/GreenLantern.jpg'), clickable: true },
  { name: 'Green Ninja', screen: '', image: require('../../assets/Armor/GreenNinja.jpg'), clickable: true },
  { name: 'Red Ninja', screen: '', image: require('../../assets/Armor/RedNinja.jpg'), clickable: true },
  { name: 'Blue Ninja', screen: '', image: require('../../assets/Armor/BlueNinja.jpg'), clickable: true },
  { name: 'Water Ninja', screen: '', image: require('../../assets/Armor/WaterNinja.jpg'), clickable: true },
  { name: 'Black Ninja', screen: '', image: require('../../assets/Armor/BlackNinja.jpg'), clickable: true },
  { name: 'White Ninja', screen: '', image: require('../../assets/Armor/WhiteNinja.jpg'), clickable: true },
  { name: 'Green Lantern 2', screen: '', image: require('../../assets/Armor/GreenLantern2.jpg'), clickable: true },
  { name: '', screen: '', image: require('../../assets/Armor/Batman2.jpg'), clickable: true },
  { name: '', screen: '', image: require('../../assets/Armor/Superman5.jpg'), clickable: true },
  { name: '', screen: '', image: require('../../assets/Armor/Flash.jpg'), clickable: true },
  { name: 'Ironman', screen: '', image: require('../../assets/Armor/Ironman.jpg'), clickable: true },
  { name: '', screen: '', image: require('../../assets/Armor/Superman6.jpg'), clickable: true },
  { name: 'Rogue', screen: '', image: require('../../assets/Armor/Rogue.jpg'), clickable: true },
  { name: 'Ronan', screen: '', image: require('../../assets/Armor/Ronan.jpg'), clickable: true },
  { name: 'Apocolie', screen: '', image: require('../../assets/Armor/Apocolie.jpg'), clickable: true },
  { name: 'Socialation', screen: '', image: require('../../assets/Armor/JadenPlaceHolder.jpg'), clickable: true },
  { name: 'Spiltz', screen: '', image: require('../../assets/Armor/JonasPlaceHolder.jpg'), clickable: true },
  { name: '', codename: 'Voice Fry', screen: '', clickable: true, image: require('../../assets/Armor/JohnathonPlaceHolder_cleanup.jpg') },
];

const JusticeScreen = () => {
  const navigation = useNavigation();
  const [previewHero, setPreviewHero] = useState(null);

  const handleHeroPress = (hero) => {
    if (hero.clickable) {
      if (hero.screen) {
        navigation.navigate(hero.screen); // Navigate if screen exists
      } else {
        setPreviewHero(hero); // Show modal if no screen
      }
    }
  };

  // Render Each Hero Card
  const renderHeroCard = (hero) => (
    <TouchableOpacity
      key={hero.name || hero.image.toString()} // Use image as fallback for unnamed heroes
      style={[
        styles.card,
        {
          width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
          height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height,
        },
        hero.clickable ? styles.clickable : styles.notClickable,
      ]}
      onPress={() => handleHeroPress(hero)}
      disabled={!hero.clickable}
    >
      {hero?.image && (
        <>
          <Image source={hero.image} style={styles.image} />
          <View style={styles.transparentOverlay} />
        </>
      )}
      <Text style={styles.name}>{hero.name || 'Unknown'}</Text>
      {!hero.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
    </TouchableOpacity>
  );

  const renderPreviewCard = (hero) => (
    <TouchableOpacity
      style={[styles.previewCard(isDesktop, SCREEN_WIDTH), styles.clickable]}
      onPress={() => setPreviewHero(null)} // Close modal on card press
    >
      <Image
        source={hero.image || require('../../assets/Armor/LoneRanger.jpg')}
        style={styles.previewImage}
        resizeMode="cover"
      />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {hero.name || 'Unknown'}; William Cummings
      </Text>
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

        {/* Preview Modal */}
        <Modal
          visible={!!previewHero}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setPreviewHero(null)}
        >
          <View style={styles.modalBackground}>
            <TouchableOpacity
              style={styles.modalOuterContainer}
              activeOpacity={1}
              onPress={() => setPreviewHero(null)}
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
                  {previewHero && renderPreviewCard(previewHero)}
                </ScrollView>
              </View>
              <View style={styles.previewAboutSection}>
                <Text style={styles.previewName}>{previewHero?.name || 'Unknown'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
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
    zIndex: 1,
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
    opacity: 0.7,
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
  previewName: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default JusticeScreen;