// screens/Locations/OphirCityScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const OphirCityScreen = () => {
  const navigation = useNavigation();

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
          <Text style={styles.backText}>⬅ Philippines Map</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Lungsod ng Ophir</Text>
        <View style={{ width: 70 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={require('../../assets/BackGround/OGTitans.jpg')}
          style={styles.heroImage}
          resizeMode="cover"
        />

        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.bodyText}>
          Hidden beneath volcanoes and jungles, Ophir weaves Filipino heritage,
          biblical legend, and high sci-fi tech. Golden terraces, orichalcum-ginto
          towers, and illusion wards guard the city as it prepares for its role
          in the coming reunification with Zion City.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'black' },
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
    backgroundColor: 'rgba(15, 5, 40, 0.9)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(230, 190, 255, 0.9)',
  },
  backText: {
    color: '#FDEBFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    color: '#FFF8E6',
    fontWeight: 'bold',
    textShadowColor: '#ffd76f',
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
    color: '#FFF6E0',
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  bodyText: {
    fontSize: 13,
    color: 'rgba(255, 243, 225, 0.96)',
    lineHeight: 18,
  },
});

export default OphirCityScreen;
