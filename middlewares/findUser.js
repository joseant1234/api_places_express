const User = require('../models/User');

module.exports = function(req,res,next){
	// req.user tiene la información del ID
	if(req.user){
		User.findById(req.user.id).then(user=>{
			req.fullUser = user;
			next();
		})
	}else{
		next();	
	}
	
	
}