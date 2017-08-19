'use strict';

var mongoose = require('mongoose');
var W = require('winston');

mongoose.Promise = require('bluebird');

var config = require('./config')

/**
 * Mongo is the database created
 */
// Bootstrap db connection
mongoose.connect(config.db.url);

var db = mongoose.connection;


/**
 * Listen on provided port, on all network interfaces.
 * Start the app after mongo connections are open
 *
 */
mongoose.connection.on('open', function(callback){

    /**
     * Get port from environment and store in Express.
     */

    W.info('... Connected to Mongo DB at ' + config.db);
});

mongoose.connection.on('error', function(err){
    W.error('Error in connecting to ' + config.db);

    //should die
    throw err;
});


exports.db = db;
