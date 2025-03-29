import React from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

// Screen dimensions
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

// Sam's Original Ranger Squad Clones
const samsClones = [
  { name: "", codename: "Captain Zardo", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/Ranger12.jpg") },
  { name: "CT-8949", codename: "Blitz", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/Ranger1.jpg") },
  { name: "CT-7600", codename: "Lt. Ridge", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/Ranger2.jpg") },
  { name: "CT-1276", codename: "ARC Tarin", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/Ranger7.jpg") },
  { name: "CT-8681", codename: "Venom", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/Ranger8.jpg") },
  { name: "CT-8949", codename: "Rancor", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/Ranger9.jpg") },
  { name: "", codename: "", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/Ranger10.jpg") },
  { name: "", codename: "", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/Ranger11.jpg") },
  { name: "", codename: "", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/Ranger3.jpg") },
  { name: "", codename: "", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/Ranger4.jpg") },
  { name: "", codename: "", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/Ranger5.jpg") },
  { name: "", codename: "", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/Ranger6.jpg") },
];

// My Custom Clones
const myClones = [
  { name: "Split", codename: "", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/clonetroopersplit.jpg") },
  { name: "", codename: "", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/clonetrooperdarkbluegreen.jpg") },
  { name: "Marine Commander", codename: "", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/clonetroopermarinecommander.jpg") },
  { name: "Luteniet Truffel", codename: "", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/clonetrooperlutenietTruffel.jpg") },
  { name: "", codename: "", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/clonetrooperblueishgray.jpg") },
  { name: "", codename: "", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/clonetroopercrusade.jpg") },
  { name: "", codename: "", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/clonetrooperdefault.jpg") },
  { name: "", codename: "", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/clonetrooperdefault3.0.png") },
  { name: "", codename: "", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/clonetrooperdevestation.jpg") },
  { name: "", codename: "", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/clonetroopergreen.jpg") },
  { name: "", codename: "", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/clonetroopergreencamo.jpg") },
  { name: "", codename: "", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/clonetrooperlightbluegreen.jpg") },
  { name: "", codename: "", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/clonetroopermustardyellow.jpg") },
  { name: "", codename: "", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/clonetrooperorange.jpg") },
  { name: "", codename: "", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/clonetroopersplitblack.jpg") },
  { name: "", codename: "", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/clonetroopersplitgreen.jpg") },
  { name: "", codename: "", screen: "", clickable: false, image: require("../../../assets/Armor/Clone/clonetrooperyellow.jpg") },
];

// Grid layout settings
const isDesktop = SCREEN_WIDTH > 600;
const columns = isDesktop ? 5 : 3;
const samsRows = Math.ceil(samsClones.length / columns);
const myRows = Math.ceil(myClones.length / columns);

const cardSize = isDesktop ? 160 : 110;
const cardHeightMultiplier = 2;
const horizontalSpacing = isDesktop ? 40 : 20;
const verticalSpacing = isDesktop ? 50 : 30;

export const RangerSquad = () => {
  const navigation = useNavigation();

  const goToChat = () => {
    navigation.navigate("TeamChat");
  };

  const renderGrid = (clones, numRows) => {
    return Array.from({ length: numRows }).map((_, rowIndex) => (
      <View key={rowIndex} style={[styles.row, { gap: horizontalSpacing, marginBottom: verticalSpacing }]}>
        {Array.from({ length: columns }).map((_, colIndex) => {
          const memberIndex = rowIndex * columns + colIndex;
          const member = clones[memberIndex];

          if (!member) return <View key={colIndex} style={{ width: cardSize, height: cardSize * cardHeightMultiplier }} />;

          return (
            <TouchableOpacity
              key={colIndex}
              style={[
                styles.card,
                { width: cardSize, height: cardSize * cardHeightMultiplier },
                !member.clickable && styles.disabledCard,
              ]}
              disabled={!member.clickable}
            >
              <Image
                source={member.image || require("../../../assets/Armor/PlaceHolder.jpg")}
                style={styles.characterImage}
              />
              <Text style={styles.codename}>{member.codename}</Text>
              <Text style={styles.name}>{member.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    ));
  };

  return (
    <ImageBackground source={require("../../../assets/BackGround/RangerSquad.jpg")} style={styles.background}>
      <SafeAreaView style={styles.container}>
        <View style={styles.headerWrapper}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.header}>Ranger Squad 17</Text>
          <TouchableOpacity onPress={goToChat} style={styles.chatButton}>
            <Text style={styles.chatText}>🛡️</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Sam's Clones */}
          {renderGrid(samsClones, samsRows)}

          {/* Separator */}
          <View style={styles.separatorContainer}>
            <Text style={styles.separatorText}>
              ______________________________________________________________________________________________________________________________
              </Text>
          </View>

          {/* My Clones */}
          {renderGrid(myClones, myRows)}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    width: SCREEN_WIDTH,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
  },
  headerWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 5,
  },
  backText: {
    fontSize: 18,
    color: "#00b3ff",
    fontWeight: "bold",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  chatButton: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 5,
  },
  chatText: {
    fontSize: 18,
    color: "#00b3ff",
    fontWeight: "bold",
  },
  scrollContainer: {
    paddingBottom: 20,
    flexGrow: 1,
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#1c1c1c",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    padding: 5,
    shadowColor: "#00b3ff",
    shadowOpacity: 1.5,
    shadowRadius: 10,
    elevation: 5,
  },
  disabledCard: {
    shadowColor: "transparent",
    backgroundColor: "#444",
  },
  characterImage: {
    width: "100%",
    height: "86%",
    resizeMode: "cover",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  name: {
    fontSize: 10,
    fontStyle: "italic",
    color: "#aaa",
    textAlign: "center",
  },
  codename: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 5,
  },
  separatorContainer: {
    width: SCREEN_WIDTH,
    alignItems: "center",
    marginBottom: verticalSpacing,
  },
  separatorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#00b3ff",
    textAlign: "center",
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});

export default RangerSquad;