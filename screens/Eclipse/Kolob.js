import React from "react";
import { View, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const Kolob = () => {
    const navigation = useNavigation();

    const handleBack = () => {
        navigation.navigate("BackWarpScreen"); // 🚀 Navigate to the warp screen
    };

    return (
        <TouchableOpacity style={styles.container} onPress={handleBack} activeOpacity={0.9}>
            <Image
                source={require("../../assets/Kolob.jpg")}
                style={styles.planetImage}
            />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
    },
    planetImage: {
        width: "100%",  // ✅ Full screen width
        height: "100%", // ✅ Full screen height
        resizeMode: "cover", // Ensures it fills the screen neatly
    },
});

export default Kolob;
