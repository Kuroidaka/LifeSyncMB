import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SettingScreen from '../screens/SettingScreen';
import HomeScreen from '../screens/Home/HomeScreen';


const Stack = createStackNavigator();


export default function HomeStack() {
  return (  
    <Stack.Navigator initialRouteName='Home'>
      <Stack.Screen name='Planner' component={HomeScreen as any} options={{ headerShown: false }} />
      <Stack.Screen name='Setting' component={SettingScreen as any } options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}