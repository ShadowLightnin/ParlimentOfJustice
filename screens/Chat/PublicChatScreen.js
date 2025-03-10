import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ChatRoom from "../../components/ChatRoom";

const PublicChatScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* 🟢 Header as a Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.header}>Public Chat</Text>
      </TouchableOpacity>

      <ChatRoom chatId="PublicChat" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1c1c1c", paddingTop: 50 },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#c6eeff",
    textAlign: "center",
    paddingVertical: 10, // Add padding for easier clicking
  },
});

export default PublicChatScreen;
