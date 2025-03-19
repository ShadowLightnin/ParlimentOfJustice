import React from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import { useNavigation } from "@react-navigation/native";

const NateScreen = () => { 
  const navigation = useNavigation(); // ✅ Use this ONLY if the prop is missing

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔥 Demon Lord Nate 🔥</Text>
      <Image 
        source={require('../../../assets/Villains/Nate.jpg')} 
        style={styles.image} 
      />
      <Text style={styles.description}>
        The mighty Demon Lord Nate reigns supreme, feared by all who cross his path. Beware his wrath!
      </Text>
      <Button title="Return" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 20,
  },
  title: {
    fontSize: 32,
    color: 'red',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 15,
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default NateScreen;
