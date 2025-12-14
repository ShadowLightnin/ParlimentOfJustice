// JusticeCharacterDetail.js
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
import JusticeDescription from "./JusticeDescription";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const PLACEHOLDER = require("../../assets/Armor/PlaceHolder.jpg");

// 🔹 Normalize anything into a valid RN Image `source`
const normalizeImageSource = (img) => {
  if (!img) return PLACEHOLDER;

  // local require(...) id
  if (typeof img === "number") return img;

  if (typeof img === "object" && img !== null) {
    if (img.source) return normalizeImageSource(img.source);

    if (img.uri != null) {
      if (typeof img.uri === "number") return img.uri;
      if (typeof img.uri === "string") return { uri: img.uri };
    }
  }

  if (typeof img === "string") return { uri: img };

  return PLACEHOLDER;
};

// Color Themes (kept)
const themes = {
  guardians: { bg: "#0a0a0a", accent: "#FFD700", text: "#FFFFFF" },
  elementals: { bg: "#000000", accent: "#FFFFFF", text: "#FFFFFF" },
  justiceLeague: { bg: "#001133", accent: "#00B3FF", text: "#E0F7FF" },
  theSeven: { bg: "#0D1B2A", accent: "#40C4FF", text: "#BBDEFB" },
  heroes: { bg: "#1C2526", accent: "#B8860B", text: "#FFF8DC" },
};

// Theme Detection (kept logic)
const getTheme = (member) => {
  if (!member?.name) return themes.guardians;
  const n = member.name.toLowerCase();

  if (
    [
      "ranger",
      "superman",
      "batman",
      "flash",
      "green lantern",
      "lloyd",
      "kai",
      "cole",
      "jay",
      "nya",
      "zane",
      "pixal",
      "rogue",
      "ronan",
      "apocolie",
      "ironman",
    ].some((k) => n.includes(k))
  ) {
    return themes.guardians;
  }
  if (
    ["elemental", "master of", "dragon", "oni", "void", "creation", "destruction"].some((k) =>
      n.includes(k)
    )
  ) {
    return themes.elementals;
  }
  if (["starman", "dragoknight", "flare", "vindra"].some((k) => n.includes(k))) {
    return themes.justiceLeague;
  }
  if (n.startsWith("the ")) {
    return themes.theSeven;
  }
  return themes.heroes;
};

// ✅ Supports string OR { about, accent, words }
const getMeta = (member, theme) => {
  const keyA = member?.name;
  const keyB = member?.codename;

  const raw =
    (keyA && JusticeDescription?.[keyA]) ||
    (keyB && JusticeDescription?.[keyB]) ||
    JusticeDescription?.default;

  // Old style: string
  if (typeof raw === "string") {
    return {
      about: raw.trim(),
      // words: "Justice • Valor • Duty",
      accent: theme?.accent || "#00b3ff",
    };
  }

  // New style: object
  return {
    about:
      (raw?.about ||
        member?.description ||
        JusticeDescription?.default?.about ||
        "A legendary protector whose deeds echo through time and realm. Their power stands eternal.").toString().trim(),
    words: raw?.words || JusticeDescription?.default?.words || "Justice • Valor • Duty",
    accent: raw?.accent || JusticeDescription?.default?.accent || theme?.accent || "#00b3ff",
  };
};

export default function JusticeCharacterDetail() {
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

  const theme = getTheme(member);
  const title = member.codename || member.name || "Unknown Guardian";
  const { about, words, accent } = getMeta(member, theme);

  // ✅ Copyright text (per character)
  const characterName = member?.name || member?.codename || "Unknown Guardian";
  const copyrightText = `© ${characterName}; William Cummings`;

  // ✅ Preserve your image precedence:
  // member.images → member.image → placeholder
  const images =
    member?.images && member.images.length
      ? member.images.map((img) => ({
          source: normalizeImageSource(img?.uri ?? img),
          name: img?.name || copyrightText,
          clickable: img?.clickable ?? true,
        }))
      : [
          {
            source: normalizeImageSource(member?.image || PLACEHOLDER),
            name: copyrightText,
            clickable: true,
          },
        ];

  const renderArmorCard = (img, index) => (
    <View
      key={`${title}-${index}`}
      style={[
        styles.card(isDesktop, windowWidth),
        { borderColor: accent, shadowColor: accent },
      ]}
    >
      <Image source={normalizeImageSource(img.source)} style={styles.armorImage} resizeMode="cover" />
      <View style={styles.cardOverlay} />
      {img?.name ? <Text style={styles.cardName}>{String(img.name)}</Text> : null}
    </View>
  );

  return (
    <ImageBackground
      // Reuse a known background you already use elsewhere (safe)
      source={require("../../assets/BackGround/Justice.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={[styles.root, { backgroundColor: "rgba(0,0,0,0.25)" }]} edges={["bottom", "left", "right"]}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* ✅ GLASS HEADER */}
          <View style={styles.headerOuter}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                style={[styles.backButton, { borderColor: accent }]}
                onPress={() => navigation.goBack()}
                activeOpacity={0.85}
              >
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>

              <View style={[styles.headerGlass, { borderColor: accent, shadowColor: accent }]}>
                <Text style={[styles.title, { textShadowColor: accent }]}>{title}</Text>
                <Text style={[styles.subtitle, { color: accent }]}>{words}</Text>
              </View>
            </View>
          </View>

          {/* ✅ GALLERY SECTION */}
          <View style={[styles.section, { borderColor: `${accent}66`, shadowColor: accent }]}>
            <Text style={[styles.sectionTitle, { textShadowColor: accent }]}>{title} Archive</Text>
            <View style={[styles.sectionDivider, { backgroundColor: accent }]} />

            <ScrollView
              horizontal
              contentContainerStyle={styles.imageScrollContainer}
              showsHorizontalScrollIndicator={false}
            >
              {images.map(renderArmorCard)}
            </ScrollView>
          </View>

          {/* ✅ ABOUT SECTION */}
          <View style={[styles.aboutSection, { borderColor: accent, shadowColor: accent }]}>
            <Text style={[styles.aboutHeader, { textShadowColor: accent }]}>About</Text>

            <Text style={[styles.aboutCodename, { textShadowColor: accent }]}>
              {member.codename || "Legendary Force"}
            </Text>

            <Text style={styles.aboutName}>{member.name || "Eternal Protector"}</Text>

            {member?.team ? (
              <Text style={[styles.aboutCategory, { color: accent }]}>{String(member.team)}</Text>
            ) : null}

            <View style={[styles.aboutDivider, { backgroundColor: accent, shadowColor: accent }]} />
            <Text style={[styles.aboutText, { color: theme.text }]}>{about}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { width: "100%", height: "100%" },
  root: { flex: 1 },
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
  cardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.25)" },
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
  aboutCategory: {
    marginTop: 10,
    textAlign: "center",
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    fontSize: 12,
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
    lineHeight: 20,
    textAlign: "left",
  },
});
