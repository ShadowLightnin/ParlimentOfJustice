// screens/Planets/GalaxyMap.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Animated,
  PanResponder,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Square base size for the map (fits on screen, leaves room for header/HUD)
const MAP_BASE_SIZE = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT * 0.8);

// Galaxy map image
const GALAXY_MAP = require('../../assets/Space/The_best_Milky_Way_map_by_Gaia_labelled.jpg');

// Generic icon for Star Trek systems (tiny, so reuse a safe asset)
const TREK_ICON = require('../../assets/Space/Earth.jpg');

// Warp overlay gif
const Warp3Gif = require('../../assets/Space/warp3.gif');

/**
 * High-level systems, each linked to a primary world in that system.
 * x / y are 0–1 normalized positions relative to the map image.
 */
const SYSTEMS = [
  // ===== YOUR JUSTICEVERSE SYSTEMS =====
  {
    id: 'sol',
    name: 'Sol',
    planetId: 'earth',
    image: require('../../assets/Space/Earth.jpg'),
    x: 0.49,
    y: 0.69,
    quadrant: 'alpha',
    faction: 'justiceverse',
  },
  {
    id: 'nemesis',
    name: 'Nemesis',
    planetId: 'planet-x',
    image: require('../../assets/Space/PlanetX.jpg'),
    x: 0.46,
    y: 0.66,
    quadrant: 'alpha',
    faction: 'justiceverse',
  },
  {
    id: 'rogues',
    name: 'Rogues',
    planetId: 'wise',
    image: require('../../assets/Space/Wise.jpg'),
    x: 0.45,
    y: 0.72,
    quadrant: 'alpha',
    faction: 'justiceverse',
  },
  {
    id: 'ignis',
    name: 'Ignis',
    planetId: 'melcornia',
    image: require('../../assets/Space/Melcornia.jpg'),
    x: 0.6,
    y: 0.6,
    quadrant: 'beta',
    faction: 'justiceverse',
  },
  {
    id: 'zaxxon',
    name: 'Zaxxon',
    planetId: 'zaxxon',
    image: require('../../assets/Space/Zaxxon.jpg'),
    x: 0.78,
    y: 0.52,
    quadrant: 'beta',
    faction: 'justiceverse',
  },
  {
    id: 'older-brother',
    name: 'Older Brother',
    planetId: 'older-brother',
    image: require('../../assets/Space/OlderBrother.jpg'),
    x: 0.51,
    y: 0.67,
    quadrant: 'alpha',
    faction: 'justiceverse',
  },
  {
    id: 'twin-sister',
    name: 'Twin Sister',
    planetId: 'twin-sister',
    image: require('../../assets/Space/TwinSister.jpg'),
    x: 0.47,
    y: 0.73,
    quadrant: 'alpha',
    faction: 'justiceverse',
  },
  {
    id: 'korrthuun',
    name: 'Korrthuun',
    planetId: 'korrthuun',
    image: require('../../assets/Space/Korrthuun.jpg'),
    x: 0.88,
    y: 0.68,
    quadrant: 'beta',
    faction: 'justiceverse',
  },
  {
    id: 'kolob-placeholder',
    name: '',
    planetId: null,
    image: require('../../assets/Space/Kolob.jpg'),
    x: 0.52,
    y: 0.46,
    quadrant: 'custom',
    faction: 'justiceverse',
  },

  // ===== STAR TREK – ALPHA QUADRANT =====
  {
    id: 'vulcan',
    name: 'Vulcan',
    planetId: null,
    image: TREK_ICON,
    x: 0.45,
    y: 0.67,
    quadrant: 'alpha',
    faction: 'federation',
  },
  {
    id: 'andoria',
    name: 'Andoria',
    planetId: null,
    image: TREK_ICON,
    x: 0.46,
    y: 0.75,
    quadrant: 'alpha',
    faction: 'federation',
  },
  {
    id: 'tellar-prime',
    name: 'Tellar Prime',
    planetId: null,
    image: TREK_ICON,
    x: 0.43,
    y: 0.71,
    quadrant: 'alpha',
    faction: 'federation',
  },
  {
    id: 'ferenginar',
    name: 'Ferenginar',
    planetId: null,
    image: TREK_ICON,
    x: 0.38,
    y: 0.63,
    quadrant: 'alpha',
    faction: 'ferengi',
  },

  // ===== STAR TREK – BETA QUADRANT =====
  {
    id: 'qonos',
    name: "Qo'noS",
    planetId: null,
    image: TREK_ICON,
    x: 0.62,
    y: 0.67,
    quadrant: 'beta',
    faction: 'klingon',
  },
  {
    id: 'romulus',
    name: 'Romulus',
    planetId: null,
    image: TREK_ICON,
    x: 0.7,
    y: 0.63,
    quadrant: 'beta',
    faction: 'romulan',
  },
  {
    id: 'cardassia',
    name: 'Cardassia Prime',
    planetId: null,
    image: TREK_ICON,
    x: 0.54,
    y: 0.73,
    quadrant: 'beta',
    faction: 'cardassian',
  },

  // ===== STAR TREK – GAMMA QUADRANT =====
  {
    id: 'founders-homeworld',
    name: "Founders' Homeworld",
    planetId: null,
    image: TREK_ICON,
    x: 0.33,
    y: 0.3,
    quadrant: 'gamma',
    faction: 'dominion',
  },
  {
    id: 'vorta-prime',
    name: 'Vorta Prime',
    planetId: null,
    image: TREK_ICON,
    x: 0.28,
    y: 0.22,
    quadrant: 'gamma',
    faction: 'dominion',
  },
  {
    id: 'jemhadar-world',
    name: 'Jem’Hadar World',
    planetId: null,
    image: TREK_ICON,
    x: 0.36,
    y: 0.4,
    quadrant: 'gamma',
    faction: 'dominion',
  },

  // ===== STAR TREK – DELTA QUADRANT =====
  {
    id: 'unimatrix-01',
    name: 'Unimatrix 01',
    planetId: null,
    image: TREK_ICON,
    x: 0.78,
    y: 0.22,
    quadrant: 'delta',
    faction: 'borg',
  },
  {
    id: 'ocampa',
    name: 'Ocampa',
    planetId: null,
    image: TREK_ICON,
    x: 0.88,
    y: 0.18,
    quadrant: 'delta',
    faction: 'delta-world',
  },
  {
    id: 'talax',
    name: 'Talax',
    planetId: null,
    image: TREK_ICON,
    x: 0.82,
    y: 0.26,
    quadrant: 'delta',
    faction: 'delta-world',
  },

  // ===== CYBERTRON =====
  {
    id: 'cybertron',
    name: 'Cybertron',
    planetId: null,
    x: 0.8,
    y: 0.33,
    quadrant: 'delta',
    faction: 'cybertronian',
  },
];

// Simple connections placeholder (kept for future use)
const CONNECTIONS = [];

const getSystemByPlanetId = (planetId) =>
  SYSTEMS.find((s) => s.planetId === planetId) || null;

const getQuadrantGlowStyle = (quadrant) => {
  switch (quadrant) {
    case 'alpha':
      return styles.glowAlpha;
    case 'beta':
      return styles.glowBeta;
    case 'gamma':
      return styles.glowGamma;
    case 'delta':
      return styles.glowDelta;
    default:
      return null;
  }
};

const GalaxyMap = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const fromUniverse = route.params?.fromUniverse || 'prime';
  const currentPlanetId = route.params?.currentPlanetId || null;

  // WARP STATE
  const warpAnim = useRef(new Animated.Value(0)).current;
  const [warpingTo, setWarpingTo] = useState(null);

  // Initial zoom: a bit zoomed in on desktop, normal on mobile
  const INITIAL_SCALE = SCREEN_WIDTH > 600 ? 1.4 : 1;

  const scale = useRef(new Animated.Value(INITIAL_SCALE)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  const lastScaleRef = useRef(INITIAL_SCALE);
  const lastPanRef = useRef({ x: 0, y: 0 });
  const initialPinchDistanceRef = useRef(null);
  const pinchStartScaleRef = useRef(INITIAL_SCALE);

  const MIN_SCALE = 1;
  const MAX_SCALE = SCREEN_WIDTH > 600 ? 7 : 5.5;

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSystemPress = (system) => {
    // Only warp if the system has a mapped planetId in your PlanetsHome
    if (warpingTo || !system?.planetId) return;

    setWarpingTo(system.planetId);
    warpAnim.setValue(0);

    Animated.timing(warpAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      const targetPlanetId = system.planetId;
      setWarpingTo(null);
      warpAnim.setValue(0);

      navigation.navigate('PlanetsHome', {
        initialPlanetId: targetPlanetId,
      });
    });
  };

  const currentSystem = currentPlanetId
    ? getSystemByPlanetId(currentPlanetId)
    : null;

  // Helper: distance between 2 touches
  const getTouchDistance = (touches) => {
    const [a, b] = touches;
    const dx = b.pageX - a.pageX;
    const dy = b.pageY - a.pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Generic zoom helper used by mouse wheel and +/- buttons
  const handleZoomDelta = (delta) => {
    scale.stopAnimation((current) => {
      let next = current + delta;
      next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, next));
      scale.setValue(next);
      lastScaleRef.current = next;
      pinchStartScaleRef.current = next;
    });
  };

  // Mouse wheel zoom (RN Web only – ignored on native)
  const handleWheel = (e) => {
    const nativeEvent = e?.nativeEvent;
    if (!nativeEvent) return;
    const deltaY = nativeEvent.deltaY || 0;
    const zoomDelta = deltaY > 0 ? -0.15 : 0.15;
    handleZoomDelta(zoomDelta);
  };

  // PanResponder to handle pinch + drag on touch devices
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt) => {
        const touches = evt.nativeEvent.touches || [];
        if (touches.length === 2) {
          initialPinchDistanceRef.current = getTouchDistance(touches);
          pinchStartScaleRef.current = lastScaleRef.current;
        }
      },

      onPanResponderMove: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches || [];

        // Pinch (two fingers)
        if (touches.length === 2) {
          const currentDistance = getTouchDistance(touches);
          if (initialPinchDistanceRef.current) {
            let nextScale =
              (currentDistance / initialPinchDistanceRef.current) *
              pinchStartScaleRef.current;

            nextScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, nextScale));
            scale.setValue(nextScale);
          }
        } else if (touches.length === 1) {
          // Drag (one finger)
          const nextX = lastPanRef.current.x + gestureState.dx;
          const nextY = lastPanRef.current.y + gestureState.dy;
          translateX.setValue(nextX);
          translateY.setValue(nextY);
        }
      },

      onPanResponderRelease: () => {
        // Persist current transform for next gesture
        scale.stopAnimation((value) => {
          lastScaleRef.current = value;
          pinchStartScaleRef.current = value;
        });
        translateX.stopAnimation((x) => {
          translateX.setValue(x);
          lastPanRef.current.x = x;
        });
        translateY.stopAnimation((y) => {
          translateY.setValue(y);
          lastPanRef.current.y = y;
        });
        initialPinchDistanceRef.current = null;
      },

      onPanResponderTerminationRequest: () => false,
      onPanResponderTerminate: () => {
        initialPinchDistanceRef.current = null;
      },
    })
  ).current;

  return (
    <View style={styles.root}>
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

        <View style={{ width: 60 }} />
      </View>

      {/* MAP AREA */}
      <View style={styles.starfield}>
        {/* onWheel works on web; no effect on native */}
        {/* @ts-ignore web-only prop */}
        <View style={styles.mapOuter} onWheel={handleWheel}>
          <Animated.View
            style={[
              styles.mapInner,
              {
                transform: [{ scale }, { translateX }, { translateY }],
              },
            ]}
            {...panResponder.panHandlers}
          >
            {/* Galaxy image */}
            <Image
              source={GALAXY_MAP}
              style={styles.galaxyImage}
              resizeMode="contain"
            />

            {/* QUADRANT DIVIDERS */}
            <View
              style={[
                styles.quadrantLine,
                {
                  width: MAP_BASE_SIZE,
                  left: 0,
                  top: MAP_BASE_SIZE * 0.5,
                },
              ]}
            />
            <View
              style={[
                styles.quadrantLine,
                {
                  height: MAP_BASE_SIZE,
                  top: 0,
                  left: MAP_BASE_SIZE * 0.5,
                },
              ]}
            />

            {/* QUADRANT LABELS */}
            <Text
              style={[
                styles.quadrantLabel,
                { left: MAP_BASE_SIZE * 0.18, top: MAP_BASE_SIZE * 0.7 },
              ]}
            >
              ALPHA
            </Text>
            <Text
              style={[
                styles.quadrantLabel,
                { left: MAP_BASE_SIZE * 0.68, top: MAP_BASE_SIZE * 0.7 },
              ]}
            >
              BETA
            </Text>
            <Text
              style={[
                styles.quadrantLabel,
                { left: MAP_BASE_SIZE * 0.18, top: MAP_BASE_SIZE * 0.18 },
              ]}
            >
              GAMMA
            </Text>
            <Text
              style={[
                styles.quadrantLabel,
                { left: MAP_BASE_SIZE * 0.68, top: MAP_BASE_SIZE * 0.18 },
              ]}
            >
              DELTA
            </Text>

            {/* CONNECTIONS (placeholder) */}
            {CONNECTIONS.map((conn, idx) => {
              const fromSys = getSystemByPlanetId(conn.from);
              const toSys = getSystemByPlanetId(conn.to);
              if (!fromSys || !toSys) return null;

              const x1 = fromSys.x * MAP_BASE_SIZE;
              const y1 = fromSys.y * MAP_BASE_SIZE;
              const x2 = toSys.x * MAP_BASE_SIZE;
              const y2 = toSys.y * MAP_BASE_SIZE;

              const dx = x2 - x1;
              const dy = y2 - y1;
              const length = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx) * (180 / Math.PI);
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;

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
              const isCurrentSystem =
                currentSystem && currentSystem.id === sys.id;

              const scaleWarp = isWarpingThis
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

              const left = sys.x * MAP_BASE_SIZE;
              const top = sys.y * MAP_BASE_SIZE;
              const quadrantGlowStyle = getQuadrantGlowStyle(sys.quadrant);

              return (
                <TouchableOpacity
                  key={sys.id}
                  style={[styles.starWrapper, { left, top }]}
                  onPress={() => handleSystemPress(sys)}
                  activeOpacity={sys.planetId ? 0.9 : 1}
                >
                  <Animated.View
                    style={[
                      styles.planetWrapper,
                      { transform: [{ scale: scaleWarp }], opacity },
                    ]}
                  >
                    <View
                      style={[
                        styles.planetGlow,
                        quadrantGlowStyle,
                        isCurrentSystem && styles.planetGlowActive,
                      ]}
                    />
                    {sys.image && (
                      <Image
                        source={sys.image}
                        style={styles.planetIcon}
                        resizeMode="cover"
                      />
                    )}
                  </Animated.View>
                  <Text style={styles.starName}>{sys.name}</Text>
                </TouchableOpacity>
              );
            })}
          </Animated.View>

          {/* ZOOM BUTTONS */}
          <View style={styles.zoomControls}>
            <TouchableOpacity
              style={styles.zoomButton}
              onPress={() => handleZoomDelta(0.25)}
              activeOpacity={0.8}
            >
              <Text style={styles.zoomText}>＋</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.zoomButton}
              onPress={() => handleZoomDelta(-0.25)}
              activeOpacity={0.8}
            >
              <Text style={styles.zoomText}>－</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* HUD */}
      <View style={styles.hud}>
        <Text style={styles.hudText}>
          Drag to pan, pinch or scroll to zoom. Tap a system to warp.
        </Text>
        {currentPlanetId && (
          <Text style={styles.hudSecondary}>
            Current focus:{' '}
            {currentSystem
              ? `${currentSystem.name} (${currentPlanetId})`
              : currentPlanetId.toUpperCase()}
          </Text>
        )}
      </View>

      {/* Warp overlay with warp3.gif */}
      {warpingTo && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.warpOverlay,
            {
              opacity: warpAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
          ]}
        >
          <Image source={Warp3Gif} style={styles.warpImage} resizeMode="cover" />
          {/* <View style={styles.warpTextWrapper}>
            <Text style={styles.warpText}>
              Warping to {getSystemByPlanetId(warpingTo)?.name || 'destination'}…
            </Text>
          </View> */}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'black',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapOuter: {
    width: MAP_BASE_SIZE,
    height: MAP_BASE_SIZE,
    overflow: 'hidden',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(120, 190, 255, 0.7)',
    backgroundColor: 'black',
  },
  mapInner: {
    width: MAP_BASE_SIZE,
    height: MAP_BASE_SIZE,
  },
  galaxyImage: {
    position: 'absolute',
    width: MAP_BASE_SIZE,
    height: MAP_BASE_SIZE,
  },

  quadrantLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  quadrantLabel: {
    position: 'absolute',
    fontSize: 8,
    letterSpacing: 2,
    color: 'rgba(240, 240, 255, 0.9)',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowRadius: 6,
    fontWeight: '600',
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
    width: 12,
    height: 12,
    borderRadius: 30,
    backgroundColor: 'rgba(120, 180, 255, 0.28)',
    shadowColor: '#7acbff',
    shadowOpacity: 0.7,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },
  glowAlpha: {
    backgroundColor: 'rgba(120, 180, 255, 0.35)',
    shadowColor: '#8ac5ff',
  },
  glowBeta: {
    backgroundColor: 'rgba(255, 130, 130, 0.35)',
    shadowColor: '#ff8a8a',
  },
  glowGamma: {
    backgroundColor: 'rgba(210, 130, 255, 0.35)',
    shadowColor: '#d28aff',
  },
  glowDelta: {
    backgroundColor: 'rgba(140, 255, 180, 0.35)',
    shadowColor: '#92ffb8',
  },
  planetGlowActive: {
    backgroundColor: 'rgba(244, 206, 12, 0.8)',
    shadowColor: '#e6d520',
  },
  planetIcon: {
    width: 10,
    height: 10,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: 'rgba(200, 230, 255, 0.9)',
    overflow: 'hidden',
  },
  starName: {
    marginTop: 1,
    fontSize: 2,
    color: '#F8F3FF',
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowRadius: 8,
  },

  connectionLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: 'rgba(140, 190, 255, 0.45)',
    borderRadius: 999,
  },

  zoomControls: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    flexDirection: 'column',
    gap: 6,
  },
  zoomButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(5, 20, 50, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(150, 210, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomText: {
    color: '#EFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
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

  // WARP OVERLAY
  warpOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
    backgroundColor: 'black',
  },
  warpImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  warpTextWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
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
