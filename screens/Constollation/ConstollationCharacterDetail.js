// screens/Constollation/ConstollationCharacterDetail.js
import React, { useEffect, useRef, useState } from "react";
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
import { Video, Audio } from "expo-av";

import constollationImages from "./ConstollationImages";
import descriptions from "./ConstollationDescription";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const PLACEHOLDER = require("../../assets/Armor/PlaceHolder.jpg");

// 🔹 Normalize anything into a valid RN Image `source`
const normalizeImageSource = (img) => {
  if (!img) return PLACEHOLDER;

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

// ✅ Supports string OR { about, accent, words }
const getMeta = (member) => {
  const keyA = member?.name;
  const keyB = member?.codename;

  const raw =
    (keyA && descriptions[keyA]) ||
    (keyB && descriptions[keyB]) ||
    descriptions.default;

  // Old style: string
  if (typeof raw === "string") {
    return {
      about: raw.trim(),
      words: "Guide • Teach • Inspire",
      accent: "#00b3ff",
    };
  }

  // New style: object
  return {
    about:
      (raw?.about ||
        member?.description ||
        descriptions?.default?.about ||
        "No description available.").toString().trim(),
    words: raw?.words || descriptions?.default?.words || "Guide • Teach • Inspire",
    accent: raw?.accent || descriptions?.default?.accent || "#00b3ff",
  };
};

export default function ConstollationCharacterDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const { member } = route.params || {};

  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);
  const isDesktop = windowWidth >= 768;

  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const sub = Dimensions.addEventListener("change", () => {
      setWindowWidth(Dimensions.get("window").width);
    });
    return () => sub?.remove();
  }, []);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch(() => {});

    return () => {
      if (audioRef.current) audioRef.current.unloadAsync().catch(() => {});
      if (videoRef.current) videoRef.current.pauseAsync().catch(() => {});
    };
  }, []);

  const togglePlayPause = async () => {
    if (member?.mediaType === "video" && videoRef.current) {
      try {
        if (isPlaying) await videoRef.current.pauseAsync();
        else await videoRef.current.playAsync();
        setIsPlaying(!isPlaying);
      } catch (e) {
        console.error("Video toggle error:", e?.message || e);
      }
      return;
    }

    if (member?.mediaType === "audio" && audioRef.current) {
      try {
        const status = await audioRef.current.getStatusAsync();
        if (!status.isLoaded) return;

        if (isPlaying) await audioRef.current.pauseAsync();
        else await audioRef.current.playAsync();

        setIsPlaying(!isPlaying);
      } catch (e) {
        console.error("Audio toggle error:", e?.message || e);
      }
    }
  };

  if (!member) {
    return (
      <View style={[styles.root, styles.center]}>
        <Text style={styles.errorText}>No legend found.</Text>
      </View>
    );
  }

  const title = member.codename || member.name || "Constollation Star";
  const { about, words, accent } = getMeta(member);

  // ✅ Correct copyright text
  const copyrightText = member?.codename
    ? `© ${member.codename}; William Cummings`
    : "© William Cummings";

  // ✅ Preserve your image precedence:
  // member.images → constollationImages[member.name].images → member.image → placeholder
  let images;
  if (member?.images?.length > 0) {
    images = member.images.map((img) => ({
      source: normalizeImageSource(img?.uri ?? img),
      name: copyrightText,
      clickable: img?.clickable ?? true,
    }));
  } else if (constollationImages?.[member?.name]?.images?.length > 0) {
    images = constollationImages[member.name].images.map((img) => ({
      source: normalizeImageSource(img?.uri ?? img),
      name: copyrightText,
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

  const renderMediaPlayer = () => {
    if (!member?.mediaUri) return null;

    const mediaBox = {
      width: "100%",
      height: member.mediaType === "video" ? 220 : 56,
      borderRadius: 14,
      backgroundColor: "rgba(4,10,22,0.9)",
      borderWidth: 1,
      borderColor: `${accent}66`,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    };

    return (
      <View style={[styles.mediaWrap, { borderColor: `${accent}66`, shadowColor: accent }]}>
        <Text style={[styles.sectionTitle, { textShadowColor: accent }]}>Media</Text>
        <View style={[styles.sectionDivider, { backgroundColor: accent }]} />

        {member.mediaType === "video" ? (
          <Video
            ref={videoRef}
            source={{ uri: member.mediaUri }}
            style={mediaBox}
            resizeMode="cover"
            isLooping
            shouldPlay={isPlaying}
            onPlaybackStatusUpdate={(status) => setIsPlaying(!!status.isPlaying)}
          />
        ) : (
          <View style={mediaBox}>
            <Text style={styles.mediaText}>
              {member.mediaType === "audio" ? "Audio" : "File"}:{" "}
              {String(member.mediaUri).split("/").pop()}
            </Text>
          </View>
        )}

        {(member.mediaType === "video" || member.mediaType === "audio") && (
          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: accent }]}
            onPress={togglePlayPause}
            activeOpacity={0.85}
          >
            <Text style={styles.playButtonText}>{isPlaying ? "Pause" : "Play"}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <ImageBackground
      source={require("../../assets/BackGround/Legionaires2.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.root} edges={["bottom", "left", "right"]}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* ✅ HEADER — glassy like Cole/Joseph */}
          <View style={styles.headerOuter}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                style={[styles.backButton, { borderColor: accent }]}
                onPress={async () => {
                  try {
                    if (audioRef.current) {
                      await audioRef.current.pauseAsync();
                      await audioRef.current.unloadAsync();
                      audioRef.current = null;
                    }
                    if (videoRef.current) await videoRef.current.pauseAsync();
                  } catch {}
                  setIsPlaying(false);
                  navigation.goBack();
                }}
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

          {/* ✅ ARMORY */}
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

          {/* ✅ ABOUT ME */}
          <View style={[styles.aboutSection, { borderColor: accent, shadowColor: accent }]}>
            <Text style={[styles.aboutHeader, { textShadowColor: accent }]}>About</Text>

            <Text style={[styles.aboutCodename, { textShadowColor: accent }]}>
              {member.codename || "Eternal Light"}
            </Text>

            <Text style={styles.aboutName}>{member.name || "A Soul of the Constollation"}</Text>

            {member?.category ? (
              <Text style={[styles.aboutCategory, { color: accent }]}>{member.category}</Text>
            ) : null}

            <View style={[styles.aboutDivider, { backgroundColor: accent, shadowColor: accent }]} />

            <Text style={styles.aboutText}>{about}</Text>
          </View>

          {/* ✅ MEDIA */}
          {renderMediaPlayer()}
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
    marginBottom: 18,
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
    color: "#dde8ff",
    lineHeight: 20,
    textAlign: "left",
  },

  // MEDIA
  mediaWrap: {
    marginTop: 18,
    marginHorizontal: 12,
    marginBottom: 32,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "rgba(6,12,26,0.96)",
    borderWidth: 1,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
    alignItems: "center",
  },
  mediaText: { color: "#e5f3ff", fontSize: 12, opacity: 0.9 },
  playButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
  },
  playButtonText: { color: "#06101a", fontWeight: "900", letterSpacing: 0.6 },
});
