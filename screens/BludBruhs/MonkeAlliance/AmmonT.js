import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const AmmonT = () => {
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
    { name: "Quick Wit", image: require("../../../assets/Armor/AmmonTPlaceHolder.jpg"), clickable: true },
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
          <Text style={styles.title}>Quick Wit</Text>
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
          Ammon Thomson, known as Quick Wit, is a suave and resourceful healer, a vital pillar of The Monkie Alliance under Zeke “Enderstrike’s” command within Zion City’s chaotic sprawl. His presence is warm yet elusive, a blend of charm and stealth that makes him a soothing yet slippery ally. Behind his yet-to-be-detailed armor, Ammon is empathetic, clever, and deeply loyal to his Monkie Alliance team—Zeke, Alex M “Swiftmind,” Eli “Shadow Hunter,” Tom “Thunder Whisperer,” Damon “Pixel Maverick,” Elijah “Chaos Wither,” and Ethan “Bolt Watcher”—and his spouse, whose support anchors him. He thrives on witty banter and healing, lifting spirits amidst strife. Off the battlefield, he’s a nurturer and a strategist, often tending to his team or plotting with a smile, but his falling out with Will “Night Hawk” over the Titans’ role lingers as a sore spot.          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Ammon grew up in Zion City’s Terrestrial sector, raised in a family that valued compassion and cunning. His natural empathy and quick tongue made him a peacemaker, traits that shone when he joined Sam, Will, Cole, Joseph, James, Tanner, Zeke, Elijah, Tom, and others on the pre-Parliament adventure to Melcornia. In that dark mansion, Ammon’s healing touch emerged as he soothed the group’s wounds after Sam’s family died and Erevos corrupted Sam, while his stealth kept him out of the fray. The experience bonded him to his crew, especially Will, his early confidant.          </Text>
          <Text style={styles.aboutText}>
          Believing Sam dead, Ammon returned to Zion City, marrying his spouse and honing his skills in quiet service. When Sam resurfaced—corrupted and alive—Ammon joined the Bludbruhs with Cole, Joseph, James, Tanner, and Zeke, using his charm and healing to bolster their fight. But Sam’s dark surge clashed with Ammon’s ideals, and he sided with Zeke in the rift, forming The Monkie Alliance with Alex, Eli, Tom, Damon, Elijah, and Ethan. The split ignited a Civil War-style feud with Thunder Born (Sam, Cole, Joseph, James, and Tanner), escalating until the Parliament intervened. During this clash, Ammon misunderstood the Titans’ neutrality—led by Will—as support for Sam, leading to a bitter falling out with his old friend. Though the rivalry mended over time, Ammon’s trust in Will and the Titans remains shaky, strained by that betrayal.          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Ammon’s innate gifts and subtle armor grant him a range of abilities focused on support, stealth, and influence, reflecting his Quick Wit persona:          </Text>
          <Text style={styles.aboutText}>
          Empathy: Senses and soothes emotions, calming allies or reading foes, a skill that strengthens his team’s resolve and informs his strategies.          </Text>
          <Text style={styles.aboutText}>
          Charm: Wields a magnetic charisma, persuading or disarming others with ease, often paired with witty banter to lighten tense moments.          </Text>
          <Text style={styles.aboutText}>
          Husbandry: Nurtures and bonds with animals or allies, boosting their morale or coordination, a trait tied to his caring nature and married life.          </Text>
          <Text style={styles.aboutText}>
          Stealth: Moves silently and unseen, slipping through danger or aiding allies covertly, enhanced by his armor’s design.          </Text>
          <Text style={styles.aboutText}>
          Healing Touch: Mends wounds and restores energy with a gentle touch, a power born from Melcornia and vital to Monkie Alliance’s endurance.          </Text>
          <Text style={styles.aboutText}>
          Witty Banter: Distracts or taunts foes with sharp quips, throwing them off balance, a playful yet effective combat tool.          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team          
          </Text>
          <Text style={styles.aboutText}>
          Ammon is the heart and guile of The Monkie Alliance, complementing Zeke’s precision with his charm and Elijah’s chaos with his healing. He’s witty, compassionate, and deeply loyal to his team and spouse, seeing them as a family he’ll mend and defend. His relationship with Zeke is one of trust—he supports Zeke’s leadership with empathy—while with Alex “Swiftmind,” he pairs charm with intellect, and with Elijah, he tempers chaos with calm.          </Text>
          <Text style={styles.aboutText}>
          In The Monkie Alliance, Ammon followed Zeke in the Bludbruhs split, rejecting Sam’s dark path for a lighter, agile one. His falling out with Will came when the Parliament stopped the Thunder Born-Monkie feud—Ammon saw Will’s Titan neutrality as siding with Sam, shattering their bond. Though mended, the rift leaves Ammon wary of Titans like Will, Jared, and Spencer. His Melcornia past forged his resilience, and his role bolsters the team against Thunder Born. In Zion City, he connects with the Titans’ healers like Jennifer, sharing their compassion, but his team prioritizes independence. His ultimate goal is to heal Zion City with Monkie Alliance, proving charm and stealth can triumph, while navigating his shaky truce with Will and Sam.          </Text>
          <Text style={styles.aboutText}>
          Ammon sided with Zeke when Sam’s dark surge split the Bludbruhs, joining The Monkie Alliance to defy Thunder Born’s shadow. During their Civil War-style feud, the Parliament’s intervention halted the fighting, but Ammon misread the Titans’ neutrality—led by Will—as support for Sam, sparking a heated falling out. Their bond mended over time, but Ammon’s trust remains fragile, coloring his view of Thunder Born and the Titans.          </Text>
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
  },
  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
    paddingLeft: 15,
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

export default AmmonT;