import React, { useEffect, useState } from 'react';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);

    // Obtener los proyectos desde la API
    useEffect(() => {
        fetch('http://localhost:3000/api/proyectos') // Conexión al backend
            .then(response => response.json())
            .then(data => setProjects(data))
            .catch(error => console.error('Error al obtener los proyectos:', error));
    }, []);

    return (
        <div>
            <h1>Lista de Proyectos</h1>
            <ul>
                {projects.map((project) => (
                    <li key={project.idProyecto}>
                        <strong>{project.nombreProyecto}</strong>: {project.descripcion} - Estado: {project.estado}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProjectList;
