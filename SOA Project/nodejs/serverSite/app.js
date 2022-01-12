const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const authRoutes = require('./routes/site')
const app = express()
const urlencodedParser = express.urlencoded({extended: false});

app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use('/api/site', authRoutes)

module.exports = app