import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import EnlightedInvite from '../EnlightenedInvite';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;

// Pirates data with images & respective screens
const hardcodedPirates = [
  { id: 'pirate-1', name: 'Blackfang', screen: '', image: require('../../../assets/BackGround/Pirates.jpg'), clickable: true, borderColor: '#c0c0c0', hardcoded: true, description: 'A ruthless pirate captain of the high seas.' },
];

// Card dimensions for desktop and mobile
const cardSizes = {
  desktop: { width: 400, height: 600 },
  mobile: { width: 350, height: 500 },
};

const PiratesScreen = () => {
  const navigation = useNavigation();
  const [pirates, setPirates] = useState(hardcodedPirates);

  // Fetch dynamic pirates from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'pirates'), (snap) => {
      const dynamicPirates = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        clickable: true,
        borderColor: doc.data().borderColor || '#c0c0c0',
        hardcoded: false,
      }));
      console.log('Fetched dynamic pirates:', dynamicPirates);
      setPirates([...hardcodedPirates, ...dynamicPirates]);
    }, (e) => {
      console.error('Firestore error:', e.message);
    });
    return () => unsub();
  }, []);

  // Render Each Pirate Card
  const renderPirateCard = (pirate) => (
    <TouchableOpacity
      key={pirate.id || pirate.name}
      style={[ // Fixed: Changed `style=[...]` to `style={[...]}`
        styles.card,
        {
          width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
          height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height,
        },
        pirate.clickable && pirate.borderColor ? styles.clickable(pirate.borderColor) : styles.notClickable,
      ]}
      onPress={() => pirate.clickable && pirate.screen && navigation.navigate(pirate.screen)}
      disabled={!pirate.clickable}
    >
      <Image
        source={pirate.image || (pirate.imageUrl && pirate.imageUrl !== 'placeholder' ? { uri: pirate.imageUrl } : require('../../../assets/BackGround/Pirates.jpg'))}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.transparentOverlay} />
      <Text style={styles.name}>{pirate.name || pirate.codename || 'Unknown'}</Text>
      {!pirate.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../../assets/BackGround/Pirates.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => {
            console.log('Navigating back');
            navigation.goBack();
          }}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>⬅️</Text>
        </TouchableOpacity>

        {/* Title */}
        <TouchableOpacity
          onPress={() => {
            console.log('Navigating to PiratesTab');
            navigation.navigate('PiratesTab');
          }}
        >
          <Text style={styles.header}>Pirates</Text>
        </TouchableOpacity>

        {/* Horizontal Scrollable Cards */}
        <View style={styles.scrollWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={[styles.scrollContainer, { gap: isDesktop ? 40 : 20 }]}
          >
            {pirates.length > 0 ? (
              pirates.map(renderPirateCard)
            ) : (
              <Text style={styles.noPiratesText}>No pirates available</Text>
            )}
          </ScrollView>
        </View>

        {/* Form for Adding Pirates */}
        <EnlightedInvite
          collectionPath="pirates"
          placeholderImage={require('../../../assets/BackGround/Pirates.jpg')}
          villain={pirates}
          setVillain={setPirates}
          hardcodedVillain={hardcodedPirates}
          editingVillain={null}
          setEditingVillain={() => {}}
        />
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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 0,
    backgroundColor: '#750000',
    paddingVertical: 8,
    paddingHorizontal: 15,
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
    color: '#00b3ff',
    textAlign: 'center',
    textShadowColor: '#c0c0c0',
    textShadowRadius: 25,
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
  card: {
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  clickable: (borderColor) => ({
    borderColor: borderColor || '#c0c0c0',
    borderWidth: 2,
  }),
  notClickable: {
    opacity: 0.5,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1,
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
  noPiratesText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    padding: 20,
  },
});

export default PiratesScreen;