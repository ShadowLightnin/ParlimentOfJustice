import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { getLocationById } from './locationsConfig';

const LocationMapScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

  const MAP_BASE_SIZE = useMemo(
    () => Math.min(SCREEN_WIDTH - 24, SCREEN_HEIGHT * 0.8),
    [SCREEN_WIDTH, SCREEN_HEIGHT]
  );

  // ✅ Keep the map “inside” this one screen (no navigation transitions)
  const initialLocationId = route.params?.locationId || 'earth_orbit_na';
  const [locationId, setLocationId] = useState(initialLocationId);

  // ✅ Simple internal back-stack for smooth “Back” behavior between location views
  const [history, setHistory] = useState([]);

  // If something else navigates here with a different locationId, sync it
  useEffect(() => {
    if (route.params?.locationId && route.params.locationId !== locationId) {
      setLocationId(route.params.locationId);
      setHistory([]); // optional: reset history when coming from outside
    }
  }, [route.params?.locationId]);

  const location = getLocationById(locationId);

  if (!location) {
    return (
      <View style={[styles.root, styles.center]}>
        <Text style={styles.errorText}>Location "{locationId}" not found.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>⬅ Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const goInternal = (nextId) => {
    setHistory((h) => [...h, locationId]);
    setLocationId(nextId);
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory((h) => h.slice(0, -1));
      setLocationId(prev);
      return;
    }
    navigation.goBack();
  };

  const handleToggleSide = () => {
    const target = location.toggle?.targetLocationId;
    if (!target) return;
    goInternal(target); // ✅ NO slide transition
  };

  const handleViewPlanet = () => {
    if (!location.planetId) return;
    navigation.navigate('PlanetsScreen', {
      screen: 'PlanetsScreen',
      params: { initialPlanetId: location.planetId },
    });
  };

  const handlePinPress = (pin) => {
    if (pin.targetLocationId) {
      goInternal(pin.targetLocationId); // ✅ NO slide transition
      return;
    }
    if (pin.targetScreen) {
      navigation.navigate(pin.targetScreen, {
        fromLocationId: location.id,
        pinId: pin.id,
      });
    }
  };

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack} activeOpacity={0.85}>
          <Text style={styles.backText}>⬅ Back</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.title}>{location.name}</Text>
          <Text style={styles.subtitle}>
            {location.type === 'planet-side'
              ? 'Planet-side view'
              : location.type === 'region'
              ? 'Regional map'
              : 'Location map'}
          </Text>

          {location.planetId && (
            <TouchableOpacity
              style={styles.planetLinkButton}
              onPress={handleViewPlanet}
              activeOpacity={0.85}
            >
              <Text style={styles.planetLinkText}>
                View more locations on other worlds
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {location.toggle?.targetLocationId ? (
          <TouchableOpacity style={styles.toggleButton} onPress={handleToggleSide} activeOpacity={0.85}>
            <Text style={styles.toggleText}>{location.toggle.label || 'Switch View'}</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 90 }} />
        )}
      </View>

      {/* MAP */}
      <View style={styles.mapContainer}>
        <View style={[styles.mapInner, { width: MAP_BASE_SIZE, height: MAP_BASE_SIZE }]}>
          <Image
            source={location.background}
            style={{ position: 'absolute', width: MAP_BASE_SIZE, height: MAP_BASE_SIZE, resizeMode: 'contain' }}
          />

          {location.pins?.map((pin) => {
            const x = pin.position?.x ?? 0;
            const y = pin.position?.y ?? 0;

            return (
              <TouchableOpacity
                key={pin.id}
                style={[styles.pinWrapper, { top: MAP_BASE_SIZE * y, left: MAP_BASE_SIZE * x }]}
                onPress={() => handlePinPress(pin)}
                activeOpacity={0.9}
              >
                <View style={styles.pinOuterGlow} />
                <View style={styles.pinInnerDot} />
                <Text style={styles.pinLabel}>{pin.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Tap a marker to zoom further in. Some pins open full city views.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'black' },
  center: { justifyContent: 'center', alignItems: 'center' },

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
  backText: { color: '#E6F7FF', fontSize: 14, fontWeight: 'bold' },

  headerCenter: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  title: {
    fontSize: 18,
    color: '#F5F1FF',
    fontWeight: 'bold',
    textShadowColor: '#6fb6ff',
    textShadowRadius: 14,
    textAlign: 'center',
  },
  subtitle: { marginTop: 2, fontSize: 11, color: 'rgba(205, 225, 255, 0.9)', textAlign: 'center' },

  planetLinkButton: {
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(160, 220, 255, 0.9)',
    backgroundColor: 'rgba(5, 25, 60, 0.9)',
  },
  planetLinkText: { fontSize: 11, fontWeight: '600', color: '#E6F7FF', textAlign: 'center' },

  toggleButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(20, 40, 90, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(160, 210, 255, 0.9)',
    maxWidth: 120,
  },
  toggleText: { color: '#E6F2FF', fontSize: 10, fontWeight: '600', textAlign: 'center' },

  mapContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 8 },
  mapInner: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(150, 200, 255, 0.7)',
    backgroundColor: 'black',
  },

  pinWrapper: { position: 'absolute', alignItems: 'center' },
  pinOuterGlow: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: 'rgba(130, 210, 255, 0.4)',
    shadowColor: '#7ad7ff', shadowOpacity: 0.9, shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  pinInnerDot: {
    position: 'absolute',
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#ffffff',
    borderWidth: 1, borderColor: '#7ad7ff',
  },
  pinLabel: {
    marginTop: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: 'rgba(5, 10, 25, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(150, 200, 255, 0.8)',
    color: '#EAF3FF',
    fontSize: 10,
    fontWeight: '500',
  },

  footer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(150, 130, 210, 0.7)',
    backgroundColor: 'rgba(5, 10, 30, 0.95)',
  },
  footerText: { fontSize: 11, color: 'rgba(215, 215, 255, 0.95)' },

  errorText: { color: '#ffd5d5', fontSize: 14, marginBottom: 12, textAlign: 'center' },
});

export default LocationMapScreen;
