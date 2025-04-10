import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const TomBb = () => {
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
    { name: "Thunder Whisperer", image: require("../../../assets/Armor/TomCPlaceHolder3_cleanup.jpg"), clickable: true },
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
          <Text style={styles.title}>Thunder Whisperer</Text>
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
          Tom Cochran, known as Thunder Whisperer, is a resonant and subtle maestro, a key harmonizer in The Monkie Alliance under Zeke “Enderstrike’s” command within Zion City’s chaotic sprawl. His presence is calm yet powerful, a blend of sonic control and understated strength that makes him a vital support for his team. Behind his sleek, sound-enhancing armor, Tom is thoughtful, steady, and fiercely loyal to his Monkie Alliance comrades—Zeke, Ammon “Quick Wit,” Alex M “Swiftmind,” Eli “Shadow Hunter,” Damon “Pixel Maverick,” Elijah “Chaos Wither,” and Ethan “Bolt Watcher”—seeing their agility as a rhythm he amplifies. He thrives on manipulating sound, turning whispers into thunder. Off the battlefield, he’s a listener and a tinkerer, often fine-tuning his gear or soothing tensions, but his quiet demeanor can mask his full potential.
          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Tom grew up in Zion City’s Terrestrial sector, in a family of musicians and craftsmen who valued harmony and precision. His knack for sound and mechanics led him to join Sam, Will (later “Night Hawk”), Cole, Joseph, James, Tanner, Zeke, Elijah, and others on the pre-Parliament adventure to Melcornia. In that dark mansion, Tom’s exposure to its eerie acoustics awakened his sonic powers as Sam fell to Erevos. Using sound to disorient threats, he helped the group escape, forging a bond with them.
          </Text>
          <Text style={styles.aboutText}>
          Believing Sam dead, Tom returned to Zion City, refining his abilities in solitude. When Sam resurfaced—corrupted and alive—Tom joined the Bludbruhs with Cole, Joseph, James, Tanner, and Zeke, syncing his sonic control with their efforts. But Sam’s dark surge clashed with Tom’s need for balance, and he followed Zeke in the rift, forming The Monkie Alliance with Ammon, Alex, Eli, Damon, Elijah, and Ethan. The Thunder Born rivalry flared, and Tom’s sound powers softened its edges when the Parliament intervened, though he remains wary of Sam’s lingering chaos, aligning his thunder with Monkie’s defiance.
          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Tom’s armor and sonic gifts grant him a range of powers focused on sound, support, and disruption, reflecting his Thunder Whisperer role:
          </Text>
          <Text style={styles.aboutText}>
          Sonic Control: Manipulates sound waves, amplifying whispers into deafening roars or focusing them into precise strikes, a skill born from Melcornia’s echoes.
          </Text>
          <Text style={styles.aboutText}>
          Sound Absorption: Dampens or absorbs ambient noise, silencing threats or shielding allies, enhanced by his armor’s materials.
          </Text>
          <Text style={styles.aboutText}>
          Harmonic Resonance: Creates vibrations that heal allies or destabilize foes, syncing with Monkie Alliance’s rhythm and his own balance.
          </Text>
          <Text style={styles.aboutText}>
          Thunder Pulse: Releases a concentrated sonic blast, stunning or disorienting enemies, tying his powers to the faction’s electric vibe.
          </Text>
          <Text style={styles.aboutText}>
          Auditory Insight: Detects subtle sounds or vibrations, enhancing his awareness, a trait honed by his quiet nature.
          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team
          </Text>
          <Text style={styles.aboutText}>
          Tom is the rhythm and support of The Monkie Alliance, complementing Zeke’s precision with his sonic finesse and Ammon’s charm with his calm. He’s steady, insightful, and deeply loyal to his team, seeing them as a symphony he keeps in tune. His relationship with Zeke is one of trust—he aligns his sound with Zeke’s leadership—while with Ammon, he pairs healing with resonance, and with Elijah “Chaos Wither,” he balances chaos with order.
          </Text>
          <Text style={styles.aboutText}>
          In The Monkie Alliance, Tom followed Zeke in the Bludbruhs split, rejecting Sam’s dark path for a harmonious one. His sonic control aided their feud with Thunder Born, and when the Parliament intervened, he supported Ammon’s efforts despite the fallout with Will, sharing a cautious view of Titans and Thunder Born alike. His Melcornia past forged his powers, and his role stabilizes the team against their rivals. In Zion City, he connects with the Titans’ subtle players like William and Emma, sharing their finesse, but his team prioritizes independence. His ultimate goal is to resonate Zion City’s future with Monkie Alliance, proving sound can harmonize chaos, while maintaining their shaky truce with Thunder Born.
          </Text>
          <Text style={styles.aboutText}>
          Tom sided with Zeke when Sam’s dark surge split the Bludbruhs, joining The Monkie Alliance to counter Thunder Born’s shadow with agility and harmony. His sonic pulses clashed with Thunder Born’s lightning in their Civil War-style feud, easing when the Parliament stepped in. Wary of Thunder Born’s electric edge but committed to Zeke’s vision, keeping tensions alive yet controlled.
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

export default TomBb;