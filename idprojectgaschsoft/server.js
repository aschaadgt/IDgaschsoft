const express = require('express');
const cors = require('cors');
const { poolPromise, sql } = require('./db'); // Importa la conexión a la base de datos desde db.js

const app = express(); // Definir solo una vez
const port = process.env.PORT || 3001;

// Habilitar CORS para todas las solicitudes
app.use(cors());

// Configuración de middlewares
app.use(express.json()); // Para parsear JSON en las solicitudes

// Ruta de prueba para verificar la conexión a SQL Server
app.get('/api/proyectos', async (req, res) => {
    try {
        const pool = await poolPromise; // Usa la conexión de db.js
        const result = await pool.request().query('SELECT * FROM Proyectos'); // Consulta SQL
        res.json(result.recordset); // Devuelve los datos de la tabla Proyectos en formato JSON
    } catch (err) {
        res.status(500).send({ message: err.message }); // En caso de error
    }
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
