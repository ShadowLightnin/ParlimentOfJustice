// screens/Locations/LocationMapScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { getLocationById } from './locationsConfig';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 🔒 Same idea as Galaxy Map: fixed base size canvas
const MAP_BASE_SIZE = Math.min(SCREEN_WIDTH - 24, SCREEN_HEIGHT * 0.8);

const LocationMapScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const initialLocationId = route.params?.locationId || 'earth_orbit_na';
  const location = getLocationById(initialLocationId);

  if (!location) {
    return (
      <View style={[styles.root, styles.center]}>
        <Text style={styles.errorText}>
          Location "{initialLocationId}" not found.
        </Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>⬅ Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBack = () => {
    navigation.goBack();
  };

  const handleToggleSide = () => {
    if (!location.toggle?.targetLocationId) return;
    navigation.replace('LocationMap', {
      locationId: location.toggle.targetLocationId,
    });
  };

  const handleViewPlanet = () => {
    if (!location.planetId) return;

    // ✅ uses the same nested navigation pattern you had working
    navigation.navigate('PlanetsScreen', {
      screen: 'PlanetsScreen',
      params: {
        initialPlanetId: location.planetId,
      },
    });
  };

  const handlePinPress = (pin) => {
    if (pin.targetLocationId) {
      navigation.push('LocationMap', {
        locationId: pin.targetLocationId,
      });
      return;
    }

    if (pin.targetScreen) {
      navigation.navigate(pin.targetScreen, {
        fromLocationId: location.id,
        pinId: pin.id,
      });
      return;
    }
  };

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.85}
        >
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

          {/* “View more locations on other worlds” button */}
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

        {/* Toggle (NA / PH, etc.) */}
        {location.toggle?.targetLocationId ? (
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={handleToggleSide}
            activeOpacity={0.85}
          >
            <Text style={styles.toggleText}>
              {location.toggle.label || 'Switch View'}
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 90 }} />
        )}
      </View>

      {/* MAP */}
      <View style={styles.mapContainer}>
        <View style={styles.mapInner}>
          {/* Background image – fixed canvas, like Galaxy Map */}
          <Image source={location.background} style={styles.mapImage} />

          {/* Pins */}
          {location.pins?.map((pin) => {
            const x = pin.position?.x ?? 0;
            const y = pin.position?.y ?? 0;

            // 🔢 Same math as Galaxy Map: normalized coords * MAP_BASE_SIZE
            const top = MAP_BASE_SIZE * y;
            const left = MAP_BASE_SIZE * x;

            return (
              <TouchableOpacity
                key={pin.id}
                style={[
                  styles.pinWrapper,
                  {
                    top,
                    left,
                  },
                ]}
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

      {/* FOOTER / DESCRIPTION HINT */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Tap a marker to zoom further in. Some pins open full city views.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'black',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 18,
    color: '#F5F1FF',
    fontWeight: 'bold',
    textShadowColor: '#6fb6ff',
    textShadowRadius: 14,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 11,
    color: 'rgba(205, 225, 255, 0.9)',
    textAlign: 'center',
  },

  planetLinkButton: {
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(160, 220, 255, 0.9)',
    backgroundColor: 'rgba(5, 25, 60, 0.9)',
  },
  planetLinkText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#E6F7FF',
    textAlign: 'center',
  },

  toggleButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(20, 40, 90, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(160, 210, 255, 0.9)',
    maxWidth: 120,
  },
  toggleText: {
    color: '#E6F2FF',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },

  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },

  // 🔒 Fixed-size canvas, like GalaxyMap’s mapOuter/mapInner
  mapInner: {
    width: MAP_BASE_SIZE,
    height: MAP_BASE_SIZE,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(150, 200, 255, 0.7)',
    backgroundColor: 'black',
  },

  // Mirror GalaxyMap’s image behavior (absolute, contain)
  mapImage: {
    position: 'absolute',
    width: MAP_BASE_SIZE,
    height: MAP_BASE_SIZE,
    resizeMode: 'contain',
  },

  pinWrapper: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinOuterGlow: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(130, 210, 255, 0.4)',
    shadowColor: '#7ad7ff',
    shadowOpacity: 0.9,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 0 },
  },
  pinInnerDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#7ad7ff',
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
  footerText: {
    fontSize: 11,
    color: 'rgba(215, 215, 255, 0.95)',
  },

  errorText: {
    color: '#ffd5d5',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
});

export default LocationMapScreen;
