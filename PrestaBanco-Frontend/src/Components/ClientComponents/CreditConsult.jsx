import { useState } from "react";
import loanService from "../../Services/loan.service";
import creditService from "../../Services/credit.service";
import calculateService from "../../Services/calculate.service";
import userService from "../../Services/user.service";

export default function CreditConsult(){
    const [credit, setCredit] = useState(null);
    const [loan, setLoan] = useState([]);
    const [user, setUser] = useState([]);
    const [rutClient, setRutClient] = useState('');
    const [amountPayments, setAmountPayments] = useState(null);
    const [noActiveCredit, setNoActiveCredit] = useState(false);
    const [amountTotalCost, setAmountTotalCost] = useState(null);

    const handleSearchCredit = async (e) => {
        e.preventDefault();
        try {
            const creditData = await creditService.getCreditProcessByRut(rutClient);
            setCredit(creditData.data);

            const userData = await userService.getRut(creditData.data.rutClient);
            setUser(userData.data);

            if (creditData.data.idloanType) {
                const loanData = await loanService.getLoan(creditData.data.idloanType);
                setLoan(loanData.data);

                const amountFinancy = creditData.data.amountTotal * (creditData.data.maxPorcentFinancy / 100);
                const totalCostData = await calculateService.getcostotal(amountFinancy, creditData.data.porcentInterest, creditData.data.timePay);
                setAmountTotalCost(totalCostData.data);
                const amountMonthPayment = await calculateService.getCalculate(amountFinancy, creditData.data.porcentInterest, creditData.data.timePay);
                setAmountPayments(amountMonthPayment.data);
            }
        } catch (error) {
            console.log(error);
            setNoActiveCredit(true);
            setCredit(null);
        }
    };

    const handleSubmitReject = () => {
        setCredit({...credit, status: "RECHAZADO"});
        creditService.update(credit)
        .then(() => {
            setCredit({...credit, status: "RECHAZADO"});
            console.log("Credito rechazado");
        })
        .catch((error) => {
            console.log(error);
        });
    }

    const formatRUT = (rut) => {
        let cleanRUT = rut.replace(/[^0-9kK]/g, '').toUpperCase();
        let formattedRUT = '';
        if(cleanRUT.length > 1){
            const bodyRUT = cleanRUT.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            const checkDigit = cleanRUT.slice(-1);
            formattedRUT = `${bodyRUT}-${checkDigit}`;
        } else{
            formattedRUT = cleanRUT;
        }
        return formattedRUT;
    };

    const formatNumber = (number) => {
        // Parseamos el número y luego lo formateamos para que el usuario vea los puntos
        return new Intl.NumberFormat('es-ES', {
            style: 'decimal',
        }).format(number);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name === 'rutClient'){
            setRutClient(formatRUT(value));
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="w-full h-full flex flex-col items-center bg-gray-100">
            <h1 className="text-blue-700 p-2 text-xl font-bold">Estado del Crédito</h1>
            <div className="flex w-full h-full text-blue-700">

                {/* Formulario de Búsqueda */}
                <div className="w-1/2 h-full p-4 flex flex-col items-center">
                    <form className="w-full p-2 flex flex-col items-center" onSubmit={handleSearchCredit}>
                        <label className="font-semibold w-full p-2 text-center">Ingrese su RUT:</label>
                        <input
                            type="text"
                            name="rutClient"
                            value={rutClient}
                            onChange={handleChange}
                            placeholder="RUT"
                            className="w-2/3 p-2 border rounded-md bg-white text-black"
                            maxLength={12}
                        />
                        <button className="mt-4 p-2 px-5 bg-blue-600 text-white rounded-full" type="submit">Consultar</button>
                    </form>

                    {noActiveCredit && (
                        <p className="text-red-600 mt-4 bg-red-100 w-full p-4 font-bold border border-red-600 rounded-md text-center">
                            No hay créditos activos para este usuario
                        </p>
                    )}

                    {credit && (
                        <div className="w-full p-4 mt-4 rounded-md flex flex-col items-center bg-white shadow">
                            <h2 className="font-semibold">Datos del Cliente</h2>
                            <p>{user?.name} {user?.lastname}</p>
                            <h2 className="font-semibold mt-2">RUT:</h2>
                            <p>{credit.rutClient}</p>
                            <h2 className="font-semibold mt-2">Estado del Crédito:</h2>
                            <p className="bg-blue-100 font-bold p-4 rounded-md border border-blue-300">{credit.creditStatus}</p>
                        </div>
                    )}
                </div>

                <div className="w-1/2 h-full p-4">
                    {credit && (
                        <div className="w-full h-full flex flex-col justify-between p-4 rounded-md bg-white shadow">
                            <h2 className="font-semibold">Detalle del Crédito</h2>
                            <p>Monto del Crédito: {formatNumber(credit.amountTotal)}</p>
                            <p>Fecha de Solicitud: {formatDate(credit.createdate)}</p>
                            <p className="font-bold">Estado del Crédito: {credit.creditStatus}</p>

                            <div className="mt-4">
                                <h2 className="font-semibold">Costos Totales</h2>
                                <p>costos administrativos: {(amountTotalCost * (credit.maxPorcentFinancy/100))*0.01}</p>
                                <p>Seguro de degravamen: {amountTotalCost * 0.0003}</p>
                                <p>seguro de Incendio: 20.000</p>
                                <p>Plazo: {credit.timePay} años</p>
                                <p className="font-bold">Monto Total a Pagar: {formatNumber(amountTotalCost * (credit.maxPorcentFinancy/100))}</p>
                            </div>

                            <div className="flex mt-4 justify-center">
                                <button onClick={handleSubmitReject} className="p-2 bg-red-500 text-white rounded-md">Cancelar Crédito</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}