function ExtractJwt (req) {
    let token = null;
    if(req.cookies && req.cookies.token != null) token = req.cookies['token'];
    return token;
}

module.exports = {
    jwt: {
        jwtFromRequest: ExtractJwt,
        secretOrKey: 'test'
    },
    expiresIn: '1 day'
};
