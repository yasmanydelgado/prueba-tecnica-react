import React, { useEffect, useState } from 'react';
import { 
  Box,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import { ClientService } from '../servicio/crud.tsx';

interface Client {
  identificacion: string;
  nombreCompleto: string;
}

const ClientList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [searchName, setSearchName] = useState('');
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const token = localStorage.getItem('token');
      ClientService.setAuthToken(token);
      const data = await ClientService.getClients();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      await ClientService.deleteClient(id, token);
      loadClients(); // Recargar la lista después de eliminar
    } catch (error) {
      console.error('Error al eliminar el cliente:', error);
      // Opcional: Añadir un mensaje de error para el usuario
    }
  };

  const filteredClients = clients.filter(client => {
    const nameMatch = client.nombreCompleto.toLowerCase().includes(searchName.toLowerCase());
    const idMatch = client.identificacion.includes(searchId);
    return nameMatch && idMatch;
  });

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h1">
          Consulta de clientes
        </Typography>
        <Box>
          <Button 
            startIcon={<AddIcon />} 
            variant="contained" 
            sx={{ mr: 1 }}
          >
            Agregar
          </Button>
          <Button 
            startIcon={<ArrowBackIcon />} 
            variant="outlined"
          >
            Regresar
          </Button>
        </Box>
      </Box>

      {/* Search Fields */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          label="Nombre"
          variant="outlined"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          sx={{ flex: 1 }}
        />
        <TextField
          label="Identificación"
          variant="outlined"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          sx={{ flex: 1 }}
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976d2' }}>
              <TableCell sx={{ color: 'white' }}>Identificación</TableCell>
              <TableCell sx={{ color: 'white' }}>Nombre completo</TableCell>
              <TableCell sx={{ color: 'white' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.identificacion}>
                <TableCell>{client.identificacion}</TableCell>
                <TableCell>{client.nombreCompleto}</TableCell>
                <TableCell>
                  <IconButton color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    color="error"
                    onClick={() => handleDelete(client.identificacion)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ClientList; 