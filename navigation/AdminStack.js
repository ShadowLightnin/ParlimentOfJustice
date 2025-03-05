import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AdminPanel from "../screens/Admin/AdminPanel";

const Stack = createNativeStackNavigator();

export function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminPanel" component={AdminPanel} />
    </Stack.Navigator>
  );
}
