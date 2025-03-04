import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TitansScreen } from '../screens/Titans/TitansScreen';
import UploadCharacter from '../components/UploadCharacter';
import UploadDesign from '../components/UploadDesign';
// import { Will } from '../screens/Titans/Will';

const Stack = createNativeStackNavigator();

export function TitansStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TitansHome" component={TitansScreen} />
      <Stack.Screen name="UploadCharacter" component={UploadCharacter} />
      <Stack.Screen name="UploadDesign" component={UploadDesign} />
      {/* <Stack.Screen name="NightHawk" component={Will} /> */}
    </Stack.Navigator>
  );
}
