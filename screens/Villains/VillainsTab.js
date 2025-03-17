import React from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';

// Villains data with images
const villains = [
  { name: 'Fjord', image: require('../../assets/Villains/Fjord.jpg') },
  { name: 'Judge Hex', image: require('../../assets/Villains/JudgeHex.jpg') },
  { name: 'Wraithblade', image: require('../../assets/Villains/Wraithblade.jpg') },
  { name: 'Harbinger', image: require('../../assets/Villains/Harbinger.jpg') },
  { name: 'Venom Fang', image: require('../../assets/Villains/VenomFang.jpg') },
  { name: 'Shatterbloom', image: require('../../assets/Villains/Shatterbloom.jpg') },
  { name: 'Harbinger Dove', image: require('../../assets/Villains/HarbingerDove.jpg') },
  { name: 'Byte Ruin', image: require('../../assets/Villains/ByteRuin.jpg') },
  { name: 'Shade Weaver', image: require('../../assets/Villains/ShadeWeaver.jpg') },
  { name: 'Rage Vortex', image: require('../../assets/Villains/RageVortex.jpg') },
  { name: "Mal'likhan", image: require('../../assets/Villains/Mallikhan.jpg') },
  { name: 'Elder Pyrrhus', image: require('../../assets/Villains/ElderPyrrhus.jpg') },
  { name: 'Dark Envoy', image: require('../../assets/Villains/DarkEnvoy.jpg') },
  { name: 'Spectral Wraith', image: require('../../assets/Villains/SpectralWraith.jpg') },
  { name: 'Harrier', image: require('../../assets/Villains/Harrier.jpg') },
  { name: 'Shade Widow', image: require('../../assets/Villains/ShadeWidow.jpg') },
  { name: 'Gilded Shard', image: require('../../assets/Villains/GildedShard.jpg') },
  { name: 'Chrome Phoenix', image: require('../../assets/Villains/ChromePhoenix.jpg') },
  { name: 'Hades Ravage', image: require('../../assets/Villains/HadesRavage.jpg') },
  { name: 'Spectral Warlord', image: require('../../assets/Villains/SpectralWarlord.jpg') },
  { name: 'Virus Vortex', image: require('../../assets/Villains/VirusVortex2.jpg') },
  { name: 'Shade Stalker', image: require('../../assets/Villains/ShadeStalker.jpg') },
  { name: 'Volt Shade.', image: require('../../assets/Villains/VoltShade.jpg') },
  { name: 'Steel Juggernaut', image: require('../../assets/Villains/SteelJuggernaut.jpg') },
  { name: 'Warhound', image: require('../../assets/Villains/Warhound.jpg') },
  { name: 'Overmind', image: require('../../assets/Villains/Overmind.jpg') },
  { name: 'Obsidian Shroud', image: require('../../assets/Villains/ObsidianShroud.jpg') },
  { name: 'Fangstrike', image: require('../../assets/Villains/Fangstrike.jpg') },
  { name: 'Void Phantom', image: require('../../assets/Villains/VoidPhantom.jpg') },
  // { name: '', image: require('../../assets/Villains/.jpg') },
];

const VillainsTab = () => {
  const renderVillain = ({ item }) => (
    <View style={styles.villainCard}>
      <Image source={item.image} style={styles.villainImage} />
      <Text style={styles.villainName}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>List of Villains</Text>
      <FlatList
        data={villains}
        keyExtractor={(item) => item.name}
        renderItem={renderVillain}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    paddingTop: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 32,
    color: 'white',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  villainCard: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#444',
    padding: 15,
    borderRadius: 10,
    width: 250,
    justifyContent: 'center',
  },
  villainImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  villainName: {
    marginTop: 10,
    color: 'white',
    fontSize: 18,
  },
});

export default VillainsTab;
