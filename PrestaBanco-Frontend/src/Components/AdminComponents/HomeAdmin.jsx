import NavbarAdmin from "./NavbarAdmin";
import SidemenuAdmin from "./SidemenuAdmin";
import RegisterClients from "./RegisterClients";
import DetailsUserRegister from "./UserDetailsRegister";
import ListClients from "./ListClients";
import ClientDetail from "./ClientDetail";
import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

export default function HomeAdmin() {
    const [selectedRut,setSelectedRut] = useState(null);
    const navigate = useNavigate();

    const handleSelectRut = (rut) => {
        setSelectedRut(rut);
        navigate('/admin/home/clients/detailsRegister');
    };

    const handleSelectRutEdit = (rut) => {
        setSelectedRut(rut);
        navigate('/admin/home/clients/detailsEdit');
    };

    return(
        <div className="h-full w-screen bg-white flex flex-col">
            <NavbarAdmin />
            <SidemenuAdmin />
            <div className='bg-white w-pContainer h-p92 m-1 fixed right-0 bottom-0 rounded-md border border-black'>
                <Routes>
                    <Route path="/" element={<Navigate to="/admin/home/clientsRegister" replace/>}></Route>
                    <Route path="/clientsRegister" element={<RegisterClients onSelectRut={handleSelectRut} />}></Route>
                    <Route path="/clients/detailsRegister" element={<DetailsUserRegister rut={selectedRut}/>}></Route>
                    <Route path="/clients" element={<ListClients onSelectRutEdit={handleSelectRutEdit}/>}></Route>
                    <Route path="/clients/detailsEdit" element={<ClientDetail rut={selectedRut}/>}></Route>
                </Routes>
            </div>
        </div>
    );
}