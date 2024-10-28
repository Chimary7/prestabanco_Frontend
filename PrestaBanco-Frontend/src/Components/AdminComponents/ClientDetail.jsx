import React, { useState, useEffect } from 'react';
import userService from '../../Services/user.service';
import "../ClientComponents/styleClient/inputNumber.css";

export default function ClientDetail({ rut }) {
    const [user, setUser] = useState({});

    useEffect(() => {
        userService
            .getRut(rut)
            .then(response => {
                setUser(response.data);
            })
            .catch((error) => {
                console.log("Se ha producido un error al intentar mostrar el detalle del cliente", error);
            });
    }, [rut]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'rut') {
            setUser({
                ...user,
                [name]: formatRUT(value)
            });
        } else {
            setUser({
                ...user,
                [name]: value
            });
        }
    };

    // Formatear el RUT
    const formatRUT = (rut) => {
        let cleanRUT = rut.replace(/[^0-9kK]/g, '').toUpperCase();
        let formattedRUT = '';
        if (cleanRUT.length > 1) {
            const bodyRUT = cleanRUT.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            const checkDigit = cleanRUT.slice(-1);
            formattedRUT = `${bodyRUT}-${checkDigit}`;
        } else {
            formattedRUT = cleanRUT;
        }
        return formattedRUT;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            window.confirm('¿Está seguro de los cambios?');
            const response = await userService.update(user);
            console.log(response);
        } catch (error) {
            console.error('Error al registrar el usuario', error);
        }
    };

    return (
        <div className='h-full w-full text-black'>
            <form className='h-full w-full flex flex-col items-center p-2' onSubmit={handleSubmit}>
                <div className="flex w-full h-full">
                    <div className="h-full w-full p-4">
                        <h1 className='w-full h-1/6 items-center flex font-bold text-neutral-900'>Editar usuario</h1>
                        <div className='w-full h-1/6 p-1 flex justify-between items-center drop-shadow-md'>
                            <input 
                                type="text"
                                name="name"
                                placeholder="Nombre"
                                value={user.name || ''}
                                onChange={handleChange} 
                                className="w-45/100 mx-4 p-4 border text-black bg-white border-black rounded-md" 
                            />
                            <input 
                                type="text"
                                name='lastname' 
                                value={user.lastname || ''}
                                onChange={handleChange}
                                placeholder="Apellido" 
                                className="w-45/100 mx-4 p-4 border text-black bg-white rounded-md border-black" 
                            />
                        </div>
                        <div className='w-full h-1/6 p-1 flex justify-between items-center drop-shadow-md'>
                            <input
                                type="text"
                                name="rut"
                                value={user.rut || ''}
                                onChange={handleChange}
                                placeholder="RUT"
                                className="w-full mx-4 p-4 border text-black bg-white rounded-md border-black"
                                maxLength={12}
                            />
                        </div>
                        <div className='w-full h-1/6 p-1 flex justify-between items-center flex flex-col'>
                            <div className='w-1/2 h-full flex justify-center items-center p-4 m-2 bg-white border rounded-md border-black drop-shadow-md'>
                                <h2 className="font-bold p-4 text-black">
                                    Fecha de nacimiento
                                </h2>
                                <p className="font-medium p-4">{new Date(user.birthdate).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="mt-4 p-4 bg-blue-700 text-white rounded" type='submit'>Guardar</button>
            </form>
        </div>
    );
}
