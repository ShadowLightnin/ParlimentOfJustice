import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Eli = () => {
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
    { name: "Shadow Hunter", image: require("../../../assets/Armor/Eli.jpg"), clickable: true },
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
          <Text style={styles.title}>Shadow Hunter</Text>
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
          Eli Chase, known as Shadow Hunter, is a silent and relentless stalker, a crucial scout in The Monkie Alliance under Zeke “Enderstrike’s” command within Zion City’s treacherous terrain. His presence is subtle yet unyielding, a blend of stealth and razor-sharp senses that makes him a phantom on the battlefield. Behind his dark, matte-finish armor, Eli is focused, determined, and fiercely loyal to his Monkie Alliance comrades—Zeke, Ammon “Quick Wit,” Alex M “Swiftmind,” Tom “Thunder Whisperer,” Damon “Pixel Maverick,” Elijah “Chaos Wither,” and Ethan “Bolt Watcher”—seeing their agility as a trail he can follow and protect. He tracks threats with unmatched precision, a hunter born of dedication. Off the battlefield, he’s a quiet observer and a planner, often mapping routes or honing his senses, but his single-minded focus can sometimes isolate him from the team’s lighter moments.
          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Eli grew up on the edges of Zion City’s Terrestrial sector, in a family of trackers and survivalists who thrived in the wilds. From a young age, he honed his senses and stealth, learning to hunt and navigate by instinct, a skill that proved vital when he joined Sam, Will (later “Night Hawk”), Cole, Joseph, James, Tanner, Zeke, Elijah, Ammon, Tom, Ethan, and others on the pre-Parliament adventure to Melcornia. In that dark mansion, Eli’s tracking kept the group ahead of unseen dangers as Sam fell to Erevos’s corruption, his enhanced senses picking up the subtle shifts that saved lives amidst the chaos.
          </Text>
          <Text style={styles.aboutText}>
          Believing Sam dead, Eli returned to Zion City, living as a shadow, refining his skills in solitude. When Sam resurfaced—corrupted and alive—Eli joined the Bludbruhs with Cole, Joseph, James, Tanner, and Zeke, using his stealth to scout their foes. His tracking synced with Sam’s lightning and Zeke’s teleportation, but Sam’s dark surge clashed with Eli’s dedication to a cleaner path. When the Bludbruhs split, Eli sided with Zeke, rejecting Sam’s shadow for a nimble, principled one, forming The Monkie Alliance with Ammon, Alex, Tom, Damon, Elijah, and Ethan. The rivalry with Thunder Born—Sam, Cole, Joseph, James, and Tanner—ignited a Civil War-style feud, later mended through Parliament ties, but Eli remains wary of Thunder Born’s volatile energy, trusting only his own silent hunt.
          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Eli’s armor and hunter instincts grant him a range of powers focused on stealth, tracking, and precision, reflecting his Shadow Hunter persona:
          </Text>
          <Text style={styles.aboutText}>
          Stealth: Moves unseen and unheard, blending into shadows or environments with advanced camouflage, a skill enhanced by his armor and Melcornia’s lessons.
          </Text>
          <Text style={styles.aboutText}>
          Tracking: Follows trails with uncanny accuracy, detecting scents, sounds, or subtle signs, making him the team’s eyes in the dark or chaos.
          </Text>
          <Text style={styles.aboutText}>
          Enhanced Senses: Perceives beyond normal limits—sight, hearing, smell—spotting threats or allies from afar, a trait sharpened by his natural gifts and armor tech.
          </Text>
          <Text style={styles.aboutText}>
          Dedication: Channels unwavering focus into boosted endurance or precision, pushing through fatigue or honing strikes, reflecting his relentless resolve.
          </Text>
          <Text style={styles.aboutText}>
          Shadow Strike: Delivers silent, precise attacks from stealth, enhanced by his senses, a hunter’s blow that ties his skills to Monkie Alliance’s agility.
          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team
          </Text>
          <Text style={styles.aboutText}>
          Eli is the silence and vigilance of The Monkie Alliance, complementing Zeke’s precision with his stealth and Ethan’s lightning with his tracking. He’s reserved, steadfast, and deeply loyal to his team, seeing them as a pack he guards from the shadows. His relationship with Zeke is one of quiet trust—he follows Zeke’s lead with hunter’s instinct—while with Ammon, he pairs stealth with charm, and with Tom “Thunder Whisperer,” he syncs tracking with sound for pinpoint strikes.
          </Text>
          <Text style={styles.aboutText}>
          In The Monkie Alliance, Eli followed Zeke in the Bludbruhs split, rejecting Sam’s dark path for a subtler, dedicated one. His stealth tracked Thunder Born in their Civil War-style feud, and when the Parliament intervened, he stood by Ammon’s side, sharing a cautious view of Thunder Born and the Titans after Will’s neutrality stirred doubts. His Melcornia past forged his senses, and his role guides the team against their rivals. In Zion City, he connects with the Titans’ stealth experts like William and James “Shadowmind,” sharing their subtlety, but his team prioritizes independence. His ultimate goal is to hunt Zion City’s threats with Monkie Alliance, proving stealth and dedication can prevail, while maintaining their shaky truce with Thunder Born.
          </Text>
          <Text style={styles.aboutText}>
          Eli sided with Zeke when Sam’s dark surge split the Bludbruhs, joining The Monkie Alliance to counter Thunder Born’s shadow with agility and precision. His tracking shadowed Thunder Born in their Civil War-style feud, easing when the Parliament stepped in. Wary of Thunder Born’s electric volatility but committed to Zeke’s vision, keeping tensions alive yet restrained.
          </Text>
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

export default Eli;