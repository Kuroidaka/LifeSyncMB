import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, FlatList, StyleSheet, Text, Dimensions } from 'react-native';
import UserMsg from './HumanChat';
import BotMsg from './BotChat';
import ConversationContext from '../../context/conversation.context';
import OverlayDimLoading from '../../components/OverlayDimLoading';
import { Conversation, Messages } from '../../types/conversation.type';

interface ChatBoxProps {
  conversationId: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({ conversationId }) => {
  const conversationContext = useContext(ConversationContext);
  const flatListRef = useRef<FlatList>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false); // Track if user is scrolling manually

  useEffect(() => {
    conversationContext?.setSelectedConID(conversationId);
  }, [conversationId]);

  const messages = conversationContext?.currentCon?.messages;

  if (conversationContext?.currenConError) {
    return <Text>Something went wrong</Text>;
  }

  useEffect(() => {
    // Scroll to end only if the user is not manually scrolling up
    if (messages && messages.length > 0 && !conversationContext?.isLoading && !isUserScrolling) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 1000);
    }
  }, [messages, conversationContext?.isLoading, isUserScrolling]);

  const renderMessage = React.useCallback(({ item }: { item: Messages }) => (
    <View key={item.id} style={styles.messageContainer}>
      {!item.isBot ? (
        <UserMsg
          text={item.text}
          imgList={item.imgList}
          videoRecord={item.videoRecord}
        />
      ) : (
        <BotMsg
          memoryDetail={item.relatedMemo ? JSON.parse(item.relatedMemo) : []}
          text={item.text}
          functionList={item.functionData}
          memoStorage={item.memoStorage}
        />
      )}
    </View>
  ), [messages]);

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isAtBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;
    setIsUserScrolling(!isAtBottom);
  };

  if (!messages) {
    return <OverlayDimLoading />;
  }

  return (
    <View style={styles.conversationContainer}>
      {/* <OverlayDimLoading />; */}
      {messages.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatList}
          onContentSizeChange={() => {
            if (!isUserScrolling) {
              flatListRef.current?.scrollToEnd({ animated: true });
            }
          }}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      ) : (
        <Text>No messages yet</Text>
      )}
    </View>
  );
};

export default ChatBox;

const styles = StyleSheet.create({
  conversationContainer: {
    flex: 1,
    width: '100%',
  },
  chatList: {
    paddingBottom: 40,
  },
  messageContainer: {
    width: '100%',
    paddingHorizontal: 5,
    marginTop: 10,
  },
});
