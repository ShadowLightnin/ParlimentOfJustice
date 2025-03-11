import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ChatRoom from "../../components/ChatRoom";

const TeamChatScreen = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require("../../assets/BackGround/helldivers.webp")} // Add your image file here
      style={styles.container}
    >
      {/* 🟢 Header as a Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.header}>Team Chat</Text>
      </TouchableOpacity>

      <ChatRoom chatId="TeamChat" />
    </ImageBackground>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1c1c1c", paddingTop: 50 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a5994",
    textAlign: "center",
    paddingVertical: 10, // Add padding for easier clicking
  },
});

export default TeamChatScreen;
