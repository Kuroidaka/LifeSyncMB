import React, { useContext, useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import Toast from 'react-native-toast-message';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigation, useRoute } from '@react-navigation/native';
import ConversationContext from '../../../context/conversation.context';
import fileApi from '../../../api/file.api';
import conversationApi from '../../../api/conversation.api';
import DocsUploaded from './Uploadfile';
import InputCom from './input';
import { filesToBase64 } from '../../../utils';
import { ChatScreenProps, RootStackParamList } from '../../type';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface InputBoxProps {
    handleProcessAI?: (inputValue: string) => Promise<void>;
    navigation: NativeStackNavigationProp<RootStackParamList, "ChatID", undefined>
}

const InputBox: React.FC<InputBoxProps> = ({ handleProcessAI, navigation }) => {
    const conversationContext = useContext(ConversationContext);
    const [filesImages, setFilesImages] = useState<any[]>([]);
    const [isUploading, setIsUploading] = useState(false);

    const route = useRoute();

    const conversationId = conversationContext?.selectedConID; // Assuming you're passing 'id' via route

    const queryClient = useQueryClient();

    const { data: filesData, isLoading } = useQuery({
        queryKey: ['conversations', conversationId],
        queryFn: () => conversationId ? conversationApi.getConversationFile(conversationId) : undefined,
        enabled: !!conversationId, 
    });

    const uploadFileMutation = useMutation({
        mutationFn: async ({ data }: { data: FormData }) => {
            const res = await fileApi.uploadFileForChat(data);
            return res;
        },
        onMutate: () => setIsUploading(true),
        onSuccess: (data) => {
            if (data.conversationID) {
                queryClient.invalidateQueries({ queryKey: ['conversations', data.conversationID] });
                navigation.navigate('ChatID', { conversationId: data.conversationID });
            }
        },
        onError: (error) => {
            console.log('error', error);
            Toast.show({
                type: 'error',
                text1: 'Something went wrong',
            });
        },
        onSettled: () => setIsUploading(false),
    });

    const deleteFileMutation = useMutation({
        mutationFn: async ({ id }: { id: string }) => await fileApi.deleteFileForChat(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['conversations', conversationId] }),
        onError: (error) => {
            console.log('error', error);
            Toast.show({
                type: 'error',
                text1: 'Something went wrong',
            });
        },
    });

    const imageFile = {
        setFileImg: async () => {
            const result = await DocumentPicker.getDocumentAsync({ type: 'image/*' });
            setFilesImages((prevFiles) => [...prevFiles, result]);
        },
        // handleProcess: async () => {
        //   setFilesImages([]);
        //   const listBase64 = await filesToBase64(filesImages);
        //   const imgList = await hostImages(listBase64);
        //   return imgList;
        // },
    };

    const handleSend = async (inputValue: string) => {
        const dataBody: any = {
            prompt: inputValue,
        };

        if (conversationContext?.selectedConID || conversationId) {
            dataBody.conversationID = conversationContext?.selectedConID || conversationId;
        }

        let isStream = true;
        if (typeof handleProcessAI === 'function') {
            await handleProcessAI(inputValue);
        } else {
            conversationContext?.addMsg(dataBody, isStream);
        }
    };

    const handleUploadFileDocs = async () => {
        const result: any = await DocumentPicker.getDocumentAsync({});

        const fileUri = result.assets[0].uri;
        const fileName = result.assets[0].name;
        const mimeType = result.assets[0].mimeType;

        const formData = new FormData();
        formData.append('file', {
            uri: fileUri,
            type: mimeType,
            name: fileName,
        } as any);

        if (conversationId) formData.append('conversationId', conversationId);
        uploadFileMutation.mutate({ data: formData });
    }


const docsProp = {
    filesData: filesData?.data || [],
    handleUploadFileDocs,
    deleteFileMutation,
    isLoading,
    isUploading,
    setIsUploading,
};

const inputProp = {
    filesImages,
    uploadFileImg: imageFile.setFileImg,
    setFilesImages,
    handleSend,
};

return (
    <View style={styles.container}>
        {/* <Button title="Upload Docs" onPress={handleUploadFileDocs} />
        <DocsUploaded {...docsProp} /> */}
        <InputCom {...inputProp} />
        <Toast />
    </View>
);
};

export default InputBox;

const styles = StyleSheet.create({
    container: {
        padding: 10,
        flex: 1,
        width: '100%',
        maxHeight: 100,
    },
});
