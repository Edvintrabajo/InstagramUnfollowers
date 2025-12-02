// @ts-nocheck
const fs = require('fs');

// Validar argumentos
if (process.argv.length < 4) {
  console.error('Usage: node update-index.js <indexPath> <minifiedCodePath>');
  process.exit(1);
}

const indexPath = process.argv[2];
const minifiedCodePath = process.argv[3];

// Marcadores exactos que deben existir en tu public/index.html
const CODE_BLOCK_START = 'const instagramScript = "';
const CODE_BLOCK_END = '"; //__END_OF_SCRIPT__';

const indexData = fs.readFileSync(indexPath, { encoding: 'utf8', flag: 'r' });
const minifiedCode = fs.readFileSync(minifiedCodePath, { encoding: 'utf8', flag: 'r' });

const startMarkerIndex = indexData.indexOf(CODE_BLOCK_START);
const endMarkerIndex = indexData.lastIndexOf(CODE_BLOCK_END);

// 1. Validaciones de Seguridad
if (startMarkerIndex === -1) {
  console.error(`Error: Could not find start marker: ${CODE_BLOCK_START} in ${indexPath}`);
  process.exit(1);
}

if (endMarkerIndex === -1) {
  console.error(`Error: Could not find end marker: ${CODE_BLOCK_END} in ${indexPath}`);
  process.exit(1);
}

// 2. Escapado Seguro (La mejora clave)
// JSON.stringify convierte el código en un string válido de JS automáticamente.
// Ejemplo: convierte 'console.log("hi")' en '"console.log(\"hi\")"'
// Usamos .slice(1, -1) para quitar las comillas dobles del principio y final que añade JSON.stringify,
// ya que en el HTML las comillas ya están puestas por el marcador.
const safeCode = JSON.stringify(minifiedCode).slice(1, -1);

// 3. Reemplazo
const newContent =
  indexData.substring(0, startMarkerIndex + CODE_BLOCK_START.length) +
  safeCode +
  indexData.substring(endMarkerIndex);

// 4. Guardar
fs.writeFileSync(indexPath, newContent);

console.log(`Successfully injected code into ${indexPath}`);
