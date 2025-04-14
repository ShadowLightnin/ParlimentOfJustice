import React, { useRef } from "react";
import { View, Image, TouchableOpacity, Text, StyleSheet, Dimensions, PanResponder } from "react-native";
import { useNavigation } from "@react-navigation/native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

const MontroseManorScreen = () => {
    const navigation = useNavigation();
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (evt, gestureState) => {
                const newX = gestureState.moveX - 50; // Adjust for text width/2
                const newY = gestureState.moveY - 15; // Adjust for text height/2
                textPosition.current = { x: newX, y: newY };
                setTextPosition({ ...textPosition.current });
            },
        })
    ).current;

    const [textPosition, setTextPosition] = React.useState({ x: SCREEN_WIDTH / 2 - 100, y: SCREEN_HEIGHT / 2 - 150  });

    const handleTitleClick = () => {
        navigation.navigate("Landing");
    };

    return (
        <View style={styles.container}>
            {/* Planet Image as Background */}
            <Image 
                source={require("../../../assets/Space/Melcornia.jpg")}
                style={styles.backgroundImage}
            />

            {/* Draggable and Clickable Title */}
            <View
                style={[styles.draggableText, { left: textPosition.x, top: textPosition.y }]}
                {...panResponder.panHandlers}
            >
                <TouchableOpacity onPress={handleTitleClick} activeOpacity={0.8}>
                    <Text style={styles.text}>Melcornia</Text>
                </TouchableOpacity>
            </View>

            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.navigate("BackWarpScreen")} style={styles.backButton}>
                <Text style={styles.backButtonText}>Run Back to Sam</Text>
            </TouchableOpacity>

            {/* Transparent Touch-Blocking Overlay */}
            <View style={styles.transparentOverlay} />
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
    draggableText: {
        position: "absolute",
        zIndex: 2, // Ensure it's above the overlay
    },
    text: {
        color: "black",
        fontSize: 30,
        fontWeight: "900",
        textTransform: "uppercase",
        textShadowColor: "#49ab2eb5",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 2.5,
    },
    backButton: {
        backgroundColor: "#750000",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        elevation: 5,
        position: "absolute",
        bottom: 30,
        zIndex: 2, // Ensure it's above the overlay
    },
    backButtonText: {
        color: "#FFF",
        fontSize: 18,
        fontWeight: "bold",
    },
    transparentOverlay: {
        ...StyleSheet.absoluteFillObject, // Covers the whole screen
        backgroundColor: 'rgba(0, 0, 0, 0)', // Fully transparent
        zIndex: 1, // Below draggable text and back button but above background
    },
});

export default MontroseManorScreen;