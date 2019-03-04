const _ = require('lodash');
const Notes = require('./models/notes');
var notes = [{
    'name': 'Sanjay',
    'desc': 'This is for test'
}];

module.exports = {
    add: function(req, res) {
        console.log("Body", req.body);
        var params = _.pick(req.body, ['name', 'desc']);
        console.log("PARAMS", params);


        if (_.isEmpty(params.name) || _.isEmpty(params.desc)) { //If missing anyone then error return
            return res.send({
                'status': 0,
                'message': 'Required parameter missing',
                'data': null
            }); //If you have not return then display error "Error: Can't set headers after they are sent."
        }
        notes.push(params);
        res.send({
            'status': 1,
            'message': 'Note added successfully',
            'data': notes
        });
    },
    update: function(req, res) {
        console.log("Body", req.body);
        var params = _.pick(req.body, ['index', 'name', 'desc']);
        console.log("PARAMS", params);

        if (isNaN(params.index)) {
            return res.send({
                'status': 0,
                'message': 'Invalid Index',
                'data': null
            });
        }
        if (params.index < 0 || params.index >= notes.length) {
            return res.send({
                'status': 0,
                'message': 'Invalid Index',
                'data': null
            });
        }

        notes[params.index] = {
            'name': params.name || notes[params.index].name,
            'desc': params.desc
        };

        res.send({
            'status': 1,
            'message': 'Notes Updated Successfully',
            'data': notes
        });
    },
    remove: function(req, res) {
        console.log("Body", req.body);
        var params = _.pick(req.body, ['index', 'name', 'desc']);
        console.log("PARAMS", params);

        if (isNaN(params.index)) {
            return res.send({
                'status': 0,
                'message': 'Invalid Index',
                'data': null
            });
        }
        if (params.index < 0 || params.index >= notes.length) {
            return res.send({
                'status': 0,
                'message': 'Invalid Index',
                'data': null
            });
        }

        notes.splice(params.index, 1);

        res.send({
            'status': 1,
            'message': 'Notes Deleted Successfully',
            'data': notes
        });
    },
    list: function(req, res) {
        res.send({
            'status': 1,
            'message': 'Notes List Successfully',
            'data': notes
        });
    },

    //Get data using promise method
    getList: function(req, res) {
        return new Promise((resolve, reject) => {
            //Execute query
            resolve(notes);
            //Response of query
            reject('Error getting data from server');
        });
    },

    //Add using database
    add_db: async function(req, res) {
        var params = _.pick(req.body, ['name', 'desc']);

        if (_.isEmpty(params.name) || _.isEmpty(params.desc)) { //If missing anyone then error return
            return res.send({
                'status': 0,
                'message': 'Required parameter missing',
                'data': null
            }); //If you have not return then display error "Error: Can't set headers after they are sent."
        }

        var data = new Notes({
            name: params.name,
            desc: params.desc
        });
        var add_data = await data.save();
        if (!add_data) {
            return res.send({
                'status': 0,
                'message': 'Data not inserted',
                'data': null
            });
        }
        return res.send({
            'status': 1,
            'message': 'Note added successfully',
            'data': add_data
        });
    },

    //List using database
    list_db: async function(req, res) {
        var list = await Notes.find({});
        //With Specific field and sorting
        //var list = await Notes.find({}, ['name', 'desc']).sort({ 'name': 1 });
        res.send({
            'status': 1,
            'message': 'Notes List Successfully',
            'data': list
        });
    },
};