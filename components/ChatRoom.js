import React, { useEffect, useRef, useState } from "react"; 
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
import { onAuthStateChanged } from "firebase/auth";

const ChatRoom = ({ chatId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("Anonymous");

  const scrollViewRef = useRef();  // ✅ Add ref for ScrollView

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
      const newMessages = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(newMessages);

      // ✅ Auto-scroll to the bottom when messages update
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);  
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
      uid: user.uid,
    });

    setNewMessage("");
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        ref={scrollViewRef}    // ✅ Attach ref to ScrollView
        contentContainerStyle={styles.messages}
      >
        {messages.map((msg) => (
          <View 
            key={msg.id} 
            style={[
              styles.message, 
              msg.uid === user?.uid ? styles.sent : styles.received
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
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 15,
    overflow: "hidden",
    paddingVertical: 30,
    paddingHorizontal: 25,
    marginHorizontal: 'auto',
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
    maxWidth: '75%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  sent: {
    alignSelf: "flex-end",
    backgroundColor: "#1f8ef1",
    borderTopRightRadius: 0,
  },
  received: {
    alignSelf: "flex-start",
    backgroundColor: "#333",
    borderTopLeftRadius: 0,
  },
  sender: {
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
  },
  text: {
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
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
