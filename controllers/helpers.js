function buildParams(validParams,body){
	let params = {};

	validParams.forEach(attr=>{
	// verifica si el string (attributo) está dentro del objeto req.body
	if(Object.prototype.hasOwnProperty.call(body,attr))
		params[attr] = body[attr];
	});

	return params;
}

module.exports = { buildParams };