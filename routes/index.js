const Notes = require('../api/controllers/notes');
var Service = require('../api/service');
module.exports = function(router) {

    router.get('/about', function(req, res) {
        res.render("about.html");
    });
    router.get('/contact', function(req, res) {
        res.render("contact.html");
    });
    router.get('/faq', function(req, res) {
        res.render("faq.html");
    });
    router.get('/', function(req, res) {
        res.render("index.html", {
            //'name':'Sanjay',        //use via <%= name %> in index.html
            'name': '<b>Sanjay</b>' //use via <%- name %> in index.html
        });
    });

    //Add array value API
    router.post('/add_note', (req, res) => {
        return Notes.add(req, res);
    });

    //Delete array value API
    router.post('/delete_note', (req, res) => {
        return Notes.remove(req, res);
    });

    //Update array value API
    router.post('/update_note', (req, res) => {
        return Notes.update(req, res);
    });

    //List array value API
    router.get('/list_note', (req, res) => {
        return Notes.list(req, res);
    });

    //List Array using promise method
    router.get('/list_note_promise', (req, res) => {
        Notes.getList(req, res).then((data) => {
                console.log("Data Return", data);
                return res.send(Service.response(1, 'Note listed successfully', data));
                //Call another method and send on second promise result
                //return Notes.getList(req,res);
            })
            //another method promise result
            //.then((data)=>{
            //Second promiss result
            //})
            .catch((err) => {
                return res.send(Service.response(0, err, null));
            });
    });
    
    //List Array using Async Await method
    router.get('/list_note_async_await', async(req, res) => {
        try {
            var notes = await Notes.getList(req, res);
            if (notes) {
                return res.send(Service.response(1, 'Note listed successfully', notes));
            } else {
                throw new Error("Error getting data from Notes.getList");
            }
        } catch (err) {
            console.log("ERR", err);
            return res.send(Service.response(0, "Data not found error", null));
        }
    });

    //Add array value Using database 
    router.post('/add_note_db', (req, res) => {
        return Notes.add_db(req, res);
    });

    //List array value Using database 
    router.get('/list_note_db', (req, res) => {
        return Notes.list_db(req, res);
    });

    router.post('/add_task', (req, res) => {
        return Notes.addTask(req, res);
    });

    router.post('/add_note_db_new', (req, res) => {
        return Notes.addUsingDb(req, res);
    });

    router.post('/update_note_db_new', (req, res) => {
        return Notes.updateUsingDb(req, res);
    });

    router.get('*', function(req, res) {
        console.log("404 Hit");
        res.render('404', {
            'title': 'Node_sanjay'
        });
    });
};