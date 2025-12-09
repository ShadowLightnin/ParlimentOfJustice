import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Audio } from "expo-av";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// 🎵 Night Hawk tracks – swap sources as you add more
const TRACKS = [
  {
    id: "night_hawk_main",
    label: "Night Hawk Theme",
    source: require("../../assets/audio/NightWing.mp4"),
  },
  {
    id: "night_hawk_variant",
    label: "Night Hawk – Variant",
    source: require("../../assets/audio/SourceOfStrength.mp4"),
  },
];

const armors = [
  { name: "Parliament Founder", image: require("../../assets/Armor/WillNightHawk3.jpg"), clickable: true },
  { name: "Titan Founder", image: require("../../assets/Armor/WillNightHawk4.jpg"), clickable: true },
  { name: "Night Hawk: Building", image: require("../../assets/Armor/WillNightHawk.jpg"), clickable: true },
  { name: "Titan Night Hawk", image: require("../../assets/Armor/WillNightHawk5.jpg"), clickable: true },
  { name: "Spartan Night Hawk", image: require("../../assets/Armor/WillNightHawk6.jpg"), clickable: true },
  { name: "Flying Night Hawk", image: require("../../assets/Armor/WillNightHawkFly.jpg"), clickable: true },
  { name: "Night Hawk Flying", image: require("../../assets/Armor/WillNightHawkFly2.jpg"), clickable: true },
  { name: "Legacy", image: require("../../assets/Armor/WillLegacy.jpg"), clickable: true },
];

const legacyArmors = [
  { name: "Night Hawk", image: require("../../assets/Armor/WillNightHawk2.jpg"), clickable: true },
  { name: "Celestial", image: require("../../assets/Armor/WillCelestial.jpg"), clickable: true },
  { name: "Sentinel", image: require("../../assets/Armor/WillSentinel.jpg"), clickable: true },
  { name: "Wrath", image: require("../../assets/Armor/WillWrath.jpg"), clickable: true },
  { name: "Lightning Leopard", image: require("../../assets/Armor/Will.jpg"), clickable: true },
  { name: "Shadow Storm", image: require("../../assets/Armor/WillShadowStorm.jpg"), clickable: true },
  { name: "Defender v2", image: require("../../assets/Armor/WillDefender2.jpg"), clickable: true },
  { name: "Defender v1", image: require("../../assets/Armor/WillDefender1.jpg"), clickable: true },

  { name: "Concept: Night Hawk", image: require("../../assets/NightHawkWillBeBorn.jpg"), clickable: true },
  { name: "Concept: White Night Hawk", image: require("../../assets/Armor/NightHawk.jpg"), clickable: true },
  { name: "Concept: Defender 1", image: require("../../assets/Armor/Defender1.jpg"), clickable: true },
  { name: "Concept: Defender 2", image: require("../../assets/Armor/Defender2.jpg"), clickable: true },
  { name: "Concept: Shadow Storm", image: require("../../assets/Armor/ShadowStorm.jpg"), clickable: true },
  { name: "Concept: Celestial", image: require("../../assets/Armor/Celestial.jpg"), clickable: true },
  { name: "Concept: Sentinel", image: require("../../assets/Armor/Sentinel.jpg"), clickable: true },
  { name: "Concept: Wrath", image: require("../../assets/Armor/Wrath.jpg"), clickable: true },
  { name: "Night Hawk Helmet", image: require("../../assets/Armor/MyHelmets2.jpg"), clickable: true },
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

const Will = () => {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const currentTrack = TRACKS[trackIndex];

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", () => {
      setWindowWidth(Dimensions.get("window").width);
    });
    return () => subscription?.remove();
  }, []);

  const isDesktop = windowWidth >= 768;

  // 🔊 AUDIO HELPERS
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
        console.error("Failed to load Night Hawk track", e);
        Alert.alert("Audio Error", "Could not load the selected Night Hawk track.");
        setIsPlaying(false);
      }
    },
    [unloadSound]
  );

  const playTheme = async () => {
    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
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

  // Stop/unload when leaving screen
  useFocusEffect(
    useCallback(() => {
      return () => {
        unloadSound();
        setIsPlaying(false);
      };
    }, [unloadSound])
  );

  // RENDER CARDS
  const renderArmorCard = (armor) => (
    <TouchableOpacity
      key={armor.name}
      style={[
        styles.card(isDesktop, windowWidth),
        armor.clickable ? styles.clickable : styles.notClickable,
      ]}
      onPress={() => armor.clickable && console.log(`${armor.name} clicked`)}
      disabled={!armor.clickable}
      activeOpacity={0.9}
    >
      <Image source={armor.image} style={styles.armorImage} />
      <View style={styles.cardOverlay} />
      <Text style={styles.cardName}>
        © {armor.name || "Unknown"}; William Cummings
      </Text>
      {!armor.clickable && (
        <Text style={styles.disabledText}>Not Clickable</Text>
      )}
    </TouchableOpacity>
  );

  const renderKidCard = (item, index) => (
    <TouchableOpacity
      key={item.name || `kid-${index}`}
      style={[
        styles.kidCard(isDesktop, windowWidth),
        item.clickable ? styles.clickableKid : styles.notClickable,
      ]}
      onPress={() =>
        item.clickable && console.log(`${item.name || "Family"} clicked`)
      }
      disabled={!item.clickable}
      activeOpacity={0.9}
    >
      <Image source={item.image} style={styles.kidImage} />
      <View style={styles.kidOverlay} />
      <Text style={styles.kidCardName}>
        © {item.name || "Unknown"}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 🎧 MUSIC BAR WITH TRACK INFO */}
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
        {/* HEADER */}
        <View style={styles.headerOuter}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.navigate("TitansHome")}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={styles.headerGlass}>
              <Text style={styles.title}>Night Hawk</Text>
              <Text style={styles.subtitle}>Creation • Legacy • Honor</Text>
            </View>
          </View>
        </View>

        {/* PRIME ARMORY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prime Armory</Text>
          <View style={styles.sectionDivider} />
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
          >
            {armors.map(renderArmorCard)}
          </ScrollView>
        </View>

        {/* LEGACY ARMORY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legacy Armory</Text>
          <View style={styles.sectionDivider} />
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
          >
            {legacyArmors.map(renderArmorCard)}
          </ScrollView>
        </View>

        {/* PARTNER */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleGold}>My Partner</Text>
          <View style={styles.sectionDividerGold} />
          <TouchableOpacity
            style={[
              styles.partnerImageContainer(isDesktop, windowWidth),
              styles.partnerBorder,
            ]}
            onPress={() => navigation.navigate("Aileen")}
            activeOpacity={0.92}
          >
            <Image
              source={require("../../assets/Armor/AileenAriata.jpg")}
              style={styles.partnerImage(isDesktop, windowWidth)}
            />
            <View style={styles.partnerOverlay} />
            <Text style={styles.partnerName}>Aileen</Text>
          </TouchableOpacity>
        </View>

        {/* KIDS / FAMILY FUTURE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitleGold}>Our Future Family</Text>
          <View style={styles.sectionDividerGold} />
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

        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>About Me</Text>
          {/* <Text style={styles.aboutText}>
            William Cummings, known as Night Hawk, is a master of shadows and strategy, the older Cummings sibling and a cornerstone of the Titans within the Parliament of Justice. His lean, agile frame hides a mind as sharp as his claws and a heart loyal to his family. Behind his sleek, ever-changing helmets, William is a tech genius and stealth expert, always two steps ahead of his enemies and ready to adapt to any situation. He’s in a relationship with Aileen, whose strength complements his tactical mind, and he shares an unbreakable bond with his sister Emma. As one of the oldest cousins, William bridges the gap between tradition (like Spencer’s ideals) and innovation, using his suits to protect his cousins—Spencer, Jared, Jennifer (McNeil), Ben, Azure (Briggs), and the rest. Off the battlefield, he’s a problem-solver, often tinkering with gadgets or strategizing with his family, but his drive to stay invisible and untouchable sometimes isolates him.
          </Text>
          <Text style={styles.aboutText}>Backstory</Text>
          <Text style={styles.aboutText}>
            William grew up in a tech-savvy household on the edge of Zion City’s Terrestrial sector, alongside his younger sister Emma. The Cummings family valued both physical prowess and intellectual innovation, and William inherited a knack for mechanics from his parents. While Emma gravitated toward mechanical flight and flair, William focused on stealth and precision, inspired by heroes like Batman and Nightwing, whose shadows and symbols spoke to him.
          </Text>
          <Text style={styles.aboutText}>
            When Zion City’s sectors began to fracture, William’s village faced threats from the Telestial and Outer Darkness sectors. During a nighttime raid, he discovered his ability to blend into shadows, using scavenged tech to create his first suit. This moment birthed Night Hawk, and he soon joined the Titans, working closely with the McNeil siblings (Spencer, Jared, Jennifer) and Briggs cousins (Ben, Azure). His suits evolved over time, each reflecting a new challenge: the Defender suits for raw power, the Night Hawk for stealth, and the Celestial and Sentinel for versatility.
          </Text>
          <Text style={styles.aboutText}>
            As the oldest Cummings sibling, William took on a protective role for Emma and the broader family, but he also felt the pressure of Spencer’s fallen leadership and Jared’s rising ambition. His relationship with Spencer is one of mutual respect but subtle tension—Spencer admires William’s adaptability but fears his reliance on technology, while William sees Spencer’s nostalgia as a weakness. With Jared, he’s a rival and ally, matching speed with strategy, and with Jennifer, he shares a deep trust, often relying on her healing to recover from his stealth missions.
          </Text>
          <Text style={styles.aboutText}>
            In a relationship with Aileen, William finds balance, her cultural strength grounding his high-tech approach. Together, they face Zion City’s chaos, but William’s fear of failure—especially toward his sister and cousins—drives him to push his suits and abilities to their limits.
          </Text>
          <Text style={styles.aboutText}>Abilities</Text>
          <Text style={styles.aboutText}>
            William’s suits and innate skills make him a versatile operative, with a focus on stealth, technology, and combat:
          </Text>
          <Text style={styles.aboutText}>
            Stealth Mastery: Can turn invisible using his Night Hawk, Celestial, and Sentinel suits, blending into shadows or environments for reconnaissance or ambushes. His infrared, radar, and sonar capabilities (via helmet spikes) make him a perfect scout.
          </Text>
          <Text style={styles.aboutText}>
            Technological Adaptability: Each suit is equipped with advanced systems—flight (Defender 2.0, Shadow Storm), color-changing camouflage, and weaponized features (gauntlet spikes, claws). He can switch modes mid-battle, adapting to any threat.
          </Text>
          <Text style={styles.aboutText}>
            Combat Prowess: Armed with Batman-inspired gauntlet spikes and Wolverine-like claws, William excels in close-quarters combat, striking fast and retreating before enemies can react.
          </Text>
          <Text style={styles.aboutText}>
            Tactical Intelligence: His suits’ HUDs and data analysis allow him to strategize in real time, coordinating with the Titans and extended family for maximum efficiency.
          </Text>
          <Text style={styles.aboutText}>
            Energy Projection (Via Suits): Certain suits (Celestial, Sentinel, Wrath) can emit energy blasts or create force fields, drawing on their glowing visors and design motifs.
          </Text>
          <Text style={styles.aboutText}>Armor Description</Text>
          <Text style={styles.aboutText}>
            William’s armor is a showcase of versatility and style, with each suit tailored to a specific role. Here’s a detailed breakdown:
          </Text>
          <Text style={styles.aboutText}>Night Hawk Suit:</Text>
          <Text style={styles.aboutText}>
            Helmet: A refined version of Defender 2.0, splitting from a V visor to a Y/T visor for better visibility and intimidation. Two spikes on the helmet have three light rings (radar, sonar, infrared) that pulse in sync with his stealth mode. Colors shift from gunmetal grey and dark green to white and blue, with a Hawk symbol (Nightwing-inspired) on the chest.
          </Text>
          <Text style={styles.aboutText}>
            Body Armor: High-performance, lightweight, prioritizing agility over bulk. Includes Batman’s gauntlet spikes and Wolverine’s claws for combat, and a stealth coating that turns it invisible.
          </Text>
          <Text style={styles.aboutText}>
            Additional Features: A compact power core in the chest fuels color changes and invisibility.
          </Text>
          <Text style={styles.aboutText}>Defender Suit 1.0:</Text>
          <Text style={styles.aboutText}>
            Body styled after Iron Man Mark 85, gunmetal grey instead of red, dark green instead of gold. Helmet styled after Arkham Knight and Final Stage Omega from Fortnite, with true omega spikes. Armor gaps held by carbon fiber chainmail, making it rugged yet flexible.
          </Text>
          <Text style={styles.aboutText}>Defender Suit 2.0:</Text>
          <Text style={styles.aboutText}>
            Like 1.0 but with a Mark 46 body and Mark 85 texture, fully filled for flight like Iron Man. Blends Mark 45, 46, and 85 styles, with enhanced durability and speed. Used for aerial assaults and heavy combat.
          </Text>
          <Text style={styles.aboutText}>Shadow Storm Suit:</Text>
          <Text style={styles.aboutText}>
            Like Defender 2.0 but with a bat symbol instead of an arc reactor and a retractable bat cape for gliding or intimidation. Black with dark grey accents, ideal for stealth and psychological warfare.
          </Text>
          <Text style={styles.aboutText}>Celestial Suit:</Text>
          <Text style={styles.aboutText}>
            Like Night Hawk but all white with golden swirls, symbolizing purity and power. Visor glows gold, enhancing night vision and energy projection. Lighter and more ceremonial, used for leadership or morale-boosting missions.
          </Text>
          <Text style={styles.aboutText}>Sentinel Suit:</Text>
          <Text style={styles.aboutText}>
            Like Night Hawk but all white with dark green as dark grey and gold accents, visor indented and glowing blue. Designed for defense, with reinforced plating and a shield generator for protecting allies.
          </Text>
          <Text style={styles.aboutText}>Wrath Suit:</Text>
          <Text style={styles.aboutText}>
            Like Defender 2.0 but bigger, bulkier, black, broken-looking, and war-weathered, glowing fire red. Used for overwhelming force, reflecting William’s darker moments or desperate battles.
          </Text>
          <Text style={styles.aboutText}>Personality and Role in the Team</Text>
          <Text style={styles.aboutText}>
            William is the tactician and shadow of the Titans, balancing Spencer’s power, Jared’s speed, and Jennifer’s healing with his own stealth and tech. He’s pragmatic but carries a fear of failure, especially toward his sister Emma and the family. His relationship with Spencer is respectful but tense—William sees Spencer’s fall as a cautionary tale, while Spencer worries William’s tech obsession distances him from their roots. With Jared, he’s a rival in strategy, often outsmarting his speed with preparation, and with Jennifer, he’s protective, relying on her to heal his physical and emotional scars.
          </Text>
          <Text style={styles.aboutText}>
            As Emma’s older brother, William is her guardian and mentor, pushing her to refine her mechanical wings while learning from her creativity. His cousins—Ben and Azure (Briggs), the McNeil siblings—rely on his adaptability, while he draws inspiration from their strengths. In a relationship with Aileen, he finds a partner who challenges his isolation, and her cultural strength helps him connect with the family’s traditions.
          </Text>
          <Text style={styles.aboutText}>
            In the Parliament of Justice, William coordinates with tech-savvy cousins like Myran (Jennifer’s husband) and strategists like Todd (Cummings) and Lee (Jensen). His ultimate goal is to protect Zion City’s future, proving that technology and tradition can coexist, while ensuring his family—especially Emma—thrives.
          </Text> */}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // BASE
  container: {
    flex: 1,
    backgroundColor: "#02050b",
  },
  scrollContainer: {
    paddingBottom: 30,
  },

  // MUSIC BAR
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: "rgba(4, 14, 30, 0.95)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 220, 255, 0.25)",
    shadowColor: "#00e5ff",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 14,
    elevation: 8,
  },
  trackButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(140, 220, 255, 0.9)",
    backgroundColor: "rgba(6, 20, 40, 0.96)",
    marginRight: 6,
  },
  trackButtonText: {
    color: "#e9fbff",
    fontSize: 14,
    fontWeight: "bold",
  },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(4, 16, 32, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(0, 220, 255, 0.7)",
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: {
    color: "#b8dfff",
    fontSize: 11,
    marginRight: 6,
  },
  trackTitle: {
    color: "#e9fbff",
    fontSize: 13,
    fontWeight: "700",
  },
  musicButton: {
    backgroundColor: "rgba(0, 40, 70, 0.95)",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(0, 230, 255, 0.9)",
  },
  musicButtonSecondary: {
    backgroundColor: "rgba(3, 14, 28, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(160, 220, 255, 0.8)",
  },
  musicButtonDisabled: {
    opacity: 0.55,
  },
  musicButtonText: {
    color: "#e9fbff",
    fontWeight: "bold",
    fontSize: 13,
    textShadowColor: "#00e5ff",
        textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },

  },
  musicButtonTextSecondary: {
    color: "#d6ecff",
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
    backgroundColor: "rgba(5, 20, 45, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(170, 215, 255, 0.9)",
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 22,
    color: "#e8f4ff",
  },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(6, 22, 50, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(0, 220, 255, 0.6)",
    shadowColor: "#00e5ff",
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#f5fcff",
    textAlign: "center",
    textShadowColor: "#00e5ff",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#b8dfff",
    textAlign: "center",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  // GENERIC SECTION
  section: {
    marginTop: 24,
    marginHorizontal: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "rgba(4, 16, 36, 0.93)",
    borderWidth: 1,
    borderColor: "rgba(0, 200, 255, 0.35)",
    shadowColor: "#00e5ff",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e9fbff",
    textAlign: "center",
    textShadowColor: "#00b3ff",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 0.8,
  },
  sectionTitleGold: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffe9a6",
    textAlign: "center",
    textShadowColor: "gold",
        textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },

    letterSpacing: 0.8,
  },
  sectionDivider: {
    marginTop: 6,
    marginBottom: 10,
    alignSelf: "center",
    width: "40%",
    height: 2,
    borderRadius: 999,
    backgroundColor: "rgba(0, 230, 255, 0.8)",
  },
  sectionDividerGold: {
    marginTop: 6,
    marginBottom: 10,
    alignSelf: "center",
    width: "40%",
    height: 2,
    borderRadius: 999,
    backgroundColor: "rgba(255, 215, 120, 0.95)",
  },

  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 6,
    paddingTop: 4,
    alignItems: "center",
  },

  // ARMOR CARDS
  card: (isDesktop, w) => ({
    width: isDesktop ? w * 0.28 : SCREEN_WIDTH * 0.8,
    height: isDesktop ? SCREEN_HEIGHT * 0.7 : SCREEN_HEIGHT * 0.65,
    borderRadius: 22,
    overflow: "hidden",
    marginRight: 18,
    backgroundColor: "rgba(1, 8, 20, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(0, 225, 255, 0.85)",
    shadowColor: "#00e5ff",
    shadowOpacity: 0.7,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  }),
  armorImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  clickable: {},
  notClickable: {
    opacity: 0.75,
  },
  cardName: {
    position: "absolute",
    bottom: 10,
    left: 12,
    right: 12,
    fontSize: 12,
    color: "#eaf8ff",
    fontWeight: "600",
    textShadowColor: "#000",
        textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },

  },
  disabledText: {
    position: "absolute",
    top: 10,
    right: 12,
    fontSize: 10,
    color: "#7ad0c1",
    fontWeight: "600",
  },

  // PARTNER
  partnerImageContainer: (isDesktop, w) => ({
    width: isDesktop ? w * 0.22 : SCREEN_WIDTH * 0.5,
    height: isDesktop ? w * 0.22 : SCREEN_WIDTH * 0.5,
    borderRadius: isDesktop ? (w * 0.22) / 2 : SCREEN_WIDTH * 0.25,
    overflow: "hidden",
    alignSelf: "center",
    marginTop: 10,
  }),
  partnerBorder: {
    borderWidth: 2,
    borderColor: "rgba(255, 215, 120, 0.95)",
    backgroundColor: "rgba(0,0,0,0.7)",
    shadowColor: "gold",
    shadowOpacity: 0.7,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  partnerImage: (isDesktop, w) => ({
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  }),
  partnerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  partnerName: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    fontSize: 16,
    color: "#ffe9b8",
    fontWeight: "700",
    textShadowColor: "#000",
        textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },

  },

  // KIDS
  kidsHeader: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000000",
    textAlign: "center",
    marginBottom: 10,
    textShadowColor: "gold",
        textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },

  },
  kidCard: (isDesktop, w) => ({
    width: isDesktop ? w * 0.16 : SCREEN_WIDTH * 0.46,
    height: isDesktop ? SCREEN_HEIGHT * 0.42 : SCREEN_HEIGHT * 0.38,
    borderRadius: 18,
    overflow: "hidden",
    marginRight: 16,
    backgroundColor: "rgba(5, 10, 22, 0.9)",
    borderWidth: 1,
    borderColor: "rgba(255, 215, 120, 0.9)",
    shadowColor: "gold",
    shadowOpacity: 0.6,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  }),
  kidImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  kidOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  clickableKid: {},
  kidCardName: {
    position: "absolute",
    bottom: 8,
    left: 8,
    right: 8,
    fontSize: 11,
    color: "#fff8e1",
    fontWeight: "600",
    textShadowColor: "#000",
    textShadowRadius: 10,
  },

  // ABOUT ME
  aboutSection: {
    marginTop: 28,
    marginHorizontal: 12,
    marginBottom: 32,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: "rgba(3, 12, 28, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(0, 220, 255, 0.45)",
    shadowColor: "#00e5ff",
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: "#e9fbff",
    textAlign: "center",
    textShadowColor: "#00b3ff",
        textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },

    letterSpacing: 0.8,
    marginBottom: 6,
  },
  aboutText: {
    fontSize: 14,
    color: "#dcecff",
    lineHeight: 20,
    marginTop: 6,
    textAlign: "left",
  },
});

export default Will;
