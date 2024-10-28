import httpClient from '../http-common';

const getAll = () => {
  return httpClient.get('/api/prestabanco/credit/');
};

const getCreditsByRutUser = (rutUser) => {
    return httpClient.get('/api/prestabanco/credit/rut', {params: {rutUser}});
};

const getCreditProcessByRut =(rutUser) =>{
    return httpClient.get('/api/prestabanco/credit/process', {params: {rutUser}});
}

const create = (data) => {
    return httpClient.post('/api/prestabanco/credit/', data);
}

const update = (data) => {
    return httpClient.put(`/api/prestabanco/credit/`, data);
}

const remove = id => {
    return httpClient.delete(`/api/prestabanco/credit/${id}`);
}

export default { getAll, getCreditsByRutUser, getCreditProcessByRut, create, update, remove};