import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DesignsScreen } from '../screens/Designs/DesignsScreen';
import ModelsScreen from '../screens/Designs/ModelsScreen';
import VideosScreen from '../screens/Designs/VideosScreen';
import OthersScreen from '../screens/Designs/OthersScreen';
import UploadDesign from '../components/UploadDesign';
// import {  } from '../screens//';

const Stack = createNativeStackNavigator();

export function DesignsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DesignsHome" component={DesignsScreen} />
      <Stack.Screen name="ModelsScreen" component={ModelsScreen} />
      <Stack.Screen name="VideosScreen" component={VideosScreen} />
      <Stack.Screen name="OthersScreen" component={OthersScreen} />
      <Stack.Screen name="UploadDesign" component={UploadDesign} />
      {/* <Stack.Screen name="" component={} /> */}
    </Stack.Navigator>
  );
}
