const Message = require('./models/message');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const validator = require('froncubator-validator-js');

function auth (socket, next) {
    // Parse cookie
    cookieParser()(socket.request, socket.request.res, () => {});

    // JWT authenticate
    passport.authenticate('jwt', {session: false}, function (error, decryptToken, jwtError) {
        if(!error && !jwtError && decryptToken) {
            next(false, {username: decryptToken.username, id: decryptToken.id});
        } else {
            next('guest');
        }
    })(socket.request, socket.request.res);
}

module.exports = io => {
    io.on('connection', function (socket) {
        auth(socket, (guest, user) => {
            if(!guest) {
                socket.join('all');
                socket.username = user.username;
                socket.emit('connected', `you are connected to chat as`);
        }
    });

    socket.on('msg', text => {
        if (validator.isStr(text, 0, 200)) {
            const obj = {
                date: new Date(),
                text: text,
                username: socket.username
            };

            Message.create(obj, err => {
                if(err) return console.error('Message', err);
                socket.emit('message', obj);
                socket.to('all').emit('message', obj);
            });
        }
        else socket.emit('messageValidation', 'Error');    
    });

    socket.on('receiveAll', () => {
        Message
            .find({})
            .limit(50)
            .lean()
            .exec((err, msgs) => {
                if (!err) socket.emit('history', msgs);             
            });
        });
    });
};

