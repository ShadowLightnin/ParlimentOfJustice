import React from "react";
import { 
  View, Text, ImageBackground, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const ErevosScreen = () => {
  const navigation = useNavigation();
  const isDesktop = SCREEN_WIDTH > 600;
  const imageSize = isDesktop ? SCREEN_WIDTH * 0.6 : SCREEN_WIDTH * 0.9;
  const imageHeight = isDesktop ? SCREEN_HEIGHT * 0.5 : SCREEN_HEIGHT * 0.6;

  return (
    <ImageBackground
      source={require("../../../assets/BackGround/BigBad.jpg")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.headerContainer}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Erevos</Text>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={require("../../../assets/Villains/Erevos.jpg")}
              style={[styles.armorImage, { width: imageSize, height: imageHeight }]}
            />
          </View>

          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>About Me</Text>
            <Text style={styles.aboutText}>
            Once a prehistoric warrior named Erevos, he gained immortality after 
            a cosmic artifact crash-landed on Earth during his early reign. With 
            an unending life and countless centuries of combat, strategy, and conquest, 
            Erevos has influenced history from the shadows, manipulating empires and 
            civilizations to serve his purpose. His ultimate goal is to mold the world 
            into a brutal hierarchy, where only the strongest survive under his rule. 
            To him, the Parliament of Justice’s notion of order and protection is unnatural, 
            as he believes only those who have earned the right should wield power.           
            </Text>
            <Text style={styles.aboutText}>
            • Powers and Abilities:

            </Text>
            <Text style={styles.aboutText}>
            • Immortality: Cannot be killed by conventional means; he regenerates from injuries and has survived countless battles.

            </Text>
            <Text style={styles.aboutText}>
            • Master Tactician: Possesses unparalleled knowledge of combat, warfare, and strategy gained from centuries of experience.

            </Text>
            <Text style={styles.aboutText}>
            • Enhanced Physique: Physical strength, speed, and agility surpassing that of any human.

            </Text>  
            <Text style={styles.aboutText}>
            • Artifact Control: Wields artifacts from ancient civilizations that grant powers, including telekinesis, energy projection, and mind control.

            </Text>  
            <Text style={styles.aboutText}>
            • Influence Network: Has secret loyalists planted across the world, from influential leaders to hidden assassins, ready to act at his command.

            </Text>  
            <Text style={styles.aboutText}>
            Erevos’s story:

            </Text>  

            <Text style={styles.aboutText}>
            Erevos the Eternal is a dark, ancient figure who has haunted the world across the millennia. Inspired by Vandal Savage from Young Justice, Erevos’s origins lie in a blend of tragedy, ambition, and insatiable desire for power, leading him to become an unstoppable adversary for the Parliament of Justice and other heroes alike.

            </Text> 
            <Text style={styles.aboutText}>
            1. Origins in the Ancient World
Thousands of years ago, Erevos was a powerful warrior and chieftain in a thriving, yet primitive society. Known by his original name, Erevan, he was respected for his unmatched strength and tactical genius. During a mysterious celestial event—a comet passing close to Earth—Erevan was struck by its cosmic energy. The impact should have been lethal, but instead, it altered his very essence, granting him immense strength, unbreakable resilience, and, most notably, immortality. As he survived this event, he took on a new name, Erevos the Eternal.

            </Text> 
            <Text style={styles.aboutText}>
            2. The Rise of a Tyrant
With his newfound powers and eternal life, Erevos quickly seized control over neighboring tribes, crushing opposition and uniting vast territories under his rule. As civilizations developed, he used his wisdom, manipulation, and charisma to influence key figures, often posing as a god, prophet, or king. He guided the rise and fall of empires, covertly orchestrating wars and alliances that reshaped history to suit his vision of a perfect world under his dominance.

            </Text> 
            <Text style={styles.aboutText}>
            3. Building an Eternal Empire
Over centuries, Erevos built secret societies and cults in every corner of the globe. These hidden factions, bound by loyalty and mystique, served as his eyes, ears, and enforcers. His agents influenced the advancement of science, alchemy, warfare, and religion, all while spreading his dark legacy and preparing humanity for the “Eternal Empire.” Erevos believed that only he, with his unparalleled wisdom and experience, was worthy of uniting and ruling humankind.

            </Text> 
            <Text style={styles.aboutText}>
            4. The Parliament of Justice
As the world advanced, Erevos’s ambition clashed with growing factions of heroes and guardians. Among them, the Parliament of Justice became his greatest threat—a coalition dedicated to protecting humanity from tyrants and dark forces. This group of heroes threatened Erevos’s plans for a unified, subjugated world. He saw them as a temporary setback in his eternal scheme, a nuisance that had to be eradicated before his final rise to power.

            </Text> 
            <Text style={styles.aboutText}>
            5. The Pursuit of Ultimate Power
Though immortal, Erevos’s powers are not boundless. To reach his true potential, he has sought relics, artifacts, and cosmic knowledge to amplify his abilities. He believes he can achieve a god-like state beyond even his present form, becoming an entity capable of controlling fate, time, and space itself. To this end, he has manipulated countless conflicts, created vast armies, and even engaged in dark rituals to siphon the strength and life-force from others, including heroes from the Parliament of Justice, whom he views as his most powerful adversaries.

            </Text> 
            <Text style={styles.aboutText}>
            6. Personal Code and Vision
Erevos is deeply convinced that humanity is doomed to chaos and self-destruction without his guidance. He sees himself as a necessary evil, a force of order meant to bring peace by any means necessary. Though ruthless, he operates by his own twisted moral code, believing that his actions are justified because they serve the greater good as he defines it. He is cold, calculating, and entirely without remorse but has an underlying tragic dimension; in his mind, he sees himself as humanity’s savior.

            </Text> 
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};
const styles = StyleSheet.create({
    background: {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      resizeMode: "cover",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      flex: 1,
    },
    scrollContainer: {
      paddingBottom: 20,
    },
    headerContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: "#333",
    },
    backButton: {
      padding: 10,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      borderRadius: 5,
    },
    backButtonText: {
      fontSize: 24,
      color: "#fff",
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: "#ff3131",
      textAlign: "center",
      flex: 1,
    },
    imageContainer: {
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
      backgroundColor: "#111",
      paddingVertical: 30,
      borderRadius: 20,
    },
    armorImage: {
      resizeMode: "contain",
    },
    aboutSection: {
      marginTop: 40,
      padding: 20,
      backgroundColor: "#222",
      borderRadius: 15,
    },
    aboutHeader: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#ff3131",
      textAlign: "center",
    },
    aboutText: {
      fontSize: 16,
      color: "#fff",
      textAlign: "center",
      marginTop: 10,
    },
  });
  
export default ErevosScreen;
