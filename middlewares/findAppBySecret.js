const Application = require('../models/Application');

module.exports = function(req,res,next){
	// si la petición es AJAX sigue el flujo
	if(req.xhr) return next();
	// si la petición no es AJAX se almacena el secret del header
	const secret = req.headers.secret;
	if(!secret) return next();
	// shorthand property
	Application.findOne({secret})
		.then(app=>{
			if(!app) return next(new Error('Invalid application'));
			req.application = app;
			req.validRequest = true;
			next();
		}).catch(error=>{
			next(error);
		});

}