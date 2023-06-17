var globalData = require('../global/globalData');
const date = require('date-and-time');
const momentObj = require("moment");
var Database = require('../database/clsQueryProcess');
const { models } = require('../../config/dbConnection');
var database = new Database();
/**
 *@description Class holding methods of instrument usage Log 
 */
class InstrumentUsageLog {

    /**
 * 
 * @param {*} instrument Type of instrument
 * @param {*} IdsNo Ids number
 * @param {*} tableName TableName for instrumwnt usage
 * @param {*} activity Weighment type 
 * @param {*} options Whether started or completed
 */
    async InstrumentUsage(instrument, strResbPi, tableName, activity, options) {
        try {
            var selectedIds = strResbPi;
            var tempCubicInfo = globalData.arrIdsInfo.find(k => k.idsNo == selectedIds);
            var strHmi = tempCubicInfo.Hmi;//await this.getHmi(strResbPi);
            const tempUserObject = globalData.arrUsers.find(k => k.Hmi == strHmi);
            var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.idsNo == strHmi);
            if (IPQCObject != undefined) {
                // strHmi = IPQCObject.idsNo;
                var ipqctempCubicInfo = await models.tbl_cubical.findAll({
                    where: {
                        Sys_IDSNo: strHmi
                    }

                })
                ipqctempCubicInfo.cubicalData = ipqctempCubicInfo.pop()
                if (instrument == 'Balance') {
                    tempCubicInfo.cubicalData.Sys_BalID = ipqctempCubicInfo.cubicalData.Sys_BalID
                }
                if (instrument == 'Hardness') {
                    tempCubicInfo.cubicalData.Sys_HardID = ipqctempCubicInfo.cubicalData.Sys_HardID
                }
                if (instrument == 'DT') {
                    tempCubicInfo.cubicalData.Sys_DTID = ipqctempCubicInfo.cubicalData.Sys_DTID
                }
                if (instrument == 'Moisture Analyzer') {
                    tempCubicInfo.cubicalData.Sys_MoistID = ipqctempCubicInfo.cubicalData.Sys_MoistID
                }
                if (instrument == 'Friabilator') {
                    tempCubicInfo.cubicalData.Sys_FriabID = ipqctempCubicInfo.cubicalData.Sys_FriabID
                }
            }
            var instrumentId;
            switch (instrument) {
                case 'Balance':
                    instrumentId = tempCubicInfo.cubicalData.Sys_BalID;
                    break;
                case 'Vernier':
                    instrumentId = tempCubicInfo.cubicalData.Sys_VernierID;
                    break;
                case 'Hardness':
                    instrumentId = tempCubicInfo.cubicalData.Sys_HardID;
                    break;
                case 'DT':
                    instrumentId = tempCubicInfo.cubicalData.Sys_DTID;
                    break;
                case 'LOD':
                    instrumentId = tempCubicInfo.cubicalData.Sys_MoistID;
                    break;
                case 'Friabilator':
                    instrumentId = tempCubicInfo.cubicalData.Sys_FriabID;
                    break;
                case 'TDT':
                    instrumentId = tempCubicInfo.cubicalData.Sys_TapDensityID;
                    break;

            }

            let tempObj = globalData.arrCurrentOperationStatus.find(k => k.Hmi == strHmi);
            let tempCailibType = globalData.arrcalibType.find(k => k.Hmi == strHmi);
            // if (tempObj === undefined && tempCailibType != undefined) {
            //     globalData.arrCurrentOperationStatus.push({
            //         "Hmi": strHmi,
            //         "Weighment": "1",
            //         "testType": "Weighment"
            //     })
            // }else{
            //     globalData.arrCurrentOperationStatus.push({
            //         "Hmi": strHmi,
            //         "Weighment": "1",
            //         "testType": "Weighment"
            //     })
            // }
            var tempObj1 = globalData.arrCurrentOperationStatus.find(k => k.Hmi == strHmi);

            if ((tempCailibType == undefined || tempCailibType.length == 0) && tempObj1.Weighment == 1 && tempObj1.testType == "Weighment") {
                if (options == 'started') {
                    // var now = new Date();

                    let res = await models[tableName].create({
                        EqpID: instrumentId,
                        FromDT: momentObj().format('YYYY-MM-DD'),
                        FromTM: momentObj().format('HH:mm:ss'),
                        ToDT: momentObj().format('YYYY-MM-DD'),
                        ToTM: momentObj().format('HH:mm:ss'),
                        BatchNo: tempCubicInfo.cubicalData.Sys_Batch,
                        BFGCode: tempCubicInfo.cubicalData.Sys_BFGCode,
                        Activity: activity,
                        UserId: tempUserObject.userId,
                        UserName: tempUserObject.userName,
                        department_name: tempCubicInfo.cubicalData.Sys_dept,
                    });


                } else {
                    var now = new Date();
                    // Selecting Max Record number
                    // var selectDataToUpdate = {
                    //     str_tableName: tableName,
                    //     data: 'MAX(RecNo) as RecNo',
                    //     condition: [
                    //         { str_colName: 'BatchNo', value: tempCubicInfo.cubicalData.Sys_Batch },
                    //         { str_colName: 'BFGCode', value: tempCubicInfo.cubicalData.Sys_BFGCode },
                    //         { str_colName: 'UserId', value: tempUserObject.UserId },
                    //         { str_colName: 'UserName', value: tempUserObject.UserName }
                    //     ]
                    // }

                    let res = await models[tableName].max('RecNo', {
                        where: {
                            BatchNo: tempCubicInfo.cubicalData.Sys_Batch,
                            BFGCode: tempCubicInfo.cubicalData.Sys_BFGCode,
                            UserId: tempUserObject.UserId,
                            UserName: tempUserObject.UserName,
                        }
                    })

                    var RecNo = res;

                    let updateactivityObject = await models[tableName].update(
                        {
                            ToDT: date.format(now, 'YYYY-MM-DD'),
                            ToTM: date.format(now, 'HH:mm:ss'),
                        },
                        {
                            where: {
                                RecNo: RecNo
                            }
                        }
                    )

                    // database.select(selectDataToUpdate).then((res) => {
                    //     var RecNo = res[0][0].RecNo;
                    //     var updateactivityObject = {
                    //         str_tableName: tableName,
                    //         data: [
                    //             { str_colName: "ToDT", value: date.format(now, 'YYYY-MM-DD') },
                    //             { str_colName: "ToTM", value: date.format(now, 'HH:mm:ss') },
                    //         ],
                    //         condition: [
                    //             { str_colName: 'RecNo', value: RecNo }
                    //         ]
                    //     }
                    //     database.update(updateactivityObject).catch(err => { console.log(err) })
                    // }).catch(err => { console.log(err) })
                }
            } else {
                if (options == 'started') {
                    var now = new Date();
                    // var activityObject = {
                    //     str_tableName: tableName,
                    //     data: [
                    //         { str_colName: 'EqpID', value: instrumentId },
                    //         { str_colName: "FromDT", value: date.format(now, 'YYYY-MM-DD') },
                    //         { str_colName: "FromTM", value: date.format(now, 'HH:mm:ss') },
                    //         { str_colName: "BatchNo", value: 'NULL' },
                    //         { str_colName: "BFGCode", value: 'NULL' },
                    //         { str_colName: "UserId", value: tempUserObject.UserId },
                    //         { str_colName: "Activity", value: activity },
                    //         { str_colName: "UserName", value: tempUserObject.UserName },
                    //         { str_colName: "department_name", value: 'Store' },
                    //     ]
                    // }
                    // database.save(activityObject).catch(err => {
                    //     console.log('Error in saving instrument usage for' + instrument)
                    // })

                    let res = await models[tableName].create({
                        EqpID: instrumentId,
                        FromDT: date.format(now, 'YYYY-MM-DD'),
                        FromTM: date.format(now, 'HH:mm:ss'),
                        ToDT: date.format(now, 'YYYY-MM-DD'),
                        ToTM: date.format(now, 'HH:mm:ss'),
                        BatchNo: 'NULL',
                        BFGCode: 'NULL',
                        Activity: activity,
                        UserId: tempUserObject.UserId,
                        UserName: tempUserObject.UserName,
                        department_name: tempCubicInfo.cubicalData.Sys_dept,
                    });


                } else {
                    var now = new Date();
                    // Selecting Max Record number
                    // var selectDataToUpdate = {
                    //     str_tableName: tableName,
                    //     data: 'MAX(RecNo) as RecNo',
                    //     condition: [
                    //         { str_colName: 'BatchNo', value: 'NULL' },
                    //         { str_colName: 'BFGCode', value: 'NULL' },
                    //         { str_colName: 'UserId', value: tempUserObject.UserId },
                    //         { str_colName: 'UserName', value: tempUserObject.UserName }
                    //     ]
                    // }

                    let res = await models[tableName].max('RecNo', {
                        where: {
                            BatchNo: 'NULL',
                            BFGCode: 'NULL',
                            UserId: tempUserObject.UserId,
                            UserName: tempUserObject.UserName,
                        }
                    })

                    // database.select(selectDataToUpdate).then((res) => {
                    //     var RecNo = res[0][0].RecNo;
                    //     var updateactivityObject = {
                    //         str_tableName: tableName,
                    //         data: [
                    //             { str_colName: "ToDT", value: date.format(now, 'YYYY-MM-DD') },
                    //             { str_colName: "ToTM", value: date.format(now, 'HH:mm:ss') },
                    //         ],
                    //         condition: [
                    //             { str_colName: 'RecNo', value: RecNo }
                    //         ]
                    //     }
                    //     database.update(updateactivityObject).catch(err => { console.log(err) })
                    // }).catch(err => { console.log(err) })

                    var RecNo = res;

                    let updateactivityObject = await models[tableName].update(
                        {
                            ToDT: date.format(now, 'YYYY-MM-DD'),
                            ToTM: date.format(now, 'HH:mm:ss'),
                        },
                        {
                            where: {
                                RecNo: RecNo
                            }
                        }
                    )
                }
            }
        } catch (error) {
            throw new Error(error)
        }




    }

    async getHmi(strResbPi) {
        try {
            const obj = {
                str_tableName: 'tbl_idsport_details',
                data: '*',
                condition: [
                    { str_colName: 'Sys_IDSNo', value: strResbPi }
                ]
            }

            let arrRes = await database.select(obj);
            return arrRes[0][0].HMI;
        } catch (error) {
            throw new Error(error)
        }
    }

    async InstrumentUsageForDTandFriab(instrument, strResbPi, tableName, activity, options, startTimedfromOBJ) {
        try {
            var strHmi = strResbPi;
            var tempCubicInfo = globalData.arrIdsInfo.find(k => k.idsNo == strHmi);
            strHmi = tempCubicInfo.Hmi;//await this.getHmi(strResbPi);
            const tempUserObject = globalData.arrUsers.find(k => k.Hmi == strHmi);
            var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.idsNo == strHmi);
            if (IPQCObject != undefined) {
                // strHmi = IPQCObject.idsNo;
                var ipqctempCubicInfo = await models.tbl_cubical.findAll({
                    where: {
                        Sys_IDSNo: strHmi
                    }

                })
                ipqctempCubicInfo.cubicalData = ipqctempCubicInfo.pop()
                if (instrument == 'Balance') {
                    tempCubicInfo.cubicalData.Sys_BalID = ipqctempCubicInfo.cubicalData.Sys_BalID
                }
                if (instrument == 'Hardness') {
                    tempCubicInfo.cubicalData.Sys_HardID = ipqctempCubicInfo.cubicalData.Sys_HardID
                }
                if (instrument == 'DT') {
                    tempCubicInfo.cubicalData.Sys_DTID = ipqctempCubicInfo.cubicalData.Sys_DTID
                }
                if (instrument == 'Friabilator') {
                    tempCubicInfo.cubicalData.Sys_FriabID = ipqctempCubicInfo.cubicalData.Sys_FriabID
                }
            }
            var instrumentId;
            switch (instrument) {
                case 'Balance':
                    instrumentId = tempCubicInfo.cubicalData.Sys_BalID;
                    break;
                case 'Vernier':
                    instrumentId = tempCubicInfo.cubicalData.Sys_VernierID;
                    break;
                case 'Hardness':
                    instrumentId = tempCubicInfo.cubicalData.Sys_HardID;
                    break;
                case 'DT':
                    instrumentId = tempCubicInfo.cubicalData.Sys_DTID;
                    break;
                case 'LOD':
                    instrumentId = tempCubicInfo.cubicalData.Sys_MoistID;
                    break;
                case 'Friabilator':
                    instrumentId = tempCubicInfo.cubicalData.Sys_FriabID;
                    break;
            }

            let tempObj = globalData.arrCurrentOperationStatus.find(k => k.Hmi == strHmi);
            let tempCailibType = globalData.arrcalibType.find(k => k.Hmi == strHmi);

            var tempObj1 = globalData.arrCurrentOperationStatus.find(k => k.Hmi == strHmi);

            if ((tempCailibType == undefined || tempCailibType.length == 0)) {
                if (options == 'started') {
                    var now = new Date();

                    let res = await models[tableName].create({
                        EqpID: instrumentId,
                        FromDT: date.format(now, 'YYYY-MM-DD'),
                        FromTM: startTimedfromOBJ,
                        ToDT: date.format(now, 'YYYY-MM-DD'),
                        ToTM: date.format(now, 'HH:mm:ss'),
                        BatchNo: tempCubicInfo.cubicalData.Sys_Batch,
                        BFGCode: tempCubicInfo.cubicalData.Sys_BFGCode,
                        Activity: activity,
                        UserId: tempUserObject.UserId,
                        UserName: tempUserObject.UserName,
                        department_name: tempCubicInfo.cubicalData.Sys_CubicName,
                    });


                } else {
                    var now = new Date();
                    let res = await models[tableName].max('RecNo', {
                        where: {
                            BatchNo: tempCubicInfo.cubicalData.Sys_Batch,
                            BFGCode: tempCubicInfo.cubicalData.Sys_BFGCode,
                            UserId: tempUserObject.UserId,
                            UserName: tempUserObject.UserName,
                        }
                    })

                    var RecNo = res;

                    let updateactivityObject = await models[tableName].update(
                        {
                            ToDT: date.format(now, 'YYYY-MM-DD'),
                            ToTM: date.format(now, 'HH:mm:ss'),
                        },
                        {
                            where: {
                                RecNo: RecNo
                            }
                        }
                    )

                }
            } else {
                if (options == 'started') {
                    var now = new Date();


                    let res = await models[tableName].create({
                        EqpID: instrumentId,
                        FromDT: date.format(now, 'YYYY-MM-DD'),
                        FromTM: startTimedfromOBJ,
                        ToDT: date.format(now, 'YYYY-MM-DD'),
                        ToTM: date.format(now, 'HH:mm:ss'),
                        BatchNo: 'NULL',
                        BFGCode: 'NULL',
                        Activity: activity,
                        UserId: tempUserObject.UserId,
                        UserName: tempUserObject.UserName,
                        department_name: tempCubicInfo.cubicalData.Sys_CubicName,
                    });


                } else {
                    var now = new Date();

                    let res = await models[tableName].max('RecNo', {
                        where: {
                            BatchNo: 'NULL',
                            BFGCode: 'NULL',
                            UserId: tempUserObject.UserId,
                            UserName: tempUserObject.UserName,
                        }
                    })



                    var RecNo = res;

                    let updateactivityObject = await models[tableName].update(
                        {
                            ToDT: date.format(now, 'YYYY-MM-DD'),
                            ToTM: date.format(now, 'HH:mm:ss'),
                        },
                        {
                            where: {
                                RecNo: RecNo
                            }
                        }
                    )
                }
            }
        } catch (error) {
            throw new Error(error)
        }
    }


}
module.exports = InstrumentUsageLog;