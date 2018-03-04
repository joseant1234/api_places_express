var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
// para registrar en un log las peticiones solcitiadas
var logger = require('morgan');
// para leer las cookies que vienen del navegador, pero al usar JSON no se va utiloziar cookies
// var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// middleware verifica q sea valido el json web token, si es valido genera una propiedad user dentro de req, si token es invalido envia un error y no permite el flujo del app
const jwtMiddleware = require('express-jwt');

const places = require('./routes/places');
const users = require('./routes/users');
const sessions = require('./routes/sessions');
const favorites = require('./routes/favorites');
const visits = require('./routes/visits');
const visitsPlaces = require('./routes/visitsPlaces');
const applications = require('./routes/applications');


const findAppBySecret = require('./middlewares/findAppBySecret');
const findAppByApplicationId = require('./middlewares/findAppByApplicationId');
const authApp = require('./middlewares/authApp')();
const allowCORs = require('./middlewares/allowCORs')();

const db = require('./config/database.js');
const secrets = require('./config/secrets');

db.connect();
var app = express();

// view engine setup
// Debido a q se va usar API con JSON, no se va a usar vistas html con JADE
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json());


app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// const Application = require('./models/Application');
// app.get('/demo',function(req,res){
//   Application.remove({}).then(r=> res.json({}));
// })

// montar los middlewares
app.use(findAppBySecret)
app.use(findAppByApplicationId);
// por la peticion preflight en CORs se pone unless method OPTIONS. No autentica con la petición en OPTIONS (preflight)
// app.use(authApp.unless({method: 'OPTIONS'}));
// permite las peticiones excepto en las carpeta public
app.use(allowCORs.unless({path: '/public'}));

// con este middleware montado, todas las peticiones van requerir un json web token (jwt)
// el metodo unless excluye las rutas q no van a requerir jwt, tambien se excluyen las peticion GET
// por la peticion preflight en CORs se pone unless method OPTIONS. No autentica el usuario con la petición OPTIONS (preflight)
app.use(
    jwtMiddleware({secret: secrets.jwtSecret})
      .unless({path: ['/sessions','/users'], method: ['GET','OPTIONS']})
)
app.use('/places',places);
app.use('/places',visitsPlaces);
app.use('/users',users);
app.use('/sessions',sessions);
app.use('/favorites',favorites);
app.use('/visits',visits);
app.use('/applications',applications);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render('error');
  res.json(err);
});

module.exports = app;
