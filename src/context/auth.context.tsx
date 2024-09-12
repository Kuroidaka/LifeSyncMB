import React, { createContext, useState, useEffect, ReactNode } from 'react';
import authenApi from '../api/auth.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ToastAndroid, Linking } from 'react-native';
import { API_BASE_URL, PREFIX } from '../constant/BaseURl';
import { getToken, removeToken, storeToken } from '../utils';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../screens/type'

interface AuthContextType {
  login: (username: string, password: string) => Promise<void>;
  logOut: () => void;
  userData: any;
  setUserData: React.Dispatch<React.SetStateAction<any>>;
  isLoad: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  linkGoogleAccount: () => void;
  unlinkGoogleAccount: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoad, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>({});
  const [storedToken, setStoredToken] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  useEffect(() => {
    const fetchTokenData = async () => {
      setLoading(true);
      const token = await getToken();
      if(token) setStoredToken(token);

      if (!token) {
        setLoading(false);
        logOut();
        return;
      }

      try {
        const user = await authenApi.verifyToken().catch((error) => {
          console.error('User token verification failed:', error);
          return null;
        });

        if (!user) {
          logOut();
          return;
        }

        let googleUser = null;
        try {
          googleUser = await authenApi.verifyGoogleToken();
        } catch (error) {
          console.log('No linked Gmail account or Google token verification failed:', error);
        }

        const finalUser = { ...user, ...googleUser };
        setUserData(finalUser);
        const refreshedToken = await getToken();
        if(refreshedToken) setStoredToken(refreshedToken);
      } catch (err) {
        console.error('Token verification failed:', err);
        logOut();
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();
  }, [storedToken]);

  // useEffect(() => {
  //   console.log('check user data');
  //   if(userData) {

  //   }
  // }, [userData]);

  const regenerateToken = async () => {
    try {
      const res = await authenApi.regenerateToken();
      const token = res.data.token;
      await AsyncStorage.setItem('token', token);
      setStoredToken(token);
    } catch (error) {
      ToastAndroid.show('Something went wrong when regenerating token', ToastAndroid.LONG);
    }
  };

  const linkGoogleAccount = async () => {
    try {
      if (userData?.id) {
        const url = `${API_BASE_URL}${PREFIX}google/link-gmail?userId=${userData.id}`;
        Linking.openURL(url);
        
        const checkDeepLink = Linking.addEventListener('url', async () => {
          await regenerateToken();
          checkDeepLink.remove(); // Clean up the listener after token regeneration
        });
      }
    } catch (error) {
      console.log(error);
      ToastAndroid.show("Something went wrong when linking Google account", ToastAndroid.LONG);
    }
  };

  const unlinkGoogleAccount = async () => {
    try {
      await authenApi.unlinkGoogle();
      await regenerateToken();
    } catch (error) {
      ToastAndroid.show('Something went wrong when unlinking Google account', ToastAndroid.LONG);
    }
  };

  const logOut = async () => {
    await removeToken()
    setUserData(null)
    console.log('Navigating to login screen...');
  };

  const login = async (username: string, password: string) => {
    const res = await authenApi.login(username, password);
    console.log(res.data.token);

    if (res.data.token) {
      // Save token using utils
      await storeToken(res.data.token);
      setStoredToken(res.data.token);
      // Navigate to another screen
    }
  };
  const value: AuthContextType = {
    login, logOut,
    userData,
    setUserData,
    isLoad,
    setLoading,
    linkGoogleAccount,
    unlinkGoogleAccount,
  };

  // if (!storedToken) {
  //   // Replace navigation logic with your preferred method in React Native
  //   console.log('User not authenticated. Redirecting to login...');
  //   return null;
  // }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
