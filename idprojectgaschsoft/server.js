const express = require('express'); // Importa Express
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { poolPromise, sql } = require('./db'); // Importa db.js desde el archivo que creaste
const { ESLint } = require('eslint'); // Importa ESLint para el análisis de JavaScript
const { JSDOM } = require('jsdom'); // Import de módulo necesario para manipular HTML
const { translationMapping, SEVERITY_LEVELS } = require('./translationMapping'); // Mi propia libreria de traducciones de JavaScrip
const app = express();
const port = process.env.PORT || 3001;

// Configuración de CORS
app.use(cors());  // Añade cors al middleware

// Configuración de middlewares
app.use(express.json());

// Directorio donde se almacenarán los códigos de los proyectos
const codigoDir = path.join(__dirname, 'codigos');

// Asegúrate de que el directorio existe
if (!fs.existsSync(codigoDir)) {
  fs.mkdirSync(codigoDir);
}

// Función para formatear fecha en DD/MM/AAAA
const formatearFecha = (fecha) => {
  if (!fecha) return 'Fecha no disponible';
  
  const date = new Date(fecha);
  date.setHours(date.getHours() + date.getTimezoneOffset() / 60); // Paréntesis añadido aquí

  if (!isNaN(date.getTime())) {
    const dia = ('0' + date.getDate()).slice(-2);
    const mes = ('0' + (date.getMonth() + 1)).slice(-2);
    const anio = date.getFullYear();
    return `${dia}/${mes}/${anio}`;
  }
  return 'Fecha no disponible';
};

//=========================================================================================||
// FUNCIONES   PARA   ANALISIS   ESTATICO   DE   TODOS   LOS   LENGUAJES
// Función para ejecutar análisis estático en código JavaScript
async function analizarCodigoConESLint(codigo, lenguaje) {
  
  try {
      if (lenguaje.toLowerCase() !== 'javascript') {
      throw new Error('Lenguaje no soportado para análisis con ESLint.');
      }
      // Parsear el HTML y extraer el código JavaScript
      if (lenguaje.toLowerCase() !== 'javascript') {
          throw new Error('Lenguaje no soportado para análisis con ESLint.');
      }

      // Parsear el HTML y extraer el código JavaScript
      const dom = new JSDOM(codigo);
      const scripts = dom.window.document.querySelectorAll('script');
      let jsCode = '';

      scripts.forEach(script => {
          jsCode += script.textContent + '\n';
      });

      if (!jsCode.trim()) {
          throw new Error('No se encontró código JavaScript en el archivo.');
      }

      const eslint = new ESLint();
      const resultados = await eslint.lintText(jsCode);
      const mensajes = resultados[0].messages.map((mensaje) => {
          const { ruleId, message, line, column, severity } = mensaje;
          // Consol para poder ver nuevas reglas en ingles, comentar una vez se añada a translationMapping
          // Ejemplo no-unused-vars - Message: se coloca "'no-template-curly-in-string': {" en el arch.
          // console.log(`Rule ID: ${ruleId} - Message: ${message}`);

          let descripcion = message;
          let nivel = 'Information'; // Nivel por defecto

          if (ruleId && translationMapping[ruleId]) {
              descripcion = translationMapping[ruleId].message;

              // Reemplazar variables dinámicas en el mensaje
              const variableName = extractVariableName(message, ruleId);
              if (variableName) {
                  descripcion = descripcion.replace('{variable}', variableName);
              }

              // Asignar el nivel personalizado
              nivel = translationMapping[ruleId].level;
          }

          // Agregamos la línea traducida
          descripcion = `${descripcion}  ${line}`;  // Aquí también agregamos la línea después de traducir

          return {
              tipo: nivel, // Usar el nivel personalizado
              descripcion: descripcion,
              linea: line,
              columna: column,
          };
      });
      return mensajes;
  } catch (error) {
      // Eliminaste el console.error para limpiar la consola
      throw error; // Lanzar el error para que sea manejado en otro lugar
  }
}

// Función para extraer el nombre de la variable del mensaje original
function extractVariableName(message, ruleId) {
  let match;
  switch (ruleId) {
      case 'no-unused-vars':
      case 'no-undef':
      case 'no-redeclare':
      case 'no-use-before-define':
          match = message.match(/'(.+?)'/);
          return match ? match[1] : null;
      case 'func-names':
          match = message.match(/function (.+?)\(/);
          return match ? match[1] : null;
      default:
          return null;
  }
}

module.exports = { analizarCodigoConESLint };
//--------------------
async function ejecutarAnalisisPython(codigo) {
  // Aquí puedes integrar Pylint o Flake8
  return [{ tipo: 'Advertencia', descripcion: 'Scanner en proceso para Lenguaje Python', linea: 1, columna: 1 }];
}

async function ejecutarAnalisisJava(codigo) {
  // Aquí puedes integrar CheckStyle o PMD
  return [{ tipo: 'Error', descripcion: 'Scanner en proceso para Lenguaje Java', linea: 1, columna: 1 }];
}

async function ejecutarAnalisisCPlusPlus(codigo) {
  // Aquí puedes integrar Cppcheck
  return [{ tipo: 'Advertencia', descripcion: 'Scanner en proceso para Lenguaje C++', linea: 1, columna: 1 }];
}

async function ejecutarAnalisisPHP(codigo) {
  // Aquí puedes integrar PHPMD o PHP_CodeSniffer
  return [{ tipo: 'Error', descripcion: 'Scanner en proceso para Lenguaje PHP', linea: 1, columna: 1 }];
}

async function ejecutarAnalisisCSharp(codigo) {
  // Aquí puedes integrar Roslyn Analyzer
  return [{ tipo: 'Advertencia', descripcion: 'Scanner en proceso para Lenguaje C#', linea: 1, columna: 1 }];
}

async function ejecutarAnalisisHTML(codigo) {
  // Aquí puedes integrar HTMLHint
  return [{ tipo: 'Advertencia', descripcion: 'Scanner en proceso para Lenguaje HTML', linea: 1, columna: 1 }];
}

async function ejecutarAnalisisSQL(codigo) {
  // Aquí puedes integrar SQLint
  return [{ tipo: 'Advertencia', descripcion: 'Scanner en proceso para Lenguaje SQL', linea: 1, columna: 1 }];
}

async function ejecutarAnalisisRuby(codigo) {
  // Aquí puedes integrar RuboCop
  return [{ tipo: 'Error', descripcion: 'Scanner en proceso para Lenguaje Ruby', linea: 1, columna: 1 }];
}

//=========================================================================================||
// C R U D   P R O Y E C T O S / A R C H I V O S
// Ruta GET para obtener todos los proyectos SIN formatear las fechas
app.get('/api/proyectos', async (req, res) => {
  try {
      const pool = await poolPromise;
      const result = await pool.request().query('SELECT * FROM Proyectos'); // Consulta a la tabla Proyectos

      // No formateamos las fechas aquí
      res.json(result.recordset);
  } catch (err) {
      res.status(500).send({ message: err.message }); // Manejo de errores
  }
});

// Ruta GET para obtener un proyecto específico
app.get('/api/proyectos/:id', async (req, res) => {
  try {
      const { id } = req.params;

      const pool = await poolPromise;
      const result = await pool.request()
          .input('idProyecto', sql.Int, id)
          .query('SELECT * FROM Proyectos WHERE idProyecto = @idProyecto');

      if (result.recordset.length === 0) {
          return res.status(404).send({ message: `Proyecto con ID ${id} no fue encontrado.` });
      }

      // No formateamos las fechas aquí
      res.json(result.recordset[0]); // Devuelve el proyecto en formato JSON
  } catch (err) {
      res.status(500).send({ message: err.message });
  }
});

// Ruta POST para crear un nuevo proyecto con creación automática de archivo de código
app.post('/api/proyectos', async (req, res) => {
  try {
    const { idUsuario, nombreProyecto, descripcion, fechaInicio, fechaFin, estado, lenguaje } = req.body;
    
    // Verifica si se han proporcionado todos los campos requeridos
    if (!idUsuario || !nombreProyecto || !descripcion || !fechaInicio || !fechaFin || !estado || !lenguaje) {
      return res.status(400).send({ message: 'Por favor, llena todos los campos requeridos.' });
    }

    const pool = await poolPromise;
    await pool.request()
      .input('idUsuario', sql.NVarChar, idUsuario)
      .input('nombreProyecto', sql.NVarChar, nombreProyecto)
      .input('descripcion', sql.NVarChar, descripcion)
      .input('fechaInicio', sql.Date, fechaInicio)
      .input('fechaFin', sql.Date, fechaFin)
      .input('estado', sql.NVarChar, estado)
      .input('lenguaje', sql.NVarChar, lenguaje)
      .query('INSERT INTO Proyectos (idUsuario, nombreProyecto, descripcion, fechaInicio, fechaFin, estado, lenguaje) VALUES (@idUsuario, @nombreProyecto, @descripcion, @fechaInicio, @fechaFin, @estado, @lenguaje)');

    // Obtener el ID del proyecto recién creado
    const nuevoProyecto = await pool.request()
      .input('nombreProyecto', sql.NVarChar, nombreProyecto)
      .input('descripcion', sql.NVarChar, descripcion)
      .query('SELECT idProyecto FROM Proyectos WHERE nombreProyecto = @nombreProyecto AND descripcion = @descripcion ORDER BY idProyecto DESC');

    const idProyecto = nuevoProyecto.recordset[0].idProyecto;

    // Crear el archivo de código para el nuevo proyecto
    const filePath = path.join(codigoDir, `proyecto_${idProyecto}.txt`);
    fs.writeFileSync(filePath, '', 'utf-8'); // Crear archivo vacío

    res.status(201).send({ message: 'Proyecto creado exitosamente.', idProyecto });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Ruta PUT para actualizar un proyecto existente con formato de fechas
app.put('/api/proyectos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombreProyecto, descripcion, fechaInicio, fechaFin, estado, lenguaje } = req.body;
    const pool = await poolPromise;
    const result = await pool.request()
      .input('nombreProyecto', sql.NVarChar, nombreProyecto)
      .input('descripcion', sql.NVarChar, descripcion)
      .input('fechaInicio', sql.Date, fechaInicio) // Manejo de la fecha de inicio
      .input('fechaFin', sql.Date, fechaFin)       // Manejo de la fecha de fin
      .input('estado', sql.NVarChar, estado)
      .input('lenguaje', sql.NVarChar, lenguaje)
      .input('id', sql.Int, id)
      .query('UPDATE Proyectos SET nombreProyecto = @nombreProyecto, descripcion = @descripcion, fechaInicio = @fechaInicio, fechaFin = @fechaFin, estado = @estado, lenguaje = @lenguaje WHERE idProyecto = @id');
    if (result.rowsAffected[0] === 0) {
      return res.status(404).send({ message: 'Proyecto no encontrado.' });
    }
    res.send({ message: 'Proyecto actualizado exitosamente.' });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Ruta DELETE para eliminar un proyecto y su archivo de código
app.delete('/api/proyectos/:id', async (req, res) => {
  try {
      const { id } = req.params;

      const pool = await poolPromise;
      
      // Elimina los defectos relacionados con las pruebas del proyecto
      await pool.request()
          .input('id', sql.Int, id)
          .query('DELETE FROM Defectos WHERE idPrueba IN (SELECT idPrueba FROM Pruebas WHERE idProyecto = @id)');

      // Elimina las pruebas relacionadas con el proyecto
      await pool.request()
          .input('id', sql.Int, id)
          .query('DELETE FROM Pruebas WHERE idProyecto = @id');

      // Finalmente, elimina el proyecto
      const result = await pool.request()
          .input('id', sql.Int, id)
          .query('DELETE FROM Proyectos WHERE idProyecto = @id');

      if (result.rowsAffected[0] === 0) {
          return res.status(404).send({ message: 'Proyecto no encontrado.' });
      }

      // Elimina el archivo de código asociado
      const filePath = path.join(codigoDir, `proyecto_${id}.txt`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      res.send({ message: 'Proyecto, sus datos relacionados y su archivo de código eliminados exitosamente.' });
  } catch (err) {
      res.status(500).send({ message: err.message });
  }
});
//=========================================================================================||
// C R U D   P R U E B A S
// Ruta GET para obtener todas las pruebas con fechas formateadas
app.get('/api/pruebas', async (req, res) => {
  try {
      const pool = await poolPromise;
      const result = await pool.request().query('SELECT * FROM Pruebas'); 

      const pruebasFormateadas = result.recordset.map(prueba => ({
          ...prueba,
          fechaEjecucion: formatearFecha(prueba.fechaEjecucion)
      }));

      res.json(pruebasFormateadas);
  } catch (err) {
      res.status(500).send({ message: err.message });
  }
});
// Ruta GET para obtener todas las pruebas de un proyecto con formato de fechas
app.get('/api/proyectos/:id/pruebas', async (req, res) => {
  try {
      const { id } = req.params; // ID del proyecto

      const pool = await poolPromise;
      const result = await pool.request()
          .input('idProyecto', sql.Int, id)
          .query('SELECT * FROM Pruebas WHERE idProyecto = @idProyecto');

      // Formatear las fechas antes de enviarlas al frontend
      const pruebasFormateadas = result.recordset.map(prueba => ({
          ...prueba,
          fechaEjecucion: formatearFecha(prueba.fechaEjecucion)
      }));

      res.json(pruebasFormateadas);
  } catch (err) {
      res.status(500).send({ message: err.message });
  }
});

// Ruta POST para crear una nueva prueba en un proyecto con formato de fechas
app.post('/api/proyectos/:id/pruebas', async (req, res) => {
  try {
    const { id } = req.params; // ID del proyecto
    const { nombrePrueba, descripcion, fechaEjecucion, resultado } = req.body;

    // Verifica si se han proporcionado todos los campos requeridos
    if (!nombrePrueba || !descripcion || !fechaEjecucion || !resultado) {
      return res.status(400).send({ message: 'Por favor, llena todos los campos requeridos.' });
    }

    const pool = await poolPromise;

    // Verificar que el proyecto existe
    const proyecto = await pool.request()
      .input('idProyecto', sql.Int, id)
      .query('SELECT idProyecto FROM Proyectos WHERE idProyecto = @idProyecto');

    if (proyecto.recordset.length === 0) {
      return res.status(404).send({ message: `El proyecto con ID ${id} no fue encontrado.` });
    }

    // Inserta la nueva prueba en la base de datos y obtiene el idPrueba generado
    const result = await pool.request()
      .input('idProyecto', sql.Int, id)
      .input('nombrePrueba', sql.NVarChar, nombrePrueba)
      .input('descripcion', sql.NVarChar, descripcion)
      .input('fechaEjecucion', sql.DateTime, fechaEjecucion)
      .input('resultado', sql.NVarChar, resultado)
      .query(`
        INSERT INTO Pruebas (idProyecto, nombrePrueba, descripcion, fechaEjecucion, resultado)
        OUTPUT INSERTED.idPrueba
        VALUES (@idProyecto, @nombrePrueba, @descripcion, @fechaEjecucion, @resultado)
      `);

    if (result.rowsAffected[0] > 0) {
      const nuevaPruebaId = result.recordset[0].idPrueba;
      res.status(201).send({ message: 'Prueba creada exitosamente.', idPrueba: nuevaPruebaId });
    } else {
      res.status(500).send({ message: 'Error al crear la prueba.' });
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});


// Ruta PUT para actualizar una prueba existente con formato de fechas
// Ruta PUT para actualizar una prueba existente
app.put('/api/pruebas/:id', async (req, res) => {
  try {
      const { id } = req.params; // ID de la prueba
      const { nombrePrueba, descripcion, fechaEjecucion, resultado } = req.body;

      const pool = await poolPromise;
      const request = pool.request().input('idPrueba', sql.Int, id);

      let camposActualizar = [];

      if (nombrePrueba !== undefined) {
        request.input('nombrePrueba', sql.NVarChar, nombrePrueba);
        camposActualizar.push('nombrePrueba = @nombrePrueba');
      }

      if (descripcion !== undefined) {
        request.input('descripcion', sql.NVarChar, descripcion);
        camposActualizar.push('descripcion = @descripcion');
      }

      if (fechaEjecucion !== undefined) {
        request.input('fechaEjecucion', sql.DateTime, fechaEjecucion);
        camposActualizar.push('fechaEjecucion = @fechaEjecucion');
      }

      if (resultado !== undefined) {
        request.input('resultado', sql.NVarChar, resultado);
        camposActualizar.push('resultado = @resultado');
      }

      if (camposActualizar.length === 0) {
        return res.status(400).send({ message: 'No se proporcionaron campos para actualizar.' });
      }

      const updateQuery = `UPDATE Pruebas SET ${camposActualizar.join(', ')} WHERE idPrueba = @idPrueba`;

      const result = await request.query(updateQuery);

      if (result.rowsAffected[0] === 0) {
        return res.status(404).send({ message: 'Prueba no encontrada.' });
      }

      res.send({ message: 'Prueba actualizada exitosamente.' });
  } catch (err) {
      console.error('Error al actualizar la prueba:', err);
      res.status(500).send({ message: err.message });
  }
});


// Ruta DELETE para eliminar una prueba y sus defectos relacionados
app.delete('/api/pruebas/:idPrueba', async (req, res) => {
  try {
      const { idPrueba } = req.params;

      const pool = await poolPromise;

      // Verificación de resultado antes de eliminar la prueba
      const resultadoPrueba = await pool.request()
          .input('idPrueba', sql.Int, idPrueba)
          .query('SELECT resultado FROM Pruebas WHERE idPrueba = @idPrueba');
       
      if (resultadoPrueba.recordset.length === 0) {
          return res.status(404).send({ message: 'Prueba no encontrada.' });
      }

      // Si se desea habilitar que el sistema identifique los estados de las pruebas y defectos se debe descomentar esta parte.
      /*
      if (resultadoPrueba.recordset[0].resultado !== 'Completado') {
          return res.status(400).send({ message: 'No se puede eliminar una prueba que no esté en estado "Completado".' });
      }

      // Verificación de defectos pendientes antes de eliminar
      const defectosPendientes = await pool.request()
          .input('idPrueba', sql.Int, idPrueba)
          .query('SELECT COUNT(*) AS pendientes FROM Defectos WHERE idPrueba = @idPrueba AND estado <> \'Resuelto\'');

      if (defectosPendientes.recordset[0].pendientes > 0) {
          return res.status(400).send({ message: 'No se puede eliminar la prueba ya que tiene defectos no resueltos.' });
      }
      */

      // Elimina los defectos relacionados con la prueba
      await pool.request()
          .input('idPrueba', sql.Int, idPrueba)
          .query('DELETE FROM Defectos WHERE idPrueba = @idPrueba');

      // Elimina la prueba
      const result = await pool.request()
          .input('idPrueba', sql.Int, idPrueba)
          .query('DELETE FROM Pruebas WHERE idPrueba = @idPrueba');

      if (result.rowsAffected[0] === 0) {
          return res.status(404).send({ message: 'Prueba no encontrada.' });
      }

      res.send({ message: 'Prueba y sus defectos relacionados eliminados exitosamente.' });
  } catch (err) {
      res.status(500).send({ message: err.message });
  }
});
//=========================================================================================||
// C R U D   D E F E C T O S 
// Ruta GET para obtener todos los defectos
app.get('/api/defectos', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Defectos'); // Consulta a la tabla Defectos

        res.json(result.recordset); // Devolvemos todos los defectos en formato JSON
    } catch (err) {
        res.status(500).send({ message: err.message }); // Manejo de errores
    }
});

// Ruta GET para obtener un defecto específico por su ID
app.get('/api/defectos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;
    const result = await pool.request()
      .input('idDefecto', sql.Int, id)
      .query(`
        SELECT 
          idDefecto,
          idPrueba,
          descripcion,
          prioridad,
          estado,
          fechaCreacion,
          fechaResolucion,
          Asignado AS asignado -- Alias del campo
        FROM Defectos
        WHERE idDefecto = @idDefecto
      `);

        if (result.recordset.length === 0) {
            return res.status(404).send({ message: `Defecto con ID ${id} no fue encontrado.` });
        }

        res.json(result.recordset[0]); // Devolvemos el defecto específico
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Ruta GET para obtener los defectos de una prueba específica
app.get('/api/pruebas/:idPrueba/defectos', async (req, res) => {
  try {
    const { idPrueba } = req.params;

    const pool = await poolPromise;
    const result = await pool.request()
      .input('idPrueba', sql.Int, idPrueba)
      .query(`
        SELECT 
          idDefecto,
          idPrueba,
          descripcion,
          prioridad,
          estado,
          fechaCreacion,
          fechaResolucion,
          Asignado AS asignado -- Alias del campo
        FROM Defectos
        WHERE idPrueba = @idPrueba
      `);

      

    res.json(result.recordset);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});


// Ruta POST para crear un nuevo defecto
app.post('/api/defectos', async (req, res) => {
  try {
      // Destructuramos correctamente el campo 'asignado'
      const { idPrueba, descripcion, prioridad, estado, fechaCreacion, fechaResolucion, asignado } = req.body;

      // Verifica si se han proporcionado todos los campos requeridos
      if (!idPrueba || !descripcion || !prioridad || !estado || !fechaCreacion) {
          return res.status(400).send({ message: 'Por favor, llena todos los campos requeridos.' });
      }

      const pool = await poolPromise;
      await pool.request()
          .input('idPrueba', sql.Int, idPrueba)
          .input('descripcion', sql.NVarChar, descripcion)
          .input('prioridad', sql.NVarChar, prioridad)
          .input('estado', sql.NVarChar, estado)
          .input('fechaCreacion', sql.DateTime, fechaCreacion)
          .input('fechaResolucion', sql.DateTime, fechaResolucion || null) // Campo opcional
          .input('asignado', sql.VarChar, asignado || null) // Campo opcional de asignación
          .query('INSERT INTO Defectos (idPrueba, descripcion, prioridad, estado, fechaCreacion, fechaResolucion, Asignado) VALUES (@idPrueba, @descripcion, @prioridad, @estado, @fechaCreacion, @fechaResolucion, @asignado)');

      res.status(201).send({ message: 'Defecto creado exitosamente.' });
  } catch (err) {
      res.status(500).send({ message: err.message });
  }
});
// Ruta PUT para actualizar un defecto existente
app.put('/api/defectos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, prioridad, estado, fechaResolucion, asignado } = req.body;

    // Comentamos o eliminamos la validación estricta
    // if (!descripcion || !prioridad || !estado) {
    //   return res.status(400).send({ message: 'Por favor, llena todos los campos requeridos.' });
    // }

    const pool = await poolPromise;

    // Construimos la consulta dinámicamente
    let updateFields = [];
    if (descripcion !== undefined) updateFields.push(`descripcion = @descripcion`);
    if (prioridad !== undefined) updateFields.push(`prioridad = @prioridad`);
    if (estado !== undefined) updateFields.push(`estado = @estado`);
    if (fechaResolucion !== undefined) updateFields.push(`fechaResolucion = @fechaResolucion`);
    if (asignado !== undefined) updateFields.push(`asignado = @asignado`);

    if (updateFields.length === 0) {
      return res.status(400).send({ message: 'No hay campos para actualizar.' });
    }

    const query = `UPDATE Defectos SET ${updateFields.join(', ')} WHERE idDefecto = @idDefecto`;

    const request = pool.request()
      .input('idDefecto', sql.Int, id);

    if (descripcion !== undefined) request.input('descripcion', sql.NVarChar, descripcion);
    if (prioridad !== undefined) request.input('prioridad', sql.NVarChar, prioridad);
    if (estado !== undefined) request.input('estado', sql.NVarChar, estado);
    if (fechaResolucion !== undefined) request.input('fechaResolucion', sql.DateTime, fechaResolucion || null);
    if (asignado !== undefined) request.input('asignado', sql.VarChar, asignado || null);

    const result = await request.query(query);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).send({ message: `Defecto con ID ${id} no fue encontrado.` });
    }

    res.send({ message: 'Defecto actualizado exitosamente.' });
  } catch (err) {
    console.error('Error al actualizar el defecto:', err);
    res.status(500).send({ message: err.message });
  }
});

// Ruta DELETE para eliminar un defecto
app.delete('/api/defectos/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const pool = await poolPromise;
        const result = await pool.request()
            .input('idDefecto', sql.Int, id)
            .query('DELETE FROM Defectos WHERE idDefecto = @idDefecto');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send({ message: 'Defecto no encontrado.' });
        }

        res.send({ message: 'Defecto eliminado exitosamente.' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});
//=========================================================================================||
// C R U D   U S U A R I O S
// Ruta GET para obtener todos los usuarios
app.get('/api/usuarios', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Usuarios');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error al obtener los usuarios:', err);
    res.status(500).send({ message: err.message });
  }
});

//=========================================================================================||
// C R U D   A R C H I V O S
// Ruta GET para obtener el código de un proyecto
app.get('/api/proyectos/:idProyecto/codigo', async (req, res) => {
    try {
      const { idProyecto } = req.params;
      const filePath = path.join(codigoDir, `proyecto_${idProyecto}.txt`);
  
      if (!fs.existsSync(filePath)) {
        return res.status(404).send({ message: 'No se encontró código para este proyecto.' });
      }
  
      const contenido = fs.readFileSync(filePath, 'utf-8');
      res.json({ contenido });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  });
  
  // Ruta PUT para actualizar el código de un proyecto
  app.put('/api/proyectos/:idProyecto/codigo', async (req, res) => {
    try {
      const { idProyecto } = req.params;
      const { contenido } = req.body;
  
      const filePath = path.join(codigoDir, `proyecto_${idProyecto}.txt`);
      fs.writeFileSync(filePath, contenido, 'utf-8');
  
      res.send({ message: 'Código actualizado exitosamente.' });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  });
//=========================================================================================||
// C R U D   A N Á L I S I S   E S T Á T I C O
// Ruta POST para ejecutar el análisis de código estático en un proyecto
app.post('/api/proyectos/:id/analisis', async (req, res) => {
  const { id } = req.params;

  try {
    const pool = await poolPromise;
    
    // Obtenemos el lenguaje del proyecto desde la base de datos
    const proyecto = await pool.request()
        .input('idProyecto', sql.Int, id)
        .query('SELECT lenguaje FROM Proyectos WHERE idProyecto = @idProyecto');
    
    if (proyecto.recordset.length === 0) {
        return res.status(404).send({ message: 'Proyecto no encontrado.' });
    }

    const lenguaje = proyecto.recordset[0].lenguaje;

    // Obtenemos el código desde el archivo .txt del proyecto
    const filePath = path.join(codigoDir, `proyecto_${id}.txt`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).send({ message: 'No se encontró código para este proyecto.' });
    }

    const contenidoCodigo = fs.readFileSync(filePath, 'utf-8');

    // Dependiendo del lenguaje, ejecutamos el análisis correspondiente
    let resultadoAnalisis;
    switch (lenguaje) {
      case 'javascript':
        resultadoAnalisis = await analizarCodigoConESLint(contenidoCodigo, lenguaje); // Pasar el lenguaje
        break;
      case 'python':
        resultadoAnalisis = await ejecutarAnalisisPython(contenidoCodigo);
        break;
      case 'java':
        resultadoAnalisis = await ejecutarAnalisisJava(contenidoCodigo);
        break;
      case 'c_cpp':
        resultadoAnalisis = await ejecutarAnalisisCPlusPlus(contenidoCodigo);
        break;
      case 'php':
        resultadoAnalisis = await ejecutarAnalisisPHP(contenidoCodigo);
        break;
      case 'csharp':
        resultadoAnalisis = await ejecutarAnalisisCSharp(contenidoCodigo);
        break;
      case 'html':
        resultadoAnalisis = await ejecutarAnalisisHTML(contenidoCodigo);
        break;
      case 'sql':
        resultadoAnalisis = await ejecutarAnalisisSQL(contenidoCodigo);
        break;
      case 'ruby':
        resultadoAnalisis = await ejecutarAnalisisRuby(contenidoCodigo);
        break;
      default:
        return res.status(400).send({ message: `Análisis para el lenguaje ${lenguaje} no implementado aún.` });
    }

    // Devolver los resultados del análisis
    res.status(200).json({ resultados: resultadoAnalisis });
  } catch (err) {
    res.status(500).send({ message: `Error al ejecutar el análisis: ${err.message}` });
  }
});

//=========================================================================================||
// Función para inicializar archivos de código para proyectos existentes
  const inicializarArchivosCodigo = async () => {
    try {
      const pool = await poolPromise;
      const proyectos = await pool.request().query('SELECT idProyecto FROM Proyectos');
  
      proyectos.recordset.forEach(proyecto => {
        const filePath = path.join(codigoDir, `proyecto_${proyecto.idProyecto}.txt`);
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, '', 'utf-8'); // Crear archivo vacío
          console.log(`Archivo creado para proyecto ID: ${proyecto.idProyecto}`);
        }
      });
    } catch (err) {
      console.error('Error al inicializar archivos de código:', err.message);
    }
  };

//==========================================================================================================================================================
// Inicia el servidor
app.listen(port, async () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
    await inicializarArchivosCodigo();  // Crear archivos para proyectos existentes
});
/*705*/