// screens/Planets/GalaxyMap.js
import React, { useState, useRef, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

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
const USE_WARP_GIF = Platform.OS !== 'web';   // corrected

const ICON_SIZE_STORAGE_KEY = 'galaxy_icon_size';
const MIN_ICON_SIZE = 1;
const MAX_ICON_SIZE = 10;
const ICON_STEP = 1;

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

// ----- COORD HELPERS (support 0–1 or 0–100) -----
const normalizeCoord = (value) => {
  if (value == null || Number.isNaN(value)) return 0;

  // If already in 0–1 range, treat as normalized
  if (value >= 0 && value <= 1) return value;

  // Otherwise treat as "0–100 grid units"
  // e.g. 49.0 -> 0.49, 73.2 -> 0.732
  return value / 100;
};

const coordToPixel = (value) => normalizeCoord(value) * MAP_BASE_SIZE;
// -----------------------------------------------

// Helper: distance between 2 touches
const getTouchDistance = (touches) => {
  if (!touches || touches.length < 2) return 0;
  const [a, b] = touches;
  if (!a || !b) return 0;
  const dx = (b.pageX || 0) - (a.pageX || 0);
  const dy = (b.pageY || 0) - (a.pageY || 0);
  return Math.sqrt(dx * dx + dy * dy);
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

  // === PLANET ICON SIZE (1–10), persisted ===
  const [iconSize, setIconSize] = useState(3);

  useEffect(() => {
    const loadSize = async () => {
      try {
        const stored = await AsyncStorage.getItem(ICON_SIZE_STORAGE_KEY);
        if (!stored) return;

        let parsed = parseFloat(stored);
        if (Number.isNaN(parsed)) return;

        parsed = Math.max(MIN_ICON_SIZE, Math.min(MAX_ICON_SIZE, parsed));
        setIconSize(parsed);
      } catch (e) {
        console.warn('Failed to load galaxy icon size', e);
      }
    };
    loadSize();
  }, []);

  const setAndPersistIconSize = async (newSize) => {
    const clamped = Math.max(MIN_ICON_SIZE, Math.min(MAX_ICON_SIZE, newSize));
    setIconSize(clamped);
    try {
      await AsyncStorage.setItem(ICON_SIZE_STORAGE_KEY, String(clamped));
    } catch (e) {
      console.warn('Failed to save galaxy icon size', e);
    }
  };

  const handleIconSizeIncrement = () => {
    setAndPersistIconSize(iconSize + ICON_STEP);
  };

  const handleIconSizeDecrement = () => {
    setAndPersistIconSize(iconSize - ICON_STEP);
  };

  const handleBack = () => {
    try {
      navigation.goBack();
    } catch (err) {
      console.warn('GalaxyMap back navigation error:', err);
    }
  };

  const handleSystemPress = (system) => {
    try {
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

        try {
          navigation.navigate('PlanetsHome', {
            initialPlanetId: targetPlanetId,
          });
        } catch (err) {
          console.warn('GalaxyMap navigation error:', err);
        }
      });
    } catch (err) {
      console.warn('GalaxyMap handleSystemPress error:', err);
      setWarpingTo(null);
      warpAnim.setValue(0);
    }
  };

  const currentSystem = currentPlanetId
    ? getSystemByPlanetId(currentPlanetId)
    : null;

  // --- FILTER SYSTEMS BY UNIVERSE ---
  const visibleSystems = getSystemsForUniverse(fromUniverse);
  const visibleSystemIds = new Set(visibleSystems.map((s) => s.id));

  // Generic zoom helper used by mouse wheel and +/- buttons
  const handleZoomDelta = (delta) => {
    scale.stopAnimation((current) => {
      const safeCurrent = Number.isFinite(current) ? current : INITIAL_SCALE;
      let next = safeCurrent + delta;
      next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, next));
      scale.setValue(next);
      lastScaleRef.current = next;
      pinchStartScaleRef.current = next;
    });
  };

  // Mouse wheel zoom (RN Web only – ignored on native)
  const handleWheel = (e) => {
    if (Platform.OS !== 'web') return;
    const nativeEvent = e?.nativeEvent;
    if (!nativeEvent) return;
    const deltaY = nativeEvent.deltaY || 0;
    const zoomDelta = deltaY > 0 ? -0.1 : 0.1;
    handleZoomDelta(zoomDelta);
  };

  // PanResponder to handle pinch + drag
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
          const d = getTouchDistance(touches);
          if (d > 0) {
            initialPinchDistanceRef.current = d;
            pinchStartScaleRef.current = lastScaleRef.current;
          }
        }
      },

// Inside PanResponder → onPanResponderMove, fix the pinch condition:
onPanResponderMove: (evt, gestureState) => {
  const touches = evt.nativeEvent?.touches || [];

  // Pinch – only on native (iOS/Android)
  if (touches.length === 2 && Platform.OS !== 'web') {
    const currentDistance = getTouchDistance(touches);
    if (initialPinchDistanceRef.current && currentDistance > 0) {
      let nextScale =
        (currentDistance / initialPinchDistanceRef.current) *
        pinchStartScaleRef.current;

      nextScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, nextScale));
      scale.setValue(nextScale);
      lastScaleRef.current = nextScale; // keep in sync
    }
  } else if (touches.length === 1) {
    // Single finger drag
    const nextX = lastPanRef.current.x + gestureState.dx;
    const nextY = lastPanRef.current.y + gestureState.dy;
    translateX.setValue(nextX);
    translateY.setValue(nextY);
  }
},

      onPanResponderRelease: () => {
        // Persist current transform for next gesture
        scale.stopAnimation((value) => {
          const safe = Number.isFinite(value) ? value : INITIAL_SCALE;
          lastScaleRef.current = safe;
          pinchStartScaleRef.current = safe;
          scale.setValue(safe);
        });
        translateX.stopAnimation((x) => {
          const safeX = Number.isFinite(x) ? x : 0;
          translateX.setValue(safeX);
          lastPanRef.current.x = safeX;
        });
        translateY.stopAnimation((y) => {
          const safeY = Number.isFinite(y) ? y : 0;
          translateY.setValue(safeY);
          lastPanRef.current.y = safeY;
        });
        initialPinchDistanceRef.current = null;
      },

      onPanResponderTerminationRequest: () => false,
      onPanResponderTerminate: () => {
        initialPinchDistanceRef.current = null;
        // Also make sure we don't leave weird values
        scale.stopAnimation((value) => {
          const safe = Number.isFinite(value) ? value : INITIAL_SCALE;
          scale.setValue(safe);
          lastScaleRef.current = safe;
          pinchStartScaleRef.current = safe;
        });
        translateX.stopAnimation((x) => {
          const safeX = Number.isFinite(x) ? x : 0;
          translateX.setValue(safeX);
          lastPanRef.current.x = safeX;
        });
        translateY.stopAnimation((y) => {
          const safeY = Number.isFinite(y) ? y : 0;
          translateY.setValue(safeY);
          lastPanRef.current.y = safeY;
        });
      },
    })
  ).current;

  // Derived sizes so glow stays centered & proportional
  const glowSize = iconSize + 2;
  const iconSizeDisplay = Number.isFinite(iconSize)
    ? iconSize.toFixed(1)
    : '—';

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

            {/* CONNECTIONS (only between visible systems) */}
            {CONNECTIONS.map((conn, idx) => {
              const fromSys = getSystemByPlanetId(conn.from);
              const toSys = getSystemByPlanetId(conn.to);
              if (!fromSys || !toSys) return null;

              if (
                !visibleSystemIds.has(fromSys.id) ||
                !visibleSystemIds.has(toSys.id)
              ) {
                return null;
              }

              const x1 = coordToPixel(fromSys.x);
              const y1 = coordToPixel(fromSys.y);
              const x2 = coordToPixel(toSys.x);
              const y2 = coordToPixel(toSys.y);

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
              const isCurrentSystem =
                currentSystem && currentSystem.id === sys.id;

              const centerX = coordToPixel(sys.x);
              const centerY = coordToPixel(sys.y);
              const quadrantGlowStyle = getQuadrantGlowStyle(sys.quadrant);

              return (
                <TouchableOpacity
                  key={sys.id}
                  style={[
                    styles.starWrapper,
                    {
                      left: centerX - iconSize / 2,
                      top: centerY - iconSize / 2,
                    },
                  ]}
                  onPress={() => handleSystemPress(sys)}
                  activeOpacity={sys.planetId ? 0.9 : 1}
                >
                  <View style={styles.planetWrapper}>
                    <View
                      style={[
                        styles.planetGlow,
                        quadrantGlowStyle,
                        isCurrentSystem && styles.planetGlowActive,
                        {
                          width: glowSize,
                          height: glowSize,
                          borderRadius: glowSize / 2,
                        },
                      ]}
                    />
                    {sys.image && (
                      <Image
                        source={sys.image}
                        style={[
                          styles.planetIcon,
                          {
                            width: iconSize,
                            height: iconSize,
                            borderRadius: iconSize / 2,
                          },
                        ]}
                        resizeMode="cover"
                      />
                    )}
                  </View>
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

        {/* ICON SIZE +/- CONTROL */}
        <View style={styles.sizeToggleRow}>
          <Text style={styles.sizeToggleLabel}>Icon size:</Text>

          <TouchableOpacity
            style={styles.sizeToggleButton}
            onPress={handleIconSizeDecrement}
            activeOpacity={0.8}
          >
            <Text style={styles.sizeToggleText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.sizeValueText}>{iconSizeDisplay}</Text>

          <TouchableOpacity
            style={styles.sizeToggleButton}
            onPress={handleIconSizeIncrement}
            activeOpacity={0.8}
          >
            <Text style={styles.sizeToggleText}>＋</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: 'rgba(120, 180, 255, 0.28)',
    shadowColor: '#7acbff',
    shadowOpacity: 0.7,
    shadowRadius: 3,
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
    marginTop: 6,
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

  // ICON SIZE TOGGLE
  sizeToggleRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sizeToggleLabel: {
    fontSize: 11,
    color: 'rgba(215, 215, 255, 0.9)',
    marginRight: 6,
  },
  sizeToggleButton: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(150, 170, 255, 0.7)',
    backgroundColor: 'rgba(10, 15, 35, 0.9)',
    marginHorizontal: 4,
  },
  sizeToggleText: {
    fontSize: 11,
    color: 'rgba(215, 215, 255, 0.9)',
    fontWeight: '500',
  },
  sizeValueText: {
    fontSize: 11,
    color: 'rgba(235, 235, 255, 0.95)',
    fontWeight: '600',
    minWidth: 36,
    textAlign: 'center',
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

export default GalaxyMap;
