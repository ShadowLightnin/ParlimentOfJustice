// screens/Planets/PinnacleGalaxyMap.js
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
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  SYSTEMS,
  CONNECTIONS,
  getSystemByPlanetId,
  getSystemsForUniverse,
} from './galaxySystems';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Square base size for the map (fits on screen, leaves room for header/HUD)
const MAP_BASE_SIZE = Math.min(SCREEN_WIDTH, SCREEN_HEIGHT * 0.8);

// Galaxy map image
const GALAXY_MAP = require('../../assets/Space/MilkyWay.jpg');

// Warp overlay gif (used mainly on native)
const Warp3Gif = require('../../assets/Space/warp3.gif');

// On web / IG in-app browser, big GIF + animation can be crashy.
// So we only use the warp GIF on native by default.
const USE_WARP_GIF = Platform;

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

// Helper: distance between 2 touches
const getTouchDistance = (touches) => {
  if (!touches || touches.length < 2) return 0;
  const [a, b] = touches;
  const dx = b.pageX - a.pageX;
  const dy = b.pageY - a.pageY;
  return Math.sqrt(dx * dx + dy * dy);
};

const PinnacleGalaxyMap = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // This screen is always Pinnacle universe
  const fromUniverse = 'pinnacle';
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
    try {
      // Explicitly go back to Pinnacle planets screen
      navigation.navigate('PinnaclePlanets');
    } catch (err) {
      console.warn('PinnacleGalaxyMap back navigation error:', err);
    }
  };

  const handleSystemPress = (system) => {
    try {
      // Only warp if the system has a mapped planetId
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

        try {
          navigation.navigate('PinnaclePlanets', {
            initialPlanetId: targetPlanetId,
          });
        } catch (err) {
          console.warn('PinnacleGalaxyMap navigation error:', err);
        }
      });
    } catch (err) {
      console.warn('PinnacleGalaxyMap handleSystemPress error:', err);
      setWarpingTo(null);
      warpAnim.setValue(0);
    }
  };

  const currentSystem = currentPlanetId
    ? getSystemByPlanetId(currentPlanetId)
    : null;

  // --- FILTER SYSTEMS BY UNIVERSE (Pinnacle only) ---
  const visibleSystems = getSystemsForUniverse(fromUniverse);
  const visibleSystemIds = new Set(visibleSystems.map((s) => s.id));

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
      onStartShouldSetPanResponder: (evt) => {
        const touches = evt.nativeEvent?.touches || [];
        return touches.length >= 1;
      },
      onMoveShouldSetPanResponder: (evt) => {
        const touches = evt.nativeEvent?.touches || [];
        return touches.length >= 1;
      },

      onPanResponderGrant: (evt) => {
        const touches = evt.nativeEvent?.touches || [];
        if (touches.length === 2) {
          initialPinchDistanceRef.current = getTouchDistance(touches);
          pinchStartScaleRef.current = lastScaleRef.current;
        }
      },

      onPanResponderMove: (evt, gestureState) => {
        const touches = evt.nativeEvent?.touches || [];

        // Pinch (two fingers) – native only; web falls back to scroll/zoom buttons
        if (touches.length === 2 && Platform) {
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
          <Text style={styles.title}>Pinnacle Galaxy Map</Text>
          <Text style={styles.subtitle}>Pinnacle Universe Stellar Chart</Text>
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

            {/* RED TINT OVERLAY */}
            <View style={styles.redTint} pointerEvents="none" />

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

            {/* CONNECTIONS (only between visible systems) */}
            {CONNECTIONS.map((conn, idx) => {
              const fromSys = getSystemByPlanetId(conn.from);
              const toSys = getSystemByPlanetId(conn.to);
              if (!fromSys || !toSys) return null;

              // Skip if either system is hidden in this universe view
              if (
                !visibleSystemIds.has(fromSys.id) ||
                !visibleSystemIds.has(toSys.id)
              ) {
                return null;
              }

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
            {visibleSystems.map((sys) => {
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

      {/* Warp overlay */}
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
          {USE_WARP_GIF ? (
            <Image
              source={Warp3Gif}
              style={styles.warpImage}
              resizeMode="cover"
            />
          ) : (
            // Web / IG: simple fade to black background (already black)
            <View style={{ flex: 1 }} />
          )}
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
    backgroundColor: 'rgba(60, 0, 40, 0.9)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255, 100, 170, 0.9)',
  },
  backText: {
    color: '#FFE6FF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    color: '#FFE9FF',
    fontWeight: 'bold',
    textShadowColor: '#ff4f8a',
    textShadowRadius: 16,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 11,
    color: 'rgba(255, 190, 230, 0.95)',
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
    borderColor: 'rgba(255, 90, 160, 0.7)',
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
  redTint: {
    position: 'absolute',
    width: MAP_BASE_SIZE,
    height: MAP_BASE_SIZE,
    backgroundColor: 'rgba(150, 0, 50, 0.35)',
  },

  quadrantLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 140, 190, 0.35)',
  },
  quadrantLabel: {
    position: 'absolute',
    fontSize: 8,
    letterSpacing: 2,
    color: 'rgba(255, 230, 245, 0.9)',
    textShadowColor: 'rgba(0, 0, 0, 0.95)',
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
    backgroundColor: 'rgba(255, 130, 170, 0.28)',
    shadowColor: '#ff6fa6',
    shadowOpacity: 0.8,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
  },
  glowAlpha: {
    backgroundColor: 'rgba(255, 120, 150, 0.4)',
    shadowColor: '#ff6c99',
  },
  glowBeta: {
    backgroundColor: 'rgba(255, 90, 200, 0.4)',
    shadowColor: '#ff5fb8',
  },
  glowGamma: {
    backgroundColor: 'rgba(210, 90, 255, 0.4)',
    shadowColor: '#d262ff',
  },
  glowDelta: {
    backgroundColor: 'rgba(255, 160, 120, 0.4)',
    shadowColor: '#ff9a76',
  },
  planetGlowActive: {
    backgroundColor: 'rgba(255, 220, 90, 0.85)',
    shadowColor: '#ffe76f',
  },
  planetIcon: {
    width: 10,
    height: 10,
    borderRadius: 40,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 220, 245, 0.95)',
    overflow: 'hidden',
  },
  starName: {
    marginTop: 1,
    fontSize: 2,
    color: '#FFF5FF',
    textShadowColor: 'rgba(0, 0, 0, 0.95)',
    textShadowRadius: 8,
  },

  connectionLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: 'rgba(255, 110, 180, 0.55)',
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
    backgroundColor: 'rgba(40, 0, 40, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 140, 210, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoomText: {
    color: '#FFEFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },

  hud: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 110, 180, 0.8)',
    backgroundColor: 'rgba(15, 0, 25, 0.95)',
  },
  hudText: {
    fontSize: 12,
    color: 'rgba(255, 215, 240, 0.96)',
  },
  hudSecondary: {
    marginTop: 2,
    fontSize: 11,
    color: 'rgba(255, 190, 230, 0.9)',
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
});

export default PinnacleGalaxyMap;
