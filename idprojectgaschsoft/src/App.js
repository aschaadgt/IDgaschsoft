import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [proyectos, setProyectos] = useState([]);

  // Llamar a la API cuando el componente se monta
  useEffect(() => {
    axios.get('http://localhost:3000/api/proyectos')
      .then(response => {
        console.log("Datos recibidos de la API:", response.data); // Mostrar los datos en la consola del navegador
        setProyectos(response.data); // Actualiza el estado con los proyectos recibidos
      })
      .catch(error => {
        console.error('Error al obtener los proyectos:', error);
      });
  }, []);

  return (
    <div>
      <h1>Gestión de Proyectos</h1>
      <h2>Lista de Proyectos</h2>
      <ul>
        {proyectos.map((proyecto) => (
          <li key={proyecto.idProyecto}>
            <h3>{proyecto.nombreProyecto}</h3>
            <p><strong>Descripción:</strong> {proyecto.descripcion}</p>
            <p><strong>Estado:</strong> {proyecto.estado}</p>
            <p><strong>Fecha Inicio:</strong> {new Date(proyecto.fechaInicio).toLocaleDateString()}</p>
            <p><strong>Fecha Fin:</strong> {new Date(proyecto.fechaFin).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
