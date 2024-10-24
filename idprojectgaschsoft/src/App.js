// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { ResizableBox } from 'react-resizable';
import AceEditor from 'react-ace'; // Para incluir el editor de código dentro de la sección de detalles del proyecto.

// Importar los lenguajes que vamos a usar en el editor de código
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/mode-python';
import 'ace-builds/src-noconflict/mode-java';
import 'ace-builds/src-noconflict/mode-c_cpp';
import 'ace-builds/src-noconflict/mode-php';
import 'ace-builds/src-noconflict/mode-csharp';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/mode-sql';
import 'ace-builds/src-noconflict/mode-ruby';

// Importar los temas del editor
import 'ace-builds/src-noconflict/theme-monokai';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/theme-dracula';
import 'ace-builds/src-noconflict/theme-solarized_light';
import 'ace-builds/src-noconflict/theme-tomorrow_night';

import ace from 'ace-builds/src-noconflict/ace';
import { parse, format } from 'date-fns';


// Configura la ruta base para los archivos de ace-builds
ace.config.set('basePath', '/ace');

const App = () => {
  const [proyectos, setProyectos] = useState([]);
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  //const [archivoCodigo, setArchivoCodigo] = useState('');
  const [contenidoCodigo, setContenidoCodigo] = useState('');
  const [lenguaje, setLenguaje] = useState('javascript');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoProyecto, setNuevoProyecto] = useState({
    nombreProyecto: '',
    descripcion: '',
  });

  // Estados locales para los campos editables
  const lenguajes = ['javascript', 'python', 'java', 'c_cpp', 'php', 'csharp', 'html', 'sql', 'ruby']; // lista de lenguajes
  const nombresLenguajes = ['J.Script', 'Python', 'Java', 'C++', 'PHP', 'C#', 'HTML', 'SQL', 'Ruby']; // nombres visibles de los lenguajes

  // Estados para confirmacion de eliminacion de proyecto.
  const [mostrarModalConfirmacion, setMostrarModalConfirmacion] = useState(false);
  const [proyectoAEliminar, setProyectoAEliminar] = useState(null);

  // Estados para los resultados de las pruebas
  const [resultadosPrueba, setResultadosPrueba] = useState([]); // Inicializamos como un array vacío
  const [mostrarModalPrueba, setMostrarModalPrueba] = useState(false); // Estado para mostrar/ocultar el modal de resultados
  
  const [pestañaActiva, setPestañaActiva] = useState('Pruebas'); // 'Pruebas' o 'Dashboard'

  // Nuevos estados para manejar pruebas y defectos
  const [listaPruebas, setListaPruebas] = useState([]);
  const [pruebaSeleccionada, setPruebaSeleccionada] = useState(null);
  const [resultadosDefectos, setResultadosDefectos] = useState([]);
  const [listaUsuarios, setListaUsuarios] = useState([]);

 //Funcion para actualizar estado de prueba
 const actualizarPrueba = async (campo, valor) => {
  if (pruebaSeleccionada) {
    try {
      await axios.put(
        `http://localhost:3001/api/pruebas/${pruebaSeleccionada.idPrueba}`,
        {
          [campo]: valor,
        }
      );

      // Actualizar el estado local
      setPruebaSeleccionada({
        ...pruebaSeleccionada,
        [campo]: valor,
      });
      setListaPruebas(
        listaPruebas.map((prueba) =>
          prueba.idPrueba === pruebaSeleccionada.idPrueba
            ? { ...prueba, [campo]: valor }
            : prueba
        )
      );
    } catch (error) {
      console.error('Error al actualizar la prueba:', error);
    }
  }
};

// Función para convertir "DD/MM/YYYY" a "YYYY-MM-DD"
const convertirFecha = (fecha) => {
  const fechaParseada = parse(fecha, 'dd/MM/yyyy', new Date());
  return format(fechaParseada, 'yyyy-MM-dd');
};

  // Función para formatear fecha en DD/MM/AAAA
  const formatearFecha = (fecha) => {
    if (!fecha) return 'Fecha no disponible';
    
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

  // Cargar proyectos al inicio
  useEffect(() => {
    const obtenerProyectos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/proyectos');
        setProyectos(response.data);
        if (response.data.length > 0) {
          seleccionarProyecto(response.data[0]); // Seleccionar el primer proyecto automáticamente
        }
      } catch (error) {
        console.error('Error al obtener los proyectos:', error);
      }
    };

    obtenerProyectos();
  }, []);

  // Guardar el código automáticamente después de 0.5 segundos de inactividad
  useEffect(() => {
    if (proyectoSeleccionado) {
      const timer = setTimeout(async () => {
        try {
          await axios.put(`http://localhost:3001/api/proyectos/${proyectoSeleccionado.idProyecto}/codigo`, {
            contenido: contenidoCodigo
          });
          console.log('Código guardado automáticamente');
        } catch (error) {
          console.error('Error al guardar el código:', error);
        }
      }, 500); //500 milisengundos

      return () => clearTimeout(timer); // Cancela el temporizador si el usuario sigue escribiendo
    }
  }, [contenidoCodigo, proyectoSeleccionado]);

  // Manejar teclas de navegación
useEffect(() => {
  const manejarTeclas = (e) => {
    if (proyectos.length === 0) return;

    const indexSeleccionado = proyectos.findIndex(
      (proyecto) => proyecto.idProyecto === proyectoSeleccionado?.idProyecto
    );

    if (e.key === 'ArrowUp' && indexSeleccionado > 0) {
      const nuevoSeleccionado = proyectos[indexSeleccionado - 1];
      
      // Asegura cargar el código del proyecto seleccionado correctamente
      seleccionarProyecto(nuevoSeleccionado);

      // Asegura que el proyecto esté visible en el Scrollbar
      const elemento = document.getElementById(`proyecto-${nuevoSeleccionado.idProyecto}`);
      if (elemento) {
        // Usamos "block: 'center'" para que el proyecto se mantenga centrado en la vista
        elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else if (e.key === 'ArrowDown' && indexSeleccionado < proyectos.length - 1) {
      const nuevoSeleccionado = proyectos[indexSeleccionado + 1];
      
      // Asegura cargar el código del proyecto seleccionado correctamente
      seleccionarProyecto(nuevoSeleccionado);
      
      // Asegura que el proyecto esté visible en el Scrollbar
      const elemento = document.getElementById(`proyecto-${nuevoSeleccionado.idProyecto}`);
      if (elemento) {
        // Usamos "block: 'center'" para que el proyecto se mantenga centrado en la vista
        elemento.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  window.addEventListener('keydown', manejarTeclas);
  return () => {
    window.removeEventListener('keydown', manejarTeclas);
  };
}, [proyectos, proyectoSeleccionado]);

// Función para seleccionar un proyecto y cargar su código
const seleccionarProyecto = async (proyecto) => {
  setProyectoSeleccionado(proyecto);
  try {
    const response = await axios.get(`http://localhost:3001/api/proyectos/${proyecto.idProyecto}/codigo`);
    setContenidoCodigo(response.data.contenido);
    setLenguaje(proyecto.lenguaje || 'javascript'); // Actualiza el lenguaje al cargar un proyecto

    // Cargar las pruebas asociadas al proyecto
    const responsePruebas = await axios.get(`http://localhost:3001/api/proyectos/${proyecto.idProyecto}/pruebas`);
    setListaPruebas(responsePruebas.data);

    // Seleccionar la prueba más reciente si existe
    if (responsePruebas.data.length > 0) {
      seleccionarPrueba(responsePruebas.data[responsePruebas.data.length - 1]);
    } else {
      setPruebaSeleccionada(null);
      setResultadosDefectos([]);
    }

    // Cargar la lista de usuarios para el dropdown de asignación
    const responseUsuarios = await axios.get('http://localhost:3001/api/usuarios');
    setListaUsuarios(responseUsuarios.data);

  } catch (error) {
    console.error('Error al cargar los datos del proyecto:', error);
  }
};

// Función para seleccionar una prueba y cargar sus defectos
const seleccionarPrueba = async (prueba) => {
  let fechaEjecucionISO = null;
  if (prueba.fechaEjecucion) {
    fechaEjecucionISO = convertirFecha(prueba.fechaEjecucion);
  }

  const pruebaConFechaISO = { ...prueba, fechaEjecucion: fechaEjecucionISO };

  setPruebaSeleccionada(pruebaConFechaISO);
  console.log('Prueba Seleccionada:', pruebaConFechaISO);
  
  try {
    const responseDefectos = await axios.get(`http://localhost:3001/api/pruebas/${prueba.idPrueba}/defectos`);
    setResultadosDefectos(responseDefectos.data);
  } catch (error) {
    console.error('Error al cargar los defectos de la prueba:', error);
  }
};

//Función para ejecutar el análisis de código
const ejecutarNuevaPrueba = async () => {
  console.log("Ejecutando nueva prueba");
  try {
    // Ejecutar el análisis de código
    const response = await axios.post(
      `http://localhost:3001/api/proyectos/${proyectoSeleccionado.idProyecto}/analisis`,
      {
        contenidoCodigo: contenidoCodigo, // Código que vamos a analizar
      }
    );

    const resultadosAnalisis = response.data.resultados || [];

    // Crear una nueva prueba en la base de datos
    const nuevaPrueba = {
      nombrePrueba: `Prueba ${listaPruebas.length + 1} ${proyectoSeleccionado.idProyecto}`,
      descripcion: `Prueba del proyecto ${proyectoSeleccionado.idProyecto}`,
      fechaEjecucion: new Date(),
      resultado: 'CREADA',
    };

    const responsePrueba = await axios.post(
      `http://localhost:3001/api/proyectos/${proyectoSeleccionado.idProyecto}/pruebas`,
      nuevaPrueba
    );

    // Obtener el ID de la prueba creada
    const idPruebaCreada = responsePrueba.data.idPrueba;

    // Guardar los defectos encontrados en la base de datos
    for (const defecto of resultadosAnalisis) {
      const nuevoDefecto = {
        idPrueba: idPruebaCreada,
        descripcion: defecto.descripcion,
        prioridad: defecto.tipo,
        estado: 'NUEVO',
        fechaCreacion: new Date(),
        fechaResolucion: null,
        asignado: null,
      };
      await axios.post(`http://localhost:3001/api/defectos`, nuevoDefecto);
    }

    // Recargar las pruebas y seleccionar la nueva
    const responsePruebas = await axios.get(`http://localhost:3001/api/proyectos/${proyectoSeleccionado.idProyecto}/pruebas`);
    setListaPruebas(responsePruebas.data);

    // Seleccionar la nueva prueba creada
    const nuevaPruebaCreada = responsePruebas.data.find(prueba => prueba.idPrueba === idPruebaCreada);
    if (nuevaPruebaCreada) {
      seleccionarPrueba(nuevaPruebaCreada);
    }

  } catch (error) {
    console.error('Error al ejecutar la prueba:', error);
  }
  };

  // Función para actualizar un defecto específico
  const actualizarDefecto = async (idDefecto, campo, valor) => {
  try {
    // Crear una copia del defecto a actualizar
    const defectoActualizado = resultadosDefectos.find((d) => d.idDefecto === idDefecto);
    defectoActualizado[campo] = valor;

    // Actualizar el defecto en la base de datos
    await axios.put(`http://localhost:3001/api/defectos/${idDefecto}`, defectoActualizado);

    // Actualizar el estado local
    setResultadosDefectos(
      resultadosDefectos.map((d) => (d.idDefecto === idDefecto ? defectoActualizado : d))
    );
  } catch (error) {
    console.error('Error al actualizar el defecto:', error);
  }
  };


  // Abrir el modal para crear un nuevo proyecto
  const abrirModal = () => {
    setMostrarModal(true);
  };

  // Cerrar el modal
  const cerrarModal = () => {
    setMostrarModal(false);
    setNuevoProyecto({ nombreProyecto: '', descripcion: '' });
  };

  // Manejar los cambios en el formulario del modal
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNuevoProyecto({ ...nuevoProyecto, [name]: value });
  };

  // Obtener la fecha actual ajustada
  const obtenerFechaAjustada = (fecha) => {
    fecha.setHours(0, 0, 0, 0); 
    const year = fecha.getFullYear();
    const month = ('0' + (fecha.getMonth() + 1)).slice(-2);
    const day = ('0' + fecha.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  };

  // Crear un nuevo proyecto
  const crearProyecto = async () => {
    try {
      const fechaInicio = obtenerFechaAjustada(new Date());
      const fechaFin = obtenerFechaAjustada(new Date(new Date().setDate(new Date().getDate() + 7)));
      const nuevoProyectoDatos = {
        idUsuario: 'ASchaad',
        nombreProyecto: nuevoProyecto.nombreProyecto,
        descripcion: nuevoProyecto.descripcion,
        fechaInicio,
        fechaFin,
        estado: 'PENDIENTE',
        lenguaje: 'javascript',
      };

      const response = await axios.post('http://localhost:3001/api/proyectos', nuevoProyectoDatos);
      if (response.status === 201) {
        const responseProyectos = await axios.get('http://localhost:3001/api/proyectos');
        setProyectos(responseProyectos.data);

        // Seleccionar automáticamente el nuevo proyecto creado
        const nuevoProyectoCreado = responseProyectos.data.find(
          (proyecto) => proyecto.nombreProyecto === nuevoProyectoDatos.nombreProyecto &&
                        proyecto.descripcion === nuevoProyectoDatos.descripcion
        );

        if (nuevoProyectoCreado) {
          seleccionarProyecto(nuevoProyectoCreado); // Seleccionar el nuevo proyecto automáticamente
        }

        cerrarModal();
      }
    } catch (error) {
      console.error('Error al crear el proyecto:', error);
    }
  };
  // Actualizar un proyecto
  const actualizarProyecto = async (campo, valor) => {
    if (proyectoSeleccionado) {
      let proyectoActualizado = { ...proyectoSeleccionado };
      
      // Validación especial para la fecha de fin
      if (campo === 'fechaFin') {
        const partes = valor.split('/');
        if (partes.length === 3) {
          const dia = partes[0];
          const mes = partes[1];
          const anio = partes[2];
          proyectoActualizado[campo] = `${mes}/${dia}/${anio}`;
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
  

  // Eliminar un proyecto
const eliminarProyecto = async () => {
  if (proyectoSeleccionado) {
    try {
      await axios.delete(
        `http://localhost:3001/api/proyectos/${proyectoSeleccionado.idProyecto}`
      );
      const nuevosProyectos = proyectos.filter(
        (proyecto) => proyecto.idProyecto !== proyectoSeleccionado.idProyecto
      );
      
      if (nuevosProyectos.length > 0) {
        // Encuentra la posición del proyecto eliminado
        const indexSeleccionado = proyectos.findIndex(
          (proyecto) => proyecto.idProyecto === proyectoSeleccionado.idProyecto
        );
        
        // Selecciona el proyecto anterior, si existe. Si no, selecciona el siguiente.
        const nuevoSeleccionado = nuevosProyectos[indexSeleccionado - 1] || nuevosProyectos[0];
        setProyectoSeleccionado(nuevoSeleccionado);
        
        // Carga el código del nuevo proyecto seleccionado
        seleccionarProyecto(nuevoSeleccionado);
      } else {
        // Si no quedan proyectos, limpiamos la selección
        setProyectoSeleccionado(null);
        setContenidoCodigo('');
      }
      
      setProyectos(nuevosProyectos);
    } catch (error) {
      console.error('Error al eliminar el proyecto:', error);
    }
  }
};

  // Funcion de confirmacion de eliminacion
  const confirmarEliminacionProyecto = async () => {
    try {
      await eliminarProyecto(); // Utiliza tu función de eliminar existente
      setMostrarModalConfirmacion(false); // Cierra el modal
    } catch (error) {
      console.error('Error al eliminar el proyecto:', error);
    }
  };
  

  // Guardar el código automáticamente
  const guardarCodigoAutomáticamente = async (nuevoCodigo) => {
    setContenidoCodigo(nuevoCodigo);
    try {
      await axios.put(`http://localhost:3001/api/proyectos/${proyectoSeleccionado.idProyecto}/codigo`, {
        codigo: nuevoCodigo,
      });
    } catch (error) {
      console.error('Error al guardar el código:', error);
    }
  };

  // Filtrar proyectos según el término de búsqueda
  const proyectosFiltrados = proyectos.filter((proyecto) =>
    proyecto.nombreProyecto.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="container">
      <ResizableBox
        className="resizable-sidebar"
        width={250} //Espacio izquierda entre borde izquierdo y limite de carpeta de proyectos
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
            <li className="sidebar-item">Otros</li>
            <li className="sidebar-item">Archivados</li>
            <li className="sidebar-item">Eliminados</li>
          </ul>
        </section>
      </ResizableBox>

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
                  id={`proyecto-${proyecto.idProyecto}`}
                  className={proyectoSeleccionado?.idProyecto === proyecto.idProyecto ? 'selected' : ''}
                  onClick={() => seleccionarProyecto(proyecto)}
                >
                  <h3>{proyecto.nombreProyecto}</h3>
                  <p>{proyecto.descripcion.slice(0, 50)}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </ResizableBox>

      <section className="project-details">
        <header>
          <div className="header-left">
          <button
  className="delete-project"
  onClick={() => {
    setProyectoAEliminar(proyectoSeleccionado);
    setMostrarModalConfirmacion(true);
  }}
  disabled={!proyectoSeleccionado}
>
  Eliminar
</button>
<button
  onClick={() => setMostrarModalPrueba(true)}
  disabled={!proyectoSeleccionado}
>
  Pruebas
</button>

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
                  {/* Barra de lenguajes */}
<div className="tabs">
  {nombresLenguajes.map((nombre, index) => (
    <label key={index} className={`tab ${lenguaje === lenguajes[index] ? 'selected' : ''}`}>
      <input
        type="radio"
        name="tabs"
        checked={lenguaje === lenguajes[index]}
        onChange={() => {
          setLenguaje(lenguajes[index]); // Cambia el lenguaje en la UI
          actualizarProyecto('lenguaje', lenguajes[index]); // Actualiza el lenguaje en la base de datos
        }}
      />
      {nombre}
    </label>
  ))}
  <span className="slider"></span>
</div>


              {/* Editor de código */}
              <AceEditor
  mode={lenguaje}
  theme="dracula" //github monokai dracula solarized_light tomorrow_night
  name="editorCodigo"
  value={contenidoCodigo}
  onChange={guardarCodigoAutomáticamente}
  fontSize={14}
  width="100%"
  height="calc(90vh - 200px)" // Ajusta 200px según sea necesario
  setOptions={{
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    enableSnippets: true,
    showLineNumbers: true,
    tabSize: 4,
  }}
/>
            </>
          ) : (
            <p>No hay proyectos seleccionados. Crea uno nuevo para comenzar.</p>
          )}
        </div>
      </section>
      {mostrarModalConfirmacion && (
  <div className="modal-overlay">
    <div className="modal">
      <div className="modal-header">
        <h2>Confirmar Eliminación</h2>
        <button className="close-button" onClick={() => setMostrarModalConfirmacion(false)}>
          &times;
        </button>
      </div>
      <div className="modal-body">
        <p>
          ¿Está seguro que desea eliminar el proyecto{' '}
          <strong>{proyectoAEliminar?.nombreProyecto}</strong>?
        </p>
      </div>
      <div className="modal-footer">
        <button onClick={() => setMostrarModalConfirmacion(false)}>Cancelar</button>
        <button className="delete-button" onClick={confirmarEliminacionProyecto}>
          Sí, eliminar
        </button>
      </div>
    </div>
  </div>
)}
     
      {/* Modal de resultados de la prueba */}
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
                placeholder="Nombre del Proyecto"
                value={nuevoProyecto.nombreProyecto}
                onChange={manejarCambio}
              />
              <textarea
                name="descripcion"
                placeholder="Descripción"
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
      {/* Modal de resultados de la prueba */}
      {mostrarModalPrueba && (
  <div className="modal-overlay">
    <div className="modal modal-large"> {/* Añadimos una clase para ampliar el tamaño */}
      <div className="modal-header">
      <h1>{proyectoSeleccionado ? proyectoSeleccionado.nombreProyecto : 'Proyecto'}</h1>
      {/* Añadimos el Dro */}

        <button className="close-button" onClick={() => setMostrarModalPrueba(false)}>
          &times;
        </button>
      </div>
      {/* Añadimos las pestañas */}
      <div className="modal-tabs">
        <button
          className={`tab-button ${pestañaActiva === 'Pruebas' ? 'active' : ''}`}
          onClick={() => setPestañaActiva('Pruebas')}
        >
          Pruebas
        </button>
        <button
          className={`tab-button ${pestañaActiva === 'Dashboard' ? 'active' : ''}`}
          onClick={() => setPestañaActiva('Dashboard')}
        >
          Dashboard
        </button>
      </div>
      {/* Contenido del modal cambia según la pestaña activa */}
      <div className="modal-body">
        {pestañaActiva === 'Pruebas' ? (
          /* Contenido de la pestaña Pruebas */
          <div>
            <div>
  {/* Encabezado con el título y el dropdown para seleccionar pruebas */}
  <div className="prueba-header">
  <div className="titulo-y-estado">
  <h2>
  {pruebaSeleccionada
    ? `Prueba ${listaPruebas.findIndex(p => p.idPrueba === pruebaSeleccionada.idPrueba) + 1} de ${proyectoSeleccionado.nombreProyecto}`
    : 'Selecciona una prueba'}
</h2>

    {pruebaSeleccionada && (
      <select
        className="estado-prueba"
        value={pruebaSeleccionada.resultado}
        onChange={(e) => actualizarPrueba('resultado', e.target.value)}
      >
        <option value="CREADA">🔲 CREADA</option>
        <option value="EN REVISION">🟪 EN REVISION</option>
        <option value="CANCELADA">🟩 CANCELADA</option>
        <option value="DEPURADA">✅ DEPURADA</option>
      </select>
    )}
  </div>
  {/* Dropdown para seleccionar pruebas en la siguiente línea */}
  <div className="selector-prueba">
  <select
  value={pruebaSeleccionada ? pruebaSeleccionada.idPrueba : ''}
  onChange={(e) => {
    const prueba = listaPruebas.find((p) => p.idPrueba === parseInt(e.target.value));
    seleccionarPrueba(prueba);
  }}
>
  {listaPruebas.map((prueba, index) => (
    <option key={prueba.idPrueba} value={prueba.idPrueba}>
      Prueba {index + 1}
    </option>
  ))}
</select>
  </div>
</div>


  {/* Mostrar la fecha de ejecución */}
  <p>Fecha de Ejecución: {pruebaSeleccionada ? formatearFecha(pruebaSeleccionada.fechaEjecucion) : 'N/A'}</p>

  {/* Botón para ejecutar nueva prueba */}
  <button onClick={ejecutarNuevaPrueba}>Ejecutar Nueva Prueba</button>

  {/* Tabla de defectos */}
  <table className="tabla-defectos">
    <thead>
      <tr>
        <th>Prioridad</th>
        <th>Descripción</th>
        <th>Línea</th>
        <th>Asignado</th>
        <th>Estado</th>
        <th>Fecha Límite</th>
      </tr>
    </thead>
    <tbody>
      {resultadosDefectos.map((defecto) => (
        <tr key={defecto.idDefecto}>
          <td>{defecto.prioridad}</td>
          <td>{defecto.descripcion}</td>
          <td>{defecto.linea || ''}</td>
          <td>
            <select
              value={defecto.asignado || ''}
              onChange={(e) => actualizarDefecto(defecto.idDefecto, 'asignado', e.target.value)}
            >
              <option value="">Sin asignar</option>
              {listaUsuarios.map((usuario) => (
                <option key={usuario.idUsuario} value={usuario.idUsuario}>
                  {usuario.nombreUsuario}
                </option>
              ))}
            </select>
          </td>
          <td>
            <select
              value={defecto.estado}
              onChange={(e) => actualizarDefecto(defecto.idDefecto, 'estado', e.target.value)}
            >
              <option value="NUEVO">🔲 NUEVO</option>
              <option value="EN REVISION">🟪 EN REVISION</option>
              <option value="OMITIDO">🟩 OMITIDO</option>
              <option value="RESUELTO">✅ RESUELTO</option>
            </select>
          </td>
          <td>
  <input
    type="date"
    value={defecto.fechaResolucion ? defecto.fechaResolucion.substring(0, 10) : ''}
    onChange={(e) => actualizarDefecto(defecto.idDefecto, 'fechaResolucion', e.target.value)}
    className="fecha-limite-input"
  />
</td>
        </tr>
      ))}
    </tbody>
    <tfoot>
      <tr>
        <td colSpan="5">Total de Defectos: {resultadosDefectos.length}</td>
        <td>
          Resueltos: {resultadosDefectos.filter((d) => d.estado === 'RESUELTO').length}
        </td>
      </tr>
    </tfoot>
  </table>
</div>

          </div>
        ) : (
          /* Contenido de la pestaña Dashboard */
          <div>
            <p>Próximamente: Dashboard de métricas.</p>
          </div>
        )}
      </div>
      <div className="modal-footer">
        <button onClick={() => setMostrarModalPrueba(false)}>Cerrar</button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default App;
//618