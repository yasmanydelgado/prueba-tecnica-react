import React from 'react';

const Home = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.welcomeMessage}>Bienvenido</h1>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80vh', // Centra el contenido en la pantalla
    textAlign: 'center',
  },
  welcomeMessage: {
    fontSize: '100px', // Tamaño grande para el mensaje
    fontWeight: 'bold', // Negrita para mayor énfasis
  },
};

export default Home;
