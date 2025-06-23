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
  desktop: { width: 800, height: 600 },
  mobile: { width: 700, height: 500 },
};
const horizontalSpacing = isDesktop ? 40 : 20;
const verticalSpacing = isDesktop ? 50 : 20;

// Infantry data with images & respective screens
const infantry = [
  // { name: 'USS Coalescene', screen: '', image: require('../../assets/InfantryYard/USSCoalescence.jpg'), clickable: true },

  // Add more infantry here, e.g.:
  // { name: 'New Infantry', screen: 'NewInfantryScreen', image: require('../../assets/NewInfantry.jpg'), clickable: true },
];

const InfantryScreen = () => {
  const navigation = useNavigation();
  const [previewInfantry, setPreviewInfantry] = useState(null);

  const handleInfantryPress = (infantry) => {
    if (infantry.clickable) {
      if (infantry.screen) {
        navigation.navigate(infantry.screen); // Navigate if screen exists
      } else {
        setPreviewInfantry(infantry); // Show modal if no screen
      }
    }
  };

  // Render Each Infantry Card
  const renderInfantryCard = (infantry) => (
    <TouchableOpacity
      key={infantry.name}
      style={[
        styles.card,
        {
          width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
          height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height,
        },
        infantry.clickable ? styles.clickable : styles.notClickable,
      ]}
      onPress={() => handleInfantryPress(infantry)}
      disabled={!infantry.clickable}
    >
      {infantry?.image && (
        <>
          <Image source={infantry.image} style={styles.image} />
          <View style={styles.transparentOverlay} />
        </>
      )}
      <Text style={styles.name}>{infantry.name}</Text>
      {!infantry.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
    </TouchableOpacity>
  );

  const renderPreviewCard = (infantry) => (
    <TouchableOpacity
      style={[styles.previewCard(isDesktop, SCREEN_WIDTH), styles.clickable]}
      onPress={() => setPreviewInfantry(null)} // Close modal on card press
    >
      <Image
        source={infantry.image || require('../../assets/BackGround/Soldiers.jpg')}
        style={styles.previewImage}
        resizeMode="contain"
      />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {infantry.name || 'Unknown'}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Soldiers.jpg')}
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
        <Text style={styles.header}>Infantry Yard</Text>

        {/* Horizontal Scrollable Infantry Grid */}
        <View style={styles.scrollWrapper}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.scrollContainer}
            showsHorizontalScrollIndicator={true}
          >
            {infantry.map(renderInfantryCard)}
          </ScrollView>
        </View>

        {/* Preview Modal */}
        <Modal
          visible={!!previewInfantry}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setPreviewInfantry(null)}
        >
          <View style={styles.modalBackground}>
            <TouchableOpacity
              style={styles.modalOuterContainer}
              activeOpacity={1}
              onPress={() => setPreviewInfantry(null)}
            >
              <View style={styles.imageContainer}>
                <ScrollView
                  horizontal
                  contentContainerStyle={styles.imageScrollContainer}
                  showsHorizontalScrollIndicator={false}
                  snapToAlignment="center"
                  snapToInterval={SCREEN_WIDTH * 0.8 + 20}
                  decelerationRate="fast"
                  centerContent={true}
                >
                  {previewInfantry && renderPreviewCard(previewInfantry)}
                </ScrollView>
              </View>
              <View style={styles.previewAboutSection}>
                <Text style={styles.previewName}>{previewInfantry?.name || 'Unknown'}</Text>
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
    paddingVertical: 10,
    backgroundColor: '#111',
    alignItems: 'center',
  },
  imageScrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewCard: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.5 : SCREEN_WIDTH * 0.8,
    height: isDesktop ? SCREEN_HEIGHT * 0.6 : SCREEN_HEIGHT * 0.3,
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
    resizeMode: 'contain',
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
    marginTop: 10,
    padding: 10,
    backgroundColor: '#222',
    borderRadius: 10,
    width: '90%',
  },
  previewName: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
});

export default InfantryScreen;