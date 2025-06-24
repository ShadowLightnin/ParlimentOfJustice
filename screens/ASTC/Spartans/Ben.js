import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const BenP = () => {
  const navigation = useNavigation();
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);

  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(Dimensions.get("window").width);
    };
    const subscription = Dimensions.addEventListener("change", updateDimensions);
    return () => subscription?.remove();
  }, []);

  const isDesktop = windowWidth >= 768;

  const armors = [
    { name: "", image: require("../../../assets/Armor/Benp.jpg"), clickable: true },
    { name: "Chemoshock", copyright: "William Cummings", image: require("../../../assets/Armor/Benp2.jpg"), clickable: true },
  ];
  const renderArmorCard = (armor, index) => (
    <TouchableOpacity
      key={`${armor.name}-${armor.copyright || index}`} // Unique key using name, copyright, or index
      style={[styles.card(isDesktop, windowWidth), armor.clickable ? styles.clickable : styles.notClickable]}
      onPress={() => armor.clickable && console.log(`${armor.name || 'Unnamed'} clicked`)}
      disabled={!armor.clickable}
    >
      <Image source={armor.image} style={styles.armorImage} />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        {armor.copyright ? `© ${armor.name || 'Unknown'}; ${armor.copyright}` : (armor.name)}
      </Text>
      {!armor.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Chemoshock</Text>
        </View>

        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            snapToInterval={SCREEN_WIDTH * 0.7 + 20}
            decelerationRate="fast"
          >
            {armors.map(renderArmorCard)}
          </ScrollView>
        </View>

        <View style={styles.aboutSection}>
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
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
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
    backgroundColor: "#0a0a0a",
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
    color: "#00b3ff",
    textAlign: "center",
    flex: 1,
  },
  imageContainer: {
    width: "100%",
    paddingVertical: 20,
    backgroundColor: "#111",
    paddingLeft: 15,
  },
  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
  },
  card: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.3 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.7,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    marginRight: 20,
  }),
  clickable: {
    borderWidth: 2,
  },
  notClickable: {
    opacity: 0.8,
  },
  armorImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  transparentOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0)",
    zIndex: 1,
  },
  cardName: {
    position: "absolute",
    bottom: 10,
    left: 10,
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
  disabledText: {
    fontSize: 12,
    color: "#ff4444",
    position: "absolute",
    bottom: 30,
    left: 10,
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
    color: "#00b3ff",
    textAlign: "center",
  },
  aboutText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
});

export default BenP;