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

// Screen dimensions
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// Background Images Array
const backgroundImages = [
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
  require('../../../assets/Halo/20.png'),
  require('../../../assets/Halo/21.jpg'),
  require('../../../assets/Halo/22.jpg'),
  require('../../../assets/Halo/23.jpg'),
  require('../../../assets/Halo/24.jpg'),
  require('../../../assets/Halo/25.jpg'),
  require('../../../assets/Halo/27.jpg'),
  require('../../../assets/Halo/28.jpg'),
  require('../../../assets/Halo/29.jpg'),
  require('../../../assets/Halo/30.jpg'),
  require('../../../assets/Halo/31.jpg'),
  require('../../../assets/Halo/32.png'),
  require('../../../assets/Halo/33.jpg'),
];

// Member Data
const members = [
  { name: 'Cam', codename: 'Court Chief', screen: 'Cam', clickable: true, position: [1, 0], image: require('../../../assets/Armor/Cam3.jpg') },
  { name: 'Ben', codename: 'Chemoshock', screen: 'BenP', clickable: true, position: [1, 1], image: require('../../../assets/Armor/Benp3.jpg') },
  { name: 'Alex', codename: 'Huntsman', screen: 'Alex', clickable: true, position: [1, 2], image: require('../../../assets/Armor/Alex3.jpg') },
];

// Hardcoded Vehicles
const HARDCODED_VEHICLES = [
  {
    id: 'vehicle-1',
    name: 'Warthog',
    description: 'All-terrain vehicle with a mounted turret, ideal for rapid deployment.',
    image: require('../../../assets/ShipYard/Spartan1.jpg'),
  },
  {
    id: 'vehicle-2',
    name: 'Scorpion',
    description: 'Heavy tank with a powerful cannon, designed for armored assaults.',
    image: require('../../../assets/ShipYard/Spartan2.jpg'),
  },
  {
    id: 'vehicle-3',
    name: 'Pelican',
    description: 'Dropship for troop and vehicle transport, equipped for atmospheric and space operations.',
    image: require('../../../assets/ShipYard/Spartan3.jpg'),
  },
  {
    id: 'vehicle-4',
    name: 'Mantis',
    description: 'Bipedal mech with missile launchers and a chaingun, built for heavy combat.',
    image: require('../../../assets/ShipYard/Spartan4.jpg'),
  },
  {
    id: 'vehicle-5',
    name: 'Banshee',
    description: 'Covenant-designed air vehicle with plasma cannons, used for aerial superiority.',
    image: require('../../../assets/ShipYard/Spartan5.jpg'),
  },
  {
    id: 'vehicle-6',
    name: 'Ghost',
    description: 'Light reconnaissance vehicle with high speed and twin plasma cannons.',
    image: require('../../../assets/ShipYard/Spartan6.jpg'),
  },
  {
    id: 'vehicle-7',
    name: 'Wraith',
    description: 'Covenant heavy mortar tank, delivering devastating plasma bombardments.',
    image: require('../../../assets/ShipYard/Spartan7.jpg'),
  },
];

// Placeholder Image
const PLACEHOLDER_IMAGE = require('../../../assets/Armor/PlaceHolder.jpg');

// Empty cell checker
const isEmpty = (row, col) =>
  (row === 0 && col === 0) ||
  (row === 0 && col === 1) ||
  (row === 0 && col === 2) ||
  (row === 2 && col === 0) ||
  (row === 2 && col === 1) ||
  (row === 2 && col === 2);

const getMemberAtPosition = (row, col) =>
  members.find((member) => member.position[0] === row && member.position[1] === col);

const SpartansScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [backgroundImage, setBackgroundImage] = useState(
    backgroundImages[Math.floor(Math.random() * backgroundImages.length)]
  );

  useEffect(() => {
    if (isFocused) {
      setBackgroundImage(backgroundImages[Math.floor(Math.random() * backgroundImages.length)]);
    }
  }, [isFocused]);

  const isDesktop = SCREEN_WIDTH > 600;
  const cardSize = isDesktop ? 320 : 100;
  const cardSpacing = isDesktop ? 120 : 30;
  const horizontalSpacing = isDesktop ? 40 : 20;
  const verticalSpacing = isDesktop ? 50 : 20;
  const vehicleCardSizes = {
    desktop: { width: 400, height: 600 },
    mobile: { width: SCREEN_WIDTH * 0.7, height: 400 },
  };

  const goToChat = () => {
    navigation.navigate('TeamChat');
  };

  const renderVehicle = (vehicle) => {
    const imageSource = vehicle.image || PLACEHOLDER_IMAGE;
    return (
      <View
        key={vehicle.id}
        style={[
          styles.vehicleCard,
          {
            width: isDesktop ? vehicleCardSizes.desktop.width : vehicleCardSizes.mobile.width,
            height: isDesktop ? vehicleCardSizes.desktop.height : vehicleCardSizes.mobile.height,
            marginRight: isDesktop ? 40 : 20,
          },
        ]}
      >
        <Image
          source={imageSource}
          style={styles.vehicleImage}
          resizeMode="cover"
          defaultSource={PLACEHOLDER_IMAGE}
          fadeDuration={0}
          cache="force-cache"
          onError={(e) => console.error("Vehicle image load error:", vehicle.id, "Error:", e.nativeEvent.error, "Source:", JSON.stringify(imageSource))}
        />
        <View style={styles.vehicleOverlay} />
      </View>
    );
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView
          style={styles.verticalScroll}
          contentContainerStyle={styles.verticalScrollContent}
        >
          {/* Header Section */}
          <View style={styles.headerWrapper}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                navigation.goBack();
              }}
            >
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.header}>The Spartans</Text>
            <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
              <Text style={styles.chatText}>🛡️</Text>
            </TouchableOpacity>
          </View>

          {/* Grid Layout */}
          <View style={[styles.grid, { gap: cardSpacing, minHeight: cardSize * 1.6 * 2.5 }]}>
            {[0, 1, 2].map((row) => (
              <View key={row} style={[styles.row, { gap: cardSpacing }]}>
                {[0, 1, 2].map((col) => {
                  if (isEmpty(row, col)) {
                    return <View key={col} style={{ width: cardSize, height: cardSize * 1.6 }} />;
                  }

                  const member = getMemberAtPosition(row, col);
                  return (
                    <TouchableOpacity
                      key={col}
                      style={[
                        styles.card,
                        { width: cardSize, height: cardSize * 1.6 },
                        !member?.clickable && styles.disabledCard,
                      ]}
                      onPress={() => {
                        if (member?.clickable) {
                          navigation.navigate(member.screen);
                        }
                      }}
                      disabled={!member?.clickable}
                    >
                      {member?.image && (
                        <>
                          <Image
                            source={member.image}
                            style={styles.characterImage}
                            resizeMode="cover"
                            fadeDuration={0}
                            cache="force-cache"
                            onError={(e) => console.error("Member image load error:", member.name, "Error:", e.nativeEvent.error)}
                          />
                          <View style={styles.transparentOverlay} />
                        </>
                      )}
                      <Text style={styles.codename}>{member?.codename || ''}</Text>
                      <Text style={styles.name}>{member?.name || ''}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>

          {/* Vehicle Bay */}
          <View style={styles.vehicleBay}>
            <View style={styles.vehicleHeaderWrapper}>
              <Text style={styles.vehicleHeader}>Vehicle Bay</Text>
            </View>
            <View style={styles.vehicleWindow}>
              <ScrollView
                horizontal
                contentContainerStyle={[styles.vehicleScroll, { paddingVertical: isDesktop ? 50 : 20 }]}
                showsHorizontalScrollIndicator={true}
              >
                {HARDCODED_VEHICLES.map((vehicle) => renderVehicle(vehicle))}
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
  },
  verticalScroll: {
    flex: 1,
  },
  verticalScrollContent: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  backButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
  },
  backText: {
    fontSize: 18,
    color: '#00b3ff',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    textShadowColor: 'yellow',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    textShadow: '0px 0px 15px yellow',
    backgroundColor: 'transparent',
    zIndex: 2,
    padding: 10,
  },
  chatButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
  },
  chatText: {
    fontSize: 20,
    color: '#00b3ff',
  },
  grid: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  card: {
    backgroundColor: 'rgba(28, 28, 28, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 255, 0.3)',
  },
  characterImage: {
    width: '100%',
    height: '70%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1,
  },
  codename: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  name: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#aaa',
    textAlign: 'center',
  },
  disabledCard: {
    backgroundColor: '#444',
    borderColor: 'transparent',
  },
  vehicleBay: {
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  vehicleHeaderWrapper: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    width: '100%',
  },
  vehicleHeader: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    textShadowColor: 'yellow',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
    textShadow: '0px 0px 15px yellow',
    backgroundColor: 'transparent',
    zIndex: 2,
    padding: 10,
  },
  vehicleWindow: {
    width: '100%',
    overflow: 'hidden',
  },
  vehicleScroll: {
    flexDirection: 'row',
    flexGrow: 1,
    width: 'auto',
    alignItems: 'center',
  },
  vehicleCard: {
    backgroundColor: 'rgba(28, 28, 28, 0.7)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 179, 255, 0.3)',
  },
  vehicleImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  vehicleOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1,
  },
});

export default SpartansScreen;