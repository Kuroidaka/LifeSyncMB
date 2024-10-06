import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // For FaEllipsisVertical icon
import SidebarNavMenu from './DropDown';

type SidebarNavProps = {
  conversation: any; // Update this with your actual conversation type
  selectedID: string;
  hdlSelCon: (id: string) => void;
};

const SidebarNav: React.FC<SidebarNavProps> = ({ conversation, selectedID, hdlSelCon }) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleToggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <TouchableOpacity
      style={[
        styles.navContainer,
        selectedID === conversation.id ? styles.selected : null,
      ]}
      onPress={() => hdlSelCon(conversation.id)}
    >
      <View style={styles.item}>
        <Text style={styles.conversationText}>{conversation.name}</Text>
      </View>

      <View style={styles.setting}>
        <View style={styles.iconWrapper} onTouchEnd={handleToggleDropdown}>
          <FontAwesome name="ellipsis-v" size={20} color="#fff" />
        </View>
      </View>

      {/* Modal for Dropdown Menu */}
      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackground}
            onPress={() => setDropdownVisible(false)}
          />
          <SidebarNavMenu conID={conversation.id} close={() => setDropdownVisible(false)} />
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    cursor: 'pointer',
    display: 'flex',
    position: 'relative',
    marginVertical: 7,
    height: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 5,
    backgroundColor: 'transparent',
    // transition: 'all 0.3s ease-in-out',
  },
  selected: {
    backgroundColor: '#343a40',
  },
  item: {
    height: '100%',
    paddingHorizontal: 10,
    width: '100%',
    justifyContent: 'center',
  },
  conversationText: {
    fontSize: 13,
    color: '#ebebeb',
  },
  setting: {
    position: 'absolute',
    right: 0,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    backgroundColor: '#495057',
    borderBottomRightRadius: 5,
    borderTopRightRadius: 5,
  },
  iconWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default SidebarNav;
