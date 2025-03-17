import React from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';

// Demon Lords data with images
const demonLords = [
  { name: 'Demon Lord Nate', image: require('../../assets/Villains/Nate.jpg') },
];

const DemonsSection = () => {
  const renderDemonLord = ({ item }) => (
    <View style={styles.demonCard}>
      <Image source={item.image} style={styles.demonImage} />
      <Text style={styles.demonName}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>⚡️ Demon Lord ⚡️</Text>
      <FlatList
        data={demonLords}
        keyExtractor={(item) => item.name}
        renderItem={renderDemonLord}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

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
    padding: 15,
    borderRadius: 10,
    width: 350,
    justifyContent: 'center',
  },
  demonImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
  },
  demonName: {
    marginTop: 10,
    color: 'white',
    fontSize: 18,
  },
});

export default DemonsSection;
