import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const JoesphD = () => {
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
    { name: "Technoman", image: require("../../assets/Armor/JosephDPlaceHolder.jpg"), clickable: true },
  ];

  const renderArmorCard = (armor) => (
    <TouchableOpacity
      key={armor.name}
      style={[styles.card(isDesktop, windowWidth), armor.clickable ? styles.clickable : styles.notClickable]}
      onPress={() => armor.clickable && console.log(`${armor.name} clicked`)}
      disabled={!armor.clickable}
    >
      <Image source={armor.image} style={styles.armorImage} />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {armor.name || 'Unknown'}; William Cummings
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
          <Text style={styles.title}>Technoman</Text>
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
          Joseph Dresher, known as Techoman, is a visionary and ingenious mind, the technological backbone of the Thunder Born, reborn from the fractured Bludbruhs within Zion City’s chaotic tapestry. His presence is sharp and resourceful, a fusion of scientific brilliance and practical innovation that makes him indispensable to his team. Behind his sleek, Star Citizen-inspired armor, Joseph is meticulous, curious, and steadfastly loyal to his comrades—Sam “Striker,” Cole “Cruiser,” James “Shadowmind,” and Tanner - Wolff—seeing their combined strengths as a canvas for his inventions. He thrives on crafting solutions, from weapons to gadgets, drawing inspiration from his vast knowledge and sci-fi passions. Off the battlefield, he’s a tinkerer and a theorist, often lost in his workshop or debating strategies, but his focus on tech can sometimes distance him from the group’s emotional struggles.          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Joseph grew up in Zion City’s Terrestrial sector, in a family of scholars and engineers who prized intellect and discovery. As a young prodigy, he devoured knowledge across fields—physics, chemistry, robotics—and found a creative outlet in Star Citizen, where he admired the game’s futuristic tech and exploration ethos. His early years were spent building gadgets, but his life shifted when he joined Sam, Will (later “Night Hawk”), Cole, James, Tanner, Zeke, Elijah, Tom, and others on a pre-Parliament adventure to the planet Melcornia.          </Text>
          <Text style={styles.aboutText}>
          In Melcornia’s dark mansion, Joseph witnessed Sam’s corruption by Erevos and the death of Sam’s family, an event that sharpened his resolve to protect his friends with his mind. While Sam fell to darkness, Joseph focused on survival, using scavenged tech to aid their escape. Believing Sam dead, he returned to Zion City, honing his skills as a scientist. When Sam resurfaced—alive and wielding corrupted powers—Joseph reunited with him, Cole, James, and Tanner to form the Bludbruhs, a faction to combat Zion City’s threats. His advanced tech bolstered their efforts, but Sam’s growing reliance on dark powers strained the group.          </Text>
          <Text style={styles.aboutText}>
          When the Bludbruhs fractured over Sam’s dark surge, some split off (though not Tanner, who stayed), and Joseph remained loyal, trusting in Sam’s potential for redemption. He embraced the Thunder Born rebranding, seeing it as a chance to redefine their purpose with innovation and strength, aligning his tech with their new electric identity.          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Joseph’s armor and scientific expertise grant him a range of powers focused on technology, versatility, and support, reflecting his Star Citizen inspiration:          </Text>
          <Text style={styles.aboutText}>
          Tech Creation: Designs and deploys advanced gadgets and weapons—drones, turrets, energy blades—crafted on the fly or pre-built, drawing on his broad scientific knowledge.          </Text>
          <Text style={styles.aboutText}>
          Weapon Mastery: Wields his creations with precision, from plasma rifles to explosive traps, a skill honed by Star Citizen’s combat mechanics and real-world tinkering.          </Text>
          <Text style={styles.aboutText}>
          Energy Hacking: Manipulates and redirects energy sources, disabling enemy tech or boosting allies’ gear, a nod to his Thunder Born synergy with Sam’s electricity.          </Text>
          <Text style={styles.aboutText}>
          Analytical Insight: Processes data and predicts outcomes with near-superhuman speed, offering strategic solutions in battle, a trait born from his scientific mind.          </Text>
          <Text style={styles.aboutText}>
          Tech Support: Enhances his team’s abilities with buffs or repairs—boosting Cole’s charges, Sam’s lightning, or Tanner’s armor—reflecting his role as their innovator.          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team          </Text>
          <Text style={styles.aboutText}>
          Joseph is the brains and versatility of the Thunder Born, supporting Sam’s leadership with his tech and Cole’s combat with his gadgets. He’s precise, inventive, and deeply loyal to his squad, seeing their unit as a perfect testing ground for his creations. His relationship with Sam is one of cautious trust—he values Sam’s strength but monitors his darkness—while with Cole, it’s a practical alliance, syncing tech with combat. With James “Shadowmind,” he shares a synergy of stealth and innovation, and with Tanner - Wolff, he admires the primal edge, enhancing Tanner’s armor with upgrades.          </Text>
          <Text style={styles.aboutText}>
          In the Thunder Born, Joseph stayed through the Bludbruhs’ end, rejecting the Monkie Alliance split (unlike some who left), believing in Sam’s redemption and the group’s potential. His Melcornia past ties him to their origins, and his tech proved vital when the Titans faced “Evil Sam.” In Zion City, he connects with the Titans’ innovators like William and Myran, sharing their tech passion, but his squad focuses on precision over grand heroics. His ultimate goal is to innovate Zion City’s future with Thunder Born, proving that science and loyalty can overcome chaos, while keeping his team cutting-edge.          </Text>
          <Text style={styles.aboutText}>
          Joseph backed Sam during the Bludbruhs’ dissolution, seeing the Thunder Born name as a fresh start after the rift over Sam’s dark powers. While some left for the Monkie Alliance, Joseph, Cole, James, and Tanner stayed, embracing a new identity tied to strength and energy—Thunder Born reflecting their collective resilience and his own tech synergy with Sam’s lightning, shedding the “Bludbruhs” stain of blood and corruption.          </Text>
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

export default JoesphD;