import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const JameBb = () => {
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
    { name: "Shadowmind", image: require("../../assets/Armor/JamesBbPlaceHolder.jpg"), clickable: true },
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
          <Text style={styles.title}>Shadowmind</Text>
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
          James, known as Shadowmind, is a silent and enigmatic operative, the elusive shadow of the Thunder Born, reborn from the fractured Bludbruhs within Zion City’s chaotic realm. His presence is subtle yet unnerving, a blend of stealth and perception that makes him a ghostly asset to his team. Behind his shadowy armor, James is reserved, insightful, and fiercely loyal to his Thunder Born comrades—Sam “Striker,” Cole “Cruiser,” Joseph “Techoman,” and Tanner - Wolff—seeing their unit as a refuge where his dark gifts can serve a purpose. He thrives in the unseen, drawing power from shadows and his keen senses. Off the battlefield, he’s a watcher and a planner, often lurking on the edges or analyzing threats, but his reclusive nature can make him a mystery even to his closest allies.          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          James grew up in Zion City’s Telestial sector, in a shadowed corner where survival meant staying unnoticed. Raised among outcasts and observers, he learned to blend into the dark, honing a natural talent for perception and evasion. His life shifted when he joined Sam, Will (later “Night Hawk”), Cole, Joseph, Tanner, Zeke, Elijah, Tom, and others on the pre-Parliament adventure to Melcornia. In that dark mansion, James was touched by the same corrupting force as Sam—Erevos’s influence awakened his shadow powers as he hid from the chaos that claimed Sam’s family. Unlike Sam, James embraced the darkness quietly, using it to protect rather than destroy.          </Text>
          <Text style={styles.aboutText}>
          Believing Sam dead after Melcornia, James returned to Zion City, fading into its underbelly and refining his abilities. When Sam resurfaced—alive and corrupted—James rejoined him, Cole, Joseph, and Tanner to form the Bludbruhs, bringing his stealth to their fight against Zion City’s threats. His shadow manipulation synced with Sam’s lightning, Cole’s combat, Joseph’s tech, and Tanner’s ferocity, but Sam’s growing darkness mirrored James’s own, creating a silent bond. When the Bludbruhs fractured over Sam’s dark surge, some split for the Monkie Alliance, but James stayed, his loyalty rooted in understanding Sam’s struggle. He embraced the Thunder Born rebranding, seeing it as a chance to channel his shadows into a new, electric purpose alongside his pack.          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          James’s innate gifts and shadowy nature grant him a range of powers focused on stealth, mobility, and awareness, reflecting his Shadowmind persona:          </Text>
          <Text style={styles.aboutText}>
          Shadow Manipulation: Controls and shapes shadows, creating tendrils to strike, barriers to shield, or cloaks to obscure, a power born from Melcornia’s dark influence.          </Text>
          <Text style={styles.aboutText}>
          Teleportation: Moves instantly between shadows within a limited range, vanishing and reappearing to flank or escape, a skill honed by his elusive instincts.          </Text>
          <Text style={styles.aboutText}>
          Invisibility: Fades into near-perfect invisibility when shrouded in darkness, making him a ghost in combat or reconnaissance, enhanced by his armor’s design.          </Text>
          <Text style={styles.aboutText}>
          Enhanced Perception: Sees, hears, and senses beyond normal limits, detecting hidden threats or weak points, a trait sharpened by his watchful nature and Melcornia’s lessons.          </Text>
          <Text style={styles.aboutText}>
          Shadow Strike: Infuses his attacks with shadow energy, boosting their impact or disorienting foes, a subtle nod to Thunder Born’s electric theme through dark synergy.          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team          </Text>
          <Text style={styles.aboutText}>
          James is the stealth and perception of the Thunder Born, complementing Sam’s volatility with his subtlety, Cole’s discipline with his evasion, and Tanner’s ferocity with his precision. He’s quiet, perceptive, and deeply loyal to his pack, seeing their unit as a shadow where he thrives. His relationship with Sam is one of silent understanding—he shares Sam’s dark past but tempers it with control—while with Cole, it’s a tactical alliance, syncing stealth with combat. With Joseph, he’s a shadow to tech, using gadgets to enhance his moves, and with Tanner, he’s a kindred hunter, blending shadow with beast.          </Text>
          <Text style={styles.aboutText}>
          In the Thunder Born, James stayed through the Bludbruhs’ rift, choosing loyalty to Sam, Cole, Joseph, and Tanner over the Monkie Alliance split, drawn by their shared Melcornia scars. His shadow powers proved crucial when the Titans faced “Evil Sam,” revealing his survival alongside the team. In Zion City, he connects with the Titans’ stealth experts like William and Ben Briggs, sharing their subtle approach, but his squad focuses on survival over grand heroics. His ultimate goal is to guard Zion City from the shadows with Thunder Born, proving that darkness can serve light, while keeping his pack intact.          </Text>
          <Text style={styles.aboutText}>
          James stood with Sam during the Bludbruhs’ dissolution, rejecting the Monkie Alliance split over Sam’s dark powers. He embraced the Thunder Born name as a fusion of his shadow roots and their electric renewal, shedding the “Bludbruhs” blood-taint for a title that reflects his subtle synergy with Sam’s lightning, Cole’s charges, Joseph’s tech, and Tanner’s howl, reinforcing their pack’s resilience.          </Text>
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

export default JameBb;