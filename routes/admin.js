const config = require('./../config');

module.exports = (router)=>{
    router.get('/',(req,res)=>{
        res.render('index',{
            'title':'Hello World',
            'name':'Sanju baba',
            'host': config.pre+req.headers.host
        });
    });
}