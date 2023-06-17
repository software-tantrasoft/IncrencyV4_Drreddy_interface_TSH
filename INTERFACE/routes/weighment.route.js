
//packages
const router = require('express').Router();

//user Modules
const weighmentController = require('../controller/weighment.Controller');

router.post('/testStart',weighmentController.onTestStart)
router.post('/verifyTestUser',weighmentController.verifyTestUser)
router.post('/doubleRotary',weighmentController.doubleRotary)

module.exports = router;