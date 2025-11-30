// JusticeCharacterDetail.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import JusticeDescription from './JusticeDescription';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const JusticeCharacterDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { member } = route.params || {};

  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);
  const isDesktop = windowWidth >= 768;
  const cardWidth = isDesktop ? windowWidth * 0.33 : SCREEN_WIDTH * 0.90;

  useEffect(() => {
    const update = () => setWindowWidth(Dimensions.get('window').width);
    const sub = Dimensions.addEventListener('change', update);
    return () => sub?.remove();
  }, []);

  // Theme Detection
  const getTheme = () => {
    if (!member?.name) return themes.guardians;
    const n = member.name.toLowerCase();

    if (['ranger','superman','batman','flash','green lantern','lloyd','kai','cole','jay','nya','zane','pixal','rogue','ronan','apocolie','ironman'].some(k => n.includes(k))) {
      return themes.guardians;
    }
    if (['elemental','master of','dragon','oni','void','creation','destruction'].some(k => n.includes(k))) {
      return themes.elementals;
    }
    if (['starman','dragoknight','flare','vindra'].some(k => n.includes(k))) {
      return themes.justiceLeague;
    }
    if (n.startsWith('the ')) {
      return themes.theSeven;
    }
    return themes.heroes;
  };

  const theme = getTheme();

  // Dynamic Copyright with Character Name
  const characterName = member?.name || member?.codename || 'Unknown Guardian';
  const copyrightText = `© ${characterName}; William Cummings`;

  // Image Handling
  const images = member?.images?.length > 0
    ? member.images.map(img => ({ uri: img, copyright: copyrightText }))
    : member?.image
    ? [{ uri: member.image, copyright: copyrightText }]
    : [{ uri: require('../../assets/Armor/PlaceHolder.jpg'), copyright: copyrightText }];

  const description = JusticeDescription[member?.name] ||
    'A legendary protector whose deeds echo through time and realm. Their power stands eternal.';

  const renderImageCard = (img, i) => {
    const source = typeof img.uri === 'object' ? img.uri : { uri: img.uri };
    return (
      <TouchableOpacity
        key={i}
        style={[styles.card(isDesktop, windowWidth)]}
        activeOpacity={0.92}
      >
        <Image source={source} style={styles.fullImage} resizeMode="cover" />
        <View style={styles.overlay} />
        <Text style={styles.copyrightText}>{img.copyright}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* PERFECTLY ALIGNED HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { borderColor: theme.accent, backgroundColor: theme.backBg }]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Text style={[styles.backText, { color: theme.accent }]}>Back</Text>
          </TouchableOpacity>

          <Text style={[styles.title, { color: theme.accent }]}>
            {member?.codename || member?.name || 'Unknown Guardian'}
          </Text>

          <View style={styles.spacer} />
        </View>

        {/* Image Gallery */}
        <View style={styles.galleryContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={cardWidth + 24}
            decelerationRate="fast"
            contentContainerStyle={styles.gallery}
          >
            {images.map(renderImageCard)}
          </ScrollView>
        </View>

        {/* About Section */}
        <View style={[styles.aboutBox, { borderColor: theme.accent }]}>
          <Text style={[styles.aboutTitle, { color: theme.accent }]}>
            {member?.codename || 'Legendary Force'}
          </Text>
          <Text style={styles.aboutSubtitle}>
            {member?.name || 'Eternal Protector'}
          </Text>
          <Text style={[styles.aboutText, { color: theme.text }]}>
            {description}
          </Text>
        </View>

      </ScrollView>
    </View>
  );
};

// Color Themes
const themes = {
  guardians:    { bg: '#0a0a0a', accent: '#FFD700', backBg: 'rgba(255,215,0,0.18)', text: '#FFFFFF' },
  elementals:   { bg: '#000000', accent: '#FFFFFF', backBg: 'rgba(255,255,255,0.12)', text: '#FFFFFF' },
  justiceLeague:{ bg: '#001133', accent: '#00B3FF', backBg: 'rgba(0,179,255,0.22)', text: '#E0F7FF' },
  theSeven:     { bg: '#0D1B2A', accent: '#40C4FF', backBg: 'rgba(64,196,255,0.18)', text: '#BBDEFB' },
  heroes:       { bg: '#1C2526', accent: '#B8860B', backBg: 'rgba(184,134,11,0.25)', text: '#FFF8DC' },
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 120 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
    backgroundColor: 'rgba(0,0,0,0.88)',
    borderBottomWidth: 5,
    borderBottomColor: '#222',
  },

  backButton: {
    paddingHorizontal: 26,
    paddingVertical: 16,
    borderRadius: 18,
    borderWidth: 3,
    minWidth: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 22,
    fontWeight: '900',
    textShadowColor: '#000',
    textShadowRadius: 8,
  },

  title: {
    fontSize: 36,
    fontWeight: '900',
    textAlign: 'center',
    flex: 1,
    marginHorizontal: 30,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowRadius: 16,
    textShadowOffset: { width: 0, height: 3 },
  },

  spacer: { width: 110 }, // Perfect symmetry

  galleryContainer: { marginTop: 30 },
  gallery: { paddingHorizontal: 12, alignItems: 'center' },

  card: (isDesktop, w) => ({
    width: isDesktop ? w * 0.33 : SCREEN_WIDTH * 0.90,
    height: isDesktop ? SCREEN_HEIGHT * 0.80 : SCREEN_HEIGHT * 0.70,
    borderRadius: 30,
    overflow: 'hidden',
    marginHorizontal: 12,
    elevation: 22,
    shadowColor: '#000',
    shadowOpacity: 0.95,
    shadowRadius: 30,
    borderWidth: 4,
    borderColor: '#000',
  }),

  fullImage: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.52)' },

  copyrightText: {
    position: 'absolute',
    bottom: 28,
    left: 28,
    fontSize: 21,
    color: '#FFFFFF',
    fontWeight: '900',
    textShadowColor: '#000',
    textShadowRadius: 14,
    textShadowOffset: { width: 2, height: 2 },
    zIndex: 10,
  },

  aboutBox: {
    marginTop: 60,
    marginHorizontal: 20,
    padding: 38,
    backgroundColor: 'rgba(12,12,18,0.97)',
    borderRadius: 32,
    borderWidth: 5,
    shadowColor: '#000',
    shadowOpacity: 1,
    elevation: 20,
  },

  aboutTitle: {
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 12,
    textShadowRadius: 16,
  },

  aboutSubtitle: {
    fontSize: 23,
    color: '#CCCCCC',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 24,
  },

  aboutText: {
    fontSize: 18.5,
    lineHeight: 30,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});

export default JusticeCharacterDetail;