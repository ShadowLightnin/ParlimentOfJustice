import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useReducer, useState } from 'react';

// Initial state for user input
const initialUserState = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  firstNameValid: false,
  lastNameValid: false,
  phoneValid: false,
  emailValid: false,
};

// Reducer function for handling user input state
const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIRST_NAME':
      return { ...state, firstName: action.payload, firstNameValid: action.payload.trim().length > 0 };
    case 'SET_LAST_NAME':
      return { ...state, lastName: action.payload, lastNameValid: action.payload.trim().length > 0 };
    case 'SET_PHONE':
      return { ...state, phone: action.payload, phoneValid: action.payload.length === 12 };
    case 'SET_EMAIL':
      return { ...state, email: action.payload, emailValid: action.payload.includes('@') };
    default:
      return state;
  }
};

// Create context for authentication & user management
export const AuthContext = createContext({
  state: initialUserState,
  dispatch: () => {},
  token: '',
  isAuthenticated: false,
  authenticate: () => {},
  logout: () => {},
});

const AuthContextProvider = ({ children }) => {
  // Authentication state
  const [authToken, setAuthToken] = useState(null);

  // User state managed by useReducer
  const [state, dispatch] = useReducer(userReducer, initialUserState);

  // Authenticate user and store token
  const authenticate = async (token) => {
    setAuthToken(token);
    await AsyncStorage.setItem('token', token);
  };

  // Logout user and remove token
  const logout = async () => {
    setAuthToken(null);
    await AsyncStorage.removeItem('token');
  };

  // Load token from AsyncStorage on app start
  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) {
        setAuthToken(storedToken);
      }
    };
    loadToken();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch, token: authToken, isAuthenticated: !!authToken, authenticate, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
