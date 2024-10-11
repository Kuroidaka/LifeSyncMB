import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ModalContext } from '../../../context/modal.context';
import Markdown from 'react-native-markdown-display'; // For rendering markdown text
import JSONTree from 'react-native-json-tree'; // For pretty-printing JSON
import Animated, { Layout } from 'react-native-reanimated'; // For animations
import { ToastAndroid } from 'react-native'; // Using Android toast notifications

const ToolsDataModal: React.FC = () => {
  const modalContext = useContext(ModalContext);
  const [message, setMessage] = useState<string>('');
  const [jsonData, setJsonData] = useState<any>(null);
  const [selectedSec, setSelectedSec] = useState<'Comment' | 'JSON'>('Comment');

  useEffect(() => {
    if (modalContext?.modal.content) {
      const jsonString = JSON.stringify(modalContext?.modal.content.data, null, 2); // Pretty JSON with indentation
      setJsonData(jsonString);
      setMessage(modalContext?.modal.content.comment);
    }
  }, [modalContext]);

  const sections = ['Comment', 'JSON'];

  const showToast = (message: string) => {
    ToastAndroid.showWithGravity(
      message,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  };

  return (
    <View style={styles.container}>
      {/* Tab List */}
      <View style={styles.tabList}>
        {sections.map((sec) => (
          <TouchableOpacity
            key={sec}
            style={styles.tabButton}
            onPress={() => setSelectedSec(sec as 'Comment' | 'JSON')}
          >
            <Text style={styles.tabText}>{sec}</Text>
            {selectedSec === sec && <Animated.View style={styles.underline} layout={Layout.springify()} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Section content */}
      <View style={styles.contentWrapper}>
        {selectedSec === 'Comment' && (
          <ScrollView style={styles.markdownWrapper}>
            <Markdown>{message}</Markdown>
          </ScrollView>
        )}

        {selectedSec === 'JSON' && jsonData !== null && (
          <ScrollView style={styles.jsonWrapper}>
            <JSONTree data={jsonData} theme="bright" invertTheme={true} />
          </ScrollView>
        )}

        {/* {selectedSec === 'JSON' && jsonData === null && showToast('Error loading JSON data')} */}
      </View>
    </View>
  );
};

export default ToolsDataModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  tabList: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  tabButton: {
    padding: 10,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  underline: {
    height: 3,
    backgroundColor: '#ff8c00',
    borderRadius: 2,
    marginTop: 5,
  },
  contentWrapper: {
    flex: 1,
    // marginBottom: 20,
  },
  markdownWrapper: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  jsonWrapper: {
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
});
