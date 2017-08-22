'use strict';

var express = require('express');

var sampleRoutes = require('./sampleRoutes.js');
var userRoutes = require('./userRoutes.js');
var config = require('../../config/config');
var jwt = require('jsonwebtoken');
var W = require('winston');

/**
 * Define Api routes that are connected through middleware/routes
 *
 * @type {{user, Help}}
 */
var ApiRoutes = function(app) {

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

    //App is mapped to localhost
    var main = express.Router();

    main.get('/help', requiresAdmin, sampleRoutes.getHelp);

    main.post('/user', userRoutes.createUser);
    main.get('/user', requiresAdmin, userRoutes.getUser);
    main.delete('/user', userRoutes.deleteUser);

    main.post('/auth/login', userRoutes.logIn);

    app.use('/api', main);

};


module.exports = ApiRoutes;
