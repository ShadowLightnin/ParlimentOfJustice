import React, { useState, useEffect } from "react";
import { 
  View, Text, Image, ScrollView, StyleSheet, TouchableOpacity, Dimensions 
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const Cam = () => {
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
    { name: "Court Chief", copyright: "William Cummings", image: require("../../../assets/Armor/Cam4.jpg"), clickable: true },
    { name: "Court Chief", copyright: "William Cummings", image: require("../../../assets/Armor/Cam3.jpg"), clickable: true },
    { name: "Court Chief", copyright: "William Cummings", image: require("../../../assets/Armor/Cam5.jpg"), clickable: true },
    { name: "", image: require("../../../assets/Armor/Cam.jpg"), clickable: true }, // No copyright
    { name: "Court Chief", copyright: "William Cummings", image: require("../../../assets/Armor/Cam2.jpg"), clickable: true }, // With copyright
  ];

  const renderArmorCard = (armor, index) => (
    <TouchableOpacity
      key={`${armor.name}-${armor.copyright || index}`} // Unique key using name, copyright, or index
      style={[styles.card(isDesktop, windowWidth), armor.clickable ? styles.clickable : styles.notClickable]}
      onPress={() => armor.clickable && console.log(`${armor.name || 'Unnamed'} clicked`)}
      disabled={!armor.clickable}
    >
      <Image source={armor.image} style={styles.armorImage} />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        {armor.copyright ? `© ${armor.name || 'Unknown'}; ${armor.copyright}` : (armor.name)}
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
          <Text style={styles.title}>Court Chief</Text>

        </View>

        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            contentContainerStyle={styles.imageScrollContainer}
            showsHorizontalScrollIndicator={false}
            snapToAlignment="center"
            snapToInterval={windowWidth * 0.7 + 20}
            decelerationRate="fast"
          >
            {armors.map((armor, index) => renderArmorCard(armor, index))}
          </ScrollView>
        </View>

        <View style={styles.aboutSection}>
          <Text style={styles.aboutHeader}>About Me</Text>
          <Text style={styles.aboutText}>
          Cam Paul, known as Court Chief, is a dynamic and inspiring leader, the heart of The Advanced Spartan 3 Corp, a trio of elite warriors navigating Zion City’s fractured landscape. His presence is energetic and commanding, a blend of athletic prowess and battlefield savvy that makes him a natural captain for his squad. Behind his vibrant pink Halo-inspired armor, Cam is passionate, dependable, and fiercely loyal to his teammates Ben Preston “Chemoshock” and Alex Croft “Huntsman,” seeing their skills as vital to their shared mission. He draws strength from his love of basketball and Halo, infusing his leadership with a competitive spirit and strategic flair. Off duty, he’s a custodian by trade, keeping spaces clean and orderly, and a jumper by talent, always ready to leap into action—literally or figuratively—but his focus on teamwork can sometimes make him overly reliant on his crew.          </Text>
          <Text style={styles.aboutText}>
          Backstory
          </Text>
          <Text style={styles.aboutText}>
          Cam grew up in Zion City’s Terrestrial sector, in a working-class family that valued grit and community. As a kid, he was obsessed with basketball, spending hours on the court perfecting his jumps, and Halo, where he honed his tactical mind playing as a Spartan. His athleticism and gaming skills shaped him into a leader, always rallying his friends for pickup games or co-op missions. Working as a custodian in his civilian life, Cam learned the value of keeping things in order, a trait that carried over into his warrior role.          </Text>
          <Text style={styles.aboutText}>
          When Zion City’s lower sectors spiraled into chaos, Cam’s skills were put to the test. During a cleanup shift in the Telestial sector, he leapt into action against looters, his natural jumping ability letting him scale obstacles and take charge. This moment sparked his recruitment into The Advanced Spartan 3 Corp, where he donned his pink Halo 5 armor—tweaked with a touch of Monster Hunter flair—to lead Ben and Alex. His love for Halo inspired his leadership style, treating every mission like a campaign, while his basketball roots kept him agile and team-focused.          </Text>
          <Text style={styles.aboutText}>
          Cam formed a tight bond with Ben, a chemical genius, and Alex, a hunter-mechanic, seeing their trio as a perfect unit: his leadership, Ben’s constructs, and Alex’s marksmanship. Together, they tackle threats from the Outer Darkness sector, but Cam’s custodian mindset pushes him to “clean up” Zion City’s messes, both literal and metaphorical, sometimes stretching their small team thin.          </Text>
          <Text style={styles.aboutText}>
          Abilities          
          </Text>
          <Text style={styles.aboutText}>
          Cam’s armor and athletic background grant him a range of powers focused on leadership, mobility, and combat, reflecting his basketball and Halo passions:          </Text>
          <Text style={styles.aboutText}>
          Enhanced Jumping: Can leap great distances and heights with precision, inspired by basketball dunks and Halo’s Spartan agility, allowing him to reach vantage points or close gaps in battle.          </Text>
          <Text style={styles.aboutText}>
          Tactical Command: Leads his team with Halo-honed strategy, boosting their coordination and morale, making quick calls that turn the tide of fights, much like a point guard on the court.          </Text>
          <Text style={styles.aboutText}>
          Energy Slam: Channels energy into a ground-pounding jump, creating shockwaves that knock back enemies or clear debris, a nod to his custodian role and Halo’s explosive flair.          </Text>
          <Text style={styles.aboutText}>
          Combat Reflexes: Moves with the speed and precision of a seasoned soldier, wielding melee weapons or firearms with skill, blending basketball agility with Spartan training.          </Text>
          <Text style={styles.aboutText}>
          Team Synergy: Amplifies his teammates’ abilities when near them, reflecting his leadership and trust in Ben’s constructs and Alex’s arrows, a power rooted in his team-first mentality.          </Text>
          <Text style={styles.aboutText}>
          Personality and Role in the Team          </Text>
          <Text style={styles.aboutText}>
          Cam is the drive and coordination of The Advanced Spartan 3 Corp, leading with a mix of Halo-inspired strategy and basketball hustle. He’s competitive, upbeat, and deeply loyal to Ben and Alex, seeing their trio as unbeatable when synced. His relationship with Ben is one of trust, relying on his constructs for defense, while with Alex, it’s a brotherly bond, matching his jumps with Alex’s arrows.          </Text>
          <Text style={styles.aboutText}>
          In the broader context of Zion City, Cam connects with the Titans’ leaders like Spencer and Jared, sharing their protective instincts, but his smaller squad operates independently, tackling specific threats. His love for Halo fuels his tactical mind, while his custodian role reflects his desire to “clean up” the city, one leap at a time. His ultimate goal is to unify his team’s strengths to restore order in Zion City, proving that leadership and teamwork can overcome any chaos.          </Text>
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
    color: "#c222ba",
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
    borderColor: "rgba(255, 255, 255, 0.1)",
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
    color: "#c222ba",
    textAlign: "center",
  },
  aboutText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
});

export default Cam;