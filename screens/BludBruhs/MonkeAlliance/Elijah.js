import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Elijah = () => {
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
    { name: "Chaos Wither", image: require("../../../assets/Armor/ElijahPlaceHolder.jpg"), clickable: true },
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
          <Text style={styles.title}>Chaos Wither</Text>
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
          Elijah Potter, known as Chaos Wither, is an unpredictable and shadowy dynamo, a vital wildcard in The Monkie Alliance under Zeke “Enderstrike’s” command within Zion City’s turbulent expanse. His presence is fluid and unsettling, a mix of chaotic energy and stealthy finesse that makes him a disruptive force on the battlefield. Behind his shifting, dark armor, Elijah is enigmatic, adaptable, and fiercely loyal to his Monkie Alliance kin—Zeke, Ammon “Quick Wit,” Alex M “Swiftmind,” Eli “Shadow Hunter,” Tom “Thunder Whisperer,” Damon “Pixel Maverick,” and Ethan “Bolt Watcher”—seeing their agility as a perfect stage for his chaos. He thrives on disorder, wielding his Wither-inspired powers to unravel foes. Off the battlefield, he’s a trickster and a loner, often experimenting with his forms or brooding over his past, but his chaotic nature can sometimes clash with Zeke’s structured leadership.          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Elijah grew up in Zion City’s Telestial sector, in a rough neighborhood where adaptability meant survival. Raised among misfits and rebels, he learned to shift and bend with the world, a trait that crystallized when he joined Sam, Will (later “Night Hawk”), Cole, Joseph, James, Tanner, Zeke, Tom, and others on the pre-Parliament adventure to Melcornia. In that dark mansion, Elijah encountered a Wither-like essence—a decaying, chaotic force—that fused with him as Sam fell to Erevos. The entity’s touch awakened his shapeshifting and chaos powers, and he used them to sow confusion, aiding their escape from the nightmare.          </Text>
          <Text style={styles.aboutText}>
          Believing Sam dead, Elijah returned to Zion City, embracing his chaotic gifts in the shadows. When Sam resurfaced—corrupted and alive—Elijah joined the Bludbruhs with Cole, Joseph, James, Tanner, and Zeke, hoping to harness his chaos for good. His Wither form unnerved some, but he synced it with Sam’s lightning and Zeke’s teleportation. When Sam’s dark surge fractured the Bludbruhs, Elijah sided with Zeke, rejecting Sam’s shadow for a freer path. With Ammon, Alex, Eli, Tom, Damon, and Ethan, he formed The Monkie Alliance, amplifying their defiance with his chaos. The rivalry with Thunder Born—Sam, Cole, Joseph, James, and Tanner—flared into a Civil War-style feud, later mended through Parliament ties, but Elijah’s distrust of Sam lingers, fueling a shaky truce.          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Elijah’s armor and Wither-inspired powers grant him a range of abilities focused on chaos, transformation, and stealth, reflecting his Monkie Alliance role:          </Text>
          <Text style={styles.aboutText}>
          Wither Form: Transforms into a dark, decaying state, boosting his strength and resilience while exuding a corrosive aura that weakens foes, a power born from Melcornia’s essence.          </Text>
          <Text style={styles.aboutText}>
          Chaos Manipulation: Disrupts order with chaotic energy, scrambling enemy tech, senses, or formations, a skill that thrives in the Monkie Alliance’s agile chaos.          </Text>
          <Text style={styles.aboutText}>
          Stealth: Blends into shadows or environments with near-invisibility, enhanced by his armor, making him a silent predator in combat or recon.          </Text>
          <Text style={styles.aboutText}>
          Shapeshifting: Alters his form (e.g., humanoid, beastly, amorphous), adapting to threats or tactics, a versatile trait honed by his chaotic nature.          </Text>
          <Text style={styles.aboutText}>
          Wither Burst: Releases a concentrated wave of chaotic energy, damaging and disorienting foes, tying his powers to his Wither roots and Monkie defiance.          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team          </Text>
          <Text style={styles.aboutText}>
          Elijah is the chaos and adaptability of The Monkie Alliance, complementing Zeke’s precision with his disorder and Ammon’s charm with his unpredictability. He’s elusive, cunning, and deeply loyal to his team, seeing them as a chaotic family he’ll disrupt the world to protect. His relationship with Zeke is one of mutual respect tinged with friction—Zeke’s order tempers Elijah’s chaos—while with Alex “Swiftmind,” he syncs speed with shapeshifting, and with Eli “Shadow Hunter,” he shares a stealthy bond.          </Text>
          <Text style={styles.aboutText}>
          In The Monkie Alliance, Elijah followed Zeke in the Bludbruhs split, rejecting Sam’s dark path for a freer, chaotic one. His Melcornia past forged his powers, and his rivalry with Thunder Born tests his loyalty when the Titans face “Evil Sam.” In Zion City, he connects with the Titans’ wildcards like Emma and Jared, sharing their flair, but his team prioritizes defiance over unity. His ultimate goal is to unleash chaos on Zion City’s threats with Monkie Alliance, proving that disorder can triumph, while navigating his shaky truce with Sam.          </Text>
          <Text style={styles.aboutText}>
          Elijah sided with Zeke when Sam’s dark surge split the Bludbruhs, choosing The Monkie Alliance’s agile defiance over Thunder Born’s shadow-tinged strength. His chaos fueled their Civil War-style feud with Sam, Cole, Joseph, James, and Tanner, a rivalry that eased through Parliament ties but remains tense, with Elijah wary of Sam’s lingering darkness.          </Text>
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

export default Elijah;