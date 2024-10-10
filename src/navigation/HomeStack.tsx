import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, TouchableOpacity, Alert, StyleSheet, Dimensions, Animated } from 'react-native';
import SettingScreen from '../screens/SettingScreen/SettingScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import ChatListScreen from '../screens/ChatListScreen/ChatListScreen';
import ChatScreen from '../screens/ChatScreen/ChatScreen';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../screens/type';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ChatHeader from './Header/ChatHeader';

const Stack = createStackNavigator();

export default function HomeStack({ navigation }: { navigation: NativeStackNavigationProp<RootStackParamList> }) {
  return (
    <Stack.Navigator initialRouteName='Home'>
      <Stack.Group
        screenOptions={{
          gestureEnabled: false,
          headerShown: false,
          headerStyle: { backgroundColor: 'transparent' },
          headerTransparent: true,
        }}
      >
        <Stack.Screen name='Planner' component={HomeScreen as any} />
        <Stack.Screen name='Setting' component={SettingScreen as any} />
        <Stack.Screen name='Chat' component={ChatListScreen as any} 
         options={({ route }) => ({
          headerShown: true,
          headerTransparent: false,
          headerLeft: () => <ChatHeader navigation={navigation}/>,
          headerStyle: { backgroundColor: 'transparent' },
          headerTitle: '',
        })}
        />

        {/* Full screen chat */}
        <Stack.Screen
          name='ChatID'
          component={ChatScreen as any}
          options={({ route }) => ({
            headerShown: true,
            headerTransparent: false,
            headerStyle: { backgroundColor: 'transparent' },
            headerTitle: '',
            headerRight: () => {
              const { conversationId } = route.params as { conversationId: string };
              const handleCall = () => {
                Alert.alert('Initiating Call', `Calling for conversation ID: ${conversationId}`);
                // Add your call logic here (e.g., API call or navigation to call screen)
              };

              return (
                <TouchableOpacity onPress={handleCall} style={{ marginRight: 15 }}>
                  <Ionicons name="videocam-outline" size={30} color="black" />
                </TouchableOpacity>
              );
            },
          })}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}


const styles = StyleSheet.create({
  createBtn: {
    display: "flex",
    width: Dimensions.get('window').width,
    justifyContent: "center",
    alignItems: "center"
  }
})