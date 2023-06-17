const moment = require('moment')
const Database = require('../database/clsQueryProcess');
const date = require('date-and-time');
const globalData = require('../global/globalData');
var clsArrayInit = require('../global/clsArrayInitialize');
const GlobalProtocol = require('../global/CalibrationProtocol')
const clsIpqc = require('../model/IPQC/ipqc.model');
const clsHmi = require('../model/hmiDetail.model');
const serverConfig = require('../global/serverconfig');
const GLOBAL_NOMENCLATURE = require('../global/GLOBAL_NOMENCLATURE');
const clsCalibModeule = require('./Calibration/clsdailyCalibration.model');
const clsCommonFun = require('./Product/clsCommonInsertOperation.model');
const FetchDetail = require('./clsFetchDetails.model');
const caliDecider = require('./Calibration/calibDecider');
const clsActivityLog = require('./clsActivityLog.model');
const clsConfigSettings = require('./clsConfigSettings');
const clsPreCalibrationWeigth = require('./Calibration/clsPreCalibrationWeight.model');
const { Op } = require('sequelize')
const models = require('../../config/dbConnection').models
const { sequelize } = require('../../config/dbConnection')

const { pendingIpcWeighment } = require('../model/IPC/ipc.model')

const database = new Database();
const objActivityLog = new clsActivityLog();
const objHmi = new clsHmi();
var objArrayInit = new clsArrayInit();
const objIpqc = new clsIpqc();

const objActualCheckOfCalibrationPen = new clsCalibModeule();
const fetchDetails = new FetchDetail();
const objPreWeighmentCheck = new clsPreCalibrationWeigth();
const objConfigSettings = new clsConfigSettings();
const objCommonFunOperation = new clsCommonFun();



const { tbl_cubical,
    tbl_balance,
    tbl_calibration_periodic_master,
    tbl_calibration_uncertinity_master } = require('../../config/dbConnection').models;




class CalibrationBal {

    constructor() { }

    async getBallList(value) {
        try {

            let objActivity = {};
            let resObj = {};
            var strUserId = value.UserId;
            var strPassword = value.Password;
            var strHmi = value.Hmi;
            var arrResbPiNo = await objHmi.getResbPiNoFromHmi(value.Hmi);
            var strResbPiNo = arrResbPiNo[0].Sys_IDSNo;

            (globalData.arrBalCalibWeights.findIndex((element) => element.Hmi === strHmi)) == -1 ? globalData.arrBalCalibWeights : globalData.arrBalCalibWeights.splice(globalData.arrBalCalibWeights.findIndex((element) => element.Hmi === strHmi), 1);
            (globalData.arrsendWt.findIndex((element) => element.Hmi === strHmi)) == -1 ? globalData.arrsendWt : globalData.arrsendWt.splice(globalData.arrsendWt.findIndex((element) => element.Hmi === strHmi), 1);
            (globalData.arrCalibCounterApi.findIndex((element) => element.Hmi === strHmi)) == -1 ? globalData.arrCalibCounterApi : globalData.arrCalibCounterApi.splice(globalData.arrCalibCounterApi.findIndex((element) => element.Hmi === strHmi), 1);
            (globalData.arrCalibInsertCounter.findIndex((element) => element.Hmi === strHmi)) == -1 ? globalData.arrCalibInsertCounter : globalData.arrCalibInsertCounter.splice(globalData.arrCalibInsertCounter.findIndex((element) => element.Hmi === strHmi), 1);
            (globalData.arrWeighmentCounter.findIndex((element) => element.Hmi === strHmi)) == -1 ? globalData.arrWeighmentCounter : globalData.arrWeighmentCounter.splice(globalData.arrWeighmentCounter.findIndex((element) => element.Hmi === strHmi), 1); //counter clear
            (globalData.arrCalibCounter.findIndex((element) => element.Hmi === strHmi)) == -1 ? globalData.arrCalibCounter : globalData.arrCalibCounter.splice(globalData.arrCalibCounter.findIndex((element) => element.Hmi === strHmi), 1); //counter clear
            var result = await objCommonFunOperation.getCubicalData(strHmi)
            result = [result]

            let CurrentCubicInfo = globalData.arrIdsInfo.find(k => k.Hmi == strHmi); //empty
            if (CurrentCubicInfo == undefined) {
                globalData.arrIdsInfo.push({
                    Hmi: strHmi,
                    idsNo: strResbPiNo,
                    cubicalData: result[0][0]
                })
            } else {
                CurrentCubicInfo.cubicalData = result[0][0];
            }

            CurrentCubicInfo = globalData.arrIdsInfo.find(k => k.idsNo == strResbPiNo).cubicalData;

            await this.CalibrationInProcess(CurrentCubicInfo.Sys_CubicNo);
            var balToCalib = await this.pendingCalibration(strResbPiNo, strHmi, strUserId, strPassword);
            let inBetween = this.checkinCalSkipTime();
            if (balToCalib != undefined) {
                if (inBetween) {
                    if (balToCalib.result[0].Message.includes("Eccentricity") || balToCalib.result[0].Message.includes("Repeatability")) {
                        inBetween = false
                    }
                }
            }
            // let inBetween= this.checkinCalSkipTime();
            // moment().format(now, ' hh:mm:ss '); 
            if (inBetween) {
                let _obj = {
                    status: "success",
                    BalId: CurrentCubicInfo.Sys_BalID,
                    precalibration: "false",
                    pending: "true",
                    Message: "No calibration pending",
                    Reminder: "",
                    readyToUse: "false",
                    type: "analytical",
                    portNo: 1
                }

                return Object.assign(resObj, { status: "success", result: [_obj] })

            }


            // balToCalib = await this.pendingCalibration(strResbPiNo, strHmi, strUserId, strPassword);

            if (balToCalib.status == "fail") {
                balToCalib.Hmi = strHmi;
                return balToCalib
            }

            var calibFound = false
            var result = balToCalib.result
            result.forEach(k => { if (!k.Message.includes('No')) calibFound = true })

            let tempUserObj = globalData.arrUsers.find(k => k.Hmi == strHmi);
            let tempRightsObj = globalData.arrUserRights.find(k => k.Hmi == strHmi);
            let calibTypeInGlbArr = globalData.arrCommonUsage.find(k => k.BalId == CurrentCubicInfo.Sys_BalID);
            let inBetweenSpecifiedTime = this.checkinCalibSkipTime()
            // if (inBetweenSpecifiedTime &&
            //     (calibTypeInGlbArr.inReminderPeriod &&
            //     !(tempRightsObj.rights.includes('Calibration')) &&
            //     (!balToCalib.result[0].Message.includes("No")))) {
            if (tempRightsObj.removeRights.includes('Calibration') && (!balToCalib.result[0].Message.includes("No"))) {
                Object.assign(
                    objActivity,
                    { strUserId: value.UserId },
                    { strUserName: tempUserObj.UserName },
                    { activity: `Calibration Right Not Assigned logged in on IDS ${strHmi}` }
                );
                await objActivityLog.ActivityLogEntry(objActivity)

                return { status: 'fail', result: "Calibration Right Not Assigned", Hmi: strHmi }
            }

            if ((CurrentCubicInfo.Sys_CubType != "IPQA" || CurrentCubicInfo.Sys_CubType != "IPQC") && (!balToCalib.result[0].Message.includes("No"))) {
                if (!balToCalib.result[0].Message.includes("No")) {
                    if (!tempRightsObj.rights.includes('Calibration')) {
                        if (inBetweenSpecifiedTime == true) {
                            if (calibTypeInGlbArr.inReminderPeriod == true) {
                                balToCalib.result[0].Message = GlobalProtocol.No
                                return balToCalib
                            } else {
                                return { status: 'fail', result: "Calibration Right Not Assigned", Hmi: strHmi }
                            }
                        } else {
                            if (calibTypeInGlbArr.inReminderPeriod && !balToCalib.result[0].Message.includes("Daily")) {
                                balToCalib.result[0].Message = GlobalProtocol.No
                                return balToCalib
                            } else {

                                return { status: 'fail', result: "Calibration Right Not Assigned", Hmi: strHmi }
                            }
                        }
                    } else {
                        if (tempRightsObj.rights.includes('Calibration')) {
                            if (calibTypeInGlbArr.inReminderPeriod == true) {
                                return balToCalib
                            }
                        }
                    }
                } else {
                    return balToCalib
                }
            }



            // if(inBetweenSpecifiedTime || !(tempRightsObj.rights.includes('Calibration')) && !balToCalib.result[0].Message.includes("Daily") && calibTypeInGlbArr.inReminderPeriod) {
            //     balToCalib.result[0].Message = "No Calibration pending"
            // return balToCali
            // }
            if (inBetweenSpecifiedTime && calibTypeInGlbArr.inReminderPeriod && !(tempRightsObj.rights.includes('Calibration')) && (!balToCalib.result[0].Message.includes("No"))) {

                balToCalib.result[0].Message = GlobalProtocol.No
                return balToCalib
            }
            // if (inBetweenSpecifiedTime && !calibTypeInGlbArr.inReminderPeriod && (tempRightsObj.rights.includes('Calibration')) && (balToCalib.result[0].Message.includes("Skip")) && !balToCalib.result[0].Message.includes("Daily")) {

            //     balToCalib.result[0].Message = balToCalib.result[0].Message.replace(", ENT to Continue, ESC to Skip", "")
            //     // balToCalib.result[0].Message = "No Calibration pending"
            //     return balToCalib
            // }

            if (!tempRightsObj.rights.includes('Calibration') && (!balToCalib.result[0].Message.includes("No")) && !calibTypeInGlbArr.inReminderPeriod) {

                Object.assign(
                    objActivity,
                    { strUserId: value.UserId },
                    { strUserName: tempUserObj.UserName },
                    { activity: `Calibration Right Not Assigned logged in on IDS ${strHmi}` }
                );
                await objActivityLog.ActivityLogEntry(objActivity)

                return { status: 'fail', result: "Calibration Right Not Assigned", Hmi: strHmi }
            } else {
                if (calibTypeInGlbArr.inReminderPeriod && !balToCalib.result[0].Message.includes("Daily")) {
                    balToCalib.result[0].Message = GlobalProtocol.No
                    return balToCalib
                }
            }

            let arrBatches = [];
            let calibBalLength = globalData.glbArrListOfCalibratedBal.find(k => k.Hmi == strHmi).CalibratedBalList;

            if (!calibFound) {

                if (CurrentCubicInfo.Sys_CubType == "IPQA" || CurrentCubicInfo.Sys_CubType == "IPQC") {
                    // return await objIpqc.processIPQC(strResbPiNo);
                    let strBatch = await objIpqc.getAllBatchesForCubical(strHmi, strResbPiNo);
                    var CubicalData = globalData.arrIdsInfo.find(k => k.Hmi == strHmi).cubicalData;
                    var sysArea = CubicalData.Sys_Area;
                    //for loop the batches and then show the response Without Sys_Batch
                    for (let obj in strBatch) {
                        arrBatches.push({ Idsno: strBatch[obj].Sys_IDSNo, batch: strBatch[obj].Sys_Batch })
                    }

                    let resObj = {
                        status: 'success',
                        menuType: 'IPQC',
                        Area: sysArea,
                        result: arrBatches
                    }
                    return resObj;

                    //send response as a Batchs according to that Area after compeletion of calibration 
                } else if (CurrentCubicInfo.Sys_CubType == "IPC") {

                    const tempCubicInfo = globalData.arrIdsInfo.find(k => k.idsNo == strResbPiNo).cubicalData;
                    if ((tempCubicInfo.Sys_Area == "Compression" || tempCubicInfo.Sys_Area == "Capsule Filling"
                        || tempCubicInfo.Sys_Area == "Coating" || tempCubicInfo.Sys_Area == 'Granulation'
                        || tempCubicInfo.Sys_Area == 'Effervescent Compression' || tempCubicInfo.Sys_Area == 'Effervescent Granulation'
                        || tempCubicInfo.Sys_Area == 'Strepsils' || tempCubicInfo.Sys_Area == 'Allopathic' || tempCubicInfo.Sys_Area == 'Personal Care') && tempCubicInfo.Sys_CubType == GLOBAL_NOMENCLATURE.IPCNom) {

                        return {
                            status: 'success',
                            menuType: 'IPC',
                        }
                    }

                } else {
                    balToCalib.Hmi = strHmi;
                    return balToCalib;
                }

            } else {
                balToCalib.Hmi = strHmi;
                return balToCalib;
            }

        } catch (error) {
            console.log(error)
        }

    }

    async pendingCalibration(strResbPiNo, strHmi, strUserId, strPassword) {
        try {
            let resObj = {};
            let arrBal = await objCommonFunOperation.getCubicalData(strHmi);
            arrBal = [arrBal]
            let arrBalList = await this.pushBalList(strResbPiNo, strHmi, arrBal[0][0]);
            let arr = globalData.arrOfBalListWithPortNumber.find(k => k.Hmi == strHmi).BalList;
            console.log(arrBalList);
            let arrListOfBalWithCalibPending = [];
            let arrListOfCalibratedBal = [];
            // let status = await this.Find_user_change(strHmi)
            //if no bal is connected then forward to menu page
            if (arrBalList.length <= 0) {
                return Object.assign(resObj, { status: 'fail', result: 'No balance connected' })
            }


            for (let val in arr) {
                let a = await this.doCalibrationOfSelectedBal(strUserId, strPassword, strHmi, arr[val].BalanceId, arr[val].type, arr[val].PortNo);
                arrListOfBalWithCalibPending.push(a);
            }

            var objListOfBalWithCalibPending = globalData.glbArrListOfBalWithCalibPending.find(k => k.Hmi == strHmi);
            if (objListOfBalWithCalibPending == undefined) {
                globalData.glbArrListOfBalWithCalibPending.push({
                    Hmi: strHmi,
                    PendingCalibStatus: arrListOfBalWithCalibPending
                });
            }
            else {
                objListOfBalWithCalibPending.PendingCalibStatus = arrListOfBalWithCalibPending;
            }

            //Calibrated Bal Array List
            for (let val in arrListOfBalWithCalibPending) {
                if (arrListOfBalWithCalibPending[val].Message == GlobalProtocol.No) {
                    arrListOfCalibratedBal.push({ calibratedBal: arrListOfBalWithCalibPending[val].BalId, balType: arrListOfBalWithCalibPending[val].type, portNo: arrListOfBalWithCalibPending[val].portNo });
                }
            }

            let objCalibratedBal = globalData.glbArrListOfCalibratedBal.find(k => k.Hmi == strHmi);
            if (objCalibratedBal == undefined) {
                globalData.glbArrListOfCalibratedBal.push({
                    idsNo: strResbPiNo,
                    Hmi: strHmi,
                    CalibratedBalList: arrListOfCalibratedBal
                });
            }
            else {
                objCalibratedBal.CalibratedBalList = arrListOfCalibratedBal;
            }

            let resObjOfPendingCalibStatus = globalData.glbArrListOfBalWithCalibPending.find(k => k.Hmi == strHmi);
            return Object.assign(resObj, {
                status: "success",
                result: resObjOfPendingCalibStatus.PendingCalibStatus,
            })
        } catch (error) {
            console.log(error)
        }
    }

    async pushBalList(strResbPiNo, Hmi, ObjBalList) {
        try {
            let objOfBallist = this.clean(ObjBalList);

            let arrDetailOfallBalance = [];
            let arrAllListOfBal = [];
            let i = 1;
            for (let obj in objOfBallist) {
                if (objOfBallist[`Sys_Port${i}`] == undefined || objOfBallist[`Sys_Port${i}`] == "None") {
                    i++;
                    continue;
                }
                else {
                    if (objOfBallist[`Sys_Port${i}`] == "Balance") {
                        arrDetailOfallBalance.push(
                            { "BalanceId": objOfBallist[`Sys_BalID`], "PortNo": i, "type": "analytical" }
                        )

                        arrAllListOfBal.push(objOfBallist[`Sys_BalID`]);
                    }
                    if (objOfBallist[`Sys_Port${i}`] == "IPC Balance") {
                        arrDetailOfallBalance.push(
                            { "BalanceId": objOfBallist[`Sys_BinBalID`], "PortNo": i, "type": "IPC Balance" }
                        )

                        arrAllListOfBal.push(objOfBallist[`Sys_BinBalID`]);
                    }

                    i++;
                }
            }

            let arrOfBalList = globalData.arrOfBalListWithPortNumber.find(k => k.Hmi == Hmi)
            //pushing balanceId with their port number gollbally
            if (arrOfBalList == undefined) {

                globalData.arrOfBalListWithPortNumber.push({
                    "ResbPi": strResbPiNo,
                    "Hmi": Hmi,
                    "BalList": arrDetailOfallBalance
                })
            } else {
                arrOfBalList.ResbPi = strResbPiNo;
                arrOfBalList.BalList = arrDetailOfallBalance;
            }
            console.log(globalData.arrOfBalListWithPortNumber);

            return arrAllListOfBal;
        } catch (error) {
            console.log(error)
        }
    }

    async doCalibrationOfSelectedBal(UserId, Password, Hmi, val, balType, portNo) {
        try {
            // let Ip = requestIp.getClientIp(value);
            let strHmi = Hmi;
            let strUserId = UserId;
            let strPassword = Password;
            let strBalId = val;
            // let strBalId ;

            let resObj = {};
            let strCalibType = "";

            if (strUserId == "" || strPassword == "") {
                //user id cant be blank
            } else {
                let rasbpi = globalData.arrOfBalListWithPortNumber.find(k => k.Hmi == strHmi).ResbPi;
                if (strUserId != "" || strPassword != "") {

                    let tempCubicInfo = globalData.arrIdsInfo.find(k => k.idsNo == rasbpi); //empty
                    // if (tempCubicInfo == undefined) {
                    //     globalData.arrIdsInfo.push({
                    //         Hmi: strHmi,
                    //         idsNo: rasbpi,
                    //         cubicalData: result[0][0]
                    //     })
                    // } else {
                    //     tempCubicInfo.Hmi = strHmi;
                    //     tempCubicInfo.cubicalData = result[0][0];
                    // }

                    /**
                     * Rectifying That Balance is in IPC or Analytical
                     */
                    tempCubicInfo = globalData.arrIdsInfo.find(k => k.idsNo == rasbpi).cubicalData;
                    var owner = 'analytical'
                    if (tempCubicInfo.Sys_CubType == 'IPC') {
                        owner = 'IPC';
                    } else {
                        owner = 'analytical'
                    }


                    var objOwner = globalData.arrPreWeighCalibOwner.find(k => k.idsNo == rasbpi);
                    if (objOwner == undefined) {
                        globalData.arrPreWeighCalibOwner.push({ idsNo: rasbpi, owner: owner })
                    }
                    else {
                        objOwner.owner = owner;
                    }


                    let strPortNo = globalData.arrOfBalListWithPortNumber.find(k => k.Hmi == strHmi).BalList.find(i => i.BalanceId == strBalId).PortNo;

                    //validate user if user is not valid user then he cant performed precalibration.
                    let arrIntRes = await objArrayInit.InitializeArrays(rasbpi, balType);
                    //let tempRightsObj = globalData.arrUserRights.find(k => k.Hmi == strHmi)


                    if (arrIntRes == "Success") {
                        let propertyExist = globalData.arrCommonUsage.find(k => k.hasOwnProperty('reminder'))
                        if (propertyExist == undefined) {
                            globalData.arrCommonUsage.push({
                                reminder: function () {
                                    return new CalibrationBal().CheckReminder
                                }
                            })
                        }
                        await fetchDetails.pushCalibrationObj(strBalId, rasbpi, balType);
                        /**
                         * Validate PreCalibration Of Selected Balance. 
                         */
                        let strPreCalibValidateStatus = await objPreWeighmentCheck.validatePreWeighmentActivites(strHmi, strBalId, balType);

                        // if(strPreCalibValidateStatus.includes('Due')){
                        //     strPreCalibValidateStatus = 
                        // }


                        let inBetweenSpecifiedTime = this.checkinCalibSkipTime()
                        // console.log("inBetweenSpecifiedTime", inBetweenSpecifiedTime);


                        if (strPreCalibValidateStatus != undefined) {
                            if (strPreCalibValidateStatus != "Valid PreCalibration") {


                                if (strPreCalibValidateStatus == GlobalProtocol.No) {

                                    //check for reminder and check if it lies near betwween due date then return periodic pending on due dt

                                    let periodicReminder = await this.CheckReminder(strBalId);
                                    //let periodicReminder = false
                                    // if (periodicReminder.msg != "") {
                                    //     return Object.assign(resObj, {
                                    //         status: "success",
                                    //         BalId: strBalId,
                                    //         precalibration: false,
                                    //         pending: false,
                                    //         Message: strPreCalibValidateStatus,
                                    //         readyToUse: false,
                                    //         type: balType,
                                    //         portNo: portNo,
                                    //         skippable: inBetweenSpecifiedTime || false
                                    //     });
                                    // } else {
                                    globalData.arrBalCaibDet.splice(globalData.arrBalCaibDet.findIndex((element) => element.Hmi === strHmi), 1)
                                    return Object.assign(resObj, {
                                        status: "success",
                                        BalId: strBalId,
                                        precalibration: true,
                                        pending: true,
                                        Message: strPreCalibValidateStatus,
                                        readyToUse: true,
                                        type: balType,
                                        portNo: portNo,

                                    });
                                    // }

                                } else {

                                    return Object.assign(resObj, {
                                        status: "success",
                                        BalId: strBalId,
                                        precalibration: false,
                                        pending: true,
                                        Message: strPreCalibValidateStatus,
                                        Reminder: "",
                                        readyToUse: false,
                                        type: balType,
                                        portNo: portNo,

                                    });
                                }
                                //}
                            } else {
                                // if (tempRightsObj.rights.includes('Calibration')) {
                                let objcalibSatutsReCalibSatuts = await fetchDetails.checkBalanceInStatus_Re_tables(rasbpi, strBalId, balType);
                                if (objcalibSatutsReCalibSatuts == false) {



                                    let result = await tbl_cubical.findAll({
                                        where: {
                                            "Sys_IDSNo": rasbpi
                                        }
                                    })
                                    result = result[0]
                                    tempCubicInfo = globalData.arrIdsInfo.find(k => k.idsNo == rasbpi); //empty
                                    await fetchDetails.getCaibrationStatus(strBalId, rasbpi, balType); /** globalData.calibrationStatus.push({BalId: strBalId, status: tempObj}); */

                                    let calibPendingStatus = await objActualCheckOfCalibrationPen.checkDailyCalibrationPending(strBalId, strHmi, balType);
                                    //if no  check 

                                    // if (inBetweenSpecifiedTime && (!calibPendingStatus.includes('Skip')) && !calibPendingStatus.includes("No calibration pending")) {
                                    //     const skipableMsg = `, ENT to Continue, ESC to Skip`;
                                    //     calibPendingStatus = calibPendingStatus.concat(skipableMsg);
                                    //     console.log("inbetween skip time")
                                    // }

                                    if (calibPendingStatus == "No calibration pending") {

                                        //let periodicReminder = await this.CheckReminder(strBalId);
                                        // let calibType = resDailyCalibStatus.slice(0, resDailyCalibStatus.indexOf('calibration')).trim();
                                        // if (calibType.toLowerCase() != GLOBAL_NOMENCLATURE.Daily.toLowerCase() && calibType != "No") {
                                        //     //calll reminder function tht will tell the date as well as tell to skip or allow
                                        //     //forceCalib == true but tym lies between skipable tym thn allow true

                                        //     var periodicReminder = await this.CheckReminder(strBalId);

                                        // }

                                        // if (periodicReminder != false) {
                                        return Object.assign(resObj, {
                                            status: "success",
                                            BalId: strBalId,
                                            precalibration: true,
                                            pending: true,
                                            Message: calibPendingStatus,
                                            // Reminder: periodicReminder,
                                            readyToUse: inBetweenSpecifiedTime == true ? true : false,
                                            type: balType,
                                            portNo: portNo,

                                        });
                                        // } else {
                                        // return Object.assign(resObj, {
                                        //     status: "success",
                                        //     BalId: strBalId,
                                        //     precalibration: true,
                                        //     pending: true,
                                        //     Message: resDailyCalibStatus,
                                        //     // Reminder: "",
                                        //     readyToUse: false,
                                        //     type: balType,
                                        //     portNo: portNo
                                        // });
                                        // }
                                    } else {


                                        return Object.assign(resObj, {
                                            status: "success",
                                            BalId: strBalId,
                                            precalibration: true,
                                            pending: true,
                                            Message: calibPendingStatus,
                                            readyToUse: inBetweenSpecifiedTime == true ? true : false,
                                            type: balType,
                                            portNo: portNo,
                                            portNo: portNo,
                                            // skippable: inBetweenSpecifiedTime || false
                                        });
                                    }



                                }
                                else {
                                    console.log('bal id not found in tbl_calibration_status and tbl_recalibration_balance_status');
                                }

                            }
                        } else {
                            return "error"
                        }



                    }
                    else {
                        console.log(`InitializeArrays ${arrIntRes}`)
                    }
                }

            }
        } catch (error) {
            console.log(error);
        }
    }

    // Api After Select Daily Or periodic 
    async selectPendingCalib(value) {
        try {
            let strCalibType = value.CalibType;
            let strHmi = value.Hmi;
            let strBalId = value.BalId;
            let powerflag = value.Power_calib

            let CalibApiHit = globalData.arrCalibApiHit.find(k => k.Hmi == strHmi);
            if (CalibApiHit == undefined) {
                globalData.arrCalibApiHit.push({
                    Hmi: strHmi,
                    BalId: strBalId,
                    Time: moment(),
                })
            } else {
                CalibApiHit.BalId = strBalId;
                CalibApiHit.Time = moment();
            }

            let rasbpi = globalData.arrOfBalListWithPortNumber.find(k => k.Hmi == strHmi).ResbPi;
            let strPortNo = globalData.arrOfBalListWithPortNumber.find(k => k.Hmi == strHmi).BalList.find(i => i.BalanceId == strBalId).PortNo;
            if (powerflag == true) {
                let objActivity = {};
                var userData = await models.tbl_users.findAll({
                    where: {
                        UserID: value.UserId
                    }
                });
                userData = userData[0].UserInitials
                Object.assign(
                    objActivity,
                    { strUserId: value.UserId },
                    { strUserName: userData },
                    { activity: `${strCalibType} Calibration Resumed on IDS ${strHmi} through PowerBackup` }
                );

                await objActivityLog.ActivityLogEntry(objActivity);

            }
            // await tbl_idsport_details.update({
            //     'Sys_PortNo': strPortNo,
            //     'Instrument_type': 'Balance',
            //     'Instrument_id': strBalId
            // }, {
            //     where: {
            //         'Sys_IDSNo': rasbpi
            //     }
            // })


            //decide which calib is peding and sedig the first wt
            //verify the wt
            //ask for next wt.
            var objBalWt = await caliDecider.calibPendingDecider(strCalibType, strHmi, strBalId, rasbpi)


            let allBal = globalData.arrOfBalListWithPortNumber.find(k => k.Hmi == strHmi)
            var setting = [];
            for (let i = 0; i < allBal.BalList.length; i++) {
                let balance_list = allBal;
                let balance = balance_list.BalList[i].BalanceId;
                let PortNo = balance_list.BalList[i].PortNo;
                let bal_setting = await objConfigSettings.getconfigdata('tbl_balance', 'Bal_ID', balance, 'Bal', 'Balance', PortNo, "Calibration");
                setting.push(bal_setting);
            }

            objBalWt.configsetting = setting
            //configSetting:configSetting
            let hmiEntryinConfig = globalData.arrConfigSettings.find(k => k.Hmi == strHmi);
            if (hmiEntryinConfig == undefined) {
                globalData.arrConfigSettings.push({
                    Hmi: strHmi,
                    configSetting: setting
                })
            } else {
                hmiEntryinConfig.configSetting = setting
            }
            objBalWt.Hmi = strHmi
            return objBalWt;
        } catch (error) {
            console.log(error);
        }


    }


    clean(obj) {
        for (let key in obj) {
            if (obj[key] == null || obj[key] == undefined || obj[key] == "None") {
                delete obj[key];
            }
        }
        return obj;
    }


    async logoutUser(Ip, userId) {
        try {
            let objUpdateLoginData = {
                str_tableName: 'tbl_users',
                data: [
                    { str_colName: 'active', value: 0 },
                    { str_colName: 'HostName', value: Ip },
                    { str_colName: 'source', value: 'Hardware' }
                ],
                condition: [
                    { str_colName: 'UserID', value: userId }
                ]
            }
            await database.update(objUpdateLoginData);
        } catch (error) {
            throw new Error(error)
        }
    }

    async CheckReminder(strBalId) {
        try {

            //implement a way that will help in 

            let result = await tbl_balance.findAll({
                where: {
                    'Bal_ID': strBalId
                }
            })
            result = [result]
            const bln_storeType = result[0][0].Bal_CalbStoreType.readUIntLE();


            if (bln_storeType == 1) {
                // let yearlyCalibDt = result[0][0].Bal_CalbDueDtYear;

                let strDuedate = result[0][0].Bal_CalbDueDt;
                // strMsgReminderdate = date.format(strMsgReminderdate, 'DD/MM/YYYY');

                let reminder = result[0][0].Bal_CalbReminder;

                //////////////////////////////////monthlyy

                //for monthly
                var monthlyDuedt = moment(strDuedate);
                var beforeDueDtReminderDateMonthly = moment(strDuedate).subtract(reminder, 'days');
                //var futureMonthEnd = moment(beforeDueDtReminderDateMonthly).endOf('month');
                var AfterDueDtLastReminderDateMonthy = moment(strDuedate).add(reminder, 'days');
                var beforeMonthlyDueDtReminderDateFormatted = beforeDueDtReminderDateMonthly.format('YYYY-MM-DD');
                //var futureMonthEndFormatted = futureMonthEnd.format('YYYY-MM-DD');
                var AfterDueDtLastReminderDateFormattedForMonthly = AfterDueDtLastReminderDateMonthy.format('YYYY-MM-DD');
                var currentDate = moment().format('YYYY-MM-DD');

                // console.log(AfterDueDtLastReminderDateMonthy);
                // console.log(AfterDueDtLastReminderDateMonthy);
                // console.log(futureMonthEnd);
                // const currentDate = moment();
                // let inBetweenSpecifiedTime1 = currentDate.isBetween(beforeDueDtReminderDate, duedt, 'days', false);
                // let inBetweenSpecifiedTime2 = currentDate.isBetween(currentDate, AfterDueDtLastReminderDate, 'days', true);
                var beforeMonthlyDueDtReminderDateFormatted = moment(new Date(beforeMonthlyDueDtReminderDateFormatted.split('-').map(k => Number(k))));
                // var currentTime = moment(currentDate.split('-').map(k => Number(k)));
                var currentTime = moment();
                beforeMonthlyDueDtReminderDateFormatted = beforeMonthlyDueDtReminderDateFormatted.diff(currentTime, 'days', true);


                var AfterDueDtLastReminderDateFormattedForMonthly = moment(new Date(AfterDueDtLastReminderDateFormattedForMonthly.split('-').map(k => Number(k))));
                // var currentTime = moment(currentDate.split('-').map(k => Number(k)));
                var currentTime = moment();
                AfterDueDtLastReminderDateFormattedForMonthly = AfterDueDtLastReminderDateFormattedForMonthly.diff(currentTime, 'days', true)
                console.log(beforeMonthlyDueDtReminderDateFormatted);
                console.log(AfterDueDtLastReminderDateFormattedForMonthly);
                let msg = "", calibType = "", inReminderPeriod = false;
                let res = await tbl_calibration_periodic_master.findAll({
                    where: {
                        'Periodic_BalID': strBalId,
                        'Periodic_CalbDate': currentDate
                    }
                });

                let resYearly = await tbl_calibration_uncertinity_master.findAll({
                    where: {
                        'Uncertinity_BalID': strBalId,
                        'Uncertinity_CalbDate': currentDate
                    }
                });

                let res1 = await tbl_balance.findAll({
                    where: {
                        'Bal_ID': strBalId,
                    }
                });

                let isNewBal = res1[0].IsNewBalance.readUIntLE();
                isNewBal = isNewBal == 1 ? true : false


                if (calibType) {
                } else {
                    msg = ""
                }


                // if ((beforeMonthlyDueDtReminderDateFormatted <= 0 &&
                //     currentTime.isBetween(beforeDueDtReminderDateMonthly, currentTime, 'days', true)) && res.length <= 0 && (beforeDueDtReminderDateMonthly.year() == currentTime.year())) {
                //     msg = `${GLOBAL_NOMENCLATURE.Periodic} Pending for Balance, ENT to Continue, ESC to Skip`;
                //     calibType = "monthly"
                // } else if ((beforeYearlyDueDtReminderDateFormatted <= 0 &&
                //     currentTime.isBetween(beforeDueDtReminderDateYearly, currentTime, null, true)) &&(beforeDueDtReminderDateMonthly.year() == currentTime.year())) {
                //     msg = `${GLOBAL_NOMENCLATURE.Uncertainty} Pending for Balance, ENT to Continue, ESC to Skip`
                //     calibType = "yearly"
                // } else if ((AfterDueDtLastReminderDateFormattedForMonthly >= 0 &&
                //     currentTime.isBetween(currentTime, AfterDueDtLastReminderDateMonthy, 'days', false)) && res.length <= 0 &&(beforeDueDtReminderDateMonthly.year() == currentTime.year())) {
                //     msg = `${GLOBAL_NOMENCLATURE.Periodic} Pending for Balance, ENT to Continue, ESC to Skip`
                //     calibType = "monthly"
                // } else if ((AfterDueDtLastReminderDateFormattedForYearly >= 0 &&
                //     currentTime.isBetween(currentTime, AfterDueDtLastReminderDate, 'days', false)) && (beforeDueDtReminderDateMonthly.year() == currentTime.year())) {
                //     msg = `${GLOBAL_NOMENCLATURE.Uncertainty} Pending for Balance, ENT to Continue, ESC to Skip`
                //     calibType = "yearly"
                // } else {
                //     msg = ""
                // }

                let calibTypeInGlbArr = globalData.arrCommonUsage.find(k => k.BalId == strBalId);
                if (calibTypeInGlbArr == undefined) {
                    globalData.arrCommonUsage.push({
                        BalId: strBalId,
                        calibType: calibType,
                        isNewBal: isNewBal,
                        inReminderPeriod: inReminderPeriod
                    })
                } else {
                    calibTypeInGlbArr.calibType = calibType
                    calibTypeInGlbArr.isNewBal = isNewBal
                    calibTypeInGlbArr.inReminderPeriod = inReminderPeriod
                }


                // if ((beforeMonthlyDueDtReminderDateFormatted <= 0 &&
                //     currentTime.isBetween(beforeDueDtReminderDateMonthly, currentTime, 'days', true)) ||
                //     (beforeYearlyDueDtReminderDateFormatted <= 0 &&
                //         currentTime.isBetween(beforeDueDtReminderDateYearly, currentTime, null, true))) {
                //     msg = "periodic calibration pending press ent to continue esc to cancel"
                // } else if ((AfterDueDtLastReminderDateFormattedForMonthly >= 0 &&
                //     currentTime.isBetween(currentTime, AfterDueDtLastReminderDateMonthy, 'days', false)) ||
                //     (AfterDueDtLastReminderDateFormattedForYearly >= 0 &&
                //         currentTime.isBetween(currentTime, AfterDueDtLastReminderDate, 'days', false))) {
                //     msg = "periodic calibration pending press ent to continue esc to cancel"
                // } else {
                //     msg = ""
                // }


                return { msg: msg, calibType: calibType, isNewBal: isNewBal }
            } else {// set dates
                let arr = result[0][0].Bal_CalbDates.split(',');
                let today = new Date();
                let todayDate = date.format(today, 'YYYY-MM-DD');
                let reminder = result[0][0].Bal_CalbReminder;
                let month = 0;

                let retResponse = "";
                for (let [i, day] of arr.entries()) {
                    var year = today.getFullYear();
                    if (day < 7) {
                        if ((day - reminder) <= 0) {
                            month = today.getMonth() + 2;
                            if (month == 13) {
                                month = 1;
                                year = year + 1
                            }
                        } else {
                            month = today.getMonth() + 1; // Current Month
                        }
                    } else {
                        month = today.getMonth() + 1; // Current Month
                    }

                    month = ("0" + month).slice(-2);
                    let date1 = ("0" + day).slice(-2)
                    let calibDate = '';
                    let calibDate1 = '';
                    let strMsgReminderdate = '';
                    calibDate = year + '-' + month + '-' + date1;
                    calibDate1 = date1 + '.' + month + '.' + year;
                    strMsgReminderdate = date1 + '/' + month + '/' + year;
                    let d = new Date(calibDate); // d-> remDate
                    d.setDate(d.getDate() - reminder);
                    d = date.format(d, 'YYYY-MM-DD');
                    // console.log(calibDate, d)
                    if (todayDate >= calibDate) {
                        retResponse = false;
                    } else if (todayDate >= d) {
                        //check entry in db if already entry found between date sets then return false

                        let checkForCalibDoneDate = await this.checkDateBetween(strBalId, calibDate, arr);
                        if (checkForCalibDoneDate) {
                            return false
                        }
                        retResponse = `Periodic Calibration is Due on ${strMsgReminderdate}.. only ${new Date(calibDate).getDate() - new Date(todayDate).getDate()} days are remaining`;
                    } else {
                        retResponse = false;
                    }
                    if (retResponse == false && (arr.length - 1) == i) {
                        return retResponse;
                    } else if (retResponse != false) {
                        return retResponse;
                    }

                }
                // return retResponse;
            }

        } catch (error) {
            throw new Error(error)
        }
    }

    async checkDateBetween(strBalId, calibdate, arr) {
        try {
            const arrcopy = [...arr];
            let tempcalibdate = calibdate.split('-')[2];
            // arrcopy[(arrcopy.findIndex(k=>k ==  calibdate.split('-')[2])) - 1]
            let previousDueDt = arrcopy[(arrcopy.findIndex(k => k == tempcalibdate)) - 1];
            if (previousDueDt == undefined) {
                return false
            }
            let previousDate = calibdate.replace(tempcalibdate, previousDueDt)

            const obj = {
                str_tableName: 'tbl_calibration_periodic_master',
                data: '*',
                condition: [
                    { str_colName: 'Periodic_BalID', value: strBalId },
                    { str_colName: 'Periodic_CalbDate', value: previousDate, value1: calibdate, comp: 'btn' },
                ]
            }
            let res = await database.select(obj);
            res = res[0].length > 0 ? res = true : false
            return res;
        } catch (error) {
            throw new Error(error)
        }
    }

    async checkPeriodicToday(calibDate, strBalId) {
        try {
            let res = await tbl_calibration_periodic_master.findAll({
                where: {
                    'Periodic_BalID': strBalId,
                    'Periodic_CalbDate': calibDate
                }
            });
            if (res.length >= 0) {
                return res
            }
            res = [[res[0]]]
            return res[0];
        } catch (error) {
            throw new Error(error)
        }
    }

    async CalibrationInProcess(cubicalNo) {
        try {
            await tbl_cubical.update({
                Sys_CalibInProcess: 1
            }, {
                where: {
                    Sys_CubicNo: cubicalNo
                }
            })

        } catch (error) {
            console.log(error)
            throw new Error(error)
        }
    }


    checkinCalibSkipTime() {
        const currentTime = moment();
        const startTime = moment(
            `${serverConfig.AllowSkipCalib_Start_Tym} ${serverConfig.AllowSkipCalib_Start_Tym_Period}`,
            "HH:mm a");
        const endTime = moment(
            `${serverConfig.AllowSkipCalib_End_Tym} ${serverConfig.AllowSkipCalib_End_Tym_Period}`,
            "HH:mm a");

        const inBetweenSpecifiedTime = currentTime.isBetween(startTime, endTime);
        return inBetweenSpecifiedTime
    }
    async calibrationVerification(idsNo) {
        try {
            var tempCubicInfo = globalData.arrIdsInfo.find(k => k.Hmi == idsNo);
            var DailyRes = false;
            var PeriodicRes = false;
            if (tempCubicInfo != undefined) {
                if (tempCubicInfo.cubicalData.Sys_Port1 == 'Balance') {
                    let strBalId = tempCubicInfo.cubicalData.Sys_BalID;
                    // let check for latest entry in dailyCalibrationTable
                    let selectDailyrep = await models.tbl_calibration_daily_master.findAll({
                        attributes: [[sequelize.fn('max', sequelize.col('Daily_RepNo')), 'Daily_RepNo']],
                        where: {
                            Daily_BalID: strBalId
                        }
                    });
                    let selectDaily = selectDailyrep[0].Daily_RepNo
                    selectDaily = await models.tbl_calibration_daily_master.findAll({
                        where: {
                            Daily_RepNo: selectDaily
                        }
                    });


                    let dResu = [selectDaily];
                    if (dResu[0].length > 0) {
                        if (dResu[0][0].Daily_VerifyID == 'NULL') {
                            DailyRes = true;
                        } else {
                            DailyRes = false;
                        }
                    } else {
                        DailyRes = false;
                    }
                    // let check for latest entry in Periodic Table

                    let selectPeriodicrep = await models.tbl_calibration_periodic_master.findAll({
                        attributes: [[sequelize.fn('max', sequelize.col('Periodic_RepNo')), 'Periodic_RepNo']],
                        where: {
                            Periodic_BalID: strBalId
                        }
                    });
                    if (selectPeriodicrep.length != 0) {
                        selectPeriodicrep = selectPeriodicrep[0].Periodic_RepNo
                        let selectPeriodic = await models.tbl_calibration_periodic_master.findAll({
                            where: {
                                Periodic_RepNo: selectPeriodicrep
                            }
                        });

                        let PResu = [selectPeriodic];
                        if (PResu[0].length > 0) {
                            if (PResu[0][0].Periodic_VerifyID == 'NULL') {
                                PeriodicRes = true;
                            } else {
                                PeriodicRes = false;
                            }
                        } else {
                            PeriodicRes = false;
                        }
                        if (DailyRes || PeriodicRes) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                } else {
                    return false;
                }
            }
        } catch (err) {

            console.log(err);
            return false;
        }
    }
    checkinCalSkipTime() {
        const currentTime = moment();
        const startTime = moment(
            `${serverConfig.AllowSkipCal_Start_Tym} ${serverConfig.AllowSkipCal_Start_Tym_Period}`,
            "HH:mm a");
        const endTime = moment(
            `${serverConfig.AllowSkipCal_End_Tym} ${serverConfig.AllowSkipCal_End_Tym_Period}`,
            "HH:mm a");

        const inBetweenSpecified = currentTime.isBetween(startTime, endTime);
        return inBetweenSpecified
    }
}


module.exports = CalibrationBal