import httpClient from '../http-common';

const getAllNotRegister = () => {
    return httpClient.get('/api/prestabanco/users/');
}

const getAllClientRegister = () => {
    return httpClient.get('/api/prestabanco/users/clients');
}

const getRut = (rut) => {
    return httpClient.get('/api/prestabanco/users/rut', { params: { rut } });
}

const create = (data) => {
    return httpClient.post('/api/prestabanco/users/', data);
}

const update = (data) => {
    return httpClient.put(`/api/prestabanco/users/`, data);
}

const remove = id => {
    return httpClient.delete(`/api/prestabanco/users/${id}`);
}

export default { getAllNotRegister, getAllClientRegister , getRut, create, update, remove };