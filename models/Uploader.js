const cloudinary = require('cloudinary');

const secrets = require('../config/secrets');

cloudinary.config(secrets.cloudinary);

module.exports = function(imagePath){

	return new Promise((resolve,reject)=>{
		cloudinary.uploader.upload(imagePath,function(result){
			console.log(result);
			// secure_url es un ruta segura (con https)
			if(result.secure_url) return resolve(result.secure_url);
			
			reject(new Error('Error with cloudinary'));
		})
	})
}