const Place = require('../models/Place');
// upload es un modelo q permite subir archivos
const upload = require('../config/upload');
const uploader = require('../models/Uploader');
const helpers = require('./helpers');
const FavoritePlace = require('../models/FavoritePlace');
const User = require('../models/User');

const validParams = ['title','description','address','acceptsCreditCard','openHour','closeHour'];

// middleware, next es una funcion que se recibe como un parametro. Next permite continuar con la cadena de middleware que se están ejecutando
function find(req,res,next){
	Place.findOne({slug: req.params.id})
	.then(place=>{
		// se guarda el objeto place en un local de req para ser usado en los siguietnes middleware o metodos del controlador
		req.place = place;
		req.mainObj = place;
		next();
	}).catch(err=>{
		// se envia el error a next para q express conozca q hubo un error
		// si se envia un argumento a next, se asume que es un error
		next(err);
	});
}

function index(req,res){
	// los atributos que van luego de ? de una URL van en el objeto req.query
	Place.paginate({},{page: req.query.page || 1, limit: 28, sort: {'_id': -1} })
	.then(docs=>{
		res.json(docs);
	}).catch(err=>{
		console.log(err);
		   res.json(err);
	});
}

function users(req,res){
	FavoritePlace.find({'_place': req.place._id},{'_user': true})
		.then(favs=>{
			let usersIds = favs.map(fav => fav._user);
			User.find({'_id': {$in: usersIds}}).then(users=>{
				res.json(users)
			}).catch(err=>{
				res.json(err)
			})
		}).catch(err=>{
			res.json({err})
		})
}

function show(req,res){
	res.json(req.place);
}

function create(req,res,next){
	const params = helpers.buildParams(validParams,req.body);
	// el objeto req.user lo pone el middleware de jwt
	params['_user'] = req.user.id;
	Place.create(params).then(doc =>{
    	req.place = doc;
    	next();
  	}).catch(err=>{
    	// console.log(err);
    	// res.json(err);
    	next(err);
  	});
}

function update(req,res){
	const params = helpers.buildParams(validParams,req.body);
	req.place = Object.assign(req.place,params);

	req.place.save()
	.then(doc=>{	
		res.json(doc);
	}).catch(err=>{
		console.log(err);
		res.json(err);
	});

}

function destroy(req,res){
	// Place.findByIdAndRemove(req.params.id)
	// .then(doc=>{
	// 	res.json({})
	// }).catch(err=>{
	// 	console.log(err);
	// 	res.json(err);
	// });
	req.place.remove()
	.then(doc=>{
		res.json({})
	}).catch(err=>{
		console.log(err);
		res.json(err);
	});
}

// este middleware no tiene next, por tanto en la ruta places se ejecuta, porque el upload.fields es el middleware que lo hace multer
function multerMiddleware(){
	// fields es un metodo q permite especificar una coleccion de nombres con los que van a venir los distinos archivos q se reciben
	// se usa fields es porque se va a recibir 2 archivos: avatar y una portada
	// si se usa un archivo se puede utilizar el metodo upload.single('avatar');
	// maxCount es la cantidad maxima de archivos que se puede subir por cada name
	// en caso de una galeria {name: 'gallery', maxCount: 27}, permitiendo subir como max 27 archivos para gallery
	return upload.fields([
		{name: 'avatar', maxCount: 1},
		{name: 'cover', maxCount: 1}
	]);
}

function saveImage(req,res){
	if(req.place){
		const files = ['avatar','cover'];
		const promises = [];

		files.forEach(imageType=>{
			// la propiedad files lo hace multer con las opciones del upload.fields
			if(req.files && req.files[imageType]){
				// el path de la primera imagen
				const path = req.files[imageType][0].path;
				promises.push(req.place.updateImage(path,imageType));
			}
		});

		Promise.all(promises).then(results=>{
			console.log(results);
			res.json(req.place);
		}).catch(err=>{
			console.log(err);
			res.json(err);
		});
	
	}else{
		res.status(422).json({
			error: req.error || 'Could not save place'
		});
	}
}

module.exports = {index,show,create,update,destroy,find,multerMiddleware,saveImage, users}