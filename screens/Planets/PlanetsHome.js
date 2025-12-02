// screens/Planets/PlanetsHome.js
import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Modal,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  PLANETS,
  EARTH_SIDE_IMAGES,
  SYSTEMS,
  sortPlanets,
  getOrbitPositionLabel,
} from './celestialBodies';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const PLANET_PIXEL_SIZE = 1084;
const PLANET_DISPLAY_SIZE = Math.min(
  SCREEN_WIDTH - 40,
  SCREEN_HEIGHT - 260,
  PLANET_PIXEL_SIZE
);

const PlanetsHome = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const [isYourUniverse, setIsYourUniverse] = useState(null);
  const [planets, setPlanets] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedHotspot, setSelectedHotspot] = useState(null);

  // Earth side: default to full Earth until user chooses a side
  const [earthSide, setEarthSide] = useState('earth'); // 'earth' | 'na' | 'ph'

  const [hotspotAnim] = useState(new Animated.Value(0));
  const [planetAnim] = useState(new Animated.Value(0));
  const entryAnim = useRef(new Animated.Value(0)).current;

  // INFO PANEL
  const [infoOpen, setInfoOpen] = useState(false);
  const infoAnim = useRef(new Animated.Value(0)).current;

  const initialPlanetIdFromRoute = route.params?.initialPlanetId || null;

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', () => {});
    return () => sub?.remove();
  }, []);

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
          const defaultId = isYour ? 'earth' : 'melcornia';
          const defIndex = sorted.findIndex(p => p.id === defaultId);
          if (defIndex !== -1) index = defIndex;
        }

        setPlanets(sorted);
        setCurrentIndex(index);

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
        // no-op
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

  // Looping arrows
  const handleArrowPress = (direction) => {
    if (!planets.length) return;

    const lastIndex = planets.length - 1;
    if (direction === 'left') {
      const newIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
      animatePlanetChange(newIndex, -1);
    } else if (direction === 'right') {
      const newIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
      animatePlanetChange(newIndex, 1);
    }
  };

  const canGoLeft = planets.length > 1;
  const canGoRight = planets.length > 1;

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

  // Planet image (Earth has Earth / NA / PH sides)
  let planetDiskImage = currentPlanet.thumbnail;
  if (currentPlanet.id === 'earth') {
    if (earthSide === 'earth') {
      planetDiskImage = currentPlanet.thumbnail; // full Earth default
    } else {
      const sideKey = earthSide === 'ph' ? 'ph' : 'na';
      planetDiskImage = EARTH_SIDE_IMAGES[sideKey] || currentPlanet.thumbnail;
    }
  }

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

  const orbitLabel = getOrbitPositionLabel(currentPlanet, planets);

  // HOTSPOTS (logic kept for future)
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

  // INFO PANEL toggle
  const toggleInfoPanel = () => {
    const toOpen = !infoOpen;
    setInfoOpen(toOpen);

    Animated.timing(infoAnim, {
      toValue: toOpen ? 1 : 0,
      duration: 260,
      useNativeDriver: true,
    }).start();
  };

  const infoTranslateY = infoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-40, 0],
  });
  const infoOpacity = infoAnim;

  const description =
    currentPlanet.description ||
    'No lore entry yet. This celestial body awaits its official codex entry.';

  return (
    <View style={styles.root}>
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

          <TouchableOpacity
            style={styles.headerCenter}
            activeOpacity={0.85}
            onPress={toggleInfoPanel}
          >
            <Text style={styles.title}>
              {currentSystem.name} – {currentPlanet.name}
            </Text>
            <Text style={styles.subtitle}>
              {currentUniverseLabel} • tap for details
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.galaxyButton}
            onPress={openGalaxyMap}
            activeOpacity={0.85}
          >
            <Text style={styles.galaxyButtonText}>Galaxy Map ✨</Text>
          </TouchableOpacity>
        </View>

        {/* INFO PANEL (slides down under header) */}
        <Animated.View
          pointerEvents={infoOpen ? 'auto' : 'none'}
          style={[
            styles.infoPanel,
            {
              opacity: infoOpacity,
              transform: [{ translateY: infoTranslateY }],
            },
          ]}
        >
          <View style={styles.infoRowTop}>
            <Text style={styles.infoName}>{currentPlanet.name}</Text>
            <Text style={styles.infoSystem}>{currentSystem.name}</Text>
          </View>
          <View style={styles.infoRowMeta}>
            <Text style={styles.infoTag}>
              {currentUniverseLabel}
            </Text>
            <Text style={styles.infoTag}>
              {orbitLabel != null
                ? `Orbit: ${orbitLabel}`
                : 'Central / special object'}
            </Text>
            {currentPlanet.type && (
              <Text style={styles.infoTag}>{currentPlanet.type}</Text>
            )}
          </View>

          <ScrollView style={styles.infoScroll} nestedScrollEnabled>
            <Text style={styles.infoDescription}>{description}</Text>
          </ScrollView>
        </Animated.View>

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

            {/* Planet image area */}
            <View style={styles.planetArea}>
              <View style={styles.planetImageBox}>
                {planetDiskImage && (
                  <Image
                    source={planetDiskImage}
                    style={styles.planetImage}
                    resizeMode="contain"
                  />
                )}
              </View>

              {/* Hotspots (disabled for now) */}
              {false &&
                currentPlanet.hotspots?.map(hs => (
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

        {/* BOTTOM HUD */}
        <View style={styles.bottomHud}>
          <View style={styles.bottomTopRow}>
            <Text style={styles.bottomLabelLeft}>
              {orbitLabel != null
                ? `Orbit position: ${orbitLabel}`
                : 'Central body / special object'}
            </Text>
            <Text style={styles.bottomLabelRight}>
              {currentIndex + 1} / {planets.length} celestial bodies
            </Text>
          </View>

          <View style={styles.bottomDivider} />

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
                <Image
                  source={selectedHotspot?.image}
                  style={styles.modalImage}
                  resizeMode="cover"
                />
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
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'black',
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

  // INFO PANEL
  infoPanel: {
    marginHorizontal: 12,
    marginBottom: 4,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(140, 210, 255, 0.8)',
    backgroundColor: 'rgba(3, 10, 30, 0.96)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxHeight: SCREEN_HEIGHT * 0.26,
  },
  infoRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  infoName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#EFFFFF',
  },
  infoSystem: {
    fontSize: 12,
    color: 'rgba(190, 225, 255, 0.9)',
  },
  infoRowMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 4,
  },
  infoTag: {
    fontSize: 10,
    color: 'rgba(205, 235, 255, 0.95)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(130, 205, 255, 0.7)',
  },
  infoScroll: {
    maxHeight: SCREEN_HEIGHT * 0.16,
  },
  infoDescription: {
    fontSize: 12,
    color: 'rgba(220, 240, 255, 0.96)',
    lineHeight: 18,
  },

  // MAIN CONTENT
  main: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative', // for absolute arrows
  },
  arrowWrapper: {
    position: 'absolute',
    top: '50%',
    marginTop: -24,
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(190, 230, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  arrowText: {
    fontSize: 28,
    color: '#f0fbff',
  },
  arrowDisabled: {
    opacity: 0.35,
  },

  planetCard: {
    width: SCREEN_WIDTH - 80,  // leave room for arrows
    maxWidth: 900,
    alignSelf: 'center',
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

  earthToggleRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 4,
    marginBottom: 6,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  planetImageBox: {
    width: PLANET_DISPLAY_SIZE,
    height: PLANET_DISPLAY_SIZE,
    backgroundColor: 'black',
  },
  planetImage: {
    width: '100%',
    height: '100%',
    opacity: 1,
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

  // BOTTOM HUD
  bottomHud: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(110, 190, 255, 0.45)',
    backgroundColor: 'rgba(3, 10, 30, 0.95)',
  },
  bottomTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  bottomLabelLeft: {
    fontSize: 11,
    color: 'rgba(195, 236, 255, 0.95)',
  },
  bottomLabelRight: {
    fontSize: 11,
    color: 'rgba(195, 236, 255, 0.95)',
    textAlign: 'right',
  },
  bottomDivider: {
    height: 1,
    backgroundColor: 'rgba(110, 190, 255, 0.4)',
    marginVertical: 4,
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
