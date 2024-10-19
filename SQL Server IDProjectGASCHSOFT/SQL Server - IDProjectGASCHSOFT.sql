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
-- Insertar datos nuevos *****************************************************
-- Insertar nuevos proyectos en la tabla Proyectos
INSERT INTO [IDProjectGASCHSOFT].[dbo].[Proyectos]
    (idUsuario, nombreProyecto, descripcion, fechaInicio, fechaFin, estado)
VALUES
    ('JPerez', 'Calculadora B�sica', 'Desarrollo de una calculadora b�sica en C++.', '2024-10-01', DATEADD(DAY, 7, '2024-10-01'), 'CANCELADO'),
    ('MLopez', 'Juego del Ahorcado', 'Implementaci�n del juego del ahorcado en Java.', '2024-10-01', DATEADD(DAY, 10, '2024-10-01'), 'CANCELADO'),
    ('CRodriguez', 'Agenda de Contactos', 'Creaci�n de una agenda de contactos en Python.', '2024-10-01', DATEADD(DAY, 5, '2024-10-01'), 'CANCELADO'),
    ('AGonzalez', 'Sistema de Gesti�n de Notas', 'Aplicaci�n para gestionar notas acad�micas en PHP.', '2024-10-01', DATEADD(DAY, 14, '2024-10-01'), 'CANCELADO'),
    ('LHernandez', 'Conversor de Monedas', 'Programa para convertir monedas usando tasas actuales en JavaScript.', '2024-10-01', DATEADD(DAY, 3, '2024-10-01'), 'CANCELADO'),
    ('RMorales', 'Aplicaci�n de Tareas', 'Desarrollo de una aplicaci�n para gestionar tareas diarias en Ruby.', '2024-10-01', DATEADD(DAY, 7, '2024-10-01'), 'CANCELADO'),
    ('JPerez', 'Sistema de Login', 'Desarrollo de un sistema de autenticaci�n de usuarios.', '2024-10-02', DATEADD(DAY, 10, '2024-10-02'), 'CANCELADO'),
    ('MLopez', 'Aplicaci�n de Chat', 'Implementaci�n de una aplicaci�n de chat en tiempo real.', '2024-10-02', DATEADD(DAY, 12, '2024-10-02'), 'CANCELADO'),
    ('CRodriguez', 'Blog Personal', 'Creaci�n de un blog personal para publicar art�culos.', '2024-10-02', DATEADD(DAY, 8, '2024-10-02'), 'CANCELADO'),
    ('AGonzalez', 'Galer�a de Fotos', 'Desarrollo de una galer�a de fotos para compartir im�genes.', '2024-10-02', DATEADD(DAY, 15, '2024-10-02'), 'CANCELADO');
-- No GO aqu�

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
    CONCAT('Descripci�n de la prueba 1 para ', P.nombreProyecto) AS descripcion,
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
    CONCAT('Descripci�n de la prueba 2 para ', P.nombreProyecto) AS descripcion,
    '2024-10-08' AS fechaEjecucion,
    'En progreso' AS resultado
FROM @TodosProyectos P;

-- PASO 3: Insertar nuevos defectos

-- Insertar 2 defectos por cada prueba
INSERT INTO [IDProjectGASCHSOFT].[dbo].[Defectos]
    (idPrueba, descripcion, prioridad, estado, fechaCreacion, fechaResolucion)
SELECT
    P.idPrueba,
    CONCAT('Descripci�n del defecto 1 encontrado en ', P.nombrePrueba) AS descripcion,
    'Alta' AS prioridad,
    'Abierto' AS estado,
    GETDATE() AS fechaCreacion,
    NULL AS fechaResolucion
FROM @PruebasNuevas P;

INSERT INTO [IDProjectGASCHSOFT].[dbo].[Defectos]
    (idPrueba, descripcion, prioridad, estado, fechaCreacion, fechaResolucion)
SELECT
    P.idPrueba,
    CONCAT('Descripci�n del defecto 2 encontrado en ', P.nombrePrueba) AS descripcion,
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
