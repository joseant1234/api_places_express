const express = require('express');
let router = express.Router();

const authenticateOwner = require('../middlewares/authenticateOwner');
const visitsController = require('../controllers/visitsController');

const jwtMiddleware = require('express-jwt');
const secrets = require('../config/secrets');


// el middleware valida que exista un token válido y pone el usuario en el objeto req
router.route('/')
	.get(jwtMiddleware({secret: secrets.jwtSecret}),visitsController.index)
	.post(visitsController.create);

router.route('/:visit_id')
	.delete(visitsController.find,authenticateOwner,visitsController.destroy)

module.exports = router;