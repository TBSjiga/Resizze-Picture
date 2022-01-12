const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const authRoutes = require('./routes/auth')
const app = express()
const urlencodedParser = express.urlencoded({extended: false});

app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(express.static("/var/www/nodejs/routing/site"));
app.use('/api/auth', authRoutes)

module.exports = app
