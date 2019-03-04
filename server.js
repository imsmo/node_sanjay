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

//Add array value API
app.post('/add_note', (req, res) => {
    return Notes.add(req, res);
});

//Delete array value API
app.post('/delete_note', (req, res) => {
    return Notes.remove(req, res);
});

//Update array value API
app.post('/update_note', (req, res) => {
    return Notes.update(req, res);
});

//List array value API
app.get('/list_note', (req, res) => {
    return Notes.list(req, res);
});

//List Array using promise method
app.get('/list_note_promise', (req, res) => {
    Notes.getList(req, res).then((data) => {
            console.log("Data Return", data);
            return res.send({
                'status': 1,
                'message': 'Note listed successfully',
                'data': data
            });
            //Call another method and send on second promise result
            //return Notes.getList(req,res);
        })
        //another method promise result
        //.then((data)=>{
        //Second promiss result
        //})
        .catch((err) => {
            return res.send({
                'status': 0,
                'message': err,
                'data': null
            });
        });
});
//List Array using Async Await method
app.get('/list_note_async_await', async(req, res) => {
    try {
        var notes = await Notes.getList(req, res);
        if (notes) {
            res.send({ 'status': 1, 'message': 'Notes Listed Successfully', 'data': notes });
        } else {
            throw new Error("Error getting data from Notes.getList");
        }
    } catch (err) {
        console.log("ERR", err);
        res.send({ 'status': 0, 'message': "Data not found error", "data": null });
    }
});

//Add array value Using database 
app.post('/add_note_db', (req, res) => {
    return Notes.add_db(req, res);
});

//List array value Using database 
app.get('/list_note_db', (req, res) => {
    return Notes.list_db(req, res);
});

//Start server
var PORT = 3000;
server.listen(PORT, function() {
    console.log("Server listing at Port " + PORT);
});

//module.exports = server;