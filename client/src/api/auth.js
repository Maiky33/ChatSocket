import axios from "axios";

let API = 'http://localhost:4000'

export const registerRequest = async (user) => axios.post(`${API}/api/register`, user);

export const loginRequest = async (user) => axios.post(`${API}/api/login`, user);

export const logOutRequest = async (user) => axios.post(`${API}/api/logout`, user);


// export const verifyTokenRequest = async () => axios.get(`api/verify`);
