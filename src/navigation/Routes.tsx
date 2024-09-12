import React, { useContext, useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
// import auth from '@react-native-firebase/auth';
// import AuthStack from './AuthStack';
// import HomeStack from './HomeStack';
// import { AuthContext } from './AuthProvider';
import Loading from '../components/Loading';
import AuthStack from './AuthStack';
import HomeStack from './HomeStack';
import { AuthContext } from '../context/auth.context';

export default function Routes() {
  const { userData, isLoad } = useContext(AuthContext) || {};
  const [initializing, setInitializing] = useState(true);


  if (isLoad) {
    return <Loading />;
  }

  return (
    <>
      {userData ? <HomeStack /> : <AuthStack />}
    </>
  );
}