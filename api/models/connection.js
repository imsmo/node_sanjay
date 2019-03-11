var mongoose = require('mongoose'),
    config = require('../../config'),
    dbConnectionUrl = "";

switch (process.env.NODE_ENV) {
    case "local":
        dbConnectionUrl = `mongodb://${config.dbLocal.host}:${config.dbLocal.port}/${config.dbLocal.database}`;
        break;
    case "production":
        dbConnectionUrl = `mongodb://${config.dbProd.username}:${config.dbProd.password}@${config.dbProd.host}:${config.dbProd.port}/${config.dbProd.database}?authSource=${config.dbProd.authSource}`;
        break;
    case "test":
        dbConnectionUrl = `mongodb://${config.dbTest.username}:${config.dbTest.password}@${config.dbTest.host}:${config.dbTest.port}/${config.dbTest.database}?authSource=${config.dbTest.authSource}`;
        break;
    default:
        dbConnectionUrl = `mongodb://${config.dbLocal.host}:${config.dbLocal.port}/${config.dbLocal.database}`;
}

try {
    mongoose.connect(`${dbConnectionUrl}`, {
        useCreateIndex: true,
        useNewUrlParser: true
    }, (d) => {
        console.log("Connected to database: ", `${dbConnectionUrl}`);
    }); // connect to our database
} catch (err) {
    console.log("DBCONNECT ERROR", err);
}

module.exports = mongoose;