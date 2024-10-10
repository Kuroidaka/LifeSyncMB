import React, { useContext, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { ConversationModify } from '../../types/conversation.type';
import { MaterialIcons } from '@expo/vector-icons';
import ConversationContext from '../../context/conversation.context';
import OverlayDimLoading from '../../components/OverlayDimLoading';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../type';

const Conversations: React.FC<{
   navigation: NativeStackNavigationProp<RootStackParamList, "Chat", undefined>
}> = ({ navigation }) => {
  const conversationContext = useContext(ConversationContext);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ConversationModify | null>(null);

  const handleChatSelect = (id: string) => {
    console.log('id', id)
    navigation.navigate('ChatID', { conversationId: id });
  };

  const handleLongPress = (item: ConversationModify) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleDeletePress = () => {
    if (selectedItem) {
      Alert.alert('Delete', `Are you sure you want to delete ${selectedItem.name}?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            conversationContext?.deleteConversation(selectedItem.id);
            handleCloseModal();
          },
        },
      ]);
    }
  };

  const handleRenamePress = () => {
    if (selectedItem) {
      // Call the rename logic here
      // conversationContext.renameConversation(selectedItem.id); // Implement rename logic in context
      handleCloseModal();
    }
  };

  const renderItem = ({ item }: { item: ConversationModify }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => handleChatSelect(item.id)}
      onLongPress={() => handleLongPress(item)}
    >
      <View style={styles.avatarContainer}>
        {/* Avatar */}
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
          {new Date(item.lastMessageAt || '').toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          })}
        </Text>
        <MaterialIcons name="arrow-right" size={25} color="#131313" />
      </View>
    </TouchableOpacity>
  );

  if (conversationContext?.isLoading) {
    return <OverlayDimLoading />;
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={conversationContext?.conversationList}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatList}
      />

      {/* Modal for Options */}
      {selectedItem && (
        <Modal
          visible={isModalVisible}
          transparent
          animationType="slide"
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Options</Text>
              <TouchableOpacity style={styles.modalButton} onPress={handleRenamePress}>
                <Text style={styles.modalButtonText}>Rename</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleDeletePress}>
                <Text style={[styles.modalButtonText, { color: 'red' }]}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCancelButton} onPress={handleCloseModal}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    marginHorizontal: 40,
    borderRadius: 10,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
  },
  modalButton: {
    paddingVertical: 10,
  },
  modalCancelButton: {
    paddingVertical: 10,
    marginTop: 10,
    backgroundColor: '#f5f5f5',
  },
  modalButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Conversations;
