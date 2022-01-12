const express = require('express')
const controller = require('../controllers/site')
const router = express.Router()

//localhost:5002/api/site
router.get('/', controller.log)

//localhost:5002/api/site/loginOpen
router.get('/loginOpen', controller.loginOpen)

//localhost:5002/api/site/registerOpen
router.get('/registerOpen', controller.registerOpen)

//localhost:5002/api/site/registerRedir
router.get('/registerRedir', controller.registerRedir)

//localhost:5002/api/site/resizeOpen
router.get('/resizeOpen', controller.resizeOpen)

//localhost:5002/api/site/resizeRedir
router.get('/resizeRedir', controller.resizeRedir)

//localhost:5002/api/site/sendFileOpen
router.get('/sendFileOpen', controller.sendFileOpen)

//localhost:5002/api/site/sendFileRedir
router.get('/sendFileRedir', controller.sendFileRedir)

//localhost:5002/api/site/download
router.get('/download', controller.download)

module.exports = router