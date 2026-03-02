import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function HoshimahalLocation({ navigation }) {
  return (
    <View style={styles.root}>
      <Image
        source={require('../../assets/Space/Hoshimahal.jpg')}
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.title}>Hoshimahal</Text>
      <Text style={styles.desc}>
        A distant galaxy node in the Justiceverse. Treat this like a “location”
        screen — you can add lore, factions, and entry points here.
      </Text>

      {/* Optional: Later you can navigate into a galaxy system map here */}
      {/* <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('GalaxySystemMapScreen', { mapId: 'ailehora' })}
      >
        <Text style={styles.buttonText}>Enter Galaxy</Text>
      </TouchableOpacity> */}

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>⬅ Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: 'black', padding: 16 },
  image: { width: '100%', height: 240, borderRadius: 14, marginBottom: 14 },
  title: { color: 'white', fontSize: 24, fontWeight: '800', marginBottom: 8 },
  desc: { color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 20 },
  backBtn: {
    marginTop: 18,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(120,190,255,0.8)',
    backgroundColor: 'rgba(5,20,60,0.9)',
  },
  backText: { color: 'white', fontWeight: '700' },
});
