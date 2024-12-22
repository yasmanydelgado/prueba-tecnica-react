import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add'; // Añadido el import faltante
import { useNavigate } from 'react-router-dom'; // Añadido el import faltante

const Header = () => {
  const navigate = useNavigate(); // Añadido el hook faltante

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, backgroundColor: '#f5f5f5' }}>
      <Typography variant="h6">Consulta de Clientes</Typography>
      <Box>
        <Button variant="text" color="error" startIcon={<ArrowBackIcon />} sx={{ mr: 1 }} onClick={() => navigate('/home')}>
          Volver
        </Button>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={() => navigate('/mantenimiento-cliente')}>
          Añadir
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
