import * as React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Sidemenu() {
    const Navigate =  useNavigate();

    return(
        <div className='h-98,5p w-pSidemenu bg-white fixed m-1 border-custom-blue rounded-xl solid border'>
            <div className='m-1 h-1/10 items-center justify-center flex'>
            <svg xmlns="http://www.w3.org/2000/svg" 
                xmlnsXlink="http://www.w3.org/1999/xlink" 
                version="1.1" 
                id="mdi-duck" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24"
                className='m-1 font-bold w-8 h-auto fill-custom-blue'>
                    <path d="M8.5,5A1.5,1.5 0 0,0 7,6.5A1.5,1.5 0 0,0 8.5,8A1.5,1.5 0 0,0 10,6.5A1.5,1.5 0 0,0 8.5,5M10,2A5,5 0 0,1 15,7C15,8.7 14.15,10.2 12.86,11.1C14.44,11.25 16.22,11.61 18,12.5C21,14 22,12 22,12C22,12 21,21 15,21H9C9,21 4,21 4,16C4,13 7,12 6,10C2,10 2,6.5 2,6.5C3,7 4.24,7 5,6.65C5.19,4.05 7.36,2 10,2Z" />
            </svg>
                <span className='m-1 font-bold text-custom-blue'>Prestabanco</span>
            </div>
            <div className='m-1 h-87/100 text-custom-blue'>
                <ul className='w-full h-full flex flex-col space-y-2'>
                    <li className='m-1 p-2 w-full rounded-l-md font-bold hover:bg-custom-blue hover:text-white' onClick={()=>Navigate("/home/register")}>Registrarse</li>
                    <li className='m-1 p-2 w-full rounded-l-md font-bold hover:bg-custom-blue hover:text-white' onClick={()=>Navigate("/home/simulator")}>Simulacion</li>
                    <li className='m-1 p-2 w-full rounded-l-md font-bold hover:bg-custom-blue hover:text-white' onClick={()=>Navigate("/home/applicationcredit")}>Solicitud credito</li>
                    <li className='m-1 p-2 w-full rounded-l-md font-bold hover:bg-custom-blue hover:text-white' onClick={()=>Navigate("/home/consultcredit")}>Consultar estado de credito</li>
                </ul>
            </div>
        </div>
    );
}