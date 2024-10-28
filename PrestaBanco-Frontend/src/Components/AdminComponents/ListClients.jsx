import { useEffect, useState } from 'react';
import userService from '../../Services/user.service';


export default function ListClients({onSelectRutEdit}) {
    const [Clients, setClients] = useState([]);

    const init = () =>{
        userService
            .getAllClientRegister()
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
        onSelectRutEdit(rut);
    };

    const handleReject = (id) => {
        if(window.confirm("¿Está seguro de eliminar este usuario?")){
            userService
                .remove(id)
                .then(response => {
                    console.log("Usuario rechazado correctamente", response);
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
                                            className='bg-blue-500 text-white rounded-md p-2 m-1 justify-center items-center flex hover:bg-neutral-800 hover:border-white'
                                            onClick={() => handleViewUser(client.rut)}
                                            >
                                            <span className='m-1'>
                                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                                                <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/>
                                            </svg>
                                            </span>
                                            <p className='m-1'>Editar</p>
                                        </button>

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
                                    No hay Clientes
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};