import { database } from "./firebaseConfig";
import { ref, push, set, onValue } from "firebase/database";

// Send Message
export const sendMessage = async (chatId, userId, text) => {
  const messageRef = push(ref(database, `chats/${chatId}/messages`));
  await set(messageRef, { sender: userId, text: text, timestamp: Date.now() });
};

// Listen for Messages
export const listenForMessages = (chatId, callback) => {
  const chatRef = ref(database, `chats/${chatId}/messages`);
  onValue(chatRef, (snapshot) => {
    callback(snapshot.val());
  });
};
