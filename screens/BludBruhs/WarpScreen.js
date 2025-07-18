import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Audio } from 'expo-av';

const WarpScreen = () => {
  const navigation = useNavigation();
  const [sound, setSound] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const playWarpSound = async () => {
      const { sound: warpSound } = await Audio.Sound.createAsync(
        require('../../assets/audio/Sam.mp4'),
        { shouldPlay: true, volume: 1.0 }
      );
      if (isMounted) {
        setSound(warpSound);
        await warpSound.setPositionAsync(26000); // Start at 25 seconds (25,000 ms)
        await warpSound.playAsync();
        console.log("Warp sound (Sam.mp4) started at 25s at:", new Date().toISOString());
      }

      // Stop after 18 seconds (43s - 25s)
      setTimeout(async () => {
        if (isMounted && sound) {
          await sound.stopAsync();
          await sound.unloadAsync();
          setSound(null);
          console.log("Warp sound stopped at 43s at:", new Date().toISOString());
        }
      }, 18000);
    };

    playWarpSound();

    const timeout = setTimeout(() => {
      if (isMounted) {
        navigation.replace("Montrose"); // 🌌 Navigate to the new tabs screen
      }
    }, 8150); // Delay for warp effect

    return () => {
      isMounted = false;
      if (sound) {
        sound.stopAsync().catch(err => console.error("Error stopping sound:", err));
        sound.unloadAsync().catch(err => console.error("Error unloading sound:", err));
      }
      clearTimeout(timeout);
    };
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