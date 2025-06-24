import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Zeke = () => {
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
    { name: "Enderstrike", image: require("../../../assets/Armor/Zeke.jpg"), clickable: true },
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
          <Text style={styles.title}>Enderstrike</Text>
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
          Zeke Workman, known as Enderstrike, is a cunning and resolute leader, the driving force behind The Monkie Alliance, a faction born from the ashes of the Bludbruhs’ schism in Zion City’s fractured world. His presence is sharp and unpredictable, a mix of strategic brilliance and otherworldly power that makes him a formidable commander. Behind his yet-to-be-detailed armor, Zeke is determined, principled, and fiercely loyal to his Monkie Alliance team—Ammon “Quick Wit,” Alex M “Swiftmind,” Eli “Shadow Hunter,” Tom “Thunder Whisperer,” Damon “Pixel Maverick,” Elijah “Chaos Wither,” and Ethan “Bolt Watcher”—seeing them as a brotherhood forged in defiance of Sam’s dark path. He wields Ender-inspired abilities with precision, a legacy of his Melcornia past. Off the battlefield, he’s a tactician and a mediator, often rallying his team or brooding over past rifts, but his rivalry with Sam “Striker” keeps tensions simmering beneath his cool exterior.          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Zeke grew up in Zion City’s Terrestrial sector, raised in a family that valued resilience and ingenuity. As a young man, he was drawn to strategy and survival, traits that shone when he joined Sam, Will (later “Night Hawk”), Cole, Joseph, James, Tanner, Elijah, Tom, and others on the pre-Parliament adventure to Melcornia. In that dark mansion, Zeke encountered an Ender-like entity—a shadowy, teleporting force—that imbued him with strange powers as Sam fell to Erevos’s corruption. Witnessing Sam’s family die and his descent into darkness, Zeke vowed to protect the group, using his newfound abilities to escape.          </Text>
          <Text style={styles.aboutText}>
          Believing Sam dead, Zeke returned to Zion City, honing his Ender powers in isolation. When Sam resurfaced—alive and corrupted—Zeke joined the Bludbruhs with Cole, Joseph, James, and Tanner, hoping to guide Sam back to light. But Sam’s reliance on dark powers clashed with Zeke’s principles, igniting a rift akin to Captain America: Civil War. Sam’s dark surge fractured the Bludbruhs, and Zeke led a splinter group—himself, Ammon, Alex, Eli, Tom, Damon, Elijah, and Ethan—to form The Monkie Alliance, rejecting Sam’s shadow for a path of agility and defiance (the “Monkie” name a playful jab at their nimble, rebellious spirit). Cole, Joseph, James, and Tanner stayed with Sam, birthing Thunder Born, and a bitter rivalry ensued.          </Text>
          <Text style={styles.aboutText}>
          Over time, Zeke and Sam mended their rift through uneasy truces with the Parliament of Justice, but trust remains shaky. Zeke’s Monkie Alliance stands as a counterpoint to Thunder Born, their Civil War-style feud simmering beneath a fragile alliance, with Zeke ever-watchful of Sam’s darkness.          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Zeke’s armor and Ender-inspired powers grant him a range of abilities focused on mobility, deception, and leadership, reflecting his Monkie Alliance role:          </Text>
          <Text style={styles.aboutText}>
          Ender Teleportation: Teleports short distances in a blink, leaving a faint purple shimmer, ideal for evasion or surprise attacks, a skill born from Melcornia’s entity.          </Text>
          <Text style={styles.aboutText}>
          Ender Mimicry: Mimics traits of foes or allies temporarily (e.g., speed, strength), adapting to threats, a tactical edge honed by his strategic mind.          </Text>
          <Text style={styles.aboutText}>
          Ender Summoning: Calls forth shadowy, Ender-like duplicates to distract or fight, controllable minions that echo his leadership over Monkie Alliance.          </Text>
          <Text style={styles.aboutText}>
          Ender Blast: Unleashes a concentrated burst of dark energy, damaging foes or disrupting tech, a powerful strike tying his powers to his past.          </Text>
          <Text style={styles.aboutText}>
          Alliance Command: Boosts his team’s coordination and morale with a leader’s aura, reflecting his role as Monkie Alliance’s captain and his defiance of Sam.          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team          </Text>
          <Text style={styles.aboutText}>
          Zeke is the agility and vision of The Monkie Alliance, countering Sam’s volatility with his precision and leadership. He’s calculating, resolute, and deeply loyal to his team, seeing them as a family he’ll protect at all costs. His rivalry with Sam is intense but layered—once brothers-in-arms, now wary allies, their Civil War-style feud mended but shaky. With Ammon “Quick Wit,” he shares a bond of charm and strategy; with Alex “Swiftmind,” a synergy of speed and intellect; and with Eli, Tom, Damon, Elijah, and Ethan, a leader’s trust in their diverse strengths.          </Text>
          <Text style={styles.aboutText}>
          In The Monkie Alliance, Zeke led the split from the Bludbruhs over Sam’s dark powers, forming a faction that values agility and defiance over shadow. His Melcornia past forged his resolve, and his clash with Thunder Born (when Titans face “Evil Sam”) tests his leadership. In Zion City, he connects with the Titans’ tacticians like Jared and William, sharing their strategic bent, but his team prioritizes independence over grand unity. His ultimate goal is to lead Monkie Alliance to secure Zion City’s future, proving that agility and principle can outshine darkness, while keeping his shaky truce with Sam intact.          </Text>
          <Text style={styles.aboutText}>
          Zeke’s rift with Sam split the Bludbruhs when Sam’s dark surge—rooted in Erevos’s corruption—clashed with Zeke’s rejection of shadow. Leading Ammon, Alex, Eli, Tom, Damon, Elijah, and Ethan away, Zeke formed The Monkie Alliance as a defiant stand against Sam’s path, while Sam, Cole, Joseph, James, and Tanner became Thunder Born. Their Captain America: Civil War-style rivalry erupted in skirmishes, only mending through Parliament mediation, but tensions linger, with Zeke ever-vigilant of Sam’s potential relapse.          </Text>
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

export default Zeke;