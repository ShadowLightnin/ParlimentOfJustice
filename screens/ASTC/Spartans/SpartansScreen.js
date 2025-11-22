import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';

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

  useEffect(() => {
    if (isFocused) {
      setBackgroundImage(backgroundImages[Math.floor(Math.random() * backgroundImages.length)]);
    }
  }, [isFocused]);

  const isDesktop = SCREEN_WIDTH > 600;
  const cardSize = isDesktop ? 320 : 100;
  const cardSpacing = isDesktop ? 120 : 30;

  const goToChat = () => navigation.navigate('TeamChat');

  const renderVehicle = (vehicle) => {
    const imageSource = vehicle.image || PLACEHOLDER_IMAGE;
    return (
      <View
        key={vehicle.id}
        style={[
          styles.vehicleCard,
          {
            width: SCREEN_WIDTH,
            height: isDesktop ? 600 : 400,
            borderWidth: 2,
            borderColor: '#00b3ff',
            backgroundColor: 'rgba(0, 179, 255, 0.1)',
            shadowColor: '#00b3ff',
            shadowOpacity: 0.9,
            shadowRadius: 15,
            elevation: 12,
          },
        ]}
      >
        <Image source={imageSource} style={styles.vehicleImage} resizeMode="cover" />
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
          borderWidth: 2,
          borderColor: '#00b3ff',
          backgroundColor: 'rgba(0, 179, 255, 0.1)',
          shadowColor: '#00b3ff',
          shadowOpacity: 1,
          shadowRadius: 16,
          elevation: 14,
        },
      ]}
      onPress={() => member.clickable && navigation.navigate(member.screen)}
      disabled={!member.clickable}
    >
      <Image source={member.image} style={styles.characterImage} resizeMode="cover" />

      {/* YOUR ORIGINAL LOOK — NOW RESPONSIVE */}
      <View style={styles.textWrapper}>
        <Text style={[styles.name, isDesktop ? styles.nameDesktop : styles.nameMobile]}>
          {member.name}
        </Text>
        <Text
          style={[styles.codename, isDesktop ? styles.codenameDesktop : styles.codenameMobile]}
          numberOfLines={isDesktop ? 1 : 3}
        >
          {member.codename}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={backgroundImage} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.headerWrapper}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
            <Text style={[styles.header, { padding: isDesktop ? 5 : 8 }]}>The Spartans</Text>
            <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
              <Text style={styles.chatText}>🛡️</Text>
            </TouchableOpacity>
          </View>

          {/* Member Cards */}
          <View style={styles.memberRow}>
            {members.map(renderMemberCard)}
          </View>

          {/* Vehicle Bay */}
          <View style={styles.vehicleBay}>
            <Text style={styles.vehicleHeader}>Vehicle Bay</Text>
            <View style={styles.vehicleWindow}>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={(e) => setCurrentVehicleIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH))}
                scrollEventThrottle={16}
              >
                {HARDCODED_VEHICLES.map(renderVehicle)}
              </ScrollView>
              <View style={styles.dotContainer}>
                {HARDCODED_VEHICLES.map((_, i) => (
                  <View
                    key={i}
                    style={[styles.dot, { backgroundColor: i === currentVehicleIndex ? '#00b3ff' : '#666' }]}
                  />
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { width: '100%', height: '100%' },
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  scrollContent: { flexGrow: 1, alignItems: 'center', paddingVertical: 20 },

  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  backButton: { padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
  backText: { fontSize: 18, color: '#00b3ff', fontWeight: 'bold' },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'yellow',
    textShadowRadius: 15,
    flex: 1,
    textAlign: 'center',
  },
  chatButton: { padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
  chatText: { fontSize: 24, color: '#00b3ff' },

  memberRow: {
    flexDirection: 'row',
    gap: SCREEN_WIDTH > 600 ? 120 : 30,
    marginVertical: 40,
    justifyContent: 'center',
  },

  card: { borderRadius: 12, overflow: 'hidden', position: 'relative' },
  characterImage: { width: '100%', height: '100%' },

  // MAGIC TEXT WRAPPER — YOUR STYLE, NOW PERFECT
  textWrapper: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    padding: 4,
  },

  codename: {
    fontWeight: 'bold',
    color: '#00b3ff',
    textShadowColor: '#00b3ff',
    textShadowRadius: 14,
    zIndex: 2,
  },
  name: {
    color: '#fff',
    textShadowColor: '#00b3ff',
    textShadowRadius: 14,
    zIndex: 2,
  },

  // DESKTOP — 100% YOUR ORIGINAL BADASS LOOK
  codenameDesktop: { position: 'absolute', bottom: 14, left: 12, fontSize: 18 },
  nameDesktop:    { position: 'absolute', bottom: 38, left: 12, fontSize: 15 },

  // MOBILE — WRAPS CLEANLY, NAME MOVES UP
  codenameMobile: {
    fontSize: 14,
    lineHeight: 17,
    textAlign: 'left',
  },
  nameMobile: {
    fontSize: 12,
    marginBottom: 2,
    textAlign: 'left',
  },

  // Vehicle Bay — Untouched & Perfect
  vehicleBay: { width: '100%', alignItems: 'center', marginTop: 20 },
  vehicleHeader: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textShadowColor: 'yellow',
    textShadowRadius: 15,
    marginBottom: 15,
  },
  vehicleWindow: { width: '100%' },
  vehicleCard: { borderRadius: 16, overflow: 'hidden' },
  vehicleImage: { width: '100%', height: '100%' },
  vehicleName: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00b3ff',
    textShadowColor: '#00b3ff',
    textShadowRadius: 16,
    zIndex: 2,
  },
  vehicleDescription: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    fontSize: 16,
    color: '#fff',
    textShadowColor: '#000',
    textShadowRadius: 8,
    zIndex: 2,
  },
  dotContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 15 },
  dot: { width: 10, height: 10, borderRadius: 5, marginHorizontal: 6 },
});

export default SpartansScreen;