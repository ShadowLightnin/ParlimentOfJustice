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

const armors = [
  { name: "Kintsunera Prime", image: require("../../assets/Armor/EmmaLegacy.jpg"), clickable: true },
  { name: "Kintsunera", image: require("../../assets/Armor/Emma.jpg"), clickable: true },
  { name: "Kintsunera", image: require("../../assets/Armor/Emma2.jpg"), clickable: true },
  { name: "Symbol", image: require("../../assets/Armor/EmmasSymbol.jpg"), clickable: true },
];

const Emma = () => {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  // Audio state — exactly like Will & Aileen
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load BlueBloods.mp4 once — NO autoplay
  useEffect(() => {
    let soundObj = null;
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("../../assets/audio/BlueBloods.mp4"),
          { isLooping: true, volume: 0.9 },
          null,
          false // no autoplay
        );
        soundObj = sound;
        setSound(sound);
      } catch (e) {
        console.error("Failed to load BlueBloods.mp4", e);
        Alert.alert("Audio Error", "Could not load BlueBloods.mp4");
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

  // Stop music when leaving the screen (same as Will & Aileen)
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

  // Dimension handling
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", () => {
      setWindowWidth(Dimensions.get("window").width);
    });
    return () => subscription?.remove();
  }, []);

  const isDesktop = windowWidth >= 768;

  const renderArmorCard = (armor) => (
    <TouchableOpacity
      key={armor.name}
      style={[styles.card(isDesktop, windowWidth), armor.clickable ? styles.clickable : styles.notClickable]}
      onPress={() => armor.clickable && console.log(`${armor.name} clicked`)}
      disabled={!armor.clickable}
    >
      <Image source={armor.image} style={styles.armorImage} />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {armor.name || "Kintsunera"}; William Cummings
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* SAME MUSIC CONTROLS AS WILL & AILEEN — now in Kintsunera blue-gold */}
      <View style={styles.musicControls}>
        <TouchableOpacity
          style={styles.musicButton}
          onPress={playTheme}
          disabled={isPlaying}
        >
          <Text style={styles.musicButtonText}>Play Theme</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.musicButton}
          onPress={pauseTheme}
          disabled={!isPlaying}
        >
          <Text style={styles.musicButtonText}>Pause</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (sound) sound.stopAsync();
              navigation.goBack();
            }}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Kintsunera</Text>
          <View style={{ width: 50 }} /> {/* Spacer for symmetry */}
        </View>

        {/* Armor Gallery */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            snapToInterval={SCREEN_WIDTH * 0.7 + 20}
            decelerationRate="fast"
            contentOffset={{ x: (SCREEN_WIDTH - (SCREEN_WIDTH * 0.7)) / 2 - 10, y: 0 }}
          >
            {armors.map(renderArmorCard)}
          </ScrollView>
        </View>

        {/* <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>About Me</Text>
          <Text style={styles.aboutText}>
          Emma Cummings, known as Kinsunera, is a radiant force of hope and innovation, the younger Cummings sibling and a vital member of the Titans within the Parliament of Justice. Her presence is both inspiring and dynamic, a blend of angelic grace and mechanical precision that sets her apart among her cousins. Behind her vibrant armor, Emma is creative, empathetic, and fiercely protective of her family, especially her brother William. She sees herself as a beacon for the Titans, bringing light to the darkness of Zion City, and her mechanical angel wings symbolize her desire to rise above the chaos. Off the battlefield, she’s a dreamer and a tinkerer, often working with William on new tech or sketching designs that blend beauty with function, but her optimism hides a fear of failing those she loves.          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Emma grew up alongside her older brother William in a tech-savvy household on the edge of Zion City’s Terrestrial sector, where innovation and resilience were family traits. While William gravitated toward stealth and strategy, Emma was drawn to flight and flair, inspired by stories of angels and futuristic heroes like The Paradigm. Her childhood was marked by curiosity and creativity, but also by the growing threats from the Telestial and Outer Darkness sectors.          </Text>
          <Text style={styles.aboutText}>
          During a critical moment in their village’s defense, Emma’s mechanical ingenuity shone through when she rigged a set of scavenged parts into makeshift wings, allowing her to evade attackers and scout from above. This moment birthed Kinsunera, and her armor evolved to reflect her vision of hope and protection. Joining the Titans, she stood with William, the McNeil siblings (Spencer, Jared, Jennifer), and the Briggs cousins (Ben, Azure), using her wings and energy to support their missions.          </Text>
          <Text style={styles.aboutText}>
          As one of the oldest cousins, Emma felt the weight of Spencer’s fallen leadership and Jared’s rising ambition, but she also saw an opportunity to bridge their divides. Her Paradigm-inspired armor, with its fading colors and flamingo accents, became a symbol of resilience, but her fear of not living up to her family’s expectations sometimes clouds her confidence. Her connection to the broader family—nurturers like Jennifer, strategists like Todd (Cummings), and healers like Emily (Jensen)—strengthens her, but she worries about the future of Zion City and her role in it.          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Emma’s suit and innate creativity grant her a range of powers focused on mobility, support, and inspiration, reflecting her Paradigm inspiration:          </Text>
          <Text style={styles.aboutText}>
          Mechanical Flight: Her mechanical angel wings allow for agile flight, reconnaissance, and rapid repositioning in battle. They can also emit energy pulses to distract or disorient enemies.          </Text>
          <Text style={styles.aboutText}>
          Energy Manipulation: Can project bursts of blue, white, and pink energy, drawing from her armor’s color scheme, to shield allies or damage foes. These bursts are both offensive and defensive, symbolizing her dual role as protector and warrior.          </Text>
          <Text style={styles.aboutText}>
          Empathic Boost: Can inspire and uplift her family and teammates, enhancing their morale and coordination, much like her flamingo accents suggest joy and unity.          </Text>
          <Text style={styles.aboutText}>
          Adaptive Technology: Her armor and wings are equipped with modular tech that can adapt to different situations, such as reinforcing shields or boosting speed, a trait she shares with William but applies with more flair.          </Text>
          <Text style={styles.aboutText}>
          Light Display: Can create dazzling light shows or illusions using her armor’s fading colors, confusing enemies or signaling allies, a nod to The Paradigm’s creative energy.          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team          
          </Text>
          <Text style={styles.aboutText}>
          Emma is the light and innovation of the Titans, a counterbalance to William’s shadows, Spencer’s power, and Jared’s speed. She’s optimistic, creative, and deeply loyal, but her fear of failure—especially toward her brother and cousins—drives her to push her limits. Her relationship with William is protective and collaborative—he’s her mentor and shield, while she inspires him with her vision. With the McNeil siblings, she admires Jennifer’s healing but worries about Spencer’s fall and Jared’s pressure, often trying to lift their spirits.          </Text>
          <Text style={styles.aboutText}>
          As Emma’s younger sister, she looks up to William but also challenges him to embrace hope over caution. Her cousins—Ben and Azure (Briggs), the McNeil siblings—rely on her for aerial support and morale, while she draws strength from their diversity. In a broader sense, Emma connects with creatives like Ava (McNeil) and strategists like Lee (Jensen), using her wings to scout and her energy to inspire.          </Text>
          <Text style={styles.aboutText}>
          In the Parliament of Justice, Emma works to bridge the gap between tradition and progress, often mediating between Spencer’s nostalgia and Jared’s modernity. Her ultimate goal is to ensure Zion City’s future is bright, proving that hope and technology can heal even the deepest wounds.          </Text>
        </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a" },

  // SAME EXACT MUSIC BAR STYLE AS WILL (green) — but now blue-gold for Emma
  musicControls: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 12,
    backgroundColor: "rgba(10, 20, 40, 0.95)",
    borderBottomWidth: 1,
    borderBottomColor: "#4169e1",
  },
  musicButton: {
    backgroundColor: "rgba(65, 105, 225, 0.9)",
    paddingHorizontal: 26,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    elevation: 8,
    shadowColor: "#00bfff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
  },
  musicButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  scrollContainer: { paddingBottom: 30 },
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
  backButton: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 8,
  },
  backButtonText: { fontSize: 24, color: "#87CEEB", fontWeight: "bold" },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#00BFFF",
    textAlign: "center",
    flex: 1,
    textShadowColor: "#87CEEB",
    textShadowRadius: 15,
  },

  imageContainer: {
    width: "100%",
    paddingVertical: 20,
    backgroundColor: "#111",
    paddingLeft: 15,
  },
  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
  },
  card: (isDesktop, w) => ({
    width: isDesktop ? w * 0.3 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.7,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 8,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    marginRight: 20,
  }),
  clickable: {
    borderWidth: 3,
    borderColor: "#87CEEB",
    shadowColor: "#00BFFF",
    shadowOpacity: 0.9,
  },
  notClickable: { opacity: 0.7 },
  armorImage: { width: "100%", height: "100%", resizeMode: "cover" },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0)",
    zIndex: 1,
  },
  cardName: {
    position: "absolute",
    bottom: 12,
    left: 12,
    fontSize: 17,
    color: "#E0FFFF",
    fontWeight: "bold",
    textShadowColor: "#000080",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
});

export default Emma;