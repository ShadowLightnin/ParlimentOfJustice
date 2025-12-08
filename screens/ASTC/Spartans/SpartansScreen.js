import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';

// 🔊 import from ASTC (adjust path if needed)
import {
  playBackgroundMusic,
  pauseBackgroundMusic,
} from '../../ASTC/ASTCScreen';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const backgroundImages = [
  require('../../../assets/BackGround/ASTC.jpg'),
  require('../../../assets/Halo/26.jpg'),
  require('../../../assets/Halo/5.jpg'),
  require('../../../assets/Halo/9.jpg'),
  require('../../../assets/Halo/9.png'),
  require('../../../assets/Halo/10.jpg'),
  require('../../../assets/Halo/11.jpg'),
  require('../../../assets/Halo/13.jpg'),
  require('../../../assets/Halo/15.jpg'),
  require('../../../assets/Halo/16.jpg'),
  require('../../../assets/Halo/18.jpg'),
  require('../../../assets/Halo/19.jpg'),
  require('../../../assets/BackGround/ASTC.jpg'),
  require('../../../assets/BackGround/ASTC.jpg'),
  require('../../../assets/Halo/20.png'),
  require('../../../assets/Halo/21.jpg'),
  require('../../../assets/Halo/22.jpg'),
  require('../../../assets/Halo/23.jpg'),
  require('../../../assets/Halo/24.jpg'),
  require('../../../assets/Halo/25.jpg'),
  require('../../../assets/Halo/27.jpg'),
  require('../../../assets/BackGround/ASTC.jpg'),
  require('../../../assets/BackGround/ASTC.jpg'),
  require('../../../assets/Halo/28.jpg'),
  require('../../../assets/Halo/29.jpg'),
  require('../../../assets/Halo/30.jpg'),
  require('../../../assets/Halo/31.jpg'),
  require('../../../assets/Halo/32.png'),
  require('../../../assets/Halo/33.jpg'),
  require('../../../assets/BackGround/ASTC.jpg'),
  require('../../../assets/BackGround/ASTC.jpg'),
  require('../../../assets/BackGround/ASTC.jpg'),
];

const members = [
  { name: 'Cam', codename: 'Court Chief', screen: 'Cam', clickable: true, image: require('../../../assets/Armor/Cam4.jpg') },
  { name: 'Ben', codename: 'Chemoshock', screen: 'BenP', clickable: true, image: require('../../../assets/Armor/Benp3.jpg') },
  { name: 'Alex', codename: 'Huntsman', screen: 'Alex', clickable: true, image: require('../../../assets/Armor/Alex3.jpg') },
];

const HARDCODED_VEHICLES = [
  { id: 'vehicle-1', name: 'Harbinger', description: 'The Spartans primary ship, good for long away missions, espionage, and infiltration operations.', image: require('../../../assets/ShipYard/Spartan1.jpg') },
  { id: 'vehicle-2', name: 'Stalker', description: 'The Spartans secondary ship, used for quick strikes, stealth, and hunting.', image: require('../../../assets/ShipYard/Spartan2.jpg') },
  { id: 'vehicle-3', name: 'Warthog', description: 'The Spartans all-terrain vehicle, designed for rapid deployment and versatile combat scenarios.', image: require('../../../assets/ShipYard/Spartan3.jpg') },
  { id: 'vehicle-4', name: 'Roadlander', description: 'The Spartans heavy-duty vehicle, built for rugged terrain and heavy loads.', image: require('../../../assets/ShipYard/Spartan4.jpg') },
  { id: 'vehicle-5', name: 'Hunterall', description: 'The Spartans heavy assault vehicle, designed for frontline combat and heavy firepower.', image: require('../../../assets/ShipYard/Spartan5.jpg') },
  { id: 'vehicle-6', name: 'Alecoma', description: 'The Spartans tactical support vehicle, equipped for reconnaissance and support operations with a mounted turret.', image: require('../../../assets/ShipYard/Spartan6.jpg') },
  { id: 'vehicle-7', name: 'Benshie', description: 'The Spartans big truck with lots of firepower, designed for heavy-duty transport and combat support.', image: require('../../../assets/ShipYard/Spartan7.jpg') },
  { id: 'vehicle-8', name: 'Camborghini', description: 'Need to get somewhere fast? The Spartans luxury vehicle, designed for speed and style.', image: require('../../../assets/ShipYard/Camborghini.jpg') },
  { id: 'vehicle-9', name: 'Mongoose', description: 'The Spartans light utility vehicle, designed for quick maneuvers and agile operations. And knolls.', image: require('../../../assets/ShipYard/Mongoose.jpg') },
  { id: 'vehicle-10', name: 'ATK', description: 'The Spartans ATK vehicle, designed for rapid deployment and heavy dune rides', image: require('../../../assets/ShipYard/ATK.jpg') },
  { id: 'vehicle-11', name: 'Camustacge', description: 'The Spartans loud vehicle, designed for sportsman operations and quick insertions.', image: require('../../../assets/ShipYard/Camustacge.jpg') },
];

const PLACEHOLDER_IMAGE = require('../../../assets/splash-icon.png');

const SpartansScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [backgroundImage, setBackgroundImage] = useState(backgroundImages[0]);
  const [currentVehicleIndex, setCurrentVehicleIndex] = useState(0);

  const isDesktop = SCREEN_WIDTH > 600;
  const cardSize = isDesktop ? 320 : 110;
  const cardSpacing = isDesktop ? 80 : 20;

  const vehicleWidth = SCREEN_WIDTH * (isDesktop ? 0.9 : 1);

  // 🔊 track play/pause UI state (music itself is handled by shared helpers)
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);

  // 🔽 Lore overlay state + animation
  const [infoOpen, setInfoOpen] = useState(false);
  const infoAnim = useRef(new Animated.Value(0)).current;

  const toggleInfo = () => {
    if (infoOpen) {
      Animated.timing(infoAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start(() => setInfoOpen(false));
    } else {
      setInfoOpen(true);
      Animated.timing(infoAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  };

  useEffect(() => {
    if (isFocused) {
      setBackgroundImage(
        backgroundImages[Math.floor(Math.random() * backgroundImages.length)]
      );
    }
    // Music lifecycle is controlled by ASTC + header button
  }, [isFocused]);

  const goToChat = () => navigation.navigate('TeamChat');

  const toggleMusic = async () => {
    if (isMusicPlaying) {
      await pauseBackgroundMusic();
      setIsMusicPlaying(false);
    } else {
      await playBackgroundMusic();
      setIsMusicPlaying(true);
    }
  };

  const renderVehicle = (vehicle) => {
    const imageSource = vehicle.image || PLACEHOLDER_IMAGE;
    return (
      <View
        key={vehicle.id}
        style={[
          styles.vehicleCard,
          {
            width: vehicleWidth,
            height: isDesktop ? 520 : 380,
          },
        ]}
      >
        <Image source={imageSource} style={styles.vehicleImage} resizeMode="cover" />
        <View style={styles.vehicleGlassOverlay} />
        <Text style={styles.vehicleName}>{vehicle.name}</Text>
        <Text style={styles.vehicleDescription}>{vehicle.description}</Text>
      </View>
    );
  };

  const renderMemberCard = (member) => (
    <TouchableOpacity
      key={member.name}
      style={[
        styles.card,
        {
          width: cardSize,
          height: cardSize * 1.6,
        },
      ]}
      onPress={() => member.clickable && navigation.navigate(member.screen)}
      disabled={!member.clickable}
      activeOpacity={0.9}
    >
      <Image source={member.image} style={styles.characterImage} resizeMode="cover" />
      <View style={styles.memberOverlay} />

      <View style={styles.textWrapper}>
        <Text style={[styles.name, isDesktop ? styles.nameDesktop : styles.nameMobile]}>
          {member.name}
        </Text>
        <Text
          style={[
            styles.codename,
            isDesktop ? styles.codenameDesktop : styles.codenameMobile,
          ]}
          numberOfLines={isDesktop ? 1 : 3}
        >
          {member.codename}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
      <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* HEADER */}
            <View style={styles.headerWrapper}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.85}
              >
                <Text style={styles.backText}>⬅️ Back</Text>
              </TouchableOpacity>

              {/* Tap center glass to toggle Spartans lore */}
              <TouchableOpacity
                style={styles.headerCenter}
                onPress={toggleInfo}
                activeOpacity={0.9}
              >
                <View style={styles.headerGlass}>
                  <Text style={styles.headerTitle}>The Spartans</Text>
                  <Text style={styles.headerSubtitle}>
                    The Elite Commandos of The Parliament
                  </Text>
                  <Text style={styles.infoHint}>Tap for team lore ⬇</Text>
                </View>
              </TouchableOpacity>

              {/* RIGHT SIDE: music + chat */}
              <View style={styles.headerRight}>
                <TouchableOpacity
                  onPress={toggleMusic}
                  style={styles.musicButton}
                  activeOpacity={0.85}
                >
                  <Text style={styles.musicText}>
                    {isMusicPlaying ? '⏸' : '▶️'}
                  </Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                  onPress={goToChat}
                  style={styles.chatButton}
                  activeOpacity={0.85}
                >
                  <Text style={styles.chatText}>🛡️</Text>
                </TouchableOpacity> */}
              </View>
            </View>

            {/* MEMBER CARDS */}
            <View style={[styles.memberRow, { gap: cardSpacing }]}>
              {members.map(renderMemberCard)}
            </View>

            {/* VEHICLE BAY */}
            <View style={styles.vehicleBay}>
              <Text style={styles.vehicleHeader}>Vehicle Bay</Text>
              <View style={styles.vehicleWindow}>
                <ScrollView
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  style={{ width: vehicleWidth }}
                  onScroll={(e) =>
                    setCurrentVehicleIndex(
                      Math.round(
                        e.nativeEvent.contentOffset.x / vehicleWidth
                      )
                    )
                  }
                  scrollEventThrottle={16}
                >
                  {HARDCODED_VEHICLES.map(renderVehicle)}
                </ScrollView>
                <View style={styles.dotContainer}>
                  {HARDCODED_VEHICLES.map((_, i) => (
                    <View
                      key={i}
                      style={[
                        styles.dot,
                        { backgroundColor: i === currentVehicleIndex ? '#00e1ff' : '#555' },
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>

          {/* LORE OVERLAY – ON TOP OF EVERYTHING */}
          <Animated.View
            pointerEvents={infoOpen ? 'auto' : 'none'}
            style={[
              styles.infoPanelContainer,
              {
                opacity: infoAnim,
                transform: [
                  {
                    translateY: infoAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {infoOpen && (
              <View style={styles.infoPanel}>
                <View style={styles.infoHeaderRow}>
                  <Text style={styles.infoTitle}>The Spartans</Text>
                  <TouchableOpacity
                    onPress={toggleInfo}
                    hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                  >
                    <Text style={styles.infoClose}>✕</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.infoText}>
                  The Spartans are the Parliament&apos;s elite commando squad — the
                  small, tight-knit fireteam you send in when planets are burning and
                  there&apos;s no backup coming. They hit hard, move fast, and bring
                  their all. Stealth, precision, and overwhelming force are their
                  trademarks, and they never leave a teammate behind.
                </Text>

                <Text style={styles.infoLabel}>What they represent</Text>
                <Text style={styles.infoText}>
                  Precision, loyalty, and boots-on-the-ground heroism. Where the
                  Titans handle major headlines, the Spartans handle the missions no
                  one hears about — boarding actions, black ops rescues, Great Escapes, and holding
                  the line so everyone else can live to see another day.
                </Text>

                <Text style={styles.infoLabel}>
                  Enemy types they specialize against
                </Text>
                <Text style={styles.infoText}>
                  • Organized militaries, warlords, and planetary invasions{'\n'}
                  • Other worldly incursions and espionage{'\n'}
                  • Armored convoys, fortress assaults, and hostile vehicle warfare
                </Text>
              </View>
            )}
          </Animated.View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { width: '100%', height: '100%' },
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 6,
  },

  // HEADER
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 8,
    marginBottom: 24,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0,240,255,0.9)',
    backgroundColor: 'rgba(5,15,25,0.95)',
  },
  backText: {
    fontSize: 13,
    color: '#e8fcff',
    fontWeight: 'bold',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerGlass: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(5,20,40,0.9)',
    borderWidth: 1,
    borderColor: 'rgba(0,240,255,0.9)',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#e6fbff',
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
    color: '#7be9ff',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  infoHint: {
    marginTop: 2,
    fontSize: 10,
    textAlign: 'center',
    color: 'rgba(190,240,255,0.9)',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  musicButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0,240,255,0.9)',
    backgroundColor: 'rgba(5,15,25,0.95)',
    marginRight: 4,
  },
  musicText: {
    fontSize: 16,
    color: '#00e1ff',
    fontWeight: 'bold',
  },
  chatButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0,240,255,0.9)',
    backgroundColor: 'rgba(5,15,25,0.95)',
  },
  chatText: { fontSize: 18, color: '#00e1ff' },

  // INFO PANEL OVERLAY
  infoPanelContainer: {
    position: 'absolute',
    top: 80, // just under header
    left: 10,
    right: 10,
    zIndex: 20,
  },
  infoPanel: {
    backgroundColor: 'rgba(3,10,20,0.97)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(0,240,255,0.9)',
  },
  infoHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#e6fbff',
  },
  infoClose: {
    fontSize: 16,
    color: '#00e1ff',
  },
  infoLabel: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00e1ff',
  },
  infoText: {
    fontSize: 12,
    color: 'rgba(220,245,255,0.95)',
    marginTop: 2,
    lineHeight: 16,
  },

  // MEMBERS
  memberRow: {
    flexDirection: 'row',
    marginVertical: 20,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 2,
    borderColor: '#00e1ff',
    backgroundColor: 'rgba(0, 179, 255, 0.08)',
    shadowColor: '#00e1ff',
    shadowOpacity: 0.9,
    shadowRadius: 18,
    elevation: 14,
  },
  characterImage: { width: '100%', height: '100%' },
  memberOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  textWrapper: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    padding: 4,
  },
  codename: {
    fontWeight: 'bold',
    color: '#00e1ff',
    textShadowColor: '#00e1ff',
    textShadowRadius: 14,
    zIndex: 2,
  },
  name: {
    color: '#ffffff',
    textShadowColor: '#00e1ff',
    textShadowRadius: 14,
    zIndex: 2,
  },
  codenameDesktop: { position: 'absolute', bottom: 10, left: 10, fontSize: 16 },
  nameDesktop: { position: 'absolute', bottom: 32, left: 10, fontSize: 14 },
  codenameMobile: {
    fontSize: 13,
    lineHeight: 17,
    textAlign: 'left',
  },
  nameMobile: {
    fontSize: 11,
    marginBottom: 2,
    textAlign: 'left',
  },

  // VEHICLE BAY
  vehicleBay: { width: '100%', alignItems: 'center', marginTop: 10 },
  vehicleHeader: {
    fontSize: 24,
    fontWeight: '900',
    color: '#e6fbff',
    textShadowColor: '#00e1ff',
    textShadowRadius: 18,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  vehicleWindow: {
    width: '100%',
    alignItems: 'center',
  },
  vehicleCard: {
    borderRadius: 20,
    overflow: 'hidden',
    alignSelf: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0,240,255,0.9)',
    backgroundColor: 'rgba(5,15,25,0.95)',
    shadowColor: '#00e1ff',
    shadowOpacity: 0.9,
    shadowRadius: 22,
    elevation: 16,
    marginHorizontal: SCREEN_WIDTH * 0.05,
  },
  vehicleImage: { width: '100%', height: '100%' },
  vehicleGlassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  vehicleName: {
    position: 'absolute',
    top: 22,
    left: 20,
    right: 20,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00e1ff',
    textShadowColor: '#000',
    textShadowRadius: 10,
  },
  vehicleDescription: {
    position: 'absolute',
    bottom: 26,
    left: 20,
    right: 20,
    fontSize: 15,
    color: '#eaf8ff',
    textShadowColor: '#000',
    textShadowRadius: 8,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 5 },
});

export default SpartansScreen;
