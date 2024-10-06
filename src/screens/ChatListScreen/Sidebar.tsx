import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SidebarNav from './SidebarNav';

type SidebarProps = {
  data: any[];
  selectedConID: string;
};

const Sidebar: React.FC<SidebarProps> = ({ data, selectedConID }) => {
  const navigation = useNavigation();

  const hdlSelCon = (id: string) => {
    console.log('id', id);
    // navigation.navigate('Chat', { conversationId: id });
  };

  return (
    <View style={styles.container}>
      <View style={styles.cover}>
        <Text style={styles.title}>History</Text>

        <View style={styles.conversationList}>
          {data && data.length > 0 ? (
            <ScrollView>
              {data.map((item, index) => (
                <SidebarNav
                  key={index}
                  conversation={item} // Assuming you need to pass the whole item
                  selectedID={selectedConID} // Adjust according to your SidebarNav props
                  hdlSelCon={hdlSelCon}
                />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.empty}>
              <Text>No conversation</Text>
            </View>
          )}
        </View>

        <View style={styles.team} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: 235,
  },
  cover: {
    backgroundColor: '#000', // Replace with the gradient or color you'd like
    width: '100%',
    height: '100%',
    padding: 10,
    position: 'relative',
    zIndex: 100,
  },
  title: {
    color: '#fff',
    fontSize: 22,
    lineHeight: 32,
    marginLeft: 10,
  },
  conversationList: {
    height: '80%',
    marginTop: 18,
  },
  empty: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  team: {
    width: '100%',
    height: '10%',
    backgroundColor: '#007bff', // Replace with your primary color
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default Sidebar;
