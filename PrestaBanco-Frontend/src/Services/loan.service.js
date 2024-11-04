import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get(`/api/prestabanco/loantype/`);
}

const getLoan = (id) => {
    return httpClient.get(`/api/prestabanco/loantype/${id}`);
}

const createLoan = (data) => {
    return httpClient.post(`/api/prestabanco/loantype/`, data);
}

const updateLoan = (data) => {
    return httpClient.put(`/api/prestabanco/loantype/${id}`, data);
}

const removeLoan = (id) => {
    return httpClient.delete(`/api/prestabanco/loantype/${id}`);
}

export default { getAll, getLoan, createLoan, updateLoan, removeLoan };