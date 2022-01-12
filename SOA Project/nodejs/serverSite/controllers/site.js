const fs = require('fs');

module.exports.log = function(req, res) {
    res.redirect("http://localhost:5002/api/site/loginOpen")
}

module.exports.loginOpen = function(req, res) {
    res.sendFile("/var/www/nodejs/serverSite/auth.html"); 
}

module.exports.registerRedir = function(req, res){
    res.redirect("http://localhost:5002/api/site/registerOpen")
}

module.exports.registerOpen = function(req, res){
    res.sendFile("/var/www/nodejs/serverSite/reg.html");   
}

module.exports.resizeRedir = function(req, res){
    res.redirect("http://localhost:5002/api/site/resizeOpen")
}

module.exports.resizeOpen = function(req, res){
    res.sendFile("/var/www/nodejs/serverSite/resize.html");   
}

module.exports.sendFileRedir = function(req, res){
    res.redirect("http://localhost:5002/api/site/sendFileOpen")
}

module.exports.sendFileOpen = function(req, res){
    res.sendFile("/var/www/nodejs/serverSite/sendfile.html");   
}

module.exports.download = function(req, res) {
   
    var file = req.query.file;

    console.log(file);

    fs.access(file, fs.constants.R_OK, err => {
        if(err){
            res.statusCode = 404;
            res.end("NOT Found");
        } else {
            fs.createReadStream(file).pipe(res);
        }
    });

}