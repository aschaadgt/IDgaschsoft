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
-- Insertar datos nuevos *****************************************************


-- Insertar nuevos usuarios en la tabla Usuarios
INSERT INTO [IDProjectGASCHSOFT].[dbo].[Usuarios]
    (idUsuario, nombre, apellido, correo, contrasena, fechaCreacion, rol, estado)
VALUES
    ('JPerez', 'Juan', 'Pérez', 'jperez@gaschsoft.com', 'contrasena1', GETDATE(), 'Desarrollador', 'Activo'),
    ('MLopez', 'María', 'López', 'mlopez@gaschsoft.com', 'contrasena2', GETDATE(), 'Administrador', 'Activo'),
    ('CRodriguez', 'Carlos', 'Rodríguez', 'crodriguez@gaschsoft.com', 'contrasena3', GETDATE(), 'Desarrollador', 'Activo'),
    ('AGonzalez', 'Ana', 'González', 'agonzalez@gaschsoft.com', 'contrasena4', GETDATE(), 'Administrador', 'Activo'),
    ('LHernandez', 'Luis', 'Hernández', 'lhernandez@gaschsoft.com', 'contrasena5', GETDATE(), 'Desarrollador', 'Activo'),
    ('RMorales', 'Rosa', 'Morales', 'rmorales@gaschsoft.com', 'contrasena6', GETDATE(), 'Desarrollador', 'Activo');
GO

-- Insertar nuevos proyectos en la tabla Proyectos
INSERT INTO [IDProjectGASCHSOFT].[dbo].[Proyectos]
    (idUsuario, nombreProyecto, descripcion, fechaInicio, fechaFin, estado)
VALUES
    ('JPerez', 'Calculadora Básica', 'Desarrollo de una calculadora básica en C++.', GETDATE(), DATEADD(DAY, 7, GETDATE()), 'En progreso'),
    ('MLopez', 'Juego del Ahorcado', 'Implementación del juego del ahorcado en Java.', GETDATE(), DATEADD(DAY, 10, GETDATE()), 'Activo'),
    ('CRodriguez', 'Agenda de Contactos', 'Creación de una agenda de contactos en Python.', GETDATE(), DATEADD(DAY, 5, GETDATE()), 'Pendiente'),
    ('AGonzalez', 'Sistema de Gestión de Notas', 'Aplicación para gestionar notas académicas en PHP.', GETDATE(), DATEADD(DAY, 14, GETDATE()), 'En progreso'),
    ('LHernandez', 'Conversor de Monedas', 'Programa para convertir monedas usando tasas actuales en JavaScript.', GETDATE(), DATEADD(DAY, 3, GETDATE()), 'Activo'),
    ('RMorales', 'Aplicación de Tareas', 'Desarrollo de una aplicación para gestionar tareas diarias en Ruby.', GETDATE(), DATEADD(DAY, 7, GETDATE()), 'En progreso');
GO

-- Declarar una tabla variable para capturar los idPrueba y el nombre de la prueba
DECLARE @PruebasNuevas TABLE (
    idPrueba INT,
    nombrePrueba NVARCHAR(255)
);

-- Insertar nuevas pruebas y capturar idPrueba
INSERT INTO [IDProjectGASCHSOFT].[dbo].[Pruebas]
    (idProyecto, nombrePrueba, descripcion, fechaEjecucion, resultado)
OUTPUT INSERTED.idPrueba, INSERTED.nombrePrueba INTO @PruebasNuevas (idPrueba, nombrePrueba)
SELECT
    P.idProyecto,
    CASE P.nombreProyecto
        WHEN 'Calculadora Básica' THEN 'Prueba de operaciones aritméticas'
        WHEN 'Juego del Ahorcado' THEN 'Prueba de lógica del juego'
        WHEN 'Agenda de Contactos' THEN 'Prueba de creación de contactos'
        WHEN 'Sistema de Gestión de Notas' THEN 'Prueba de cálculo de promedio'
        WHEN 'Conversor de Monedas' THEN 'Prueba de tasas de cambio'
        WHEN 'Aplicación de Tareas' THEN 'Prueba de gestión de tareas'
        ELSE 'Prueba general'
    END AS nombrePrueba,
    'Descripción de la prueba para ' + P.nombreProyecto AS descripcion,
    GETDATE() AS fechaEjecucion,
    'En progreso' AS resultado
FROM [IDProjectGASCHSOFT].[dbo].[Proyectos] P;

-- PASO 3: Insertar nuevos defectos

INSERT INTO [IDProjectGASCHSOFT].[dbo].[Defectos]
    (idPrueba, descripcion, prioridad, estado, fechaCreacion, fechaResolucion)
SELECT
    P.idPrueba,
    'Descripción del defecto encontrado en ' + P.nombrePrueba,
    'Alta',
    'Abierto',
    GETDATE(),
    NULL
FROM @PruebasNuevas P
WHERE P.nombrePrueba LIKE 'Prueba%';

-- Verificar los registros insertados
SELECT * FROM [IDProjectGASCHSOFT].[dbo].[Pruebas];
SELECT * FROM [IDProjectGASCHSOFT].[dbo].[Defectos];