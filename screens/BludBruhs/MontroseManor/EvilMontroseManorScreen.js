import React from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet, Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const MontroseManorScreen = () => {
    const navigation = useNavigation();

    const handlePlanetClick = () => {
        navigation.navigate("Landing");
    };

    return (
        <View style={styles.container}>
            {/* Background Image (Uncomment if needed) */}
            {/* <Image
                source={require("../../../assets/Space/Space.jpg")}
                style={styles.backgroundImage}
            /> */}
            {/* Planet and Text Wrapper */}
            <TouchableOpacity onPress={handlePlanetClick} style={styles.planetWrapper}>
                <Text style={styles.text}>Melcornia</Text>
                <Image 
                    source={require("../../../assets/Space/ExoPlanet.jpg")}
                    style={styles.planetImage}
                />
            </TouchableOpacity>

            {/* 🔙 Back Button */}
            <TouchableOpacity onPress={() => navigation.navigate("EvilBackWarpScreen")} style={styles.backButton}>
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
        position: "absolute",
        width: "100%",
        height: "100%",
        resizeMode: "cover",
        zIndex: -1,
    },
    planetWrapper: {
        alignItems: "center", // Center children horizontally
        justifyContent: "center", // Center children vertically
        position: "absolute", // Center within the container
        top: SCREEN_HEIGHT / 2 - 180, // Adjust based on planet + text height (300px planet + 30px text + margins)
        left: SCREEN_WIDTH / 2 - 150, // Half of planet width (300px)
    },
    planetImage: {
        width: 300,
        height: 300,
        resizeMode: "contain",
    },
    text: {
        color: "black", // White base color
        fontSize: 30, // Larger for ominous effect
        fontWeight: "900", // Extra bold to mimic creepy fonts
        textTransform: "uppercase", // All caps for spookiness
        textShadowColor: "#FF4500", // Orange-red glow for eeriness
        textShadowOffset: { width: 2, height: 2 }, // Slight offset for depth
        textShadowRadius: 2.5, // Wide glow effect
        marginBottom: 10,
    },
    backButton: {
        backgroundColor: "#750000",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        elevation: 5,
        position: "absolute",
        bottom: 30, // Move to bottom of screen
    },
    backButtonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default MontroseManorScreen;
