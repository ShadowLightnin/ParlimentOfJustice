import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';

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

const DemonsSection = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDemon, setSelectedDemon] = useState(null);

  const handlePress = (name) => {
    setSelectedDemon(name);
    setModalVisible(true);
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>⚡️ Demon Lords ⚡️</Text>
      <FlatList
        data={demonLords}
        keyExtractor={(item) => item.name}
        renderItem={renderDemonLord}
        contentContainerStyle={styles.listContainer}
      />

      {/* Modal for demon info */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>🔥 You have summoned: {selectedDemon} 🔥</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalText: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
  },
});

export default DemonsSection;
