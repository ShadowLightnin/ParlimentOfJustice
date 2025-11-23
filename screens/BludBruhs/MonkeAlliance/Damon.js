import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Damon = () => {
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
    { name: "Pixel Maverick", image: require("../../../assets/Armor/Damon2.jpg"), clickable: true },
    { name: "Pixel Maverick", image: require("../../../assets/Armor/Damon_cleanup.jpg"), clickable: true },
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
          <Text style={styles.title}>Pixel Maverick</Text>
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
          Damon, known as Pixel Maverick, is a mischievous and unpredictable disruptor, a vibrant glitch in The Monkie Alliance under Zeke “Enderstrike’s” command within Zion City’s chaotic digital sprawl. His presence is erratic and infectious, a mix of playful chaos and memetic flair that makes him a wild card for his team. Behind his shifting, digital-themed armor, Damon is witty, irreverent, and fiercely loyal to his Monkie Alliance comrades—Zeke, Ammon “Quick Wit,” Alex M “Swiftmind,” Eli “Shadow Hunter,” Tom “Thunder Whisperer,” Elijah “Chaos Wither,” and Ethan “Bolt Watcher”—seeing their agility as a canvas for his randomness. He wields humor and confusion like weapons, turning battles into a game. Off the battlefield, he’s a jokester and a tinkerer, often crafting memes or tweaking his suit, but his chaotic antics can sometimes test his team’s patience.
          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Damon grew up in Zion City’s Telestial sector, in a tech-savvy family obsessed with digital culture and humor. From a young age, he was drawn to memes and randomness, a passion that took root when he joined Sam, Will (later “Night Hawk”), Cole, Joseph, James, Tanner, Zeke, Elijah, Ammon, Tom, Ethan, Eli, and others on the pre-Parliament adventure to Melcornia. In that dark mansion, Damon’s exposure to a glitchy, chaotic energy—sparked by Sam’s corruption by Erevos—awoke his memetic powers, letting him twist reality with humor and disorder as the group fought to survive.
          </Text>
          <Text style={styles.aboutText}>
          Believing Sam dead, Damon returned to Zion City, embracing his digital chaos in the city’s underbelly. When Sam resurfaced—corrupted and alive—Damon joined the Bludbruhs with Cole, Joseph, James, Tanner, and Zeke, using his randomness to throw foes off balance. His antics synced with Sam’s lightning and Zeke’s teleportation, but Sam’s dark surge clashed with Damon’s lighter chaos. When the Bludbruhs split, Damon sided with Zeke, rejecting Sam’s shadow for a playful, defiant path, forming The Monkie Alliance with Ammon, Alex, Eli, Tom, Elijah, and Ethan. The rivalry with Thunder Born—Sam, Cole, Joseph, James, and Tanner—flared into a Civil War-style feud, later mended through Parliament ties, but Damon remains skeptical of Thunder Born’s serious tone, preferring his pixelated pranks.
          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Damon’s armor and chaotic nature grant him a range of powers focused on disruption, influence, and unpredictability, reflecting his Pixel Maverick persona:
          </Text>
          <Text style={styles.aboutText}>
          Memetic Manipulation: Alters perceptions with meme-like illusions or effects, confusing foes or boosting allies’ morale, a skill born from Melcornia’s glitchy energy.
          </Text>
          <Text style={styles.aboutText}>
          Humor Inducement: Infuses humor into situations, disarming enemies with laughter or rallying teammates, a playful power that shifts the mood of battles.
          </Text>
          <Text style={styles.aboutText}>
          Randomness Projection: Unleashes chaotic, unpredictable bursts—shifting visuals, sounds, or objects—disrupting order, a digital chaos tied to his armor’s shifting patterns.
          </Text>
          <Text style={styles.aboutText}>
          Pixel Shift: Briefly glitches his position or form, evading attacks or surprising foes, a subtle nod to his Monkie agility and digital theme.
          </Text>
          <Text style={styles.aboutText}>
          Chaos Boost: Amplifies his team’s unpredictability (e.g., Elijah’s chaos, Zeke’s teleport), reflecting his role as a disruptor and Monkie wildcard.
          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team
          </Text>
          <Text style={styles.aboutText}>
          Damon is the chaos and levity of The Monkie Alliance, complementing Zeke’s precision with his randomness and Ammon’s charm with his humor. He’s cheeky, creative, and deeply loyal to his team, seeing them as a game he keeps lively. His relationship with Zeke is one of playful trust—he spices up Zeke’s plans with chaos—while with Tom “Thunder Whisperer,” he pairs sound with visuals, and with Elijah “Chaos Wither,” he amplifies disorder with glee.
          </Text>
          <Text style={styles.aboutText}>
          In The Monkie Alliance, Damon followed Zeke in the Bludbruhs split, rejecting Sam’s dark path for a lighter, chaotic one. His randomness clashed with Thunder Born in their Civil War-style feud, and when the Parliament intervened, he backed Ammon’s stance, sharing a playful skepticism of Thunder Born and the Titans’ seriousness. His Melcornia past forged his powers, and his role disrupts foes for the team. In Zion City, he connects with the Titans’ wildcards like Emma and Ethan, sharing their flair, but his team prioritizes independence. His ultimate goal is to glitch Zion City’s threats with Monkie Alliance, proving chaos and humor can win, while maintaining their shaky truce with Thunder Born.
          </Text>
          <Text style={styles.aboutText}>
          Damon sided with Zeke when Sam’s dark surge split the Bludbruhs, joining The Monkie Alliance to counter Thunder Born’s shadow with agility and chaos. His pixel tricks baffled Thunder Born in their Civil War-style feud, easing when the Parliament stepped in. Wary of Thunder Born’s electric edge but committed to Zeke’s vision, keeping tensions alive with a smirk.
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

export default Damon;