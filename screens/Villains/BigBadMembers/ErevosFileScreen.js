import React, { useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Audio } from "expo-av";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// keep palette consistent
const COLORS = {
  void: "rgba(0, 0, 0, 0.90)",
  gunmetal: "rgba(18, 18, 22, 0.96)",
  cosmicBlue: "rgba(10, 16, 36, 0.92)",
  royalPurpleEdge: "rgba(59, 28, 90, 0.88)",
  redEdge: "rgba(91, 0, 0, 0.85)",
  text: "#F7F7F7",
  textSoft: "rgba(245, 245, 245, 0.82)",
  header: "#EFE6FF",
};

// optional: subtle “classified ambience”
const FILE_TRACK = {
  label: "OMEGA–BLACK ARCHIVE",
//   source: require("../../../assets/audio/sableEvilish.m4a"), // swap later if you want
};

export default function ErevosFileScreen() {
  const navigation = useNavigation();
  const [sound, setSound] = React.useState(null);

  const unloadSound = useCallback(async () => {
    if (sound) {
      try { await sound.stopAsync(); } catch {}
      try { await sound.unloadAsync(); } catch {}
      setSound(null);
    }
  }, [sound]);

  const playAmbience = useCallback(async () => {
    if (sound) return;
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
        FILE_TRACK.source,
        { isLooping: true, volume: 0.35 }
      );
      setSound(newSound);
      await newSound.playAsync();
    } catch (e) {
      console.error("Failed to play file ambience", e);
    }
  }, [sound]);

  useFocusEffect(
    useCallback(() => {
      playAmbience();
      return () => { unloadSound(); };
    }, [playAmbience, unloadSound])
  );

  const handleBack = async () => {
    await unloadSound();
    navigation.goBack();
  };

  return (
    <ImageBackground
      source={require("../../../assets/BackGround/Enlightened.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <View style={styles.headerGlass}>
            <Text style={styles.title}>PARLIAMENT OF JUSTICE</Text>
            <Text style={styles.subtitle}>OMEGA–BLACK DEEP ARCHIVE</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.doc}>
            <Text style={styles.docTitle}>SUBJECT FILE: EREVOS</Text>

            <View style={styles.metaBlock}>
              <Text style={styles.metaLine}><Text style={styles.metaKey}>Designation:</Text> Erevos Prime</Text>
              <Text style={styles.metaLine}><Text style={styles.metaKey}>Classification:</Text> Immortal Metasapian / Strategic Cosmic Actor</Text>
              <Text style={styles.metaLine}><Text style={styles.metaKey}>Clearance Required:</Text> OMEGA–BLACK</Text>
              <Text style={styles.metaLine}><Text style={styles.metaKey}>Status:</Text> ACTIVE</Text>
              <Text style={styles.metaLine}><Text style={styles.metaKey}>Threat Level:</Text> EXTINCTION-CLASS (CONDITIONAL)</Text>
            </View>

            <Text style={styles.quote}>
              “He is not the architect of evil.{"\n"}He is the man who learned how it begins.”
            </Text>

            <Text style={styles.h}>I. PRE-COVENANT ORIGINS</Text>
            <Text style={styles.p}>
              Erevos was born generations after Adam and Eve departed Eden, during a period when humanity had already begun
              to diverge from covenantal order.
            </Text>
            <Text style={styles.p}>
              Erevos carried a rare hereditary anomaly later designated <Text style={styles.em}>LACOSE</Text>. Lacose was not active. It conveyed no strength,
              longevity, or awareness. At this stage, Erevos was fully mortal.
            </Text>

            <Text style={styles.h}>II. THE METEOR NIGHT (LACOSE ACTIVATION EVENT)</Text>
            <Text style={styles.p}>
              A meteor shower impacted Earth during Erevos’ early adulthood. Analysis confirms the meteors contained
              <Text style={styles.em}> Vortanite</Text> (origin: Melcornia system) and trace energies consistent with pre-Maw resonance.
            </Text>
            <Text style={styles.p}>
              Upon death adjacent to a Vortanite meteor, the meteor’s radiation activated Lacose. Erevos regenerated, resurrected,
              and emerged cognitively altered — the first recorded metasapian awakening in known history.
            </Text>

            <Text style={styles.h}>III. METASAPIAN ASCENSION</Text>
            <Text style={styles.p}>
              Post-activation effects included cellular regeneration, extreme longevity, accelerated cognition, enhanced pattern recognition,
              and strategic foresight beyond baseline humanity. He was not omniscient — he was hyper-adaptive.
            </Text>

            <Text style={styles.h}>IV. OBELISK & THE FIRST PACT</Text>
            <Text style={styles.p}>
              Erevos encountered OBELISK, a Arcane Lord of Chaos, an aggressor threatening Atlantian society. Rather than destroy him, Erevos negotiated.
              This formed a proto-order later known as <Text style={styles.em}>THE ENLIGHTENED</Text>.
            </Text>

            <Text style={styles.h}>V. THE FIRST TIME & THE LABYRINTH</Text>
            <Text style={styles.p}>
              Erevos assisted in the creation and sealing of the Labyrinth of Hawara — a vault of records and contingency against future collapse.
              Using Vortanite meteors from the Meteor Night, he forged the metallic central ring (later called the Rosetta Engine).
            </Text>

            <Text style={styles.h}>VI. THE FLOOD & STRATEGIC WITHDRAWAL</Text>
            <Text style={styles.p}>
              The First World ended in the Great Flood. Erevos survived. Rather than rule the next world, he withdrew, observed, documented, and waited.
            </Text>

            <Text style={styles.h}>VII. Lacose DORMANCY DISCOVERY</Text>
            <Text style={styles.p}>
              Erevos confirmed a critical limitation: Lacose can be inherited without activation. Activation requires exposure to Vortanite radiation
              or Maw-adjacent energies. Without exposure, carriers remain fully human. This is why metasapians remain rare.
            </Text>

            <Text style={styles.h}>VIII. OPHIR CONTACT EVENT</Text>
            <Text style={styles.p}>
              Around 200 BCE Erevos finally tracks down and finds the lost 10 in the Philippines.
              Ophir was built atop a massive Vortanite deposit — the second Meteor Night impact site. Erevos integrated, revealed controlled application,
              and ensured continued isolation until a future convergence point. He stayed with them and taught them for 900 years.
            </Text>

            <Text style={styles.h}>IX. TORATH — THE KNOWN HERALD</Text>
            <Text style={styles.p}>
              Torath knows he is a herald of The Last Reality and The Nothing. Erevos and Torath formed a pact — not of trust, but of delay.
              Erevos later confirmed: heralds serve as accelerants; The Nothing is the terminal state.
            </Text>

            <Text style={styles.h}>X. CURRENT STATUS</Text>
            <Text style={styles.p}>
              Erevos is aware of the Maw, the Pinnacle Universe, the Prime Split, the Last Reality, and the Nothing. He does not seek victory.
              He seeks time.
            </Text>

            <View style={styles.finalBox}>
              <Text style={styles.finalH}>FINAL ASSESSMENT</Text>
              <Text style={styles.finalP}>
                Erevos is not the greatest threat to existence. He is the last line holding it together.
              </Text>
              <Text style={styles.finalQuote}>
                “If Erevos falls, the universe does not become free. It becomes available.”
              </Text>              
              
              <Text style={styles.finalQuote}>
                “Ascendancy was never Erevos’s first plan. It was his last.”
              </Text>
              <Text style={styles.finalTag}>ARCHIVE STATUS: ACTIVE • DISCLOSURE LEVEL: OMEGA–BLACK</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
  overlay: { flex: 1, backgroundColor: COLORS.void },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: COLORS.gunmetal,
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
  },
  title: {
    fontSize: 14,
    fontWeight: "900",
    color: COLORS.header,
    textAlign: "center",
    letterSpacing: 1.3,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 11,
    color: "rgba(255, 235, 235, 0.72)",
    textAlign: "center",
    letterSpacing: 2,
    textTransform: "uppercase",
  },

  scroll: { paddingBottom: 30 },

  doc: {
    marginTop: 16,
    marginHorizontal: 12,
    marginBottom: 32,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: COLORS.gunmetal,
    borderWidth: 1,
    borderColor: COLORS.redEdge,
  },
  docTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.header,
    textAlign: "center",
    letterSpacing: 1,
    marginBottom: 10,
  },

  metaBlock: {
    backgroundColor: COLORS.cosmicBlue,
    borderWidth: 1,
    borderColor: COLORS.royalPurpleEdge,
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
  },
  metaLine: { color: COLORS.textSoft, fontSize: 12, lineHeight: 18, marginTop: 2 },
  metaKey: { color: COLORS.header, fontWeight: "800" },

  quote: {
    color: "rgba(245,245,245,0.78)",
    fontStyle: "italic",
    lineHeight: 20,
    textAlign: "center",
    marginVertical: 10,
  },

  h: {
    marginTop: 14,
    color: COLORS.header,
    fontWeight: "900",
    letterSpacing: 1,
    fontSize: 13,
    textTransform: "uppercase",
  },
  p: {
    marginTop: 8,
    color: COLORS.textSoft,
    fontSize: 14,
    lineHeight: 20,
  },
  em: { fontStyle: "italic", fontWeight: "800", color: "#EFE6FF" },

  finalBox: {
    marginTop: 18,
    borderRadius: 18,
    padding: 14,
    backgroundColor: COLORS.cosmicBlue,
    borderWidth: 1,
    borderColor: COLORS.redEdge,
  },
  finalH: {
    color: COLORS.header,
    fontWeight: "900",
    letterSpacing: 1,
    textAlign: "center",
  },
  finalP: {
    marginTop: 8,
    color: COLORS.textSoft,
    lineHeight: 20,
    textAlign: "center",
  },
  finalQuote: {
    marginTop: 10,
    color: "rgba(245,245,245,0.78)",
    fontStyle: "italic",
    lineHeight: 20,
    textAlign: "center",
  },
  finalTag: {
    marginTop: 10,
    color: "rgba(255, 235, 235, 0.72)",
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    textAlign: "center",
  },
});
