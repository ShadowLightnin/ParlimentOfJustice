import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";

export default function SubjectTerminatedScreen() {
  const navigation = useNavigation();
  const [sound, setSound] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const play = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/audio/FirstCM.mp4"), // your audio file
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );

      if (isMounted) setSound(sound);
    };

    play();

    return () => {
      isMounted = false;
      if (sound) sound.unloadAsync();
    };
  }, []);

  const onPlaybackStatusUpdate = (status) => {
    if (status.didJustFinish) {
      // AUDIO IS DONE → KICK USER OUT
      navigation.reset({
        index: 0,
        routes: [{ name: "EclipseHome" }], // change to your target screen
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>SUBJECT TERMINATED</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "red",
    fontSize: 32,
    fontWeight: "bold",
    letterSpacing: 3,
  },
});
