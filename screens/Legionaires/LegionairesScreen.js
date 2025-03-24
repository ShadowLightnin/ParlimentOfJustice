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
import legionairesMembers from './LegionairesMembers';

// Screen dimensions
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;
const columns = isDesktop ? 7 : 3;
const rows = Math.ceil(legionairesMembers.length / columns);
const cardSize = isDesktop ? 160 : 100;
const cardHeightMultiplier = 1.6;
const horizontalSpacing = isDesktop ? 40 : 10;
const verticalSpacing = isDesktop ? 20 : 10;

export const LegionairesScreen = () => {
  const navigation = useNavigation();

  const goToChat = () => {
    navigation.navigate('TeamChat');
  };

  return (
    <ImageBackground
      source={require('../../assets/BackGround/League.jpg')}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        {/* Header, Back, and Chat Button */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>The Legionnaires</Text>
          <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
            <Text style={styles.chatText}>🛡️</Text>
          </TouchableOpacity>
        </View>

        {/* Grid Layout with Scroll Support */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <View key={rowIndex} style={[styles.row, { marginBottom: verticalSpacing }]}>
              {Array.from({ length: columns }).map((_, colIndex) => {
                const memberIndex = rowIndex * columns + colIndex;
                const member = legionairesMembers[memberIndex];

                if (!member)
                  return (
                    <View
                      key={colIndex}
                      style={{ width: cardSize, height: cardSize * cardHeightMultiplier }}
                    />
                  );

                return (
                  <TouchableOpacity
                    key={colIndex}
                    style={[
                      styles.card,
                      {
                        width: cardSize,
                        height: cardSize * cardHeightMultiplier,
                        marginHorizontal: horizontalSpacing / 2,
                        ...(member.clickable ? {} : styles.disabledCard),
                      },
                    ]}
                    onPress={() => member?.clickable && navigation.navigate(member.screen)}
                    disabled={!member.clickable}
                  >
                    {member?.image && (
                      <>
                        {/* Image */}
                        <Image
                          source={member.image}
                          style={styles.characterImage}
                        />
                        {/* Transparent Overlay to Prevent Image Save */}
                        <View style={styles.transparentOverlay} />
                      </>
                    )}

                    {/* Codename - Bold & Larger */}
                    {member?.codename && (
                      <Text style={styles.codename}>{member.codename}</Text>
                    )}

                    {/* Name - Italic & Smaller */}
                    {member?.name && (
                      <Text style={styles.name}>{member.name}</Text>
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
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1, // Prevents saving while still allowing click interactions
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: 50,
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
    backgroundColor: '#444',
    shadowColor: 'transparent',
  },
  characterImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  codename: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  name: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#aaa',
    textAlign: 'center',
  },
  disabledText: {
    fontSize: 10,
    color: '#ff4444',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default LegionairesScreen;
