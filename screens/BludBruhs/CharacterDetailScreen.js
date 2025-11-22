// screens/BludBruhs/CharacterDetailScreen.js
import React, { useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Audio } from 'expo-av';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isDesktop = SCREEN_WIDTH > 600;

// Default lore fallback
const defaultDescriptions = {
  'Taylor': 'A star that burns brighter than the rest. Her presence commands silence, her will bends reality. Known to walk between realms.',
  'Adin': 'Born under the southern cross. A warrior of ancient bloodlines, guardian of forgotten oaths. His footsteps shake the earth.',
  'Justin Platt': 'Echo Wood — the voice that lingers in the forest long after he’s gone. Master of resonance, breaker of silence.',
  'Zack Dustin': 'Carved Echo — a soul etched into the world itself. His scars tell stories louder than words.',
  'default': 'A legend in the making. Their story is still being forged in fire and thunder.',
};

export default function CharacterDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const member = route.params?.member;

  if (!member) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No legend found.</Text>
      </View>
    );
  }

  // Use multiple images if provided, otherwise use single image
  const images = member.images || (member.image ? [member.image] : [require('../../assets/Armor/PlaceHolder.jpg')]);
  const description = member.description || defaultDescriptions[member.name] || defaultDescriptions.default;

  const cardWidth = isDesktop ? SCREEN_WIDTH * 0.45 : SCREEN_WIDTH * 0.88;

  return (
    <ImageBackground source={require('../../assets/BackGround/Bludbruh2.jpg')} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>

          {/* HEADER WITH BACK BUTTON */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>
              {member.codename || member.name || 'Unknown Legend'}
            </Text>
          </View>

          {/* HORIZONTAL IMAGE GALLERY */}
          <View style={styles.imageContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={cardWidth + 20}
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: 10 }}
            >
              {images.map((img, i) => (
                <View key={i} style={[styles.card, { width: cardWidth }]}>
                  <Image
                    source={typeof img === 'object' && img.uri ? img : { uri: img }}
                    style={styles.armorImage}
                    resizeMode="cover"
                  />
                  <View style={styles.overlay} />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* LORE SECTION */}
          <View style={styles.about}>
            <Text style={styles.codename}>{member.codename || 'Unknown Legend'}</Text>
            <Text style={styles.name}>{member.name || 'The Nameless'}</Text>
            <View style={styles.divider} />
            <Text style={styles.description}>{description}</Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { width: '100%', height: '100%' },
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  scrollContent: { paddingBottom: 80 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderBottomWidth: 3,
    borderBottomColor: '#00b3ff',
  },
  backBtn: {
    padding: 12,
    backgroundColor: 'rgba(0,179,255,0.3)',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#00b3ff',
  },
  backText: { fontSize: 28, color: '#00ffff', fontWeight: 'bold' },
  title: { flex: 1, textAlign: 'center', fontSize: 32, fontWeight: '900', color: '#00ffff', textShadowColor: '#00b3ff', textShadowRadius: 15 },

  imageContainer: { paddingVertical: 20 },
  card: {
    height: SCREEN_HEIGHT * 0.68,
    borderRadius: 20,
    overflow: 'hidden',
    marginHorizontal: 10,
    borderWidth: 4,
    borderColor: '#00b3ff',
    shadowColor: '#00b3ff',
    shadowOpacity: 1,
    shadowRadius: 25,
    elevation: 20,
  },
  armorImage: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },

  about: {
    marginTop: 30,
    padding: 30,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: 20,
    width: '92%',
    alignSelf: 'center',
    borderWidth: 3,
    borderColor: '#00b3ff',
  },
  codename: {
    fontSize: 36,
    color: '#00ffff',
    textAlign: 'center',
    fontWeight: '900',
    textShadowColor: '#00b3ff',
    textShadowRadius: 15,
  },
  name: {
    fontSize: 24,
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 10,
    fontStyle: 'italic',
  },
  divider: {
    height: 5,
    backgroundColor: '#00b3ff',
    marginVertical: 20,
    borderRadius: 3,
    shadowColor: '#00b3ff',
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  description: {
    fontSize: 18,
    color: '#ddd',
    lineHeight: 28,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});