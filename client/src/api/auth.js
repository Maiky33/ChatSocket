import axios from "axios";

const API = 'http://localhost:4000/api'

//funcion para hacer la peticion a la base de datos
export const registeRequest = user => axios.post(`${API}/register`, user)