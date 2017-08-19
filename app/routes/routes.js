'use strict';

let express = require('express');

let sampleRoutes = require('./sampleRoutes.js');
let userRoutes = require('./userRoutes.js');
let config = require('../../config/config');
let jwt = require('jsonwebtoken');
/**
 * Define Api routes that are connected through middleware/routes
 *
 * @type {{account, video, channel}}
 */
let ApiRoutes = function(app) {


    /**
     * Decodes and verifies JWT against a config secret
     *
     * @param req
     * @param res
     * @param next
     */
    var requiresAdmin = function(req, res, next) {

        if (req.headers && req.headers.token) {
            jwt.verify(req.headers.token,
                new Buffer(config.secret.auth, 'base64'),
                function(err, decoded) {

                    if (err || !decoded.email) {
                        W.error("requiresAdmin: ", err);

                        return res.send({error: "Credentials are not valid or expired"});
                    }

                    if (!req.user) {
                        req.user = {};
                    }

                    req.user = decoded;
                    console.log('decoded', decoded);
                    next();
                    return;

                });
        }else {
            return res.status(401).json({ message: 'Unauthorized user!' });
        }
    };


    //App is mapped to vidlogs.com
    let main = express.Router();

    main.get('/help', requiresAdmin, sampleRoutes.getHelp);
    main.post('/auth/user', userRoutes.createUser);
    main.post('/auth/login', userRoutes.logIn);

    app.use('/api', main);

};


module.exports = ApiRoutes;
