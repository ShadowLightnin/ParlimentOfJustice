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

// Statues data with images & respective screens
const hardcodedStatues = [
  { id: 'statue-1', name: 'Weeping Angel', screen: '', image: require('../../../assets/BackGround/Statue.jpg'), clickable: true, borderColor: '#c0c0c0', hardcoded: true, description: 'A quantum-locked statue that moves when unseen.' },
];

// Card dimensions for desktop and mobile
const cardSizes = {
  desktop: { width: 400, height: 600 },
  mobile: { width: 350, height: 500 },
};

const StatuesScreen = () => {
  const navigation = useNavigation();
  const [statues, setStatues] = useState(hardcodedStatues);

  // Fetch dynamic statues from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'statues'), (snap) => {
      const dynamicStatues = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        clickable: true,
        borderColor: doc.data().borderColor || '#c0c0c0',
        hardcoded: false,
      }));
      console.log('Fetched dynamic statues:', dynamicStatues);
      setStatues([...hardcodedStatues, ...dynamicStatues]);
    }, (e) => {
      console.error('Firestore error:', e.message);
    });
    return () => unsub();
  }, []);

  // Render Each Statue Card
  const renderStatueCard = (statue) => (
    <TouchableOpacity
      key={statue.id || statue.name}
      style={[ // Fixed: Changed `style=[...]` to `style={[...]}`
        styles.card,
        {
          width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
          height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height,
        },
        statue.clickable && statue.borderColor ? styles.clickable(statue.borderColor) : styles.notClickable,
      ]}
      onPress={() => statue.clickable && statue.screen && navigation.navigate(statue.screen)}
      disabled={!statue.clickable}
    >
      <Image
        source={statue.image || (statue.imageUrl && statue.imageUrl !== 'placeholder' ? { uri: statue.imageUrl } : require('../../../assets/BackGround/Statue.jpg'))}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.transparentOverlay} />
      <Text style={styles.name}>{statue.name || statue.codename || 'Unknown'}</Text>
      {!statue.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../../assets/BackGround/Statue.jpg')}
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
            console.log('Navigating to StatuesTab');
            navigation.navigate('StatuesTab');
          }}
        >
          <Text style={styles.header}>Weeping Angels</Text>
        </TouchableOpacity>

        {/* Horizontal Scrollable Cards */}
        <View style={styles.scrollWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={[styles.scrollContainer, { gap: isDesktop ? 40 : 20 }]}
          >
            {statues.length > 0 ? (
              statues.map(renderStatueCard)
            ) : (
              <Text style={styles.noStatuesText}>No statues available</Text>
            )}
          </ScrollView>
        </View>

        {/* Form for Adding Statues */}
        <EnlightedInvite
          collectionPath="statues"
          placeholderImage={require('../../../assets/BackGround/Statue.jpg')}
          villain={statues}
          setVillain={setStatues}
          hardcodedVillain={hardcodedStatues}
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
  noStatuesText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    padding: 20,
  },
});

export default StatuesScreen;