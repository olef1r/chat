const express = require('express');
const config = require('./config');
const bcrypt = require('bcrypt');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const User = require('./models/user');

module.exports = app => {
    //Store all JS and files.
    app.use(express.static('./public'));

    app.get('/', checkAth, (req, res) => {
        res.render('index.hbs', { username: req.user.username });
    });

    app.post('/login', async (req, res) => {
        try {  
            let user = await findUser(req);
            //let user = await User.findOne({ username: { $regex: _.escapeRegExp(req.body.username), $options: 'i' }}).lean().exec();
            if (user != void(0)  &&  bcrypt.compareSync(req.body.password, user.password)) {
                const token = createToken({ id: user._id, username: user.username });

                //Not allow client side access to the cookie.
                res.cookie('token', token, { httpOnly: true });

                res.status(200).send({ message: 'User login!' });
            } else {
                return res.status(400).send({ message: 'User is not exists or password is not correct!' })
           }
        } catch (err) {
            console.log(err);
            res.status(500).send({message: 'Some error!'})
        }
    });

    app.post('/register', async (req, res) => {
        try {
            if (!(/\W/.exec(req.body.username))) {

            let user = await findUser(req);
            if (user != null) return res.status(400).send({ message: 'User already exist' });
            console.log(user)

            user = await User.create({
                username: req.body.username,
                password: req.body.password
            });
            const token = createToken({ id: user._id, username: user.username });

            //Not allow client side access to the cookie.
            res.cookie('token', token, { httpOnly: true });

            res.status(200).send({message: 'User create!'})
            }         

            else res.status(200).send({ message: 'Username  must contains only letters and numbers' });                 
        } catch (err) {
            console.log(err);
            res.status(500).send({ message: 'Some error!' })
        }
    });

    app.post('/logout', (req, res) => {
        res.clearCookie('token');
        res.status(200).send({ message: 'Logout success!' })
    });
}

function checkAth(req, res, next) {
    passport.authenticate('jwt', { session: false }, (err, decryptToken, jwtErr) => {
        if (jwtErr != null || err != null) return res.render('index.hbs', { error: err || jwtErr });
        req.user = decryptToken; 
        next();
    }) (req, res);
}

function createToken(body) {
    return jwt.sign(
        body,
        config.jwt.secretOrKey,
        { expiresIn: config.expiresIn }
    );
}

function findUser (req) {
     return User.findOne({ username: { $regex: req.body.username, $options: 'i'} }).lean().exec();
}
