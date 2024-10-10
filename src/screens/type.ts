import { NativeStackScreenProps } from '@react-navigation/native-stack';


export type RootStackParamList = {
  Home: { screen: string };
  Auth: { screen: string };
  Setting: { screen: string };
  Chat: { conversationId: string };
  ChatID: { conversationId?: string };
};
// Type alias for HomeScreen Props
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

// Type alias for DetailsScreen Props
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Auth'>;
export type SettingScreenProps = NativeStackScreenProps<RootStackParamList, 'Setting'>;
export type ChatListScreenProps = NativeStackScreenProps<RootStackParamList, 'Chat'>;
export type ChatScreenProps = NativeStackScreenProps<RootStackParamList, 'ChatID'>;
