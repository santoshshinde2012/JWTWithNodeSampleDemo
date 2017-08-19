"use strict";

var mongoose = require('mongoose'),
    W = require('winston');

var UserLib = require('../models/User');

var UserModel = UserLib.UserModel;

let userRoutes = (function() {
    let routes = {};

    routes.createUser = function(req, res) {

      req.assert('email', 'Need an email').notEmpty();
      req.assert('email', 'Valid email required').isEmail();

      req.assert('name', 'Field should not be empty').len(3, 100);

      req.assert('password', 'From 6 to 20 characters required').len(6, 20);

      var errors = req.validationErrors(true); // Or req.asyncValidationErrors(true);

      if (errors) {
          W.error("createUser: Assertion error ", errors);

          return res.send({error: errors});
      }

      var userParams = {
          email: req.body.email,
          name: req.body.name,
          password: req.body.password
      };

      var User = new UserModel(userParams);

      UserLib.createUser(userParams)
          .then(function (savedUser) {

              return res.send(savedUser);

          })
          .catch(function (err) {

              W.error('Error while creating User ', err.name, err.message, err.stack);

            return res.send({error: err.message});

          });

    };

    routes.logIn = function(req, res) {
        req.assert('email', 'Need an email').notEmpty();
        req.assert('email', 'Valid email required').isEmail();

        req.assert('password', 'Need Password').notEmpty();

        var errors = req.validationErrors(true); // Or req.asyncValidationErrors(true);

        if (errors) {
            W.error("Login: Assertion error ", errors);

            return res.send({error: errors});
        }

        var userParams = {
            email: req.body.email,
            password: req.body.password
        };

        UserLib.signIn(userParams)
            .then(function (token) {

                return res.send(token);

            })
            .catch(function (err) {

                W.error('Error while login User ', err.name, err.message, err.stack);

                return res.send({error: err.message});

            });

    };

    return routes;

})();


module.exports = userRoutes;
