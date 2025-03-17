import React from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';

// Big Bads data with images
const bigBads = [
  { name: 'Obsidian', image: require('../../assets/Villains/Obsidian.jpg') },
  { name: 'Umbra Nex', image: require('../../assets/Villains/UmbraNex.jpg') },
  { name: 'Kaidan Vyros', image: require('../../assets/Villains/KaidanVyros.jpg') },
  { name: 'Stormshade', image: require('../../assets/Villains/Stormshade.jpg') },
  { name: 'Void Conqueror', image: require('../../assets/Villains/Kharon.jpg') },
  { name: 'Erevos', image: require('../../assets/Villains/Erevos.jpg') },
];

const BigBadsTab = () => {
  const renderBigBad = ({ item }) => (
    <View style={styles.bigBadCard}>
      <Image source={item.image} style={styles.bigBadImage} />
      <Text style={styles.bigBadName}>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>List of Big Bads</Text>
      <FlatList
        data={bigBads}
        keyExtractor={(item) => item.name}
        renderItem={renderBigBad}
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
  bigBadCard: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#444',
    padding: 15,
    borderRadius: 10,
    width: 250,
    justifyContent: 'center',
  },
  bigBadImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  bigBadName: {
    marginTop: 10,
    color: 'white',
    fontSize: 18,
  },
});

export default BigBadsTab;
