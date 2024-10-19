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
-- Insertar nuevos proyectos en la tabla Proyectos
INSERT INTO [IDProjectGASCHSOFT].[dbo].[Proyectos]
    (idUsuario, nombreProyecto, descripcion, fechaInicio, fechaFin, estado)
VALUES
    ('JPerez', 'Calculadora Básica', 'Desarrollo de una calculadora básica en C++.', '2024-10-01', DATEADD(DAY, 7, '2024-10-01'), 'CANCELADO'),
    ('MLopez', 'Juego del Ahorcado', 'Implementación del juego del ahorcado en Java.', '2024-10-01', DATEADD(DAY, 10, '2024-10-01'), 'CANCELADO'),
    ('CRodriguez', 'Agenda de Contactos', 'Creación de una agenda de contactos en Python.', '2024-10-01', DATEADD(DAY, 5, '2024-10-01'), 'CANCELADO'),
    ('AGonzalez', 'Sistema de Gestión de Notas', 'Aplicación para gestionar notas académicas en PHP.', '2024-10-01', DATEADD(DAY, 14, '2024-10-01'), 'CANCELADO'),
    ('LHernandez', 'Conversor de Monedas', 'Programa para convertir monedas usando tasas actuales en JavaScript.', '2024-10-01', DATEADD(DAY, 3, '2024-10-01'), 'CANCELADO'),
    ('RMorales', 'Aplicación de Tareas', 'Desarrollo de una aplicación para gestionar tareas diarias en Ruby.', '2024-10-01', DATEADD(DAY, 7, '2024-10-01'), 'CANCELADO'),
    ('JPerez', 'Sistema de Login', 'Desarrollo de un sistema de autenticación de usuarios.', '2024-10-02', DATEADD(DAY, 10, '2024-10-02'), 'CANCELADO'),
    ('MLopez', 'Aplicación de Chat', 'Implementación de una aplicación de chat en tiempo real.', '2024-10-02', DATEADD(DAY, 12, '2024-10-02'), 'CANCELADO'),
    ('CRodriguez', 'Blog Personal', 'Creación de un blog personal para publicar artículos.', '2024-10-02', DATEADD(DAY, 8, '2024-10-02'), 'CANCELADO'),
    ('AGonzalez', 'Galería de Fotos', 'Desarrollo de una galería de fotos para compartir imágenes.', '2024-10-02', DATEADD(DAY, 15, '2024-10-02'), 'CANCELADO');
-- No GO aquí

-- Declarar una tabla variable para capturar todos los idProyecto y nombreProyecto
DECLARE @TodosProyectos TABLE (
    idProyecto INT,
    nombreProyecto NVARCHAR(255)
);

-- Insertar en la tabla variable todos los proyectos existentes
INSERT INTO @TodosProyectos (idProyecto, nombreProyecto)
SELECT idProyecto, nombreProyecto FROM [IDProjectGASCHSOFT].[dbo].[Proyectos];

-- Declarar una tabla variable para capturar los idPrueba y nombrePrueba
DECLARE @PruebasNuevas TABLE (
    idPrueba INT,
    nombrePrueba NVARCHAR(255)
);

-- Insertar 2 pruebas por cada proyecto y capturar idPrueba
-- Primera prueba por proyecto
INSERT INTO [IDProjectGASCHSOFT].[dbo].[Pruebas]
    (idProyecto, nombrePrueba, descripcion, fechaEjecucion, resultado)
OUTPUT INSERTED.idPrueba, INSERTED.nombrePrueba INTO @PruebasNuevas (idPrueba, nombrePrueba)
SELECT
    P.idProyecto,
    CONCAT('Prueba 1 de ', P.nombreProyecto) AS nombrePrueba,
    CONCAT('Descripción de la prueba 1 para ', P.nombreProyecto) AS descripcion,
    '2024-10-07' AS fechaEjecucion,
    'En progreso' AS resultado
FROM @TodosProyectos P;

-- Segunda prueba por proyecto
INSERT INTO [IDProjectGASCHSOFT].[dbo].[Pruebas]
    (idProyecto, nombrePrueba, descripcion, fechaEjecucion, resultado)
OUTPUT INSERTED.idPrueba, INSERTED.nombrePrueba INTO @PruebasNuevas (idPrueba, nombrePrueba)
SELECT
    P.idProyecto,
    CONCAT('Prueba 2 de ', P.nombreProyecto) AS nombrePrueba,
    CONCAT('Descripción de la prueba 2 para ', P.nombreProyecto) AS descripcion,
    '2024-10-08' AS fechaEjecucion,
    'En progreso' AS resultado
FROM @TodosProyectos P;

-- PASO 3: Insertar nuevos defectos

-- Insertar 2 defectos por cada prueba
INSERT INTO [IDProjectGASCHSOFT].[dbo].[Defectos]
    (idPrueba, descripcion, prioridad, estado, fechaCreacion, fechaResolucion)
SELECT
    P.idPrueba,
    CONCAT('Descripción del defecto 1 encontrado en ', P.nombrePrueba) AS descripcion,
    'Alta' AS prioridad,
    'Abierto' AS estado,
    GETDATE() AS fechaCreacion,
    NULL AS fechaResolucion
FROM @PruebasNuevas P;

INSERT INTO [IDProjectGASCHSOFT].[dbo].[Defectos]
    (idPrueba, descripcion, prioridad, estado, fechaCreacion, fechaResolucion)
SELECT
    P.idPrueba,
    CONCAT('Descripción del defecto 2 encontrado en ', P.nombrePrueba) AS descripcion,
    'Media' AS prioridad,
    'Abierto' AS estado,
    GETDATE() AS fechaCreacion,
    NULL AS fechaResolucion
FROM @PruebasNuevas P;

-- Verificar los registros insertados
SELECT * FROM [IDProjectGASCHSOFT].[dbo].[Pruebas];
SELECT * FROM [IDProjectGASCHSOFT].[dbo].[Defectos];
-- Ejecutar hasta aca el query para poder crear y llenar toda la DB.
-- Actualizar el campo 'estado' de los proyectos con idProyecto de 82 a 91
UPDATE [IDProjectGASCHSOFT].[dbo].[Proyectos]
SET estado = CASE idProyecto
    WHEN 82 THEN 'PENDIENTE'
    WHEN 83 THEN 'IN PROGRESS'
    WHEN 84 THEN 'CANCELADO'
    WHEN 85 THEN 'FINALIZADO'
    WHEN 86 THEN 'PENDIENTE'
    WHEN 87 THEN 'IN PROGRESS'
    WHEN 88 THEN 'CANCELADO'
    WHEN 89 THEN 'FINALIZADO'
    WHEN 90 THEN 'PENDIENTE'
    WHEN 91 THEN 'IN PROGRESS'
END
WHERE idProyecto IN (127, 128, 129, 130, 131, 132, 133, 134, 135, 136);
--Actualizar tabla de proyectos
ALTER TABLE Proyectos
ADD lenguaje NVARCHAR(50) NULL;

-- Actualizar los lenguajes de cada proyecto
UPDATE Proyectos SET lenguaje = 'c_cpp' WHERE idProyecto = 150;
UPDATE Proyectos SET lenguaje = 'java' WHERE idProyecto = 151;
UPDATE Proyectos SET lenguaje = 'python' WHERE idProyecto = 152;
UPDATE Proyectos SET lenguaje = 'php' WHERE idProyecto = 153;
UPDATE Proyectos SET lenguaje = 'javascript' WHERE idProyecto = 154;
UPDATE Proyectos SET lenguaje = 'c_cpp' WHERE idProyecto = 155;
UPDATE Proyectos SET lenguaje = 'csharp' WHERE idProyecto = 156;
UPDATE Proyectos SET lenguaje = 'c_cpp' WHERE idProyecto = 157;
UPDATE Proyectos SET lenguaje = 'python' WHERE idProyecto = 158;
UPDATE Proyectos SET lenguaje = 'c_cpp' WHERE idProyecto = 159;
UPDATE Proyectos SET lenguaje = 'html' WHERE idProyecto = 160;
UPDATE Proyectos SET lenguaje = 'csharp' WHERE idProyecto = 161;
UPDATE Proyectos SET lenguaje = 'java' WHERE idProyecto = 189;
UPDATE Proyectos SET lenguaje = 'ruby' WHERE idProyecto = 190;
UPDATE Proyectos SET lenguaje = 'sql' WHERE idProyecto = 220;
