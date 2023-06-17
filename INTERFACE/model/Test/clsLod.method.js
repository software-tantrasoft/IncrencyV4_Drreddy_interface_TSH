const globalData = require('../../global/globalData');
const clsCommonInsertOpt = require('../Product/clsCommonInsertOperation.model');
const clsIncompleteReport = require('../Product/clsIncompleteReport');
const clsActivityLog = require('../clsActivityLog.model');
const clsInstrumentUsage = require('../clsInstrumentUsageLog');
const FormulaFunModel = require('../Product/clsformulaFun.model');
const GLOBAL_NOMENCLATURE = require('../../global/Global_Nomenclature');
const mqttProtocol = require('../../global/GLOBAL_NOMENCLATURE');
const MqttModel = require('../Mqtt/mqttSender.class');
const Database = require('../../database/clsQueryProcess');
const utillDb = require('../../Utills/db');
const clsProObj = require('../Product/clsProductDetailModel');
const date = require('date-and-time');
const clsBatchSummary = require('../Product/clsBatchSummaryOperation');
const { models } = require('../../../config/dbConnection');
const sequelize = require("../../../config/dbConnection").sequelize;
const { QueryTypes } = require("sequelize");
const momentObj = require("moment")

const database = new Database();
const objIncompleteReport = new clsIncompleteReport();
const objCommonInsertOpt = new clsCommonInsertOpt();
const objActivityLog = new clsActivityLog();
const objInstrumentUsage = new clsInstrumentUsage();
const objformulaFun = new FormulaFunModel();
const mqttSender = new MqttModel();
const proObj = new clsProObj();
const objBatchSummary = new clsBatchSummary();

const OPCops = require('../OPC/opcOps');
const objOPCops = new OPCops();

class LOD {
    /**
     * sample is not their in LOD 
     * @description LOD Data Come here
     * @param {*} IdsNo
     * @param {*} protocol
     */
    async insertBulkWeighmentLOD(dataObj) {

        var actualProtocol = dataObj.actualWt;
        let now = new Date();
        let strIdsNo = dataObj.idsNo;
        let strHmi = dataObj.Hmi;
        // var tdValue = actualProtocol.substring(0, 5);//starting 
        const tempUserObject = globalData.arrUsers.find(k => k.Hmi == strHmi);
        // var protocolIncomingType = tdValue.substring(0, 1);//here incoming protocol is check T Or H
        let selectedIdsNo;
        var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.idsNo == strIdsNo);
        if (IPQCObject != undefined) {
            selectedIdsNo = IPQCObject.selectedIds;
        } else {
            selectedIdsNo = strIdsNo;
        }

        const productObj = globalData.arrIdsInfo.find(k => k.idsNo == selectedIdsNo).cubicalData;
        let tempCounterObj = globalData.arrWeighmentCounter.find(k => k.Hmi == strHmi);
        if (tempCounterObj === undefined) {
            globalData.arrWeighmentCounter.push({ 'Hmi': strHmi, 'counter': 0 })
        }
        tempCounterObj = globalData.arrWeighmentCounter.find(k => k.Hmi == strHmi);

        if (tempCounterObj.counter == 0) {
            //insert initial and temp
            var objActivity = {};
            Object.assign(objActivity,
                { strUserId: tempUserObject.userId },
                { strUserName: tempUserObject.userName },
                { activity: 'LOD Weighment Started on IDS' + strIdsNo });
            await objActivityLog.ActivityLogEntry(objActivity);
            // Instrument usage for LOD started
            await objInstrumentUsage.InstrumentUsage('LOD', strIdsNo, 'tbl_instrumentlog_lod', 'LOD', 'started');
            await this.saveLodData(productObj, actualProtocol, tempUserObject, strIdsNo, 0, strHmi);
            tempCounterObj.counter += 1;
        } else {
            await this.saveLodData(productObj, actualProtocol, tempUserObject, strIdsNo, tempCounterObj.counter, strHmi);
        }



    }


    async saveLodData(productObj, arrLodData, tempUserObject, IdsNo, counter, strHmi) {
        try {
            var department = "";
            let responseObj = {};
            var selectedCubicle;
            var currentCubicle = globalData.arrIdsInfo.find(k => k.idsNo == IdsNo).cubicalData;
            var cubicType, GranuRepoHeading = 0, decimalPoint;
            department = productObj.Sys_dept;
            let lodData = globalData.arrProtocolData.find(k => k.Hmi == strHmi);
            let limits = globalData.arr_limits.find(k => k.Hmi == strHmi);
            limits = limits.Menus.filter(k => k.LOD != undefined)[0]
            // var objLotData = globalData.arrLot.find(k => k.idsNo == IdsNo);
            //added 16/06/23
            let hmiDetails = globalData.arrWeighmentProductData.find(k => k.Hmi == strHmi).data;
            var lodData1_value = Object.assign(arrLodData, { "Hmi": strHmi })
            if (lodData == undefined) {

                globalData.arrProtocolData.push(lodData1_value)
                // globalData.arrProtocolData.push({'strHmi':strHmi})
            }
            lodData = globalData.arrProtocolData.find(k => k.Hmi == strHmi);

            let selectedIdsNo;
            var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.idsNo == IdsNo);
            if (IPQCObject != undefined) {
                selectedIdsNo = IPQCObject.selectedIds;
            } else {
                selectedIdsNo = IdsNo;
            }

            var ProductType = globalData.arrProductTypeArray.find(k => k.idsNo == selectedIdsNo).productType; //ProductType
            if (productObj.Sys_CubType == 'IPQC' && (productObj.Sys_Area == 'Granulation' || productObj.Sys_Area == 'Effervescent Granulation'
                || productObj.Sys_Area == 'Pallet Coating')) {

                selectedCubicle = productObj;
                cubicType = 1;
                // let tempMenuLOD = globalData.arrLODTypeSelectedMenu.find(k => k.idsNo == IdsNo);
                let tempMenuLOD = globalData.arrSelectedMenu.find(k => k.idsNo == IdsNo);
                switch (tempMenuLOD.menuName) {
                    case 'GRANULES DRY': // COMPRESSED DRY
                        GranuRepoHeading = 1;
                        break;
                    case 'GRANULES LUB': //COMPRESSED LUB
                        GranuRepoHeading = 2;
                        break;
                    case 'LAYER1 DRY':
                        GranuRepoHeading = 3;
                        break;
                    case 'LAYER1 LUB':
                        GranuRepoHeading = 4;
                        break;
                    case 'LAYER2 DRY':
                        GranuRepoHeading = 5;
                        break;
                    case 'LAYER2 LUB':
                        GranuRepoHeading = 6;
                        break;
                    default:
                        // for coating and compression
                        // Finding Out the department of selected for coating and compression
                        var objGranuInfo = globalData.arrIdsInfo.find(k => k.Sys_IDSNo == IdsNo);
                        let objCompCoatInfo = globalData.arrIdsInfo.find(k => k.Sys_ProductName == objGranuInfo.Sys_ProductName
                            && k.Sys_BFGCode == objGranuInfo.Sys_BFGCode && k.Sys_PVersion == objGranuInfo.Sys_PVersion
                            && k.Sys_Version == objGranuInfo.Sys_Version && (k.Sys_Area != 'Granulation' || k.Sys_Area != 'Effervescent Granulation'));

                        department = objCompCoatInfo.Sys_dept;
                        selectedCubicle = objCompCoatInfo;
                        GranuRepoHeading = 0;
                        cubicType = 0;
                }
            } else {
                // For Compression and coating
                cubicType = 0;
                GranuRepoHeading = 0;
            }
            let now = new Date();
            // let tempLODdata = globalData.arrLodData.find(lod => lod.idsNo == IdsNo);
            lodData = globalData.arrProtocolData.find(k => k.Hmi == strHmi);
            // if (counter == 0) {
            if (lodData != undefined) {
                // here check product is from granulation or COMP & COAT
                let objSelectedLOD = globalData.arrLODTypeSelectedMenu.find(k => k.idsNo == IdsNo);
                var productTableName = "";
                if (objSelectedLOD != undefined) {
                    if (objSelectedLOD.selectedLOD == "LOD COATING") {
                        productTableName = "tbl_product_tablet_coated";
                    } else if (objSelectedLOD.selectedLOD == "LOD COMPRESSION") {
                        productTableName = "tbl_product_tablet";
                    }
                } else if (productObj.Sys_Area == 'Compression' || productObj.Sys_Area == 'Effervescent Compression') {
                    productTableName = "tbl_product_tablet";
                } else if (productObj.Sys_Area == 'Coating') {
                    productTableName = "tbl_product_tablet_coated";
                }
                // var res = await proObj.productData(productObj, productTableName);

                if (GranuRepoHeading != 0) {
                    var paramNom = `Param${GranuRepoHeading}_Nom`;
                    var paramLow = `Param${GranuRepoHeading}_Low`;
                    var paramUpp = `Param${GranuRepoHeading}_Upp`;
                    var paramDp = `Param${GranuRepoHeading}_DP`;
                    var paramIsOnStd = `Param${GranuRepoHeading}_IsOnStd`;
                } else {
                    var paramNom = `Param16_Nom`;
                    var paramLow = `Param16_T1Neg`;
                    var paramUpp = `Param16_T1Pos`;
                    var paramDp = `Param16_DP`;
                    var paramIsOnStd = `Param16_LimitOn`;
                }


                const checkData = await models.tbl_lodmaster.findAll({
                    attributes: [[sequelize.fn('max', sequelize.col('MstSerNo')), 'MstSerNo']],
                    where: {
                        BFGCode: productObj.Sys_BFGCode,
                        ProductName: productObj.Sys_ProductName,
                        PVersion: productObj.Sys_PVersion,
                        Version: productObj.Sys_Version,
                        BatchNo: productObj.Sys_Batch,
                        IdsNo: IdsNo,
                    }
                })

                let result = [[checkData]]
                var intMstSerNo;
                if (result[0][0].MstSerNo == null) {
                    intMstSerNo = 1;
                } else {
                    var newMstSerNo = result[0][0].MstSerNo + 1;
                    intMstSerNo = newMstSerNo;
                }
                const checkBRepSer = await models.tbl_lodmaster.findAll({
                    attributes: [[sequelize.fn('max', sequelize.col('RepSerNo')), 'RepSerNo']],
                    where: {
                        BFGCode: productObj.Sys_BFGCode,
                        ProductName: productObj.Sys_ProductName,
                        PVersion: productObj.Sys_PVersion,
                        Version: productObj.Sys_Version,
                        BatchNo: productObj.Sys_Batch,
                        ReportType: productObj.Sys_RptType,
                        Side: productObj.Sys_RotaryType,
                    }
                })

                let batchResult = [[checkBRepSer]];
                var intBRepSerNo;
                if (batchResult[0][0].RepSerNo == null) {
                    intBRepSerNo = 1;
                } else {
                    var newBRepSerNo = batchResult[0][0].RepSerNo + 1;
                    intBRepSerNo = newBRepSerNo;
                }
                var arrTempSplit = arrLodData["Start Weight"].split(" ");
                decimalPoint = this.precision(Number(arrTempSplit[0]));
                var saveLodData = await models.tbl_lodmaster.create({
                    MstSerNo: intMstSerNo,
                    BRepSerNo: intBRepSerNo,
                    BFGCode: productObj.Sys_BFGCode,
                    ProductName: productObj.Sys_ProductName,
                    ProductType: ProductType.ProductType,
                    IdsNo: IdsNo,
                    BatchNo: productObj.Sys_Batch,
                    StartTm: momentObj().format('HH:mm:ss'),
                    CubicleName: productObj.Sys_CubicName,
                    CubicalNo: productObj.Sys_CubicNo,
                    CubicleLocation: department,
                    InstruId: 0,
                    Side: productObj.Sys_RotaryType,
                    DryingTemp: 0,
                    SampleWt: 0,
                    LossOnWt: 0,
                    UserId: tempUserObject.userId,
                    UserName: tempUserObject.userName,
                    IsArchived: 0,
                    PrDate: momentObj().format('YYYY-MM-DD'),
                    PrTime: momentObj().format('HH:mm:ss'),
                    PrintNo: 0,
                    Remark: 0,
                    ReportType: productObj.Sys_RptType,
                    MachineId: productObj.Sys_MachineCode,
                    MinLimit: limits.LOD.T1Neg,
                    MaxLimit: limits.LOD.T1Pos,
                    Stage: productObj.Sys_Stage,
                    PrEndDate: momentObj().format('YYYY-MM-DD'),
                    PrEndTime: momentObj().format('HH:mm:ss'),
                    Unit: 0,
                    DecimalPoint: decimalPoint,
                    WgmtModeNo: 0,
                    BatchComplete: 0,
                    LODID: currentCubicle.Sys_MoistID,
                    PVersion: productObj.Sys_PVersion,
                    Version: productObj.Sys_Version,
                    LotNumber: productObj.Sys_LotNo,
                    DryWt: arrTempSplit[0],
                    MoistCont: 0,
                    RotaryType: 0,
                    BatchSize: `${productObj.Sys_BatchSize} ${productObj.Sys_BatchSizeUnit}`,
                    Layer: "0",
                    Temp: arrLodData["Drying Temp"].split(' ')[0],
                    InitalWt: arrLodData["Start Weight"].split(' ')[0],
                    FinalWt: arrLodData["End Result"].split(' ')[0],
                    IsRepoComp: cubicType,
                    GranuRepoHeading: GranuRepoHeading,
                    RepoLabel11: currentCubicle.Sys_Validation,
                    Lot: 'NA',
                    Area: productObj.Sys_Area,
                    AppearanceDesc: productObj.Sys_Appearance,
                    MachineSpeed_Min: productObj.Sys_MachineSpeed_Min,
                    MachineSpeed_Max: productObj.Sys_MachineSpeed_Max,
                    GenericName: productObj.Sys_GenericName,
                    BMRNo: productObj.Sys_BMRNo,
                })

                if (lodData == undefined) {
                    globalData.arrProtocolData.push({
                        Hmi: strHmi,
                        idsNo: IdsNo,
                        IniWt: arrTempSplit[0]
                    })
                }
                // await database.save(saveLodData);
                mqttSender.sendData(strHmi, `${mqttProtocol.DisplayResult} initialWt : ${arrTempSplit[0]} ${arrTempSplit[1]} ; 
                finalTemp : ${arrLodData['Drying Temp'].split(' ')[0]} ${arrLodData['Drying Temp'].split(' ')[1]}`);
                // Object.assign(responseObj, { status: 'success' });
                // If Initial weight completes then set initWt flag to false
                // objMonitor.monit({ case: 'LODFINWT', idsNo: IdsNo, data: { test: 'MOISTURE ANALYZER' } });
                // tempLODdata.arr[0].flag = false;
                //resolve(responseObj);
                // return `${protocolIncomingType}R0,,,,,`;
            }
            else {
                const objMasterData = await models.tbl_lodmaster.findAll({
                    attributes: [[sequelize.fn('max', sequelize.col('RepSerNo')), 'RepSerNo']],
                    where: {
                        BFGCode: productObj.Sys_BFGCode,
                        ProductName: productObj.Sys_ProductName,
                        PVersion: productObj.Sys_PVersion,
                        Version: productObj.Sys_Version,
                        BatchNo: productObj.Sys_Batch,
                        IdsNo: IdsNo,
                        IsRepoComp: cubicType,
                    }
                })


                let res = [[objMasterData]];
                var maxRepNo = res[0][0].RepSerNo;

                const updateData = await models.tbl_lodmaster.update({
                    LossOnWt: arrLodData['Start Weight'].split(' ')[0]
                }, {
                    where: {
                        RepSerNo: maxRepNo
                    }
                })


                if (lodData != undefined) {
                    lodData.Hmi = strHmi;
                    lodData.finalWt = arrLodData['Start Weight'].split(' ')[0];
                }
            }

            // objProtocolData.IniWt = ;
            // objProtocolData.finalWt = arrLodData.finalWt.split(' ')[0];
            // await database.update(updateData);
            //extra part added 16/06/23
            const objMasterData = await models.tbl_lodmaster.findAll({
                attributes: [[sequelize.fn('max', sequelize.col('RepSerNo')), 'RepSerNo']],
                where: {
                    BFGCode: productObj.Sys_BFGCode,
                    ProductName: productObj.Sys_ProductName,
                    PVersion: productObj.Sys_PVersion,
                    Version: productObj.Sys_Version,
                    BatchNo: productObj.Sys_Batch,
                    IdsNo: IdsNo,
                    // IsRepoComp: cubicType,
                }
            })


            let res = [objMasterData];
            var lastInsertedId = res[0][0].RepSerNo;
            // var maxRepNo = res.pop();
            var remark;
            var lodmaster = await models.tbl_lodmaster.findAll({
                where : {
                    RepSerNo: lastInsertedId
                }
            })
            if (parseFloat(lodmaster[0].MinLimit) <= parseFloat(arrLodData['End Result'].split(' ')[0]) &&
                parseFloat(arrLodData['End Result'].split(' ')[0]) <= parseFloat(lodmaster[0].MaxLimit)) {
                remark = "Not Complies";
            } else {
                remark = "Complies";
            }
            
    
            var objActivity = {};
            Object.assign(objActivity,
                { strUserId: tempUserObject.userId },
                { strUserName: tempUserObject.userName },
                { activity: 'LOD Weighment Completed on TSH' + strHmi });
            await objActivityLog.ActivityLogEntry(objActivity);

            // *********************OPC CODE***************
            let tempMenuLOD = globalData.arrSelectedMenu.find(k => k.idsNo == IdsNo);
            var menuName = tempMenuLOD.InstrumentType
            if (menuName == GLOBAL_NOMENCLATURE.MoistureAnalyzer) {
                var loddetail = await models.tbl_lodmaster.findAll({
                    where: {
                        RepSerNo: lastInsertedId
                    }
                })

                var lodDataOPC= {
                    BatchNo: loddetail[0].BatchNo,
                    TestStart: loddetail[0].PrTime,
                    SetDryingTemp: loddetail[0].Temp,
                    TestEnd: momentObj().format('HH:mm:ss'),
                    FinalWeight: loddetail[0].FinalWt,
                    Layer: loddetail[0].Layer,
                    ActLossOnDrying: 0,
                    Lot: 0,
                    ProdName: loddetail[0].ProductName,
                    TestResult: remark,
                    Stage: "",
                    StartWeight: loddetail[0].InitalWt,
                    TestName: tempMenuLOD.menuName
                }
                await objOPCops.MoistAnalizer(lodDataOPC, loddetail, strHmi)
            }
            // await objBatchSummary.saveBatchSummaryLOD(productObj, productObj.Sys_IDSNo, lodData, tempUserObject);
            // objMonitor.monit({ case: 'BL', idsNo: IdsNo, data: { test: 'MOISTURE ANALYZER', flag: 'COMPLETED' } });
            // var resultRemark = `R3,,,,,`;
            // var LOD = await sequelize.query(`SELECT ROUND(CAST((((DryWt-LossOnWt)/DryWt)*100) AS DECIMAL(20,15)),2) AS lodPer,ROUND(CAST(minLimit AS DECIMAL(20,15)),2)  AS MINWT,ROUND(CAST(maxLimit AS DECIMAL(20,15)),2) AS MAXWT FROM tbl_lodmaster WHERE RepSerNo=${maxRepNo}`);
            // var LOD = (((maxRepNo.InitalWt - maxRepNo.FinalWt) / maxRepNo.InitalWt) * 100)
            // // Object.assign(responseObj, { status: 'success' })
            // if (parseFloat(LOD[0][0].MINWT) < parseFloat(LOD[0][0].lodPer) &&
            //     parseFloat(LOD[0][0].lodPer) <= parseFloat(LOD[0][0].MAXWT)) {
            //     resultRemark = `R1,,,,,`;
            // } else {
            //     resultRemark = `R2,,,,,`;
            // }
            // mqttSender.sendData(strHmi, `${mqttProtocol.DisplayResult} finalWt : ${arrLodData["Start Weight"].split(' ')[0]} ${arrLodData["Start Weight"].split(' ')[1]}; lossOnWt : ${arrLodData["End Result"].split(' ')[0]}`);
            mqttSender.sendData(strHmi, `${mqttProtocol.DisplayMessage} ${remark}`);
            mqttSender.sendData(strHmi, `${mqttProtocol.DisplayMessage} LOD Test Completed`);
            // return resultRemark;
            // var objUpdateValidation = {
            //     str_tableName: "tbl_cubical",
            //     data: [
            //         { str_colName: 'Sys_Validation', value: 0 },
            //     ],
            //     condition: [
            //         { str_colName: 'Sys_IDSNo', value: IdsNo },
            //     ]
            // }
            // await database.update(objUpdateValidation);

            // For LOD We have to sent direct request to generate report
            // Online report for LOD
            // if (productObj.Sys_RptType == 0) {
            //     var objOnlineReport = {
            //         SelectedAction: maxRepNo,
            //         UserId: tempUserObject.UserId,
            //         UserName: tempUserObject.UserName,
            //         waterMark: true,
            //         SelectedValue: LOD[0][0].lodPer,
            //     }
            //     const objPrinterName = globalData.arrIdsInfo.find(k => k.Sys_IDSNo == IdsNo);

            //     var objReport = {
            //         reportOption: 'Moisture Analyzer',
            //         RepSerNo: maxRepNo
            //     }
            //     await objPrintReport.printReport(objOnlineReport, objReport, objPrinterName.Sys_PrinterName);
            // } else {
            //     // console.log('Initial report')
            // }
            //clearing and reiniting LOD DATA
            // var objLodData = globalData.arrLodData.find(LD => LD.idsNo == IdsNo);
            // if (objLodData == undefined) {
            //     globalData.arrLodData.push({ idsNo: IdsNo, arr: [] })
            // }
            // else {
            //     objLodData.arr = [];
            // }




        } catch (err) {
            // var objLodData = globalData.arrLodData.find(LD => LD.idsNo == IdsNo);
            // if (objLodData == undefined) {
            //     globalData.arrLodData.push({ idsNo: IdsNo, arr: [] })
            // }
            // else {
            //     objLodData.arr = [];
            // }
            // Error loging in Error file
            // var logError = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + " , ";
            // logError = logError + err.stack;
            // //commented by vivek on 31-07-2020*********************************** */
            // //ErrorLog.error(logError);
            // ErrorLog.addToErrorLog(logError);
            //******************************************************************* */
            console.log(err)
            throw new Error(err);
        }
    }

    precision(a) {
        if (!isFinite(a)) return 0;
        var e = 1, p = 0;
        while (Math.round(a * e) / e !== a) { e *= 10; p++; }
        return p;
    }
}
module.exports = LOD