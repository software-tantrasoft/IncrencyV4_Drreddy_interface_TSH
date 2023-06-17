//packages
const router = require('express').Router();

//modules
const menuController = require('../controller/menu_Request_Controller');

//route apis
router.post('/getMenu',menuController.getMenu);
router.post('/subGetMenu',menuController.subGetMenu);
router.post('/menuStart',menuController.onMenuStart);


module.exports = router;