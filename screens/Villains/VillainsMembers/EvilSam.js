import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Modal,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db, auth, storage } from "../../../lib/firebase";
import { collection, onSnapshot, deleteDoc, doc, getDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import SamsArmory from "../../BludBruhs/SamsArmory";
import { Audio } from 'expo-av';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

const characters = [
  { id: "evil-sam-1", name: "Void Walker", codename: "Void Walker", copyright: "William Cummings", image: require("../../../assets/Armor/Sam2.jpg"), clickable: true, hardcoded: true },
  { id: "evil-sam-2", name: "Void Walker", codename: "Void Walker", copyright: "Samuel Woodwell", image: require("../../../assets/Armor/Sam6.jpg"), clickable: true, hardcoded: true },
];

const ALLOWED_EMAILS = ["will@test.com", "c1wcummings@gmail.com", "samuelp.woodwell@gmail.com"];
const RESTRICT_ACCESS = true;

const EvilSam = () => {
  const navigation = useNavigation();
  const flashAnim = useRef(new Animated.Value(1)).current;
  const [windowWidth, setWindowWidth] = useState(SCREEN_WIDTH);
  const [armorList, setArmorList] = useState(characters);
  const [previewArmor, setPreviewArmor] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ visible: false, armor: null });
  const [sound, setSound] = useState(null);
  const canMod = RESTRICT_ACCESS ? auth.currentUser?.email && ALLOWED_EMAILS.includes(auth.currentUser.email) : true;
  const isDesktop = windowWidth >= 768;

  // Dynamic window sizing
  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(Dimensions.get("window").width);
    };
    const subscription = Dimensions.addEventListener("change", updateDimensions);
    return () => subscription?.remove();
  }, []);

  // ⚡ Flashing Animation Effect for Planet
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(flashAnim, { toValue: 0.3, duration: 500, useNativeDriver: true }),
        Animated.timing(flashAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]).start();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Audio playback
  useEffect(() => {
    let isMounted = true;

    const playEvilWalkerSound = async () => {
      const { sound: evilWalkerSound } = await Audio.Sound.createAsync(
        require('../../../assets/audio/evilWalker.m4a'),
        { shouldPlay: true, isLooping: true, volume: 1.0 }
      );
      if (isMounted) {
        setSound(evilWalkerSound);
        await evilWalkerSound.playAsync();
        console.log("evilWalker.m4a started playing at:", new Date().toISOString());
      }
    };

    playEvilWalkerSound();

    return () => {
      isMounted = false;
      if (sound) {
        sound.stopAsync().catch(err => console.error("Error stopping sound:", err));
        sound.unloadAsync().catch(err => console.error("Error unloading sound:", err));
        setSound(null);
        console.log("evilWalker.m4a stopped at:", new Date().toISOString());
      }
    };
  }, []);

  const stopEvilWalkerSound = async () => {
    if (sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      console.log("evilWalker.m4a stopped via button at:", new Date().toISOString());
    }
  };

  // 🌌 Planet Click Handler → Leads to Warp Screen
  const handlePlanetPress = async () => {
    await stopEvilWalkerSound();
    navigation.navigate("WarpScreen");
  };

  // Firestore integration for dynamic armors
  useEffect(() => {
    const validatedArmors = characters.map((armor, index) => ({
      ...armor,
      id: armor.id || `evil-sam-armor-${index + 1}`,
      hardcoded: true,
      clickable: true,
    }));
    console.log("Validated Armors:", validatedArmors.map(a => ({ id: a.id, name: a.name || a.codename })));
    setArmorList(validatedArmors);

    const unsub = onSnapshot(collection(db, "evilSamArmory"), (snap) => {
      if (snap.empty) {
        console.log("No armor found in Firestore");
        setArmorList(validatedArmors);
        return;
      }
      const dynamicArmors = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        clickable: true,
        borderColor: doc.data().borderColor || "#00b3ff",
        hardcoded: false,
        copyright: "Samuel Woodwell",
      }));
      console.log("Fetched dynamic armors:", dynamicArmors.map(a => ({ id: a.id, name: a.name || a.codename })));

      const filteredDynamic = dynamicArmors.filter(
        (dynamic) => !validatedArmors.some(
          (armor) => armor.id === dynamic.id || armor.name === (dynamic.name || dynamic.codename) || armor.codename === (dynamic.name || dynamic.codename)
        )
      );
      console.log("Filtered dynamic armors:", filteredDynamic.map(a => ({ id: a.id, name: a.name || a.codename })));

      const combinedMap = new Map();
      [...validatedArmors, ...filteredDynamic].forEach((armor) => {
        combinedMap.set(armor.id, armor);
      });
      const combined = Array.from(combinedMap.values());
      console.log("Combined armors:", combined.map(a => ({ id: a.id, name: a.name || a.codename })));
      setArmorList(combined);
    }, (e) => {
      console.error("Firestore error:", e.code, e.message);
      Alert.alert("Error", `Failed to fetch armors: ${e.message}`);
    });
    return () => unsub();
  }, []);

  const handleArmorPress = (armor) => {
    if (!armor?.clickable) {
      console.log("Armor card not clickable:", armor?.name || armor?.codename);
      return;
    }
    console.log("Armor card pressed:", armor.name || armor.codename);
    setPreviewArmor(armor);
  };

  const confirmDelete = async (evilSamArmoryId) => {
    if (!auth.currentUser || !ALLOWED_EMAILS.includes(auth.currentUser.email)) {
      Alert.alert("Access Denied", "Only authorized users can delete armors.");
      return;
    }
    try {
      const armorItem = armorList.find(a => a.id === evilSamArmoryId);
      if (armorItem.hardcoded) {
        Alert.alert("Error", "Cannot delete hardcoded armors!");
        return;
      }
      const armorRef = doc(db, "evilSamArmory", evilSamArmoryId);
      const snap = await getDoc(armorRef);
      if (!snap.exists()) {
        Alert.alert("Error", "Armor not found");
        return;
      }
      const { imageUrl } = snap.data();
      if (imageUrl && imageUrl !== "placeholder") {
        let path = "";
        try {
          console.log("Raw imageUrl:", imageUrl);
          const urlParts = imageUrl.split("/o/");
          if (urlParts.length > 1) {
            path = decodeURIComponent(urlParts[1].split("?")[0]);
          }
          if (!path) {
            console.warn("No valid path extracted from imageUrl:", imageUrl);
          } else {
            console.log("Attempting to delete image:", path);
            await deleteObject(ref(storage, path)).catch(e => {
              if (e.code !== "storage/object-not-found") {
                throw e;
              }
              console.warn("Image not found in storage:", path);
            });
            console.log("Image deleted or not found:", path);
          }
        } catch (e) {
          console.error("Delete image error:", e.message, "Path:", path, "URL:", imageUrl);
          Alert.alert("Warning", `Failed to delete image from storage: ${e.message}. Armor will still be deleted.`);
        }
      }
      await deleteDoc(armorRef);
      console.log("Armor deleted from Firestore:", evilSamArmoryId);
      setArmorList(armorList.filter(a => a.id !== evilSamArmoryId));
      setDeleteModal({ visible: false, armor: null });
      Alert.alert("Success", "Armor deleted successfully!");
    } catch (e) {
      console.error("Delete armor error:", e.message);
      Alert.alert("Error", `Failed to delete armor: ${e.message}`);
    }
  };

  const renderCharacterCard = (armor) => (
    <View key={armor.id || `${armor.name}-${armor.codename}`} style={styles.armorCont}>
      <TouchableOpacity
        style={[styles.card(isDesktop, windowWidth), armor.clickable ? styles.clickable(armor.borderColor || "rgba(255, 255, 255, 0.1)") : styles.notClickable]}
        onPress={() => handleArmorPress(armor)}
        disabled={!armor.clickable}
      >
        <Image
          source={
            armor.image ||
            (armor.imageUrl && armor.imageUrl !== "placeholder"
              ? { uri: armor.imageUrl }
              : require("../../../assets/Armor/PlaceHolder.jpg"))
          }
          style={styles.armorImage}
          resizeMode="cover"
          onError={(e) => console.error("Image load error:", armor.name || armor.codename, e.nativeEvent.error)}
        />
        <View style={styles.transparentOverlay} />
        <Text style={styles.cardName}>
          © {armor.name || armor.codename || "Unknown"}; {armor.copyright}
        </Text>
        {!armor.clickable && <Text style={styles.disabledText}>Not Clickable</Text>}
      </TouchableOpacity>
      {!armor.hardcoded && (
        <View style={[styles.buttons, { width: isDesktop ? windowWidth * 0.2 : SCREEN_WIDTH * 0.9 }]}>
          <TouchableOpacity
            onPress={() => setPreviewArmor({ ...armor, isEditing: true })}
            style={[styles.editButton, !canMod && styles.disabled]}
            disabled={!canMod}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setDeleteModal({ visible: true, armor: { id: armor.id, name: armor.name || armor.codename || "Unknown" } })}
            style={[styles.deleteButton, !canMod && styles.disabled]}
            disabled={!canMod}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderPreviewCard = (armor) => (
    <TouchableOpacity
      key={armor.id || `${armor.name}-${armor.codename}`}
      style={[styles.card(isDesktop, windowWidth), styles.clickable(armor.borderColor || "rgba(255, 255, 255, 0.1)"), { width: isDesktop ? windowWidth * 0.3 : SCREEN_WIDTH * 0.9 }]}
      onPress={() => {
        console.log("Closing preview modal");
        setPreviewArmor(null);
      }}
    >
      <Image
        source={
          armor.image ||
          (armor.imageUrl && armor.imageUrl !== "placeholder"
            ? { uri: armor.imageUrl }
            : require("../../../assets/Armor/PlaceHolder.jpg"))
        }
        style={styles.armorImage}
        resizeMode="cover"
        onError={(e) => console.error("Preview image load error:", armor.name || armor.codename, e.nativeEvent.error)}
      />
      <View style={styles.transparentOverlay} />
      <Text style={styles.cardName}>
        © {armor.name || armor.codename || "Unknown"}; {armor.copyright}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require("../../../assets/BackGround/Enlightened.jpg")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={async () => {
                await stopEvilWalkerSound();
                navigation.replace("VillainsScreen", { screen: "VillainsTab" });
              }}
            >
              <Text style={styles.backButtonText}>⬅️</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Void Walker (Evil Edition)</Text>
            {/* Planet Button */}
            <TouchableOpacity onPress={handlePlanetPress} style={styles.planetContainer}>
              <Animated.Image
                source={require("../../../assets/Space/ExoPlanet.jpg")}
                style={[styles.planetImage, { opacity: flashAnim }]}
              />
            </TouchableOpacity>
          </View>

          {/* Armor Images in Horizontal Scroll */}
          <View style={styles.imageContainer}>
            <ScrollView
              horizontal
              contentContainerStyle={styles.imageScrollContainer}
              showsHorizontalScrollIndicator={false}
              snapToAlignment="center"
              snapToInterval={windowWidth * 0.7 + 20}
              decelerationRate="fast"
            >
              {armorList.map(renderCharacterCard)}
            </ScrollView>
          </View>

          {/* Armor Form */}
          <SamsArmory
            collectionPath="evilSamArmory"
            placeholderImage={require("../../../assets/Armor/PlaceHolder.jpg")}
            friend={armorList}
            setFriend={setArmorList}
            hardcodedFriend={characters}
            editingFriend={previewArmor?.isEditing ? previewArmor : null}
            setEditingFriend={setPreviewArmor}
          />

          {/* About Section */}
          <View style={styles.aboutSection}>
            <Text style={styles.aboutHeader}>About Me</Text>
            <Text style={styles.aboutText}>
              Early life: Once a young naive teenager that eventually 
              embarked on an adventure to another world in a dark mansion 
              realized his true potential and destiny.
            </Text>
            <Text style={styles.aboutText}>
              Recent Past: The mansion corrupted his mind and gave him 
              strange powers over darkness and electricity. Later after 
              seeing his masters ideals as evil he joined the Parliament of Justice 
              and created the BludBruhs faction. While forgoing his dark past he still 
              held on to the powers he was taught. And a love for Chroma who he met when
              he was still a follower of Erevos. Chroma was still corrupted in the shroud 
              of the evil ones.
            </Text>
            <Text style={styles.aboutText}>
              Present: Still extremely conflicted, he caused a rift within the 
              BludBruhs causing many to leave him to join a new faction, The Monke 
              Alliance. A large bounty was on Sam once he left the evil Enlightened.
            </Text>
            <Text style={styles.aboutText}>
              Motives: Wants to use dark powers he learned from the Enlightened 
              but the Monke Alliance is against it.
            </Text>
            <Text style={styles.aboutText}>
              ____________________________________________________________________
            </Text>
            <Text style={styles.aboutText}>
              Sam Woodwell, shrouded as “Evil Sam” during this dark chapter, is a vengeful and electrifying terror, a mysterious figure stalking Zion City’s factions before his reveal to Will “Night Hawk” and the Titans. His presence is a storm of malice and power, a corrupted blend of darkness and lightning that leaves death in its wake. Behind his metallic Jedi robes and floating skull helmet, Sam is tormented, ruthless, and driven by a fractured love for Chroma and a thirst for revenge against an unknown killer from Melcornia. He operates alone, a shadow of his former self, targeting The Advanced Spartan 3 Corp, Cobros 314, Olympians, Legionaires, and Constellation, his kills a prelude to his Thunder Born era. Off the battlefield, he’s a ghost, haunted by his past and plotting his next strike, his mind a battlefield of conflict and rage.
            </Text>
            <Text style={styles.aboutText}>
              Backstory
            </Text>
            <Text style={styles.aboutText}>
              Sam’s journey began as a naive teenager in Zion City’s Terrestrial sector, a dreamer who joined Will, Cole, Joseph, James, Tanner, Zeke, Elijah, Ammon, Tom, Ethan, Eli, Damon, and others on the pre-Parliament adventure to Melcornia. In that dark mansion, his family was slaughtered by an unknown figure, and Erevos, a sinister entity, promised justice and revenge, corrupting Sam’s mind with powers over darkness and electricity. The mansion twisted him, and he emerged as a disciple of the Enlightened, embracing their evil ideals. His love for Chroma, a fellow corrupted soul met under Erevos’s sway, became his anchor amidst the chaos.
            </Text>
            <Text style={styles.aboutText}>
              Rather than dying as his crew believed, Sam survived Melcornia, vanishing into Zion City’s shadows. Consumed by grief and Erevos’s influence, he became “Evil Sam,” a mysterious figure wielding his powers to hunt those he blamed for his pain. Before revealing himself to Will and the Titans, he unleashed a killing spree, targeting The Advanced Spartan 3 Corp—slaughtering Cam “Court Chief,” Ben “Chemoshock,” and Alex “Huntsman”—for their disciplined strength; Cobros 314—Tanner Despain, Ethan Workman, Jonah Gray, Nick Larsen, Alex Wood, and Kyle P—Will’s childhood Scout troop, for their ties to his past; Olympians—Gary Jr., Jackson, Garden, Josh, Sean, Heather C., Little Brett, Jake, Ailey, Aubrey, James, Kid Ryan, Ryan, Maren, Sasha, Ian, Riker, Dakota, Wayne, Christopher, Elizabeth, Tom—Will’s extended family, for their unity; and select Legionaires and Constellation members, widening his wrath. Each kill fueled his revenge, a dark prelude to his redemption arc.
            </Text>
            <Text style={styles.aboutText}>
              When the Parliament of Justice formed, Sam broke from the Enlightened, their bounty on his head a mark of his betrayal. Joining the Parliament, he formed the Bludbruhs, but this “Evil Sam” phase came first, his identity hidden until Will and the Titans faced him, shocked to find their lost friend alive and twisted. His shift to Thunder Born with Cole, Joseph, James, and Tanner marked his attempt at redemption, but this earlier reign of terror remains a grim legend.
            </Text>
            <Text style={styles.aboutText}>
              Abilities
            </Text>
            <Text style={styles.aboutText}>
              Sam’s corrupted powers and armor grant him a range of devastating abilities during his “Evil Sam” phase, blending his original skills with a darker edge:
            </Text>
            <Text style={styles.aboutText}>
              Electrical Manipulation: Commands lightning with lethal precision, striking foes with bolts or chaining electricity through groups, a power amplified by his rage.
            </Text>
            <Text style={styles.aboutText}>
              Telekinesis: Lifts and crushes objects or people with his mind, a dark tool of vengeance honed by Erevos, used to dismantle his targets.
            </Text>
            <Text style={styles.aboutText}>
              Mind Influence: Bends thoughts and wills with sinister force, sowing fear or obedience, a corrupted gift from the Enlightened he wields ruthlessly.
            </Text>
            <Text style={styles.aboutText}>
              Dark Surge: Unleashes a wave of shadow and electricity, obliterating enemies in a storm of corruption, a signature move of his killing spree.
            </Text>
            <Text style={styles.aboutText}>
              Shadow Cloak: Wraps himself in darkness, becoming near-invisible to stalk and strike, a stealth tactic that masked his identity as the mysterious figure.
            </Text>
            <Text style={styles.aboutText}>
              Personality and Role in the Narrative
            </Text>
            <Text style={styles.aboutText}>
              As “Evil Sam,” he is the storm and vengeance of his own dark tale, a solitary force of destruction before his Thunder Born redemption. He’s cold, conflicted, and driven by a twisted love for Chroma and revenge for Melcornia, his loyalty to his past crew buried under rage. His killing spree targeted those tied to Will—Spartans for their strength, Cobros for their bonds, Olympians for their family, and others for their resistance—each death a strike against the world that failed him.
            </Text>
            <Text style={styles.aboutText}>
              In this phase, Sam operated alone, his identity as the mysterious figure unknown until Will and the Titans confronted him, revealing the friend they thought lost. His shift to Thunder Born with Cole, Joseph, James, and Tanner, and the rift with Monkie Alliance, followed this terror, marking his struggle to reclaim his humanity. In Zion City, his spree left scars—families mourning, factions weakened—setting the stage for his redemption arc and the Parliament’s uneasy truce. His ultimate goal as “Evil Sam” was to punish the unknown killer through proxies, a dark prelude to his conflicted present.
            </Text>
            <Text style={styles.aboutText}>
              Before revealing himself, “Evil Sam” emerged as a mysterious figure post-Melcornia, his survival hidden as he hunted Zion City’s factions. He struck The Advanced Spartan 3 Corp, Cobros 314, Olympians, Legionaires, and Constellation, killing key members in a calculated rampage—retribution for his family’s death and a test of his corrupted power. His defeat of these groups preceded his Parliament entry, ending when Will and the Titans faced him, shocked by his survival and darkness, paving the way for his Thunder Born phase and Monkie rivalry.
            </Text>
          </View>
        </ScrollView>

        {/* Preview Modal */}
        {previewArmor && !previewArmor.isEditing && (
          <Modal
            visible={!!previewArmor}
            transparent={true}
            animationType="fade"
            onRequestClose={() => {
              console.log("Closing preview modal");
              setPreviewArmor(null);
            }}
          >
            <View style={styles.modalBackground}>
              <TouchableOpacity
                style={styles.modalOuterContainer}
                activeOpacity={1}
                onPress={() => {
                  console.log("Closing preview modal");
                  setPreviewArmor(null);
                }}
              >
                <View style={styles.imageContainer}>
                  <ScrollView
                    horizontal
                    contentContainerStyle={styles.imageScrollContainer}
                    showsHorizontalScrollIndicator={false}
                    snapToAlignment="center"
                    snapToInterval={isDesktop ? windowWidth * 0.3 : SCREEN_WIDTH * 0.9}
                    decelerationRate="fast"
                    centerContent={true}
                  >
                    {renderPreviewCard(previewArmor)}
                  </ScrollView>
                </View>
                <View style={styles.previewAboutSection}>
                  <Text style={styles.previewCodename}>{previewArmor?.codename || "No Codename"}</Text>
                  <Text style={styles.previewName}>{previewArmor?.name || "Unknown"}</Text>
                  <Text style={styles.previewDesc}>{previewArmor?.description || "No description available"}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      console.log("Closing preview modal");
                      setPreviewArmor(null);
                    }}
                    style={styles.closeButton}
                  >
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          visible={deleteModal.visible}
          transparent
          animationType="slide"
          onRequestClose={() => setDeleteModal({ visible: false, armor: null })}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{`Delete "${deleteModal.armor?.name || ""}" and its image?`}</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalCancel}
                  onPress={() => setDeleteModal({ visible: false, armor: null })}
                >
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalDelete}
                  onPress={() => deleteModal.armor && confirmDelete(deleteModal.armor.id)}
                >
                  <Text style={styles.modalDeleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

// Styles (from old EvilSam.js)
const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: "cover",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    flex: 1,
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
  planetContainer: {
    alignItems: "center",
    marginVertical: 20,
    backgroundColor: "transparent",
  },
  planetImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.8,
  },
  imageContainer: {
    width: "100%",
    paddingVertical: 20,
    paddingLeft: 15,
  },
  imageScrollContainer: {
    flexDirection: "row",
    paddingHorizontal: 10,
    alignItems: "center",
  },
  armorCont: {
    marginRight: 20,
    alignItems: "center",
  },
  card: (isDesktop, windowWidth) => ({
    width: isDesktop ? windowWidth * 0.2 : SCREEN_WIDTH * 0.9,
    height: isDesktop ? SCREEN_HEIGHT * 0.8 : SCREEN_HEIGHT * 0.7,
    borderRadius: 15,
    overflow: "hidden",
    elevation: 5,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  }),
  clickable: (borderColor) => ({
    borderWidth: 2,
    borderColor: borderColor || "rgba(255, 255, 255, 0.1)",
  }),
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
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#FFC107",
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "#F44336",
    padding: 8,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 12,
  },
  disabled: {
    backgroundColor: "#ccc",
    opacity: 0.6,
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
    color: "#D4AF37",
    textAlign: "center",
  },
  aboutText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalOuterContainer: {
    width: "80%",
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
  },
  previewAboutSection: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#222",
    borderRadius: 10,
    width: "100%",
  },
  previewCodename: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#00b3ff",
    textAlign: "center",
  },
  previewName: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
    marginTop: 5,
  },
  previewDesc: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    marginVertical: 10,
  },
  closeButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  modalCancel: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  modalCancelText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalDelete: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
  },
  modalDeleteText: {
    color: "#FFF",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default EvilSam;