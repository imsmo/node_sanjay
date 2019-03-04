//Requuire package/module
const express = require('express');
const bodyParser = require('body-parser'); //Use when add BodyParser as middlewere
const app = express();
const path = require('path');
const http = require('http');
const router = express.Router();
const _ = require('lodash');

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

//Using get method simple print Using send()
// app.get('/',function(req,res) {
//   res.send("Hello World");
// });

//Using get method simple print Set View Engine [Note: Before use set view engine like above]
// app.get('/', function(req,res){
//   res.render("index.html");
// });

//Using get method simple print with pass parameter Set View Engine [Note: Before use set view engine like above]

//Using GET method
//Using app method
app.get('/about', function(req, res) {
    res.render("about.html");
});
app.get('/contact', function(req, res) {
    res.render("contact.html");
});
app.get('/faq', function(req, res) {
    res.render("faq.html");
});
app.get('/', function(req, res) {
    res.render("index.html", {
        //'name':'Sanjay',        //use via <%= name %> in index.html
        'name': '<b>Sanjay</b>' //use via <%- name %> in index.html
    });
});

//Using router method
router.get('/', function(req, res) {
    res.render("index.html", {
        //'name':'Sanjay',        //use via <%= name %> in index.html
        'name': '<b>Sanjay</b>' //use via <%- name %> in index.html
    });
});
app.use('/', router);

//Using POST method

//Using normal function
// app.post('/add_note', function(req, res){
//   var notes = [{'name':'Sanjay','description':'This is the sample'}];
//   res.send({'status':1,'message':'Note added successfully','data':notes});
// });

//Using normal function with add post data
// app.post('/add_note', function(req, res){
//   console.log("Body", req.body); //If console print message "Body undefined" then BodyParser used as a middlewere
//   var params = _.pick(req.body, ['name','description']);  //_.pick() is lodash method to get parameter
//   var notes = [{'name':'Sanjay','description':'This is the sample'}];
//   notes.push(params);
//   res.send({'status':1,'message':'Note added successfully','data':notes});
// });

//Using normal function with add post data, check specific data Like 1)name  2)description not add extra like 3)hobby allowed and check isset.If not then return and set error
// app.post('/add_note', function(req, res){
//   console.log("Body", req.body); //If console print message "Body undefined" then BodyParser used as a middlewere
//   //output body : Body { name: 'Viraj', description: 'This is sample 1', test: '2345' }
//
//   var params = _.pick(req.body, ['name','description']);  //_.pick() is lodash method to get parameter
//
//   console.log("PARAMS",params);  //display response in terminal of post data
//   //output params : PARAMS { name: 'Viraj', description: 'This is sample 1' } //not allowed third parameter test:2345
//
//   if(_.isEmpty(params.name) || _.isEmpty(params.description)){ //If missing anyone then error return
//     return res.send({'status':0,'message':'Required parameter missing','data':null});  //If you have not return then display error "Error: Can't set headers after they are sent."
//   }
//   var notes = [{'name':'Sanjay','description':'This is the sample'}];
//   notes.push(params);
//   res.send({'status':1,'message':'Note added successfully','data':notes});
// });

//Using arrow function
// app.post('/add_note', (req, res)=>{
//   var notes = [{'name':'Sanjay','description':'This is the sample'}];
//   res.send({'status':1,'message':'Note added successfully','data':notes});
// });

//Using arrow function with add post data
// app.post('/add_note', (req, res)=>{
//   console.log("Body", req.body); //If console print message "Body undefined" then BodyParser used as a middlewere
//   var params = _.pick(req.body, ['name','description']);  //_.pick() is lodash method to get parameter
//   var notes = [{'name':'Sanjay','description':'This is the sample'}];
//   notes.push(params);
//   res.send({'status':1,'message':'Note added successfully','data':notes});
// });

//Using arrow function with add post data, check specific data Like 1)name  2)description not add extra like 3)hobby allowed and check isset.If not then return and set error
var notes = [{ 'name': 'Sanjay', 'description': 'This is the sample' }];
//Add array value API
app.post('/add_note', (req, res) => {
    console.log("Body", req.body); //If console print message "Body undefined" then BodyParser used as a middlewere
    //output body : Body { name: 'Viraj', description: 'This is sample 1', test: '2345' }

    var params = _.pick(req.body, ['name', 'description']); //_.pick() is lodash method to get parameter

    console.log("PARAMS", params); //display response in terminal of post data
    //output params : PARAMS { name: 'Viraj', description: 'This is sample 1' } //not allowed third parameter test:2345

    if (_.isEmpty(params.name) || _.isEmpty(params.description)) { //If missing anyone then error return
        return res.send({ 'status': 0, 'message': 'Required parameter missing', 'data': null }); //If you have not return then display error "Error: Can't set headers after they are sent."
    }
    notes.push(params);
    res.send({ 'status': 1, 'message': 'Note added successfully', 'data': notes });
});

//List array value API
app.post('/list_note', (req, res) => {
    res.send({ 'status': 1, 'message': 'Note List successfully', 'data': notes });
});


//Delete array value API
app.post('/delete_note', (req, res) => {
    //notes.pop();
    notes.splice(1, 1);
    res.send({ 'status': 1, 'message': 'Note Deleted successfully', 'data': notes });
});

//Update array value API
app.post('/update_note', (req, res) => {
    var params = _.pick(req.body, ['name', 'description']); //_.pick() is lodash method to get parameter
    if (_.isEmpty(params.name)) { //If missing anyone then error return
        return res.send({ 'status': 0, 'message': 'Required parameter missing', 'data': null }); //If you have not return then display error "Error: Can't set headers after they are sent."
    }
    for (var i in notes) {
        //if (notes[i].name == req.body.name) {  //Use default for get params req.body.name
        if (notes[i].name == params.name) { //Use lodash for get parameter params.name
            notes[i].description = params.description;
            break; //Stop this loop, we found it!
        }
    }
    return res.send({ 'status': 1, 'message': 'Note Updated successfully', 'data': notes });
});

//Start server
var PORT = 3000;
server.listen(PORT, function() {
    console.log("Server listing at Port " + PORT);
});

//module.exports = server;