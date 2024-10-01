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


-- Insertar nuevos usuarios en la tabla Usuarios
INSERT INTO [IDProjectGASCHSOFT].[dbo].[Usuarios]
    (idUsuario, nombre, apellido, correo, contrasena, fechaCreacion, rol, estado)
VALUES
    ('JPerez', 'Juan', 'P�rez', 'jperez@gaschsoft.com', 'contrasena1', GETDATE(), 'Desarrollador', 'Activo'),
    ('MLopez', 'Mar�a', 'L�pez', 'mlopez@gaschsoft.com', 'contrasena2', GETDATE(), 'Administrador', 'Activo'),
    ('CRodriguez', 'Carlos', 'Rodr�guez', 'crodriguez@gaschsoft.com', 'contrasena3', GETDATE(), 'Desarrollador', 'Activo'),
    ('AGonzalez', 'Ana', 'Gonz�lez', 'agonzalez@gaschsoft.com', 'contrasena4', GETDATE(), 'Administrador', 'Activo'),
    ('LHernandez', 'Luis', 'Hern�ndez', 'lhernandez@gaschsoft.com', 'contrasena5', GETDATE(), 'Desarrollador', 'Activo'),
    ('RMorales', 'Rosa', 'Morales', 'rmorales@gaschsoft.com', 'contrasena6', GETDATE(), 'Desarrollador', 'Activo');
GO

-- Insertar nuevos proyectos en la tabla Proyectos
INSERT INTO [IDProjectGASCHSOFT].[dbo].[Proyectos]
    (idUsuario, nombreProyecto, descripcion, fechaInicio, fechaFin, estado)
VALUES
    ('JPerez', 'Calculadora B�sica', 'Desarrollo de una calculadora b�sica en C++.', GETDATE(), DATEADD(DAY, 7, GETDATE()), 'En progreso'),
    ('MLopez', 'Juego del Ahorcado', 'Implementaci�n del juego del ahorcado en Java.', GETDATE(), DATEADD(DAY, 10, GETDATE()), 'Activo'),
    ('CRodriguez', 'Agenda de Contactos', 'Creaci�n de una agenda de contactos en Python.', GETDATE(), DATEADD(DAY, 5, GETDATE()), 'Pendiente'),
    ('AGonzalez', 'Sistema de Gesti�n de Notas', 'Aplicaci�n para gestionar notas acad�micas en PHP.', GETDATE(), DATEADD(DAY, 14, GETDATE()), 'En progreso'),
    ('LHernandez', 'Conversor de Monedas', 'Programa para convertir monedas usando tasas actuales en JavaScript.', GETDATE(), DATEADD(DAY, 3, GETDATE()), 'Activo'),
    ('RMorales', 'Aplicaci�n de Tareas', 'Desarrollo de una aplicaci�n para gestionar tareas diarias en Ruby.', GETDATE(), DATEADD(DAY, 7, GETDATE()), 'En progreso');
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
        WHEN 'Calculadora B�sica' THEN 'Prueba de operaciones aritm�ticas'
        WHEN 'Juego del Ahorcado' THEN 'Prueba de l�gica del juego'
        WHEN 'Agenda de Contactos' THEN 'Prueba de creaci�n de contactos'
        WHEN 'Sistema de Gesti�n de Notas' THEN 'Prueba de c�lculo de promedio'
        WHEN 'Conversor de Monedas' THEN 'Prueba de tasas de cambio'
        WHEN 'Aplicaci�n de Tareas' THEN 'Prueba de gesti�n de tareas'
        ELSE 'Prueba general'
    END AS nombrePrueba,
    'Descripci�n de la prueba para ' + P.nombreProyecto AS descripcion,
    GETDATE() AS fechaEjecucion,
    'En progreso' AS resultado
FROM [IDProjectGASCHSOFT].[dbo].[Proyectos] P;

-- PASO 3: Insertar nuevos defectos

INSERT INTO [IDProjectGASCHSOFT].[dbo].[Defectos]
    (idPrueba, descripcion, prioridad, estado, fechaCreacion, fechaResolucion)
SELECT
    P.idPrueba,
    'Descripci�n del defecto encontrado en ' + P.nombrePrueba,
    'Alta',
    'Abierto',
    GETDATE(),
    NULL
FROM @PruebasNuevas P
WHERE P.nombrePrueba LIKE 'Prueba%';

-- Verificar los registros insertados
SELECT * FROM [IDProjectGASCHSOFT].[dbo].[Pruebas];
SELECT * FROM [IDProjectGASCHSOFT].[dbo].[Defectos];