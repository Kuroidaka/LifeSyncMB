import React, { useContext, useState, useEffect, Fragment } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
// import auth from '@react-native-firebase/auth';
// import AuthStack from './AuthStack';
// import HomeStack from './HomeStack';
// import { AuthContext } from './AuthProvider';
import Loading from '../components/Loading';
import AuthStack from './AuthStack';
import HomeStack from './HomeStack';
import { AuthContext } from '../context/auth.context';
import Sidebar from '../layout/sidebar';
import { TaskProvider } from '../context/task.context';
import Modal from '../components/Modal';
import { SafeAreaView } from 'moti';
import Toast from 'react-native-toast-message';
import { RoutineProvider } from '../context/routine.context';

export default function Routes() {
  const { userData, isLoad } = useContext(AuthContext) || {};


  if (isLoad) {
    return <Loading />;
  }

  const Drawer = createDrawerNavigator();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {userData ?
      <Fragment>
          <Drawer.Navigator
            drawerContent={(props) => <Sidebar {...props} />}
            screenOptions={{ headerShown: true }}
          >
            <Drawer.Screen name="Home" component={HomeStack} />
          </Drawer.Navigator>
          <Modal />
      </Fragment>
      :
      <AuthStack />
      }
       <Toast />
    </SafeAreaView>
  );
}