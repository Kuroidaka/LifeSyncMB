import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Platform, Modal, Button, Alert } from 'react-native';
import AppearanceContext from '../../context/appearance.context';
import fileApi from '../../api/file.api';
import userApi from '../../api/user.api';
import { API_BASE_URL, PREFIX } from '../../constant/BaseURl';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Loading from '../../components/Loading';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Entypo';
import { Ionicons } from '@expo/vector-icons';
import { BackgroundImageModifyType, BackgroundImageType } from '../../types/file.type';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { convertToFileObject } from '../../utils';


interface ImagePickerResponse {
  assets: [
    {
      uri: string;
      fileName: string;
      type: string;
    }
  ];
}


const Appearance: React.FC = () => {
  const [dataAppearance, setDataAppearance] = useState<BackgroundImageType[]>([]);
  const appearanceContext = useContext(AppearanceContext);
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);


  const { data: bgData, error, isLoading } = useQuery({
    queryKey: ['backgroundImage'],
    queryFn: fileApi.getBGImages,
  });

  useEffect(() => {
    if (bgData) {
      const data = bgData.data;
      const updatedBGList = data.map((bg: BackgroundImageType) => ({
        ...bg,
        urlPath: `${API_BASE_URL}${PREFIX}${bg.urlPath}`,
      }));
      setDataAppearance(updatedBGList);
    }
  }, [bgData]);

  const handleClickPhoto = async (data: BackgroundImageModifyType) => {
    try {

      await userApi.setBackgroundImg(data.id);
      appearanceContext?.setAppearance({
        urlPath: data?.urlPath || '',
        name: data?.name || '',
      });
    } catch (error) {
      console.error('Failed to set background image:', error);
    }
  };

  const addMutation = useMutation({
    mutationFn: (formData: FormData) => {

      console.log('formData: ', formData)
      return fileApi.uploadBGImages(formData)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['backgroundImage'] }),
    onError: (error) => {
      console.error('Failed to upload background image:', error);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
      });

    },
  });

  const deleteMutation = useMutation({
    mutationFn: (bgId: string) => {
      return fileApi.deleteBackgroundImg(bgId)
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['backgroundImage'] }),
    onError: (error) => {
      console.error('Failed to delete background image:', error);
      Toast.show({
        type: 'error',
        text1: 'Failed to delete background image',
      });
    },
  });

  // const handleInputBG = (e: any) => {
  //   const file = e.target.files[0];
  //   previewFile(file);
  //   addMutation.mutate({ file });
  // };
  const handleInputBG = async () => {
    try {
      const result: any = await DocumentPicker.getDocumentAsync({});

      const fileUri = result.assets[0].uri;
      const fileName = result.assets[0].name;
      const mimeType = result.assets[0].mimeType; // default MIME type if not available

      // previewFile(fileUri, fileName);

      // Step 4: Prepare FormData
      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,      // The file URI (required for React Native)
        type: mimeType,    // The MIME type of the file
        name: fileName,    // The original filename
      } as any);           // Cast to `any` to avoid TypeScript issues with FormData

      // Step 5: Send the FormData using your mutation or API function

      addMutation.mutate(formData);
    } catch (err) {
      console.log('Error picking file:', err);
    }
  };


  const previewFile = async (fileUri: string, fileName: string) => {
    try {
      const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      appearanceContext?.setAppearance({
        urlPath: `data:image/jpeg;base64,${fileBase64}`, // assuming the image is a jpeg
        name: fileName,
      });
    } catch (error) {
      console.error("Error reading file:", error);
    }
  };



  // Function to handle long press event
  const handleLongPress = (id: string) => {
    Alert.alert('Delete', 'Are you sure you want to delete this item?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'OK', onPress: () => handleDelete(id) },
    ]);

  };

  // Function to handle deletion of the data
  const handleDelete = (id: string) => {

    console.log(`Deleting data with id: ${id}`);
    deleteMutation.mutate(id);

  };


  if (isLoading) return <Loading />;
  if (error) return <Text>Error</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Thay đổi hình nền</Text>
      </View>

      <View style={styles.previewSection}>
        <View style={styles.previewImg}>
          {appearanceContext?.appearance?.urlPath === '' ? (
            <View style={styles.withoutBackgroundPR}>
              <View style={styles.previewTitleWrapper}>
                <Ionicons name="trash-outline" size={24} color="black" />
                <Text>Không cần hình nền</Text>
              </View>
            </View>
          ) : (
            <Image source={{ uri: appearanceContext?.appearance?.urlPath }} style={styles.prImg} />
          )}
        </View>

        <View style={styles.previewInfo}>
          <View style={styles.name}>
            <Text>{appearanceContext?.appearance?.urlPath === '' ? 'Không có hình nền' : appearanceContext?.appearance?.name}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={[styles.withoutBackground, appearanceContext?.appearance?.urlPath === '' && styles.active]}
          onPress={() => handleClickPhoto({ id: null, urlPath: '', name: '' })}
        >
          <View style={styles.previewTitleWrapper}>
            <Ionicons name="trash-outline" size={24} color="black" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.uploadBackground} onPress={handleInputBG}>
          <View style={styles.previewTitleWrapper}>
            <Ionicons name="image-outline" size={24} color="black" />
          </View>
        </TouchableOpacity>

        {dataAppearance &&
          dataAppearance.map((data, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.background, appearanceContext?.appearance?.name === data.name && styles.active]}
              onPress={() => handleClickPhoto(data)}
              onLongPress={() => data.id && handleLongPress(data.id)}
            >
              <Image source={{ uri: data.urlPath }} style={styles.backgroundImage} />
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
};

export default Appearance;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
  titleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '5%',
  },
  title: {
    fontSize: Platform.OS === 'web' ? 15 : 25,
    fontWeight: '900',
  },
  previewSection: {
    height: '35%',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#cfcfcf',
    padding: 10,
  },
  previewImg: {
    width: '40%',
    padding: 10,
  },
  prImg: {
    height: '100%',
    borderRadius: 26,
    borderWidth: 2,
    borderColor: '#585A5C',
  },
  previewInfo: {
    width: '60%',
    padding: 10,
  },
  previewTitleWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  name: {
    borderWidth: 1,
    borderColor: '#585A5C',
    padding: 10,
    borderRadius: 10,
  },
  content: {
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  withoutBackground: {
    width: '20%',
    height: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  uploadBackground: {
    width: '20%',
    height: 100,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  withoutBackgroundPR: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  background: {
    width: '20%',
    height: 100,
    borderRadius: 10,
  },
  backgroundImage: {
    height: '100%',
    borderRadius: 10,
  },
  active: {
    borderColor: '#1973C5',
    borderWidth: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalView: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
