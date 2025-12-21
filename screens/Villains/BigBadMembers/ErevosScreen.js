import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Audio } from "expo-av";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// 🎨 Erevos palette — royal dark purple + cosmic deep blue + gunmetal + dark red
const COLORS = {
  void: "rgba(0, 0, 0, 0.86)",
  gunmetal: "rgba(18, 18, 22, 0.96)",
  gunmetalSoft: "rgba(26, 26, 34, 0.92)",
  cosmicBlue: "rgba(10, 16, 36, 0.92)",
  royalPurple: "#3B1C5A",
  royalPurpleEdge: "rgba(59, 28, 90, 0.88)",
  red: "#5B0000",
  redEdge: "rgba(91, 0, 0, 0.85)",
  redSoft: "rgba(91, 0, 0, 0.40)",
  text: "#F7F7F7",
  textSoft: "rgba(245, 245, 245, 0.82)",
};

// 🎧 Tracks (swap to your actual Erevos audio later)
const TRACKS = [
  {
    id: "erevos_main",
    label: "Project Ascendancy",
    source: require("../../../assets/audio/sableEvilish.m4a"),
  },
  {
    id: "erevos_alt",
    label: "The Enlightened",
    source: require("../../../assets/audio/sableEvilish.m4a"),
  },
];

// -------------------------
// ✅ PUBLIC (surface) IMAGES
// -------------------------
const PUBLIC_MAIN = [
  {
    name: "Erevos the Ascendancy",
    image: require("../../../assets/Villains/Erevos.jpg"),
    clickable: true,
  },
];

const PUBLIC_SECONDARY = [
  { name: "Erevan", image: require("../../../assets/Villains/Erevan.jpg"), clickable: true },
  { name: "Erevos the Eternal", image: require("../../../assets/Villains/GreatErevos.jpg"), clickable: true },
  { name: "Erevos", image: require("../../../assets/Villains/Erevos2.jpg"), clickable: true },
];

// -------------------------
// 🔒 TRUE EREVOS IMAGES
// -------------------------
const TRUE_MAIN = [
  {
    name: "Erevos's Truth",
    image: require("../../../assets/Villains/ErevosTrue.jpg"),
    clickable: true,
  },
];

const TRUE_SECONDARY = [
  { name: "Erovan", image: require("../../../assets/Villains/ErevosErevan.jpg"), clickable: true },
  { name: "Death", image: require("../../../assets/Villains/ErevanDeath.jpg"), clickable: true },
  { name: "Erevos Born again", image: require("../../../assets/Villains/ErevosReborn.jpg"), clickable: true },
  { name: "Atlantia", image: require("../../../assets/Villains/ErevosAtlantia.jpg"), clickable: true },
  { name: "Pact", image: require("../../../assets/Villains/ErevosPact.jpg"), clickable: true },
  { name: "Labyrinth", image: require("../../../assets/Villains/ErevosLabyrinth.jpg"), clickable: true },
  { name: "The Flood", image: require("../../../assets/Villains/ErevosTheFlood.jpg"), clickable: true },
  { name: "Harness Lacose", image: require("../../../assets/Villains/ErevosHarness.jpg"), clickable: true },
  { name: "Teaching Ophir", image: require("../../../assets/Villains/ErevosOphir.jpg"), clickable: true },
  { name: "Mediavel", image: require("../../../assets/Villains/ErevosMediavel.jpg"), clickable: true },
];

const ErevosScreen = () => {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);
  const isDesktop = windowWidth >= 768;

  // ✅ TRUTH TOGGLE
  const [truthMode, setTruthMode] = useState(false);

  // ✅ ABOUT COLLAPSE + GATE
  const [aboutOpen, setAboutOpen] = useState(false);
  const [aboutHasBeenOpened, setAboutHasBeenOpened] = useState(false);

  // 🎧 Audio state
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

  const safeTracks = Array.isArray(TRACKS) && TRACKS.length ? TRACKS : [];
  const safeIndex = safeTracks.length ? trackIndex % safeTracks.length : 0;
  const currentTrack = safeTracks.length ? safeTracks[safeIndex] : null;

  // ✅ Responsive listener
  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", () => {
      setWindowWidth(Dimensions.get("window").width);
    });
    return () => subscription?.remove();
  }, []);

  // ───────── AUDIO HELPERS ─────────
  const unloadSound = useCallback(async () => {
    if (sound) {
      try { await sound.stopAsync(); } catch {}
      try { await sound.unloadAsync(); } catch {}
      setSound(null);
    }
  }, [sound]);

  const loadAndPlayTrack = useCallback(
    async (index) => {
      if (!safeTracks.length) return;
      await unloadSound();
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          safeTracks[index].source,
          { isLooping: true, volume: 0.85 }
        );
        setSound(newSound);
        await newSound.playAsync();
        setIsPlaying(true);
      } catch (e) {
        console.error("Failed to play Erevos track", e);
        setIsPlaying(false);
      }
    },
    [unloadSound, safeTracks]
  );

  const playTheme = async () => {
    if (!safeTracks.length) return;
    if (sound) {
      try {
        await sound.playAsync();
        setIsPlaying(true);
      } catch (e) {
        console.error("Play error", e);
      }
    } else {
      await loadAndPlayTrack(safeIndex);
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
    if (!safeTracks.length) return;
    const nextIndex = (trackIndex + direction + safeTracks.length) % safeTracks.length;
    setTrackIndex(nextIndex);
    if (isPlaying) {
      await loadAndPlayTrack(nextIndex);
    } else {
      await unloadSound();
    }
  };

  // ✅ On leaving screen: stop audio AND relock truth + reset About gate (like your “relock on exit” request style)
  useFocusEffect(
    useCallback(() => {
      return () => {
        unloadSound();
        setIsPlaying(false);

        setTruthMode(false);

        // 🔒 relock gate on leaving this screen
        setAboutOpen(false);
        setAboutHasBeenOpened(false);
      };
    }, [unloadSound])
  );

  const handleBackPress = async () => {
    await unloadSound();
    setIsPlaying(false);

    setTruthMode(false);

    setAboutOpen(false);
    setAboutHasBeenOpened(false);

    navigation.goBack();
  };

  const handleOpenFile = () => {
    if (!aboutHasBeenOpened) {
      Alert.alert(
        "ACCESS LOCKED",
        "Review the 'About Me' dossier before opening the Omega–Black Origin File."
      );
      return;
    }
    navigation.navigate("ErevosFile");
  };

  // ✅ swap galleries by truth mode
  const mainCharacter = truthMode ? TRUE_MAIN : PUBLIC_MAIN;
  const secondaryCharacters = truthMode ? TRUE_SECONDARY : PUBLIC_SECONDARY;

  const legacyTitle = truthMode ? "Erevos Over the Eras" : "Erevos’s Legacy";
  const headerTitle = truthMode ? "True Erevos" : "Erevos";
  const headerSubtitle = truthMode
    ? "OMEGA–BLACK • Lacose Origin • Dormancy Authority"
    : "Immortal • Shadow Empire • Project Ascendancy";

  const toggleTruth = () => setTruthMode((v) => !v);

  const toggleAbout = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAboutOpen((v) => {
      const next = !v;
      if (next) setAboutHasBeenOpened(true); // ✅ unlock gate the first time it opens
      return next;
    });
  };

  // ───────── RENDER CARD ─────────
  const renderCharacterCard = (character, index, isSecondary = false) => (
    <TouchableOpacity
      key={`${character.name}-${index}-${isSecondary ? "sec" : "main"}-${truthMode ? "true" : "pub"}`}
      style={[
        styles.card(isDesktop, windowWidth, isSecondary),
        character.clickable ? styles.clickable : styles.notClickable,
      ]}
      onPress={() => character.clickable && console.log(`${character.name} clicked`)}
      disabled={!character.clickable}
      activeOpacity={0.9}
    >
      <Image source={character.image} style={styles.armorImage} />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>© {character.name || "Unknown"}; William Cummings</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../../../assets/BackGround/Enlightened.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* 🎧 MUSIC BAR */}
        <View style={styles.musicControls}>
          <TouchableOpacity style={styles.trackButton} onPress={() => cycleTrack(-1)}>
            <Text style={styles.trackButtonText}>⟵</Text>
          </TouchableOpacity>

          <View style={styles.trackInfoGlass}>
            <Text style={styles.trackLabel}>Track:</Text>
            <Text style={styles.trackTitle}>{currentTrack?.label || "No Track"}</Text>
          </View>

          <TouchableOpacity style={styles.trackButton} onPress={() => cycleTrack(1)}>
            <Text style={styles.trackButtonText}>⟶</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.musicButton, (isPlaying || !safeTracks.length) && styles.musicButtonDisabled]}
            onPress={playTheme}
            disabled={isPlaying || !safeTracks.length}
          >
            <Text style={styles.musicButtonText}>{isPlaying ? "Playing" : "Play"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.musicButtonSecondary, (!isPlaying || !safeTracks.length) && styles.musicButtonDisabled]}
            onPress={pauseTheme}
            disabled={!isPlaying || !safeTracks.length}
          >
            <Text style={styles.musicButtonTextSecondary}>Pause</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* HEADER */}
          <View style={styles.headerOuter}>
            <View style={styles.headerRow}>
              <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                <Text style={styles.backButtonText}>←</Text>
              </TouchableOpacity>

              <View style={styles.headerGlass}>
                <Text style={styles.title}>{headerTitle}</Text>
                <Text style={styles.subtitle}>{headerSubtitle}</Text>
              </View>

              {/* ✅ TRUTH BUTTON (on the header) */}
              <TouchableOpacity
                style={[styles.truthButton, truthMode && styles.truthButtonActive]}
                activeOpacity={0.9}
                onPress={toggleTruth}
              >
                <Text style={[styles.truthButtonText, truthMode && styles.truthButtonTextActive]}>
                  {truthMode ? "CONCEAL" : "REVEAL"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* MAIN GALLERY */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <View style={styles.sectionDivider} />
            <ScrollView horizontal contentContainerStyle={styles.imageScrollContainer} showsHorizontalScrollIndicator={false}>
              {mainCharacter.map((c, i) => renderCharacterCard(c, i, false))}
            </ScrollView>
          </View>

          {/* LEGACY / ERAS */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{legacyTitle}</Text>
            <View style={styles.sectionDivider} />
            <ScrollView horizontal contentContainerStyle={styles.imageScrollContainer} showsHorizontalScrollIndicator={false}>
              {secondaryCharacters.map((c, i) => renderCharacterCard(c, i, true))}
            </ScrollView>
          </View>

          {/* ✅ ABOUT (COLLAPSIBLE) */}
          <View style={styles.aboutSection}>
            <TouchableOpacity onPress={toggleAbout} activeOpacity={0.88} style={styles.aboutHeaderRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.aboutHeader}>About Me</Text>
                <Text style={styles.aboutHint}>
                  {aboutOpen ? "TAP TO COLLAPSE" : "TAP TO EXPAND"}
                  {aboutHasBeenOpened ? " • VERIFIED" : " • REQUIRED"}
                </Text>
              </View>

              <View style={styles.aboutBadge}>
                <Text style={styles.aboutBadgeText}>
                  {aboutOpen ? "OPEN" : "CLOSED"}
                </Text>
              </View>
            </TouchableOpacity>

            {aboutOpen ? (
              <View style={{ marginTop: 8 }}>
                {truthMode && (
                  <Text style={[styles.aboutText, { opacity: 0.85 }]}>
                    Clearance Shift Detected: OMEGA–BLACK VIEW ENABLED
                  </Text>
                )}

                {/* ⬇️ YOUR LORE BLOCK (UNCHANGED) ⬇️ */}
                <Text style={styles.aboutText}>The Parliament of Justice’s Big Bad</Text>

                <Text style={styles.aboutText}>
                  Long before empires had names, he was a mortal warlord called{" "}
                  <Text style={{ fontStyle: "italic" }}>Erevan</Text>—a brutal survivor in a world still close enough to the
                  first covenant to feel its loss. During a night of falling fire, a fragment of alien star-metal struck the
                  earth near his battlefield. Erevan died beside it… and woke again.
                </Text>

                <Text style={styles.aboutText}>
                  That meteor was <Text style={{ fontStyle: "italic" }}>Vortanite</Text>. It didn’t “gift” him divinity—it{" "}
                  <Text style={{ fontStyle: "italic" }}>activated</Text> something already inside his blood: a dormant anomaly
                  later known as <Text style={{ fontStyle: "italic" }}>LACOSE</Text>. Reborn with a body that refused
                  extinction and a mind that learned patterns too quickly, he buried his birth name and took a new one:{" "}
                  <Text style={{ fontStyle: "italic" }}>Erevos</Text>.
                </Text>

                <Text style={styles.aboutText}>
                  He did not demand worship. He did not build a throne. He built systems—cities, orders, vaults of
                  knowledge—and then stepped back to watch humanity repeat the same collapse in different clothes. Over
                  millennia of war, politics, and hidden influence, Erevos stopped believing evil was an individual choice.
                </Text>

                <Text style={styles.aboutText}>He believes it is a process.</Text>

                <Text style={styles.aboutText}>• Powers and Abilities:</Text>
                <Text style={styles.aboutText}>
                  • Immortality (LACOSE): Unaging and nearly unkillable, Erevos regenerates from catastrophic wounds. Death is
                  not a fate to him—only an interruption.
                </Text>
                <Text style={styles.aboutText}>
                  • Enhanced Physique: Strength, speed, and endurance beyond human limits—an ancient body refined by survival
                  and the metabolic rewrite of activation.
                </Text>
                <Text style={styles.aboutText}>
                  • Master Strategist: Thousands of years of military, political, and psychological warfare make him an
                  unmatched tactician and long-game manipulator.
                </Text>
                <Text style={styles.aboutText}>
                  • Vortanite Resonance: The meteor’s residue left him able to shape dense “dark” fields—force projection,
                  telekinetic pressure, and gravitational-like control (not magic—resonance).
                </Text>
                <Text style={styles.aboutText}>
                  • Meteor Staff: A focus forged from the same star-metal, used to absorb, stabilize, and amplify resonance
                  into devastating output.
                </Text>
                <Text style={styles.aboutText}>
                  • Ancestral Sigil (Dormancy Authority): As the first awakened carrier, Erevos can suppress—or forcibly
                  trigger—meta potential in bloodlines connected to him by Lacose inheritance.
                </Text>

                <Text style={styles.aboutText}>Erevos’s Timeline:</Text>
                <Text style={styles.aboutText}>
                  1. <Text style={{ fontWeight: "bold" }}>Erevos Primeval</Text> – Newly awakened after the Meteor Night, still
                  learning what Lacose made him, clad in early-era armor and raw purpose.
                </Text>
                <Text style={styles.aboutText}>
                  2. <Text style={{ fontWeight: "bold" }}>Erevos the Conqueror</Text> – A medieval tyrant who weaponized
                  history itself, marching beneath star-metal and doctrine.
                </Text>
                <Text style={styles.aboutText}>
                  3. <Text style={{ fontWeight: "bold" }}>Modern Erevos</Text> – A kingmaker in silence: corporate wars, proxy
                  conflicts, and engineered crises—all steering the world toward his preferred “order.”
                </Text>
                <Text style={styles.aboutText}>
                  4. <Text style={{ fontWeight: "bold" }}>Erevos Ascendant</Text> – The future version of Erevos when restraint
                  fails: half the galaxy bent, red cosmic fire unleashed, and control elevated into something nearly divine.
                </Text>

                <Text style={styles.aboutText}>
                  Current Agenda: <Text style={{ fontStyle: "italic" }}>Project Ascendancy</Text>
                </Text>
                <Text style={styles.aboutText}>
                  Ascendancy is not simply conquest—it is containment through control. Erevos intends to unify Earth’s metas
                  under one rule, harvesting proven hero abilities through the Celestial Eye and using the Ancestral Sigil to
                  decide who remains dormant, who awakens, and who is denied. In his mind, unregulated power is how
                  civilizations end.
                </Text>

                <Text style={styles.aboutText}>And he will not allow the world to become available.</Text>

                <Text style={styles.aboutText}>The Enlightened:</Text>
                <Text style={styles.aboutText}>
                  Erevos leads a secret cabal known as <Text style={{ fontWeight: "bold" }}>The Enlightened</Text>, an order
                  built on one principle: power must be guided—or it will repeat the Fall. Each Lieutenant represents a
                  domain of control within his grand design:
                </Text>

                <Text style={styles.aboutText}>
                  • <Text style={{ fontWeight: "bold" }}>Chrona</Text>: A time-bending manipulator of fate and contingency. She
                  reads branching outcomes and nudges causality toward Erevos’s preferred future.
                </Text>

                <Text style={styles.aboutText}>
                  • <Text style={{ fontWeight: "bold" }}>Noctura</Text>: An illusionist and psychological operator who
                  engineers perception, destabilizes truth, and turns populations into compliant narratives.
                </Text>

                <Text style={styles.aboutText}>
                  • <Text style={{ fontWeight: "bold" }}>Sable</Text>: The silent blade. A dimensional assassin who phases
                  between layers of reality—executions without witnesses, missions without residue.
                </Text>

                <Text style={styles.aboutText}>
                  • <Text style={{ fontWeight: "bold" }}>Obelisk</Text>: A warlock-architect of forbidden ritual systems and
                  cosmic gateways—maintaining the cabal’s hidden infrastructure and external communications.
                </Text>

                <Text style={styles.aboutText}>
                  • <Text style={{ fontWeight: "bold" }}>Titanus</Text>: A bio-cyber juggernaut deployed when persuasion ends—
                  Erevos’s answer to rebellion and meta insurgency.
                </Text>

                <Text style={styles.aboutText}>
                  • <Text style={{ fontWeight: "bold" }}>Red Mercury</Text>: The worldly engine—wealth, media, industry, and
                  legislation. He shapes nations the way others shape clay.
                </Text>

                <Text style={styles.aboutText}>Pact with Torath – The Devourer:</Text>
                <Text style={styles.aboutText}>
                  Erevos made a cosmic bargain with Torath, the Devourer—a conqueror who consumes worlds. Publicly, it’s a
                  simple wager: whoever claims Earth first keeps it. Privately, Erevos knows Torath is not just a monster…
                  he is a herald.
                </Text>
                <Text style={styles.aboutText}>
                  The alliance is unstable—both expect betrayal. Erevos’s goal isn’t trust. It’s time.
                </Text>

                <Text style={styles.aboutText}>Erevos’s Legacy:</Text>
                <Text style={styles.aboutText}>
                  Erevos is not just a threat—he is the source. Meta potential traces back to his awakened bloodline, carried
                  through generations in silence. Most carriers will never activate. Some will. And Erevos intends to decide
                  which future the world inherits.
                </Text>
                <Text style={styles.aboutText}>
                  In the Parliament of Justice, Erevos sees only delay. To him, peace is fragile. Struggle reveals the real
                  hierarchy of beings. If humanity refuses to be guided, it will be sorted—by war, by collapse… or by him.
                </Text>
                <Text style={styles.aboutText}>
                  To defeat Erevos is to defeat the idea that control is salvation. And to ignore him is to risk learning what
                  happens when salvation runs out.
                </Text>
              </View>
            ) : null}
          </View>

          {/* 🔒 OMEGA–BLACK FILE BUTTON (LOCKED UNTIL ABOUT OPENED) */}
          <View style={styles.fileButtonWrap}>
            <TouchableOpacity
              style={[styles.fileButton, !aboutHasBeenOpened && styles.fileButtonLocked]}
              onPress={handleOpenFile}
              activeOpacity={0.9}
            >
              {!aboutHasBeenOpened && (
                <Text style={styles.lockedLine}>LOCKED — REVIEW ABOUT ME FIRST</Text>
              )}
              <Text style={styles.fileButtonTop}>OMEGA–BLACK</Text>
              <Text style={styles.fileButtonTitle}>OPEN ORIGIN FILE</Text>
              <Text style={styles.fileButtonSub}>EREVOS PRIME • CLASSIFIED</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
  overlay: { flex: 1, backgroundColor: COLORS.void },
  scrollContainer: { paddingBottom: 30 },

  // 🎧 MUSIC BAR
  musicControls: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: COLORS.gunmetal,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.redEdge,
    shadowColor: COLORS.red,
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  trackButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(230, 230, 240, 0.80)",
    backgroundColor: COLORS.gunmetalSoft,
    marginRight: 6,
  },
  trackButtonText: { color: COLORS.text, fontSize: 14, fontWeight: "bold" },
  trackInfoGlass: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: COLORS.cosmicBlue,
    borderWidth: 1,
    borderColor: COLORS.royalPurpleEdge,
    flexDirection: "row",
    alignItems: "center",
  },
  trackLabel: { color: COLORS.textSoft, fontSize: 11, marginRight: 6 },
  trackTitle: { color: "#EFE6FF", fontSize: 13, fontWeight: "700" },
  musicButton: {
    backgroundColor: COLORS.royalPurple,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "rgba(245, 235, 255, 0.55)",
  },
  musicButtonSecondary: {
    backgroundColor: COLORS.gunmetalSoft,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 999,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: COLORS.redEdge,
  },
  musicButtonDisabled: { opacity: 0.55 },
  musicButtonText: { color: "#F4EEFF", fontWeight: "bold", fontSize: 13 },
  musicButtonTextSecondary: { color: "#FFEDED", fontWeight: "bold", fontSize: 13 },

  // HEADER
  headerOuter: { paddingHorizontal: 16, paddingTop: 16 },
  headerRow: { flexDirection: "row", alignItems: "center" },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: COLORS.gunmetalSoft,
    borderWidth: 1,
    borderColor: COLORS.redEdge,
    marginRight: 10,
  },
  backButtonText: { fontSize: 22, color: COLORS.text },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.gunmetal,
    borderWidth: 1,
    borderColor: COLORS.royalPurpleEdge,
    shadowColor: COLORS.royalPurple,
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#EFE6FF",
    textAlign: "center",
    textShadowColor: "#000",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 0.8,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(255, 235, 235, 0.72)",
    textAlign: "center",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  // ✅ TRUTH BUTTON
  truthButton: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderWidth: 1,
    borderColor: "rgba(240, 210, 122, 0.55)",
  },
  truthButtonActive: {
    backgroundColor: "rgba(240, 210, 122, 0.18)",
    borderColor: "rgba(240, 210, 122, 0.85)",
  },
  truthButtonText: {
    color: "rgba(240, 210, 122, 0.95)",
    fontWeight: "900",
    letterSpacing: 1.2,
    fontSize: 11,
  },
  truthButtonTextActive: { color: "#FFE9A8" },

  // SECTION
  section: {
    marginTop: 24,
    marginHorizontal: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: COLORS.gunmetal,
    borderWidth: 1,
    borderColor: "rgba(160, 140, 190, 0.40)",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#EFE6FF",
    textAlign: "center",
    textShadowColor: "#000",
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
    backgroundColor: COLORS.redEdge,
  },
  imageScrollContainer: { flexDirection: "row", paddingHorizontal: 8, paddingTop: 4, alignItems: "center" },

  // CARD
  card: (isDesktop, windowWidth, isSecondary) => ({
    width: isSecondary
      ? isDesktop
        ? windowWidth * 0.26
        : SCREEN_WIDTH * 0.62
      : isDesktop
      ? windowWidth * 0.3
      : SCREEN_WIDTH * 0.9,
    height: isSecondary
      ? isDesktop
        ? SCREEN_HEIGHT * 0.42
        : SCREEN_HEIGHT * 0.55
      : isDesktop
      ? SCREEN_HEIGHT * 0.8
      : SCREEN_HEIGHT * 0.7,
    borderRadius: 22,
    overflow: "hidden",
    elevation: 12,
    marginRight: 18,
    backgroundColor: COLORS.gunmetal,
    borderWidth: 1,
    borderColor: COLORS.royalPurpleEdge,
    shadowColor: COLORS.royalPurple,
    shadowOpacity: 0.42,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
  }),
  clickable: {},
  notClickable: { opacity: 0.8 },
  armorImage: { width: "100%", height: "100%", resizeMode: "cover" },
  transparentOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0,0,0,0.22)", zIndex: 1 },
  cardName: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    fontSize: 12,
    color: "#EFE6FF",
    fontWeight: "600",
    textShadowColor: "#000",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },

  // ✅ ABOUT (COLLAPSIBLE HEADER)
  aboutSection: {
    marginTop: 28,
    marginHorizontal: 12,
    marginBottom: 18,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: COLORS.gunmetal,
    borderWidth: 1,
    borderColor: COLORS.redEdge,
    shadowColor: COLORS.red,
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  aboutHeaderRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: "#EFE6FF",
    textAlign: "left",
    letterSpacing: 0.8,
  },
  aboutHint: {
    marginTop: 4,
    fontSize: 11,
    color: "rgba(255, 235, 235, 0.72)",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  aboutBadge: {
    borderWidth: 1,
    borderColor: "rgba(240, 210, 122, 0.55)",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  aboutBadgeText: {
    color: "rgba(240, 210, 122, 0.95)",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  aboutText: {
    fontSize: 14,
    color: "rgba(245, 245, 245, 0.88)",
    lineHeight: 20,
    marginTop: 6,
    textAlign: "left",
  },

  // 🔒 FILE BUTTON
  fileButtonWrap: { marginTop: 6, marginHorizontal: 12, marginBottom: 24 },
  fileButton: {
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 14,
    backgroundColor: COLORS.cosmicBlue,
    borderWidth: 1,
    borderColor: COLORS.royalPurpleEdge,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  fileButtonLocked: {
    opacity: 0.78,
    borderColor: "rgba(240, 98, 98, 0.55)",
  },
  lockedLine: {
    textAlign: "center",
    marginBottom: 8,
    color: "rgba(240, 98, 98, 0.92)",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  fileButtonTop: {
    color: "rgba(245, 245, 245, 0.78)",
    fontSize: 11,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 4,
    textAlign: "center",
  },
  fileButtonTitle: {
    color: "#EFE6FF",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 1,
    textAlign: "center",
  },
  fileButtonSub: {
    marginTop: 4,
    color: "rgba(255, 235, 235, 0.72)",
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    textAlign: "center",
  },
});

export default ErevosScreen;
