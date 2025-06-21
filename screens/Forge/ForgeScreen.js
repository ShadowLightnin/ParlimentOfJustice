import React, { useState } from 'react';
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
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const bosses = [
  { name: 'Glen', codename: '', screen: '', clickable: false, },
  { name: 'Ted', codename: '', screen: '', clickable: false, },
  { name: 'Marisela', codename: '', screen: '', clickable: false, },
  { name: 'Beau', codename: '', screen: '', clickable: false, },
  { name: 'Taylor', codename: '', screen: '', clickable: false, },
  { name: 'Angie', codename: '', screen: '', clickable: false, },
];

const coworkers = [
  { name: 'Custodian 1', codename: '', screen: '', clickable: false, },
  { name: 'Custodian 2', codename: '', screen: '', clickable: false, },
  { name: 'Custodian 3', codename: '', screen: '', clickable: false, },
  { name: 'Camren', codename: '', screen: '', clickable: false, },
  { name: 'Shailey', codename: '', screen: '', clickable: false, },
  { name: 'Kaitlyn', codename: '', screen: '', clickable: false, },
  { name: 'Emma', codename: '', screen: '', clickable: false, },
  { name: 'Mila', codename: '', screen: '', clickable: false, },
  { name: 'Karrie', codename: '', screen: '', clickable: false, },
  { name: 'Gary', codename: '', screen: '', clickable: false, },
  { name: 'Trevor', codename: '', screen: '', clickable: false, },
  { name: 'Kristin', codename: '', screen: '', clickable: false, },
  
];

const isDesktop = SCREEN_WIDTH > 600;
const columns = isDesktop ? 5 : 3;
const cardSize = isDesktop ? 160 : 100;
const cardHeightMultiplier = 1.6;
const horizontalSpacing = isDesktop ? 40 : 10;
const verticalSpacing = isDesktop ? 50 : 20;

export const ForgeScreen = () => {
  const navigation = useNavigation();
  const [previewMember, setPreviewMember] = useState(null);

  const handleMemberPress = (member) => {
    if (member.clickable) {
      if (member.screen) {
        navigation.navigate(member.screen);
      } else {
        setPreviewMember(member);
      }
    }
  };

  const renderMemberCard = (member) => (
    <TouchableOpacity
      key={member.name}
      style={[
        styles.card,
        { width: cardSize, height: cardSize * cardHeightMultiplier },
        !member.clickable && styles.disabledCard
      ]}
      onPress={() => handleMemberPress(member)}
      disabled={!member.clickable}
    >
      <Image
        source={member.image || require('../../assets/Armor/PlaceHolder.jpg')}
        style={styles.characterImage}
      />
      <View style={styles.transparentOverlay} />
      <Text style={styles.codename}>{member.codename}</Text>
      <Text style={styles.name}>{member.name}</Text>
    </TouchableOpacity>
  );

  const renderPreviewCard = (member) => (
    <TouchableOpacity
      key={member.name}
      style={[styles.previewCard(isDesktop, SCREEN_WIDTH), styles.clickable]}
      onPress={() => setPreviewMember(null)}
    >
      <Image
        source={member.image || require('../../assets/Armor/PlaceHolder.jpg')}
        style={styles.previewImage}
        resizeMode="cover"
      />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {member.codename || 'Unknown'}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  const renderGridSection = (data) => {
    const rows = Math.ceil(data.length / columns);
    return Array.from({ length: rows }).map((_, rowIndex) => (
      <View key={rowIndex} style={[styles.row, { gap: horizontalSpacing, marginBottom: verticalSpacing }]}>
        {Array.from({ length: columns }).map((_, colIndex) => {
          const index = rowIndex * columns + colIndex;
          const member = data[index];
          if (!member) return (
            <View key={colIndex} style={{ width: cardSize, height: cardSize * cardHeightMultiplier }} />
          );
          return renderMemberCard(member);
        })}
      </View>
    ));
  };

  return (
    <ImageBackground source={require('../../assets/BackGround/Forge.jpg')} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>The Forge</Text>
          <View style={styles.chatButton}>
            <Text style={styles.chatText}>🔥</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.sectionTitle}>Apprenticeship</Text>
          {renderGridSection(bosses)}

          <Text style={styles.sectionTitle}>Smithy Mates</Text>
          {renderGridSection(coworkers)}
        </ScrollView>

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
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    zIndex: 1,
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
    color: '#ffae42',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
    textShadowColor: '#ffae42',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 40,
  },
  chatButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
  },
  chatText: {
    fontSize: 24,
    color: '#fff',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffae42',
    marginVertical: 10,
    textAlign: 'center',
    textShadowColor: '#222',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  scrollContainer: {
    paddingBottom: 20,
    flexGrow: 1,
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
    shadowColor: 'rgba(255, 174, 66, 0.7)',
    shadowOpacity: 1,
    shadowRadius: 20,
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
    color: '#ffae42',
    textAlign: 'center',
  },
  previewName: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default ForgeScreen;