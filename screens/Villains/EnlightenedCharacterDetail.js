// EnlightenedCharacterDetail.js (as requested - unique name)
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
import descriptions from './VillainDescriptions'; // Use the new description file

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const EnlightenedCharacterDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { member } = route.params || {};

  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);
  const isDesktop = windowWidth >= 768;
  const cardWidth = isDesktop ? windowWidth * 0.35 : SCREEN_WIDTH * 0.92;

  useEffect(() => {
    const update = () => setWindowWidth(Dimensions.get('window').width);
    const sub = Dimensions.addEventListener('change', update);
    return () => sub?.remove();
  }, []);

  // Theme for Villains (red) and Big Bads (purple)
  const getTheme = () => {
    if (!member?.name) return themes.villains;

    const n = member.name.toLowerCase();
    if (bigBadsNames.some(b => n.includes(b))) {
      return themes.bigBads;
    }
    return themes.villains;
  };

  const bigBadsNames = ['obsian', 'umbra nex', 'kaidan vyros', 'stormshade', 'void conqueror', 'erevos', 'almarra', 'vortigar', 'torath', 'hextator', 'lord dravak', 'arcane devos', 'archon ultivax', 'sovereign xal-zor', 'emperor obsidian', 'admiral scyphos', 'admiral', "zein'roe", 'devoes', 'cronos', "cor'vas"];

  const theme = getTheme();

  const copyright = `© ${member?.name || 'Unknown Shadow'} — William Cummings`;

  const images = member?.images?.length > 0
    ? member.images.map(img => ({ uri: img, copyright }))
    : member?.image
    ? [{ uri: member.image, copyright }]
    : [{ uri: require('../../assets/Armor/PlaceHolder.jpg'), copyright }];

  const description = descriptions[member?.name] ||
    'A dark force whose malice reshapes worlds in shadow. Their reign is eternal.';

  const renderImageCard = (img, i) => {
    const source = typeof img.uri === 'object' ? img.uri : { uri: img.uri };
    return (
      <TouchableOpacity
        key={i}
        style={[styles.card(isDesktop, windowWidth)]}
        activeOpacity={0.85}
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

        {/* Aligned Header */}
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
            {member?.name || member?.codename || 'Unknown Shadow'}
          </Text>

          <View style={styles.spacer} />
        </View>

        {/* Gallery */}
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

        {/* About */}
        <View style={[styles.aboutBox, { borderColor: theme.accent }]}>
          <Text style={[styles.aboutTitle, { color: theme.accent }]}>
            {member?.name || 'Shadow Force'}
          </Text>
          <Text style={styles.aboutSubtitle}>
            {member?.codename || 'Eternal Malice'}
          </Text>
          <Text style={[styles.aboutText, { color: theme.text }]}>
            {description}
          </Text>
        </View>

      </ScrollView>
    </View>
  );
};

// Themes for Villains (Red) & Big Bads (Purple)
const themes = {
  villains: { bg: '#0a0a0a', accent: '#FF0000', backBg: 'rgba(255,0,0,0.18)', text: '#FFFFFF' },
  bigBads: { bg: '#0a0a0a', accent: '#800080', backBg: 'rgba(128,0,128,0.18)', text: '#FFFFFF' },
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

  spacer: { width: 110 },

  galleryContainer: { marginTop: 30 },
  gallery: { paddingHorizontal: 12, alignItems: 'center' },

  card: (isDesktop, w) => ({
    width: isDesktop ? w * 0.35 : SCREEN_WIDTH * 0.92,
    height: isDesktop ? SCREEN_HEIGHT * 0.82 : SCREEN_HEIGHT * 0.72,
    borderRadius: 30,
    overflow: 'hidden',
    marginHorizontal: 12,
    elevation: 22,
    borderWidth: 4,
    borderColor: '#111',
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
  },

  aboutBox: {
    marginTop: 60,
    marginHorizontal: 20,
    padding: 38,
    backgroundColor: 'rgba(12,12,18,0.97)',
    borderRadius: 32,
    borderWidth: 5,
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

export default EnlightenedCharacterDetail;