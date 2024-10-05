import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProyectosList = () => {
    const [proyectos, setProyectos] = useState([]);

    useEffect(() => {
        // Función para obtener los proyectos desde el backend
        const obtenerProyectos = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/proyectos');
                setProyectos(response.data);
            } catch (error) {
                console.error('Error al obtener los proyectos:', error);
            }
        };

        obtenerProyectos();
    }, []);

    return (
        <div>
            <h1>Lista de Proyectos</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Descripción</th>
                        <th>Fecha de Inicio</th>
                        <th>Fecha de Fin</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {proyectos.map((proyecto) => (
                        <tr key={proyecto.idProyecto}>
                            <td>{proyecto.idProyecto}</td>
                            <td>{proyecto.nombreProyecto}</td>
                            <td>{proyecto.descripcion}</td>
                            <td>{proyecto.fechaInicio}</td>
                            <td>{proyecto.fechaFin}</td>
                            <td>{proyecto.estado}</td>
                            <td>
                                <button>Editar</button>
                                <button>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProyectosList;
