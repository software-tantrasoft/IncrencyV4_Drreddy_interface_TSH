const Database = require("../../database/clsQueryProcess");
// const printReport = require('./clsPrintReport');
// const IOnlinePrint = require('../../../Interfaces/IOnlinePrint.model');
const GLOBAL_NOMENCLATURE = require('../../global/Global_Nomenclature');
const globalData = require("../../global/globalData");
const database = new Database();
const clsBatchSummary = require("../Product/clsBatchSummaryOperation");
// const objPrintReport = new printReport();
// const serverConfig = require('../../global/severConfig')
let clsGetMstSrAndSideSr = require("../Product/clsGetMstSrAndSideSr");
// const objGetMstSrAndSideSr = new clsGetMstSrAndSideSr()
const date = require("date-and-time");
const momentObj = require("moment");

const models = require("../../../config/dbConnection").models;
const sequelize = require("../../../config/dbConnection").sequelize;
const { QueryTypes } = require("sequelize");
// const ErrorLog = require('../clsErrorLog');
const objBatchSummary = new clsBatchSummary();
const objGetMstSrAndSideSr = new clsGetMstSrAndSideSr();

const OPCops = require('../OPC/opcOps');
const objOPCops = new OPCops();

class WeighmentDataTransfer {
  /**
   *
   * @param {*} resultdata
   * @param {*} weighmentModeNo
   * @param {*} Idsno
   */
  async saveCommonDataToComplete(resultdata, weighmentModeNo = 0, Idsno, remark, menuName) {
    try {
      var mstSerNo = "";
      var sideNo = "";
      let strIdsNo = Idsno;
      let selectedIdsNo;
      var IPQCObject = globalData.arr_IPQCRelIds.find((k) => k.Hmi == strIdsNo);
      if (IPQCObject != undefined) {
        selectedIdsNo = IPQCObject.selectedIds;
      } else {
        selectedIdsNo = strIdsNo;
      }

      var arrProductType = globalData.arrProductTypeArray.find(
        (k) => k.Hmi == selectedIdsNo
      );
      var productDetail = arrProductType.productType;
      // var objMenu = globalData.arrMultihealerMS.find(k => k.idsNo == Idsno);
      let responseObj = {};
      const checkData = await models[resultdata.completeTableName].findAll({
        attributes: [[sequelize.fn("max", sequelize.col("RepSerNo")), "RepSerNo"]],
        where: {
          BFGCode: resultdata.incompleteData.BFGCode,
          ProductName: resultdata.incompleteData.ProductName,
          PVersion: resultdata.incompleteData.PVersion,
          Version: resultdata.incompleteData.Version,
          BatchNo: resultdata.incompleteData.BatchNo,
          Idsno: resultdata.incompleteData.Idsno,
        },
      });
      if (productDetail.ProductType == 3) {
        checkData.condition.push({
          str_colName: "TestType",
          value: objMenu.menu,
          comp: "eq",
        });
      }
      var resultCompleteData = [checkData];
      var intMstSerNo;
      if (resultCompleteData[0][0].RepSerNo == null) {
        intMstSerNo = 1;
      } else {
        var newMstSerNo = resultCompleteData[0][0].RepSerNo + 1;
        intMstSerNo = newMstSerNo;
      }

      var masterCompleteData = await models[resultdata.completeTableName].create({
        MstSerNo: intMstSerNo, // modified by vivek on 03/04/2020
        SideNo: 1, // added by vivek on 03/04/2020
        InsturmentID: resultdata.incompleteData.InsturmentID,
        BFGCode: resultdata.incompleteData.BFGCode,
        ProductName: resultdata.incompleteData.ProductName,
        ProductType: resultdata.incompleteData.ProductType,
        Qty: resultdata.incompleteData.Qty,
        GrpQty: resultdata.incompleteData.GrpQty,
        GrpFreq: resultdata.incompleteData.GrpFreq,
        Idsno: resultdata.incompleteData.Idsno,
        CubicalNo: resultdata.incompleteData.CubicalNo,
        InsturmentID: resultdata.incompleteData.InsturmentID,
        // BalanceNo: resultdata.incompleteData.BalanceNo,
        // VernierId: resultdata.incompleteData.VernierId,
        // VernierNo: resultdata.incompleteData.VernierNo,
        BatchNo: resultdata.incompleteData.BatchNo,
        UserId: resultdata.incompleteData.UserId,
        UserName: resultdata.incompleteData.UserName,
        PrDate: resultdata.incompleteData.PrDate,
        PrTime: momentObj(resultdata.incompleteData.PrTime).format("HH:mm:ss"),
        PrEndDate: momentObj().format("YYYY-MM-DD"),
        PrEndTime: momentObj().format("HH:mm:ss"),
        Side: productDetail.ProductType == 2 ? "NA" : resultdata.incompleteData.Side,
        Unit: resultdata.incompleteData.Unit,
        DP: resultdata.incompleteData.DP,
        WgmtModeNo: resultdata.incompleteData.WgmtModeNo,
        Nom: resultdata.incompleteData.Nom,
        T1NegTol: resultdata.incompleteData.T1NegTol,
        T1PosTol: resultdata.incompleteData.T1PosTol,
        T2NegTol: resultdata.incompleteData.T2NegTol,
        T2PosTol: resultdata.incompleteData.T2PosTol,
        limitOn: resultdata.incompleteData.LimitOn,
        StdLimit1: resultdata.incompleteData.StdLimit1,
        StdLimit2: resultdata.incompleteData.StdLimit2,
        NomEmpty: resultdata.incompleteData.NomEmpty,
        T1NegEmpty: resultdata.incompleteData.T1NegEmpty,
        T1PosEmpty: resultdata.incompleteData.T1PosEmpty,
        T2NegEmpty: resultdata.incompleteData.T2NegEmpty,
        T2PosEmpty: resultdata.incompleteData.T2PosEmpty,
        AvgValue: resultdata.incompleteData.AvgValue,
        MinValue: resultdata.incompleteData.MinValue,
        MaxValue: resultdata.incompleteData.MaxValue,
        MinPer: resultdata.incompleteData.MinPer,
        MaxPer: resultdata.incompleteData.MaxPer,
        StdDev: resultdata.incompleteData.StdDev,
        NoOfAboveT1: resultdata.incompleteData.NoOfAboveT1,
        NoOfAboveT2: resultdata.incompleteData.NoOfAboveT2,
        NoOfBelowT1: resultdata.incompleteData.NoOfBelowT1,
        NoOfBelowT2: resultdata.incompleteData.NoOfBelowT2,
        NomNet: resultdata.incompleteData.NomNet,
        T1NegNet: resultdata.incompleteData.T1NegNet,
        T1PosNet: resultdata.incompleteData.T1PosNet,
        T2NegNet: resultdata.incompleteData.T2NegNet,
        T2PosNet: resultdata.incompleteData.T2PosNet,
        CubicleType: resultdata.incompleteData.CubicleType,
        ReportType: resultdata.incompleteData.ReportType,
        MachineCode: resultdata.incompleteData.MachineCode,
        // MFGCode: resultdata.incompleteData.MFGCode,
        BatchSize: resultdata.incompleteData.BatchSize,
        FriabilityID: resultdata.incompleteData.FriabilityID,
        HardnessID: resultdata.incompleteData.HardnessID,
        CubicleName: resultdata.incompleteData.CubicleName,
        CubicleLocation: resultdata.incompleteData.CubicleLocation,
        RepoLabel10: resultdata.incompleteData.RepoLabel10,
        RepoLabel11: resultdata.incompleteData.RepoLabel11,
        RepoLabel12: resultdata.incompleteData.RepoLabel12,
        RepoLabel13: resultdata.incompleteData.RepoLabel13,
        RepoLabel14: resultdata.incompleteData.RepoLabel14,
        PrintNo: resultdata.incompleteData.PrintNo,
        IsArchived: resultdata.incompleteData.IsArchived,
        GraphType: resultdata.incompleteData.GraphType,
        BatchComplete: resultdata.incompleteData.BatchComplete,
        PVersion: resultdata.incompleteData.PVersion,
        Version: resultdata.incompleteData.Version,
        CheckedByID: resultdata.incompleteData.CheckedByID,
        CheckedByName: resultdata.incompleteData.CheckedByName,
        CheckedByDate: resultdata.incompleteData.CheckedByDate,
        BRepSerNo: resultdata.incompleteData.BRepSerNo,
        // T1NMTTab :resultdata.incompleteDataTab,
        Lot: resultdata.incompleteData.Lot,
        Area: resultdata.incompleteData.Area,
        AppearanceDesc: resultdata.incompleteData.AppearanceDesc,
        MachineSpeed_Min: resultdata.incompleteData.MachineSpeed_Min,
        MachineSpeed_Max: resultdata.incompleteData.MachineSpeed_Max,
        GenericName: resultdata.incompleteData.GenericName,
        BMRNo: resultdata.incompleteData.BMRNo,
        Remark: remark
      });


      var resultCompleteData = [masterCompleteData];
      var lastInsertedID = resultCompleteData[0].dataValues.RepSerNo;
      // var incompleteTableName = resultdata.incompleteTableName

      var fetchMasterRecord = await models[
        resultdata.completeTableName
      ].findAll({
        where: {
          RepSerNo: lastInsertedID,
        },
      });

      var objfetchMasterRecord = fetchMasterRecord;

      for (const [i, v] of resultdata.detailData.entries()) {
        const insertDetailObj = {
          RepSerNo: lastInsertedID,
          RecSeqNo: i + 1,
          DataValue: v.DataValue,
          DP: v.DP,
          MstSerNo: objfetchMasterRecord[0].MstSerNo,
          UserId: objfetchMasterRecord[0].UserId,
          UserName: objfetchMasterRecord[0].UserName,
          PrDate: momentObj().format("YYYY-MM-DD"),
          PrTime: momentObj().format("HH:mm:ss"),
          PrEndDate: momentObj().format("YYYY-MM-DD"),
          PrEndTime: momentObj().format("HH:mm:ss"),
        };

        if (productDetail.ProductType == 3) {
          insertDetailObj.data.push({
            str_colName: "DataValue1",
            value: v.DataValue1,
          });
          insertDetailObj.data.push({
            str_colName: "NetWeight",
            value: v.NetWeight,
          });
          insertDetailObj.data.push({ str_colName: "Remark", value: v.Remark });
        } else if (
          (productDetail.ProductType == 2 || productDetail.ProductType == 4) &&
          weighmentModeNo == "D"
        ) {
          // insertDetailObj.data.push({ DataValue1: v.DataValue1 })
          Object.assign(insertDetailObj, { DataValue1: v.DataValue1 });
          // insertDetailObj.data.push({NetWeight: v.NetWeight })
          Object.assign(insertDetailObj, { NetWeight: v.NetWeight });
        }
        let res = await models[resultdata.detailTableName].create(
          insertDetailObj
        );
      }

      const deleteIncompleteData = await models[
        resultdata.incompleteTableName
      ].destroy({
        where: {
          RepSerNo: resultdata.incompleteData.RepSerNo,
        },
      });

      let res = [deleteIncompleteData];

      const deleteIncompleteDetailData = await models[
        resultdata.incompletedetailTableName
      ].destroy({
        where: {
          RepSerNo: resultdata.incompleteData.RepSerNo,
        },
      });

      let res1 = deleteIncompleteDetailData;
      //Online Printing
      // const objIOnlinePrint = new IOnlinePrint();
      // objIOnlinePrint.RepSerNo = lastInsertedID;
      // switch (resultdata.incompleteData.WgmtModeNo) {
      //     case 1:
      //         objIOnlinePrint.reportOption = "Individual";
      //         //calculation = true;
      //         break;
      //     case 3:
      //         objIOnlinePrint.reportOption = "Thickness";
      //         //calculation = true;
      //         break;
      //     case 4:
      //         objIOnlinePrint.reportOption = "Breadth";
      //         //calculation = true;
      //         break;
      //     case 5:
      //         objIOnlinePrint.reportOption = "Length";
      //         //calculation = true;
      //         break;
      //     case 6:
      //         objIOnlinePrint.reportOption = "Diameter";
      //         // calculation = true;
      //         break;
      //     case 9:
      //         objIOnlinePrint.reportOption = "Individual Layer";
      //         //calculation = true;
      //         break;
      //     case 11:
      //         objIOnlinePrint.reportOption = "Individual Layer1";
      //         //calculation = true;
      //         break;
      //     default:
      //         break;
      // }
      //print online Report for Regular only
      // if (resultdata.incompleteData.ReportType == 0 && globalData.arrsAllParameters[0].tbl_PrintingMode == 'Auto') {
      //     objIOnlinePrint.testType = "Regular";
      //     objIOnlinePrint.userId = resultdata.incompleteData.UserId;
      //     objIOnlinePrint.username = resultdata.incompleteData.UserName;
      //     objIOnlinePrint.idsNo = Idsno
      //     const objPrinterName = globalData.arrIdsInfo.find(k => k.Sys_IDSNo == Idsno);
      //     await objPrintReport.generateOnlineReport(objIOnlinePrint, objPrinterName.Sys_PrinterName);
      // }

      // ***************************** OPC CODE ******************************************
      var mastertable = resultdata.completeTableName;
      if (menuName == GLOBAL_NOMENCLATURE.IndividualMenu) {
        var masterDetail = await models[mastertable].findAll({
          where: {
            RepSerNo: checkData[0].RepSerNo
          }
        })

        var maxDetail = await models[resultdata.detailTableName].findAll({
          where: {
            RepSerNo: checkData[0].RepSerNo
          }
        })

        var IndiviData = {
          TestName: menuName,
          ProductName: masterDetail[0].ProductName,
          TestStart: masterDetail[0].PrTime,
          // NoOfSample_GrpWt: 0,
          NoOfSample_IndiWt: masterDetail[0].Qty,
          BatchNo: masterDetail[0].BatchNo,
          Side: masterDetail[0].Side,
          // ActMaximumGrpWeight: 0,
          // ActMinimumGrpWeight: 0,
          // AverageGrpWeight: 0,
          ActMaximumIndiWeight: masterDetail[0].MaxValue,
          ActMinimumIndiWeight: masterDetail[0].MinValue,
          AverageIndiWeight: masterDetail[0].AvgValue,
          // TestResult_GrpWtVariation: false,
          TestResult_IndiWtVariation: masterDetail[0].Remark,
          TestEnd: momentObj().format("HH:mm:ss"),
          // Lot: "",
          // AverageValue: 0
        }
        await objOPCops.Balance(menuName, IndiviData, resultdata)

      }

      Object.assign(responseObj, { status: "success", RepSerNo: lastInsertedID });

      return responseObj;
    } catch (err) {
      console.log("Error message : " + err);
      // var logError = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + " , " + err;
      // logError = logError + err;
      // //commented by vivek on 31-07-2020*********************************** */
      // //ErrorLog.error(logError);
      // ErrorLog.addToErrorLog(logError);
      //******************************************************************* */
      throw new Error(err);
    }
  }

  async saveCommonDataToCompleteHardness(resultdata, weighmentModeNo = 0, Idsno) {
    try {
      var mstSerNo = "";
      var sideNo = "";

      let selectedIdsNo;
      var IPQCObject = globalData.arr_IPQCRelIds.find((k) => k.idsNo == Idsno);
      if (IPQCObject != undefined) {
        selectedIdsNo = IPQCObject.selectedIds;
      } else {
        selectedIdsNo = Idsno;
      }

      var arrProductType = globalData.arrProductTypeArray.find(
        (k) => k.idsNo == selectedIdsNo
      );

      let cubicalObj = globalData.arrIdsInfo.find(k => k.idsNo == selectedIdsNo).cubicalData;

      var productDetail = arrProductType.productType;
      // var objMenu = globalData.arrMultihealerMS.find(k => k.idsNo == Idsno);
      let responseObj = {};

      let tableName = resultdata.completeTableName;

      const checkData = await models[tableName].findAll({
        attributes: [[sequelize.fn("max", sequelize.col("MstSerNo")), "SeqNo"]],
        where: {
          BFGCode: cubicalObj.Sys_BFGCode,
          ProductName: cubicalObj.Sys_ProductName,
          PVersion: cubicalObj.Sys_PVersion,
          Version: cubicalObj.Sys_Version,
          BatchNo: cubicalObj.Sys_Batch,
        },
      });

      // const checkData = {
      //     str_tableName: resultdata.completeTableName,
      //     data: 'MAX(MstSerNo) AS SeqNo',
      //     condition: [
      //         { str_colName: 'BFGCode', value: resultdata.incompleteData.BFGCode, comp: 'eq' },
      //         { str_colName: 'ProductName', value: resultdata.incompleteData.ProductName, comp: 'eq' },
      //         { str_colName: 'PVersion', value: resultdata.incompleteData.PVersion, comp: 'eq' },
      //         { str_colName: 'Version', value: resultdata.incompleteData.Version, comp: 'eq' },
      //         { str_colName: 'BatchNo', value: resultdata.incompleteData.BatchNo, comp: 'eq' },
      //         { str_colName: 'Idsno', value: resultdata.incompleteData.Idsno, comp: 'eq' },
      //     ]
      // }

      var resultCompleteData = checkData

      var intMstSerNo;
      if (resultCompleteData[0].SeqNo == null) {
        intMstSerNo = 1;
      } else {
        var newMstSerNo = resultCompleteData[0].SeqNo + 1;
        intMstSerNo = newMstSerNo;
      }

      const masterCompleteData = await models.tbl_tab_masterhtd.create({
        MstSerNo: 1,
        InstruId: resultdata.incompleteData.InstruId,
        BFGCode: resultdata.incompleteData.BFGCode,
        ProductName: resultdata.incompleteData.ProductName,
        ProductType: resultdata.incompleteData.ProductType,
        Qty: parseInt(resultdata.incompleteData.Qty),
        GrpQty: 0,
        GrpFreq: 0,
        Idsno: resultdata.incompleteData.Idsno,
        CubicalNo: resultdata.incompleteData.CubicalNo,
        BalanceId: resultdata.incompleteData.BalanceId,
        BalanceNo: resultdata.incompleteData.BalanceNo,
        VernierId: resultdata.incompleteData.VernierId,
        VernierNo: resultdata.incompleteData.VernierNo,
        BatchNo: resultdata.incompleteData.BatchNo,
        UserId: resultdata.incompleteData.UserId,
        UserName: resultdata.incompleteData.UserName,
        PrDate: momentObj().format("YYYY-MM-DD"),
        PrTime: momentObj().format("HH:mm:ss"),
        Side: resultdata.incompleteData.Side,
        Unit: resultdata.incompleteData.Unit,
        DecimalPoint: resultdata.incompleteData.DecimalPoint,
        WgmtModeNo: resultdata.incompleteData.WgmtModeNo,
        NomThick: resultdata.incompleteData.NomThick,
        PosTolThick: resultdata.incompleteData.PosTolThick,
        NegTolThick: resultdata.incompleteData.NegTolThick,
        NomHard: resultdata.incompleteData.NomHard,
        PosTolHard: resultdata.incompleteData.PosTolHard,
        NegTolHard: resultdata.incompleteData.NegTolHard,
        NomDOLOBO: resultdata.incompleteData.NomDOLOBO,
        PosTolDOLOBO: resultdata.incompleteData.PosTolDOLOBO,
        NegTolDOLOBO: resultdata.incompleteData.NegTolDOLOBO,
        ColHeadDOLOBO: resultdata.incompleteData.ColHeadDOLOBO,
        CubicleType: resultdata.incompleteData.CubicleType,
        ReportType: resultdata.incompleteData.ReportType,
        MachineCode: resultdata.incompleteData.MachineCode,
        MFGCode: resultdata.incompleteData.MFGCode,
        BatchSize: resultdata.incompleteData.BatchSize,
        HardnessID: resultdata.incompleteData.HardnessID,
        CubicleName: resultdata.incompleteData.CubicleName,
        CubicleLocation: resultdata.incompleteData.CubicleLocation,
        RepoLabel10: resultdata.incompleteData.RepoLabel10,
        RepoLabel11: 0,
        RepoLabel12: "Null",
        RepoLabel13: "Null",
        IsArchived: 0,
        GraphType: 0,
        PVersion: resultdata.incompleteData.PVersion,
        Version: resultdata.incompleteData.Version,
        BRepSerNo: resultdata.incompleteData.BRepSerNo,
        Lot: resultdata.incompleteData.Lot,
        Area: resultdata.incompleteData.Area,
      });

      var lastInsertedID = masterCompleteData._previousDataValues.RepSerNo;

      for (let [i, v] of resultdata.detailData.entries()) {
        let tableName = resultdata.detailTableName;
        const insertDetailObj = await models[tableName].create({
          RepSerNo: lastInsertedID,
          RecSeqNo: i + 1,
          DataValueThick: v.DataValueThick,
          DataValueDOLOBO: v.DataValueDOLOBO,
          DataValueHard: v.DataValueHard,
          DecimalPointThick: v.DecimalPointThick,
          DecimalPointDOLOBO: v.DecimalPointDOLOBO,
          DecimalPointHard: v.DecimalPointHard,
          idsNo: v.idsNo,
        });
        // const insertDetailObj = {
        //     str_tableName: resultdata.detailTableName,
        //     data: [
        //         { str_colName: 'RepSerNo', value: lastInsertedID },
        //         { str_colName: 'RecSeqNo', value: i + 1 },
        //         { str_colName: 'DataValueThick', value: v.DataValueThick },
        //         { str_colName: 'DataValueDOLOBO', value: v.DataValueDOLOBO },
        //         { str_colName: 'DataValueHard', value: v.DataValueHard },
        //         { str_colName: 'DecimalPointThick', value: v.DecimalPointThick },
        //         { str_colName: 'DecimalPointDOLOBO', value: v.DecimalPointDOLOBO },
        //         { str_colName: 'DecimalPointHard', value: v.DecimalPointHard },
        //         { str_colName: 'idsNo', value: v.idsNo }
        //     ]
        // }

        // let res = await database.save(insertDetailObj)
      }

      const deleteIncompleteData = await models[
        resultdata.incompleteTableName
      ].destroy({
        where: {
          RepSerNo: resultdata.incompleteData.RepSerNo,
        },
      });

      // const deleteIncompleteData = {
      //     str_tableName: resultdata.incompleteTableName,
      //     condition: [
      //         { str_colName: 'RepSerNo', value: resultdata.incompleteData.RepSerNo, comp: 'eq' },

      //     ]
      // }
      // let res = await database.delete(deleteIncompleteData);

      // const deleteIncompleteDetailData = {
      //     str_tableName: resultdata.incompletedetailTableName,
      //     condition: [
      //         { str_colName: 'RepSerNo', value: resultdata.incompleteData.RepSerNo, comp: 'eq' },
      //     ]
      // }
      // let res1 = await database.delete(deleteIncompleteDetailData);

      const deleteIncompleteDetailData = await models[
        resultdata.incompletedetailTableName
      ].destroy({
        where: {
          RepSerNo: resultdata.incompleteData.RepSerNo,
        },
      });

      Object.assign(responseObj, { status: "success" });

      return responseObj;

    } catch (err) {

      console.log("Error message : " + err);
      // var logError = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + " , " + err;
      // logError = logError + err;
      // //commented by vivek on 31-07-2020*********************************** */
      // //ErrorLog.error(logError);
      // ErrorLog.addToErrorLog(logError);
      //******************************************************************* */
      throw new Error(err);
    }
  }

  async saveHardnessData8M(resultdata, srno, idsNo, strHmi, tableName) {
    try {
      var mstSerNo = "";
      var sideNo = "";
      let responseObj = {};
      const getIncompleteMasterData = await models[
        "tbl_tab_master_htd_incomplete"
      ].findAll({
        where: {
          RepSerNo: srno,
          Idsno: strHmi, //strHmi
        },
      });

      var masterData = [getIncompleteMasterData];
      var completeMastData = masterData[0][0];


      //idsno to strHmi
      const checkMasterData = await models[tableName].findAll({
        attributes: [[sequelize.fn("max", sequelize.col("RepSerNo")), "RepSerNo"]],
        where: {
          BFGCode: completeMastData.BFGCode,
          ProductName: completeMastData.ProductName,
          PVersion: completeMastData.PVersion,
          Version: completeMastData.Version,
          BatchNo: completeMastData.BatchNo,
          Idsno: strHmi, //strHmi
        },
      });
      var result = [checkMasterData];
      var intMstSerNo;

      if (result[0][0].RepSerNo == null) {
        intMstSerNo = 1;
      } else {
        var newMstSerNo = result[0][0].RepSerNo + 1;
        intMstSerNo = newMstSerNo;
      }
      var mstTblName = "tbl_tab_master_htd";
      if (completeMastData.ReportType == 1) {
        //for Initial
        mstSerNo = intMstSerNo;
        sideNo = 1;
      } else {
        //regular
        let objMt50Like8M = {
          tableName: mstTblName,
          ReportType: 0,
          Side: completeMastData.Side,
          BFGCode: completeMastData.BFGCode,
          ProductName: completeMastData.ProductName,
          PVersion: completeMastData.PVersion,
          Version: completeMastData.Version,
          BatchNo: completeMastData.BatchNo,
          IdsNo: completeMastData.Idsno,
        };
        if (completeMastData.Side == "NA") {
          mstSerNo = await objGetMstSrAndSideSr.getRegularLRMstSerialNo(
            objMt50Like8M
          );
          sideNo = await objGetMstSrAndSideSr.getRegularLRSideNo(objMt50Like8M);

          if (sideNo < 10) {
            sideNo = sideNo + 1;
          } else {
            sideNo = 1;
            mstSerNo = mstSerNo + 1;
          }
        } else {
          mstSerNo = await objGetMstSrAndSideSr.getRegularLRMstSerialNo(
            objMt50Like8M
          );
          sideNo = await objGetMstSrAndSideSr.getRegularLRSideNo(objMt50Like8M);

          if (sideNo < 5) {
            sideNo = sideNo + 1;
          } else {
            sideNo = 1;
            mstSerNo = mstSerNo + 1;
          }
        }
      }

      let now = new Date();

      var remark_forHard;
      if (resultdata.incompleteData.AvgValueHard != 0 && resultdata.incompleteData.AvgValueHard != 'NA') {
        if ((Number(completeMastData.NoOfAboveT2Hard) != 0 || Number(completeMastData.NoOfBelowT2Hard) != 0)) {
          remark_forHard = 'Not Complies';
        } else {
          remark_forHard = 'Complies';
        }
      } else {
        remark_forHard = 'NA';
      }

      var remark_forthick;
      if (resultdata.incompleteData.AvgValueThick != 0 && resultdata.incompleteData.AvgValueThick != 'NA') {
        if ((Number(completeMastData.NoOfAboveT2Thick) != 0 || Number(completeMastData.NoOfBelowT2Thick) != 0)) {
          remark_forthick = 'Not Complies';
        } else {
          remark_forthick = 'Complies';
        }
      } else {
        remark_forthick = 'NA';
      }


      const masterCompleteData = await models["tbl_tab_master_htd"].create({
        MstSerNo: mstSerNo,
        WgmtModeNo: completeMastData.WgmtModeNo,
        Area: completeMastData.Area,
        CubicalNo: completeMastData.CubicalNo,
        CubicleName: completeMastData.CubicleName,
        CubicleType: completeMastData.CubicleType,
        Dept: completeMastData.Dept,
        BMRNo: completeMastData.BMRNo,
        BFGCode: completeMastData.BFGCode,
        BatchNo: completeMastData.BatchNo,
        ProductName: completeMastData.ProductName,
        ProductType: completeMastData.ProductType,
        PVersion: completeMastData.PVersion,
        Version: completeMastData.Version,
        MachineCode: completeMastData.MachineCode,
        BatchSize: completeMastData.BatchSize,
        Qty: completeMastData.Qty,
        Idsno: completeMastData.Idsno,
        InsturmentID: completeMastData.InsturmentID,
        UserId: completeMastData.UserId,
        UserName: completeMastData.UserName,
        PrDate: completeMastData.PrDate,
        PrTime: momentObj(completeMastData.PrTime).format("HH:mm:ss"),
        PrEndDate: momentObj().format("YYYY-MM-DD"),
        PrEndTime: momentObj().format("HH:mm:ss"),
        Side: completeMastData.Side,
        Unit: completeMastData.Unit,
        DP: completeMastData.DP,
        NomHard: completeMastData.NomHard,
        NomThick: completeMastData.NomThick,
        T1NegTolHard: completeMastData.T1NegTolHard,
        T1PosTolHard: completeMastData.T1PosTolHard,
        T2NegTolHard: completeMastData.T2NegTolHard,
        T2PosTolHard: completeMastData.T2PosTolHard,
        T1NegTolThick: completeMastData.T1NegTolThick,
        T1PosTolThick: completeMastData.T1PosTolThick,
        T2NegTolThick: completeMastData.T2NegTolThick,
        T2PosTolThick: completeMastData.T2PosTolThick,
        LimitOn: completeMastData.LimitOn,
        T1NMT: completeMastData.T1NMT,
        ReportType: completeMastData.ReportType,
        AvgValueHard: completeMastData.AvgValueHard,
        MinValueHard: completeMastData.MinValueHard,
        MaxValueHard: completeMastData.MaxValueHard,
        AvgValueThick: completeMastData.AvgValueThick,
        MinValueThick: completeMastData.MinValueThick,
        MaxValueThick: completeMastData.MaxValueThick,
        StdDevHard: completeMastData.StdDevHard,
        StdDevThick: completeMastData.StdDevThick,
        NoOfAboveT1Hard: completeMastData.NoOfAboveT1Hard,
        NoOfAboveT2Hard: completeMastData.NoOfAboveT2Hard,
        NoOfBelowT1Hard: completeMastData.NoOfBelowT1Hard,
        NoOfBelowT2Hard: completeMastData.NoOfBelowT2Hard,
        NoOfAboveT1Thick: completeMastData.NoOfAboveT1Thick,
        NoOfAboveT2Thick: completeMastData.NoOfAboveT2Thick,
        NoOfBelowT1Thick: completeMastData.NoOfBelowT1Thick,
        NoOfBelowT2Thick: completeMastData.NoOfBelowT2Thick,
        RemarkHard: remark_forHard,
        RemarkThick: remark_forthick

      });

      //console.log(masterCompleteData);
      var masterSrno = [masterCompleteData];
      var lastInsertedId = masterCompleteData._previousDataValues.RepSerNo;


      const getIncompleteDetailData = await models[
        "tbl_tab_detailhtd_incomplete"
      ].findAll({
        where: {
          RepSerNo: srno,
        },
      });
      //var completedetailData = [getIncompleteDetailData][0][0];
      var completedetailData = [getIncompleteDetailData][0];


      for (const [i, v] of resultdata.detailData.entries()) {
        const insertDetailObj = await models["tbl_tab_detailhtd"].create({
          RepSerNo: lastInsertedId,
          MstSerNo: 0,
          RecSeqNo: i + 1,
          DataValueHard: v.DataValueHard,
          DataValueThick: v.DataValueThick,
          DP: v.DP,
        });
      }


      const deleteIncompleteMasterData = await models[
        "tbl_tab_master_htd_incomplete"
      ].destroy({
        where: {
          RepSerNo: srno,
          Idsno: strHmi,
        },
      });


      const deleteIncompleteDetailData = await models[
        "tbl_tab_detailhtd_incomplete"
      ].destroy({
        where: {
          RepSerNo: srno,
        },
      });

      Object.assign(responseObj, { status: "success", RepSerNo: lastInsertedId });

      // return remarkRes;
      return responseObj;
    } catch (err) {
      //******************************************************************* */
      console.log("error from Hardness Saving", err);
    }
  }

  async saveDataToCompletePerFineAndParticalSizing(resultdata, weighmentModeNo = 0, Idsno) {
    try {
      let now = new Date();
      var mstSerNo = "";
      var sideNo = "";
      var arrProductType = globalData.arrProductTypeArray.find((k) => k.idsNo == Idsno);
      var productDetail = arrProductType.productType;
      // var objMenu = globalData.arrMultihealerMS.find(k => k.idsNo == Idsno);
      let responseObj = {};
      var str_tableName = resultdata.completeTableName;
      const checkData = await models[str_tableName].findAll({
        attributes: [[sequelize.fn('max', sequelize.col('RepSerNo')), 'RepSerNo']],
        where: {
          BFGCode: resultdata.incompleteData.BFGCode,
          ProductName: resultdata.incompleteData.ProductName,
          PVersion: resultdata.incompleteData.PVersion,
          Version: resultdata.incompleteData.Version,
          BatchNo: resultdata.incompleteData.BatchNo,
          Idsno: resultdata.incompleteData.Idsno
        }
      })
      if (productDetail.ProductType == 3) {
        checkData.condition.push({
          str_colName: "TestType",
          value: objMenu.menu,
          comp: "eq",
        });
      }
      var resultCompleteData = checkData;
      var intMstSerNo;
      if (resultCompleteData[0].SeqNo == null) {
        intMstSerNo = 1;
      } else {
        var newMstSerNo = resultCompleteData[0].SeqNo + 1;
        intMstSerNo = newMstSerNo;
      }

      var masterCompleteData = await models[str_tableName].create({
        MstSerNo: intMstSerNo,
        InstruId: 1,
        BFGCode: resultdata.incompleteData.BFGCode,
        ProductName: resultdata.incompleteData.ProductName,
        ProductType: resultdata.incompleteData.ProductType,
        Qty: resultdata.incompleteData.Qty,
        GrpQty: resultdata.incompleteData.GrpQty,
        GrpFreq: resultdata.incompleteData.GrpFreq,
        Idsno: resultdata.incompleteData.Idsno,
        CubicalNo: resultdata.incompleteData.CubicalNo,
        BalanceId: resultdata.incompleteData.BalanceId,
        VernierId: resultdata.incompleteData.VernierId,
        BatchNo: resultdata.incompleteData.BatchNo,
        UserId: resultdata.incompleteData.UserId,
        UserName: resultdata.incompleteData.UserName,
        PrDate: momentObj().format("YYYY-MM-DD"),
        PrTime: momentObj().format("HH:mm:ss"),
        Side: "NA",
        Unit: resultdata.incompleteData.Unit,
        DecimalPoint: resultdata.incompleteData.DecimalPoint,
        WgmtModeNo: resultdata.incompleteData.WgmtModeNo,
        Nom: 0,
        T1NegTol: resultdata.incompleteData.T1NegTol,
        T1PosTol: resultdata.incompleteData.T1PosTol,
        CubicleType: resultdata.incompleteData.CubicleType,
        ReportType: resultdata.incompleteData.ReportType,
        MachineCode: resultdata.incompleteData.MachineCode,
        MFGCode: resultdata.incompleteData.MFGCode,
        BatchSize: `${resultdata.incompleteData.BatchSize} ${resultdata.incompleteData.Unit}`,
        FriabilityID: resultdata.incompleteData.FriabilityID,
        HardnessID: resultdata.incompleteData.HardnessID,
        CubicleName: resultdata.incompleteData.CubicleName,
        CubicleLocation: resultdata.incompleteData.CubicleLocation,
        RepoLabel10: resultdata.incompleteData.RepoLabel10,
        RepoLabel11: resultdata.incompleteData.RepoLabel11,
        PrintNo: 0,
        IsArchived: 0,
        GraphType: 0,
        BatchComplete: 0,
        PVersion: resultdata.incompleteData.PVersion,
        Version: resultdata.incompleteData.Version,
        Lot: resultdata.incompleteData.Lot, //objLotData.LotNo
        AppearanceDesc: resultdata.incompleteData.AppearanceDesc,
        MachineSpeed_Min: resultdata.incompleteData.MachineSpeed_Min,
        MachineSpeed_Max: resultdata.incompleteData.MachineSpeed_Max,
        GenericName: resultdata.incompleteData.GenericName,
        BMRNo: resultdata.incompleteData.BMRNo,
      })
      var resultCompleteData = masterCompleteData;
      var lastInsertedID = resultCompleteData.dataValues.RepSerNo;

      var fetchMasterRecord = await models[str_tableName].findAll({
        attributes: [[sequelize.fn('max', sequelize.col('RepSerNo')), 'RepSerNo']],
      }, {
        where: {
          RepSerNo: lastInsertedID,
        }
      }
      )
      var objfetchMasterRecord = fetchMasterRecord;

      for (const [i, v] of resultdata.detailData.entries()) {
        const insertDetailObj = await models[resultdata.detailTableName].create({
          RepSerNo: lastInsertedID,
          RecSeqNo: i + 1,
          DataValue: v.DataValue,
          DecimalPoint: v.DecimalPoint,
          MstSerNo: objfetchMasterRecord[0].RepSerNo
        })

        var respose = insertDetailObj;
      }

      const deleteIncompleteData = await models[resultdata.incompleteTableName].destroy({
        where: {
          RepSerNo: resultdata.incompleteData.RepSerNo
        }
      });
      const deleteIncompleteDetailData = await models[resultdata.incompletedetailTableName].destroy({
        where: {
          RepSerNo: resultdata.incompleteData.RepSerNo
        }

      });
      const powerdelete = await models.tbl_powerbackup.destroy({
        where: {
          Sys_Batch: resultdata.incompleteData.BatchNo,
          Idsno: resultdata.incompleteData.Idsno
        }
      })


      Object.assign(responseObj, { status: "success" });

      return responseObj;
    } catch (err) {
      console.log("Error message : " + err);
      throw new Error(err);
    }
  }

  async saveDiffDataToComplete(resultdata, weighmentModeNo = 0, Idsno) {
    try {
      var mstSerNo = '';
      var sideNo = '';
      let strIdsNo = Idsno;
      let selectedIdsNo;


      var arrProductType = globalData.arrProductTypeArray.find(k => k.Hmi == strIdsNo);
      var productDetail = arrProductType.productType;
      // var objMenu = globalData.arrMultihealerMS.find(k => k.idsNo == Idsno);
      let tempUserObject = globalData.arrUsers.find(k => k.Hmi == strIdsNo);
      let responseObj = {};
      const checkData = await models[resultdata.completeTableName].findAll({
        attributes: [[sequelize.fn('max', sequelize.col('MstSerNo')), 'SeqNo']],
        where: {
          BFGCode: resultdata.incompleteData.BFGCode,
          ProductName: resultdata.incompleteData.ProductName,
          PVersion: resultdata.incompleteData.PVersion,
          Version: resultdata.incompleteData.Version,
          BatchNo: resultdata.incompleteData.BatchNo,
          Idsno: resultdata.incompleteData.Idsno,

        }
      })
      var checkData1 = await models[resultdata.incompleteTableName].findAll({
        attributes: [[sequelize.fn('max', sequelize.col('MstSerNo')), 'SeqNo']],
        where: {
          BFGCode: resultdata.incompleteData.BFGCode,
          ProductName: resultdata.incompleteData.ProductName,
          PVersion: resultdata.incompleteData.PVersion,
          Version: resultdata.incompleteData.Version,
          BatchNo: resultdata.incompleteData.BatchNo,
          Idsno: resultdata.incompleteData.Idsno,

        }
      })
      checkData1 = checkData1[0].SeqNo


      if (productDetail.ProductType == 3) {
        checkData.condition.push({ str_colName: 'TestType', value: objMenu.menu, comp: 'eq' })
      }
      var resultCompleteData = [checkData];
      var intMstSerNo;
      if (resultCompleteData[0][0].SeqNo == null) {
        intMstSerNo = 1;
      } else {
        var newMstSerNo = resultCompleteData[0][0].SeqNo + 1;
        intMstSerNo = newMstSerNo;
      }
      intMstSerNo = Math.max(checkData1, intMstSerNo)


      var masterCompleteData = await models[resultdata.completeTableName].create({
        MstSerNo: intMstSerNo,
        SideNo: 0,
        InstruId: resultdata.incompleteData.InstruId,
        BFGCode: resultdata.incompleteData.BFGCode,
        ProductName: resultdata.incompleteData.ProductName,
        ProductType: 2,
        Qty: resultdata.incompleteData.Qty,
        GrpQty: resultdata.incompleteData.GrpQty,
        GrpFreq: resultdata.incompleteData.GrpFreq,
        Idsno: resultdata.incompleteData.Idsno,
        CubicalNo: resultdata.incompleteData.CubicalNo,
        BalanceId: resultdata.incompleteData.BalanceId,
        BalanceNo: resultdata.incompleteData.BalanceNo,
        VernierId: resultdata.incompleteData.VernierId,
        VernierNo: resultdata.incompleteData.VernierNo,
        BatchNo: resultdata.incompleteData.BatchNo,
        UserId: resultdata.incompleteData.UserId,
        UserName: resultdata.incompleteData.UserName,
        PrDate: resultdata.incompleteData.PrDate,
        PrTime: resultdata.incompleteData.PrTime,
        PrEndDate: resultdata.incompleteData.PrEndDate,
        PrEndTime: resultdata.incompleteData.PrEndTime,
        Side: (productDetail.ProductType == 2) ? 'NA' : resultdata.incompleteData.Side,
        Unit: resultdata.incompleteData.Unit,
        DecimalPoint: resultdata.incompleteData.DecimalPoint,
        WgmtModeNo: resultdata.incompleteData.WgmtModeNo,
        Nom: resultdata.incompleteData.Nom,
        T1NegTol: resultdata.incompleteData.T1NegTol,
        T1PosTol: resultdata.incompleteData.T1PosTol,
        T2NegTol: resultdata.incompleteData.T2NegTol,
        T2PosTol: resultdata.incompleteData.T2PosTol,
        limitOn: resultdata.incompleteData.limitOn[0],
        NomEmpty: resultdata.incompleteData.NomEmpty,
        T1NegEmpty: resultdata.incompleteData.T1NegEmpty,
        T1PosEmpty: resultdata.incompleteData.T1PosEmpty,
        T2NegEmpty: resultdata.incompleteData.T2NegEmpty,
        T2PosEmpty: resultdata.incompleteData.T2PosEmpty,
        NomNet: resultdata.incompleteData.NomNet,
        T1NMTTab: resultdata.incompleteData.T1NMTTab,
        CubicleType: resultdata.incompleteData.CubicleType,
        ReportType: resultdata.incompleteData.ReportType,
        MachineCode: resultdata.incompleteData.MachineCode,
        MFGCode: resultdata.incompleteData.MFGCode,
        BatchSize: resultdata.incompleteData.BatchSize,
        FriabilityID: resultdata.incompleteData.FriabilityID,
        HardnessID: resultdata.incompleteData.HardnessID,
        CubicleName: resultdata.incompleteData.CubicleName,
        CubicleLocation: resultdata.incompleteData.CubicleLocation,
        RepoLabel10: resultdata.incompleteData.RepoLabel10,
        RepoLabel11: resultdata.incompleteData.RepoLabel11,
        RepoLabel12: resultdata.incompleteData.RepoLabel12,
        RepoLabel13: resultdata.incompleteData.RepoLabel13,
        RepoLabel14: resultdata.incompleteData.RepoLabel14,
        PrintNo: resultdata.incompleteData.PrintNo,
        IsArchived: resultdata.incompleteData.IsArchived[0],
        GraphType: resultdata.incompleteData.GraphType,
        BatchComplete: 0,
        PVersion: resultdata.incompleteData.PVersion,
        Version: resultdata.incompleteData.Version,
        GraphTypeEmpty: resultdata.incompleteData.GraphTypeEmpty,
        limitOnEmpty: resultdata.incompleteData.limitOnEmpty[0],
        NMTTabEmpty: resultdata.incompleteData.NMTTabEmpty,
        T1NegNet: resultdata.incompleteData.T1NegNet,
        T1PosNet: resultdata.incompleteData.T1PosNet,
        T2NegNet: resultdata.incompleteData.T2NegNet,
        T2PosNet: resultdata.incompleteData.T2PosNet,
        BatchComplete: resultdata.incompleteData.BatchComplete[0],
        PVersion: resultdata.incompleteData.PVersion,
        Version: resultdata.incompleteData.Version,
        CheckedByID: resultdata.incompleteData.CheckedByID,
        CheckedByName: resultdata.incompleteData.CheckedByName,
        CheckedByDate: resultdata.incompleteData.CheckedByDate,
        BRepSerNo: resultdata.incompleteData.BRepSerNo,
        Lot: resultdata.incompleteData.Lot,
        Area: resultdata.incompleteData.Area,
        AppearanceDesc: resultdata.incompleteData.AppearanceDesc,
        MachineSpeed_Min: resultdata.incompleteData.MachineSpeed_Min,
        MachineSpeed_Max: resultdata.incompleteData.MachineSpeed_Max,
        GenericName: resultdata.incompleteData.GenericName,
        BMRNo: resultdata.incompleteData.BMRNo,
        GraphTypeNet: resultdata.incompleteData.GraphTypeNet,
        limitOnNet: resultdata.incompleteData.limitOnNet[0],
        NMTTabNet: resultdata.incompleteData.NMTTabNet

      })


      var resultCompleteData = [masterCompleteData]
      var lastInsertedID = resultCompleteData[0].RepSerNo;
      // var incompleteTableName = resultdata.incompleteTableName

      var fetchMasterRecord = await models[resultdata.completeTableName].findAll({
        where: {
          RepSerNo: lastInsertedID
        }
      })


      var objfetchMasterRecord = fetchMasterRecord

      for (const [i, v] of resultdata.detailData.entries()) {
        const insertDetailObj = {
          RepSerNo: lastInsertedID,
          RecSeqNo: i + 1,
          DataValue: v.DataValue,
          DecimalPoint: v.DecimalPoint,
          MstSerNo: objfetchMasterRecord[0].MstSerNo,
          Side: objfetchMasterRecord[0].Side,
          UserId: objfetchMasterRecord[0].UserId,
          UserName: objfetchMasterRecord[0].UserName

        }

        if (productDetail.ProductType == 3) {
          insertDetailObj.data.push({ str_colName: 'DataValue1', value: v.DataValue1 })
          insertDetailObj.data.push({ str_colName: 'NetWeight', value: v.NetWeight })
          insertDetailObj.data.push({ str_colName: 'Remark', value: v.Remark })
        } else if ((productDetail.ProductType == 2 || productDetail.ProductType == 4) && weighmentModeNo == "D") {
          // insertDetailObj.data.push({ DataValue1: v.DataValue1 })
          Object.assign(insertDetailObj, { DataValue1: v.DataValue1 })
          // insertDetailObj.data.push({NetWeight: v.NetWeight })
          Object.assign(insertDetailObj, { NetWeight: v.NetWeight })
        }
        let res = await models[resultdata.detailTableName].create(insertDetailObj);
      }

      const deleteIncompleteData = await models[resultdata.incompleteTableName].destroy({
        where: {
          RepSerNo: resultdata.incompleteData.RepSerNo,
        }
      })

      let res = [deleteIncompleteData];

      const deleteIncompleteDetailData = await models[resultdata.incompletedetailTableName].destroy({
        where: {
          RepSerNo: resultdata.incompleteData.RepSerNo

        }
      })

      let res1 = deleteIncompleteDetailData;

      Object.assign(responseObj, { status: 'success', RepSerNo: lastInsertedID })

      return responseObj
    } catch (err) {
      console.log("Error message : " + err);

      throw new Error(err);
    }
  }
}

module.exports = WeighmentDataTransfer;
