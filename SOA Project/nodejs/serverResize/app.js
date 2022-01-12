const express = require('express')
const multer  = require("multer");
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const resizeRoutes = require('./routes/resize')
const app = express()
const urlencodedParser = express.urlencoded({extended: false});

app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "uploads");
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname + "-" + Date.now());
    }
});

 // определение фильтра
const fileFilter = (req, file, cb) => {
  
    if(file.mimetype === "image/png" || 
    file.mimetype === "image/jpg"|| 
    file.mimetype === "image/jpeg"){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
 }

app.use(multer({storage:storageConfig, fileFilter: fileFilter}).single("filedata"));

app.use('/api/resize', resizeRoutes)

module.exports = app
