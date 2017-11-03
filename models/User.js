const mongoose = require('mongoose');
const mongooseBcrypt = require('mongoose-bcrypt');
const Place = require('./Place');
const FavoritePlace = require('./FavoritePlace');

// la prop unique agrega un indice único para buscar por email. No es una validacion
let userSchema = new mongoose.Schema({
	email:{
		type: String,
		required: true,
		unique: true
	},
	name: String,
	admin:{
		type: Boolean,
		default: false
	}
});

// post se ejecuta luego de guardar (save)
userSchema.post('save',function(user,next){
	User.count({}).then(count=>{
		if(count == 1){
			// user es el objeto que dispara el hook luego de que se halla guardado
			// al guardarse (actualizarse) se dispara otra ves el hook, porque es una operación save
			// user.admin = true
			// user.save().then(next);
			// Por eso se usa un metodo que no ejecuta hook
			User.update({'_id': user.id},{admin: true}).then(result=>{
				next();
			});
		}else{
			next();
		}
	})
});

userSchema.virtual('places').get(function(){
	// this es el usuario que está ejecutando el virtual
	return Place.find({'_user': this._id})
});

// los lugares favoritos de un usuario
userSchema.virtual('favorites').get(function(){
	// _place: true es para que solo se obtenga el campo _place
	return FavoritePlace.find({'_user': this._id},{'_place': true})
			.then(favs =>{
				let placesIds = favs.map(fav => fav._place);
				// select IN
				console.log(placesIds)
				return Place.find({'_id': {$in: placesIds } })
			});
})

// este plugin agrega el campo password y metodos (verifyPassword, ....)
userSchema.plugin(mongooseBcrypt);

const User = mongoose.model('User',userSchema);

module.exports = User;