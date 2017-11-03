const express = require('express');

let router = express.Router();

const placesController = require('../controllers/PlacesController.js')
const authenticateOwner = require('../middlewares/authenticateOwner');

// en post se ejecuta multerMiddleware, no tiene next, por tanto se recibe el valor de la funcion
router.route('/')
	.get(placesController.index)
	.post(placesController.multerMiddleware(),placesController.create,placesController.saveImage)

router.route('/:id')
	.get(placesController.find,placesController.show)
	.put(placesController.find,authenticateOwner,placesController.update)
	.delete(placesController.find,authenticateOwner,placesController.destroy)

router.route('/:id/users')
	.get(placesController.find,placesController.users)

module.exports = router;
