import React, { useContext, Fragment } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Loading from '../components/Loading';
import AuthStack from './AuthStack';
import HomeStack from './HomeStack';
import { AuthContext } from '../context/auth.context';
import Sidebar from '../layout/sidebar';
import Modal from '../components/Modal';
import { SafeAreaView } from 'moti';
import Toast from 'react-native-toast-message';
import Background from '../components/Background';
import AppearanceContext from '../context/appearance.context';


export default function Routes() {
  const { userData, isLoad } = useContext(AuthContext) || {};

  if (isLoad) {
    return <Loading />;
  }

  const Drawer = createDrawerNavigator();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {userData ? (
        <Fragment>
          <Drawer.Navigator
            drawerContent={(props) => <Sidebar {...props} />}
            screenOptions={{ headerShown: true }}
          >
            <Drawer.Screen name=" " component={HomeStack} />
          </Drawer.Navigator>
          <Modal />
        </Fragment>
      ) : (
        <AuthStack />
      )}
      <Toast />
    </SafeAreaView>
  );
}