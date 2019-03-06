const _ = require('lodash');
const Notes = require('../models/notes');
var ObjectId = require('mongoose').Types.ObjectId;
const config = require('../../config');
var Service = require('../service');

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
            return res.send(Service.response(0, 'Required parameter missing', null));
            //If you have not return then display error "Error: Can't set headers after they are sent."
        }
        notes.push(params);
        return res.send(Service.response(1, 'Note added successfully', notes));
    },
    update: function(req, res) {
        console.log("Body", req.body);
        var params = _.pick(req.body, ['index', 'name', 'desc']);
        console.log("PARAMS", params);

        if (isNaN(params.index)) {
            return res.send(Service.response(0, 'Invalid Index', null));
        }
        if (params.index < 0 || params.index >= notes.length) {
            return res.send(Service.response(0, 'Invalid Index', null));
        }

        notes[params.index] = {
            'name': params.name || notes[params.index].name,
            'desc': params.desc
        };
        return res.send(Service.response(1, 'Notes Updated Successfully', notes));
    },
    remove: function(req, res) {
        console.log("Body", req.body);
        var params = _.pick(req.body, ['index', 'name', 'desc']);
        console.log("PARAMS", params);

        if (isNaN(params.index)) {
            return res.send(Service.response(0, 'Invalid Index', null));
        }
        if (params.index < 0 || params.index >= notes.length) {
            return res.send(Service.response(0, 'Invalid Index', null));
        }

        notes.splice(params.index, 1);
        return res.send(Service.response(1, 'Notes Deleted Successfully', notes));
    },
    list: function(req, res) {
        return res.send(Service.response(1, 'Notes List Successfully', notes));
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
            return res.send(Service.response(0, 'Required parameter missing', null));
            //If you have not return then display error "Error: Can't set headers after they are sent."
        }

        var data = new Notes({
            name: params.name,
            desc: params.desc
        });
        var add_data = await data.save();
        if (!add_data) {
            return res.send(Service.response(0, 'Data not inserted', null));
        }
        return res.send(Service.response(1, 'Note added successfully', add_data));
    },

    //List using database
    list_db: async function(req, res) {
        var list = await Notes.find({});
        //With Specific field and sorting
        //var list = await Notes.find({}, ['name', 'desc']).sort({ 'name': 1 });
        return res.send(Service.response(1, 'Note List successfully', list));
    },

    addUsingDb: async function(req, res) {

        try {

            console.log("BODY", req.body);
            var params = _.pick(req.body, ['name', 'description']);
            console.log("PARAMS", params);

            if (_.isEmpty(params.name)) {
                return res.send(Service.response(0, 'Name parameter missing', null));
            }
            // notes.push()format

            // notes.push(params);
            var rez = new Notes({
                'name': params.name,
                'description': params.description,
                'created_at': new Date().getTime()
            });

            rez.save().then((us) => {
                return res.send(Service.response(1, 'Note added successfully', us));
            }).catch((err) => {
                return res.send(Service.response(0, 'Something went wrong while add notes.', err.errmsg));
            });

        } catch (err) {
            console.log("ERR", err);
        }

    },

    updateUsingDb: async function(req, res) {
        try {
            console.log("BODY", req.body);
            var params = _.pick(req.body, ['name', 'description']);
            console.log("PARAMS", params);

            if (_.isEmpty(params.name)) {
                return res.send(Service.response(0, 'Name parameter missing', null));
            }
            // notes.push()format

            // notes.push(params);
            Notes.findOneAndUpdate({
                'name': params.name
            }, {
                $set: {
                    'description': params.description
                }
            }, {
                new: true
            }).then((us) => {
                return res.send(Service.response(1, 'Note updated successfully', us));
            }).catch((err) => {
                return res.send(Service.response(0, 'Something went wrong while updating notes.', null));
            });
        } catch (err) {
            console.log("ERR", err);
        }
    },

    addTask: async function(req, res) {
        console.log("Task add called", req.body);
        var params = _.pick(req.body, ['id', 'name', 'priority']);

        if (!this.validateObjectId(params.id))
            return res.send(Service.response(0, 'Invalid Id Passed', null));

        var note = await Notes.findById(params.id);
        if (!note)
            return res.send(Service.response(0, 'Invalid Id Passed', null));

        if (!note.tasks)
            note.tasks = [];

        if (_.isEmpty(params.name))
            return res.send(Service.response(0, 'Name is required', null));


        if (isNaN(params.priority) || [config.task_types.high, config.task_types.low].indexOf(parseInt(params.priority)) <= -1) {
            return res.send(Service.response(0, 'Invalid value provided for priority ' + [config.task_types.high, config.task_types.low].indexOf(params.priority), null));
        }

        note.tasks.push({
            'name': params.name,
            'priority': params.priority
        });

        var rez = await note.save();
        if (rez)
            return res.send(Service.response(1, 'Task added successfully', note));
        else
            return res.send(Service.response(0, 'Something is wrong, please try again.', null));
    },
};