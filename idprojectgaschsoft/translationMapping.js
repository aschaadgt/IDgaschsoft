// translationMapping.js

// Definición de niveles de severidad estandarizados, podemos editar 'Critical' a 'Critico' para cambiarlo
const SEVERITY_LEVELS = {
  CRITICAL: 'Critical',
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
  BEST_PRACTICE: 'Best Practice'
};

// Mapeo de reglas de ESLint a mensajes personalizados y niveles de severidad
const translationMapping = {
  'no-unused-vars': {
      message: 'La variable "{variable}" está declarada pero nunca se utiliza.',
      level: SEVERITY_LEVELS.HIGH
  },
  'no-undef': {
      message: 'La variable "{variable}" no está definida.',
      level: SEVERITY_LEVELS.CRITICAL
  },
  'no-redeclare': {
      message: 'La variable "{variable}" ya ha sido declarada.',
      level: SEVERITY_LEVELS.HIGH
  },
  'eqeqeq': {
      message: 'Se esperaba "===" y en su lugar se encontró "==".',
      level: SEVERITY_LEVELS.MEDIUM
  },
  'semi': {
      message: 'Falta punto y coma al final de la declaración.',
      level: SEVERITY_LEVELS.LOW
  },
  'quotes': {
      message: 'Las cadenas deben usar comillas simples o dobles de manera consistente.',
      level: SEVERITY_LEVELS.LOW
  },
  'no-var': {
      message: 'Evita usar "var"; utiliza "let" o "const" en su lugar.',
      level: SEVERITY_LEVELS.MEDIUM
  },
  'func-names': {
      message: 'Las funciones deben tener un nombre.',
      level: SEVERITY_LEVELS.LOW
  },
  'no-unused-expressions': {
      message: 'Expresión innecesaria; quizás olvidaste una llamada a función.',
      level: SEVERITY_LEVELS.MEDIUM
  },
  'no-eval': {
      message: 'El uso de "eval" puede ser perjudicial.',
      level: SEVERITY_LEVELS.CRITICAL
  },
  'no-console': {
      message: 'Evita usar "console" en el código de producción.',
      level: SEVERITY_LEVELS.BEST_PRACTICE
  },
  'no-debugger': {
      message: 'Evita usar "debugger"; elimina los puntos de interrupción antes de enviar el código.',
      level: SEVERITY_LEVELS.HIGH
  },
  'no-dupe-args': {
      message: 'No se permiten parámetros duplicados en las funciones.',
      level: SEVERITY_LEVELS.CRITICAL
  },
  'no-empty': {
      message: 'No se permiten bloques vacíos de código.',
      level: SEVERITY_LEVELS.LOW
  },
  'no-extra-semi': {
      message: 'Elimina los puntos y comas innecesarios.',
      level: SEVERITY_LEVELS.LOW
  },
  'no-func-assign': {
      message: 'No reasignes una función declarada.',
      level: SEVERITY_LEVELS.HIGH
  },
  'no-unreachable': {
      message: 'El código después de un "return", "throw", "continue" o "break" es inaccesible.',
      level: SEVERITY_LEVELS.HIGH
  },
  'valid-typeof': {
      message: 'Usa literales de cadena válidos con el operador "typeof".',
      level: SEVERITY_LEVELS.MEDIUM
  },
  'curly': {
      message: 'Se requieren llaves para todos los bloques.',
      level: SEVERITY_LEVELS.MEDIUM
  },
  'no-duplicate-case': {
      message: 'No se permiten casos duplicados en una sentencia "switch".',
      level: SEVERITY_LEVELS.HIGH
  },
  'no-ex-assign': {
      message: 'No reasignes el valor de "exception" en un "catch".',
      level: SEVERITY_LEVELS.CRITICAL
  },
  'no-extra-boolean-cast': {
      message: 'Elimina las conversiones booleanas innecesarias.',
      level: SEVERITY_LEVELS.MEDIUM
  },
  'no-inner-declarations': {
      message: 'No declares funciones dentro de bloques no permitidos.',
      level: SEVERITY_LEVELS.MEDIUM
  },
  'no-irregular-whitespace': {
      message: 'Elimina espacios en blanco irregulares.',
      level: SEVERITY_LEVELS.LOW
  },
  'no-obj-calls': {
      message: 'No llames a objetos globales como funciones.',
      level: SEVERITY_LEVELS.HIGH
  },
  'no-prototype-builtins': {
      message: 'No llames directamente a métodos de Object.prototype.',
      level: SEVERITY_LEVELS.MEDIUM
  },
  'no-sparse-arrays': {
      message: 'Evita las matrices dispersas.',
      level: SEVERITY_LEVELS.LOW
  },
  'no-unexpected-multiline': {
      message: 'Evita errores de línea nueva inesperados.',
      level: SEVERITY_LEVELS.HIGH
  },
  'no-unsafe-finally': {
      message: 'El bloque "finally" no debe anular el control de flujo.',
      level: SEVERITY_LEVELS.CRITICAL
  },
  'no-unsafe-negation': {
      message: 'Evita la negación incorrecta de la izquierda en expresiones relacionales.',
      level: SEVERITY_LEVELS.HIGH
  },
  'use-isnan': {
      message: 'Utiliza "isNaN()" para comprobar si un valor es NaN.',
      level: SEVERITY_LEVELS.MEDIUM
  },
  'no-global-assign': {
      message: 'No reasignes variables globales.',
      level: SEVERITY_LEVELS.HIGH
  },
  'no-self-assign': {
      message: 'Evita asignaciones de una variable a sí misma.',
      level: SEVERITY_LEVELS.MEDIUM
  },
  'no-self-compare': {
      message: 'Evita comparaciones de una variable consigo misma.',
      level: SEVERITY_LEVELS.LOW
  },
  'no-shadow-restricted-names': {
      message: 'No declares variables con nombres reservados en JavaScript.',
      level: SEVERITY_LEVELS.CRITICAL
  },
  'no-delete-var': {
      message: 'No uses el operador "delete" en variables.',
      level: SEVERITY_LEVELS.HIGH
  },
  'no-dupe-class-members': {
      message: 'No definas miembros de clase duplicados.',
      level: SEVERITY_LEVELS.HIGH
  },
  'no-duplicate-imports': {
      message: 'Combina múltiples importaciones desde un mismo módulo.',
      level: SEVERITY_LEVELS.MEDIUM
  },
  'no-mixed-spaces-and-tabs': {
      message: 'No mezcles espacios y tabulaciones en la indentación.',
      level: SEVERITY_LEVELS.LOW
  },
  'no-new-symbol': {
      message: 'No utilices "new" con el constructor "Symbol".',
      level: SEVERITY_LEVELS.HIGH
  },
  'no-this-before-super': {
      message: 'No uses "this" antes de llamar a "super()" en un constructor.',
      level: SEVERITY_LEVELS.CRITICAL
  },
  'constructor-super': {
      message: 'Las clases derivadas deben llamar a "super()" en el constructor.',
      level: SEVERITY_LEVELS.CRITICAL
  },
  'prefer-const': {
      message: 'Utiliza "const" cuando una variable no sea reasignada.',
      level: SEVERITY_LEVELS.MEDIUM
  },
  'no-class-assign': {
      message: 'No reasignes una clase declarada.',
      level: SEVERITY_LEVELS.CRITICAL
  },
  'no-const-assign': {
      message: 'No reasignes una variable declarada con "const".',
      level: SEVERITY_LEVELS.CRITICAL
  },
  'no-dupe-keys': {
      message: 'No definas claves duplicadas en un objeto.',
      level: SEVERITY_LEVELS.HIGH
  },
  'no-new-wrappers': {
      message: 'Evita usar constructores de tipos primitivos como "String", "Number", "Boolean".',
      level: SEVERITY_LEVELS.HIGH
  },
  'no-multi-spaces': {
      message: 'Evita el uso de múltiples espacios consecutivos.',
      level: SEVERITY_LEVELS.LOW
  },
  'no-trailing-spaces': {
      message: 'Elimina espacios en blanco al final de las líneas.',
      level: SEVERITY_LEVELS.LOW
  },
  'comma-dangle': {
      message: 'Evita comas al final de objetos o arreglos.',
      level: SEVERITY_LEVELS.LOW
  },
  'space-before-blocks': {
      message: 'Agrega un espacio antes de las llaves que abren bloques.',
      level: SEVERITY_LEVELS.LOW
  },
  'keyword-spacing': {
      message: 'Asegúrate de que hay espacios antes y después de las palabras clave.',
      level: SEVERITY_LEVELS.LOW
  },
  'space-infix-ops': {
      message: 'Agrega espacios alrededor de los operadores infijos.',
      level: SEVERITY_LEVELS.LOW
  },
  'eol-last': {
      message: 'Agrega una línea en blanco al final del archivo.',
      level: SEVERITY_LEVELS.LOW
  },
  'brace-style': {
      message: 'Usa un estilo consistente para las llaves en bloques de código.',
      level: SEVERITY_LEVELS.LOW
  },
  'camelcase': {
      message: 'Utiliza notación camelCase para nombrar variables y funciones.',
      level: SEVERITY_LEVELS.LOW
  },
  'indent': {
      message: 'Indenta el código usando espacios o tabulaciones de manera consistente.',
      level: SEVERITY_LEVELS.LOW
  },
  'linebreak-style': {
      message: 'Usa un estilo de salto de línea consistente (LF o CRLF).',
      level: SEVERITY_LEVELS.LOW
  },
  'max-len': {
      message: 'La longitud de la línea excede el máximo permitido.',
      level: SEVERITY_LEVELS.LOW
  },
  'no-array-constructor': {
      message: 'Evita usar el constructor "Array"; utiliza literales de arreglo en su lugar.',
      level: SEVERITY_LEVELS.MEDIUM
  },
  'no-new-object': {
      message: 'Evita usar el constructor "Object"; utiliza literales de objeto en su lugar.',
      level: SEVERITY_LEVELS.MEDIUM
  },
  'spaced-comment': {
      message: 'Agrega un espacio después de los caracteres de comentario.',
      level: SEVERITY_LEVELS.LOW
  },
  'space-before-function-paren': {
      message: 'Agrega un espacio antes de los paréntesis de las funciones.',
      level: SEVERITY_LEVELS.LOW
  },

  'no-template-curly-in-string': {
      message: 'Espaciado inesperado en la expresión de la plantilla de texto.',
      level: SEVERITY_LEVELS.LOW
  },

  // Traducción para proyectos en lenguajes no soportados
  'unsupported-language': {
      message: 'El análisis de código no está disponible para el lenguaje "{language}".',
      level: SEVERITY_LEVELS.CRITICAL
  },
  // Agrega más reglas y sus traducciones según tus necesidades
};

module.exports = { translationMapping, SEVERITY_LEVELS };
