//Requuire package/module
const express = require('express');
const bodyParser = require('body-parser'); //Use when add BodyParser as middlewere
const app = express();
const path = require('path');
const http = require('http');
const router = express.Router();
const _ = require('lodash');

// Config
const config = require('./config');

//Database conncetion
const db = require('./api/models/connection');

//Internal Inports
//const Notes = require('./notes');

//Create HTTPServer
const server = http.createServer(app);

//Set View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use('/', express.static(path.join(__dirname, 'public')));
app.engine('.html', require('ejs').renderFile);

// BodyParser Middleware for all routes
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
    type: 'application/x-www-form-urlencoded'
}));

//Set Routes
require('./routes/admin')(router);
require('./routes/index')(router);

app.use('/', router);
app.use(function (err){
	console.log("EXCEPTION OCCURRED",err);
});

// Start Server
app.listen(config.port, function () {
	console.log("Server listening at PORT:" + config.port);
});

//module.exports = server;