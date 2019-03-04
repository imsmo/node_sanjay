var mongoose = require('./connection'),
    Schema = mongoose.Schema;

var NotesModel = new Schema({
    name: {
        type: String
    },
    desc: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Note', NotesModel);