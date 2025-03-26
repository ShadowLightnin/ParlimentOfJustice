import React, { useEffect, useState } from "react"; 
import { View, Text, TextInput, Button, ScrollView, StyleSheet } from "react-native";
import { db, auth } from "../lib/firebase";
import { 
    collection, 
    addDoc, 
    query, 
    orderBy, 
    onSnapshot, 
    doc, 
    getDoc, 
    serverTimestamp 
} from "firebase/firestore";
import { onAuthStateChanged, updateProfile } from "firebase/auth";

const ChatRoom = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("Anonymous");

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserName(userDoc.data().username || currentUser.displayName || "Anonymous");
        } else {
          setUserName(currentUser.displayName || "Anonymous");
        }
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const messagesRef = collection(db, `chats/${chatId}/messages`);
    const q = query(messagesRef, orderBy("timestamp"));

    const unsubscribeMessages = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribeMessages();
  }, [chatId, user]);

  const sendMessage = async () => {
    if (!user) {
      alert("You must be logged in to send messages!");
      return;
    }

    if (newMessage.trim() === "") return;

    await addDoc(collection(db, `chats/${chatId}/messages`), {
      sender: userName,
      text: newMessage,
      timestamp: serverTimestamp(),
      uid: user.uid,  // ✅ Track who sent the message for layout control
    });

    setNewMessage("");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.messages}>
        {messages.map((msg) => (
          <View 
            key={msg.id} 
            style={[
              styles.message, 
              msg.uid === user?.uid ? styles.sent : styles.received // ✅ Conditional styling for left/right
            ]}
          >
            <Text style={styles.sender}>{msg.sender}:</Text>
            <Text style={styles.text}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '90%',                // Responsive width for better balance
    maxWidth: 400,               // Prevents excessive stretching
    alignSelf: 'center',         // Centers the container horizontally
    justifyContent: 'center',    // Centers the content vertically
    padding: 20,
    // backgroundColor: "rgba(0, 0, 0, 0.6)", 
    borderRadius: 15,
    overflow: "hidden",
    paddingVertical: 30,        
    paddingHorizontal: 25,
    marginHorizontal: 'auto',    // Ensures horizontal centering
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
  },
  messages: {
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  message: {
    maxWidth: '75%', // ✅ Compact the message bubbles
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  sent: {
    alignSelf: "flex-end",         // ✅ Messages from the sender on the right
    backgroundColor: "#1f8ef1",    // 🔵 Blue for sent messages
    borderTopRightRadius: 0,       // Visual detail for bubble effect
  },
  received: {
    alignSelf: "flex-start",       // ✅ Messages received on the left
    backgroundColor: "#333",       // ⚫ Dark grey for received messages
    borderTopLeftRadius: 0,        // Visual detail for bubble effect
  },
  sender: {
    fontWeight: "bold",
    color: "#fff",                 // 🔹 White text for both sides
    marginBottom: 2,
  },
  text: {
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",           // 🟦 Align input & button side by side
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  input: {
    flex: 1, 
    backgroundColor: "#222",
    color: "white",
    padding: 10,
    borderRadius: 5,
  },
});

export default ChatRoom;
