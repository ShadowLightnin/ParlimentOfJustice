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
            <Text style={styles.text}>Montrose Manor... Coming Soon</Text>
            
            {/* 🌍 Make the planet clickable */}
            {/* <TouchableOpacity onPress={handlePlanetClick}> */}
                <Image 
                    source={require("../../../assets/ExoPlanet.jpg")}
                    style={styles.planetImage}
                />
            {/* </TouchableOpacity> */}

            {/* 🔙 Back Button */}
            <TouchableOpacity onPress={() => navigation.navigate("BackWarpScreen")} style={styles.backButton}>
                <Text style={styles.backButtonText}>⬅️ Back to Sam</Text>
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
