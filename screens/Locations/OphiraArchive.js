// screens/Locations/OphiraArchive.js
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
  RESTRICTED: "OPHIR",
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

export default function OphiraArchive() {
  const navigation = useNavigation();

  // MODE: PUBLIC view vs RESTRICTED view
  const [mode, setMode] = useState("PUBLIC"); // "PUBLIC" | "RESTRICTED"

  // Clearance (session-only)
  const [clearance, setClearance] = useState(CLEARANCE.PUBLIC);

  // Unlock modal
  const [unlockOpen, setUnlockOpen] = useState(false);
  const [code, setCode] = useState("");

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
  // Relock rules:
  // - When switching back to PUBLIC: clearance resets to PUBLIC
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
    setClearance(CLEARANCE.PUBLIC);
    setUnlockOpen(false);
    setCode("");
    scrollY.setValue(0);
  };

  // EXIT button behavior (safe)
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

  // ✅ Background image (use existing file so it won’t break)
  const BG = useMemo(
    () => require("../../assets/BackGround/Enforcers.jpg"),
    []
  );

  // ------------------------------
  // PUBLIC VIEW (main look)
  // ------------------------------
  const renderPublic = () => (
    <>
      <View style={styles.overlayStatic} />

      <View style={styles.container}>
        <View style={styles.cardPublic}>
          {/* Header row: Exit + Restricted */}
          <View style={styles.publicTopRow}>
            <TouchableOpacity
              style={styles.publicExitBtn}
              activeOpacity={0.85}
              onPress={exitArchive}
            >
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
          <Text style={styles.fileSubheader}>DEEP ARCHIVE RECORD — OPHIRA / OPHIR</Text>

          <View style={styles.divider} />

          <Text style={styles.metaLine}>FILE: OPHIRA / OPHIR</Text>
          <Text style={styles.metaLine}>SUBJECT: OPHIRA (FIRST QUEEN)</Text>
          <Text style={styles.metaLine}>LOCATION: LUNGSOD NG OPHIR (HIDDEN)</Text>
          <Text style={styles.metaLine}>ERA: POST-EXILE, POST-DISPERSION</Text>

          <View style={styles.divider} />

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.quote}>
              “They were lost because they forgot God.{"\n"}
              They were gathered because they remembered Him again.”
            </Text>

            <View style={styles.subDivider} />

            <Text style={styles.sectionTitle}>SUMMARY</Text>
            <Text style={styles.body}>
              Ophir is not introduced as a city in scripture — but as a name tied to lineage,
              dispersion, and origin (Genesis 10). Later texts attach the name to gold, maritime
              trade, and a distant land whose location is never confirmed.{"\n\n"}
              This archive reconstructs the origin of Ophira: the first queen who reorganizes the
              reunited remnants of the Ten Tribes into a hidden civilization — Ophir — not as a
              reward, but as a gathering after total loss.
            </Text>

            <View style={styles.subDivider} />

            <Text style={styles.sectionTitle}>STATUS</Text>
            <Text style={styles.body}>
              ARCHIVE STATUS: ACTIVE{"\n"}
              DISCLOSURE LEVEL: RESTRICTED
            </Text>

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
        source={BG}
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
              <Text style={styles.fileSubheader}>DEEP ARCHIVE RECORD — OPHIRA / OPHIR</Text>
              <Text style={styles.metaLine}>CLEARANCE: {headerLabel}</Text>
            </View>

            <View style={styles.topButtons}>
              <TouchableOpacity
                style={styles.smallBtn}
                activeOpacity={0.85}
                onPress={() => setUnlockOpen(true)}
              >
                <Text style={styles.smallBtnText}>UNLOCK</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.smallBtn} activeOpacity={0.85} onPress={goPublic}>
                <Text style={styles.smallBtnText}>PUBLIC</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.smallBtn, styles.exitBtn]}
                activeOpacity={0.85}
                onPress={exitArchive}
              >
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
            <Text style={styles.metaLine}>FILE: OPHIRA / OPHIR</Text>
            <Text style={styles.metaLine}>SUBJECT: OPHIRA (FIRST QUEEN)</Text>
            <Text style={styles.metaLine}>LOCATION: LUNGSOD NG OPHIR (HIDDEN)</Text>
            <Text style={styles.metaLine}>SOURCE NAME: OPHIR — GENESIS 10</Text>

            <View style={styles.divider} />

            <CollapsibleDossier title="I. SCRIPTURAL ANCHOR" userClearance={clearance}>
              <Text style={styles.body}>
                In Genesis 10, Ophir is named among the sons of Joktan, situating the name within the
                earliest post-Flood genealogical record.{"\n\n"}
                Ophir is not introduced as a kingdom or city, but as a name tied to origin, lineage,
                and dispersion.{"\n\n"}
                Later biblical texts associate Ophir with extraordinary wealth, maritime trade,
                sacred gold, and a distant land whose location is never confirmed.{"\n\n"}
                This absence becomes central.
              </Text>
            </CollapsibleDossier>

            <CollapsibleDossier title="II. THE LOST CONDITION — DISPERSION" userClearance={clearance}>
              <Text style={styles.body}>
                Following the fall of the Northern Kingdom of Israel, the Ten Tribes are scattered.
                This scattering is not singular, not organized, and not purposeful.{"\n\n"}
                They are taken captive, resettled by successive empires, absorbed into foreign
                systems, and moved repeatedly over generations.{"\n\n"}
                Their eastward movement is not a migration of faith — it is a drag of captivity
                across Asia.
              </Text>
            </CollapsibleDossier>

            <CollapsibleDossier title="III. THE POINT OF MAXIMUM LOSS" userClearance={clearance}>
              <Text style={styles.body}>
                By the time many of these scattered peoples reach the island chains of Southeast Asia,
                especially the Philippine archipelago:{"\n\n"}
                • Israel no longer exists as an identity{"\n"}
                • God is remembered only in echoes{"\n"}
                • rituals survive without explanation{"\n"}
                • symbols persist without names{"\n\n"}
                This is the true state of being lost: not hidden, not preserved — forgotten.
              </Text>
            </CollapsibleDossier>

            <CollapsibleDossier title="IV. REMEMBRANCE — THE TURNING" userClearance={clearance}>
              <Text style={styles.body}>
                The turning point is not conquest or revelation. It is remembrance.{"\n\n"}
                Across generations: shared symbols align; parallel stories surface; ancient moral laws
                re-emerge; and belief in one God resurfaces.{"\n\n"}
                This remembrance is slow, imperfect, and communal. The people do not return suddenly —
                they remember gradually. And in that remembering, captivity loosens.
              </Text>
            </CollapsibleDossier>

            <CollapsibleDossier title="V. THE GATHERING — WHY OPHIR IS FOUND" userClearance={clearance}>
              <Text style={styles.body}>
                Only after remembrance begins does a way open: trade routes shift, maritime skill
                develops, empires weaken, and captivity fragments.{"\n\n"}
                The scattered peoples converge — not by design, but by inevitability — and reunite in
                the islands.{"\n\n"}
                This reunion becomes known as Ophir: named not for a place, but for origin restored.
              </Text>
            </CollapsibleDossier>

            <CollapsibleDossier title="VI. OPHIRA — THE FIRST QUEEN" userClearance={clearance}>
              <Text style={styles.body}>
                From this reunited people emerges Ophira. She does not claim kingship through conquest
                or divine right.{"\n\n"}
                She is recognized because she restores order without domination, organizes memory
                without rewriting it, separates governance from priesthood, and binds the people
                without centralizing power.{"\n\n"}
                Ophira reorganizes the reunited tribes into a single, hidden civilization — naming
                the city after Ophir, son of Joktan, linking the gathered people back to the Table of
                Nations.
              </Text>
            </CollapsibleDossier>

            <CollapsibleDossier
              title="VII. RESTRICTED — WHY A MATRIARCHY FORMS"
              clearanceRequired={CLEARANCE.RESTRICTED}
              userClearance={clearance}
            >
              <Text style={styles.body}>
                Ophir does not reject covenant law — it corrects historical failure.{"\n\n"}
                Lesson learned through exile: power collapses memory; stewardship preserves it.{"\n\n"}
                Governance becomes matriarchal based on a recurring survival pattern during social
                collapse: continuity is most reliably preserved through households, kinship networks,
                and guardians of daily life rather than centralized thrones.{"\n\n"}
                Scriptural precedent for women acting as guardians of continuity includes: Eve; Sarah,
                Rebekah, and Rachel; the preservation of Moses through women; Deborah as judge; and
                Esther as protector of a people without priesthood authority.{"\n\n"}
                Priesthood remains sacred. Governance remains custodial. The two are never allowed to
                merge again.
              </Text>
            </CollapsibleDossier>

            <CollapsibleDossier
              title="OMEGA–BLACK — OPHIR’S DOCTRINE OF HIDING"
              clearanceRequired={CLEARANCE.OMEGA_BLACK}
              userClearance={clearance}
            >
              <Text style={styles.body}>
                Ophir does not rise publicly. It hides — not in fear, but in obedience.{"\n\n"}
                Its doctrine is survival until the appointed time:{"\n"}
                • no empire{"\n"}
                • no conquest{"\n"}
                • no global dominance{"\n"}
                • no interference with the world’s course{"\n\n"}
                Ophir exists to endure, not to rule.
              </Text>

              <View style={styles.subDivider} />

              <Text style={styles.quote}>
                “Ophir is not Israel restored.{"\n"}
                Ophir is Israel remembered.”
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

              <View style={{ height: 8 }} />
              <Text style={styles.modalFoot}>
                Hint: RESTRICTED = "{PASSCODES.RESTRICTED}" (change anytime)
              </Text>
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
    <ImageBackground source={BG} style={styles.background} resizeMode="cover">
      {mode === "PUBLIC" ? renderPublic() : renderRestricted()}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
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

  // PUBLIC CARD
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

  // RESTRICTED CARD
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
