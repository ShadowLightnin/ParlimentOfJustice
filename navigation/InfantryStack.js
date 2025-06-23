import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Hero Screens
import InfantryScreen from '../screens/Infantry/Infantry';

// import Screen from '../screens/Justice/';

const Stack = createNativeStackNavigator();

const InfantryStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Base Screens */}
      <Stack.Screen name="InfantryScreen" component={InfantryScreen} />

    </Stack.Navigator>
  );
};

export default InfantryStack;
