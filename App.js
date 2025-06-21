import React, { useEffect, useContext, useState } from 'react';
import { Animated, View, Text, StyleSheet, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { auth } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContextProvider, { AuthContext } from './context/auth-context';
import Toast from 'react-native-toast-message';
import Notification from "./components/notification/Notification";


import { StartScreen } from './screens/StartScreen';
import { HomeScreen } from './screens/HomeScreen';
import { TitansStack } from './navigation/TitansStack';
import { EclipseStack } from './navigation/EclipseStack';
import { OlympiansStack } from './navigation/OlympiansStack';
import { CobrosStack } from './navigation/CobrosStack';
import { SpartansStack } from './navigation/SpartansStack';
import { BludBruhsStack } from './navigation/BludBruhsStack';
import { LegionairesStack } from './navigation/LegionairesStack';
import { ForgeStack } from './navigation/ForgeStack';
import { ConstollationStack } from './navigation/ConstollationStack';
import { DesignsStack } from './navigation/DesignsStack';
import { AdminStack } from "./navigation/AdminStack";
import SignupScreen from "./screens/SignupScreen";
import LoginScreen from "./screens/LoginScreen";
import PublicChatScreen from "./screens/PublicChatScreen";
import VillainsStack from './navigation/VillainsStack';
import JusticeStack from './navigation/JusticeStack';
import ShipYardStack from './navigation/ShipYardStack';

const Stack = createNativeStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Start"
        component={StartScreen}
      />
      <Stack.Screen name="Login">
        {props => (
          <>
            <LoginScreen {...props} />
            <Notification />
          </>
        )}
      </Stack.Screen>
      {/* <Stack.Screen name="Signup" component={SignupScreen} /> */}
    </Stack.Navigator>
  );
  
}

function AuthenticatedStack() {
  const authCtx = useContext(AuthContext);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="PublicChat" component={PublicChatScreen} />
      <Stack.Screen name="Admin" component={AdminStack} />
      <Stack.Screen name="Titans" component={TitansStack} />
      <Stack.Screen name="Eclipse" component={EclipseStack} />
      <Stack.Screen name="Olympians" component={OlympiansStack} />
      <Stack.Screen name="Cobros" component={CobrosStack} />
      <Stack.Screen name="ASTC" component={SpartansStack} />
      <Stack.Screen name="BludBruhs" component={BludBruhsStack} />
      <Stack.Screen name="Legionaires" component={LegionairesStack} />
      <Stack.Screen name="ForgeScreen" component={ForgeStack} />
      <Stack.Screen name="Constollation" component={ConstollationStack} />
      <Stack.Screen name="JusticeScreen" component={JusticeStack} />
      <Stack.Screen name="ShipYardScreen" component={ShipYardStack} />
      <Stack.Screen name="VillainsScreen" component={VillainsStack} />
      <Stack.Screen name="Designs" component={DesignsStack} /> 
    </Stack.Navigator>
  );
}

// Generic Faction Screen (for other factions)
const FactionScreen = ({ route }) => {
  const { title } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};
// initialParams={{ title: "Designs" }} for the FactionScreen ie:
// <Stack.Screen name="Designs" component={FactionScreen} initialParams={{ title: "Designs" }} />

function Navigation() {
  const authCtx = useContext(AuthContext);
  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
    </NavigationContainer>
  );
}

function Root() {
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      const storedToken = await AsyncStorage.getItem('token');

      if (storedToken) {
        authCtx.authenticate(storedToken);
      }

      setIsTryingLogin(false);
    }

    fetchToken();
  }, []);

  return <Navigation />;
}

export default function App() {
  
  return (
    <>
      <StatusBar style="light" />
      <AuthContextProvider>
        <Root />
      </AuthContextProvider>
      <Toast />
    </>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
};
