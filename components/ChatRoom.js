import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from "react-native";
import { database, auth } from "../api/firebaseConfig";
import { ref, push, onValue } from "firebase/database";

const ChatRoom = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const messagesRef = ref(database, `chats/${chatId}/messages`);
    onValue(messagesRef, (snapshot) => {
      if (snapshot.exists()) {
        setMessages(Object.values(snapshot.val()));
      } else {
        setMessages([]);
      }
    });
  }, [chatId]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    const messageRef = push(ref(database, `chats/${chatId}/messages`));
    await messageRef.set({
      sender: auth.currentUser?.displayName || "Anonymous",
      text: newMessage,
      timestamp: Date.now(),
    });

    setNewMessage("");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.messages}>
        {messages.map((msg, index) => (
          <View key={index} style={styles.message}>
            <Text style={styles.sender}>{msg.sender}:</Text>
            <Text style={styles.text}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      <TextInput
        style={styles.input}
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Type a message..."
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#1c1c1c" },
  messages: { flexGrow: 1, justifyContent: "flex-end" },
  message: { marginBottom: 10, padding: 10, backgroundColor: "#333", borderRadius: 5 },
  sender: { fontWeight: "bold", color: "#00b3ff" },
  text: { color: "#fff" },
  input: { backgroundColor: "#fff", padding: 10, borderRadius: 5, marginBottom: 10 },
});

export default ChatRoom;
