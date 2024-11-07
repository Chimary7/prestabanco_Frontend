import './App.css'
import HomeClient from './Components/ClientComponents/HomeClient';
import HomeAdmin from './Components/AdminComponents/HomeAdmin';
import loanService from './Services/loan.service';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import loansData from './loans.json';

function App() {

  useEffect(() => {
    async function loadLoans() {
      try {
        const loans = await loanService.getAll();
        if (loans.data.length === 0) {
          // Si no hay préstamos, carga los datos de loan.json
          for (const loan of loansData) {
            console.log("loan: ", loan);
            await loanService.createLoan(loan);
          }
        }
      } catch (error) {
        console.error("Error loading loans:", error);
      }
    }

    loadLoans();
  }, []);

  return (
    <>
        <Router>
        <div className='h-full w-screen bg-white'>
              <Routes>
                <Route path="/" element={<Navigate to="/home/register" replace />} />
                <Route path="/home/*" element={<HomeClient />}/>
                <Route path="admin/home/*" element={<HomeAdmin />}></Route>
              </Routes>
        </div>
        </Router>
    </>
  )
}

export default App
