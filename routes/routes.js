'use strict';

var express = require('express');

var sampleRoutes = require('./sampleRoutes.js');

/**
 * Define Api routes that are connected through middleware/routes
 *
 * @type {{account, video, channel}}
 */
var ApiRoutes = function(app) {


    //App is mapped to vidlogs.com
    var main = express.Router();

    main.get('/help', sampleRoutes.getHelp);

    app.use('/api', main);

};


module.exports = ApiRoutes;
