import React, { useContext, Fragment } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Loading from '../components/Loading';
import AuthStack from './AuthStack';
import HomeStack from './HomeStack';
import { AuthContext } from '../context/auth.context';
import Sidebar from '../layout/sidebar';
import Modal from '../components/Modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Background from '../components/Background';
import AppearanceContext, { AppearanceProvider } from '../context/appearance.context';
import { ModalProvider } from '../context/modal.context';
import { WebSocketProvider } from '../context/socket.context';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '@react-navigation/stack'
import HeaderStack from './Header/HeaderStack';


export default function Routes({ navigation }: { navigation: any }) {
  const { userData, isLoad } = useContext(AuthContext) || {};

  if (isLoad) {
    return <Loading />;
  }

  const Drawer = createDrawerNavigator();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {userData ? (
        <WebSocketProvider>
          <AppearanceProvider>
            <ModalProvider>
              <Drawer.Navigator
                drawerContent={(props) => <Sidebar {...props} />}
                screenOptions={{
                  headerShown: true,
                  header: (props) => <HeaderStack {...props} />
                }}
              >
                <Drawer.Screen name=" " component={HomeStack} />
              </Drawer.Navigator>
              <Modal />
            </ModalProvider>
          </AppearanceProvider>
        </WebSocketProvider>
      ) : (
        <AuthStack />
      )}
      <Toast />
    </SafeAreaView>
  );
}