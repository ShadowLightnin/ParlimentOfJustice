// screens/Planets/PlanetsHome.js
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  ScrollView,
  ActivityIndicator,
  Image,
  ImageBackground,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  EARTH_SIDE_IMAGES,
  SYSTEMS,
  sortPlanets,
  getOrbitPositionLabel,
} from './celestialBodies';

import SpaceBg from '../../assets/Space/Space.jpg';
import WarpGif from '../../assets/Space/warp.gif';
import Warp3Gif from '../../assets/Space/warp3.gif';

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

  const [planets, setPlanets] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [earthSide, setEarthSide] = useState('earth');
  const [infoOpen, setInfoOpen] = useState(false);

  const [warpVisible, setWarpVisible] = useState(false);
  const [warpImage, setWarpImage] = useState(null);

  const [selectedUniverse, setSelectedUniverse] = useState('prime');

  const planetAnim = useRef(new Animated.Value(0)).current;
  const infoAnim = useRef(new Animated.Value(0)).current;

  const initialPlanetIdFromRoute = route.params?.initialPlanetId || null;

  // Load universe selection
  useEffect(() => {
    AsyncStorage.getItem('selectedUniverse').then((u) => {
      if (u === 'pinnacle') setSelectedUniverse('pinnacle');
      else setSelectedUniverse('prime');
    });
  }, []);

  useEffect(() => {
    const loadUniverse = async () => {
      try {
        const stored = await AsyncStorage.getItem('selectedUniverse');
        const isPrime = stored !== 'pinnacle';

        let sorted = sortPlanets();

        // FILTER PLANETS BASED ON UNIVERSE
        if (!isPrime) {
          sorted = sorted.filter(
            (p) =>
              p.systemId === 'sol' ||
              p.systemId === 'ignis' ||
              p.systemId === 'zaxxon'
          );
        }

        if (!sorted.length) {
          setPlanets([]);
          return;
        }

        let index = 0;

        if (initialPlanetIdFromRoute) {
          const foundIndex = sorted.findIndex(
            (p) => p.id === initialPlanetIdFromRoute
          );
          if (foundIndex !== -1) index = foundIndex;
        } else {
          const defaultId = isPrime ? 'earth' : 'melcornia';
          const defIndex = sorted.findIndex((p) => p.id === defaultId);
          if (defIndex !== -1) index = defIndex;
        }

        setPlanets(sorted);
        setCurrentIndex(index);

        planetAnim.setValue(0);
        Animated.timing(planetAnim, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }).start();
      } catch (e) {
        console.error('Error loading universe / planets', e);
        const sorted = sortPlanets();
        setPlanets(sorted);
        setCurrentIndex(0);
        planetAnim.setValue(1);
      }
    };

    loadUniverse();
  }, [initialPlanetIdFromRoute, planetAnim]);

  const currentPlanet = planets[currentIndex] || null;

  // LOADING STATE
  if (!currentPlanet) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7acbff" />
        <Text style={styles.loadingText}>Loading planetary system…</Text>
      </View>
    );
  }

  // UNIVERSE LABEL (THIS WAS FIXED)
  const currentUniverseLabel =
    selectedUniverse === 'pinnacle'
      ? 'Pinnacle Universe'
      : 'Prime Universe';

  // FILTER SYSTEMS BY UNIVERSE
  let systemsForUniverse = SYSTEMS;
  if (selectedUniverse === 'pinnacle') {
    systemsForUniverse = SYSTEMS.filter(
      (s) =>
        s.id === 'sol' ||
        s.id === 'ignis' ||
        s.id === 'zaxxon'
    );
  }

  const sortedSystems = [...systemsForUniverse].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  let currentSystem = null;
  let prevSystem = null;
  let nextSystem = null;

  if (sortedSystems.length > 0) {
    currentSystem =
      sortedSystems.find((s) => s.id === currentPlanet.systemId) ||
      sortedSystems[0];

    const currentSystemIndex = sortedSystems.findIndex(
      (s) => s.id === currentSystem.id
    );

    if (currentSystemIndex > 0) {
      prevSystem = sortedSystems[currentSystemIndex - 1];
    }
    if (currentSystemIndex < sortedSystems.length - 1) {
      nextSystem = sortedSystems[currentSystemIndex + 1];
    }
  }

  const currentSystemName = currentSystem ? currentSystem.name : 'Unknown System';

  // ANIMATION: change planet
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

  // PLANET NAVIGATION
  const handleArrowPress = (direction) => {
    if (!planets.length || !currentSystem) return;

    const currentSysId = currentSystem.id;

    const planetsInCurrentSystem = planets
      .map((p, idx) => ({ p, idx }))
      .filter((item) => item.p.systemId === currentSysId);

    const firstInSystem = planetsInCurrentSystem[0]?.idx ?? 0;
    const lastInSystem =
      planetsInCurrentSystem[planetsInCurrentSystem.length - 1]?.idx ??
      planets.length - 1;

    if (direction === 'right') {
      if (currentIndex === lastInSystem && nextSystem) {
        const targetInNextSystem = planets
          .map((p, idx) => ({ p, idx }))
          .find((item) => item.p.systemId === nextSystem.id);

        if (targetInNextSystem) {
          triggerWarp('system');
          setTimeout(() => {
            animatePlanetChange(targetInNextSystem.idx, 1);
          }, 300);
          return;
        }
      }

      const lastIndex = planets.length - 1;
      const newIndex = currentIndex === lastIndex ? 0 : currentIndex + 1;
      animatePlanetChange(newIndex, 1);
    } else if (direction === 'left') {
      if (currentIndex === firstInSystem && prevSystem) {
        const planetsInPrevSystem = planets
          .map((p, idx) => ({ p, idx }))
          .filter((item) => item.p.systemId === prevSystem.id);

        if (planetsInPrevSystem.length) {
          const targetIdx =
            planetsInPrevSystem[planetsInPrevSystem.length - 1].idx;

          triggerWarp('system');
          setTimeout(() => {
            animatePlanetChange(targetIdx, -1);
          }, 300);
          return;
        }
      }

      const lastIndex = planets.length - 1;
      const newIndex = currentIndex === 0 ? lastIndex : currentIndex - 1;
      animatePlanetChange(newIndex, -1);
    }
  };

  const canGoLeft = planets.length > 1;
  const canGoRight = planets.length > 1;

  // WARP
  const triggerWarp = (type) => {
    const img = type === 'galaxy' ? Warp3Gif : WarpGif;
    setWarpImage(img);
    setWarpVisible(true);

    setTimeout(() => {
      setWarpVisible(false);
    }, 1000);
  };

  // SYSTEM JUMP
  const jumpToSystem = (systemId, dir = 1) => {
    const idx = planets.findIndex((p) => p.systemId === systemId);
    if (idx === -1) return;

    triggerWarp('system');

    setTimeout(() => {
      animatePlanetChange(idx, dir);
    }, 300);
  };

  const goBackHome = () => navigation.navigate('Home');

  const openGalaxyMap = () => {
    triggerWarp('galaxy');

    setTimeout(() => {
      navigation.navigate('GalaxyMap', {
        fromUniverse: selectedUniverse,
        currentPlanetId: currentPlanet.id || null,
      });
    }, 1000);
  };

  // Earth sides
  let planetDiskImage = currentPlanet.thumbnail;
  if (currentPlanet.id === 'earth') {
    if (earthSide === 'earth') {
      planetDiskImage = currentPlanet.thumbnail;
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
  const slideScale = planetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.7, 1],
  });

  const orbitLabel = getOrbitPositionLabel(currentPlanet, planets);

  // INFO PANEL
  const toggleInfoPanel = () => {
    const nextOpen = !infoOpen;
    setInfoOpen(nextOpen);
    Animated.timing(infoAnim, {
      toValue: nextOpen ? 1 : 0,
      duration: 260,
      useNativeDriver: true,
    }).start();
  };

  const infoScale = infoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  const description =
    currentPlanet.description ||
    'No lore entry yet. This celestial body awaits its official codex entry.';

  return (
    <View style={styles.root}>
      <ImageBackground source={SpaceBg} style={styles.bg} resizeMode="cover">
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

            <View style={{ flex: 1 }} />

            <TouchableOpacity
              style={styles.galaxyButton}
              onPress={openGalaxyMap}
              activeOpacity={0.85}
            >
              <Text style={styles.galaxyButtonText}>Galaxy Map ✨</Text>
            </TouchableOpacity>
          </View>

          {/* PLANET */}
          <View style={styles.main}>
            <Animated.View
              style={{
                opacity: slideOpacity,
                transform: [
                  { translateX: slideTranslate },
                  { scale: slideScale },
                ],
              }}
            >
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
              </View>
            </Animated.View>
          </View>

          {/* BOTTOM HUD */}
          <View style={styles.bottomHud}>
            <View style={styles.planetNavRow}>
              <TouchableOpacity
                style={[
                  styles.planetNavButton,
                  !canGoLeft && styles.planetNavButtonDisabled,
                ]}
                activeOpacity={0.85}
                disabled={!canGoLeft}
                onPress={() => handleArrowPress('left')}
              >
                <Text
                  style={[
                    styles.planetNavText,
                    !canGoLeft && styles.planetNavTextDisabled,
                  ]}
                >
                  ⟵ Prev Planet
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.planetNavButton,
                  !canGoRight && styles.planetNavButtonDisabled,
                ]}
                activeOpacity={0.85}
                disabled={!canGoRight}
                onPress={() => handleArrowPress('right')}
              >
                <Text
                  style={[
                    styles.planetNavText,
                    !canGoRight && styles.planetNavTextDisabled,
                  ]}
                >
                  Next Planet ⟶
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.bottomInfoRow}>
              <Text style={styles.bottomSystem}>{currentSystemName}</Text>

              <TouchableOpacity
                style={styles.bottomNameWrapper}
                onPress={toggleInfoPanel}
                activeOpacity={0.85}
              >
                <Text style={styles.bottomName}>{currentPlanet.name}</Text>
                <Text style={styles.bottomNameHint}>tap for lore</Text>
              </TouchableOpacity>

              <Text style={styles.bottomUniverse}>
                {currentUniverseLabel}
              </Text>
            </View>

            <View style={styles.bottomMetaRow}>
              <Text style={styles.bottomLabelLeft}>
                {orbitLabel != null
                  ? `Orbit position: ${orbitLabel}`
                  : 'Central body / special object'}
              </Text>
              <Text style={styles.bottomLabelRight}>
                {currentIndex + 1} / {planets.length} celestial bodies
              </Text>
            </View>

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

          {/* INFO OVERLAY */}
          <Animated.View
            pointerEvents={infoOpen ? 'auto' : 'none'}
            style={[
              styles.infoOverlay,
              {
                opacity: infoAnim,
                transform: [{ scale: infoScale }],
              },
            ]}
          >
            <View style={styles.infoPanelCard}>
              <View style={styles.infoRowTop}>
                <Text style={styles.infoName}>{currentPlanet.name}</Text>
                <Text style={styles.infoSystem}>{currentSystemName}</Text>
              </View>
              <View style={styles.infoRowMeta}>
                <Text style={styles.infoTag}>{currentUniverseLabel}</Text>
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

              <TouchableOpacity
                style={styles.infoCloseButton}
                onPress={toggleInfoPanel}
                activeOpacity={0.85}
              >
                <Text style={styles.infoCloseText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* WARP */}
          {warpVisible && warpImage && (
            <View style={styles.warpOverlay} pointerEvents="none">
              <Image
                source={warpImage}
                style={styles.warpImage}
                resizeMode="cover"
              />
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'black' },
  bg: { flex: 1 },
  overlay: { flex: 1 },

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

  main: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  planetArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  planetImageBox: {
    width: PLANET_DISPLAY_SIZE,
    height: PLANET_DISPLAY_SIZE,
    backgroundColor: 'transparent',
  },
  planetImage: {
    width: '100%',
    height: '100%',
  },

  bottomHud: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(110, 190, 255, 0.45)',
    backgroundColor: 'rgba(3, 10, 30, 0.95)',
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
  systemButtonDisabled: { opacity: 0.3 },
  systemButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#EFFFFF',
  },
  systemButtonTextDisabled: {
    color: 'rgba(210, 225, 245, 0.7)',
  },

  bottomInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  bottomSystem: {
    flex: 1,
    fontSize: 12,
    color: 'rgba(190, 225, 255, 0.9)',
  },
  bottomNameWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#EFFFFF',
  },
  bottomNameHint: {
    fontSize: 9,
    color: 'rgba(190, 225, 255, 0.8)',
  },
  bottomUniverse: {
    flex: 1,
    fontSize: 11,
    color: 'rgba(175, 215, 255, 0.9)',
    fontStyle: 'italic',
    textAlign: 'right',
  },

  bottomMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
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

  earthToggleRow: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 6,
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

  planetNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
    marginTop: 6,
  },
  planetNavButton: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(130, 205, 255, 0.8)',
    backgroundColor: 'rgba(5, 25, 50, 0.95)',
    alignItems: 'center',
  },
  planetNavButtonDisabled: { opacity: 0.35 },
  planetNavText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#EFFFFF',
  },
  planetNavTextDisabled: {
    color: 'rgba(210, 225, 245, 0.7)',
  },

  infoOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 20,
  },
  infoPanelCard: {
    width: SCREEN_WIDTH > 600 ? SCREEN_WIDTH * 0.55 : SCREEN_WIDTH * 0.9,
    maxHeight: SCREEN_HEIGHT * 0.75,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(140, 210, 255, 0.8)',
    backgroundColor: 'rgba(3, 10, 30, 0.98)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  infoRowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    maxHeight: SCREEN_HEIGHT * 0.45,
    marginTop: 4,
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 12,
    color: 'rgba(220, 240, 255, 0.96)',
    lineHeight: 18,
  },
  infoCloseButton: {
    alignSelf: 'center',
    marginTop: 4,
    paddingVertical: 6,
    paddingHorizontal: 26,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(120, 205, 255, 0.85)',
    backgroundColor: 'rgba(5, 25, 50, 0.95)',
  },
  infoCloseText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#EFFFFF',
  },

  warpOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 30,
  },
  warpImage: {
    width: '100%',
    height: '100%',
  },

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
