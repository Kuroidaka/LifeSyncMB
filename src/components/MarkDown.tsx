import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import Markdown from 'react-native-markdown-display';

interface MarkDownProps {
  text: string;
}

const MarkDown: React.FC<MarkDownProps> = ({ text }) => {

  const renderCodeBlock = (props: any) => {
    return (
      <View style={styles.codeBlockContainer}>
        <View style={styles.codeBlockHeader}>
          <Text style={styles.codeBlockTitle}>Code</Text>
        </View>
        <Text style={styles.code}>{props.children}</Text>
      </View>
    );
  };

  return (
    <ScrollView>
      <Markdown
        style={markdownStyles as any}
        rules={{
          code_block: renderCodeBlock, // Custom render function for code blocks
        }}
      >
        {text}
      </Markdown>
    </ScrollView>
  );
};

export default MarkDown;

const styles = StyleSheet.create({
  codeBlockContainer: {
    backgroundColor: '#393939',
    borderRadius: 6,
    padding: 10,
    marginVertical: 10,
  },
  codeBlockHeader: {
    backgroundColor: '#2c3e50',
    padding: 5,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    marginBottom: -5,
  },
  codeBlockTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  code: {
    color: '#ecf0f1',
    fontFamily: 'monospace',
  },
});

const markdownStyles = {
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: '#1f1f1f',
  },
  heading1: {
    fontSize: 24,
    color: '#1abc9c',
  },
  heading2: {
    fontSize: 20,
    color: '#16a085',
  },
  paragraph: {
    marginVertical: 8,
    color: '#1f1f1f',
  },
  link: {
    color: '#3498db',
  },
  list_item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  list_item_icon: {
    marginRight: 10,
  },
  blockquote: {
    backgroundColor: '#2c3e50',
    borderLeftColor: '#16a085',
    borderLeftWidth: 4,
    paddingLeft: 10,
    color: '#1f1f1f',
  },
};
