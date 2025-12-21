import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// Screen Size Check
const isDesktop = SCREEN_WIDTH > 600;

const StalkerScreen = () => {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  // ✅ Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  useEffect(() => {
    const updateDimensions = () => {
      const { width } = Dimensions.get('window');
      setWindowWidth(width);
    };
    const subscription = Dimensions.addEventListener('change', updateDimensions);
    return () => subscription?.remove();
  }, []);

  // Sizes for Stalker (larger cards)
  const StalkerImageWidth = isDesktop ? windowWidth * 0.28 : windowWidth * 0.8;
  const StalkerImageHeight = isDesktop ? SCREEN_HEIGHT * 0.55 : SCREEN_HEIGHT * 0.5;

  // Sizes for Spawn (smaller cards)
  const spawnImageWidth = isDesktop ? windowWidth * 0.18 : windowWidth * 0.6;
  const spawnImageHeight = isDesktop ? SCREEN_HEIGHT * 0.4 : SCREEN_HEIGHT * 0.45;

  // ✅ helper to open modal
  const openCharacterModal = (character) => {
    if (!character?.clickable) return;
    setSelectedCharacter(character);
    setModalVisible(true);
  };

  const StalkerCharacters = [
    {
      name: "The Skin Stalker",
      image: require('../../../assets/Villains/SkinStalker.jpg'),
      clickable: false,
      description:
        "The Stalker, one of the 3 Demon Lords of the Maw. He roams the streets at night in the form of an old man. Not much is known about him other than that he will find you—and when he is close, you’ll hear his footsteps in a loud stomp.",
    },
  ];

  const spawnCharacters = [
    {
      name: 'The Finder',
      image: require('../../../assets/Villains/Finder.jpg'),
      clickable: true,
      // ✅ your text (lightly cleaned for readability)
      description:
        "He roams around at night searching and scouting for his master. When he is done, he will walk into obscure places and vanish without a trace.",
    },
  ];

  const renderCharacterCard = (character, { isSpawn } = { isSpawn: false }) => {
    const width = isSpawn ? spawnImageWidth : StalkerImageWidth;
    const height = isSpawn ? spawnImageHeight : StalkerImageHeight;

    return (
      <TouchableOpacity
        key={character.name}
        style={[
          styles.card,
          styles.clickable,
          {
            width,
            height,
          },
        ]}
        onPress={() => openCharacterModal(character)}   // ✅ open popup
        disabled={!character.clickable}
        activeOpacity={0.9}
      >
        <Image source={character.image} style={styles.armorImage} resizeMode="contain" />
        <View style={styles.cardOverlay} />
        <Text style={styles.cardName}>© {character.name || 'Unknown'}; William Cummings</Text>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require('../../../assets/BackGround/NateEmblem.jpg')}
      style={styles.background}
    >
      <View style={styles.screenDimOverlay}>
        {/* TOP BAR */}
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
            activeOpacity={0.8}
          >
            <Text style={styles.iconButtonText}>⬅️</Text>
          </TouchableOpacity>

          <View style={styles.titleBlock}>
            <Text style={styles.titleLabel}>Skin Walker Lord • The Old Man</Text>
            <Text style={styles.mainTitle}>🔥 Skin Stalker 🔥</Text>
          </View>

          <View style={styles.rightSpacer} />
        </View>

        {/* MAIN SCROLL */}
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Stalker VARIANTS SECTION */}
          <View style={styles.glassSection}>
            <Text style={styles.sectionTitle}>The Stalker</Text>
            <View style={styles.sectionLine} />
            <ScrollView
              horizontal
              style={styles.horizontalImageContainer}
              contentContainerStyle={styles.horizontalScrollContent}
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center"
              snapToInterval={StalkerImageWidth + 24}
              decelerationRate="fast"
            >
              {StalkerCharacters.map((character) =>
                renderCharacterCard(character, { isSpawn: false })
              )}
            </ScrollView>
          </View>

          {/* SPAWN SECTION */}
          <View style={styles.glassSection}>
            <Text style={styles.sectionTitle}>The Stalkers Followers</Text>
            <View style={styles.sectionLine} />
            <ScrollView
              horizontal
              style={styles.horizontalImageContainer}
              contentContainerStyle={styles.horizontalScrollContent}
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center"
              snapToInterval={spawnImageWidth + 20}
              decelerationRate="fast"
            >
              {spawnCharacters.map((character) =>
                renderCharacterCard(character, { isSpawn: true })
              )}
            </ScrollView>
          </View>

          {/* DESCRIPTION SECTION */}
          <View style={styles.textGlass}>
            <Text style={styles.descriptionText}>
              The Stalker, one of the 3 Demon Lords of the Maw. He roams the streets at night in the form of an old man.
              Not much is known about him other than that he will find you and is always there lurking and when he is close you will hear his foot steps in a loud stomp.
            </Text>
          </View>

          {/* RETURN BUTTON */}
          <TouchableOpacity
            style={styles.returnButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <Text style={styles.returnButtonText}>Return to Safety</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* ✅ POPUP MODAL */}
        <Modal
          transparent
          visible={modalVisible}
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable style={styles.modalBackdrop} onPress={() => setModalVisible(false)}>
            <Pressable style={styles.modalCard} onPress={() => {}}>
              {!!selectedCharacter?.image && (
                <Image
                  source={selectedCharacter.image}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              )}

              <Text style={styles.modalTitle}>{selectedCharacter?.name}</Text>
              <View style={styles.modalLine} />

              <Text style={styles.modalDescription}>
                {selectedCharacter?.description || 'No description yet.'}
              </Text>

              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}
                activeOpacity={0.85}
              >
                <Text style={styles.modalCloseText}>Close</Text>
              </TouchableOpacity>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  // BACKGROUND
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
    flex: 1,
  },

  // MAIN DARK OVERLAY
  screenDimOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.88)',
    paddingTop: 40,
    paddingHorizontal: isDesktop ? 24 : 0,
  },

  // TOP BAR
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  iconButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(30, 0, 0, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 80, 40, 0.8)',
  },
  iconButtonText: {
    color: '#FFF5EE',
    fontSize: 16,
    fontWeight: '600',
  },
  titleBlock: {
    flex: 1,
    alignItems: 'center',
  },
  titleLabel: {
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: 'rgba(255, 220, 200, 0.9)',
  },
  mainTitle: {
    fontSize: isDesktop ? 34 : 26,
    color: '#ff4500',
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: '#8B0000',
    textShadowRadius: 24,
    marginTop: 2,
  },
  rightSpacer: {
    width: 40,
  },

  // SCROLL CONTAINER
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: isDesktop ? 16 : 0,
  },

  // GLASS SECTIONS
  glassSection: {
    width: '95%',
    maxWidth: 1000,
    marginTop: 16,
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(15, 5, 5, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255, 80, 40, 0.7)',
    shadowColor: '#000',
    shadowOpacity: 0.7,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ff6347',
    textAlign: 'center',
    marginBottom: 4,
    textShadowColor: '#8B0000',
    textShadowRadius: 14,
  },
  sectionLine: {
    height: 1,
    backgroundColor: 'rgba(255, 120, 80, 0.95)',
    width: '32%',
    alignSelf: 'center',
    marginBottom: 8,
  },

  // HORIZONTAL IMAGE CONTAINER
  horizontalImageContainer: {
    marginTop: 6,
  },
  horizontalScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 6,
  },

  // CHARACTER CARD
  card: {
    marginHorizontal: 10,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(10, 2, 2, 0.95)',
    position: 'relative',
    borderWidth: 1,
  },
  clickable: {
    borderColor: 'rgba(255, 120, 80, 0.9)',
    shadowColor: '#ff4500',
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 18,
  },
  armorImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  cardName: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    fontSize: 14,
    color: 'white',
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowRadius: 8,
  },

  // DESCRIPTION GLASS
  textGlass: {
    width: '95%',
    maxWidth: 900,
    marginTop: 20,
    borderRadius: 20,
    padding: 16,
    backgroundColor: 'rgba(10, 5, 5, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255, 120, 80, 0.7)',
  },
  descriptionText: {
    fontSize: isDesktop ? 18 : 16,
    color: '#fff7f5',
    textAlign: 'center',
    lineHeight: 24,
  },

  // RETURN BUTTON
  returnButton: {
    marginTop: 20,
    marginBottom: 10,
    backgroundColor: '#8B0000',
    paddingVertical: 12,
    paddingHorizontal: isDesktop ? 80 : 50,
    borderRadius: 999,
    borderColor: '#ff4500',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 18,
  },
  returnButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // ✅ MODAL STYLES
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.78)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  modalCard: {
    width: '100%',
    maxWidth: 520,
    borderRadius: 22,
    padding: 16,
    backgroundColor: 'rgba(15, 5, 5, 0.97)',
    borderWidth: 1,
    borderColor: 'rgba(255, 80, 40, 0.7)',
    shadowColor: '#000',
    shadowOpacity: 0.8,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 22,
  },
  modalImage: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ff4500',
    textAlign: 'center',
    textShadowColor: '#8B0000',
    textShadowRadius: 18,
  },
  modalLine: {
    height: 1,
    backgroundColor: 'rgba(255, 120, 80, 0.95)',
    width: '38%',
    alignSelf: 'center',
    marginVertical: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: '#fff7f5',
    lineHeight: 24,
    textAlign: 'center',
  },
  modalCloseButton: {
    marginTop: 14,
    alignSelf: 'center',
    backgroundColor: '#8B0000',
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#ff4500',
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});

export default StalkerScreen;
