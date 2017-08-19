'use strict';

/**
 * User model to manage all users
 *
 */

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  bcrypt = require('bcrypt'),
  jwt = require('jsonwebtoken'),
  W = require('winston');

var config = require('../../config/config');

var UserWrapper = (function() {

  //1. Mongoose model

  var _schema = new Schema({
    name: {
      type: String,
      trim: true,
      required: true
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true
    },
    hash_password: {
      type: String,
      required: true
    },
    created: {
      type: Date,
      default: Date.now
    }
  })

  _schema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.hash_password);
  };

  var UserModel = mongoose.model('User', _schema);
  /**
   * lib contains all the helper functions and UserModel wrapping around user related use cases
   *
   */
  var lib = {};

  lib.UserModel = UserModel;

  /**
   * Create user from paramters
   *
   * @param params
   */
  lib.createUser = function (params) {

      if (!params){
          return null;
      }

      var User = new UserModel(params);

      User.hash_password = bcrypt.hashSync(params.password, 10);

      return User.save()
          .then(function (user) {
              if (!user) {
                  W.error("createUser() User not created ", params);
                  throw new Error("UNKNOWN_ERROR");
              }

              return Promise.resolve({'email': user.email, 'name': user.name, 'created': user.created, '_id': user._id});
          })
          .catch(function (err) {
              W.error("User save error", err);

              if (err && err.name === 'MongoError' && err.message.indexOf('duplicate') > -1) {
                  err.code = "existingUser";
                  err.message = "User already exists, please login to your account";
              }

              return Promise.reject(err);
          });
  };

  /**
   * Get a signed in token based on email and password
   *
   * @param params
   * @returns {*}
   */
  lib.signIn = function (params) {

      if (!params){
          return null;
      }

      return UserModel.findOne({'email' : params.email})
          .then(function (user) {
              if (!user || !user.comparePassword(params.password)) {
                  W.error("Authentication failed. Invalid user or password. ", params);
                  throw new Error("Authentication failed. Invalid user or password.");
              }

              var jwt_token = jwt.sign({ email: user.email, name: user.name, _id: user._id }, new Buffer(config.secret.auth, 'base64'));

              return Promise.resolve({'token' : jwt_token});
          })
          .catch(function (err) {
              W.error("User signin error", err);

              if (err && err.name === 'MongoError' && err.message.indexOf('duplicate') > -1) {
                  err.code = "existingUser";
                  err.message = "User already exists, please login to your account";
              }

              return Promise.reject(err);
          });
  };

  return lib;

})();

module.exports = UserWrapper;
