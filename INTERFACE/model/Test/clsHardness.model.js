const date = require('date-and-time');

const globalData = require('../../global/globalData')
const clsActivityLog = require('../clsActivityLog.model');
const clsInstrumentUsage = require('../clsInstrumentUsageLog');
const clsCommonInsertOpt = require('../Product/clsCommonInsertOperation.model');
const clsMqttSender = require('../Mqtt/mqttSender.class');
const DataBase = require('../../database/clsQueryProcess');
const FormulaFunModel = require('../Product/clsformulaFun.model');
const mqttProtocol = require('../../global/GLOBAL_NOMENCLATURE');
const IncompleteReport = require('../Product/clsIncompleteReport');
const clsSaveCompleteHardness = require('../Product/clsWeighmentDataTransfer');
const clsBatchSummary = require('../Product/clsBatchSummaryOperation')
const clsGetMstSrAndSideSr = require('../Product/clsGetMstSrAndSideSr');
const clsProObj = require('../Product/clsProductDetailModel')
const clsPrintOperation = require('../Print/clsPrintOperation')
const objcallPrint = new clsPrintOperation()
const moment = require('moment');
const maths = require('mathjs');
const objGetMstSrAndSideSr = new clsGetMstSrAndSideSr();
const objActivityLog = new clsActivityLog();
const objInstrumentUsage = new clsInstrumentUsage();
const objCommonInsertOpt = new clsCommonInsertOpt();
const mqttSender = new clsMqttSender();
const database = new DataBase();
const objformulaFun = new FormulaFunModel();
const objIncompleteReport = new IncompleteReport();
const objSaveCompleteHardness = new clsSaveCompleteHardness();
const objBatchSummary = new clsBatchSummary();
const proObj = new clsProObj();

const PowerBackup = require('../../Utills/powerBackUp/powerbackup');
const objPowerBackup = new PowerBackup();

const models = require('../../../config/dbConnection').models;
const sequelize = require('../../../config/dbConnection').sequelize;

const clsMonit = require('../MonitorSocket/clsMonitSocket');
const { where } = require('sequelize');
const objMonit = new clsMonit();

// const clsPrintOperation = require('../Print/clsPrintOperation')

// const objcallPrint = new clsPrintOperation()


class HardnessModel {
    /***
     * want to check counter sometimes its going proper sometimes wrong when product get completed 425
     */
    async processHardnessData(dataObj) {
        try {
            let objActivity = {};
            let maxLimitT1, maxLimitT2, minLimitT2, minLimitT1, strTableName, strDetailTbl;
            const strHmi = dataObj.Hmi;
            const strIdsNo = dataObj.idsNo;
            const menuName = dataObj.menuName;
            let actualWt = dataObj.actualWt.hardnessData;
            const objSelMenu = globalData.arrSelectedMenu.find(k => k.idsNo == strIdsNo);
            const HardnessDetail = globalData.arrWeighmentProductData.find(k => k.Hmi == strHmi);
            let sample = HardnessDetail.data.noOfSample;
            let batchNo = HardnessDetail.data.Batch;
            let tempCounterObj = globalData.arrWeighmentCounter.find(k => k.Hmi == strHmi);
            let tempUserObject = globalData.arrUsers.find(k => k.Hmi === strHmi);
            const sampleRemark = globalData.arrSampleRemarkForAllTest.find(k => k.Hmi == strHmi);
            let outFlag = 0;
            const T1Pos = objSelMenu.selectedProductDetail.T1Pos;
            let wtRecivedFromHardness = globalData.arrDataFromInstHardness.find(k => k.idsNo == strIdsNo);
            let oldlength = wtRecivedFromHardness.arrLength;
            let typeValue;


            switch (menuName) {
                case 'Hardness': {
                    strTableName = "tbl_tab_masterhtd";
                    strDetailTbl = "tbl_tab_detailhtd";
                    typeValue = 7;

                }
                    break;
                case 'default':
                    break;
            }


            const __parameterHardness = {
                strTableName: strTableName,
                strDetailTbl: strDetailTbl,
                objProductDetails: HardnessDetail.data,
                uniqueSerialNumber: strIdsNo,
                ProtocolData: dataObj.actualWt,
                strHmi: strHmi,
                productType: objSelMenu.selectedProductDetail
            }

            const __ParamRemark = {
                idsNo: strIdsNo,
                menuName: menuName,
                batchNo: batchNo,
                tableName: strTableName,
            }

            if (tempCounterObj === undefined) {
                globalData.arrWeighmentCounter.push({
                    Hmi: strHmi,
                    oldArrLength: oldlength,
                    currentArrLength: dataObj.actualWt.hardnessData.length,
                    counter: 0
                })
            } else {
                tempCounterObj.oldArrLength = oldlength;
                tempCounterObj.currentArrLength = dataObj.actualWt.hardnessData.length;
            }
            tempCounterObj = globalData.arrWeighmentCounter.find(k => k.Hmi == strHmi);

            if (sample >= tempCounterObj.counter) {
                tempCounterObj.counter += 1;
                //wtRecivedFromHardness
                let i = 0;
                let wt = [];
                for (let a of wtRecivedFromHardness.nextData) {
                    wt.push(wtRecivedFromHardness.nextData[i].split(':')[2].trim().replace(/--/g, '0').replace(/   /g, '_').split('_').filter(k => k));
                    i++;

                }
                let strHardnessUnit;
                if (tempCounterObj.counter == 1) {
                    __parameterHardness.strHardnessUnit = wt[0][3].trim().split(" ")[1];
                    await this.saveDataIncompleteMasterHardness125(__parameterHardness);
                    Object.assign(objActivity,
                        { strUserId: tempUserObject.UserId },
                        { strUserName: tempUserObject.UserName },
                        { activity: 'TabletTester Weighment Started on IDS ' + strHmi });
                    await objActivityLog.ActivityLogEntry(objActivity);
                    //not done
                    await objInstrumentUsage.InstrumentUsage('TabletTester', strIdsNo, 'tbl_instrumentlog_hardness', 'TabletTester', 'started');
                    await objCommonInsertOpt.InsertIncompleteRemarkEntry(__ParamRemark);

                }
                //insert data into detail table
                let selectedIdsNo;
                var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.idsNo == strIdsNo);
                if (IPQCObject != undefined) {
                    selectedIdsNo = IPQCObject.selectedIds;
                } else {
                    selectedIdsNo = strIdsNo;
                }

                let hmiDetailsInPMenu = globalData.arrIdsInfo.find(k => k.idsNo == selectedIdsNo).cubicalData;


                let repSerNo = await objCommonInsertOpt.lastInsertedRecords(hmiDetailsInPMenu.Sys_ProductName, hmiDetailsInPMenu.Sys_BFGCode,
                    hmiDetailsInPMenu.Sys_PVersion, hmiDetailsInPMenu.Sys_Version, hmiDetailsInPMenu.Sys_Batch, strTableName)

                const selectHardnessData = {
                    str_tableName: 'tbl_tab_detailhtd_incomplete',
                    data: 'COUNT(DataValueThick) AS HardnessCount',
                    condition: [
                        { str_colName: 'RepSerNo', value: repSerNo },
                    ]
                }
                let s = await database.select(selectHardnessData);
                let j
                if (s[0][0].HardnessCount == 0) {
                    j = 1;
                } else {
                    j = s[0][0].HardnessCount + 1;
                }

                for (let b of wt) {
                    const insertDetailObj = {
                        str_tableName: 'tbl_tab_detailhtd_incomplete',
                        data: [
                            { str_colName: 'RepSerNo', value: repSerNo },
                            { str_colName: 'MstSerNo', value: 1 },
                            { str_colName: 'RecSeqNo', value: j },
                            { str_colName: 'DataValueThick', value: b[1].trim().split(" ")[0] },
                            { str_colName: 'DataValueDOLOBO', value: b[2].trim().split(" ")[0] },
                            { str_colName: 'DataValueHard', value: b[3].trim().split(" ")[0] },
                            { str_colName: 'DecimalPointThick', value: this.precision(Number(b[1].trim().split(" ")[0])) },
                            { str_colName: 'DecimalPointDOLOBO', value: this.precision(Number(b[2].trim().split(" ")[0])) },
                            { str_colName: 'DecimalPointHard', value: this.precision(Number(b[3].trim().split(" ")[0])) },
                            { str_colName: 'idsNo', value: strIdsNo },

                        ]
                    }
                    await database.save(insertDetailObj);
                    mqttSender.sendData(strHmi, `DisplayResult:${tempCounterObj.currentArrLength}:${b[3].trim().split(" ")[0]} N`);
                    j++;
                }

                console.log(tempCounterObj.counter);


            }



            if (Number(sample) == tempCounterObj.currentArrLength) {
                let result = await objIncompleteReport.getIncomepleteData(__parameterHardness, strTableName, strDetailTbl, strIdsNo);
                await objSaveCompleteHardness.saveCommonDataToCompleteHardness(result, typeValue, strIdsNo);
                await objCommonInsertOpt.updateEndDate(strIdsNo, strHmi, strTableName);
                await objBatchSummary.saveBatchDataHardness(result.incompleteData, result.detailData, strIdsNo)
                Object.assign(objActivity,
                    { strUserId: tempUserObject.UserId },
                    { strUserName: tempUserObject.UserName },
                    { activity: 'Hardness Weighment Completed on IDS ' + strHmi });
                await objActivityLog.ActivityLogEntry(objActivity);
                await objInstrumentUsage.InstrumentUsage('TabletTester', strIdsNo, 'tbl_instrumentlog_hardness', '', 'completed');
                //clear counter array
                // globalData..findIndex(k => k.Hmi == strHmi) == -1 ? 
                // globalData.tempCounterObj : globalData.tempCounterObj.splice(globalData.tempCounterObj.findIndex(k => k.Hmi == strHmi), 1);

                globalData.arrDataFromInstHardness.findIndex(k => k.Hmi == strHmi) == -1 ?
                    globalData.arrDataFromInstHardness :
                    globalData.arrDataFromInstHardness.splice(globalData.arrDataFromInstHardness.findIndex(k => k.Hmi == strHmi), 1);

                globalData.arrWeighmentCounter.findIndex(k => k.Hmi == strHmi) == -1 ?
                    globalData.arrWeighmentCounter :
                    globalData.arrWeighmentCounter.splice(globalData.arrWeighmentCounter.findIndex(k => k.Hmi == strHmi), 1);

                (globalData.arrCurrentOperationStatus.findIndex((element) => element.Hmi === strHmi)) == -1 ? globalData.arrCurrentOperationStatus :
                    globalData.arrCurrentOperationStatus.splice(globalData.arrCurrentOperationStatus.findIndex((element) => element.Hmi === strHmi), 1);
                //test splice if rotarty is not double
                globalData.arrSelectedMenu.findIndex(k => k.Hmi == strHmi) == -1 ?
                    globalData.arrSelectedMenu :
                    globalData.arrSelectedMenu.splice(globalData.arrSelectedMenu.findIndex(k => k.Hmi == strHmi), 1);
                return mqttSender.sendData(strHmi, `${mqttProtocol.TestCompleted}Hardness test Completed`);

            }

        } catch (error) {
            throw new Error(error);
        }
    }



    /**
     * stable for All parameter
     * @param {*} dataObjMt50  
     */
    async processHardnessDataMT50(dataObjMt50) {
        try {
            let recivedWt = dataObjMt50.actualWt;
            let strIdsNo = dataObjMt50.idsNo;
            let strHmi = dataObjMt50.Hmi;
            let strMenuName = dataObjMt50.instrumentType;

            let selectedIdsNo;
            var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.idsNo == strIdsNo);
            if (IPQCObject != undefined) {
                selectedIdsNo = IPQCObject.selectedIds;
            } else {
                selectedIdsNo = strIdsNo;
            }
            let productObj = globalData.arrIdsInfo.find(k => k.idsNo == selectedIdsNo).cubicalData;
            let productDetail = globalData.arrProductTypeArray.find(k => k.idsNo == selectedIdsNo).productDetail;
            let paramSetOrNot = globalData.arr_limits.find(k => k.idsNo == selectedIdsNo).Menus;
            paramSetOrNot = paramSetOrNot.filter(k => Object.keys(k) == mqttProtocol.Hardness)//[0][mqttProtocol.Hardness].columnDetail
            let thickness = paramSetOrNot.filter(obj => Object.keys(obj) == 'Thickness');
            // let hardness = paramSetOrNot.filter(obj => Object.keys(obj) == 'Hardness');
            let hardness = paramSetOrNot.filter(obj => Object.keys(obj) == "Hardness");
            let objHardness = globalData.arrHardnessMT50.find(ht => ht.Hmi == strHmi);
            let tempCounterObj = globalData.arrWeighmentCounter.find(k => k.Hmi == strHmi);
            let thicknessVal = 0, widthVal = 0, diameterVal = 0, hardnessVal = 0, lengthVal = 0;
            let tempUserObject = globalData.arrUsers.find(k => k.Hmi == strHmi);

            // just coz login is skipped
    //   if(tempUserObject == undefined){
    //     globalData.arrUsers.push({
    //       Hmi: strHmi,
    //       UserId: '11',
    //       UserName: 'jigar.bhandari',
    //       UserPass: '1',
    //   });
    //   }
    //    tempUserObject = globalData.arrUsers.find((k) => k.Hmi == strHmi);


            var HardnessDetail = globalData.arrWeighmentProductData.find(k => k.Hmi == strHmi);

            let sideFromIds = HardnessDetail.data.Side;
            let strSampleNoFromString = '';
            let currentCubical = globalData.arrIdsInfo.find(k => k.idsNo == strIdsNo).cubicalData;
            let mstTableName = 'tbl_tab_master_htd_incomplete'  //'tbl_tab_master_htd_incomplete';
            let DetTableName = 'tbl_tab_detailhtd_incomplete';
            let mstSerNo;
            let sideNo;
            let repSerNo;
            const objSelMenu = globalData.arrSelectedMenu.find(k => k.idsNo == strIdsNo);
            var sample = objSelMenu.selectedProductDetail.noOfSamples;
            let objActivity = {};
            var DP = objSelMenu.selectedProductDetail.Hard_unit == 'N' ? 0 : 1

            let SideArray = globalData.DoubSide.find(k => k.Hmi == strHmi)
            if (SideArray != undefined) {
                var Side = globalData.DoubSide.find(k => k.Hmi == strHmi).Side
            } else {

            }


            const obj = {
                idsNo: strIdsNo,
                dimensionParam: 0,
                sampleNo: 0,
                colName: "",
                thicknessVal: [],
                thicknessDecimal: 0,
                thicknessNom: 0,
                thicknesneg: 0,
                thicknespos: 0,
                WidthVal: [],
                WidthDecimal: 0,
                WidthNom: 0,
                Widthneg: 0,
                Widthpos: 0,
                LengthVal: [],
                LengthDecimal: 0,
                LengthNom: 0,
                Lengthneg: 0,
                Lengthpos: 0,
                DiameterVal: [],
                DiameterDecimal: 0,
                DiametereNom: 0,
                Diameterneg: 0,
                Diameterpos: 0,
                HardnessVal: [],
                HardnessDecimal: 0,
                HardnessNom: 0,
                Hardnessrneg: 0,
                Hardnesspos: 0,
                sampleFromString: ""
            };
            //globalData.arrHardnessMT50.push(obj);
            let tempAr = globalData.arrHardnessMT50.find(k => k.Hmi == strHmi);
            if (tempAr == undefined) {
                globalData.arrHardnessMT50.push({
                    Hmi: strHmi,
                    obj: obj
                })
            } else {
                tempAr.obj = obj
            }
            tempAr = globalData.arrHardnessMT50.find(k => k.Hmi == strHmi);
            if (tempCounterObj === undefined) {
                globalData.arrWeighmentCounter.push({
                    Hmi: strHmi,
                    counter: 0
                })
            }



            const __parameterHardnessMt50 = {
                strTableName: mstTableName,
                strDetailTbl: DetTableName,
                objProductDetails: HardnessDetail.data,
                uniqueSerialNumber: strIdsNo,
                strBalId: dataObjMt50.instrumentId,
                ProtocolData: dataObjMt50.actualWt,
                strHmi: strHmi,
                productType: objSelMenu.selectedProductDetail
            }


            /**
             * remove sample from string 
             */
            let bulkHardness = globalData.arrPushValuesOfHardness.find(k => k.Hmi == strHmi)

            // if (bulkHardness.length !== 0) {
            if (bulkHardness !== undefined) {

                let bulkReceived = globalData.bulkFlag.find(k => k.Hmi == strHmi);
                if (bulkReceived != undefined) {
                    bulkReceived.bulkFlag = true;
                }

                let bulksampl = bulkHardness.sampleno;
                // let bulksampl = bulkHardness.sampleno.split('\n');
                let bulksample = (bulksampl.filter(k => !isNaN(k.split('')[1])))
                for (let i = 1; i <= bulksample.length; i++) {

                    objHardness = globalData.arrHardnessMT50.find(ht => ht.Hmi == strHmi).obj;
                    // obj.HardnessVal.push(hardnessVal)
                    // strSampleNoFromString = recivedWt.substring(1, recivedWt.indexOf(' ')); //to get sample number from string
                    strSampleNoFromString = bulksample[i - 1].split('')[1]; //to get sample number from string


                    if (bulksample.filter(k => isNaN(k.split('')[1])).length != 0) {
                        console.log('sample Not found')
                        return mqttSender.sendData(strHmi, `${mqttProtocol.DisplayMessage}Invalid String`);
                    }
                    else {
                        objHardness.sampleFromString = strSampleNoFromString// saving sample no from hardness
                    }
                }
            } else {
                objHardness = globalData.arrHardnessMT50.find(ht => ht.Hmi == strHmi).obj;
                strSampleNoFromString = recivedWt.substring(1, recivedWt.indexOf(' ')); //to get sample number from string
                if (isNaN(strSampleNoFromString) == true) {
                    console.log('sample Not found')
                    return mqttSender.sendData(strHmi, `${mqttProtocol.DisplayMessage}Invalid String`);
                }
                else {
                    objHardness.sampleFromString = strSampleNoFromString// saving sample no from hardness
                }
            }


            // if (globalData.arrPushValuesOfHardness.length !== 0) {
            bulkHardness = globalData.arrPushValuesOfHardness.find(k => k.Hmi == strHmi)
            if (bulkHardness !== undefined) {

            } else {
                if (Number(objSelMenu.selectedProductDetail.Thick_nominal) != 99999 && Number(objSelMenu.selectedProductDetail.Thick_nominal) != 0) {


                    if (recivedWt.includes("T") && hardness.length != 0) {
                        thicknessVal = recivedWt.substring(recivedWt.indexOf("T") + 1, recivedWt.indexOf("mm")).trim();
                        if (Number(thicknessVal) == 0) {
                            mqttSender.sendData(strHmi, `${GLOBAL_NOMENCLATURE.DisplayMessage}'Invalid String'`);
                            return;
                        }
                        if (isNaN(thicknessVal) == false) {
                            objHardness.thicknessVal = thicknessVal;
                            objHardness.thicknessDecimal = this.precision(Number(thicknessVal));
                            objHardness.sampleNo = strSampleNoFromString;
                        } else {
                            objHardness.thicknessVal = 0;
                            objHardness.thicknessDecimal = 0;
                        }
                    }

                } else {
                    objHardness.thicknessVal = 0;
                    objHardness.thicknessDecimal = 0;
                    objHardness.sampleNo = strSampleNoFromString
                }


                var hardnessUnit = productDetail[0][0].Param7_Unit
                // for Hardness *************************************************************************
                if (Number(objSelMenu.selectedProductDetail.Hard_nominal) != 99999 && Number(objSelMenu.selectedProductDetail.Hard_nominal) != 0) {
                    if (recivedWt.includes('H') && hardness.length != 0) {
                        if (recivedWt.includes("N")) {
                            // hardnessUnit = "N";
                            hardnessVal = recivedWt.substring(recivedWt.indexOf("H") + 1, recivedWt.indexOf("N")).trim()
                            if (Number(hardnessVal) == 0) {
                                mqttSender.sendData(strHmi, `${GLOBAL_NOMENCLATURE.DisplayMessage}'Invalid String'`);
                                return;

                            }
                        }
                        else {
                            // hardnessUnit = "kp";
                            hardnessVal = recivedWt.substring(recivedWt.indexOf("H") + 1, recivedWt.indexOf("Kp")).trim()
                        }

                        if (isNaN(hardnessVal) == false) {// if the received value is valid value
                            objHardness.HardnessVal = hardnessVal;
                            objHardness.HardnessDecimal = this.precision(Number(hardnessVal));
                            objHardness.sampleNo = strSampleNoFromString
                        }
                        else {
                            objHardness.HardnessVal = 0;
                            objHardness.HardnessDecimal = 0;
                        }
                    }
                } else {
                    objHardness.HardnessVal = 0;
                    objHardness.HardnessDecimal = 0;
                    objHardness.sampleNo = strSampleNoFromString
                }

            }

            objHardness = globalData.arrHardnessMT50.find(ht => ht.Hmi == strHmi).obj;
            tempCounterObj = globalData.arrWeighmentCounter.find(k => k.Hmi == strHmi);
            if (Number(sample) >= tempCounterObj.counter) {
                var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.idsNo == strHmi);
                var SelectedIdsNo
                if (IPQCObject != undefined) {
                    SelectedIdsNo = IPQCObject.selectedIds.Idsno;
                } else {
                    SelectedIdsNo = strHmi;
                }
                let tableName = "tbl_powerbackup";
                var powerbackupobj = {
                    strTableName: mstTableName,
                    strDetailTbl: DetTableName,
                    cubicaNo: currentCubical.Sys_CubicNo,
                    cubicType: currentCubical.Sys_CubType,
                    cubicSysBFGcode: currentCubical.Sys_BFGCode,
                    ReportType: currentCubical.Sys_RptType,
                    cubicBatch: currentCubical.Sys_Batch,
                    menuName: HardnessDetail.data.menuName,
                    productType: objSelMenu.selectedProductDetail.ProductType,
                    Userid: tempUserObject.UserId,
                    idsNo: strIdsNo,
                    Hmi: strHmi,
                    Before_Count: 0,
                    After_Count: 0,
                    Hmi: strHmi
                    // Incomp_RepSerNo: tempCounterObj.counter,
                    // RecSampleNo : 

                }

                let _check_combination = await objPowerBackup._check_combination_pow(objSelMenu, powerbackupobj, "tbl_powerbackup");
                if (_check_combination !== undefined) {
                    if (_check_combination.RecSampleNo != 0) {
                        HardnessDetail = globalData.arrWeighmentProductData.find(k => k.Hmi == strHmi);
                        // sample = HardnessDetail.data.noOfSample;
                        //let overallSamples = await this.getSample(strHmi, sample, _check_combination.Incomp_RepSerNo);


                        // tempCounterObj.counter = _check_combination.RecSampleNo

                        if (Number(_check_combination.RecSampleNo) != Number(sample)) {
                            let overallSamples = await this.getSample(strHmi, _check_combination.RecSampleNo, _check_combination.Incomp_RepSerNo, sample);
                            tempCounterObj = globalData.arrWeighmentCounter.find(k => k.Hmi == strHmi);
                            tempCounterObj.counter = Number(sample) - Number(overallSamples.length)
                            console.log(`sample is updating for Hmi ${strHmi} sample =  ${tempCounterObj.counter} log 1`)
                            tempCounterObj.counter += 1;
                        }
                    }

                } else {
                    tempCounterObj.counter += 1;
                }

                tempCounterObj = globalData.arrWeighmentCounter.find(k => k.Hmi == strHmi);

                // tempCounterObj.counter += 1;
                //when bulk string recieve if user does not sent single string
                if (bulkHardness != undefined) {
                    if (tempCounterObj.counter == 1) {
                        tempCounterObj.counter = 0
                        globalData.arrPushValuesOfHardness.findIndex(k => k.Hmi == strHmi) == -1 ?
                            globalData.arrPushValuesOfHardness :
                            globalData.arrPushValuesOfHardness.splice(globalData.arrPushValuesOfHardness.findIndex(k => k.Hmi == strHmi), 1);

                        return
                    }
                }
                if (bulkHardness !== undefined) {
                    if (bulkHardness.sampleno.length != Number(sample)) {
                        if (bulkHardness.sampleno.length != tempCounterObj.counter) {
                            tempCounterObj.counter--
                            return mqttSender.sendData(strHmi, `${mqttProtocol.DisplayMessage} Send Proper String`);

                        }
                    }
                }
                powerbackupobj.RecSampleNo = tempCounterObj.counter

                console.log(`sample is updating for Hmi ${strHmi} sample =  ${tempCounterObj.counter} log 2`)
                console.log(`sample is updating for Hmi ${strHmi}  powerbackupobj.RecSampleNo = ${tempCounterObj.counter}`)


                if (currentCubical.Sys_RotaryType == 'Double') {
                    // if (Side.length == 2) {
                    if (HardnessDetail.data.interval == '') {
                        let currentCubical = globalData.arrIdsInfo.find(k => k.Hmi == strHmi).cubicalData;
                        if (HardnessDetail.data.interval == '' && currentCubical.Sys_RotaryType == 'Double') {
                            var RepSerNo = await models["tbl_tab_master_htd"].findOne({
                                attributes: [[sequelize.fn('max', sequelize.col('RepSerNo')), 'RepSerNo']],
                                where: {
                                    BatchNo: HardnessDetail.data.Batch,
                                    BFGCode: HardnessDetail.data.ProductId,
                                    ProductName: HardnessDetail.data.ProductName,
                                    IdsNo: strHmi
                                }
                            })
                            var interval = await models["tbl_tab_master_htd"].findOne({
                                attributes: [[sequelize.fn('max', sequelize.col('Interval')), 'Interval']],
                                where: {
                                    RepSerNo: RepSerNo.RepSerNo
                                }
                            })
                            HardnessDetail.data.interval = interval.Interval
                        }
                    }
                    // }
                }


                let hardnessMasterEntryArr = globalData.HardnessMasterEntry.find(k => k.Hmi == strHmi)

                //  hardnessMasterEntryArr.masterEntryDone = false

                // if (tempCounterObj.counter == 1 && objHardness.sampleFromString == 1) {
                tempCounterObj = globalData.arrWeighmentCounter.find(k => k.Hmi == strHmi);
                var side = HardnessDetail.data.Side;
                if (Number(tempCounterObj.counter) == 1 && (!hardnessMasterEntryArr.masterEntryDone)) {            // 
                    var activity_msg;
                    if (side == 'NA') {
                        activity_msg = `${mqttProtocol.Hardness}/Thickness Test Started on TSH ${strHmi}`
                    } else {
                        activity_msg = `${mqttProtocol.Hardness}/Thickness Test Started on TSH ${strHmi} for side ${side}`
                    }
                    Object.assign(objActivity,
                        { strUserId: tempUserObject.UserId },
                        { strUserName: tempUserObject.UserName },
                        { activity: activity_msg });
                    await objActivityLog.ActivityLogEntry(objActivity);
                    await objInstrumentUsage.InstrumentUsage('Hardness',
                        strIdsNo, 'tbl_instrumentlog_hardness', strMenuName, 'started');

                    if (productObj.Sys_RptType == 1) {//for Initial 
                        mstSerNo = 1
                        sideNo = 1
                    } else { //regular
                        let objMt50 = {
                            tableName: mstTableName,
                            ReportType: 0,
                            Side: sideFromIds,
                            BFGCode: productObj.Sys_BFGCode,
                            ProductName: productObj.Sys_ProductName,
                            PVersion: productObj.Sys_PVersion,
                            Version: productObj.Sys_Version,
                            BatchNo: productObj.Sys_Batch,
                            IdsNo: strHmi
                        }

                        //doubts
                        if (sideFromIds == 'NA') {
                            mstSerNo = await objGetMstSrAndSideSr.getRegularLRMstSerialNo(objMt50);
                            sideNo = await objGetMstSrAndSideSr.getRegularLRSideNo(objMt50);
                            if (sideNo < 10) {
                                sideNo = sideNo + 1;
                            }
                            else {
                                sideNo = 1;
                                mstSerNo = mstSerNo + 1;
                            }
                        }
                        else {
                            mstSerNo = await objGetMstSrAndSideSr.getRegularLRMstSerialNo(objMt50);
                            sideNo = await objGetMstSrAndSideSr.getRegularLRSideNo(objMt50);
                            if (sideNo < 5) {
                                sideNo = sideNo + 1;
                            }
                            else {
                                sideNo = 1;
                                mstSerNo = mstSerNo + 1;
                            }
                        }
                    }
                    //

                    var thicknesNeg = 0, thicknesPos = 0
                    if (thickness.length > 0) {
                        if ((thickness[0].Thickness.T1Neg != undefined && thickness[0].Thickness.T1Neg != "0.00000" && thickness[0].Thickness.T1Neg != "9.9999") && thickness.length != 0) {
                            thicknesNeg = thickness[0].Thickness.T1Neg
                            thicknesPos = thickness[0].Thickness.T1Pos
                        } else if ((thickness[0].Thickness.T2Neg != undefined && thickness[0].Thickness.T2Neg != "0.00000" && thickness[0].Thickness.T2Neg != "9.9999") && thickness.length != 0) {
                            thicknesNeg = thickness[0].Thickness.T2Neg
                            thicknesPos = thickness[0].Thickness.T2Pos
                        }
                    }

                    var hardnessNeg = 0, hardnessPos = 0;
                    if (hardness.length > 0) {
                        if ((hardness[0].Hardness.T1Neg != undefined && hardness[0].Hardness.T1Neg != "0.0000" && hardness[0].Hardness.T1Neg != "9.9999") && hardness.length != 0) {
                            hardnessNeg = hardness[0].Hardness.T1Neg
                            hardnessPos = hardness[0].Hardness.T1Pos
                        } else if ((hardness[0].Hardness.T2Neg != undefined && hardness[0].Hardness.T2Neg != "0.0000" || hardness[0].Hardness.T2Neg != "9.9999") && hardness.length != 0) {
                            hardnessNeg = hardness[0].Hardness.T2Neg
                            hardnessPos = hardness[0].Hardness.T2Pos
                        }
                    }


                    let now = new Date();
                    let tableName = 'tbl_tab_master_htd_incomplete'  //'tbl_tab_master_htd_incomplete';


                    let bRepSerNo = await objCommonInsertOpt.getMaxBRepSerNo(productObj.Sys_ProductName, productObj.Sys_Batch, "tbl_tab_master_htd", productObj.Sys_RptType, tableName, productObj.Sys_CubType)
                    let ChangesHardnessID = await models.tbl_cubical.findAll({
                        where: {
                            Sys_IDSNo: strHmi
                        }
                    })
                    var prod_Detail = globalData.arrProductTypeArray.find(k => k.Hmi == strHmi).productDetail[0][0];
                    productObj.Sys_HardID = ChangesHardnessID[0].Sys_HardID
                    let insertIncompleteObj = await models[tableName].create({
                        MstSerNo: mstSerNo,
                        WgmtModeNo: 7,
                        Area: productObj.Sys_Area,
                        CubicalNo: productObj.Sys_CubicNo,
                        CubicleType: productObj.Sys_CubType,
                        CubicleName: productObj.Sys_dept,
                        Dept: productObj.Sys_dept,
                        BatchNo: productObj.Sys_Batch,
                        BMRNo: productObj.Sys_BMRNo,
                        BFGCode: productObj.Sys_BFGCode,
                        ProductName: productObj.Sys_ProductName,
                        PVersion: productObj.Sys_PVersion,
                        Version: productObj.Sys_Version,
                        ProductType: 1,
                        MachineCode: productObj.Sys_MachineCode,
                        BatchSize: `${productObj.Sys_BatchSize}`,
                        Qty: HardnessDetail.data.noOfSample,
                        Idsno: strHmi,
                        InsturmentID: productObj.Sys_HardID,
                        UserId: tempUserObject.UserId,
                        UserName: tempUserObject.UserName,
                        PrDate: moment().format('YYYY-MM-DD'),
                        PrTime: moment().format('HH:mm:ss'),
                        NomHard: (Number(objSelMenu.selectedProductDetail.Hard_nominal) == 99999 || Number(objSelMenu.selectedProductDetail.Hard_nominal) == 0) ? 0 : maths.round(objSelMenu.selectedProductDetail.Hard_nominal).toFixed(DP),
                        NomThick: (Number(objSelMenu.selectedProductDetail.Thick_nominal) == 99999 || Number(objSelMenu.selectedProductDetail.Thick_nominal) == 0) ? 0 : Number(objSelMenu.selectedProductDetail.Thick_nominal).toFixed(2),
                        T1NegTolHard: HardnessDetail.data["Hard_T1Neg"].split(' ')[0],
                        T1PosTolHard: HardnessDetail.data["Hard_T1Pos"].split(' ')[0],
                        T2NegTolHard: HardnessDetail.data["Hard_T2Neg"].split(' ')[0],
                        T2PosTolHard: HardnessDetail.data["Hard_T2Pos"].split(' ')[0],
                        T1NegTolThick: HardnessDetail.data["Thick_T1Neg(mm)"].split(' ')[0],
                        T1PosTolThick: HardnessDetail.data["Thick_T1Pos(mm)"].split(' ')[0],
                        T2NegTolThick: HardnessDetail.data["Thick_T2Neg(mm)"].split(' ')[0],
                        T2PosTolThick: HardnessDetail.data["Thick_T2Pos(mm)"].split(' ')[0],
                        LimitOn: objSelMenu.selectedProductDetail.LimitOn,
                        T1NMT: prod_Detail.Param1_NMTTab,
                        ReportType: productObj.Sys_RptType,
                        AvgValueHard: recivedWt.includes('H') ? hardnessVal : "NA",
                        MinValueHard: recivedWt.includes('H') ? hardnessVal : "NA",
                        MaxValueHard: recivedWt.includes('H') ? hardnessVal : "NA",
                        AvgValueThick: recivedWt.includes('T') ? thicknessVal : "NA",
                        MinValueThick: recivedWt.includes('T') ? thicknessVal : "NA",
                        MaxValueThick: recivedWt.includes('T') ? thicknessVal : "NA",
                        StdDevHard: recivedWt.includes('H') ? hardnessVal : "NA",
                        StdDevThick: recivedWt.includes('T') ? thicknessVal : "NA",
                        NoOfAboveT1Hard: 0,
                        NoOfAboveT2Hard: 0,
                        NoOfBelowT1Hard: 0,
                        NoOfBelowT2Hard: 0,
                        NoOfAboveT1Thick: 0,
                        NoOfAboveT2Thick: 0,
                        NoOfBelowT1Thick: 0,
                        NoOfBelowT2Thick: 0,
                        Side: sideFromIds,
                        Unit: hardnessUnit,
                        DP: DP,
                        MFGCode: productObj.Sys_Stage,
                        IsArchived: 0,
                        GraphType: objSelMenu.selectedProductDetail.isonstd == undefined ? 0 : objSelMenu.selectedProductDetail.isonstd,
                        IsProcess: 1

                    });
                    var lastInsertedID = insertIncompleteObj._previousDataValues.RepSerNo;
                    console.log(insertIncompleteObj)

                    hardnessMasterEntryArr.masterEntryDone = true

                }


                if (Number(tempCounterObj.counter) == 1 && objHardness.sampleFromString == 1) {


                    repSerNo = lastInsertedID;
                } else {

                    repSerNo = await this.lastInsertedRecords(productObj.Sys_ProductName, productObj.Sys_BFGCode,
                        productObj.Sys_PVersion, productObj.Sys_Version, 'tbl_tab_master_htd', strHmi, productObj.Sys_Batch);
                    await objPowerBackup.updateTestCount(objSelMenu, powerbackupobj, tableName);
                }
                powerbackupobj.Incomp_RepSerNo = repSerNo
                await objPowerBackup.getStatusoFTestForPowerBackup(powerbackupobj);
                _check_combination = await objPowerBackup._check_combination_pow(objSelMenu, powerbackupobj, "tbl_powerbackup");

                tempCounterObj = globalData.arrWeighmentCounter.find(k => k.Hmi == strHmi);

                if (tempCounterObj.counter == 1) {
                    let sideCount = _check_combination.WeighmentType == null ? 0 : _check_combination.WeighmentType
                    //side is used for weighType
                    await models.tbl_powerbackup.update({
                        WeighmentType: Number(sideCount) + 1
                    }, {
                        where: {
                            IdsNo: strHmi,
                            Sys_Batch: currentCubical.Sys_Batch
                        }
                    });
                }
                bulkHardness = globalData.arrPushValuesOfHardness.find(k => k.Hmi == strHmi)
                if (bulkHardness !== undefined) {
                    let bulksampl = bulkHardness.sampleno
                    //  let bulksampl = bulkHardness.sampleno.split('\n');
                    let bulksample = (bulksampl.filter(k => !isNaN(k.split('')[1])))
                    // tempCounterObj.counter--
                    //check missing sample and insert
                    tempCounterObj = globalData.arrWeighmentCounter.find(k => k.Hmi == strHmi);
                    tempCounterObj.counter = tempCounterObj.counter - 1

                    tempCounterObj = globalData.arrWeighmentCounter.find(k => k.Hmi == strHmi);
                    let missingSamples = globalData.arrcheckingInCompRepSerNo.find(k => k.Hmi == strHmi)
                    if (missingSamples == undefined) {
                        //missingSamples = await this.getSample(strHmi, sample, repSerNo)
                        missingSamples = await this.getSample(strHmi, sample)
                    } else {
                        missingSamples = globalData.arrcheckingInCompRepSerNo.find(k => k.Hmi == strHmi).values
                    }
                    bulksample = missingSamples.map(missingSample => bulksample.filter(k => k.includes(`@${missingSample}`)))
                    // bulksample = missingSamples.map(missingSample => bulksample.filter(k =>  k.includes(`@${missingSample}`)))
                    //bulksample = missingSamples.map(missingSample => bulksample.filter(k => k.includes(`@${missingSample}`)))
                    bulksample = bulksample.filter(k => k.length > 0)
                    for (let i = 1; i <= bulksample.length; i++) {


                        if (bulksample[i - 1][0].includes('H') && hardness.length != 0) {
                            if (bulksample[i - 1][0].includes("N")) {
                                hardnessVal = bulksample[i - 1][0].substring(bulksample[i - 1][0].indexOf("H") + 1, bulksample[i - 1][0].indexOf("N")).trim()

                            }
                            else {
                                hardnessVal = bulksample[i - 1][0].substring(bulksample[i - 1][0].indexOf("H") + 1, bulksample[i - 1][0].indexOf("kp")).trim()
                            }

                            if (isNaN(hardnessVal) == false) {// if the received value is valid value
                                objHardness.HardnessVal = hardnessVal;
                                objHardness.HardnessDecimal = this.precision(Number(hardnessVal));
                                objHardness.sampleNo = strSampleNoFromString
                            }
                            else {
                                objHardness.HardnessVal = 0;
                                objHardness.HardnessDecimal = 0;
                            }
                        } else {
                            objHardness.HardnessVal = 0;
                            objHardness.HardnessDecimal = 0;
                            objHardness.sampleNo = strSampleNoFromString
                        }

                        //thickness
                        if (bulksample[i - 1][0].includes("T") && thickness.length != 0) {
                            thicknessVal = bulksample[i - 1][0].substring(bulksample[i - 1][0].indexOf("T") + 1, bulksample[i - 1][0].indexOf("mm")).trim();
                            if (isNaN(thicknessVal) == false) {
                                objHardness.thicknessVal = thicknessVal;
                                objHardness.thicknessDecimal = this.precision(Number(thicknessVal));
                                objHardness.sampleNo = strSampleNoFromString;
                            } else {
                                objHardness.thicknessVal = 0;
                                objHardness.thicknessDecimal = 0;
                            }

                        } else {
                            objHardness.thicknessVal = 0;
                            objHardness.thicknessDecimal = 0;
                            objHardness.sampleNo = strSampleNoFromString
                        }

                        //for width
                        if (bulksample[i - 1][0].includes("Wd") && breadth.length != 0) {
                            let tempstring = bulksample[i - 1][0].substring(bulksample[i - 1][0].indexOf("Wd"));
                            widthVal = tempstring.substring(tempstring.indexOf("Wd") + 2, tempstring.indexOf("mm")).trim();
                            if (isNaN(widthVal) == false) {
                                objHardness.WidthVal = widthVal;
                                objHardness.WidthDecimal = this.precision(Number(widthVal));
                                objHardness.sampleNo = strSampleNoFromString;
                            } else {
                                objHardness.WidthVal = 0;
                                objHardness.WidthDecimal = 0;
                            }

                        } else {
                            objHardness.WidthVal = 0;
                            objHardness.WidthDecimal = 0;
                            objHardness.sampleNo = strSampleNoFromString
                        }

                        // for Diameter *************************************************************************
                        if (bulksample[i - 1][0].includes("D") && diameter.length != 0) {
                            let tempstring = bulksample[i - 1][0].substring(bulksample[i - 1][0].indexOf("D") + 1)
                            diameterVal = tempstring.substring(0, tempstring.indexOf("mm")).trim();
                            if (isNaN(diameterVal) == false) {
                                objHardness.DiameterVal = diameterVal;
                                objHardness.DiameterDecimal = this.precision(Number(diameterVal));
                                objHardness.sampleNo = strSampleNoFromString;
                            } else {
                                objHardness.DiameterVal = 0;
                                objHardness.DiameterDecimal = 0;
                            }

                        } else {
                            objHardness.DiameterVal = 0;
                            objHardness.DiameterDecimal = 0;
                            objHardness.sampleNo = strSampleNoFromString
                        }

                        // for Length *************************************************************************
                        // let tempstring = recivedWt.substring(recivedWt.indexOf("D") + 1)
                        if (bulksample[i - 1][0].includes("D") && lengthParam.length != 0) {
                            let tempstring = bulksample[i - 1][0].substring(bulksample[i - 1][0].indexOf("D") + 1)
                            lengthVal = tempstring.substring(0, tempstring.indexOf("mm")).trim();

                            if (isNaN(lengthVal) == false) {
                                objHardness.LengthVal = lengthVal;
                                objHardness.LengthDecimal = this.precision(Number(lengthVal));
                                objHardness.sampleNo = strSampleNoFromString;
                            } else {
                                objHardness.LengthVal = 0;
                                objHardness.LengthDecimal = 0;
                            }
                        } else {
                            objHardness.LengthVal = 0;
                            objHardness.LengthDecimal = 0;
                            objHardness.sampleNo = strSampleNoFromString
                        }
                        /*********************************************************************************** */

                        if (objHardness.DiameterVal != 0) {
                            objHardness.DiameterVal = objHardness.DiameterVal
                            objHardness.DiameterDecimal = objHardness.DiameterDecimal
                        } else if (objHardness.LengthVal != 0) {
                            objHardness.DiameterVal = objHardness.LengthVal
                            objHardness.DiameterDecimal = objHardness.LengthDecimal
                        } else {
                            objHardness.DiameterVal = 0;
                            objHardness.DiameterDecimal = 0
                        }
                        tempCounterObj = globalData.arrWeighmentCounter.find(k => k.Hmi == strHmi);
                        tempCounterObj.counter++
                        let sampleNo = bulksample[i - 1][0].slice(1, bulksample[i - 1][0].length).split(' ')[0]
                        let checkSampleAlreadyInsert = await this.checkSampleAlreadyInsert(repSerNo, sampleNo, DetTableName)

                        //let alreadySave = await this.checkIfmoveTosave(repSerNo, 'tbl_tab_masterhtd')
                        // if (!alreadySave) {
                        if (!checkSampleAlreadyInsert && (!hardnessMasterEntryArr.savedToMaster)) {


                            await models[DetTableName].create({
                                RepSerNo: repSerNo,
                                MstSerNo: 0,
                                RecSeqNo: strSampleNoFromString,
                                DataValueThick: (objHardness.thicknessVal == undefined || objHardness.thicknessVal == "" || objHardness.thicknessVal == 0) ? 'NA' : objHardness.thicknessVal,
                                DataValueHard: (objHardness.HardnessVal == undefined || objHardness.HardnessVal == '' || objHardness.HardnessVal == 0) ? 'NA' : objHardness.HardnessVal,
                                DP: objHardness.HardnessVal ? objHardness.HardnessDecimal : objHardness.thicknessDecimal


                            });

                            mqttSender.sendData(strHmi, `${mqttProtocol.DisplayResult}${sampleNo}:Hardness:${objHardness.HardnessVal} ; Thickness:${objHardness.thicknessVal} ; `);

                        } else {
                            tempCounterObj = globalData.arrWeighmentCounter.find(k => k.Hmi == strHmi);
                            tempCounterObj.counter = tempCounterObj.counter - 1
                        }

                        await objInstrumentUsage.InstrumentUsage('Hardness', strIdsNo, 'tbl_instrumentlog_hardness', '', 'completed');


                    }

                } else {
                    console.log(strSampleNoFromString);
                    var data_master = await models[mstTableName].findAll({ where: { RepSerNo: repSerNo } })

                    // var dp = data_master[0].Unit == 'N' ? 0 : 1
                    await models[DetTableName].create({
                        RepSerNo: repSerNo,
                        MstSerNo: 0,
                        RecSeqNo: strSampleNoFromString,
                        DataValueThick: (objHardness.thicknessVal == undefined || objHardness.thicknessVal == "" || objHardness.thicknessVal == 0) ? 'NA' : Number(objHardness.thicknessVal).toFixed(2),
                        DataValueHard: (objHardness.HardnessVal == undefined || objHardness.HardnessVal == '' || objHardness.HardnessVal == 0) ? 'NA' : Number(objHardness.HardnessVal).toFixed(DP),
                        DP: DP


                    });
                    powerbackupobj.RecSampleNo = strSampleNoFromString;
                    await objPowerBackup.updateTestCount(objSelMenu, powerbackupobj, tableName);
                    //update Min ,Max, Avg, Std
                    var DataValue_arr = [];
                    var detail_tableName = "tbl_tab_detailhtd_incomplete";
                    var master_tableName = "tbl_tab_master_htd_incomplete";
                    var Nominal = objSelMenu.selectedProductDetail.Hard_nominal;
                    Nominal = Number(Nominal).toFixed(1);
                    var get_Datavalue = await models[detail_tableName].findAll({ where: { RepSerNo: repSerNo } })
                    var get_Datavalue1 = await models[master_tableName].findAll({ where: { RepSerNo: repSerNo } })
                    DataValue_arr.push(get_Datavalue);
                    var arr_H = [];
                    var arr_T = [];
                    for (var i = 0; i < get_Datavalue.length; i++) {
                        var Hardness, Thickness;
                        if ((objHardness.HardnessVal != undefined || 0) && (objHardness.thicknessVal == undefined || 0)) {
                            Hardness = get_Datavalue[i].DataValueHard;

                        } else if ((objHardness.thicknessVal != undefined || 0) && (objHardness.HardnessVal == undefined || 0)) {
                            Thickness = get_Datavalue[i].DataValueThick;
                        } else {
                            Hardness = get_Datavalue[i].DataValueHard;
                            Thickness = get_Datavalue[i].DataValueThick;
                        }
                        arr_H.push(Number(Hardness));
                        arr_T.push(Number(Thickness));
                        // console.log("arr_H" = arr_H, "arr_T" = arr_T);
                        var max_value_H, min_value_H, std_value_H, total, avg_H
                        if (Hardness != 'NA') {
                            max_value_H = maths.max(arr_H);
                            min_value_H = maths.min(arr_H);
                            std_value_H = maths.std(arr_H);
                            std_value_H = maths.abs(std_value_H).toFixed(1);
                            total = arr_H.reduce((acc, total) => {
                                return Number(total) + Number(acc);
                            }, 0)
                            avg_H = total / arr_H.length
                            avg_H = avg_H.toFixed(1);
                        }
                        //thick
                        var max_value_T, min_value_T, std_value_T, total_T, avg_T
                        if (Thickness != 'NA') {
                            max_value_T = maths.max(arr_T);
                            min_value_T = maths.min(arr_T);
                            std_value_T = maths.std(arr_T);
                            std_value_T = maths.abs(std_value_T).toFixed(2);
                            total_T = arr_T.reduce((acc, total) => {
                                return Number(total) + Number(acc);
                            }, 0)
                            avg_T = total_T / arr_T.length
                            avg_T = avg_T.toFixed(2);
                        }

                        console.log(max_value_H, min_value_H, std_value_H, avg_H);

                    }
                    // //No.of Tablets Above and Below limit
                    var T1Pos_Tol_H, T1Neg_Tol_H, T2Pos_Tol_H, T2Neg_Tol_H, T1Neg_Tol_T, T1Pos_Tol_T, T2Pos_Tol_T, T2Neg_Tol_T;
                    T1Pos_Tol_H = get_Datavalue1[0].T1PosTolHard;
                    T1Neg_Tol_H = get_Datavalue1[0].T1NegTolHard;
                    T2Pos_Tol_H = get_Datavalue1[0].T2PosTolHard;
                    T2Neg_Tol_H = get_Datavalue1[0].T2NegTolHard;

                    T1Neg_Tol_T = get_Datavalue1[0].T1NegTolThick
                    T1Pos_Tol_T = get_Datavalue1[0].T1PosTolThick
                    T2Pos_Tol_T = get_Datavalue1[0].T2PosTolThick;
                    T2Neg_Tol_T = get_Datavalue1[0].T2NegTolThick

                    //hardness above below count
                    if (Hardness != 'NA') {
                        if ((Number(T2Neg_Tol_H) > Number(Hardness)) || (Number(T2Pos_Tol_H) < Number(Hardness))) {
                            get_Datavalue1[0].NoOfBelowT2Hard = Number(get_Datavalue1[0].NoOfBelowT2Hard) + 1;
                        }
                        if (T1Neg_Tol_H != 0 && T1Pos_Tol_H != 0) {
                            if (((Number(T1Neg_Tol_H) > Number(Hardness)) && (Number(T2Neg_Tol_H) <= Number(Hardness))) || ((Number(T1Pos_Tol_H) < Number(Hardness)) && (Number(T2Pos_Tol_H) >= Number(Hardness)))) {
                                get_Datavalue1[0].NoOfBelowT1Hard = Number(get_Datavalue1[0].NoOfBelowT1Hard) + 1;
                            }
                        }
                    } else {
                        get_Datavalue1[0].NoOfBelowT1Hard = 'NA'
                        get_Datavalue1[0].NoOfBelowT2Hard = 'NA'
                        get_Datavalue1[0].NoOfAboveT1Hard = 'NA'
                        get_Datavalue1[0].NoOfAboveT2Hard = 'NA'
                    }

                    //thickness above below count
                    if (Thickness != 'NA') {
                        if ((Number(T2Neg_Tol_T) > Number(Thickness)) || (Number(T2Pos_Tol_T) < Number(Thickness))) {
                            get_Datavalue1[0].NoOfBelowT2Thick = Number(get_Datavalue1[0].NoOfBelowT2Thick) + 1;
                        }
                        if (T1Neg_Tol_T != 0 && T1Pos_Tol_T != 0) {
                            if (((Number(T1Neg_Tol_T) > Number(Thickness)) && (Number(T2Neg_Tol_T) <= Number(Thickness))) || ((Number(T1Pos_Tol_T) < Number(Thickness)) && (Number(T2Pos_Tol_T) >= Number(Thickness)))) {
                                get_Datavalue1[0].NoOfBelowT1Thick = Number(get_Datavalue1[0].NoOfBelowT1Thick) + 1;
                            }
                        } else {
                            get_Datavalue1[0].NoOfBelowT1Thick = 'NA'
                        }
                    } else {
                        get_Datavalue1[0].NoOfBelowT1Thick = 'NA'
                        get_Datavalue1[0].NoOfBelowT2Thick = 'NA'
                        get_Datavalue1[0].NoOfAboveT2Thick = 'NA'
                        get_Datavalue1[0].NoOfAboveT1Thick = 'NA'
                    }


                    // if (Number(T2Pos_Tol_H) < Number(Hardness)) {
                    //     get_Datavalue1[0].NoOfAboveT2Hard = Number(get_Datavalue1[0].NoOfAboveT2Hard) + 1;
                    // } if (Number(T2Neg_Tol_H) > Number(Hardness)) {
                    //     get_Datavalue1[0].NoOfBelowT2Hard = Number(get_Datavalue1[0].NoOfBelowT2Hard) + 1;
                    // } if (Number(T1Pos_Tol_H) < Number(Hardness) && (Number(T2Pos_Tol_H) < Number(Hardness))) {
                    //     get_Datavalue1[0].NoOfAboveT1Hard = Number(get_Datavalue1[0].NoOfAboveT1Hard) + 1;
                    // } if (Number(T1Neg_Tol_H) > Number(Hardness) && (Number(T2Neg_Tol_H) > Number(Hardness))) {
                    //     get_Datavalue1[0].NoOfBelowT1Hard = Number(get_Datavalue1[0].NoOfBelowT1Hard) + 1;
                    // } if (Number(T2Pos_Tol_T) < Number(Thickness)) {
                    //     get_Datavalue1[0].NoOfAboveT2Thick = Number(get_Datavalue1[0].NoOfAboveT2Thick) + 1;
                    // } if (Number(T2Neg_Tol_T) > Number(Thickness)) {
                    //     get_Datavalue1[0].NoOfBelowT2Thick = Number(get_Datavalue1[0].NoOfBelowT2Thick) + 1;
                    // }
                    var remark;

                    if (((isNaN(get_Datavalue1[0].NoOfBelowT2Hard) == true ? false : (Number(get_Datavalue1[0].NoOfBelowT2Hard) != 0)) || (isNaN(get_Datavalue1[0].NoOfBelowT2Thick) == true ? false : (Number(get_Datavalue1[0].NoOfBelowT2Thick) != 0)))) {
                        remark = 'Not Complies';
                    } else {
                        remark = 'Complies';
                    }

                    // if (((Number(get_Datavalue1[0].NoOfAboveT2Hard)) != 0 || (Number(get_Datavalue1[0].NoOfBelowT2Hard) != 0) || (Number(get_Datavalue1[0].NoOfBelowT2Thick) != 0) || (Number(get_Datavalue1[0].NoOfAboveT2Thick) != 0))) {
                    //     remark = 'Not Complies';
                    // } else {
                    //     remark = 'Complies';
                    // }

                    // get_Datavalue1[0].NoOfBelowT1Hard = Number(get_Datavalue1[0].NoOfBelowT1Hard) + Number(get_Datavalue1[0].NoOfAboveT1Hard)
                    // get_Datavalue1[0].NoOfBelowT2Hard = Number(get_Datavalue1[0].NoOfBelowT2Hard) + Number(get_Datavalue1[0].NoOfAboveT2Hard)

                    var update_Master = await models[master_tableName].update({
                        AvgValueHard: avg_H == undefined ? 'NA' : Number(avg_H).toFixed(DP),
                        MinValueHard: min_value_H == undefined ? 'NA' : Number(min_value_H).toFixed(DP),
                        MaxValueHard: max_value_H == undefined ? 'NA' : Number(max_value_H).toFixed(DP),
                        AvgValueThick: avg_T == undefined ? 'NA' : Number(avg_T).toFixed(2),
                        MinValueThick: min_value_T == undefined ? 'NA' : Number(min_value_T).toFixed(2),
                        MaxValueThick: max_value_T == undefined ? 'NA' : Number(max_value_T).toFixed(2),
                        StdDevHard: std_value_H == undefined ? 'NA' : Number(std_value_H).toFixed(DP),
                        StdDevThick: std_value_T == undefined ? 'NA' : Number(std_value_T).toFixed(2),
                        NoOfAboveT1Hard: get_Datavalue1[0].NoOfAboveT1Hard,
                        NoOfAboveT2Hard: get_Datavalue1[0].NoOfAboveT2Hard,
                        NoOfBelowT1Hard: get_Datavalue1[0].NoOfBelowT1Hard,
                        NoOfBelowT2Hard: get_Datavalue1[0].NoOfBelowT2Hard,
                        NoOfAboveT1Thick: get_Datavalue1[0].NoOfAboveT1Thick,
                        NoOfAboveT2Thick: get_Datavalue1[0].NoOfAboveT2Thick,
                        NoOfBelowT1Thick: get_Datavalue1[0].NoOfBelowT1Thick,
                        NoOfBelowT2Thick: get_Datavalue1[0].NoOfBelowT2Thick
                    }, { where: { RepSerNo: repSerNo } })

                    // await objInstrumentUsage.InstrumentUsage('Hardness', strIdsNo, 'tbl_instrumentlog_hardness', '', 'completed');

                }
                // await objPowerBackup.updateTestCount(objSelMenu, powerbackupobj, tableName);
                objHardness.HardnessVal == 0 ? 0 : objHardness.HardnessVal;
                objHardness.thicknessVal == 0 ? 0 : objHardness.thicknessVal;
                objHardness.WidthVal == 0 ? 0 : objHardness.WidthVal;

                bulkHardness = globalData.arrPushValuesOfHardness.find(k => k.Hmi == strHmi)
                if (!bulkHardness) {
                    mqttSender.sendData(strHmi, `${mqttProtocol.DisplayResult}${objHardness.sampleFromString}: Hardness:${Number(objHardness.HardnessVal).toFixed(DP)} ; Thickness:${Number(objHardness.thicknessVal).toFixed(2)} ;`);
                } else {
                    console.log(`bulkHrdness Flag in one by one sample: ${bulkHardness}`);
                }

                await objMonit.monit({
                    case: 'TestWeight',
                    Hmi: strHmi,
                    data: {
                        Weight: `Sample ${strSampleNoFromString} Received`,
                        srNo: strSampleNoFromString,
                        message: ""
                    }
                });

                var hdt_obj = await models[DetTableName].findAll({
                    where: {
                        RepSerNo: repSerNo
                    }
                })
                if (hdt_obj.length == Number(sample)) {
                    tempCounterObj.counter = hdt_obj.length
                }
                let compCount;
                bulkHardness = globalData.arrPushValuesOfHardness.find(k => k.Hmi == strHmi)
                if (bulkHardness == undefined) {
                    HardnessDetail = globalData.arrWeighmentProductData.find(k => k.Hmi == strHmi);
                    // sample = HardnessDetail.data.noOfSample;
                    if (Number(objHardness.sampleFromString) == Number(sample)) {

                        tempCounterObj = globalData.arrWeighmentCounter.find(k => k.Hmi == strHmi);
                        if (Number(tempCounterObj.counter) !== Number(sample)) {
                            console.log("mismatch block", strHmi, tempCounterObj.counter, sample);
                            //check sample count with db if count match then move or send msg to ids with unsend wt

                            //incomplete arr 
                            let _arrcheckingCompRepSerNo = globalData.formatching.find(k => k.Hmi == strHmi).values;
                            let n = _arrcheckingCompRepSerNo.length;

                            //check missing count with sample
                            this.getMissingNo(_arrcheckingCompRepSerNo, n, strHmi, sample)

                            //globalData.arrcheckingInCompRepSerNo
                            let missingSampleArr = globalData.arrcheckingInCompRepSerNo.find(k => k.Hmi == strHmi);

                            console.log(`${missingSampleArr.values.join()} some wt are pending and send pending wt to ids`);
                        }
                    }
                }



                let compSampleForComplete = globalData.formatching.length;


                tempCounterObj = globalData.arrWeighmentCounter.find(k => k.Hmi == strHmi);
                console.log("hardness counter", tempCounterObj.counter);
                HardnessDetail = globalData.arrWeighmentProductData.find(k => k.Hmi == strHmi);
                // sample = HardnessDetail.data.noOfSample;

                console.log(`tempCounterObj.counter ${tempCounterObj.counter},${strHmi}`)
                if (Number(tempCounterObj.counter) === Number(sample)) {
                    console.log(sample, 'sample complted moving to save logic')
                    hardnessMasterEntryArr = globalData.HardnessMasterEntry.find(k => k.Hmi == strHmi)
                    hardnessMasterEntryArr.masterEntryDone = false
                    let alreadySave = await this.checkIfmoveTosave(repSerNo, 'tbl_tab_master_htd')
                    // if (!alreadySave) {
                    hardnessMasterEntryArr = globalData.HardnessMasterEntry.find(k => k.Hmi == strHmi)
                    console.log(hardnessMasterEntryArr.savedToMaster, "saving if flagMaster false")
                    if (!hardnessMasterEntryArr.savedToMaster) {
                        console.log('saving hardness');

                        let result = await objIncompleteReport.getIncomepleteData(__parameterHardnessMt50, 'tbl_tab_master_htd', 'tbl_tab_detailhtd', strHmi);
                        console.log(result)
                        result.remark = remark;
                        var response = await objSaveCompleteHardness.saveHardnessData8M(result, repSerNo, strIdsNo, strHmi, 'tbl_tab_master_htd', "tbl_tab_detailhtd");

                        // await objInstrumentUsage.InstrumentUsage('Hardness', strIdsNo, 'tbl_instrumentlog_hardness', '', 'completed');
                        // await objCommonInsertOpt.updateEndDate(strIdsNo, strHmi, mstTableName);
                        const objUpdateValidation = await models.tbl_cubical.update({
                            'Sys_Validation': 0
                        }, {
                            where: {
                                'Sys_IDSNo': strHmi
                            }

                        });

                        if (currentCubical.Sys_BatchReuse == 0) {
                            let remark_limit = await objBatchSummary.saveBatchDataHardness(result.incompleteData, result.detailData, strIdsNo, strHmi);
                        }
                        // if (remark_limit != undefined) {
                        if (remark == "Complies") {
                            var Result_remrk = 'Report Within Limit'
                        } else {
                            var Result_remrk = 'Report Out Of Limit'
                        }

                        var act_msg;
                        if (side == 'NA') {
                            act_msg = `${mqttProtocol.Hardness}/Thickness Test Completed on TSH ${strHmi}`
                        } else {
                            act_msg = `${mqttProtocol.Hardness}/Thickness Test Completed on TSH ${strHmi} for side ${side}`
                        }
                        Object.assign(objActivity,
                            { strUserId: tempUserObject.UserId },
                            { strUserName: tempUserObject.UserName },
                            { activity: act_msg });
                        await objActivityLog.ActivityLogEntry(objActivity);

                        currentCubical.Sys_Validation = 0;
                        if (remark == "Complies") {
                            let obj = {
                                recordFrom: "Current",
                                reportOption: "Hardness",
                                reportType: "Complete",
                                testType: "Standard Run",
                                RepSerNo: response.RepSerNo,
                                userId: tempUserObject.UserId,
                                username: tempUserObject.UserName,
                                printNo: 0,
                                str_url: "Tablet"
                            }
                            await objcallPrint.callViewTabReport(obj, 1, strHmi)
                        }
                    }


                    if (currentCubical.Sys_RotaryType == 'Single') {


                        // Object.assign(objActivity,
                        //     { strUserId: tempUserObject.UserId },
                        //     { strUserName: tempUserObject.UserName },
                        //     { activity: `${mqttProtocol.TabletTesterMenu} Weighment Completed on IDS ` + strHmi });
                        // await objActivityLog.ActivityLogEntry(objActivity);
                        await objInstrumentUsage.InstrumentUsage('Hardness', strIdsNo, 'tbl_instrumentlog_hardness', '', 'completed');

                        globalData.arrHardnessMT50.findIndex(k => k.Hmi == strHmi) == -1 ?
                            globalData.arrHardnessMT50 :
                            globalData.arrHardnessMT50.splice(globalData.arrHardnessMT50.findIndex(k => k.Hmi == strHmi), 1);

                        globalData.arrWeighmentCounter.findIndex(k => k.Hmi == strHmi) == -1 ?
                            globalData.arrWeighmentCounter :
                            globalData.arrWeighmentCounter.splice(globalData.arrWeighmentCounter.findIndex(k => k.Hmi == strHmi), 1);

                        (globalData.arrCurrentOperationStatus.findIndex((element) => element.Hmi === strHmi)) == -1 ? globalData.arrCurrentOperationStatus :
                            globalData.arrCurrentOperationStatus.splice(globalData.arrCurrentOperationStatus.findIndex((element) => element.Hmi === strHmi), 1);

                        globalData.arrSelectedMenu.findIndex(k => k.Hmi == strHmi) == -1 ?
                            globalData.arrSelectedMenu :
                            globalData.arrSelectedMenu.splice(globalData.arrSelectedMenu.findIndex(k => k.Hmi == strHmi), 1);

                        globalData.formatching.findIndex(k => k.Hmi == strHmi) == -1 ?
                            globalData.formatching :
                            globalData.formatching.splice(globalData.formatching.findIndex(k => k.Hmi == strHmi), 1);

                        globalData.arrPushValuesOfHardness.findIndex(k => k.Hmi == strHmi) == -1 ?
                            globalData.arrPushValuesOfHardness :
                            globalData.arrPushValuesOfHardness.splice(globalData.arrPushValuesOfHardness.findIndex(k => k.Hmi == strHmi), 1);


                        globalData.arrsampleno.findIndex(k => k.Hmi == strHmi) == -1 ?
                            globalData.arrsampleno :
                            globalData.arrsampleno.splice(globalData.arrsampleno.findIndex(k => k.Hmi == strHmi), 1);

                        await models.tbl_powerbackup.destroy({
                            where: {
                                IdsNo: strHmi,
                                Sys_Batch: currentCubical.Sys_Batch
                            }
                        });

                        mqttSender.sendData(strHmi, `${mqttProtocol.TestCompleted} ${Result_remrk}`);

                        //monit
                        await objMonit.monit({
                            case: 'ReportStatus',
                            Hmi: strHmi,
                            data: {
                                message: `${mqttProtocol.Hardness}/Thickness Test Completed`
                            }
                        });
                    }

                    if (currentCubical.Sys_RotaryType == 'Double') {

                        //get last max repNo of side if side is LHS then ask for side
                        //else nothinhg
                        let selectedCub = globalData.arrIdsInfo.find(k => k.Hmi == strHmi).cubicalData;
                        const checkLastSideobj = {
                            strHmi: strHmi,
                            strBatch: currentCubical.Sys_Batch,
                            productName: currentCubical.Sys_ProductName,
                            Sys_CubType: currentCubical.Sys_CubType,
                            reportType: currentCubical.Sys_RptType,
                            strTableName: "tbl_tab_master_htd"
                        }
                        let lastSide = await objCommonInsertOpt.getDoubleLastSide(checkLastSideobj);

                        //    if(Number(sample) == Number(tempCounterObj.counter)){
                        let bulkReceived = globalData.bulkFlag.find(k => k.Hmi == strHmi);
                        tempCounterObj = globalData.arrWeighmentCounter.find(k => k.Hmi == strHmi);
                        var HardnessDetail = globalData.arrWeighmentProductData.find(k => k.Hmi == strHmi);
                        // sample = HardnessDetail.data.MenuDetail.result.noOfSample;
                        if (bulkReceived != undefined || Number(tempCounterObj.counter) === Number(sample)) {

                            if (bulkReceived.bulkFlag || Number(tempCounterObj.counter) === Number(sample)) {

                                await objMonit.monit({
                                    case: 'ReportStatus',
                                    Hmi: strHmi,
                                    data: {
                                        message: response.reportStatus
                                    }
                                });
                                await models.tbl_powerbackup.destroy({
                                    where: {
                                        IdsNo: strHmi,
                                        Sys_Batch: currentCubical.Sys_Batch,
                                        WeighmentName: 'Hardness'
                                    }
                                });
                                // if (lastSide == "LHS") {

                                // Side = "RHS"
                                // mqttSender.sendData(strHmi, `Test Completed`);
                                // mqttSender.sendData(strHmi, `${mqttProtocol.Sideprotocol}${Side}:${mqttProtocol.SideChange}${HardnessDetail.data.Side} ${mqttProtocol.SideChanges} ${Side}`);
                                // } else {
                                await objInstrumentUsage.InstrumentUsage('Hardness', strIdsNo, 'tbl_instrumentlog_hardness', '', 'completed');
                                //monit
                                await objMonit.monit({
                                    case: 'ReportStatus',
                                    Hmi: strHmi,
                                    data: {
                                        message: `${mqttProtocol.Hardness} Test Completed`
                                    }
                                });
                                mqttSender.sendData(strHmi, `${mqttProtocol.TestCompleted} ${Result_remrk}`);

                                // }

                                //setting to false coz on rhs we have to move again
                                let hardnessMasterEntryArr = globalData.HardnessMasterEntry.find(k => k.Hmi == strHmi)
                                hardnessMasterEntryArr.savedToMaster = false;

                                (globalData.arrCurrentOperationStatus.findIndex((element) => element.Hmi === strHmi)) == -1 ? globalData.arrCurrentOperationStatus :
                                    globalData.arrCurrentOperationStatus.splice(globalData.arrCurrentOperationStatus.findIndex((element) => element.Hmi === strHmi), 1);

                                (globalData.arrOutFlagForTest.findIndex((element) => element.Hmi === strHmi)) == -1 ? globalData.arrOutFlagForTest :
                                    globalData.arrOutFlagForTest.splice(globalData.arrOutFlagForTest.findIndex((element) => element.Hmi === strHmi), 1);

                                globalData.DoubSide.findIndex(k => k.Hmi == strHmi) == -1 ? globalData.DoubSide : globalData.DoubSide.splice(globalData.DoubSide.findIndex(k => k.Hmi == strHmi), 1);

                                globalData.arrPushValuesOfHardness.findIndex(k => k.Hmi == strHmi) == -1 ?
                                    globalData.arrPushValuesOfHardness :
                                    globalData.arrPushValuesOfHardness.splice(globalData.arrPushValuesOfHardness.findIndex(k => k.Hmi == strHmi), 1);

                                globalData.arrsampleno.findIndex(k => k.Hmi == strHmi) == -1 ?
                                    globalData.arrsampleno :
                                    globalData.arrsampleno.splice(globalData.arrsampleno.findIndex(k => k.Hmi == strHmi), 1);

                                globalData.arrWeighmentCounter.findIndex(k => k.Hmi == strHmi) == -1 ?
                                    globalData.arrWeighmentCounter :
                                    globalData.arrWeighmentCounter.splice(globalData.arrWeighmentCounter.findIndex(k => k.Hmi == strHmi), 1);

                                globalData.arrSelectedMenu.findIndex(k => k.Hmi == strHmi) == -1 ?
                                    globalData.arrSelectedMenu :
                                    globalData.arrSelectedMenu.splice(globalData.arrSelectedMenu.findIndex(k => k.Hmi == strHmi), 1);

                                globalData.DoubSide.findIndex(k => k.Hmi == strHmi) == -1 ? globalData.DoubSide : globalData.DoubSide.splice(globalData.DoubSide.findIndex(k => k.Hmi == strHmi), 1);

                                globalData.arrHardnessMT50.findIndex(k => k.Hmi == strHmi) == -1 ?
                                    globalData.arrHardnessMT50 :
                                    globalData.arrHardnessMT50.splice(globalData.arrHardnessMT50.findIndex(k => k.Hmi == strHmi), 1);

                                globalData.formatching.findIndex(k => k.Hmi == strHmi) == -1 ?
                                    globalData.formatching :
                                    globalData.formatching.splice(globalData.formatching.findIndex(k => k.Hmi == strHmi), 1);

                            }
                        }
                    }


                    return
                }

            } else {
                console.log('counter mismatch in hardness', sample, "||", tempCounterObj.counter);
            }
        } catch (error) {
            console.log(error)
            throw new Error(error);
        }

    }

    async getSample(strHmi, recSeqNo, repSerNo, totalSample) {
        try {

            // const maxRepNo = await models.tbl_tab_detailhtd_incomplete.findAll({
            //     attributes: [
            //         [sequelize.fn('MAX', sequelize.col('RepSerNo')), "RepSerNo"],

            //     ],
            //     where: {
            //         RepSerNo: repSerNo
            //     }
            // })
            let sampleDone = await models.tbl_tab_detailhtd_incomplete.findAll({
                attributes: [[sequelize.fn('MAX', sequelize.col('RecSeqNo')), "RecSeqNo"],],
                where: {
                    RepSerNo: repSerNo
                }
            })

            console.log(sampleDone)

            sampleDone = sampleDone.map(k => k.RecSeqNo);
            let n = sampleDone.length;
            this.getMissingNo(sampleDone, n, strHmi, totalSample)
            let missingSample = globalData.arrcheckingInCompRepSerNo.find(k => k.Hmi == strHmi);
            return missingSample.values


        } catch (error) {
            console.log(error)
        }
    }


    //only hardness
    async processHardnessDataMT50OnlyHardnessData(dataObjMt50OnlyHardness) {
        try {

            //check for  bulk and single
            let recivedWt = dataObjMt50OnlyHardness.actualWt;
            // if(recivedWt.length > 1){
            //     //bulk
            // }else{
            //     //normal
            // }

            let ProtocolPortNo = dataObjMt50OnlyHardness.ProtocolPortNo;
            let strIdsNo = dataObjMt50OnlyHardness.idsNo;
            let strHmi = dataObjMt50OnlyHardness.Hmi;
            let strMenuName = dataObjMt50OnlyHardness.instrumentType;
            let selectedIdsNo;
            var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.idsNo == strIdsNo);
            if (IPQCObject != undefined) {
                selectedIdsNo = IPQCObject.selectedIds;
            } else {
                selectedIdsNo = strIdsNo;
            }
            let currentCubical = globalData.arrIdsInfo.find(k => k.idsNo == selectedIdsNo).cubicalData;
            //let productDetail = globalData.arrProductTypeArray.find(k => k.idsNo == strIdsNo).productDetail;
            let paramSetOrNot = globalData.arr_limits.find(k => k.idsNo == selectedIdsNo).Menus;

            // let hardness = paramSetOrNot.filter(obj => Object.keys(obj) == 'Hardness');
            let hardness = paramSetOrNot.filter(obj => Object.keys(obj) == 'TBTTST');
            let objHardness = globalData.arrHardnessMT50.find(ht => ht.Hmi == strHmi).obj;
            let tempCounterObj = globalData.arrWeighmentCounter.find(k => k.Hmi == strHmi);
            let thicknessVal = 0, widthVal = 0, diameterVal = 0, hardnessVal = 0;
            let tempUserObject = globalData.arrUsers.find(k => k.Hmi == strHmi);
            const HardnessDetail = globalData.arrWeighmentProductData.find(k => k.Hmi == strHmi);
            let sample = HardnessDetail.data.noOfSample;
            let strSampleNoFromString = '';
            let productObj = globalData.arrIdsInfo.find(k => k.idsNo == strIdsNo).cubicalData;
            let mstTableName = 'tbl_tab_master7_incomplete';
            let DetTableName = 'tbl_tab_detail7_incomplete';
            let mstSerNo;
            let sideNo;
            let repSerNo;
            const objSelMenu = globalData.arrSelectedMenu.find(k => k.idsNo == strIdsNo);
            let objActivity = {};
            let repSeqNo;

            const obj = {
                idsNo: strIdsNo,
                dimensionParam: 0,
                sampleNo: 0,
                HardnessVal: [],
                HardnessDecimal: 0,
                HardnessNom: 0,
                Hardnessrneg: 0,
                Hardnesspos: 0,
                sampleFromString: ""
            };
            globalData.arrHardnessMT50.push(obj);

            /**
             * push counter with strHmi and counter 0
             */
            if (tempCounterObj === undefined) {
                globalData.arrWeighmentCounter.push({
                    Hmi: strHmi,
                    counter: 0
                })
            }

            tempCounterObj = globalData.arrWeighmentCounter.find(k => k.Hmi == strHmi);

            const __parameterHardnessMt50 = {
                strTableName: mstTableName,
                strDetailTbl: DetTableName,
                objProductDetails: HardnessDetail.data,
                uniqueSerialNumber: strIdsNo,
                strBalId: dataObjMt50OnlyHardness.instrumentId,
                ProtocolData: dataObjMt50OnlyHardness.actualWt,
                strHmi: strHmi,
                productType: objSelMenu.selectedProductDetail
            }


            /**
             * remove sample from string 
             */
            if (globalData.arrPushValuesOfHardness.length !== 0) {
                //change logic by vijay
                // let bulksample = globalData.arrPushValuesOfHardness[0].sampleno.map(k => k.split(','))
                // let bulksample = globalData.arrPushValuesOfHardness.split(',');
                let bulksample = globalData.arrPushValuesOfHardness[0].sampleno[0].split('|');
                for (let i = 1; i <= bulksample.length; i++) {
                    // if (recivedWt.includes("N")) {
                    //     hardnessVal = recivedWt[i-1].substring(recivedWt.indexOf("H") + 1, recivedWt.indexOf("N")).trim()
                    // }
                    // else {
                    //     hardnessVal = recivedWt[i-1].substring(recivedWt[i-1].indexOf("H")).split(' ')[1]
                    // }
                    objHardness = globalData.arrHardnessMT50.find(ht => ht.Hmi == strHmi).obj;
                    // obj.HardnessVal.push(hardnessVal)
                    // strSampleNoFromString = recivedWt.substring(1, recivedWt.indexOf(' ')); //to get sample number from string
                    strSampleNoFromString = bulksample[i - 1][0].split('')[1]; //to get sample number from string


                    if (bulksample.filter(k => isNaN(k.split('')[1])).length != 0) {
                        console.log('sample Not found')
                        return mqttSender.sendData(strHmi, `${mqttProtocol.DisplayMessage}Invalid String`);
                    }
                    else {
                        objHardness.sampleFromString = strSampleNoFromString// saving sample no from hardness
                    }
                }
            } else {
                objHardness = globalData.arrHardnessMT50.find(ht => ht.Hmi == strHmi).obj;
                strSampleNoFromString = recivedWt.substring(1, recivedWt.indexOf(' ')); //to get sample number from string
                if (isNaN(strSampleNoFromString) == true) {
                    console.log('sample Not found')
                    return mqttSender.sendData(strHmi, `${mqttProtocol.DisplayMessage}Invalid String`);
                }
                else {
                    objHardness.sampleFromString = strSampleNoFromString// saving sample no from hardness
                }
            }



            // for Hardness with bulk from another port *************************************************************************
            // if (ProtocolPortNo == 2) {
            //check if send from bulk port
            if (globalData.arrPushValuesOfHardness.length !== 0) {
                // let bulksample = globalData.arrPushValuesOfHardness.split(',');
                let bulksample = globalData.arrPushValuesOfHardness[0].sampleno[0].split('|');
                // for (let i = 0; i <= bulksample.length; i++) {
                //     if (bulksample[i].includes('H') && hardness.length != undefined) {
                //         if (bulksample[i].includes("N")) {
                //             hardnessVal = bulksample[i].substring(bulksample[i].indexOf("H") + 1, bulksample[i].indexOf("N")).trim()
                //         }
                //         else {
                //             hardnessVal = bulksample[i].substring(bulksample[i].indexOf("H") + 1, bulksample[i].indexOf("Kp")).trim()
                //         }

                //         if (isNaN(hardnessVal) == false) {// if the received value is valid value
                //             objHardness.HardnessVal = hardnessVal;
                //             objHardness.HardnessDecimal = this.precision(Number(hardnessVal));
                //             objHardness.sampleNo = strSampleNoFromString
                //         }
                //         else {
                //             objHardness.HardnessVal = 0;
                //             objHardness.HardnessDecimal = 0;
                //         }
                //     }
                //     else {
                //         objHardness.HardnessVal = 0;
                //         objHardness.HardnessDecimal = 0;
                //         objHardness.sampleNo = strSampleNoFromString
                //     }
                // }
            } else {
                if (recivedWt.includes('H') && hardness.length != undefined) {
                    if (recivedWt.includes("N")) {
                        hardnessVal = recivedWt.substring(recivedWt.indexOf("H") + 1, recivedWt.indexOf("N")).trim()
                    }
                    else {
                        hardnessVal = recivedWt.substring(recivedWt.indexOf("H") + 1, recivedWt.indexOf("kp")).trim()
                    }

                    if (isNaN(hardnessVal) == false) {// if the received value is valid value
                        objHardness.HardnessVal = hardnessVal;
                        objHardness.HardnessDecimal = this.precision(Number(hardnessVal));
                        objHardness.sampleNo = strSampleNoFromString
                    }
                    else {
                        objHardness.HardnessVal = 0;
                        objHardness.HardnessDecimal = 0;
                    }
                }
                else {
                    objHardness.HardnessVal = 0;
                    objHardness.HardnessDecimal = 0;
                    objHardness.sampleNo = strSampleNoFromString
                }
            }
            // }


            /*********************************************************************************** */

            //this will check if sample is came directly as 2 OR  sample came directly as eual to QTY  (doubt)

            var side = "NA";
            if (productObj.Sys_RotaryType == "Single") {
                side = "NA";
            }
            else {
                side = HardnessDetail.data.Side == "L" ? "LHS" : "RHS"; //matching side with HardnessDetail which is feel on menu.
            }

            if (Number(sample) >= tempCounterObj.counter) {
                tempCounterObj.counter += 1;
                console.log(globalData.formatching);




                //master
                if (tempCounterObj.counter == 1 && objHardness.sampleFromString == 1) {

                    if (productObj.Sys_RptType == 1) {//for Initial 
                        mstSerNo = 1
                        sideNo = 1
                    } else { //regular
                        let objMt50 = {
                            tableName: mstTableName,
                            ReportType: 0,
                            Side: side,
                            BFGCode: productObj.Sys_BFGCode,
                            ProductName: productObj.Sys_ProductName,
                            PVersion: productObj.Sys_PVersion,
                            Version: productObj.Sys_Version,
                            BatchNo: productObj.Sys_Batch,
                            // IdsNo: strIdsNo
                            IdsNo: strHmi
                        }


                        if (side == 'NA') {
                            mstSerNo = await objGetMstSrAndSideSr.getRegularLRMstSerialNo(objMt50);
                            sideNo = await objGetMstSrAndSideSr.getRegularLRSideNo(objMt50);
                            if (sideNo < 10) {
                                sideNo = sideNo + 1;
                            }
                            else {
                                sideNo = 1;
                                mstSerNo = mstSerNo + 1;
                            }
                        }
                        else {
                            mstSerNo = await objGetMstSrAndSideSr.getRegularLRMstSerialNo(objMt50);
                            sideNo = await objGetMstSrAndSideSr.getRegularLRSideNo(objMt50);
                            if (sideNo < 5) {
                                sideNo = sideNo + 1;
                            }
                            else {
                                sideNo = 1;
                                mstSerNo = mstSerNo + 1;
                            }
                        }
                    }
                    var res = await proObj.productData(productObj)
                    let now = new Date();
                    var LimitOn = await models.tbl_product_tablet.findAll({
                        where: {
                            ProductId: productMaster.productType.ProductId,
                            ProductName: productMaster.productType.ProductName,
                            ProductVersion: productMaster.productType.ProductVersion
                        }
                    })

                    const insertIncompleteObj = await models.tbl_tab_master_htd_incomplete.create({
                        MstSerNo: mstSerNo,
                        WgmtModeNo: 7,
                        Area: productObj.Sys_Area,
                        CubicalNo: productObj.Sys_CubicNo,
                        CubicleType: productObj.Sys_CubType,
                        CubicleName: productObj.Sys_CubicName,
                        Dept: productObj.Sys_dept,
                        BMRNo: productObj.Sys_BMRNo,
                        BatchNo: productObj.Sys_Batch,
                        BFGCode: productObj.Sys_BFGCode,
                        ProductName: productObj.Sys_ProductName,
                        PVersion: productObj.Sys_PVersion,
                        Version: productObj.Sys_Version,
                        ProductType: res[0].ProductType,
                        MachineCode: productObj.Sys_MachineCode,
                        BatchSize: `${productObj.Sys_BatchSize} ${productObj.Sys_BatchSizeUnit}`,
                        Qty: HardnessDetail.data.noOfSample,
                        GrpQty: 0,
                        GrpFreq: 0,
                        Idsno: strHmi,
                        InsturmentID: 3,
                        UserId: tempUserObject.UserId,
                        UserName: tempUserObject.UserName,
                        PrDate: date.format(now, 'YYYY-MM-DD'),
                        PrTime: date.format(now, 'HH:mm:ss'),
                        Side: side,
                        Unit: res[1]['Param7_Unit'],
                        DP: res[1]['Param7_Dp'],
                        NomHard: "Hrdnom",
                        NomThick: "NomThick",
                        // T1NegTolHard:,
                        // T1PosTolHard:,
                        // T2NegTolHard:,
                        // T2PosTolHard:,
                        // T1NegTolThick:,
                        // T1PosTolThick:,
                        LimitOn: res[1]['Param7_LimitOn'].readUIntLE(),
                        T1NMT: LimitOn[0].Param7_NMTTab,
                        GraphType: res[1]['Param7_IsOnStd'].readUIntLE(),
                        ReportType: productObj.Sys_RptType,
                        SideNo: sideNo,


                        BalanceId: currentCubical.Sys_BalID,
                        //{ str_colName: 'BalanceNo: productObj.Sys_BalID,
                        VernierId: currentCubical.Sys_VernierID,
                        //{ str_colName: 'VernierNo: productObj.Sys_BalID,

                        // UserId: tempUserObject.UserId,
                        // UserName: tempUserObject.UserName,

                        Nom: res[1]['Param7_Nom'],
                        T1NegTol: res[1]['Param7_T1Neg'],
                        T1PosTol: res[1]['Param7_T1Pos'],
                        // { str_colName: 'T2NegTol: res[1][paramT2Neg],
                        // { str_colName: 'T2PosTol: res[1][paramT2Pos],

                        // { str_colName: 'T1NMTTab: 0,
                        // { str_colName: 'T1NegEmpty: ,
                        // { str_colName: 'T1PosEmpty: ,
                        // { str_colName: 'T2NegEmpty: ,
                        // { str_colName: 'T2PosEmpty: ,
                        // { str_colName: 'NomNet: ,
                        // { str_colName: 'T1NegNet: ,
                        // { str_colName: 'T1PosNet: ,
                        // { str_colName: 'T2NegNet: ,
                        // { str_colName: 'T2PosNet: ,



                        MFGCode: productObj.Sys_MfgCode,
                        FriabilityID: currentCubical.Sys_FriabID,
                        HardnessID: currentCubical.Sys_HardID,


                        // RepoLabel10: res[0].NominalNomenclature,
                        // RepoLabel11: productObj.Sys_Validation, // this will store wether the test is validation or not 
                        // { str_colName: 'RepoLabel12: ,

                        PrintNo: 0,
                        IsArchived: 0,

                        BatchComplete: 0,

                        Lot: 'NA',//objLotData.LotNo 

                        AppearanceDesc: productObj.Sys_Appearance,
                        MachineSpeed_Min: productObj.Sys_MachineSpeed_Min,
                        MachineSpeed_Max: productObj.Sys_MachineSpeed_Max,
                        GenericName: productObj.Sys_GenericName,


                    });
                    //await objPowerBackup.getStatusoFTestForPowerBackup(powerbackupobj);

                    var lastInsertedID = insertIncompleteObj._previousDataValues.RepSerNo;

                    /**
                     * Instrument log need to check 
                     */
                    // await objInstrumentUsage.InstrumentUsage('Hardness', strIdsNo, 'tbl_instrumentlog_hardness', 'Hardness', 'started')


                    //objHardness.masterId = masterRes[0].insertId;



                }


                if (tempCounterObj.counter == 1 && objHardness.sampleFromString == 1) {
                    repSerNo = lastInsertedID;
                    //repSeqNo = await objCommonInsertOpt.lastInsertedSeqNo('tbl_tab_detail7', 1);
                } else {
                    repSerNo = await objCommonInsertOpt.lastInsertedRecords(productObj.Sys_ProductName, productObj.Sys_BFGCode,
                        productObj.Sys_PVersion, productObj.Sys_Version, productObj.Sys_Batch, 'tbl_tab_master7');

                    // repSeqNo = await objCommonInsertOpt.lastInsertedSeqNo('tbl_tab_detail7', repSerNo);
                    // if (repSeqNo == 1) {
                    //     repSeqNo = +1;
                    // }
                }

                //check if data coming from mqtt and if sample count is 1 then normal insert or make a for loop for 
                //inserting data when its come from port 2
                // for (let i = 0; i <= sample; i++) {

                //vijay @7/9/21

                //
                // if (ProtocolPortNo == 2) {
                if (globalData.arrPushValuesOfHardness.length !== 0) {
                    let bulksample = globalData.arrPushValuesOfHardness[0].sampleno[0].split('|');
                    tempCounterObj.counter--
                    //check missing sample and insert
                    let missingSamples = globalData.arrcheckingInCompRepSerNo
                    bulksample = missingSamples.map(missingSample => bulksample.filter(k => k.includes(`@${missingSample}`)))
                    for (let i = 1; i <= bulksample.length; i++) {
                        if (bulksample[i - 1][0].includes("N")) {
                            objHardness.HardnessVal = bulksample[i - 1][0].substring(bulksample[i - 1][0].indexOf("H") + 1, bulksample[i - 1][0].indexOf("N")).trim()
                        }
                        else {
                            objHardness.HardnessVal = bulksample[i - 1][0].substring(bulksample[i - 1][0].indexOf("H") + 1, bulksample[i - 1][0].indexOf("kp")).trim()
                        }
                        tempCounterObj.counter++
                        await models[DetTableName].create({
                            RepSerNo: repSerNo,
                            MstSerNo: 0,
                            RecSeqNo: bulksample[i - 1][0].split('')[1],
                            DataValue: parseFloat(objHardness.HardnessVal) == 0 ? 0 : parseFloat(objHardness.HardnessVal),
                            DecimalPoint: objHardness.HardnessDecimal == 0 ? 0 : objHardness.HardnessDecimal
                        });
                    }
                } else {
                    await models[DetTableName].create({
                        RepSerNo: repSerNo,
                        MstSerNo: 0,
                        RecSeqNo: strSampleNoFromString,
                        DataValue: parseFloat(objHardness.HardnessVal) == 0 ? 0 : parseFloat(objHardness.HardnessVal),
                        DecimalPoint: objHardness.HardnessDecimal == 0 ? 0 : objHardness.HardnessDecimal
                    });
                }
                // }



                // }
                // globalData.formatching.push(strSampleNoFromString);
                //var incompRepSerNo = await objPowerBackup.updateTestCount(objSelMenu, powerbackupobj, tableName);

                // objHardness.DiameterVal == 0 ? 0 : objHardness.DiameterVal;
                objHardness.HardnessVal == 0 ? 0 : objHardness.HardnessVal;
                objHardness.thicknessVal == 0 ? 0 : objHardness.thicknessVal;
                // objHardness.WidthVal == 0 ? 0 : objHardness.WidthVal;

                // mqttSender.sendData(strHmi, `${mqttProtocol.DisplayResult}Diameter:${parseFloat(objHardness.DiameterVal)};
                // Hardness:${parseFloat(objHardness.HardnessVal)} ; Thickness:${parseFloat(objHardness.thicknessVal)} ;
                // Width:${parseFloat(objHardness.WidthVal)}`);
                mqttSender.sendData(strHmi, `${mqttProtocol.DisplayResult}Hardness:${tempCounterObj.counter}:${parseFloat(objHardness.HardnessVal)} N`);


                //  if (tempCounterObj.counter == sample && objHardness.sampleFromString == sample) {
                let compCount;
                if (Number(objHardness.sampleFromString) == Number(sample)) {
                    if (Number(tempCounterObj.counter) !== Number(sample)) {
                        //check sample count with db if count match then move or send msg to ids with unsend wt

                        //incomplete arr 
                        let _arrcheckingCompRepSerNo = globalData.formatching;
                        let n = _arrcheckingCompRepSerNo.length;

                        //check missing count with sample
                        this.getMissingNo(_arrcheckingCompRepSerNo, n)

                        //globalData.arrcheckingInCompRepSerNo
                        console.log(`${globalData.arrcheckingInCompRepSerNo.join()}some wt are pending and send pending wt to ids`);
                    }
                }

                let compSampleForComplete = globalData.formatching.length;

                //moving data to complete table
                // if (Number(compSampleForComplete) === Number(sample)) {
                if (Number(tempCounterObj.counter) === Number(sample)) {
                    let result = await objIncompleteReport.getIncomepleteData(__parameterHardnessMt50, 'tbl_tab_master7', 'tbl_tab_detail7', strHmi);
                    var remarkRes = await objSaveCompleteHardness.saveHardnessData8M(result, repSerNo, strIdsNo, strHmi, 'tbl_tab_master7');
                    await objCommonInsertOpt.updateEndDate(strIdsNo, strHmi, mstTableName);
                    //  await objBatchSummary.saveBatchDataHardness(result.incompleteData, result.detailData, strIdsNo , strHmi);

                    /**
                     * delete from powerbackup
                     */
                    // await models.tbl_powerbackup.destroy({
                    //     where: {
                    //         IdsNo: strHmi, //chnage done by sunil
                    //         Sys_Batch: currentCubical.Sys_Batch
                    //     }
                    // })

                    // Object.assign(objActivity,
                    //     { strUserId: tempUserObject.UserId },
                    //     { strUserName: tempUserObject.UserName },
                    //     { activity: 'Hardness Weighment Completed on IDS ' + strHmi });
                    // await objActivityLog.ActivityLogEntry(objActivity);
                    // await objInstrumentUsage.InstrumentUsage('Hardness', strIdsNo, 'tbl_instrumentlog_hardness', '', 'completed');
                    // globalData.arrHardnessMT50.find(ht => ht.Hmi== strHmi).obj;
                    globalData.arrHardnessMT50.findIndex(k => k.Hmi == strHmi) == -1 ?
                        globalData.arrHardnessMT50 :
                        globalData.arrHardnessMT50.splice(globalData.arrHardnessMT50.findIndex(k => k.Hmi == strHmi), 1);

                    globalData.arrWeighmentCounter.findIndex(k => k.Hmi == strHmi) == -1 ?
                        globalData.arrWeighmentCounter :
                        globalData.arrWeighmentCounter.splice(globalData.arrWeighmentCounter.findIndex(k => k.Hmi == strHmi), 1);

                    (globalData.arrCurrentOperationStatus.findIndex((element) => element.Hmi === strHmi)) == -1 ? globalData.arrCurrentOperationStatus :
                        globalData.arrCurrentOperationStatus.splice(globalData.arrCurrentOperationStatus.findIndex((element) => element.Hmi === strHmi), 1);
                    //test splice if rotarty is not double
                    globalData.arrSelectedMenu.findIndex(k => k.Hmi == strHmi) == -1 ?
                        globalData.arrSelectedMenu :
                        globalData.arrSelectedMenu.splice(globalData.arrSelectedMenu.findIndex(k => k.Hmi == strHmi), 1);
                    return mqttSender.sendData(strHmi, `${mqttProtocol.TestCompleted}Hardness test Completed`);
                }

            }
        } catch (error) {
            throw new Error(error);
        }


    }


    getMissingNo(arr, N, strHmi, totalSample) {

        // Initialize diff
        let diff = arr[0] - 0;
        let missingSampleArr = globalData.arrcheckingInCompRepSerNo.find(k => k.Hmi == strHmi);
        let tempArr = []
        //logic to calculate missing sample 

        for (let i = 1; i <= totalSample; i++) {

            if (!(arr.some(k => k == i))) {
                tempArr.push(i)
            }
        }
        missingSampleArr = globalData.arrcheckingInCompRepSerNo.find(k => k.Hmi == strHmi);
        if (missingSampleArr == undefined) {
            globalData.arrcheckingInCompRepSerNo.push({
                Hmi: strHmi,
                values: tempArr
            });
        } else {
            missingSampleArr.values = tempArr
        }


        // for (let i = 0; i < N; i++) {

        //     // Check if diff and arr[i]-i
        //     // both are equal or not
        //     if (arr[i] - i != diff) {

        //         // Loop for consecutive
        //         // missing elements
        //         while (diff < arr[i] - i) {
        //             missingSampleArr = globalData.arrcheckingInCompRepSerNo.find(k => k.Hmi == strHmi);
        //             if (missingSampleArr == undefined) {
        //                 globalData.arrcheckingInCompRepSerNo.push({
        //                     Hmi: strHmi,
        //                     values: [(i + diff)]
        //                 });
        //             } else {
        //                 missingSampleArr.values.push((i + diff))
        //             }

        //             // console.log( + " ");
        //             diff++;
        //         }
        //     }
        // }
        missingSampleArr = globalData.arrcheckingInCompRepSerNo.find(k => k.Hmi == strHmi);

        return missingSampleArr.values.length;
    }


    //mT50 direct
    async processHardnessMT50HTOHR(dataObjMT50HTOHR) {
        let tempRecivedWt = dataObjMT50HTOHR.actualWt;
        let strIdsNo = dataObjMT50HTOHR.idsNo;
        let strHmi = dataObjMT50HTOHR.Hmi;
        let strMenuName = dataObjMT50HTOHR.instrumentType;
        let currentCubical = globalData.arrIdsInfo.find(k => k.idsNo == strIdsNo).cubicalData;
        let selectedIdsNo;
        var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.idsNo == strIdsNo);
        if (IPQCObject != undefined) {
            selectedIdsNo = IPQCObject.selectedIds;
        } else {
            selectedIdsNo = strIdsNo;
        }

        let productDetail = globalData.arrProductTypeArray.find(k => k.idsNo == selectedIdsNo).productDetail;
        // let objHardness = globalData.arrHardnessMT50.find(ht => ht.Hmi== strHmi).obj;
        let tempCounterObj = globalData.arrWeighmentCounter.find(k => k.Hmi == strHmi);
        let tempUserObject = globalData.arrUsers.find(k => k.Hmi == strHmi);
        const HardnessDetail = globalData.arrWeighmentProductData.find(k => k.Hmi == strHmi);
        let sample = HardnessDetail.data.noOfSample;
        let strSampleNoFromString = '';
        let productObj = globalData.arrIdsInfo.find(k => k.idsNo == selectedIdsNo).cubicalData;
        let mstSerNo;
        let sideNo;
        let repSerNo;
        const objSelMenu = globalData.arrSelectedMenu.find(k => k.idsNo == strIdsNo);
        let mstTableName = 'tbl_tab_master7_incomplete'
        let DetTableName = 'tbl_tab_detail7_incomplete'
        let arrOfDisplayData = [];
        // const objSelMenu = globalData.arrSelectedMenu.find(k => k.idsNo == strIdsNo).selectedProductDetail;

        let objActivity = {};
        if (tempCounterObj === undefined) {
            globalData.arrWeighmentCounter.push({
                Hmi: strHmi,
                counter: 0
            })
        }

        tempCounterObj = globalData.arrWeighmentCounter.find(k => k.Hmi == strHmi);
        var side = "NA";
        if (productObj.Sys_RotaryType == "Single") {
            side = "NA";
        }
        else {
            side = HardnessDetail.data.Side == "LHS" ? "LHS" : "RHS";
        }

        if (Number(sample) >= tempCounterObj.counter) {
            tempCounterObj.counter += 1;

            let tableName = "tbl_powerbackup";
            var powerbackupobj = {
                strTableName: mstTableName,
                strDetailTbl: DetTableName,
                cubicaNo: currentCubical.Sys_CubicNo,
                cubicType: currentCubical.Sys_CubType,
                cubicSysBFGcode: currentCubical.Sys_BFGCode,
                cubicBatch: currentCubical.Sys_Batch,
                menuName: HardnessDetail.data.menuName,
                productType: objSelMenu.selectedProductDetail.ProductType,
                Userid: tempUserObject.UserId,
                idsNo: strIdsNo,
                Hmi: strHmi,
                Incomp_RepSerNo: tempCounterObj.counter

            }


            //powerBackupSunil 
            let _check_combination = await objPowerBackup._check_combination_pow(objSelMenu, powerbackupobj, tableName);
            if (_check_combination !== undefined) {
                tempCounterObj.counter = _check_combination.RecSampleNo + 1;
            }

            if (tempCounterObj.counter == 1) {

                if (productObj.Sys_RptType == 1) {//for Initial 
                    mstSerNo = 1
                    sideNo = 1
                } else { //regular
                    let objMt50 = {
                        tableName: mstTableName,
                        ReportType: 0,
                        Side: side,
                        BFGCode: productObj.Sys_BFGCode,
                        ProductName: productObj.Sys_ProductName,
                        PVersion: productObj.Sys_PVersion,
                        Version: productObj.Sys_Version,
                        BatchNo: productObj.Sys_Batch,
                        IdsNo: strHmi
                    }


                    if (side == 'NA') {
                        mstSerNo = await objGetMstSrAndSideSr.getRegularLRMstSerialNo(objMt50);
                        sideNo = await objGetMstSrAndSideSr.getRegularLRSideNo(objMt50);
                        if (sideNo < 10) {
                            sideNo = sideNo + 1;
                        }
                        else {
                            sideNo = 1;
                            mstSerNo = mstSerNo + 1;
                        }
                    }
                    else {
                        mstSerNo = await objGetMstSrAndSideSr.getRegularLRMstSerialNo(objMt50);
                        sideNo = await objGetMstSrAndSideSr.getRegularLRSideNo(objMt50);
                        if (sideNo < 5) {
                            sideNo = sideNo + 1;
                        }
                        else {
                            sideNo = 1;
                            mstSerNo = mstSerNo + 1;
                        }
                    }
                }

                //insert data
                let now = new Date();
                var res = await proObj.productData(productObj);



                const insertIncompleteObj = await models['tbl_tab_master7_incomplete'].create({
                    MstSerNo: mstSerNo,
                    SideNo: sideNo,
                    InstruId: 3,
                    BFGCode: productObj.Sys_BFGCode,
                    ProductName: productObj.Sys_ProductName,
                    ProductType: res[0].ProductType,
                    Qty: HardnessDetail.data.noOfSample,
                    GrpQty: 0,
                    GrpFreq: 0,
                    Idsno: strHmi,
                    CubicalNo: productObj.Sys_CubicNo,
                    BalanceId: currentCubical.Sys_BalID,
                    //{ str_colName: 'BalanceNo: productObj.Sys_BalID ,
                    VernierId: currentCubical.Sys_VernierID,
                    //{ str_colName: 'VernierNo: productObj.Sys_BalID ,
                    BatchNo: productObj.Sys_Batch,
                    UserId: tempUserObject.UserId,
                    UserName: tempUserObject.UserName,
                    PrDate: date.format(now, 'YYYY-MM-DD'),
                    PrTime: date.format(now, 'HH:mm:ss'),
                    Side: side,
                    Unit: res[1]['Param7_Unit'],
                    DecimalPoint: res[1]['Param7_Dp'],
                    WgmtModeNo: 7,
                    Nom: res[1]['Param7_Nom'],
                    T1NegTol: res[1]['Param7_T1Neg'],
                    T1PosTol: res[1]['Param7_T1Pos'],
                    //T2NegTol: res[1][paramT2Neg] ,
                    //T2PosTol: res[1][paramT2Pos] ,
                    limitOn: res[1]['Param7_LimitOn'].readUIntLE(),
                    //T1NMTTab: 0 ,
                    //T1NegEmpty:  ,
                    //T1PosEmpty:  ,
                    //T2NegEmpty:  ,
                    //T2PosEmpty:  ,
                    //NomNet:  ,
                    //T1NegNet:  ,
                    //T1PosNet:  ,
                    //T2NegNet:  ,
                    //T2PosNet:  ,
                    CubicleType: productObj.Sys_CubType,
                    ReportType: productObj.Sys_RptType,
                    MachineCode: productObj.Sys_MachineCode,
                    MFGCode: productObj.Sys_MfgCode,
                    BatchSize: `${productObj.Sys_BatchSize} ${productObj.Sys_BatchSizeUnit}`,
                    FriabilityID: currentCubical.Sys_FriabID,
                    HardnessID: currentCubical.Sys_HardID,
                    CubicleName: productObj.Sys_CubicName,
                    CubicleLocation: productObj.Sys_dept,
                    RepoLabel10: res[0].NominalNomenclature,
                    RepoLabel11: productObj.Sys_Validation, // this will store wether the test is validation or not 
                    //RepoLabel12:  ,
                    RepoLabel14: productObj.Sys_IPQCType,
                    PrintNo: 0,
                    IsArchived: 0,
                    GraphType: res[1]['Param7_IsOnStd'].readUIntLE(),
                    BatchComplete: 0,
                    PVersion: productObj.Sys_PVersion,
                    Version: productObj.Sys_Version,
                    Lot: 'NA',//objLotData.LotNo 
                    Area: productObj.Sys_Area,
                    AppearanceDesc: productObj.Sys_Appearance,
                    MachineSpeed_Min: productObj.Sys_MachineSpeed_Min,
                    MachineSpeed_Max: productObj.Sys_MachineSpeed_Max,
                    GenericName: productObj.Sys_GenericName,
                    BMRNo: productObj.Sys_BMRNo,
                });
                // console.log(insertIncompleteObj)
                var masterRes = insertIncompleteObj._previousDataValues.RepSerNo;
                Object.assign(objActivity,
                    { strUserId: tempUserObject.UserId },
                    { strUserName: tempUserObject.UserName },
                    { activity: 'Hardness Weighment Started on IDS' + strIdsNo });
                await objActivityLog.ActivityLogEntry(objActivity);
                var lastInsertedID = insertIncompleteObj._previousDataValues.RepSerNo;
                /**
                   * Instrument log
                   */
                await objInstrumentUsage.InstrumentUsage('Hardness', strIdsNo, 'tbl_instrumentlog_hardness', 'Hardness', 'started')
            }

            for (let i = 0; i < tempRecivedWt.length; i++) {
                i == 0 ? 0 : tempCounterObj.counter += 1;
                repSerNo = await objCommonInsertOpt.lastInsertedRecords(productObj.Sys_ProductName, productObj.Sys_BFGCode,
                    productObj.Sys_PVersion, productObj.Sys_Version, productObj.Sys_Batch, 'tbl_tab_master7');

                const detailObj = await models['tbl_tab_detail7_incomplete'].create({
                    RepSerNo: repSerNo,
                    MstSerNo: 0,
                    RecSeqNo: tempRecivedWt[i].datavalue[0].trim(),
                    DataValue: tempRecivedWt[i].datavalue[1].trim(),
                    DecimalPoint: this.precision(Number(tempRecivedWt[i].datavalue[1].trim())),
                });


                var incompRepSerNo = await objPowerBackup.updateTestCount(objSelMenu, powerbackupobj, tableName);
                mqttSender.sendData(strHmi, `${mqttProtocol.DisplayResult}${tempRecivedWt[i].datavalue[0].trim()}:${tempRecivedWt[i].datavalue[1].trim()} ${res[1]['Param7_Unit']}`)


            }

            if (Number(sample) == tempCounterObj.counter) {
                var remarkRes = await objSaveCompleteHardness.saveHardnessData8M(repSerNo, strIdsNo);
                let objActivity = {};
                await objInstrumentUsage.InstrumentUsage('Hardness', strIdsNo, 'tbl_instrumentlog_hardness', '', 'completed');
                Object.assign(objActivity,
                    { strUserId: tempUserObject.UserId },
                    { strUserName: tempUserObject.UserName },
                    { activity: 'Hardness Weighment Completed on IDS' + strIdsNo });
                await objActivityLog.ActivityLogEntry(objActivity);
                let rptMsg;
                if (remarkRes == "Complies") {
                    rptMsg = "Report Generated Within limit";
                } else {
                    rptMsg = "Report Generated WithOut limit";
                }

                globalData.arrHardnessMT50.findIndex(k => k.Hmi == strHmi) == -1 ?
                    globalData.arrHardnessMT50 :
                    globalData.arrHardnessMT50.splice(globalData.arrHardnessMT50.findIndex(k => k.Hmi == strHmi), 1);

                globalData.arrWeighmentCounter.findIndex(k => k.Hmi == strHmi) == -1 ?
                    globalData.arrWeighmentCounter :
                    globalData.arrWeighmentCounter.splice(globalData.arrWeighmentCounter.findIndex(k => k.Hmi == strHmi), 1);

                (globalData.arrCurrentOperationStatus.findIndex((element) => element.Hmi === strHmi)) == -1 ? globalData.arrCurrentOperationStatus :
                    globalData.arrCurrentOperationStatus.splice(globalData.arrCurrentOperationStatus.findIndex((element) => element.Hmi === strHmi), 1);
                //test splice if rotarty is not double
                globalData.arrSelectedMenu.findIndex(k => k.Hmi == strHmi) == -1 ?
                    globalData.arrSelectedMenu :
                    globalData.arrSelectedMenu.splice(globalData.arrSelectedMenu.findIndex(k => k.Hmi == strHmi), 1);

                mqttSender.sendData(strHmi, `${mqttProtocol.DisplayMessage}${rptMsg}`);
                mqttSender.sendData(strHmi, `${mqttProtocol.TestCompleted}Hardness Test Completed`);

            }


        }
        //console.log(dataObjMT50HTOHR);


    }


    async processHardnessDrSchleuniger(dataObjDrSchleuniger) {
        let recivedWt = dataObjDrSchleuniger.actualWt;
        let strIdsNo = dataObjDrSchleuniger.idsNo;
        let strHmi = dataObjDrSchleuniger.Hmi;
        var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.idsNo == strIdsNo);
        // var objLotData = globalData.arrLot.find(k => k.idsNo == IdsNo);

        var objProductType = globalData.arrProductTypeArray.find(k => k.idsNo == strIdsNo).productType;
        var selectedIds;
        if (IPQCObject != undefined) {
            selectedIds = IPQCObject.selectedIds;
        } else {
            selectedIds = strIdsNo;
        }
        var currentCubicalObj = globalData.arrIdsInfo.find(k => k.idsNo == strIdsNo).cubicalData;
        var productObj = globalData.arrIdsInfo.find(k => k.idsNo == selectedIds).cubicalData;
        const tempUserObject = globalData.arrUsers.find(k => k.Hmi == strHmi);
        // var objHardness = globalData.arrHardnessDRSCPharmatron.find(ht => ht.idsNo == strIdsNo);
        var menuDetail = globalData.arr_limits.find(al => al.idsNo == strIdsNo);
        let productlimits = menuDetail.Menus.filter(obj => Object.keys(obj) == "Hardness")[0]['Hardness'];
        let now = new Date();


        var res = await proObj.productData(productObj);
        //var objArrLimits = globalData.arrIdsInfo.find(k => k.idsNo == IdsNo);
        var side = "NA";
        if (productObj.Sys_RotaryType == "Single") {
            side = "NA";
        }
        else {
            side = HardnessDetail.data.Side == "L" ? "LHS" : "RHS";
        }


        const insertIncompleteObj = {
            str_tableName: 'tbl_tab_master7_incomplete',
            data: [
                { str_colName: 'MstSerNo', value: 1 },
                { str_colName: 'InstruId', value: 3 },
                { str_colName: 'BFGCode', value: productObj.Sys_BFGCode },
                { str_colName: 'ProductName', value: productObj.Sys_ProductName },
                { str_colName: 'ProductType', value: objProductType.ProductType },
                { str_colName: 'Qty', value: productlimits.noOfSamples },
                { str_colName: 'GrpQty', value: 0 },
                { str_colName: 'GrpFreq', value: 0 },
                { str_colName: 'Idsno', value: strIdsNo },
                { str_colName: 'CubicalNo', value: productObj.Sys_CubicNo },
                { str_colName: 'BalanceId', value: currentCubicalObj.Sys_BalID },
                //{ str_colName: 'BalanceNo', value: productObj.Sys_BalID },
                { str_colName: 'VernierId', value: currentCubicalObj.Sys_VernierID },
                //{ str_colName: 'VernierNo', value: productObj.Sys_BalID },
                { str_colName: 'BatchNo', value: productObj.Sys_Batch },
                { str_colName: 'UserId', value: tempUserObject.UserId },
                { str_colName: 'UserName', value: tempUserObject.UserName },
                { str_colName: 'PrDate', value: date.format(now, 'YYYY-MM-DD') },
                { str_colName: 'PrTime', value: date.format(now, 'HH:mm:ss') },
                { str_colName: 'Side', value: side },
                { str_colName: 'Unit', value: res[1]['Param7_Unit'] },
                { str_colName: 'DecimalPoint', value: res[1]['Param7_Dp'] },
                { str_colName: 'WgmtModeNo', value: 7 },
                { str_colName: 'Nom', value: res[1]['Param7_Nom'] },
                { str_colName: 'T1NegTol', value: res[1]['Param7_T1Neg'] },
                { str_colName: 'T1PosTol', value: res[1]['Param7_T1Pos'] },
                // { str_colName: 'T2NegTol', value: res[1][paramT2Neg] },
                // { str_colName: 'T2PosTol', value: res[1][paramT2Pos] },
                { str_colName: 'limitOn', value: res[1]['Param7_LimitOn'].readUIntLE() },
                // { str_colName: 'T1NMTTab', value: 0 },
                // { str_colName: 'T1NegEmpty', value:  },
                // { str_colName: 'T1PosEmpty', value:  },
                // { str_colName: 'T2NegEmpty', value:  },
                // { str_colName: 'T2PosEmpty', value:  },
                // { str_colName: 'NomNet', value:  },
                // { str_colName: 'T1NegNet', value:  },
                // { str_colName: 'T1PosNet', value:  },
                // { str_colName: 'T2NegNet', value:  },
                // { str_colName: 'T2PosNet', value:  },
                { str_colName: 'CubicleType', value: productObj.Sys_CubType },
                { str_colName: 'ReportType', value: productObj.Sys_RptType },
                { str_colName: 'MachineCode', value: productObj.Sys_MachineCode },
                { str_colName: 'MFGCode', value: productObj.Sys_MfgCode },
                { str_colName: 'BatchSize', value: `${productObj.Sys_BatchSize} ${productObj.Sys_BatchSizeUnit}` },
                { str_colName: 'FriabilityID', value: currentCubicalObj.Sys_FriabID },
                { str_colName: 'HardnessID', value: currentCubicalObj.Sys_HardID },
                { str_colName: 'CubicleName', value: productObj.Sys_CubicName },
                { str_colName: 'CubicleLocation', value: productObj.Sys_dept },
                { str_colName: 'RepoLabel10', value: res[0].NominalNomenclature },
                { str_colName: 'RepoLabel11', value: productObj.Sys_Validation }, // this will store wether the test is validation or not 
                // { str_colName: 'RepoLabel12', value:  },
                // { str_colName: 'RepoLabel13', value:  },
                { str_colName: 'PrintNo', value: 0 },
                { str_colName: 'IsArchived', value: 0 },
                { str_colName: 'GraphType', value: res[1]['Param7_IsOnStd'].readUIntLE() },
                { str_colName: 'BatchComplete', value: 0 },
                { str_colName: 'PVersion', value: productObj.Sys_PVersion },
                { str_colName: 'Version', value: productObj.Sys_Version },
                { str_colName: 'Lot', value: 'NA' }, //objLotData.LotNo
                { str_colName: 'Area', value: productObj.Sys_Area },
                { str_colName: 'AppearanceDesc', value: productObj.Sys_Appearance },
                { str_colName: 'MachineSpeed_Min', value: productObj.Sys_MachineSpeed_Min },
                { str_colName: 'MachineSpeed_Max', value: productObj.Sys_MachineSpeed_Max },
                { str_colName: 'GenericName', value: productObj.Sys_GenericName },
                { str_colName: 'BMRNo', value: productObj.Sys_BMRNo },
            ]

        }
        console.log(insertIncompleteObj)
        var masterRes = await database.save(insertIncompleteObj);
        var lastInsertedID = masterRes[0].insertId;
        let objActivity = {};
        Object.assign(objActivity,
            { strUserId: tempUserObject.UserId },
            { strUserName: tempUserObject.UserName },
            { activity: 'Hardness Weighment Started on IDS' + strIdsNo });
        await objActivityLog.ActivityLogEntry(objActivity);

        let counter = 0;
        for (const dataVal in recivedWt) {

            let strDataVal = recivedWt[dataVal].datavalue.split(':');
            let strCounter = strDataVal[0].trim();
            let hardnessval = parseFloat(strDataVal[1].trim());
            let decimalPoint = this.precision(parseFloat(hardnessval))
            var detailObj = {
                str_tableName: 'tbl_tab_detail7_incomplete',
                data: [
                    { str_colName: 'RepSerNo', value: lastInsertedID },
                    { str_colName: 'MstSerNo', value: 0 },
                    { str_colName: 'RecSeqNo', value: strCounter },
                    { str_colName: 'DataValue', value: hardnessval },
                    { str_colName: 'DecimalPoint', value: decimalPoint }
                ]
            }
            var detailRes = await database.save(detailObj);
            mqttSender.sendData(strHmi, `${mqttProtocol.DisplayResult}${strCounter}:${hardnessval} ${res[1]['Param7_Unit']}`)
            counter++;
        }


        if (productlimits.noOfSamples == counter) {
            var remarkRes = await objSaveCompleteHardness.saveHardnessData8M(repSerNo, strIdsNo);
            let objActivity = {};
            await objInstrumentUsage.InstrumentUsage('Hardness', strIdsNo, 'tbl_instrumentlog_hardness', '', 'completed');
            Object.assign(objActivity,
                { strUserId: tempUserObject.UserId },
                { strUserName: tempUserObject.UserName },
                { activity: 'Hardness Weighment Completed on IDS' + strIdsNo });
            await objActivityLog.ActivityLogEntry(objActivity);
            let rptMsg;
            if (remarkRes == "Complies") {
                rptMsg = "Report Generated Within limit";
            } else {
                rptMsg = "Report Generated WithOut limit";
            }
            mqttSender.sendData(strHmi, `${mqttProtocol.DisplayMessage}${rptMsg}`);
            mqttSender.sendData(strHmi, `${mqttProtocol.TestCompleted}Hardness Test Completed`);
        }

    }

    async saveDataIncompleteMasterHardness125(dataObj) {
        try {
            let now = new Date();
            let strHmi = dataObj.strHmi;
            let strIdsNo = dataObj.uniqueSerialNumber
            let CurrentCubical = globalData.arrIdsInfo.find(k => k.Hmi == strHmi).cubicalData; //selected

            let selectedIdsNo;
            var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.idsNo == strIdsNo);
            if (IPQCObject != undefined) {
                selectedIdsNo = IPQCObject.selectedIds;
            } else {
                selectedIdsNo = strIdsNo;
            }

            let hmiDetailsInPMenu = globalData.arrIdsInfo.find(k => k.idsNo == selectedIdsNo).cubicalData;
            let productDetail = globalData.arrProductTypeArray.find(k => k.idsNo == selectedIdsNo)
            let doloboNom;
            let doloboNeg;
            let doloboPos;
            let colHeadDolobo;
            let side;
            if (hmiDetailsInPMenu.Sys_RotaryType == "Single") {
                side = "NA";
            }
            else {
                side = "LHS";
            }

            //confirm 
            let menuDetail = globalData.arr_limits.find(k => k.idsNo == strIdsNo);
            let tempObj;
            let thicknessNom, thicknesneg, thicknespos;
            let tempLimObjHardness, tempLimObjThickness, tempLimObjlength, tempLimObjDiameter, tempLimObjBreadth;
            tempLimObjHardness = menuDetail.Menus.filter(obj => Object.keys(obj) == "Hardness")[0] == undefined ?
                undefined : menuDetail.Menus.filter(obj => Object.keys(obj) == "Hardness")[0]['Hardness'];

            tempLimObjThickness = menuDetail.Menus.filter(obj => Object.keys(obj) == "Thickness")[0] == undefined ?
                undefined : menuDetail.Menus.filter(obj => Object.keys(obj) == "Thickness")[0]['Thickness'];

            tempLimObjlength = menuDetail.Menus.filter(obj => Object.keys(obj) == "Length")[0] == undefined ?
                undefined : menuDetail.Menus.filter(obj => Object.keys(obj) == "Length")[0]['Length'];

            tempLimObjDiameter = menuDetail.Menus.filter(obj => Object.keys(obj) == "Diameter")[0] == undefined ?
                undefined : menuDetail.Menus.filter(obj => Object.keys(obj) == "Diameter")[0]['Diameter'];

            tempLimObjBreadth = menuDetail.Menus.filter(obj => Object.keys(obj) == "Breadth")[0] == undefined ?
                undefined : menuDetail.Menus.filter(obj => Object.keys(obj) == "Breadth")[0]['Breadth'];

            colHeadDolobo = tempLimObjlength != undefined ? 'Length' : tempLimObjBreadth != undefined ?
                'Breadth' : tempLimObjDiameter != undefined ? 'Diameter' : 'NA';



            if (tempLimObjDiameter != undefined) { // diameter
                doloboNom = productDetail.productDetail.Param6_Nom;
                doloboNeg = productDetail.productDetail.Param6_T1Neg;
                doloboPos = productDetail.productDetail.Param6_T1Pos;
            } else if (tempLimObjlength != undefined) { //length
                doloboNom = productDetail.productDetail.Param5_Nom;
                doloboNeg = productDetail.productDetail.Param5_T1Neg;
                doloboPos = productDetail.productDetail.Param5_T1Pos;
            }
            else if (tempLimObjBreadth != undefined) {
                doloboNom = productDetail.productDetail.Param4_Nom;
                doloboNeg = productDetail.productDetail.Param4_T1Neg;
                doloboPos = productDetail.productDetail.Param4_T1Pos;
            }
            else {
                doloboNom = 0;
                doloboNeg = 0;
                doloboPos = 0;
            }

            if (tempLimObjThickness != undefined) {
                thicknessNom = productDetail.productDetail.Param3_Nom;
                thicknesneg = productDetail.productDetail.Param3_T1Neg
                thicknespos = productDetail.productDetail.Param3_T1Pos;
            } else {
                thicknessNom = 0;
                thicknesneg = 0;
                thicknespos = 0;
            }
            const insertObj = {
                //  str_tableName: strTableName.concat('_incomplete'),
                str_tableName: 'tbl_tab_master_htd_incomplete',
                data: [
                    { str_colName: 'MstSerNo', value: 1 },
                    { str_colName: 'InstruId', value: 1 },
                    { str_colName: 'BFGCode', value: dataObj.objProductDetails.ProductId },
                    { str_colName: 'ProductName', value: dataObj.objProductDetails.ProductName },
                    { str_colName: 'ProductType', value: dataObj.productType.ProductType },
                    { str_colName: 'Qty', value: parseInt(dataObj.objProductDetails.noOfSample) },
                    { str_colName: 'GrpQty', value: 0 },
                    { str_colName: 'GrpFreq', value: 0 },
                    { str_colName: 'Idsno', value: dataObj.uniqueSerialNumber },
                    { str_colName: 'CubicalNo', value: hmiDetailsInPMenu.Sys_CubicNo },
                    { str_colName: 'BalanceId', value: CurrentCubical.Sys_BalID },
                    { str_colName: 'BalanceNo', value: 0 },
                    { str_colName: 'VernierId', value: CurrentCubical.Sys_VernierID },
                    { str_colName: 'VernierNo', value: 0 },
                    { str_colName: 'BatchNo', value: hmiDetailsInPMenu.Sys_Batch },
                    { str_colName: 'UserId', value: dataObj.objProductDetails.userid },
                    { str_colName: 'UserName', value: dataObj.objProductDetails.userName },
                    { str_colName: 'PrDate', value: date.format(now, 'YYYY-MM-DD') },
                    { str_colName: 'PrTime', value: date.format(now, 'HH:mm:ss') },
                    { str_colName: 'Side', value: side },
                    { str_colName: 'Unit', value: dataObj.strHardnessUnit },
                    { str_colName: 'DecimalPoint', value: 0 },
                    { str_colName: 'WgmtModeNo', value: 1 },
                    { str_colName: 'NomThick', value: thicknessNom },
                    { str_colName: 'PosTolThick', value: thicknespos },
                    { str_colName: 'NegTolThick', value: thicknesneg },
                    { str_colName: 'NomHard', value: productDetail.productDetail.Param7_Nom },
                    { str_colName: 'PosTolHard', value: productDetail.productDetail.Param7_T1Pos },
                    { str_colName: 'NegTolHard', value: productDetail.productDetail.Param7_T1Neg },
                    { str_colName: 'NomDOLOBO', value: doloboNom },
                    { str_colName: 'PosTolDOLOBO', value: doloboPos },
                    { str_colName: 'NegTolDOLOBO', value: doloboNeg },
                    { str_colName: 'ColHeadDOLOBO', value: colHeadDolobo },
                    { str_colName: 'CubicleType', value: hmiDetailsInPMenu.Sys_CubType },
                    { str_colName: 'ReportType', value: 0 },
                    { str_colName: 'MachineCode', value: hmiDetailsInPMenu.Sys_MachineCode },
                    { str_colName: 'MFGCode', value: hmiDetailsInPMenu.Sys_MfgCode },
                    { str_colName: 'BatchSize', value: hmiDetailsInPMenu.Sys_BatchSize },
                    { str_colName: 'HardnessID', value: CurrentCubical.Sys_HardID },
                    { str_colName: 'CubicleName', value: hmiDetailsInPMenu.Sys_CubicName },
                    { str_colName: 'CubicleLocation', value: hmiDetailsInPMenu.Sys_Location },
                    { str_colName: 'RepoLabel11', value: hmiDetailsInPMenu.Sys_Validation },
                    { str_colName: 'PrintNo', value: 0 },
                    { str_colName: 'IsArchived', value: 0 },
                    { str_colName: 'GraphType', value: 0 },
                    { str_colName: 'PVersion', value: hmiDetailsInPMenu.Sys_PVersion },
                    { str_colName: 'Version', value: hmiDetailsInPMenu.Sys_Version },
                    { str_colName: 'BRepSerNo', value: 0 },
                    { str_colName: 'Lot', value: hmiDetailsInPMenu.Sys_LotNo },
                    { str_colName: 'Area', value: hmiDetailsInPMenu.Sys_Area },
                    { str_colName: 'Stage', value: hmiDetailsInPMenu.Sys_Stage }
                ]
            }
            let insertHardness = await database.save(insertObj);
            return insertHardness;
        } catch (error) {
            throw new Error(error);
        }
    }

    async checkSampleAlreadyInsert(repSerno, sampleNo, strTableName) {
        try {
            const checkObj = await models[strTableName].findAll({
                where: {
                    RepSerNo: repSerno,
                    RecSeqNo: sampleNo,
                }
            })
            console.log(checkObj);
            return checkObj.length > 0 ? true : false

        } catch (error) {
            console.log(error);
        }
    }

    async checkIfmoveTosave(repSerNo, tableMasterName) {
        try {
            let alReadySave = await models[tableMasterName].findAll({
                where: {
                    RepSerNo: repSerNo
                    // Idsno:strHmi // change idsNo to strHmi
                }

            })

            return alReadySave.length > 0 ? true : false
        } catch (error) {
            console.log(error)
        }
    }

    async lastInsertedRecords(strProductName, StrBFGCode, StrProductVersion, StrVersion, tableName, strHmi, batch) {
        try {
            let intMstSerNo;
            tableName = tableName.concat('_incomplete')
            let selectRepSrNoObj = await models[tableName].findAll({
                attributes: [[sequelize.fn('max', sequelize.col('RepSerNo')), 'RepSerNo']],
                where: {
                    ProductName: strProductName,
                    BFGCode: StrBFGCode,
                    PVersion: StrProductVersion,
                    Version: StrVersion,
                    BatchNo: batch,
                    Idsno: strHmi
                }

            })

            let arrResultDaily_RepNo = [selectRepSrNoObj];

            let intDaily_RepNo = arrResultDaily_RepNo[0].RepSerNo;
            if (arrResultDaily_RepNo[0][0].RepSerNo == null) {
                intMstSerNo = 1;
            } else {
                var newMstSerNo = arrResultDaily_RepNo[0][0].RepSerNo;
                intMstSerNo = newMstSerNo;
            }
            return intMstSerNo;
        } catch (error) {
            console.log(error)
        }
    }



    precision(a) {
        if (!isFinite(a)) return 0;
        var e = 1, p = 0;
        while (Math.round(a * e) / e !== a) { e *= 10; p++; }
        return p;
    }
}

module.exports = HardnessModel;