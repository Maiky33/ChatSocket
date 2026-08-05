import axios from "axios";


// let API =  'http://localhost:4000' // Cambia esto según la URL de tu servidor backend
const API = process.env.REACT_APP_API_URL

// Configuración general de axios para incluir el token en las solicitudes autenticadas
const instance = axios.create({
  baseURL: `${API}/api`,
  withCredentials: true,
});

// Solicitudes a la API
export const registerRequest = async (user) => instance.post('/register', user);

export const loginRequest = async (user) => instance.post('/login', user);

export const logOutRequest = async () => instance.post('/logout');

export const reloginverifyTokenRequest = async () => instance.get('/relogin');
