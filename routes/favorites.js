const express = require('express');
let router = express.Router();

const authenticateOwner = require('../middlewares/authenticateOwner');
const findUser = require('../middlewares/findUser');

const favoritesController = require('../controllers/FavoritesController');

const jwtMiddleware = require('express-jwt');
const secrets = require('../config/secrets');

// en app.js se puso que las rutas GET no requiran token
// para los favoritos del usuario actual, si es necesario el token
// para entrar a la funcion index es necesario que el usuario este logeado (con un token)
router.route('/')
	.get(jwtMiddleware({secret: secrets.jwtSecret}),findUser,favoritesController.index)
	.post(favoritesController.create);

router.route('/:id')
	.delete(favoritesController.find,authenticateOwner,favoritesController.destroy)


module.exports = router;

