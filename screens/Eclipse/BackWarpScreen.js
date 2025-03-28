import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const BackWarpScreen = () => {
    const navigation = useNavigation();

    useEffect(() => {
        setTimeout(() => {
            navigation.replace("Aileen");  // ✅ Replace instead of reset
        }, 5500);  // Warp effect delay
    }, []);

    return (
        <View style={styles.container}>
            <Image 
                source={require("../../assets/Space/warp.gif")} 
                style={styles.warpImage} 
            />
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
    warpImage: {
        width: '100%',
        height: '100%',
        resizeMode: "cover",
    }
});

export default BackWarpScreen;
