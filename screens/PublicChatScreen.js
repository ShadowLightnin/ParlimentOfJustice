import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ChatRoom from "../components/ChatRoom";

// Screen dimensions
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const PublicChatScreen = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require("../assets/BackGround/Parliment.png")} 
      style={styles.background}
    >
      <View style={styles.container}>
        {/* 🟢 Header as a Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.header}>Public Chat</Text>
        </TouchableOpacity>

        {/* Chat Room Component */}
        <ChatRoom chatId="PublicChat" />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark overlay
    width: '100%',
    height: '100%',
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    paddingVertical: 10, // Add padding for easier clicking
  },
});

export default PublicChatScreen;
