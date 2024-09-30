-- Crear la base de datos
CREATE DATABASE IDProjectGASCHSOFT;
GO

-- Usar la base de datos recién creada
USE IDProjectGASCHSOFT;
GO

-- Crear tabla Usuarios
CREATE TABLE Usuarios (
    idUsuario VARCHAR(36) PRIMARY KEY, -- Identificador único usando UUID
    nombre NVARCHAR(255) NOT NULL, -- Nombre del usuario
    apellido NVARCHAR(255) NOT NULL, -- Apellido del usuario
    correo NVARCHAR(255) NOT NULL UNIQUE, -- Correo único, usado para login
    contrasena NVARCHAR(255) NOT NULL, -- Contraseña encriptada
    fechaCreacion DATE NOT NULL, -- Fecha de creación del usuario
    rol NVARCHAR(50) CHECK (rol IN ('Administrador', 'Desarrollador')), -- Rol del usuario (Administrador, Desarrollador)
    estado NVARCHAR(50) DEFAULT 'Activo' -- Estado del usuario (Activo, Inactivo)
);
GO

-- Crear tabla Proyectos
CREATE TABLE Proyectos (
    idProyecto INT PRIMARY KEY IDENTITY(1,1), -- Identificador único del proyecto
    idUsuario VARCHAR(36) FOREIGN KEY REFERENCES Usuarios(idUsuario), -- Relación con el creador (Desarrollador)
    nombreProyecto NVARCHAR(255) NOT NULL, -- Nombre del proyecto
    descripcion NVARCHAR(1000), -- Descripción del proyecto
    fechaInicio DATE NOT NULL, -- Fecha de inicio del proyecto
    fechaFin DATE, -- Fecha de finalización del proyecto (puede ser NULL)
    estado NVARCHAR(50) -- Estado del proyecto (Activo, Inactivo, Completado, etc.)
);
GO

-- Crear tabla Pruebas
CREATE TABLE Pruebas (
    idPrueba INT PRIMARY KEY IDENTITY(1,1), -- Identificador único de la prueba
    idProyecto INT FOREIGN KEY REFERENCES Proyectos(idProyecto), -- Relación con la tabla Proyectos
    nombrePrueba NVARCHAR(255) NOT NULL, -- Nombre de la prueba
    descripcion NVARCHAR(1000), -- Descripción de la prueba
    fechaEjecucion DATE NOT NULL, -- Fecha de ejecución de la prueba
    resultado NVARCHAR(50) -- Resultado de la prueba (Exitoso, Fallido, En Progreso, etc.)
);
GO

-- Crear tabla Defectos
CREATE TABLE Defectos (
    idDefecto INT PRIMARY KEY IDENTITY(1,1), -- Identificador único del defecto
    idPrueba INT FOREIGN KEY REFERENCES Pruebas(idPrueba), -- Relación con la tabla Pruebas
    descripcion NVARCHAR(1000) NOT NULL, -- Descripción del defecto encontrado
    prioridad NVARCHAR(50), -- Prioridad del defecto (Alta, Media, Baja)
    estado NVARCHAR(50), -- Estado del defecto (Abierto, En Progreso, Cerrado, etc.)
    fechaCreacion DATE NOT NULL, -- Fecha en la que se creó el defecto
    fechaResolucion DATE NULL -- Fecha en la que se resolvió el defecto (puede ser NULL)
);
GO
