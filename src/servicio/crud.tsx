import axios from 'axios';
import { Snackbar } from '@mui/material'; // Importar Snackbar

const API_URL = 'https://pruebareactjs.test-class.com/Api/api/Cliente/';

// Configurar la instancia de axios
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para establecer el token de autenticación
const setAuthToken = (token) => {
  if (token) {
    console.log('Estableciendo token de autenticación:', token);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    console.log('Eliminando token de autenticación');
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

// Función para mostrar mensajes de Snackbar
const showSnackbar = (message, severity) => {
  // Aquí se puede implementar la lógica para mostrar el Snackbar
  // Por ejemplo, usando un estado en un componente React
  console.log(`Mostrar Snackbar: ${message} - Severidad: ${severity}`);
};

// Función para buscar clientes
const searchClients = async (searchParams, token) => {
  setAuthToken(token);
  const userId = localStorage.getItem('userId');  
  console.log('userId:', userId); // Imprime esto en consola
  try {
    console.log('Buscando clientes con parámetros:', { ...searchParams, UsuarioId: userId });
    const response = await axiosInstance.post('Listado', { ...searchParams, usuarioId: userId });
    console.log('Clientes encontrados:', response);
    return response.data; // Devuelve la respuesta de la API
  } catch (error) {
    console.error('Error al buscar los clientes:', error);
    showSnackbar('Hubo un inconveniente con la transacción.', 'error');
    throw error;
  }
};

// Función para obtener un cliente por su ID
const getClientById = async (id, token) => {
  setAuthToken(token);
  try {
    console.log(`Obteniendo cliente con ID: ${id}`);
    const response = await axiosInstance.get(`Obtener/${id}`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el cliente:', error);
    showSnackbar('Hubo un inconveniente con la transacción.', 'error');
    throw error;
  }
};

// Función para crear un nuevo cliente
const createClient = async (clientData, token) => {
  setAuthToken(token);
  try {
    console.log('Creando nuevo cliente con datos:', clientData);
    const response = await axiosInstance.post('Crear', clientData, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'localhost:3000'
      }
    });
    console.log('Cliente creado:', response);
    showSnackbar('Cliente creado correctamente.', 'success');
    return response.data;
  } catch (error) {
    console.error('Error al crear el cliente:', error);
    showSnackbar('Hubo un inconveniente con la transacción.', 'error');
    throw error;
  }
};

// Función para actualizar un cliente
const updateClient = async (id, clientData, token) => {
  setAuthToken(token);
  try {
    console.log(`Actualizando cliente con ID: ${id} con datos:`, clientData);
    const response = await axiosInstance.put(`clientes/${id}`, clientData);
    console.log('Cliente actualizado:', response.data);
    showSnackbar('Cliente actualizado correctamente.', 'success');
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el cliente:', error);
    showSnackbar('Hubo un inconveniente con la transacción.', 'error');
    throw error;
  }
};

// Función para eliminar un cliente
const deleteClient = async (id: string, token: string | null) => {
  setAuthToken(token);
  try {
    console.log(`Eliminando cliente con ID: ${id}`);
    const response = await axiosInstance.delete(`Eliminar/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    console.log('Cliente eliminado:', response.data);
    showSnackbar('Cliente eliminado correctamente.', 'success');
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el cliente:', error);
    showSnackbar('Hubo un inconveniente con la transacción.', 'error');
    throw error;
  }
};

const getIntereses = async (token) => {
  setAuthToken(token);
  try {
    console.log('Obteniendo la lista de intereses');
    const response = await axiosInstance.get('https://pruebareactjs.test-class.com/Api/api/Intereses/Listado', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });
    console.log('Lista de intereses obtenida:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener la lista de intereses:', error);
    showSnackbar('Hubo un inconveniente con la transacción.', 'error');
    throw error;
  }
};

export const ClientService = {
  setAuthToken,
  searchClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  getIntereses,
};
