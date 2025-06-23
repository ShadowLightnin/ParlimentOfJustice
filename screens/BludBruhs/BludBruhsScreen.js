import React, { useState } from 'react';
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
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// Scrollable characters (no position needed)
const scrollableMembers = [
  { name: 'Sam', codename: 'Void Walker', screen: 'Sam', clickable: true, image: require('../../assets/Armor/SamPlaceHolder.jpg') },
  { name: 'Cole', codename: 'Cruiser', screen: 'Cole', clickable: true, image: require('../../assets/Armor/ColePlaceHolder.jpg') },
  { name: 'Taylor', codename: 'Stellar', screen: '', clickable: true, image: require('../../assets/Armor/TaylorPlaceHolder.jpg') },
  { name: 'James', codename: 'Shadowmind', screen: 'JamesBb', clickable: true, image: require('../../assets/Armor/JamesBbPlaceHolder.jpg') },
  { name: 'Tanner', codename: 'Wolff', screen: 'TannerBb', clickable: true, image: require('../../assets/Armor/TannerBbPlaceHolder.jpg') },
  { name: 'Adin', codename: 'Aotearoa', screen: '', clickable: true, image: require('../../assets/Armor/AdinPlaceHolder.jpg') },
  { name: 'Justin Platt', codename: 'Echo Wood', screen: '', clickable: true, image: require('../../assets/Armor/JustinPlaceHolder2.jpg') },
  { name: 'Zack Dustin', codename: 'Carved Echo', screen: '', clickable: true, image: require('../../assets/Armor/ZackPlaceHolder2_cleanup.jpg') },
  { name: 'Joseph', codename: 'Technoman', screen: 'JosephD', clickable: false, image: require('../../assets/Armor/JosephDPlaceHolder.jpg') },
  { name: 'Others', codename: 'Rolling Thunder', screen: 'RollingThunderScreen', clickable: true, image: require('../../assets/BackGround/Bludbruh4.jpg') },
];

// Fixed factions for bottom row
const fixedMembers = [
  { name: '', codename: 'Ranger Squad', screen: 'RangerSquad', clickable: true, image: require('../../assets/BackGround/RangerSquad.jpg') },
  { name: ' ', codename: '', screen: 'MontroseManorTab', clickable: true, image: require('../../assets/MontroseManorPlaceHolder.jpg') },
  { name: '', codename: 'MonkeAlliance', screen: 'MonkeAllianceScreen', clickable: true, image: require('../../assets/BackGround/Monke.jpg') },
];

const BludBruhsScreen = () => {
  const navigation = useNavigation();
  const [previewMember, setPreviewMember] = useState(null);

  const goToChat = () => {
    navigation.navigate('TeamChat');
  };

  const goToHomeScreen = () => {
    console.log("Navigating to HomeScreen from BludBruhsScreen at:", new Date().toISOString());
    navigation.navigate('Home');
  };

  const isDesktop = SCREEN_WIDTH > 600;
  const cardSize = isDesktop ? 160 : 100;
  const cardSpacing = isDesktop ? 25 : 10;

  const handleMemberPress = (member) => {
    if (member.clickable) {
      if (member.screen) {
        navigation.navigate(member.screen, { from: 'BludBruhsHome' }); // Navigate if screen exists
      } else {
        setPreviewMember(member); // Show modal if no screen
      }
    }
  };

  // Prepare grid rows
  const rows = [];
  const initialScrollable = scrollableMembers.slice(0, 6); // First 6 for top 2 rows
  const additionalScrollable = scrollableMembers.slice(6); // Remaining for scrolling

  // Build initial scrollable rows (2 rows of 3)
  for (let i = 0; i < 2; i++) {
    const row = initialScrollable.slice(i * 3, (i + 1) * 3);
    while (row.length < 3) row.push(null); // Fill empty slots
    rows.push(row);
  }

  // Build additional scrollable rows
  for (let i = 0; i < additionalScrollable.length; i += 3) {
    const row = additionalScrollable.slice(i, i + 3);
    while (row.length < 3) row.push(null); // Fill empty slots
    rows.push(row);
  }

  const renderMemberCard = (member, index) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.card,
        { width: cardSize, height: cardSize * 1.6 },
        !member?.clickable && styles.disabledCard,
        member?.name === ' ' && styles.subtleButton,
        !member && styles.emptyCard,
      ]}
      onPress={() => handleMemberPress(member)}
      disabled={!member?.clickable}
    >
      {member?.image && (
        <>
          <Image source={member.image} style={styles.characterImage} />
          <View style={styles.transparentOverlay} />
        </>
      )}
      <Text style={styles.codename}>{member?.codename || ''}</Text>
      <Text style={styles.name}>{member?.name || ''}</Text>
    </TouchableOpacity>
  );

  const renderPreviewCard = (member) => (
    <TouchableOpacity
      style={[styles.previewCard(isDesktop, SCREEN_WIDTH), styles.clickable]}
      onPress={() => setPreviewMember(null)} // Close modal on card press
    >
      <Image
        source={member.image || require('../../assets/Armor/PlaceHolder.jpg')}
        style={styles.previewImage}
        resizeMode="cover"
      />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {member.codename || 'Unknown'}; Thunder Born
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground 
      source={require('../../assets/BackGround/Bludbruh2.jpg')} 
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        {/* Header & Back Button */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={goToHomeScreen}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Thunder Born</Text>
          <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
            <Text style={styles.chatText}>🛡️</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Grid */}
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={[styles.grid, { gap: cardSpacing }]}>
            {rows.map((row, rowIndex) => (
              <View key={rowIndex} style={[styles.row, { gap: cardSpacing }]}>
                {row.map((member, colIndex) => renderMemberCard(member, colIndex))}
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Fixed Bottom Row */}
        <View style={[styles.fixedRow, { gap: cardSpacing }]}>
          {fixedMembers.map((member, colIndex) => (
            <TouchableOpacity
              key={colIndex}
              style={[
                styles.card,
                { width: cardSize, height: cardSize * 1.6 },
                !member.clickable && styles.disabledCard,
                member.name === ' ' && styles.subtleButton,
              ]}
              onPress={() => member.clickable && navigation.navigate(member.screen, { from: 'BludBruhsHome' })}
              disabled={!member.clickable}
            >
              {member.image && (
                <>
                  <Image source={member.image} style={styles.characterImage} />
                  <View style={styles.transparentOverlay} />
                </>
              )}
              <Text style={styles.codename}>{member.codename || ''}</Text>
              <Text style={styles.name}>{member.name || ''}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Preview Modal */}
        <Modal
          visible={!!previewMember}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setPreviewMember(null)}
        >
          <View style={styles.modalBackground}>
            <TouchableOpacity
              style={styles.modalOuterContainer}
              activeOpacity={1}
              onPress={() => setPreviewMember(null)}
            >
              <View style={styles.imageContainer}>
                <ScrollView
                  horizontal
                  contentContainerStyle={styles.imageScrollContainer}
                  showsHorizontalScrollIndicator={false}
                  snapToAlignment="center"
                  snapToInterval={SCREEN_WIDTH * 0.7 + 20}
                  decelerationRate="fast"
                  centerContent={true}
                >
                  {previewMember && renderPreviewCard(previewMember)}
                </ScrollView>
              </View>
              <View style={styles.previewAboutSection}>
                <Text style={styles.previewCodename}>{previewMember?.codename || 'N/A'}</Text>
                <Text style={styles.previewName}>{previewMember?.name || 'Unknown'}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
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
    color: '#00FFFF',
    textAlign: 'center',
    textShadowColor: '#fffb00',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 20,
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
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  grid: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  fixedRow: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  card: {
    backgroundColor: '#1c1c1c',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: '#00FFFF',
    shadowOpacity: 1.5,
    shadowRadius: 10,
    elevation: 5,
    padding: 5,
  },
  subtleButton: {
    backgroundColor: '#2a2a2a00',
    shadowColor: '#444',
    shadowOpacity: 0.1,
    elevation: 2,
    opacity: 0.2,
  },
  emptyCard: {
    backgroundColor: 'transparent',
    shadowColor: 'transparent',
  },
  characterImage: {
    width: '100%',
    height: '70%',
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  name: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#aaa',
    textAlign: 'center',
  },
  codename: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
  disabledCard: {
    backgroundColor: '#444',
    shadowColor: 'transparent',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOuterContainer: {
    width: '90%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    paddingVertical: 20,
    backgroundColor: '#111',
    alignItems: 'center',
    paddingLeft: 20,
  },
  imageScrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewCard: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.2 : SCREEN_WIDTH * 0.8,
    height: isDesktop ? SCREEN_HEIGHT * 0.7 : SCREEN_HEIGHT * 0.6,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    marginRight: 20,
  }),
  clickable: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardName: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  previewAboutSection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#222',
    borderRadius: 10,
    width: '100%',
  },
  previewCodename: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00b3ff',
    textAlign: 'center',
  },
  previewName: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default BludBruhsScreen;