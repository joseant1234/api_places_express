const buildParams = require('./helpers').buildParams;

const validParams = ['_place','reactions','observation'];

const Visit = require('../models/Visit');
const User = require('../models/User');


function find(req,res,next){
	Visit.findById(req.params.visit_id).then(visit=>{
		req.mainObj = visit;
		req.visit = visit;
		next();
	}).catch(next);
}

function index(req,res){
	let promise = null


	// si la ruta es /places/:id/visits/:visit_id, se encontro un lugar y hay req.place
	if(req.place){
		promise = req.place.visits;
	}else if(req.user){
		// si hay un usuario la ruta es /visits, son las visitas del usuario logeado
		promise = Visit.forUser(req.user.id, req.query.page || 1)
	}

	if(promise){
		promise.then(visits=>{
			res.json(visits);
		}).catch(error=>{
			res.status(500).json({error})
		})
	}else{
		res.status(404).json({});
	}
}

function create(req,res){
	let params = buildParams(validParams,req.body);
	params['_user'] = req.user.id;
	Visit.create(params)
		.then(visit=>{
			res.json(visit);
		}).catch(error=>{
			res.status(422).json({error});
		})

}

function destroy(req,res){
	req.visit.remove().then(doc=>{
		res.json({})
	}).catch(error=>{
		res.status(500).json({error});
	})
}


module.exports = { find, create, destroy, index }