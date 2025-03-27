import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Alert 
} from "react-native"; // ✅ Added missing imports

import { assignDefaultRoles } from "../../lib/firebaseUtils"; // Utility import
import { useNavigation } from "@react-navigation/native";

const AdminPanel = () => {
  const navigation = useNavigation();
  const [userRole, setUserRole] = useState("viewer"); // ✅ Added state initialization

  useEffect(() => {
    assignDefaultRoles();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Admin Panel</Text>

      {userRole !== "admin" ? (
        <Text style={styles.errorText}>Access Denied: You are not an admin.</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.userList}>
          <Text>Admin content here...</Text>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1c1c1c", paddingTop: 50, alignItems: "center" },
  backButton: { position: "absolute", top: 40, left: 20, padding: 10, backgroundColor: "rgba(255, 255, 255, 0.2)", borderRadius: 5 },
  backText: { fontSize: 18, color: "#00b3ff", fontWeight: "bold" },
  header: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  errorText: { color: "#ff4444", fontSize: 18, marginTop: 20 },
  userList: { flexGrow: 1, alignItems: "center", padding: 20 }
});

export default AdminPanel;
