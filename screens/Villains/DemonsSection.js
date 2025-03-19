import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
  ImageBackground
} from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import { demonLords } from './DemonData'; // Import data dynamically

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;
const cardSize = isDesktop ? 450 : 300;
const imageSize = isDesktop ? 400 : 280;

const DemonsSection = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDemon, setSelectedDemon] = useState(null);

  // Dynamic Sound Handler
  const playDemonSound = async (audio, screen) => {
    const { sound } = await Audio.Sound.createAsync(audio);
    await sound.playAsync();

    if (screen) {
      setTimeout(() => {
        navigation.navigate(screen);
      }, 3000);
    }
  };

  const handlePress = async (demon) => {
    if (demon.audio) {
      await playDemonSound(demon.audio, demon.screen); // 🔊 For demons with audio
    } else if (demon.screen) {
      navigation.navigate(demon.screen); // 🚀 For demons with only a screen
    } else {
      setSelectedDemon(demon.name); // 🔥 For demons with no screen or audio (like Thorax)
      setModalVisible(true);
    }
  };
  

  const renderDemonLord = (demon) => (
    <TouchableOpacity
      key={demon.name}
      style={[
        styles.demonCard,
        { width: cardSize, height: cardSize * 1.2 },
        demon.clickable ? styles.clickable : styles.notClickable
      ]}
      onPress={() => demon.clickable && handlePress(demon)}
      disabled={!demon.clickable}
    >
      <Image source={demon.image} style={[styles.demonImage, { width: imageSize, height: imageSize }]} />
      <Text style={styles.demonName}>{demon.name}</Text>
      {/* {!demon.clickable && <Text style={styles.disabledText}>Not Clickable</Text>} */}
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/BackGround/NateEmblem.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>⬅️</Text>
        </TouchableOpacity>

        <Text style={styles.header}>⚡️ Demon Lords ⚡️</Text>

        <View style={styles.scrollWrapper}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.scrollContainer}
            showsHorizontalScrollIndicator={true}
          >
            {demonLords.map(renderDemonLord)}
          </ScrollView>
        </View>

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
    </ImageBackground>
  );
};

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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 0,
    backgroundColor: '#750000',
    paddingVertical: 8,
    paddingHorizontal: 20,
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
    textShadowColor: '#750000',
    textShadowRadius: 50,
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
    paddingVertical: 20,
    alignItems: 'center',
  },
  demonCard: {
    alignItems: 'center',
    backgroundColor: '#660000dc',
    padding: 20,
    borderRadius: 15,
    marginRight: 20,
  },
  clickable: {
    borderColor: '#e25822',
    borderWidth: 4,
  },
  notClickable: {
    opacity: 0.5,
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
