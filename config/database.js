const mongoose = require('mongoose');

const dbName = 'places_api';

// shorthand properties: si la clave tiene el mismo nombre de la variable del valor se pone solo el nombre de la variable para hacer referencia a la clave y valor
// se exporta dichos valores para ser usado en los modelos y otros archivos
module.exports = {
	connect: ()=> mongoose.connect('mongodb://localhost/'+dbName,{useMongoClient: true}),
	dbName,
	connection: ()=>{
		if(mongoose.connection)
			return mongoose.connection;
		return this.connect();
	}
}