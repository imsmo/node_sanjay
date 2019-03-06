var db_config = require('./db');

const config = function() {

    this.live_url = db_config.live_url;

    //mongodb://<dbuser>:<dbpassword>@ds121321.mlab.com:21321/ifh_dev
    this.dbLocal = {
        'database': 'node_session',
        'host': 'localhost',
        'port': '27017'
    };
    //mongodb://<dbuser>:<dbpassword>@ds227821.mlab.com:27821/node_session_2
    this.dbProd = {
        'database': 'node_session',
        'username': 'admin',
        'password': encodeURIComponent('IerverFerverH$'),
        'host': '150.242.15.64',
        'authSource': 'admin',
        'port': '27017'
    };

    this.dbTest = {
        'database': 'node_session',
        'username': 'admin',
        'password': encodeURIComponent('admin123'),
        'host': 'ds121321.mlab.com',
        'authSource': 'node_session',
        'port': '21321'
    };

    this.task_types = {
        "high": 1,
        "low": 0
    };
}

module.exports = new config();