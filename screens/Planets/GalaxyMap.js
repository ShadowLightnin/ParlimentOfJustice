// screens/Planets/GalaxyMap.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Image,
  Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// High-level systems, each linked to a primary world in that system
const SYSTEMS = [
  {
    name: 'Sol System',
    planetId: 'earth', // primary world to warp to
    image: require('../../assets/Space/Earth.jpg'),
    x: SCREEN_WIDTH * 0.25,
    y: SCREEN_HEIGHT * 0.35,
  },
  {
    name: 'Ignis Prime System',
    planetId: 'ignis-prime',
    image: require('../../assets/Space/Melcornia.jpg'),
    x: SCREEN_WIDTH * 0.55,
    y: SCREEN_HEIGHT * 0.42,
  },
  {
    name: 'Zaxxon System',
    planetId: 'zaxxon',
    image: require('../../assets/Space/Zaxxon.jpg'),
    x: SCREEN_WIDTH * 0.78,
    y: SCREEN_HEIGHT * 0.32,
  },
];

// Simple connections between systems (from planetId → planetId)
const CONNECTIONS = [
  { from: 'earth', to: 'ignis-prime' },
  { from: 'ignis-prime', to: 'zaxxon' },
];

const GalaxyMap = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const fromUniverse = route.params?.fromUniverse || 'prime';
  const currentPlanetId = route.params?.currentPlanetId || null;

  const [warpAnim] = useState(new Animated.Value(0));
  const [warpingTo, setWarpingTo] = useState(null);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSystemPress = (system) => {
    if (warpingTo) return; // prevent double-taps during warp

    setWarpingTo(system.planetId);
    warpAnim.setValue(0);

    Animated.timing(warpAnim, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start(() => {
      setWarpingTo(null);
      navigation.navigate('PlanetsHome', {
        initialPlanetId: system.planetId,
      });
    });
  };

  // Helper: look up system by planetId
  const getSystemById = (planetId) =>
    SYSTEMS.find((s) => s.planetId === planetId);

  return (
    <ImageBackground
      source={require('../../assets/Space/GalaxyBG.jpg')}
      style={styles.background}
    >
      <View style={styles.overlay}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.85}
          >
            <Text style={styles.backText}>⬅ Planets</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.title}>Galaxy Map</Text>
            <Text style={styles.subtitle}>
              {fromUniverse === 'prime'
                ? 'Prime Universe Stellar Chart'
                : 'Pinnacle Universe Stellar Chart'}
            </Text>
          </View>

          <View style={{ width: 60 }} /> {/* spacer */}
        </View>

        {/* STARFIELD CONTENT */}
        <View style={styles.starfield}>
          {/* CONNECTION LINES */}
          {CONNECTIONS.map((conn, idx) => {
            const fromSys = getSystemById(conn.from);
            const toSys = getSystemById(conn.to);
            if (!fromSys || !toSys) return null;

            const dx = toSys.x - fromSys.x;
            const dy = toSys.y - fromSys.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            const midX = (fromSys.x + toSys.x) / 2;
            const midY = (fromSys.y + toSys.y) / 2;

            return (
              <View
                key={`conn-${idx}`}
                style={[
                  styles.connectionLine,
                  {
                    width: length,
                    left: midX - length / 2,
                    top: midY,
                    transform: [{ rotateZ: `${angle}deg` }],
                  },
                ]}
              />
            );
          })}

          {/* SYSTEM ICONS */}
          {SYSTEMS.map((sys) => {
            const isWarpingThis = warpingTo === sys.planetId;

            const scale = isWarpingThis
              ? warpAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.6],
                })
              : 1;

            const opacity = isWarpingThis
              ? warpAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0],
                })
              : 1;

            return (
              <TouchableOpacity
                key={sys.name}
                style={[styles.starWrapper, { top: sys.y, left: sys.x }]}
                onPress={() => handleSystemPress(sys)}
                activeOpacity={0.9}
              >
                <Animated.View
                  style={[
                    styles.planetWrapper,
                    {
                      transform: [{ scale }],
                      opacity,
                    },
                  ]}
                >
                  <View style={styles.planetGlow} />
                  <Image
                    source={sys.image}
                    style={styles.planetIcon}
                    resizeMode="cover"
                  />
                </Animated.View>
                <Text style={styles.starName}>{sys.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* HUD */}
        <View style={styles.hud}>
          <Text style={styles.hudText}>
            Tap a system to warp to its primary world.
          </Text>
          {currentPlanetId && (
            <Text style={styles.hudSecondary}>
              Current focus: {currentPlanetId.toUpperCase()}
            </Text>
          )}
        </View>

        {/* Warp overlay */}
        {warpingTo && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.warpOverlay,
              {
                opacity: warpAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.9],
                }),
              },
            ]}
          >
            <Text style={styles.warpText}>Warping…</Text>
          </Animated.View>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 10, 0.82)',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 18,
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(5, 20, 60, 0.9)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(153, 215, 255, 0.8)',
  },
  backText: {
    color: '#E6F7FF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: '#F5F1FF',
    fontWeight: 'bold',
    textShadowColor: '#b077ff',
    textShadowRadius: 14,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 11,
    color: 'rgba(225, 205, 255, 0.9)',
  },

  starfield: {
    flex: 1,
  },
  starWrapper: {
    position: 'absolute',
    alignItems: 'center',
  },

  planetWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  planetGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(120, 180, 255, 0.35)',
    shadowColor: '#7acbff',
    shadowOpacity: 0.9,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
  },
  planetIcon: {
    width: 55,
    height: 55,
    borderRadius: 55,
    borderWidth: 1.5,
    borderColor: 'rgba(200, 230, 255, 0.9)',
    overflow: 'hidden',
  },

  connectionLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: 'rgba(140, 190, 255, 0.45)',
    borderRadius: 999,
  },

  starName: {
    marginTop: 4,
    fontSize: 12,
    color: '#F8F3FF',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowRadius: 8,
  },

  hud: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 130, 210, 0.8)',
    backgroundColor: 'rgba(3, 5, 25, 0.9)',
  },
  hudText: {
    fontSize: 12,
    color: 'rgba(225, 215, 255, 0.95)',
  },
  hudSecondary: {
    marginTop: 2,
    fontSize: 11,
    color: 'rgba(185, 215, 255, 0.9)',
  },

  warpOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  warpText: {
    color: '#EFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: '#7acbff',
    textShadowRadius: 12,
  },
});

export default GalaxyMap;
