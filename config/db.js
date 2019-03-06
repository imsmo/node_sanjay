const db_config = function() {

    this.live_url = 'http://192.168.2.13:3001';
    process.env.NODE_ENV = 'local';
    this.pre = 'http://';
}

module.exports = new db_config();