import React from 'react';

const NotFound = () => {
  return (
    <div style={styles.container}>
      <div style={styles.iconContainer}>
        <span style={styles.icon}>⚠️</span>
        <span style={styles.errorCode}>404</span>
      </div>
      <h2 style={styles.message}>Oops... Page Not Found</h2>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    textAlign: 'center',
  },
  iconContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
  },
  icon: {
    fontSize: '180px',
    color: '#007BFF', // Azul para el icono
    marginRight: '10px',
  },
  errorCode: {
    fontSize: '240px',
    color: '#007BFF', // Azul para el código 404
  },
  message: {
    fontSize: '90px',
    color: '#888', // Gris para el mensaje
  },
};

export default NotFound;
