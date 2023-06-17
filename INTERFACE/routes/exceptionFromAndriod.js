const express  = require('express');
const router = express.Router();

const objAndriodException = require('../controller/exceptionFromAndriodController');

router.post('/errorLog' , objAndriodException.andriodException) ;

module.exports = router;