import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Animated,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";

// ------------------------------
// CLEARANCE (session-only, relocks)
// ------------------------------
const CLEARANCE = {
  PUBLIC: 0,
  RESTRICTED: 1,
  OMEGA_BLACK: 2,
};

const CLEARANCE_LABEL = {
  0: "PUBLIC",
  1: "RESTRICTED",
  2: "OMEGA–BLACK",
};

// 🔐 Replace these with your real codes
const PASSCODES = {
  RESTRICTED: "ECLIPSE",
  OMEGA_BLACK: "OMEGABLACK",
};

// ------------------------------
// Collapsible dossier
// ------------------------------
function CollapsibleDossier({
  title,
  clearanceRequired = CLEARANCE.PUBLIC,
  userClearance = CLEARANCE.PUBLIC,
  children,
}) {
  const [open, setOpen] = useState(false);
  const locked = userClearance < clearanceRequired;

  // auto-close if user loses clearance
  useEffect(() => {
    if (locked) setOpen(false);
  }, [locked]);

  return (
    <View style={styles.dossier}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => {
          if (locked) return;
          setOpen((v) => !v);
        }}
        style={styles.dossierHeader}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.dossierTitle}>{title}</Text>
          <Text style={styles.dossierSub}>
            {locked
              ? `CLEARANCE REQUIRED: ${CLEARANCE_LABEL[clearanceRequired]}`
              : open
              ? "TAP TO COLLAPSE"
              : "TAP TO EXPAND"}
          </Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {locked ? "LOCKED" : open ? "OPEN" : "CLOSED"}
          </Text>
        </View>
      </TouchableOpacity>

      {!locked && open ? <View style={styles.dossierBody}>{children}</View> : null}
    </View>
  );
}

export default function LabyrinthScreen() {
  const navigation = useNavigation();

  // MODE: PUBLIC view vs RESTRICTED view
  const [mode, setMode] = useState("PUBLIC"); // "PUBLIC" | "RESTRICTED"

  // Clearance (session-only)
  const [clearance, setClearance] = useState(CLEARANCE.PUBLIC);

  // Unlock modal
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [code, setCode] = useState("");

  // Audio
  const soundRef = useRef(null);

  // Parallax (restricted mode uses Animated.ScrollView)
  const scrollY = useRef(new Animated.Value(0)).current;

  const bgTranslateY = scrollY.interpolate({
    inputRange: [0, 800],
    outputRange: [0, -80],
    extrapolate: "clamp",
  });

  const overlayOpacity = scrollY.interpolate({
    inputRange: [0, 600],
    outputRange: [0.55, 0.72],
    extrapolate: "clamp",
  });

  const headerLabel = useMemo(() => CLEARANCE_LABEL[clearance], [clearance]);

  // ------------------------------
  // Audio init + cleanup
  // ------------------------------
  useEffect(() => {
    let isMounted = true;

    const play = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("../../assets/audio/LabyrinthAmbience.mp4"),
          { shouldPlay: true, isLooping: true, volume: 0.4 }
        );
        if (isMounted) soundRef.current = sound;
      } catch (e) {
        console.warn("Labyrinth audio not loaded:", e);
      }
    };

    play();

    return () => {
      isMounted = false;
      if (soundRef.current) soundRef.current.unloadAsync();
    };
  }, []);

  // ------------------------------
  // Relock rules:
  // - When switching back to PUBLIC: clearance resets to PUBLIC
  // - When leaving the screen (unmount): nothing persists anyway
  // ------------------------------
  const goPublic = () => {
    setMode("PUBLIC");
    setClearance(CLEARANCE.PUBLIC);
    setUnlockOpen(false);
    setCode("");
    scrollY.setValue(0);
  };

  const goRestricted = () => {
    setMode("RESTRICTED");
    // start restricted mode at PUBLIC clearance until they unlock
    setClearance(CLEARANCE.PUBLIC);
    setUnlockOpen(false);
    setCode("");
    scrollY.setValue(0);
  };

  // EXIT button behavior (same as your advanced version)
  const exitArchive = () => {
    try {
      if (navigation.canGoBack()) navigation.goBack();
      else
        navigation.reset({
          index: 0,
          routes: [{ name: "Home" }], // change if your root is different
        });
    } catch (e) {
      console.warn("Exit failed:", e);
    }
  };

  const tryUnlock = () => {
    const raw = code.trim().toUpperCase();
    if (!raw) return;

    let next = clearance;

    if (raw === PASSCODES.OMEGA_BLACK) next = CLEARANCE.OMEGA_BLACK;
    else if (raw === PASSCODES.RESTRICTED) next = Math.max(next, CLEARANCE.RESTRICTED);

    if (next === clearance) {
      Alert.alert("ACCESS DENIED", "Invalid clearance code.");
      return;
    }

    setClearance(next);
    setUnlockOpen(false);
    setCode("");
    Alert.alert("ACCESS GRANTED", `CLEARANCE: ${CLEARANCE_LABEL[next]}`);
  };

  // ------------------------------
  // PUBLIC VIEW (your "main look")
  // ------------------------------
  const renderPublic = () => (
    <>
      <View style={styles.overlayStatic} />

      <View style={styles.container}>
        <View style={styles.cardPublic}>
          {/* Header row: Exit + Restricted */}
          <View style={styles.publicTopRow}>
            <TouchableOpacity style={styles.publicExitBtn} activeOpacity={0.85} onPress={exitArchive}>
              <Text style={styles.publicExitText}>EXIT</Text>
            </TouchableOpacity>

            <View style={{ flex: 1 }} />

            <TouchableOpacity
              style={styles.publicRestrictedBtn}
              activeOpacity={0.85}
              onPress={goRestricted}
            >
              <Text style={styles.publicRestrictedText}>RESTRICTED</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.fileHeader}>📁 PARLIAMENT OF JUSTICE</Text>
          <Text style={styles.fileSubheader}>OMEGA–BLACK ARCHIVE — CLASSIFIED DOSSIER</Text>

          <View style={styles.divider} />

          <Text style={styles.metaLine}>FILE: LABYRINTH OF HAWARA</Text>
          <Text style={styles.metaLine}>CLASSIFICATION: PRE-FLOOD MEGASTRUCTURE</Text>
          <Text style={styles.metaLine}>STATUS: SEALED</Text>

          <View style={styles.divider} />

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>ORIGIN — ZEP TEPI</Text>
            <Text style={styles.body}>
              Over 10,000 years ago, before the rise of Ancient Egypt, before the Great Flood, and
              prior to the Younger Dryas Catalyst, humanity entered an era remembered as Zep Tepi —
              The First Time.{"\n\n"}
              Civilization existed globally with advanced mastery of astronomy, mathematics,
              agriculture, navigation, and governance.
            </Text>

            <View style={styles.subDivider} />

            <Text style={styles.sectionTitle}>ATLANTIS</Text>
            <Text style={styles.body}>
              The most advanced and populous city of the First Time was Atlantis. A global center of
              scholarship, science, and law, it represented humanity’s greatest achievement — and
              its greatest failure.
            </Text>

            <View style={styles.subDivider} />

            <Text style={styles.sectionTitle}>THE LABYRINTH</Text>
            <Text style={styles.body}>
              Constructed long before dynastic Egypt, the Labyrinth was built as a Vault of Records
              to preserve the knowledge of the First World.{"\n\n"}
              • ~3,000 chambers{"\n"}
              • Four subterranean layers{"\n"}
              • Spanning the size of ten football fields{"\n\n"}
              At its core lies a massive metallic circular structure — a Rosetta Engine designed to
              guide future civilizations.
            </Text>

            <View style={styles.subDivider} />

            <Text style={styles.sectionTitle}>ANCIENT TESTIMONY</Text>
            <Text style={styles.body}>
              Herodotus described the Labyrinth as greater than the pyramids, beyond human
              capability, and superior to all Greek achievements combined.{"\n\n"}
              Strabo, Diodorus Siculus, and Pliny the Elder confirmed its immense scale, complexity,
              and sacred nature.
            </Text>

            <View style={styles.subDivider} />

            <Text style={styles.sectionTitle}>THE SPHINX</Text>
            <Text style={styles.body}>
              The Great Sphinx was constructed above the Labyrinth with the head of a lion, facing
              the rising sun and key constellations.{"\n\n"}
              The primary entrance lies beneath its right paw.
            </Text>

            <View style={styles.subDivider} />

            <Text style={styles.sectionTitle}>THE FIRST TIME TEACHERS</Text>
            <Text style={styles.body}>
              Ra — Astronomy and Timekeeping{"\n"}
              Thoth — Writing and Systems{"\n"}
              Osiris — Law and Judgment{"\n"}
              Isis — Medicine and Preservation{"\n"}
              Horus — Stewardship and Defense{"\n"}
              Ptah — Engineering and Construction{"\n\n"}
              These were not gods in life — they became gods in memory.
            </Text>

            <View style={styles.subDivider} />

            <Text style={styles.quote}>
              “The Labyrinth was ancient when Egypt was young.{"\n"}
              It was beyond human capability — not because it was supernatural, but because
              humanity had already fallen once before.”
            </Text>

            <Text style={styles.statusLine}>ARCHIVE STATUS: ACTIVE</Text>
            <View style={{ height: 8 }} />
          </ScrollView>
        </View>
      </View>
    </>
  );

  // ------------------------------
  // RESTRICTED VIEW (unlock + dossiers)
  // ------------------------------
  const renderRestricted = () => (
    <>
      {/* Parallax background */}
      <Animated.Image
        source={require("../../assets/BackGround/Labyrinth.jpg")}
        style={[styles.bgImage, { transform: [{ translateY: bgTranslateY }] }]}
        resizeMode="cover"
      />
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />

      <View style={styles.container}>
        <View style={styles.cardRestricted}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fileHeader}>📁 PARLIAMENT OF JUSTICE</Text>
              <Text style={styles.fileSubheader}>OMEGA–BLACK ARCHIVE — CLASSIFIED DOSSIER</Text>
              <Text style={styles.metaLine}>CLEARANCE: {headerLabel}</Text>
            </View>

            <View style={styles.topButtons}>
              <TouchableOpacity style={styles.smallBtn} activeOpacity={0.85} onPress={() => setUnlockOpen(true)}>
                <Text style={styles.smallBtnText}>UNLOCK</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.smallBtn} activeOpacity={0.85} onPress={goPublic}>
                <Text style={styles.smallBtnText}>PUBLIC</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.smallBtn, styles.exitBtn]} activeOpacity={0.85} onPress={exitArchive}>
                <Text style={[styles.smallBtnText, { color: "#fff" }]}>EXIT</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          <Animated.ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
              useNativeDriver: true,
            })}
          >
            <Text style={styles.metaLine}>FILE: LABYRINTH OF HAWARA</Text>
            <Text style={styles.metaLine}>CLASSIFICATION: PRE-FLOOD MEGASTRUCTURE</Text>
            <Text style={styles.metaLine}>STATUS: SEALED</Text>

            <View style={styles.divider} />

            <CollapsibleDossier title="ORIGIN — ZEP TEPI" userClearance={clearance}>
              <Text style={styles.body}>
                Over 10,000 years ago, before the rise of Ancient Egypt, before the Great Flood, and
                prior to the Younger Dryas Catalyst, humanity entered an era remembered as Zep Tepi —
                The First Time.{"\n\n"}
                Civilization existed globally with advanced mastery of astronomy, mathematics,
                agriculture, navigation, and governance.
              </Text>
            </CollapsibleDossier>

            <CollapsibleDossier title="ATLANTIS — PRIMARY METROPOLIS" userClearance={clearance}>
              <Text style={styles.body}>
                Atlantis was the most advanced and populous city of the First Time — a nexus of scholarship
                and law. It represented humanity’s greatest achievement, and its greatest failure when power
                outpaced morality.
              </Text>
            </CollapsibleDossier>

            <CollapsibleDossier title="THE LABYRINTH — VAULT OF RECORDS" userClearance={clearance}>
              <Text style={styles.body}>
                Constructed long before dynastic Egypt, the Labyrinth was built as a Vault of Records to preserve
                the knowledge of the First World.{"\n\n"}
                • ~3,000 chambers and corridors{"\n"}
                • Four subterranean layers{"\n"}
                • Spanning the size of ten football fields{"\n\n"}
                At its core lies a massive metallic circular structure — the Rosetta Engine — designed to guide
                future civilizations.
              </Text>
            </CollapsibleDossier>

            <CollapsibleDossier title="ANCIENT TESTIMONY — CLASSICAL ACCOUNTS" userClearance={clearance}>
              <Text style={styles.body}>
                Herodotus described the Labyrinth as greater than the pyramids, overwhelming to the senses,
                and beyond post-Flood human capability. Strabo, Diodorus Siculus, and Pliny the Elder confirmed
                its immense scale, complexity, and sacred nature.
              </Text>
            </CollapsibleDossier>

            <CollapsibleDossier title="THE SPHINX — CELESTIAL MARKER" userClearance={clearance}>
              <Text style={styles.body}>
                The Great Sphinx was constructed above the Labyrinth with the head of a lion, facing the rising sun
                and key constellations.{"\n\n"}
                The primary entrance lies beneath its right paw.
              </Text>
            </CollapsibleDossier>

            <CollapsibleDossier
              title="RESTRICTED — THE FIRST TIME TEACHERS"
              clearanceRequired={CLEARANCE.RESTRICTED}
              userClearance={clearance}
            >
              <Text style={styles.body}>
                Ra — Astronomy and Timekeeping{"\n"}
                Thoth — Writing and Systems{"\n"}
                Osiris — Law and Judgment{"\n"}
                Isis — Medicine and Preservation{"\n"}
                Horus — Stewardship and Defense{"\n"}
                Ptah — Engineering and Construction{"\n"}
                Ma’at — Cosmic Law (Principle){"\n\n"}
                These were not gods in life — they became gods in memory.
              </Text>
            </CollapsibleDossier>

            <CollapsibleDossier
              title="OMEGA–BLACK — ROSETTA ENGINE NOTES"
              clearanceRequired={CLEARANCE.OMEGA_BLACK}
              userClearance={clearance}
            >
              <Text style={styles.body}>
                The Rosetta Engine is not a “machine” in the modern sense. It is an interpretive framework:
                a universal key that binds language, number, sky-cycles, and history into a single system.{"\n\n"}
                Without correct calibration, the Engine yields nothing. This is intentional. Knowledge is conditional.
              </Text>

              <View style={styles.subDivider} />

              <Text style={styles.quote}>
                “Let those who seek power be lost. Let those who seek understanding pass.”
              </Text>
            </CollapsibleDossier>

            <View style={{ height: 16 }} />
            <Text style={styles.statusLine}>ARCHIVE STATUS: ACTIVE</Text>
            <View style={{ height: 18 }} />
          </Animated.ScrollView>
        </View>
      </View>

      {/* Unlock Modal */}
      <Modal visible={unlockOpen} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.modalWrap}
          >
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>CLEARANCE UNLOCK</Text>
              <Text style={styles.modalSub}>Enter authorization code to elevate access.</Text>

              <View style={styles.modalDivider} />

              <TextInput
                value={code}
                onChangeText={setCode}
                placeholder="ENTER CODE"
                placeholderTextColor="#6c7a92"
                autoCapitalize="characters"
                autoCorrect={false}
                style={styles.input}
              />

              <View style={styles.modalRow}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.modalBtnGhost]}
                  onPress={() => {
                    setUnlockOpen(false);
                    setCode("");
                  }}
                  activeOpacity={0.85}
                >
                  <Text style={styles.modalBtnText}>CANCEL</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalBtn, styles.modalBtnPrimary]}
                  onPress={tryUnlock}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.modalBtnText, { color: "#0b0f16" }]}>UNLOCK</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.modalFoot}>Current Clearance: {headerLabel}</Text>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </>
  );

  // ------------------------------
  // FINAL RENDER
  // ------------------------------
  return (
    <ImageBackground
      source={require("../../assets/BackGround/Labyrinth.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      {mode === "PUBLIC" ? renderPublic() : renderRestricted()}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // base bg
  background: { flex: 1 },

  // PUBLIC overlay (static)
  overlayStatic: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.65)",
  },

  // RESTRICTED overlay (animated opacity)
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },

  // parallax bg image (restricted uses this)
  bgImage: {
    position: "absolute",
    top: -60,
    left: 0,
    right: 0,
    height: "120%",
    width: "100%",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 16,
  },

  // ------------------------------
  // PUBLIC CARD (main look)
  // ------------------------------
  cardPublic: {
    backgroundColor: "#0f141c",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#3c4e68",
    padding: 16,
    maxHeight: "90%",
  },

  publicTopRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },

  publicExitBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(240, 98, 98, 0.55)",
    backgroundColor: "rgba(240, 98, 98, 0.18)",
  },
  publicExitText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.1,
  },

  publicRestrictedBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(240, 210, 122, 0.75)",
    backgroundColor: "rgba(240, 210, 122, 0.12)",
  },
  publicRestrictedText: {
    color: "#f0d27a",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.1,
  },

  // ------------------------------
  // RESTRICTED CARD (glassy)
  // ------------------------------
  cardRestricted: {
    backgroundColor: "rgba(15, 20, 28, 0.92)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#3c4e68",
    padding: 16,
    maxHeight: "92%",
  },

  // shared typography
  fileHeader: {
    color: "#e5f1ff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  fileSubheader: {
    color: "#8fa2c3",
    fontSize: 12,
    marginTop: 4,
    letterSpacing: 1,
  },

  divider: {
    height: 1,
    backgroundColor: "#2b3647",
    marginVertical: 10,
  },
  subDivider: {
    height: 1,
    backgroundColor: "#222b38",
    marginVertical: 8,
  },
  metaLine: {
    color: "#aab7cf",
    fontSize: 12,
    letterSpacing: 1,
    marginTop: 4,
  },

  scroll: { marginTop: 6 },

  sectionTitle: {
    color: "#d7e3ff",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
    letterSpacing: 1,
  },
  body: {
    color: "#aab7cf",
    fontSize: 12,
    lineHeight: 18,
  },
  quote: {
    color: "#f2f5ff",
    fontSize: 13,
    fontStyle: "italic",
    marginTop: 6,
    lineHeight: 20,
  },
  statusLine: {
    color: "#f0d27a",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginTop: 8,
  },

  // top bar (restricted)
  topBar: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  topButtons: {
    gap: 8,
    alignItems: "flex-end",
  },
  smallBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3c4e68",
    backgroundColor: "rgba(17, 22, 29, 0.85)",
  },
  exitBtn: {
    backgroundColor: "rgba(240, 98, 98, 0.25)",
    borderColor: "rgba(240, 98, 98, 0.55)",
  },
  smallBtnText: {
    color: "#d7e3ff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.1,
  },

  // dossiers
  dossier: {
    borderWidth: 1,
    borderColor: "#2b3647",
    borderRadius: 14,
    backgroundColor: "rgba(17, 22, 29, 0.65)",
    marginBottom: 10,
    overflow: "hidden",
  },
  dossierHeader: {
    padding: 12,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  dossierTitle: {
    color: "#d7e3ff",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1,
  },
  dossierSub: {
    color: "#8fa2c3",
    fontSize: 11,
    marginTop: 4,
    letterSpacing: 0.8,
  },
  badge: {
    borderWidth: 1,
    borderColor: "#3c4e68",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  badgeText: {
    color: "#aab7cf",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  dossierBody: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },

  // modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    padding: 16,
  },
  modalWrap: { width: "100%" },
  modalCard: {
    backgroundColor: "#0f141c",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#3c4e68",
    padding: 16,
  },
  modalTitle: {
    color: "#e5f1ff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1.2,
  },
  modalSub: {
    color: "#8fa2c3",
    fontSize: 12,
    marginTop: 6,
    letterSpacing: 0.7,
  },
  modalDivider: {
    height: 1,
    backgroundColor: "#2b3647",
    marginVertical: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#2b3647",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: "#e5f1ff",
    backgroundColor: "rgba(0,0,0,0.25)",
    letterSpacing: 2,
    fontWeight: "700",
  },
  modalRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnGhost: {
    borderColor: "#3c4e68",
    backgroundColor: "rgba(17, 22, 29, 0.85)",
  },
  modalBtnPrimary: {
    borderColor: "rgba(240, 210, 122, 0.8)",
    backgroundColor: "#f0d27a",
  },
  modalBtnText: {
    color: "#d7e3ff",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.1,
  },
  modalFoot: {
    color: "#8fa2c3",
    fontSize: 11,
    marginTop: 12,
    letterSpacing: 0.7,
  },
});
