import React from 'react';
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, FlatList, useWindowDimensions, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useScreenOrientation } from 'expo-screen-orientation';

const factions = [
  { name: 'The Titans', screen: 'Titans', clickable: true, image: require('../assets/Titans.jpg') },
  { name: 'The Eclipse', screen: 'Eclipse', clickable: true, image: require('../assets/Enforcers.jpg') },
  { name: 'Olympians', screen: 'Olympians', clickable: false, image: require('../assets/Kin.jpg') },
  { name: 'Cobros', screen: '', clickable: false, image: require('../assets/Cobros.jpg') },
  { name: 'ASTC (Spartans)', screen: 'ASTC', clickable: false, image: require('../assets/26.jpg') },
  { name: 'BludBruhs', screen: 'BludBruhs', clickable: false, image: require('../assets/bludbruh.jpg') },
  { name: 'Legionaires', screen: 'Legionaires', clickable: false, image: require('../assets/League.jpg') },
  { name: 'Constollation', screen: 'Constollation', clickable: false, image: require('../assets/helldivers.webp') },
  { name: 'Designs', screen: 'Designs', clickable: false, image: require('../assets/donut_hologram.png') },
];

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const numColumns = width > 600 ? 3 : 2; // Use 3 columns if screen width > 600px, otherwise 2 columns

  // Smooth layout transition animation
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400, // Smooth transition
      useNativeDriver: true,
    }).start();
  }, [numColumns]);

  const renderFaction = ({ item }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        style={[styles.card, { width: width / numColumns - 30 }, !item.clickable && styles.disabledCard]} // Adjust width dynamically
        onPress={() => item.clickable && navigation.navigate(item.screen)}
        disabled={!item.clickable}
      >
        <ImageBackground source={item.image} style={styles.imageBackground} imageStyle={styles.imageOverlay}>
          <Text style={styles.factionName}>{item.name}</Text>
          {!item.clickable && <Text style={styles.disabledText}>Not Clickable at the moment</Text>}
        </ImageBackground>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <ImageBackground source={require('../assets/superhero.jpg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>The Parliament of Justice</Text>
        <FlatList
          data={factions}
          keyExtractor={(item) => item.name}
          renderItem={renderFaction}
          numColumns={numColumns} // Dynamically change column count
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark overlay
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#00b3ff',
    textShadowRadius: 15,
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
  card: {
    aspectRatio: 1.3, // Keeps all cards proportionate
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    opacity: 0.9, // Darkened background image effect
  },
  factionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'black',
    textShadowRadius: 5,
  },
  disabledCard: {
    backgroundColor: '#555',
  },
  disabledText: {
    fontSize: 12,
    color: '#ff4444',
    marginTop: 5,
  },
});
