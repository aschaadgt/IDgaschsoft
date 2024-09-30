-- Crear la base de datos
CREATE DATABASE IDProjectGASCHSOFT;
GO

-- Usar la base de datos reci�n creada
USE IDProjectGASCHSOFT;
GO

-- Crear tabla Usuarios
CREATE TABLE Usuarios (
    idUsuario VARCHAR(36) PRIMARY KEY, -- Identificador �nico usando UUID
    nombre NVARCHAR(255) NOT NULL, -- Nombre del usuario
    apellido NVARCHAR(255) NOT NULL, -- Apellido del usuario
    correo NVARCHAR(255) NOT NULL UNIQUE, -- Correo �nico, usado para login
    contrasena NVARCHAR(255) NOT NULL, -- Contrase�a encriptada
    fechaCreacion DATE NOT NULL, -- Fecha de creaci�n del usuario
    rol NVARCHAR(50) CHECK (rol IN ('Administrador', 'Desarrollador')), -- Rol del usuario (Administrador, Desarrollador)
    estado NVARCHAR(50) DEFAULT 'Activo' -- Estado del usuario (Activo, Inactivo)
);
GO

-- Crear tabla Proyectos
CREATE TABLE Proyectos (
    idProyecto INT PRIMARY KEY IDENTITY(1,1), -- Identificador �nico del proyecto
    idUsuario VARCHAR(36) FOREIGN KEY REFERENCES Usuarios(idUsuario), -- Relaci�n con el creador (Desarrollador)
    nombreProyecto NVARCHAR(255) NOT NULL, -- Nombre del proyecto
    descripcion NVARCHAR(1000), -- Descripci�n del proyecto
    fechaInicio DATE NOT NULL, -- Fecha de inicio del proyecto
    fechaFin DATE, -- Fecha de finalizaci�n del proyecto (puede ser NULL)
    estado NVARCHAR(50) -- Estado del proyecto (Activo, Inactivo, Completado, etc.)
);
GO

-- Crear tabla Pruebas
CREATE TABLE Pruebas (
    idPrueba INT PRIMARY KEY IDENTITY(1,1), -- Identificador �nico de la prueba
    idProyecto INT FOREIGN KEY REFERENCES Proyectos(idProyecto), -- Relaci�n con la tabla Proyectos
    nombrePrueba NVARCHAR(255) NOT NULL, -- Nombre de la prueba
    descripcion NVARCHAR(1000), -- Descripci�n de la prueba
    fechaEjecucion DATE NOT NULL, -- Fecha de ejecuci�n de la prueba
    resultado NVARCHAR(50) -- Resultado de la prueba (Exitoso, Fallido, En Progreso, etc.)
);
GO

-- Crear tabla Defectos
CREATE TABLE Defectos (
    idDefecto INT PRIMARY KEY IDENTITY(1,1), -- Identificador �nico del defecto
    idPrueba INT FOREIGN KEY REFERENCES Pruebas(idPrueba), -- Relaci�n con la tabla Pruebas
    descripcion NVARCHAR(1000) NOT NULL, -- Descripci�n del defecto encontrado
    prioridad NVARCHAR(50), -- Prioridad del defecto (Alta, Media, Baja)
    estado NVARCHAR(50), -- Estado del defecto (Abierto, En Progreso, Cerrado, etc.)
    fechaCreacion DATE NOT NULL, -- Fecha en la que se cre� el defecto
    fechaResolucion DATE NULL -- Fecha en la que se resolvi� el defecto (puede ser NULL)
);
GO
