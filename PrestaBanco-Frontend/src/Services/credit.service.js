import httpClient from '../http-common';

const getAll = () => {
  return httpClient.get('/api/prestabanco/credit/');
};

const getAllHistory = () => {
    return httpClient.get('/api/prestabanco/credit/all');
};

const getCreditsByRutUser = (rutUser) => {
    return httpClient.get('/api/prestabanco/credit/rut', {params: {rutUser}});
};

const getCreditProcessByRut =(rutUser) =>{
    return httpClient.get('/api/prestabanco/credit/process', {params: {
        rut: rutUser
    }});
}

const getCreditById = (id) => {
    return httpClient.get(`/api/prestabanco/credit/idcredit`, {params: {id}});
}

const create = (data) => {
    return httpClient.post('/api/prestabanco/credit/', data);
}

const update = (data) => {
    console.log(data);
    return httpClient.put(`/api/prestabanco/credit/`, data);
}

const remove = id => {
    return httpClient.delete(`/api/prestabanco/credit/${id}`);
}

export default { getAll, getCreditsByRutUser, getCreditProcessByRut, getCreditById, create, update, remove, getAllHistory };