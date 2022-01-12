const express = require('express')
const controller = require('../controllers/resize')
const router = express.Router()

//localhost:5001/api/resize/resize
router.get('/resize', controller.resize)

//localhost:5001/api/resize/sendFile
router.post('/sendFile', controller.sendFile)

module.exports = router
