import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react";
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

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } =
  Dimensions.get("window");

// 🎧 Ariata / Aileen music array
const TRACKS = [
  {
    id: "ariata_main",
    label: "Ariata Theme",
    source: require("../../assets/audio/SourceOfStrength.mp4"),
  },
  {
    id: "ariata_variant",
    label: "Ariata – Variant",
    source: require("../../assets/audio/NightWing.mp4"),
  },
];

const armor = [
  {
    name: "Ariata Prime",
    image: require("../../assets/Armor/AileenAriata.jpg"),
    clickable: true,
  },
  {
    name: "Legacy",
    image: require("../../assets/Armor/AileenLegacy.jpg"),
    clickable: true,
  },
  {
    name: "Baybayin",
    image: require("../../assets/Armor/Aileen.jpg"),
    clickable: true,
  },
  {
    name: "Ariata",
    image: require("../../assets/Armor/Aileen2.jpg"),
    clickable: true,
  },
  {
    name: "Luminara",
    image: require("../../assets/Armor/Aileen3.jpg"),
    clickable: true,
  },
  {
    name: "Aileara",
    image: require("../../assets/Armor/Aileen5.jpg"),
    clickable: true,
  },
  {
    name: "Nialla",
    image: require("../../assets/Armor/Aileen6.jpg"),
    clickable: true,
  },
  {
    name: "Ailethra",
    image: require("../../assets/Armor/Aileen9.jpg"),
    clickable: true,
  },
  {
    name: "Aishal",
    image: require("../../assets/Armor/Aileen8.jpg"),
    clickable: true,
  },
  {
    name: "Seraphina",
    image: require("../../assets/Armor/Aileen7.jpg"),
    clickable: true,
    screen: "Aileenchat",
  },
  {
    name: "Aikarea",
    image: require("../../assets/Armor/Aileen4.jpg"),
    clickable: true,
  },
  {
    name: "Philippines Crusader",
    image: require("../../assets/Armor/AileensSymbol.jpg"),
    clickable: true,
  },
];

const kids = [
  {
    name: "Niella Terra",
    image: require("../../assets/Armor/Niella.jpg"),
    clickable: true,
  },
  {
    name: "Oliver Robertodd",
    image: require("../../assets/Armor/Oliver.jpg"),
    clickable: true,
  },
  {
    name: "Cassidy Zayn",
    image: require("../../assets/Armor/CassidyZayn.jpg"),
    clickable: true,
  },
  {
    name: "",
    image: require("../../assets/Armor/family4.jpg"),
    clickable: true,
  },
  {
    name: "",
    image: require("../../assets/Armor/family5.jpg"),
    clickable: true,
  },
  {
    name: "",
    image: require("../../assets/Armor/family1.jpg"),
    clickable: true,
  },
  {
    name: "",
    image: require("../../assets/Armor/family2.jpg"),
    clickable: true,
  },
  {
    name: "",
    image: require("../../assets/Armor/family3.jpg"),
    clickable: true,
  },
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

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  const currentTrack = TRACKS[trackIndex];

  // dimension handling
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", () => {
      setWindowWidth(Dimensions.get("window").width);
    });
    return () => subscription?.remove();
  }, []);

  const isDesktop = windowWidth >= 768;

  // ───────── AUDIO HELPERS ─────────
  const unloadSound = useCallback(async () => {
    if (sound) {
      try {
        await sound.stopAsync();
      } catch {}
      try {
        await sound.unloadAsync();
      } catch {}
      setSound(null);
    }
  }, [sound]);

  const loadAndPlayTrack = useCallback(
    async (index) => {
      await unloadSound();
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          TRACKS[index].source,
          { isLooping: true, volume: 1.0 }
        );
        setSound(newSound);
        await newSound.playAsync();
        setIsPlaying(true);
      } catch (e) {
        console.error("Failed to play Ariata track", e);
        Alert.alert("Audio Error", "Could not play Aileen's theme.");
        setIsPlaying(false);
      }
    },
    [unloadSound]
  );

  const playTheme = async () => {
    if (sound) {
      try {
        await sound.playAsync();
        setIsPlaying(true);
      } catch (e) {
        console.error("Play error", e);
      }
    } else {
      await loadAndPlayTrack(trackIndex);
    }
  };

  const pauseTheme = async () => {
    if (!sound) return;
    try {
      await sound.pauseAsync();
      setIsPlaying(false);
    } catch (e) {
      console.error("Pause error", e);
    }
  };

  const cycleTrack = async (direction) => {
    const nextIndex = (trackIndex + direction + TRACKS.length) % TRACKS.length;
    setTrackIndex(nextIndex);
    if (isPlaying) {
      await loadAndPlayTrack(nextIndex);
    } else {
      await unloadSound();
    }
  };

  // Stop sound when leaving screen
  useFocusEffect(
    useCallback(() => {
      return () => {
        unloadSound();
        setIsPlaying(false);
      };
    }, [unloadSound])
  );

  // Flashing planet animation
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(flashAnim, {
          toValue: 0.4,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(flashAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }, 2000);
    return () => clearInterval(interval);
  }, [flashAnim]);

  const handleBackPress = async () => {
    await unloadSound();
    setIsPlaying(false);
    navigation.reset({ index: 0, routes: [{ name: "EclipseHome" }] });
  };

  const handlePlanetPress = async () => {
    await unloadSound();
    setIsPlaying(false);
    navigation.navigate("WarpScreen");
  };

  const handleCardPress = async (item) => {
    if (!item.clickable) return;

    if (sound && isPlaying) {
      await pauseTheme();
    }

    if (item.name === "Ariata") {
      setSelectedCharacter(item);
    } else if (item.name === "Seraphina") {
      await unloadSound();
      setIsPlaying(false);
      navigation.navigate("Aileenchat");
    } else {
      console.log(`${item.name} clicked`);
    }
  };

  const closePopup = () => setSelectedCharacter(null);

  const renderImageCard = (item, index) => (
    <TouchableOpacity
      key={`${item.name}-${index}`}
      style={[
        styles.card(isDesktop, windowWidth),
        item.clickable ? styles.clickable : styles.notClickable,
      ]}
      onPress={() => handleCardPress(item)}
      disabled={!item.clickable}
      activeOpacity={0.9}
    >
      <Image source={item.image} style={styles.armorImage} />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {item.name || "Unknown"}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  const renderKidCard = (item, index) => (
    <TouchableOpacity
      key={`${item.name || "family"}-${index}`}
      style={[
        styles.kidCard(isDesktop, windowWidth),
        item.clickable ? styles.clickable : styles.notClickable,
      ]}
      onPress={() =>
        item.clickable &&
        console.log(`${item.name || "Family"} clicked`)
      }
      disabled={!item.clickable}
      activeOpacity={0.9}
    >
      <Image source={item.image} style={styles.kidImage} />
      <View style={styles.transparentOverlay} />
      <Text style={styles.kidCardName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 🎧 MUSIC BAR – warm gold / crimson / deep night */}
      <View style={styles.musicControls}>
        <TouchableOpacity
          style={styles.trackButton}
          onPress={() => cycleTrack(-1)}
        >
          <Text style={styles.trackButtonText}>⟵</Text>
        </TouchableOpacity>

        <View style={styles.trackInfoGlass}>
          <Text style={styles.trackLabel}>Track:</Text>
          <Text style={styles.trackTitle}>{currentTrack.label}</Text>
        </View>

        <TouchableOpacity
          style={styles.trackButton}
          onPress={() => cycleTrack(1)}
        >
          <Text style={styles.trackButtonText}>⟶</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.musicButton, isPlaying && styles.musicButtonDisabled]}
          onPress={playTheme}
          disabled={isPlaying}
        >
          <Text style={styles.musicButtonText}>
            {isPlaying ? "Playing" : "Play"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.musicButtonSecondary,
            !isPlaying && styles.musicButtonDisabled,
          ]}
          onPress={pauseTheme}
          disabled={!isPlaying}
        >
          <Text style={styles.musicButtonTextSecondary}>Pause</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* HEADER – glass core + planet */}
        <View style={styles.headerOuter}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={styles.headerGlass}>
              <Text style={styles.title}>Ariata</Text>
              <Text style={styles.subtitle}>
                Filipina Crusader • Source of Strength
              </Text>
            </View>

            <TouchableOpacity
              onPress={handlePlanetPress}
              style={styles.planetContainer}
            >
              <Animated.Image
                source={require("../../assets/Space/Earth_hero.jpg")}
                style={[
                  styles.planetImage,
                  { opacity: flashAnim },
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ARMORY SECTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ariata Armory</Text>
          <View style={styles.sectionDivider} />
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
            // decelerationRate="fast"
          >
            {armor.map(renderImageCard)}
          </ScrollView>
        </View>

        {/* PARTNER + HEAVEN'S GUARD TABS */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabItem}>
            <Text style={styles.partnerHeader}>My Partner</Text>
            <TouchableOpacity
              style={[
                styles.partnerImageContainer(isDesktop, windowWidth),
                styles.clickable,
              ]}
              onPress={() => navigation.navigate("Will")}
            >
              <Image
                source={require("../../assets/Armor/Celestial.jpg")}
                style={styles.partnerImage(isDesktop, windowWidth)}
              />
              <View style={styles.transparentOverlay} />
            </TouchableOpacity>
          </View>
          <View style={styles.tabItem}>
            <Text style={styles.heavensGuardHeader}>
              Heaven&apos;s Guard
            </Text>
            <TouchableOpacity
              style={[
                styles.partnerImageContainer(isDesktop, windowWidth),
                styles.clickable,
              ]}
              onPress={() => navigation.navigate("Angels")}
            >
              <Image
                source={require("../../assets/BackGround/Angel2.jpg")}
                style={styles.partnerImage(isDesktop, windowWidth)}
              />
              <View style={styles.transparentOverlay} />
            </TouchableOpacity>
          </View>
        </View>

        {/* KIDS / FAMILY SECTION */}
        <View style={styles.kidsSection}>
          <Text style={styles.kidsHeader}>Our Future Family</Text>
          <View style={styles.sectionDividerSmall} />
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
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
      <Modal
        visible={!!selectedCharacter}
        transparent
        animationType="slide"
        onRequestClose={closePopup}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Aileen&apos;s Story</Text>
            <ScrollView style={styles.modalScroll}>
              <Text style={styles.modalText}>{ARIATA_STORY}</Text>
            </ScrollView>
            <TouchableOpacity
              onPress={closePopup}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  // BASE
  container: {
    flex: 1,
    backgroundColor: "#0b0504", // deep warm night
  },
  scrollContainer: {
    paddingBottom: 24,
  },

  // 🎧 MUSIC BAR – warm gold / crimson / deep night
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "rgba(25, 8, 4, 0.97)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 215, 130, 0.75)",
    shadowColor: "#ffb84d",
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  trackButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 160, 0.9)",
    backgroundColor: "rgba(60, 22, 10, 0.96)",
    marginRight: 6,
  },
  trackButtonText: {
    color: "#fff6e8",
    fontSize: 14,
    fontWeight: "bold",
  },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(40, 14, 8, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 150, 0.85)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: {
    color: "#ffe4b5",
    fontSize: 11,
    marginRight: 6,
  },
  trackTitle: {
    color: "#fffaf0",
    fontSize: 13,
    fontWeight: "700",
  },
  musicButton: {
    backgroundColor: "rgba(255, 193, 94, 0.96)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 235, 190, 0.95)",
  },
  musicButtonSecondary: {
    backgroundColor: "rgba(60, 24, 10, 0.96)",
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 210, 160, 0.9)",
  },
  musicButtonDisabled: {
    opacity: 0.55,
  },
  musicButtonText: {
    color: "#2b1300",
    fontWeight: "bold",
    fontSize: 13,
  },
  musicButtonTextSecondary: {
    color: "#ffe8c2",
    fontWeight: "bold",
    fontSize: 13,
  },

  // HEADER
  headerOuter: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(45, 20, 8, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 150, 0.9)",
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 20,
    color: "#ffe4b5",
    fontWeight: "bold",
  },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(30, 10, 5, 0.94)",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 150, 0.85)",
    shadowColor: "#ffb84d",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#ffd27f",
    textAlign: "center",
    textShadowColor: "#ffeaaf",
    textShadowRadius: 20,
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#ffe7c4",
    textAlign: "center",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  planetContainer: {
    marginLeft: 10,
  },
  planetImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  // ARMORY SECTION
  section: {
    marginTop: 24,
    marginHorizontal: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "rgba(18, 8, 4, 0.97)",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 150, 0.8)",
    shadowColor: "#ffb84d",
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffe8c2",
    textAlign: "center",
    textShadowColor: "#ffb84d",
    textShadowRadius: 18,
    letterSpacing: 0.8,
  },
  sectionDivider: {
    marginTop: 6,
    marginBottom: 10,
    alignSelf: "center",
    width: "40%",
    height: 2,
    borderRadius: 999,
    backgroundColor: "rgba(255, 215, 150, 0.95)",
  },
  sectionDividerSmall: {
    marginTop: 4,
    marginBottom: 10,
    alignSelf: "center",
    width: "30%",
    height: 2,
    borderRadius: 999,
    backgroundColor: "rgba(255, 215, 150, 0.8)",
  },

  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
    paddingLeft: 15,
  },

  // ARMOR / FAMILY CARDS
  card: (isDesktop, w) => ({
    width: isDesktop ? w * 0.3 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.7,
    borderRadius: 18,
    overflow: "hidden",
    elevation: 10,
    backgroundColor: "rgba(5, 2, 1, 0.9)",
    marginRight: 20,
  }),
  kidCard: (isDesktop, w) => ({
    width: isDesktop ? w * 0.15 : SCREEN_WIDTH * 0.45,
    height: isDesktop ? SCREEN_HEIGHT * 0.4 : SCREEN_HEIGHT * 0.35,
    borderRadius: 18,
    overflow: "hidden",
    elevation: 8,
    backgroundColor: "rgba(5, 2, 1, 0.9)",
    marginRight: 20,
  }),
  clickable: {
    borderWidth: 3,
    borderColor: "#ffd27f",
    shadowColor: "#ffb84d",
    shadowOpacity: 0.8,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },
  notClickable: {
    opacity: 0.7,
  },
  armorImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  kidImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    zIndex: 1,
  },
  cardName: {
    position: "absolute",
    bottom: 10,
    left: 10,
    fontSize: 16,
    color: "#fffaf0",
    fontWeight: "bold",
    textShadowColor: "#000",
    textShadowRadius: 6,
  },
  kidCardName: {
    position: "absolute",
    bottom: 5,
    left: 5,
    fontSize: 12,
    color: "#fffaf0",
    fontWeight: "bold",
  },

  // TABS
  tabsContainer: {
    width: "100%",
    paddingVertical: 20,
    backgroundColor: "#120705",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabItem: {
    alignItems: "center",
    flex: 1,
    maxWidth: "45%",
  },
  partnerHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffe8c2",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "#ffb84d",
    textShadowRadius: 18,
  },
  heavensGuardHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffe8c2",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "#ffb84d",
    textShadowRadius: 18,
  },
  partnerImageContainer: (isDesktop, w) => ({
    width: isDesktop ? w * 0.15 : SCREEN_WIDTH * 0.3,
    height: isDesktop ? w * 0.15 : SCREEN_WIDTH * 0.3,
    borderRadius: isDesktop ? (w * 0.15) / 2 : (SCREEN_WIDTH * 0.3) / 2,
    overflow: "hidden",
    elevation: 8,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
  }),
  partnerImage: (isDesktop, w) => ({
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  }),

  // KIDS SECTION
  kidsSection: {
    width: "100%",
    paddingVertical: 20,
    backgroundColor: "#120705",
  },
  kidsHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffe8c2",
    textAlign: "center",
    marginBottom: 6,
    textShadowColor: "#ffb84d",
    textShadowRadius: 18,
  },

  // ABOUT (when uncommented later)
  aboutSection: {
    marginTop: 28,
    marginHorizontal: 12,
    marginBottom: 32,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: "rgba(20, 8, 4, 0.97)",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 150, 0.8)",
    shadowColor: "#ffb84d",
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffe8c2",
    textAlign: "center",
    textShadowColor: "#ffb84d",
    textShadowRadius: 18,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  aboutText: {
    fontSize: 14,
    color: "#fff6e8",
    lineHeight: 20,
    marginTop: 6,
    textAlign: "left",
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: SCREEN_HEIGHT * 0.7,
    backgroundColor: "rgba(34,34,34,0.98)",
    borderRadius: 15,
    padding: 20,
    elevation: 10,
    borderWidth: 2,
    borderColor: "gold",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "gold",
    textAlign: "center",
    marginBottom: 15,
  },
  modalScroll: {
    maxHeight: SCREEN_HEIGHT * 0.5,
  },
  modalText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    lineHeight: 24,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#b8860b",
    padding: 12,
    borderRadius: 8,
    alignSelf: "center",
    paddingHorizontal: 30,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Aileen;
