import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const instance = axios.create({
    baseURL: `${API}/api`,
    withCredentials: true,
});

export const getConversationsRequest = async () =>
    instance.get('/conversations');

export const saveConversationRequest = async (conversation) =>
    instance.post('/conversations', conversation);