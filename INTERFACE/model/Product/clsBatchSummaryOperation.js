const globalData = require('../../global/globalData');
const clsStoreProcedure = require('../Product/clsStoreProcedure');
const Database = require('../../database/clsQueryProcess');
const dbCon = require('../../global/dbCon');
const clsFormulaFun = require('../Product/clsformulaFun.model');
const clsProObj = require('../Product/clsProductDetailModel')
const date = require('date-and-time')
const objStoreProcedure = new clsStoreProcedure();
let now = new Date();
const maths = require('mathjs');
const database = new Database();
const formulaFun = new clsFormulaFun();
const proObj = new clsProObj();
const models = require('../../../config/dbConnection').models;
const sequelize = require('../../../config/dbConnection').sequelize;
const { QueryTypes, Op, where } = require('sequelize');
const moment = require('moment');
const mathj = require('mathjs')

const FormulaFunModel = require("../Product/clsformulaFun.model");
const objformulaFun = new FormulaFunModel();


class BatchSummary {
    constructor() {
        // var mathj;
        this.math = mathj;
    }

    async saveBatchData(typeValue, resultdata, strHmi, strIdsNo) {
        try {
            let responseObj = {};
            let strInstrumentId = "";
            let masterTable, detailTable, finalSum;
            let typeVal, sideVal, checkSideMasterTable;
            const objProductArray = globalData.arrIdsInfo.find(k => k.Hmi == strHmi);
            const objWeighment = objProductArray.cubicalData;

            let selectedIdsNo;
            var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.Hmi == strHmi);
            if (IPQCObject != undefined) {
                selectedIdsNo = IPQCObject.selectedIds;
            } else {
                selectedIdsNo = strIdsNo;
            }

            let selectedCubical = globalData.arrIdsInfo.find(k => k.Hmi == strHmi).cubicalData;

            let objProductTypeDetails = globalData.arrProductTypeArray.find(k => k.Hmi == strHmi);
            const objProdMasterDetails = objProductTypeDetails.productType;
            const objProdDetail = objProductTypeDetails.productDetail[0][0];
            const arrCheck = [1, 3, 4, 5, 6, 8, 'L'];

            if (arrCheck.some(type => type == typeValue)) {
                if (typeValue == 8) {
                    masterTable = 'tbl_batchsummary_master9';
                    detailTable = 'tbl_batchsummary_detail9';
                }
                else if (typeValue == 'L') {
                    masterTable = 'tbl_batchsummary_master11';
                    detailTable = 'tbl_batchsummary_detail11';
                }
                else {
                    if (objProdMasterDetails.ProductType == 2 || objProdMasterDetails.ProductType == 1) {
                        if (typeValue == 4) {
                            masterTable = 'tbl_batchsummary_master6';
                            detailTable = 'tbl_batchsummary_detail6';
                        }
                        else {
                            masterTable = 'tbl_batchsummary_master' + typeValue;
                            detailTable = 'tbl_batchsummary_detail' + typeValue;
                        }

                    }
                    else {
                        if (cubicalObj.Sys_Area == 'Dosa Dry Syrup') {
                            masterTable = 'tbl_batchsummary_master19';
                            detailTable = 'tbl_batchsummary_detail19';
                        } else {
                            masterTable = 'tbl_batchsummary_master' + typeValue;
                            detailTable = 'tbl_batchsummary_detail' + typeValue;
                        }
                    }

                }

                let sum = resultdata.detailData.reduce((acc, obj) => { return acc + Number(obj.DataValue); }, 0);
                finalSum = sum;


                if (typeValue == 8) {
                    typeVal = 9;
                }
                else if (typeValue == 'L') {
                    typeVal = 11;
                }
                else if (typeValue == 'P') {
                    typeVal = 18;
                }
                else {
                    typeVal = typeValue;
                }

                let resOfSP = await objStoreProcedure.fetchDetailForStats(resultdata, typeVal);
                let maxVal = resOfSP.max;//Math.max(...arrDetail);
                let minVal = resOfSP.min; //Math.min(...arrDetail);
                let avgVal = resOfSP.avg;  //(finalSum / count);
                if (((objWeighment.Sys_RptType == 0) &&
                    (objWeighment.Sys_Validation == 0) &&
                    ((objWeighment.Sys_CubType == 'Compression') || (objWeighment.Sys_CubType == 'Coating') ||
                        (objWeighment.Sys_CubType == 'Capsule Filling') || (objWeighment.Sys_CubType == 'IPQC') || (objWeighment.Sys_CubType == 'Dosa Dry')))) {
                    let res = objProdDetail;
                    let paramNom = `Param${typeVal}_Nom`;
                    let limitNo = `Param${typeVal}_LimitOn`;
                    let nom = parseFloat(res[paramNom]);
                    let limit = res[limitNo];
                    let minPer, maxPer;
                    if (limit == false)//standard
                    {
                        minPer = Math.abs(((nom - minVal) / nom) * 100);
                        maxPer = Math.abs(((maxVal - nom) / nom) * 100);
                    }
                    else//average
                    {
                        minPer = Math.abs(((avgVal - minVal) / avgVal) * 100);
                        maxPer = Math.abs(((maxVal - avgVal) / avgVal) * 100);
                    }
                    if (typeValue == "1" || typeValue == "8" || typeValue == "L"
                        || typeValue == "9" || typeValue == "K") {
                        strInstrumentId = resultdata.incompleteData.InsturmentID;
                    } else if (typeValue == "3" || typeValue == "4" || typeValue == "5" || typeValue == "6") {
                        strInstrumentId = resultdata.incompleteData.VernierId;
                    }

                    if (resultdata.incompleteData.Side == 'LHS') {
                        sideVal = "LEFT";
                    } else if (resultdata.incompleteData.Side == 'RHS') {
                        sideVal = "RIGHT";
                    } else {
                        sideVal = "NA";
                    }
                    if (resultdata.incompleteData.Side == 'NA') {
                        checkSideMasterTable = resultdata.incompleteData.Side;
                    } else {
                        checkSideMasterTable = 'LEFT';
                    }
                    // We only want to check side for NA and left side in master table so again we declare 
                    // side variable for this specific perpose
                    const checkMasterObj = await models[masterTable].findAll({
                        attributes: [[sequelize.fn('max', sequelize.col('RepSerNo')), 'SrNo']],
                        where: {
                            BFGCode: resultdata.incompleteData.BFGCode,
                            ProductName: resultdata.incompleteData.ProductName,
                            PVersion: resultdata.incompleteData.PVersion,
                            Version: resultdata.incompleteData.Version,
                            Side: checkSideMasterTable,
                            CubType: resultdata.incompleteData.CubicleType,
                            BatchNo: resultdata.incompleteData.BatchNo
                        }
                    })

                    let resultData = checkMasterObj;
                    let masterSrNo;
                    let DP = resultdata.incompleteData.DP;
                    const SampleRemark = globalData.arrSampleRemarkForAllTest.find(k => k.Hmi == strHmi);
                    let remark = 'Complies';
                    if (SampleRemark.OutOfRemark == true) {
                        remark = "Not Complies";
                    } else {
                        remark = "Complies";
                    }

                    let recSeqNo = await this.calculateSeqNo(sideVal, masterTable, detailTable,
                        resultdata.incompleteData);


                    let objSelMenu = globalData.arrSelectedMenu.find((k) => k.Hmi == strHmi);
                    objSelMenu.selectedProductDetail.nominal = objProdDetail.Param1_Nom
                    // masterTable = 'tbl_tab_master1';
                    // detailTable = 'tbl_tab_detail1';
                    // strincomplete =  'tbl_tab_master1_incomplete'
                    typeValue = 1;
                    var maxLimitT1 = objformulaFun.upperLimit(objSelMenu.selectedProductDetail, 'T1');
                    var maxLimitT2 = objformulaFun.upperLimit(objSelMenu.selectedProductDetail, 'T2');
                    var minLimitT2 = objformulaFun.lowerLimit(objSelMenu.selectedProductDetail, 'T2');
                    var minLimitT1 = objformulaFun.lowerLimit(objSelMenu.selectedProductDetail, 'T1');

                    if (resultData[0].SrNo == null) {
                        const objInsertMasterData = await models[masterTable].create({
                            BFGCode: resultdata.incompleteData.BFGCode,
                            ProductName: resultdata.incompleteData.ProductName,
                            PVersion: resultdata.incompleteData.PVersion,
                            Version: resultdata.incompleteData.Version,
                            PrdType: resultdata.incompleteData.ProductType,
                            CubType: resultdata.incompleteData.CubicleType,
                            BatchNo: resultdata.incompleteData.BatchNo,
                            Stage: selectedCubical.Sys_Stage,
                            Dept: resultdata.incompleteData.Dept,
                            Nom: Number(resultdata.incompleteData.Nom).toFixed(1),
                            Tol1Neg: Number(minLimitT1).toFixed(1),
                            Tol1Pos: Number(maxLimitT1).toFixed(1),
                            Tol2Neg: Number(minLimitT2).toFixed(1),
                            Tol2Pos: Number(maxLimitT2).toFixed(1),
                            DP: DP,
                            //LODLayer: resultdata.incompleteDatad ,
                            Unit: resultdata.incompleteData.Unit,
                            FinalMinDT: resultdata.incompleteData.PrDate,
                            FinalMaxDT: moment(resultdata.incompleteData.PrTime).format("HH:mm:ss"),
                            FinalAvgDT: resultdata.incompleteData.PrEndDate,
                            Side: sideVal,
                            BatchCompleted: resultdata.incompleteData.BatchComplete,
                            IsArchived: resultdata.incompleteData.IsArchived,
                            LimitOn: resultdata.incompleteData.LimitOn,
                            NMTLimit: resultdata.incompleteData.T1NMT,
                            Area: selectedCubical.Sys_Area,
                            // GenericName: resultdata.incompleteData.GenericName,
                            // BMRNo: resultdata.incompleteData.BMRNo,
                            BatchSize: `${selectedCubical.Sys_BatchSize} ${selectedCubical.Sys_BatchSizeUnit}`,
                            ReportType: resultdata.incompleteData.GraphType,
                            StdLimit1: resultdata.incompleteData.StdLimit1,
                            StdLimit2: resultdata.incompleteData.StdLimit2

                        })
                        var masterResult = objInsertMasterData.dataValues;
                        masterSrNo = masterResult.RepSerNo;
                    }

                    // const objInsertDetailData = await models[detailTable].create({
                    //     RepSerNo: masterSrNo,
                    //     RecSeqNo: recSeqNo,
                    //     Date: resultdata.incompleteData.PrDate,
                    //     Time: resultdata.incompleteData.PrTime,
                    //     InstrumentID: resultdata.incompleteData.InsturmentID,
                    //     Side: sideVal,
                    //     MinPer: minPer,
                    //     MaxPer: maxPer,
                    //     Min: Number(minVal).toFixed(1),
                    //     Max: Number(maxVal).toFixed(1),
                    //     Avg: Number(avgVal).toFixed(1),
                    //     TestResult: remark,
                    //     UserID: resultdata.incompleteData.UserId,
                    //     UserName: resultdata.incompleteData.UserName,


                    // })

                    // Object.assign(responseObj, { status: 'success' })
                    // return responseObj;

                    // } else {
                    masterSrNo = masterSrNo != undefined ? masterSrNo : resultData[0].SrNo;
                    var objInsertDetailData = await models[detailTable].create({
                        RepSerNo: masterSrNo,
                        RecSeqNo: recSeqNo,
                        Date: resultdata.incompleteData.PrDate,
                        Time: moment(resultdata.incompleteData.PrTime).format("HH:mm:ss"),
                        InstrumentID: resultdata.incompleteData.InsturmentID,
                        Side: sideVal,
                        // MinPer: minPer,
                        // MaxPer: maxPer,
                        Min: Number(minVal).toFixed(1),
                        Max: Number(maxVal).toFixed(1),
                        Avg: Number(avgVal).toFixed(1),
                        TestResult: remark,
                        UserID: resultdata.incompleteData.UserId,
                        UserName: resultdata.incompleteData.UserName,

                    })

                    // var Complies_Result = await models[detailTable].findAll({
                    //     where: {
                    //         RepSerNo: resultData[0].SrNo,
                    //         TestResult: 'Complies',
                    //         InstrumentID: resultdata.incompleteData.InsturmentID
                    //     }
                    // })
                    // var arr = [];
                    // var arr_min = [];
                    // var arr_avg = [];
                    // for (var i = 0; i < Complies_Result.length; i++) {
                    //     var Max = Complies_Result[i].Max;
                    //     arr.push(Number(Max));
                    //     // console.log(arr);
                    //     var Min = Complies_Result[i].Min;
                    //     arr_min.push(Number(Min));
                    //     // console.log(arr_min);
                    //     var max_value = maths.max(arr);
                    //     var min_value = maths.min(arr_min);
                    //     var average = Complies_Result[i].Avg;
                    //     arr_avg.push(Number(average));
                    //     // console.log(average);
                    //     var total = arr_avg.reduce((acc, total) => {
                    //         return Number(total) + Number(acc);
                    //     }, 0)
                    //     var avg = total / arr_avg.length
                    //     avg = avg.toFixed(1);
                    // }
                    // var update_Master = await models[masterTable].update({
                    //     MaxValue: Number(max_value).toFixed(1),
                    //     MinValue: Number(min_value).toFixed(1),
                    //     AvgValue: Number(avg).toFixed(1)

                    // }, {
                    //     where: {
                    //         RepSerNo: masterSrNo
                    //     }
                    // })
                    // let detailResult = (objInsertDetailData);
                    // Object.assign(responseObj, { status: 'success', remark: remark })
                    // return responseObj;
                    // }
                    var Complies_Result = await models[detailTable].findAll({
                        where: {
                            RepSerNo: masterSrNo,
                            TestResult: 'Complies',
                            InstrumentID: resultdata.incompleteData.InsturmentID
                        }
                    })
                    var arr = [];
                    var arr_min = [];
                    var arr_avg = [];
                    for (var i = 0; i < Complies_Result.length; i++) {
                        var Max = Complies_Result[i].Max;
                        arr.push(Number(Max));
                        // console.log(arr);
                        var Min = Complies_Result[i].Min;
                        arr_min.push(Number(Min));
                        // console.log(arr_min);
                        var max_value = maths.max(arr);
                        var min_value = maths.min(arr_min);
                        var average = Complies_Result[i].Avg;
                        arr_avg.push(Number(average));
                        // console.log(average);
                        var total = arr_avg.reduce((acc, total) => {
                            return Number(total) + Number(acc);
                        }, 0)
                        var avg = total / arr_avg.length
                        avg = avg.toFixed(1);
                    }
                    var update_Master = await models[masterTable].update({
                        MaxValue: max_value == 0 ? 'NA' : Number(max_value).toFixed(1),
                        MinValue: min_value == 0 ? 'NA' : Number(min_value).toFixed(1),
                        AvgValue: avg == 0 ? 'NA' : Number(avg).toFixed(1)

                    }, {
                        where: {
                            RepSerNo: masterSrNo
                        }
                    })
                    let detailResult = (objInsertDetailData);
                    Object.assign(responseObj, { status: 'success', remark: remark })
                    return responseObj;

                }
            } else {
                return false;
            }

        } catch (error) {
            console.log(error);
            throw new Error(error)
        }
    }

    async calculateSeqNo(side, masterTableName, detailTableName, inCompleteData) {
        try {

            let selectedSide;
            if (side == 'NA') {
                selectedSide = side;
            } else {
                selectedSide = "LEFT";
            }
            let selectDetailData = await models[masterTableName].findAll({
                attributes: [[sequelize.fn('max', sequelize.col('RepSerNo')), 'RepSerNo']],
                where: {
                    BFGCode: inCompleteData.BFGCode,
                    ProductName: inCompleteData.ProductName,
                    PVersion: inCompleteData.PVersion,
                    Version: inCompleteData.Version,
                    BatchNo: inCompleteData.BatchNo,
                    Side: selectedSide

                }

            })
            //  {
            //     str_tableName: masterTableName,
            //     data: 'MAX(RepSerNo) AS RepSerNo',
            //     condition: [
            //       BFGCode: inCompleteData.BFGCode ,
            //       ProductName: inCompleteData.ProductName ,
            //       PVersion: inCompleteData.PVersion ,
            //       Version: inCompleteData.Version ,
            //       BatchNo: inCompleteData.BatchNo ,
            //       Side: selectedSide 
            //     ]
            // }
            let selectRes = [selectDetailData];
            if (selectRes[0][0].RepSerNo === null) {
                return 1;
            } else {
                let selectDetail = await models[detailTableName].findAll({
                    attributes: [[sequelize.fn('max', sequelize.col('RepSerNo')), 'RepSerNo']],
                    where: {
                        RepSerNo: selectRes[0][0].RepSerNo,
                        Side: side
                    }
                })
                // {
                //     str_tableName: detailTableName,
                //     data: 'MAX(RecSeqNo) AS RecSeqNo',
                //     condition: [
                //         { str_colName: 'RepSerNo', value: selectRes[0][0].RepSerNo },
                //         { str_colName: 'Side', value: side }
                //     ]
                // }
                let reqSeqRes = [selectDetail];
                if (reqSeqRes[0][0].RepSerNo === null) {
                    return 1;
                } else {
                    return reqSeqRes[0][0].RepSerNo + 1;
                }
            }
        } catch (error) {
            throw new Error(error)
        }

    }

    async saveBatchSummaryDT(InsertIdLHS = 0, InsertIdRHS = 0, selectedcubicalObj, idsNo) {
        try {
            // var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.idsNo == idsNo);
            let selectedIds = idsNo;
            // if (IPQCObject != undefined) {
            //     selectedIds = IPQCObject.selectedIds;
            // } else {
            //     selectedIds = idsNo;
            // }

            let cubicalObj = selectedcubicalObj
            //if (((cubicalObj.Sys_RptTyp0e == 0) && (cubicalObj.Sys_Validation == 0) && (cubicalObj.Sys_CubType == 'Compression') || (cubicalObj.Sys_CubType == 'Coating') || (cubicalObj.Sys_CubType == 'Capsule Filling'))) {
            if ((cubicalObj.Sys_RptType == 0) && (cubicalObj.Sys_Validation == 0)
                && (cubicalObj.Sys_CubType != 'IPQA') && (cubicalObj.Sys_CubType != 'IPQC')) {

                /**
                 * SELECT MAX(`DT_RunTime`) AS 'Max', MIN(`DT_RunTime`) AS 'Min', TIME_FORMAT(SEC_TO_TIME(AVG(HOUR(`DT_RunTime`) * 3600 +
                 *(MINUTE(`DT_RunTime`) * 60) + SECOND(`DT_RunTime`))),'%H:%i:%s') AS 'Avg' FROM `tbl_tab_detail13` WHERE `RepSerNo`=1
                 */
                // let res = await proObj.productData(selectedcubicalObj);

                let res = globalData.arrProductTypeArray.find(k => k.idsNo == selectedIds).productType;
                let res1 = globalData.arrProductTypeArray.find(k => k.idsNo == selectedIds)
                res1 = res1.productDetail[0][0]
                var masterResult;
                var ProductType = res.ProductType
                var tblMstName = ProductType == 1 ? 'tbl_tab_master13' : 'tbl_cap_master6'
                var tblDetName = ProductType == 1 ? 'tbl_tab_detail13' : 'tbl_cap_detail6'

                if (selectedcubicalObj.Sys_RotaryType == 'Double') {
                    //masterResult = await database.execute(`SELECT * FROM tbl_tab_master13 WHERE RepSerNo = '${InsertIdLHS}' OR RepSerNo = '${InsertIdRHS}'`);
                    let str_Query = `SELECT * FROM ${tblMstName} WHERE RepSerNo = ${InsertIdLHS} OR RepSerNo = ${InsertIdRHS}`
                    masterResult = await sequelize.query(str_Query, { type: QueryTypes.SELECT });
                } else {
                    //masterResult = await dbCon.execute(`SELECT * FROM tbl_tab_master13 WHERE RepSerNo = '${InsertIdLHS}'`);
                    let str_Query = `SELECT * FROM ${tblMstName} WHERE RepSerNo = ${InsertIdLHS}`
                    masterResult = await sequelize.query(str_Query, { type: QueryTypes.SELECT });
                }

                if (masterResult.length != 0) {

                    for (let obj of masterResult) {
                        //         let detailResult = await dbCon.execute(`SELECT MAX(DT_RunTime) AS 'Max', MIN(DT_RunTime) AS 'Min', TIME_FORMAT(SEC_TO_TIME(AVG(HOUR(DT_RunTime) * 3600 +
                        // (MINUTE(DT_RunTime) * 60) + SECOND(DT_RunTime))),'%H:%i:%s') AS 'Avg' FROM tbl_tab_detail13 WHERE RepSerNo='${obj.RepSerNo}'`);

                        let str_Query = `SELECT MAX(DT_RunTime) AS 'Max', MIN(DT_RunTime) AS 'Min', 
                                TIME_FORMAT(SEC_TO_TIME(AVG(HOUR(DT_RunTime) * 3600 +
                                (MINUTE(DT_RunTime) * 60) + SECOND(DT_RunTime))),'%H:%i:%s') AS 'Avg' 
                                FROM ${tblDetName} WHERE RepSerNo= ${obj.RepSerNo}`

                        let detailResult = await sequelize.query(str_Query, { type: QueryTypes.SELECT })

                        let side = 'NA';
                        if (selectedcubicalObj.Sys_RotaryType == 'Single') {
                            side = 'NA';
                        } else {
                            if (obj.Side == 'NA') {
                                side = 'NA';
                            } else if (obj.Side == 'LHS') {
                                side = 'LEFT';
                            } else {
                                side = 'RIGHT';
                            }
                        }

                        var result = 'Compiles';
                        /**
                         * @description Comparing DT std time and max time
                         * var startTime = "01:00:00";
                            var endTime = "01:00:00";
                            var regExp = /(\d{1,2})\:(\d{1,2})\:(\d{1,2})/;
                            if(parseInt(endTime .replace(regExp, "$1$2$3")) > parseInt(startTime .replace(regExp, "$1$2$3"))){
                            console.log('true')
                            } else {
                            console.log('false')
                            }
                         */
                        var regExp = /(\d{1,2})\:(\d{1,2})\:(\d{1,2})/;
                        var stdTime = ProductType == 1 ? res1.Param13_Nom : res1.Param6_Nom;
                        var maxTime = detailResult[0].Max;
                        if (parseInt(maxTime.replace(regExp, "$1$2$3")) > parseInt(stdTime.replace(regExp, "$1$2$3"))) {
                            result = 'Not Complies';
                        } else {
                            result = 'Complies';
                        }

                        let checkSideMasterTable;
                        if (selectedcubicalObj.Sys_RotaryType != 'Double') {
                            checkSideMasterTable = 'NA';
                        } else {
                            checkSideMasterTable = 'LEFT';
                        }

                        const resultData = await models.tbl_batchsummary_master13.findAll({
                            where: {
                                BFGCode: selectedcubicalObj.Sys_BFGCode,
                                ProductName: selectedcubicalObj.Sys_ProductName,
                                PVersion: selectedcubicalObj.Sys_PVersion,
                                Version: selectedcubicalObj.Sys_Version,
                                CubType: obj.CubicleType,
                                Side: checkSideMasterTable,
                                BatchNo: obj.BatchNo,
                            }
                        })

                        let incompleteData = {
                            BFGCode: obj.BFGCode,
                            ProductName: obj.ProductName,
                            PVersion: obj.PVersion,
                            Version: obj.Version,
                            BatchNo: obj.BatchNo
                        }

                        let recSeqNo = await this.calculateSeqNo(side, 'tbl_batchsummary_master13', 'tbl_batchsummary_detail13', incompleteData);

                        if (resultData.length == 0) {

                            let masterBatchSummary = await models.tbl_batchsummary_master13.create({
                                BFGCode: obj.BFGCode,
                                ProductName: obj.ProductName,
                                PVersion: obj.PVersion,
                                Version: obj.Version,
                                PrdType: obj.ProductType,
                                CubType: obj.CubicleType,
                                BatchNo: obj.BatchNo,
                                Stage: selectedcubicalObj.Sys_Stage,
                                Dept: selectedcubicalObj.Sys_dept,
                                Tol1Neg: ProductType == 1 ? res1.Param6_T1Neg : res1.Param6_T1Neg,//; res[1].Param13_T1Neg,
                                Tol1Pos: ProductType == 1 ? res1.Param13_T1Pos : res1.Param6_T1Pos,//res[1].Param13_T1Pos,
                                DTStdTime: ProductType == 1 ? res1.Param13_Nom : res1.Param6_Nom,//res[1].Param13_Nom,
                                Side: checkSideMasterTable,
                                BatchCompleted: 0,
                                Area: selectedcubicalObj.Sys_Area,
                                GenericName: cubicalObj.Sys_GenericName,
                                BMRNo: cubicalObj.Sys_BMRNo,
                                BatchSize: `${cubicalObj.Sys_BatchSize} ${cubicalObj.Sys_BatchSizeUnit}`,
                                ReportType: 0
                            })

                            let masterSrNo = masterBatchSummary.dataValues.RepSerNo;

                            await models.tbl_batchsummary_detail13.create({
                                RepSerNo: masterSrNo,
                                RecSeqNo: recSeqNo,
                                Date: obj.PrDate,
                                Time: obj.PrTime,
                                //InstrumentID: cubicalObj.Sys_DTID,
                                InstrumentID: obj.DTID,
                                Side: side,
                                MinTimeDT: detailResult[0].Min,
                                MaxTimeDT: detailResult[0].Max,
                                AvgTimeDT: detailResult[0].Avg,
                                TestResult: result,
                                UserID: obj.UserId,
                                UserName: obj.UserName
                            })


                        } else {

                            let masterSrNo = resultData[0].RepSerNo;

                            await models.tbl_batchsummary_detail13.create({
                                RepSerNo: masterSrNo,
                                RecSeqNo: recSeqNo,
                                Date: obj.PrDate,
                                Time: obj.PrTime,
                                InstrumentID: obj.DTID,
                                Side: side,
                                MinTimeDT: detailResult[0].Min,
                                MaxTimeDT: detailResult[0].Max,
                                AvgTimeDT: detailResult[0].Avg,
                                TestResult: result,
                                UserID: obj.UserId,
                                UserName: obj.UserName,
                            })

                        }
                    }
                }
            }
        } catch (error) {
            throw new Error(error)
        }

    }

    async saveBatchSummaryFriability(masterData, idsNo) {
        var now = new Date();
        let responseObj = {};
        //var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.idsNo == idsNo);
        var strHmi = idsNo;
        // if (IPQCObject != undefined) {
        //     selectedIds = IPQCObject.selectedIds;
        // } else {
        //     selectedIds = idsNo;
        // }
        var cubicalObj = globalData.arrIdsInfo.find(k => k.Hmi == strHmi).cubicalData;
        //var tempLimObj = globalData.arr_limits.find(k => k.idsNo == idsNo);
        if (((cubicalObj.Sys_RptType == 0) && (cubicalObj.Sys_Validation == 0) && (cubicalObj.Sys_CubType == 'Compression') || (cubicalObj.Sys_CubType == 'Coating'))) {
            let result = "Complies";
            let sideVal = "NA";
            if (masterData.Side == 'Double') {
                sideVal = "LEFT";
            }
            else {
                sideVal = "NA";
            }

            const checkMasterObj = await models.tbl_batchsummary_master8.findAll({
                attributes: [[sequelize.fn('max', sequelize.col('RepSerNo')), 'RepSerNo']],
                where: {
                    BFGCode: masterData.BFGCode,
                    ProductName: masterData.ProductName,
                    PVersion: masterData.PVersion,
                    Version: masterData.Version,
                    Side: sideVal,
                    CubType: cubicalObj.Sys_CubType,
                    BatchNo: masterData.BatchNo,
                }
            })

            var masterSrNo;
            let resultData = checkMasterObj;
            let recSeqNo = await this.calculateSeqNo(sideVal, 'tbl_batchsummary_master8', 'tbl_batchsummary_detail8', masterData);
            // let ProdRes = await proObj.productData(cubicalObj);
            // let ProdRes = globalData.arrProductTypeArray.find(k => k.idsNo == selectedIds).productType;

            if (resultData[0].RepSerNo == null) {
                let masterDataInsert = await models.tbl_batchsummary_master8.create({
                    BFGCode: masterData.BFGCode,
                    ProductName: masterData.ProductName,
                    PVersion: masterData.PVersion,
                    Version: masterData.Version,
                    PrdType: 1,
                    CubType: masterData.CubType,
                    BatchNo: masterData.BatchNo,
                    Unit: masterData.Unit,
                    Dept: masterData.Dept,
                    Nom: masterData.Nom,
                    Area: masterData.Area,
                    // LwrHard: masterData.NegTolHard },
                    // UppHard: masterData.PosTolHard },
                    // UnitHard: masterData.Unit },
                    // NomThick: masterData.NomThick },
                    // LwrThick: masterData.NegTolThick },
                    // UppThick: masterData.PosTolThick },
                    // NomDLB: masterData.NomDOLOBO },
                    // LwrDLB: masterData.NegTolDOLOBO },
                    // UppDLB: masterData.PosTolDOLOBO },
                    // DLBParamName: masterData.ColHeadDOLOBO },
                    Side: sideVal,
                    BatchCompleted: 0,
                    IsArchived: 0

                })

                let saveBatchSumm = masterDataInsert;
                masterSrNo = saveBatchSumm.dataValues.RepSerNo;
                if (sideVal == 'NA') {
                    /**
                     * @formula
                     * calculation = ((before-After)/Before)*100
                     */
                    let calculation = (((masterData.nwtBeforeTest - masterData.nwtAfterTest) / masterData.nwtBeforeTest) * 100);
                    if (calculation > masterData.Nom) {
                        result = "Not Complies";
                    } else {
                        result = "Complies";
                    }
                    const objInsertDetailData = await models.tbl_batchsummary_detail8.create({
                        RepSerNo: masterSrNo,
                        RecSeqNo: recSeqNo,
                        Date: masterData.PrDate,
                        Time: masterData.PrTime,
                        InstrumentID: masterData.InstrumentID,
                        Side: 'NA',
                        Min: calculation < 0 ? 0 : calculation,
                        Max: calculation < 0 ? 0 : calculation,
                        Avg: calculation < 0 ? 0 : calculation,
                        TestResult: result,
                        UserID: masterData.UserId,
                        UserName: masterData.UserName
                    })

                    //console.log(objInsertDetailData);
                    Object.assign(responseObj, { status: 'success' })
                    return responseObj;
                } else {
                    let resultLHS; let resultRHS;
                    /**
                        * @formula
                        * calculation = ((before-After)/Before)*100
                        */
                    let calculationLHS = (((masterData.lwtBeforeTest - masterData.lwtAfterTest) / masterData.lwtBeforeTest) * 100);
                    if (calculationLHS > masterData.Nom) {
                        resultLHS = "Not Complies";
                    } else {
                        resultLHS = "Complies";
                    }
                    const objInsertDetailDataLHS = await models.tbl_batchsummary_detail8.create({

                        RepSerNo: masterSrNo,
                        RecSeqNo: recSeqNo,
                        Date: masterData.PrDate,
                        Time: masterData.PrTime,
                        InstrumentID: masterData.InstrumentID,
                        Side: 'LEFT',
                        Min: calculationLHS,
                        Max: calculationLHS,
                        Avg: calculationLHS,
                        TestResult: resultLHS,
                        UserID: masterData.UserId,
                        UserName: masterData.UserName,


                    })

                    // await database.save(objInsertDetailDataLHS);
                    let calculationRHS = (((masterData.rwtBeforeTest - masterData.rwtAfterTest) / masterData.rwtBeforeTest) * 100);
                    if (calculationRHS > masterData.Nom) {
                        resultRHS = "Not Complies";
                    } else {
                        resultRHS = "Complies";
                    }
                    const objInsertDetailDataRHS = await models.tbl_batchsummary_detail8.create({

                        RepSerNo: masterSrNo,
                        RecSeqNo: recSeqNo,
                        Date: masterData.PrDate,
                        Time: masterData.PrTime,
                        InstrumentID: masterData.InstrumentID,
                        Side: 'RIGHT',
                        Min: calculationRHS,
                        Max: calculationRHS,
                        Avg: calculationRHS,
                        TestResult: resultRHS,
                        UserID: masterData.UserId,
                        UserName: masterData.UserName,


                    })
                    //console.log(objInsertDetailData);
                    // await database.save(objInsertDetailDataRHS);
                    Object.assign(responseObj, { status: 'success' })
                    return responseObj;
                }
            } else {
                masterSrNo = resultData[0].RepSerNo;
                if (sideVal == 'NA') {
                    /**
                     * @formula
                     * calculation = ((before-After)/Before)*100
                     */
                    let calculation = (((masterData.nwtBeforeTest - masterData.nwtAfterTest) / masterData.nwtBeforeTest) * 100);
                    if (calculation > masterData.Nom) {
                        result = "Not Complies";
                    } else {
                        result = "Complies";
                    }
                    const objInsertDetailData = await models.tbl_batchsummary_detail8.create({
                        RepSerNo: masterSrNo,
                        RecSeqNo: recSeqNo,
                        Date: masterData.PrDate,
                        Time: masterData.PrTime,
                        InstrumentID: masterData.InstrumentID,
                        Side: 'NA',
                        Min: calculation,
                        Max: calculation,
                        Avg: calculation,
                        TestResult: result,
                        UserID: masterData.UserId,
                        UserName: masterData.UserName,
                    })

                    //console.log(objInsertDetailData);
                    // await database.save(objInsertDetailData);
                    Object.assign(responseObj, { status: 'success' })
                    return responseObj;
                } else {
                    let resultLHS; let resultRHS;
                    /**
                        * @formula
                        * calculation = ((before-After)/Before)*100
                        */
                    let calculationLHS = (((masterData.lwtBeforeTest - masterData.lwtAfterTest) / masterData.lwtBeforeTest) * 100);
                    if (calculationLHS > masterData.Nom) {
                        resultLHS = "Not Complies";
                    } else {
                        resultLHS = "Complies";
                    }
                    const objInsertDetailDataLHS = await models.tbl_batchsummary_detail8.create({
                        RepSerNo: masterSrNo,
                        RecSeqNo: recSeqNo,
                        Date: masterData.PrDate,
                        Time: masterData.PrTime,
                        InstrumentID: masterData.InstrumentID,
                        Side: 'LEFT',
                        Min: calculationLHS,
                        Max: calculationLHS,
                        Avg: calculationLHS,
                        TestResult: resultLHS,
                        UserID: masterData.UserId,
                        UserName: masterData.UserName,
                    })

                    let calculationRHS = (((masterData.rwtBeforeTest - masterData.rwtAfterTest) / masterData.rwtBeforeTest) * 100);
                    if (calculationRHS > masterData.Nom) {
                        resultRHS = "Not Complies";
                    } else {
                        resultRHS = "Complies";
                    }
                    const objInsertDetailDataRHS = await models.tbl_batchsummary_detail8.create({
                        RepSerNo: masterSrNo,
                        RecSeqNo: recSeqNo,
                        Date: masterData.PrDate,
                        Time: masterData.PrTime,
                        InstrumentID: masterData.InstrumentID,
                        Side: 'RIGHT',
                        Min: calculationRHS,
                        Max: calculationRHS,
                        Avg: calculationRHS,
                        TestResult: resultRHS,
                        UserID: masterData.UserId,
                        UserName: masterData.UserName,
                    })

                    Object.assign(responseObj, { status: 'success' })
                    return responseObj;
                }
            }
        } else {
            return 'success';
        }
    }

    /**
     * 
     * @param {*} masterData 
     * @param {*} DetailData 
     * @description `saveBatchDataHardness` Save the batch Summary Data for `Hardness`
     */
    async saveBatchDataHardness(masterData, DetailData, idsNo) {
        try {
            var now = new Date();
            let responseObj = {};
            var selectedIds = idsNo;

            // console.log(masterData, DetailData);
            var cubicalObj = globalData.arrIdsInfo.find(k => k.idsNo == selectedIds).cubicalData;
            var menuDetail = globalData.arr_limits.find(k => k.idsNo == idsNo);
            let tempLimObjHardness = menuDetail.Menus.filter(obj => Object.keys(obj) == "Hardness")[0] == undefined ?
                undefined : menuDetail.Menus.filter(obj => Object.keys(obj) == "Hardness")[0]['Hardness'];
            var DP = masterData.DP
            let sideVal = "NA";
            if (masterData.Side == 'LHS') {
                sideVal = "LHS";
            } else if (masterData.Side == 'RHS') {
                sideVal = "RHS";
            } else {
                sideVal = "NA";
            }
            let checkSideMasterTable;
            if (masterData.Side == 'NA') {
                checkSideMasterTable = masterData.Side;
            } else {
                checkSideMasterTable = 'LEFT';
            }
            let sumHT = 0;
            let sumT = 0;
            let sumDLB = 0;
            let arrHTDetail = [];
            let arrTDetail = [];

            let outFlagHTD = 0;
            let outFlagThickness = 0;

            let remark;
            let maxHTDLimit1 = parseFloat(masterData.T1PosTolHard);
            let minHTDLimit1 = parseFloat(masterData.T1NegTolHard);
            let maxHTDLimit2 = parseFloat(masterData.T2PosTolHard);
            let minHTDLimit2 = parseFloat(masterData.T2NegTolHard);
            if (tempLimObjHardness == undefined) {
                var maxTLimit = 0;
                var minTLimit = 0;
            } else {
                var maxTLimit = parseFloat(masterData.T2PosTolThick);
                var minTLimit = parseFloat(masterData.T2NegTolThick);
            }


            let count = DetailData.length;
            for (var i = 0; i < DetailData.length; i++) {
                var dataValHard = parseFloat(DetailData[i].DataValueHard);
                if ((minHTDLimit2 > dataValHard) || (dataValHard > maxHTDLimit2)) {
                    outFlagHTD = outFlagHTD + 1;
                }
                arrHTDetail.push(dataValHard);
                var dataValThick = parseFloat(DetailData[i].DataValueThick);
                if (minTLimit != 0 && maxTLimit != 0) {
                    if ((minTLimit > dataValThick) || (dataValThick > maxTLimit)) {
                        outFlagThickness = outFlagThickness + 1;
                    }
                }
                arrTDetail.push(dataValThick);

            }


            if (masterData.NomDOLOBO != 0) {
                if (outFlagHTD != 0 || outFlagThickness != 0) {
                    remark = 'Not Complies';
                } else {
                    remark = 'Complies';
                }
            } else {
                if (outFlagHTD != 0 || outFlagThickness != 0) {
                    remark = 'Not Complies'
                } else {
                    remark = 'Complies';
                }
            }

            for (var j = 0; j < arrHTDetail.length; j++) {
                sumHT = sumHT + parseFloat(arrHTDetail[j]);
            }
            for (var k = 0; k < arrTDetail.length; k++) {
                sumT = sumT + parseFloat(arrTDetail[k]);
            }

            var MaxHard = Math.max(...arrHTDetail);
            MaxHard = Number(MaxHard).toFixed(DP);
            var MinHard = Math.min(...arrHTDetail);
            MinHard = Number(MinHard).toFixed(DP);
            var avgHard = (sumHT / count);
            avgHard = Number(avgHard).toFixed(DP)
            var MaxThick = Math.max(...arrTDetail);
            MaxThick = Number(MaxThick).toFixed(2);
            var MinThick = Math.min(...arrTDetail);
            MinThick = Number(MinThick).toFixed(2)
            var AvgThick = (sumT / count);
            AvgThick = Number(AvgThick).toFixed(2);
            // var MaxDLB = Math.max(...arrDLBDetail);
            // var MinDLB = Math.min(...arrDLBDetail);
            // var AvgDLB = (sumDLB / count);

            if (((cubicalObj.Sys_RptType == 0) && (cubicalObj.Sys_Validation == 0) && (cubicalObj.Sys_CubType == 'Compression') || (cubicalObj.Sys_CubType == 'Coating'))) {

                var masterSrNo;
                const checkMasterObj = await models['tbl_batchsummary_master_hdlb'].findAll({
                    attributes: [[sequelize.fn('max', sequelize.col('RepSerNo')), 'RepSerNo']],
                    where: {
                        BFGCode: masterData.BFGCode,
                        ProductName: masterData.ProductName,
                        PVersion: masterData.PVersion,
                        Version: masterData.Version,
                        Side: checkSideMasterTable,
                        CubType: cubicalObj.Sys_CubType,
                        BatchNo: masterData.BatchNo,
                    }
                })
                let resultData = checkMasterObj;

                let recSeqNo = await this.calculateSeqNo(sideVal, 'tbl_batchsummary_master_hdlb', 'tbl_batchsummary_detail_hdlb', masterData);
                if (resultData[0].RepSerNo == null) {

                    if (remark == 'Not Complies') {
                        masterData.MinValueHard = 0
                        masterData.MaxValueHard = 0
                        masterData.AvgValueHard = 0
                        masterData.MinValueThick = 0
                        masterData.MaxValueThick = 0
                        masterData.AvgValueThick = 0
                    }

                    const masterDataInsert = await models['tbl_batchsummary_master_hdlb'].create({
                        Area: masterData.Area,
                        BFGCode: masterData.BFGCode,
                        ProductName: masterData.ProductName,
                        PVersion: masterData.PVersion,
                        Version: masterData.Version,
                        PrdType: 1,
                        CubicalNo: masterData.CubicalNo,
                        CubType: masterData.CubicleType,
                        BatchNo: masterData.BatchNo,
                        BatchSize: masterData.BatchSize,
                        Stage: masterData.Stage,
                        Dept: cubicalObj.Sys_dept,
                        NomHard: masterData.NomHard,
                        T1NegHard: masterData.T1NegTolHard,
                        T1PosHard: masterData.T1PosTolHard,
                        T2NegHard: masterData.T2NegTolHard,
                        T2PosHard: masterData.T2PosTolHard,
                        UnitHard: masterData.Unit,
                        NomThick: masterData.NomThick,
                        LwrThick: masterData.T1NegTolThick,
                        UppThick: masterData.T1PosTolThick,
                        Lwr1Thick: masterData.T2NegTolThick,
                        Upp1Thick: masterData.T2PosTolThick,
                        MinValueHard: (masterData.MinValueHard == 0 || masterData.MinValueHard == 'NA') ? 'NA' : Number(masterData.MinValueHard).toFixed(DP),
                        MaxValueHard: (masterData.MaxValueHard == 0 || masterData.MaxValueHard == 'NA') ? 'NA' : Number(masterData.MaxValueHard).toFixed(DP),
                        AvgValueHard: (masterData.AvgValueHard == 0 || masterData.AvgValueHard == 'NA') ? 'NA' : Number(masterData.AvgValueHard).toFixed(DP),
                        MinValueThick: (masterData.MinValueThick == 0 || masterData.MinValueThick == 'NA') ? 'NA' : Number(masterData.MinValueThick).toFixed(2),
                        MaxValueThick: (masterData.MaxValueThick == 0 || masterData.MaxValueThick == 'NA') ? 'NA' : Number(masterData.MaxValueThick).toFixed(2),
                        AvgValueThick: (masterData.AvgValueThick == 0 || masterData.AvgValueThick == 'NA') ? 'NA' : Number(masterData.AvgValueThick).toFixed(2),
                        Side: checkSideMasterTable,
                        BatchCompleted: masterData.BatchComplete[0],
                        IsArchived: masterData.IsArchived[0],
                        LimitOn: 0
                    });
                    masterSrNo = masterDataInsert._previousDataValues.RepSerNo;

                    const objInsertDetailData = await models['tbl_batchsummary_detail_hdlb'].create({
                        RepSerNo: masterSrNo,
                        RecSeqNo: recSeqNo,
                        Date: masterData.PrDate,
                        Time: moment(masterData.PrTime).format("HH:mm:ss"),
                        InstrumentID: masterData.InsturmentID,
                        Side: sideVal,
                        MinHard: isNaN(MinHard) == true ? "NA" : Number(MinHard).toFixed(DP),
                        MaxHard: isNaN(MaxHard) == true ? "NA" : Number(MaxHard).toFixed(DP),
                        AvgHard: isNaN(avgHard) == true ? "NA" : Number(avgHard).toFixed(DP),
                        MinThick: isNaN(MinThick) == true ? "NA" : Number(MinThick).toFixed(2),
                        MaxThick: isNaN(MaxThick) == true ? "NA" : Number(MaxThick).toFixed(2),
                        AvgThick: isNaN(AvgThick) == true ? "NA" : Number(AvgThick).toFixed(2),
                        // MinDLB: MinDLB,
                        // MaxDLB: MaxDLB,
                        // AvgDLB: AvgDLB,
                        //MinTimeDT': resultdata.incompleteData.T1PosTol ,
                        //MaxTimeDT': resultdata.incompleteData.T2NegTol ,
                        TestResult: remark,
                        UserID: masterData.UserId,
                        UserName: masterData.UserName,
                    });


                    Object.assign(responseObj, { status: 'success' })
                    return responseObj;

                } else {
                    masterSrNo = resultData[0].RepSerNo;


                    const objInsertDetailData = await models['tbl_batchsummary_detail_hdlb'].create({
                        RepSerNo: masterSrNo,
                        RecSeqNo: recSeqNo,
                        Date: masterData.PrDate,
                        Time: moment(masterData.PrTime).format('HH:mm:ss'),
                        InstrumentID: masterData.InsturmentID,
                        Side: sideVal,
                        MinHard: isNaN(MinHard) == true ? 'NA' : Number(MinHard).toFixed(DP),
                        MaxHard: isNaN(MaxHard) == true ? 'NA' : Number(MaxHard).toFixed(DP),
                        AvgHard: isNaN(avgHard) == true ? 'NA' : Number(avgHard).toFixed(DP),
                        MinThick: isNaN(MinThick) == true ? 'NA' : Number(MinThick).toFixed(2),
                        MaxThick: isNaN(MaxThick) == true ? 'NA' : Number(MaxThick).toFixed(2),
                        AvgThick: isNaN(AvgThick) == true ? 'NA' : Number(AvgThick).toFixed(2),
                        // MinDLB: MinDLB,
                        // MaxDLB: MaxDLB,
                        // AvgDLB: AvgDLB,
                        //MinTimeDT: resultdata.incompleteData.T1PosTol ,
                        //MaxTimeDT: resultdata.incompleteData.T2NegTol ,
                        TestResult: remark,
                        UserID: masterData.UserId,
                        UserName: masterData.UserName,
                    });
                    //Batch summary calculation of complies report
                    var Complies_Result = await models['tbl_batchsummary_detail_hdlb'].findAll({
                        where: {
                            RepSerNo: masterSrNo,
                            TestResult: 'Complies',
                            InstrumentID: masterData.InsturmentID
                        }
                    })
                    var arr_maxH = [];
                    var arr_minH = [];
                    var arr_avgH = [];
                    var arr_maxT = [];
                    var arr_minT = [];
                    var arr_avgT = [];
                    for (var i = 0; i < Complies_Result.length; i++) {
                        var Max = Complies_Result[i].MaxHard;
                        if (Complies_Result[i].MaxHard != 'NA') {
                            arr_maxH.push(Number(Max));
                        }
                        // console.log(arr_maxH);
                        var TMax = Complies_Result[i].MaxThick;
                        if (Complies_Result[i].MaxThick != 'NA') {
                            arr_maxT.push(Number(TMax));
                        }
                        var Min = Complies_Result[i].MinHard;
                        if (Complies_Result[i].MinHard != 'NA') {
                            arr_minH.push(Number(Min));
                        }
                        // console.log(arr_minH);
                        var Tmin = Complies_Result[i].MinThick;
                        if (Complies_Result[i].MinThick != 'NA') {
                            arr_minT.push(Number(Tmin));
                        }
                        var max_valueHard, min_valueHard, max_valueThick, min_valueThick, average, averageThick
                        if (arr_maxH.length != 0) { max_valueHard = maths.max(arr_maxH); }
                        if (arr_minH.length != 0) { min_valueHard = maths.min(arr_minH); }
                        if (arr_maxT.length != 0) { max_valueThick = maths.max(arr_maxT); }
                        if (arr_minT.length != 0) { min_valueThick = maths.min(arr_minT); }
                        if (Complies_Result[i].AvgHard != 'NA') {
                            average = Complies_Result[i].AvgHard;
                            arr_avgH.push(Number(average));
                        }
                        // console.log(arr_avgH);
                        if (arr_avgH.length != 0) {
                            var total = arr_avgH.reduce((acc, total) => {
                                return Number(total) + Number(acc);
                            }, 0)
                            var avgH = total / arr_avgH.length
                            avgH = avgH.toFixed(1);
                        }
                        //for Thickness avg
                        if (Complies_Result[i].AvgThick != 'NA') {
                            averageThick = Complies_Result[i].AvgThick;
                            arr_avgT.push(Number(averageThick));
                        }
                        // console.log(arr_avgH);
                        if (arr_avgT.length != 0) {
                            var total1 = arr_avgT.reduce((acc, total) => {
                                return Number(total) + Number(acc);
                            }, 0)
                            var avgT = total1 / arr_avgT.length
                            avgT = avgT.toFixed(2);
                        }

                    }
                    var update_Master = await models['tbl_batchsummary_master_hdlb'].update({
                        MinValueHard: min_valueHard == undefined ? 'NA' : Number(min_valueHard).toFixed(DP),
                        MaxValueHard: max_valueHard == undefined ? 'NA' : Number(max_valueHard).toFixed(DP),
                        AvgValueHard: avgH == undefined ? 'NA' : Number(avgH).toFixed(DP),
                        MinValueThick: min_valueThick == undefined ? 'NA' : Number(min_valueThick).toFixed(2),
                        MaxValueThick: max_valueThick == undefined ? 'NA' : Number(max_valueThick).toFixed(2),
                        AvgValueThick: avgT == undefined ? 'NA' : Number(avgT).toFixed(2)

                    }, {
                        where: {
                            RepSerNo: masterSrNo
                        }
                    })
                    //END
                    Object.assign(responseObj, { status: 'success', remark: remark });
                    return responseObj;
                }
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    async saveBatchDataHardness8M(masterData, DetailData, idsNo) {
        var now = new Date();
        let responseObj = {};
        // var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.idsNo == idsNo);
        var selectedIds = idsNo;
        // console.log(masterData, DetailData);
        var cubicalObj = globalData.arrIdsInfo.find(k => k.idsNo == selectedIds).cubicalData;
        var menuDetails = globalData.arr_limits.find(k => k.idsNo == idsNo);
        var tempLimObj = menuDetails.Menus.filter(obj => Object.keys(obj) == "Hardness")[0];
        let resultForHardess = {};
        // masterData.RepSerNo
        Object.assign(resultForHardess,
            { incompleteTableName: 'tbl_tab_master7_incomplete' },
            { incompletedetailTableName: 'tbl_tab_detail7_incomplete' },
        )

        let sideVal = "NA";
        if (masterData.Side == 'LHS') {
            sideVal = "LEFT";
        } else if (masterData.Side == 'RHS') {
            sideVal = "RIGHT";
        } else {
            sideVal = "NA";
        }
        let checkSideMasterTable;
        if (masterData.Side == 'NA') {
            checkSideMasterTable = masterData.Side;
        } else {
            checkSideMasterTable = 'LEFT';
        }
        let sumHT = 0;
        let arrHTDetail = [];
        let outFlagHTD = 0;
        let remark = "";
        let maxHTDLimit = parseFloat(tempLimObj.Hardness.T1Pos);
        let minHTDLimit = parseFloat(tempLimObj.Hardness.T1Neg);
        let count = DetailData.length;
        for (var i = 0; i < DetailData.length; i++) {
            var dataValHard = parseFloat(DetailData[i].DataValue);
            if ((minHTDLimit > dataValHard) || (dataValHard > maxHTDLimit)) {
                outFlagHTD = outFlagHTD + 1;
            }
            arrHTDetail.push(dataValHard);
        }
        if (masterData.T1NegTol != 0) {
            if (outFlagHTD != 0) {
                remark = 'Not Complies';
            } else {
                remark = 'Complies';
            }
        }

        var resOfSP = await objStoreProcedure.fetchDetailForStats(resultForHardess, 7, masterData.RepSerNo);
        var MaxHard = resOfSP[1][0]['@maxWeight'];//Math.max(...arrDetail);
        var MinHard = resOfSP[1][0]['@minWeight']; //Math.min(...arrDetail);
        var avgHard = resOfSP[1][0]['@average'];  //(finalSum / count);
        if (((cubicalObj.Sys_RptType == 0) && (cubicalObj.Sys_Validation == 0) && (cubicalObj.Sys_CubType == 'Compression') || (cubicalObj.Sys_CubType == 'Coating'))) {
            // let res = await proObj.productData(cubicalObj);
            // var paramNom = `Param7_Nom`;
            // var limitNo = `Param7_LimitOn`;
            // var nom = parseFloat(res[1][paramNom]);
            // var limit = res[1][limitNo].readUIntLE();
            // if(masterData.ColHeadDOLOBO == 'Le')

            const checkMasterObj = {
                str_tableName: 'tbl_batchsummary_master7',
                data: 'MAX(RepSerNo) AS SrNo',
                condition: [
                    { str_colName: 'BFGCode', value: masterData.BFGCode, comp: 'eq' },
                    { str_colName: 'ProductName', value: masterData.ProductName, comp: 'eq' },
                    { str_colName: 'PVersion', value: masterData.PVersion, comp: 'eq' },
                    { str_colName: 'Version', value: masterData.Version, comp: 'eq' },
                    { str_colName: 'Side', value: checkSideMasterTable, comp: 'eq' },
                    { str_colName: 'CubType', value: cubicalObj.Sys_CubType, comp: 'eq' },
                    { str_colName: 'BatchNo', value: masterData.BatchNo, comp: 'eq' },
                ]
            }
            var masterSrNo;
            // let DP = await objDP.precision(resultdata.incompleteData.T2PosTol);
            let resultData = await database.select(checkMasterObj);
            let recSeqNo = await this.calculateSeqNo(sideVal, 'tbl_batchsummary_master7', 'tbl_batchsummary_detail7', masterData);
            if (resultData[0][0].SrNo == null) {
                let masterDataInsert = {
                    str_tableName: 'tbl_batchsummary_master7',
                    data: [
                        { str_colName: 'BFGCode', value: masterData.BFGCode },
                        { str_colName: 'ProductName', value: masterData.ProductName },
                        { str_colName: 'PVersion', value: masterData.PVersion },
                        { str_colName: 'Version', value: masterData.Version },
                        { str_colName: 'PrdType', value: 1 },
                        { str_colName: 'CubType', value: masterData.CubicleType },
                        { str_colName: 'BatchNo', value: masterData.BatchNo },
                        // { str_colName: 'Stage', value: masterData.Stage },
                        { str_colName: 'Dept', value: cubicalObj.Sys_dept },
                        { str_colName: 'Nom', value: masterData.Nom },
                        { str_colName: 'Tol1Neg', value: masterData.T1NegTol },
                        { str_colName: 'Tol1Pos', value: masterData.T1PosTol },
                        // { str_colName: 'Tol2Neg', value: masterData.Unit },
                        // { str_colName: 'Tol2Pos', value: masterData.NomThick },
                        { str_colName: 'DP', value: 2 },
                        { str_colName: 'Unit', value: masterData.Unit },
                        { str_colName: 'Side', value: sideVal },
                        { str_colName: 'BatchCompleted', value: masterData.BatchComplete[0] },
                        { str_colName: 'IsArchived', value: masterData.IsArchived[0] },
                        { str_colName: 'LimitOn', value: 0 },
                        { str_colName: 'Area', value: cubicalObj.Sys_Area },
                        { str_colName: 'GenericName', value: cubicalObj.Sys_GenericName },
                        { str_colName: 'BMRNo', value: cubicalObj.Sys_BMRNo },
                        { str_colName: 'BatchSize', value: `${cubicalObj.Sys_BatchSize} ${cubicalObj.Sys_BatchSizeUnit}` },
                        { str_colName: 'ReportType', value: masterData.GraphType },

                    ]
                }
                let saveBatchSumm = await database.save(masterDataInsert);
                masterSrNo = saveBatchSumm[0].insertId;
                const objInsertDetailData = {
                    str_tableName: 'tbl_batchsummary_detail7',
                    data: [
                        { str_colName: 'RepSerNo', value: masterSrNo },
                        { str_colName: 'RecSeqNo', value: recSeqNo },
                        { str_colName: 'Date', value: masterData.PrDate },
                        { str_colName: 'Time', value: masterData.PrTime },
                        { str_colName: 'InstrumentID', value: masterData.HardnessID },
                        { str_colName: 'Side', value: sideVal },
                        { str_colName: 'Min', value: MinHard },
                        { str_colName: 'Max', value: MaxHard },
                        { str_colName: 'Avg', value: avgHard },
                        // { str_colName: 'MinTimeDT', value: resultdata.incompleteData.T1PosTol },
                        // { str_colName: 'MaxTimeDT', value: resultdata.incompleteData.T2NegTol },
                        { str_colName: 'TestResult', value: remark },
                        { str_colName: 'UserID', value: masterData.UserId },
                        { str_colName: 'UserName', value: masterData.UserName },

                    ]
                }
                //console.log(objInsertDetailData);
                let detailResult1 = await database.save(objInsertDetailData);
                Object.assign(responseObj, { status: 'success' })
                return remark;

            } else {
                masterSrNo = resultData[0][0].SrNo;
                //     const checkDetailObj = {
                //         str_tableName: detailTable,
                //         data: 'MAX(RecSeqNo) AS SeqNo',
                //         condition: [
                //             { str_colName: 'RepSerNo', value: masterSrNo, comp: 'eq' },
                //         ]
                //     }
                //    let detailres = await database.select(checkDetailObj);
                //         var seqNum = detailres[0][0].SeqNo;
                //         var seqNo = seqNum + 1;
                const objInsertDetailData = {
                    str_tableName: 'tbl_batchsummary_detail7',
                    data: [
                        { str_colName: 'RepSerNo', value: masterSrNo },
                        { str_colName: 'RecSeqNo', value: recSeqNo },
                        { str_colName: 'Date', value: masterData.PrDate },
                        { str_colName: 'Time', value: masterData.PrTime },
                        { str_colName: 'InstrumentID', value: masterData.HardnessID },
                        { str_colName: 'Side', value: sideVal },
                        { str_colName: 'Min', value: MinHard },
                        { str_colName: 'Max', value: MaxHard },
                        { str_colName: 'Avg', value: avgHard },
                        // { str_colName: 'MinTimeDT', value: resultdata.incompleteData.T1PosTol },
                        // { str_colName: 'MaxTimeDT', value: resultdata.incompleteData.T2NegTol },
                        { str_colName: 'TestResult', value: remark },
                        { str_colName: 'UserID', value: masterData.UserId },
                        { str_colName: 'UserName', value: masterData.UserName },
                    ]
                }
                await database.save(objInsertDetailData);
                Object.assign(responseObj, { status: 'success' })
                return remark;
            }
        }
        else {
            return remark;
        }
    }

    async saveBatchDataDiff(typeValue, resultdata, IdsNo, ResultOfReport) {
        try {
            let now = new Date();
            let responseObj = {};
            let arrDetail = [];
            let strIdsNo = IdsNo;
            let strInstrumentId = "";
            let objProductType = globalData.arrProductTypeArray.find(k => k.Hmi == IdsNo)
            let objArr_limits = globalData.arr_limits.find(k => k.Hmi == IdsNo);
            let cubicalObj = globalData.arrIdsInfo.find(k => k.Hmi == IdsNo).cubicalData;
            let masterTable, detailTable, finalSum;
            // const objWeighment = objProductArray.cubicalData;
            let sum = 0;

            masterTable = 'tbl_batchsummary_masterdiff';
            detailTable = 'tbl_batchsummary_detaildiff';

            for (var i = 0; i < resultdata.detailData.length; i++) {
                var dataVal = resultdata.detailData[i].NetWeight;
                arrDetail.push(dataVal);
            }

            for (var j = 0; j < arrDetail.length; j++) {
                sum = sum + parseFloat(arrDetail[j]);
            }

            finalSum = sum;

            var count = arrDetail.length;
            // var maxVal = Math.max(...arrDetail);
            // var minVal = Math.min(...arrDetail);
            // var avgVal = (finalSum / count);
            let remark = 'Complies';
            if (ResultOfReport == 'Within of Limit') {
                remark = 'Complies';
            } else {
                remark = 'Not Complies'
            }

            var resOfSP = await objStoreProcedure.fetchDetailForStats(resultdata, 3);
            var maxVal = resOfSP[1][0]['@maxWeight'];//Math.max(...arrDetail);
            var minVal = resOfSP[1][0]['@minWeight']; //Math.min(...arrDetail);
            var avgVal = resOfSP[1][0]['@average'];  //(finalSum / count);

            if ((cubicalObj.Sys_RptType == 0) && (cubicalObj.Sys_Validation == 0) && (cubicalObj.Sys_CubType == 'Capsule Filling')) {
                let res = await proObj.productData(cubicalObj);
                var paramNom = `Param0_Nom`;
                var limitNo = `Param0_LimitOn`;
                var nom = parseFloat(res[1][paramNom]);
                var limit = res[1][limitNo].readUIntLE();
                var minPer, maxPer;
                if (limit == 0)//standard
                {
                    minPer = Math.abs(((nom - minVal) / nom) * 100);
                    maxPer = Math.abs(((maxVal - nom) / nom) * 100);
                }
                else//average
                {
                    minPer = Math.abs(((avgVal - minVal) / avgVal) * 100);
                    maxPer = Math.abs(((maxVal - avgVal) / avgVal) * 100);
                }
                if (typeValue == "D") {
                    strInstrumentId = resultdata.incompleteData.BalanceId;
                }
                let sideVal = "NA";
                if (resultdata.incompleteData.Side == 'LHS') {
                    sideVal = "LEFT";
                } else if (resultdata.incompleteData.Side == 'RHS') {
                    sideVal = "RIGHT";
                } else {
                    sideVal = "NA";
                }
                let checkSideMasterTable;
                if (resultdata.incompleteData.Side == 'NA') {
                    checkSideMasterTable = resultdata.incompleteData.Side;
                } else {
                    checkSideMasterTable = 'LEFT';
                }
                // We only want to check side for NA and left side in master table so again we declare 
                // side variable for this specific perpose
                const checkMasterObj = await models[masterTable].findAll({
                    attributes: [[sequelize.fn('max', sequelize.col('RepSerNo')), 'RepSerNo']],
                    where: {
                        BFGCode: objProductType.productType.ProductId,
                        ProductName: objProductType.productType.ProductName,
                        PVersion: objProductType.productType.ProductVersion,
                        Version: objProductType.productType.Version,
                        Side: checkSideMasterTable,
                        CubType: resultdata.incompleteData.CubicleType,
                        BatchNo: resultdata.incompleteData.BatchNo,
                    }

                })

                let resultData = [checkMasterObj];
                var masterSrNo;
                let DP = resultdata.incompleteData.DecimalPoint;


                let recSeqNo = await this.calculateSeqNo(sideVal, masterTable, detailTable,
                    resultdata.incompleteData);

                if (resultData[0][0].SrNo == null) {
                    const objInsertMasterData = await models[masterTable].create({
                        BFGCode: resultdata.incompleteData.BFGCode,
                        ProductName: resultdata.incompleteData.ProductName,
                        PVersion: resultdata.incompleteData.PVersion,
                        Version: resultdata.incompleteData.Version,
                        PrdType: resultdata.incompleteData.ProductType,
                        CubType: resultdata.incompleteData.CubicleType,
                        BatchNo: resultdata.incompleteData.BatchNo,
                        Stage: cubicalObj.Sys_Stage,
                        Dept: cubicalObj.Sys_dept,
                        Nom: nom,
                        Tol1Neg: resultdata.incompleteData.T1NegNet,
                        Tol1Pos: resultdata.incompleteData.T1PosNet,
                        Tol2Neg: resultdata.incompleteData.T2NegNet,
                        Tol2Pos: resultdata.incompleteData.T2PosNet,
                        DP: DP,
                        Unit: resultdata.incompleteData.Unit,
                        Side: sideVal,
                        BatchCompleted: resultdata.incompleteData.BatchComplete.readUIntLE(),
                        IsArchived: resultdata.incompleteData.IsArchived.readUIntLE(),
                        LimitOn: limit,
                        NMTLimit: resultdata.incompleteData.T1NMTTab,
                        Area: cubicalObj.Sys_Area,
                        GenericName: cubicalObj.Sys_GenericName,
                        BMRNo: cubicalObj.Sys_BMRNo,
                        BatchSize: `${cubicalObj.Sys_BatchSize}${cubicalObj.Sys_BatchSizeUnit}`,
                        ReportType: resultdata.incompleteData.ReportType,


                    })
                    // {
                    //     str_tableName: masterTable,
                    //     data: [
                    //         { str_colName: 'BFGCode', value: resultdata.incompleteData.BFGCode },
                    //         { str_colName: 'ProductName', value: resultdata.incompleteData.ProductName },
                    //         { str_colName: 'PVersion', value: resultdata.incompleteData.PVersion },
                    //         { str_colName: 'Version', value: resultdata.incompleteData.Version },
                    //         { str_colName: 'PrdType', value: resultdata.incompleteData.ProductType },
                    //         { str_colName: 'CubType', value: resultdata.incompleteData.CubicleType },
                    //         { str_colName: 'BatchNo', value: resultdata.incompleteData.BatchNo },
                    //         { str_colName: 'Stage', value: cubicalObj.Sys_Stage },
                    //         { str_colName: 'Dept', value: cubicalObj.Sys_dept },
                    //         { str_colName: 'Nom', value: nom },
                    //         { str_colName: 'Tol1Neg', value: resultdata.incompleteData.T1NegNet },
                    //         { str_colName: 'Tol1Pos', value: resultdata.incompleteData.T1PosNet },
                    //         { str_colName: 'Tol2Neg', value: resultdata.incompleteData.T2NegNet },
                    //         { str_colName: 'Tol2Pos', value: resultdata.incompleteData.T2PosNet },
                    //         { str_colName: 'DP', value: DP },
                    //         { str_colName: 'Unit', value: resultdata.incompleteData.Unit },
                    //         { str_colName: 'Side', value: sideVal },
                    //         { str_colName: 'BatchCompleted', value: resultdata.incompleteData.BatchComplete.readUIntLE() },
                    //         { str_colName: 'IsArchived', value: resultdata.incompleteData.IsArchived.readUIntLE() },
                    //         { str_colName: 'LimitOn', value: limit },
                    //         { str_colName: 'NMTLimit', value: resultdata.incompleteData.T1NMTTab },
                    //         { str_colName: 'Area', value: cubicalObj.Sys_Area },
                    //         { str_colName: 'GenericName', value: cubicalObj.Sys_GenericName },
                    //         { str_colName: 'BMRNo', value: cubicalObj.Sys_BMRNo },
                    //         { str_colName: 'BatchSize', value: `${cubicalObj.Sys_BatchSize} ${cubicalObj.Sys_BatchSizeUnit}` },
                    //         { str_colName: 'ReportType', value: resultdata.incompleteData.ReportType },
                    //     ]
                    // }
                    // if (serverConfig.ProjectName == 'SunHalolGuj1') {
                    //     objInsertMasterData.data.push(
                    //         { str_colName: 'Tol3Neg', value: resultdata.incompleteData.T3NegNet },
                    //         { str_colName: 'Tol3Pos', value: resultdata.incompleteData.T3PosNet },
                    //     )
                    // }
                    //date.format(now, 'YYYY-MM-DD')
                    let masterResult = [objInsertMasterData];
                    masterSrNo = masterResult[0].RepSerNo;
                    const objInsertDetailData = await models[detailTable].create({
                        RepSerNo: masterSrNo,
                        RecSeqNo: recSeqNo,
                        Date: resultdata.incompleteData.PrDate,
                        Time: resultdata.incompleteData.PrTime,
                        InstrumentID: strInstrumentId,
                        Side: sideVal,
                        MinPer: minPer,
                        MaxPer: maxPer,
                        Min: minVal,
                        Max: maxVal,
                        Avg: avgVal,
                        TestResult: remark,
                        UserID: resultdata.incompleteData.UserId,
                        UserName: resultdata.incompleteData.UserName,


                    })
                    //  {
                    //     str_tableName: detailTable,
                    //     data: [
                    //         { str_colName: 'RepSerNo', value: masterSrNo },
                    //         { str_colName: 'RecSeqNo', value: recSeqNo },
                    //         { str_colName: 'Date', value: resultdata.incompleteData.PrDate },
                    //         { str_colName: 'Time', value: resultdata.incompleteData.PrTime },
                    //         { str_colName: 'InstrumentID', value: strInstrumentId },
                    //         { str_colName: 'Side', value: sideVal },
                    //         { str_colName: 'MinPer', value: minPer },
                    //         { str_colName: 'MaxPer', value: maxPer },
                    //         { str_colName: 'Min', value: minVal },
                    //         { str_colName: 'Max', value: maxVal },
                    //         { str_colName: 'Avg', value: avgVal },
                    //         { str_colName: 'TestResult', value: remark },
                    //         { str_colName: 'UserID', value: resultdata.incompleteData.UserId },
                    //         { str_colName: 'UserName', value: resultdata.incompleteData.UserName },

                    //     ]
                    // }
                    let detailResult = objInsertDetailData;
                    Object.assign(responseObj, { status: 'success' })
                    return responseObj;
                }
                else {
                    masterSrNo = resultData[0][0].SrNo;
                    const objInsertDetailData = await models[detailTable].create({
                        RepSerNo: masterSrNo,
                        RecSeqNo: recSeqNo,
                        Date: resultdata.incompleteData.PrDate,
                        Time: resultdata.incompleteData.PrTime,
                        InstrumentID: strInstrumentId,
                        Side: sideVal,
                        MinPer: minPer,
                        MaxPer: maxPer,
                        Min: minVal,
                        Max: maxVal,
                        Avg: avgVal,
                        TestResult: remark,
                        UserID: resultdata.incompleteData.UserId,
                        UserName: resultdata.incompleteData.UserName,
                    })
                    //  {
                    //     str_tableName: detailTable,
                    //     data: [
                    //         { str_colName: 'RepSerNo', value: masterSrNo },
                    //         { str_colName: 'RecSeqNo', value: recSeqNo },
                    //         { str_colName: 'Date', value: resultdata.incompleteData.PrDate },
                    //         { str_colName: 'Time', value: resultdata.incompleteData.PrTime },
                    //         { str_colName: 'InstrumentID', value: strInstrumentId },
                    //         { str_colName: 'Side', value: sideVal },
                    //         { str_colName: 'MinPer', value: minPer },
                    //         { str_colName: 'MaxPer', value: maxPer },
                    //         { str_colName: 'Min', value: minVal },
                    //         { str_colName: 'Max', value: maxVal },
                    //         { str_colName: 'Avg', value: avgVal },
                    //         { str_colName: 'TestResult', value: remark },
                    //         { str_colName: 'UserID', value: resultdata.incompleteData.UserId },
                    //         { str_colName: 'UserName', value: resultdata.incompleteData.UserName },

                    //     ]
                    // }
                    let detailResult = objInsertDetailData;
                    Object.assign(responseObj, { status: 'success' })
                    return responseObj;
                }

            }

        }
        catch (err) {
            console.log(err);
            return err;
        }
    }


    /**
     * 
     * @param {*} masterData 
     * @param {*} idsNo 
     * @param {*} tempLodData 
     * @param {*} tempUserObject 
     * @description  `saveBatchSummaryLOD` Save the batch Summary Data for `LOD`
     */
    async saveBatchSummaryLOD(masterData, idsNo, tempLodData, tempUserObject) {
        // var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.idsNo == idsNo);
        var selectedIds = idsNo;
        // if (IPQCObject != undefined) {
        //     selectedIds = IPQCObject.selectedIds;
        // } else {
        //     selectedIds = idsNo;
        // }
        let tempMenuLOD = globalData.arrLODTypeSelectedMenu.find(k => k.idsNo == idsNo);
        var cubicalObj = globalData.arrIdsInfo.find(k => k.Hmi == selectedIds).cubicalData;
        if (((cubicalObj.Sys_RptType == 0) && (cubicalObj.Sys_Validation == 0) && (cubicalObj.Sys_CubType == 'Compression') || (cubicalObj.Sys_CubType == 'Coating'))) {
            let sideVal;
            if (cubicalObj.Sys_RotaryType == 'Double') {
                sideVal = "LEFT";
            }
            else {
                sideVal = "NA";
            }
            let checkSideMasterTable;
            if (cubicalObj.Sys_RotaryType != 'Double') {
                checkSideMasterTable = 'NA';
            } else {
                checkSideMasterTable = 'LEFT';
            }
            const checkMasterObj = await models.tbl_batchsummary_master16.findAll({
                attributes: [[sequelize.fn('max', sequelize.col('RepSerNo')), 'RepSerNo']],
                where: {
                    BFGCode: cubicalObj.Sys_BFGCode,
                    ProductName: cubicalObj.Sys_ProductName,
                    PVersion: cubicalObj.Sys_PVersion,
                    Version: cubicalObj.Sys_Version,
                    Side: checkSideMasterTable,
                    CubType: cubicalObj.Sys_CubType,
                    BatchNo: cubicalObj.Sys_Batch,

                }
            })

            var masterSrNo;
            let resultData = checkMasterObj;
            let incompleteData = {
                BFGCode: cubicalObj.Sys_BFGCode,
                ProductName: cubicalObj.Sys_ProductName,
                PVersion: cubicalObj.Sys_PVersion,
                Version: cubicalObj.Sys_Version,
                BatchNo: cubicalObj.Sys_Batch
            }
            let recSeqNo = await this.calculateSeqNo(sideVal, 'tbl_batchsummary_master16', 'tbl_batchsummary_detail16', incompleteData);
            let ProdRes = await proObj.productData(cubicalObj);
            let minTemp;
            let maxTemp;
            if (cubicalObj.Sys_Area == 'Effervescent Granulation' || cubicalObj.Sys_Area == 'Granulation') {
                minTemp = ProdRes[1]['Param1_Low'];
                maxTemp = ProdRes[1]['Param1_Upp'];
                switch (tempMenuLOD.selectedLOD) {
                    case 'GRANULES DRY ':
                        minTemp = ProdRes[1]['Param1_Low'];
                        maxTemp = ProdRes[1]['Param1_Upp'];
                        break;
                    case 'GRANULES LUB':
                        minTemp = ProdRes[1]['Param2_Low'];
                        maxTemp = ProdRes[1]['Param2_Upp'];
                        break;
                    case 'LAYER1 DRY':
                        minTemp = ProdRes[1]['Param3_Low'];
                        maxTemp = ProdRes[1]['Param3_Upp'];
                        break;
                    case 'LAYER1 LUB':
                        minTemp = ProdRes[1]['Param4_Low'];
                        maxTemp = ProdRes[1]['Param4_Upp'];
                        break;
                    case 'LAYER2 DRY':
                        minTemp = ProdRes[1]['Param5_Low'];
                        maxTemp = ProdRes[1]['Param5_Upp'];
                        break;
                    case 'LAYER2 LUB':
                        minTemp = ProdRes[1]['Param6_Low'];
                        maxTemp = ProdRes[1]['Param6_Upp'];
                        break;
                }
            } else {
                minTemp = ProdRes[1]['Param16_T1Neg'];
                maxTemp = ProdRes[1]['Param16_T1Pos'];
            }
            var now = new Date();
            let average = (((tempLodData.IniWt - tempLodData.finalWt) / tempLodData.IniWt) * 100);
            let result = 'Complies';
            if ((minTemp < average) && (average < maxTemp)) {
                result = 'Complies';
            } else {
                result = 'Not Complies';
            }
            if (resultData[0][0].SrNo == null) {
                let masterDataInsert = await models.tbl_batchsummary_master16.create({

                    BFGCode: cubicalObj.Sys_BFGCode,
                    ProductName: cubicalObj.Sys_ProductName,
                    PVersion: cubicalObj.Sys_PVersion,
                    Version: cubicalObj.Sys_Version,
                    PrdType: 1,
                    CubType: cubicalObj.Sys_CubType,
                    BatchNo: cubicalObj.Sys_Batch,
                    Stage: cubicalObj.Sys_Stage,
                    Dept: cubicalObj.Sys_dept,
                    LODLayer: 'NA',
                    Side: sideVal,
                    BatchCompleted: 0,
                    IsArchived: 0,
                    LimitOn: 0,
                    Area: cubicalObj.Sys_Area,
                    GenericName: cubicalObj.Sys_GenericName,
                    BMRNo: cubicalObj.Sys_BMRNo,
                    BatchSize: `${cubicalObj.Sys_BatchSize} ${cubicalObj.Sys_BatchSizeUnit}`,
                    ReportType: cubicalObj.Sys_RptType,

                })

                let saveBatchSumm = masterDataInsert;
                masterSrNo = saveBatchSumm[0].insertId;

                let detailDataInsert = await models.tbl_batchsummary_detail16.create({
                    RepSerNo: masterSrNo,
                    RecSeqNo: recSeqNo,
                    Date: moment().format('YYYY-MM-DD'),
                    Time: moment().format('HH:mm:ss'),
                    InstrumentID: cubicalObj.Sys_MoistID,
                    Side: 'NA',
                    Min: minTemp,
                    Max: maxTemp,
                    Avg: average,
                    TestResult: result,
                    UserID: tempUserObject.UserId,
                    UserName: tempUserObject.UserName,
                    LODStage: cubicalObj.Sys_MAStage
                })

            } else {
                masterSrNo = resultData[0][0].SrNo;
                let detailDataInsert = await models.tbl_batchsummary_detail16.create({
                    RepSerNo: masterSrNo,
                    RecSeqNo: recSeqNo,
                    Date: moment().format('YYYY-MM-DD'),
                    Time: moment().format('HH:mm:ss'),
                    InstrumentID: cubicalObj.Sys_MoistID,
                    Side: 'NA',
                    Min: minTemp,
                    Max: maxTemp,
                    Avg: average,
                    TestResult: result,
                    UserID: tempUserObject.UserId,
                    UserName: tempUserObject.UserName,
                    LODStage: cubicalObj.Sys_MAStage
                })

            }
            return 'success';
        } else {
            return 'success';
        }
    }

    async calculate_roundoff_value(actualWt, unit) {
        let ActualWt1 = actualWt
        let Actual_unit = unit
        if (Actual_unit != undefined) {
            if (Actual_unit == 'mg') {
                ActualWt1 = math.round(ActualWt1, 1)
                return ActualWt1
            } if (Actual_unit == 'g' || Actual_unit == 'gm') {
                ActualWt1 = this.math.round(ActualWt1, 4)
                return ActualWt1
            }
        }
    }


}
module.exports = BatchSummary