import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';


interface DocsUploadedProps {
  filesData: any[];
  handleUploadFileDocs: (file: any) => void;
  deleteFileMutation: any;
  isLoading: boolean;
  isUploading: boolean;
}

const DocsUploaded: React.FC<DocsUploadedProps> = ({ filesData, handleUploadFileDocs, deleteFileMutation, isLoading, isUploading }) => {

  const handleDeleteClick = (id: string) => {
    deleteFileMutation.mutate({ id });
  };


  const renderFile = ({ item }: { item: any }) => (
    <View
      style={styles.fileContainer}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#0000ff" />
      ) : (
        <TouchableOpacity onPress={() => handleDeleteClick(item.id)}>
          <Ionicons name="trash-outline" size={24} color="red" />
        </TouchableOpacity>
      )}
      <Text style={styles.fileName}>{item.originalname}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {isUploading || (filesData && filesData.length > 0) ? (
        <View style={styles.content}>
          <View style={styles.contentHead}>
            <Text style={styles.filesText}>Files</Text>
            <TouchableOpacity onPress={handleUploadFileDocs} style={styles.addButton}>
              <Ionicons name="attach-outline" size={24} color="black" />
              <Text style={styles.addText}>Add</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={filesData}
            renderItem={renderFile}
            keyExtractor={(item) => item.id}
            style={styles.fileList}
          />

          {isUploading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#0000ff" />
            </View>
          )}
        </View>
      ) : (
        <TouchableOpacity onPress={handleUploadFileDocs} style={styles.uploadContainer}>
          <Ionicons name="cloud-upload-outline" size={50} color="black" />
          <Text style={styles.uploadText}>Upload</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DocsUploaded;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  content: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 10,
  },
  contentHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  filesText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addText: {
    marginLeft: 5,
    fontSize: 16,
  },
  fileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  fileName: {
    fontSize: 14,
    color: '#333',
  },
  fileList: {
    marginTop: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  uploadContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 10,
    fontSize: 18,
    color: '#333',
  },
});
