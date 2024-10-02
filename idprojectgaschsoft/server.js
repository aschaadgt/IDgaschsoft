const express = require('express'); // Importa Express
const { poolPromise, sql } = require('./db'); // Importa db.js desde el archivo que creaste

const app = express();
const port = process.env.PORT || 3001;

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

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
