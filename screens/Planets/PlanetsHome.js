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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
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

  const [planets, setPlanets] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [earthSide, setEarthSide] = useState('earth'); // 'earth' | 'na' | 'ph'
  const [infoOpen, setInfoOpen] = useState(false);

  const planetAnim = useRef(new Animated.Value(0)).current;
  const infoAnim = useRef(new Animated.Value(0)).current;

  const initialPlanetIdFromRoute = route.params?.initialPlanetId || null;

  useEffect(() => {
    const loadUniverse = async () => {
      try {
        const stored = await AsyncStorage.getItem('selectedUniverse');
        const isYourUniverse = stored ? stored === 'your' : true;

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
          const defaultId = isYourUniverse ? 'earth' : 'melcornia';
          const defIndex = sorted.findIndex(p => p.id === defaultId);
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

  if (!currentPlanet) {
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

  const handleArrowPress = direction => {
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
    if (idx !== -1) animatePlanetChange(idx, dir);
  };

  const goBackHome = () => navigation.navigate('Home');

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

  const infoTranslateY = infoAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-40, 0],
  });

  const description =
    currentPlanet.description ||
    'No lore entry yet. This celestial body awaits its official codex entry.';

  return (
    <View style={styles.root}>
      <View style={styles.overlay}>
        {/* HEADER – nothing in the center */}
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

        {/* INFO PANEL (slides down under header) */}
        <Animated.View
          pointerEvents={infoOpen ? 'auto' : 'none'}
          style={[
            styles.infoPanel,
            {
              opacity: infoAnim,
              transform: [{ translateY: infoTranslateY }],
            },
          ]}
        >
          <View style={styles.infoRowTop}>
            <Text style={styles.infoName}>{currentPlanet.name}</Text>
            <Text style={styles.infoSystem}>{currentSystem.name}</Text>
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
        </Animated.View>

        {/* MAIN CONTENT */}
        <View style={styles.main}>
          {/* LEFT ARROW */}
          {/* <TouchableOpacity
            style={[styles.arrowWrapper, { left: 10 }]}
            disabled={!canGoLeft}
            onPress={() => handleArrowPress('left')}
          >
            <Text style={[styles.arrowText, !canGoLeft && styles.arrowDisabled]}>
              {'‹'}
            </Text>
          </TouchableOpacity> */}

          {/* PLANET VIEW CARD (no glow) */}
          <Animated.View
            style={[
            //   styles.planetCard,
            //   {
            //     opacity: slideOpacity,
            //     transform: [{ translateX: slideTranslate }, { scale: slideScale }],
            //   },
            ]}
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

          {/* RIGHT ARROW */}
          {/* <TouchableOpacity
            style={[styles.arrowWrapper, { right: 10 }]}
            disabled={!canGoRight}
            onPress={() => handleArrowPress('right')}
          >
            <Text style={[styles.arrowText, !canGoRight && styles.arrowDisabled]}>
              {'›'}
            </Text>
          </TouchableOpacity> */}
        </View>

        {/* BOTTOM HUD */}
        <View style={styles.bottomHud}>
          {/* PLANET NAV ROW – now on TOP */}
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
            
          {/* NAMES ROW: SYSTEM (left) • NAME (center tappable) • UNIVERSE (right) */}
          <View style={styles.bottomInfoRow}>
            <Text style={styles.bottomSystem}>{currentSystem.name}</Text>
            
            <TouchableOpacity
              style={styles.bottomNameWrapper}
              onPress={toggleInfoPanel}
              activeOpacity={0.85}
            >
              <Text style={styles.bottomName}>{currentPlanet.name}</Text>
              <Text style={styles.bottomNameHint}>tap for lore</Text>
            </TouchableOpacity>
            
            <Text style={styles.bottomUniverse}>{currentUniverseLabel}</Text>
          </View>
            
          {/* META ROW: ORBIT + COUNT */}
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
            
          {/* EARTH SIDE TOGGLE – stays above divider */}
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
      
          {/* SYSTEM NAV ROW – now on BOTTOM */}
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
    position: 'relative',
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
    width: SCREEN_WIDTH - 80,
    maxWidth: 900,
    alignSelf: 'center',
    marginHorizontal: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(153, 227, 255, 0.4)',
    backgroundColor: 'rgba(0, 15, 36, 0.9)',
    padding: 12,
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
  },

  // BOTTOM HUD
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
    textAlign: 'center',
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
  planetNavButtonDisabled: {
    opacity: 0.35,
  },
  planetNavText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#EFFFFF',
  },
  planetNavTextDisabled: {
    color: 'rgba(210, 225, 245, 0.7)',
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
