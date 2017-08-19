'use strict';

let express = require('express');

let sampleRoutes = require('./sampleRoutes.js');

/**
 * Define Api routes that are connected through middleware/routes
 *
 * @type {{account, video, channel}}
 */
let ApiRoutes = function(app) {


    //App is mapped to vidlogs.com
    let main = express.Router();

    main.get('/help', sampleRoutes.getHelp);

    app.use('/api', main);

};


module.exports = ApiRoutes;
