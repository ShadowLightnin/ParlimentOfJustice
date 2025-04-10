import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const EthanT = () => {
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
    { name: "Bolt Watcher", image: require("../../../assets/Armor/EthanPlaceHolder.jpg"), clickable: true },
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
          <Text style={styles.title}>Bolt Watcher</Text>
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
          Ethan Tuffs, known as Bolt Watcher, is a swift and electrifying sentinel, a dynamic spark in The Monkie Alliance under Zeke “Enderstrike’s” command within Zion City’s volatile expanse. His presence is charged and alert, a blend of lightning-fast agility and keen awareness that makes him a vital scout and striker for his team. Behind his electric-blue armor, Ethan is vigilant, energetic, and fiercely loyal to his Monkie Alliance comrades—Zeke, Ammon “Quick Wit,” Alex M “Swiftmind,” Eli “Shadow Hunter,” Tom “Thunder Whisperer,” Damon “Pixel Maverick,” and Elijah “Chaos Wither”—seeing their agility as a current he can ride. He wields lightning with precision, turning energy into action. Off the battlefield, he’s a restless observer and a tinkerer, often scanning the horizon or tweaking his gear, but his high-voltage nature can sometimes make him impulsive.
          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Ethan grew up in Zion City’s Terrestrial sector, in a family of runners and watchers who thrived on speed and vigilance. From a young age, he was drawn to storms and energy, a fascination that ignited when he joined Sam, Will (later “Night Hawk”), Cole, Joseph, James, Tanner, Zeke, Elijah, Ammon, Tom, and others on the pre-Parliament adventure to Melcornia. In that dark mansion, Ethan’s agility caught a stray bolt of energy from Sam’s corruption by Erevos, awakening his lightning control as he darted to safety. His enhanced perception guided the group through the chaos, dodging threats as Sam fell.
          </Text>
          <Text style={styles.aboutText}>
          Believing Sam dead, Ethan returned to Zion City, channeling his powers into a life of scouting and survival. When Sam resurfaced—corrupted and alive—Ethan joined the Bludbruhs with Cole, Joseph, James, Tanner, and Zeke, using his lightning to complement their fight. His speed synced with Sam’s electricity and Zeke’s teleportation, but Sam’s dark surge clashed with Ethan’s instinct for freedom. When the Bludbruhs split, Ethan sided with Zeke, rejecting Sam’s shadow for a path of agility and energy, forming The Monkie Alliance with Ammon, Alex, Eli, Tom, Damon, and Elijah. The rivalry with Thunder Born—Sam, Cole, Joseph, James, and Tanner—erupted into a Civil War-style feud, later mended through Parliament ties, but Ethan remains cautious of Thunder Born’s electric echoes, favoring his own controlled bolts.
          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Ethan’s armor and electric affinity grant him a range of powers focused on speed, energy, and awareness, reflecting his Bolt Watcher persona:
          </Text>
          <Text style={styles.aboutText}>
          Enhanced Perception: Sees and reacts to threats with heightened senses, spotting dangers or opportunities others miss, a skill honed by Melcornia’s chaos.
          </Text>
          <Text style={styles.aboutText}>
          Lightning Control: Generates and directs bolts of electricity, striking foes or powering allies’ gear, a power born from that stray energy and refined with agility.
          </Text>
          <Text style={styles.aboutText}>
          Superhuman Agility: Moves with lightning-fast reflexes and speed, darting across battlefields or evading attacks, making him a blur of blue energy.
          </Text>
          <Text style={styles.aboutText}>
          Bolt Surge: Channels a concentrated lightning burst, stunning or damaging enemies, a precise strike that ties his powers to his Thunder Born rivals yet stands apart.
          </Text>
          <Text style={styles.aboutText}>
          Energy Relay: Conducts his lightning to boost teammates’ actions (e.g., Zeke’s teleport, Tom’s sound), reflecting his role as a team enhancer and his Monkie synergy.
          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team
          </Text>
          <Text style={styles.aboutText}>
          Ethan is the speed and energy of The Monkie Alliance, complementing Zeke’s precision with his agility and Tom’s resonance with his lightning. He’s alert, spirited, and deeply loyal to his team, seeing them as a circuit he keeps charged. His relationship with Zeke is one of trust—he follows Zeke’s lead with electric zeal—while with Ammon, he pairs energy with healing, and with Tom “Thunder Whisperer,” he syncs lightning with sound for devastating combos.
          </Text>
          <Text style={styles.aboutText}>
          In The Monkie Alliance, Ethan followed Zeke in the Bludbruhs split, rejecting Sam’s dark path for a freer, energetic one. His lightning clashed with Thunder Born’s in their Civil War-style feud, and when the Parliament intervened, he stood by Ammon’s side, sharing a cautious view of Thunder Born and the Titans after Will’s neutrality muddied trust. His Melcornia past forged his powers, and his role energizes the team against their rivals. In Zion City, he connects with the Titans’ speedsters like Jared and Emma, sharing their pace, but his team prioritizes independence. His ultimate goal is to electrify Zion City’s future with Monkie Alliance, proving speed and energy can outpace chaos, while maintaining their shaky truce with Thunder Born.
          </Text>
          <Text style={styles.aboutText}>
          Ethan sided with Zeke when Sam’s dark surge split the Bludbruhs, joining The Monkie Alliance to counter Thunder Born’s shadow with agility and lightning. His bolts rivaled Sam’s electricity in their Civil War-style feud, easing when the Parliament stepped in. Wary of Thunder Born’s electric resonance but committed to Zeke’s vision, keeping tensions alive yet tempered.
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

export default EthanT;