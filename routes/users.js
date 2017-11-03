const express = require('express');
const router = express.Router();


const usersController = require('../controllers/UsersController');
const sessionsController = require('../controllers/SessionsController');
const jwtMiddleware = require('express-jwt');
const secrets = require('../config/secrets');


router.route('/')
	.post(usersController.create,sessionsController.generateToken,sessionsController.sendToken)
	.get(jwtMiddleware({secret: secrets.jwtSecret}),usersController.myPlaces)

	
module.exports = router;
