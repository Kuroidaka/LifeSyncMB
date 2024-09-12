import { NativeStackScreenProps } from '@react-navigation/native-stack';


export type RootStackParamList = {
  Home: { screen: string };
  Auth: { screen: string };
};
// Type alias for HomeScreen Props
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;

// Type alias for DetailsScreen Props
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Auth'>;
