import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { db, auth } from "../../lib/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";

const AdminPanel = () => {
  const navigation = useNavigation();
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState("viewer");

  useEffect(() => {
    fetchUsers();
    checkAdminAccess();
  }, []);

  // Fetch all users
  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsers(usersList);
  };

  // Check if the logged-in user is an admin
  const checkAdminAccess = async () => {
    if (!auth.currentUser) return;
  
    try {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
  
      if (userSnap.exists()) {
        const role = userSnap.data().role;
        setUserRole(role);
        console.log(`✅ User Role Loaded: ${role}`); // Debug Log
      } else {
        console.log("❌ User not found in Firestore.");
      }
    } catch (error) {
      console.error("🔥 Firestore Error:", error.message);
    }
  };
  
  const upgradeUser = async (userId, currentRole) => {
    let newRole = "";
    if (currentRole === "viewer") newRole = "editor";
    else if (currentRole === "editor") newRole = "admin";
    else {
      Alert.alert("⚠️ Error", "User is already an admin.");
      return;
    }
  
    Alert.alert(
      "Upgrade User?",
      `Are you sure you want to promote this user to ${newRole}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Confirm", onPress: async () => {
            try {
              const userRef = doc(db, "users", userId);
              await updateDoc(userRef, { role: newRole });
  
              console.log(`✅ Successfully upgraded ${userId} to ${newRole}`);
              fetchUsers();
            } catch (error) {
              console.error("🔥 Upgrade Error:", error.message);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Admin Panel</Text>

      {/* Only show if Admin */}
      {userRole !== "admin" ? (
        <Text style={styles.errorText}>Access Denied: You are not an admin.</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.userList}>
          {users.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <Text style={styles.userName}>{user.name || "Unknown User"}</Text>
              <Text style={styles.userRole}>Role: {user.role}</Text>
              {user.role !== "admin" && (
                <TouchableOpacity style={styles.upgradeButton} onPress={() => upgradeUser(user.id, user.role)}>
                  <Text style={styles.upgradeText}>Promote to {user.role === "viewer" ? "Editor" : "Admin"}</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1c1c1c", paddingTop: 50, alignItems: "center" },
  header: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  backButton: { position: "absolute", top: 40, left: 20, padding: 10, backgroundColor: "rgba(255, 255, 255, 0.2)", borderRadius: 5 },
  backText: { fontSize: 18, color: "#00b3ff", fontWeight: "bold" },
  errorText: { color: "#ff4444", fontSize: 18, marginTop: 20 },
  userList: { flexGrow: 1, alignItems: "center", padding: 20 },
  userCard: { backgroundColor: "#333", padding: 15, marginVertical: 10, width: "90%", borderRadius: 5, alignItems: "center" },
  userName: { fontSize: 18, fontWeight: "bold", color: "#fff" },
  userRole: { fontSize: 16, color: "#00b3ff", marginBottom: 5 },
  upgradeButton: { backgroundColor: "#00b3ff", padding: 10, borderRadius: 5, marginTop: 5 },
  upgradeText: { fontSize: 16, color: "#fff" },
});

export default AdminPanel;
