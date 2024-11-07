import NavbarAdmin from "./NavbarAdmin";
import SidemenuAdmin from "./SidemenuAdmin";
import RegisterClients from "./RegisterClients";
import DetailsUserRegister from "./UserDetailsRegister";
import ListClients from "./ListClients";
import ClientDetail from "./ClientDetail";
import ListCredits from "./ListCredit";
import CreditEvaluation from "./EvaluationCredit";
import creditService from "../../Services/credit.service";
import SavingCredit from "./SavingCredit";
import LoanCreate from "./FormLoanType";
import HistoryCredit from "./HistoryCredit";
import ListLoanTypes from "./ListLoansType";
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

    const handleSelectCredit = async (id) => {

        try {
            // Obtén los detalles del crédito del backend
            const credit = await creditService.getCreditById(id);

            // Almacena el crédito en localStorage
            localStorage.setItem('Credit', JSON.stringify(credit));

            // Navega al componente de evaluación de crédito
            navigate('/admin/home/solicitud/evaluationcredit');
        } catch (error) {
            console.error("Error al obtener los detalles del crédito:", error);
        }
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
                    <Route path="/solicitudes" element={<ListCredits onSelectCredit={handleSelectCredit}/>}></Route>
                    <Route path="/solicitud/evaluationcredit" element={<CreditEvaluation />}></Route>
                    <Route path="/solicitud/savinghistory" element={<SavingCredit />}></Route>
                    <Route path="/crearprestamo" element={<LoanCreate />}></Route>
                    <Route path="/historialdecreditos" element={<HistoryCredit />}></Route>
                    <Route path="/listaprestamos" element={<ListLoanTypes />}></Route>
                </Routes>
            </div>
        </div>
    );
}