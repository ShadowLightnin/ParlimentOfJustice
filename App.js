import React, { useEffect, useContext, useState, useMemo, createContext } from 'react';
import {
  View,
  Text,
  useWindowDimensions,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { auth } from './lib/firebase';
import AuthContextProvider, { AuthContext } from './context/auth-context';
import Notification from './components/notification/Notification';

import { StartScreen } from './screens/StartScreen';
import { HomeScreen } from './screens/HomeScreen';
import { TitansStack } from './navigation/TitansStack';
import { EclipseStack } from './navigation/EclipseStack';
import { OlympiansStack } from './navigation/OlympiansStack';
import { CobrosStack } from './navigation/CobrosStack';
import { SpartansStack } from './navigation/SpartansStack';
import { BludBruhsStack } from './navigation/BludBruhsStack';
import MonkeAllianceScreen from './screens/BludBruhs/MonkeAlliance/MonkeAllianceScreen';
import { LegionairesStack } from './navigation/LegionairesStack';
import { ForgeStack } from './navigation/ForgeStack';
import { ConstollationStack } from './navigation/ConstollationStack';
import { DesignsStack } from './navigation/DesignsStack';
import { AdminStack } from './navigation/AdminStack';
import SignupScreen from './screens/SignupScreen';
import LoginScreen from './screens/LoginScreen';
import PublicChatScreen from './screens/PublicChatScreen';
import VillainsStack from './navigation/VillainsStack';
import PlanetsStack from './navigation/PlanetsStack';
import JusticeStack from './navigation/JusticeStack';
import ShipYardStack from './navigation/ShipYardStack';
import InfantryStack from './navigation/InfantryStack';

const Stack = createNativeStackNavigator();

/**
 * 🔁 Layout context
 * Re-renders automatically when the window size / orientation changes.
 * Use this in any screen instead of static Dimensions.get('window').
 */
export const LayoutContext = createContext({
  width: 0,
  height: 0,
  isLandscape: false,
  isTablet: false,
  isDesktop: false,
});

function LayoutProvider({ children }) {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const isTablet = Math.min(width, height) >= 600;
  const isDesktop = width >= 900; // tweak if you want

  const value = useMemo(
    () => ({
      width,
      height,
      isLandscape,
      isTablet,
      isDesktop,
    }),
    [width, height, isLandscape, isTablet, isDesktop]
  );

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Start" component={StartScreen} />
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
      <Stack.Screen name="MonkeAllianceScreen" component={MonkeAllianceScreen} />
      <Stack.Screen name="Legionaires" component={LegionairesStack} />
      <Stack.Screen name="ForgeScreen" component={ForgeStack} />
      <Stack.Screen name="Constollation" component={ConstollationStack} />
      <Stack.Screen name="JusticeScreen" component={JusticeStack} />
      <Stack.Screen name="PlanetsScreen" component={PlanetsStack} />
      <Stack.Screen name="ShipYardScreen" component={ShipYardStack} />
      <Stack.Screen name="Infantry" component={InfantryStack} />
      <Stack.Screen name="VillainsScreen" component={VillainsStack} />
      <Stack.Screen name="Designs" component={DesignsStack} />
    </Stack.Navigator>
  );
}

// Generic Faction Screen (still here if you need it)
const FactionScreen = ({ route }) => {
  const { title } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

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
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (storedToken) {
          authCtx.authenticate(storedToken);
        }
      } finally {
        setIsTryingLogin(false);
      }
    }

    fetchToken();
  }, []);

  // You could show a splash / loading here while isTryingLogin is true
  return <Navigation />;
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <SafeAreaProvider>
        {/* This kills the white bar and gives you a solid backdrop */}
        <SafeAreaView
          style={{ flex: 1, backgroundColor: 'black' }}
          edges={['top', 'right', 'bottom', 'left']}
        >
          <LayoutProvider>
            <AuthContextProvider>
              <Root />
            </AuthContextProvider>
            <Toast />
          </LayoutProvider>
        </SafeAreaView>
      </SafeAreaProvider>
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
