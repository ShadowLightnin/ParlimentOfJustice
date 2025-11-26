import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Alex = () => {
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
    { name: "Huntsman", copyright: "William Cummings", image: require("../../../assets/Armor/Alex3.jpg"), clickable: true },
    { name: "", image: require("../../../assets/Armor/Alex.jpg"), clickable: true },
    { name: "Huntsman", copyright: "William Cummings", image: require("../../../assets/Armor/Alex2.jpg"), clickable: true },
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
          <Text style={styles.title}>Huntsman</Text>
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
    color: "#662bd3",
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
    color: "#418230",
    textAlign: "center",
  },
  aboutText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
});

export default Alex;