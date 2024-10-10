import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

interface InputComProps {
  filesImages: any[];
  uploadFileImg: (e: any) => void;
  setFilesImages: (files: any[]) => void;
  handleSend: (inputValue: string) => Promise<void>;
}

const InputCom: React.FC<InputComProps> = ({ filesImages, uploadFileImg, setFilesImages, handleSend }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (text: string) => {
    setInputValue(text);
  };

  const handleSendButtonClick = () => {
    if (inputValue !== '') {
      handleSend(inputValue);
      setInputValue('');
    }
  };

  const handleEnterKeyPress = (e: any) => {
    if (e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
      e.preventDefault();
      handleSendButtonClick();
    }
  };

  const handleDeleteImgFile = (id: string) => {
    const updatedFiles = filesImages.filter((file) => file.id !== id);
    setFilesImages(updatedFiles);
  };
  
  return (
    <View style={styles.container}>
      {/* File area */}
      <FlatList
        data={filesImages}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.fileContainer}>
            <Ionicons name={item.type === 'file' ? 'document-outline' : 'image-outline'} size={24} color="black" />
            <Text style={styles.fileName}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleDeleteImgFile(item.id)}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Input area */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.textInput}
          placeholder="Input your prompt..."
          multiline
          value={inputValue}
          onChangeText={handleInputChange}
          onSubmitEditing={handleSendButtonClick}
        />

        <TouchableOpacity onPress={handleSendButtonClick} style={styles.sendButton}>
          <Ionicons name="send-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InputCom;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 10,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    marginBottom: 10,
  },
  fileName: {
    marginHorizontal: 10,
    fontSize: 14,
    color: '#000',
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  attachButton: {
    padding: 10,
  },
  textInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 5,
    textAlignVertical: 'top',
  },
  sendButton: {
    padding: 10,
  },
});
