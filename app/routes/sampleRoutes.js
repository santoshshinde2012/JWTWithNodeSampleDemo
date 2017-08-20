"use strict";

let sampleRoutes = (function() {
    let routes = {};

    routes.getHelp = function(req, res) {
        res.send({message : 'Hello , keep in touch.'});
    };

    return routes;

})();


module.exports = sampleRoutes;
