import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import VillainsScreen from '../screens/Villains/VillainsScreen';
import DemonsSection from '../screens/Villains/DemonsSection';
import VillainsTab from '../screens/Villains/VillainsTab';
import BigBadsTab from '../screens/Villains/BigBadsTab';

//Villains


//Big Bad


// Demons
import NateScreen from '../screens/Villains/NateScreen';

const Stack = createNativeStackNavigator();

const VillainsStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Villains" component={VillainsScreen} />
      <Stack.Screen name="VillainsTab" component={VillainsTab} />
      <Stack.Screen name="BigBadsTab" component={BigBadsTab} />
      <Stack.Screen name="DemonsSection" component={DemonsSection} />
      <Stack.Screen name="NateScreen" component={NateScreen} />
    </Stack.Navigator>
  );
};

export default VillainsStack;