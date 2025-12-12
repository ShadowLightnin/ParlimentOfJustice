import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// 🔹 Fallback placeholder image
const PLACEHOLDER = require("../../assets/Armor/PlaceHolder.jpg");

// ✅ Normalize ANY kind of image value into something <Image> understands
const normalizeImageSource = (img) => {
  if (!img) return PLACEHOLDER;

  // 1) Local require(...) → number
  if (typeof img === "number") return img;

  // 2) Object with uri
  if (typeof img === "object" && img.uri != null) {
    if (typeof img.uri === "number") return img.uri;
    if (typeof img.uri === "string") return { uri: img.uri };
  }

  // 3) Plain string → remote URL
  if (typeof img === "string") return { uri: img };

  return PLACEHOLDER;
};

// Default lore fallback (kept)
const defaultDescriptions = {
  Taylor:
    "A star that burns brighter than the rest. Her presence commands silence, her will bends reality. Known to walk between realms.",
  Adin:
    "Born under the southern cross. A warrior of ancient bloodlines, guardian of forgotten oaths. His footsteps shake the earth.",
  "Justin Platt":
    "Echo Wood — the voice that lingers in the forest long after he’s gone. Master of resonance, breaker of silence.",
  "Zack Dustin":
    "Carved Echo — a soul etched into the world itself. His scars tell stories louder than words.",
  Lauren:
    "Lightbringer — a beacon in the darkest nights. Her courage ignites hope in the hearts of the weary.",
  Lizzie:
    "Shadowstrike — swift as the wind, silent as the night. A phantom in the battlefield, unseen yet ever-present.",
  Rachel:
    "Ironheart — unyielding and fierce. Her loyalty is a shield, her bravery a sword.",
  Keith:
    "Stonewall — steadfast as the mountains. A bulwark against chaos, his resolve is unbreakable.",
  Sandra:
    "Silver Sage — wisdom flows through her veins. A just leader, her strength lies in her fairness.",
  Shadow:
    "Phantom Veil — a mystery wrapped in enigma. Elusive and silent, a shadow among shadows.",
  default:
    "A legend in the making. Their story is still being forged in fire and thunder.",
};

// ✅ word • word • word (per character)
const WORD_LINES = {
  Taylor: "Resolve • Radiance • Command",
  Adin: "Honor • Strength • Earth",
  Zack: "Scar • Echo • Endure",
  Justin: "Resonance • Voice • Memory",
  Lauren: "Courage • Heart • Light",
  Lizzie: "Swift • Silent • Deadly",
  Rachel: "Fierce • Loyal • Brave",
  Keith: "Steadfast • Bold • Unyielding",
  Sandra: "Wise • Just • Strong",
  Shadow: "Mysterious • Elusive • Silent",
  default: "Legend • Active • Online",
};

// ✅ Accent color (per character)
const ACCENTS = {
  Taylor: "#FFD24A",
  Adin: "#43E0A8",
  Zack: "#FF4E6A",
  Justin: "#7A5CFF",
  default: "#00b3ff",
};

export default function CharacterDetailScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const member = route.params?.member;

  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);
  useEffect(() => {
    const sub = Dimensions.addEventListener("change", () => {
      setWindowWidth(Dimensions.get("window").width);
    });
    return () => sub?.remove();
  }, []);

  if (!member) {
    return (
      <View style={[styles.root, styles.center]}>
        <Text style={styles.errorText}>No legend found.</Text>
      </View>
    );
  }

  const isDesktop = windowWidth >= 768;

  const title = member.codename || member.name || "Unknown Legend";
  const accent =
    ACCENTS[member.name] || ACCENTS[member.codename] || ACCENTS.default;

  const subtitle =
    WORD_LINES[member.name] || WORD_LINES[member.codename] || WORD_LINES.default;

  // ✅ Use multiple images if provided, otherwise single image or placeholder
  const images =
    member.images && member.images.length
      ? member.images
      : [member.image || PLACEHOLDER];

  const description =
    member.description ||
    defaultDescriptions[member.name] ||
    defaultDescriptions.default;

  const renderArmorCard = (img, index) => (
    <View
      key={`${title}-${index}`}
      style={[
        styles.card(isDesktop, windowWidth),
        { borderColor: accent, shadowColor: accent },
      ]}
    >
      <Image
        source={normalizeImageSource(img)}
        style={styles.armorImage}
        resizeMode="cover"
      />
      <View style={styles.cardOverlay} />
      <Text style={styles.cardName}>© {title}; William Cummings</Text>
    </View>
  );

  return (
    <ImageBackground
      source={require("../../assets/BackGround/Bludbruh2.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.root} edges={["bottom", "left", "right"]}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* ✅ HEADER — same glass system as Cole/Tanner/James/Joseph */}
          <View style={styles.headerOuter}>
            <View style={styles.headerContainer}>
              <TouchableOpacity
                style={[styles.backButton, { borderColor: accent }]}
                onPress={() => navigation.goBack()}
                activeOpacity={0.85}
              >
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>

              <View
                style={[
                  styles.headerGlass,
                  { borderColor: accent, shadowColor: accent },
                ]}
              >
                <Text style={[styles.title, { textShadowColor: accent }]}>
                  {title}
                </Text>

                {/* ✅ EXACTLY: word • word • word */}
                <Text style={[styles.subtitle, { color: accent }]}>
                  {subtitle}
                </Text>
              </View>
            </View>
          </View>

          {/* ✅ ARMORY SECTION — same section wrapper */}
          <View
            style={[
              styles.section,
              { borderColor: `${accent}66`, shadowColor: accent },
            ]}
          >
            <Text style={[styles.sectionTitle, { textShadowColor: accent }]}>
              {title} Armory
            </Text>

            <View style={[styles.sectionDivider, { backgroundColor: accent }]} />

            <ScrollView
              horizontal
              contentContainerStyle={styles.imageScrollContainer}
              showsHorizontalScrollIndicator={false}
            >
              {images.map(renderArmorCard)}
            </ScrollView>
          </View>

          {/* ✅ ABOUT ME / LORE — preserved (you asked for this) */}
          <View
            style={[
              styles.aboutSection,
              { borderColor: accent, shadowColor: accent },
            ]}
          >
            <Text style={[styles.aboutHeader, { textShadowColor: accent }]}>
              About Me
            </Text>

            <Text style={[styles.aboutCodename, { textShadowColor: accent }]}>
              {member.codename || "Unknown Legend"}
            </Text>

            <Text style={styles.aboutName}>{member.name || "The Nameless"}</Text>

            <View style={[styles.aboutDivider, { backgroundColor: accent, shadowColor: accent }]} />

            <Text style={styles.aboutText}>{description}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { width: "100%", height: "100%" },
  root: { flex: 1, backgroundColor: "rgba(0,0,0,0.25)" },
  center: { justifyContent: "center", alignItems: "center" },
  errorText: { color: "white", fontSize: 18, fontWeight: "700" },

  scrollContainer: { paddingBottom: 30 },

  // HEADER — matches your glass system
  headerOuter: { paddingHorizontal: 16, paddingTop: 16 },
  headerContainer: { flexDirection: "row", alignItems: "center" },

  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(10,18,36,0.95)",
    borderWidth: 1,
    marginRight: 10,
  },
  backButtonText: { fontSize: 22, color: "#e5f3ff" },

  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(8,16,40,0.95)",
    borderWidth: 1,
    shadowOpacity: 0.45,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#e5f3ff",
    textAlign: "center",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    textAlign: "center",
    letterSpacing: 1,
    textTransform: "uppercase",
    fontWeight: "600",
  },

  // SECTION — same wrapper as Joseph/Cole
  section: {
    marginTop: 24,
    marginHorizontal: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "rgba(6,12,26,0.96)",
    borderWidth: 1,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e5f3ff",
    textAlign: "center",
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
  },

  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
    paddingTop: 4,
    alignItems: "center",
  },

  // CARD — same armor card system
  card: (isDesktop, w) => ({
    width: isDesktop ? w * 0.28 : SCREEN_WIDTH * 0.8,
    height: isDesktop ? SCREEN_HEIGHT * 0.7 : SCREEN_HEIGHT * 0.65,
    borderRadius: 22,
    overflow: "hidden",
    marginRight: 18,
    backgroundColor: "rgba(4,10,22,0.96)",
    borderWidth: 1,
    shadowOpacity: 0.75,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  }),
  armorImage: { width: "100%", height: "100%" },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  cardName: {
    position: "absolute",
    bottom: 10,
    left: 12,
    right: 12,
    fontSize: 12,
    color: "#e5f3ff",
    fontWeight: "600",
    textShadowColor: "#000",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },

  // ABOUT ME — restored
  aboutSection: {
    marginTop: 28,
    marginHorizontal: 12,
    marginBottom: 32,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: "rgba(6,12,26,0.97)",
    borderWidth: 1,
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: "#e5f3ff",
    textAlign: "center",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  aboutCodename: {
    fontSize: 22,
    color: "#e5f3ff",
    textAlign: "center",
    fontWeight: "900",
    textShadowRadius: 10,
  },
  aboutName: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
    marginTop: 6,
    fontStyle: "italic",
    opacity: 0.95,
  },
  aboutDivider: {
    height: 2,
    marginVertical: 14,
    borderRadius: 999,
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  aboutText: {
    fontSize: 14,
    color: "#dde8ff",
    lineHeight: 20,
    textAlign: "left",
  },
});
