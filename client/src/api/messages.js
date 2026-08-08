import axios from "axios";

const API = process.env.REACT_APP_API_URL;

const instance = axios.create({
  baseURL: `${API}/api`,
  withCredentials: true,
});

export const getMessagesRequest = async (conversationId) =>
  instance.get(`/messages/${conversationId}`);

export const saveMessageRequest = async (message) =>
  instance.post('/messages', message);

export const markMessagesAsReadRequest = async (conversationId) =>
  instance.patch(`/messages/read/${conversationId}`);