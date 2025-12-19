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
  RESTRICTED: "ELOHIM",
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

    {/* Bigger identity lines */}
    {/* <Text style={styles.metaLine}>SECTOR: TERRAN ARCHIVES / FIRST-TIME STUDIES</Text>
    <Text style={styles.metaLine}>PROTOCOL: MYTH–SCIENCE SYNTHESIS ENABLED</Text> */}
    <Text style={styles.metaLine}>PUBLIC READINESS: LOW • CONTAMINATION RISK: HIGH</Text>
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
  {/* Archive Note */}
  <Text style={styles.metaLine}>ARCHIVAL NOTE — REAL / TRADITION / SYNTHESIS</Text>
  <Text style={styles.metaLine}>This record integrates the following layers:</Text>
  <Text style={styles.metaLine}>• Established archaeology and geology</Text>
  <Text style={styles.metaLine}>• Scriptural tradition (covenant chronology + flood memory)</Text>
  <Text style={styles.metaLine}>• Cultural mythology (compressed memory signals)</Text>
  <Text style={styles.metaLine}>• Speculative reconstruction (continuity modeling)</Text>
  <Text style={styles.metaLine}>Objective: continuity, not conversion.</Text>
  <Text style={styles.metaLine}>Classification does not imply certainty — only relevance.</Text>

  <View style={styles.divider} />

  {/* File Header Meta */}
    <CollapsibleDossier title="FILE: LABYRINTH OF HAWARA" userClearance={clearance}>
    <Text style={styles.body}>
  {/* <Text style={styles.metaLine}>FILE: LABYRINTH OF HAWARA{"\n\n"}</Text> */}
  <Text style={styles.metaLine}>CLASSIFICATION: PRE-FLOOD MEGASTRUCTURE / VAULT OF RECORDS{"\n\n"}</Text>
  <Text style={styles.metaLine}>STATUS: SEALED (CONDITIONAL ACCESS){"\n\n"}</Text>
  <Text style={styles.metaLine}>CROSS-REF: ATLANTIS • SHEMSU HOR • OPHIR / OPHIRA{"\n"}</Text>
    </Text>
  </CollapsibleDossier>

  {/* Timeline / Zep Tepi */}
  <CollapsibleDossier title="CHRONOLOGY — ZEP TEPI TO DYNASTIC EGYPT (SYNTHESIS)" clearanceRequired={CLEARANCE.RESTRICTED}userClearance={clearance}>
<Text style={styles.body}>
  300,000 BP — Homo sapiens appear. This window is filed as Zep Tepi (“The First Time”).{"\n\n"}

  Scriptural anchor: Adam and Eve depart Eden (tradition places Eden in what is now Missouri, United States).
  They roam and spread with their children. Over generations, their offspring disperse widely across the earth,
  including Africa. Covenant memory continues in some lines and collapses in others.{"\n\n"}

  70,000 BP — Major global migration. Humanity expands across Africa, Europe, and Asia. Populations settle,
  trade, and develop early regional identities.{"\n\n"}

  40,000 BP — Neanderthals disappear. Homo sapiens become the only human species.
  Civilizations exist across the world with structure comparable to later Egyptians, Greeks, and Romans —
  advanced in astronomy, agriculture, governance, and navigation.{"\n\n"}

  In this era, the Shemsu Hor rise — the Followers of Horus — remembered later as a pre-dynastic rulership
  epoch that lasted millennia. Horus is not yet a “god” in the later Egyptian sense, but a dominant figure,
  ideology, or leadership line whose influence persists into memory.{"\n\n"}

  Atlantis rises during the green Sahara age. The Sahara is forested and fertile before later desertification.
  As generations pass, humanity becomes increasingly wicked — following philosophers and symbolic rulers instead
  of prophets of God.{"\n\n"}

  12,900 BP — The Younger Dryas begins. Noah warns the world and calls the people to repentance.
  They do not listen. God sends judgment. A catastrophic impact event (recorded in memory as a comet in later
  depictions) triggers the collapse: climate disruption, meltwater, and the Flood.{"\n\n"}

  During the final years before the Flood, the people of Egypt construct the Labyrinth as a Hall of Records —
  a deliberate preservation of knowledge, law, and instruction for the post-Flood world. At its core is placed
  a massive iron ring structure — the Engine — intended to endure when everything else fails.{"\n\n"}

  Above the Labyrinth, the Sphinx is constructed as the marker: a lion guardian facing east toward the dawn,
  aligned to lion symbolism in the sky (Leo), with the entrance locus under the right paw.{"\n\n"}

  11,700 BP — Younger Dryas ends / Holocene begins. Noah’s Ark comes to rest (traditions place it in Turkey /
  the Near East; some place it toward the mountains beyond). Humanity repopulates the earth. Atlantis is gone,
  buried beneath sea or sand — along with forests and cities.{"\n\n"}

  9,600 BCE — Göbekli Tepe era. Monumental building returns as survivors reorganize, carrying echoes of the
  First Time but not its full continuity.{"\n\n"}

  7,000 BCE — Nabta Playa era. Astronomical marking systems appear again in North Africa; seasonal measurement
  is rebuilt.{"\n\n"}

  6,000 BCE — Pre-dynastic Egypt. Teachers of First-Time knowledge arrive searching for what was preserved.
  They find the Sphinx already buried by sand. They excavate the head. Egypt adopts the monument as its own and
  resists deeper excavation. The Labyrinth is located and partially unburied, but access remains controlled.
  Priestly guardianship begins.{"\n\n"}

  3,100 BCE — Dynastic Egypt. The Teachers become legends; later memory turns them into gods.
  The post-Flood civilization now wears the symbols of the pre-Flood world without fully understanding them.{"\n\n"}

  2,500 BCE — Official chronology layer. Egypt claims major monuments under state narrative.
  Greek writers later report the Labyrinth as beyond comprehension — not knowing it predates the comfortable story.
</Text>
  </CollapsibleDossier>

  {/* Atlantis */}
  <CollapsibleDossier title="ATLANTIS — PRIMARY METROPOLIS (CONTINUITY MODEL)" userClearance={clearance}>
<Text style={styles.body}>
  Atlantis is filed as the dominant metropolis of the First Time — the peak city of the green-Sahara age.{"\n\n"}

  It is characterized by:{"\n"}
  • centralized scholarship and law{"\n"}
  • sea mastery and long-range trade{"\n"}
  • engineering that outpaced later post-Flood capability{"\n\n"}

  As righteousness collapsed, Atlantis became the symbol of civilization without God: power without repentance,
  knowledge without covenant, order without prophets.{"\n\n"}

  Atlantis falls in the same global judgment window preserved as flood memory across cultures.
  Its disappearance is not only geographic — it is historical: the severing of continuity.
</Text>
  </CollapsibleDossier>

  {/* Shemsu Hor */}
  <CollapsibleDossier title="SHEMSU HOR — FOLLOWERS OF HORUS (PRE-DYNASTIC SIGNAL)" userClearance={clearance}>
<Text style={styles.body}>
  The Shemsu Hor (“Followers of Horus”) are recorded as a pre-dynastic rulership era — not merely myth,
  but a compressed memory of an older leadership order before Egypt’s official dynastic history begins.{"\n\n"}

  They are associated with:{"\n"}
  • advanced stellar calendars and seasonal measurement{"\n"}
  • sacred mathematics and monumental planning{"\n"}
  • the guardian doctrine: order versus chaos{"\n\n"}

  In this record, Horus represents a dominant figure, lineage, or philosophy from the First Time whose symbol
  persists into later Egyptian religion. Egypt inherits the mask and calls it a god; the original was older.
</Text>
  </CollapsibleDossier>

  {/* Labyrinth */}
  <CollapsibleDossier title="THE LABYRINTH — VAULT OF RECORDS (HALL OF PRESERVATION)" userClearance={clearance}>
<Text style={styles.body}>
  The Labyrinth is the Hall of Records built at the end of the First Time to preserve knowledge through the Flood.{"\n\n"}

  Ancient descriptions consistently report:{"\n"}
  • thousands of rooms and corridors{"\n"}
  • multiple levels above and below ground{"\n"}
  • courts, halls, and roofed passages{"\n"}
  • a scale that overwhelmed later observers{"\n\n"}

  Classical authors described it in extraordinary detail:{"\n"}
  • Herodotus (5th century BCE) claimed it surpassed the pyramids and was overwhelming in scale{"\n"}
  • Strabo described multiple courts, halls, and roofed passages{"\n"}
  • Diodorus Siculus emphasized its sacred and administrative nature{"\n"}
  • Pliny the Elder confirmed its immense complexity{"\n\n"}

  At the center lies the anomaly: a massive metallic iron ring structure placed as the enduring core.
  It is not decorative. It is the preserved heart of the Records — built to outlast the world.
</Text>
  </CollapsibleDossier>

  {/* Ancient testimony */}
  <CollapsibleDossier title="ANCIENT TESTIMONY — CLASSICAL ACCOUNTS (EFFECT WITNESS)" userClearance={clearance}>
<Text style={styles.body}>
  The ancient witnesses matter because they describe the Labyrinth as something that did not fit the world they lived in.{"\n\n"}

  Herodotus called it greater than the pyramids. Strabo and Diodorus described its courts and passages.
  Pliny confirmed its complexity.{"\n\n"}

  Their accounts preserve the same conclusion: the Labyrinth was already ancient when later civilizations found it,
  and it was built for a purpose beyond ordinary monuments.
</Text>
  </CollapsibleDossier>

  {/* Sphinx */}
  <CollapsibleDossier title="THE SPHINX — CELESTIAL MARKER / SAND BURIAL CYCLE" userClearance={clearance}>
<Text style={styles.body}>
  The Great Sphinx is the celestial marker placed above the Labyrinth to identify the sealed locus without exposing it.{"\n\n"}

  It is built as a lion guardian facing east — dawn-facing and lion-sky aligned — anchoring the “Leo” symbolism
  that survives into later ages.{"\n\n"}

  After the Flood and the long climate shifts that follow, sand advances and the marker becomes buried naturally.
  This burial preserves the seal without armies, politics, or conquest.{"\n\n"}

  Later Egyptians excavate only what they can claim and worship: the head. They resist deeper excavation.
  The structure becomes a state icon — but it predates the state.{"\n\n"}

  Entrance tradition: the primary access point lies beneath the right paw.
</Text>
  </CollapsibleDossier>

  {/* Event cluster */}
  <CollapsibleDossier title="EVENT CLUSTER — YOUNGER DRYAS / FLOOD MEMORY (OPERATIONAL SUMMARY)" userClearance={clearance}>
<Text style={styles.body}>
  This record treats the Younger Dryas catastrophe and the Flood as the same judgment window: a global reset that ends the First Time.{"\n\n"}

  Noah warns the world and calls for repentance. The people refuse. Judgment follows.{"\n\n"}

  Worldwide outcomes preserved in collective memory:{"\n"}
  • abrupt climate disruption{"\n"}
  • meltwater and sea-level rise{"\n"}
  • civilizational collapse{"\n"}
  • synchronized flood traditions across cultures{"\n\n"}

  The operational conclusion is not negotiable inside this archive: the First World fell, and the Hall of Records
  was built because righteous continuity had to survive the waters.
</Text>
  </CollapsibleDossier>

  {/* Teachers */}
  <CollapsibleDossier
    title="RESTRICTED — THE FIRST TIME TEACHERS (LEGACY TRANSFER)"
    userClearance={clearance}
  >
<Text style={styles.body}>
  The “Teachers” were not gods in life. They were bearers of knowledge who helped rebuild
  after collapse.{"\n\n"}

  Ra — Astronomy and Timekeeping{"\n"}
  Thoth — Writing and Systems{"\n"}
  Osiris — Law and Judgment{"\n"}
  Isis — Medicine and Preservation{"\n"}
  Horus — Stewardship and Defense{"\n"}
  Ptah — Engineering and Construction{"\n"}
  Ma’at — Moral and Cosmic Law{"\n\n"}

  Over time, memory compressed instruction into divinity. When the lesson survives but
  the teacher does not, the teacher becomes a god in legend.
</Text>
  </CollapsibleDossier>

  {/* Omega-Black Rosetta */}
  <CollapsibleDossier
    title="OMEGA–BLACK — ROSETTA ENGINE NOTES"
    clearanceRequired={CLEARANCE.OMEGA_BLACK}
    userClearance={clearance}
  >
    <Text style={styles.body}>
      The Rosetta Engine is a conditional framework: a key binding language, number, sky-cycles, and record-lock alignment.{"\n\n"}
      The Engine yields nothing to brute force. This is intentional. Knowledge is conditional.{"\n\n"}
      Hypothesis tags:{"\n"}
      • ring-core anomaly signature persists across eras{"\n"}
      • calibration doctrine prevents conquest-extraction{"\n"}
      • guided rediscovery produces mythology as camouflage{"\n"}
    </Text>

    <View style={styles.subDivider} />

    <Text style={styles.quote}>
      “Let those who seek power be lost.{"\n"}
      Let those who seek understanding pass.”
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
