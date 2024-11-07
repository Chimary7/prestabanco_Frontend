import { useEffect, useState } from 'react';
import LoanService from '../../Services/loan.service';


export default function ListClients() {
    const [Clients, setClients] = useState([]);

    const init = () =>{
        LoanService
            .getAll()
            .then(response => {
                setClients(response.data);
            })
            .catch((error) =>{
                console.log("Se ha producido un error al intentar mostrar el listado de todos los clientes",error);
            })
    };

    useEffect(() => {
        init();
    }, []);

    const handleReject = (id) => {
        if(window.confirm("¿Está seguro de eliminar este prestamo?")){
            LoanService
                .removeLoan(id)
                .then(response => {
                    console.log("Prestamo eliminado correctamente", response);
                    init();
                })
                .catch((error) => {
                    console.log("Se ha producido un error al intentar rechazar el registro del usuario", error);
                });
        }
    };

    return(
        <div className='h-full w-full bg-transparent items-center flex flex-col'>
            <h1 className='text-black font-bold m-2'>Lista de Clientes</h1>
            <div className='m-2 h-full w-full'>
                <table className='table-fixed w-full h-full'>
                    <thead className='h-10 w-full bg-black font-bold'>
                        <tr>
                            <th>Nombre</th>
                            <th>tiempo maximo</th>
                            <th>Interes Minimo</th>
                            <th>Interes maximo</th>
                            <th>Financiamiento maximo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className='w-full h-full font-bold text-black overflow-y-auto'>
                    {Clients.length > 0 ? (
                            Clients.map((client) => (
                                <tr className='border-b-gray-300 border h-16 w-full' key={client.rut}>
                                    <td>{client.nameLoan}</td>
                                    <td>{client.maxTime}</td>
                                    <td>{client.minInterest}</td>
                                    <td>{client.maxInterest}</td>
                                    <td>{client.maxFinanPorcent}</td>
                                    <td className='justify-center items-center flex h-full w-full'>
                                        <button 
                                            className='bg-red-500 text-white rounded-md p-2 m-1 justify-center items-center flex hover:bg-neutral-800 hover:border-white'
                                            onClick={() => handleReject(client.id)}
                                            >
                                            <span className='m-1'>
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                                                </svg>
                                            </span>
                                            <p className='m-1'>Eliminar</p>
                                        </button>

                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="h-16 text-center bg-gray-200 text-gray-600">
                                    No hay Prestamos
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};