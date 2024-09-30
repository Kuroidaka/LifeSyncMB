import axios from "axios";
import { API_BASE_URL, PREFIX } from "../constant/BaseURl";
import { getToken } from "../utils";

const axiosClient = axios.create({
  baseURL: API_BASE_URL + PREFIX,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to insert auth token if available
axiosClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response;
    }
    return response;
  },
  (error) => {
    if (error.response?.data) {
      throw error.response.data;
    } else {
      throw { message: "Server Error" };
    }
  }
);

export default axiosClient;