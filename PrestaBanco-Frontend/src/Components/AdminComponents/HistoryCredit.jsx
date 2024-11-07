import { useEffect, useState } from 'react';
import creditService from '../../Services/credit.service';


export default function HistoryCredit() {
    const [Credit, setCredit] = useState([]);

    const init = () =>{
        creditService
        .getAllHistory()
            .then(response => {
                setCredit(response.data);
                console.log(response.data);
            })
            .catch((error) =>{
                console.log("Se ha producido un error al intentar mostrar el listado de todos los historiales de credito",error);
            })
    };

    useEffect(() => {
        init();
    }, []);

    return(
        <div className='h-full w-full bg-transparent items-center flex flex-col'>
            <h1 className='text-black font-bold m-2'>Historial de creditos</h1>
            <div className='m-2 h-full w-full'>
                <table className='table-fixed w-full h-full'>
                    <thead className='h-10 w-full bg-black font-bold'>
                        <tr>
                            <th>Rut cliente</th>
                            <th>Monto</th>
                            <th>Estado</th>
                            <th>Financiamiento</th>
                        </tr>
                    </thead>
                    <tbody className='w-full h-full font-bold text-black overflow-y-auto'>
                    {Credit.length > 0 ? (
                            Credit.map((credit) => (
                                <tr className='border-b-gray-300 border h-16 w-full' key={credit.rut}>
                                    <td>{credit.rutClient}</td>
                                    <td>{(credit.amountTotal)*(credit.maxPorcentFinancy/100)}</td>
                                    <td>{credit.creditStatus}</td>
                                    <td>{credit.maxPorcentFinancy}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="h-16 text-center bg-gray-200 text-gray-600">
                                    No hay historial de creditos de los clientes
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};