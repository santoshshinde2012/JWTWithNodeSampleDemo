"use strict";

var mongoose = require('mongoose'),
    W = require('winston');

var UserLib = require('../models/User');

var UserModel = UserLib.UserModel;

var userRoutes = (function() {
    var routes = {};

    /**
     * create an user
     *
     * @param req
     * @param res
     */
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

    /**
     * login an user and get the token
     *
     * @param req
     * @param res
     */
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

    /**
     * get an user from the database
     *
     * @param req
     * @param res
     */
    routes.getUser = function(req, res) {
      if(!req.user){
        return res.send({error: 'Unauthorized User'});
      }

      var userId = req.user._id;
      UserLib.UserModel.findOne({_id: userId})
          .then(function (user) {
            if (!user) {
                W.error("getUser() User not exist ", user);
                throw new Error("UNKNOWN_ERROR");
            }

            return res.send(user);

          })
          .catch(function (err) {

              W.error('Error while getUser ', err.name, err.message, err.stack);

              return res.send({error: err.message});

          });

    }

    /**
     * remove an user from the database
     *
     * @param req
     * @param res
     */
    routes.deleteUser = function(req, res) {

      var userId = req.params.userId;

      // get the user starlord55
      UserLib.removeUser(userId)
      .then(function(result) {
          if(!result){
            throw new Error("UNKNOWN_ERROR");
          }
          return res.send(result);
      })
      .catch(function(error) {
          W.error('Error while remove User ', error.name, error.message, error.stack);

          return res.send({error: error.message});
      });
    }

    return routes;

})();


module.exports = userRoutes;
