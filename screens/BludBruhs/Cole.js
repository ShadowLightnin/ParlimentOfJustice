import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Cole = () => {
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
    { name: "Cruiser", image: require("../../assets/Armor/ColePlaceHolder.jpg"), clickable: true },
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
          <Text style={styles.title}>Cruiser</Text>
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
          Cole Robinson, known as Cruiser, is a battle-hardened and steadfast warrior, a core member of the Thunder Born, reborn from the fractured Bludbruhs within Zion City’s volatile landscape. His presence is disciplined and reassuring, a mix of marine grit and unshakable resolve that makes him a rock for his team. Behind his futuristic tactical armor, Cole is pragmatic, loyal, and deeply committed to his girlfriend Kinnley (also called Harmony), whose presence keeps him grounded amidst chaos. He once stood alongside Sam “Striker,” Joseph “Techoman,” James “Shadowmind,” and Tanner - Wolff in the Bludbruhs, but now anchors the Thunder Born with a focus on survival and duty. Off the battlefield, he’s a protector and a planner, often training or strategizing with his squad, but his rigid loyalty can sometimes blind him to Sam’s darker struggles.          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Cole grew up in Zion City’s Terrestrial sector, raised in a family with a proud military tradition. As a young man, he trained as a marine, excelling in combat and survival skills, inspired by the high-stakes action of Call of Duty and real-world tales of valor. His life took a sharp turn when he joined Sam, Will (later “Night Hawk”), Joseph, James, Tanner, Zeke, Elijah, Tom, and others on an ill-fated adventure to the planet Melcornia, before the Parliament of Justice or Titans existed. In that dark mansion, Cole witnessed Sam’s family die and his descent into Erevos’s corruption, a trauma that bonded the group even as it sowed seeds of division.          </Text>
          <Text style={styles.aboutText}>
          Believing Sam dead after Melcornia, Cole returned to Zion City hardened, focusing on protecting his home. He met Kinnley/Harmony, a calming influence who became his anchor, and their relationship gave him purpose. Years later, when Sam resurfaced—alive and wielding dark powers—Cole reunited with him to form the Bludbruhs, a faction aimed at fighting Zion City’s threats. Alongside Joseph, James, and Tanner, Cole brought his combat expertise to bear, but Sam’s growing reliance on his corrupted abilities strained their brotherhood. When Sam’s dark surge fractured the group, Tanner and others left for the Monkie Alliance, rejecting the shadow. Cole stayed, loyal to Sam’s potential for good, and embraced the Thunder Born rebranding—a name reflecting their renewed focus on strength and resilience, free of the Bludbruhs’ tainted past.          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Cole’s armor and marine training grant him a range of powers focused on combat, endurance, and support, reflecting his Call of Duty-inspired tactical edge:          </Text>
          <Text style={styles.aboutText}>
          Combat Mastery: Excels in hand-to-hand and firearms combat, wielding weapons with precision and adapting to any fight, a skill honed by years as a marine and gaming instincts.          </Text>
          <Text style={styles.aboutText}>
          Tactical Resilience: Endures harsh conditions and prolonged battles, shrugging off injuries with a marine’s toughness, making him a frontline anchor for his team.          </Text>
          <Text style={styles.aboutText}>
          Shock Charge: Deploys short-range electrical bursts from his armor, stunning enemies or disrupting tech, a nod to his Thunder Born identity and synergy with Sam’s lightning.          </Text>
          <Text style={styles.aboutText}>
          Battlefield Awareness: Reads combat situations with heightened perception, spotting threats and coordinating allies, a trait drawn from his military roots and Call of Duty gameplay.          </Text>
          <Text style={styles.aboutText}>
          Protective Instinct: Boosts nearby allies’ morale and defense when shielding them, reflecting his loyalty to Kinnley/Harmony and his squad, a natural extension of his guardian role.          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team          </Text>
          <Text style={styles.aboutText}>
          Cole is the steel and stability of the Thunder Born, grounding Sam’s volatility with his combat prowess and loyalty. He’s stoic, dependable, and deeply tied to Kinnley/Harmony, whose harmony balances his warrior edge. His relationship with Sam is one of brotherhood tempered by caution—he trusts Sam’s intent but fears his dark powers, a tension that survived the Bludbruhs’ end.          </Text>
          <Text style={styles.aboutText}>
          In the Thunder Born, Cole stood by Sam during the rift that sent Tanner, and possibly others, to the Monkie Alliance, choosing loyalty over ideology. With Joseph “Techoman,” he shares a practical bond, syncing his combat with Joseph’s tech, and with James “Shadowmind,” he aligns on stealth tactics. His Melcornia past ties him to the group’s origins, and his clash with the Titans (when they face “Evil Sam”) reveals his resolve to protect Sam’s redemption.          </Text>
          <Text style={styles.aboutText}>
          In Zion City, Cole connects with the Titans’ fighters like Jared and Ben Briggs, sharing their combat focus, but his Thunder Born squad prioritizes survival over grand heroics. His ultimate goal is to safeguard Zion City and Kinnley/Harmony, proving that grit and teamwork can weather any storm, while keeping Sam on the path to good.          </Text>
          <Text style={styles.aboutText}>
          Cole stayed with Sam when the Bludbruhs dissolved, rejecting the Monkie Alliance’s split over Sam’s dark powers. The rebranding to Thunder Born came after Sam’s rift—Cole saw it as a chance to shed the blood-soaked “Bludbruhs” name, tied to Sam’s corrupted Melcornia past, and embrace a new identity of strength and renewal, reflecting their shared resilience and electrical synergy.          </Text>
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

export default Cole;