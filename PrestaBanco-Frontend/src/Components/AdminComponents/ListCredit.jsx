import { useEffect, useState } from "react";
import creditService from "../../Services/credit.service";
import loanService from "../../Services/loan.service";

export default function ListCredit({ onSelectCredit }) {
    const [Credits, setCredits] = useState([]);
    const [LoanTypes, setLoanTypes] = useState({});

    const init = () => {
        creditService
            .getAll()
            .then(response => {
                setCredits(response.data);
            })
            .catch((error) => {
                console.log("Se ha producido un error al intentar mostrar el listado de todas las solicitudes de crédito", error);
            });
        
        loanService
            .getAll()
            .then(response => {
                const loansMap = {};
                response.data.forEach(loan => {
                    loansMap[loan.id] = loan.nameLoan;
                });
                setLoanTypes(loansMap);
                console.log(loansMap);
            })
            .catch((error) => {
                console.log("Se ha producido un error al intentar cargar los tipos de crédito", error);
            });
    };

    useEffect(() => {
        init();
    }, []);

    const handleViewCredit = (idCredit) => {
        onSelectCredit(idCredit);
    };

    const montoFinanciamiento = (monto, porcentaje) => {
        return monto * (porcentaje/100);
    }

    return (
        <div className="w-full h-full bg-transparent items-center flex flex-col">
            <h1 className="text-black font-bold m-2">Lista de creditos en proceso</h1>
            <div className="m-2 h-full w-full">
                <table className="table-fixed w-full h-full">
                    <thead className="h-10 w-full bg-black font-bold">
                        <tr>
                            <th>Rut cliente</th>
                            <th>Fecha de solicitud</th>
                            <th>Monto solicitado</th>
                            <th>Estado</th>
                            <th>tipo de credito</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="w-full h-full font-bold text-black overflow-y-auto">
                        {Credits.length > 0 ? (
                            Credits.map((credit) => (
                                <tr key={credit.id} className="border-b-gray-300 border h-16 w-full">
                                    <td>{credit.rutClient}</td>
                                    <td>{new Date(credit.createdate).toLocaleDateString()}</td>
                                    <td>{montoFinanciamiento(credit.amountTotal, credit.maxPorcentFinancy)}</td>
                                    <td>{credit.creditStatus}</td>
                                    <td>{LoanTypes[credit.idloanType] || ""}</td>
                                    <td>
                                        <button
                                            className="bg-green-500 text-white p-2 rounded-md m-1"
                                            onClick={() => handleViewCredit(credit.id)}
                                        >
                                            evaluar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center bg-gray-200">
                                    No hay solicitudes de crédito en proceso
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}