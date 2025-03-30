import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../../lib/firebase";
import ChatRoom from "../../components/ChatRoom";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const ALLOWED_EMAILS = [
  "will@test.com",
  "aileen@test.com",
  "c1wcummings@gmail.com",
  "cummingsnialla@gmail.com",
];

const Aileenchat = () => {
  const navigation = useNavigation();
  const [canAccessPrivateChat, setCanAccessPrivateChat] = useState(false);
  const flatListRef = useRef(null); // Ref for scrolling

  useEffect(() => {
    const user = auth.currentUser;
    if (user && ALLOWED_EMAILS.includes(user.email)) {
      setCanAccessPrivateChat(true);
    } else {
      setCanAccessPrivateChat(false);
    }
  }, []);

  // Scroll to bottom when chat loads or new messages arrive
  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  // Assuming ChatRoom notifies us of new messages or we can trigger this manually
  useEffect(() => {
    if (canAccessPrivateChat) {
      // Initial scroll to bottom when chat loads
      setTimeout(() => scrollToBottom(), 100); // Delay to ensure content is rendered
    }
  }, [canAccessPrivateChat]);

  return (
    <ImageBackground
      source={require("../../assets/BackGround/Temple.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* Private Chat */}
        {canAccessPrivateChat ? (
          <View style={styles.privateChatContainer}>
            <Text style={styles.privateChatHeader}>AiWill</Text>
            <ChatRoom
              chatId="TeamChat"
              ref={flatListRef} // Pass ref if ChatRoom supports it
              onContentSizeChange={scrollToBottom} // Auto-scroll on new messages
            />
          </View>
        ) : (
          <Text style={styles.accessDeniedText}>Private chat access restricted.</Text>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    width: '100%',
    height: '100%',
  },
  backButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 20,
  },
  backText: {
    fontSize: 18,
    color: '#00b3ff',
    fontWeight: 'bold',
  },
  privateChatContainer: {
    flex: 1, // Fill available space
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
  },
  privateChatHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  accessDeniedText: {
    fontSize: 16,
    color: "#ff4444",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Aileenchat;