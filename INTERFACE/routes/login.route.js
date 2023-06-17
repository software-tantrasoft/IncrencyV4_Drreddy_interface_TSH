//packages
const express = require('express')
const router = express.Router();

//Controller
const loginController = require('../controller/login.controller')

// const API_loginController = require('../../API/controller/loginController')

// router.post('/loginMain', loginController.loginMain);
router.post('/powerBackupData', loginController.powerBackupData);
router.post('/discardPowerBackup', loginController.discardPowerBackup);
router.post('/loginApi', loginController.loginApi);
router.post('/logout', loginController.logout);
router.post('/changePassword', loginController.changePassword);
router.post('/getIDSNo', loginController.getIDSNo)
router.post('/getIDS', loginController.getIDS)


router.post('/communicate', loginController.communicationoff)


module.exports = router;