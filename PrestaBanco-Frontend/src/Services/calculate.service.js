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

const getcostotal = (CapitalMonth, annualInterest,years) =>{
    return httpClient.get('/api/Calculate/costtotal', {
        params: {
            Month: CapitalMonth,
            annualInterest: annualInterest,
            years: years
        }
    });
}

const getCuotaIngreso = (CapitalMonth, ingreso) => {
    return httpClient.get('/api/Calculate/cuotaingreso', {
        params: {
            cuotaMensual: CapitalMonth, // Ensure this matches the expected parameter name
            ingreso: ingreso
        }
    });
}

const getDeudaIngreso = (CapitalMonth, MontoDeudas ,ingreso) => {
    return httpClient.get('/api/Calculate/deudaingreso', {
        params: {
            cuotaMensual: CapitalMonth,
            MontoDeudas: MontoDeudas,
            ingreso: ingreso
        }
    });
}

const getEdadSolicitante = (birthdate, TimeLoan) => {
    return httpClient.get('/api/Calculate/edadsolicitante', {
        params: {
            birthdate: birthdate,
            TimeLoan: TimeLoan
        }
    });
}

const getminSaving = (MonthSaving, MonthPayment) => {
    return httpClient.get('/api/Calculate/minsaving', {
        params: {
            MonthSaving: MonthSaving,
            MonthPay: MonthPayment
        }
    });
}

const getRelationPayYears = (MonthSaving, MonthPayment, Years) => {
    return httpClient.get('/api/Calculate/relationmonthsavingyears', {
        params: {
            MonthSaving: MonthSaving,
            MonthPay: MonthPayment,
            Years: Years
        }
    });
}

export default {getCalculate, getcostotal, getCuotaIngreso, getDeudaIngreso, getEdadSolicitante, getminSaving, getRelationPayYears};