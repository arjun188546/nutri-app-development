import axios from "axios";

//prod environment
// const customAxios = axios.create({
//     baseURL: "https://geneus-solutions-backend.onrender.com",
// });

//dev environment
const customAxios = axios.create({
    baseURL: "http://192.168.0.100:8000",
});
customAxios.interceptors.request.use(
    async (config) => {
        console.log("Intercepting request:", config.url);
        try {
            const token = await SecureStore.getItemAsync("accessToken");
            console.log("Access Token:", token);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Error retrieving access token:", error);
        }
        return config;
    },
    (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
    }
);

customAxios.interceptors.response.use(
    (response) => {
        console.log("Response:", response);
        return response;
    },
    (error) => {
        console.log("Response Error:", error);
        if (error.response) {
            console.log("Error Response Data:", error.response.data);
            console.log("Error Response Status:", error.response.status);
        } else if (error.request) {
            console.log("No response received:", error.request);
        } else {
            console.log("Axios Error:", error.message);
        }
        return Promise.reject(error);
    }
);

export default customAxios;
