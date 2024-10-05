import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ResizableBox } from 'react-resizable';
import './App.css';
import 'react-resizable/css/styles.css';

const App = () => {
    const [proyectos, setProyectos] = useState([]);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState(""); // Estado para almacenar el término de búsqueda

    useEffect(() => {
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

    const seleccionarProyecto = (proyecto) => {
        setProyectoSeleccionado(proyecto);
    };

    // Función para eliminar proyecto
    const eliminarProyecto = async () => {
        if (proyectoSeleccionado) {
            try {
                await axios.delete(`http://localhost:3001/api/proyectos/${proyectoSeleccionado.idProyecto}`);
                setProyectos(proyectos.filter(proyecto => proyecto.idProyecto !== proyectoSeleccionado.idProyecto));
                setProyectoSeleccionado(null);
            } catch (error) {
                console.error('Error al eliminar el proyecto:', error);
            }
        }
    };

    // Filtrar proyectos según el término de búsqueda
    const proyectosFiltrados = proyectos.filter(proyecto =>
        proyecto.nombreProyecto.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="container">
            {/* Sección izquierda - Categorías de proyectos con ResizableBox */}
            <ResizableBox
                className="sidebar"
                width={250}
                height={Infinity}
                minConstraints={[200, Infinity]}
                maxConstraints={[350, Infinity]}
                axis="x"
                resizeHandles={['e']}
            >
                <ul>
                    <li className="sidebar-item">Todos los proyectos</li>
                    <li className="sidebar-item">Notas</li>
                    <li className="sidebar-item">Archivadas</li>
                    <li className="sidebar-item">Eliminadas hace poco</li>
                </ul>
            </ResizableBox>

            {/* Resizer entre la sección izquierda y la lista de proyectos */}
            <div className="resizer resizer-left"></div>

            {/* Sección central - Lista de proyectos */}
            <section className="project-list">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Buscar en todas los proyectos"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)} // Actualizamos el estado al escribir
                    />
                </div>
                <ul>
                    {proyectosFiltrados.map((proyecto) => (
                        <li
                            key={proyecto.idProyecto}
                            className={proyectoSeleccionado && proyectoSeleccionado.idProyecto === proyecto.idProyecto ? 'selected' : ''}
                            onClick={() => seleccionarProyecto(proyecto)}
                        >
                            <h3>{proyecto.nombreProyecto}</h3>
                            <p>{proyecto.descripcion.slice(0, 50)}...</p>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Resizer entre la lista de proyectos y el cuerpo del proyecto */}
            <div className="resizer resizer-between"></div>

            {/* Sección derecha - Detalles del proyecto */}
            <section className="project-details">
                {proyectoSeleccionado ? (
                    <>
                        <header>
                            <div className="header-left">
                                <button className="delete-project" onClick={eliminarProyecto}>Eliminar</button>
                                <button>Pruebas</button>
                            </div>
                            <button className="new-project">+ Nuevo Proyecto</button>
                        </header>
                        <div className="project-body">
                            <h1>{proyectoSeleccionado.nombreProyecto}</h1>
                            <p>{proyectoSeleccionado.descripcion}</p>
                            <p><strong>Fecha de Inicio:</strong> {proyectoSeleccionado.fechaInicio}</p>
                            <p><strong>Fecha de Fin:</strong> {proyectoSeleccionado.fechaFin}</p>
                            <p><strong>Estado:</strong> {proyectoSeleccionado.estado}</p>
                        </div>
                    </>
                ) : (
                    <div className="empty-state">
                        <p>Seleccione un proyecto para ver los detalles</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default App;
