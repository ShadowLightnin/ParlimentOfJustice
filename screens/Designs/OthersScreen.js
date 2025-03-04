import React from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const OthersScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Others</Text>

      {/* Upload Button */}
      <Button title="Upload File" onPress={() => navigation.navigate("UploadDesign", { type: "file" })} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1c1c1c" },
  header: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 20 },
  backButton: { position: "absolute", top: 40, left: 20, padding: 10, backgroundColor: "rgba(255, 255, 255, 0.2)", borderRadius: 5 },
  backText: { fontSize: 18, color: "#00b3ff", fontWeight: "bold" },
});

export default OthersScreen;
