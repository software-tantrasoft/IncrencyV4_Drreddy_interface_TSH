//packages
var mqtt = require("mqtt");
const ip = require('ip')

//mqtt connection
const client = mqtt.connect(`tcp://${ip.address()}:1883`);

const Database = require('../../database/clsQueryProcess');
const clsCommonOperation = require('../Product/clsCommonInsertOperation.model');
// const objCommonOperation = new clsCommonOperation();

const models = require('../../../config/dbConnection').models;
const sequelize = require('../../../config/dbConnection').sequelize;
const GLOBAL_NOMENCLATURE = require('../../global/GLOBAL_NOMENCLATURE')

const database = new Database();


class MQTTSender {

    sendData(srno, dataToSend) {
        try {
            let strHmi = srno;
            // var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.selectedIds.Idsno == strHmi);
            // if (IPQCObject != undefined) {
            //     srno = IPQCObject.idsNo;
            // } else {
            //     srno = strHmi;
            // }
            if (srno != GLOBAL_NOMENCLATURE.MonitSocket) {
                //get serial no and send the mqtt message instead of alias;
                const rpiSerialNo = (async (srno) => {
                    let rpiObj = await models.tbl_rpi.findOne({
                        atrributes: ["RPIID"],
                        where: {
                            "IDSNo": srno
                        }
                    })

                    srno = rpiObj.RPIID

                    //for MQTT protocol Serial number logic
                    //   var msgId = client.getLastMessageId();
                    //   globalData.arrMQTTUnsendMsg.push({id : srno,message: dataToSend, time: new moment()});

                    //   client.publish(`${msgId}|${srno}_in`, dataToSend, { qos: 2 },(err,res)=>{
                    client.publish(`${srno}_in`, dataToSend, { qos: 2 }, (err, res) => {
                        if (err) {
                            console.log(err, "errr while sending mqtt packet")
                            return
                        }
                        // console.log(res);
                    });

                    client.publish(`${srno}_in`, "received", { qos: 2 }, (err, res) => {
                        if (err) {
                            console.log(err, "errr while sending mqtt packet")
                            return
                        }
                        // console.log(res);
                    });
                })(srno);

            }else{
                client.publish(`${srno}_in`, dataToSend, { qos: 2 }, (err, res) => {
                    if (err) {
                        console.log(err, "errr while sending mqtt packet")
                        return
                    }                    
                    // console.log(res);
                });
               // loggers.NodeToAndroidProtocolsLogger.info(`protocol : ${dataToSend} sended to device : ${srno}`)
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    async getGetAllDaqSrnoForRaspberry() {
        try {
            let arrOfDaqSrnoResult = await objCommonOperation.getCubicalIdsNo();
            return arrOfDaqSrnoResult[0];
        } catch (error) {
            throw new Error(error);
        }
    }


    async getGetAllHmi() {
        try {
            const objGetAllHmi = {
                str_tableName: 'tbl_idsport_details',
                data: 'HMI'
            }
            var arrOfHmiResult = await database.select(objGetAllHmi);
            return arrOfHmiResult[0];
        } catch (error) {
            throw new Error(error);
        }
    }


}

module.exports = MQTTSender;