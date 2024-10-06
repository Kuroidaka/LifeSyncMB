import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SettingScreen from '../screens/SettingScreen/SettingScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import ChatListScreen from '../screens/ChatListScreen/ChatListScreen';
import { Text } from 'react-native';

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator initialRouteName='Home'>
      <Stack.Group screenOptions={{ 
        gestureEnabled: false, 
        headerShown: false, 
        headerStyle: { backgroundColor: 'transparent' }, 
        headerTransparent: true 
      }}>
        <Stack.Screen name='Planner' component={HomeScreen as any} />
        <Stack.Screen name='Setting' component={SettingScreen as any} />
        <Stack.Screen name='Chat' component={ChatListScreen as any} />
      </Stack.Group>
    </Stack.Navigator>
  );
}