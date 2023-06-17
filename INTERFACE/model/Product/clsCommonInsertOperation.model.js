const globalData = require("../../global/globalData");
const date = require("date-and-time");
const Database = require("../../database/clsQueryProcess");
const IncompleteReport = require("./clsIncompleteReport");
const clsWeighmentDataTransfer = require("./clsWeighmentDataTransfer");
const clsFormula = require("../Product/clsformulaFun.model");
const BatchSummaryModel = require("../Product/clsBatchSummaryOperation");
const GLOBAL_NOMENCLATURE = require("../../global/GLOBAL_NOMENCLATURE");
const FormulaFunModel = require("../Product/clsformulaFun.model");
const clsMqttSender = require('../Mqtt/mqttSender.class');
const objformulaFun = new FormulaFunModel();
const mqttSender = new clsMqttSender();
const mqttProtocol = require('../../global/GLOBAL_NOMENCLATURE');
// const dbcon = require('../../Utills/db');
const moment = require("moment");
const objWeighmentDataTransfer = new clsWeighmentDataTransfer();
const objIncompleteReport = new IncompleteReport();
const database = new Database();
const objFormula = new clsFormula();
const now = new Date();
const objBatchSummary = new BatchSummaryModel();
const { Op } = require("sequelize");
// const { tbl_cubical } = require('sequelize');
const models = require("../../../config/dbConnection").models;
const sequelize = require("../../../config/dbConnection").sequelize;
const { QueryTypes } = require("sequelize");
const momentObj = require("moment");

const { create } = require("joi/lib/ref");
class InsertOperation {
  async insert_Into_Incomplete_Master(dataObj) {
    try {
      const strTableName = dataObj.strTableName;
      const strIdsNo = dataObj.uniqueSerialNumber;
      let objSelMenu = globalData.arrSelectedMenu.find(
        (k) => k.idsNo == strIdsNo
      );
      const objProductDetails = objSelMenu.selectedProductDetail;
      const strBalId = dataObj.strBalId;
      const ProtocolData = dataObj.ProtocolData;
      const ProtocolUnit = dataObj.ProtocolUnit;
      const ProtocolDecPoint = dataObj.ProtocolDecPoint;
      const strHmi = dataObj.strHmi;
      const intProductType = dataObj.productType;
      const intNominal = dataObj.objProductDetails.Nominal;
      const tempUserObject = globalData.arrUsers.find(k => k.Hmi == strHmi);

      let side;
      var SideARR = globalData.arrside.find(k => k.Hmi == strHmi)
      if (SideARR == undefined) {
        if (dataObj.objProductDetails.Rotary == "Single") {
          side = "NA";
        } else if (dataObj.objProductDetails.Rotary == "Double") {
          side = dataObj.objProductDetails.Side;
        }
      } else {
        side = SideARR.Side
      }
      let hmiDetailsInPMenu = globalData.arrIdsInfo.find(
        (k) => k.Hmi == strHmi
      ).cubicalData;
      //const objSelMenu = globalData.arrSelectedMenu.find(k => k.idsNo == strIdsNo);
      let selectedIdsNo;
      var IPQCObject = globalData.arr_IPQCRelIds.find(
        (k) => k.idsNo == strIdsNo
      );
      if (IPQCObject != undefined) {
        selectedIdsNo = IPQCObject.selectedIds;
      } else {
        selectedIdsNo = strIdsNo;
      }

      let selectedCub = globalData.arrIdsInfo.find(
        (k) => k.idsNo == selectedIdsNo
      ).cubicalData;

      let productMaster = globalData.arrProductTypeArray.find(
        (k) => k.idsNo == selectedIdsNo
      );
      var LimitOn = await models.tbl_product_tablet.findAll({
        where: {
          ProductId: productMaster.productType.ProductId,
          ProductName: productMaster.productType.ProductName,
          ProductVersion: productMaster.productType.ProductVersion
        }
      })

      var Tolerance = objformulaFun.StdLimit(dataObj);
      var dp;
      if (objProductDetails.unit == 'mg') { dp = 1 } else { dp = ProtocolDecPoint }
      var unit_stdlimit = (objProductDetails.LimitOn == false ? objProductDetails.unit : '%')
      var std_Limit1;
      var std_Limit2;
      if (Number(objProductDetails.T1Neg) != 0) {
        if (Number(objProductDetails.T1Neg) != Number(objProductDetails.T1Pos)) {
          std_Limit1 = 'NMT' + ' ' + LimitOn[0].Param1_NMTTab + ' ' + 'tablets by' + ' ' + Number(objProductDetails.T1Neg).toFixed(dp) + ' ' + unit_stdlimit + ' ' + '-' + ' ' + Number(objProductDetails.T1Pos).toFixed(dp) + ' ' + unit_stdlimit
        } else {
          std_Limit1 = 'NMT' + ' ' + LimitOn[0].Param1_NMTTab + ' ' + 'tablets by' + ' ' + '±' + ' ' + Number(objProductDetails.T1Neg).toFixed(dp) + ' ' + unit_stdlimit
        }
      } else {
        std_Limit1 = 'NA'
      }
      if (Number(objProductDetails.T2Neg) != Number(objProductDetails.T2Pos)) {
        std_Limit2 = 'None of tablet by ' + ' ' + Number(objProductDetails.T2Neg).toFixed(dp) + ' ' + unit_stdlimit + ' ' + '-' + ' ' + Number(objProductDetails.T2Pos).toFixed(dp) + ' ' + unit_stdlimit
      } else {
        std_Limit2 = 'None of tablet by ±' + ' ' + Number(objProductDetails.T2Neg).toFixed(dp) + ' ' + unit_stdlimit;
      }

      var nob1 = 0
      var noa1 = 0
      var nob2 = 0
      var noa2 = 0

      if (Number(ProtocolData) < Number(dataObj.objProductDetails.T2Neg)) { //No of below limit 2
        var nob2 = 1;
      } else if (Number(ProtocolData) > Number(dataObj.objProductDetails.T2Pos)) { //No of Above limit 2
        var noa2 = 1;
      }
      if (dataObj.objProductDetails.T1Neg != 0 && dataObj.objProductDetails.T1Pos != 0) {
        if (Number(ProtocolData) < Number(dataObj.objProductDetails.T1Neg) && Number(ProtocolData) >= Number(dataObj.objProductDetails.T2Neg)) { //No of below limit 1
          var nob1 = 1;
        } else if (Number(ProtocolData) > Number(dataObj.objProductDetails.T1Pos) && Number(ProtocolData) <= Number(dataObj.objProductDetails.T2Pos)) { //No of Above limit 1
          var noa1 = 1;
        }
      }

      let tblName = strTableName.concat("_incomplete");

      var time = momentObj().format("HH:mm:ss")
      const insertObj = await models[tblName].create({
        MstSerNo: 1,
        InsturmentID: hmiDetailsInPMenu.Sys_BalID,
        BFGCode: dataObj.objProductDetails.ProductId,
        ProductName: dataObj.objProductDetails.ProductName,
        ProductType: productMaster.productType.ProductType,
        Qty: dataObj.objProductDetails.noOfSample,
        GrpQty: 0,
        GrpFreq: 0,
        Idsno: strHmi,
        CubicalNo: selectedCub.Sys_CubicNo,
        BalanceId: hmiDetailsInPMenu.Sys_BalID,
        Dept: hmiDetailsInPMenu.Sys_dept,
        BalanceNo: 0,
        VernierId: hmiDetailsInPMenu.Sys_VernierID,
        VernierNo: 0,
        BatchNo: dataObj.objProductDetails.Batch,
        UserId: tempUserObject.UserId,
        UserName: tempUserObject.UserName,
        PrDate: momentObj().format("YYYY-MM-DD"),
        PrTime: momentObj().format("HH:mm:ss"),
        PrEndDate: momentObj().format("YYYY-MM-DD"),
        PrEndTime: momentObj().format("HH:mm:ss"),
        // PrEndTime: '',
        Side: side,
        Unit: ProtocolUnit,
        DP: dp,
        WgmtModeNo: dataObj.strTableName.split('master')[1],
        Nom: Number(intNominal.split(' ')[0]).toFixed(1),
        T1NegTol: Number(dataObj.objProductDetails.T1Neg.split(' ')[0]).toFixed(1),
        T1PosTol: Number(dataObj.objProductDetails.T1Pos.split(' ')[0]).toFixed(1),
        T2NegTol: Number(dataObj.objProductDetails.T2Neg.split(' ')[0]).toFixed(1),
        T2PosTol: Number(dataObj.objProductDetails.T2Pos.split(' ')[0]).toFixed(1),
        limitOn: LimitOn[0].Param1_LimitOn,
        T1NMT: LimitOn[0].Param1_NMTTab,
        StdLimit1: std_Limit1 == undefined ? 'NA' : std_Limit1,
        StdLimit2: std_Limit2,
        AvgValue: ProtocolData,
        MinValue: ProtocolData,
        MaxValue: ProtocolData,
        MinPer: ProtocolData,
        MaxPer: ProtocolData,
        StdDev: ProtocolData,
        NoOfBelowT1: nob1 != undefined ? nob1 : 0,
        NoOfAboveT1: noa1 != undefined ? noa1 : 0,
        NoOfBelowT2: nob2 != undefined ? nob2 : 0,
        NoOfAboveT2: noa2 != undefined ? noa2 : 0,
        NomEmpty: 0,
        T1NegEmpty: 0,
        T1PosEmpty: 0,
        T2NegEmpty: 0,
        T2PosEmpty: 0,
        NomNet: 0,
        T1NegNet: 0,
        T1PosNet: 0,
        T2NegNet: 0,
        T2PosNet: 0,
        CubicleType: selectedCub.Sys_CubType,
        ReportType: hmiDetailsInPMenu.Sys_RptType,
        MachineCode: selectedCub.Sys_MachineCode,
        MFGCode: selectedCub.Sys_MfgCode,
        BatchSize: selectedCub.Sys_BatchSize,
        FriabilityID: hmiDetailsInPMenu.Sys_FriabID,
        HardnessID: hmiDetailsInPMenu.Sys_HardID,
        CubicleName: selectedCub.Sys_CubicName,
        CubicleLocation: selectedCub.Sys_Location,
        RepoLabel10: "Standard",
        RepoLabel11: 0,
        RepoLabel12: "Null",
        RepoLabel13: "Null",
        PrintNo: 0,
        IsArchived: 0,
        GraphType: 0,
        BatchComplete: 0,
        PVersion: selectedCub.Sys_PVersion,
        Version: selectedCub.Sys_Version,
        BRepSerNo: 0,
        Lot: selectedCub.Sys_LotNo,
        Area: selectedCub.Sys_Area,
        IsProcess: 1,
      });

      let arrResult = [insertObj.dataValues];
      return arrResult[0];
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * error resolved while performing powerBackup @sunil
   */
  async insert_Into_Incomplete_Detail(dataObj) {
    try {
      const strmasterTbl = dataObj.strTableName;
      const strDetailTbl = dataObj.strDetailTbl;
      const strHmi = dataObj.strHmi;
      const strProtocolData = dataObj.ProtocolData;
      const strDecPoint = dataObj.ProtocolDecPoint;
      const seqNoOfWt = dataObj.seqNoOfWt;
      let userobj = globalData.arrUsers.find(k => k.Hmi == strHmi)
      let decimal;
      let strIdsNo = dataObj.uniqueSerialNumber;
      let selectedIdsNo;

      var IPQCObject = globalData.arr_IPQCRelIds.find(
        (k) => k.idsNo == strIdsNo
      );
      if (IPQCObject != undefined) {
        selectedIdsNo = IPQCObject.selectedIds;
      } else {
        selectedIdsNo = strIdsNo;
      }
      let side;
      var SideARR = globalData.arrside.find(k => k.Hmi == strHmi)
      if (SideARR == undefined) {
        if (dataObj.objProductDetails.Rotary == "Single") {
          side = "NA";
        } else if (dataObj.objProductDetails.Rotary == "Double") {
          side = "LHS";
        }
      } else {
        side = SideARR.Side
      }

      let hmiDetailsInPMenu = globalData.arrIdsInfo.find(
        (k) => k.idsNo == selectedIdsNo
      ).cubicalData;

      let repSerNo = await this.lastInsertedRecords(
        hmiDetailsInPMenu.Sys_ProductName,
        hmiDetailsInPMenu.Sys_BFGCode,
        hmiDetailsInPMenu.Sys_PVersion,
        hmiDetailsInPMenu.Sys_Version,
        hmiDetailsInPMenu.Sys_Batch,
        strmasterTbl
      );

      /**
       * get decimal
       */
      let tbName = strDetailTbl.concat("_incomplete");
      const selectRepSrNoObj = await models[tbName].findAll({
        where: {
          RepSerNo: repSerNo,
        },
      });

      let arrResult_RepNo = [selectRepSrNoObj];
      if (arrResult_RepNo[0].length == 0) {
        decimal = strDecPoint;
      } else {
        decimal = arrResult_RepNo[0][0].DP;
      }
      var tableName = strDetailTbl.concat("_incomplete");
      const insertDetail = await models[tableName].create({
        RepSerNo: repSerNo,
        MstSerNo: 0,
        RecSeqNo: seqNoOfWt,
        DataValue: Number(strProtocolData).toFixed(decimal),
        DP: decimal,
        UserId: userobj.UserId,
        UserName: userobj.UserName,
        Side: side,
        PrDate: momentObj().format("YYYY-MM-DD"),
        PrTime: momentObj().format("HH:mm:ss"),
        PrEndDate: momentObj().format("YYYY-MM-DD"),
        PrEndTime: momentObj().format("HH:mm:ss"),
      });


      let arrResult = [insertDetail.dataValues];
      let obj = {
        repSerNo: repSerNo,
        decimal: decimal
      }
      return obj;
    } catch (error) {
      throw new Error(error);
    }
  }


  async lastInsertedRecords(
    strProductName,
    StrBFGCode,
    StrProductVersion,
    StrVersion,
    StrBatch,
    tableName
  ) {
    try {
      let intMstSerNo;
      tableName = tableName.concat("_incomplete");
      let selectRepSrNoObj = await models[tableName].findAll({
        attributes: [
          [sequelize.fn("max", sequelize.col("RepSerNo")), "RepSerNo"],
        ],
        where: {
          ProductName: strProductName,
          BFGCode: StrBFGCode,
          PVersion: StrProductVersion,
          Version: StrVersion,
          BatchNo: StrBatch,
          // Idsno:cubicalObj.Sys_IDSNo
        },
      });

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
      console.log(error);
    }
  }

  async lastInsertedSeqNo(tableName, repSerNo) {
    try {
      tableName = tableName.concat("_incomplete");
      let selectRepSrNoObj = await models[tableName].findAll({
        attributes: [
          [sequelize.fn("max", sequelize.col("RecSeqNo")), "RecSeqNo"],
        ],
        where: {
          RecSeqNo: repSerNo,
          // BatchNo:cubicalObj.Sys_Batch,
          // Idsno:cubicalObj.Sys_IDSNo
        },
      });

      let arrResultDaily_RepNo = [selectRepSrNoObj];

      // let intDaily_RepNo = arrResultDaily_RepNo[0].RepSerNo;
      let intMstSerNo;
      if (arrResultDaily_RepNo[0][0].RecSeqNo == null) {
        intMstSerNo = 1;
      } else {
        var newMstSerNo = arrResultDaily_RepNo[0][0].RecSeqNo;
        intMstSerNo = newMstSerNo + 1;
      }
      return intMstSerNo;
    } catch (error) {
      console.log(error);
    }
  }
  async saveCompleteData(dataObj, strTypeValue) {
    try {
      let masterTable;
      let detailTable;
      let strHmi = dataObj.strHmi;
      let typeValue = strTypeValue;
      let strIdsNo = dataObj.uniqueSerialNumber;
      var reuse_batchflag = await models.tbl_cubical.findAll({ where: { Sys_IDSNo: strHmi } })
      let selectedIdsNo;
      var menuName = dataObj.objProductDetails.menuName;
      var IPQCObject = globalData.arr_IPQCRelIds.find(
        (k) => k.idsNo == strIdsNo
      );
      if (IPQCObject != undefined) {
        selectedIdsNo = IPQCObject.selectedIds;
      } else {
        selectedIdsNo = strIdsNo;
      }

      let objProductDetail = globalData.arrProductTypeArray.find(
        (k) => k.idsNo == selectedIdsNo
      );
      let objProductType = objProductDetail.productType;

      if (objProductType.ProductType == 1) {
        masterTable = "tbl_tab_master" + typeValue;
        detailTable = "tbl_tab_detail" + typeValue;
      } else if (
        objProductType.ProductType == 2 ||
        objProductType.ProductType == 4
      ) {
        if (typeValue == "D") {
          masterTable = "tbl_cap_master3";
          detailTable = "tbl_cap_detail3";
        } else {
          masterTable = "tbl_cap_master" + typeValue;
          detailTable = "tbl_cap_detail" + typeValue;
        }
      } else if (objProductType.ProductType == 19) {
        masterTable = "tbl_tab_master19";
        detailTable = "tbl_tab_detail19";
      }


      let result = await objIncompleteReport.getIncomepleteData(
        dataObj,
        masterTable,
        detailTable,
        strHmi
      );
      let reportStatus = await this.removeLimitForRemark(
        result,
        typeValue,
        strHmi,
        objProductType
      );
      if (reuse_batchflag[0].Sys_BatchReuse == 0) {
        if (typeValue == "D") {
          await objBatchSummary.saveBatchDataDiff(
            3,
            result,
            strIdsNo,
            reportStatus
          );
        } else {//Individual batch summary
          var remark = await objBatchSummary.saveBatchData(
            typeValue,
            result,
            strHmi,
            strIdsNo
          );
        }
      }
      // if (remark != undefined) {
      //   if (remark.remark == "Complies") {
      //     var Result_remrk = 'Report  Within Limit'
      //   } else {
      //     var Result_remrk = 'Report  Out Of Limit'
      //   }

      // }
      let isWTTrfr = await objWeighmentDataTransfer.saveCommonDataToComplete(
        result,
        typeValue,
        strHmi,
        dataObj.remark,
        menuName
      );
      var res = isWTTrfr
      await this.deleteIncompleteRemarkEntry(strHmi, strIdsNo);
      var obj = {
        remark :remark,
        res : res
      }
      return obj;
      // mqttSender.sendData(strHmi, `${mqttProtocol.TestCompleted} ${Result_remrk}`);
    } catch (error) {
      throw new Error(error);
    }
  }

  async removeLimitForRemark(result, typeValue, IdsNo, objProductType) {
    try {

      let objMenuDetail = globalData.arrSelectedMenu.find(
        (k) => k.Hmi == IdsNo
      );
      let menuName = objMenuDetail.menuName;
      let selectedIdsNo;
      var IPQCObject = globalData.arr_IPQCRelIds.find((k) => k.Hmi == IdsNo);
      if (IPQCObject != undefined) {
        selectedIdsNo = IPQCObject.selectedIds;
      } else {
        selectedIdsNo = IdsNo;
      }

      let menuDetailsArr = globalData.arr_limits.find(
        (k) => k.Hmi == selectedIdsNo
      );
      let menuDetail = menuDetailsArr.Menus.filter(
        (obj) => Object.keys(obj) == menuName
      )[0][menuName];
      var outOfLimitCount = 0;
      const valuesForAvg = [];
      let sum = 0;
      var ResultOfReport = "Within of Limit";
      let T1Pos;
      var nosOfTabletForT1 = result.incompleteData.T1NMTTab;
      if (result.incompleteData.GraphType == "1") {
        for (const val of result.detailData) {
          valuesForAvg.push(val.DataValue);
          sum += parseFloat(val.DataValue);
        }

        let avg = sum / valuesForAvg.length;

      }

      switch (typeValue.toString()) {
        case "1":
          T1Pos = menuDetail.T1Pos;
          break;
        case "8":
          var paramName = "Ind_Layer";
          // if (serverConfig.ProjectName == "RBH") {
          //     paramName = 'Ind_Empty';
          // }
          T1Pos = menuDetail.T1Pos;
          break;
        case "L":
          T1Pos = menuDetail.T1Pos;
          break;
        case "3":
          T1Pos = menuDetail.T1Pos;
          break;
        case "4":
          if (objProductType.ProductType == 1) {
            T1Pos = menuDetail.T1Pos;
          } else {
            T1Pos = menuDetail.T1Pos;
          }
          break;
        case "5":
          T1Pos = menuDetail.T1Pos;
          break;
        case "6":
          T1Pos = menuDetail.T1Pos;
          break;
        default:
          T1Pos = 1;
      }


      if (outOfLimitCount > 0) {
        // ResultOfReport = `LE1`;
        ResultOfReport = `Out of Limit From T2`;
        // objForLimit.flag = true
        console.log("Out of Limit From T2");
      }

      //For T1 calculations for balance related parameter only
      if (outOfLimitCount == 0 && parseFloat(T1Pos) != 0) {

        if (outOfLimitCount > nosOfTabletForT1) {
          ResultOfReport = "Out of Limit From T1";

        }
      }
      return ResultOfReport;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateEndDate(strIdsNo, strHmi, strTableName) {
    try {
      const cubicalObj = globalData.arrIdsInfo.find(
        (k) => k.Hmi == strHmi
      ).cubicalData;
      const updateThicknessEndTime = await models[strTableName].update(
        {
          PrEndDate: momentObj().format("YYYY-MM-DD"),
          PrEndTime: momentObj().format("HH:mm:ss"),
        },
        {
          where: {
            BFGCode: cubicalObj.Sys_BFGCode,
            ProductName: cubicalObj.Sys_ProductName,
            PVersion: cubicalObj.Sys_PVersion,
            Version: cubicalObj.Sys_Version,
            BatchNo: cubicalObj.Sys_Batch,
            // Idsno: strHmi,
          },
        }
      );


      updateThicknessEndTime;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteIncompleteRemarkEntry(strHmi, strIdsNo) {
    try {
      let CubicInfo = globalData.arrIdsInfo.find((k) => k.Hmi == strHmi);
      let StrBatch = CubicInfo.cubicalData.Sys_Batch;
      const objRemark = await models.tbl_remark_incomplete_master.destroy({
        where: {
          IDSNo: strHmi,
          BatchNumber: StrBatch,
        },
      });

    } catch (error) {
      throw new Error(error);
    }
  }

  async InsertIncompleteRemarkEntry(dataObj) {
    try {
      let strIdsNo = dataObj.idsNo;
      let strMenuName = dataObj.menuName;
      let batchNo = dataObj.batchNo;
      const masterTable = dataObj.tableName;

      const checkForAlreadyEntry = await tbl_remark_incomplete_master.findAll({
        where: {
          IDSNo: strIdsNo,
          BatchNumber: batchNo,
        },
      });

      let result = checkForAlreadyEntry;
      if (result[0].length == 0) {
        const insertRepoRemarkDetail =
          await models.tbl_remark_incomplete_master.create({});


        await database.save(insertRepoRemarkDetail);
      } else {
        const insertRepoRemarkDetail = {
          str_tableName: "tbl_remark_incomplete_master",
          condition: [
            { str_colName: "IDSNo", value: strIdsNo },
            { str_colName: "BatchNumber", value: batchNo },
          ],
          data: [
            { str_colName: "paramName", value: strMenuName },
            { str_colName: "tableName", value: masterTable + "_incomplete" },
          ],
        };

        await database.update(insertRepoRemarkDetail);
      }
    } catch (error) { }
  }

  async updateSample(sampleNo, strHmi, menuName) {
    try {
      if (
        menuName == GLOBAL_NOMENCLATURE.ThicknessMenu ||
        menuName == GLOBAL_NOMENCLATURE.BreadthMenu ||
        menuName == GLOBAL_NOMENCLATURE.IndLayerMenu ||
        menuName == GLOBAL_NOMENCLATURE.LengthMenu ||
        menuName == GLOBAL_NOMENCLATURE.IndividualMenu ||
        menuName == GLOBAL_NOMENCLATURE.IndLayer1Menu ||
        menuName == GLOBAL_NOMENCLATURE.PercentageFine ||
        menuName == GLOBAL_NOMENCLATURE.ParticalSizing
      ) {
        menuName = GLOBAL_NOMENCLATURE.IndividualMenu;
      } else if (
        menuName == GLOBAL_NOMENCLATURE.GroupLayer1Menu ||
        menuName == GLOBAL_NOMENCLATURE.GroupLayerMenu ||
        menuName == GLOBAL_NOMENCLATURE.GroupMenu
      ) {
        menuName = GLOBAL_NOMENCLATURE.GroupMenu;
      } else if (
        menuName == GLOBAL_NOMENCLATURE.FriabilityMenu ||
        menuName == GLOBAL_NOMENCLATURE.FriabilatorMenu
      ) {
        menuName = GLOBAL_NOMENCLATURE.FriabilityMenu;
      } else if (menuName == GLOBAL_NOMENCLATURE.TappedDensity) {
        menuName = GLOBAL_NOMENCLATURE.TappedDensity;
      } else if (
        menuName == GLOBAL_NOMENCLATURE.MoistureAnalyzer ||
        menuName == "LOD"
      ) {
        menuName = GLOBAL_NOMENCLATURE.IndividualMenu;
      }

      const cubicalDetails = globalData.arrIdsInfo.find(
        (k) => k.Hmi == strHmi
      ).cubicalData;
      console.log(menuName);

      const updateSampleObj = await models.tbl_cubicle_product_sample.update({
        [`${menuName}`]: sampleNo
      },
        {
          where: {
            Sys_CubicNo: cubicalDetails.Sys_CubicNo,
            // Sys_rpi: cubicalDetails.Sys_rpi
          }
        });

      await [updateSampleObj];

      return sampleNo
    } catch (error) {
      throw new Error(error);
    }
  }

  async getCubicalData(strIdsNo) {
    try {

      let cubicalData = await models.tbl_cubical.findAll({
        where: {
          Sys_IDSNo: strIdsNo,
        },
      });
      return [cubicalData[0]];
    } catch (error) {
      throw new Error(error);
    }
  }

  async getCubicalIdsNo() {
    try {
      const objListBal = await models.tbl_cubical.findAll({
        where: {
          Sys_IDSNo: {
            [Op.ne]: 0,
          },
        },
      });

      return [objListBal];
    } catch (error) {
      throw new Error(error);
    }
  }




  async insert_Into_Incomplete_Master_Empty(dataObj) {
    const strTableName = dataObj.strTableName;
    const strIdsNo = dataObj.uniqueSerialNumber;
    let objSelMenu = globalData.arrSelectedMenu.find(
      (k) => k.idsNo == strIdsNo
    );
    const objProductDetails = objSelMenu.selectedProductDetail;
    const strBalId = dataObj.strBalId;
    const ProtocolData = dataObj.ProtocolData;
    const ProtocolUnit = dataObj.ProtocolUnit;
    const ProtocolDecPoint = dataObj.ProtocolDecPoint;
    const strHmi = dataObj.strHmi;

    let side;
    if (dataObj.objProductDetails.Rotary == "Single") {
      side = "NA";
    } else if (dataObj.objProductDetails.Rotary == "Double") {
      side = "LHS";
    }

    let hmiDetailsInPMenu = globalData.arrIdsInfo.find(
      (k) => k.Hmi == strHmi
    ).cubicalData;
    //const objSelMenu = globalData.arrSelectedMenu.find(k => k.idsNo == strIdsNo);
    let selectedIdsNo;
    var IPQCObject = globalData.arr_IPQCRelIds.find((k) => k.idsNo == strIdsNo);
    if (IPQCObject != undefined) {
      selectedIdsNo = IPQCObject.selectedIds;
    } else {
      selectedIdsNo = strIdsNo;
    }

    let selectedCub = globalData.arrIdsInfo.find(
      (k) => k.idsNo == selectedIdsNo
    ).cubicalData;

    let productMaster = globalData.arrProductTypeArray.find(
      (k) => k.idsNo == selectedIdsNo
    );

    let tblName = strTableName.concat("_incomplete");

    const insertObj = await models[tblName].create({
      MstSerNo: 1,
      InstruId: 1,
      BFGCode: dataObj.objProductDetails.ProductId,
      ProductName: dataObj.objProductDetails.ProductName,
      Qty: dataObj.objProductDetails.noOfSample,
      GrpQty: 0,
      GrpFreq: 0,
      Idsno: strHmi,
      CubicalNo: selectedCub.Sys_CubicNo,
      BalanceId: hmiDetailsInPMenu.Sys_BalID,
      BalanceNo: 0,
      VernierId: hmiDetailsInPMenu.Sys_VernierID,
      VernierNo: 0,
      BatchNo: dataObj.objProductDetails.Batch,
      UserId: dataObj.objProductDetails.userid,
      UserName: dataObj.objProductDetails.userName,
      PrDate: date.format(now, "YYYY-MM-DD"),
      PrTime: date.format(now, "HH:mm:ss"),
      PrEndDate: date.format(new Date(), "YYYY-MM-DD"),
      PrEndTime: date.format(new Date(), "HH:mm:ss"),

      Side: "NA",
      Unit: ProtocolUnit,
      DecimalPoint: ProtocolDecPoint,
      WgmtModeNo: 1,
      limitOn: 0,

      NomEmpty: 0,
      T1NegEmpty: 0,
      T1PosEmpty: 0,
      T2NegEmpty: 0,
      T2PosEmpty: 0,
      NomNet: 0,
      T1NegNet: 0,
      T1PosNet: 0,
      T2NegNet: 0,
      T2PosNet: 0,
      CubicleType: selectedCub.Sys_CubType,
      ReportType: 0,
      MachineCode: selectedCub.Sys_MachineCode,
      MFGCode: selectedCub.Sys_MfgCode,
      BatchSize: selectedCub.Sys_BatchSize,
      FriabilityID: hmiDetailsInPMenu.Sys_FriabID,
      HardnessID: hmiDetailsInPMenu.Sys_HardID,
      CubicleName: selectedCub.Sys_CubicName,
      CubicleLocation: selectedCub.Sys_Location,
      RepoLabel10: "Standard",
      RepoLabel11: 0,
      RepoLabel12: "Null",
      RepoLabel13: "Null",
      PrintNo: 0,
      IsArchived: 0,
      GraphType: 0,
      BatchComplete: 0,
      PVersion: selectedCub.Sys_PVersion,
      Version: selectedCub.Sys_Version,
      BRepSerNo: 0,
      Lot: selectedCub.Sys_LotNo,
      Area: selectedCub.Sys_Area,
    });

    let arrResult = [insertObj];
    return arrResult[0];
  }
  catch(error) {
    console.log(error);
  }
  async saveCompleteEmptyData(dataObj, strTypeValue) {
    try {
      let masterTable;
      let detailTable;
      let strHmi = dataObj.strHmi;
      let typeValue = strTypeValue;
      let strIdsNo = dataObj.uniqueSerialNumber;

      let selectedIdsNo;
      var IPQCObject = globalData.arr_IPQCRelIds.find(
        (k) => k.idsNo == strIdsNo
      );
      if (IPQCObject != undefined) {
        selectedIdsNo = IPQCObject.selectedIds;
      } else {
        selectedIdsNo = strIdsNo;
      }
      if (dataObj.objProductDetails.menuName == "EMPTY") {
        masterTable = "tbl_cap_master9";
        detailTable = "tbl_cap_detail9";
      }


      let result = await objIncompleteReport.getIncomepleteEmptyShellData(
        dataObj,
        masterTable,
        detailTable,
        strHmi
      );

      let isWTTrfr = await objWeighmentDataTransfer.saveEmptyDataToComplete(
        result,
        typeValue,
        strHmi
      );
      await this.deleteEmptyIncompleteRemarkEntry(strHmi, strIdsNo);
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteEmptyIncompleteRemarkEntry(strHmi, strIdsNo) {
    try {
      let CubicInfo = globalData.arrIdsInfo.find((k) => k.Hmi == strHmi);
      let StrBatch = CubicInfo.cubicalData.Sys_Batch;
      const objRemark = await models.tbl_remark_incomplete_master.destroy({
        where: {
          IDSNo: strHmi,
          BatchNumber: StrBatch,
        },
      });

    } catch (error) {
      throw new Error(error);
    }
  }

  async insert_Into_Incomplete_Empty_Detail(dataObj) {
    try {
      const strmasterTbl = dataObj.strTableName;
      const strDetailTbl = dataObj.strDetailTbl;
      const strHmi = dataObj.strHmi;
      const strProtocolData = dataObj.ProtocolData;
      const strDecPoint = dataObj.ProtocolDecPoint;
      const seqNoOfWt = dataObj.seqNoOfWt;
      let decimal;
      let strIdsNo = dataObj.uniqueSerialNumber;
      let selectedIdsNo;

      var IPQCObject = globalData.arr_IPQCRelIds.find(
        (k) => k.idsNo == strIdsNo
      );
      if (IPQCObject != undefined) {
        selectedIdsNo = IPQCObject.selectedIds;
      } else {
        selectedIdsNo = strIdsNo;
      }

      let hmiDetailsInPMenu = globalData.arrIdsInfo.find(
        (k) => k.idsNo == selectedIdsNo
      ).cubicalData;

      let repSerNo = await this.lastInsertedRecords(
        hmiDetailsInPMenu.Sys_ProductName,
        hmiDetailsInPMenu.Sys_BFGCode,
        hmiDetailsInPMenu.Sys_PVersion,
        hmiDetailsInPMenu.Sys_Version,
        hmiDetailsInPMenu.Sys_Batch,
        strmasterTbl
      );

      /**
       * get decimal
       */
      let tbName = strDetailTbl.concat("_incomplete");
      const selectRepSrNoObj = await models[tbName].findAll({
        where: {
          RepSerNo: repSerNo,
        },
      });
      let arrResult_RepNo = [selectRepSrNoObj];
      if (arrResult_RepNo[0].length == 0) {
        decimal = strDecPoint;
      } else {
        decimal = arrResult_RepNo[0][0].DecimalPoint;
      }

      var tableName = strDetailTbl.concat("_incomplete");
      const insertDetail = await models[tableName].create({
        RepSerNo: repSerNo,
        MstSerNo: 0,
        RecSeqNo: seqNoOfWt,
        DataValue: strProtocolData,
        DecimalPoint: decimal,
        UserId: dataObj.objProductDetails.userid,
        UserName: dataObj.objProductDetails.userName,
        PrDate: date.format(now, "YYYY-MM-DD"),
        PrTime: date.format(now, "HH:mm:ss"),
        PrEndDate: date.format(new Date(), "YYYY-MM-DD"),
        PrEndTime: date.format(new Date(), "HH:mm:ss"),
      });

      let arrResult = [insertDetail];
      return decimal;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getMaxBRepSerNo(
    productName,
    strBatch,
    strTableName,
    reportType,
    incomplete,
    Sys_CubType
  ) {
    try {
      const tblDetails = await models[strTableName].findAll({
        attributes: [
          [sequelize.fn("max", sequelize.col("RepSerNo")), "RepSerNo"],
        ],

        where: {
          // PVersion: selectedCub.Sys_PVersion,
          // Version: selectedCub.Sys_Version,
          BatchNo: strBatch,
          // BFGCode: dataObj.objProductDetails.ProductId,
          ProductName: productName,
          ReportType: reportType,
          CubicleType: Sys_CubType,
        },
      });

      if (incomplete == undefined) {
        incomplete = strTableName.concat("_incomplete");
      }

      const tblDetails1 = await models[incomplete].findAll({
        attributes: [
          [sequelize.fn("max", sequelize.col("RepSerNo")), "RepSerNo"],
        ],
        where: {

          BatchNo: strBatch,

          ProductName: productName,
          ReportType: reportType,
          CubicleType: Sys_CubType,
        },
      });
      let incomBRepSerNo = 0;
      let BRepSerNo = 0;

      if (tblDetails.length != 0) {
        let maxColumn = tblDetails.length >= 1 ? tblDetails.pop() : tblDetails;
        BRepSerNo = maxColumn.BRepSerNo + 1;
      }
      if (tblDetails1.length != 0) {
        let maxColumninc =
          tblDetails1.length >= 1 ? tblDetails1.pop() : tblDetails1;
        incomBRepSerNo = maxColumninc.BRepSerNo + 1;
      }
      let result = Math.max(BRepSerNo, incomBRepSerNo);
      if (result == 0) {
        return 1;
      } else {
        return isNaN(result) ? 1 : result;
      }
    } catch (error) {
      throw new Error();
    }
  }

  async saveDiffCompleteData(dataObj, strTypeValue) {
    try {
      let masterTable;
      let detailTable;
      let strHmi = dataObj.strHmi;
      let typeValue = strTypeValue;
      let strIdsNo = dataObj.uniqueSerialNumber;

      let selectedIdsNo;


      let objProductDetail = globalData.arrProductTypeArray.find(
        (k) => k.Hmi == strHmi
      );
      let objProductType = objProductDetail.productType;

      if (objProductType.ProductType == 1) {
        masterTable = "tbl_tab_master" + typeValue;
        detailTable = "tbl_tab_detail" + typeValue;
      } else if (
        objProductType.ProductType == 2 ||
        objProductType.ProductType == 4
      ) {
        if (typeValue == "D") {
          masterTable = "tbl_cap_master3";
          detailTable = "tbl_cap_detail3";
        } else {
          masterTable = "tbl_cap_master" + typeValue;
          detailTable = "tbl_cap_detail" + typeValue;
        }
      } else if (objProductType.ProductType == 5) {
        masterTable = "tbl_tab_master19";
        detailTable = "tbl_tab_detail19";
      }


      let result = await objIncompleteReport.getDiffIncomepleteData(
        dataObj,
        masterTable,
        detailTable,
        strHmi
      );
      let reportStatus = await this.removeLimitForRemark(
        result,
        typeValue,
        strHmi,
        objProductType
      );
      if (typeValue == "D") {
        await objBatchSummary.saveBatchDataDiff(
          "D",
          result,
          strHmi,
          reportStatus
        );
      } else {
        await objBatchSummary.saveBatchData(
          typeValue,
          result,
          strHmi,
          strIdsNo
        );
      }

      let saveResponse = await objWeighmentDataTransfer.saveDiffDataToComplete(
        result,
        typeValue,
        strHmi
      );
      await this.deleteIncompleteRemarkEntry(strHmi, strIdsNo);

      mqttSender.sendData(strHmi, `${mqttProtocol.DisplayResult}:${reportStatus}`);
      return { reportStatus: reportStatus, RepSerNo: saveResponse.RepSerNo };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getDoubleLastSide(data) {
    try {
      var { strHmi, strBatch, productName, Sys_CubType, reportType, strTableName, side } = data;

      const sideResp = await models[strTableName].findAll({
        // attributes: [[sequelize.fn('max', sequelize.col('RepSerNo')), 'RepSerNo']],
        where: {

          BatchNo: strBatch,
          // BFGCode: dataObj.objProductDetails.ProductId,
          ProductName: productName,
          ReportType: reportType,
          // side:side,
          CubicleType: Sys_CubType,
          Idsno: strHmi
        }
      })

      const specificIds = sideResp.filter(k => k.Idsno == strHmi);
      let sideObj = specificIds.pop();
      return sideObj.Side
      // return sideResp.Side


    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = InsertOperation;
