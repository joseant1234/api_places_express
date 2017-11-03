// multer es un libreria q permite leer los archivos q se envia como parametro
const multer = require('multer');

// dest es el destino donde se guarda las subida de archivos
module.exports = multer({dest: 'uploads/'})