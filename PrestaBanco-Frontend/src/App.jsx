import './App.css'
import HomeClient from './Components/ClientComponents/HomeClient';
import HomeAdmin from './Components/AdminComponents/HomeAdmin';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {
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
