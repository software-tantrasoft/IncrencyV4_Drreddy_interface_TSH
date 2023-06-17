const date = require("date-and-time");
const models = require("../../../config/dbConnection").models;
const sequelize = require("../../../config/dbConnection").sequelize;
const globalData = require("../../global/globalData");
const GLOBAL_NOMENCLATURE = require("../../global/GLOBAL_NOMENCLATURE");
const clsActivityLog = require('../../model/clsActivityLog.model');
const clsCommonFun = require('../../model/Product/clsCommonInsertOperation.model');
const serverConfig = require("../../../../IncrencyV4SDPConfig.json");
const objCommonFunOperation = new clsCommonFun();
const axios = require("axios");
const moment = require("moment");
const momentObj = require('moment');
const clsHmiModel = require('../../model/hmiDetail.model');
const objHmi = new clsHmiModel();
const objActivityLog = new clsActivityLog();
const clsMenuModel = require('../../model/Menu/MenuRequest.model');
const objmenu = new clsMenuModel();
const { QueryTypes } = require('sequelize');
const { electronMassDependencies } = require("mathjs");

const maths = require('mathjs')
const FormulaFunModel = require("../../model/Product/clsformulaFun.model");
const objformulaFun = new FormulaFunModel();

class PowerBackup {
  async getStatusoFTestForPowerBackup(powerbackupobj) {
    let strHmi = powerbackupobj.Hmi;
    let strIdsNo = powerbackupobj.idsNo;
    let tableName = "tbl_powerbackup";
    let individualDetail = globalData.arrWeighmentProductData.find((k) => k.Hmi == strHmi);
    // let _cubicalData = globalData.arrIdsInfo.find(k => k.idsNo == strIdsNo).cubicalData;
    let objSelMenu = globalData.arrSelectedMenu.find((k) => k.Hmi == strHmi);
    let tempUserObject = globalData.arrUsers.find((k) => k.Hmi == strHmi);

    let _check_combination = await this._check_combination_pow(objSelMenu, powerbackupobj, tableName);
    if (_check_combination === undefined) {
      const _insertInPoerBackup = await models["tbl_powerbackup"].create({
        CubicalNo: powerbackupobj.cubicaNo,
        Sys_CubType: powerbackupobj.cubicType,
        Sys_BFGCode: powerbackupobj.cubicSysBFGcode,
        Sys_Batch: powerbackupobj.cubicBatch,
        WeighmentName: individualDetail.data.menuName,
        ProductType: powerbackupobj.productType,
        Userid: tempUserObject.UserId,
        Idsno: strHmi,
        Incomp_RepSerNo: powerbackupobj.Incomp_RepSerNo,
        RecSampleNo: powerbackupobj.RecSampleNo,
        ReportType: powerbackupobj.ReportType
      });

      let res = [_insertInPoerBackup.dataValues];
      return res[0];
      //console.log([_check_combination]);
    } else {
      await models[tableName].update({
        Incomp_RepSerNo: powerbackupobj.Incomp_RepSerNo,
        RecSampleNo: powerbackupobj.RecSampleNo
      }, {
        where: {
          CubicalNo: powerbackupobj.cubicaNo,
          Sys_CubType: powerbackupobj.cubicType,
          Sys_BFGCode: powerbackupobj.cubicSysBFGcode,
          Sys_Batch: powerbackupobj.cubicBatch,
          ProductType: objSelMenu.selectedProductDetail.ProductType,
          ReportType: powerbackupobj.ReportType
        },
      });

      //  this.updateTestCount(objSelMenu, powerbackupobj, tableName);
      _check_combination = await this._check_combination_pow(objSelMenu, powerbackupobj, tableName);
      return _check_combination.RecSampleNo;
    }
  }
  async updateTestCount(objSelMenu, powerbackupobj, tableName) {
    // console.log(`updateTestCount:${JSON.stringify(powerbackupobj)}`)
    let _check_combination = await this._check_combination_pow(objSelMenu, powerbackupobj, tableName);
    if (_check_combination !== undefined) {
      let _check_update_combination = await models.tbl_powerbackup.update(
        {
          RecSampleNo: powerbackupobj.RecSampleNo,
        },
        {
          where: {
            CubicalNo: powerbackupobj.cubicaNo,
            Sys_CubType: powerbackupobj.cubicType,
            Sys_BFGCode: powerbackupobj.cubicSysBFGcode,
            Sys_Batch: powerbackupobj.cubicBatch,
            ProductType: powerbackupobj.productType,
            IdsNo: powerbackupobj.Hmi,
            ReportType: powerbackupobj.ReportType
          },
        }
      );
      //   console.log(`powerbackup ${powerbackupobj.Incomp_RepSerNo}`);
      //return powerbackupobj.Incomp_RepSerNo;
    } else {
      console.log("not found Incomp_RepSerNo");
    }
  }
  async _check_combination_pow(objSelMenu, powerbackupobj, tableName) {
    //check if combination of product and batch is exist then start test form next
    // console.log(`_check_combination_pow:${JSON.stringify(powerbackupobj)}`)
    const _check_combination = await models[tableName].findAll({
      where: {
        CubicalNo: powerbackupobj.cubicaNo,
        Sys_CubType: powerbackupobj.cubicType,
        Sys_BFGCode: powerbackupobj.cubicSysBFGcode,
        Sys_Batch: powerbackupobj.cubicBatch,
        ProductType: powerbackupobj.productType,
        Userid: powerbackupobj.Userid,
        IdsNo: powerbackupobj.Hmi,
        ReportType: powerbackupobj.ReportType

      },
    });
    return [_check_combination][0][0];
  }
  async _check_empty_combination_pow(objSelMenu, powerbackupobj, tableName) {
    //check if combination of product and batch is exist then start test form next
    const _check_combination = await models[tableName].findAll({
      where: {
        CubicalNo: powerbackupobj.cubicaNo,
        Sys_CubType: powerbackupobj.cubicType,
        Sys_BFGCode: powerbackupobj.cubicSysBFGcode,
        Sys_Batch: powerbackupobj.cubicBatch,
        ProductType: powerbackupobj.productType,
        Userid: powerbackupobj.Userid,
        IdsNo: powerbackupobj.Hmi,
        ReportType: powerbackupobj.ReportType
      },
    });
    return [_check_combination][0][0];
  }
  async getEmptyShellStatusoFTestForPowerBackup(powerbackupobj) {
    let strHmi = powerbackupobj.Hmi;
    let strIdsNo = powerbackupobj.idsNo;
    let tableName = "tbl_powerbackup";
    let individualDetail = globalData.arrWeighmentProductData.find(
      (k) => k.Hmi == strHmi
    );
    // let _cubicalData = globalData.arrIdsInfo.find(k => k.idsNo == strIdsNo).cubicalData;
    let objSelMenu = globalData.arrSelectedMenu.find(
      (k) => k.idsNo == strIdsNo
    );
    let tempUserObject = globalData.arrUsers.find((k) => k.Hmi == strHmi);

    let _check_combination = await this._check_empty_combination_pow(
      objSelMenu,
      powerbackupobj,
      tableName
    );
    if (_check_combination === undefined) {
      const _insertInPoerBackup = await models["tbl_powerbackup"].create({
        CubicalNo: powerbackupobj.cubicaNo,
        Sys_CubType: powerbackupobj.cubicType,
        Sys_BFGCode: powerbackupobj.cubicSysBFGcode,
        Sys_Batch: powerbackupobj.cubicBatch,
        WeighmentName: individualDetail.data.menuName,
        ProductType: 0,
        Userid: tempUserObject.UserId,
        Idsno: strHmi,
        Incomp_RepSerNo: powerbackupobj.Incomp_RepSerNo,
        RecSampleNo: powerbackupobj.RecSampleNo,
        ReportType: powerbackupobj.ReportType
      });

      let res = [_insertInPoerBackup];
      return res[0][0];
      //console.log([_check_combination]);
    } else {
      //  this.updateTestCount(objSelMenu, powerbackupobj, tableName);
      _check_combination = await this._check_empty_combination_pow(
        objSelMenu,
        powerbackupobj,
        tableName
      );
      return _check_combination.Incomp_RepSerNo;
    }
  }
  async updateEmptyShellTestCount(objSelMenu, powerbackupobj, tableName) {
    let _check_combination = await this._check_empty_combination_pow(
      objSelMenu,
      powerbackupobj,
      tableName
    );
    if (_check_combination !== undefined) {
      let _check_update_combination = await models.tbl_powerbackup.update(
        {
          RecSampleNo: powerbackupobj.RecSampleNo,
        },
        {
          where: {
            CubicalNo: powerbackupobj.cubicaNo,
            Sys_CubType: powerbackupobj.cubicType,
            Sys_BFGCode: powerbackupobj.cubicSysBFGcode,
            Sys_Batch: powerbackupobj.cubicBatch,
            ProductType: 0,
            IdsNo: powerbackupobj.Hmi,
            ReportType: powerbackupobj.ReportType
          },
        }
      );
      //   console.log(`powerbackup ${powerbackupobj.Incomp_RepSerNo}`);
      //return powerbackupobj.Incomp_RepSerNo;
    } else {
      console.log("not found Incomp_RepSerNo");
    }
  }
  async chkPowerBackupPresent(data) {
    var objuser = await models["tbl_users"].findAll({
      where: {
        UserID: data.userId
      }
    });
    objuser = objuser[0];
    var _calib_entry = await models["tbl_powerbackup"].findAll({
      where: {
        IdsNo: data.Hmi,
      },
    });
    var ChangeBatch = await models.tbl_cubical.findAll({
      where: {
        Sys_IDSNo: data.Hmi,
      },
    });

    if (_calib_entry.length != 0) {
      if (_calib_entry[0].WeighmentType == "Calib") {
      }
    } else {
      var response = "VALIDATED";
    }
    if (ChangeBatch[0].Sys_cubTypes != "IPQA") {
      var ExistingBatch = await models["tbl_powerbackup"].findAll({
        where: {
          IdsNo: data.Hmi,
        },
      });
      if (ExistingBatch.length != 0) {
        if (ChangeBatch[0].Sys_Batch != ExistingBatch[0].Sys_Batch) {  //Different Batch 
          var check = await models.tbl_powerbackup.destroy({
            where: {
              idsNo: data.Hmi,
            },
          });
        }
      }
      var Checkchangerpttype = await models["tbl_powerbackup"].findAll({
        where: {
          // Userid: data.userId,
          idsNo: data.Hmi,
        },
      });

      if (Checkchangerpttype.length != 0) {
        if (Checkchangerpttype[0].ReportType != ChangeBatch[0].Sys_RptType) {
          var Checkchangerpttype = await models["tbl_powerbackup"].destroy({
            where: {
              // Userid: data.userId,
              idsNo: data.Hmi,
              ReportType: Checkchangerpttype[0].ReportType,
            },
          });
          console.log(data.Hmi, "Report Type Change");
        }
      }
    }

    var check = await models["tbl_powerbackup"].findAll({
      where: {
        // Userid: data.userId,
        idsNo: data.Hmi,
        // ReportType: ChangeBatch[0].Sys_RptType
      },
    });
    check = check[0];

    if (check != undefined && check != null && check.length != 0) {
      var strMenuName = check.WeighmentName;
      var masterTable = "";
      var detailTable = "";
      switch (strMenuName) {
        case `${GLOBAL_NOMENCLATURE.IndividualMenu}`:
          if (check.ProductType == 2) {
            masterTable = "tbl_cap_master1_incomplete";
          } else {
            masterTable = "tbl_tab_master1_incomplete";
          }
          break;
        case GLOBAL_NOMENCLATURE.Hardness:
          masterTable = "tbl_tab_master_htd_incomplete";
          break;
      }
      // var prodmaster = await models[masterTable].findOne({ //commented 20/01/23
      //   where: {
      //     RepSerNo: check.Incomp_RepSerNo,
      //   },
      // });

      var weightmentName = "";
      var pre_sample = "";
      switch (check.WeighmentName) {
        case `${GLOBAL_NOMENCLATURE.IndividualMenu}`:
          weightmentName = "Individual";
          pre_sample = "DataValue";
          break;
        // case GLOBAL_NOMENCLATURE.GroupIndividual:
        //   weightmentName = GLOBAL_NOMENCLATURE.GroupIndividual;
        //   break;
        case GLOBAL_NOMENCLATURE.Hardness:
          weightmentName = "Hardness";
          pre_sample = "DataValue";
          break;
        default:
          weightmentName = check.WeighmentName.toUpperCase();
      }

      //if not same user then give msg to discard / logout or normal pending msg
      //  let sameUserId = true
      //  let otherUser = false
      if (check.Userid != data.userId) {
        //discard tht old user test

        await models.tbl_powerbackup.destroy({
          where: {
            idsNo: data.Hmi,
            Userid: check.Userid,
          },
        });
        if (check.WeighmentName == GLOBAL_NOMENCLATURE.IndividualMenu) {
          let objSelMenu = globalData.arrSelectedMenu.find(
            (k) => k.Hmi == data.Hmi
          );
          if (objSelMenu.selectedProductDetail.isonstd.data[0] == 1) {
            var masterTable = 'tbl_tab_master1';
            var detailTable = 'tbl_tab_detail1';
            // strincomplete =  'tbl_tab_master1_incomplete'
            var detail_tableName = detailTable.concat("_incomplete");
            var master_tableName = masterTable.concat("_incomplete");
            var get_Datavalue = await models[detail_tableName].findAll({ where: { RepSerNo: check.Incomp_RepSerNo, } })
            var get_Datavalue1 = await models[master_tableName].findAll({ where: { RepSerNo: check.Incomp_RepSerNo, } })

            objSelMenu.selectedProductDetail.nominal = get_Datavalue1[0].AvgValue;

            var Nominal = objSelMenu.selectedProductDetail.nominal;
            Nominal = Number(Nominal).toFixed(2);

            var typeValue = 1;
            var maxLimitT1 = objformulaFun.upperLimit(objSelMenu.selectedProductDetail, 'T1');
            var maxLimitT2 = objformulaFun.upperLimit(objSelMenu.selectedProductDetail, 'T2');
            var minLimitT2 = objformulaFun.lowerLimit(objSelMenu.selectedProductDetail, 'T2');
            var minLimitT1 = objformulaFun.lowerLimit(objSelMenu.selectedProductDetail, 'T1');

            var DataValue_arr = [];

            get_Datavalue1[0].NoOfBelowT1 = 0;
            get_Datavalue1[0].NoOfAboveT1 = 0;
            get_Datavalue1[0].NoOfBelowT2 = 0;
            get_Datavalue1[0].NoOfAboveT2 = 0;

            DataValue_arr.push(get_Datavalue);
            var arr = [];
            for (var i = 0; i < get_Datavalue.length; i++) {
              var a = get_Datavalue[i].DataValue;

              if (Number(a) < Number(minLimitT2)) {
                get_Datavalue1[0].NoOfBelowT2 = Number(get_Datavalue1[0].NoOfBelowT2) + 1;
              } else if (Number(a) > Number(maxLimitT2)) {
                get_Datavalue1[0].NoOfAboveT2 = Number(get_Datavalue1[0].NoOfAboveT2) + 1;
              }
              if (maxLimitT1 != 0 && minLimitT1 != 0) {
                if (Number(a) < Number(minLimitT1) && Number(a) >= Number(minLimitT2)) {
                  get_Datavalue1[0].NoOfBelowT1 = Number(get_Datavalue1[0].NoOfBelowT1) + 1;
                } else if (Number(a) > Number(maxLimitT1) && Number(a) <= Number(maxLimitT2)) {
                  get_Datavalue1[0].NoOfAboveT1 = Number(get_Datavalue1[0].NoOfAboveT1) + 1;
                }
              }

              arr.push(Number(a));
              console.log(arr);
              var max_value = maths.max(arr);
              max_value = max_value.toFixed(1);
              var min_value = maths.min(arr);
              min_value = min_value.toFixed(1);
              var std_value = maths.std(arr);
              std_value = std_value.toFixed(2);
              var total = arr.reduce((acc, total) => {
                return Number(total) + Number(acc);
              }, 0)
              var avg = total / arr.length
              avg = maths.abs(avg).toFixed(1);
              var minPer_value = ((Nominal - min_value) / Nominal) * 100;
              minPer_value = maths.abs(minPer_value).toFixed(2)
              var maxPer_value = ((max_value - Nominal) / Nominal) * 100;
              maxPer_value = maths.abs(maxPer_value).toFixed(2)

              // console.log();
              console.log(max_value, min_value, std_value, avg, minPer_value, maxPer_value);
              // return arr;

              var get_Datavalue11 = await models[master_tableName].update({
                AvgValue: avg,
                MinValue: min_value,
                MaxValue: max_value,
                // StdDev: std_value,
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
              }, { where: { RepSerNo: check.Incomp_RepSerNo } });
            }
          }
          await models.tbl_tab_master1_incomplete.update(
            {
              IsProcess: 0,
              PrEndDate: momentObj().format("YYYY-MM-DD"),
              PrEndTime: momentObj().format("HH:mm:ss"),
              FailedRemarkI: "Aborted test"
            }, {
            where: {
              RepSerNo: check.Incomp_RepSerNo,
            }
          }
          );
          var hmiDetails = await models.tbl_tab_master1_incomplete.findAll({
            where: {
              RepSerNo: check.Incomp_RepSerNo,
            }
          })
          hmiDetails = hmiDetails[0]
          var act = `${weightmentName} Test Discarded on TSH ${data.Hmi} of user ${check.Userid}`
          if (hmiDetails.Side != 'NA') {
            var act = `${weightmentName} Test Discarded on TSH ${data.Hmi} of user ${check.Userid} for side ${hmiDetails.Side}`
          }
        } else if (check.WeighmentName == GLOBAL_NOMENCLATURE.Hardness) {
          await models.tbl_tab_master_htd_incomplete.update(
            {
              IsProcess: 0,
              PrEndDate: momentObj().format("YYYY-MM-DD"),
              PrEndTime: momentObj().format("HH:mm:ss"),
              FailedRemarkI: "Aborted test"
            }, {
            where: {
              RepSerNo: check.Incomp_RepSerNo,
            }
          }
          );
          var hmiDetails = await models.tbl_tab_master_htd_incomplete.findAll({
            where: {
              RepSerNo: check.Incomp_RepSerNo,
            }
          })
          hmiDetails = hmiDetails[0]
          var act = `${weightmentName}/Thickness Test Discarded on TSH ${data.Hmi} of user ${check.Userid}`
          if (hmiDetails.Side != 'NA') {
            var act = `${weightmentName}/Thickness Test Discarded on TSH ${data.Hmi} of user ${check.Userid} for side ${hmiDetails.Side}`
          }

        }

        await objActivityLog.ActivityLogEntry({
          strUserId: data.userId,
          strUserName: objuser.UserInitials,
          activity: act,
        });
        var Hmi = data.Hmi;
        globalData.arrWeighmentCounter.findIndex(k => k.Hmi === Hmi) == -1 ?
          globalData.arrWeighmentCounter :
          globalData.arrWeighmentCounter.splice(globalData.arrWeighmentCounter.findIndex(k => k.Hmi == Hmi), 1);

        (globalData.arrCurrentOperationStatus.findIndex((element) => element.Hmi === Hmi)) == -1 ?
          globalData.arrCurrentOperationStatus :
          globalData.arrCurrentOperationStatus.splice(globalData.arrCurrentOperationStatus.findIndex((element) => element.Hmi === Hmi), 1);

        (globalData.arrWeighmentCounterAfter.findIndex((element) => element.Hmi === Hmi)) == -1 ?
          globalData.arrWeighmentCounterAfter :
          globalData.arrWeighmentCounterAfter.splice(globalData.arrWeighmentCounterAfter.findIndex((element) => element.Hmi === Hmi), 1);

        (globalData.arrProtocolData.findIndex((element) => element.Hmi === Hmi)) == -1 ?
          globalData.arrProtocolData :
          globalData.arrProtocolData.splice(globalData.arrProtocolData.findIndex((element) => element.Hmi === Hmi), 1);

        (globalData.arrOutFlagForTest.findIndex((element) => element.Hmi === Hmi)) == -1 ?
          globalData.arrOutFlagForTest :
          globalData.arrOutFlagForTest.splice(globalData.arrOutFlagForTest.findIndex((element) => element.Hmi === Hmi), 1);

        globalData.arrSelectedMenu.findIndex(k => k.Hmi == Hmi) == -1 ?
          globalData.arrSelectedMenu :
          globalData.arrSelectedMenu.splice(globalData.arrSelectedMenu.findIndex(k => k.Hmi == Hmi), 1);

        (globalData.HardnessMasterEntry.findIndex((element) => element.Hmi === Hmi)) == -1 ?
          globalData.HardnessMasterEntry :
          globalData.HardnessMasterEntry.splice(globalData.HardnessMasterEntry.findIndex((element) => element.Hmi === Hmi), 1);

        (globalData.DoubSide.findIndex((element) => element.Hmi === Hmi)) == -1 ?
          globalData.DoubSide :
          globalData.DoubSide.splice(globalData.DoubSide.findIndex((element) => element.Hmi === Hmi), 1);

        (globalData.arrside.findIndex((element) => element.Hmi === Hmi)) == -1 ?
          globalData.arrside :
          globalData.arrside.splice(globalData.arrside.findIndex((element) => element.Hmi === Hmi), 1);

        globalData.arrPushValuesOfHardness.findIndex(k => k.Hmi == Hmi) == -1 ?
          globalData.arrPushValuesOfHardness :
          globalData.arrPushValuesOfHardness.splice(globalData.arrPushValuesOfHardness.findIndex(k => k.Hmi == Hmi), 1);

        globalData.arrsampleno.findIndex(k => k.Hmi == Hmi) == -1 ?
          globalData.arrsampleno :
          globalData.arrsampleno.splice(globalData.arrsampleno.findIndex(k => k.Hmi == Hmi), 1);

        globalData.arrHardnessMT50.findIndex(k => k.Hmi == Hmi) == -1 ?
          globalData.arrHardnessMT50 :
          globalData.arrHardnessMT50.splice(globalData.arrHardnessMT50.findIndex(k => k.Hmi == Hmi), 1);

        globalData.formatching.findIndex(k => k.Hmi == Hmi) == -1 ?
          globalData.formatching :
          globalData.formatching.splice(globalData.formatching.findIndex(k => k.Hmi == Hmi), 1);

        return "VALIDATED";
        // sameUserId = false
        // otherUser = true
      } else {
        if(weightmentName == 'Hardness'){
          weightmentName = weightmentName + '/Thickness'
        }
        check.message = GLOBAL_NOMENCLATURE.powerBackupMessage + weightmentName;
      }

      if (strMenuName == "TBTTST") {
        const selectProductMaster = await models.tbl_product_master.findAll({
          where: {
            ProductName: prodmaster.ProductName,
            ProductId: prodmaster.BFGCode,
            ProductVersion: prodmaster.PVersion,
            Version: prodmaster.Version,
          },
        });
        let arrResProductMaster = [selectProductMaster];
        let productType = arrResProductMaster[0][0].ProductType;
        let TableName;
        let tableName;
        let col;
        var arrHardnessColumn = [];
        if (productType == 1) {
          switch (ChangeBatch[0].Sys_CubType) {
            case "Compression":
            case "Effervescent Compression":
            case "IPQC":
            case "IPQA":
              tableName = "tbl_product_tablet";
              TableName = models.tbl_product_tablet;
              break;
            case "Coating":
            case "Pallet Coating":
              tableName = "tbl_product_tablet_coated";
              TableName = models.tbl_product_tablet_coated;
              break;
            case "Effervescent Granulation":
            case "Granulation":
              tableName = "tbl_product_gran";
              TableName = models.tbl_product_gran;
              break;
          }
        } else if (productType == 2 && cubicalArea == "Capsule Filling") {
          tableName = "tbl_product_capsule";
          TableName = models.tbl_product_capsule;
        } else if (productType == 2 && cubicalArea == "Granulation") {
          tableName = "tbl_product_gran_cap";
          TableName = models.tbl_product_gran_cap;
        } else if (productType == 2 && cubicalArea == "Pallet Coating") {
          tableName = "tbl_product_capsule";
          TableName = models.tbl_product_capsule;
        } else if (productType == 3 && cubicalArea == "Multihaler") {
          tableName = "tbl_product_multihaler";
          TableName = models.tbl_product_multihaler;
        } else {
          console.log("jncjsnc");
        }
        const selectObj = await models[tableName].findAll({
          where: {
            ProductName: prodmaster.ProductName,
            ProductId: prodmaster.BFGCode,
            ProductVersion: prodmaster.PVersion,
            Version: prodmaster.Version,
          },
        });

        let arrResOfProductDetail = [[selectObj[0]]];
        arrResOfProductDetail[0][0]["Param3_Nom"] == (99999 || 0)
          ? 0
          : arrHardnessColumn.push("Thickness");
        arrResOfProductDetail[0][0]["Param4_Nom"] == (99999 || 0)
          ? 0
          : arrHardnessColumn.push("Breadth");
        arrResOfProductDetail[0][0]["Param5_Nom"] == (99999 || 0)
          ? 0
          : arrHardnessColumn.push("Length");
        arrResOfProductDetail[0][0]["Param6_Nom"] == (99999 || 0)
          ? 0
          : arrHardnessColumn.push("Diameter");
        arrResOfProductDetail[0][0]["Param7_T1Pos"] == (99999 || 0)
          ? 0
          : arrHardnessColumn.push("Hardness");

        check.tbt = arrHardnessColumn;
      }

      // let pendingMessage = sameUserId ? '' : ` for User ${check.Userid}`;

      // check.side = prodmaster.Side;

      var tmppbckupobj = globalData.DoubSide.find((k) => k.Hmi == data.Hmi);
      var response = check;
      var result = await objCommonFunOperation.getCubicalData(data.Hmi);
      result = [result];

      var detailTable = masterTable.replace("master", "detail");
      if (strMenuName != 'FRIAB') {
        if (strMenuName == 'Individual') {
          var limit = await models[masterTable].findOne({
            attributes: ['T1NegTol', 'T1PosTol', 'T2NegTol', 'T2PosTol', 'Unit', 'DP', 'Side'],
            where: {
              RepSerNo: check.Incomp_RepSerNo
            }
          })
          var dp = limit.Unit == 'mg' ? 1 : limit.DP
          var detailData = await models[detailTable].findAll({
            where: {
              RepSerNo: check.Incomp_RepSerNo,
            },
          });
          var testData = await models[detailTable].findAll({
            attributes: { exclude: ['RecNo', 'RepSerNo', 'MstSerNo', 'UserId', 'UserName', 'PrDate', 'PrTime', 'PrEndDate', 'PrEndTime', 'DecimalPoint', 'Side', 'SideNo'] },
            where: {
              RepSerNo: check.Incomp_RepSerNo,
            }
          })
        } else {
          var limit = await models[masterTable].findOne({
            attributes: ['T1NegTolHard', 'T1PosTolHard', 'T2NegTolHard', 'T2PosTolHard', 'Unit', 'T1NegTolThick', 'T1PosTolThick', 'Side'],
            where: {
              RepSerNo: check.Incomp_RepSerNo
            }
          })
          var detailData = await models.tbl_tab_detailhtd_incomplete.findAll({
            where: {
              RepSerNo: check.Incomp_RepSerNo,
            },
          });
          var testData = await models.tbl_tab_detailhtd_incomplete.findAll({
            attributes: { exclude: ['RecNo', 'RepSerNo', 'MstSerNo', 'UserId', 'UserName', 'PrDate', 'PrTime', 'PrEndDate', 'PrEndTime', 'DecimalPoint', 'Side', 'SideNo'] },
            where: {
              RepSerNo: check.Incomp_RepSerNo,
            }
          })
          var dp = limit.Unit == 'Kp' ? 1 : 0
          let forMatching = globalData.formatching.find(k => k.Hmi == data.Hmi);
          if (forMatching == undefined) {
            for (var i = 0; i < testData.length; i++) {
              if(i == 0){
                globalData.formatching.push({
                  Hmi: data.Hmi,
                  values: [testData[i].RecSeqNo]
                });
              }else{
                forMatching = globalData.formatching.find(k => k.Hmi == data.Hmi);
                forMatching.values.push(testData[i].RecSeqNo)
              }
            }
          }
        }

        for (var i = 0; i < testData.length; i++) {
          for (let keys in testData[i]) {
            if (keys.includes(pre_sample)) {
              if (testData[i][keys] != 0 && testData[i][keys] != 'NULL' && strMenuName == 'Individual') {
                var OutOfLimit = (Number(limit.T2NegTol) > Number(testData[i][keys]) || Number(testData[i][keys]) > Number(limit.T2PosTol)) ? true : false
                testData[i].SrNo = i + 1
                testData[i][keys] = { value: Number(testData[i][keys]).toFixed(dp) + ` ${limit.Unit}`, OutOfLimit: OutOfLimit }
              } else if (testData[i][keys] != 0 && testData[i][keys] != 'NULL' && strMenuName == 'Hardness') {
                if (keys == 'DataValueHard') {
                  if (testData[i][keys] != "NA") {
                    var OutOfLimit = (Number(limit.T2NegTolHard) > Number(testData[i][keys]) || Number(testData[i][keys]) > Number(limit.T2PosTolHard)) ? true : false
                    testData[i].SrNo = i + 1
                    testData[i][keys] = { value: Number(testData[i][keys]).toFixed(dp) + ` ${limit.Unit}`, OutOfLimit: OutOfLimit }
                  } else {
                    testData[i].SrNo = i + 1
                    testData[i][keys] = { value: testData[i][keys] + ` ${limit.Unit}`, OutOfLimit: false }
                  }
                } else {
                  if (testData[i][keys] != "NA") {
                    var OutOfLimit = (Number(limit.T2NegTolThick) > Number(testData[i][keys]) || Number(testData[i][keys]) > Number(limit.T2PosTolThick)) ? true : false
                    testData[i].SrNo = i + 1
                    testData[i][keys] = { value: Number(testData[i][keys]).toFixed(2) + ` mm`, OutOfLimit: OutOfLimit }
                  } else {
                    testData[i].SrNo = i + 1
                    testData[i][keys] = { value: testData[i][keys] + ` mm`, OutOfLimit: false }
                  }
                }
              } else {
                delete testData[i][keys]
              }
            }
          }
        }
        globalData.arrHardnessMT50.findIndex(k => k.Hmi == data.Hmi) == -1 ? globalData.arrHardnessMT50 : globalData.arrHardnessMT50.splice(globalData.arrHardnessMT50.findIndex(k => k.Hmi == data.Hmi), 1);
        globalData.arrHardnessMT50.push({
          Hmi: data.Hmi,
          obj: testData[0]
        })
        console.log(testData)
      }
      response.testData = testData
      response.Side = limit.Side
      var tmpmonitobj = globalData.monitDetail.find((k) => k.Hmi == data.Hmi);

      if (tmpmonitobj == undefined) {
        globalData.monitDetail.push({
          Hmi: data.Hmi,
          data: detailData,
        });
      } else {
        var index = globalData.monitDetail.findIndex((k) => k.Hmi == data.Hmi);
        globalData.monitDetail[index].data = detailData;
      }

      const obj = {
        Hmi: data.Hmi,
        UserId: data.userId,
        UserName: "",
      };
      const obj1 = {
        Hmi: data.Hmi,
        menuName: strMenuName,
      };

      //internalyy calling
      await objmenu.getMenu(obj);
      var MenuDetail = await objmenu.onMenuStart(obj1);
      response.MenuDetail = MenuDetail;
    } else {
      var response = "VALIDATED";
    }
    // if (check != undefined) {
    //   if (check.WeighmentName == "FRIAB") {
    //     response = "VALIDATED";
    //   }
    // }

    return response;
  }
  async _Calib_powerBackup(_value) { }
  async get_Calib_Status_oF_Test_ForPowerBackup(powerbackupobj) {
    let strHmi = powerbackupobj.Hmi;
    let strIdsNo = powerbackupobj.idsNo;
    let tableName = "tbl_powerbackup";
    let tempUserObject = globalData.arrUsers.find((k) => k.Hmi == strHmi);

    let _check_combination = await this._check_calibration_entry(
      strHmi,
      powerbackupobj,
      tableName
    );

    if (_check_combination === undefined) {
      const _insertInPoerBackup = await models["tbl_powerbackup"].create({
        WeighmentName: powerbackupobj.menuName,
        WeighmentType: "Calib",
        Idsno: strHmi,
        Userid: powerbackupobj.Userid,
        RecSampleNo: powerbackupobj.RecSampleNo,
        EntryTimeStamp: moment().format('YYYY-MM-DD HH:mm:ss'),
        Instrument_Model: powerbackupobj._bal_id,
      });

      let res = [_insertInPoerBackup];
      return res[0][0];
    } else {
      // if (powerbackupobj.RecSampleNo == 1) {
      //   await models[tableName].update({
      //     // Incomp_RepSerNo: powerbackupobj.Incomp_RepSerNo,
      //     RecSampleNo: powerbackupobj.RecSampleNo
      //   }, {
      //     where: {
      //       Instrument_Model : powerbackupobj._bal_id,
      //       IdsNo:strHmi
      //     },
      //   });
      // }

      this._update_Calib_Test_Count(
        strHmi,
        powerbackupobj,
        powerbackupobj.RecSampleNo,
        tableName
      );
      _check_combination = await this._check_calibration_entry(
        strHmi,
        powerbackupobj,
        tableName
      );
      return _check_combination.RecSampleNo;
    }
  }
  async _check_calibration_entry(Hmi, _value1, _table_) {
    const _check_combination = await models[_table_].findAll({
      where: {
        WeighmentName: _value1.menuName,
        IdsNo: Hmi,
      },
    });
    return [_check_combination][0][0];
  }

  async _update_Calib_Test_Count(_hmi, powerbackupobj, _Sample_No, tableName) {
    // console.log(`updateTestCount:${JSON.stringify(powerbackupobj)}`)
    let _check_combination = await this._check_calibration_entry(
      _hmi,
      powerbackupobj,
      "tbl_powerbackup"
    );
    if (_check_combination !== undefined) {
      let _check_update_combination = await models.tbl_powerbackup.update(
        {
          RecSampleNo: _Sample_No,
        },
        {
          where: {
            WeighmentName: powerbackupobj.menuName,
            IdsNo: _hmi,
          },
        }
      );
      //   console.log(`powerbackup ${powerbackupobj.Incomp_RepSerNo}`);
      //return powerbackupobj.Incomp_RepSerNo;
    } else {
      console.log("not found Incomp_RepSerNo");
    }
  }
  async _get_calib_data(_input) {
    let _Hmi = _input[0].Idsno;
    let _Instru_Id = _input[0].Instrument_Model;
    let tempUserObject = globalData.arrUsers.find((k) => k.Hmi == _Hmi);
    let _calib_perform = _input[0].WeighmentName;
    var response = "VALIDATED";
    let weightmentName;
    switch (_calib_perform) {
      case `${GLOBAL_NOMENCLATURE.Daily}`:
        weightmentName = "DAILY";
        break;
      case `${GLOBAL_NOMENCLATURE.Periodic}`:
        weightmentName = "Linearity";
        break;
      case `${GLOBAL_NOMENCLATURE.Repetability}`:
        weightmentName = "Repeatability";
        break;
      case GLOBAL_NOMENCLATURE.Uncertainty:
        weightmentName = "Sensitivity";
        break;
      case GLOBAL_NOMENCLATURE.Eccentricity:
        weightmentName = "Eccentricity";
        break;
      case "Linearity":
        weightmentName = "Linearity";
        break;
    }

    response = _input[0];
    response.message =
      GLOBAL_NOMENCLATURE.powerBackupMessage_calib + weightmentName;
    _Hmi.toString()
    const responses = await axios.post(
      `http://${serverConfig.hostApi}:${serverConfig.port}/INTERFACE/CalibrationStatus/selPendigCalib`,
      {
        Hmi: _Hmi.toString(),
        CalibType: _calib_perform,
        BalId: _Instru_Id,
        UserId: tempUserObject.UserId,
        // Password: tempUserObject.UserPass,
        // ForceRemainder: false,
      }
    );
    return response;
  }
  async moveCalibrationIncompleteToFail(strHmi) {
    try {
      //check bal connected..//take balid//fetch status
      //reset calib

      let strTableName, repNo, strColName, calibAlphabet, calibType;
      let strBalId, pendingMessage;
      const pendingCalib = globalData.glbArrListOfBalWithCalibPending.find(
        (k) => k.Hmi == strHmi
      );

      if (pendingCalib == undefined) {
        return;
      }

      strBalId = pendingCalib.PendingCalibStatus[0].BalId;
      pendingMessage = pendingCalib.PendingCalibStatus[0].Message;
      pendingMessage = pendingMessage.split(" ")[0];
      if (pendingMessage.includes("No")) {
        return;
      }

      // const calibTypeArr = globalData.arrcalibType.find(k => k.Hmi == strHmi);
      // const selectedBal = globalData.arrSelectedBalWithHmi.find(k => k.Hmi == strHmi);

      // if (selectedBal != undefined) {
      //     var strBalId = selectedBal.selectedBal;
      // }

      // if (selectedBal == undefined) {

      //     console.log("return from moveCalibrationIncompleteToFail");
      //     return
      // }
      //get repNo from status table;
      let statusResp = await models.tbl_calibration_status.findOne({
        where: {
          BalID: strBalId,
        },
      });

      let calibrepNo = statusResp.RepNo;

      let calibCounter = globalData.arrCalibCounterApi.find(
        (k) => k.Hmi == strHmi
      );

      // if (calibCounter != undefined) {
      //     if (calibTypeArr != undefined) {
      // switch (calibTypeArr.calibType) {
      switch (pendingMessage.toLowerCase()) {
        case GLOBAL_NOMENCLATURE.Periodic.toLowerCase():
          calibAlphabet = "P";
          // var bln_isPresent = await objCommonCalib.checkIfRecordInIncomplete(calibAlphabet, strBalId)
          strTableName = "tbl_calibration_periodic_master_incomplete";
          repNo = "Periodic_RepNo";
          strColName = "Periodic_BalID";
          calibType = "Monthly";
          break;
        case GLOBAL_NOMENCLATURE.Eccentricity.toLowerCase():
          calibAlphabet = "E";
          // var bln_isPresent = await objCommonCalib.checkIfRecordInIncomplete(calibAlphabet, strBalId)
          strTableName = "tbl_calibration_eccentricity_master_incomplete";
          repNo = "Eccent_RepNo";
          strColName = "Eccent_BalID";
          calibType = "Monthly";
          break;
        case GLOBAL_NOMENCLATURE.Uncertainty.toLowerCase():
          calibAlphabet = "U";
          // var bln_isPresent = await objCommonCalib.checkIfRecordInIncomplete(calibAlphabet, strBalId)
          strTableName = "tbl_calibration_uncertinity_master_incomplete";
          repNo = "Uncertinity_RepNo";
          strColName = "Uncertinity_BalID";
          calibType = "Yearly";
          break;
        case GLOBAL_NOMENCLATURE.Repetability.toLowerCase():
          calibAlphabet = "R";
          // var bln_isPresent = await objCommonCalib.checkIfRecordInIncomplete(calibAlphabet, strBalId)
          strTableName = "tbl_calibration_repetability_master_incomplete";
          repNo = "Repet_RepNo";
          strColName = "Repet_BalID";
          calibType = "Monthly";
          break;
        case "Linearity".toLowerCase():
          calibAlphabet = "L";
          // var bln_isPresent = await objCommonCalib.checkIfRecordInIncomplete(calibAlphabet, strBalId)
          strTableName = "tbl_calibration_linearity_master_incomplete";
          repNo = "linear_RepNo";
          strColName = "linear_BalID";
          calibType = "Yearly";
          break;
        default:
          return;
      }
      // if (calibCounter.counterApi != 0) {
      await this.caibrationFails(
        calibAlphabet,
        calibrepNo,
        strBalId,
        calibType,
        true
      );
      // }

      //     }
      // }
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async caibrationFails(CalibrationType, RepNo, strBalId, calibType, deleteEntry = false) {
    try {
      // CalibrationType is like 'P', 'R', 'E', 'U'..etc
      // strBalId holds the balance associated with that cubicle
      // RepNo holds the report sr no of incomplete tables
      var tempCaibStatus = globalData.calibrationStatus.find(k => k.BalId == strBalId);
      // getting position of current caibration in sorted array of calibrations
      let sortedArray = await sort.sortedSeqArray(globalData.arrSortedCalib, strBalId); //globalData.arrSortedCalib tbl_calibration_sequnce
      var int_curentCalibrationIndex = sortedArray.indexOf(CalibrationType);
      // calculating first caalibration
      // var str_first_calibration = sortedArray[0];
      //var str_first_calibration = CalibrationType;
      if (calibType == "Yearly") {
        var str_first_calibration = "P"
      } else if (calibType == "Monthly") {
        var str_first_calibration = "P"
      }
      var fRerSrNo = await this.getFrepSrNo(str_first_calibration);
      // fRerSrNo is failed repSrNo which will insert in all failed tables
      var arr_CalibArray = []; // array holds calibration which done and one which failed
      for (let i = 0; i < int_curentCalibrationIndex + 1; i++) {
        arr_CalibArray.push(sortedArray[i])
      }
      // console.log('arr_CalibArray', arr_CalibArray);

      // v holds value such as 'P', 'U', 'E' .....etc

      switch (calibType) {
        case 'Monthly': {
          {
            var objPeriodic = await copyObjects.periodic('tbl_calibration_periodic_master_incomplete'
              , 'tbl_calibration_periodic_master_failed', RepNo, 0, 'master')
            // Copying Incomplete master to failed master

            let columNames = objPeriodic.data.map(obj => obj.str_colName).toString();
            var str_Query = `insert into tbl_calibration_periodic_master_failed (${columNames}) select ${columNames} from tbl_calibration_periodic_master_incomplete where Periodic_RepNo = ${RepNo}`
            let resultPeriodic = await sequelize.query(str_Query, { type: QueryTypes.INSERT })

            // last inserted Id got here form querymasterInsert[0]
            var lastInsertedIdPeriodic = resultPeriodic[0];
            // Updating the report serial number in failed master
            if (lastInsertedIdPeriodic != 0) {

              await models.tbl_calibration_periodic_master_failed.update({
                "Periodic_RepNo": fRerSrNo,
                "Periodic_CalbTime": moment(new Date()).format('HH:mm:ss')
              }, {
                where: {
                  "srNo": lastInsertedIdPeriodic
                }
              })


              // selecting data from incomplete details for copying
              var resultP = await models.tbl_calibration_periodic_detail_incomplete.findAll({
                where: {
                  "Periodic_RepNo": RepNo
                }
              }); // selected
              let res = [{}]
              res[0].Periodic_RepNo = resultP[0].Periodic_RepNo
              res[0].Periodic_RecNo = resultP[0].Periodic_RecNo
              let i = 0;
              for (let obj of resultP) {
                obj.Periodic_RecNo = resultP[i].Periodic_RecNo
                // as we have multiple entries i n details table so we need 
                // Async loop



                let objCopyPeriodic = await copyObjects.periodic('tbl_calibration_periodic_detail_incomplete'
                  , 'tbl_calibration_periodic_detail_failed', obj.Periodic_RepNo, obj.Periodic_RecNo, 'detail');

                columNames = objCopyPeriodic.data.map(obj => obj.str_colName).toString();
                str_Query = `insert into tbl_calibration_periodic_detail_failed (${columNames}) select ${columNames} from tbl_calibration_periodic_detail_incomplete where Periodic_RepNo = ${obj.Periodic_RepNo} AND Periodic_RecNo = ${obj.Periodic_RecNo}`
                let detailInsert = await sequelize.query(str_Query, { type: QueryTypes.INSERT })

                var lastInsertedIdP = detailInsert[0];


                await models.tbl_calibration_periodic_detail_failed.update({
                  "Periodic_RepNo": fRerSrNo
                }, {
                  where: {
                    "srNo": lastInsertedIdP
                    // "Periodic_RepNo": res[0].Periodic_RepNo
                  }
                })

                // updated repSrNo in failed details 
                // console.log('P Copy')
                // If ongoing calibration is failed ('Periodic') then only we have to delete
                // records from incomplete tables for new entries

                i++;
              }

              if (tempCaibStatus.status['P'].readIntLE() == 0) {
                await models.tbl_calibration_periodic_master_incomplete.destroy({
                  where: {
                    "Periodic_RepNo": RepNo
                  }
                })
                await models.tbl_calibration_periodic_detail_incomplete.destroy({
                  where: {
                    "Periodic_RepNo": RepNo
                  }
                })
              }
            }
          }

          {
            var objEccen = await copyObjects.eccentricity('tbl_calibration_eccentricity_master_incomplete'
              , 'tbl_calibration_eccentricity_master_failed', RepNo, 0, 'master');
            // console.log(obj)
            let columNames = objEccen.data.map(obj => obj.str_colName).toString();
            var str_Query = `insert into tbl_calibration_eccentricity_master_failed (${columNames}) select ${columNames} from tbl_calibration_eccentricity_master_incomplete where Eccent_RepNo = ${RepNo}`
            let resultEccen = await sequelize.query(str_Query, { type: QueryTypes.INSERT })
            // console.log(result)
            var lastInsertedIdEccen = resultEccen[0];

            if (lastInsertedIdEccen != 0) {
              await models.tbl_calibration_eccentricity_master_failed.update({
                "Eccent_RepNo": fRerSrNo,
                "Eccent_CalbTime": moment(new Date()).format('HH:mm:ss')
              }, {
                where: {
                  "srNo": lastInsertedIdEccen
                }
              })

              var resultP = await models.tbl_calibration_eccentricity_detail_incomplete.findAll({
                where: {
                  "Eccent_RepNo": RepNo
                }
              }); // selected
              let res = [{}]
              res[0].Eccent_RepNo = resultP[0].Eccent_RepNo
              res[0].Eccent_RecNo = resultP[0].Eccent_RecNo
              // console.log(result[0])
              let i = 0;
              for (let obj of resultP) {
                obj.Eccent_RecNo = resultP[i].Eccent_RecNo
                let objCopyEccen = await copyObjects.eccentricity('tbl_calibration_eccentricity_detail_incomplete'
                  , 'tbl_calibration_eccentricity_detail_failed', obj.Eccent_RepNo, obj.Eccent_RecNo, 'detail');
                columNames = objCopyEccen.data.map(obj => obj.str_colName).toString();
                str_Query = `insert into tbl_calibration_eccentricity_detail_failed (${columNames}) select ${columNames} from tbl_calibration_eccentricity_detail_incomplete where Eccent_RepNo = ${obj.Eccent_RepNo} AND Eccent_RecNo = ${obj.Eccent_RecNo}`
                let detailInsert = await sequelize.query(str_Query, { type: QueryTypes.INSERT })

                var lastInsertedIdU = detailInsert[0];

                await models.tbl_calibration_eccentricity_detail_failed.update({
                  "Eccent_RepNo": fRerSrNo,
                  "Eccent_CalbTime": moment(new Date()).format('HH:mm:ss')
                }, {
                  where: {
                    "srNo": lastInsertedIdU
                    // "Eccent_RepNo":  res[0].Eccent_RepNo
                  }
                })
                i++

              }

              if (tempCaibStatus.status['E'].readIntLE() == 0) {
                await models.tbl_calibration_eccentricity_master_incomplete.destroy({
                  where: {
                    "Eccent_RepNo": RepNo
                  }
                });
                await models.tbl_calibration_eccentricity_detail_incomplete.destroy({
                  where: {
                    "Eccent_RepNo": RepNo
                  }
                });
              }


            }


          }
          {
            var objReap = await copyObjects.repetability('tbl_calibration_repetability_master_incomplete'
              , 'tbl_calibration_repetability_master_failed', RepNo, 0, 'master');
            // Copying Incomplete master to failed master
            let columNames = objReap.data.map(obj => obj.str_colName).toString();
            var str_Query = `insert into tbl_calibration_repetability_master_failed (${columNames}) select ${columNames} from tbl_calibration_repetability_master_incomplete where Repet_RepNo = ${RepNo}`
            let resultReap = await sequelize.query(str_Query, { type: QueryTypes.INSERT })
            // last inserted Id got here form query
            var lastInsertedIdReap = resultReap[0];
            // Updating the report serial number in failed master
            if (lastInsertedIdReap != 0) {
              await models.tbl_calibration_repetability_master_failed.update({
                "Repet_RepNo": fRerSrNo,
                "Repet_CalbTime": moment(new Date()).format('HH:mm:ss')
              }, {
                where: {
                  "srNo": lastInsertedIdReap
                }
              }) // failed master report number updated
              // selecting data from incomplete details for copying

              var resultP = await models.tbl_calibration_repetability_detail_incomplete.findAll({
                where: {
                  "Repet_RepNo": RepNo
                }
              }); // selected
              let res = [{}]
              res[0].Repet_RepNo = resultP[0].Repet_RepNo
              res[0].Repet_RecNo = resultP[0].Repet_RecNo
              // as we have multiple entries i n details table so we need 
              // Async loop
              let i = 0;
              for (let obj of resultP) {
                obj.Repet_RecNo = resultP[i].Repet_RecNo
                let objCopyReap = await copyObjects.repetability('tbl_calibration_repetability_detail_incomplete'
                  , 'tbl_calibration_repetability_detail_failed', obj.Repet_RepNo, obj.Repet_RecNo, 'detail');

                columNames = objCopyReap.data.map(obj => obj.str_colName).toString();
                str_Query = `insert into tbl_calibration_repetability_detail_failed (${columNames}) select ${columNames} from tbl_calibration_repetability_detail_incomplete where Repet_RecNo = ${obj.Repet_RecNo} AND Repet_RecNo = ${obj.Repet_RecNo}`
                let detailInsert = await sequelize.query(str_Query, { type: QueryTypes.INSERT })

                var lastInsertedIdU = detailInsert[0];

                await models.tbl_calibration_repetability_detail_failed.update({
                  "Repet_RepNo": fRerSrNo
                }, {
                  where: {
                    "srNo": lastInsertedIdU
                    // "Repet_RepNo": res[0].Repet_RepNo
                  }
                });
                i++;
              }
              if (tempCaibStatus.status['R'].readIntLE() == 0) {
                await models.tbl_calibration_repetability_master_incomplete.destroy({
                  where: {
                    "Repet_RepNo": RepNo
                  }
                });
                await models.tbl_calibration_repetability_detail_incomplete.destroy({
                  where: {
                    "Repet_RepNo": RepNo
                  }
                });
              }
            }
          }

          if (deleteEntry) {

            await models.tbl_calibration_periodic_master_incomplete.destroy({
              where: {
                "Periodic_RepNo": RepNo
              }
            });
            await models.tbl_calibration_periodic_detail_incomplete.destroy({
              where: {
                "Periodic_RepNo": RepNo
              }
            });

            await models.tbl_calibration_eccentricity_master_incomplete.destroy({
              where: {
                "Eccent_RepNo": RepNo
              }
            });
            await models.tbl_calibration_eccentricity_detail_incomplete.destroy({
              where: {
                "Eccent_RepNo": RepNo
              }
            });

            await models.tbl_calibration_repetability_master_incomplete.destroy({
              where: {
                "Repet_RepNo": RepNo
              }
            });
            await models.tbl_calibration_repetability_detail_incomplete.destroy({
              where: {
                "Repet_RepNo": RepNo
              }
            });

            let arrselectBalData = await models.tbl_balance.findOne({
              where: {
                'Bal_ID': strBalId
              }
            });
            arrselectBalData = [[arrselectBalData]]



            const bln_storeType = arrselectBalData[0][0].Bal_CalbStoreType.readUIntLE()
            // if (bln_storeType == 1) {
            //     // await models.tbl_calibration_status.update({
            //     //     // 'P': 0,
            //     //     // // 'E': 0,
            //     //     // 'R': 0,
            //     //     // 'U': 0,
            //     //     // 'L': 0
            //     // }, {
            //     //     where: {
            //     //         'BalID': strBalId
            //     //     }
            //     // });
            // } else {
            await models.tbl_calibration_status.update({
              'P': 0,
              'E': 0,
              'R': 0,

              // 'U': 0,
              // 'L': 0
            }, {
              where: {
                'BalID': strBalId
              }
            });
          }
          // }



        }
          break;
        case 'Yearly': {
          // First copying data
          {
            var objUnccen = await copyObjects.uncertinity('tbl_calibration_uncertinity_master_incomplete'
              , 'tbl_calibration_uncertinity_master_failed', RepNo, 0, 'master');
            // console.log(obj)
            let columNames = objUnccen.data.map(obj => obj.str_colName).toString();
            var str_Query = `insert into tbl_calibration_uncertinity_master_failed (${columNames}) select ${columNames} from tbl_calibration_uncertinity_master_incomplete where Uncertinity_RepNo = ${RepNo}`
            let resultUnccen = await sequelize.query(str_Query, { type: QueryTypes.INSERT })
            // console.log(result)
            var lastInsertedIdUnccen = resultUnccen[0];
            if (lastInsertedIdUnccen != 0) {
              await models.tbl_calibration_uncertinity_master_failed.update({
                "Uncertinity_RepNo": fRerSrNo,
                "Uncertinity_CalbTime": moment(new Date()).format('HH:mm:ss')
              }, {
                where: {
                  "srNo": lastInsertedIdUnccen
                }
              })
              var selectDetailObjUnccen = {
                str_tableName: 'tbl_calibration_uncertinity_detail_incomplete',
                data: 'Uncertinity_RepNo,Uncertinity_RecNo',
                condition: [
                  { str_colName: 'Uncertinity_RepNo', value: RepNo, comp: 'eq' }
                ]
              }
              var resultU = await models.tbl_calibration_uncertinity_detail_incomplete.findAll({
                where: {
                  "Uncertinity_RepNo": RepNo
                }
              }); // selected
              let res = [{}]
              res[0].Uncertinity_RepNo = resultU[0].Uncertinity_RepNo
              res[0].Uncertinity_RecNo = resultU[0].Uncertinity_RecNo
              // console.log(result[0])
              let i = 0;
              for (let obj of resultU) {
                obj.Uncertinity_RecNo = resultU[i].Uncertinity_RecNo
                let objCopyUnccen = await copyObjects.uncertinity('tbl_calibration_uncertinity_detail_incomplete', 'tbl_calibration_uncertinity_detail_failed', obj.Uncertinity_RepNo, obj.Uncertinity_RecNo, 'detail');
                columNames = objCopyUnccen.data.map(obj => obj.str_colName).toString();
                str_Query = `insert into tbl_calibration_uncertinity_detail_failed (${columNames}) select ${columNames} from tbl_calibration_uncertinity_detail_incomplete where Uncertinity_RepNo = ${obj.Uncertinity_RepNo} AND Uncertinity_RecNo = ${obj.Uncertinity_RecNo}`
                let detailInsert = await sequelize.query(str_Query, { type: QueryTypes.INSERT })

                var lastInsertedIdU = detailInsert[0];

                await models.tbl_calibration_uncertinity_detail_failed.update({
                  "Uncertinity_RepNo": fRerSrNo
                }, {
                  where: {
                    "srNo": lastInsertedIdU
                    // "Uncertinity_RepNo": obj.Uncertinity_RepNo
                  }
                })
                i++
              }
              if (tempCaibStatus.status['U'].readIntLE() == 0) {
                await models.tbl_calibration_uncertinity_master_incomplete.destroy({
                  where: {
                    "Uncertinity_RepNo": RepNo
                  }
                });
                await models.tbl_calibration_uncertinity_detail_incomplete.destroy({
                  where: {
                    "Uncertinity_RepNo": RepNo
                  }
                });
              }

            }


          }

          // {
          //     var objEccen = await copyObjects.eccentricity('tbl_calibration_eccentricity_master_incomplete'
          //         , 'tbl_calibration_eccentricity_master_failed', RepNo, 0, 'master');
          //     // console.log(obj)
          //     let columNames = objEccen.data.map(obj => obj.str_colName).toString();
          //     var str_Query = `insert into tbl_calibration_eccentricity_master_failed (${columNames}) select ${columNames} from tbl_calibration_eccentricity_master_incomplete where Eccent_RepNo = ${RepNo}`
          //     let resultEccen = await sequelize.query(str_Query, { type: QueryTypes.INSERT })
          //     // console.log(result)
          //     var lastInsertedIdEccen = resultEccen[0];

          //     if (lastInsertedIdEccen != 0) {
          //         await models.tbl_calibration_eccentricity_master_failed.update({
          //             "Eccent_RepNo": fRerSrNo,
          //             "Eccent_CalbTime": moment(new Date()).format('HH:mm:ss')
          //         }, {
          //             where: {
          //                 "srNo": lastInsertedIdEccen
          //             }
          //         })

          //         var resultP = await models.tbl_calibration_eccentricity_detail_incomplete.findAll({
          //             where: {
          //                 "Eccent_RepNo": RepNo
          //             }
          //         }); // selected
          //         let res = [{}]
          //         res[0].Eccent_RepNo = resultP[0].Eccent_RepNo
          //         res[0].Eccent_RecNo = resultP[0].Eccent_RecNo
          //         // console.log(result[0])
          //         let i = 0;
          //         for (let obj of resultP) {
          //             obj.Eccent_RecNo = resultP[i].Eccent_RecNo
          //             let objCopyEccen = await copyObjects.eccentricity('tbl_calibration_eccentricity_detail_incomplete'
          //                 , 'tbl_calibration_eccentricity_detail_failed', obj.Eccent_RepNo, obj.Eccent_RecNo, 'detail');
          //             columNames = objCopyEccen.data.map(obj => obj.str_colName).toString();
          //             str_Query = `insert into tbl_calibration_eccentricity_detail_failed (${columNames}) select ${columNames} from tbl_calibration_eccentricity_detail_incomplete where Eccent_RepNo = ${obj.Eccent_RepNo} AND Eccent_RecNo = ${obj.Eccent_RecNo}`
          //             let detailInsert = await sequelize.query(str_Query, { type: QueryTypes.INSERT })

          //             var lastInsertedIdU = detailInsert[0];

          //             await models.tbl_calibration_eccentricity_detail_failed.update({
          //                 "Eccent_RepNo": fRerSrNo,
          //                 "Eccent_CalbTime": moment(new Date()).format('HH:mm:ss')
          //             }, {
          //                 where: {
          //                     "srNo": lastInsertedIdU
          //                     // "Eccent_RepNo":  res[0].Eccent_RepNo
          //                 }
          //             })
          //             i++

          //         }

          //         if (tempCaibStatus.status['E'].readIntLE() == 0) {
          //             await models.tbl_calibration_eccentricity_master_incomplete.destroy({
          //                 where: {
          //                     "Eccent_RepNo": RepNo
          //                 }
          //             });
          //             await models.tbl_calibration_eccentricity_detail_incomplete.destroy({
          //                 where: {
          //                     "Eccent_RepNo": RepNo
          //                 }
          //             });
          //         }


          //     }


          // }
          {
            var objLinear = await copyObjects.linearity('tbl_calibration_linearity_master_incomplete'
              , 'tbl_calibration_linearity_master_failed', RepNo, 0, 'master');
            // Copying Incomplete master to failed master
            let columNames = objLinear.data.map(obj => obj.str_colName).toString();
            var str_Query = `insert into tbl_calibration_linearity_master_failed (${columNames}) select ${columNames} from tbl_calibration_linearity_master_incomplete where Linear_RepNo = ${RepNo}`
            let resultLinear = await sequelize.query(str_Query, { type: QueryTypes.INSERT })
            // last inserted Id got here form query
            var lastInsertedIdLinear = resultLinear[0];
            // Updating the report serial number in failed master

            if (lastInsertedIdLinear != 0) {

              await models.tbl_calibration_linearity_master_failed.update({
                "Linear_RepNo": fRerSrNo,
                "Linear_CalbTime": moment(new Date()).format('HH:mm:ss')
              }, {
                where: {
                  "srNo": lastInsertedIdLinear
                }
              }) // failed master report number updated
              // selecting data from incomplete details for copying

              var resultP = await models.tbl_calibration_linearity_detail_incomplete.findAll({
                where: {
                  "Linear_RepNo": RepNo
                }
              }); // selected
              let res = [{}]
              res[0].Linear_RepNo = resultP[0].Linear_RepNo
              res[0].Linear_RecNo = resultP[0].Linear_RecNo
              // as we have multiple entries i n details table so we need 
              // Async loop
              let i = 0;
              for (let obj of resultP) {
                obj.Linear_RecNo = resultP[i].Linear_RecNo
                let objCopyLinear = await copyObjects.linearity('tbl_calibration_linearity_detail_incomplete'
                  , 'tbl_calibration_linearity_detail_failed', obj.Linear_RepNo, obj.Linear_RecNo, 'detail');

                columNames = objCopyLinear.data.map(obj => obj.str_colName).toString();
                str_Query = `insert into tbl_calibration_linearity_detail_failed (${columNames}) select ${columNames} from tbl_calibration_linearity_detail_incomplete where Linear_RepNo = ${obj.Linear_RepNo} AND Linear_RecNo = ${obj.Linear_RecNo}`
                let detailInsert = await sequelize.query(str_Query, { type: QueryTypes.INSERT })

                var lastInsertedIdU = detailInsert[0];

                await models.tbl_calibration_linearity_detail_failed.update({
                  "Linear_RepNo": fRerSrNo
                }, {
                  where: {
                    "srNo": lastInsertedIdU
                    // "Linear_RepNo": res[0].Linear_RepNo
                  }
                })
                i++;
              }

              if (tempCaibStatus.status['L'].readIntLE() == 0) {
                await models.tbl_calibration_linearity_master_incomplete.destroy({
                  where: {
                    "Linear_RepNo": RepNo
                  }
                })
                await models.tbl_calibration_linearity_detail_incomplete.destroy({
                  where: {
                    "Linear_RepNo": RepNo
                  }
                })
              }

            }
          }

          if (deleteEntry) {
            await models.tbl_calibration_uncertinity_master_incomplete.destroy({
              where: {
                "Uncertinity_RepNo": RepNo
              }
            });
            await models.tbl_calibration_uncertinity_detail_incomplete.destroy({
              where: {
                "Uncertinity_RepNo": RepNo
              }
            });

            // await models.tbl_calibration_eccentricity_master_incomplete.destroy({
            //     where: {
            //         "Eccent_RepNo": RepNo
            //     }
            // });
            // await models.tbl_calibration_eccentricity_detail_incomplete.destroy({
            //     where: {
            //         "Eccent_RepNo": RepNo
            //     }
            // });

            await models.tbl_calibration_linearity_master_incomplete.destroy({
              where: {
                "Linear_RepNo": RepNo
              }
            });
            await models.tbl_calibration_linearity_detail_incomplete.destroy({
              where: {
                "Linear_RepNo": RepNo
              }
            });

            let arrselectBalData = await models.tbl_balance.findOne({
              where: {
                'Bal_ID': strBalId
              }
            });
            arrselectBalData = [[arrselectBalData]]



            const bln_storeType = arrselectBalData[0][0].Bal_CalbStoreType.readUIntLE()
            // if (bln_storeType == 1) {
            await models.tbl_calibration_status.update({

              // 'E': 0,

              'U': 0,
              'L': 0
            }, {
              where: {
                'BalID': strBalId
              }
            })
            // } else {
            //     await models.tbl_calibration_status.update({

            //         'E': 0,

            //         'U': 0,
            //         'L': 0
            //     }, {
            //         where: {
            //             'BalID': strBalId
            //         }
            //     })
            // }



          }

        }
      }


      // switch (CalibrationType) {
      //     // For case PERIODIC CALIBRATION
      //     case 'P': {
      //         var objPeriodic = await copyObjects.periodic('tbl_calibration_periodic_master_incomplete'
      //             , 'tbl_calibration_periodic_master_failed', RepNo, 0, 'master')
      //         // Copying Incomplete master to failed master

      //         let columNames = objPeriodic.data.map(obj => obj.str_colName).toString();
      //         var str_Query = `insert into tbl_calibration_periodic_master_failed (${columNames}) select ${columNames} from tbl_calibration_periodic_master_incomplete where Periodic_RepNo = ${RepNo}`
      //         let resultPeriodic = await sequelize.query(str_Query, { type: QueryTypes.INSERT })

      //         // last inserted Id got here form querymasterInsert[0]
      //         var lastInsertedIdPeriodic = resultPeriodic[0];
      //         // Updating the report serial number in failed master

      //         await models.tbl_calibration_periodic_master_failed.update({
      //             "Periodic_RepNo": fRerSrNo,
      //             "Periodic_EndTime": moment(new Date()).format('HH:mm:ss')
      //         }, {
      //             where: {
      //                 "srNo": lastInsertedIdPeriodic
      //             }
      //         })


      //         // selecting data from incomplete details for copying
      //         var resultP = await models.tbl_calibration_periodic_detail_incomplete.findAll({
      //             where: {
      //                 "Periodic_RepNo": RepNo
      //             }
      //         }); // selected
      //         let res = [{}]
      //         res[0].Periodic_RepNo = resultP[0].Periodic_RepNo
      //         res[0].Periodic_RecNo = resultP[0].Periodic_RecNo
      //         let i = 0;
      //         for (let obj of resultP) {
      //             obj.Periodic_RecNo = resultP[i].Periodic_RecNo
      //             // as we have multiple entries i n details table so we need 
      //             // Async loop



      //             let objCopyPeriodic = await copyObjects.periodic('tbl_calibration_periodic_detail_incomplete'
      //                 , 'tbl_calibration_periodic_detail_failed', obj.Periodic_RepNo, obj.Periodic_RecNo, 'detail');

      //             columNames = objCopyPeriodic.data.map(obj => obj.str_colName).toString();
      //             str_Query = `insert into tbl_calibration_periodic_detail_failed (${columNames}) select ${columNames} from tbl_calibration_periodic_detail_incomplete where Periodic_RepNo = ${obj.Periodic_RepNo} AND Periodic_RecNo = ${obj.Periodic_RecNo}`
      //             let detailInsert = await sequelize.query(str_Query, { type: QueryTypes.INSERT })

      //             var lastInsertedIdP = detailInsert[0];


      //             await models.tbl_calibration_periodic_detail_failed.update({
      //                 "Periodic_RepNo": fRerSrNo
      //             }, {
      //                 where: {
      //                     "srNo": lastInsertedIdP
      //                     // "Periodic_RepNo": res[0].Periodic_RepNo
      //                 }
      //             })

      //             // updated repSrNo in failed details 
      //             // console.log('P Copy')
      //             // If ongoing calibration is failed ('Periodic') then only we have to delete
      //             // records from incomplete tables for new entries

      //             i++;
      //         }
      //         // for (let obj of res) {
      //         //     obj.Periodic_RecNo = resultU[i].Periodic_RecNo
      //         //     // as we have multiple entries i n details table so we need 
      //         //     // Async loop



      //         //     let objCopyPeriodic = await copyObjects.periodic('tbl_calibration_periodic_detail_incomplete'
      //         //         , 'tbl_calibration_periodic_detail_failed', obj.Periodic_RepNo, obj.Periodic_RecNo, 'detail');

      //         //     columNames = objCopyPeriodic.data.map(obj => obj.str_colName).toString();
      //         //     str_Query = `insert into tbl_calibration_periodic_detail_failed (${columNames}) select ${columNames} from tbl_calibration_periodic_detail_incomplete where Periodic_RepNo = ${obj.Periodic_RepNo}`
      //         //     let detailInsert = await sequelize.query(str_Query, { type: QueryTypes.INSERT })

      //         //     var lastInsertedIdP = detailInsert[0];


      //         //     await models.tbl_calibration_periodic_detail_failed.update({
      //         //         "Periodic_RepNo": fRerSrNo
      //         //     }, {
      //         //         where: {
      //         //             // "srNo": lastInsertedIdP
      //         //             "Periodic_RepNo": res[0].Periodic_RepNo
      //         //         }
      //         //     })

      //         //     // updated repSrNo in failed details 
      //         //     // console.log('P Copy')
      //         //     // If ongoing calibration is failed ('Periodic') then only we have to delete
      //         //     // records from incomplete tables for new entries

      //         // i++;
      //         // }

      //         if (sortedArray.indexOf('P') == int_curentCalibrationIndex) {
      //             // delete records from incomplete tables

      //             await models.tbl_calibration_periodic_master_incomplete.destroy({
      //                 where: {
      //                     "Periodic_RepNo": RepNo
      //                 }
      //             })
      //             await models.tbl_calibration_periodic_detail_incomplete.destroy({
      //                 where: {
      //                     "Periodic_RepNo": RepNo
      //                 }
      //             })


      //         }
      //     }
      //         break;
      //     // For case UNCERTINITY CALIBRATION
      //     case 'U': {
      //         // First copying data
      //         var objUnccen = await copyObjects.uncertinity('tbl_calibration_uncertinity_master_incomplete'
      //             , 'tbl_calibration_uncertinity_master_failed', RepNo, 0, 'master');
      //         // console.log(obj)
      //         let columNames = objUnccen.data.map(obj => obj.str_colName).toString();
      //         var str_Query = `insert into tbl_calibration_uncertinity_master_failed (${columNames}) select ${columNames} from tbl_calibration_uncertinity_master_incomplete where Uncertinity_RepNo = ${RepNo}`
      //         let resultUnccen = await sequelize.query(str_Query, { type: QueryTypes.INSERT })
      //         // console.log(result)
      //         var lastInsertedIdUnccen = resultUnccen[0];

      //         await models.tbl_calibration_uncertinity_master_failed.update({
      //             "Uncertinity_RepNo": fRerSrNo,
      //             "Uncertinity_EndTime": moment(new Date()).format('HH:mm:ss')
      //         }, {
      //             where: {
      //                 "srNo": lastInsertedIdUnccen
      //             }
      //         })
      //         var selectDetailObjUnccen = {
      //             str_tableName: 'tbl_calibration_uncertinity_detail_incomplete',
      //             data: 'Uncertinity_RepNo,Uncertinity_RecNo',
      //             condition: [
      //                 { str_colName: 'Uncertinity_RepNo', value: RepNo, comp: 'eq' }
      //             ]
      //         }
      //         var resultU = await models.tbl_calibration_uncertinity_detail_incomplete.findAll({
      //             where: {
      //                 "Uncertinity_RepNo": RepNo
      //             }
      //         }); // selected
      //         let res = [{}]
      //         res[0].Uncertinity_RepNo = resultU[0].Uncertinity_RepNo
      //         res[0].Uncertinity_RecNo = resultU[0].Uncertinity_RecNo
      //         // console.log(result[0])
      //         let i = 0;
      //         for (let obj of resultU) {
      //             obj.Uncertinity_RecNo = resultU[i].Uncertinity_RecNo
      //             let objCopyUnccen = await copyObjects.uncertinity('tbl_calibration_uncertinity_detail_incomplete', 'tbl_calibration_uncertinity_detail_failed', obj.Uncertinity_RepNo, obj.Uncertinity_RecNo, 'detail');
      //             columNames = objCopyUnccen.data.map(obj => obj.str_colName).toString();
      //             str_Query = `insert into tbl_calibration_uncertinity_detail_failed (${columNames}) select ${columNames} from tbl_calibration_uncertinity_detail_incomplete where Uncertinity_RepNo = ${obj.Uncertinity_RepNo} AND Uncertinity_RecNo = ${obj.Uncertinity_RecNo}`
      //             let detailInsert = await sequelize.query(str_Query, { type: QueryTypes.INSERT })

      //             var lastInsertedIdU = detailInsert[0];

      //             await models.tbl_calibration_uncertinity_detail_failed.update({
      //                 "Uncertinity_RepNo": fRerSrNo
      //             }, {
      //                 where: {
      //                     "srNo": lastInsertedIdU
      //                     // "Uncertinity_RepNo": obj.Uncertinity_RepNo
      //                 }
      //             })
      //             i++
      //         }

      //         if (sortedArray.indexOf('U') == int_curentCalibrationIndex) {
      //             // delete records from incomplete tables
      //             console.log('inside delete')

      //             await models.tbl_calibration_uncertinity_master_incomplete.destroy({
      //                 where: {
      //                     "Uncertinity_RepNo": RepNo
      //                 }
      //             })
      //             await models.tbl_calibration_uncertinity_detail_incomplete.destroy({
      //                 where: {
      //                     "Uncertinity_RepNo": RepNo
      //                 }
      //             })
      //         }
      //     }
      //         break;
      //     // For case ECCENTRICITY CALIBRATION
      //     case 'E': {
      //         // First copying data
      //         var objEccen = await copyObjects.eccentricity('tbl_calibration_eccentricity_master_incomplete'
      //             , 'tbl_calibration_eccentricity_master_failed', RepNo, 0, 'master');
      //         // console.log(obj)
      //         let columNames = objEccen.data.map(obj => obj.str_colName).toString();
      //         var str_Query = `insert into tbl_calibration_eccentricity_master_failed (${columNames}) select ${columNames} from tbl_calibration_eccentricity_master_incomplete where Eccent_RepNo = ${RepNo}`
      //         let resultEccen = await sequelize.query(str_Query, { type: QueryTypes.INSERT })
      //         // console.log(result)
      //         var lastInsertedIdEccen = resultEccen[0]

      //         await models.tbl_calibration_eccentricity_master_failed.update({
      //             "Eccent_RepNo": fRerSrNo,
      //             "Eccent_EndTime": moment(new Date()).format('HH:mm:ss')
      //         }, {
      //             where: {
      //                 "srNo": lastInsertedIdEccen
      //             }
      //         })

      //         var resultP = await models.tbl_calibration_eccentricity_detail_incomplete.findAll({
      //             where: {
      //                 "Eccent_RepNo": RepNo
      //             }
      //         }); // selected
      //         let res = [{}]
      //         res[0].Eccent_RepNo = resultP[0].Eccent_RepNo
      //         res[0].Eccent_RecNo = resultP[0].Eccent_RecNo
      //         // console.log(result[0])
      //         let i = 0;
      //         for (let obj of resultP) {
      //             obj.Eccent_RecNo = resultP[i].Eccent_RecNo
      //             let objCopyEccen = await copyObjects.eccentricity('tbl_calibration_eccentricity_detail_incomplete'
      //                 , 'tbl_calibration_eccentricity_detail_failed', obj.Eccent_RepNo, obj.Eccent_RecNo, 'detail');
      //             columNames = objCopyEccen.data.map(obj => obj.str_colName).toString();
      //             str_Query = `insert into tbl_calibration_eccentricity_detail_failed (${columNames}) select ${columNames} from tbl_calibration_eccentricity_detail_incomplete where Eccent_RepNo = ${obj.Eccent_RepNo} AND Eccent_RecNo = ${obj.Eccent_RecNo}`
      //             let detailInsert = await sequelize.query(str_Query, { type: QueryTypes.INSERT })

      //             var lastInsertedIdU = detailInsert[0];

      //             await models.tbl_calibration_uncertinity_detail_failed.update({
      //                 "Eccent_RepNo": fRerSrNo,
      //                 "Linear_EndTime": moment(new Date()).format('HH:mm:ss')
      //             }, {
      //                 where: {
      //                     "srNo": lastInsertedIdU
      //                     // "Eccent_RepNo":  res[0].Eccent_RepNo
      //                 }
      //             })
      //             i++

      //         }
      //         if (sortedArray.indexOf('E') == int_curentCalibrationIndex) {
      //             // delete records from incomplete tables
      //             console.log('inside delete')

      //             await models.tbl_calibration_eccentricity_master_incomplete.destroy({
      //                 where: {
      //                     "Eccent_RepNo": RepNo
      //                 }
      //             })
      //             await models.tbl_calibration_eccentricity_detail_incomplete.destroy({
      //                 where: {
      //                     "Eccent_RepNo": RepNo
      //                 }
      //             })
      //         }
      //     }
      //         break;
      //     // For case REPETABILITY CALIBRATION
      //     case 'R': {
      //         var objReap = await copyObjects.repetability('tbl_calibration_repetability_master_incomplete'
      //             , 'tbl_calibration_repetability_master_failed', RepNo, 0, 'master');
      //         // Copying Incomplete master to failed master
      //         let columNames = objReap.data.map(obj => obj.str_colName).toString();
      //         var str_Query = `insert into tbl_calibration_repetability_master_failed (${columNames}) select ${columNames} from tbl_calibration_repetability_master_incomplete where Repet_RepNo = ${RepNo}`
      //         let resultReap = await sequelize.query(str_Query, { type: QueryTypes.INSERT })
      //         // last inserted Id got here form query
      //         var lastInsertedIdReap = resultReap[0];
      //         // Updating the report serial number in failed master

      //         await models.tbl_calibration_repetability_master_failed.update({
      //             "Repet_RepNo": fRerSrNo,
      //             "Repet_EndTime": moment(new Date()).format('HH:mm:ss')
      //         }, {
      //             where: {
      //                 "srNo": lastInsertedIdReap
      //             }
      //         }) // failed master report number updated
      //         // selecting data from incomplete details for copying

      //         var resultP = await models.tbl_calibration_repetability_detail_incomplete.findAll({
      //             where: {
      //                 "Repet_RepNo": RepNo
      //             }
      //         }); // selected
      //         let res = [{}]
      //         res[0].Repet_RepNo = resultP[0].Repet_RepNo
      //         res[0].Repet_RecNo = resultP[0].Repet_RecNo
      //         // as we have multiple entries i n details table so we need 
      //         // Async loop
      //         let i = 0;
      //         for (let obj of resultP) {
      //             obj.Repet_RecNo = resultP[i].Repet_RecNo
      //             let objCopyReap = await copyObjects.repetability('tbl_calibration_repetability_detail_incomplete'
      //                 , 'tbl_calibration_repetability_detail_failed', obj.Repet_RepNo, obj.Repet_RecNo, 'detail');

      //             columNames = objCopyReap.data.map(obj => obj.str_colName).toString();
      //             str_Query = `insert into tbl_calibration_repetability_detail_failed (${columNames}) select ${columNames} from tbl_calibration_repetability_detail_incomplete where Repet_RecNo = ${obj.Repet_RecNo} AND Repet_RecNo = ${obj.Repet_RecNo}`
      //             let detailInsert = await sequelize.query(str_Query, { type: QueryTypes.INSERT })

      //             var lastInsertedIdU = detailInsert[0];

      //             await models.tbl_calibration_uncertinity_detail_failed.update({
      //                 "Repet_RepNo": fRerSrNo
      //             }, {
      //                 where: {
      //                     "srNo": lastInsertedIdU
      //                     // "Repet_RepNo": res[0].Repet_RepNo
      //                 }
      //             })
      //             i++
      //         }

      //         if (sortedArray.indexOf('R') == int_curentCalibrationIndex) {
      //             // delete records from incomplete tables
      //             console.log('inside delete')

      //             await models.tbl_calibration_repetability_master_incomplete.destroy({
      //                 where: {
      //                     "Repet_RepNo": RepNo
      //                 }
      //             })
      //             await models.tbl_calibration_repetability_detail_incomplete.destroy({
      //                 where: {
      //                     "Repet_RepNo": RepNo
      //                 }
      //             })

      //         }
      //     }
      //         break;

      //     // For case Linearity CALIBRATION
      //     case 'L': {
      //         var objLinear = await copyObjects.linearity('tbl_calibration_linearity_master_incomplete'
      //             , 'tbl_calibration_linearity_master_failed', RepNo, 0, 'master');
      //         // Copying Incomplete master to failed master
      //         let columNames = objLinear.data.map(obj => obj.str_colName).toString();
      //         var str_Query = `insert into tbl_calibration_linearity_master_failed (${columNames}) select ${columNames} from tbl_calibration_linearity_master_incomplete where Linear_RepNo = ${RepNo}`
      //         let resultLinear = await sequelize.query(str_Query, { type: QueryTypes.INSERT })
      //         // last inserted Id got here form query
      //         var lastInsertedIdLinear = resultLinear[0];
      //         // Updating the report serial number in failed master

      //         await models.tbl_calibration_linearity_master_failed.update({
      //             "Linear_RepNo": fRerSrNo,
      //             "Linear_EndTime": moment(new Date()).format('HH:mm:ss')
      //         }, {
      //             where: {
      //                 "srNo": lastInsertedIdLinear
      //             }
      //         }) // failed master report number updated
      //         // selecting data from incomplete details for copying

      //         var resultP = await models.tbl_calibration_linearity_detail_incomplete.findAll({
      //             where: {
      //                 "Linear_RepNo": RepNo
      //             }
      //         }); // selected
      //         let res = [{}]
      //         res[0].Linear_RepNo = resultP[0].Linear_RepNo
      //         res[0].Linear_RecNo = resultP[0].Linear_RecNo
      //         // as we have multiple entries i n details table so we need 
      //         // Async loop
      //         let i = 0;
      //         for (let obj of res) {
      //             obj.Linear_RecNo = resultP[i].Linear_RecNo
      //             let objCopyLinear = await copyObjects.linearity('tbl_calibration_linearity_detail_incomplete'
      //                 , 'tbl_calibration_linearity_detail_failed', obj.Linear_RepNo, obj.Linear_RecNo, 'detail');

      //             columNames = objCopyLinear.data.map(obj => obj.str_colName).toString();
      //             str_Query = `insert into tbl_calibration_linearity_detail_failed (${columNames}) select ${columNames} from tbl_calibration_linearity_detail_incomplete where Linear_RecNo = ${obj.Linear_RecNo} AND Linear_RecNo = ${obj.Linear_RecNo}`
      //             let detailInsert = await sequelize.query(str_Query, { type: QueryTypes.INSERT })

      //             var lastInsertedIdU = detailInsert[0];

      //             await models.tbl_calibration_linearity_detail_failed.update({
      //                 "Linear_RepNo": fRerSrNo
      //             }, {
      //                 where: {
      //                     "srNo": lastInsertedIdU
      //                     // "Linear_RepNo": res[0].Linear_RepNo
      //                 }
      //             })
      //             i++;
      //         }

      //         if (sortedArray.indexOf('L') == int_curentCalibrationIndex) {
      //             // delete records from incomplete tables
      //             console.log('inside delete')

      //             await models.tbl_calibration_linearity_master_incomplete.destroy({
      //                 where: {
      //                     "Linear_RepNo": RepNo
      //                 }
      //             })
      //             await models.tbl_calibration_linearity_detail_incomplete.destroy({
      //                 where: {
      //                     "Linear_RepNo": RepNo
      //                 }
      //             })

      //         }
      //     }
      //         break;

      // }
    } catch (error) {
      console.log(error)
    }
  }

  async getFrepSrNo(str_first_calibration) {
    // str_first_calibration : - is the first calibration in the process

    switch (str_first_calibration) {
      case "P":
        var str_FailedTable = "tbl_calibration_periodic_master_failed"; // tableName
        var strRepNoColName = "Periodic_RepNo"; //column name
        var fRerSrNo = await this.calculateFrepSr(
          str_FailedTable,
          strRepNoColName
        ); // function call
        return fRerSrNo; // returning promise

      case "U":
        var str_FailedTable = "tbl_calibration_uncertinity_master_failed"; // tableName
        var strRepNoColName = "Uncertinity_RepNo"; //column name
        var fRerSrNo = await this.calculateFrepSr(
          str_FailedTable,
          strRepNoColName
        ); // function call
        return fRerSrNo; // returning promise
      case "R":
        var str_FailedTable = "tbl_calibration_repetability_master_failed"; // tableName
        var strRepNoColName = "Repet_RepNo"; //column name
        var fRerSrNo = await this.calculateFrepSr(
          str_FailedTable,
          strRepNoColName
        ); // function call
        return fRerSrNo; // returning promise
      case "E":
        var str_FailedTable = "tbl_calibration_eccentricity_master_failed"; // tableName
        var strRepNoColName = "Eccent_RepNo"; //column name
        var fRerSrNo = await this.calculateFrepSr(
          str_FailedTable,
          strRepNoColName
        ); // function call
        return fRerSrNo; // returning promise
      case "L":
        var str_FailedTable = "tbl_calibration_linearity_master_failed"; // tableName
        var strRepNoColName = "Linear_RepNo"; //column name
        var fRerSrNo = await this.calculateFrepSr(
          str_FailedTable,
          strRepNoColName
        ); // function call
        return fRerSrNo; // returning promise
      case "V":
        var str_FailedTable = "tbl_calibration_positional_master_failed";
        var strRepNoColName = "Positional_RepNo"; //column name
        var fRerSrNo = await this.calculateFrepSr(
          str_FailedTable,
          strRepNoColName
        ); // function call
        return fRerSrNo; // returning promise
    }
  }

  async calculateFrepSr(str_FailedTable, strRepNoColName) {
    let result = await models[str_FailedTable].findAll({
      attributes: [
        [sequelize.fn("max", sequelize.col(strRepNoColName)), "FRepSrNo"],
      ],
    });

    var FrepSrNo;
    // If entries not present
    if (result[0].FRepSrNo == null) {
      FrepSrNo = 1;
    } else {
      // If there are some records
      FrepSrNo = result[0].FRepSrNo + 1;
    }
    return FrepSrNo;
  }
  async check_validaty(_calib_entry) {
    let da_te = _calib_entry[0].EntryTimeStamp
    let valid_diff = moment()
    let start_Time = moment(da_te, 'HH:mm:ss');
    let end_Time = moment(valid_diff, 'HH:mm:ss');
    let total_time = moment.utc(moment(end_Time, "HH:mm:ss")
      .diff(moment(start_Time, "HH:mm:ss"))).format("HH:mm:ss")
    if (GLOBAL_NOMENCLATURE.Powerback_validtime < total_time) {
      return true
    } else {
      return false
    }

  }

}


module.exports = PowerBackup;
