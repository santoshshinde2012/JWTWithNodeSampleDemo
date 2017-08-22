"use strict";

var sampleRoutes = (function() {
    var routes = {};

    routes.getHelp = function(req, res) {
        res.send('Hello , keep in touch.');
    };

    return routes;

})();


module.exports = sampleRoutes;
