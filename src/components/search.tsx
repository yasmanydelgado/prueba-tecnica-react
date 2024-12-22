import React, { useState } from 'react';
import { TextField, IconButton, Box, Dialog, DialogTitle, DialogContent, DialogContentText, Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { ClientService } from '../servicio/crud.tsx'; // Importar el servicio de cliente

const SearchComponent = () => {
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [open, setOpen] = useState(false);
  const [clientInfo, setClientInfo] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleSearch = async () => {
    console.log('Search triggered with:', { name, identifier });
    try {
      if (identifier) {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No está autenticado');
        }
        const client = await ClientService.getClientById(identifier, token);
        console.log('Cliente encontrado:', client);
        setClientInfo(client);
        setOpen(true); // Abrir el modal con la información del cliente
      } else {
        setSnackbarMessage('Por favor, ingrese un identificador para buscar.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Error al buscar el cliente:', error.response.data.errors);
      console.error('Error al buscar el cliente:', error.response.data.errors[1]);
      setSnackbarMessage('Error al buscar el cliente: ' + JSON.stringify(error.response.data.errors));
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end', p: '1%' }}>
      {/* Campo para el Nombre */}
      <TextField
        label="Nombre"    
        variant="outlined"
        value={name}
        size="small"
        sx={{ flex: 4 }}  // Tamaño relativo
        onChange={(e) => setName(e.target.value)}
      />

      {/* Campo para el Identificador */}
      <TextField
        label="Identificador"
        variant="outlined"
        size="small"
        sx={{ flex: 4 }}  // Tamaño relativo
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
      />

      {/* Icono de búsqueda */}
      <IconButton onClick={handleSearch} color="primary" sx={{ flex: 0.4 }}>
        <SearchIcon />
      </IconButton>

      {/* Modal para mostrar la información del cliente */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Información del Cliente</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {clientInfo ? `Nombre: ${clientInfo.nombre}, Apellidos: ${clientInfo.apellidos}, ID: ${clientInfo.identificacion}` : 'No se encontró información del cliente.'}
          </DialogContentText>
        </DialogContent>
      </Dialog>

      {/* Snackbar para mostrar mensajes de error */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SearchComponent;
