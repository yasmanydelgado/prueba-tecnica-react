import axios from 'axios'; // Corregir el import de axios
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import { Snackbar } from '@mui/material'; // Importar Snackbar
import React, { useState } from 'react'; // Importar React y useState

const API_URL = 'https://pruebareactjs.test-class.com/Api/api/'; // La URL de la API es correcta

// Crear una instancia de axios con los headers comunes
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función para iniciar sesión
export const login = async (username, password, navigate) => {
  try {
    console.log('Iniciando sesión con:', { username, password });
    const response = await axiosInstance.post('Authenticate/login', { username, password });
    console.log('Respuesta de inicio de sesión:', response.data);
    if (response.data.token) {
      // Guarda el token, el username y el userId en el localStorage
      console.log('Guardando token en localStorage:', response.data.token);
      localStorage.setItem('token', response.data.token);
      console.log(response.data.userid); // Cambiado a userid
      localStorage.setItem('userId', response.data.userid); // Cambiado a userid
      navigate('/home'); // Navegar al home después de un inicio de sesión exitoso
      return response.data;
    }
  } catch (error) {
    console.error('Error de inicio de sesión:', error.response);
    throw new Error(error.response?.data?.message || 'Error en el inicio de sesión');
  }
};

// Función para registrar un nuevo usuario
export const register = async (username, email, password) => {
  try {
    console.log('Registrando nuevo usuario con:', { username, email, password });
    const response = await axiosInstance.post('Authenticate/register', { username, email, password });
    console.log('Respuesta de registro:', response.data);
    if (response.data.token) {
      // Guarda el token en el localStorage
      console.log('Guardando token en localStorage:', response.data.token);
      localStorage.setItem('token', response.data.token);
      return response.data;
    }
  } catch (error) {
    console.error('Error de registro:', error.response);
    throw new Error(error.response?.data?.message || 'Error en el registro');
  }
};

// Función para obtener el token de autenticación
export const getAuthToken = () => {
  const token = localStorage.getItem('token');
  console.log('Token obtenido de localStorage:', token);
  return token;
};

// Función para obtener la información del usuario autenticado
export const getUserInfo = async () => {
  try {
    console.log('Obteniendo información del usuario autenticado');
    const token = getAuthToken();
    if (!token) {
      throw new Error('No está autenticado');
    }

    const response = await axiosInstance.get('/user-info', {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('Información del usuario obtenida:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener la información del usuario:', error.response);
    throw new Error(error.response?.data?.message || 'Error al obtener la información');
  }
};
