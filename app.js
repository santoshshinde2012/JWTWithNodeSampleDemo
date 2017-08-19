var port = process.env.PORT || 3000 ;
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var jsonwebtoken = require("jsonwebtoken");

var app = express();

var db = require('./config/database');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());
app.use(express.static(path.join(__dirname, 'public')));

require('./app/routes/routes.js')(app);

// Handles local
app.get('*', function (request, response){
    response.sendFile(path.resolve(__dirname, 'public', 'index.html'))
});

module.exports = app;
