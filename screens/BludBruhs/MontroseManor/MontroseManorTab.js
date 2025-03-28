import React from "react";
import { View, ImageBackground, StyleSheet, Dimensions, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import HomeScreen from "./HomeScreen";
// import MoreScreen from "./MoreScreen";

const Tab = createBottomTabNavigator();

const MontroseManorTab = () => {
  const navigation = useNavigation(); // Get navigation instance

  return (
    <ImageBackground
      source={require("../../../assets/MontroseManorPlaceHolder.jpg")}
      style={styles.background}
    >
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backButtonText}>Escape</Text>
      </TouchableOpacity>

      {/* <View style={styles.overlay}>
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen name="Book 1" component={View} />
          <Tab.Screen name="Book 2" component={View} />
        </Tab.Navigator>
      </View> */}
    </ImageBackground>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: width,  
    height: height, 
    position: "absolute",
    top: 0,
    left: 0,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)", 
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 40,  // Adjust for safe area
    left: 20, // Position on the left
    backgroundColor: "rgba(118, 11, 11, 0.6)", // Slight transparency
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default MontroseManorTab;
