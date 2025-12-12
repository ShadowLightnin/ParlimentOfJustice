import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { Video, Audio } from "expo-av";
import descriptions from "./OlympiansDescription";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// 🔹 Fallback placeholder image
const PLACEHOLDER = require("../../assets/Armor/PlaceHolder.jpg");

// ✅ Normalize ANY kind of image value into something <Image> understands
// Handles: require(...), "https://...", {uri:"..."}, {source: require(...)}, {source:{uri:"..."}}
const normalizeImageSource = (img) => {
  if (!img) return PLACEHOLDER;

  // If it's already a local require id
  if (typeof img === "number") return img;

  // If object wrappers exist
  if (typeof img === "object" && img !== null) {
    // { source: ... }
    if (img.source) return normalizeImageSource(img.source);

    // { uri: ... }
    if (img.uri != null) {
      if (typeof img.uri === "number") return img.uri;
      if (typeof img.uri === "string") return { uri: img.uri };
    }
  }

  // Plain string URL
  if (typeof img === "string") return { uri: img };

  return PLACEHOLDER;
};

// ✅ Read meta from OlympiansDescription.js
// Supports BOTH formats:
// 1) old: descriptions[name] = "string..."
// 2) new: descriptions[name] = { about, color, points: ["a","b","c"] }
const getMeta = (member) => {
  const name = member?.name;
  const raw =
    (name && descriptions?.[name]) ||
    descriptions?.default ||
    descriptions?.__default;

  if (typeof raw === "string") {
    return {
      about: raw.trim(),
      color: "#00b3ff",
      points: [],
    };
  }

  const about = (
    raw?.about ??
    raw?.text ??
    member?.description ??
    "No description available."
  )
    .toString()
    .trim();

  const color = raw?.color || member?.color || "#00b3ff";

  const points = Array.isArray(raw?.points)
    ? raw.points
    : Array.isArray(raw?.words)
    ? raw.words
    : [];

  return { about, color, points };
};

const joinPoints = (points) =>
  Array.isArray(points) && points.length
    ? points.filter(Boolean).join(" • ")
    : "";

export default function OlympiansCharacterDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  const member = route.params?.member;

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

  // ✅ meta from descriptions file
  const meta = useMemo(() => getMeta(member), [member?.name]);
  const accent = meta?.color || "#00b3ff";
  const subtitle = joinPoints(meta?.points);
  const aboutText = meta?.about || "No description available.";

  // ✅ Setup audio mode + preload audio if needed
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch(() => {});

    const loadAudio = async () => {
      if (
        member?.mediaUri &&
        member?.mediaType === "audio" &&
        !audioRef.current
      ) {
        try {
          const sound = new Audio.Sound();
          await sound.loadAsync({ uri: member.mediaUri });
          audioRef.current = sound;
        } catch {}
      }
    };

    loadAudio();

    return () => {
      if (audioRef.current) {
        audioRef.current.unloadAsync().catch(() => {});
        audioRef.current = null;
      }
    };
  }, [member?.mediaUri, member?.mediaType]);

  const stopMedia = async () => {
    try {
      if (audioRef.current) {
        await audioRef.current.pauseAsync();
        await audioRef.current.unloadAsync();
        audioRef.current = null;
      }
    } catch {}
    try {
      if (videoRef.current) {
        await videoRef.current.pauseAsync();
      }
    } catch {}
    setIsPlaying(false);
  };

  const togglePlayPause = async () => {
    if (member?.mediaType === "video" && videoRef.current) {
      try {
        if (isPlaying) await videoRef.current.pauseAsync();
        else await videoRef.current.playAsync();
        setIsPlaying(!isPlaying);
      } catch {}
    } else if (member?.mediaType === "audio" && audioRef.current) {
      try {
        const status = await audioRef.current.getStatusAsync();
        if (!status?.isLoaded) return;
        if (isPlaying) await audioRef.current.pauseAsync();
        else await audioRef.current.playAsync();
        setIsPlaying(!isPlaying);
      } catch {}
    }
  };

  if (!member) {
    return (
      <View style={[styles.root, styles.center]}>
        <Text style={styles.errorText}>No Olympian found.</Text>
      </View>
    );
  }

  const title = member.codename || member.name || "Unknown Olympian";

  // ✅ FIXED: normalize image list to always render correctly
  // Supports arrays of:
  // - require(...)
  // - "url"
  // - { uri }
  // - { source }
  // - { source, clickable, name } (your custom objects)
  const images = useMemo(() => {
    const raw = Array.isArray(member?.images) ? member.images : null;

    if (raw && raw.length) {
      return raw.map((img) => {
        // If you already stored objects, keep them.
        if (typeof img === "object" && img !== null) return img;
        // Otherwise wrap primitives
        return { source: img };
      });
    }

    // single fallback
    return [{ source: member?.image || PLACEHOLDER }];
  }, [member?.images, member?.image]);

  const copyrightText = member?.codename
    ? `© ${member.codename}; William Cummings`
    : "© William Cummings";

  const renderArmorCard = (img, index) => {
    // ✅ THE ACTUAL FIX: accept any image shape
    const source = normalizeImageSource(img?.source ?? img?.uri ?? img);

    return (
      <View
        key={`${title}-${index}`}
        style={[
          styles.card(isDesktop, windowWidth),
          { borderColor: accent, shadowColor: accent },
        ]}
      >
        <Image
          source={source}
          style={styles.armorImage}
          resizeMode="cover"
          onError={(e) => {
            console.log("Image failed:", e?.nativeEvent?.error, img);
          }}
        />
        <View style={styles.cardOverlay} />
        <Text style={styles.cardName}>{copyrightText}</Text>
      </View>
    );
  };

  const renderMediaSection = () => {
    if (!member?.mediaUri) return null;

    return (
      <View
        style={[
          styles.section,
          { borderColor: `${accent}66`, shadowColor: accent },
        ]}
      >
        <Text style={[styles.sectionTitle, { textShadowColor: accent }]}>
          Media
        </Text>
        <View style={[styles.sectionDivider, { backgroundColor: accent }]} />

        <View style={styles.mediaBox}>
          {member.mediaType === "video" ? (
            <Video
              ref={videoRef}
              source={{ uri: member.mediaUri }}
              style={styles.video}
              resizeMode="cover"
              isLooping
              shouldPlay={isPlaying}
              onPlaybackStatusUpdate={(status) =>
                setIsPlaying(!!status.isPlaying)
              }
            />
          ) : (
            <View style={styles.audioStub}>
              <Text style={styles.mediaLabel}>
                {member.mediaType === "audio" ? "Audio" : "File"}:{" "}
                {member.mediaUri.split("/").pop()}
              </Text>
            </View>
          )}

          {(member.mediaType === "video" || member.mediaType === "audio") && (
            <TouchableOpacity
              style={[styles.playButton, { backgroundColor: accent }]}
              onPress={togglePlayPause}
              activeOpacity={0.85}
            >
              <Text style={styles.playButtonText}>
                {isPlaying ? "Pause" : "Play"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require("../../assets/BackGround/Olympians.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.root} edges={["bottom", "left", "right"]}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* ✅ GLASS HEADER */}
          <View style={styles.headerOuter}>
            <View style={styles.headerContainer}>
              <TouchableOpacity
                style={[styles.backButton, { borderColor: accent }]}
                onPress={async () => {
                  await stopMedia();
                  navigation.goBack();
                }}
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

                {!!subtitle && (
                  <Text style={[styles.subtitle, { color: accent }]}>
                    {subtitle}
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* ✅ ARMORY SECTION */}
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

          {/* ✅ ABOUT SECTION */}
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
              {member.codename || "Unknown Olympian"}
            </Text>

            <Text style={styles.aboutName}>{member.name || "The Nameless"}</Text>

            <View
              style={[
                styles.aboutDivider,
                { backgroundColor: accent, shadowColor: accent },
              ]}
            />

            <Text style={styles.aboutText}>{aboutText}</Text>
          </View>

          {/* ✅ MEDIA */}
          {renderMediaSection()}
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

  // HEADER — glass system
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

  // SECTION — glass wrapper
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

  // CARD — armor cards
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

  // ABOUT — glass system
  aboutSection: {
    marginTop: 28,
    marginHorizontal: 12,
    marginBottom: 24,
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

  // MEDIA — glassy
  mediaBox: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(4,10,22,0.75)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  video: { width: "100%", height: 200, backgroundColor: "#000" },
  audioStub: {
    width: "100%",
    height: 70,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingHorizontal: 12,
  },
  mediaLabel: {
    color: "#e5f3ff",
    fontSize: 13,
    textAlign: "center",
    opacity: 0.9,
  },
  playButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "center",
    borderRadius: 999,
    marginVertical: 12,
  },
  playButtonText: {
    color: "#061a2a",
    fontWeight: "900",
    letterSpacing: 1,
    textTransform: "uppercase",
    fontSize: 12,
  },
});
