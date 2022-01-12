const mysql = require("mysql");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { response } = require("../app");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "userdb",
    password: "dip"
});
  
connection.connect(function(err){
    if (err) {
      return console.error("Ошибка: " + err.message);
    }
    else{
      console.log("Подключение к серверу MySQL успешно установлено");
    }
 });

function md(email, code){
    var string = "" + email + code;
    var hash = crypto.createHash('md5').update(string).digest('hex');
    
    return hash;
}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ResizzePicture@gmail.com',
        pass: 'sizepic1234'
    }
});

function sendCode(email, code){
    var mailOptions = {
        from: 'ResizzePicture@gmail.com',
        to: email,
        subject: 'Sending',
        html: '<h1>Resizze Picture</h1><p>Ваш код: ' + code + '</p>'
    };
    
    transporter.sendMail(mailOptions, function(err, info){
       if (err){
           response.send(err);
       } else{
        response.send("Email sent: " + info.response);
       }
    });
}

function getCode(){
    var randomnumber;
    
    randomnumber = Math.floor(Math.random() * Math.floor(2000)) + 1;

    return randomnumber;
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
    
    connection.query('INSERT INTO user SET email=?, password=?, code=?;', [email, passMD, code], (err, result) => {
    	if(err) throw err;
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
 
        res.send(result);
  	});

}

module.exports.checkemail = function(req, res) {
    var code = req.query.code;
        
        connection.query('UPDATE user SET code = 0 WHERE code=?', code, (err, result) => {
            if(err) throw err;
            
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
                
            res.send(result.affectedRows + "");
    });
}

module.exports.coderecovery = function(req, res) {
    var email = req.query.email;
	var password = req.query.password;
    
    var code = getCode();
    
    sendCode(email, code);
    
    var passMD = md(email, password);
    
    connection.query('UPDATE user SET code = ? WHERE email=? AND password=?', [code, email, passMD], (err, result) => {
    	if(err) throw err;
        
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    		
        res.send(result);
  	});
}
