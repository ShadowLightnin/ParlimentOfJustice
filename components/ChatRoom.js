import React, { useEffect, useState } from "react"; // ✅ Ensure React hooks are imported
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from "react-native";
import { db, auth } from "../api/firebaseConfig";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const ChatRoom = ({ chatId }) => {  // ✅ Hooks must be inside a function component!
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);  // ✅ Ensure `user` is a state variable

  useEffect(() => {
    // ✅ Correctly use useEffect inside the functional component
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;  // ✅ Ensure Firestore only listens if user is authenticated

    const messagesRef = collection(db, `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribeMessages();
  }, [chatId, user]);  // ✅ Run this effect when user changes

  const sendMessage = async () => {
    if (!user) {
      alert("You must be logged in to send messages!");
      return;
    }

    if (newMessage.trim() === "") return;

    await addDoc(collection(db, `chats/${chatId}/messages`), {
      sender: user.displayName || "Anonymous",
      text: newMessage,
      timestamp: serverTimestamp(),
      uid: user.uid,
    });

    setNewMessage("");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.messages}>
        {messages.map((msg) => (
          <View key={msg.id} style={styles.message}>
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
