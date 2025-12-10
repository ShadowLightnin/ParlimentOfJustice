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

const Alex = () => {
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
      name: "Huntsman",
      copyright: "William Cummings",
      image: require("../../../assets/Armor/Alex3.jpg"),
      clickable: true,
    },
    {
      name: "",
      image: require("../../../assets/Armor/Alex.jpg"),
      clickable: true,
    },
    {
      name: "Huntsman",
      copyright: "William Cummings",
      image: require("../../../assets/Armor/Alex2.jpg"),
      clickable: true,
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
              <Text style={styles.title}>Huntsman</Text>
              <Text style={styles.subtitle}>Hunter • Compassionate • Fun</Text>
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
          Alex Croft, known as Huntsman, is a sharp-eyed and relentless tracker, the precision striker of The Advanced Spartan 3 Corp, a trio of elite warriors operating in Zion City’s turbulent sectors. His presence is focused and predatory, a blend of hunting instinct and mechanical finesse that makes him a deadly asset to his team. Behind his purple Halo-inspired armor, Alex is observant, practical, and fiercely loyal to his squadmates Cam Paul “Court Chief” and Ben Preston “Chemoshock,” viewing their leadership and constructs as the perfect setup for his shots. He draws passion from his love of Monster Hunter, Halo, hunting, guns, and mechanics, merging their rugged and tactical elements into his craft. Off the battlefield, he’s a tinkerer and outdoorsman, often tuning his gear or scouting the wilds, but his lone-wolf tendencies can sometimes distance him from the team.          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Alex grew up on the outskirts of Zion City’s Terrestrial sector, in a family of hunters and mechanics who lived close to the land. As a kid, he was obsessed with Monster Hunter, mastering its bow-based combat, and Halo, where he admired the Spartans’ precision with weapons. His real-world hunting skills with guns and his knack for fixing anything mechanical rounded out his talents, making him a versatile survivor. He spent his youth tracking game and tinkering with old rifles, dreaming of bigger challenges.          </Text>
          <Text style={styles.aboutText}>
          When Zion City’s lower sectors descended into chaos, Alex’s skills were put to the test. During a patrol in the Telestial sector, he stumbled into a skirmish and instinctively generated an energy arrow from his bow, a power sparked by his intense focus. This moment earned him a spot in The Advanced Spartan 3 Corp, where he crafted his purple Halo 5 armor with 20% Monster Hunter flair to wield his energy arrows in battle. Teaming up with Cam, whose jumps set up his shots, and Ben, whose constructs provided cover, Alex found a purpose in hunting Zion City’s threats.          </Text>
          <Text style={styles.aboutText}>
          His bond with Cam and Ben is tight but practical—Cam directs his aim, while Ben shields his flanks, letting Alex focus on the kill. His Monster Hunter love drives his rugged approach, while Halo sharpens his precision, and his mechanic skills keep their gear in top shape. But his hunter’s instinct to go solo sometimes clashes with Cam’s team-first strategy.          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Alex’s armor and hunting expertise grant him a range of powers focused on marksmanship, tracking, and adaptability, reflecting his Monster Hunter and Halo passions:          </Text>
          <Text style={styles.aboutText}>
          Energy Arrows: Can generate and control arrows made of solid energy, fired from a bow or projected directly from his armor, with adjustable properties (e.g., explosive tips, piercing shots) inspired by Monster Hunter’s elemental arrows and Halo’s plasma tech.          </Text>
          <Text style={styles.aboutText}>
          Exceptional Marksmanship: Hits targets with uncanny accuracy, whether at range or in motion, honed by years of hunting and gaming, making him the squad’s sharpshooter.          </Text>
          <Text style={styles.aboutText}>
          Hunter’s Instinct: Tracks enemies and anticipates movements with heightened senses, a skill drawn from real-world hunting and Monster Hunter’s monster-tracking mechanics.          </Text>
          <Text style={styles.aboutText}>
          Mechanical Precision: Repairs and modifies gear on the fly, enhancing his bow or allies’ equipment, a nod to his mechanic background and Halo’s tech-savvy Spartans.          </Text>
          <Text style={styles.aboutText}>
          Offensive Synergy: His arrows amplify Cam’s slams and Ben’s constructs when coordinated, piercing through defenses or detonating on impact, reflecting his role as the team’s finisher.          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team          
          </Text>
          <Text style={styles.aboutText}>
          Alex is the precision and offense of The Advanced Spartan 3 Corp, complementing Cam’s leadership with his shots and Ben’s constructs with his strikes. He’s quiet, pragmatic, and deeply loyal to his squad, seeing their trio as a hunting pack—Cam the alpha, Ben the trapper, and himself the stalker. His relationship with Cam is one of trust, following his lead while adding his own flair, while with Ben, it’s a practical alliance, syncing his arrows with Ben’s shields.          </Text>
          <Text style={styles.aboutText}>
          In Zion City, Alex connects with the Titans’ combatants like Ben Briggs and Jared, sharing their focus on action, but his smaller team prefers surgical strikes over large-scale battles. His Monster Hunter fandom fuels his rugged tenacity, while Halo sharpens his aim, and his mechanic skills keep them operational. His ultimate goal is to hunt down Zion City’s threats with his team, proving that precision and grit can restore balance, while keeping his squad sharp.          </Text>
        </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // BASE
  container: {
    flex: 1,
    backgroundColor: "#05020a", // deep night purple-black
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
    backgroundColor: "rgba(10, 4, 24, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(204, 153, 255, 0.9)", // light lilac edge
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 22,
    color: "#f5e9ff",
  },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(20, 8, 48, 0.96)",
    borderWidth: 1,
    // “purple camo” vibe via multitone border & glow
    borderColor: "rgba(151, 71, 255, 0.9)",
    shadowColor: "#c77dff",
    shadowOpacity: 0.6,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#f5e9ff",
    textAlign: "center",
    textShadowColor: "#b388ff",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#d0b3ff",
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
    backgroundColor: "rgba(14, 5, 35, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(162, 107, 255, 0.6)",
    shadowColor: "#9c4dff",
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f7f0ff",
    textAlign: "center",
    textShadowColor: "#b388ff",
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
    // slightly broken-up gradient feel for “camo” hint
    backgroundColor: "rgba(178, 102, 255, 0.9)",
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
    backgroundColor: "rgba(8, 3, 20, 0.96)",
    borderWidth: 1,
    // edge looks like purple cam stripe on black
    borderColor: "rgba(171, 71, 188, 0.95)",
    shadowColor: "#ce93d8",
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
    color: "#f7f0ff",
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
    color: "#ffb3e6",
    fontWeight: "600",
  },

  // ABOUT (purple-tuned for later if you uncomment)
  aboutSection: {
    marginTop: 28,
    marginHorizontal: 12,
    marginBottom: 32,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: "rgba(10, 4, 28, 0.97)",
    borderWidth: 1,
    borderColor: "rgba(171, 71, 188, 0.6)",
    shadowColor: "#ba68c8",
    shadowOpacity: 0.3,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: "#f7f0ff",
    textAlign: "center",
    textShadowColor: "#b388ff",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  aboutText: {
    fontSize: 14,
    color: "#e4d7ff",
    lineHeight: 20,
    marginTop: 6,
    textAlign: "left",
  },
});

export default Alex;
