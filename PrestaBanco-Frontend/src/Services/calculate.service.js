import	httpClient from "../http-common"

const getCalculate = (CapitalMonth, annualInterest,years) =>{
    return httpClient.get('/api/Calculate/', {
        params: {
            CapitalMonth,
            annualInterest,
            years
        }
    });
}

export default {getCalculate};