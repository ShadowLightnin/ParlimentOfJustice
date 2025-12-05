// screens/Locations/AegisCompoundScreen.js
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AegisCompoundScreen = () => {
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
          <Text style={styles.backText}>⬅ Utah Map</Text>
        </TouchableOpacity>
        <Text style={styles.title}>The Aegis Compound</Text>
        <View style={{ width: 70 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={require('../../assets/BackGround/ShipYard.jpg')}
          style={styles.heroImage}
          resizeMode="cover"
        />

        <Text style={styles.sectionTitle}>Overview</Text>
        <Text style={styles.bodyText}>
          The Aegis is the true fortress of the Parliament — a vast white
          compound hidden in the Utah grassy desert. From the U-shaped entrance
          drive and Christ statue lobby to the hangar fields and launch pads,
          every design choice is built for heroes, starships, and war against
          the Maw.
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
    fontSize: 18,
    color: '#FDF5FF',
    fontWeight: 'bold',
    textShadowColor: '#9ddcff',
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

export default AegisCompoundScreen;
