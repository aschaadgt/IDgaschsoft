const sql = require('mssql');

// Configuración de la conexión a SQL Server
const config = {
    user: 'sa', // Usuario de SQL Server
    password: 'RiskHundred2024.', // Contraseña de SQL Server
    server: 'localhost', // Servidor, o la IP si es remoto
    database: 'IDProjectGASCHSOFT', // Nombre de la base de datos
    options: {
        encrypt: true, // Si estás usando SQL Server en Azure, se usa esta opción
        trustServerCertificate: true // Para SQL Server local, habilita esta opción
    }
};

// Conexión
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Conectado a SQL Server');
        return pool;
    })
    .catch(err => {
        console.log('Error en la conexión a la base de datos: ', err);
    });

module.exports = {
    sql, poolPromise
};
