const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/dbConnection').sequelize
const { QueryTypes } = require('sequelize');
const NetworkLogs = require('./INTERFACE/global/network.logger')
const mssql = require("mssql");
//middlewares
app.use(express.static(path.join(__dirname, '')));
app.use(cors({ credentials: true, origin: true }))
app.use(bodyParser.json());
app.use(express.json());
app.use(NetworkLogs);

//module import
require('./INTERFACE/model/Mqtt/mqtt.model');
const serverConfig = require('./INTERFACE/global/serverConfig');
const login = require('./INTERFACE/routes/login.route');
const menuRequest = require('./INTERFACE/routes/menu_Request_Route');
const weighmentRoute = require('./INTERFACE/routes/weighment.route');
const exceptionRoute = require('./INTERFACE/routes/exceptionFromAndriod');

//Middleware for Interface Routes

app.use('/INTERFACE/login', login);
app.use('/INTERFACE/Menu', menuRequest);
app.use('/INTERFACE/Weighment', weighmentRoute);
app.use('/INTERFACE/AndriodException', exceptionRoute);

app.listen(serverConfig.INTERFACE_NO, serverConfig.HOST_IP, async () => {
    // await sequelize.query(`update tbl_users set active = 0,loginatmpt = 0,autoEnbl = 0,Status = 0,suspensionPeriod = 0 where (source = "hardware"|| source ="")`, { type: QueryTypes.UPDATE })
    var quer =   `UPDATE tbl_users SET active = 0,loginatmpt = 0,autoEnbl = 0,Status = 0 WHERE source = 'Hardware'`
    await sequelize.query(quer, { type: QueryTypes.UPDATE});
    console.log(`INTERFACE SERVER STARTED ON : ${serverConfig.HOST_IP}:${serverConfig.INTERFACE_NO}....`);
});