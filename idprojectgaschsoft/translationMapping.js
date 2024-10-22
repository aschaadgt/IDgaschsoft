// translationMapping.js

const translationMapping = {
  'no-unused-vars': {
      message: 'La variable "{variable}" está declarada pero nunca se utiliza.',
      level: 'High'
  },
  'no-undef': {
      message: 'La variable "{variable}" no está definida.',
      level: 'Critical'
  },
  'no-redeclare': {
      message: 'La variable "{variable}" ya ha sido declarada.',
      level: 'High'
  },
  'eqeqeq': {
      message: 'Se esperaba "===" y en su lugar se encontró "==".',
      level: 'Medium'
  },
  'semi': {
      message: 'Falta punto y coma al final de la declaración.',
      level: 'Low'
  },
  'quotes': {
      message: 'Las cadenas deben usar comillas simples o dobles de manera consistente.',
      level: 'Low'
  },
  'no-var': {
      message: 'Evita usar "var"; utiliza "let" o "const" en su lugar.',
      level: 'Medium'
  },
  'func-names': {
      message: 'Las funciones deben tener un nombre.',
      level: 'Low'
  },
  'no-unused-expressions': {
      message: 'Expresión innecesaria; quizás olvidaste una llamada a función.',
      level: 'Medium'
  },
  'no-eval': {
      message: 'El uso de "eval" puede ser perjudicial.',
      level: 'Critical'
  },
  'no-console': {
      message: 'Evita usar "console" en el código de producción.',
      level: 'Best Practice'
  },
  'no-debugger': {
      message: 'Evita usar "debugger"; elimina los puntos de interrupción antes de enviar el código.',
      level: 'High'
  },
  'no-dupe-args': {
      message: 'No se permiten parámetros duplicados en las funciones.',
      level: 'Critical'
  },
  'no-empty': {
      message: 'No se permiten bloques vacíos de código.',
      level: 'Low'
  },
  'no-extra-semi': {
      message: 'Elimina los puntos y comas innecesarios.',
      level: 'Low'
  },
  'no-func-assign': {
      message: 'No reasignes una función declarada.',
      level: 'High'
  },
  'no-unreachable': {
      message: 'El código después de un "return", "throw", "continue" o "break" es inaccesible.',
      level: 'High'
  },
  'valid-typeof': {
      message: 'Usa literales de cadena válidos con el operador "typeof".',
      level: 'Medium'
  },
  'curly': {
      message: 'Se requieren llaves para todos los bloques.',
      level: 'Medium'
  },
  'no-duplicate-case': {
      message: 'No se permiten casos duplicados en una sentencia "switch".',
      level: 'High'
  },
  'no-ex-assign': {
      message: 'No reasignes el valor de "exception" en un "catch".',
      level: 'Critical'
  },
  'no-extra-boolean-cast': {
      message: 'Elimina las conversiones booleanas innecesarias.',
      level: 'Medium'
  },
  'no-inner-declarations': {
      message: 'No declares funciones dentro de bloques no permitidos.',
      level: 'Medium'
  },
  'no-irregular-whitespace': {
      message: 'Elimina espacios en blanco irregulares.',
      level: 'Low'
  },
  'no-obj-calls': {
      message: 'No llames a objetos globales como funciones.',
      level: 'High'
  },
  'no-prototype-builtins': {
      message: 'No llames directamente a métodos de Object.prototype.',
      level: 'Medium'
  },
  'no-sparse-arrays': {
      message: 'Evita las matrices dispersas.',
      level: 'Low'
  },
  'no-unexpected-multiline': {
      message: 'Evita errores de línea nueva inesperados.',
      level: 'High'
  },
  'no-unsafe-finally': {
      message: 'El bloque "finally" no debe anular el control de flujo.',
      level: 'Critical'
  },
  'no-unsafe-negation': {
      message: 'Evita la negación incorrecta de la izquierda en expresiones relacionales.',
      level: 'High'
  },
  'use-isnan': {
      message: 'Utiliza "isNaN()" para comprobar si un valor es NaN.',
      level: 'Medium'
  },
  'no-global-assign': {
      message: 'No reasignes variables globales.',
      level: 'High'
  },
  'no-self-assign': {
      message: 'Evita asignaciones de una variable a sí misma.',
      level: 'Medium'
  },
  'no-self-compare': {
      message: 'Evita comparaciones de una variable consigo misma.',
      level: 'Low'
  },
  'no-shadow-restricted-names': {
      message: 'No declares variables con nombres reservados en JavaScript.',
      level: 'Critical'
  },
  'no-delete-var': {
      message: 'No uses el operador "delete" en variables.',
      level: 'High'
  },
  'no-dupe-class-members': {
      message: 'No definas miembros de clase duplicados.',
      level: 'High'
  },
  'no-duplicate-imports': {
      message: 'Combina múltiples importaciones desde un mismo módulo.',
      level: 'Medium'
  },
  'no-mixed-spaces-and-tabs': {
      message: 'No mezcles espacios y tabulaciones en la indentación.',
      level: 'Low'
  },
  'no-new-symbol': {
      message: 'No utilices "new" con el constructor "Symbol".',
      level: 'High'
  },
  'no-this-before-super': {
      message: 'No uses "this" antes de llamar a "super()" en un constructor.',
      level: 'Critical'
  },
  'constructor-super': {
      message: 'Las clases derivadas deben llamar a "super()" en el constructor.',
      level: 'Critical'
  },
  'prefer-const': {
      message: 'Utiliza "const" cuando una variable no sea reasignada.',
      level: 'Medium'
  },
  'no-class-assign': {
      message: 'No reasignes una clase declarada.',
      level: 'Critical'
  },
  'no-const-assign': {
      message: 'No reasignes una variable declarada con "const".',
      level: 'Critical'
  },
  'no-dupe-keys': {
      message: 'No definas claves duplicadas en un objeto.',
      level: 'High'
  },
  'no-new-wrappers': {
      message: 'Evita usar constructores de tipos primitivos como "String", "Number", "Boolean".',
      level: 'High'
  },
  'no-multi-spaces': {
      message: 'Evita el uso de múltiples espacios consecutivos.',
      level: 'Low'
  },
  'no-trailing-spaces': {
      message: 'Elimina espacios en blanco al final de las líneas.',
      level: 'Low'
  },
  'comma-dangle': {
      message: 'Evita comas al final de objetos o arreglos.',
      level: 'Low'
  },
  'space-before-blocks': {
      message: 'Agrega un espacio antes de las llaves que abren bloques.',
      level: 'Low'
  },
  'keyword-spacing': {
      message: 'Asegúrate de que hay espacios antes y después de las palabras clave.',
      level: 'Low'
  },
  'space-infix-ops': {
      message: 'Agrega espacios alrededor de los operadores infijos.',
      level: 'Low'
  },
  'eol-last': {
      message: 'Agrega una línea en blanco al final del archivo.',
      level: 'Low'
  },
  'brace-style': {
      message: 'Usa un estilo consistente para las llaves en bloques de código.',
      level: 'Low'
  },
  'camelcase': {
      message: 'Utiliza notación camelCase para nombrar variables y funciones.',
      level: 'Low'
  },
  'indent': {
      message: 'Indenta el código usando espacios o tabulaciones de manera consistente.',
      level: 'Low'
  },
  'linebreak-style': {
      message: 'Usa un estilo de salto de línea consistente (LF o CRLF).',
      level: 'Low'
  },
  'max-len': {
      message: 'La longitud de la línea excede el máximo permitido.',
      level: 'Low'
  },
  'no-array-constructor': {
      message: 'Evita usar el constructor "Array"; utiliza literales de arreglo en su lugar.',
      level: 'Medium'
  },
  'no-new-object': {
      message: 'Evita usar el constructor "Object"; utiliza literales de objeto en su lugar.',
      level: 'Medium'
  },
  'spaced-comment': {
      message: 'Agrega un espacio después de los caracteres de comentario.',
      level: 'Low'
  },
  'space-before-function-paren': {
      message: 'Agrega un espacio antes de los paréntesis de las funciones.',
      level: 'Low'
  },

  'no-template-curly-in-string': {
        message: 'Espaciado inesperado en la expresión de la plantilla de texto.',
        level: 'Low'
    },

  // Traducción para proyectos en lenguajes no soportados
  'unsupported-language': {
      message: 'El análisis de código no está disponible para el lenguaje "{language}".',
      level: 'Critical'
  },
  // Agrega más reglas y sus traducciones según tus necesidades
};

module.exports = translationMapping;
