import Navbar from "./Navbar";
import Sidemenu from "./Sidemenu";
import RegisterClient from "./RegisterClient";
import Simulator from "./Simulator";
import ApplicationCredit from "./CreditApplication";
import ConsultCredit from "./CreditConsult";

import { Route, Routes, Navigate } from "react-router-dom";

export default function Home() {
    return(
        <div className="h-full w-screen bg-white flex flex-col">
            <Navbar />
            <Sidemenu />
            <div className='bg-white w-pContainer h-p92 m-1 fixed right-0 bottom-0 rounded-md border border-custom-blue'>
                    <Routes>
                        <Route path="/" element={<Navigate to path="/home/register" replace/>}></Route>
                        <Route path="/register" element={<RegisterClient />}></Route>
                        <Route path="/simulator" element={<Simulator />}></Route>
                        <Route path="/applicationcredit" element={<ApplicationCredit />}></Route>
                        <Route path="/consultcredit" element={<ConsultCredit />}></Route>
                    </Routes>
            </div>
        </div>
    );
};