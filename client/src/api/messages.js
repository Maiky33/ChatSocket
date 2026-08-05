import axios from "axios";

// let API = 'http://localhost:4000' // Cambia esto según la URL de tu servidor backend
const API = process.env.REACT_APP_API_URL

// Configuración general de axios para incluir el token en las solicitudes autenticadas
const instance = axios.create({
  baseURL: `${API}/api`,
  withCredentials: true,
});

// Solicitudes a la API
export const getMessagesRequest = async () => instance.get('/messages');

export const saveMessageRequest = async (message) => instance.post('/save', message);

