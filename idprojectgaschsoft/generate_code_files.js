//Ejecutar en cmd en cd "C:\Proyectos\IDgaschsoft\idprojectgaschsoft" y ejecutar node generate_code_files.js eso creara los archivos pendientes
// generate_code_files.js
const fs = require('fs');
const path = require('path');
const { poolPromise, sql } = require('./db');

// Directorio donde se almacenarán los códigos de los proyectos
const codigoDir = path.join(__dirname, 'codigos');

// Asegúrate de que el directorio existe
if (!fs.existsSync(codigoDir)) {
  fs.mkdirSync(codigoDir);
}

const generarArchivos = async () => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT idProyecto FROM Proyectos');

    const proyectos = result.recordset;

    proyectos.forEach((proyecto) => {
      const { idProyecto } = proyecto;
      const nombreArchivo = `proyecto_${idProyecto}.txt`; // Cambia la extensión si es necesario
      const filePath = path.join(codigoDir, nombreArchivo);

      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '', 'utf-8'); // Crea un archivo vacío
        console.log(`Archivo creado: ${nombreArchivo}`);
      } else {
        console.log(`Archivo ya existe: ${nombreArchivo}`);
      }
    });

    console.log('Generación de archivos completada.');
  } catch (err) {
    console.error('Error al generar archivos de código:', err.message);
  }
};

generarArchivos();
