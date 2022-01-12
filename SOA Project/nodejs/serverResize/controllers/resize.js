const mysql = require("mysql");
const bodyParser = require("body-parser");
const { response } = require("../app");
const multer  = require("multer");

const fs = require('fs');
const gm = require('gm');

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "userdb",
    password: "dip"
});
  
connection.connect(function(err){
    if (err)
      return console.error("Ошибка: " + err.message);
    else
      console.log("Подключение к серверу MySQL успешно установлено");
});

function getNewestFile(files, path) {
    var out = [];
    files.forEach(function(file) {
        var stats = fs.statSync(path + "/" +file);
        if(stats.isFile()) {
            out.push({"file":file, "mtime": stats.mtime.getTime()});
        }
    });
    out.sort(function(a,b) {
        return b.mtime - a.mtime;
    })
    return (out.length>0) ? out[0].file : "";
}


module.exports.resize = function(req, res) {
    var width = req.query.width;
	var height = req.query.height;
    var check = req.query.check;

    const dir = "/var/www/nodejs/serverResize/uploads/";
    

    console.log(dir);

    fs.readdir(dir, function(err, files) {
        if (err) { throw err; }
        var nFile = getNewestFile(files, dir).replace(".png", '.jpg', '.jpeg');
        console.log(nFile);

        console.log(dir + nFile);
        var fileS = '/var/www/nodejs/serverResize/temp/' + 'resized_' + Date.now() + '.jpg';
        console.log(fileS);
        if(check == false){
            gm(dir + nFile)
                .resize(width, height, '!')
                .write(fileS, function (err) {
                    if(err) console.log(err);
                    console.log("Done!")
        })
        }else{
            gm(dir + nFile)
                .resize(width, height, '%')
                .write(fileS, function (err) {
                    if(err) console.log(err);
                    console.log("Done!")
        })
        }

        setTimeout(function(){
            //fs.createReadStream(fileS).pipe(res);
            res.sendFile(fileS);
        }, 3500, 'funky');

    });
    
}

module.exports.sendFile = function(req, res, next) {
   
    let filedata = req.file;
    console.log(filedata);
    if(!filedata)
        res.send("Ошибка при загрузке файла");
    else{
        res.redirect("http://localhost:5002/api/site/resizeRedir")
    }

}

module.exports.login = function(req, res) {

    var email = req.query.email;
	var password = req.query.password;
    var passMD = md(email, password);
    
    connection.query('SELECT * FROM user WHERE email = ? AND password = ?', [email, passMD], (err, result) => {
    	if(err) throw err;
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
        res.send(result);
  	});
      
}

module.exports.register = function(req, res){

	var email = req.query.email;
	var password = req.query.password;
    var passMD = md(email, password);
    var code = getCode();
    
    sendCode(email, code);

    var mailOptions = {
        from: 'ResizzePicture@gmail.com',
        to: email,
        subject: 'Sending',
        html: '<h1>Resizze Picture</h1><p>Ваш код: ' + code + '</p>'
    };
    
    connection.query('INSERT INTO user SET email=?, password=?, code=?;', [email, passMD, code], (err, result) => {
    	if(err) throw err;
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
 
        res.send(result);
  	});
}