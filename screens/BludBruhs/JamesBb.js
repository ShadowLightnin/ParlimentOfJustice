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
          Spencer McNeil, known as Annihilus, is the eldest of the McNeil siblings and the oldest among the nine oldest cousins, making him a foundational figure in the Titans and the Parliament of Justice. His imposing presence is a mix of authority, nostalgia, and vulnerability, a fallen leader who once united his extended family but now struggles with uncertainty. He’s deeply committed to helping others, especially his siblings Jared and Jennifer, his cousins Ben and Azure (Briggs), Will and Emma (Cummings), and the other oldest cousins like Josh S and Garden. Spencer prefers the simplicity and morality of a bygone era, reminiscent of Christ’s time, where faith, community, and honor guided actions. Despite losing his way, his inherent goodness and love for his family—spanning the McNeil’s, Briggs, Cummings, Jensen’s, Bolander’s, and Stillman families—make him a cherished, if conflicted, patriarch.
          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Raised in a remote village on the edge of Zion City’s Terrestrial sector, Spencer was the firstborn of the McNeil siblings, with Jared and Jennifer following closely. His family, part of a larger network of cousins from the Cummings, Jensen’s, Briggs, Bolander’s, and Stillman clans, shared a deep-rooted tradition of faith, strength, and unity. As the oldest cousin, Spencer took it upon himself to lead, mentoring not only his siblings but also cousins like Ben and Azure (Briggs), Will and Emma (Cummings), and the Stillman cousins Josh S and Garden, who were among the nine oldest.
          </Text>
          <Text style={styles.aboutText}>
          When Zion City’s sectors fractured, Spencer’s village faced raids from the lawless Outer Darkness sector. During one such attack, his super strength emerged, saving his siblings and cousins and solidifying his role as the Titans’ leader. The burning goat skull relic he later discovered—tied to myths of destruction and renewal—became his symbol, but as modern corruption and technological overreach grew, Spencer began to withdraw, longing for the simplicity of the past.          
          </Text>
          <Text style={styles.aboutText}>
          His leadership waned as he saw the younger cousins, like Jared, adapt to the new world with speed and innovation, while he clung to outdated ideals. Among the nine oldest cousins, only seven—Spencer, Jared, Jennifer, Ben, Azure, Will, and Emma—formed the core Titans, with Josh S and Garden occasionally stepping in. Spencer now sees Jared as his potential successor, a realization that both inspires and haunts him, as he fears losing the values he holds dear.          
          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Spencer’s powers are a reflection of his role as a fallen leader and protector of his vast family          
          </Text>
          <Text style={styles.aboutText}>
          Super Strength: The cornerstone of his identity, now tempered by doubt but still formidable when inspired by his family’s faith.          
          </Text>
          <Text style={styles.aboutText}>
          Endurance: A testament to his lifelong commitment to his cousins and siblings, though he sometimes overextends himself.          
          </Text>
          <Text style={styles.aboutText}>
          Fire Aura: The flickering flames of his helmet symbolize his inner struggle, burning brightly when he draws strength from family bonds.          
          </Text>
          <Text style={styles.aboutText}>
          Primal Instinct: Rooted in his shared heritage with the Briggs and Cummings cousins, this instinct helps him protect and anticipate threats.          
          </Text>
          <Text style={styles.aboutText}>
          Earthshaking Impact: A power to disrupt and defend, often used to shield his family from Zion City’s chaos.          
          </Text>
          <Text style={styles.aboutText}>
          Inspirational Presence: His ability to uplift his siblings and cousins, especially Jared, whom he mentors as his successor, remains his greatest asset.          
          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team          
          </Text>
          <Text style={styles.aboutText}>
          As the oldest Titan and cousin, Spencer is the unofficial patriarch of the nine oldest, but his fall from leadership has left him searching for purpose. He’s deeply connected to his siblings (Jared and Jennifer) and cousins (Ben and Azure, Will and Emma, Josh S and Garden), often acting as their advisor and protector. His preference for the past clashes with the modern approaches of younger cousins like Lee (Jensen) and Mason (Stillman), but his goodness ensures he remains a stabilizing force.          
          </Text>
          <Text style={styles.aboutText}>
          Spencer sees Jared as his successor, a role that both pressures and inspires him. His relationships with the other Titans—Jennifer’s compassion, Ben and Azure’s teamwork, Will and Emma’s innovation—are rooted in shared history, while his interactions with the broader family (like Todd’s leadership from Cummings or Samantha’s strength from Jensen’s) remind him of his broader responsibility. His goal is to reclaim his leadership by guiding Jared and the Titans to balance tradition and progress, ensuring Zion City’s safety for all their families.          
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

export default JameBb;