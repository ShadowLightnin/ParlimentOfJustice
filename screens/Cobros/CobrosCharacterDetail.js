// screens/Cobros/CobrosCharacterDetail.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Video, Audio } from "expo-av";
import descriptions from "./CobrosDescription";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const PLACEHOLDER = require("../../assets/Armor/PlaceHolder.jpg");

// ✅ Works with: require(...), "url", {uri}, {source}, {source:{uri}}
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

const getMeta = (member) => {
  const name = member?.name;
  const raw = (name && descriptions?.[name]) || descriptions?.default;

  if (typeof raw === "string") {
    return { about: raw.trim(), color: "#00b3ff", points: [] };
  }

  return {
    about:
      (raw?.about ?? raw?.text ?? member?.description ?? "No description available.")
        .toString()
        .trim(),
    color: raw?.color || member?.color || "#00b3ff",
    points: Array.isArray(raw?.points) ? raw.points : [],
  };
};

const joinPoints = (points) =>
  Array.isArray(points) && points.length ? points.filter(Boolean).join(" • ") : "";

const CobrosCharacterDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { member } = route.params || {};

  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const audioRef = useRef(null);

  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);
  const isDesktop = windowWidth >= 768;
  const cardWidth = isDesktop ? windowWidth * 0.3 : SCREEN_WIDTH * 0.9;

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", () => {
      setWindowWidth(Dimensions.get("window").width);
    });
    return () => subscription?.remove();
  }, []);

  const meta = useMemo(() => getMeta(member), [member?.name]);
  const accent = meta?.color || "#00b3ff";
  const subtitle = joinPoints(meta?.points);

  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    }).catch(() => {});

    const loadAudio = async () => {
      if (member?.mediaUri && member?.mediaType === "audio" && !audioRef.current) {
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

  const stopMediaAndGoBack = async () => {
    try {
      if (audioRef.current) {
        await audioRef.current.pauseAsync();
        await audioRef.current.unloadAsync();
        audioRef.current = null;
      }
    } catch {}
    try {
      if (videoRef.current) await videoRef.current.pauseAsync();
    } catch {}
    setIsPlaying(false);
    navigation.goBack();
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
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>No Cobro found.</Text>
      </View>
    );
  }

  const copyrightText = member?.codename
    ? `© ${member.codename}; William Cummings`
    : "© William Cummings";

  // ✅ FIX: accept any images array shape
  const images = useMemo(() => {
    const raw = Array.isArray(member?.images) ? member.images : null;
    if (raw && raw.length) {
      return raw.map((img) => (typeof img === "object" && img !== null ? img : { source: img }));
    }
    return [{ source: member?.image || PLACEHOLDER }];
  }, [member?.images, member?.image]);

  const renderImageCard = (img, index) => {
    const src = normalizeImageSource(img?.source ?? img?.uri ?? img);

    return (
      <View
        key={`img-${index}`}
        style={[
          styles.card(isDesktop, windowWidth),
          { borderColor: accent, shadowColor: accent },
        ]}
      >
        <Image source={src} style={styles.armorImage} resizeMode="cover" />
        <View style={styles.cardOverlay} />
        <Text style={styles.cardName}>{copyrightText}</Text>
      </View>
    );
  };

  const renderMediaPlayer = () => {
    if (!member?.mediaUri) return null;

    const mediaStyle = {
      width: "100%",
      height: member.mediaType === "video" ? 200 : 70,
      borderRadius: 16,
      backgroundColor: "rgba(4,10,22,0.75)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.08)",
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
    };

    return (
      <View style={styles.mediaContainer}>
        {member.mediaType === "video" ? (
          <Video
            ref={videoRef}
            source={{ uri: member.mediaUri }}
            style={mediaStyle}
            resizeMode="cover"
            isLooping
            shouldPlay={isPlaying}
            onPlaybackStatusUpdate={(status) => setIsPlaying(!!status.isPlaying)}
          />
        ) : (
          <View style={mediaStyle}>
            <Text style={styles.mediaText}>
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
            <Text style={styles.buttonText}>{isPlaying ? "Pause" : "Play"}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={[styles.backButton, { borderColor: accent }]}
            onPress={stopMediaAndGoBack}
            activeOpacity={0.85}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={[styles.headerGlass, { borderColor: accent, shadowColor: accent }]}>
            <Text style={[styles.title, { textShadowColor: accent }]}>
              {member?.codename || "N/A"}
            </Text>

            {!!subtitle && (
              <Text style={[styles.subtitle, { color: accent }]}>{subtitle}</Text>
            )}
          </View>
        </View>

        {/* Armory */}
        <View style={[styles.section, { borderColor: `${accent}66`, shadowColor: accent }]}>
          <Text style={[styles.sectionTitle, { textShadowColor: accent }]}>
            {member?.codename || member?.name} Armory
          </Text>
          <View style={[styles.sectionDivider, { backgroundColor: accent }]} />

          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            snapToInterval={cardWidth + 20}
            decelerationRate="fast"
            contentOffset={{ x: (SCREEN_WIDTH - cardWidth) / 2 - 10, y: 0 }}
          >
            {images.map(renderImageCard)}
          </ScrollView>
        </View>

        {/* About */}
        <View style={[styles.aboutSection, { borderColor: accent, shadowColor: accent }]}>
          <Text style={[styles.aboutHeader, { textShadowColor: accent }]}>About Me</Text>
          <Text style={[styles.aboutCodename, { textShadowColor: accent }]}>
            {member?.codename || "Unknown"}
          </Text>
          <Text style={styles.aboutName}>{member?.name || "The Nameless"}</Text>

          <View style={[styles.aboutDivider, { backgroundColor: accent, shadowColor: accent }]} />
          <Text style={styles.aboutText}>{meta?.about || "No description available."}</Text>
        </View>

        {renderMediaPlayer()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a" },
  center: { justifyContent: "center", alignItems: "center" },
  errorText: { color: "white", fontSize: 18, fontWeight: "700" },

  scrollContainer: { paddingBottom: 30 },

  // Header (glassy)
  headerContainer: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 16 },
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

  // Section wrapper (glassy)
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

  imageScrollContainer: { flexDirection: "row", paddingHorizontal: 8, paddingTop: 4, alignItems: "center" },

  // Card (glassy)
  card: (isDesktop, w) => ({
    width: isDesktop ? w * 0.3 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.7,
    borderRadius: 22,
    overflow: "hidden",
    marginRight: 20,
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

  // About (glassy)
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
  aboutCodename: { fontSize: 22, color: "#e5f3ff", textAlign: "center", fontWeight: "900", textShadowRadius: 10 },
  aboutName: { fontSize: 16, color: "#ffffff", textAlign: "center", marginTop: 6, fontStyle: "italic", opacity: 0.95 },
  aboutDivider: { height: 2, marginVertical: 14, borderRadius: 999, shadowOpacity: 1, shadowRadius: 10 },
  aboutText: { fontSize: 14, color: "#dde8ff", lineHeight: 20, textAlign: "left" },

  // Media
  mediaContainer: { marginTop: 10, marginBottom: 30, width: "90%", alignSelf: "center", alignItems: "center" },
  mediaText: { color: "#e5f3ff", fontSize: 13, textAlign: "center", opacity: 0.9 },
  playButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 999, marginTop: 10 },
  buttonText: { color: "#061a2a", fontWeight: "900", letterSpacing: 1, textTransform: "uppercase", fontSize: 12 },
});

export default CobrosCharacterDetail;
