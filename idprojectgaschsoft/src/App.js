// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { ResizableBox } from 'react-resizable';

const App = () => {
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProyecto, setNuevoProyecto] = useState({
    nombreProyecto: '',
    descripcion: '',
  });

  // Función para formatear fecha en DD/MM/AAAA
  const formatearFecha = (fecha) => {
    if (!fecha) return 'Fecha no disponible';
    
    // Aseguramos que la fecha esté en formato UTC para evitar desfases
    const date = new Date(fecha);
    date.setHours(date.getHours() + date.getTimezoneOffset() / 60);
  
    if (!isNaN(date.getTime())) {
      const dia = ('0' + date.getDate()).slice(-2);
      const mes = ('0' + (date.getMonth() + 1)).slice(-2);
      const anio = date.getFullYear();
      return `${dia}/${mes}/${anio}`;
    }
    
    return 'Fecha no disponible';
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
  };

  // Función para mostrar el modal
  const abrirModal = () => {
    setMostrarModal(true);
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    setMostrarModal(false);
    setNuevoProyecto({ nombreProyecto: '', descripcion: '' });
  };

  // Función para manejar los cambios en el formulario del modal
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNuevoProyecto({ ...nuevoProyecto, [name]: value });
  };
  
  // Crear la fecha actual en formato YYYY-MM-DD, asegurando que no haya desfase de zona horaria
const obtenerFechaAjustada = (fecha) => {
  fecha.setHours(0, 0, 0, 0); // Establece la hora a medianoche para evitar problemas de zona horaria
  const year = fecha.getFullYear();
  const month = ('0' + (fecha.getMonth() + 1)).slice(-2);
  const day = ('0' + fecha.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
};

// Función para crear un nuevo proyecto
const crearProyecto = async () => {
  try {
    const fechaInicio = obtenerFechaAjustada(new Date()); // Fecha de inicio ajustada sin desfase
    const fechaFin = obtenerFechaAjustada(new Date(new Date().setDate(new Date().getDate() + 7))); // Fecha de fin 7 días después

    const nuevoProyectoDatos = {
      idUsuario: 'ASchaad', // Corregir en cuanto tengamos el login creado y la sesión guarde el usuario con el que se logueó
      nombreProyecto: nuevoProyecto.nombreProyecto,
      descripcion: nuevoProyecto.descripcion,
      fechaInicio,
      fechaFin,
      estado: 'PENDIENTE',
    };

    const response = await axios.post('http://localhost:3001/api/proyectos', nuevoProyectoDatos);
    if (response.status === 201) {
      // Actualizar la lista de proyectos obteniendo de nuevo todos los proyectos del backend
      const responseProyectos = await axios.get('http://localhost:3001/api/proyectos');
      setProyectos(responseProyectos.data);

      // Seleccionar el proyecto recién creado (usamos el último proyecto de la lista)
      const nuevoProyectoCreado = responseProyectos.data.find(
        (proyecto) => proyecto.nombreProyecto === nuevoProyectoDatos.nombreProyecto &&
                      proyecto.descripcion === nuevoProyectoDatos.descripcion
      );

      if (nuevoProyectoCreado) {
        setProyectoSeleccionado(nuevoProyectoCreado);

        // Espera breve para asegurarse de que el proyecto está renderizado, luego hacer scroll
        setTimeout(() => {
          const proyectoElement = document.getElementById(`proyecto-${nuevoProyectoCreado.idProyecto}`);
          if (proyectoElement) {
            proyectoElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }

      cerrarModal();
    }
  } catch (error) {
    console.error('Error al crear el proyecto:', error);
  }
};


  // Función para actualizar el proyecto en el backend mediante PUT
  const actualizarProyecto = async (campo, valor) => {
    if (proyectoSeleccionado) {
      let proyectoActualizado = { ...proyectoSeleccionado };

      if (campo === 'fechaFin') {
        const partes = valor.split('/');
        if (partes.length === 3) {
          const dia = partes[0];
          const mes = partes[1];
          const anio = partes[2];
          const fechaInvertida = `${mes}/${dia}/${anio}`; // Invertir día y mes
          proyectoActualizado[campo] = fechaInvertida;
        } else {
          alert('Por favor, ingresa una fecha válida en formato DD/MM/AAAA.');
          return;
        }
      } else {
        proyectoActualizado[campo] = valor;
      }

      try {
        await axios.put(
          `http://localhost:3001/api/proyectos/${proyectoSeleccionado.idProyecto}`,
          proyectoActualizado
        );
        setProyectoSeleccionado(proyectoActualizado);
        setProyectos(
          proyectos.map((proyecto) =>
            proyecto.idProyecto === proyectoActualizado.idProyecto
              ? proyectoActualizado
              : proyecto
          )
        );
      } catch (error) {
        console.error('Error al actualizar el proyecto:', error);
      }
    }
  };

  // Función para eliminar proyecto
  const eliminarProyecto = async () => {
    if (proyectoSeleccionado) {
      try {
        await axios.delete(
          `http://localhost:3001/api/proyectos/${proyectoSeleccionado.idProyecto}`
        );
        const nuevosProyectos = proyectos.filter(
          (proyecto) => proyecto.idProyecto !== proyectoSeleccionado.idProyecto
        );
        setProyectos(nuevosProyectos);

        // Seleccionar el proyecto anterior o siguiente
        if (nuevosProyectos.length > 0) {
          const index = proyectos.findIndex(
            (proyecto) => proyecto.idProyecto === proyectoSeleccionado.idProyecto
          );
          const nuevoSeleccionado = nuevosProyectos[index - 1] || nuevosProyectos[index];
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
  const proyectosFiltrados = proyectos.filter((proyecto) =>
    proyecto.nombreProyecto.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container">
      {/* Resizable Sidebar */}
      <ResizableBox
        className="resizable-sidebar"
        width={300}
        height={Infinity}
        axis="x"
        minConstraints={[200, Infinity]}
        maxConstraints={[600, Infinity]}
        resizeHandles={['e']}
        style={{ flexShrink: 0 }}
      >
        <section className="sidebar transparent-sidebar">
          <ul>
            <li className="sidebar-item">Todos los proyectos</li>
            <li className="sidebar-item">Programación 2</li>
            <li className="sidebar-item">Archivados</li>
            <li className="sidebar-item">Eliminados</li>
          </ul>
        </section>
      </ResizableBox>

      {/* Resizable Project List */}
      <ResizableBox
        className="resizable-project-list"
        width={300}
        height={Infinity}
        axis="x"
        minConstraints={[200, Infinity]}
        maxConstraints={[600, Infinity]}
        resizeHandles={['e']}
        style={{ flexShrink: 0 }}
      >
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
        key={proyecto.idProyecto} // Asegurarse de que cada proyecto tenga un `key` único
        id={`proyecto-${proyecto.idProyecto}`} // Para poder hacer scroll hacia este elemento
        className={
          proyectoSeleccionado &&
          proyectoSeleccionado.idProyecto === proyecto.idProyecto
            ? 'selected'
            : ''
        }
        onClick={() => seleccionarProyecto(proyecto)}
      >
        <h3>{proyecto.nombreProyecto}</h3>
        <p>{proyecto.descripcion.slice(0, 50)}...</p>
      </li>
    ))}
  </ul>
</div>

        </section>
      </ResizableBox>

      {/* Detalles del proyecto */}
      <section className="project-details">
        <header>
          <div className="header-left">
            <button
              className="delete-project"
              onClick={eliminarProyecto}
              disabled={!proyectoSeleccionado}
            >
              Eliminar
            </button>
            <button disabled={!proyectoSeleccionado}>Pruebas</button>
          </div>
          <button className="new-project" onClick={abrirModal}>+ Crear Proyecto</button>
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
              <p>
                <strong>Fecha de Inicio:</strong> {formatearFecha(proyectoSeleccionado.fechaInicio)}
              </p>
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
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="PENDIENTE">🔲 PENDIENTE</option>
                  <option value="IN PROGRESS">🟪 IN PROGRESS</option>
                  <option value="CANCELADO">🟩 CANCELADO</option>
                  <option value="FINALIZADO">✅ FINALIZADO</option>
                </select>
              </p>
            </>
          ) : (
            <p>No hay proyectos seleccionados. Crea uno nuevo para comenzar.</p>
          )}
        </div>
      </section>

      {/* Modal para crear un nuevo proyecto */}
      {mostrarModal && (
  <div className="modal-overlay">
    <div className="modal">
      <div className="modal-header">
        <h2>Crear Nuevo Proyecto</h2>
        <button className="close-button" onClick={cerrarModal}>
          &times;
        </button>
      </div>
      <div className="modal-body">
        <input
          type="text"
          name="nombreProyecto"
          placeholder="Nombre del Proyecto" // Añadir el placeholder
          value={nuevoProyecto.nombreProyecto}
          onChange={manejarCambio}
        />
        <textarea
          name="descripcion"
          placeholder="Descripción" // Añadir el placeholder
          value={nuevoProyecto.descripcion}
          onChange={manejarCambio}
        />
      </div>
      <div className="modal-footer">
        <button onClick={crearProyecto}>+ Crear</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default App;