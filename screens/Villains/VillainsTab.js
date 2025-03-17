import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Villains data with images
const villains = [
  { name: 'Fjord', image: require('../../assets/Villains/Fjord.jpg'), clickable: true  },
  { name: 'Judge Hex', image: require('../../assets/Villains/JudgeHex.jpg'), clickable: true  },
  { name: 'Wraithblade', image: require('../../assets/Villains/Wraithblade.jpg'), clickable: true  },
  { name: 'Harbinger', image: require('../../assets/Villains/Harbinger.jpg'), clickable: true  },
  { name: 'Venom Fang', image: require('../../assets/Villains/VenomFang.jpg'), clickable: true  },
  { name: 'Shatterbloom', image: require('../../assets/Villains/Shatterbloom.jpg'), clickable: true  },
  { name: 'Harbinger Dove', image: require('../../assets/Villains/HarbingerDove.jpg'), clickable: true  },
  { name: 'Byte Ruin', image: require('../../assets/Villains/ByteRuin.jpg'), clickable: true  },
  { name: 'Shade Weaver', image: require('../../assets/Villains/ShadeWeaver.jpg'), clickable: true  },
  { name: 'Rage Vortex', image: require('../../assets/Villains/RageVortex.jpg'), clickable: true  },
  { name: "Mal'likhan", image: require('../../assets/Villains/Mallikhan.jpg'), clickable: true  },
  { name: 'Elder Pyrrhus', image: require('../../assets/Villains/ElderPyrrhus.jpg'), clickable: true  },
  { name: 'Dark Envoy', image: require('../../assets/Villains/DarkEnvoy.jpg'), clickable: true  },
  { name: 'Spectral Wraith', image: require('../../assets/Villains/SpectralWraith.jpg'), clickable: true  },
  { name: 'Harrier', image: require('../../assets/Villains/Harrier.jpg'), clickable: true  },
  { name: 'Shade Widow', image: require('../../assets/Villains/ShadeWidow.jpg'), clickable: true  },
  { name: 'Gilded Shard', image: require('../../assets/Villains/GildedShard.jpg'), clickable: true  },
  { name: 'Chrome Phoenix', image: require('../../assets/Villains/ChromePhoenix.jpg'), clickable: true  },
  { name: 'Hades Ravage', image: require('../../assets/Villains/HadesRavage.jpg'), clickable: true  },
  { name: 'Spectral Warlord', image: require('../../assets/Villains/SpectralWarlord.jpg'), clickable: true  },
  { name: 'Virus Vortex', image: require('../../assets/Villains/VirusVortex2.jpg'), clickable: true  },
  { name: 'Shade Stalker', image: require('../../assets/Villains/ShadeStalker.jpg'), clickable: true  },
  { name: 'Volt Shade.', image: require('../../assets/Villains/VoltShade.jpg'), clickable: true  },
  { name: 'Steel Juggernaut', image: require('../../assets/Villains/SteelJuggernaut.jpg'), clickable: true  },
  { name: 'Warhound', image: require('../../assets/Villains/Warhound.jpg'), clickable: true  },
  { name: 'Overmind', image: require('../../assets/Villains/Overmind.jpg'), clickable: true  },
  { name: 'Obsidian Shroud', image: require('../../assets/Villains/ObsidianShroud.jpg'), clickable: true  },
  { name: 'Fangstrike', image: require('../../assets/Villains/Fangstrike.jpg'), clickable: true  },
  { name: 'Void Phantom', image: require('../../assets/Villains/VoidPhantom.jpg'), clickable: true  },
  // { name: '', image: require('../../assets/Villains/.jpg') },
];

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;
const columns = isDesktop ? 6 : 3;
const cardSize = isDesktop ? 240 : 200;
const cardHeightMultiplier = 1.6;
const horizontalSpacing = isDesktop ? 40 : 10;
const verticalSpacing = isDesktop ? 50 : 20;

// Render Each Card
const renderVillainCard = (villain) => (
  <TouchableOpacity
    key={villain.name}
    style={[styles.card, villain.clickable ? styles.clickable : styles.notClickable]}
    disabled={!villain.clickable}
  >
    <Image source={villain.image} style={styles.image} />
    <Text style={styles.name}>{villain.name}</Text>
    {!villain.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
  </TouchableOpacity>
);

const VillainsTab = () => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={true}
    contentContainerStyle={[styles.scrollContainer, { gap: horizontalSpacing }]}
  >
    {villains.map(renderVillainCard)}
  </ScrollView>
);

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: verticalSpacing,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
  },
  card: {
    width: cardSize,
    height: cardSize * cardHeightMultiplier,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  clickable: {
    borderColor: 'red',
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
    color: '#ff4444',
    marginTop: 5,
  },
});

export default VillainsTab;