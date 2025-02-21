import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TitansScreen } from '../screens/Titans/TitansScreen';
// import { TitanMembersScreen } from '../screens/Titans/TitanMembersScreen';

const Stack = createNativeStackNavigator();

export function TitansStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TitansHome" component={TitansScreen} />
      {/* <Stack.Screen name="TitanMembers" component={TitanMembersScreen} /> */}
    </Stack.Navigator>
  );
}
