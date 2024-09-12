import axiosClient from "./axiosClient";

const authenApi = {

    login: async (username: string, password: string) => {
        const url = `/auth/login`;

        // Define data body
        const dataBody = {
            username, password
        };
        console.log(axiosClient.defaults.baseURL);
        // Send POST request with query parameters and data body
        return axiosClient.post(url, dataBody);
    },
    verifyToken: async () => {
        const url = `/auth/verify_token`;
        // Send POST request with query parameters and data body
        return axiosClient.post(url);
    },
    linkGoogle: async () => {
        const url = `/google/link-gmail`;
        // Send POST request with query parameters and data body
        return axiosClient.get(url);
    },
    unlinkGoogle: async () => {
        const url = `/google/unlink-gmail`;
        // Send POST request with query parameters and data body
        return axiosClient.post(url);
    },
    verifyGoogleToken: async () => {
        const url = `/google/auth/verify_token`;
        // Send POST request with query parameters and data body
        return axiosClient.post(url);
    },
    regenerateToken: async () => {
        const url = `/auth/regenerate_token`;
        // Send POST request with query parameters and data body
        return axiosClient.post(url);
    },
}

export default authenApi