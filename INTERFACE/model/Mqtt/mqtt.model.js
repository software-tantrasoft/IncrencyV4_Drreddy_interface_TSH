//packages
var mqtt_1 = require("mqtt");
const ip = require('ip');
const date = require('date-and-time');

//modules
var clsMqttHandler = require('./MQTTHandler.model');
const mqttSender = require('./mqttSender.class')
const globalData = require('../../global/globalData');
const clsCommonOperation = require('../Product/clsCommonInsertOperation.model');

const models = require('../../../config/dbConnection').models;
const sequelize = require('../../../config/dbConnection').sequelize;

// const sequelize = require('../../../models').sequelize
// const { tbl_idsport_details } = require('../../../models/init-models').initModels(sequelize)
const { Op } = require("sequelize");

//mqtt connection
const client = mqtt_1.connect(`tcp://${ip.address()}:1883`);

//instances of Classes
const mqttHandler = new clsMqttHandler();
const mqttObj = new mqttSender();
const objCommonOperation = new clsCommonOperation();

const initRaspberryPi = async () => {
    try {
        var objMQTT = new MQTT();
        let allDaqSrNo = await objMQTT.getGetAllDaqSrnoForRaspberry();
        let allHmiNo = await objMQTT.getGetAllHmi();

        await objMQTT.monitOperation()

        for (var obj of allDaqSrNo) {
            console.log(`${obj}_out`)
            client.subscribe(`${obj}_out`);
        }

        for (var obj of allHmiNo) {
            client.subscribe(`${obj.HMI}_out`);
        }


    } catch (e) {
        console.log(e.stack);
        process.exit();
    }
}

client.on("connect", initRaspberryPi);

client.on('message', function (topic, message) {
    let str_Protocol = message.toString();
    console.log(`Topic : ${topic} ; Message : ${message.toString()} , ${date.format(new Date(), 'YYYY-MM-DD HH:mm:ss')}`);
    let uniqueSerialNumber = topic.slice(0, -4);

    var objMQTT = new MQTT();
    objMQTT.recivedData(str_Protocol, uniqueSerialNumber);

});


// const a = client.getLastMessageId();


class MQTT {

    recivedData(strRecivedData, uniqueSerialNumber) {
        try {
            //get data from global array of activity
            mqttHandler.handleProtocol(strRecivedData, uniqueSerialNumber);
        } catch (error) {
            console.log(error);
        }
    }

    async getGetAllDaqSrnoForRaspberry() {
        try {
            let arrOfDaqSrnoResult = await objCommonOperation.getCubicalIdsNo();
            let rpiDetails1 = await models.tbl_rpi.findAll({
            })

            rpiDetails1 = rpiDetails1.map(k => k.RPIID != "" ? k.RPIID : "").filter(k => k != "NULL" && k != "" && k != "null")
            return rpiDetails1;
            
        } catch (error) {
            throw new Error(error)
        }
    }

    async getGetAllHmi() {
        try {
            let rpiDetails = await models.tbl_cubical.findAll({
                where: {
                    Sys_IDSNo: {
                        [Op.ne]: 0
                    }
                }
            })
            rpiDetails = rpiDetails.map(k => k.Sys_IDSNo != "" ? k.Sys_IDSNo : "").filter(k => k != "NULL" && k != "")
            return rpiDetails;
            // return [arrOfHmiResult[0]];
        } catch (error) {
            throw new Error(error)
        }
    }

    // async getSpecificHmi(idsNO, portNo) {
    //     try {
    //         const objGetHmi = {
    //             str_tableName: 'tbl_idsport_details',
    //             data: '*',
    //             condition: [
    //                 { str_colName: 'Sys_IDSNo', value: idsNO },
    //                 { str_colName: 'Sys_PortNo', value: portNo }
    //             ]
    //         }
    //         let result = await database.select(objGetHmi)
    //         return result[0][0].HMI;

    //     } catch (error) {

    //     }
    // }


    async monitOperation () {
        let boothArr = []
        let cubicalDetails = await models.tbl_cubical.findAll({
            where: {
                Sys_IDSNo: {
                    [Op.ne]: 0
                }
            }
        })
       // rpiDetails = rpiDetails.map(k => k.Sys_IDSNo != "" ? k.Sys_IDSNo : "").filter(k => k != "NULL" && k != "")
   
        for (let obj of cubicalDetails) {
            //push here the monit socket arr
            let initMonitobj = {
                cno: obj.Sys_CubicNo,
                cubicName: obj.Sys_CubicName,
                Hmi: obj.Sys_IDSNo,
                idsNo: obj.Sys_rpi,
                status: 'Offline',
                cubicArea: obj.Sys_Area,
                userName: 'NA',
                userID: 'NA',
                selection1: 'NA',
                selection2: 'NA',
                selection3: 'NA',
                selection4: 'NA',
                selection5: 'NA',
                weight: [ // {wt:'', flag:out/in}

                ],
                bulkData: '',
                dweight: { tare: 0, gross: 0, net: 0 }
            }
            boothArr.push(initMonitobj)
        }
        globalData.arrMonitCubic = boothArr;
    }



}

module.exports = MQTT;