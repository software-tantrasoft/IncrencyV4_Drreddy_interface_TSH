const sort = require('./Calibration/checkForPendingCalib');
const Database = require('../database/clsQueryProcess')
const globalData = require('../global/globalData');
const moment = require('moment');
const date1 = require('date-and-time');
const clsCommonOperation = require('./Product/clsCommonInsertOperation.model');

const clsHmi = require('./hmiDetail.model');
const objHmi = new clsHmi()
const objCommonOperation = new clsCommonOperation();

const database = new Database();
let now = new Date();


// const { sequelize, Sequelize } = require('../../models');
const models = require('../../config/dbConnection').models
const sequelize = require('../../config/dbConnection').sequelize
const { Op } = require("sequelize");
const { tbl_recalibration_balance_status,
    tbl_calibration_sequnce,
    tbl_calibration_status, tbl_balance,
    tbl_calibration_periodic_master,

} = require('../../models/init-models').initModels(sequelize)

class FetchDetail {


    // *****************************************************************************************************8//
    // Below function gets all parameters from tbl_cubical
    //****************************************************************************************************** */

    async getAllDaqSrNo() {
        try {
            let arrDaqMaster = await objCommonOperation.getCubicalIdsNo();
            return arrDaqMaster[0];
        } catch (error) {
            console.log("Error while fetching Resberpi");
        }

    }

    // *****************************************************************************************************8//
    // Below function gets all parameters from tbl_config
    //****************************************************************************************************** */
    async getAllParameters() {
        try {
            var selectParamObj = {
                str_tableName: 'tbl_setallparameter',
                data: '*',
            }
            let arrSetPara = await database.select(selectParamObj);
            return arrSetPara[0];
        } catch (error) {
            console.log("Error while fetching setallparameter");
        }

    }

    // *****************************************************************************************************8//
    // Below function gets calibration sequence
    //****************************************************************************************************** */
    async getCalibrationSequence() {
        try {
            // var selectParamObj = {
            //     str_tableName: 'tbl_calibration_sequnce',
            //     data: '*',
            // }

            let arrCaliSeq = await tbl_calibration_sequnce.findAll();
            return [arrCaliSeq[0]];

        } catch (error) {
            console.log("Error while fetching CalibrationSequence");
        }

    }

    // *****************************************************************************************************8//
    // Below function gets recalibration status for that balance
    //****************************************************************************************************** */
    async getRecalibBalanceStatus(strTableName) {
        try {

            // var selectParamObj = {
            //     str_tableName: strTableName,
            //     data: '*',
            // }
            //let resReCalib = await database.select(selectParamObj)
            let resReCalib = await models[strTableName].findAll();
            resReCalib = resReCalib.map(k => k)
            return resReCalib;
        } catch (error) {
            throw new Error(error)
        }
    }

    // *****************************************************************************************************8//
    // Below function gets calibration status weather it id done or not done
    //****************************************************************************************************** */
    async getCaibrationStatus(strBalID, strIdsNo, balType) {
        try {
            var strBalId = strBalID;
            // const selectBalData = {
            //     str_tableName: 'tbl_balance',
            //     data: '*',
            //     condition: [
            //         { str_colName: 'Bal_ID', value: strBalId, comp: 'eq' }
            //     ]
            // }
            // let arrselectBalData = await database.select(selectBalData);

            var arrselectBalData = await tbl_balance.findOne({
                where: {
                    'Bal_ID': strBalId
                }
            });
            arrselectBalData = [[arrselectBalData]]



            const bln_storeType = arrselectBalData[0][0].Bal_CalbStoreType.readUIntLE()
            var today = new Date();
            var month = today.getMonth();
            var year = today.getFullYear();
            // bln_storeType = 1 for setDays && 0 for set dates (1,7,15,21,30)
            if (bln_storeType == 1) {
         
                let arrCheckFroCalbPendingObj = await tbl_balance.findAll({
                    where: {
                        'Bal_ID': strBalId,
                        // 'Bal_CalbDueDt': date1.format(now, 'YYYY-MM-DD'),
                        'Bal_CalbDueDt': {[Op.lte]: date1.format(now, 'YYYY-MM-DD')},
                    }
                });

                
                if (arrCheckFroCalbPendingObj.length != 0) {
                    this.pushCalibrationObj(strBalId, strIdsNo, balType);
                }

            }
            else {
                var arr = arrselectBalData[0][0].Bal_CalbDates.split(',');
                var today = new Date();
                var todayDate = moment().format('YYYY-MM-DD');
                var month = today.getMonth() + 1;
                month = ("0" + month).slice(-2);
                var year = today.getFullYear();
                var arr_calibdates = []
                for (let i = 0; i < arr.length; i++) {
                    var day = ("0" + arr[i]).slice(-2)
                    var date = '';
                    date = year + '-' + month + '-' + day;
                    if (todayDate >= date) {
                        arr_calibdates.push(date);
                    }
                }
                let _checkForFirstCalib = await this.checkForFirstCalib(strBalId);
                const tableName = _checkForFirstCalib.tableName;
                const fieldName = _checkForFirstCalib.fieldName;
                arr_calibdates.forEach((v) => {
                    // check if master table has entry or not in the very first calibration master table
                    var selectObj = {
                        str_tableName: tableName,
                        data: '*',
                        condition: [
                            { str_colName: fieldName, value: v, comp: 'gte' },
                        ]
                    }
                    let objSelect = database.select(selectObj);
                    // if (objSelect[0].length == 0) {
                    this.pushCalibrationObj(strBalId, strIdsNo, balType);
                    // }

                })

            }
        } catch (error) {
            throw new Error(error)
        }

    }

    // *********************************************************************************************************//
    async pushCalibrationObj(strBalId, strIdsNo, balType) {
        try {
            // var objOwner = globalData.arrPreWeighCalibOwner.find(k => k.idsNo == strIdsNo);
            if (balType == 'analytical') {
                var calibTable = 'tbl_calibration_status';
            } else {
                var calibTable = 'tbl_calibration_status_bin';
            }

            var result = await models[calibTable].findOne({
                where: {
                    'BalID': strBalId
                }
            });
            result = result
            // let calibrationStatus = [];
            const tempObj = {
                P: result.P,
                E: result.E,
                R: result.R,
                U: result.U,
                L: result.L,
                V: result.V
            }
            let statusEqualToOne = Object.keys(tempObj).filter(k => tempObj[k].readUIntLE() == 1);
            if (statusEqualToOne.length > 0) {
                //check date in their respective table inompMaster
                let tableName, maxRepNo, balId,calbDate;
                switch (statusEqualToOne[0]) {
                    case 'P': {
                        tableName = 'tbl_calibration_periodic_master_incomplete'
                        maxRepNo = 'Periodic_RepNo'
                        balId = 'Periodic_BalID'
                        calbDate = 'Periodic_CalbDate'
                    }
                        break;
                    case 'E': {
                        tableName = 'tbl_calibration_eccentricity_master_incomplete'
                        maxRepNo = 'Eccent_RepNo'
                        balId = 'Eccent_BalID'
                        calbDate = 'Eccent_CalbDate'
                    }
                        break;
                    case 'R': {
                        tableName = 'tbl_calibration_repetability_master_incomplete'
                        maxRepNo = 'Repet_RepNo'
                        balId = 'Repet_BalID'
                        calbDate = 'Repet_CalbDate'
                    }
                        break;
                    case 'U': {
                        tableName = 'tbl_calibration_uncertinity_master_incomplete'
                        maxRepNo = 'Uncertinity_RepNo'
                        balId = 'Uncertinity_BalID'
                        calbDate = 'Uncertinity_CalbDate'
                    }
                        break;
                    case 'L': {
                        tableName = 'tbl_calibration_linearity_master_incomplete'
                        maxRepNo = 'Linear_RepNo'
                        balId = 'Linear_BalID'
                        calbDate = ''
                    }
                        break;
                }

                let result = await models[tableName].findAll({
                    //  attributes:[[sequelize.fn('max'),sequelize.col(`${[maxRepNo]}`)]],
                    where: {
                        [balId]: strBalId
                    }

                })

                // let dateOnWhichCalibWasDone = result[0].Periodic_CalbDate;
                let dateOnWhichCalibWasDone = result[0][calbDate];
                if (!(dateOnWhichCalibWasDone == moment().format('YYYY-MM-DD'))) {
                    //update calib 
                  

                    await models.tbl_calibration_status.update({
                        P: 0,
                        E: 0,
                        U: 0,
                        R: 0,
                        L: 0, 
                    },{
                        where: {
                            "BalID": strBalId
                        }
                    })
                

                console.log(result)
            }
        }
            result = await models[calibTable].findOne({
                where: {
                    'BalID': strBalId
                }
            });
            tempObj.P = result.P;
            tempObj.E = result.E;
            tempObj.R = result.R;
            tempObj.U = result.U;
            tempObj.L  = result.L;
            tempObj.V = result.V;
            
            var objFound = globalData.calibrationStatus.find(k => k.BalId == strBalId);
            if (objFound == undefined) {
                globalData.calibrationStatus.push({ BalId: strBalId, status: tempObj });
            } else {
                objFound.BalId = strBalId;
                objFound.status = tempObj;
                //hmi or  resbppi
            }

            // calibrationStatus.push({ BalId: strBalId, status: tempObj });
            return 0;
        } catch (err) {
            throw new Error(err);
        }
    }

    // *********************************************************************************************************//
    async checkForFirstCalib(strBalId) {
        try {
            var sortedArray = await sort.sortedSeqArray(globalData.arrSortedCalib, strBalId);
            var calibType = sortedArray[0];
            switch (calibType) {
                case 'P':
                    var tempObj = {
                        tableName: 'tbl_calibration_periodic_master',
                        fieldName: 'Periodic_CalbDate'
                    }
                    return tempObj;
                    next();
                    break;
                case 'R':
                    var tempObj = {
                        tableName: 'tbl_calibration_repetability_master',
                        fieldName: 'Repet_CalbDate'
                    }
                    return tempObj;
                    next();
                    break;
                case 'E':
                    var tempObj = {
                        tableName: 'tbl_calibration_eccentricity_master',
                        fieldName: 'Eccent_CalbDate'
                    }
                    return tempObj;
                    next();
                    break;
                case 'U':
                    var tempObj = {
                        tableName: 'tbl_calibration_uncertinity_master',
                        fieldName: 'Uncertinity_CalbDate'
                    }
                    return tempObj;
                    next();
                    break;
                case 'L':
                    var tempObj = {
                        tableName: 'tbl_calibration_linearity_master',
                        fieldName: 'Linear_CalbDate'
                    }
                    return tempObj;
                    next();
                    break;
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    // *********************************************************************************************************//
    async checkBalanceInStatus_Re_tables(strIdsNo, BalID, balType) {
        try {
            // var objOwner = globalData.arrPreWeighCalibOwner.find(k => k.idsNo == strIdsNo);
            let sequelizeModelForCalib, sequelizeModelForReCalib;
            if (balType == 'analytical') {
                var recalliTable = `tbl_recalibration_balance_status`;
                var calibTable = 'tbl_calibration_status';
                sequelizeModelForCalib = tbl_calibration_status;
                sequelizeModelForReCalib = tbl_recalibration_balance_status;
            } else {
                var recalliTable = `tbl_recalibration_balance_status_bin`;
                var calibTable = 'tbl_calibration_status_bin';

            }

            // const objCalibration_Status = {
            //     str_tableName: calibTable,
            //     data: '*',
            //     condition: [
            //         { str_colName: 'BalID', value: BalID }
            //     ]
            // }

            //var result_Status = await database.select(objCalibration_Status);
            var result_Status = await models[calibTable].findAll({
                where: {
                    'BalID': BalID
                }
            })
            result_Status = [result_Status[0]]

            // const objReCalibration_Status = {
            //     str_tableName: recalliTable,
            //     data: '*',
            //     condition: [
            //         { str_colName: 'Bal_ID', value: BalID }
            //     ]
            // }

            // var result_ReCalibStatus = await database.select(objReCalibration_Status);
            var result_ReCalibStatus = await models[recalliTable].findAll({
                where: {
                    'Bal_ID': BalID
                }
            })
            result_ReCalibStatus = [result_ReCalibStatus[0].dataValues]

            if (result_Status[0].length == 0 || result_ReCalibStatus.length == 0) {
                return true;
            }
            else {
                return false;
            }
        } catch (error) {
            throw new Error(error)
        }

    }


    //***************************************************************************************** */
    async getBalanceCalibDetails(strBalID, strHmi) {
        // const tempCubicInfo = globalData.arrIdsInfo.find(k => k.Sys_IDSNo == parseInt(IDSSrNo));
        try {
            var strBalId = strBalID;
            // FOR PERIODIC
            var todayDate = moment().format('YYYY-MM-DD');
            // const selectBalCaliData = {
            //     str_tableName: 'tbl_calibration_periodic_master',
            //     data: '*',
            //     condition: [
            //         { str_colName: 'Periodic_BalID', value: strBalId, comp: 'eq' },
            //         { str_colName: 'Periodic_CalbDate', value: todayDate, comp: 'eq' }
            //     ]
            // }
            // let resCalibPeridPend = await database.select(selectBalCaliData);
            let resCalibPeridPend = await tbl_calibration_periodic_master.findAll({
                where: {
                    "Periodic_BalID": strBalId,
                    "Periodic_CalbDate": todayDate
                }
            })
            resCalibPeridPend = [resCalibPeridPend]
            if (resCalibPeridPend[0].length > 0) {
                let hmidetails = globalData.arrBalCaibDet.find(k => k.Hmi == strHmi);
                if (hmidetails == undefined) {
                    globalData.arrBalCaibDet.push({
                        Hmi: strHmi,
                        strBalId: strBalId,
                        isPeriodicDone: true,
                    })
                } else {
                    hmidetails.strBalId = strBalId,
                    hmidetails.isPeriodicDone = true
                }

            } else {
                let hmidetails = globalData.arrBalCaibDet.find(k => k.Hmi == strHmi);
                if (hmidetails == undefined) {
                    globalData.arrBalCaibDet.push({
                        Hmi: strHmi,
                        strBalId: strBalId,
                        isPeriodicDone: false,
                    })
                } else {
                    hmidetails.strBalId = strBalId;
                    hmidetails.isPeriodicDone = false
                }
            }
        } catch (error) {
            throw new Error(error)
        }

    }

    /**check for right */
    async checkForRights(strHmi, strUserId) {
        try {
            var arrResbPiNo = await objHmi.getResbPiNoFromHmi(strHmi);
            var strIdsNo = arrResbPiNo[0].Sys_IDSNo;

            var arr_rights = [];
            let selectRole = {
                str_tableName: 'tbl_users',
                data: 'Role',
                condition: [
                    { str_colName: 'UserID', value: strUserId }
                ]
            }
            let roleResult = await database.select(selectRole);
            let roleName = roleResult[0][0].Role;
            // For role Rights
            let selectRights = {
                str_tableName: 'tbl_role',
                data: 'role_rights',
                condition: [
                    { str_colName: 'role_name', value: roleName },
                    { str_colName: 'locked', value: 0 }
                ]
            }
            let roleRights = await database.select(selectRights);
            arr_rights = arr_rights.concat(roleRights[0]).map(k => k.role_rights);
            // For special rights
            let selectSpecialRights = {
                str_tableName: 'tbl_rights_special',
                data: 'spl_right',
                condition: [
                    { str_colName: 'userid', value: strUserId },
                ]
            }
            let specialRights = await database.select(selectSpecialRights);
            let tempSplArr = specialRights[0].map(k => k.spl_right)
            arr_rights = arr_rights.concat(tempSplArr);
            // For remove rights
            let selectRemoveRights = {
                str_tableName: 'tbl_rights_removed',
                data: 'removed_right',
                condition: [
                    { str_colName: 'userid', value: strUserId },
                ]
            }
            let removeRights = await database.select(selectRemoveRights);
            let tempRmvArr = removeRights[0].map(k => k.removed_right)
            arr_rights = arr_rights.filter(
                item => tempRmvArr.indexOf(item) < 0
            );
            let tempRightObj = globalData.arrUserRights.find(t => t.Hmi == strHmi);
            if (tempRightObj == undefined) {
                globalData.arrUserRights.push({
                    Hmi: strHmi,
                    idsNo: strIdsNo,
                    UserId: strUserId,
                    rights: arr_rights
                })
            } else {
                tempRightObj.UserId = strUserId;
                tempRightObj.rights = arr_rights;
            }
            return 1;
        } catch (error) {
            throw new Error(error)
        }
    }


}

module.exports = FetchDetail;