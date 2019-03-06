var mongoose = require('./connection'),
    Schema = mongoose.Schema;
const config = require('../../config');

var NotesModel = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    tasks: [{
        name: {
            type: String
        },
        priority: {
            type: Number,
            enum: [config.task_types.high, config.task_types.low],
            default: config.task_types.high
        }
    }],
    description: String,
    created_at: {
        type: String
    }
});

module.exports = mongoose.model('Note', NotesModel);