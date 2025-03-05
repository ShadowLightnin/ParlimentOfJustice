import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Member Data
const members = [
  { name: 'TBA', codename: '???', screen: '', clickable: false, position: [0, 0] },
  { name: '', codename: '', screen: '', clickable: false, position: [0, 2] },
  { name: '', codename: '', screen: '', clickable: false, position: [1, 0] },
  { name: '', codename: '', screen: '', clickable: false, position: [1, 1] },
  { name: 'TBA', codename: '???', screen: '', clickable: false, position: [1, 2] },
  { name: '', codename: '', screen: '', clickable: false, position: [2, 0] },
  { name: 'TBA', codename: '???', screen: '', clickable: false, position: [2, 2] },
];

// Function to check if a position should be empty
const isEmpty = (row, col) => (row === 0 && col === 1) || (row === 2 && col === 1);

// Function to get a member at a specific position
const getMemberAtPosition = (row, col) =>
  members.find((member) => member.position[0] === row && member.position[1] === col);

export const ConstollationScreen = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground source={require('../../assets/BackGround/helldivers.webp')} style={styles.background}>
      <SafeAreaView style={styles.container}>
        {/* Header & Back Button */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Constollation</Text>
        </View>

        {/* Grid Layout */}
        <View style={styles.grid}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((row) => (
            <View key={row} style={styles.row}>
              {[0, 1, 2].map((col) => {
                if (isEmpty(row, col)) {
                  return <View key={col} style={styles.emptyCell} />;
                }

                const member = getMemberAtPosition(row, col);
                return (
                  <TouchableOpacity
                    key={col}
                    style={[styles.card, !member?.clickable && styles.disabledCard]}
                    onPress={() => member?.clickable && navigation.navigate(member.screen)}
                    disabled={!member?.clickable}
                  >
                    <Text style={styles.name}>{member?.name || ''}</Text>
                    <Text style={styles.codename}>{member?.codename || ''}</Text>
                    {!member?.clickable && (
                      <Text style={styles.disabledText}>Not Clickable at the moment</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 50, // Prevents notch overlap
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
  },
  backText: {
    fontSize: 18,
    color: '#00b3ff',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#00b3ff',
    textShadowRadius: 15,
    textAlign: 'center',
    flex: 1,
  },
  grid: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -40, // Moves grid **up** to balance layout
  },
  row: {
    flexDirection: 'row',
  },
  emptyCell: {
    width: 100,
    height: 140,
    margin: 10,
  },
  card: {
    width: 100,
    height: 140,
    margin: 10,
    backgroundColor: '#1c1c1c',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: '#00b3ff',
    shadowOpacity: 1.5,
    shadowRadius: 10,
    elevation: 5,
    padding: 5,
  },
  name: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  codename: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#aaa',
    textAlign: 'center',
  },
  disabledCard: {
    backgroundColor: '#444',
    shadowColor: 'transparent',
  },
  disabledText: {
    fontSize: 10,
    color: '#ff4444',
    textAlign: 'center',
    marginTop: 5,
  },
});
