import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import OlympiansMembers from './OlympiansMembers';

// Screen dimensions
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// Grid settings
const isDesktop = SCREEN_WIDTH > 600;
const columns = isDesktop ? 6 : 3; 
const cardSize = isDesktop ? 160 : 100;
const cardHeightMultiplier = 1.6;
const horizontalSpacing = isDesktop ? 40 : 10; 
const verticalSpacing = isDesktop ? 50 : 20; 

// Rows based on number of members
const rows = Math.ceil(OlympiansMembers.length / columns);

export const OlympiansScreen = () => {
  const navigation = useNavigation();

  const goToChat = () => {
    navigation.navigate('TeamChat');
  };

  return (
    <ImageBackground source={require('../../assets/BackGround/Olympian.jpg')} style={styles.background}>
      <SafeAreaView style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Olympians</Text>
          <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
            <Text style={styles.chatText}>🛡️</Text>
          </TouchableOpacity>
        </View>

        {/* Grid Layout */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <View
            key={rowIndex}
            style={[styles.row, { marginBottom: verticalSpacing, gap: horizontalSpacing }]}
          >
            {Array.from({ length: columns }).map((_, colIndex) => {
              const memberIndex = rowIndex * columns + colIndex;
              const member = OlympiansMembers[memberIndex];
            
              if (!member) {
                return (
                  <View 
                    key={colIndex} 
                    style={{ width: cardSize, height: cardSize * cardHeightMultiplier }}
                  />
                );
              }
            
              return (
                <TouchableOpacity
                  key={colIndex}
                  style={[
                    styles.card,
                    { width: cardSize, height: cardSize * cardHeightMultiplier },
                    !member.clickable && styles.disabledCard,
                  ]}
                  disabled={!member?.clickable}
                  onPress={() => member?.clickable && navigation.navigate(member.screen)}
                >
                  {member?.image && (
                    <Image source={member.image} style={styles.characterImage} />
                  )}

                  {/* Render codename ONLY if it exists */}
                  {member?.codename ? (
                    <Text style={styles.codename}>{member.codename}</Text>
                  ) : null}

                  {/* Render name ONLY if it exists */}
                  {member?.name ? (
                    <Text style={styles.name}>{member.name}</Text>
                  ) : null}

                  {!member?.clickable && (
                    <Text style={styles.disabledText}>Not Clickable</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 50,
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
    textAlign: 'center',
  },
  chatButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
  },
  chatText: {
    fontSize: 20,
    color: '#00b3ff',
  },
  scrollContainer: {
    paddingBottom: 20,
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#1c1c1c',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    padding: 5,
    shadowColor: '#00b3ff',
    shadowOpacity: 1.5,
    shadowRadius: 10,
    elevation: 5,
  },
  disabledCard: {
    shadowColor: 'transparent',
    backgroundColor: '#444',
  },
  characterImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  name: {
    fontSize: 10,            // Smaller size for names
    fontStyle: 'italic',     // Italic for names
    color: '#aaa',           // Lighter color for names
    textAlign: 'center',
  },
  
  codename: {
    fontSize: 12,            // Larger size for codenames
    fontWeight: 'bold',      // Bold for codenames
    color: '#fff',           // Brighter color for codenames
    textAlign: 'center',
    marginTop: 5,
  },
    disabledText: {
    fontSize: 10,
    color: '#ff4444',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default OlympiansScreen;
