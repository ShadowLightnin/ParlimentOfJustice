import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const AlexM = () => {
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
    { name: "Swiftmind", image: require("../../../assets/Armor/AlexM.jpg"), clickable: true },
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
          <Text style={styles.title}>Swiftmind</Text>
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
          Alex M, known as Swiftmind, is a brilliant and lightning-quick strategist, a vital intellect in The Monkie Alliance under Zeke “Enderstrike’s” command within Zion City’s unpredictable chaos. His presence is sharp and dynamic, a blend of superhuman speed and razor-sharp wit that makes him a mastermind on the battlefield. Behind his yet-to-be-detailed armor, Alex is analytical, empathetic, and fiercely loyal to his Monkie Alliance comrades—Zeke, Ammon “Quick Wit,” Tom “Thunder Whisperer,” Ethan “Bolt Watcher,” Eli “Shadow Hunter,” Damon “Pixel Maverick,” and Elijah “Chaos Wither”—seeing their agility as a puzzle he can solve and enhance. He processes and reacts with unmatched precision, a whirlwind of mind and motion. Off the battlefield, he’s a thinker and a planner, often mapping strategies or observing his team, but his rapid pace can sometimes leave others struggling to keep up.
          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Alex M grew up in Zion City’s Terrestrial sector, in a family of scholars and athletes who prized intellect and agility. From a young age, he excelled in both mind and body, a prodigy whose speed and smarts shone when he joined Sam, Will (later “Night Hawk”), Cole, Joseph, James, Tanner, Zeke, Elijah, Ammon, Tom, Ethan, Eli, Damon, and others on the pre-Parliament adventure to Melcornia. In that dark mansion, Alex’s quick reflexes and heightened senses saved the group from traps as Sam fell to Erevos’s corruption, his photographic memory locking in every detail of their escape. The ordeal supercharged his abilities, blending speed with super intelligence.
          </Text>
          <Text style={styles.aboutText}>
          Believing Sam dead, Alex returned to Zion City, honing his gifts in quiet study and training. When Sam resurfaced—corrupted and alive—Alex joined the Bludbruhs with Cole, Joseph, James, Tanner, and Zeke, using his strategic mind to guide their fight. His speed synced with Sam’s lightning and Zeke’s teleportation, but Sam’s dark surge clashed with Alex’s clarity. When the Bludbruhs split, Alex sided with Zeke, rejecting Sam’s shadow for a path of agility and intellect, forming The Monkie Alliance with Ammon, Tom, Ethan, Eli, Damon, and Elijah. The rivalry with Thunder Born—Sam, Cole, Joseph, James, and Tanner—erupted into a Civil War-style feud, later mended through Parliament ties, but Alex remains cautious of Thunder Born’s raw power, trusting his own swift precision.
          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Alex’s innate talents and agile nature grant him a range of powers focused on speed, intellect, and coordination, reflecting his Swiftmind persona:
          </Text>
          <Text style={styles.aboutText}>
          Enhanced Speed: Moves and thinks at superhuman velocity, outpacing foes or allies, a skill born from Melcornia’s chaos and refined with control.
          </Text>
          <Text style={styles.aboutText}>
          Super Intelligence: Processes complex data and strategies instantly, solving problems or predicting outcomes, making him the team’s brain trust.
          </Text>
          <Text style={styles.aboutText}>
          Photographic Memory: Recalls every detail with perfect clarity, from maps to enemy moves, a power that anchors his planning and precision.
          </Text>
          <Text style={styles.aboutText}>
          Quick Reflexes: Reacts with split-second accuracy, dodging or striking with finesse, tying his speed to his senses.
          </Text>
          <Text style={styles.aboutText}>
          Empathy: Reads emotions and intentions, boosting team morale or outsmarting foes, a subtle strength that complements Ammon’s charm.
          </Text>
          <Text style={styles.aboutText}>
          Strategic Thinker: Crafts plans with uncanny foresight, enhancing Zeke’s leadership or countering threats, a trait honed by his intellect.
          </Text>
          <Text style={styles.aboutText}>
          Heightened Senses: Perceives subtle cues—sight, sound, motion—spotting dangers or opportunities, syncing with Eli’s tracking.
          </Text>
          <Text style={styles.aboutText}>
          Precise Control: Executes actions with pinpoint accuracy, from strikes to maneuvers, reflecting his Monkie agility and mental mastery.
          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team
          </Text>
          <Text style={styles.aboutText}>
          Alex is the speed and strategy of The Monkie Alliance, complementing Zeke’s precision with his intellect and Ethan’s lightning with his pace. He’s sharp, compassionate, and deeply loyal to his team, seeing them as a system he optimizes. His relationship with Zeke is one of mutual respect—he refines Zeke’s plans with foresight—while with Ammon, he pairs empathy with strategy, and with Damon “Pixel Maverick,” he balances chaos with order.
          </Text>
          <Text style={styles.aboutText}>
          In The Monkie Alliance, Alex followed Zeke in the Bludbruhs split, rejecting Sam’s dark path for a smarter, swifter one. His strategies countered Thunder Born in their Civil War-style feud, and when the Parliament intervened, he supported Ammon’s stance, sharing a cautious view of Thunder Born and the Titans after Will’s neutrality stirred doubts. His Melcornia past forged his powers, and his role sharpens the team against their rivals. In Zion City, he connects with the Titans’ thinkers like Jared and William, sharing their mental edge, but his team prioritizes independence. His ultimate goal is to outthink Zion City’s threats with Monkie Alliance, proving speed and intellect can triumph, while maintaining their shaky truce with Thunder Born.
          </Text>
          <Text style={styles.aboutText}>
          Alex sided with Zeke when Sam’s dark surge split the Bludbruhs, joining The Monkie Alliance to counter Thunder Born’s shadow with agility and wit. His swift plans outmaneuvered Thunder Born in their Civil War-style feud, easing when the Parliament stepped in. Wary of Thunder Born’s raw energy but committed to Zeke’s vision, keeping tensions alive yet calculated.
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

export default AlexM;