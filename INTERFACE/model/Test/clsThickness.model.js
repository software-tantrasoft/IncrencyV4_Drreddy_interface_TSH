const date = require('date-and-time');

const globalData = require('../../global/globalData')
const clsActivityLog = require('../clsActivityLog.model');
const clsInstrumentUsage = require('../clsInstrumentUsageLog');
const clsCommonInsertOpt = require('../Product/clsCommonInsertOperation.model');
const clsMqttSender = require('../Mqtt/mqttSender.class');
const DataBase = require('../../database/clsQueryProcess');
const FormulaFunModel = require('../Product/clsformulaFun.model');
const mqttProtocol = require('../../global/GLOBAL_NOMENCLATURE');
const clsCommonUseFunction = require('../clsCommonUseFunction');
const PowerBackup = require('../../Utills/powerBackUp/powerbackup');
const models = require('../../../config/dbConnection').models;
const sequelize = require('../../../config/dbConnection').sequelize;


const objActivityLog = new clsActivityLog(); 
const objInstrumentUsage = new clsInstrumentUsage();
const objCommonInsertOpt = new clsCommonInsertOpt();
const mqttSender = new clsMqttSender();
const database = new DataBase();
const objformulaFun = new FormulaFunModel();
const objCommonUseFunc = new clsCommonUseFunction();
const objPowerBackup = new PowerBackup();


class ThicknessModel {

    async processThicknessData(dataObj) {
        try {
            let objActivity = {};
            let maxLimitT1, maxLimitT2, minLimitT2, minLimitT1, strTableName, strDetailTbl;
            const strHmi = dataObj.Hmi;
            const strIdsNo = dataObj.idsNo;
            const menuName = dataObj.menuName;
            let actualWt = dataObj.actualWt;

            let selectedIdsNo;
            var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.idsNo == strIdsNo);
            if (IPQCObject != undefined) {
                selectedIdsNo = IPQCObject.selectedIds;
            } else {
                selectedIdsNo = strIdsNo;
            }
           
            const objSelMenu = globalData.arrSelectedMenu.find(k => k.idsNo == strIdsNo);
            const ThicknessDetail = globalData.arrWeighmentProductData.find(k => k.Hmi == strHmi);
            let sample =  parseFloat(ThicknessDetail.data.noOfSample);
            let batchNo = ThicknessDetail.data.Batch;
            let tempCounterObj = globalData.arrWeighmentCounter.find(k => k.Hmi == strHmi);
            let tempUserObject = globalData.arrUsers.find(k => k.Hmi === strHmi);
            const sampleRemark = globalData.arrSampleRemarkForAllTest.find(k => k.Hmi == strHmi);
            let tableName = "tbl_powerbackup";

            
            let _cubicalData = globalData.arrIdsInfo.find(k => k.idsNo == strIdsNo).cubicalData;
            if (tempCounterObj === undefined) {
                globalData.arrWeighmentCounter.push({
                    'Hmi': strHmi,
                    'counter': 0
                })
            }
            tempCounterObj = globalData.arrWeighmentCounter.find(k => k.Hmi == strHmi);

            switch (menuName) {
                case 'Thickness': {
                    strTableName = "tbl_tab_master3";
                    strDetailTbl = "tbl_tab_detail3";
                    // typeValue = 1;
                    maxLimitT1 = objformulaFun.upperLimit(objSelMenu.selectedProductDetail, 'T1');
                    maxLimitT2 = objformulaFun.upperLimit(objSelMenu.selectedProductDetail);
                    minLimitT2 = objformulaFun.lowerLimit(objSelMenu.selectedProductDetail);
                    minLimitT1 = objformulaFun.lowerLimit(objSelMenu.selectedProductDetail, 'T1');
                }
                    break;
                case 'Differential': {
                    strTableName = "tbl_cap_master3";
                    strDetailTbl = "tbl_cap_detail3";
                }
                    break;
            }


            let __parameterThickness ;
            const __ParamRemark = {
                idsNo: strIdsNo,
                menuName: menuName,
                batchNo: batchNo,
                tableName: strTableName,
            }
           
            if (sample >= tempCounterObj.counter) {

                tempCounterObj.counter += 1;

                __parameterThickness = {
                    strTableName: strTableName,
                    strDetailTbl: strDetailTbl,
                    objProductDetails: ThicknessDetail.data,
                    uniqueSerialNumber: strIdsNo,
                    strBalId: dataObj.instrumentId,
                    ProtocolData: dataObj.actualWt,
                    ProtocolUnit: dataObj.unit,
                    ProtocolDecPoint: dataObj.decPoint,
                    strHmi: strHmi,
                    seqNoOfWt: tempCounterObj.counter,
                    productType: objSelMenu.selectedProductDetail
                }

                

                var powerbackupobj = {
                    strTableName: strTableName,
                    strDetailTbl: strDetailTbl,
                    cubicaNo: _cubicalData.Sys_CubicNo,
                    cubicType: _cubicalData.Sys_CubType,
                    cubicSysBFGcode: _cubicalData.Sys_BFGCode,
                    cubicBatch: _cubicalData.Sys_Batch,
                    menuName: ThicknessDetail.data.menuName,
                    productType: objSelMenu.selectedProductDetail.ProductType,
                    Userid: tempUserObject.UserId,
                    idsNo: strIdsNo,
                    Hmi: strHmi,
                    Incomp_RepSerNo: tempCounterObj.counter,
                    ReportType:_cubicalData.Sys_RptType,
                    RecSampleNo:tempCounterObj.counter

                }

                let _check_combination = await objPowerBackup._check_combination_pow(objSelMenu, powerbackupobj, tableName);
                if (_check_combination !== undefined) {
                    tempCounterObj.counter = _check_combination.RecSampleNo + 1;
                    powerbackupobj.RecSampleNo = tempCounterObj.counter;
                }

                if (tempCounterObj.counter == 1) {

                    var RepSerno = await objCommonInsertOpt.insert_Into_Incomplete_Master(__parameterThickness);
                    powerbackupobj.Incomp_RepSerNo = RepSerno.RepSerNo;
                    await objPowerBackup.getStatusoFTestForPowerBackup(powerbackupobj);
                    Object.assign(objActivity,
                        { strUserId: tempUserObject.UserId },
                        { strUserName: tempUserObject.UserName },
                        { activity: 'Thickness Weighment Started on IDS ' + strHmi });
                    await objActivityLog.ActivityLogEntry(objActivity);
                    await objInstrumentUsage.InstrumentUsage('Vernier', strIdsNo, 'tbl_instrumentlog_vernier', 'Thickness', 'started');
                    await objCommonInsertOpt.InsertIncompleteRemarkEntry(__ParamRemark);

                }
                //insert data into detail table
                console.log(tempCounterObj.counter);
                let decimal = await objCommonInsertOpt.insert_Into_Incomplete_Detail(__parameterThickness);
                var incompRepSerNo = await objPowerBackup.updateTestCount(objSelMenu, powerbackupobj, tableName);
                // mqttSender.sendData(strHmi, `DisplayResult:${tempCounterObj.counter}:${Number(dataObj.actualWt).toFixed(decimal)} ${dataObj.unit}`)
                let sampleNo = tempCounterObj.counter
                let limitObjResp = await objCommonUseFunc.SendCommon({ strHmi, actualWt, minLimitT2, maxLimitT2, minLimitT1, maxLimitT1, menuName, sampleNo })
                let color = limitObjResp.Color;
                let limit = limitObjResp.limit;

                mqttSender.sendData(strHmi, `${mqttProtocol.DisplayResult}${tempCounterObj.counter}:${Number(actualWt).toFixed(decimal)} ${dataObj.unit}:${color}`);
                mqttSender.sendData(strHmi, limit);

            }

            // if (parseFloat(actualWt) < parseFloat(minLimitT2) || parseFloat(actualWt) > parseFloat(maxLimitT2)) {
            //     sampleRemark.OutOfRemark = true;
            //     console.log('Received weight is out of t2 limit');
            //     mqttSender.sendData(strHmi, `${mqttProtocol.DisplayMessage} Received weight is out of t2 limit`);

            // } else if (parseFloat(actualWt) < parseFloat(minLimitT1) || parseFloat(actualWt) > parseFloat(maxLimitT1)) {
            //     sampleRemark.OutOfRemark = true;
            //     mqttSender.sendData(strHmi, `${mqttProtocol.DisplayMessage} Received weight is out of t1 limit`);
            //     console.log('Received weight is out of t1 limit');
            // } else {
            //     mqttSender.sendData(strHmi, `${mqttProtocol.DisplayMessage} Received weight is within limit`);
            //     console.log('Received weight is within limit');
            // }

            if (sample == tempCounterObj.counter) {
                //move data from incomplete to complete 
                //remove outOfLimit Flag
                //check nmt range
                await objCommonInsertOpt.saveCompleteData(__parameterThickness, 3);

                await objCommonInsertOpt.updateEndDate(strIdsNo, strHmi, strTableName);


                //@sunil powerbackup delete after test complete
              
                const _deletePowerbackup = await models.tbl_powerbackup.destroy({
                    where: {
                        IdsNo: strHmi,
                        Sys_Batch: _cubicalData.Sys_Batch
                    }
                })

                Object.assign(objActivity,
                    { strUserId: tempUserObject.UserId },
                    { strUserName: tempUserObject.UserName },
                    { activity: 'Thickness Weighment Completed on IDS ' + strHmi });
                await objActivityLog.ActivityLogEntry(objActivity);
                await objInstrumentUsage.InstrumentUsage('Vernier', strIdsNo, 'tbl_instrumentlog_vernier', '', 'completed');
                console.log(tempCounterObj.counter);

                //clear counter array
                globalData.arrWeighmentCounter.findIndex(k => k.Hmi == strHmi) == -1 ?
                    globalData.arrWeighmentCounter :
                    globalData.arrWeighmentCounter.splice(globalData.arrWeighmentCounter.findIndex(k => k.Hmi == strHmi), 1);
                    
                (globalData.arrCurrentOperationStatus.findIndex((element) => element.Hmi === strHmi)) == -1 ? globalData.arrCurrentOperationStatus :
                    globalData.arrCurrentOperationStatus.splice(globalData.arrCurrentOperationStatus.findIndex((element) => element.Hmi === strHmi), 1);
                //test splice if rotarty is not double
                (globalData.arrOutFlagForTest.findIndex((element) => element.Hmi === strHmi)) == -1 ? globalData.arrOutFlagForTest :
                globalData.arrOutFlagForTest.splice(globalData.arrOutFlagForTest.findIndex((element) => element.Hmi === strHmi), 1);
              
                globalData.arrSelectedMenu.findIndex(k => k.Hmi == strHmi) == -1 ?
                    globalData.arrSelectedMenu :
                    globalData.arrSelectedMenu.splice(globalData.arrSelectedMenu.findIndex(k => k.Hmi == strHmi), 1);
                return mqttSender.sendData(strHmi, `${mqttProtocol.TestCompleted}Thickness test Completed`);

            }
        } catch (error) {
            throw new Error(error);
        }
    }


}

module.exports = ThicknessModel;