import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PublicChatScreen from "../screens/Chat/PublicChatScreen";
import TeamChatScreen from "../screens/Chat/TeamChatScreen";

const Stack = createNativeStackNavigator();

export function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PublicChat" component={PublicChatScreen} />
      <Stack.Screen name="TeamChat" component={TeamChatScreen} />
    </Stack.Navigator>
  );
}
