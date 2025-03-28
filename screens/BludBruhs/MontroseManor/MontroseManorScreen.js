import React from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const MontroseManorScreen = () => {
    const navigation = useNavigation();

    // 🌀 Navigate to the Landing Screen
    const handlePlanetClick = () => {
        navigation.navigate("Landing");
    };

    return (
        <View style={styles.container}>
            {/* Background Image */}
            {/* <Image
                source={require("../../../assets/Space.jpg")} // Your background image
                style={styles.backgroundImage}
            /> */}
            
            {/* 🌍 Make the planet clickable */}
            <TouchableOpacity onPress={handlePlanetClick}>
                <Image 
                    source={require("../../../assets/Space/ExoPlanet.jpg")}
                    style={styles.planetImage}
                />
            </TouchableOpacity>

            {/* 🔙 Back Button */}
            <TouchableOpacity onPress={() => navigation.navigate("BackWarpScreen")} style={styles.backButton}>
                <Text style={styles.backButtonText}>Run Back to Sam</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
    },
    backgroundImage: {
        position: "absolute", // Keep the background behind everything else
        width: "100%",
        height: "100%",
        resizeMode: "cover", // Make sure the background covers the screen
        zIndex: -1, // Ensure the background stays behind other elements
    },
    planetImage: {
        width: 300,
        height: 300,
        resizeMode: "contain",
        marginBottom: 30,
    },
    backButton: {
        backgroundColor: "#750000",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        elevation: 5,
    },
    backButtonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    text: {
        color: "#FFF",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
});

export default MontroseManorScreen;
