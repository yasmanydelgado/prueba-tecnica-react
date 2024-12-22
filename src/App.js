import logo from './logo.svg';
import './App.css';
import CrudForm from './components/crud.tsx';
import SignIn from './sign-in/SignIn.tsx';
import SignUp from './sign-up/SignUp.tsx';
import * as React from 'react';
import DashboardLayoutBasic from '../src/components/app-bar.tsx';
import EnhancedTable from './components/table.tsx';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './components/home.tsx';
import NotFound from './components/not-found.tsx';

import { useContext, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import StickyHeadTable from './components/table.tsx';

const App = () => {
  return (
    <div className="App">
      <Router>
        <AuthCheck />
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route
            path="/*"
            element={
              <>
                <DashboardLayoutBasic />
                <Routes>
                  <Route path="/home" element={<Home />} />
                  <Route path="/consulta-clientes" element={<StickyHeadTable />} />
                  <Route path="/mantenimiento-cliente/:id" element={<CrudForm />} />
                  <Route path="/mantenimiento-cliente" element={<CrudForm />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </>
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

const AuthCheck = () => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No está autenticado');
        }
        // Aquí podrías agregar una llamada para verificar el token si es necesario
      } catch (error) {
        console.error('Error de autenticación:', error.message);
        navigate('/sign-in');
      }
    };

    checkAuth();
  }, [navigate]);

  return null;
};

export default App;
