// screens/Planets/PlanetsHome.js
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Animated,
  Modal,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * PLANETS – global route order
 * Sol → Ignis Prime / Noctheron / Vortanite Field / Melcornia → Zaxxon
 */
const PLANETS = [
  // ===== SOL SYSTEM (YOUR UNIVERSE / PRIME) =====
  {
    id: 'Helios',
    name: 'Helios',
    universe: 'prime',
    systemId: 'sol',
    order: 1,
    background: require('../../assets/Space/Sol.jpg'),
    thumbnail: require('../../assets/Space/Sol.jpg'),
  },
  {
    id: 'mercury',
    name: 'Mercury',
    universe: 'prime',
    systemId: 'sol',
    order: 2,
    background: require('../../assets/Space/Mercury.jpg'),
    thumbnail: require('../../assets/Space/Mercury.jpg'),
  },
  {
    id: 'venus',
    name: 'Venus',
    universe: 'prime',
    systemId: 'sol',
    order: 3,
    background: require('../../assets/Space/Venus.jpg'),
    thumbnail: require('../../assets/Space/Venus.jpg'),
  },
  {
    id: 'earth',
    name: 'Earth',
    universe: 'prime',
    systemId: 'sol',
    order: 4,
    background: require('../../assets/Space/Earth.jpg'),
    thumbnail: require('../../assets/Space/Earth.jpg'),
    hotspots: [
      {
        id: 'zion',
        name: 'Zion City',
        description: 'The Parliament’s heart in Utah, a rising modern megacity.',
        image: require('../../assets/ParliamentTower.jpg'),
        position: { top: '55%', left: '18%' },
      },
      {
        id: 'aegis',
        name: 'The Aegis Compound',
        description: 'Desert fortress HQ for the Parliament’s true operations.',
        image: require('../../assets/BackGround/ShipYard.jpg'),
        position: { top: '35%', left: '70%' },
      },
    ],
  },
  {
    id: 'Luna',
    name: 'Luna',
    universe: 'prime',
    systemId: 'sol',
    order: 5,
    background: require('../../assets/Space/Luna.jpg'),
    thumbnail: require('../../assets/Space/Luna.jpg'),
  },
  {
    id: 'mars',
    name: 'Mars',
    universe: 'prime',
    systemId: 'sol',
    order: 6,
    background: require('../../assets/Space/Mars.jpg'),
    thumbnail: require('../../assets/Space/Mars.jpg'),
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    universe: 'prime',
    systemId: 'sol',
    order: 7,
    background: require('../../assets/Space/Jupiter.jpg'),
    thumbnail: require('../../assets/Space/Jupiter.jpg'),
  },
  {
    id: 'saturn',
    name: 'Saturn',
    universe: 'prime',
    systemId: 'sol',
    order: 8,
    background: require('../../assets/Space/Saturn.jpg'),
    thumbnail: require('../../assets/Space/Saturn.jpg'),
  },
  {
    id: 'uranus',
    name: 'Uranus',
    universe: 'prime',
    systemId: 'sol',
    order: 9,
    background: require('../../assets/Space/Uranus.jpg'),
    thumbnail: require('../../assets/Space/Uranus.jpg'),
  },
  {
    id: 'neptune',
    name: 'Neptune',
    universe: 'prime',
    systemId: 'sol',
    order: 10,
    background: require('../../assets/Space/Neptune.jpg'),
    thumbnail: require('../../assets/Space/Neptune.jpg'),
  },
  {
    id: 'planet9',
    name: 'Planet 9',
    universe: 'prime',
    systemId: 'sol',
    order: 11,
    background: require('../../assets/Space/Planet9.jpg'),
    thumbnail: require('../../assets/Space/Planet9.jpg'),
  },
  {
    id: 'quaoar',
    name: 'Quaoar',
    universe: 'prime',
    systemId: 'sol',
    order: 12,
    background: require('../../assets/Space/Quaoar.jpg'),
    thumbnail: require('../../assets/Space/Quaoar.jpg'),
  },

  // ===== IGNIS PRIME SYSTEM (SAM'S UNIVERSE / PINNACLE) =====
  {
    id: 'ignis-prime',
    name: 'Ignis Prime',
    universe: 'pinnacle',
    systemId: 'ignis',
    order: 13,
    background: require('../../assets/Space/IgnisPrime.jpg'),
    thumbnail: require('../../assets/Space/IgnisPrime.jpg'),
  },
  {
    id: 'noctheron',
    name: 'Noctheron',
    universe: 'pinnacle',
    systemId: 'ignis',
    order: 14,
    background: require('../../assets/Space/Noctheron.jpg'),
    thumbnail: require('../../assets/Space/Noctheron.jpg'),
  },
  {
    id: 'vortanite-field',
    name: 'Vortanite Asteroid Field',
    universe: 'pinnacle',
    systemId: 'ignis',
    order: 15,
    background: require('../../assets/Space/Vortaniteasteroidfield.jpg'),
    thumbnail: require('../../assets/Space/Vortaniteasteroidfield.jpg'),
  },
  {
    id: 'melcornia',
    name: 'Melcornia',
    universe: 'pinnacle',
    systemId: 'ignis',
    order: 16,
    background: require('../../assets/Space/Melcornia.jpg'),
    thumbnail: require('../../assets/Space/Melcornia.jpg'),
    hotspots: [
      {
        id: 'maw-rift',
        name: 'The Maw Rift',
        description: 'The scar where the Maw’s influence first shattered the planet.',
        image: require('../../assets/Space/Mirror.jpg'),
        position: { top: '48%', left: '28%' },
      },
    ],
  },

  // ===== ZAXXON SYSTEM =====
  {
    id: 'zaxxon',
    name: 'Zaxxon',
    universe: 'pinnacle',
    systemId: 'zaxxon',
    order: 17,
    background: require('../../assets/Space/Zaxxon.jpg'),
    thumbnail: require('../../assets/Space/Zaxxon.jpg'),
  },
];

/**
 * Earth special sides (only Earth uses these inside the planet disk)
 */
const EARTH_SIDE_IMAGES = {
  na: require('../../assets/Space/NorthAmericanSide.jpg'),
  ph: require('../../assets/Space/PhilippinesSide.jpg'),
};

/**
 * Star systems list for jump controls
 */
const SYSTEMS = [
  { id: 'sol', name: 'Sol System', order: 1 },
  { id: 'ignis', name: 'Ignis Prime System', order: 2 },
  { id: 'zaxxon', name: 'Zaxxon System', order: 3 },
];

const sortPlanets = () => {
  return [...PLANETS].sort((a, b) => (a.order || 0) - (b.order || 0));
};

/**
 * Compute "Orbit position" label.
 * - For the Sol system, Helios is NOT included in the orbit count.
 *   Mercury = 1, Venus = 2, Earth = 3, etc.
 * - For other systems, use the planet's `order` as-is.
 */
const getOrbitPositionLabel = (planet, allPlanets) => {
  if (!planet) return '?';

  if (planet.systemId === 'sol') {
    // All Sol bodies except the star (Helios) sorted by order
    const solOrbitables = allPlanets
      .filter(p => p.systemId === 'sol' && p.id !== 'Helios')
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const idx = solOrbitables.findIndex(p => p.id === planet.id);
    if (idx === -1) {
      // Helios or something weird: show a dash
      return '—';
    }
    return idx + 1; // Mercury = 1, ...
  }

  // Default behavior for other systems
  return planet.order ?? '?';
};

const PlanetsHome = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [isYourUniverse, setIsYourUniverse] = useState(null);
  const [planets, setPlanets] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [earthSide, setEarthSide] = useState('na'); // 'na' or 'ph'

  const [hotspotAnim] = useState(new Animated.Value(0));
  const [planetAnim] = useState(new Animated.Value(0));
  const entryAnim = useRef(new Animated.Value(0)).current;

  const initialPlanetIdFromRoute = route.params?.initialPlanetId || null;

  // Handle resize (kept for future use)
  useEffect(() => {
    const sub = Dimensions.addEventListener('change', () => {});
    return () => sub?.remove();
  }, []);

  // Load universe preference and set starting planet
  useEffect(() => {
    const loadUniverse = async () => {
      try {
        const stored = await AsyncStorage.getItem('selectedUniverse');
        const isYour = stored ? stored === 'your' : true;
        setIsYourUniverse(isYour);

        const sorted = sortPlanets();
        if (!sorted.length) {
          setPlanets([]);
          return;
        }

        let index = 0;
        if (initialPlanetIdFromRoute) {
          const foundIndex = sorted.findIndex(p => p.id === initialPlanetIdFromRoute);
          if (foundIndex !== -1) index = foundIndex;
        } else {
          // Start on Earth if your universe is Prime, Melcornia if Pinnacle
          const defaultId = isYour ? 'earth' : 'melcornia';
          const defIndex = sorted.findIndex(p => p.id === defaultId);
          if (defIndex !== -1) index = defIndex;
        }

        setPlanets(sorted);
        setCurrentIndex(index);

        // Start entry animation
        entryAnim.setValue(0);
        planetAnim.setValue(0);
        Animated.parallel([
          Animated.timing(entryAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(planetAnim, {
            toValue: 1,
            duration: 450,
            useNativeDriver: true,
          }),
        ]).start();
      } catch (e) {
        console.error('Error loading universe / planets', e);
        setIsYourUniverse(true);
        const sorted = sortPlanets();
        setPlanets(sorted);
        setCurrentIndex(0);

        entryAnim.setValue(0);
        planetAnim.setValue(1);
        Animated.timing(entryAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    };
    loadUniverse();
  }, [initialPlanetIdFromRoute, planetAnim, entryAnim]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        // no-op for now
      };
    }, [])
  );

  const currentPlanet = planets[currentIndex] || null;

  if (isYourUniverse === null || !currentPlanet) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7acbff" />
        <Text style={styles.loadingText}>Loading planetary system…</Text>
      </View>
    );
  }

  const currentUniverseLabel =
    currentPlanet.universe === 'pinnacle' ? 'Pinnacle Universe' : 'Prime Universe';

  // SYSTEM JUMP LOGIC
  const sortedSystems = [...SYSTEMS].sort((a, b) => a.order - b.order);
  const currentSystem =
    sortedSystems.find(s => s.id === currentPlanet.systemId) || sortedSystems[0];

  const currentSystemIndex = sortedSystems.findIndex(s => s.id === currentSystem.id);
  const prevSystem =
    currentSystemIndex > 0 ? sortedSystems[currentSystemIndex - 1] : null;
  const nextSystem =
    currentSystemIndex < sortedSystems.length - 1
      ? sortedSystems[currentSystemIndex + 1]
      : null;

  const jumpToSystem = (systemId, dir = 1) => {
    const idx = planets.findIndex(p => p.systemId === systemId);
    if (idx !== -1) {
      animatePlanetChange(idx, dir);
    }
  };

  const goBackHome = () => {
    navigation.navigate('Home');
  };

  const openGalaxyMap = () => {
    navigation.navigate('GalaxyMap', {
      fromUniverse: currentPlanet.universe || 'prime',
      currentPlanetId: currentPlanet.id || null,
    });
  };

  // ARROWS: move through full route of planets
  const canGoLeft = currentIndex > 0;
  const canGoRight = currentIndex < planets.length - 1;

  const animatePlanetChange = (newIndex, dir) => {
    Animated.timing(planetAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex(newIndex);
      planetAnim.setValue(dir === 1 ? -0.4 : 0.4);
      Animated.timing(planetAnim, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleArrowPress = (direction) => {
    if (direction === 'left' && canGoLeft) {
      animatePlanetChange(currentIndex - 1, -1);
    } else if (direction === 'right' && canGoRight) {
      animatePlanetChange(currentIndex + 1, 1);
    }
  };

  // HOTSPOTS
  const handleHotspotPress = (hotspot) => {
    setSelectedHotspot(hotspot);
    hotspotAnim.setValue(0);
    Animated.timing(hotspotAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  };

  const closeHotspot = () => {
    Animated.timing(hotspotAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setSelectedHotspot(null));
  };

  // Planet disk image (Earth has two special sides)
  let planetDiskImage = currentPlanet.thumbnail;
  if (currentPlanet.id === 'earth') {
    // 'Utah side' -> NorthAmericanSide, 'Philippines side' -> PhilippinesSide
    planetDiskImage =
      earthSide === 'ph' ? EARTH_SIDE_IMAGES.ph : EARTH_SIDE_IMAGES.na;
  }

  // Animations
  const slideTranslate = planetAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [50, -10, 0],
  });
  const slideOpacity = planetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const entryScale = entryAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  const isDesktop = SCREEN_WIDTH >= 900;

  return (
    <ImageBackground
      source={currentPlanet.background}
      style={styles.background}
      blurRadius={3}
    >
      <View style={styles.overlay}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBackHome}
            activeOpacity={0.85}
          >
            <Text style={styles.backText}>⬅ Home</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            {/* System name + body name */}
            <Text style={styles.title}>
              {currentSystem.name} – {currentPlanet.name}
            </Text>
            {/* Universe label */}
            <Text style={styles.subtitle}>
              {currentUniverseLabel}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.galaxyButton}
            onPress={openGalaxyMap}
            activeOpacity={0.85}
          >
            <Text style={styles.galaxyButtonText}>Galaxy Map ✨</Text>
          </TouchableOpacity>
        </View>

        {/* MAIN CONTENT */}
        <View style={styles.main}>
          {/* LEFT ARROW */}
          <TouchableOpacity
            style={[styles.arrowWrapper, { left: 10 }]}
            disabled={!canGoLeft}
            onPress={() => handleArrowPress('left')}
          >
            <Text style={[styles.arrowText, !canGoLeft && styles.arrowDisabled]}>{'‹'}</Text>
          </TouchableOpacity>

          {/* PLANET VIEW CARD */}
          <Animated.View
            style={[
              styles.planetCard,
              {
                opacity: slideOpacity,
                transform: [{ translateX: slideTranslate }, { scale: entryScale }],
              },
            ]}
          >
            <View style={styles.planetGlass}>
              <Text style={styles.planetName}>{currentPlanet.name}</Text>
              <Text style={styles.planetLabel}>
                Use arrows to travel • Tap nodes to explore
              </Text>
            </View>

            {/* Earth side toggle */}
            {currentPlanet.id === 'earth' && (
              <View style={styles.earthToggleRow}>
                <TouchableOpacity
                  style={[
                    styles.earthToggleButton,
                    earthSide === 'na' && styles.earthToggleButtonActive,
                  ]}
                  onPress={() => setEarthSide('na')}
                >
                  <Text
                    style={[
                      styles.earthToggleText,
                      earthSide === 'na' && styles.earthToggleTextActive,
                    ]}
                  >
                    Utah side
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.earthToggleButton,
                    earthSide === 'ph' && styles.earthToggleButtonActive,
                  ]}
                  onPress={() => setEarthSide('ph')}
                >
                  <Text
                    style={[
                      styles.earthToggleText,
                      earthSide === 'ph' && styles.earthToggleTextActive,
                    ]}
                  >
                    Philippines side
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Planet disk area */}
            <View style={styles.planetArea}>
              <View style={styles.orbitLine} />

              {planetDiskImage && (
                <Image
                  source={planetDiskImage}
                  style={styles.planetImage}
                  resizeMode="cover"
                />
              )}

              {/* Hotspots */}
              {currentPlanet.hotspots?.map(hs => (
                <View key={hs.id} style={[styles.hotspotWrapper, hs.position]}>
                  <View style={styles.hotspotLine} />
                  <TouchableOpacity
                    style={styles.hotspotSquare}
                    onPress={() => handleHotspotPress(hs)}
                    activeOpacity={0.9}
                  >
                    <Text style={styles.hotspotPlus}>＋</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Planet footer */}
            <View style={styles.planetFooter}>
              <Text style={styles.planetFooterText}>
                Orbit position: {getOrbitPositionLabel(currentPlanet, planets)}
              </Text>
              <Text style={styles.planetFooterText}>
                {currentIndex + 1} / {planets.length} worlds
              </Text>
            </View>

            {/* System footer – "explore this system vs jump to next" */}
            <View style={styles.systemFooter}>
              <Text style={styles.systemLabel}>{currentSystem.name}</Text>
              <View style={styles.systemButtonsRow}>
                <TouchableOpacity
                  style={[
                    styles.systemButton,
                    !prevSystem && styles.systemButtonDisabled,
                  ]}
                  activeOpacity={0.85}
                  disabled={!prevSystem}
                  onPress={() => prevSystem && jumpToSystem(prevSystem.id, -1)}
                >
                  <Text
                    style={[
                      styles.systemButtonText,
                      !prevSystem && styles.systemButtonTextDisabled,
                    ]}
                  >
                    ⬅ Prev System
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.systemButton,
                    !nextSystem && styles.systemButtonDisabled,
                  ]}
                  activeOpacity={0.85}
                  disabled={!nextSystem}
                  onPress={() => nextSystem && jumpToSystem(nextSystem.id, 1)}
                >
                  <Text
                    style={[
                      styles.systemButtonText,
                      !nextSystem && styles.systemButtonTextDisabled,
                    ]}
                  >
                    Next System ➜
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

          {/* RIGHT ARROW */}
          <TouchableOpacity
            style={[styles.arrowWrapper, { right: 10 }]}
            disabled={!canGoRight}
            onPress={() => handleArrowPress('right')}
          >
            <Text style={[styles.arrowText, !canGoRight && styles.arrowDisabled]}>{'›'}</Text>
          </TouchableOpacity>
        </View>

        {/* HOTSPOT MODAL */}
        <Modal
          visible={!!selectedHotspot}
          transparent
          animationType="none"
          onRequestClose={closeHotspot}
        >
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.modalCard,
                {
                  opacity: hotspotAnim,
                  transform: [
                    {
                      translateY: hotspotAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [60, 0],
                      }),
                    },
                    {
                      scale: hotspotAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.96, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.modalTitle}>{selectedHotspot?.name}</Text>
              <View style={styles.modalImageHolder}>
                <ImageBackground
                  source={selectedHotspot?.image}
                  style={styles.modalImage}
                  resizeMode="cover"
                >
                  <View style={styles.modalImageOverlay} />
                </ImageBackground>
              </View>
              <ScrollView style={styles.modalScroll}>
                <Text style={styles.modalDescription}>
                  {selectedHotspot?.description}
                </Text>
              </ScrollView>
              <TouchableOpacity
                style={styles.modalClose}
                onPress={closeHotspot}
                activeOpacity={0.85}
              >
                <Text style={styles.modalCloseText}>Return to orbit</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </Modal>
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
    backgroundColor: 'rgba(2, 6, 18, 0.82)',
  },

  // HEADER
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
    backgroundColor: 'rgba(0, 30, 70, 0.7)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(122, 203, 255, 0.8)',
  },
  backText: {
    color: '#E6F7FF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EFFFFF',
    textAlign: 'center',
    textShadowColor: '#00b3ff',
    textShadowRadius: 10,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 11,
    color: 'rgba(198, 234, 255, 0.9)',
    textAlign: 'center',
  },
  galaxyButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(20, 15, 60, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(180, 120, 255, 0.9)',
  },
  galaxyButtonText: {
    color: '#f8e7ff',
    fontSize: 13,
    fontWeight: 'bold',
  },

  // MAIN CONTENT
  main: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowWrapper: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(190, 230, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowText: {
    fontSize: 28,
    color: '#f0fbff',
  },
  arrowDisabled: {
    opacity: 0.35,
  },

  planetCard: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(153, 227, 255, 0.7)',
    backgroundColor: 'rgba(0, 15, 36, 0.9)',
    padding: 12,
    shadowColor: '#00b3ff',
    shadowOpacity: 0.5,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  planetGlass: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(150, 225, 255, 0.6)',
    backgroundColor: 'rgba(0, 0, 0, 0.38)',
    alignSelf: 'center',
    marginBottom: 8,
  },
  planetName: {
    fontSize: 20,
    color: '#EFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowRadius: 10,
    textShadowColor: '#00b3ff',
  },
  planetLabel: {
    fontSize: 11,
    color: 'rgba(195, 236, 255, 0.9)',
    textAlign: 'center',
    marginTop: 2,
  },

  earthToggleRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 6,
    marginBottom: 2,
    gap: 6,
  },
  earthToggleButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(130, 205, 255, 0.6)',
    backgroundColor: 'rgba(5, 20, 40, 0.8)',
  },
  earthToggleButtonActive: {
    backgroundColor: 'rgba(40, 130, 255, 0.95)',
    borderColor: 'rgba(200, 240, 255, 0.9)',
  },
  earthToggleText: {
    fontSize: 11,
    color: 'rgba(190, 225, 255, 0.9)',
    fontWeight: '500',
  },
  earthToggleTextActive: {
    color: '#EFFFFF',
    fontWeight: 'bold',
  },

  planetArea: {
    flex: 1,
    marginTop: 12,
    marginBottom: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(91, 172, 255, 0.7)',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitLine: {
    position: 'absolute',
    width: '75%',
    height: '48%',
    borderWidth: 1.5,
    borderColor: 'rgba(90, 190, 255, 0.6)',
    borderRadius: 999,
    opacity: 0.85,
  },
  planetImage: {
    width: '90%',
    height: '90%',
    borderRadius: 999,
    opacity: 0.96,
  },

  hotspotWrapper: {
    position: 'absolute',
    alignItems: 'center',
  },
  hotspotLine: {
    width: 2,
    height: 32,
    backgroundColor: 'rgba(120, 210, 255, 0.8)',
    marginBottom: 3,
  },
  hotspotSquare: {
    width: 26,
    height: 26,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(150, 230, 255, 0.9)',
    backgroundColor: 'rgba(5, 20, 40, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hotspotPlus: {
    color: '#c5f1ff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  planetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingTop: 4,
  },
  planetFooterText: {
    fontSize: 11,
    color: 'rgba(195, 236, 255, 0.9)',
  },

  systemFooter: {
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(110, 190, 255, 0.45)',
  },
  systemLabel: {
    fontSize: 12,
    color: 'rgba(190, 230, 255, 0.95)',
    textAlign: 'center',
    marginBottom: 4,
  },
  systemButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  systemButton: {
    flex: 1,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(130, 205, 255, 0.8)',
    backgroundColor: 'rgba(5, 25, 50, 0.92)',
    alignItems: 'center',
  },
  systemButtonDisabled: {
    opacity: 0.3,
  },
  systemButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#EFFFFF',
  },
  systemButtonTextDisabled: {
    color: 'rgba(210, 225, 245, 0.7)',
  },

  // HOTSPOT MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: SCREEN_WIDTH > 600 ? SCREEN_WIDTH * 0.55 : SCREEN_WIDTH * 0.9,
    maxHeight: SCREEN_HEIGHT * 0.8,
    borderRadius: 20,
    backgroundColor: 'rgba(4, 10, 26, 0.98)',
    borderWidth: 1,
    borderColor: 'rgba(180, 225, 255, 0.8)',
    padding: 12,
    shadowColor: '#00b3ff',
    shadowOpacity: 0.7,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EFFFFF',
    textAlign: 'center',
    textShadowColor: '#00b3ff',
    textShadowRadius: 12,
    marginBottom: 8,
  },
  modalImageHolder: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(120, 205, 255, 0.75)',
    marginBottom: 8,
  },
  modalImage: {
    width: '100%',
    height: 160,
  },
  modalImageOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  modalScroll: {
    maxHeight: 160,
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 13,
    color: 'rgba(220, 240, 255, 0.95)',
    lineHeight: 18,
  },
  modalClose: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 26,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(120, 205, 255, 0.85)',
    backgroundColor: 'rgba(5, 25, 50, 0.95)',
  },
  modalCloseText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#EFFFFF',
  },

  // LOADING
  loadingContainer: {
    flex: 1,
    backgroundColor: '#020415',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#d5f1ff',
  },
});

export default PlanetsHome;
