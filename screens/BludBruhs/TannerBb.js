import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const TannerBb = () => {
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
    { name: "Wolff", image: require("../../assets/Armor/TannerBb.jpg"), clickable: true },
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
          <Text style={styles.title}>Wolff</Text>
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
          Tanner - Wolff is a primal and ferocious warrior, a vital force within the Thunder Born, reborn from the ashes of the Bludbruhs in Zion City’s tumultuous world. His presence is wild and intimidating, a blend of animalistic strength and unyielding tenacity that makes him a fearsome ally. Behind his wolf-themed armor, Tanner is gruff, instinctive, and fiercely loyal to his Thunder Born comrades—Sam “Striker,” Cole “Cruiser,” Joseph “Techoman,” and James “Shadowmind”—seeing their unit as a pack he’d defend to the death. He thrives on raw power, drawing from his inner beast and the rugged spirit of survival. Off the battlefield, he’s a loner and a hunter, often prowling the wilds or sharpening his skills, but his savage nature can sometimes strain his bonds with the more tactical members of the group.          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Tanner grew up on the fringes of Zion City’s Terrestrial sector, in a rugged community where survival meant embracing the wild. Raised among hunters and storytellers, he idolized wolves—symbols of strength, loyalty, and ferocity—and honed his physical prowess from a young age. His life took a drastic turn when he joined Sam, Will (later “Night Hawk”), Cole, Joseph, James, Zeke, Elijah, Tom, and others on the pre-Parliament adventure to Melcornia. In that dark mansion, Tanner witnessed Sam’s corruption by Erevos and the loss of Sam’s family, an event that awakened his own primal instincts as he fought to protect the group.          </Text>
          <Text style={styles.aboutText}>
          Believing Sam dead after Melcornia, Tanner returned to Zion City hardened, living on the edge of society and refining his combat skills. When Sam resurfaced—alive and wielding dark powers—Tanner rejoined him, Cole, Joseph, and James to form the Bludbruhs, bringing his raw strength to their fight against Zion City’s chaos. His wolf-like ferocity complemented Sam’s lightning, Cole’s combat, and Joseph’s tech, but Sam’s growing darkness tested their unity. When the Bludbruhs fractured, some split for the Monkie Alliance, but Tanner stayed, his loyalty to the pack outweighing his unease with Sam’s powers. He embraced the Thunder Born rebranding, seeing it as a howl of renewal, aligning his savage spirit with their electric resolve.          </Text>
          <Text style={styles.aboutText}>
          Abilities          </Text>
          <Text style={styles.aboutText}>
          Tanner’s armor and primal nature grant him a range of powers focused on strength, ferocity, and survival, reflecting his wolf theme and Thunder Born identity:          </Text>
          <Text style={styles.aboutText}>
          Beast Strength: Possesses enhanced physical power, capable of tearing through obstacles or foes with claw-like strikes, a trait born from his wolf-inspired instincts.          </Text>
          <Text style={styles.aboutText}>
          Feral Agility: Moves with lupine speed and reflexes, dodging attacks or lunging at targets, making him a relentless hunter in combat.          </Text>
          <Text style={styles.aboutText}>
          Thunder Howl: Emits a sonic roar infused with electrical energy, stunning enemies or rallying allies, a nod to his Thunder Born synergy with Sam’s lightning.          </Text>
          <Text style={styles.aboutText}>
          Predator Senses: Tracks targets with heightened smell, hearing, and night vision, honed by his wild upbringing and Melcornia’s harsh lessons.          </Text>
          <Text style={styles.aboutText}>
          Pack Bond: Boosts his strength and resilience when fighting alongside his team, reflecting his loyalty to Sam, Cole, Joseph, and James as his pack.          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team          </Text>
          <Text style={styles.aboutText}>
          Tanner is the muscle and ferocity of the Thunder Born, complementing Sam’s volatility with his raw power, Cole’s discipline with his wildness, and Joseph’s tech with his brute force. He’s gruff, protective, and deeply loyal to his pack, seeing their unit as a family worth fighting for. His relationship with Sam is one of primal respect—he admires Sam’s strength but growls at his darkness—while with Cole, it’s a soldierly bond, syncing his fury with Cole’s precision. With Joseph, he’s gruffly appreciative, relying on tech upgrades, and with James “Shadowmind,” he shares a hunter’s kinship, blending stealth with savagery.          </Text>
          <Text style={styles.aboutText}>
          In the Thunder Born, Tanner stood firm during the Bludbruhs’ rift, choosing to stay with Sam, Cole, Joseph, and James over splitting to the Monkie Alliance, driven by pack loyalty. His Melcornia past forged his resilience, and his presence bolsters the team when the Titans face “Evil Sam.” In Zion City, he connects with the Titans’ fighters like Ben Briggs and Jared, sharing their combat drive, but his squad focuses on survival over heroics. His ultimate goal is to protect Zion City as part of his pack, proving that primal strength and loyalty can thunder through any storm.          </Text>
          <Text style={styles.aboutText}>
          Tanner stayed with Sam when the Bludbruhs dissolved, rejecting the Monkie Alliance split over Sam’s dark powers. He embraced the Thunder Born name as a howl of renewal, shedding the “Bludbruhs” blood-taint for a title that echoes his thunder howl and the group’s electric rebirth, reinforcing his bond with Sam, Cole, Joseph, and James.          </Text>
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

export default TannerBb;