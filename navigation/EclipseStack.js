import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EclipseScreen } from '../screens/Eclipse/EclipseScreen';
import { EclipseMembersScreen } from '../screens/Eclipse/EclipseMembersScreen';

const Stack = createNativeStackNavigator();

export function EclipseStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EclipseHome" component={EclipseScreen} />
      <Stack.Screen name="EclipseMembers" component={EclipseMembersScreen} />
    </Stack.Navigator>
  );
}
