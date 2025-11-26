import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Ben = () => {
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
    { name: "Nuscis", copyright: "William Cummings", image: require("../../assets/Armor/Ben4.jpg"), clickable: true },
    { name: "Nuscis", copyright: "William Cummings", image: require("../../assets/Armor/Ben5.jpg"), clickable: true },
    { name: "Legacy", copyright: "William Cummings", image: require("../../assets/Armor/BenLegacy.jpg"), clickable: true },
    { name: "Nuscis", copyright: "William Cummings", image: require("../../assets/Armor/Ben3.jpg"), clickable: true },
    { name: "Nuscus", copyright: "William Cummings", image: require("../../assets/Armor/Ben.jpg"), clickable: true },
    { name: "Nuscus", copyright: "William Cummings", image: require("../../assets/Armor/Ben2.jpg"), clickable: true },
    { name: "", image: require("../../assets/Armor/BensSymbol.jpg"), clickable: true },
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
          <Text style={styles.title}>Nuscis</Text>
        </View>

        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            snapToInterval={SCREEN_WIDTH * 0.7 + 20}
            decelerationRate="fast"
            contentOffset={{ x: (SCREEN_WIDTH - (SCREEN_WIDTH * 0.7)) / 2 - 10, y: 0 }} // Centers first image
          >
            {armors.map(renderArmorCard)}
          </ScrollView>
        </View>

        {/* <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>About Me</Text>
          <Text style={styles.aboutText}>
          Ben Briggs, known as Nuscis, is a swift and resolute guardian, the second oldest Briggs sibling and a key member of the Titans within the Parliament of Justice. His presence is both agile and commanding, a blend of metallic precision and crusader honor that marks him as a protector of his family and city. Behind his sleek, metallic armor, Ben is strategic, loyal, and fiercely protective of his sister Azure, his cousins among the Titans (Spencer, Jared, Jennifer, William, and Emma), and the broader Briggs and extended family. He sees himself as a shield against Zion City’s chaos, drawing strength from his crusader heritage and his bond with his family. Off the battlefield, he’s a planner and a mentor, often training with his cousins or reinforcing their defenses, but his drive to uphold justice sometimes makes him rigid.          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Ben grew up in a disciplined household on the edge of Zion City’s Terrestrial sector, alongside his oldest sister Azure, in a family that valued order, strength, and tradition. The Briggs clan was known for their resilience and tactical minds, and Ben inherited a knack for agility and defense from his parents. While Azure leaned toward structure and harmony, Ben was inspired by tales of knights and crusaders, as well as the acrobatic heroism of Spider-Man, whose agility and web-slinging mirrored his own potential.          </Text>
          <Text style={styles.aboutText}>
          When Zion City’s sectors began to fracture, Ben’s village faced threats from the lawless Telestial and Outer Darkness sectors. During a critical ambush, he discovered his ability to move with spider-like agility, using scavenged metal to craft his first suit. This moment birthed Nuscis, and his armor evolved to reflect his role as a defender, replacing Spider-Man’s symbol with a crusader emblem to honor his family’s values of justice and protection. Joining the Titans, he stood with the McNeil siblings (Spencer, Jared, Jennifer), the Cummings siblings (William, Emma), and his sister Azure, using his speed and strength to safeguard their mission.          </Text>
          <Text style={styles.aboutText}>
          As one of the oldest cousins, Ben felt the weight of Spencer’s fallen leadership and Jared’s rising ambition, but he also saw an opportunity to stabilize the group. His crusader-inspired armor became a symbol of hope, but his fear of failing his family—especially Azure and the Titans—sometimes clouds his judgment. His connection to the broader family—leaders like Todd (Cummings), strategists like Lee (Jensen), and healers like Jennifer (McNeil)—strengthens him, but he struggles with the balance between tradition and progress in a changing world.          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Ben’s suit and innate agility grant him a range of powers focused on mobility, defense, and combat, reflecting his Spider-Man and crusader inspirations:          </Text>
          <Text style={styles.aboutText}>
          Enhanced Agility: Can leap, swing, and maneuver with spider-like grace, scaling walls, dodging attacks, and striking from unexpected angles. His movements are fluid and precise, making him a difficult target.          </Text>
          <Text style={styles.aboutText}>
          Metallic Durability: His armor, made of a lightweight yet tough alloy, absorbs impacts and deflects energy, protecting him and his allies. The crusader symbol on his chest can emit a brief protective field for nearby teammates.          </Text>
          <Text style={styles.aboutText}>
          Web-Like Grappling: Can deploy retractable metallic cables from his suit, mimicking Spider-Man’s webbing, to swing, restrain enemies, or create barriers, drawing on his agility for tactical advantage.          </Text>
          <Text style={styles.aboutText}>
          Combat Prowess: Trained in close-quarters combat, Ben uses his agility to deliver rapid, precise strikes, enhanced by the armor’s metallic edges for added impact.          </Text>
          <Text style={styles.aboutText}>
          Crusader’s Resolve: A mental fortitude that boosts his endurance and morale, allowing him to inspire his family and resist psychological attacks, rooted in his honor-bound nature.          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team          </Text>
          <Text style={styles.aboutText}>
          Ben is the agility and defense of the Titans, a counterbalance to Spencer’s power, Jared’s speed, and William’s stealth. He’s disciplined, honorable, and deeply loyal, but his rigidity can sometimes clash with the more adaptive approaches of his cousins. His relationship with Azure is protective and collaborative—she’s his anchor, and he relies on her order to balance his impulsiveness. With the McNeil siblings, he respects Spencer’s strength but worries about his fall, admires Jared’s drive, and trusts Jennifer’s healing. With William and Emma (Cummings), he shares a tactical bond, often coordinating with William’s tech and Emma’s flight.          </Text>
          <Text style={styles.aboutText}>
          As the second oldest Briggs sibling, Ben mentors Azure but also learns from her harmony, pushing her to refine her skills while drawing strength from her stability. His cousins—Spencer, Jared, Jennifer, William, and Emma—rely on his defensive capabilities, while he draws inspiration from their diverse strengths. In the broader Parliament of Justice, Ben works closely with strategists like Todd (Cummings) and combatants like Samantha (Jensen), using his agility to protect the family’s flanks.          </Text>
          <Text style={styles.aboutText}>
          His ultimate goal is to uphold justice in Zion City, proving that tradition and agility can safeguard their future, while ensuring his sister and cousins thrive. He sees himself as a shield for the Titans, but his fear of failure—especially toward Azure and the family—drives him to push his limits.          </Text>

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

export default Ben;