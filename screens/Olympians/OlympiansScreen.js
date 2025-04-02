import React, { useState, useEffect } from 'react';
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
  const [previewMember, setPreviewMember] = useState(null); // State for preview modal
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(Dimensions.get("window").width);
    };
    const subscription = Dimensions.addEventListener("change", updateDimensions);
    return () => subscription?.remove();
  }, []);

  const goToChat = () => {
    navigation.navigate('TeamChat');
  };

  const renderMemberCard = (member) => (
    <TouchableOpacity
      key={member.name}
      style={[
        styles.card,
        { width: cardSize, height: cardSize * cardHeightMultiplier },
        !member.clickable && styles.disabledCard,
      ]}
      onPress={() => member?.clickable && setPreviewMember(member)} // Open preview if clickable
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
      {member?.codename && <Text style={styles.codename}>{member.codename}</Text>}
      {member?.name && <Text style={styles.name}>{member.name}</Text>}
    </TouchableOpacity>
  );

  const renderPreviewCard = (member) => (
    <TouchableOpacity
      key={member.name}
      style={[styles.previewCard(isDesktop, windowWidth), styles.clickable]}
      onPress={() => setPreviewMember(null)} // Close modal on card press
    >
      <Image
        source={member.image || require('../../assets/Armor/PlaceHolder.jpg')}
        style={styles.previewImage}
        resizeMode="cover"
      />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {member.name || 'Unknown'}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/BackGround/Olympians.jpg')}
      style={styles.background}
    >
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
              onPress={() => setPreviewMember(null)} // Close preview when clicking outside
            >
              <View style={styles.imageContainer}>
                <ScrollView
                  horizontal
                  contentContainerStyle={styles.imageScrollContainer}
                  showsHorizontalScrollIndicator={false}
                  snapToAlignment="center"
                  snapToInterval={windowWidth * 0.7 + 20}
                  decelerationRate="fast"
                  centerContent={true} // Ensure content is centered
                >
                  {previewMember && renderPreviewCard(previewMember)}
                </ScrollView>
              </View>
              <View style={styles.previewAboutSection}>
                <Text style={styles.previewName}>{previewMember?.name || 'Unknown'}</Text>
                <Text style={styles.previewCodename}>{previewMember?.codename || 'N/A'}</Text>
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
  // Modal Styles
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
    alignItems: 'center', // Center the ScrollView horizontally
    paddingLeft: 20,
  },
  imageScrollContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center', // Center the cards within the ScrollView
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

export default OlympiansScreen;