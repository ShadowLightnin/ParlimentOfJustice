import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";

export default function SubjectTerminatedScreen() {
  const navigation = useNavigation();
  const soundRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    const play = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/audio/FirstCM.mp4"),
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );

      if (isMounted) {
        soundRef.current = sound;
      }
    };

    play();

    return () => {
      isMounted = false;
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const onPlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      navigation.reset({
        index: 0,
        routes: [{ name: "EclipseHome" }],
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.fileHeader}>📁 PARLIAMENT OF JUSTICE</Text>
        <Text style={styles.fileSubheader}>
          HIGH COURT DIVISION — TRIBUNAL RECORD
        </Text>

        <View style={styles.divider} />

        <Text style={styles.metaLine}>CASE DOSSIER: ECL-002</Text>
        <Text style={styles.metaLine}>JURISDICTION: EAGLE COMMAND</Text>

        <View style={styles.divider} />

        <Text style={styles.metaBlock}>
          <Text style={styles.label}>SUBJECT: </Text>
          <Text style={styles.value}>Eliptic Dancer{"\n"}</Text>
          <Text style={styles.label}>FACTION: </Text>
          <Text style={styles.value}>Eclipse{"\n"}</Text>
          <Text style={styles.label}>CLASSIFICATION: </Text>
          <Text style={styles.value}>Former Operative{"\n"}</Text>
          <Text style={styles.label}>STATUS: </Text>
          <Text style={styles.value}>TERMINATED FROM ACTIVE SERVICE</Text>
        </Text>

        <View style={styles.divider} />

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>CHARGES FILED</Text>
          <Text style={styles.body}>
            • Negligence of duty{"\n"}
            • Failure of accountability{"\n"}
            • Disregard for the safety and trust of allied personnel{"\n"}
            • Conduct unbecoming of an Eclipse operative
          </Text>

          <View style={styles.subDivider} />

          <Text style={styles.sectionTitle}>TRIBUNAL FINDINGS</Text>
          <Text style={styles.body}>
            The Court of the Parliament of Justice has found the subject in
            violation of the Eclipse Code of Honor and Operational Oath.{"\n\n"}
            The subject’s actions demonstrated a sustained pattern of
            indifference to core responsibilities and a failure to uphold the
            principles sworn to protect.{"\n\n"}
            Trust was compromised.{"\n"}
            Operational integrity was violated.{"\n"}
            Allied cohesion was damaged.{"\n\n"}
            The Tribunal recognizes no place within the Eclipse for conduct that
            places others at risk through inaction or neglect.
          </Text>

          <View style={styles.subDivider} />

          <Text style={styles.sectionTitle}>VERDICT</Text>
          <Text style={styles.body}>
            Effective immediately, the subject is stripped of all rank,
            benefits, titles, and issued equipment.
          </Text>

          <View style={styles.subDivider} />

          <Text style={styles.sectionTitle}>SENTENCE</Text>
          <Text style={styles.body}>
            Eliptic Dancer is henceforth removed from the Eclipse. All
            affiliations with the Parliament of Justice are permanently severed.{"\n\n"}
            The subject is barred from all Eclipse operations and is designated{" "}
            <Text style={styles.inlineStrong}>NON-ACTIVE ENTITY</Text> within
            Parliament records.
          </Text>

          <View style={styles.subDivider} />

          <Text style={styles.sectionTitle}>FINAL ENTRY — COURT DECLARATION</Text>
          <Text style={styles.quote}>
            “Justice is not vengeance.{"\n"}
            Justice is accountability.”
          </Text>
          <Text style={styles.body}>🛡️ — Presiding Authority, Parliament of Justice</Text>

          <View style={styles.subDivider} />

          <Text style={styles.statusLine}>RECORD STATUS: CLOSED</Text>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  card: {
    width: "100%",
    maxHeight: "90%",
    backgroundColor: "#11161d",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#3c4e68",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
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
  },
  metaBlock: {
    color: "#aab7cf",
    fontSize: 12,
    lineHeight: 18,
  },
  label: {
    fontWeight: "600",
    color: "#d7e3ff",
  },
  value: {
    fontWeight: "400",
    color: "#aab7cf",
  },
  scroll: {
    marginTop: 4,
  },
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
    marginTop: 4,
    marginBottom: 4,
    lineHeight: 20,
  },
  inlineStrong: {
    fontWeight: "700",
    color: "#f0d27a",
  },
  statusLine: {
    color: "#f77272",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginTop: 4,
  },
});

