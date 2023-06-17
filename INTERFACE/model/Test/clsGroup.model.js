//packages
const date = require("date-and-time");

const globalData = require("../../global/globalData");
const Database = require("../../database/clsQueryProcess");
const MqttSender = require("../Mqtt/mqttSender.class");
const FormulaFunModel = require("../Product/clsformulaFun.model");
const ActivityModel = require("../clsActivityLog.model");
const InstrumentUsageModel = require("../clsInstrumentUsageLog");
const MqttModel = require("../Mqtt/mqttSender.class");
const mqttProtocol = require("../../global/GLOBAL_NOMENCLATURE");
const clsCommonUseFunction = require("../clsCommonUseFunction");
const momentObj = require("moment")
const maths = require('mathjs')
const clsMonit = require('../MonitorSocket/clsMonitSocket')
const objMonit = new clsMonit();

const database = new Database();
const now = new Date();
const objformulaFun = new FormulaFunModel();
const objActivityLog = new ActivityModel();
const objInstrumentUsage = new InstrumentUsageModel();
const mqttSender = new MqttModel();
const objCommonUseFunc = new clsCommonUseFunction();
const GLOBAL_NOMENCLATURE = require("../../global/GLOBAL_NOMENCLATURE");
//const { models } = require('../../../config/dbConnection');
const models = require("../../../config/dbConnection").models;
const sequelize = require("../../../config/dbConnection").sequelize;
const { QueryTypes } = require("sequelize");
const { numericDependencies } = require("mathjs");

class Group {
  async processGroupData(dataObj) {
    try {
      let strHmi = dataObj.Hmi;
      let strIdsNo = dataObj.idsNo;
      const menuName = dataObj.menuName;
      const actualWt = dataObj.actualWt;
      const InstrumentId = dataObj.instrumentId;
      const protocolUnit = dataObj.unit;
      const decimalPoint = dataObj.decPoint;
      let ProtocolPortNo = dataObj.ProtocolPortNo;
      let GroupDetail = globalData.arrWeighmentProductData.find((k) => k.Hmi == strHmi);
      let sample = GroupDetail.data.noOfSample;
      let tempCounterArr = globalData.arrWeighmentCounter.find((k) => k.Hmi == strHmi);
      if (tempCounterArr == undefined) {
        globalData.arrWeighmentCounter.push({
          Hmi: strHmi,
          idsNo: strIdsNo,
          counter: 1,
        });
      }
      tempCounterArr = globalData.arrWeighmentCounter.find((k) => k.Hmi == strHmi);

      const __paramGroup = {
        actualWt: actualWt,
        InstrumentId: InstrumentId,
        menuName: menuName,
        idsNo: strIdsNo,
        Hmi: strHmi,
        GroupDetail: GroupDetail,
        protocolUnit: protocolUnit,
        decimalPoint: decimalPoint,
        ProtocolPortNo: ProtocolPortNo,
      };
      //10 >= 1
      if (tempCounterArr.counter == 1) {
        //insert into incomp master and detail
        await this.SaveGroupCompleteData(__paramGroup);
      }
    } catch (error) {
      console.log(error)
      throw new Error(error);

    }
  }

  async SaveGroupCompleteData(dataObj) {
    try {
      let masterTable, detailTable, typeValue;
      let strHmi = dataObj.Hmi;
      let strIdsNo = dataObj.idsNo;
      const strMenuName = dataObj.menuName;
      let actualWt = Number(dataObj.actualWt).toFixed(3);
      let ProtocolPortNo = dataObj.ProtocolPortNo;
      const decimalPoint = dataObj.decimalPoint;
      const InstrumentId = dataObj.InstrumentId;
      var protocolUnit = dataObj.protocolUnit;
      const productDetail = dataObj.GroupDetail.data;
      let sample = parseFloat(productDetail.noOfSample);
      let side = productDetail.Side;
      const currentCubical = globalData.arrIdsInfo.find((k) => k.Hmi == strHmi).cubicalData;
      let tempUserObject = globalData.arrUsers.find((k) => k.Hmi == strHmi);

// // just coz login is skipped
//       if(tempUserObject == undefined){
//         globalData.arrUsers.push({
//           Hmi: strHmi,
//           UserId: '11',
//           UserName: 'jigar.bhandari',
//           UserPass: '1',
//       });
//       }
//        tempUserObject = globalData.arrUsers.find((k) => k.Hmi == strHmi);

      let selectedIdsNo;
      var IPQCObject = globalData.arr_IPQCRelIds.find((k) => k.idsNo == strIdsNo);
      if (IPQCObject != undefined) {
        selectedIdsNo = IPQCObject.selectedIds;
      } else {
        selectedIdsNo = strIdsNo;
      }

      const currentCubicalObj = globalData.arrIdsInfo.find((k) => k.idsNo == selectedIdsNo);

      const menuDetailsArr = globalData.arr_limits.find((k) => k.idsNo == selectedIdsNo);

      let menuDetail = menuDetailsArr.Menus.filter((obj) => Object.keys(obj) == strMenuName)[0][strMenuName];

      if (protocolUnit.startsWith('g')) {
        protocolUnit = protocolUnit == "g" ? "gm" : "gm"
      }

      if (protocolUnit != menuDetail.unit) {
        return mqttSender.sendData(strHmi, `${mqttProtocol.DisplayMessage}Invalid Unit Received`)
      }

      const cubicalObj = currentCubicalObj.cubicalData;
      const NMT = menuDetail.NMT;
      const T1Neg = menuDetail.T1Neg;
      const T2Neg = menuDetail.T2Neg;
      const T1Pos = menuDetail.T1Pos;
      const T2Pos = menuDetail.T2Pos;
      let outFlag = 0;
      let intMstSerNo;
      let reportLimitMsg = `Report Within limit`;
      let minLimitT2;
      let maxLimitT2;
      let maxLimitT1;
      let minLimitT1;

      switch (strMenuName) {
        case GLOBAL_NOMENCLATURE.GroupMenu:
          masterTable = 'tbl_tab_master2';
          detailTable = 'tbl_tab_detail2';
          typeValue = 2;
          maxLimitT1 = objformulaFun.upperLimit(menuDetail, 'T1');
          maxLimitT2 = objformulaFun.upperLimit(menuDetail, 'T2');
          minLimitT2 = objformulaFun.lowerLimit(menuDetail, 'T2');
          minLimitT1 = objformulaFun.lowerLimit(menuDetail, 'T1');
          break;
      }

      var act = `${strMenuName} Test Started on TSH ${strHmi}`
      if(side == 'LHS'){
        var act = `${strMenuName} Test Started on TSH ${strHmi} for side LHS`
      }else if(side == 'RHS'){
        var act = `${strMenuName} Test Started on TSH ${strHmi} for side RHS`
      }

      let __activityObj = {
        strUserId: tempUserObject.UserId,
        strUserName: tempUserObject.UserName,
        activity: act,
      };

      await objActivityLog.ActivityLogEntry(__activityObj);
      await objInstrumentUsage.InstrumentUsage(
        "Balance",
        strIdsNo,
        "tbl_instrumentlog_balance",
        strMenuName,
        "started"
      );

      if (cubicalObj.Sys_RotaryType == 'Double') {
        side = "LHS & RHS";
      }

      let resultCompleteData = await models[masterTable].findAll({
        attributes: [
          [sequelize.fn("max", sequelize.col("RepSerNo")), "RepSerNo"]
          ],

        where: {
          'BFGCode': cubicalObj.Sys_BFGCode,
          'ProductName': cubicalObj.Sys_ProductName,
          'PVersion': cubicalObj.Sys_PVersion,
          'Version': cubicalObj.Sys_Version,
          'BatchNo': cubicalObj.Sys_Batch,
          'CubicleType': cubicalObj.Sys_CubType,
          'ReportType': cubicalObj.Sys_RptType,
          'Side': side
        }
      });
      let remark = "Complies"
      let RepSerno = resultCompleteData[0].RepSerNo;
      if (resultCompleteData[0].RepSerNo != null) {
        resultCompleteData = await models[masterTable].findAll({
          where: {
            RepSerNo: RepSerno
          }
        })
      }
      
      if (resultCompleteData[0].RepSerNo == null) {
        intMstSerNo = 1;
        var nob1 = 0
        var noa2 = 0
        var noa1 = 0
        var nob2 = 0

        if ((Number(actualWt) < Number(minLimitT2)) || (Number(actualWt) > Number(maxLimitT2))) { //No of below limit 2
          var nob2 = 1;
          remark = "Not Complies"
        } 

        if (minLimitT1 != 0 && maxLimitT1 != 0) {
          if ((Number(actualWt) < Number(minLimitT1) && Number(actualWt) >= Number(minLimitT2)) || (Number(actualWt) > Number(maxLimitT1) && Number(actualWt) <= Number(maxLimitT2))) { //No of below limit 1
            var nob1 = 1;
            remark = "Complies"    //CR 
          }
        }

        //above below count 
        // if (actualWt < minLimitT2) { //No of below limit 2
        //   var nob2 = 1;
        //   remark = "Not Complies"
        // } else if (actualWt > maxLimitT2) { //No of Above limit 2
        //   var noa2 = 1;
        //   remark = "Not Complies"
        // }
        // if (minLimitT1 != 0 && maxLimitT1 != 0) {
        //   if (actualWt < minLimitT1 && actualWt >= minLimitT2) { //No of below limit 1
        //     var nob1 = 1;
        //     remark = "Complies"    //CR 
        //   } else if (actualWt > maxLimitT1 && actualWt <= maxLimitT2) { //No of Above limit 1
        //     var noa1 = 1;
        //     remark = "Complies"
        //   }
        // }
      } else {
        var newMstSerNo = resultCompleteData[0].RepSerNo + 1;
        intMstSerNo = newMstSerNo;
        var nob1 = Number(resultCompleteData[0].NoOfBelowT1)
        var noa1 = Number(resultCompleteData[0].NoOfAboveT1)
        var nob2 = Number(resultCompleteData[0].NoOfBelowT2)
        var noa2 = Number(resultCompleteData[0].NoOfAboveT2)

        //CR
        if ((Number(actualWt) < Number(minLimitT2)) || (Number(actualWt) > Number(maxLimitT2))) { //No of below limit 2
          var nob2 = Number(resultCompleteData[0].NoOfBelowT2) + 1;
          remark = "Not Complies"
        }

        if (minLimitT1 != 0 && maxLimitT1 != 0) {
          if ((Number(actualWt) < Number(minLimitT1) && Number(actualWt) >= Number(minLimitT2)) || (Number(actualWt) > Number(maxLimitT1) && Number(actualWt) <= Number(maxLimitT2))) { //No of below limit 1
            var nob1 = Number(resultCompleteData[0].NoOfBelowT1) + 1;
            remark = "Complies" //CR
          }
        }

        //Below above

        // if (Number(actualWt) < Number(minLimitT2)) { //No of below limit 2
        //   var nob2 = Number(resultCompleteData[0].NoOfBelowT2) + 1;
        //   remark = "Not Complies"
        // } else if (Number(actualWt) > Number(maxLimitT2)) { //No of Above limit 2
        //   var noa2 = Number(resultCompleteData[0].NoOfAboveT2) + 1;
        //   remark = "Not Complies"
        // }
        // if (minLimitT1 != 0 && maxLimitT1 != 0) {
        //   if (Number(actualWt) < Number(minLimitT1) && Number(actualWt) >= Number(minLimitT2)) { //No of below limit 1
        //     var nob1 = Number(resultCompleteData[0].NoOfBelowT1) + 1;
        //     remark = "Complies" //CR
        //   } else if (Number(actualWt) > Number(maxLimitT1) && Number(actualWt) <= Number(maxLimitT2)) { //No of Above limit 1
        //     var noa1 = Number(resultCompleteData[0].NoOfAboveT1) + 1;
        //     remark = "Complies"
        //   }
        // }
      }

      if (intMstSerNo != 1) {

        let tabDetails = await models[detailTable].findAll({
          where: {
            RepSerNo: RepSerno,
          },
        });

        if (tabDetails.length != 0) {
          if (cubicalObj.Sys_RotaryType == 'Double') {
            var det = tabDetails.length - 1;
            det = tabDetails[det];
            if (det.Side == 'LHS') {
              side = 'RHS'
            } else {
              side = 'LHS'
            }
          }
        }

        const __paramProductInfoData = {
          side: side,
          masterTable: masterTable,
          detailTable: detailTable,
          BFGCode: cubicalObj.Sys_BFGCode,
          ProductName: cubicalObj.Sys_ProductName,
          PVersion: cubicalObj.Sys_PVersion,
          Version: cubicalObj.Sys_Version,
          BatchNo: cubicalObj.Sys_Batch,
        };

        let seqNo = await this.calculateSeqNo(__paramProductInfoData);

        if (tabDetails.length > 0) {
          const insertIncompleteDetailObj = {
            RepSerNo: RepSerno,
            MstSerNo: intMstSerNo,
            RecSeqNo: seqNo,
            DataValue: actualWt,
            BatchNo: currentCubical.Sys_Batch,
            BFGCode: cubicalObj.Sys_BFGCode,
            UserID: tempUserObject.UserId,
            UserName: tempUserObject.UserName,
            PrDate: momentObj().format("YYYY-MM-DD"),
            PrTime: momentObj().format("HH:mm:ss"),
            Side: side == 'NA' ? 'Single' : side,
            DecimalPoint: decimalPoint,
            PVersion: cubicalObj.Sys_PVersion,
            Version: cubicalObj.Sys_Version,
            AvgWt: (Number(actualWt) / Number(sample)) * 1000,
            Remark: remark,
          };
          var detal_res = await models[detailTable].create(
            insertIncompleteDetailObj
          );
          var lastInsertedDetailID = detal_res.RecNo;

          //update end date

          var DataValue_arr = [];
          var Nominal = menuDetail.nominal;
          Nominal = Number(Nominal).toFixed(3);
          var get_Datavalue = await models[detailTable].findAll({ where: { RepSerNo: RepSerno } })
          var get_Datavalue1 = await models[masterTable].findAll({ where: { RepSerNo: RepSerno } })
          DataValue_arr.push(get_Datavalue);
          var arr = [];
          for (var i = 0; i < get_Datavalue.length; i++) {
            var a = get_Datavalue[i].DataValue;
            arr.push(Number(a));
            console.log(arr);
            var max_value = maths.max(arr);
            var min_value = maths.min(arr);
            // console.log();
            console.log(max_value, min_value);
            // return arr;
          }

          const resupdate = await models[masterTable].update(
            {
              PrEndDate: momentObj().format("YYYY-MM-DD"),
              PrEndTime: momentObj().format("HH:mm:ss"),
              MinValue: Number(min_value).toFixed(3),
              MaxValue: Number(max_value).toFixed(3),
              NoOfBelowT1: nob1 != undefined ? nob1 : 0,
              NoOfAboveT1: noa1 != undefined ? noa1 : 0,
              NoOfBelowT2: nob2 != undefined ? nob2 : 0,
              NoOfAboveT2: noa2 != undefined ? noa2 : 0,
            },
            {
              where: {
                BFGCode: cubicalObj.Sys_BFGCode,
                ProductName: cubicalObj.Sys_ProductName,
                PVersion: cubicalObj.Sys_PVersion,
                Version: cubicalObj.Sys_Version,
                BatchNo: currentCubical.Sys_Batch,
                Idsno: currentCubical.Sys_IDSNo,
              },
            }
          );

          const resCubUpdate = models.tbl_cubical.update(
            {
              Sys_Validation: 0,
            },
            {
              where: {
                Sys_IDSNo: cubicalObj.Sys_IDSNo,
              },
            }
          );
          //mqttSender.sendData(strHmi, `${mqttProtocol.DisplayResult}${1}:${actualWt} ${protocolUnit}`);
          let hmiEntryinConfig = globalData.arrConfigSettings.find((k) => k.Hmi == strHmi).configSetting;

          let autoTare = hmiEntryinConfig[0].AutoTare;

          let tareCommand = hmiEntryinConfig[0].Tare_Command.concat(`\r\n`);

          let sampleNo = 1;
          let limitObjResp = await objCommonUseFunc.SendCommon({
            strHmi,
            actualWt,
            minLimitT2,
            maxLimitT2,
            minLimitT1,
            maxLimitT1,
            strMenuName,
            sampleNo,
          });
          let color = limitObjResp.Color;
          let limit = limitObjResp.limit;

          mqttSender.sendData(
            strHmi,
            `${mqttProtocol.DisplayResult}${1}:${actualWt} ${protocolUnit}:${color}`
          );

          if (autoTare) {
            mqttSender.sendData(
              strHmi,
              `${mqttProtocol.ComWrite}${ProtocolPortNo}:${tareCommand}`
            );
          }
          if (limit.includes("ABOVE") || limit.includes("BELOW")) {
            reportLimitMsg = "Report Out Of Limit"
          }
          else {
            reportLimitMsg = "Report Within Limit"
          }
          mqttSender.sendData(strHmi, limit);
          await objMonit.monit({ case: 'TestWeight', Hmi: strHmi, data: { Weight: actualWt, srNo: "", message: "" } });

        }
      } else {
        //STD limit
        menuDetail.unit = menuDetail.LimitOn == false ? menuDetail.unit : '%'
        if (menuDetail.T1Neg != 0 && menuDetail.T1Pos != 0) {
          if (menuDetail.T1Neg == menuDetail.T1Pos) {
            var std_Limit1 = 'NMT' + ' ' + menuDetail.NMT + ' ' + 'tablets by' + ' ' + '±' + ' ' + Number(menuDetail.T1Neg).toFixed(3) + ' ' + menuDetail.unit;
          } else {
            var std_Limit1 = 'NMT' + ' ' + menuDetail.NMT + ' ' + 'tablets by' + ' ' + Number(menuDetail.T1Neg).toFixed(3) + '-' + Number(menuDetail.T1Pos).toFixed(3) + ' ' + menuDetail.unit;
          }
        } else {
          var std_Limit1 = "NA"
        }
        if (menuDetail.T2Neg == menuDetail.T2Pos) {
          var std_Limit2 = 'None of tablet by ±' + ' ' + Number(menuDetail.T2Neg).toFixed(3) + ' ' + menuDetail.unit
        } else {
          var std_Limit2 = 'None of tablet by' + ' ' + Number(menuDetail.T2Neg).toFixed(3) + '-' + Number(menuDetail.T2Pos).toFixed(3) + ' ' + menuDetail.unit
        }

        const masterCompleteData = {
          MstSerNo: intMstSerNo,
          InstruId: 1,
          WgmtModeNo: typeValue,
          Area: cubicalObj.Sys_Area,
          BFGCode: cubicalObj.Sys_BFGCode,
          ProductName: cubicalObj.Sys_ProductName,
          ProductType: 1,
          Qty: 0,
          GrpQty: sample,
          GrpFreq: 0,
          Idsno: currentCubical.Sys_IDSNo,
          CubicalNo: currentCubical.Sys_CubicNo,
          InsturmentID: currentCubical.Sys_BalID,
          BalanceId: currentCubical.Sys_BalID,
          VernierId: currentCubical.Sys_VernierID,
          BatchNo: currentCubical.Sys_Batch,
          UserId: productDetail.userId,
          UserName: productDetail.userName,
          PrDate: momentObj().format("YYYY-MM-DD"),
          PrTime: momentObj().format("HH:mm:ss"),
          Side: side,
          Unit: protocolUnit,
          DecimalPoint: decimalPoint,
          StdLimit1: std_Limit1,
          StdLimit2: std_Limit2,
          MinValue: actualWt,
          MaxValue: actualWt,
          NoOfBelowT1: nob1 != undefined ? nob1 : 0,
          NoOfAboveT1: noa1 != undefined ? noa1 : 0,
          NoOfBelowT2: nob2 != undefined ? nob2 : 0,
          NoOfAboveT2: noa2 != undefined ? noa2 : 0,
          Nom: Number(menuDetail.nominal).toFixed(3),
          T1NegTol: Number(minLimitT1).toFixed(3) == 0 ? 'NA' : Number(minLimitT1).toFixed(3),
          T1PosTol: Number(maxLimitT1).toFixed(3) == 0 ? 'NA' : Number(maxLimitT1).toFixed(3),
          T2NegTol: Number(minLimitT2).toFixed(3),
          T2PosTol: Number(maxLimitT2).toFixed(3),
          limitOn: menuDetail.LimitOn,
          CubicleType: currentCubical.Sys_CubType,
          ReportType: currentCubical.Sys_RptType,
          RepoLabel10: currentCubical.Sys_IPQCType,
          MachineCode: currentCubical.Sys_MachineCode,
          MFGCode: currentCubical.Sys_MfgCode,
          BatchSize: currentCubical.Sys_BatchSize,
          FriabilityID: currentCubical.Sys_FriabID,
          HardnessID: currentCubical.Sys_HardID,
          CubicleName: currentCubical.Sys_CubicName,
          CubicleLocation: currentCubical.Sys_dept,
          PrintNo: 0,
          IsArchived: 0,
          GraphType: 0,
          BatchComplete: 0,
          PVersion: cubicalObj.Sys_PVersion,
          Version: cubicalObj.Sys_Version,
          Lot: "123",
          SideNo: 1,
          AppearanceDesc: "123",
          MachineSpeed_Min: "123",
          MachineSpeed_Max: "123",
          GenericName: "123",
          BMRNo: "123",
          Stage: currentCubical.Sys_Stage,
          Interval: productDetail.interval,
        };

        if (strMenuName == GLOBAL_NOMENCLATURE.GroupMenu) {
          // masterCompleteData.data.push({ str_colName: 'IsPrintable', value: 0 });
          Object.assign(masterCompleteData, { IsPrintable: 0 });
        }

        let resultincomplete = await models[masterTable].create(
          masterCompleteData
        );

        let lastInsertedID = resultincomplete.RepSerNo;

        let tabDetails = await models[detailTable].findAll({
          where: {
            RepSerNo: lastInsertedID,
          }
        });

        if (tabDetails.length == 0) {
          if (cubicalObj.Sys_RotaryType == 'Double') {
            side = "LHS";
          }
          const insertIncompleteDetailObj = {
            RepSerNo: lastInsertedID,
            MstSerNo: intMstSerNo,
            RecSeqNo: 1,
            DataValue: actualWt,
            BatchNo: cubicalObj.Sys_Batch,
            BFGCode: cubicalObj.Sys_BFGCode,
            UserID: tempUserObject.UserId,
            UserName: tempUserObject.UserName,
            PrDate: momentObj().format("YYYY-MM-DD"),
            PrTime: momentObj().format("HH:mm:ss"),
            Side: side == 'NA' ? 'Single' : side,
            DecimalPoint: decimalPoint,
            PVersion: cubicalObj.Sys_PVersion,
            Version: cubicalObj.Sys_Version,
            AvgWt: (Number(actualWt) / Number(sample)) * 1000,
            Remark: remark,
            InstrumentID: InstrumentId,
          };

          //await database.save(insertIncompleteDetailObj);
          let detailResult = await models[detailTable].create(
            insertIncompleteDetailObj
          );

          //update end date

          let resUpdate = await models[masterTable].update(
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
                Area: cubicalObj.Sys_Area,
              },
            }
          );

          let upValidationRes = await models.tbl_cubical.update(
            {
              Sys_Validation: 0,
            },
            {
              where: {
                Sys_IDSNo: strIdsNo,
              },
            }
          );
        }
        //mqttSender.sendData(strHmi, `${mqttProtocol.DisplayResult}${1}:${actualWt} ${protocolUnit}`);
        let hmiEntryinConfig = globalData.arrConfigSettings.find((k) => k.Hmi == strHmi).configSetting;
        let autoTare = hmiEntryinConfig[0].AutoTare;
        let tareCommand = hmiEntryinConfig[0].Tare_Command.concat(`\r\n`);
        let sampleNo = 1;
        let limitObjResp = await objCommonUseFunc.SendCommon({
          strHmi,
          actualWt,
          minLimitT2,
          maxLimitT2,
          minLimitT1,
          maxLimitT1,
          strMenuName,
          sampleNo,
        });
        let color = limitObjResp.Color;
        let limit = limitObjResp.limit;
        if (limit.includes("ABOVE") || limit.includes("BELOW")) {
          reportLimitMsg = "Report Out Of Limit"
        }
        else {
          reportLimitMsg = "Report Within Limit"
        }

        mqttSender.sendData(
          strHmi,
          `${mqttProtocol.DisplayResult}${1}:${actualWt} ${protocolUnit}:${color}`
        );

        if (autoTare) {
          mqttSender.sendData(
            strHmi,
            `${mqttProtocol.ComWrite}${ProtocolPortNo}:${tareCommand}`
          );
        }

        mqttSender.sendData(strHmi, limit);
        await objMonit.monit({ case: 'TestWeight', Hmi: strHmi, data: { Weight: actualWt, srNo: "", message: "" } });

      }
      //limit checking
      // if (parseFloat(actualWt) > parseFloat(maxLimitT2) || parseFloat(actualWt) < parseFloat(minLimitT2)) {
      //     outFlag += 1
      //     reportLimitMsg = `${mqttProtocol.DisplayMessage}Report generated is Out of T2 Limit`;
      //     console.log("report out of limit")
      // }
      // if (outFlag == 0 && parseFloat(T1Pos) != 0) {
      //     if (parseFloat(actualWt) > parseFloat(maxLimitT1) || parseFloat(actualWt) < parseFloat(minLimitT1)) {
      //         outFlag += 1
      //         reportLimitMsg = `${mqttProtocol.DisplayMessage}Report generated is Out of T1 Limit`
      //         console.log("report within limit")
      //     }
      // }

      var act = `${strMenuName} Test Completed on TSH ${strHmi}`
      if(side == 'LHS'){
        var act = `${strMenuName} Test Completed on TSH ${strHmi} for side LHS`
      }else if(side == 'RHS'){
        var act = `${strMenuName} Test Completed on TSH ${strHmi} for side RHS`
      }

      //instrument usage and activity log
      __activityObj = {
        strUserId: tempUserObject.UserId,
        strUserName: tempUserObject.UserName,
        activity: act,
      };

      await objActivityLog.ActivityLogEntry(__activityObj);

      await objInstrumentUsage.InstrumentUsage(
        "Balance",
        strIdsNo,
        "tbl_instrumentlog_balance",
        strMenuName,
        "completed"
      );

      globalData.arrOutFlagForTest.findIndex(
        (element) => element.Hmi === strHmi
      ) == -1
        ? globalData.arrOutFlagForTest
        : globalData.arrOutFlagForTest.splice(
          globalData.arrOutFlagForTest.findIndex(
            (element) => element.Hmi === strHmi
          ),
          1
        );

      globalData.arrSelectedMenu.findIndex(
        (element) => element.Hmi === strHmi
      ) == -1
        ? globalData.arrSelectedMenu
        : globalData.arrSelectedMenu.splice(
          globalData.arrSelectedMenu.findIndex(
            (element) => element.Hmi === strHmi
          ),
          1
        );

      globalData.arrWeighmentCounter.findIndex(
        (element) => element.Hmi === strHmi
      ) == -1
        ? globalData.arrWeighmentCounter
        : globalData.arrWeighmentCounter.splice(
          globalData.arrWeighmentCounter.findIndex(
            (element) => element.Hmi === strHmi
          ),
          1
        );
      await objMonit.monit({ case: 'ReportStatus', Hmi: strHmi, data: { message: `${reportLimitMsg}` } });
      mqttSender.sendData(strHmi, `${GLOBAL_NOMENCLATURE.TestCompleted} ${reportLimitMsg}`);//Report within / Outoflimit
      // mqttSender.sendData(
      //   strHmi,
      //   `${mqttProtocol.TestCompleted}${strMenuName} Test is Completed`
      // );

      if (cubicalObj.Sys_RotaryType == 'Double' && side == 'LHS') {
        mqttSender.sendData(strHmi, `${mqttProtocol.DisplayMessage} Side Changes to RHS`);
      }

      return
    } catch (error) {
      throw new Error(error);
    }
  }

  async calculateSeqNo(dataObj) {
    try {
      const masterTableName = dataObj.masterTable;
      const detailTableName = dataObj.detailTable;
      let side = dataObj.side;

      if (side == 'LHS' || side == 'RHS') {
        side = "LHS & RHS"
      }

      let selectRes = await models[masterTableName].max("RepSerNo", {
        where: {
          BFGCode: dataObj.BFGCode,
          ProductName: dataObj.ProductName,
          PVersion: dataObj.PVersion,
          Version: dataObj.Version,
          BatchNo: dataObj.BatchNo,
          Side: side,
        },
      });

      side = dataObj.side;

      if (!selectRes) {
        return 1;
      } else {
        let reqSeqRes = await models[detailTableName].max("RecSeqNo", {
          where: {
            RepSerNo: selectRes,
            Side: side == 'NA' ? 'Single' : side,
          },
        });

        if (!reqSeqRes) {
          return 1;
        } else {
          return reqSeqRes + 1;
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
module.exports = Group;
