var mongoose = require('mongoose');

var dbConnectionURL = 'mongodb://localhost:27017/nodetest';
try {
    mongoose.connect(`${dbConnectionURL}`, (D) => {
        console.log("Connected to database ", `${dbConnectionURL}`);
    });
} catch (err) {
    console.log("Error", err);
}

module.exports = mongoose;