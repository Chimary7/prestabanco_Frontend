import httpClient from '../http-common';
import axios from 'axios';

const getAll = () => {
    return httpClient.get('/api/prestabanco/files/');
}

const getPdfByCreditId = (creditid) => {
    return httpClient.get(`/api/prestabanco/files/creditid`, {params: {creditid}});
}

const getPdfCategoryByCreditId = (Category, idCredit) => {
    return httpClient.get(`/api/prestabanco/files/pdfcategorycredit`, {params: 
        {
            Category: Category, 
            idCredit: idCredit}
    });
}

const create = (fileData) => {
    return axios.post('http://localhost:8080/api/prestabanco/files/', fileData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};


const save = (data) => {
    return httpClient.post('/api/prestabanco/files/save', data);
}

const remove = id => {
    return httpClient.delete(`/api/prestabanco/files/${id}`);
}

export default { getAll, getPdfByCreditId, getPdfCategoryByCreditId, create, save, remove };