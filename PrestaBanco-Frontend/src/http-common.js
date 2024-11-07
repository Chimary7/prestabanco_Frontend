import axios from 'axios';

const prestaBancoBackendServer = import.meta.env.VITE_PRESTABANCO_BACKEND_SERVER;
const prestaBancoBackendPort = import.meta.env.VITE_PRESTABANCO_BACKEND_PORT;

export default axios.create({
    baseURL: `http://20.189.161.172:8080`,
    headers: {
        'Content-type': 'application/json',
    }
});