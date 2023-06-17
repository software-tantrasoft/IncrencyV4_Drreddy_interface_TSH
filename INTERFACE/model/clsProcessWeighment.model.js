const clsHmiDetails = require('./hmiDetail.model');
const clsDatabase = require('../database/clsQueryProcess');
const globalData = require('../global/globalData')
const clsIndividual = require('./Test/clsIndividual.model');
const clsGroup = require('./Test/clsGroup.model');
const clsThickness = require('./Test/clsThickness.model');
const clsHardness = require('./Test/clsHardness.model');
const clsLod = require('./Test/clsLod.method');
const serverConfig = require('../global/serverConfig');
const GLOBAL_NOMENCLATURE = require('../global/GLOBAL_NOMENCLATURE');
const clsConfigSettings = require('./clsConfigSettings');
const clsCommonInsertOperation = require('./Product/clsCommonInsertOperation.model');
const { tbl_cubical, tbl_cubicle_product_sample } = require('../../config/dbConnection').models;
const sequelize = require('../../config/dbConnection').sequelize;
const clsActivityLog = require('./clsActivityLog.model');
const clsMonit = require('./MonitorSocket/clsMonitSocket');
const objMonit = new clsMonit();
const models = require("../../config/dbConnection").models;

const objActivityLog = new clsActivityLog();
const objHmi = new clsHmiDetails();
const objIndividual = new clsIndividual();
const objGroup = new clsGroup();
const objThickness = new clsThickness();
const objHardness = new clsHardness();
const objLod = new clsLod();
const objConfigSettings = new clsConfigSettings();
const objCommonInsert = new clsCommonInsertOperation();

class WeighmentModel {

    async doubleRotary(data) {
        try {
            var responseobj = {}
            //globalData.arrside = data.Side;

            var tmppbckupobj = globalData.arrside.find(k => k.Hmi == data.Hmi);
            if (tmppbckupobj == undefined) {
                globalData.arrside.push({
                    Hmi: data.Hmi,
                    Side: data.Side,
                });
            } else {
                var index = globalData.arrside.findIndex(k => k.Hmi == data.Hmi);
                globalData.arrside[index].Side = data.Side;
            }
            if (data.Side != '' && data.Side != null) {
                Object.assign(responseobj, { status: 'success' }, { result: ('Side set to ' + data.Side) })


            }
            return responseobj;
        } catch (error) {
            throw new Error(error)
        }

    }

    async OnTestStart(value) {
        try {
            let strHmi = value.Hmi;
            let arrPortDetailForStart = await objHmi.getResbPiNoFromHmi(strHmi)
            let intIdsNo = arrPortDetailForStart[0].Sys_IDSNo;
            let intPortNo = arrPortDetailForStart[0].Sys_PortNo;
            let strstatus = "Weighment"
            let productData = value;
            let menuName = productData.menuName;
            let tempSample = productData.noOfSample;
            let sampleNo = parseFloat(productData.noOfSample);
            let instrumentName = "";
            let responseObj = {};

            if (sampleNo !== "" && sampleNo !== undefined && (!isNaN(sampleNo))) {

                let prodtDetail1 = globalData.arr_limits.find(k => k.Hmi == strHmi);

                // if (Array.isArray(prodtDetail1.Menus)) {
                //     if (prodtDetail1.Menus.filter(k => k.hasOwnProperty(menuName))) {
                //         prodtDetail1.Menus.filter(k => k.hasOwnProperty(menuName))[0][menuName].noOfSamples = sample;
                //     }
                // }
                // else {
                //     prodtDetail1.Menus.noOfSamples = sample;
                // }
                let menuSample;
                if (Array.isArray(prodtDetail1.Menus)) {
                    if (prodtDetail1.Menus.filter(k => k.hasOwnProperty(menuName))) {
                        menuSample = prodtDetail1.Menus.filter((obj) => Object.keys(obj) == menuName)[0][menuName].noOfSamples;
                    }
                }
                else {
                    menuSample = prodtDetail1.Menus.noOfSample;
                    menuSample = menuSample == undefined ? "000" : menuSample
                }

                //power back up resume activity log;
                // /
                if (!value.isPowerBackup) {
                    var sampleno = await objCommonInsert.updateSample(sampleNo, strHmi, menuName)
                    var act = `${menuName} Sample Changes From ${menuSample} To ${tempSample} Update on TSH ${strHmi}`;
                    if (menuName == 'Hardness') {
                        var act = `${menuName}/Thickness Sample Changes From ${menuSample} To ${tempSample} Update on TSH ${strHmi}`;
                    }
                    if (menuSample != sampleNo) {
                        let objActivity = {};
                        Object.assign(
                            objActivity,
                            { strUserId: value.userId },
                            { strUserName: value.userName },
                            { activity: act }
                        );
                        await objActivityLog.ActivityLogEntry(objActivity);
                    }
                }
                // var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.idsNo == strHmi);
                //             if (IPQCObject != undefined) {
                //                 strHmi = IPQCObject.selectedIds.Idsno;
                //             } else {
                //                 strHmi = strHmi;
                //             }

                if (value.isPowerBackup) {
                    //sample no 
                    const SampleObj = await models.tbl_cubicle_product_sample.findAll({
                        where: {
                            Sys_CubicNo: value.CubicalNo
                        }
                    });
                    var sampleno = SampleObj[0][`${menuName}`]
                    let tempPbkupObj = globalData.monitDetail.find(k => k.Hmi == strHmi);
                    let sample = tempPbkupObj.data.length;
                    let sampleExist = "";
                    if (sample != 0) {
                        sampleExist = `from Sample No. ${sample} `
                    }
                    // let hmiDetails = globalData.arrWeighmentProductData.find(k => k.Hmi == data.Hmi);

                    if (menuName == "Individual") {
                        var act = `${menuName} Test Resumed on TSH ${strHmi} ${sampleExist} through PowerBackup`;
                        if (value.Side != 'NA') {
                            var act = `${menuName} Test Resumed on TSH ${strHmi} ${sampleExist} through PowerBackup for side ${value.Side}`;
                        }
                    }else{
                        var act = `${menuName}/Thickness Test Resumed on TSH ${strHmi} ${sampleExist} through PowerBackup`;
                        if (value.Side != 'NA') {
                            var act = `${menuName}/Thickness Test Resumed on TSH ${strHmi} ${sampleExist} through PowerBackup for side ${value.Side}`;
                        }
                    }

                    let objActivity = {};
                    Object.assign(
                        objActivity,
                        { strUserId: value.userId },
                        { strUserName: value.userName },
                        { activity: act }
                    );

                    await objActivityLog.ActivityLogEntry(objActivity);
                }

                if (Array.isArray(prodtDetail1.Menus)) {
                    if (prodtDetail1.Menus.filter(k => k.hasOwnProperty(menuName))) {
                        prodtDetail1.Menus.filter(k => k.hasOwnProperty(menuName))[0][menuName].noOfSamples = sampleno;
                    }
                }
                else {
                    prodtDetail1.Menus.noOfSample = sampleno;
                }

            }

            console.log("OnTestStart", value);

            await objMonit.monit({
                case: 'TestStart',
                Hmi: strHmi,
                data: {
                    Product: productData.ProductId,
                    Batch: productData.Batch,
                    TestType: menuName
                }
            });

            switch (menuName) {
                case GLOBAL_NOMENCLATURE.LengthMenu:
                case GLOBAL_NOMENCLATURE.ThicknessMenu:
                case GLOBAL_NOMENCLATURE.BreadthMenu:
                case GLOBAL_NOMENCLATURE.DiameterMenu:
                    instrumentName = GLOBAL_NOMENCLATURE.Vernier;
                    break;
                case GLOBAL_NOMENCLATURE.EmptyShell:
                case GLOBAL_NOMENCLATURE.IndividualMenu:
                case GLOBAL_NOMENCLATURE.IndLayerMenu:
                case GLOBAL_NOMENCLATURE.IndLayer1Menu:
                case GLOBAL_NOMENCLATURE.GroupMenu:
                case GLOBAL_NOMENCLATURE.GroupIndividual:
                case GLOBAL_NOMENCLATURE.GroupLayerMenu:
                case GLOBAL_NOMENCLATURE.GroupLayer1Menu:
                case GLOBAL_NOMENCLATURE.PercentageFine:
                case GLOBAL_NOMENCLATURE.ParticalSizing:
                    instrumentName = GLOBAL_NOMENCLATURE.Balance;
                    break;
                case GLOBAL_NOMENCLATURE.HardnessMenu:
                case GLOBAL_NOMENCLATURE.TabletTesterMenu:
                    instrumentName = GLOBAL_NOMENCLATURE.Hardness;
                    break;
                case GLOBAL_NOMENCLATURE.DTMenu:
                    instrumentName = GLOBAL_NOMENCLATURE.DT;
                    break;
                case GLOBAL_NOMENCLATURE.MoistureAnalyzer:
                    instrumentName = GLOBAL_NOMENCLATURE.MoistureAnalyzer;
                    break;
                case GLOBAL_NOMENCLATURE.FriabilityMenu:
                case GLOBAL_NOMENCLATURE.FriabilatorMenu:
                    if (menuName == GLOBAL_NOMENCLATURE.FriabilatorMenu) {
                        instrumentName = 'Friabilator';
                    } else {
                        if (serverConfig.friabilityType == "OF") {
                            instrumentName = 'Friabilator';
                        } else {
                            instrumentName = GLOBAL_NOMENCLATURE.Balance;
                        }
                    }

                    break;
                case GLOBAL_NOMENCLATURE.TappedDensity:
                    instrumentName = GLOBAL_NOMENCLATURE.TappedDensity;
                    break;
                case GLOBAL_NOMENCLATURE.PercentageFine:
                    instrumentName = GLOBAL_NOMENCLATURE.Balance;
                    break;
                case GLOBAL_NOMENCLATURE.Differential:
                    instrumentName = GLOBAL_NOMENCLATURE.Balance;
                    break;
                case GLOBAL_NOMENCLATURE.MoistureAnalyzer:
                case "LOD":
                case GLOBAL_NOMENCLATURE.granulationDry:
                case GLOBAL_NOMENCLATURE.granulationLub:
                case GLOBAL_NOMENCLATURE.lay1Dry:
                case GLOBAL_NOMENCLATURE.lay1Lub:
                case GLOBAL_NOMENCLATURE.lay2Dry:
                case GLOBAL_NOMENCLATURE.lay2Lub:
                    instrumentName = GLOBAL_NOMENCLATURE.MoistureAnalyzer;
                    break;
                case "IPCWC":
                    instrumentName = GLOBAL_NOMENCLATURE.IPCBalance;
                    var ipcWeighment = await selectedBin(value)
                    return ipcWeighment
                // break;

            }

            let configSetting = await objConfigSettings.GetConfigSetting(strHmi, instrumentName);
            let hmiEntryinConfig = globalData.arrConfigSettings.find(k => k.Hmi == strHmi);
            if (hmiEntryinConfig == undefined) {
                globalData.arrConfigSettings.push({
                    Hmi: strHmi,
                    configSetting: configSetting
                })
            } else {
                hmiEntryinConfig.configSetting = configSetting
            }

            let hmiDetails = globalData.arrWeighmentProductData.find(k => k.Hmi == strHmi);
            if (hmiDetails == undefined) {
                globalData.arrWeighmentProductData.push({
                    "Hmi": strHmi,
                    "data": productData
                })
            } else {
                hmiDetails.data = productData;
            }

            if (strstatus === "Weighment") {
                let tempObj = globalData.arrCurrentOperationStatus.find(k => k.Hmi == strHmi);
                if (tempObj === undefined) {
                    globalData.arrCurrentOperationStatus.push({
                        "Hmi": strHmi,
                        "Weighment": "1",
                        "testType": "Weighment"
                    })
                }
                else {
                    tempObj.testType = "Weighment"
                    tempObj.Weighment = "1";
                }
                return Object.assign(responseObj, { status: "success", configsetting: configSetting })
            } else {
                return Object.assign(responseObj, {
                    status: 'fail',
                    message: 'Status is not weighment'
                })
            }

        } catch (error) {
            throw new Error(error)
        }
    }

    async ParsingTestData(__parameterObj) {
        try {
            let result;
            let strIdsNo = __parameterObj.idsNo;
            let strHmi = __parameterObj.Hmi;
            const objSelMenu = globalData.arrSelectedMenu.find(k => k.Hmi == strHmi);
            let strSelectedMenuName = objSelMenu.menuName;
            __parameterObj.menuName = strSelectedMenuName;

            const SampleRemark = globalData.arrSampleRemarkForAllTest.find(k => k.Hmi == strHmi);
            if (SampleRemark == undefined) {
                globalData.arrSampleRemarkForAllTest.push({
                    "Hmi": strHmi,
                    "OutOfRemark": false
                });
            }
            strSelectedMenuName = strSelectedMenuName.replace(/\_/g, " ");
            switch (strSelectedMenuName) {

                case GLOBAL_NOMENCLATURE.IndividualMenu: {
                    result = await objIndividual.processIndividualData(__parameterObj);
                    return result;
                }

                case GLOBAL_NOMENCLATURE.GroupMenu: {
                    result = await objGroup.processGroupData(__parameterObj);
                    return result;
                }
                case GLOBAL_NOMENCLATURE.GroupLayerMenu: {
                    result = await objGroup.processGroupData(__parameterObj);
                    return result;
                }

                case GLOBAL_NOMENCLATURE.GroupIndividual: {
                    result = await objIndividual.processIndividualData(__parameterObj);
                    return result;
                }
                case GLOBAL_NOMENCLATURE.GroupLayer1Menu: {
                    result = await objGroup.processGroupData(__parameterObj);
                    return result;
                }
                case GLOBAL_NOMENCLATURE.ThicknessMenu: {
                    result = await objThickness.processThicknessData(__parameterObj);
                    return result;
                }
                case GLOBAL_NOMENCLATURE.HardnessMenu: {
                    result = await objHardness.processHardnessData(__parameterObj);
                    return result;
                }
                case GLOBAL_NOMENCLATURE.MoistureAnalyzer:
                case "LOD": {
                    result = await objLod.insertBulkWeighmentLOD(__parameterObj);
                    return result;
                }

                default:
                    console.log('Unknown ', strSelectedMenuName)

            }
        } catch (error) {
            throw new Error(error)
        }

    }

    async verifyLoginAfterTest(values) {
        try {
            const { Hmi: strHmi, userId: strUserId, userPass: strPassword } = values;
            let loginCheck = await this.checkUser(strUserId, strPassword);
            if (loginCheck == undefined) {
                return { status: 'fail', result: 'Incorrect Credentials' };
            }
            const arrUsers = globalData.arrUsers.find(k => k.Hmi == strHmi);
            if (arrUsers == undefined) {
                console.log('no user it must be error')
                return { status: 'fail', message: 'No user detail' }
            }
            //user which has login on system
            const preLoginUser = arrUsers.UserId;
            if (!(preLoginUser.trim() == strUserId.trim())) {
                return { status: 'fail', message: 'Incorrect Credentials' }
            }
            return { status: 'success', message: 'User Matched' }
        } catch (error) {
            throw new Error(error)
        }
    }

    async checkUser(userID, pwd) {
        try {
            const usrDetailsObj = {
                str_tableName: 'tbl_users',
                data: '*',
                condition: [{ str_colName: 'userId', value: userID },
                { str_colName: 'realPassword', value: pwd }
                ]
            }
            let result = await database.select(usrDetailsObj)

            if (result[0][0] != undefined) {
                return result[0][0];
            }
            else {
                return undefined;
            }

        } catch (error) {
            throw new Error(error)
        }
    }


}

module.exports = WeighmentModel;