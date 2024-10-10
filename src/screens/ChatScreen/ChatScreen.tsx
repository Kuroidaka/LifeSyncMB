import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChatScreenProps, RootStackParamList } from '../type'
import ConversationContext, { ConversationProvider } from '../../context/conversation.context';
import ChatBox from './ChatBox';
import OverlayDimLoading from '../../components/OverlayDimLoading';
import InputBox from './Input';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


const ChatScreen: React.FC<ChatScreenProps> = ({ route }) => {
  const routeParams = route.params;

  return (
    <ConversationProvider>
      <ChatScreenInner conversationId={routeParams.conversationId} />
    </ConversationProvider>
  );
};

interface ChatScreenInnerProps {
  conversationId: string | undefined;
} 

const ChatScreenInner: React.FC<ChatScreenInnerProps> = ({ conversationId = "" }) => {
  const conversationContext = useContext(ConversationContext)
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'ChatID'>>();
  if(!conversationContext || !conversationContext.conversationList) {
    return <OverlayDimLoading />
  }

  return (
    <View style={styles.container}>

      <ChatBox conversationId={conversationId} />
      <InputBox navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  body: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default ChatScreen;
