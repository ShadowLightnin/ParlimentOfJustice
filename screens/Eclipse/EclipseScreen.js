import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Screen dimensions
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// Member Data
const members = [
  { name: 'TBA', codename: 'TBA', screen: '', clickable: false, position: [0, 0], image: require('../../assets/Armor/PlaceHolder.jpg') },
  { name: 'James', codename: 'Gentle Hand', screen: 'James', clickable: true, position: [0, 2], image: require('../../assets/Armor/James.jpg') },
  { name: 'Kelsie', codename: 'Eliptic-Dancer', screen: 'Kelsie', clickable: true, position: [1, 0], image: require('../../assets/Armor/Kelsie2.jpg') },
  { name: 'Aileen', codename: 'Ariata', screen: 'Aileen', clickable: true, position: [1, 1], image: require('../../assets/Armor/Aileen2.jpg') },
  { name: 'Ginna', codename: 'TBA', screen: '', clickable: false, position: [1, 2], image: require('../../assets/Armor/PlaceHolder.jpg') },
  { name: 'Myran', codename: 'Techno Guard', screen: 'Myran', clickable: true, position: [2, 0], image: require('../../assets/Armor/Myran.jpg') },
  { name: 'TBA', codename: 'TBA', screen: '', clickable: false, position: [2, 2], image: require('../../assets/Armor/PlaceHolder.jpg') },
];

// Empty cell checker
const isEmpty = (row, col) => (row === 0 && col === 1) || (row === 2 && col === 1);
const getMemberAtPosition = (row, col) =>
  members.find((member) => member.position[0] === row && member.position[1] === col);

const EclipseScreen = () => {
  const navigation = useNavigation();

  const goToChat = () => {
    navigation.navigate('TeamChat');
  };

  const isDesktop = SCREEN_WIDTH > 600;
  const cardSize = isDesktop ? 200 : 100; // Larger cards on desktop
  const cardSpacing = isDesktop ? 30 : 10; // More spacing on desktop

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Eclipse.jpg')}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Eclipse</Text>
          <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
            <Text style={styles.chatText}>🛡️</Text>
          </TouchableOpacity>
        </View>

        {/* Layout based on device */}
        {isDesktop ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.horizontalScroll, { gap: cardSpacing }]}
          >
            {members.map((member, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.card,
                  { width: cardSize, height: cardSize * 1.6 },
                  !member.clickable && styles.disabledCard,
                ]}
                onPress={() => member.clickable && navigation.navigate(member.screen)}
                disabled={!member.clickable}
              >
                {member.image && (
                  <>
                    <Image
                      source={member.image}
                      style={[styles.characterImage, { width: '100%', height: cardSize * 1.2 }]}
                    />
                    <View style={styles.transparentOverlay} />
                  </>
                )}
                <Text style={styles.codename}>{member.codename}</Text>
                <Text style={styles.name}>{member.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={[styles.grid, { gap: cardSpacing }]}>
            {[0, 1, 2].map((row) => (
              <View key={row} style={[styles.row, { gap: cardSpacing }]}>
                {[0, 1, 2].map((col) => {
                  if (isEmpty(row, col)) {
                    return <View key={col} style={{ width: cardSize, height: cardSize * 1.4 }} />;
                  }

                  const member = getMemberAtPosition(row, col);
                  return (
                    <TouchableOpacity
                      key={col}
                      style={[
                        styles.card,
                        { width: cardSize, height: cardSize * 1.6 },
                        !member?.clickable && styles.disabledCard,
                      ]}
                      onPress={() => member?.clickable && navigation.navigate(member.screen)}
                      disabled={!member?.clickable}
                    >
                      {member?.image && (
                        <>
                          <Image
                            source={member.image}
                            style={[styles.characterImage, { width: '100%', height: cardSize * 1.2 }]}
                          />
                          <View style={styles.transparentOverlay} />
                        </>
                      )}
                      <Text style={styles.codename}>{member?.codename || ''}</Text>
                      <Text style={styles.name}>{member?.name || ''}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        )}
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
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1,
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: 'rgba(107, 107, 107, 1)',
    textAlign: 'center',
    textShadowColor: '#00b3ff',
    textShadowRadius: 35,
    flex: 1,
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
  grid: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalScroll: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  card: {
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
  characterImage: {
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
  disabledCard: {
    backgroundColor: '#444',
    shadowColor: 'transparent',
  },
});

export default EclipseScreen;