// const mysql = require('mysql2')
// const dbConfig =require('./serverConfig');
// const conPool = mysql.createPool({
//     host: dbConfig.dbHost,
//     database: dbConfig.dbDatabase, 
//     user: dbConfig.dbUserId,
//     password: dbConfig.dbPwd,
// })
// conPool.on('connection', function (connection) {
//     // console.log('Connected to MySql db');
// });
// module.exports = conPool.promise();