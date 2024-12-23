import React, { useState, useEffect } from 'react';
import { Avatar, Button, Grid, Box, TextField, MenuItem, Select, InputLabel, FormControl, Typography, Snackbar, Alert } from '@mui/material';
import BasicDateTimePicker from './time_picker.tsx';
import { ClientService } from '../servicio/crud.tsx';
import { useNavigate, useParams } from 'react-router-dom';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person'; // Importar el icono de persona
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs'; // Importar dayjs

const MantenimientoClientesForm = () => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    identificacion: '', // Cambiado de id a identificacion
    nombre: '',
    apellidos: '',
    sexo: '',
    fNacimiento: null, // Cambiado a null
    fAfiliacion: null, // Cambiado a null
    celular: '', // Cambiado de telefono a celular
    otroTelefono: '', // Cambiado de telefonoOtro a otroTelefono
    interesFK: '', // Cambiado de interesesFK a interesFK
    direccion: '',
    resennaPersonal: '', // Cambiado de resena a resennaPersonal
    imagen: '',
  });
  const [intereses, setIntereses] = useState([]);
  const [imagenBase64, setImagenBase64] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchIntereses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No está autenticado');
        const interesesData = await ClientService.getIntereses(token);
        setIntereses(interesesData);
      } catch (error) {
        console.error('Error al obtener los intereses:', error);
        setSnackbarMessage('Error al obtener los intereses');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      }
    };

    const fetchClientData = async () => {
      if (id) {
        setIsEditMode(true);
        try {
          const token = localStorage.getItem('token');
          if (!token) throw new Error('No está autenticado');
          const clientData = await ClientService.getClientById(id, token);
          setFormData(clientData);
          setImagenBase64(clientData.imagen);
        } catch (error) {
          console.error('Error al obtener los datos del cliente:', error);
          setSnackbarMessage('Error al obtener los datos del cliente');
          setSnackbarSeverity('error');
          setSnackbarOpen(true);
        }
      }
    };

    fetchIntereses();
    fetchClientData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDateChange = (name, value) => {
    console.log(`Fecha seleccionada para ${name}:`, value);
    setFormData((prevState) => ({
      ...prevState,
      [name]: value ? value.toISOString() : null, // Convertir a ISO o null
    }));
  };

  const handleInterestsChange = (e) => {
    const { value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      interesFK: value, // Cambiado para manejar un solo interés
    }));
    console.log('Interés seleccionado:', value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagenBase64(reader.result);
      setFormData((prevState) => ({
        ...prevState,
        imagen: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No está autenticado');

      // Validación de campos obligatorios
      if (!formData.identificacion || !formData.nombre || !formData.apellidos || !formData.sexo || !formData.celular || !formData.interesFK || !formData.direccion || !formData.resennaPersonal) {
        console.log(formData);
        setSnackbarMessage('Asegúrese de llenar los campos requeridos');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
        return;
      }

      const requestData = {
        ...formData,
        usuarioId: localStorage.getItem('userId'),
      };

      if (isEditMode) {
        await ClientService.updateClient(formData.identificacion, requestData, token); // Cambiado de id a identificacion
        setSnackbarMessage('Cliente actualizado exitosamente');
      } else {
        await ClientService.createClient(requestData, token);
        setSnackbarMessage('Cliente creado exitosamente');
      }
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      navigate('/consulta-clientes');
    } catch (error) {
      console.error('Error al guardar el cliente:', error);
      setSnackbarMessage('Error al guardar el cliente');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleBack = () => {
    navigate('/consulta-clientes');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ padding: 2, boxShadow: 3, borderRadius: 2, marginLeft: '10%', marginRight: '5%' }}>
      <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item>
          <Avatar sx={{ bgcolor: 'primary.main' }}>
            <PersonIcon />
          </Avatar>
        </Grid>

        <Grid item sx={{ display: 'flex'}}>
          <Typography variant="h6" sx={{ marginRight: 10 }}>
            {isEditMode ? 'Actualizar Cliente' : 'Crear Nuevo Cliente'}
          </Typography>
        </Grid>
       
        <Grid item sx={{ display: 'flex', justifyContent: 'flex-end', marginLeft: 'auto' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmit} 
            startIcon={<SaveIcon />}
          >
            {isEditMode ? 'Actualizar' : 'Guardar'}
          </Button>
          <Button 
            variant="outlined" 
            color="secondary" 
            onClick={handleBack} 
            startIcon={<ArrowBackIcon />} 
            sx={{ marginLeft: 1 }}
          >
            Volver
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Identificación *"
            name="identificacion" // Cambiado de id a identificacion
            value={formData.identificacion} // Cambiado de id a identificacion
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Nombre *"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Apellidos *"
            name="apellidos"
            value={formData.apellidos}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Sexo *</InputLabel>
            <Select
              name="sexo"
              value={formData.sexo}
              onChange={handleChange}
            >
              <MenuItem value="M">Masculino</MenuItem>
              <MenuItem value="F">Femenino</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Fecha de Nacimiento *"
            placeholder="Seleccione la fecha de nacimiento"
            value={formData.fNacimiento ? dayjs(formData.fNacimiento) : null} // Cambiado a fNacimiento
            onChange={(value) => handleDateChange('fNacimiento', value)} // Cambiado a fNacimiento
        />
        </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={4}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Fecha de Afiliación *"
            placeholder="Seleccione la fecha de afiliación"
            value={formData.fAfiliacion ? dayjs(formData.fAfiliacion) : null} // Cambiado a fAfiliacion
            onChange={(value) => handleDateChange('fAfiliacion', value)} // Cambiado a fAfiliacion
          />
        </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Celular *" // Cambiado de Teléfono a Celular
            name="celular" // Cambiado de telefono a celular
            value={formData.celular} // Cambiado de telefono a celular
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Otro Teléfono" // Cambiado de Teléfono Otro a Otro Teléfono
            name="otroTelefono" // Cambiado de telefonoOtro a otroTelefono
            value={formData.otroTelefono} // Cambiado de telefonoOtro a otroTelefono
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Intereses *</InputLabel>
            <Select
              name="interesFK" // Cambiado de interesesFK a interesFK
              value={formData.interesFK} // Cambiado de interesesFK a interesFK
              onChange={handleInterestsChange}
            >
              {intereses.map((interes) => (
                <MenuItem key={interes.id} value={interes.id}>
                  {interes.descripcion}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Reseña Personal *" // Cambiado de Reseña a Reseña Personal
            name="resennaPersonal" // Cambiado de resena a resennaPersonal
            value={formData.resennaPersonal} // Cambiado de resena a resennaPersonal
            onChange={handleChange}
            multiline
            rows={4}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Dirección *"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            component="label"
          >
            Subir Imagen
            <input
              type="file"
              hidden
              onChange={handleImageChange}
            />
          </Button>
          {imagenBase64 && (
            <img src={imagenBase64} alt="Imagen del cliente" style={{ marginTop: '10px', maxHeight: '200px' }} />
          )}
        </Grid>
      </Grid>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MantenimientoClientesForm;
