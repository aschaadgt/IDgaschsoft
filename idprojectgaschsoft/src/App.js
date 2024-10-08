import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import 'react-resizable/css/styles.css';

const App = () => {
    const [proyectos, setProyectos] = useState([]);
    const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState(""); // Estado para almacenar el término de búsqueda

    // Función para formatear fecha en DD/MM/AAAA
    const formatearFecha = (fecha) => {
        if (!fecha) return "Fecha no disponible"; // Manejo de fechas nulas
        const date = new Date(fecha);
        if (!isNaN(date.getTime())) {
            const dia = ("0" + date.getDate()).slice(-2);
            const mes = ("0" + (date.getMonth() + 1)).slice(-2);
            const anio = date.getFullYear();
            return `${dia}/${mes}/${anio}`;
        }
        return "Fecha no disponible"; // Manejo de fechas inválidas
    };

    useEffect(() => {
        const obtenerProyectos = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/proyectos');
                setProyectos(response.data);

                // Seleccionar automáticamente el primer proyecto si existe
                if (response.data.length > 0) {
                    setProyectoSeleccionado(response.data[0]);
                }
            } catch (error) {
                console.error('Error al obtener los proyectos:', error);
            }
        };

        obtenerProyectos();
    }, []);

    const seleccionarProyecto = (proyecto) => {
        setProyectoSeleccionado(proyecto);
        console.log("Fecha de inicio seleccionada:", proyecto.fechaInicio);
        console.log("Fecha de fin seleccionada:", proyecto.fechaFin); // Agregamos un log para fechaFin
    };

    // Función para actualizar el proyecto en el backend mediante PUT
    const actualizarProyecto = async (campo, valor) => {
        if (proyectoSeleccionado) {
            const proyectoActualizado = { ...proyectoSeleccionado, [campo]: valor };

            try {
                await axios.put(`http://localhost:3001/api/proyectos/${proyectoSeleccionado.idProyecto}`, proyectoActualizado);
                setProyectoSeleccionado(proyectoActualizado);
                setProyectos(proyectos.map(proyecto =>
                    proyecto.idProyecto === proyectoActualizado.idProyecto ? proyectoActualizado : proyecto
                ));
            } catch (error) {
                console.error('Error al actualizar el proyecto:', error);
            }
        }
    };

    // Función para eliminar proyecto
    const eliminarProyecto = async () => {
        if (proyectoSeleccionado) {
            try {
                await axios.delete(`http://localhost:3001/api/proyectos/${proyectoSeleccionado.idProyecto}`);
                const nuevosProyectos = proyectos.filter(proyecto => proyecto.idProyecto !== proyectoSeleccionado.idProyecto);
                setProyectos(nuevosProyectos);

                // Seleccionar el proyecto siguiente o anterior
                if (nuevosProyectos.length > 0) {
                    const index = proyectos.findIndex(proyecto => proyecto.idProyecto === proyectoSeleccionado.idProyecto);
                    const nuevoSeleccionado = nuevosProyectos[index] || nuevosProyectos[index - 1];
                    setProyectoSeleccionado(nuevoSeleccionado);
                } else {
                    setProyectoSeleccionado(null);
                }
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
            {/* Sección izquierda - Categorías de proyectos */}
            <section className="sidebar">
                <ul>
                    <li className="sidebar-item">Todos los proyectos</li>
                    <li className="sidebar-item">Notas</li>
                    <li className="sidebar-item">Archivadas</li>
                    <li className="sidebar-item">Eliminadas hace poco</li>
                </ul>
            </section>

            {/* Lista de proyectos */}
            <section className="project-list">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Buscar en todos los proyectos"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
                <div className="project-items">
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
                </div>
            </section>

            {/* Detalles del proyecto */}
            <section className="project-details">
                <header>
                    <div className="header-left">
                        <button className="delete-project" onClick={eliminarProyecto} disabled={!proyectoSeleccionado}>Eliminar</button>
                        <button disabled={!proyectoSeleccionado}>Pruebas</button>
                    </div>
                    <button className="new-project">+ Nuevo Proyecto</button>
                </header>
                <div className="project-body">
                    {proyectoSeleccionado ? (
                        <>
                            <h1
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => actualizarProyecto('nombreProyecto', e.target.innerText)}
                                style={{ border: 'none', outline: 'none' }}
                            >
                                {proyectoSeleccionado.nombreProyecto}
                            </h1>
                            <p
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => actualizarProyecto('descripcion', e.target.innerText)}
                                style={{ border: 'none', outline: 'none' }}
                            >
                                {proyectoSeleccionado.descripcion}
                            </p>
                            <p><strong>Fecha de Inicio:</strong> {formatearFecha(proyectoSeleccionado.fechaInicio)}</p>
                            <p>
                                <strong>Fecha de Fin: </strong>
                                <span
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => actualizarProyecto('fechaFin', e.target.innerText)}
                                    style={{ border: 'none', outline: 'none', display: 'inline' }}
                                >
                                    {formatearFecha(proyectoSeleccionado.fechaFin)}
                                </span>
                            </p>
                            <p>
                                <strong>Estado: </strong>
                                <select
                                    value={proyectoSeleccionado.estado}
                                    onChange={(e) => actualizarProyecto('estado', e.target.value)}
                                    style={{ border: 'none', outline: 'none', background: 'none', cursor: 'pointer' }}
                                >
                                    <option value="PENDIENTE">PENDIENTE</option>
                                    <option value="IN PROGRESS">IN PROGRESS</option>
                                    <option value="CANCELADO">CANCELADO</option>
                                    <option value="FINALIZADO">FINALIZADO</option>
                                </select>
                            </p>
                        </>
                    ) : (
                        <p>No hay proyectos seleccionados. Crea uno nuevo para comenzar.</p>
                    )}
                </div>
            </section>
        </div>
    );
};

export default App;
/** */