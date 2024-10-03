const express = require('express'); // Importa Express
const cors = require('cors');
const { poolPromise, sql } = require('./db'); // Importa db.js desde el archivo que creaste

const app = express();
const port = process.env.PORT || 3001;

// Configuración de CORS
app.use(cors());  // Añade cors al middleware

// Configuración de middlewares
app.use(express.json());

// Ruta GET para obtener todos los proyectos
app.get('/api/proyectos', async (req, res) => {
    try {
        const pool = await poolPromise; // Obtiene la conexión desde poolPromise
        const result = await pool.request().query('SELECT * FROM Proyectos'); // Consulta a la tabla Proyectos
        res.json(result.recordset); // Devuelve los datos en formato JSON
    } catch (err) {
        res.status(500).send({ message: err.message }); // Manejo de errores
    }
});
//==========================================================================================================================================================
// Ruta POST para crear un nuevo proyecto
app.post('/api/proyectos', async (req, res) => {
    try {
        const { idUsuario, nombreProyecto, descripcion, fechaInicio, fechaFin, estado } = req.body;

        // Verifica si se han proporcionado todos los campos requeridos
        if (!idUsuario || !nombreProyecto || !descripcion || !fechaInicio || !fechaFin || !estado) {
            return res.status(400).send({ message: 'Por favor, llena todos los campos requeridos.' });
        }

        const pool = await poolPromise;
        await pool.request()
            .input('idUsuario', sql.NVarChar, idUsuario)
            .input('nombreProyecto', sql.NVarChar, nombreProyecto)
            .input('descripcion', sql.NVarChar, descripcion)
            .input('fechaInicio', sql.DateTime, fechaInicio)
            .input('fechaFin', sql.DateTime, fechaFin)
            .input('estado', sql.NVarChar, estado)
            .query('INSERT INTO Proyectos (idUsuario, nombreProyecto, descripcion, fechaInicio, fechaFin, estado) VALUES (@idUsuario, @nombreProyecto, @descripcion, @fechaInicio, @fechaFin, @estado)');

        res.status(201).send({ message: 'Proyecto creado exitosamente.' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

/* Ruta POST para crear un nuevo proyecto (prueba básica)
app.post('/api/proyectos', (req, res) => {
    // Respuesta básica para probar la ruta POST
    res.status(200).send('POST request to /api/proyectos received!');
});*/

// Ruta PUT para actualizar un proyecto existente
app.put('/api/proyectos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombreProyecto, descripcion, fechaInicio, fechaFin, estado } = req.body;

        const pool = await poolPromise;
        const result = await pool.request()
            .input('nombreProyecto', sql.NVarChar, nombreProyecto)
            .input('descripcion', sql.NVarChar, descripcion)
            .input('fechaInicio', sql.DateTime, fechaInicio)
            .input('fechaFin', sql.DateTime, fechaFin)
            .input('estado', sql.NVarChar, estado)
            .input('id', sql.Int, id)
            .query('UPDATE Proyectos SET nombreProyecto = @nombreProyecto, descripcion = @descripcion, fechaInicio = @fechaInicio, fechaFin = @fechaFin, estado = @estado WHERE idProyecto = @id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send({ message: 'Proyecto no encontrado.' });
        }

        res.send({ message: 'Proyecto actualizado exitosamente.' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

// Ruta DELETE para eliminar un proyecto y sus pruebas/defectos relacionados
app.delete('/api/proyectos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const pool = await poolPromise;

        // Primero, elimina los defectos relacionados con las pruebas del proyecto
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Defectos WHERE idPrueba IN (SELECT idPrueba FROM Pruebas WHERE idProyecto = @id)');

        // Luego, elimina las pruebas relacionadas con el proyecto
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

        res.send({ message: 'Proyecto y sus datos relacionados eliminados exitosamente.' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});
//==========================================================================================================================================================
// Ruta GET para obtener todas las pruebas
app.get('/api/pruebas', async (req, res) => {
    try {
        const pool = await poolPromise; // Obtiene la conexión desde poolPromise
        const result = await pool.request().query('SELECT * FROM Pruebas'); // Consulta a la tabla Pruebas
        res.json(result.recordset); // Devuelve los datos en formato JSON
    } catch (err) {
        res.status(500).send({ message: err.message }); // Manejo de errores
    }
});

// Ruta GET para obtener todas las pruebas de un proyecto
app.get('/api/proyectos/:id/pruebas', async (req, res) => {
    try {
        const { id } = req.params; // ID del proyecto

        const pool = await poolPromise;
        const result = await pool.request()
            .input('idProyecto', sql.Int, id)
            .query('SELECT * FROM Pruebas WHERE idProyecto = @idProyecto');

        res.json(result.recordset);
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

//Ruta POST para crear una nueva prueba en un proyecto
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

        // Inserta la nueva prueba en la base de datos
        const result = await pool.request()
            .input('idProyecto', sql.Int, id)
            .input('nombrePrueba', sql.NVarChar, nombrePrueba)
            .input('descripcion', sql.NVarChar, descripcion)
            .input('fechaEjecucion', sql.DateTime, fechaEjecucion)
            .input('resultado', sql.NVarChar, resultado)
            .query('INSERT INTO Pruebas (idProyecto, nombrePrueba, descripcion, fechaEjecucion, resultado) VALUES (@idProyecto, @nombrePrueba, @descripcion, @fechaEjecucion, @resultado)');

        if (result.rowsAffected[0] > 0) {
            res.status(201).send({ message: 'Prueba creada exitosamente.', result });
        } else {
            res.status(500).send({ message: 'Error al crear la prueba.' });
        }
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
});

/*/ Ruta POST para crear una nueva prueba en un proyecto (prueba básica)
app.post('/api/proyectos/:id/pruebas', (req, res) => {
    // Respuesta básica para probar la ruta POST
    res.status(200).send(`POST request to /api/proyectos/${req.params.id}/pruebas received!`);
});*/


// Ruta PUT para actualizar una prueba existente
app.put('/api/pruebas/:id', async (req, res) => {
    try {
        const { id } = req.params; // ID de la prueba
        const { nombrePrueba, descripcion, fechaEjecucion, resultado } = req.body;

        const pool = await poolPromise;
        const result = await pool.request()
            .input('nombrePrueba', sql.NVarChar, nombrePrueba)
            .input('descripcion', sql.NVarChar, descripcion)
            .input('fechaEjecucion', sql.DateTime, fechaEjecucion)
            .input('resultado', sql.NVarChar, resultado)
            .input('idPrueba', sql.Int, id)
            .query('UPDATE Pruebas SET nombrePrueba = @nombrePrueba, descripcion = @descripcion, fechaEjecucion = @fechaEjecucion, resultado = @resultado WHERE idPrueba = @idPrueba');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).send({ message: 'Prueba no encontrada.' });
        }

        res.send({ message: 'Prueba actualizada exitosamente.' });
    } catch (err) {
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
         
        // Si se desea habilitar que el sistema identifique los estados de las pruebas y defectos se debe descomentar esta parte.
        /*
        if (resultadoPrueba.recordset.length === 0) {
            return res.status(404).send({ message: 'Prueba no encontrada.' });
        }

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

//==========================================================================================================================================================

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
