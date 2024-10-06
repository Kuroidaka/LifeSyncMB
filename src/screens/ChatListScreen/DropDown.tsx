import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import ConversationContext from '../../context/conversation.context';

type MenuProps = {
  conID: string;
  close: () => void;
};

const Menu: React.FC<MenuProps> = ({ conID, close }) => {
  const conversationContext = useContext(ConversationContext);

  const handleDelete = (e: any) => {
    e.stopPropagation();
    console.log('delete', conID);
    close();
    conversationContext?.deleteConversation(conID);
  };

  return (
    <View style={styles.dropdown}>
      <View>
        <TouchableOpacity style={styles.menuItem}>
          <FontAwesome name="pencil" size={20} color="#fff" />
          <Text style={styles.menuText}>Rename</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
          <FontAwesome name="trash-o" size={20} color="#fff" />
          <Text style={styles.menuText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    width: 160,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#313131',
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 5,
    backgroundColor: 'transparent',
  },
  menuText: {
    marginLeft: 10,
    color: '#fff',
    fontSize: 15,
  },
  menuItemHover: {
    backgroundColor: '#4d4d4d',
  },
});

export default Menu;
