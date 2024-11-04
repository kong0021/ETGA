import axios from "axios"
import {ACCESS_TOKEN} from "./constants"
import Cookies from 'js-cookie'; // To retrieve CSRF token


const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/'
})

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        // pass JWT token
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Function to send a message to the chatbot

export const sendMessageToChatbot = async (message) => {
    try {
        const csrfToken = Cookies.get('csrftoken'); // Retrieve the CSRF token
        const response = await axios.post('http://127.0.0.1:8000/chatbot/', { message }, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken, // Include the CSRF token
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error sending message to chatbot:', error);
        throw error;
    }
};

export default api