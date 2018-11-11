const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const { Strategy } = require('passport-jwt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { jwt } = require('./config');
const app = express();

const server = app.listen(8080, () => {
    console.log('Example app listening on port 8080!');
});

const io = require('socket.io').listen(server, { serveClient: true });

mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/Chat', { useNewUrlParser: true });
mongoose.connect('mongodb://admin:admin1@ds259463.mlab.com:59463/chat', { useNewUrlParser: true });

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



    