import * as React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
    const Navigate = useNavigate();

    return(
        <nav className="bg-custom-blue w-full h-14 flex fixed px-4 items-center shadow-md">
            <div className='bg-white text-custom-blue w-32 h-10 flex items-center justify-center ml-auto rounded-xl border border-solid hover:bg-custom-blue-light hover:text-white cursor-pointer' onClick={()=>Navigate("/admin/home/clientsRegister")}>
                <p className='text-base font-bold'>Cliente</p>
            </div>
        </nav>
    );
}