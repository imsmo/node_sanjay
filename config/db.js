process.env.NODE_ENV = 'local';

module.exports = {
    port : 3000,
    live_url : "http://localhost:"+this.port,
    pre : "http://"
};