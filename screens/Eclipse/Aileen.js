import React, { useRef, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Modal,
  Alert,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Audio } from "expo-av";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const armor = [
  { name: "Ariata Prime", image: require("../../assets/Armor/AileenAriata.jpg"), clickable: true },
  { name: "Legacy", image: require("../../assets/Armor/AileenLegacy.jpg"), clickable: true },
  { name: "Baybayin", image: require("../../assets/Armor/Aileen.jpg"), clickable: true },
  { name: "Ariata", image: require("../../assets/Armor/Aileen2.jpg"), clickable: true },
  { name: "Luminara", image: require("../../assets/Armor/Aileen3.jpg"), clickable: true },
  { name: "Aileara", image: require("../../assets/Armor/Aileen5.jpg"), clickable: true },
  { name: "Nialla", image: require("../../assets/Armor/Aileen6.jpg"), clickable: true },
  { name: "Ailethra", image: require("../../assets/Armor/Aileen9.jpg"), clickable: true },
  { name: "Aishal", image: require("../../assets/Armor/Aileen8.jpg"), clickable: true },
  { name: "Seraphina", image: require("../../assets/Armor/Aileen7.jpg"), clickable: true, screen: "Aileenchat" },
  { name: "Aikarea", image: require("../../assets/Armor/Aileen4.jpg"), clickable: true },
  { name: "Philippines Crusader", image: require("../../assets/Armor/AileensSymbol.jpg"), clickable: true },
];

const kids = [
  { name: "Niella Terra", image: require("../../assets/Armor/Niella.jpg"), clickable: true },
  { name: "Oliver Robertodd", image: require("../../assets/Armor/Oliver.jpg"), clickable: true },
  { name: "Cassidy Zayn", image: require("../../assets/Armor/CassidyZayn.jpg"), clickable: true },
  { name: "", image: require("../../assets/Armor/family4.jpg"), clickable: true },
  { name: "", image: require("../../assets/Armor/family5.jpg"), clickable: true },
  { name: "", image: require("../../assets/Armor/family1.jpg"), clickable: true },
  { name: "", image: require("../../assets/Armor/family2.jpg"), clickable: true },
  { name: "", image: require("../../assets/Armor/family3.jpg"), clickable: true },
];

const ARIATA_STORY = `
   Aileen is an amazing, wonderful and caring person. Always looking out for those and helping whenever she can.
   She is very patient and understanding. She has a deep love for her family and loved ones, and for me.
   She is always there for me and everyone else, and tries her best to help and make things easier for others.
   She is a loving and patient woman, and I am proud of her. She is always there for me and I feel safe 
   and loved in return. She is my best friend and someone who I love so much and so deeply and want to always be with 
   and spend the rest of my life with her.
`;

const Aileen = () => {
  const navigation = useNavigation();
  const flashAnim = useRef(new Animated.Value(1)).current;
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  // ────── NEW: Clean audio control (no autoplay) ──────
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // Load sound once – NO autoplay
  useEffect(() => {
    let soundObj = null;
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("../../assets/audio/SourceOfStrength.mp4"),
          { isLooping: true, volume: 1.0 },
          null,
          false // ← critical: no autoplay
        );
        soundObj = sound;
        setSound(sound);
      } catch (e) {
        console.error("Failed to load SourceOfStrength.mp4", e);
        Alert.alert("Audio Error", "Could not load background music.");
      }
    };
    loadSound();

    return () => {
      soundObj?.unloadAsync();
    };
  }, []);

  const playTheme = async () => {
    if (!sound) return;
    await sound.playAsync();
    setIsPlaying(true);
  };

  const pauseTheme = async () => {
    if (!sound) return;
    await sound.pauseAsync();
    setIsPlaying(false);
  };

  // Stop sound when leaving screen
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (sound) {
          sound.stopAsync();
          setIsPlaying(false);
        }
      };
    }, [sound])
  );

  // ────── Dimension handling (unchanged) ──────
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", () => {
      setWindowWidth(Dimensions.get("window").width);
    });
    return () => subscription?.remove();
  }, []);

  // Flashing planet animation (unchanged)
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 0.4, duration: 600, useNativeDriver: true }),
        Animated.timing(flashAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]).start();
    }, 2000);
    return () => clearInterval(interval);
  }, [flashAnim]);

  const handlePlanetPress = async () => {
    if (sound) await sound.stopAsync();
    navigation.navigate("WarpScreen");
  };

  const handleCardPress = async (item) => {
    if (!item.clickable) return;

    if (sound && isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }

    if (item.name === "Ariata") {
      setSelectedCharacter(item);
    } else if (item.name === "Seraphina") {
      if (sound) await sound.stopAsync();
      navigation.navigate("Aileenchat");
    } else {
      console.log(`${item.name} clicked`);
    }
  };

  const closePopup = () => setSelectedCharacter(null);

  const isDesktop = windowWidth >= 768;

  const renderImageCard = (item) => (
    <TouchableOpacity
      key={item.name}
      style={[styles.card(isDesktop, windowWidth), item.clickable ? styles.clickable : styles.notClickable]}
      onPress={() => handleCardPress(item)}
      disabled={!item.clickable}
    >
      <Image source={item.image} style={styles.armorImage} />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {item.name || 'Unknown'}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  const renderKidCard = (item) => (
    <TouchableOpacity
      key={item.name || Math.random()}
      style={[styles.kidCard(isDesktop, windowWidth), item.clickable ? styles.clickable : styles.notClickable]}
      onPress={() => item.clickable && console.log(`${item.name || "Family"} clicked`)}
      disabled={!item.clickable}
    >
      <Image source={item.image} style={styles.kidImage} />
      <View style={styles.transparentOverlay} />
      <Text style={styles.kidCardName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* ────── NEW: Gold-themed Play / Pause controls ────── */}
      <View style={styles.musicControls}>
        <TouchableOpacity style={styles.musicButton} onPress={playTheme} disabled={isPlaying}>
          <Text style={styles.musicButtonText}>Play Theme</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.musicButton} onPress={pauseTheme} disabled={!isPlaying}>
          <Text style={styles.musicButtonText}>Pause</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.reset({ index: 0, routes: [{ name: "EclipseHome" }] })}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Ariata</Text>
          <TouchableOpacity onPress={handlePlanetPress} style={styles.planetContainer}>
            <Animated.Image
              source={require("../../assets/Space/Earth_hero.jpg")}
              style={[styles.planetImage, { opacity: flashAnim }]}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            snapToInterval={windowWidth * 0.7 + 20}
            decelerationRate="fast"
          >
            {armor.map(renderImageCard)}
          </ScrollView>
        </View>

        <View style={styles.tabsContainer}>
          <View style={styles.tabItem}>
            <Text style={styles.partnerHeader}>My Partner</Text>
            <TouchableOpacity
              style={[styles.partnerImageContainer(isDesktop, windowWidth), styles.clickable]}
              onPress={() => navigation.navigate("Will")}
            >
              <Image source={require("../../assets/Armor/Celestial.jpg")} style={styles.partnerImage(isDesktop, windowWidth)} />
              <View style={styles.transparentOverlay} />
            </TouchableOpacity>
          </View>
          <View style={styles.tabItem}>
            <Text style={styles.heavensGuardHeader}>Heaven's Guard</Text>
            <TouchableOpacity
              style={[styles.partnerImageContainer(isDesktop, windowWidth), styles.clickable]}
              onPress={() => navigation.navigate("Angels")}
            >
              <Image source={require("../../assets/BackGround/Angel2.jpg")} style={styles.partnerImage(isDesktop, windowWidth)} />
              <View style={styles.transparentOverlay} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.kidsContainer}>
          <Text style={styles.kidsHeader}>Our Future Family</Text>
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            snapToInterval={windowWidth * 0.35 + 20}
            decelerationRate="fast"
          >
            {kids.map(renderKidCard)}
          </ScrollView>
        </View>

        {/* YOUR FULL LORE – STILL HERE, STILL COMMENTED OUT, STILL SAFE */}
        {/* <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>About Me</Text>
          <Text style={styles.aboutText}>
            Aileen Eduria, known as Ariata, is a fierce and resilient warrior, the girlfriend of William Cummings “Night Hawk” and a vital member of The Eclipse within the Parliament of Justice. Her presence is both powerful and graceful, a fusion of Filipino cultural strength and unyielding determination that makes her a formidable ally. Behind her intricately designed armor, Aileen is bold, protective, and deeply connected to her heritage, seeing her bond with William as a dance of shadow and steel. She extends this loyalty to the Titans—Spencer, Jared, Jennifer, Emma, Ben, and Azure—and their partners in The Eclipse, using her martial prowess to defend them. Off the battlefield, she’s a storyteller and a fighter, often sharing tales of her ancestors or sparring with William, but her intensity can sometimes make her stubborn.
          </Text>
          <Text style={styles.aboutText}>Backstory</Text>
          <Text style={styles.aboutText}>
            Aileen grew up in Zion City’s Terrestrial sector, in a tight-knit Filipino community that cherished resilience, family, and tradition. From a young age, she was trained in Arnis (Filipino martial arts) and inspired by tales of warriors like Lapu-Lapu, whose defiance against invaders shaped her identity. Her strength and cultural pride set her apart, but it was her encounter with William Cummings that forged her path.
          </Text>
          <Text style={styles.aboutText}>
            Aileen met William during a stealth mission in the Telestial sector, where his invisibility faltered under enemy fire. She intervened with a flurry of strikes, revealing her skill with a Kampilan blade she’d crafted herself. William’s tech-savvy nature intrigued her, and she saw in him a partner who could blend shadows with her steel. Their relationship grew into a powerful alliance, with Aileen designing her Ariata armor to complement his Night Hawk suits, infusing it with Filipino motifs to honor her roots. Her love for William deepened her resolve to protect his family, the Titans.
          </Text>
          <Text style={styles.aboutText}>
            Joining The Eclipse, Aileen aligned with Myran (Jennifer’s husband), Kelsie (Jared’s wife), and James (Azure’s husband) to support the Titans’ mission. She felt the weight of Spencer’s fall and William’s fear of failure, but saw an opportunity to strengthen them with her warrior spirit. Her connection to the broader Parliament of Justice—fighters like Ben and strategists like Todd (Cummings)—empowers her, but she struggles with the lawlessness of Zion City’s Outer Darkness, relying on her heritage to stand firm.
          </Text>
          <Text style={styles.aboutText}>Abilities</Text>
          <Text style={styles.aboutText}>
            Aileen’s armor and cultural strength grant her a range of powers focused on combat, resilience, and inspiration, reflecting her Filipino heritage:
          </Text>
          <Text style={styles.aboutText}>
            Martial Mastery: Expert in Filipino martial arts (Arnis/Kali), wielding her Kampilan blade and Sibat/Arnis sticks with deadly precision, striking fast and adapting to any opponent.
          </Text>
          <Text style={styles.aboutText}>
            Ancestral Resilience: Channels the endurance of her warrior ancestors, boosting her stamina and resistance to pain, allowing her to fight through injuries and protect her allies.
          </Text>
          <Text style={styles.aboutText}>
            Solar Flare: Can emit a burst of radiant energy inspired by the Philippine flag’s sun, stunning enemies or illuminating dark areas, a nod to her sun & stars motif and cultural pride.
          </Text>
          <Text style={styles.aboutText}>
            Battle Rhythm: Moves with a rhythmic flow that enhances her agility and coordination, syncing with William’s stealth to create devastating team attacks, reflecting the grace of Filipino dances like Tinikling.
          </Text>
          <Text style={styles.aboutText}>
            Warrior’s Call: Inspires allies with a rallying cry rooted in her heritage, boosting their courage and focus, a skill drawn from the communal strength of her people.
          </Text>
          <Text style={styles.aboutText}>Personality and Role in the Team</Text>
          <Text style={styles.aboutText}>
            Aileen is the strength and spirit of The Eclipse, complementing William’s stealth with her martial prowess and resilience. She’s bold, proud, and deeply committed to William, seeing their partnership as a balance of shadow and light. Her relationship with William is one of mutual respect—he shields her with tech, while she guards him with steel.
          </Text>
          <Text style={styles.aboutText}>
            Among The Eclipse, Aileen collaborates with Myran’s tech, Kelsie’s agility, and James’s calm, forming a dynamic support unit for the Titans. She respects Spencer’s power but shares William’s focus on adaptability, often using her warrior’s call to rally the group. Her cousins-in-law—Jennifer, Jared, Emma, Ben, and Azure—rely on her combat skills and inspiration, while she draws strength from their unity.
          </Text>
          <Text style={styles.aboutText}>
            In the Parliament of Justice, Aileen connects with fighters like Samantha (Jensen) and protectors like Ben, using her heritage to bolster their resolve. Her ultimate goal is to defend Zion City’s future alongside William, proving that cultural strength and teamwork can overcome chaos, while ensuring her partner and his family stand tall.
          </Text>
        </View> */}
      </ScrollView>

      {/* Ariata Story Modal */}
      <Modal visible={!!selectedCharacter} transparent animationType="slide" onRequestClose={closePopup}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Aileen's Story</Text>
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalText}>{ARIATA_STORY}</Text>
            </ScrollView>
            <TouchableOpacity onPress={closePopup} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a" },
  musicControls: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 14,
    backgroundColor: "rgba(30, 20, 10, 0.95)",
    borderBottomWidth: 2,
    borderBottomColor: "#b8860b",
  },
  musicButton: {
    backgroundColor: "rgba(184, 134, 11, 0.9)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    elevation: 8,
    shadowColor: "gold",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
  },
  musicButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  scrollContainer: { paddingBottom: 20 },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#0a0a0a",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backButton: { padding: 10, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 5 },
  backButtonText: { fontSize: 24, color: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", color: "#000000", textAlign: "center", flex: 1, textShadowColor: "gold", textShadowRadius: 25 },
  planetContainer: { alignItems: "center" },
  planetImage: { width: 40, height: 40, borderRadius: 20 },
  imageContainer: { width: "100%", paddingVertical: 20, backgroundColor: "#111" },
  tabsContainer: { width: "100%", paddingVertical: 20, backgroundColor: "#111", flexDirection: "row", justifyContent: "space-around", alignItems: "center" },
  tabItem: { alignItems: "center", flex: 1, maxWidth: "45%" },
  heavensGuardHeader: { fontSize: 22, fontWeight: "bold", color: "#000000", textAlign: "center", marginBottom: 10, textShadowColor: "gold", textShadowRadius: 25 },
  partnerHeader: { fontSize: 22, fontWeight: "bold", color: "#000000", textAlign: "center", marginBottom: 10, textShadowColor: "gold", textShadowRadius: 25 },
  partnerImageContainer: (isDesktop, w) => ({
    width: isDesktop ? w * 0.15 : SCREEN_WIDTH * 0.3,
    height: isDesktop ? w * 0.15 : SCREEN_WIDTH * 0.3,
    borderRadius: isDesktop ? w * 0.15 / 2 : SCREEN_WIDTH * 0.3 / 2,
    overflow: "hidden",
    elevation: 5,
    backgroundColor: "rgba(0,0,0,0.7)",
  }),
  partnerImage: (isDesktop, w) => ({ width: "100%", height: "100%", resizeMode: "cover" }),
  kidsContainer: { width: "100%", paddingVertical: 20, backgroundColor: "#111" },
  kidsHeader: { fontSize: 22, fontWeight: "bold", color: "#000000", textAlign: "center", marginBottom: 10, textShadowColor: "gold", textShadowRadius: 25 },
  imageScrollContainer: { flexDirection: "row", paddingHorizontal: 10, alignItems: "center", paddingLeft: 15 },
  card: (isDesktop, w) => ({
    width: isDesktop ? w * 0.3 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.7,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    backgroundColor: "rgba(0,0,0,0.7)",
    marginRight: 20,
  }),
  kidCard: (isDesktop, w) => ({
    width: isDesktop ? w * 0.15 : SCREEN_WIDTH * 0.45,
    height: isDesktop ? SCREEN_HEIGHT * 0.4 : SCREEN_HEIGHT * 0.35,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    backgroundColor: "rgba(0,0,0,0.7)",
    marginRight: 20,
  }),
  clickable: { borderWidth: 2, borderColor: "gold", shadowColor: "gold", shadowOffset: { width: 0, height: 5 }, shadowRadius: 8, shadowOpacity: 0.7 },
  notClickable: { opacity: 0.8 },
  armorImage: { width: "100%", height: "100%", resizeMode: "cover" },
  kidImage: { width: "100%", height: "100%", resizeMode: "cover" },
  transparentOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0)", zIndex: 1 },
  cardName: { position: "absolute", bottom: 10, left: 10, fontSize: 16, color: "white", fontWeight: "bold" },
  kidCardName: { position: "absolute", bottom: 5, left: 5, fontSize: 12, color: "white", fontWeight: "bold" },
  aboutSection: { marginTop: 40, padding: 20, backgroundColor: "#222", borderRadius: 15 },
  aboutHeader: { fontSize: 22, fontWeight: "bold", color: "#000000", textAlign: "center", textShadowColor: "gold", textShadowRadius: 25 },
  aboutText: { fontSize: 16, color: "#fff", textAlign: "center", marginTop: 10 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.9)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "90%", maxHeight: SCREEN_HEIGHT * 0.7, backgroundColor: "rgba(34,34,34,0.98)", borderRadius: 15, padding: 20, elevation: 10, borderWidth: 2, borderColor: "gold" },
  modalTitle: { fontSize: 24, fontWeight: "bold", color: "gold", textAlign: "center", marginBottom: 15 },
  modalScroll: { maxHeight: SCREEN_HEIGHT * 0.5 },
  modalText: { fontSize: 16, color: "#fff", textAlign: "center", lineHeight: 24 },
  closeButton: { marginTop: 20, backgroundColor: "#b8860b", padding: 12, borderRadius: 8, alignSelf: "center", paddingHorizontal: 30 },
  closeButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});

export default Aileen;