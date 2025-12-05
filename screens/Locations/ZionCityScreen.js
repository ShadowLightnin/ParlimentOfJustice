// screens/Locations/ZionCityScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const ZionCityScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.85}
        >
          <Text style={styles.backText}>⬅ Utah Map</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Zion City</Text>
        <View style={{ width: 70 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Hero image placeholder – swap with your Zion render later */}
        <Image
          source={require('../../assets/BackGround/OGTitans.jpg')}
          style={styles.heroImage}
          resizeMode="cover"
        />

        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.bodyText}>
          Zion City is the Parliament&apos;s primary megacity on Earth — a rising
          skyline in the Utah desert. Each sector blends modern-day Utah
          architecture with advanced Parliament tech, forming Celestial,
          Terrestrial, Telestial, and Outer Darkness rings around the central
          Parliament towers.
        </Text>

        {/* Add more sections later: sectors, landmarks, transit, etc. */}
      </ScrollView>
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
    backgroundColor: 'rgba(10, 30, 70, 0.9)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(150, 200, 255, 0.9)',
  },
  backText: {
    color: '#E6F7FF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    color: '#FDF5FF',
    fontWeight: 'bold',
    textShadowColor: '#7ad7ff',
    textShadowRadius: 14,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  heroImage: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#F5F1FF',
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  bodyText: {
    fontSize: 13,
    color: 'rgba(225, 225, 255, 0.95)',
    lineHeight: 18,
  },
});

export default ZionCityScreen;
