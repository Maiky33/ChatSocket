import axios from "axios";

let API = 'https://chat-socket-server-nu.vercel.app'

export const registerRequest = async (user) => axios.post(`${API}/api/register`, user,{
    withCredentials: true // Esto incluye las cookies en la solicitud
});

export const loginRequest = async (user) => axios.post(`${API}/api/login`, user, {
    withCredentials: true // Esto incluye las cookies en la solicitud
});

export const logOutRequest = async (user) => axios.post(`${API}/api/logout`, user,{
    withCredentials: true // Esto incluye las cookies en la solicitud
});


export const reloginverifyTokenRequest = async () => axios.get(`${API}/api/relogin`,{
    withCredentials: true // Esto incluye las cookies en la solicitud
});
