import React, { useContext, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ConversationModify } from '../../types/conversation.type';
import { MaterialIcons } from '@expo/vector-icons'; // For mute and other icons
import ConversationContext from '../../context/conversation.context';
import Loading from '../../components/Loading';
import OverlayDimLoading from '../../components/OverlayDimLoading';

const Conversations: React.FC = () => {
  const conversationContext = useContext(ConversationContext);

  const handleChatSelect = (id: string  ) => {
    console.log('conversation', id);
  }

  const renderItem = ({ item }: { item: ConversationModify }) => (
      <TouchableOpacity style={styles.chatItem} onPress={() => handleChatSelect(item.id)}>
        <View style={styles.avatarContainer}>
        </View>
        <View style={styles.chatDetails}>
          <Text style={styles.chatName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.chatMessage} numberOfLines={2}>
            {item.lastMessage}
          </Text>
        </View>
        <View style={styles.rightSection}>
          <Text style={styles.chatTime}>
          {new Date(item.lastMessageAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
          </Text>
          {/* icon arrow right */}
          <MaterialIcons name="arrow-right" size={25} color="#131313" />
        </View>
      </TouchableOpacity>
  );

  if(conversationContext?.isLoading) {
    return <OverlayDimLoading />
  }

  return (
      <FlatList
        data={conversationContext?.conversationList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatList}
      />
  );
};

const styles = StyleSheet.create({
  chatList: {
    paddingVertical: 10,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#a1a1a1',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4caf50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  chatDetails: {
    flex: 1,
  },
  chatName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#131313',
  },
  chatMessage: {
    color: '#000000e0',
    fontSize: 14,
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  chatTime: {
    color: '#888',
    fontSize: 12,
    marginBottom: 5,
  },
});

export default Conversations;
