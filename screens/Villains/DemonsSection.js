import React from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity, Alert } from 'react-native';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Demon Lords data with images
const demonLords = [
  { name: 'Demon Lord Nate', image: require('../../assets/Villains/Nate.jpg'), clickable: true },
];

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;
const cardSize = isDesktop ? 450 : 300; 
const imageSize = isDesktop ? 400 : 250; 

const handlePress = (name) => {
  Alert.alert(`🔥 You have summoned: ${name} 🔥`);
};

const renderDemonLord = ({ item }) => (
  <TouchableOpacity 
    style={[styles.demonCard, { width: cardSize, height: cardSize * 1.2 }]}
    onPress={() => item.clickable && handlePress(item.name)}
    disabled={!item.clickable}
  >
    <Image source={item.image} style={[styles.demonImage, { width: imageSize, height: imageSize }]} />
    <Text style={styles.demonName}>{item.name}</Text>
    {!item.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
  </TouchableOpacity>
);

const DemonsSection = () => (
  <View style={styles.container}>
    <Text style={styles.header}>⚡️ Demon Lords ⚡️</Text>
    <FlatList
      data={demonLords}
      keyExtractor={(item) => item.name}
      renderItem={renderDemonLord}
      contentContainerStyle={styles.listContainer}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    padding: 20,
    borderRadius: 10,
  },
  header: {
    fontSize: 32,
    color: 'white',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  demonCard: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#444',
    padding: 20,
    borderRadius: 15,
  },
  demonImage: {
    borderRadius: 10,
  },
  demonName: {
    marginTop: 15,
    color: 'white',
    fontSize: 20,
  },
  disabledText: {
    marginTop: 10,
    color: '#ff4444',
    fontSize: 14,
  },
});

export default DemonsSection;
