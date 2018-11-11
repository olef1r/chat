const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const { Strategy } = require('passport-jwt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { jwt } = require('./config');
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc');
const app = express();

const server = app.listen(8080, () => {
    console.log('Example app listening on port 8080!');
});

const io = require('socket.io').listen(server, { serveClient: true });


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/Chat', { useNewUrlParser: true });

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());



app.use(cookieParser());

passport.use(new Strategy(jwt, (jwt_payload, done) =>  {
   if(jwt_payload != void(0)) return done(false, jwt_payload);
   done();
}));

const router = require('./router')(app);
const sockets = require('./sockets')(io); 

let swaggerDefinition = {
    info: {
      title: 'Node Swagger API',
      version: '1.0.0',
      description: 'Demonstrating how to describe a RESTful API with Swagger',
    },
    host: 'localhost:8080',
    basePath: '/',
  };
  // options for the swagger docs
let options = {
    // import swaggerDefinitions
    swaggerDefinition: swaggerDefinition,
    // path to the API docs
    apis: ['routes.js']// pass all in array 
    };
  // initialize swagger-jsdoc
  var swaggerSpec = swaggerJsDoc(options);


app.get('/swagger.json', function(req, res) {   res.setHeader('Content-Type', 'application/json');   res.send(swaggerSpec); });
