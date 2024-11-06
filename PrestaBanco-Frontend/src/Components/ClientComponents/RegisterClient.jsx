import React from 'react';
import { useState } from 'react';
import userService from '../../Services/user.service';
import "../ClientComponents/styleClient/inputNumber.css";

export default function RegisterClient() {
    const [user, setUser] = useState({
        name: '',
        lastname: '',
        ingreso: '',
        rut: '',
        birthdate: ''
    });

    const [birthdateInput, setBirthdateInput] = useState({
        day: '',
        month: '',
        year: ''
    });
    const currentYear = new Date().getFullYear();

    const formatNumber = (number) => {
        // Parseamos el número y luego lo formateamos para que el usuario vea los puntos
        return new Intl.NumberFormat('es-ES', {
            style: 'decimal',
        }).format(number);
    };

    const handleChange = (e) => {
        const {name, value} = e.target;

        if (['day', 'month', 'year'].includes(name)) {
            const updatedBirthdateInput = {
                ...birthdateInput,
                [name]: value
            };
            setBirthdateInput(updatedBirthdateInput);

            setUser({
                ...user,
                birthdate: `${updatedBirthdateInput.year}-${updatedBirthdateInput.month.padStart(2, '0')}-${updatedBirthdateInput.day.padStart(2, '0')}`
            });

        } else if(name == 'rut'){
            setUser({
                ...user,
                [name]: formatRUT(value)
            });
        } else if(name === 'ingreso'){
            const unformattedAmount = value.replace(/\./g, '');
            if(!isNaN(unformattedAmount)){
                setUser({
                    ...user,
                    [name]: formatNumber(unformattedAmount)
                });
            }
        } else {
            setUser({
                ...user,
                [name]: value
            });
        }
    };

    //genero lista de dias, meses y año
    const generateDays = () => {
        let days = [];
        for(let i = 1; i <= 31; i++){
            days.push(<option key={i} value={i}>{i}</option>);
        }
        return days;
    }

    const generateMonths = () => {
        let months = [];
        for(let i = 1; i <= 12; i++){
            months.push(<option key={i} value={i}>{i}</option>);
        }
        return months;
    }

    const generateYears = () => {
        let years = [];
        for(let i = currentYear; i >= 1900; i--){
            years.push(<option key={i} value={i}>{i}</option>);
        }
        return years;
    }

    //formato de RUT
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
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userToSubmit = {
            ...user,
            ingreso: user.ingreso.replace(/\./g, '')
        };

        try {
            const response = await userService.create(userToSubmit);
        } catch (error) {
            console.error('error registrando usuario', error);

        }
    };

    return(
        <div className='h-full w-full text-black'>
            <form className='h-full w-full flex flex-col items-center p-2' onSubmit={handleSubmit}>
                <div className="flex w-full h-full">
                    <div className="h-full w-full p-4">
                        <h1 className='w-full h-1/6 items-center flex font-bold text-custom-blue'>Registro</h1>
                        <div className='w-full h-1/6 p-1 flex justify-between items-center'>
                            <input 
                                type="text"
                                name="name"
                                placeholder="Nombre"
                                value={user.name}
                                onChange={handleChange} 
                                className="w-45/100 mx-4 p-4 border text-black bg-white border-custom-blue-light rounded-md" 
                            />
                            <input 
                                type="text"
                                name='lastname' 
                                value={user.lastname}
                                onChange={handleChange}
                                placeholder="Apellido" 
                                className="w-45/100 mx-4 p-4 border text-black bg-white rounded-md border-custom-blue-light" 
                            />
                        </div>
                        <div className='w-full h-1/6 p-1 flex justify-between items-center'>
                            <input
                                type="text"
                                name="rut"
                                value={user.rut}
                                onChange={handleChange}
                                placeholder="RUT"
                                className="w-45/100 mx-4 p-4 border text-black bg-white border-custom-blue-light rounded-md"
                                maxLength={12}
                            />
                            <input 
                                type="text" 
                                name='ingreso'
                                id='ingreso'
                                value={user.ingreso || ''}
                                onChange={handleChange}
                                placeholder="Ingreso (si posee un trabajo independiente deje vacio este campo)"
                                className="w-45/100 mx-4 p-4 border text-black bg-white border-custom-blue-light rounded-md"
                            />
                        </div>
                        <div className='w-full h-1/6 p-1 flex justify-between items-center flex flex-col'>
                            <label className='w-full text-left p-4'>fecha de nacimiento</label>
                              <div className='w-full h-full flex justify-between items-center'>
                              <select 
                                    name='day'
                                    value={birthdateInput.day}
                                    onChange={handleChange}
                                    className='w-1/3 mx-4 p-4 border text-black bg-white rounded-md border-custom-blue-light'
                                >
                                    <option value=''>Día</option>
                                    {generateDays()}
                                </select>
                                <select 
                                    name='month'
                                    value={birthdateInput.month}
                                    onChange={handleChange}
                                    className='w-1/3 mx-4 p-4 border text-black bg-white rounded-md border-custom-blue-light'  
                                > 
                                    <option value=''>Mes</option>
                                    {generateMonths()}
                                </select>
                                <select 
                                    name='year'
                                    value={birthdateInput.year}
                                    onChange={handleChange}
                                    className='w-1/3 mx-4 p-4 border text-black bg-white rounded-md border-custom-blue-light'
                                >
                                    <option value=''>Año</option>
                                    {generateYears()}
                                </select>
                              </div>
                        </div>
                    </div>

                </div>
                <button className="mt-4 p-4 bg-blue-700 text-white rounded" type='submit'>Enviar</button>
            </form>
        </div>
    );
};