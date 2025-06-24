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
  Modal,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Screen dimensions with error handling
let SCREEN_WIDTH, SCREEN_HEIGHT;
try {
  const { width, height } = Dimensions.get('window');
  SCREEN_WIDTH = width;
  SCREEN_HEIGHT = height;
} catch (error) {
  console.error('Error getting dimensions:', error);
  SCREEN_WIDTH = 360;
  SCREEN_HEIGHT = 640;
}

// Member Data with Unique Image Paths
const members = [
  { name: 'Zeke', codename: 'Enderstrike', screen: 'Zeke', clickable: true, image: require('../../../assets/Armor/Zeke.jpg') },
  { name: 'Elijah Potter', codename: 'Chaos Wither', screen: 'Elijah', clickable: true, image: require('../../../assets/Armor/Elijah.jpg') },
  { name: 'Tom C', codename: 'Thunder Whisperer', screen: 'TomBb', clickable: true, image: require('../../../assets/Armor/TomC3_cleanup.jpg') },
  { name: 'Ammon T', codename: 'Quick Wit', screen: 'AmmonT', clickable: true, image: require('../../../assets/Armor/AmmonT.jpg') },
  { name: 'Eli C', codename: 'Shawdow Hunter', screen: 'Eli', clickable: true, image: require('../../../assets/Armor/Eli.jpg') },
  { name: 'Ethan T', codename: 'Bolt Watcher', screen: 'EthanT', clickable: true, image: require('../../../assets/Armor/Ethan.jpg') },
  { name: 'Alex M', codename: 'Swiftmind', screen: 'AlexM', clickable: true, image: require('../../../assets/Armor/AlexM.jpg') },
  { name: 'Damon', codename: 'Pixel Maverick', screen: 'Damon', clickable: true, image: require('../../../assets/Armor/Damon_cleanup.jpg') },
  { name: 'Lauren', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Lauren.jpg') },
  { name: 'Lizzie', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/LizzieTB.jpg') },
  { name: 'Rachel', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/RachelTB.jpg') },
  { name: 'Keith', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Keith.jpg') },
  { name: 'Sandra', codename: '', screen: '', clickable: true, image: require('../../../assets/Armor/Sandra.jpg') },
  { name: 'MIA', codename: '', screen: '', clickable: false },
];

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;
const columns = isDesktop ? 5 : 3;
const rows = Math.ceil(members.length / columns);
const cardSize = isDesktop ? 160 : 100;
const cardHeightMultiplier = 1.6;
const horizontalSpacing = isDesktop ? 40 : 10;
const verticalSpacing = isDesktop ? 50 : 20;

export const MonkeAllianceScreen = () => {
  const navigation = useNavigation();
  const [previewMember, setPreviewMember] = useState(null);

  const goToChat = () => {
    console.log('Navigating to TeamChat:', new Date().toISOString());
    try {
      navigation.navigate('TeamChat');
    } catch (error) {
      console.error('Navigation error to TeamChat:', error);
    }
  };

  const handleMemberPress = (member) => {
    if (!member?.clickable) return;
    console.log('Card pressed:', member.name, 'Screen:', member.screen);
    if (member.screen) {
      try {
        navigation.navigate(member.screen);
      } catch (error) {
        console.error('Navigation error to', member.screen, ':', error);
      }
    } else {
      setPreviewMember(member);
    }
  };

  const renderMemberCard = (member) => (
    <TouchableOpacity
      key={member.name}
      style={[
        styles.card,
        { width: cardSize, height: cardSize * cardHeightMultiplier },
        !member.clickable && styles.disabledCard,
      ]}
      onPress={() => handleMemberPress(member)}
      disabled={!member.clickable}
    >
      {member?.image && (
        <>
          <Image
            source={member.image || require('../../../assets/Armor/PlaceHolder.jpg')}
            style={styles.characterImage}
          />
          <View style={styles.transparentOverlay} />
        </>
      )}
      <Text style={styles.codename}>{member.codename || ''}</Text>
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
        source={member.image || require('../../../assets/Armor/PlaceHolder.jpg')}
        style={styles.previewImage}
        resizeMode="cover"
      />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {member.codename || 'No Codename'}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground source={require('../../../assets/BackGround/Monke.jpg')} style={styles.background}>
      <SafeAreaView style={styles.container}>
        {/* Header & Back Button */}
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={() => {
            console.log('Back button pressed:', new Date().toISOString());
            navigation.goBack();
          }}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Monke Alliance</Text>
          <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
            <Text style={styles.chatText}>🛡️</Text>
          </TouchableOpacity>
        </View>

        {/* Grid Layout */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <View
              key={rowIndex}
              style={[styles.row, { gap: horizontalSpacing, marginBottom: verticalSpacing }]}
            >
              {Array.from({ length: columns }).map((_, colIndex) => {
                const memberIndex = rowIndex * columns + colIndex;
                const member = members[memberIndex];

                if (!member) return (
                  <View
                    key={colIndex}
                    style={{ width: cardSize, height: cardSize * cardHeightMultiplier }}
                  />
                );

                return renderMemberCard(member);
              })}
            </View>
          ))}
        </ScrollView>

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
                  snapToInterval={isDesktop ? SCREEN_WIDTH * 0.15 : SCREEN_WIDTH * 0.6}
                  decelerationRate="fast"
                  centerContent={true}
                >
                  {previewMember && renderPreviewCard(previewMember)}
                </ScrollView>
              </View>
              <View style={styles.previewAboutSection}>
                <Text style={styles.previewCodename}>{previewMember?.codename || 'No Codename'}</Text>
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
    width: SCREEN_WIDTH,
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
    color: '#00b3ff',
    fontWeight: 'bold',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'brown',
    textAlign: 'center',
    textShadowColor: 'gold',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 30,
    flex: 1,
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
  scrollContainer: {
    paddingBottom: 20,
    flexGrow: 1,
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
    shadowColor: 'brown',
    shadowOpacity: 1.5,
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
    width: '80%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    paddingVertical: 15,
    backgroundColor: '#1c1c1c',
    alignItems: 'center',
    paddingLeft: 10,
  },
  imageScrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewCard: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.15 : SCREEN_WIDTH * 0.6,
    height: isDesktop ? SCREEN_HEIGHT * 0.5 : SCREEN_HEIGHT * 0.4,
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
    fontSize: 14,
    color: 'white',
    fontWeight: 'bold',
  },
  previewAboutSection: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
    width: '100%',
  },
  previewCodename: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  previewName: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default MonkeAllianceScreen;