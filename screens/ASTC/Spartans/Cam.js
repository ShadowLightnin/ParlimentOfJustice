import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Cam = () => {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", () => {
      setWindowWidth(Dimensions.get("window").width);
    });
    return () => subscription?.remove();
  }, []);

  const isDesktop = windowWidth >= 768;

  const armors = [
    {
      name: "Court Chief",
      copyright: "William Cummings",
      image: require("../../../assets/Armor/Cam4.jpg"),
      clickable: true,
    },
    {
      name: "Court Chief",
      copyright: "William Cummings",
      image: require("../../../assets/Armor/Cam3.jpg"),
      clickable: true,
    },
    {
      name: "Court Chief",
      copyright: "William Cummings",
      image: require("../../../assets/Armor/Cam5.jpg"),
      clickable: true,
    },
    {
      name: "",
      image: require("../../../assets/Armor/Cam.jpg"),
      clickable: true, // No copyright
    },
    {
      name: "Court Chief",
      copyright: "William Cummings",
      image: require("../../../assets/Armor/Cam2.jpg"),
      clickable: true, // With copyright
    },
  ];

  const renderArmorCard = (armor, index) => (
    <TouchableOpacity
      key={`${armor.name || "Unnamed"}-${armor.copyright || index}`}
      style={[
        styles.card(isDesktop, windowWidth),
        armor.clickable ? styles.clickable : styles.notClickable,
      ]}
      onPress={() => armor.clickable && console.log(`${armor.name || "Unnamed"} clicked`)}
      disabled={!armor.clickable}
      activeOpacity={0.9}
    >
      <Image source={armor.image} style={styles.armorImage} />
      <View style={styles.cardOverlay} />
      <Text style={styles.cardName}>
        {armor.copyright
          ? `© ${armor.name || "Unknown"}; ${armor.copyright}`
          : armor.name || ""}
      </Text>
      {!armor.clickable && (
        <Text style={styles.disabledText}>Not Clickable</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* HEADER */}
        <View style={styles.headerOuter}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={styles.headerGlass}>
              <Text style={styles.title}>Court Chief</Text>
              <Text style={styles.subtitle}>Sportsman • Jumper • Humor</Text>
            </View>
          </View>
        </View>

        {/* SPARTAN ARMORY */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spartan Armory</Text>
          <View style={styles.sectionDivider} />
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            snapToInterval={windowWidth * 0.7 + 20}
            decelerationRate="fast"
          >
            {armors.map((armor, index) => renderArmorCard(armor, index))}
          </ScrollView>
        </View>

        {/* <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>About Me</Text>
          <Text style={styles.aboutText}>
          Cam Paul, known as Court Chief, is a dynamic and inspiring leader, the heart of The Advanced Spartan 3 Corp, a trio of elite warriors navigating Zion City’s fractured landscape. His presence is energetic and commanding, a blend of athletic prowess and battlefield savvy that makes him a natural captain for his squad. Behind his vibrant pink Halo-inspired armor, Cam is passionate, dependable, and fiercely loyal to his teammates Ben Preston “Chemoshock” and Alex Croft “Huntsman,” seeing their skills as vital to their shared mission. He draws strength from his love of basketball and Halo, infusing his leadership with a competitive spirit and strategic flair. Off duty, he’s a custodian by trade, keeping spaces clean and orderly, and a jumper by talent, always ready to leap into action—literally or figuratively—but his focus on teamwork can sometimes make him overly reliant on his crew.          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Cam grew up in Zion City’s Terrestrial sector, in a working-class family that valued grit and community. As a kid, he was obsessed with basketball, spending hours on the court perfecting his jumps, and Halo, where he honed his tactical mind playing as a Spartan. His athleticism and gaming skills shaped him into a leader, always rallying his friends for pickup games or co-op missions. Working as a custodian in his civilian life, Cam learned the value of keeping things in order, a trait that carried over into his warrior role.          </Text>
          <Text style={styles.aboutText}>
          When Zion City’s lower sectors spiraled into chaos, Cam’s skills were put to the test. During a cleanup shift in the Telestial sector, he leapt into action against looters, his natural jumping ability letting him scale obstacles and take charge. This moment sparked his recruitment into The Advanced Spartan 3 Corp, where he donned his pink Halo 5 armor—tweaked with a touch of Monster Hunter flair—to lead Ben and Alex. His love for Halo inspired his leadership style, treating every mission like a campaign, while his basketball roots kept him agile and team-focused.          </Text>
          <Text style={styles.aboutText}>
          Cam formed a tight bond with Ben, a chemical genius, and Alex, a hunter-mechanic, seeing their trio as a perfect unit: his leadership, Ben’s constructs, and Alex’s marksmanship. Together, they tackle threats from the Outer Darkness sector, but Cam’s custodian mindset pushes him to “clean up” Zion City’s messes, both literal and metaphorical, sometimes stretching their small team thin.          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Cam’s armor and athletic background grant him a range of powers focused on leadership, mobility, and combat, reflecting his basketball and Halo passions:          </Text>
          <Text style={styles.aboutText}>
          Enhanced Jumping: Can leap great distances and heights with precision, inspired by basketball dunks and Halo’s Spartan agility, allowing him to reach vantage points or close gaps in battle.          </Text>
          <Text style={styles.aboutText}>
          Tactical Command: Leads his team with Halo-honed strategy, boosting their coordination and morale, making quick calls that turn the tide of fights, much like a point guard on the court.          </Text>
          <Text style={styles.aboutText}>
          Energy Slam: Channels energy into a ground-pounding jump, creating shockwaves that knock back enemies or clear debris, a nod to his custodian role and Halo’s explosive flair.          </Text>
          <Text style={styles.aboutText}>
          Combat Reflexes: Moves with the speed and precision of a seasoned soldier, wielding melee weapons or firearms with skill, blending basketball agility with Spartan training.          </Text>
          <Text style={styles.aboutText}>
          Team Synergy: Amplifies his teammates’ abilities when near them, reflecting his leadership and trust in Ben’s constructs and Alex’s arrows, a power rooted in his team-first mentality.          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team          </Text>
          <Text style={styles.aboutText}>
          Cam is the drive and coordination of The Advanced Spartan 3 Corp, leading with a mix of Halo-inspired strategy and basketball hustle. He’s competitive, upbeat, and deeply loyal to Ben and Alex, seeing their trio as unbeatable when synced. His relationship with Ben is one of trust, relying on his constructs for defense, while with Alex, it’s a brotherly bond, matching his jumps with Alex’s arrows.          </Text>
          <Text style={styles.aboutText}>
          In the broader context of Zion City, Cam connects with the Titans’ leaders like Spencer and Jared, sharing their protective instincts, but his smaller squad operates independently, tackling specific threats. His love for Halo fuels his tactical mind, while his custodian role reflects his desire to “clean up” the city, one leap at a time. His ultimate goal is to unify his team’s strengths to restore order in Zion City, proving that leadership and teamwork can overcome any chaos.          </Text>
        </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // BASE
  container: {
    flex: 1,
    backgroundColor: "#05020b",
  },
  scrollContainer: {
    paddingBottom: 30,
  },

  // HEADER
  headerOuter: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: "rgba(40, 5, 35, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(255, 182, 239, 0.9)",
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 22,
    color: "#ffe9ff",
  },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(35, 6, 40, 0.94)",
    borderWidth: 1,
    borderColor: "rgba(255, 105, 200, 0.75)",
    shadowColor: "#ff6ad5",
    shadowOpacity: 0.5,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#ffe9ff",
    textAlign: "center",
    textShadowColor: "#ff6ad5",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#ffb3f0",
    textAlign: "center",
    letterSpacing: 1,
    textTransform: "uppercase",
  },

  // SECTION
  section: {
    marginTop: 24,
    marginHorizontal: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "rgba(24, 3, 28, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(255, 105, 200, 0.45)",
    shadowColor: "#ff6ad5",
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffe9ff",
    textAlign: "center",
    textShadowColor: "#ff6ad5",
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
    backgroundColor: "rgba(255, 105, 200, 0.9)",
  },

  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 6,
    paddingTop: 4,
    alignItems: "center",
  },

  // ARMOR CARDS
  card: (isDesktop, w) => ({
    width: isDesktop ? w * 0.28 : SCREEN_WIDTH * 0.8,
    height: isDesktop ? SCREEN_HEIGHT * 0.7 : SCREEN_HEIGHT * 0.65,
    borderRadius: 22,
    overflow: "hidden",
    marginRight: 18,
    backgroundColor: "rgba(10, 2, 14, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(255, 120, 210, 0.95)",
    shadowColor: "#ff6ad5",
    shadowOpacity: 0.7,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  }),
  armorImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  clickable: {},
  notClickable: {
    opacity: 0.75,
  },
  cardName: {
    position: "absolute",
    bottom: 10,
    left: 12,
    right: 12,
    fontSize: 12,
    color: "#ffe9ff",
    fontWeight: "600",
    textShadowColor: "#000",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
  },
  disabledText: {
    position: "absolute",
    top: 10,
    right: 12,
    fontSize: 10,
    color: "#ffb3f0",
    fontWeight: "600",
  },

  // ABOUT (matching your Will style, recolored)
  aboutSection: {
    marginTop: 28,
    marginHorizontal: 12,
    marginBottom: 32,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: "rgba(18, 2, 24, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(255, 105, 200, 0.5)",
    shadowColor: "#ff6ad5",
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: "#ffe9ff",
    textAlign: "center",
    textShadowColor: "#ff6ad5",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  aboutText: {
    fontSize: 14,
    color: "#ffe0fb",
    lineHeight: 20,
    marginTop: 6,
    textAlign: "left",
  },
});

export default Cam;
