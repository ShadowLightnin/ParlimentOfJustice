import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  ImageBackground
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;

// Card dimensions for desktop and mobile (Matching Big Bads)
const cardSizes = {
  desktop: { width: 400, height: 600 },
  mobile: { width: 350, height: 500 },
};
const horizontalSpacing = isDesktop ? 40 : 20; 
const verticalSpacing = isDesktop ? 50 : 20;


// Villains data with images & respective screens
const villains = [
  { name: 'Fjord', screen: 'FjordScreen', image: require('../../assets/Villains/Fjord.jpg'), clickable: true },
  { name: 'Judge Hex', screen: 'JudgeHexScreen', image: require('../../assets/Villains/JudgeHex.jpg'), clickable: true },
  { name: 'Wraithblade', screen: 'WraithbladeScreen', image: require('../../assets/Villains/Wraithblade.jpg'), clickable: true },
  { name: 'Harbinger', screen: 'HarbingerScreen', image: require('../../assets/Villains/Harbinger.jpg'), clickable: true },
  { name: 'Venom Fang', screen: 'VenomFangScreen', image: require('../../assets/Villains/VenomFang.jpg'), clickable: true },
  { name: 'Shatterbloom', screen: 'ShatterbloomScreen', image: require('../../assets/Villains/Shatterbloom.jpg'), clickable: true },
  { name: 'Harbinger Dove', screen: 'HarbingerDoveScreen', image: require('../../assets/Villains/HarbingerDove.jpg'), clickable: true },
  { name: 'Byte Ruin', screen: 'ByteRuinScreen', image: require('../../assets/Villains/ByteRuin.jpg'), clickable: true },
  { name: 'Shade Weaver', screen: 'ShadeWeaverScreen', image: require('../../assets/Villains/ShadeWeaver.jpg'), clickable: true },
  { name: 'Rage Vortex', screen: 'RageVortexScreen', image: require('../../assets/Villains/RageVortex.jpg'), clickable: true },
  { name: "Mal'likhan", screen: 'MallikhanScreen', image: require('../../assets/Villains/Mallikhan.jpg'), clickable: true },
  { name: 'Elder Pyrrhus', screen: 'ElderPyrrhusScreen', image: require('../../assets/Villains/ElderPyrrhus.jpg'), clickable: true },
  { name: 'Dark Envoy', screen: 'DarkEnvoyScreen', image: require('../../assets/Villains/DarkEnvoy.jpg'), clickable: true },
  { name: 'Spectral Wraith', screen: 'SpectralWraithScreen', image: require('../../assets/Villains/SpectralWraith.jpg'), clickable: true },
  { name: 'Harrier', screen: 'HarrierScreen', image: require('../../assets/Villains/Harrier.jpg'), clickable: true },
  { name: 'Shade Widow', screen: 'ShadeWidowScreen', image: require('../../assets/Villains/ShadeWidow.jpg'), clickable: true },
  { name: 'Gilded Shard', screen: 'GildedShardScreen', image: require('../../assets/Villains/GildedShard.jpg'), clickable: true },
  { name: 'Chrome Phoenix', screen: 'ChromePhoenixScreen', image: require('../../assets/Villains/ChromePhoenix.jpg'), clickable: true },
  { name: 'Hades Ravage', screen: 'HadesRavageScreen', image: require('../../assets/Villains/HadesRavage.jpg'), clickable: true },
  { name: 'Spectral Warlord', screen: 'SpectralWarlordScreen', image: require('../../assets/Villains/SpectralWarlord.jpg'), clickable: true },
  { name: 'Virus Vortex', screen: 'VirusVortexScreen', image: require('../../assets/Villains/VirusVortex2.jpg'), clickable: true },
  { name: 'Shade Stalker', screen: 'ShadeStalkerScreen', image: require('../../assets/Villains/ShadeStalker.jpg'), clickable: true },
  { name: 'Volt Shade', screen: 'VoltShadeScreen', image: require('../../assets/Villains/VoltShade.jpg'), clickable: true },
  { name: 'Sable', screen: 'SableScreen', image: require('../../assets/Villains/Sable.jpg'), clickable: true },
  { name: 'Steel Juggernaut', screen: 'SteelJuggernautScreen', image: require('../../assets/Villains/SteelJuggernaut.jpg'), clickable: true },
  { name: 'Warhound', screen: 'WarhoundScreen', image: require('../../assets/Villains/Warhound.jpg'), clickable: true },
  { name: 'Overmind', screen: 'OvermindScreen', image: require('../../assets/Villains/Overmind.jpg'), clickable: true },
  { name: 'Obsidian Shroud', screen: 'ObsidianShroudScreen', image: require('../../assets/Villains/ObsidianShroud.jpg'), clickable: true },
  { name: 'Fangstrike', screen: 'FangstrikeScreen', image: require('../../assets/Villains/Fangstrike.jpg'), clickable: true },
  { name: 'Void Phantom', screen: 'VoidPhantomScreen', image: require('../../assets/Villains/VoidPhantom.jpg'), clickable: true },
  { name: 'Chrona', screen: '', image: require('../../assets/Villains/Chrona.jpg'), clickable: false },
  { name: 'Noctura', screen: '', image: require('../../assets/Villains/Noctura.jpg'), clickable: false },
  { name: 'Red Mercury', screen: '', image: require('../../assets/Villains/RedMercury.jpg'), clickable: false },
  { name: 'Titanus', screen: '', image: require('../../assets/Villains/Titanus.jpg'), clickable: false },


  // { name: 'Soulless Soul', screen: 'SoullessSoulScreen', image: require('../../assets/Villains/SoullessSoul.jpg'), clickable: true },
  // { name: 'The Void', screen: 'TheVoidScreen', image: require('../../assets/Villains/TheVoid.jpg'), clickable: true },
  // { name: 'Shadow Scribe', screen: 'ShadowScribeScreen', image: require('../../assets/Villains/ShadowScribe.jpg'), clickable: true },
  // { name: 'Bloody Harbinger', screen: 'BloodyHarbingerScreen', image: require('../../assets/Villains/BloodyHarbinger.jpg'), clickable: true },
  // { name: 'Unholy Vortex', screen: 'UnholyVortexScreen', image: require('../../assets/Villains/UnholyVortex.jpg'), clickable: true },
  // { name: 'Shadow Stalker', screen: 'ShadowStalkerScreen', image: require('../../assets/Villains/ShadowStalker.jpg'), clickable: true },
  // { name: '', screen: '', image: require('../../assets/Villains/.jpg'), clickable: false },

];

const VillainsTab = () => {
  const navigation = useNavigation();

  // Render Each Villain Card
  const renderVillainCard = (villain) => (
    <TouchableOpacity
      key={villain.name}
      style={[
        styles.card,
        {
          width: isDesktop ? cardSizes.desktop.width : cardSizes.mobile.width,
          height: isDesktop ? cardSizes.desktop.height : cardSizes.mobile.height
        },
        villain.clickable ? styles.clickable : styles.notClickable
      ]}
      onPress={() => villain.clickable && navigation.navigate(villain.screen)}
      disabled={!villain.clickable}
    >
      <Image source={villain.image} style={styles.image} />
      <Text style={styles.name}>{villain.name}</Text>
      {!villain.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Villains.jpg')}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>⬅️ Back</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.header}>Villains</Text>

        {/* Horizontal Scrollable Villains Grid */}
        <View style={styles.scrollWrapper}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.scrollContainer}
            showsHorizontalScrollIndicator={true}
          >
            {villains.map(renderVillainCard)}
          </ScrollView>
        </View>
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
    left: 20,
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
    width: SCREEN_WIDTH,  // Ensures scroll space
    flex: 1,
  },
  scrollContainer: {
    flexDirection: 'row',
    flexGrow: 1, // Ensures scrollable content expands naturally
    width: 'auto',
    paddingVertical: verticalSpacing,
    alignItems: 'center',
  },
  card: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    marginRight: horizontalSpacing,
  },
  clickable: {
    borderColor: 'red',
    borderWidth: 2,
  },
  notClickable: {
    opacity: 0.8,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
});

export default VillainsTab;