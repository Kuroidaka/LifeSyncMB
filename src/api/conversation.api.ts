import axiosClient from './axiosClient';

interface CreateChatParams {
  prompt: string;
  conversationID?: string;
  uploadUrl?: string;
}

interface CreateChatVideoParams {
  prompt: string;
  conversationID?: string;
  file?: File;
  fileVideo?: File;
}

const conversationApi = {
  createChat: async (
    { prompt, conversationID, uploadUrl }: CreateChatParams,
    isStream = false
  ) => {
    const url = `/brain/chat`;

    // Define query parameters
    const params = {
      isStream: isStream,
    };

    // Define data body
    const dataBody: any = {
      prompt: prompt,
    };
    if (conversationID) {
      dataBody.conversationID = conversationID;
    }
    if (uploadUrl) {
      dataBody.imgURL = uploadUrl;
    }

    console.log('dataBody', dataBody);

    // Send POST request with query parameters and data body
    return axiosClient.post(url, dataBody, { params });
  },

  createChatVideo: async (
    { prompt, conversationID, file, fileVideo }: CreateChatVideoParams,
    isStream = false
  ) => {
    const url = `/brain/chat/video`;

    // Define query parameters
    const params = {
      isStream: isStream,
    };

    // Create a FormData object
    const formData = new FormData();
    formData.append('prompt', prompt);

    if (conversationID) {
      formData.append('conversationID', conversationID);
    }
    if (file) {
      formData.append('file', file);
    }
    if (fileVideo) {
      formData.append('fileVideo', fileVideo);
    }

    console.log('FormData', formData);

    // Send POST request with query parameters and form-data body
    return axiosClient.post(url, formData, {
      params,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  getConversationHistory: async (id?: string) => {
    const url = id ? `/conversation/get/${id}` : `/conversation/get`;

    // Send GET request
    return axiosClient.get(url);
  },

  deleteConversation: async (id: string) => {
    const url = `/conversation/delete/${id}`;

    // Send DELETE request
    return axiosClient.delete(url);
  },

  stt: async (formData: FormData) => {
    const url = `/brain/stt/`;

    return axiosClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  tts: async (text: string) => {
    const url = `/brain/tts`;

    return axiosClient.post(url, { text });
  },

  getConversationFile: async (id: string) => {
    const url = `/conversation/file/${id}`;

    return axiosClient.get(url);
  },
};

export default conversationApi;
