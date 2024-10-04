import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function TabBar({tab, setTab}: {tab: 'task' | 'routine', setTab: React.Dispatch<React.SetStateAction<'task' | 'routine'>>}) {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabPress = (index: number, name: 'task' | 'routine') => {
    setActiveTab(index);
    setTab(name);
  };

  useEffect(() => {
    setActiveTab(tab === 'task' ? 0 : 1);
  }, [tab]);

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => handleTabPress(0, 'task')}
        >
          <Text style={activeTab === 0 ? styles.activeTabText : styles.tabText}>task</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => handleTabPress(1, 'routine')}
        >
          <Text style={activeTab === 1 ? styles.activeTabText : styles.tabText}>routine</Text>
        </TouchableOpacity>
      </View>

      {/* Indicator controlled with left/right */}
      <View style={[styles.indicator, activeTab === 0 ? { left: 0 + width/10 } : { right: 0 + width/10 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
    marginBottom: 5,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTabText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: width / 3, // The indicator is half the screen's width since there are 2 tabs
    backgroundColor: 'black',
  },
});
