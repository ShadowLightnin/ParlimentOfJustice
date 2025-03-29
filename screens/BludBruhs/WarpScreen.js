import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const WarpScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Montrose"); // 🌌 Navigate to the new tabs screen
    }, 5700); // Delay for warp effect
  }, []);

  return (
    <View style={styles.container}>
      <Image 
        source={require("../../assets/Space/warp.gif")} 
        style={styles.warpImage} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  warpImage: {
    width: '100%',
    height: '100%',
    resizeMode: "cover",
  }
});

export default WarpScreen;
