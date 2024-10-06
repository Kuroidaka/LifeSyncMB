import axiosClient from './axiosClient';

interface UserApi {
  getUser: (id: string | number) => Promise<any>;
  setBackgroundImg: (bgId: string | null) => Promise<any>;
  getBackgroundImg: () => Promise<any>;
  getTools: () => Promise<any>;
  toggleTool: (toolID: string | number) => Promise<any>;
}

const userApi: UserApi = {
  getUser: async (id) => {
    const url = `/user/${id}`;
    return axiosClient.get(url);
  },
  setBackgroundImg: async (bgId) => {
    const url = `/user/set-background-img`;
    return axiosClient.post(url, { bgId });
  },

  getBackgroundImg: async () => {
    const url = `/user/get-background-img`;
    return axiosClient.get(url);
  },
  getTools: async () => {
    const url = `/user/tools`;
    return axiosClient.get(url);
  },
  toggleTool: async (toolID) => {
    const url = `/user/tools/${toolID}`;
    return axiosClient.patch(url);
  },
};

export default userApi;
