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

// Aliens data with images & respective screens
const hardcodedAliens = [
  { id: 'alien-1', name: 'Zorath', screen: '', image: require('../../../assets/BackGround/Aliens.jpg'), clickable: true, borderColor: '#c0c0c0', hardcoded: true, description: 'An extraterrestrial warlord from a distant galaxy.' },
];

// Card dimensions for desktop and mobile
const cardSizes = {
  desktop: { width: 400, height: 600 },
  mobile: { width: 350, height: 500 },
};

const AliensScreen = () => {
  const navigation = useNavigation();
  const [aliens, setAliens] = useState(hardcodedAliens);

  // Fetch dynamic aliens from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'aliens'), (snap) => {
      const dynamicAliens = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        clickable: true,
        borderColor: doc.data().borderColor || '#c0c0c0',
        hardcoded: false,
      }));
      console.log('Fetched dynamic aliens:', dynamicAliens);
      setAliens([...hardcodedAliens, ...dynamicAliens]);
    }, (e) => {
      console.error('Firestore error:', e.message);
    });
    return () => unsub();
  }, []);

  // Render Each Alien Card
  const renderAlienCard = (alien) => (
    <TouchableOpacity
      key={alien.id || alien.name}
      style={[
        styles.card,
        {
          width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
          height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height,
        },
        alien.clickable && alien.borderColor ? styles.clickable(alien.borderColor) : styles.notClickable,
      ]}
      onPress={() => alien.clickable && alien.screen && navigation.navigate(alien.screen)}
      disabled={!alien.clickable}
    >
      <Image
        source={alien.image || (alien.imageUrl && alien.imageUrl !== 'placeholder' ? { uri: alien.imageUrl } : require('../../../assets/BackGround/Aliens.jpg'))}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.transparentOverlay} />
      <Text style={styles.name}>{alien.name || alien.codename || 'Unknown'}</Text>
      {!alien.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../../assets/BackGround/Aliens.jpg')}
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
            console.log('Navigating to AliensTab');
            navigation.navigate('AliensTab');
          }}
        >
          <Text style={styles.header}>Aliens</Text>
        </TouchableOpacity>

        {/* Horizontal Scrollable Cards */}
        <View style={styles.scrollWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={[styles.scrollContainer, { gap: isDesktop ? 40 : 20 }]}
          >
            {aliens.length > 0 ? (
              aliens.map(renderAlienCard)
            ) : (
              <Text style={styles.noAliensText}>No aliens available</Text>
            )}
          </ScrollView>
        </View>

        {/* Form for Adding Aliens */}
        <EnlightedInvite
          collectionPath="aliens"
          placeholderImage={require('../../../assets/BackGround/Aliens.jpg')}
          villain={aliens}
          setVillain={setAliens}
          hardcodedVillain={hardcodedAliens}
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
  noAliensText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    padding: 20,
  },
});

export default AliensScreen;