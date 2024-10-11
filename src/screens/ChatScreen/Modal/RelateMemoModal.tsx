import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import JSONTree from 'react-native-json-tree';  // For JSON pretty-printing
import Animated, { Layout } from 'react-native-reanimated';  // For animations
import ModalContext from '../../../context/modal.context';

const RelateMemoModal: React.FC = () => {
  const modalContext = useContext(ModalContext);
  const [jsonData, setJsonData] = useState<any>(null);
  const [selectedSec, setSelectedSec] = useState<string>('JSON');

  useEffect(() => {
    if (modalContext?.modal.content) {
      const dataJson = modalContext.modal.content.map((data: any) => ({
        guide: data.guide,
        answer: data.answer,
        criteria: data.criteria,
        createdAt: data.createdAt,
        distance: data.distance,
      }));
      const jsonString = JSON.stringify(dataJson, null, 2); // Pretty JSON with indentation
      setJsonData(jsonString);
    }
  }, [modalContext?.modal.content]);

  const sections = [{ name: 'JSON' }];

  const handleJsonError = () => {
    Alert.alert('Error', 'Error occurred when pretty printing JSON');
  };

  return (
    <View style={styles.container}>
      {/* Tab List */}
      <View style={styles.tabList}>
        {sections.map((sec, idx) => (
          <TouchableOpacity
            key={idx}
            style={[styles.tabButton, selectedSec === sec.name && styles.activeTab]}
            onPress={() => setSelectedSec(sec.name)}
          >
            <Text style={styles.tabText}>{sec.name}</Text>
            {selectedSec === sec.name && <Animated.View style={styles.underline} layout={Layout.springify()} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* JSON Section */}
      {selectedSec === 'JSON' && jsonData !== null && (
        <ScrollView style={styles.jsonWrapper}>
          <JSONTree data={JSON.parse(jsonData)} theme="bright" invertTheme={false} />
        </ScrollView>
      )}
    </View>
  );
};

export default RelateMemoModal;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    height: '90%',
  },
  tabList: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 40,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    backgroundColor: '#f0f0f0',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  underline: {
    height: 3,
    backgroundColor: '#ff8c00',  // Custom color or gradient can be used
    borderRadius: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  jsonWrapper: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
});
