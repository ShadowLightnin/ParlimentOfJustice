// screens/Forge/ForgeCharacterDetail.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const PLACEHOLDER = require("../../assets/Armor/PlaceHolder.jpg");

// ✅ Per-member words (word • word • word)
const WORD_LINES = {
  Glen: "Legacy • Discipline • Steel",
  Ted: "Honor • Loyal • Steady",
  Marisela: "Order • Heart • Power",
  Beau: "Strength • Calm • Lift",
  Taylor: "Spark • Speed • Fearless",
  Angie: "Warmth • Joy • Family",
  Brad: "Focus • Drive • Finish",
  Camren: "Brotherhood • Grit • Rise",
  Shailey: "Work • Grace • Resolve",
  Kaitlyn: "Calm • Precision • Craft",
  Emma: "Force • Will • Unbroken",
  Mila: "Energy • Humor • Fire",
  Karrie: "Reliable • Anchor • True",
  Kazia: "Agile • Sharp • Steel",
  Gary: "Energy • Bold • Go",
  Trevor: "Molten • Master • Gold",
  Kristin: "Fast • Efficient • Ahead",
  Joe: "Pillar • Strong • Steady",
  Jim: "Fire • Drive • Relentless",
  Mike: "Tough • Dependable • Backbone",
  default: "Forge • Endure • Build",
};

// ✅ Per-member accent colors
const ACCENTS = {
  Glen: "#FFAE42",
  Ted: "#FFD24A",
  Marisela: "#FF6BC1",
  Beau: "#43E0A8",
  Taylor: "#FFE86B",
  Angie: "#FF7A7A",
  Brad: "#62A7FF",
  Camren: "#00E5FF",
  Shailey: "#B38CFF",
  Kaitlyn: "#7CFFB2",
  Emma: "#FF4E6A",
  Mila: "#FFB347",
  Karrie: "#7A5CFF",
  Kazia: "#C8FF5A",
  Gary: "#FF8A4D",
  Trevor: "#FF6B35",
  Kristin: "#55D6FF",
  Joe: "#C9D6FF",
  Jim: "#FF4E4E",
  Mike: "#62A7FF",
  default: "#FF6B35",
};

// 🔹 Normalize any “image-like” value into a valid RN Image `source`
const normalizeImageSource = (img) => {
  if (!img) return PLACEHOLDER;

  // local require(...)
  if (typeof img === "number") return img;

  if (typeof img === "object" && img !== null) {
    if (img.source) return normalizeImageSource(img.source);

    if (img.uri != null) {
      if (typeof img.uri === "number") return img.uri; // require stored in uri
      if (typeof img.uri === "string") return { uri: img.uri };
    }
  }

  if (typeof img === "string") return { uri: img };

  return PLACEHOLDER;
};

export default function ForgeCharacterDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { member } = route.params || {};

  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);
  const isDesktop = windowWidth >= 768;

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

  const title = member.codename || member.name || "Forge Member";

  const accent =
    ACCENTS[member.name] || ACCENTS[member.codename] || ACCENTS.default;

  const words =
    WORD_LINES[member.name] || WORD_LINES[member.codename] || WORD_LINES.default;

  // ✅ KEEP your ForgeMembers format:
  // images: [{ uri: require(...), name: "...", clickable: true }]
  const copyrightText = member?.codename
    ? `© ${member.codename}; William Cummings`
    : "© William Cummings";

  let images;
  if (member?.images?.length > 0) {
    images = member.images.map((img) => ({
      source: normalizeImageSource(img?.uri ?? img),
      name: img?.name || copyrightText,
      clickable: img?.clickable ?? true,
    }));
  } else {
    images = [
      {
        source: normalizeImageSource(member?.image || PLACEHOLDER),
        name: copyrightText,
        clickable: true,
      },
    ];
  }

  const description =
    (member.description && String(member.description).trim()) ||
    "A soul forged in fire, grit, and loyalty — a living piece of the Forge.";

  const renderArmorCard = (img, index) => (
    <View
      key={`${title}-${index}`}
      style={[
        styles.card(isDesktop, windowWidth),
        { borderColor: accent, shadowColor: accent },
      ]}
    >
      <Image
        source={normalizeImageSource(img.source)}
        style={styles.armorImage}
        resizeMode="cover"
      />
      <View style={styles.cardOverlay} />
      {img?.name ? <Text style={styles.cardName}>{img.name}</Text> : null}
    </View>
  );

  return (
    <ImageBackground
      // ✅ Use the same background system as your other “glassy” screens
      // If you want a Forge-specific background later, just change this one line.
      source={require("../../assets/BackGround/Forge.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.root} edges={["bottom", "left", "right"]}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* ✅ HEADER — glassy like Cole/Joseph/Constollation */}
          <View style={styles.headerOuter}>
            <View style={styles.headerRow}>
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
                <Text style={[styles.subtitle, { color: accent }]}>{words}</Text>
              </View>
            </View>
          </View>

          {/* ✅ ARMORY / GALLERY — glass section */}
          <View
            style={[
              styles.section,
              { borderColor: `${accent}66`, shadowColor: accent },
            ]}
          >
            <Text style={[styles.sectionTitle, { textShadowColor: accent }]}>
              {title} Archive
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

          {/* ✅ ABOUT — preserved + glass */}
          <View
            style={[
              styles.aboutSection,
              { borderColor: accent, shadowColor: accent },
            ]}
          >
            <Text style={[styles.aboutHeader, { textShadowColor: accent }]}>
              About
            </Text>

            <Text style={[styles.aboutCodename, { textShadowColor: accent }]}>
              {member.codename || "Forgeborn"}
            </Text>

            <Text style={styles.aboutName}>{member.name || "Unknown"}</Text>

            <View
              style={[
                styles.aboutDivider,
                { backgroundColor: accent, shadowColor: accent },
              ]}
            />

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

  // HEADER
  headerOuter: { paddingHorizontal: 16, paddingTop: 16 },
  headerRow: { flexDirection: "row", alignItems: "center" },

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

  // SECTION
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

  // CARD
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

  // ABOUT
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
