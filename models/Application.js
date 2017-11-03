const mongoose = require('mongoose');
const randomstring = require('randomstring');

function assignRandomAndUniqueValueToField(app,field,next){
	// randomstring.generate(cantidad_caracteres)
	const randomString = randomstring.generate(20);
	let searchCriteria = {};
	searchCriteria[field] = randomString

	Application.count(searchCriteria).then(count=>{
		// si hay al menos un documento con el mismo valor de searchCriteria[field], se ejecuta otra vez la función
		if(count > 0) return assignRandomAndUniqueValueToField(app,field,next);
		app[field] = randomString;
		next();
	})
}


// applicationId es público, usado por los clientes con JS
// la aplicaciones que consumen el servicio web desde el servidor, envían un secreto. Este secreto debe ser privado.
// en origins van los dominios válidos que pueden ejecutar AJAX. Este campo ayuda en seguridad a la applicationId
// name sirve para identificar la aplicación
let applicationSchema = new mongoose.Schema({
	applicationId: {
		type: String,
		required: true,
		unique: true
	},
	secret:{
		type: String,
		required: true,
		unique: true
	},
	origins: String,
	name: String
})

// el hook se dispara antes de validar el objeto
applicationSchema.pre('validate',function(next){
	// al terminar la ejecución de assignRandomAndUniqueValueToField se llamada el otro assignRandomAndUniqueValueToField
	assignRandomAndUniqueValueToField(this,'applicationId',()=>{
		assignRandomAndUniqueValueToField(this,'secret',next);
	})
})

const Application = mongoose.model('Application',applicationSchema);

module.exports = Application;