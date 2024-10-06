import axiosClient from './axiosClient';

interface FileApi {
  getBGImages: () => Promise<any>;
  uploadBGImages: (formData: FormData) => Promise<any>;
  uploadFileForChat: (formData: FormData) => Promise<any>;
  deleteBackgroundImg: (bgId: string) => Promise<any>;
  deleteFileForChat: (id: string) => Promise<any>;
  uploadVideoChatRecord: (formData: FormData, messageID: string) => Promise<any>;
}

const fileApi: FileApi = {
  getBGImages: async () => {
    const url = `/file/background/image`;
    return axiosClient.get(url);
  },

  uploadBGImages: async (formData: FormData) => {
    const url = `/file/background/image`;

    return axiosClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteBackgroundImg: async (bgId: string) => {
    const url = `/file/background/image/${bgId}`;
    return axiosClient.delete(url);
  },

  uploadFileForChat: async (formData) => {
    const url = `/file/ask/upload`;
    return axiosClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteFileForChat: async (id) => {
    const url = `/file/ask/delete/${id}`;
    return axiosClient.delete(url);
  },

  uploadVideoChatRecord: async (formData, messageID) => {
    const url = `/file/video/record/${messageID}`;
    return axiosClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default fileApi;
