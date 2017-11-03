const expressUnless = require('express-unless');

module.exports = function(options){
	let CORsMiddleware = function(req,res,next){
		
		if(req.application){
			req.application.origins.split(",").forEach(origin => {
				res.header("Access-Control-Allow-Origin", origin);	
			})			
		}else{
			// permite responder peticiones AJAX desde cualquier dominio o URL (*)
			res.header("Access-Control-Allow-Origin","*");
		}

		// valida el tipo de encabezados que se pueden recibir de una solicitud. Son los encabezados váidos
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization,Application");
		next();
	}

	CORsMiddleware.unless = expressUnless;

	return CORsMiddleware;
}