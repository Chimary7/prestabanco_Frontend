import * as React from 'react';
import { useNavigate } from 'react-router-dom';

export default function NavbarAdmin() {
    const Navigate = useNavigate();

    return(
        <nav className="bg-neutral-900 w-full h-14 flex fixed px-4 items-center shadow-md">
            <div className='bg-white text-black w-32 h-10 flex items-center justify-center ml-auto rounded-xl border border-solid hover:bg-transparent hover:text-white cursor-pointer' onClick={()=>Navigate("/home/register")}>
                <p className='text-base font-bold'>Ejecutivo</p>
            </div>
        </nav>
    );
}