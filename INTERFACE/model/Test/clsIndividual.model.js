const globalData = require("../../global/globalData");
const clsCommonInsertOpt = require("../Product/clsCommonInsertOperation.model");
const clsIncompleteReport = require("../Product/clsIncompleteReport");
const clsActivityLog = require("../clsActivityLog.model");
const clsInstrumentUsage = require("../clsInstrumentUsageLog");
const FormulaFunModel = require("../Product/clsformulaFun.model");
const mqttProtocol = require("../../global/GLOBAL_NOMENCLATURE");
const MqttModel = require("../Mqtt/mqttSender.class");
const Database = require("../../database/clsQueryProcess");
const clsCommonUseFunction = require("../clsCommonUseFunction");
const GLOBAL_NOMENCLATURE = require("../../global/GLOBAL_NOMENCLATURE");
const PowerBackup = require("../../Utills/powerBackUp/powerbackup");
const models = require("../../../config/dbConnection").models;
const sequelize = require("../../../config/dbConnection").sequelize;
const { QueryTypes, where, NUMBER } = require("sequelize");
const maths = require('mathjs')
const clsMonit = require('../MonitorSocket/clsMonitSocket')
const clsPrintOperation = require('../Print/clsPrintOperation')
const objcallPrint = new clsPrintOperation()
const objMonit = new clsMonit();
const database = new Database();
const objIncompleteReport = new clsIncompleteReport();
const objCommonInsertOpt = new clsCommonInsertOpt();
const objActivityLog = new clsActivityLog();
const objInstrumentUsage = new clsInstrumentUsage();
const objformulaFun = new FormulaFunModel();
const mqttSender = new MqttModel();
const objCommonUseFunc = new clsCommonUseFunction();
const objPowerBackup = new PowerBackup();

class Individual {
  async processIndividualData(__parameterObj) {
    try {
      let strHmi = __parameterObj.Hmi;
      let strIdsNo = __parameterObj.idsNo;
      let actualWt = __parameterObj.actualWt;
      let unit = __parameterObj.unit;
      let ProtocolPortNo = __parameterObj.ProtocolPortNo;
      const strMenuName = __parameterObj.menuName;
      let objResIndividualActivity;
      let objResIndividual;
      let objActivity = {};
      let typeValue;
      let outFlag = 0;
      let reportLimitMsg = "Report generated is Within limit";
      let minLimitT2;
      let maxLimitT2;
      let maxLimitT1;
      let minLimitT1;
      let masterTable;
      let detailTable;
      let dblTable;
      let readingIgnore;

      // const menuDetailsArr = globalData.arr_limits.find(k => k.Hmi == strHmi);
      let individualDetail = globalData.arrWeighmentProductData.find(
        (k) => k.Hmi == strHmi
      );

      let cubicObj = globalData.arrIdsInfo.find(k => k.Hmi == strHmi).cubicalData;
      var AreaName = cubicObj.Sys_Area

      let objSelMenu = globalData.arrSelectedMenu.find(
        (k) => k.idsNo == strIdsNo
      );

      if (unit != objSelMenu.selectedProductDetail.unit) {
        return mqttSender.sendData(strHmi, `${mqttProtocol.DisplayMessage}Invalid Unit Received`)
      }

      let sample = parseFloat(objSelMenu.selectedProductDetail.noOfSamples);
      var side = individualDetail.data.Side
      let batchNo = individualDetail.data.Batch;
      //let menuDetail = menuDetailsArr.Menus.filter(obj => Object.keys(obj) == strMenuName)[0][strMenuName];

      let selectedIdsNo;
      var IPQCObject = globalData.arr_IPQCRelIds.find(
        (k) => k.idsNo == strIdsNo
      );
      if (IPQCObject != undefined) {
        selectedIdsNo = IPQCObject.selectedIds;
      } else {
        selectedIdsNo = strIdsNo;
      }
      // let productDetail = globalData.arrProductTypeArray.find(k => k.Hmi == strHmi).productType;
      //Unit gm to mg conversion
      // if(unit!='mg'){
      //   __parameterObj.actualWt =  Number(__parameterObj.actualWt)/1000
      // }

      switch (strMenuName) {
        case `${GLOBAL_NOMENCLATURE.IndividualMenu}`:
          if (cubicObj.Sys_CubType == 'Capsule Filling' || cubicObj.Sys_IPQCType == 'Capsule Filling') {
            masterTable = 'tbl_cap_master1';
            detailTable = 'tbl_cap_detail1';
            // strincomplete = 'tbl_cap_master1_incomplete';
            typeValue = 1;
            maxLimitT1 = objformulaFun.upperLimit(objSelMenu.selectedProductDetail, 'T1');
            maxLimitT2 = objformulaFun.upperLimit(objSelMenu.selectedProductDetail, 'T2');
            minLimitT2 = objformulaFun.lowerLimit(objSelMenu.selectedProductDetail, 'T2');
            minLimitT1 = objformulaFun.lowerLimit(objSelMenu.selectedProductDetail, 'T1');
          } else {
            masterTable = 'tbl_tab_master1';
            detailTable = 'tbl_tab_detail1';
            // strincomplete =  'tbl_tab_master1_incomplete'
            typeValue = 1;
            maxLimitT1 = objformulaFun.upperLimit(objSelMenu.selectedProductDetail, 'T1');
            maxLimitT2 = objformulaFun.upperLimit(objSelMenu.selectedProductDetail, 'T2');
            minLimitT2 = objformulaFun.lowerLimit(objSelMenu.selectedProductDetail, 'T2');
            minLimitT1 = objformulaFun.lowerLimit(objSelMenu.selectedProductDetail, 'T1');
          }
          break;
        case `${GLOBAL_NOMENCLATURE.IndLayerMenu}`:
          masterTable = 'tbl_tab_master9'
          detailTable = 'tbl_tab_detail9'
          // strincomplete ='tbl_tab_master9_incomplete'
          typeValue = 9;
          maxLimitT1 = objformulaFun.upperLimit(objSelMenu.selectedProductDetail, 'T1');
          maxLimitT2 = objformulaFun.upperLimit(objSelMenu.selectedProductDetail);
          minLimitT2 = objformulaFun.lowerLimit(objSelMenu.selectedProductDetail);
          minLimitT1 = objformulaFun.lowerLimit(objSelMenu.selectedProductDetail, 'T1');
          break;
        case `${GLOBAL_NOMENCLATURE.IndLayer1Menu}`:
          masterTable = 'tbl_tab_master11';
          detailTable = 'tbl_tab_detail11';
          // strincomplete ='tbl_tab_master11_incomplete'
          typeValue = 11;
          maxLimitT1 = objformulaFun.upperLimit(objSelMenu.selectedProductDetail, 'T1');
          maxLimitT2 = objformulaFun.upperLimit(objSelMenu.selectedProductDetail);
          minLimitT2 = objformulaFun.lowerLimit(objSelMenu.selectedProductDetail);
          minLimitT1 = objformulaFun.lowerLimit(objSelMenu.selectedProductDetail, 'T1');
          break;
        case GLOBAL_NOMENCLATURE.GroupIndividual:
          masterTable = "tbl_tab_master19";
          detailTable = "tbl_tab_detail19";
          // strincomplete ="tbl_tab_master19_incomplete"
          typeValue = 19;
          maxLimitT1 = (null, 'T1');
          maxLimitT2 = null;
          minLimitT2 = null;
          minLimitT1 = (null, 'T1');
          break;
      }



      // let intProductType = objSelMenu.selectedProductDetail.ProductType;

      let tempCounterObj = globalData.arrWeighmentCounter.find((k) => k.Hmi == strHmi);
      if (tempCounterObj === undefined) {
        globalData.arrWeighmentCounter.push({ Hmi: strHmi, counter: 0 });
      }
      tempCounterObj = globalData.arrWeighmentCounter.find(
        (k) => k.Hmi == strHmi
      );
      // globalData.arrUserRights
      let tempUserObject = globalData.arrUsers.find((k) => k.Hmi == strHmi);
      // if(tempUserObject == undefined){
      //   globalData.arrUsers.push({
      //     Hmi: strHmi,
      //     UserId: '11',
      //     UserName: 'jigar.bhandari',
      //     UserPass: '1',
      // });
      // }
      //  tempUserObject = globalData.arrUsers.find((k) => k.Hmi == strHmi);

      let _cubicalData = globalData.arrIdsInfo.find(
        (k) => k.Hmi == strHmi
      ).cubicalData;
      // console.log(tempUserObject);
      let __parameterIndividual;

      //@ powerbackup
      __parameterIndividual = {
        strTableName: masterTable,
        strDetailTbl: detailTable,
        // strDblDetailTbl: dblTable,
        objProductDetails: individualDetail.data,
        uniqueSerialNumber: strIdsNo,
        strBalId: __parameterObj.instrumentId,
        ProtocolData: __parameterObj.actualWt,
        ProtocolUnit: __parameterObj.unit,
        ProtocolDecPoint: __parameterObj.unit == 'mg' ? 1 : __parameterObj.decPoint,
        strHmi: strHmi,
        seqNoOfWt: tempCounterObj.counter,
        productType: objSelMenu.selectedProductDetail.ProductType,
        ReportType: _cubicalData.Sys_RptType,
      };
      let tableName = "tbl_powerbackup";
      var powerbackupobj = {
        strTableName: masterTable,
        strDetailTbl: detailTable,
        cubicaNo: _cubicalData.Sys_CubicNo,
        cubicType: _cubicalData.Sys_CubType,
        cubicSysBFGcode: _cubicalData.Sys_BFGCode,
        cubicBatch: _cubicalData.Sys_Batch,
        menuName: individualDetail.data.menuName,
        productType: objSelMenu.selectedProductDetail.ProductType,
        ReportType: _cubicalData.Sys_RptType,
        Userid: individualDetail.data.userId,
        RecSampleNo: tempCounterObj.counter,
        idsNo: strIdsNo,
        Hmi: strHmi,
        // Incomp_RepSerNo: tempCounterObj.counter,
      }

      let lastInserted_repsrno;
      let _check_combination = await objPowerBackup._check_combination_pow(objSelMenu, powerbackupobj, tableName);
      if (_check_combination !== undefined) {
        tempCounterObj.counter = _check_combination.RecSampleNo + 1;
        powerbackupobj.RecSampleNo = tempCounterObj.counter
        __parameterIndividual.seqNoOfWt = tempCounterObj.counter
      }
      else {
        // tempCounterObj.counter += 1;
        powerbackupobj.RecSampleNo = tempCounterObj.counter
        __parameterIndividual.seqNoOfWt = tempCounterObj.counter
      }

      //check for power backup
      if (sample >= tempCounterObj.counter) {
        tempCounterObj.counter += 1;

        const __ParamRemark = {
          idsNo: strHmi,
          menuName: strMenuName,
          batchNo: batchNo,
          tableName: masterTable,
        };
        var activity_msg;
        if (side == 'NA') {
          activity_msg = `${strMenuName} Test Started on TSH ${strHmi}`
        } else {
          activity_msg = `${strMenuName} Test Started on TSH ${strHmi} for side ${side} `
        }
        if (tempCounterObj.counter == 1) {
          let __activityObj = {
            strUserId: tempUserObject.UserId,
            strUserName: tempUserObject.UserName,
            activity: activity_msg
          };

          await objActivityLog.ActivityLogEntry(__activityObj);
          await objInstrumentUsage.InstrumentUsage("Balance", strIdsNo, "tbl_instrumentlog_balance", strMenuName, "started");


          await objCommonInsertOpt.insert_Into_Incomplete_Master(__parameterIndividual);


          const insertRepoRemarkDetail =
            await models.tbl_remark_incomplete_master.create({ IDSNo: strHmi, paramName: strMenuName, tableName: masterTable + "_incomplete", BatchNumber: batchNo });

          await insertRepoRemarkDetail;
          // insert into remark table
        }
        __parameterIndividual.seqNoOfWt = tempCounterObj.counter;
        lastInserted_repsrno = await objCommonInsertOpt.insert_Into_Incomplete_Detail(__parameterIndividual);
        var DataValue_arr = [];
        var detail_tableName = detailTable.concat("_incomplete");
        var master_tableName = masterTable.concat("_incomplete");
        var Nominal = objSelMenu.selectedProductDetail.nominal;
        Nominal = Number(Nominal).toFixed(1);
        var get_Datavalue = await models[detail_tableName].findAll({ where: { RepSerNo: lastInserted_repsrno.repSerNo } })
        var get_Datavalue1 = await models[master_tableName].findAll({ where: { RepSerNo: lastInserted_repsrno.repSerNo } })
        DataValue_arr.push(get_Datavalue);
        var arr = [];
        for (var i = 0; i < get_Datavalue.length; i++) {
          var a = get_Datavalue[i].DataValue;
          arr.push(Number(a));
          console.log(arr);
          var max_value = maths.max(arr);
          max_value = max_value.toFixed(1);
          var min_value = maths.min(arr);
          min_value = min_value.toFixed(1);
          var std_value = maths.std(arr);
          std_value = std_value.toFixed(1);
          var total = arr.reduce((acc, total) => {
            return Number(total) + Number(acc);
          }, 0)
          var avg = total / arr.length
          avg = maths.abs(avg).toFixed(1);
          var minPer_value = ((Nominal - min_value) / Nominal) * 100;
          minPer_value = maths.abs(minPer_value).toFixed(1)
          var maxPer_value = ((max_value - Nominal) / Nominal) * 100;
          maxPer_value = maths.abs(maxPer_value).toFixed(1)

          // console.log();
          console.log(max_value, min_value, std_value, avg, minPer_value, maxPer_value);
          // return arr;
        }
        //No.of Tablets Above and Below limit
        var T1Pos_Tol, T1Neg_Tol, T2Pos_Tol, T2Neg_Tol;
        T1Pos_Tol = get_Datavalue1[0].T1PosTol;
        T1Neg_Tol = get_Datavalue1[0].T1NegTol;
        T2Pos_Tol = get_Datavalue1[0].T2PosTol;
        T2Neg_Tol = get_Datavalue1[0].T2NegTol;

        if ((Number(__parameterObj.actualWt) < Number(T2Neg_Tol)) || (Number(__parameterObj.actualWt) > Number(T2Pos_Tol))) {
          get_Datavalue1[0].NoOfBelowT2 = Number(get_Datavalue1[0].NoOfBelowT2) + 1;
        } 

        if (T1Pos_Tol != 0 && T1Neg_Tol != 0) {
          if ((Number(__parameterObj.actualWt) < Number(T1Neg_Tol) && Number(__parameterObj.actualWt) >= Number(T2Neg_Tol)) || (Number(__parameterObj.actualWt) > Number(T1Pos_Tol) && Number(__parameterObj.actualWt) <= Number(T2Pos_Tol))) {
            get_Datavalue1[0].NoOfBelowT1 = Number(get_Datavalue1[0].NoOfBelowT1) + 1;
          } 
        }

        // if (Number(__parameterObj.actualWt) < Number(T2Neg_Tol)) {
        //   get_Datavalue1[0].NoOfBelowT2 = Number(get_Datavalue1[0].NoOfBelowT2) + 1;
        // } else if (Number(__parameterObj.actualWt) > Number(T2Pos_Tol)) {
        //   get_Datavalue1[0].NoOfAboveT2 = Number(get_Datavalue1[0].NoOfAboveT2) + 1;
        // }
        // if (T1Pos_Tol != 0 && T1Neg_Tol != 0) {
        //   if (Number(__parameterObj.actualWt) < Number(T1Neg_Tol) && Number(__parameterObj.actualWt) >= Number(T2Neg_Tol)) {
        //     get_Datavalue1[0].NoOfBelowT1 = Number(get_Datavalue1[0].NoOfBelowT1) + 1;
        //   } else if (Number(__parameterObj.actualWt) > Number(T1Pos_Tol) && Number(__parameterObj.actualWt) <= Number(T2Pos_Tol)) {
        //     get_Datavalue1[0].NoOfAboveT1 = Number(get_Datavalue1[0].NoOfAboveT1) + 1;
        //   }
        // }

        //update Min and Max value in Master and also Std,minPer,maxPer
        var get_Datavalue11 = await models[master_tableName].update({
          AvgValue: avg,
          MinValue: min_value,
          MaxValue: max_value,
          StdDev: std_value,
          MinPer: minPer_value,
          MaxPer: maxPer_value,
          NoOfAboveT1: get_Datavalue1[0].NoOfAboveT1,
          NoOfAboveT2: get_Datavalue1[0].NoOfAboveT2,
          NoOfBelowT1: get_Datavalue1[0].NoOfBelowT1,
          NoOfBelowT2: get_Datavalue1[0].NoOfBelowT2
        }, { where: { RepSerNo: lastInserted_repsrno.repSerNo } })
        // objResIndividual = await objInstrumentUsage.InstrumentUsage('Balance', strIdsNo, 'tbl_instrumentlog_balance', '', 'completed');
        powerbackupobj.Incomp_RepSerNo = lastInserted_repsrno.repSerNo
        await objPowerBackup.getStatusoFTestForPowerBackup(powerbackupobj);
        var incompRepSerNo = await objPowerBackup.updateTestCount(objSelMenu, powerbackupobj, tableName);

        let hmiEntryinConfig = globalData.arrConfigSettings.find((k) => k.Hmi == strHmi).configSetting;
        let autoTare = hmiEntryinConfig[0].AutoTare;
        let tareCommand = hmiEntryinConfig[0].Tare_Command.concat(`\r\n`);

        let sampleNo = tempCounterObj.counter;

        let limitObjResp = await objCommonUseFunc.SendCommon({
          strHmi,
          actualWt,
          readingIgnore,
          minLimitT2,
          maxLimitT2,
          minLimitT1,
          maxLimitT1,
          strMenuName,
          sampleNo,
        });
        let color = limitObjResp.Color;
        let limit = limitObjResp.limit;

        mqttSender.sendData(strHmi, `${mqttProtocol.DisplayResult}${tempCounterObj.counter}:${Number(actualWt).toFixed(lastInserted_repsrno.decimal)} ${unit}:${color}`);
        //.toFixed(lastInserted_repsrno.decimal)
        if (autoTare) {
          mqttSender.sendData(
            strHmi,
            `${mqttProtocol.ComWrite}${ProtocolPortNo}:${tareCommand}`
          );
        }
        if (limit != 'DisplayMessage:Within Limit') {
          mqttSender.sendData(strHmi, limit);
        }
        let tempPbkupObj = globalData.monitDetail.find(k => k.Hmi == strHmi);
        if (tempPbkupObj != undefined) {
          if (tempPbkupObj.data != undefined) {
            if (tempPbkupObj.data.length > 0) {
              for (var i = 0; i < tempPbkupObj.data.length; i++) {
                await objMonit.monit({
                  case: 'TestWeight',
                  Hmi: strHmi,
                  data: {
                    Weight: tempPbkupObj.data[i].DataValue,
                    srNo: i + 1,
                    message: ""
                  }
                })
              }
            }
          }
          var index = globalData.monitDetail.findIndex(k => k.Hmi == strHmi);
          globalData.monitDetail[index].data = [];
        }
        await objMonit.monit({
          case: 'TestWeight',
          Hmi: strHmi,
          data: {
            Weight: actualWt,
            srNo: tempCounterObj.counter,
            message: ""
          }
        });

        if (sample == tempCounterObj.counter) {
          //move data from incomplete to complete
          //remove outOfLimit Flag
          //check nmt range
          //limit checking
          var remark;
          if (objSelMenu.selectedProductDetail.isonstd == false) {
            objSelMenu.selectedProductDetail.nominal = avg;
            masterTable = 'tbl_tab_master1';
            detailTable = 'tbl_tab_detail1';
            // strincomplete =  'tbl_tab_master1_incomplete'
            typeValue = 1;
            maxLimitT1 = objformulaFun.upperLimit(objSelMenu.selectedProductDetail, 'T1');
            maxLimitT2 = objformulaFun.upperLimit(objSelMenu.selectedProductDetail, 'T2');
            minLimitT2 = objformulaFun.lowerLimit(objSelMenu.selectedProductDetail, 'T2');
            minLimitT1 = objformulaFun.lowerLimit(objSelMenu.selectedProductDetail, 'T1');

            var DataValue_arr = [];
            var detail_tableName = detailTable.concat("_incomplete");
            var master_tableName = masterTable.concat("_incomplete");
            var Nominal = objSelMenu.selectedProductDetail.nominal;
            Nominal = Number(Nominal).toFixed(1);
            var get_Datavalue = await models[detail_tableName].findAll({ where: { RepSerNo: lastInserted_repsrno.repSerNo } })
            var get_Datavalue1 = await models[master_tableName].findAll({ where: { RepSerNo: lastInserted_repsrno.repSerNo } })

            get_Datavalue1[0].NoOfBelowT1 = 0;
            get_Datavalue1[0].NoOfAboveT1 = 0;
            get_Datavalue1[0].NoOfBelowT2 = 0;
            get_Datavalue1[0].NoOfAboveT2 = 0;

            DataValue_arr.push(get_Datavalue);
            var arr = [];
            for (var i = 0; i < get_Datavalue.length; i++) {
              var a = get_Datavalue[i].DataValue;

              if ((Number(a) < Number(minLimitT2)) || (Number(a) > Number(maxLimitT2))) {
                get_Datavalue1[0].NoOfBelowT2 = Number(get_Datavalue1[0].NoOfBelowT2) + 1;
              }

              if (maxLimitT1 != 0 && minLimitT1 != 0) {
                if ((Number(a) < Number(minLimitT1) && Number(a) >= Number(minLimitT2)) || (Number(a) > Number(maxLimitT1) && Number(a) <= Number(maxLimitT2))) {
                  get_Datavalue1[0].NoOfBelowT1 = Number(get_Datavalue1[0].NoOfBelowT1) + 1;
                }
              }

              // if (Number(a) < Number(minLimitT2)) {
              //   get_Datavalue1[0].NoOfBelowT2 = Number(get_Datavalue1[0].NoOfBelowT2) + 1;
              // } else if (Number(a) > Number(maxLimitT2)) {
              //   get_Datavalue1[0].NoOfAboveT2 = Number(get_Datavalue1[0].NoOfAboveT2) + 1;
              // }
              // if (maxLimitT1 != 0 && minLimitT1 != 0) {
              //   if (Number(a) < Number(minLimitT1) && Number(a) >= Number(minLimitT2)) {
              //     get_Datavalue1[0].NoOfBelowT1 = Number(get_Datavalue1[0].NoOfBelowT1) + 1;
              //   } else if (Number(a) > Number(maxLimitT1) && Number(a) <= Number(maxLimitT2)) {
              //     get_Datavalue1[0].NoOfAboveT1 = Number(get_Datavalue1[0].NoOfAboveT1) + 1;
              //   }
              // }

              arr.push(Number(a));
              console.log(arr);
              var max_value = maths.max(arr);
              max_value = max_value.toFixed(1);
              var min_value = maths.min(arr);
              min_value = min_value.toFixed(1);
              var std_value = maths.std(arr);
              std_value = std_value.toFixed(1);
              var total = arr.reduce((acc, total) => {
                return Number(total) + Number(acc);
              }, 0)
              var avg = total / arr.length
              avg = maths.abs(avg).toFixed(1);
              var minPer_value = ((Nominal - min_value) / Nominal) * 100;
              minPer_value = maths.abs(minPer_value).toFixed(1)
              var maxPer_value = ((max_value - Nominal) / Nominal) * 100;
              maxPer_value = maths.abs(maxPer_value).toFixed(1)

              // console.log();
              console.log(max_value, min_value, std_value, avg, minPer_value, maxPer_value);
              // return arr;

              var get_Datavalue11 = await models[master_tableName].update({
                AvgValue: avg,
                MinValue: min_value,
                MaxValue: max_value,
                StdDev: std_value,
                MinPer: minPer_value,
                MaxPer: maxPer_value,
                NoOfAboveT1: get_Datavalue1[0].NoOfAboveT1,
                NoOfAboveT2: get_Datavalue1[0].NoOfAboveT2,
                NoOfBelowT1: get_Datavalue1[0].NoOfBelowT1,
                NoOfBelowT2: get_Datavalue1[0].NoOfBelowT2,
                T1NegTol: Number(minLimitT1).toFixed(1),
                T1PosTol: Number(maxLimitT1).toFixed(1),
                T2NegTol: Number(minLimitT2).toFixed(1),
                T2PosTol: Number(maxLimitT2).toFixed(1),
              }, { where: { RepSerNo: lastInserted_repsrno.repSerNo } });

            }

          }
          var SampleRemark = globalData.arrSampleRemarkForAllTest.find(k => k.Hmi == strHmi);
          if ((Number(get_Datavalue1[0].NoOfAboveT2) != 0 || Number(get_Datavalue1[0].NoOfBelowT2) != 0)) {
            remark = 'Not Complies';
            SampleRemark.OutOfRemark = true
          } else {
            remark = 'Complies';
            SampleRemark.OutOfRemark = false
          }
          var Result_remrk
          if (remark == "Complies") {
            Result_remrk = 'Report Within Limit'
          } else {
            Result_remrk = 'Report Out Of Limit'
          }
          __parameterIndividual.remark = remark;
          var Remark = await objCommonInsertOpt.saveCompleteData(__parameterIndividual, typeValue);//batch summary
          // await objCommonInsertOpt.updateEndDate(strIdsNo, strHmi, masterTable);
          //@sunil powerbackup delete after test complete
          const _deletePowerbackup = await models.tbl_powerbackup.destroy({
            where: {
              IdsNo: strHmi,
              Sys_Batch: _cubicalData.Sys_Batch,
              WeighmentName: strMenuName
            },
          });

          const objUpdateValidation = await models.tbl_cubical.update({
            'Sys_Validation': 0
        }, {
            where: {
                'Sys_IDSNo': strHmi
            }

        });

          if (remark == 'Complies') {
            let productType = 1;

            let tempMenuName;
            if (strMenuName == GLOBAL_NOMENCLATURE.IndividualMenu) {
              tempMenuName = 'Individual'
            }

            let obj = {
              recordFrom: "Current",
              reportOption: tempMenuName,
              reportType: "Complete",
              testType: "Regular",
              RepSerNo: Remark.res.RepSerNo,
              userId: tempUserObject.UserId,
              username: tempUserObject.UserName,
              printNo: 0,
              str_url: productType == 1 ? "Tablet" : "Capsule"
            }
            await objcallPrint.callViewTabReport(obj, productType, strHmi)

          }

          // let result = await objIncompleteReport.getIncomepleteData(__parameterIndividual, __parameterIndividual.strTableName, __parameterIndividual.strDetailTbl, strIdsNo);
          var comp_activity;
          if (side == 'NA') {
            comp_activity = `${strMenuName} Test Completed on TSH ${strHmi}`
          } else {
            comp_activity = `${strMenuName} Test Completed on TSH ${strHmi} for side ${side} `
          }
          Object.assign(
            objActivity,
            { strUserId: tempUserObject.UserId },
            { strUserName: tempUserObject.UserName },
            { activity: comp_activity }
          );
          objResIndividualActivity = await objActivityLog.ActivityLogEntry(
            objActivity
          );
          objResIndividual = await objInstrumentUsage.InstrumentUsage("Balance", strIdsNo, "tbl_instrumentlog_balance", "", "completed");
          console.log(tempCounterObj.counter);
          globalData.arrWeighmentCounter.findIndex((k) => k.Hmi == strHmi) == -1
            ? globalData.arrWeighmentCounter
            : globalData.arrWeighmentCounter.splice(
              globalData.arrWeighmentCounter.findIndex(
                (k) => k.Hmi == strHmi), 1
            );

          globalData.arrCurrentOperationStatus.findIndex(
            (element) => element.Hmi === strHmi
          ) == -1
            ? globalData.arrCurrentOperationStatus
            : globalData.arrCurrentOperationStatus.splice(
              globalData.arrCurrentOperationStatus.findIndex(
                (element) => element.Hmi === strHmi
              ),
              1
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

          //test splice if rotarty is not double
          globalData.arrSelectedMenu.findIndex((k) => k.Hmi == strHmi) == -1
            ? globalData.arrSelectedMenu
            : globalData.arrSelectedMenu.splice(
              globalData.arrSelectedMenu.findIndex((k) => k.Hmi == strHmi),
              1
            );

          //monit
          await objMonit.monit({
            case: 'ReportStatus',
            Hmi: strHmi,
            data: {
              message: Result_remrk
            }
          });
          return mqttSender.sendData(
            strHmi,
            `${GLOBAL_NOMENCLATURE.DisplayMessage}${Result_remrk}`
          );
        }

      }
    } catch (error) {
      throw new Error(error);
    }
  }

  async calculateDoubleVal(Nominal, CommingWT) {
    var percent = (80 / 100) * parseFloat(Nominal);
    return CommingWT > parseFloat(Nominal) + percent ? true : false;
  }
}
module.exports = Individual;
