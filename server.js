//Requuire package/module
const express = require('express');
const bodyParser = require('body-parser'); //Use when add BodyParser as middlewere
const app = express();
const path = require('path');
const http = require('http');
const router = express.Router();
const _ = require('lodash');

//Database conncetion
const db = require('./models/connection');

//Internal Inports
const Notes = require('./notes');

//Create HTTPServer
const server = http.createServer(app);

//Set View Engine
app.set('views', path.join(__dirname, 'views'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.engine('.html', require('ejs').renderFile);

// BodyParser Middleware for all routes
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
    type: 'application/x-www-form-urlencoded'
}));

//Ser Routes
require('./routes/index')(router);
app.use('/', router);

//Start server
var PORT = 3000;
server.listen(PORT, function() {
    console.log("Server listing at Port " + PORT);
});

//module.exports = server;