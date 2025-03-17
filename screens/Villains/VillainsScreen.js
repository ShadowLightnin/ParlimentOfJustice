import React from 'react';
import { View, Text, ImageBackground, StyleSheet, Dimensions } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import VillainsTab from './VillainsTab';
import BigBadsTab from './BigBadsTab';
import DemonsSection from './DemonsSection';

// Screen dimensions
const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// Tab navigator
const Tab = createMaterialTopTabNavigator();

const VillainsScreen = () => {
  return (
    <ImageBackground source={require('../../assets/BackGround/VillainsHub.jpg')} style={styles.background}>
      <View style={styles.container}>
        {/* Tabs for Villains and Big Bads */}
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: styles.tabBar,
            tabBarLabelStyle: styles.tabLabel,
            tabBarIndicatorStyle: { backgroundColor: 'red' },
          }}
        >
          <Tab.Screen name="Villains" component={VillainsTab} />
          <Tab.Screen name="Big Bads" component={BigBadsTab} />
        </Tab.Navigator>
        <Text style={styles.header}>The Enlightened</Text>
        {/* Demons Section below the tabs */}
        <DemonsSection />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  tabBar: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  tabLabel: {
    fontSize: 16,
    color: '#FFF',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#750000',
    textAlign: 'center',
    textShadowColor: '#cacaca',
    textShadowRadius: 20,
  },
});

export default VillainsScreen;
