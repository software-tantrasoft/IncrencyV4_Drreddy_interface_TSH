
const Database = require('../database/clsQueryProcess');
const database = new Database();


// const sequelize = require('../../models').sequelize

// const { tbl_idsport_details } = require('../../models/init-models').initModels(sequelize)

// const { tbl_idsport_details } = require('../../config/dbConnection').models;
// const sequelize  = require('../../config/dbConnection').sequelize


const models = require('../../config/dbConnection').models;
const sequelize = require('../../config/dbConnection').sequelize;
const { QueryTypes } = require('sequelize');


class Hmi {

    async getHMIStatus(value) {
        let hmi = value.hmi;
        let resObj = {};
        const connectHmiDetailObj = await models.IdsPortDetails.findAll({
            where: 
                {  'HMI': hmi },
        });
        let arrResult = await database.select(connectHmiDetailObj);
        if (arrResult[0][0] == undefined || arrResult[0][0] == "") {
            Object.assign(resObj, { status: "fail" }, { result: 'IDS Not Connected' });
            return resObj;
        }
        else {
            Object.assign(resObj, { status: "success" }, { result: arrResult[0][0] });
            return resObj;
        }
    }

    async getResbPiNoFromHmi(strHmi) {
        let hmiDetails = await models.tbl_rpi.findAll({ where: { "IDSNo": strHmi } })
        hmiDetails[0].Sys_IDSNo = hmiDetails[0].RPIID
        return [hmiDetails[0]];
       // let arrRes = await database.select(objHmi);
        //return arrRes[0];
    }


    async getHmiNoFromResbPi(strResberryPi) {
        let objHmi = await models.tbl_rpi.findAll({
            where: {
                RPIID: strResberryPi
            }
        })
     let arrRes= [objHmi[0]];
     return arrRes[0].IDSNo


        //     const objHmi = {
        //         str_tableName : 'tbl_idsport_details',
        //         data : '*',
        //         condition : [
        //             {str_colName : 'Sys_IDSNo' , value : strResberryPi}
        //         ]
        //     }
        //     let arrRes = await database.select(objHmi);
        //     return arrRes[0][0].HMI;
    }

    async idsPortSetting(strHmi) {
        try {
            //to exclude idsport detail usage

            let objIdsPortDetails = await models.tbl_idsport_details.findAll({
                where:
                {
                   HMI: strHmi 
                }
                
            })
            let resIdsPort= [objIdsPortDetails[0]]
            return resIdsPort[0]
    
        } catch (error) {

        }
    }
    async getAliasOfRPI(RPi) {
        try {
            let objIdsPortDetails = await models.tbl_rpi.findAll({
                where:
                {
                    RPIID: RPi 
                }
                
            })
            let resIdsPort= [objIdsPortDetails[0]]
            return resIdsPort[0].IDSNo
    
        } catch (error) {

        }
    }

}
module.exports = Hmi;