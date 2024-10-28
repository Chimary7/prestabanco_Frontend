import { useEffect, useState } from 'react';
import userService from '../../Services/user.service';


export default function RegisterClient({onSelectRut}) {
    const [Clients, setClients] = useState([]);

    const init = () =>{
        userService
            .getAllNotRegister()
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

    const handleViewUser = (rut) => {
        onSelectRut(rut);
    };

    return(
        <div className='h-full w-full bg-transparent items-center flex flex-col'>
            <h1 className='text-black font-bold m-2'>Solicitudes de registro</h1>
            <div className='m-2 h-full w-full'>
                <table className='table-fixed w-full h-full'>
                    <thead className='h-10 w-full bg-black font-bold'>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Rut</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className='w-full h-full font-bold text-black overflow-y-auto'>
                    {Clients.length > 0 ? (
                            Clients.map((client) => (
                                <tr className='border-b-gray-300 border h-16 w-full' key={client.rut}>
                                    <td>{client.name}</td>
                                    <td>{client.lastname}</td>
                                    <td>{client.rut}</td>
                                    <td className='justify-center items-center flex h-full w-full'>
                                        <button 
                                            className='bg-neutral-900 text-white rounded-md p-2 m-1 justify-center items-center flex hover:bg-neutral-800 hover:border-white'
                                            onClick={() => handleViewUser(client.rut)}
                                            >
                                            <span className='m-1'>
                                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                                    <path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/>
                                                </svg>
                                            </span>
                                            <p className='m-1'>Visualizar</p>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="h-16 text-center bg-gray-200 text-gray-600">
                                    No hay solicitudes de registro
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};