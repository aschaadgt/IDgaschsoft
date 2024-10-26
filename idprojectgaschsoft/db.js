const sql = require('mssql');

// Configuración de la conexión a SQL Server
const config = {
    user: 'idprojectgaschsofff@idprojectgaschsofttt', 
    password: 'RiskHundred2024.', 
    server: 'idprojectgaschsofttt.database.windows.net', // Cambia por el nombre de tu servidor en Azure
    database: 'IDProjectGASCHSOFT', // Nombre de la base de datos en Azure
    options: {
        encrypt: true, // Esto debe estar en true para conexiones a Azure
        trustServerCertificate: false // Para Azure, debe estar en false
    }
};

// Conexión
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Conectado a SQL Server en Azure');
        return pool;
    })
    .catch(err => {
        console.log('Error en la conexión a la base de datos en Azure: ', err);
    });

module.exports = {
    sql, poolPromise
};
//29