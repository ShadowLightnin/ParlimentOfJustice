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

const BenP = () => {
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
      name: "Chemoshock",
      copyright: "William Cummings",
      image: require("../../../assets/Armor/Benp3.jpg"),
      clickable: true,
    },
    {
      name: "Chemoshock",
      copyright: "William Cummings",
      image: require("../../../assets/Armor/Benp4.jpg"),
      clickable: true,
    },
    {
      name: "",
      image: require("../../../assets/Armor/Benp.jpg"),
      clickable: true,
    },
    {
      name: "Chemoshock",
      copyright: "William Cummings",
      image: require("../../../assets/Armor/Benp2.jpg"),
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
              <Text style={styles.title}>Chemoshock</Text>
              <Text style={styles.subtitle}>Smart • Logical • Amazing</Text>
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
          Ben Preston, known as Chemoshock, is a brilliant and inventive force, the engineering mind of The Advanced Spartan 3 Corp, a trio of elite warriors operating in Zion City’s chaotic sectors. His presence is both cerebral and formidable, a blend of scientific ingenuity and battlefield creativity that makes him a vital asset to his team. Behind his hybrid Halo-Monster Hunter armor, Ben is analytical, resourceful, and fiercely loyal to his squadmates Cam Paul “Court Chief” and Alex Croft “Huntsman,” viewing their leadership and marksmanship as the perfect complement to his constructs. He draws inspiration from his love of Halo and Monster Hunter, merging their high-tech and rugged aesthetics into his work. Off the battlefield, he’s a chemical scientist, tinkering with formulas and gadgets, but his obsession with perfection can sometimes slow his adaptability.          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Ben grew up in Zion City’s Terrestrial sector, in a family of academics and tinkerers who valued knowledge and innovation. As a kid, he was hooked on Halo, mastering its tech-heavy gameplay, and Monster Hunter, where he admired the crafting of weapons and armor from raw materials. His dual passions led him to a career as a chemical scientist, experimenting with energy and compounds in a lab by day. But it was Zion City’s descent into chaos that pushed his skills beyond theory.          </Text>
          <Text style={styles.aboutText}>
          During a Telestial sector incident, Ben was caught in a chemical explosion while analyzing a volatile substance. Instead of harm, the blast awakened his ability to create and manipulate solid energy constructs, a power he refined with his scientific mind. Recruited into The Advanced Spartan 3 Corp, he crafted his Halo 5 armor with a heavy Monster Hunter influence—60% of its design rugged and beastly—to wield his constructs in battle. Teaming up with Cam, whose leadership kept them focused, and Alex, whose hunting skills paired with his defenses, Ben found a purpose in protecting Zion City.          </Text>
          <Text style={styles.aboutText}>
          His bond with Cam and Alex grew strong, with Ben acting as the squad’s shield and innovator, turning energy into walls, weapons, or tools on the fly. His Monster Hunter love shaped his rugged approach, while Halo fueled his precision, but his scientist’s need for control sometimes clashes with the unpredictability of their missions.          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Ben’s armor and scientific genius grant him a range of powers focused on creation, defense, and versatility, reflecting his Halo and Monster Hunter passions:          </Text>
          <Text style={styles.aboutText}>
          Solid Energy Constructs: Can generate and shape solid energy into objects—shields, blades, barriers, or platforms—controlled by his mind and enhanced by his armor’s tech, drawing on Halo’s sci-fi edge and Monster Hunter’s crafting vibe.          </Text>
          <Text style={styles.aboutText}>
          Chemical Manipulation: Uses his scientist background to alter the properties of his constructs (e.g., hardening them, making them explosive), adding tactical flexibility inspired by lab experiments.          </Text>
          <Text style={styles.aboutText}>
          Energy Pulse: Releases a shockwave of energy from his constructs, repelling enemies or clearing space, a nod to Halo’s plasma tech and Monster Hunter’s elemental bursts.          </Text>
          <Text style={styles.aboutText}>
          Engineering Intuition: Analyzes and adapts to battlefield conditions with near-instant problem-solving, repairing gear or countering threats with his constructs, a skill honed by his dual gaming loves.          </Text>
          <Text style={styles.aboutText}>
          Defensive Synergy: His constructs amplify Cam’s slams and Alex’s arrows when used together, reflecting his role as the team’s backbone and his trust in their coordination.          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team          </Text>
          <Text style={styles.aboutText}>
          Ben is the ingenuity and defense of The Advanced Spartan 3 Corp, supporting Cam’s leadership with his constructs and Alex’s marksmanship with his shields. He’s meticulous, creative, and deeply loyal to his squad, seeing their trio as a perfect blend of strategy and action. His relationship with Cam is one of respect, providing the tools for Cam’s plans, while with Alex, it’s a practical partnership, syncing his defenses with Alex’s offense.          </Text>
          <Text style={styles.aboutText}>
          In Zion City, Ben connects with the Titans’ tech-savvy members like William and Myran, sharing their love for innovation, but his smaller team focuses on precision strikes. His Halo fandom drives his precision, while Monster Hunter fuels his rugged resilience, and his scientist mindset pushes him to “experiment” on the battlefield. His ultimate goal is to fortify Zion City with his constructs, proving that science and teamwork can hold back the chaos, while keeping his squad safe.          </Text>
        </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  // BASE
  container: {
    flex: 1,
    backgroundColor: "#020806", // deep green-black
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
    backgroundColor: "rgba(3, 20, 8, 0.95)",
    borderWidth: 1,
    borderColor: "rgba(173, 255, 160, 0.9)",
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 22,
    color: "#e4ffe0",
  },
  headerGlass: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "rgba(6, 30, 12, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(124, 252, 0, 0.75)", // MC green glow
    shadowColor: "#7CFC00",
    shadowOpacity: 0.5,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#e8ffe4",
    textAlign: "center",
    textShadowColor: "#7CFC00",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "#a8ff9b",
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
    backgroundColor: "rgba(4, 22, 10, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(124, 252, 0, 0.45)",
    shadowColor: "#7CFC00",
    shadowOpacity: 0.3,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e8ffe4",
    textAlign: "center",
    textShadowColor: "#7CFC00",
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
    backgroundColor: "rgba(124, 252, 0, 0.9)",
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
    backgroundColor: "rgba(3, 15, 7, 0.96)",
    borderWidth: 1,
    borderColor: "rgba(124, 252, 0, 0.95)",
    shadowColor: "#7CFC00",
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
    color: "#e8ffe4",
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
    color: "#c0ffb0",
    fontWeight: "600",
  },

  // ABOUT (green-tinted, in case you uncomment later)
  aboutSection: {
    marginTop: 28,
    marginHorizontal: 12,
    marginBottom: 32,
    paddingVertical: 18,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: "rgba(3, 18, 8, 0.97)",
    borderWidth: 1,
    borderColor: "rgba(124, 252, 0, 0.5)",
    shadowColor: "#7CFC00",
    shadowOpacity: 0.25,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  aboutHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: "#e8ffe4",
    textAlign: "center",
    textShadowColor: "#7CFC00",
    textShadowRadius: 10,
    textShadowOffset: { width: 0, height: 0 },
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  aboutText: {
    fontSize: 14,
    color: "#d9ffcf",
    lineHeight: 20,
    marginTop: 6,
    textAlign: "left",
  },
});

export default BenP;
