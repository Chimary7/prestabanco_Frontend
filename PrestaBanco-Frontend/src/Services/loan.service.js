import httpClient from "../http-common";

const getAll = () => {
    return httpClient.get(`/api/prestabanco/loantype/`);
}

export default { getAll };