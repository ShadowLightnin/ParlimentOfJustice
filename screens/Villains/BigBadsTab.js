import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Big Bads data with images
const bigBads = [
  { name: 'Obsidian', image: require('../../assets/Villains/Obsidian.jpg'), clickable: true },
  { name: 'Umbra Nex', image: require('../../assets/Villains/UmbraNex.jpg'), clickable: true },
  { name: 'Kaidan Vyros', image: require('../../assets/Villains/KaidanVyros.jpg'), clickable: true },
  { name: 'Stormshade', image: require('../../assets/Villains/Stormshade.jpg'), clickable: false },
  { name: 'Void Conqueror', image: require('../../assets/Villains/Kharon.jpg'), clickable: true },
  { name: 'Erevos', image: require('../../assets/Villains/Erevos.jpg'), clickable: false },
];

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;
const cardSize = isDesktop ? 250 : 200;
const cardHeightMultiplier = 1.6;
const horizontalSpacing = isDesktop ? 40 : 15;
const verticalSpacing = isDesktop ? 50 : 20;

const renderBigBadCard = (bigBad) => (
  <TouchableOpacity
    key={bigBad.name}
    style={[
      styles.card,
      { width: cardSize, height: cardSize * cardHeightMultiplier },
      bigBad.clickable ? styles.clickable : styles.notClickable,
    ]}
    disabled={!bigBad.clickable}
  >
    <Image source={bigBad.image} style={styles.image} />
    <Text style={styles.name}>{bigBad.name}</Text>
    {!bigBad.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
  </TouchableOpacity>
);

const BigBadsTab = () => {
  const totalCardWidth = bigBads.length * (cardSize + horizontalSpacing);
  const paddingHorizontal = Math.max((SCREEN_WIDTH - totalCardWidth) / 1.5, 0);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        styles.scrollContainer,
        { paddingHorizontal, gap: horizontalSpacing },
      ]}
    >
      {bigBads.map(renderBigBadCard)}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: verticalSpacing,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
  },
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  clickable: {
    borderColor: 'purple',
    borderWidth: 2,
  },
  notClickable: {
    opacity: 0.5,
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
    color: '#ff4444',
    marginTop: 5,
  },
});

export default BigBadsTab;
