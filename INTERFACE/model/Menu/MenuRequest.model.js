//packages
const date = require('date-and-time');
const moment = require('moment')
//modules
const clsHmiModel = require('../hmiDetail.model');
const Database = require('../../database/clsQueryProcess');
const globalData = require('../../global/globalData');
const PreWeighmentCheck = require('../preWeighmentCheck');
const serverConfig = require('../../global/serverConfig');
const clsFormulaFun = require('../Product/clsformulaFun.model');
const GLOBAL_NOMENCLATURE = require('../../global/GLOBAL_NOMENCLATURE');
const clsCommonOperation = require('../Product/clsCommonInsertOperation.model');
// const sequelize = require('../../../models').sequelize;
const { length, unique } = require('joi/lib/types/array');
const models = require('../../../config/dbConnection').models;
const sequelize = require('../../../config/dbConnection').sequelize;
const { QueryTypes } = require('sequelize');
const Hmi = require('../hmiDetail.model');

//instances of classes
const objHmiModel = new clsHmiModel();
const database = new Database();
const objPreCheck = new PreWeighmentCheck();
const objFormulaFun = new clsFormulaFun();
const objCommonOperation = new clsCommonOperation();
let now = new Date();


class Menu {

    async getMenu(values) {
        try {
            let resObj = {};
            let strHmi = values.Hmi;
            let strUserId = values.UserId;
            let strUserName = values.UserName;
            let objIdsNo = await objHmiModel.getResbPiNoFromHmi(strHmi);
            let IdsNo = objIdsNo[0].Sys_IDSNo;
            let selectedIdsNo;
            let bulkReceived = globalData.bulkFlag.find(k => k.Hmi == strHmi);
            if (bulkReceived == undefined) {
                globalData.bulkFlag.push({
                    Hmi: strHmi,
                    bulkFlag: false
                })
            } else {
                bulkReceived.bulkFlag = false
            }
            let objCalibratedBal = globalData.glbArrListOfCalibratedBal.find(k => k.Hmi == strHmi);
            if (objCalibratedBal == undefined) {
                globalData.glbArrListOfCalibratedBal.push({
                    idsNo: IdsNo,
                    Hmi: strHmi,
                    CalibratedBalList: [" "]
                });
            }
            else {
                objCalibratedBal.CalibratedBalList = [" "];
            }

            var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.idsNo == IdsNo);
            if (IPQCObject != undefined) {
                selectedIdsNo = IPQCObject.selectedIds;
            } else {
                selectedIdsNo = IdsNo;
            }

            var selectedHmi = await objHmiModel.getHmiNoFromResbPi(selectedIdsNo);

            let checkFri = globalData.arrBFBO.find(k => k.idsNo == IdsNo);

            if (checkFri == undefined) {
                globalData.arrBFBO.push({ idsNo: IdsNo, before: false, setParam: false, after: false });

            } else {
                checkFri.idsNo = IdsNo;
            }

            (globalData.arrcalibType.findIndex((element) => element.Hmi === strHmi)) == -1 ?
                globalData.arrcalibType : globalData.arrcalibType.splice(globalData.arrcalibType.findIndex((element) => element.Hmi === strHmi), 1);

            (globalData.arrCurrentOperationStatus.findIndex((element) => element.Hmi === strHmi)) == -1 ?
                globalData.arrCurrentOperationStatus :
                globalData.arrCurrentOperationStatus.splice(globalData.arrCurrentOperationStatus.findIndex((element) => element.Hmi === strHmi), 1);

            var tempArrRightsObj = globalData.arrUserRights.find(k => k.Hmi == strHmi);
            if (tempArrRightsObj != undefined) {
                if (tempArrRightsObj.removeRights.includes('Test')) {
                    return Object.assign(resObj, {
                        status: 'fail',
                        message: 'Test Right Not Assigned'
                    })
                }
                if (!tempArrRightsObj.rights.includes('Test')) {
                    return Object.assign(resObj, {
                        status: 'fail',
                        message: 'Test Right Not Assigned'
                    })
                }
            }

            const cubicalObj = await models.tbl_cubical.findAll({
                where: {
                    Sys_IDSNo: selectedHmi
                }
            })
            let arrResCubicalObj = [[cubicalObj[0]]];

            if (arrResCubicalObj[0].length < 0) {
                //return with error message
                console.log('no entry in cubical');
            }

            let cubicObj = globalData.arrIdsInfo.find(k => k.idsNo == selectedIdsNo);
            if (cubicObj == undefined) {
                globalData.arrIdsInfo.push({
                    Hmi: selectedHmi,
                    idsNo: selectedIdsNo,
                    cubicalData: arrResCubicalObj[0][0]
                })
            } else {
                cubicObj.idsNo = selectedIdsNo;
                cubicObj.cubicalData = arrResCubicalObj[0][0];
            }

            let checkIfProductSet = await objPreCheck.CheckProductSet(selectedHmi);
            if (!checkIfProductSet) {
                return Object.assign(resObj, { status: 'fail', message: 'Product not set' })
            }

            let checkBatchStatus = await objPreCheck.CheckBatchStatus(selectedIdsNo, selectedHmi);
            if (!checkBatchStatus.status) {
                return Object.assign(resObj, { status: 'fail', message: checkBatchStatus.message })
            }

            await this.lockedWeighingStatus(arrResCubicalObj[0][0].Sys_CubicNo, arrResCubicalObj[0][0].Sys_Batch, arrResCubicalObj[0][0].Sys_CubType)
            const Product = {
                ProductId: arrResCubicalObj[0][0].Sys_BFGCode,
                ProductName: arrResCubicalObj[0][0].Sys_ProductName,
                ProductVersion: arrResCubicalObj[0][0].Sys_PVersion,
                Version: arrResCubicalObj[0][0].Sys_Version,
            }

            const selectProductMaster = await models.tbl_product_master.findAll({
                where: {
                    ProductName: Product.ProductName,
                    ProductId: Product.ProductId,
                    ProductVersion: Product.ProductVersion,
                    Version: Product.Version
                }
            })

            var productType = selectProductMaster[0].ProductType;

            let cubicObjCurrent = globalData.arrIdsInfo.find(k => k.idsNo == IdsNo).cubicalData;

            const __parameterObj = {
                Product: Product,
                IdsNo: IdsNo,
                CubicalType: cubicObjCurrent.Sys_CubType,
                AreaInCubical: cubicObjCurrent.Sys_Area,
                AllCubicalData: cubicObjCurrent,
                Hmi: strHmi
            }
            let processMenu = await this.processCubical(__parameterObj, IdsNo);


            let hardnessMasterEntryArr = globalData.HardnessMasterEntry.find(k => k.Hmi == strHmi)
            if (hardnessMasterEntryArr == undefined) {
                globalData.HardnessMasterEntry.push({
                    Hmi: strHmi,
                    masterEntryDone: false,
                    savedToMaster: false
                })
            } else {
                hardnessMasterEntryArr.masterEntryDone = false
                hardnessMasterEntryArr.savedToMaster = false
            }


            var selectRepSrNoObj = await models.tbl_powerbackup.findAll({
                where: {
                    CubicalNo: cubicObjCurrent.Sys_CubicNo
                }
            })

            let powerbacc = [selectRepSrNoObj];
            powerbacc = powerbacc[0].pop();
            let time;
            if (powerbacc == undefined) {
                time = 0;
            } else {
                time = moment(powerbacc.EntryTimeStamp).format("hh:mm")
            }


            //         //need to check it once 
            if (powerbacc) {
                let date1 = new Date();
                // let initSampletime = new Date(date.format(new Date(this.DateFormat(now, time)), 'YYYY-MM-DD HH:mm:ss')).toLocaleString().replace(',', ' ');
                let initSampletime = moment(powerbacc.EntryTimeStamp).add(4, 'minutes').format('YYYY-MM-DD HH:mm:ss').toLocaleString().replace(',', ' ');
                let currentTime = new Date(date.format(new Date(), 'YYYY-MM-DD HH:mm:ss')).toLocaleString().replace(',', ' ');
                console.log(this.DateFormat(now, time));

                if (Date.parse(currentTime) >= Date.parse(initSampletime) || initSampletime == "Invalid Date") {
                    console.log('time match or excced');
                    return Object.assign(resObj, {
                        status: 'success',
                        result: processMenu,
                    })
                } else {
                    console.log('time not match');
                    let hideMenu = processMenu.filter(k => k != 'FRIAB');
                    return Object.assign(resObj, {
                        status: 'success',
                        result: hideMenu,
                    })
                }
            } else {
                return Object.assign(resObj, {
                    status: 'success',
                    result: processMenu,
                })
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    async processCubical(objCubicalData, strIdsNo) {
        try {
            let Product = objCubicalData.Product;
            let cubicalObj = globalData.arrIdsInfo.find(k => k.idsNo == strIdsNo).cubicalData; //current
            let strHmi = objCubicalData.Hmi;
            let idsNo = objCubicalData.IdsNo;
            let selectedIdsNo;
            var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.idsNo == idsNo);
            if (IPQCObject != undefined) {
                selectedIdsNo = IPQCObject.selectedIds;
            } else {
                selectedIdsNo = strIdsNo;
            }
            let objCubicalData1 = globalData.arrIdsInfo.find(k => k.idsNo == selectedIdsNo).cubicalData;
            let cubicalArea = objCubicalData1.Sys_Area;
            var selectedHmi = await objHmiModel.getHmiNoFromResbPi(selectedIdsNo);

            //check cubical product combination in product master
            const selectProductMaster = await models.tbl_product_master.findAll({
                where: {
                    ProductName: Product.ProductName,
                    ProductId: Product.ProductId,
                    ProductVersion: Product.ProductVersion,
                    Version: Product.Version
                }

            })
            let arrResProductMaster = [selectProductMaster]
            if (arrResProductMaster[0].length < 0) {
                console.log('Cubical product does not match in product master ')
                return;
            }
            let productType = arrResProductMaster[0][0].ProductType;
            //check productType
            let tableName;
            let TableName;
            if (productType == 1) {
                switch (cubicalArea) {
                    case 'Compression':
                    case 'Effervescent Compression':
                    case 'IPQC':
                    case 'IPC':
                        tableName = "tbl_product_tablet";
                        TableName = models.tbl_product_tablet
                        break;
                    case 'Coating':
                    case 'Pallet Coating':
                        tableName = 'tbl_product_tablet_coated';
                        TableName = models.tbl_product_tablet_coated
                        break;
                    case 'Effervescent Granulation':
                    case 'Granulation':
                        tableName = 'tbl_product_gran';
                        TableName = models.tbl_product_gran
                        break;
                }

            } else if (productType == 2 && cubicalArea == "Capsule Filling") {
                tableName = 'tbl_product_capsule';
                TableName = models.tbl_product_capsule
            } else if (productType == 2 && (cubicalArea == "Granulation" || cubicalArea == "Effervescent Granulation")) {
                tableName = 'tbl_product_gran_cap';
                TableName = models.tbl_product_gran_cap
            } else if (productType == 2 && cubicalArea == "Pallet Coating") {
                tableName = "tbl_product_capsule";
                TableName = models.tbl_product_capsule
            } else if (productType == 3 && cubicalArea == "Multihaler") {
                tableName = 'tbl_product_multihaler';
                TableName = models.tbl_product_multihaler
            } else {
                console.log("nothing found on menu")
            }
            const selectObj = await TableName.findAll({
                where: {
                    ProductName: Product.ProductName,
                    ProductId: Product.ProductId,
                    ProductVersion: Product.ProductVersion,
                    Version: Product.Version


                }

            })
            let arrResOfProductDetail = [[selectObj[0]]];
            let tempObjProdType = globalData.arrProductTypeArray.find(k => k.Hmi == strHmi);
            if (tempObjProdType == undefined) {
                globalData.arrProductTypeArray.push({
                    Hmi: selectedHmi,
                    idsNo: selectedIdsNo,
                    productType: arrResProductMaster[0][0],
                    productDetail: arrResOfProductDetail
                });
            } else {
                tempObjProdType.productType = arrResProductMaster[0][0];
                tempObjProdType.productDetail = arrResOfProductDetail;
            }

            const selctProductSamples = await models.tbl_cubicle_product_sample.findAll({
                where: {
                    Sys_CubicNo: objCubicalData1.Sys_CubicNo,
                }

            })
            let arrProductSample = [selctProductSamples];

            //according to instrument connect give menu 
            let port1 = cubicalObj.Sys_Port1;
            let port2 = cubicalObj.Sys_Port2;
            let port3 = cubicalObj.Sys_Port3;
            let port4 = cubicalObj.Sys_Port4;
            let uniqueSet;
            let tempPortsArr = [port1, port2, port3, port4];
            let removedNoneFromArr = tempPortsArr.filter(f => f !== "None");

            let MenusToBeShown = await Promise.all(removedNoneFromArr.map((instrument, index) => {
                let __Paramsobj = {
                    instrument: instrument,
                    ProductDetail: arrResOfProductDetail,
                    Hmi: strHmi,
                    idsNo: idsNo,
                    prdType: productType,
                    PortNo: index + 1,
                    Samples: arrProductSample[0][0]
                }
                return this.CheckParamsSet(__Paramsobj, strIdsNo)
            }))

            MenusToBeShown = [].concat.apply([], MenusToBeShown);
            MenusToBeShown = MenusToBeShown.filter(menu => menu != undefined)
            MenusToBeShown = MenusToBeShown.map(JSON.stringify);
            /**
             * Set will remove Duplicate obj from array.
             */
            uniqueSet = [...new Set(MenusToBeShown)];
            //to put groupind last

            var element = uniqueSet.filter(k =>
                k.indexOf("GRPIND") !== -1
            )
            if (element != undefined && element.length != 0) {
                var CutIndx = uniqueSet.findIndex(x => x == element)
                var PutIndx = Object.keys(uniqueSet).length;
                (uniqueSet).splice(CutIndx, 1);
                (uniqueSet).splice(PutIndx, 0, element);
            }
            //
            MenusToBeShown = Array.from(uniqueSet).map(JSON.parse);

            // console.log(MenusToBeShown);

            let glbArr = globalData.arr_limits.find(k => k.Hmi == strHmi);
            if (glbArr == undefined) {
                globalData.arr_limits.push({
                    Hmi: strHmi,
                    idsNo: idsNo,
                    Menus: MenusToBeShown
                })
            } else {
                glbArr.idsNo = idsNo;
                glbArr.Menus = MenusToBeShown;
            }
            MenusToBeShown = MenusToBeShown.map((e, index) => {
                if (Object.keys(e).length > 1) {
                    return Object.getOwnPropertyNames(e).toString().split(',')
                } else {
                    return Object.getOwnPropertyNames(e)[0]
                }
            })
            return MenusToBeShown.toString().split(',');

        } catch (error) {
            throw new Error(error)
        }
    }

    async CheckParamsSet(values, strIdsNo) {
        try {
            let strInstrument = values.instrument;
            let result;
            switch (strInstrument.toUpperCase()) {
                case 'BALANCE':
                case 'IPC BALANCE':
                    result = await this.streamDataMenuMaking(values, strIdsNo);
                    break;
                case 'VERNIER':
                    result = await this.streamDataMenuMaking(values, strIdsNo);
                    break;
                case 'TBTTST':
                case 'TABLET TESTER':
                case 'HARDNESS':
                    result = await this.bulkDataMenuMaking(values, strIdsNo)
                    break;
                case 'FRIABILATOR':
                    result = await this.bulkDataMenuMaking(values, strIdsNo)
                    break;
                case 'DISINTEGRATION TESTER':
                    result = this.bulkDataMenuMaking(values, strIdsNo);
                    break;
                case 'MOISTURE ANALYZER':
                    result = this.bulkDataMenuMaking(values, strIdsNo);
                    break;
                case 'TAPPED DENSITY':
                    result = this.bulkDataMenuMaking(values, strIdsNo);
                    break;
                case 'EMPTY SHELL':
                    result = this.EmptyShellStart(values, strIdsNo);
            }
            return result;
        } catch (error) {
            throw new Error(error)
        }
    }

    async streamDataMenuMaking(values, currentIdsNo) {
        try {
            let strInstrument = values.instrument;
            let strHmi = values.Hmi;
            let intPortNo = values.PortNo;
            let arrProductDetail = values.ProductDetail;
            let objSamples = values.Samples;
            let intProductType = values.prdType;
            const cubicObj = globalData.arrIdsInfo.find(k => k.Hmi == strHmi);
            let IdsNo = cubicObj.idsNo;
            let objCalibratedBalIPC;
            let objCalibratedBalAnalytical;
            let selectedIdsNo;
            var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.idsNo == IdsNo);
            if (IPQCObject != undefined) {
                selectedIdsNo = IPQCObject.selectedIds;
            } else {
                selectedIdsNo = IdsNo;
            }
            let MenuAccordingToParamsSet = await Promise.all(Object.keys(arrProductDetail[0][0]).map(async (data) => {
                let obj = {}
                let objCalibratedBal = globalData.glbArrListOfCalibratedBal.find(k => k.idsNo == currentIdsNo);
                if (objCalibratedBal != undefined) {
                    objCalibratedBalAnalytical = objCalibratedBal.CalibratedBalList.filter(k => k.balType != "IPC Balance");
                    objCalibratedBalIPC = objCalibratedBal.CalibratedBalList.filter(k => k.balType == "IPC Balance");
                } else {
                    objCalibratedBalAnalytical = [];
                    objCalibratedBalIPC = [];
                }


                switch (data) {
                    case 'Param1_Nom'://Individual
                        if (parseFloat(arrProductDetail[0][0][data]) > 0 && parseFloat(arrProductDetail[0][0][data]) != 99999) {

                            if ((intProductType == 1 || intProductType == 2) &&
                                cubicObj.cubicalData.Sys_BalID != "None" &&
                                strInstrument == "Balance"
                                && (objCalibratedBalAnalytical.length != 0)
                            ) {
                                let unit = await this.getBalanceUnit(cubicObj.cubicalData.Sys_BalID);
                                console.log(unit)
                                obj[`${GLOBAL_NOMENCLATURE.IndividualMenu}`] = {
                                    'nominal': arrProductDetail[0][0].Param1_Nom,
                                    'T1Neg': arrProductDetail[0][0].Param1_T1Neg,
                                    'T1Pos': arrProductDetail[0][0].Param1_T1Pos,
                                    'T2Neg': arrProductDetail[0][0].Param1_T2Neg,
                                    'T2Pos': arrProductDetail[0][0].Param1_T2Pos,
                                    'LimitOn': arrProductDetail[0][0].Param1_LimitOn,
                                    'dp': arrProductDetail[0][0].Param1_DP,
                                    'isonstd': arrProductDetail[0][0].Param1_IsOnStd,
                                    'noOfSamples': objSamples.Individual,
                                    'NMT': arrProductDetail[0][0].Param1_NMTTab,
                                    'ProductType': intProductType,
                                    'unit': arrProductDetail[0][0].Param1_Unit


                                }
                            } else if (intProductType == 3 &&
                                cubicObj.cubicalData.Sys_BalID != "None" &&
                                strInstrument == "Balance"
                            ) {
                                if (arrProductDetail[0][0].MutihalerType[0] == 1) {
                                    obj[GLOBAL_NOMENCLATURE.dryCart] = {
                                        'nominal': arrProductDetail[0][0].Param1_Nom,
                                        'T1Neg': arrProductDetail[0][0].Param1_T1Neg,
                                        'T1Pos': arrProductDetail[0][0].Param1_T1Pos,
                                        'T2Neg': arrProductDetail[0][0].Param1_T2Neg,
                                        'T2Pos': arrProductDetail[0][0].Param1_T2Pos,
                                        'LimitOn': arrProductDetail[0][0].Param1_LimitOn,
                                        'dp': arrProductDetail[0][0].Param1_DP,
                                        'isonstd': arrProductDetail[0][0].Param1_IsOnStd,
                                        'noOfSamples': objSamples.Individual,
                                        'NMT': arrProductDetail[0][0].Param1_NMTTab,
                                        'ProductType': intProductType
                                    },
                                        obj[GLOBAL_NOMENCLATURE.netCart] = {
                                            'nominal': arrProductDetail[0][0].Param1_Nom,
                                            'T1Neg': arrProductDetail[0][0].Param1_T1Neg,
                                            'T1Pos': arrProductDetail[0][0].Param1_T1Pos,
                                            'T2Neg': arrProductDetail[0][0].Param1_T2Neg,
                                            'T2Pos': arrProductDetail[0][0].Param1_T2Pos,
                                            'LimitOn': arrProductDetail[0][0].Param1_LimitOn,
                                            'dp': arrProductDetail[0][0].Param1_DP,
                                            'isonstd': arrProductDetail[0][0].Param1_IsOnStd,
                                            'noOfSamples': objSamples.Individual,
                                            'NMT': arrProductDetail[0][0].Param1_NMTTab,
                                            'ProductType': intProductType
                                        }
                                } else {
                                    //for Dpi Strip
                                    let unit = await this.getBalanceUnit(cubicObj.cubicalData.Sys_BalID);
                                    // console.log(unit)
                                    obj[GLOBAL_NOMENCLATURE.dryPowder] = {
                                        'nominal': arrProductDetail[0][0].Param1_Nom,
                                        'T1Neg': arrProductDetail[0][0].Param1_T1Neg,
                                        'T1Pos': arrProductDetail[0][0].Param1_T1Pos,
                                        'T2Neg': arrProductDetail[0][0].Param1_T2Neg,
                                        'T2Pos': arrProductDetail[0][0].Param1_T2Pos,
                                        'LimitOn': arrProductDetail[0][0].Param1_LimitOn,
                                        'dp': arrProductDetail[0][0].Param1_DP,
                                        'isonstd': arrProductDetail[0][0].Param1_IsOnStd,
                                        'noOfSamples': objSamples.Individual,
                                        'NMT': arrProductDetail[0][0].Param1_NMTTab,
                                        'ProductType': intProductType,
                                        'unit': unit
                                    }
                                }
                            }
                        }
                        break;
                    case 'Param2_Nom'://group
                        if (parseFloat(arrProductDetail[0][0][data]) > 0 && parseFloat(arrProductDetail[0][0][data]) != 99999) {

                            let menuName = (intProductType == 1 || intProductType == 2) ?
                                GLOBAL_NOMENCLATURE.GroupMenu : intProductType == 3 &&
                                    arrProductDetail[0][0].MutihalerType[0] == 1 ? GLOBAL_NOMENCLATURE.sealedcart : undefined

                            if (cubicObj.cubicalData.Sys_BalID != "None" &&
                                strInstrument == "Balance" && (objCalibratedBalAnalytical.length != 0)
                            ) {
                                let unit = await this.getBalanceUnit(cubicObj.cubicalData.Sys_BalID);

                                obj[menuName] = {
                                    'nominal': arrProductDetail[0][0].Param2_Nom,
                                    'T1Neg': arrProductDetail[0][0].Param2_T1Neg,
                                    'T1Pos': arrProductDetail[0][0].Param2_T1Pos,
                                    'T2Neg': arrProductDetail[0][0].Param2_T2Neg,
                                    'T2Pos': arrProductDetail[0][0].Param2_T2Pos,
                                    'LimitOn': arrProductDetail[0][0].Param2_LimitOn,
                                    'dp': arrProductDetail[0][0].Param2_DP,
                                    'isonstd': arrProductDetail[0][0].Param2_IsOnStd,
                                    'noOfSamples': objSamples.Group,
                                    'NMT': arrProductDetail[0][0].Param2_NMTTab,
                                    'ProductType': intProductType,
                                    'unit': arrProductDetail[0][0].Param2_Unit
                                }
                            }
                        }
                        break;
                    case 'Param3_Nom'://thickness or differntial
                        if (parseFloat(arrProductDetail[0][0][data]) > 0 && parseFloat(arrProductDetail[0][0][data]) != 99999) {

                            if (cubicObj.cubicalData.Sys_VernierID != "None" && intProductType == 1 &&
                                strInstrument == "Vernier"
                            ) {

                                let unit = await this.getVerinerUnit(cubicObj.cubicalData.Sys_VernierID);
                                obj[GLOBAL_NOMENCLATURE.ThicknessMenu] = {
                                    'nominal': arrProductDetail[0][0].Param3_Nom,
                                    'T1Neg': arrProductDetail[0][0].Param3_T1Neg,
                                    'T1Pos': arrProductDetail[0][0].Param3_T1Pos,
                                    'T2Neg': arrProductDetail[0][0].Param3_T2Neg,
                                    'T2Pos': arrProductDetail[0][0].Param3_T2Pos,
                                    'LimitOn': arrProductDetail[0][0].Param3_LimitOn,
                                    'dp': arrProductDetail[0][0].Param3_Dp,
                                    'isonstd': arrProductDetail[0][0].Param3_IsOnStd,
                                    'noOfSamples': objSamples.Individual,
                                    'NMT': arrProductDetail[0][0].Param3_NMTTab,
                                    'ProductType': intProductType,
                                    'unit': unit
                                }
                            }

                            if (cubicObj.cubicalData.Sys_BalID != "None" && intProductType == 2 &&
                                strInstrument == "Balance"
                            ) {

                                let unit = await this.getBalanceUnit(cubicObj.cubicalData.Sys_BalID);

                                obj[`${GLOBAL_NOMENCLATURE.Differential}`] = {
                                    'nominal': arrProductDetail[0][0].Param3_Nom,
                                    'T1Neg': arrProductDetail[0][0].Param3_T1Neg,
                                    'T1Pos': arrProductDetail[0][0].Param3_T1Pos,
                                    'T2Neg': arrProductDetail[0][0].Param3_T2Neg,
                                    'T2Pos': arrProductDetail[0][0].Param3_T2Pos,
                                    'LimitOn': arrProductDetail[0][0].Param3_LimitOn,
                                    'dp': arrProductDetail[0][0].Param3_Dp,
                                    'isonstd': arrProductDetail[0][0].Param3_IsOnStd,
                                    'noOfSamples': objSamples.Individual,
                                    'NMT': arrProductDetail[0][0].Param3_NMTTab,
                                    'ProductType': intProductType,
                                    'unit': unit
                                }
                            }



                        }
                        break;
                    case 'Param4_Nom'://diameter or breadth
                        if (parseFloat(arrProductDetail[0][0][data]) > 0 && parseFloat(arrProductDetail[0][0][data]) != 99999) {

                            let menuName = intProductType == 1 ? GLOBAL_NOMENCLATURE.BreadthMenu :
                                intProductType == 2 ? GLOBAL_NOMENCLATURE.DiameterMenu : undefined;

                            if (cubicObj.cubicalData.Sys_VernierID != "None" &&
                                strInstrument == "Vernier"
                            ) {
                                let unit = await this.getVerinerUnit(cubicObj.cubicalData.Sys_VernierID);
                                obj[menuName] = {
                                    'nominal': arrProductDetail[0][0].Param4_Nom,
                                    'T1Neg': arrProductDetail[0][0].Param4_T1Neg,
                                    'T1Pos': arrProductDetail[0][0].Param4_T1Pos,
                                    'T2Neg': arrProductDetail[0][0].Param4_T2Neg,
                                    'T2Pos': arrProductDetail[0][0].Param4_T2Pos,
                                    'LimitOn': arrProductDetail[0][0].Param4_LimitOn,
                                    'dp': arrProductDetail[0][0].Param4_Dp,
                                    'isonstd': arrProductDetail[0][0].Param4_IsOnStd,
                                    'noOfSamples': objSamples.Individual,
                                    'NMT': arrProductDetail[0][0].Param4_NMTTab,
                                    'ProductType': intProductType,
                                    'unit': unit
                                }
                            }
                        }
                        break;
                    case 'Param5_Nom'://length
                        if (parseFloat(arrProductDetail[0][0][data]) > 0 && parseFloat(arrProductDetail[0][0][data]) != 99999) {
                            if ((intProductType == 1 || intProductType == 2) &&
                                cubicObj.cubicalData.Sys_VernierID != "None" &&
                                strInstrument == "Vernier"
                            ) {
                                let unit = await this.getVerinerUnit(cubicObj.cubicalData.Sys_VernierID);
                                obj['Length'] = {
                                    'nominal': arrProductDetail[0][0].Param5_Nom,
                                    'T1Neg': arrProductDetail[0][0].Param5_T1Neg,
                                    'T1Pos': arrProductDetail[0][0].Param5_T1Pos,
                                    'T2Neg': arrProductDetail[0][0].Param5_T2Neg,
                                    'T2Pos': arrProductDetail[0][0].Param5_T2Pos,
                                    'LimitOn': arrProductDetail[0][0].Param5_LimitOn,
                                    'dp': arrProductDetail[0][0].Param5_Dp,
                                    'isonstd': arrProductDetail[0][0].Param5_IsOnStd,
                                    'noOfSamples': objSamples.Individual,
                                    'NMT': arrProductDetail[0][0].Param5_NMTTab,
                                    'ProductType': intProductType,
                                    'unit': unit
                                }
                            }
                        }
                        break;
                    case 'Param6_Nom'://diameter
                        if (parseFloat(arrProductDetail[0][0][data]) > 0 && parseFloat(arrProductDetail[0][0][data]) != 99999) {

                            if (intProductType == 1 &&
                                cubicObj.cubicalData.Sys_VernierID != "None" &&
                                strInstrument == "Vernier"
                            ) {
                                let unit = await this.getVerinerUnit(cubicObj.cubicalData.Sys_VernierID);
                                obj[GLOBAL_NOMENCLATURE.DiameterMenu] = {
                                    'nominal': arrProductDetail[0][0].Param6_Nom,
                                    'T1Neg': arrProductDetail[0][0].Param6_T1Neg,
                                    'T1Pos': arrProductDetail[0][0].Param6_T1Pos,
                                    'T2Neg': arrProductDetail[0][0].Param6_T2Neg,
                                    'T2Pos': arrProductDetail[0][0].Param6_T2Pos,
                                    'LimitOn': arrProductDetail[0][0].Param6_LimitOn,
                                    'dp': arrProductDetail[0][0].Param6_Dp,
                                    'isonstd': arrProductDetail[0][0].Param6_IsOnStd,
                                    'noOfSamples': objSamples.Individual,
                                    'NMT': arrProductDetail[0][0].Param6_NMTTab,
                                    'ProductType': intProductType,
                                    'unit': unit
                                }
                            }
                        }
                        break;
                    case 'Param9_Nom'://Individual layer
                        if (parseFloat(arrProductDetail[0][0][data]) > 0 && parseFloat(arrProductDetail[0][0][data]) != 99999) {

                            if (intProductType == 1 &&
                                cubicObj.cubicalData.Sys_BalID != "None" &&
                                strInstrument == "Balance" && (objCalibratedBalAnalytical.length != 0)
                            ) {
                                let unit = await this.getBalanceUnit(cubicObj.cubicalData.Sys_BalID);
                                obj[`${GLOBAL_NOMENCLATURE.IndLayerMenu}`] = {
                                    'nominal': arrProductDetail[0][0].Param9_Nom,
                                    'T1Neg': arrProductDetail[0][0].Param9_T1Neg,
                                    'T1Pos': arrProductDetail[0][0].Param9_T1Pos,
                                    'T2Neg': arrProductDetail[0][0].Param9_T2Neg,
                                    'T2Pos': arrProductDetail[0][0].Param9_T2Pos,
                                    'LimitOn': arrProductDetail[0][0].Param9_LimitOn,
                                    'dp': arrProductDetail[0][0].Param9_Dp,
                                    'isonstd': arrProductDetail[0][0].Param9_IsOnStd,
                                    'noOfSamples': objSamples.Individual,
                                    'NMT': arrProductDetail[0][0].Param9_NMTTab,
                                    'ProductType': intProductType,
                                    'unit': unit
                                }
                            }

                        }
                        break;
                    case 'Param10_Nom'://Group layer
                        if (parseFloat(arrProductDetail[0][0][data]) > 0 && parseFloat(arrProductDetail[0][0][data]) != 99999) {

                            if (intProductType == 1 &&
                                cubicObj.cubicalData.Sys_BalID != "None" &&
                                strInstrument == "Balance" && (objCalibratedBalAnalytical.length != 0)
                            ) {
                                let unit = await this.getBalanceUnit(cubicObj.cubicalData.Sys_BalID);
                                obj[`${GLOBAL_NOMENCLATURE.GroupLayerMenu}`] = {
                                    'nominal': arrProductDetail[0][0].Param10_Nom,
                                    'T1Neg': arrProductDetail[0][0].Param10_T1Neg,
                                    'T1Pos': arrProductDetail[0][0].Param10_T1Pos,
                                    'T2Neg': arrProductDetail[0][0].Param10_T2Neg,
                                    'T2Pos': arrProductDetail[0][0].Param10_T2Pos,
                                    'LimitOn': arrProductDetail[0][0].Param10_LimitOn,
                                    'dp': arrProductDetail[0][0].Param10_Dp,
                                    'isonstd': arrProductDetail[0][0].Param10_IsOnStd,
                                    'noOfSamples': objSamples.Group,
                                    'NMT': arrProductDetail[0][0].Param10_NMTTab,
                                    'ProductType': intProductType,
                                    'unit': unit
                                }
                            }

                        }
                        break;
                    case 'Param11_Nom'://Individual layer 1
                        if (parseFloat(arrProductDetail[0][0][data]) > 0 && parseFloat(arrProductDetail[0][0][data]) != 99999) {
                            if (intProductType == 1 &&
                                cubicObj.cubicalData.Sys_BalID != "None" &&
                                strInstrument == "Balance" && (objCalibratedBalAnalytical.length != 0)
                            ) {
                                let unit = await this.getBalanceUnit(cubicObj.cubicalData.Sys_BalID);
                                obj[`${GLOBAL_NOMENCLATURE.IndLayer1Menu}`] = {
                                    'nominal': arrProductDetail[0][0].Param11_Nom,
                                    'T1Neg': arrProductDetail[0][0].Param11_T1Neg,
                                    'T1Pos': arrProductDetail[0][0].Param11_T1Pos,
                                    'T2Neg': arrProductDetail[0][0].Param11_T2Neg,
                                    'T2Pos': arrProductDetail[0][0].Param11_T2Pos,
                                    'LimitOn': arrProductDetail[0][0].Param11_LimitOn,
                                    'dp': arrProductDetail[0][0].Param11_Dp,
                                    'isonstd': arrProductDetail[0][0].Param11_IsOnStd,
                                    'noOfSamples': objSamples.Individual,
                                    'NMT': arrProductDetail[0][0].Param11_NMTTab,
                                    'ProductType': intProductType,
                                    'unit': unit
                                }
                            }

                        }
                        break;
                    case 'Param12_Nom'://Group layer 1
                        if (parseFloat(arrProductDetail[0][0][data]) > 0 && parseFloat(arrProductDetail[0][0][data]) != 99999) {
                            if (intProductType == 1 &&
                                cubicObj.cubicalData.Sys_BalID != "None" &&
                                strInstrument == "Balance" && (objCalibratedBalAnalytical.length != 0)

                            ) {
                                let unit = await this.getBalanceUnit(cubicObj.cubicalData.Sys_BalID);

                                obj[`${GLOBAL_NOMENCLATURE.GroupLayer1Menu}`] = {
                                    'nominal': arrProductDetail[0][0].Param12_Nom,
                                    'T1Neg': arrProductDetail[0][0].Param12_T1Neg,
                                    'T1Pos': arrProductDetail[0][0].Param12_T1Pos,
                                    'T2Neg': arrProductDetail[0][0].Param12_T2Neg,
                                    'T2Pos': arrProductDetail[0][0].Param12_T2Pos,
                                    'LimitOn': arrProductDetail[0][0].Param12_LimitOn,
                                    'dp': arrProductDetail[0][0].Param12_Dp,
                                    'isonstd': arrProductDetail[0][0].Param12_IsOnStd,
                                    'noOfSamples': objSamples.Group,
                                    'NMT': arrProductDetail[0][0].Param12_NMTTab,
                                    'ProductType': intProductType,
                                    'unit': unit
                                }
                            }

                        }
                        break;
                    case 'Param8_Nom'://Friability
                        if (parseFloat(arrProductDetail[0][0][data]) > 0 && parseFloat(arrProductDetail[0][0][data]) != 99999) {
                            if (serverConfig.friabilityType == 'OB' || serverConfig.friabilityType == 'BFBO' || serverConfig.friabilityType == 'BFBT') {
                                if (intProductType == 1 &&
                                    cubicObj.cubicalData.Sys_BalID != "None" &&
                                    strInstrument == "Balance"
                                ) {
                                    let unit = await this.getBalanceUnit(cubicObj.cubicalData.Sys_BalID);
                                    //arr
                                    let checkFri = globalData.arrBFBO.find(k => k.idsNo == IdsNo);
                                    let friabMenu = `${GLOBAL_NOMENCLATURE.FriabilityMenu}`;
                                    // before: false, setParam: false, after: false
                                    if ((checkFri.before) && (!checkFri.setParam)) {
                                        friabMenu = "Friability"
                                    }


                                    obj[friabMenu] = {
                                        'nominal': arrProductDetail[0][0].Param8_Nom,
                                        'T1Neg': arrProductDetail[0][0].Param8_T1Neg,
                                        'T1Pos': arrProductDetail[0][0].Param8_T1Pos,

                                        'LimitOn': arrProductDetail[0][0].Param8_LimitOn,
                                        'dp': arrProductDetail[0][0].Param8_Dp,
                                        'isonstd': arrProductDetail[0][0].Param8_IsOnStd,
                                        'noOfSamples': objSamples.Group,
                                        'NMT': arrProductDetail[0][0].Param8_NMTTab,
                                        'ProductType': intProductType,
                                        'unit': unit
                                    }
                                }
                            }


                        }
                        break;
                    case 'Param8_Upp': // for % fine and from tab_gran
                        if (parseFloat(arrProductDetail[0][0][data]) > 0 && parseFloat(arrProductDetail[0][0][data]) != 99999) {
                            // check for product type and check LOD is set 
                            if ((intProductType == 1 || intProductType == 2) && cubicObj.cubicalData.Sys_BalID != 'None' && strInstrument == 'Balance'
                                // && (CubicInfo.Sys_Area == 'Effervescent Granulation' || CubicInfo.Sys_Area == 'Granulation')
                            ) {
                                let unit = await this.getBalanceUnit(cubicObj.cubicalData.Sys_BalID);
                                obj[GLOBAL_NOMENCLATURE.PercentageFine] = {
                                    'nominal': arrProductDetail[0][0].Param8_Nom,
                                    'T1Neg': arrProductDetail[0][0].Param8_Low,
                                    'T1Pos': arrProductDetail[0][0].Param8_Upp,
                                    'LimitOn': 1,
                                    'dp': arrProductDetail[0][0].Param8_Dp,
                                    'isonstd': 1,
                                    'noOfSamples': 2, //In % Fine we cant edit sample 
                                    'ProductType': intProductType,
                                    'unit': unit
                                }
                            }
                        }
                        break;
                    case 'Param9_Upp': // for particalsizing and from tab_gran
                        if (parseFloat(arrProductDetail[0][0][data]) > 0 && parseFloat(arrProductDetail[0][0][data]) != 99999) {
                            // check for product type and check LOD is set 
                            if ((intProductType == 1 || intProductType == 2) && cubicObj.cubicalData.Sys_BalID != 'None' && strInstrument == 'Balance'
                                // && (CubicInfo.Sys_Area == 'Effervescent Granulation' || CubicInfo.Sys_Area == 'Granulation')
                            ) {
                                let unit = await this.getBalanceUnit(cubicObj.cubicalData.Sys_BalID);
                                obj[GLOBAL_NOMENCLATURE.ParticalSizing] = {
                                    'nominal': arrProductDetail[0][0].Param9_Nom,
                                    'T1Neg': arrProductDetail[0][0].Param9_Low,
                                    'T1Pos': arrProductDetail[0][0].Param9_Upp,
                                    'LimitOn': 1,
                                    'dp': arrProductDetail[0][0].Param9_DP,
                                    'isonstd': 1,
                                    'noOfSamples': 7,
                                    'ProductType': intProductType,
                                    'unit': unit
                                }
                            }
                        }
                    default:
                        if (objCalibratedBalIPC.length > 0 && cubicObj.cubicalData.Sys_BinBalID != 'None') {
                            obj['IPCWC'] = {
                            }


                        }
                }

                if (Object.keys(obj).length != 0 && obj.constructor === Object) {
                    return obj;
                };
            }))
            let removeUndefinedFromArray = MenuAccordingToParamsSet.filter(v => v != undefined);
            return removeUndefinedFromArray;
        } catch (error) {
            throw new Error(error)
        }
    }

    async getBalanceUnit(BalId) {
        try {
            let selctBalanceDetail = await models.tbl_balance.findAll({
                where:
                {
                    Bal_ID: BalId
                }
            })
            let arrProductSample = [selctBalanceDetail];
            return arrProductSample[0][0].Bal_Unit;

        } catch (error) {
            throw new Error(error);
        }
    }

    async getVerinerUnit(VerId) {
        try {
            let selctVernierDetail = await models.tbl_vernier.findAll({
                where: {
                    VernierID: VerId
                }

            })
            let arrProductSample = [selctVernierDetail];
            return arrProductSample[0][0].RangeUnit;

        } catch (error) {
            throw new Error(error);
        }

    }

    async bulkDataMenuMaking(values, currentIdsNo) {
        try {
            let strInstrument = values.instrument;
            let strHmi = values.Hmi;
            let strIdsNo = values.idsNo;
            let intPortNo = values.PortNo;
            let arrProductDetail = values.ProductDetail;
            let objSamples = values.Samples;
            let intProductType = values.prdType;
            const cubicObj = globalData.arrIdsInfo.find(k => k.Hmi == strHmi);
            let strHardnessModel;
            let arrHardnessColumn = [];
            let arrHardnessColumnDetail = [];
            let objThickness = {};
            let objBreadth = {};
            let objDiameter = {};
            let objHardness = {};

            let MenuAccordingToParamsSet = await Promise.all(Object.keys(arrProductDetail[0][0]).map(async (data) => {
                let obj = {}
                let objCalibratedBal = globalData.glbArrListOfCalibratedBal.find(k => k.Hmi == strHmi);
                switch (data) {
                    case 'Param6_T1Neg': //DT
                        if (parseFloat(arrProductDetail[0][0][data]) > 0 && parseFloat(arrProductDetail[0][0][data]) != 99999) {

                            if ((intProductType == 1 || intProductType == 2) &&
                                cubicObj.cubicalData.Sys_DTID != "None" &&
                                strInstrument == "DT") {
                                obj['DT'] = {
                                    'nominal': arrProductDetail[0][0].Param6_Nom,
                                    'T1Neg': arrProductDetail[0][0].Param6_T1Neg,
                                    'T1Pos': arrProductDetail[0][0].Param6_T1Pos,
                                    'T2Neg': arrProductDetail[0][0].Param6_T2Neg,
                                    'T2Pos': arrProductDetail[0][0].Param6_T2Pos,
                                    'LimitOn': arrProductDetail[0][0].Param6_LimitOn,
                                    'dp': arrProductDetail[0][0].Param6_Dp,
                                    'isonstd': arrProductDetail[0][0].Param6_IsOnStd,
                                    'noOfSamples': objSamples.Individual,
                                    'NMT': arrProductDetail[0][0].Param6_NMTTab,
                                    'ProductType': intProductType,
                                    'unit': 'mm'
                                }
                            }
                        }
                        break;
                    case 'Param7_Nom': // hardness 
                        if (parseFloat(arrProductDetail[0][0][data]) > 0 && parseFloat(arrProductDetail[0][0][data]) != 99999) {

                            if (cubicObj.cubicalData.Sys_HardID != "None" && (strInstrument == "Hardness" || strInstrument == "Tablet Tester") && intProductType == 1) {
                                obj[`${GLOBAL_NOMENCLATURE.HardnessMenu}`] = {
                                    'Hard_nominal': arrProductDetail[0][0].Param7_Nom,
                                    'Hard_T1Neg': arrProductDetail[0][0].Param7_T1Neg,
                                    'Hard_T1Pos': arrProductDetail[0][0].Param7_T1Pos,
                                    'Hard_T2Neg': arrProductDetail[0][0].Param7_T2Neg,
                                    'Hard_T2Pos': arrProductDetail[0][0].Param7_T2Pos,
                                    'Thick_nominal': arrProductDetail[0][0].Param3_Nom,
                                    'Thick_T1Neg': arrProductDetail[0][0].Param3_T1Neg,
                                    'Thick_T1Pos': arrProductDetail[0][0].Param3_T1Pos,
                                    'Thick_T2Neg': arrProductDetail[0][0].Param3_T2Neg,
                                    'Thick_T2Pos': arrProductDetail[0][0].Param3_T2Pos,
                                    'LimitOn': arrProductDetail[0][0].Param7_LimitOn,
                                    'dp': arrProductDetail[0][0].Param7_Dp,
                                    'isonstd': arrProductDetail[0][0].Param7_IsOnStd,
                                    'noOfSamples': objSamples.Hardness,
                                    // 'NMT': arrProductDetail[0][0].Param7_NMTTab,
                                    'ProductType': intProductType,
                                    'Hard_unit': arrProductDetail[0][0].Param7_Unit,
                                    'Thick_unit': 'mm'
                                }

                                strHardnessModel = await this.CheckHardnessModel(strIdsNo);
                                let strMt50Type = strHardnessModel.Eqp_HT_Type;
                                if (strHardnessModel.Eqp_Make == "Sotax MT50") {
                                    if (strMt50Type == 'HTOHL') {
                                        obj[`${GLOBAL_NOMENCLATURE.TabletTesterMenu}`]['column'] = ["Hardness"];
                                    } else if (strMt50Type == "HTALL") {
                                        objThickness = {
                                            Nom: arrProductDetail[0][0]['Param3_Nom'],
                                            T1Neg: arrProductDetail[0][0]['Param3_T1Neg'],
                                            T1Pos: arrProductDetail[0][0]['Param3_T1Pos'],
                                            T2Pos: arrProductDetail[0][0]['Param3_T2Pos'],
                                            T2Neg: arrProductDetail[0][0]['Param3_T2Neg'],
                                        }

                                        objBreadth = {
                                            Nom: arrProductDetail[0][0]['Param3_Nom'],
                                            T1Neg: arrProductDetail[0][0]['Param3_T1Neg'],
                                            T1Pos: arrProductDetail[0][0]['Param3_T1Pos'],
                                            T2Pos: arrProductDetail[0][0]['Param3_T2Pos'],
                                            T2Neg: arrProductDetail[0][0]['Param3_T2Neg'],

                                        };

                                        objDiameter = {
                                            Nom: arrProductDetail[0][0]['Param3_Nom'],
                                            T1Neg: arrProductDetail[0][0]['Param3_T1Neg'],
                                            T1Pos: arrProductDetail[0][0]['Param3_T1Pos'],
                                            T2Pos: arrProductDetail[0][0]['Param3_T2Pos'],
                                            T2Neg: arrProductDetail[0][0]['Param3_T2Neg'],

                                        };

                                        objHardness = {

                                            Nom: arrProductDetail[0][0]['Param3_Nom'],
                                            T1Neg: arrProductDetail[0][0]['Param3_T1Neg'],
                                            T1Pos: arrProductDetail[0][0]['Param3_T1Pos']
                                        };


                                        arrProductDetail[0][0]['Param3_Nom'] == (99999 && 0) ? 0 : arrHardnessColumn.push("Thickness");
                                        arrProductDetail[0][0]['Param4_Nom'] == (99999 && 0) ? 0 : arrHardnessColumn.push("Breadth");
                                        arrProductDetail[0][0]['Param6_Nom'] == (99999 && 0) ? 0 : arrHardnessColumn.push("Diameter");
                                        arrProductDetail[0][0]['Param7_T1Pos'] == (99999 && 0) ? 0 : arrHardnessColumn.push("Hardness");

                                        //for column detail 
                                        arrProductDetail[0][0]['Param3_Nom'] == (99999 && 0) ? 0 : arrHardnessColumnDetail.push({ "Thickness": objThickness });
                                        arrProductDetail[0][0]['Param4_Nom'] == (99999 && 0) ? 0 : arrHardnessColumnDetail.push({ "Breadth": objBreadth });
                                        arrProductDetail[0][0]['Param6_Nom'] == (99999 && 0) ? 0 : arrHardnessColumnDetail.push({ "Diameter": objDiameter });
                                        arrProductDetail[0][0]['Param7_T1Pos'] == (99999 && 0) ? 0 : arrHardnessColumnDetail.push({ "Hardness": objHardness });

                                        obj[`${GLOBAL_NOMENCLATURE.HardnessMenu}`].column = arrHardnessColumn;
                                        obj[`${GLOBAL_NOMENCLATURE.HardnessMenu}`].columnDetail = arrHardnessColumnDetail;
                                    }
                                }
                                if (strHardnessModel.Eqp_Make == "Sotax ST50") {
                                    objThickness = {
                                        Nom: arrProductDetail[0][0]['Param3_Nom'],
                                        T1Neg: arrProductDetail[0][0]['Param3_T1Neg'],
                                        T1Pos: arrProductDetail[0][0]['Param3_T1Pos'],
                                        T2Pos: arrProductDetail[0][0]['Param3_T2Pos'],
                                        T2Neg: arrProductDetail[0][0]['Param3_T2Neg'],
                                    }

                                    objBreadth = {
                                        Nom: arrProductDetail[0][0]['Param3_Nom'],
                                        T1Neg: arrProductDetail[0][0]['Param3_T1Neg'],
                                        T1Pos: arrProductDetail[0][0]['Param3_T1Pos'],
                                        T2Pos: arrProductDetail[0][0]['Param3_T2Pos'],
                                        T2Neg: arrProductDetail[0][0]['Param3_T2Neg'],

                                    };

                                    objDiameter = {
                                        Nom: arrProductDetail[0][0]['Param3_Nom'],
                                        T1Neg: arrProductDetail[0][0]['Param3_T1Neg'],
                                        T1Pos: arrProductDetail[0][0]['Param3_T1Pos'],
                                        T2Pos: arrProductDetail[0][0]['Param3_T2Pos'],
                                        T2Neg: arrProductDetail[0][0]['Param3_T2Neg'],

                                    };

                                    objHardness = {

                                        Nom: arrProductDetail[0][0]['Param3_Nom'],
                                        T1Neg: arrProductDetail[0][0]['Param3_T1Neg'],
                                        T1Pos: arrProductDetail[0][0]['Param3_T1Pos']
                                    };

                                    arrProductDetail[0][0]['Param3_Nom'] == (99999 && 0) ? 0 : arrHardnessColumn.push("Thickness");
                                    arrProductDetail[0][0]['Param4_Nom'] == (99999 && 0) ? 0 : arrHardnessColumn.push("Breadth");
                                    arrProductDetail[0][0]['Param6_Nom'] == (99999 && 0) ? 0 : arrHardnessColumn.push("Diameter");
                                    arrProductDetail[0][0]['Param7_T1Pos'] == (99999 && 0) ? 0 : arrHardnessColumn.push("Hardness");

                                    //for column detail 
                                    arrProductDetail[0][0]['Param3_Nom'] == (99999 && 0) ? 0 : arrHardnessColumnDetail.push({ "Thickness": objThickness });
                                    arrProductDetail[0][0]['Param4_Nom'] == (99999 && 0) ? 0 : arrHardnessColumnDetail.push({ "Breadth": objBreadth });
                                    arrProductDetail[0][0]['Param6_Nom'] == (99999 && 0) ? 0 : arrHardnessColumnDetail.push({ "Diameter": objDiameter });
                                    arrProductDetail[0][0]['Param7_T1Pos'] == (99999 && 0) ? 0 : arrHardnessColumnDetail.push({ "Hardness": objHardness });
                                    obj[`${GLOBAL_NOMENCLATURE.HardnessMenu}`].column = arrHardnessColumn;
                                    obj[`${GLOBAL_NOMENCLATURE.HardnessMenu}`].columnDetail = arrHardnessColumnDetail;
                                }

                            }

                        }
                        break;
                    case 'Param8_Nom': // for Friability
                        if (parseFloat(arrProductDetail[0][0][data]) > 0 && parseFloat(arrProductDetail[0][0][data]) != 99999) {

                            if (cubicObj.cubicalData.Sys_FriabID != "None" && (strInstrument == "Friability" || strInstrument == "Friabilator")
                                && intProductType == 1 && cubicObj.cubicalData.Sys_CubType != 'Granulation' && serverConfig.friabilityType == "OF") {
                                obj[GLOBAL_NOMENCLATURE.FriabilatorMenu] = {
                                    'nominal': arrProductDetail[0][0].Param8_Nom,
                                    'T1Neg': arrProductDetail[0][0].Param8_T1Neg,
                                    'T1Pos': arrProductDetail[0][0].Param8_T1Pos,
                                    'LimitOn': arrProductDetail[0][0].Param8_LimitOn,
                                    'dp': arrProductDetail[0][0].Param8_Dp,
                                    'isonstd': arrProductDetail[0][0].Param8_IsOnStd,
                                    'noOfSamples': objSamples.Individual,
                                    'NMT': arrProductDetail[0][0].Param8_NMTTab,
                                    'ProductType': intProductType,
                                    'unit': 'g'
                                }
                            }
                        }
                        break;
                    case 'Param13_T1Neg':
                        if (parseFloat(arrProductDetail[0][0][data]) > 0 && parseFloat(arrProductDetail[0][0][data]) != 99999) {

                            if (intProductType == 1 && cubicObj.cubicalData.Sys_DTID != 'None' && (strInstrument == 'Disintegration Tester' || strInstrument == "DT")) {
                                obj[GLOBAL_NOMENCLATURE.DTMenu] = {
                                    'nominal': arrProductDetail[0][0].Param13_Nom,
                                    'T1Neg': arrProductDetail[0][0].Param13_T1Neg,
                                    'T1Pos': arrProductDetail[0][0].Param13_T1Pos,
                                    'LimitOn': arrProductDetail[0][0].Param13_LimitOn,
                                    'dp': arrProductDetail[0][0].Param13_DP,
                                    'isonstd': arrProductDetail[0][0].Param13_IsOnStd,
                                    'noOfSamples': undefined,
                                    'NMT': arrProductDetail[0][0].Param13_NMTTab,
                                    'ProductType': intProductType,
                                    'unit': ''
                                }
                            }
                        }
                        break;
                    case 'Param6_T1Neg':
                        if (parseFloat(arrProductDetail[0][0][data]) > 0 && parseFloat(arrProductDetail[0][0][data]) != 99999) {

                            if (intProductType == 2 && cubicObj.cubicalData.Sys_DTID != 'None' && (strInstrument == 'Disintegration Tester' || strInstrument == "DT")) {
                                obj[GLOBAL_NOMENCLATURE.DTMenu] = {
                                    'nominal': arrProductDetail[0][0].Param6_Nom,
                                    'T1Neg': arrProductDetail[0][0].Param6_T1Neg,
                                    'T1Pos': arrProductDetail[0][0].Param6_T1Pos,
                                    'LimitOn': arrProductDetail[0][0].Param6_LimitOn,
                                    'dp': arrProductDetail[0][0].Param6_DP,
                                    'isonstd': arrProductDetail[0][0].Param6_IsOnStd,
                                    'noOfSamples': undefined,
                                    'NMT': arrProductDetail[0][0].Param6_NMTTab,
                                    'ProductType': intProductType,
                                    'unit': ''
                                }
                            }
                        }
                        break;
                    case 'Param16_T1Pos':
                        if (parseFloat(arrProductDetail[0][0][data]) > 0 && parseFloat(arrProductDetail[0][0][data]) != 99999) {

                            if (intProductType == 1 && cubicObj.cubicalData.Sys_MoistID != 'None' && (strInstrument == 'Moisture Analyzer' || strInstrument == "LOD")) {
                                obj['LOD'] = {
                                    'nominal': arrProductDetail[0][0].Param16_Nom,
                                    'T1Neg': arrProductDetail[0][0].Param16_T1Neg,
                                    'T1Pos': arrProductDetail[0][0].Param16_T1Pos,
                                    'LimitOn': arrProductDetail[0][0].Param16_LimitOn,
                                    'dp': arrProductDetail[0][0].Param16_DP,
                                    'isonstd': arrProductDetail[0][0].Param16_IsOnStd,
                                    'noOfSamples': objSamples.Individual,
                                    'NMT': arrProductDetail[0][0].Param16_NMTTab,
                                    'ProductType': intProductType,
                                    'unit': ''
                                }
                            }
                        }
                        break;
                    case 'Param15_T1Neg':
                        if (parseFloat(arrProductDetail[0][0][data]) > 0 && parseFloat(arrProductDetail[0][0][data]) != 99999) {
                            if (intProductType == 1 && cubicObj.cubicalData.Sys_TapDensityID != 'None' && (strInstrument == 'TDT' || strInstrument == "Tapped Density")
                                && cubicObj.cubicalData.Sys_CubType != 'Granulation' && cubicObj.cubicalData.Sys_Area != 'Granulation') {
                                obj['Tapped_Density'] = {
                                    'nominal': arrProductDetail[0][0].Param15_Nom,
                                    'T1Neg': arrProductDetail[0][0].Param15_T1Neg,
                                    'T1Pos': arrProductDetail[0][0].Param15_T1Pos,
                                    'LimitOn': arrProductDetail[0][0].Param15_LimitOn,
                                    'dp': arrProductDetail[0][0].Param15_DP,
                                    'ProductType': intProductType,
                                    'unit': ''
                                }
                            }
                        }
                        break;
                    case 'Param7_Upp':  // for tab density and from tab_gran
                        if (parseFloat(arrProductDetail[0][0][data]) > 0 && parseFloat(arrProductDetail[0][0][data]) != 99999) {

                            if ((intProductType == 1 || intProductType == 2) &&
                                cubicObj.cubicalData.Sys_TapDensityID != 'None' &&
                                cubicObj.cubicalData.Sys_Area == 'Effervescent Granulation') {
                                obj[GLOBAL_NOMENCLATURE.TappedDensity] = {
                                    'nominal': arrProductDetail[0][0].Param7_Nom,
                                    'T1Neg': arrProductDetail[0][0].Param7_Low,
                                    'T1Pos': arrProductDetail[0][0].Param7_Upp,
                                    'LimitOn': 1,
                                    'dp': arrProductDetail[0][0].Param7_DP,
                                    'ProductType': intProductType,
                                    'isonstd': 1,
                                    'unit': ''
                                }
                            }
                        }
                        break;
                    case 'Param1_Upp':  // for lod and from tab_gran
                    case 'Param2_Upp':
                    case 'Param3_Upp':
                    case 'Param4_Upp':
                    case 'Param5_Upp':
                    case 'Param6_Upp':

                        if (parseFloat(arrProductDetail[0][0][data]) > 0 && parseFloat(arrProductDetail[0][0][data]) != 99999) {

                            if ((intProductType == 1 || intProductType == 2) &&
                                cubicObj.cubicalData.Sys_MoistID != 'None' && strInstrument == GLOBAL_NOMENCLATURE.MoistureAnalyzer
                            ) {
                                obj['LOD'] = {
                                    'nominal': arrProductDetail[0][0].Param1_Nom,
                                    'T1Neg': arrProductDetail[0][0].Param1_Low,
                                    'T1Pos': arrProductDetail[0][0].Param1_Upp,
                                    'LimitOn': 1,
                                    'dp': arrProductDetail[0][0].Param1_DP,
                                    'isonstd': 1,
                                    'noOfSamples': objSamples.Individual,
                                    'ProductType': intProductType,
                                    'isonstd': 1,
                                    'unit': ''
                                }
                            }
                        }
                        // break;
                        // for lod and from tab_gran
                        if (parseFloat(arrProductDetail[0][0][data]) > 0 && parseFloat(arrProductDetail[0][0][data]) != 99999) {

                            if ((intProductType == 1 || intProductType == 2) &&
                                cubicObj.cubicalData.Sys_MoistID != 'None' && strInstrument == 'LOD'
                            ) {
                                obj['GRNLUB'] = {
                                    'nominal': arrProductDetail[0][0].Param2_Nom,
                                    'T1Neg': arrProductDetail[0][0].Param2_Low,
                                    'T1Pos': arrProductDetail[0][0].Param2_Upp,
                                    'LimitOn': 1,
                                    'dp': arrProductDetail[0][0].Param2_DP,
                                    'isonstd': 1,
                                    'noOfSamples': objSamples.Individual,
                                    'ProductType': intProductType,
                                    'isonstd': 1,
                                    'unit': ''
                                }
                            }
                        }
                        // break;
                        // for lod and from tab_gran
                        if (parseFloat(arrProductDetail[0][0][data]) > 0 && parseFloat(arrProductDetail[0][0][data]) != 99999) {

                            if ((intProductType == 1 || intProductType == 2) &&
                                cubicObj.cubicalData.Sys_MoistID != 'None' && strInstrument == 'LOD'
                            ) {
                                obj['LAY1DRY'] = {
                                    'nominal': arrProductDetail[0][0].Param3_Nom,
                                    'T1Neg': arrProductDetail[0][0].Param3_Low,
                                    'T1Pos': arrProductDetail[0][0].Param3_Upp,
                                    'LimitOn': 1,
                                    'dp': arrProductDetail[0][0].Param3_DP,
                                    'isonstd': 1,
                                    'noOfSamples': objSamples.Individual,
                                    'ProductType': intProductType,
                                    'isonstd': 1,
                                    'unit': ''
                                }
                            }
                        }
                        // break;
                        // for lod and from tab_gran
                        if (parseFloat(arrProductDetail[0][0][data]) > 0 && parseFloat(arrProductDetail[0][0][data]) != 99999) {

                            if ((intProductType == 1 || intProductType == 2) &&
                                cubicObj.cubicalData.Sys_MoistID != 'None' && strInstrument == 'LOD'
                            ) {
                                obj['LAY1LUB'] = {
                                    'nominal': arrProductDetail[0][0].Param4_Nom,
                                    'T1Neg': arrProductDetail[0][0].Param4_Low,
                                    'T1Pos': arrProductDetail[0][0].Param4_Upp,
                                    'LimitOn': 1,
                                    'dp': arrProductDetail[0][0].Param4_DP,
                                    'isonstd': 1,
                                    'noOfSamples': objSamples.Individual,
                                    'ProductType': intProductType,
                                    'isonstd': 1,
                                    'unit': ''
                                }
                            }
                        }
                        // break;
                        // for lod and from tab_gran
                        if (parseFloat(arrProductDetail[0][0][data]) > 0 && parseFloat(arrProductDetail[0][0][data]) != 99999) {

                            if ((intProductType == 1 || intProductType == 2) &&
                                cubicObj.cubicalData.Sys_MoistID != 'None' && strInstrument == 'LOD'
                            ) {
                                obj['LAY2DRY'] = {
                                    'nominal': arrProductDetail[0][0].Param5_Nom,
                                    'T1Neg': arrProductDetail[0][0].Param5_Low,
                                    'T1Pos': arrProductDetail[0][0].Param5_Upp,
                                    'LimitOn': 1,
                                    'dp': arrProductDetail[0][0].Param5_DP,
                                    'isonstd': 1,
                                    'noOfSamples': objSamples.Individual,
                                    'ProductType': intProductType,
                                    'isonstd': 1,
                                    'unit': ''
                                }
                            }
                        }
                        // break;
                        // for lod and from tab_gran
                        if (parseFloat(arrProductDetail[0][0][data]) > 0 && parseFloat(arrProductDetail[0][0][data]) != 99999) {

                            if ((intProductType == 1 || intProductType == 2) &&
                                cubicObj.cubicalData.Sys_MoistID != 'None' && strInstrument == 'LOD'
                            ) {
                                obj['LAY2LUB'] = {
                                    'nominal': arrProductDetail[0][0].Param6_Nom,
                                    'T1Neg': arrProductDetail[0][0].Param6_Low,
                                    'T1Pos': arrProductDetail[0][0].Param6_Upp,
                                    'LimitOn': 1,
                                    'dp': arrProductDetail[0][0].Param6_DP,
                                    'isonstd': 1,
                                    'noOfSamples': objSamples.Individual,
                                    'ProductType': intProductType,
                                    'isonstd': 1,
                                    'unit': ''
                                }
                            }
                        }
                        break;
                }
                if (Object.keys(obj).length != 0 && obj.constructor === Object) {
                    return obj;
                };
            }))
            let removeUndefinedFromArray = MenuAccordingToParamsSet.filter(v => v != undefined);
            return removeUndefinedFromArray;
        } catch (error) {
            throw new Error(error);
        }
    }

    async onMenuStart(value) {
        try {
            let menuName = value.menuName;
            let resObj = {}
            let strInstrumentType, instrumentId, portNo, unit, Nomunit;
            let strHmi = value.Hmi;
            let objIdsNo = await objHmiModel.getResbPiNoFromHmi(strHmi);
            let strIdsNo = objIdsNo[0].Sys_IDSNo;
            let selectedIdsNo;

            var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.idsNo == strIdsNo);
            if (IPQCObject != undefined) {
                selectedIdsNo = IPQCObject.selectedIds;
            } else {
                selectedIdsNo = strIdsNo;
            }


            var obj = {
                Hmi: strHmi,
                idsNo: strIdsNo,
                menuType: menuName
            }

            if (menuName == "IPCWC") {
                //check coridor or with in and implement coridor logic futher. 

                var resBinList = await pendingIpcWeighment({ Hmi: strHmi, idsNo: strIdsNo })

                return resBinList

            } else {

                let prodtDetail1 = globalData.arr_limits.find(k => k.idsNo == strIdsNo); //not current idsno

                let CubicInfo = globalData.arrIdsInfo.find(k => k.idsNo == selectedIdsNo).cubicalData;
                // let CurrentCubicInfo = globalData.arrIdsInfo.find(k => k.idsNo == strIdsNo).cubicalData;


                let intRptType = CubicInfo.Sys_RptType;
                let sysArea = CubicInfo.Sys_Area;
                let productName = CubicInfo.Sys_ProductName;
                let StrBFGCode = CubicInfo.Sys_BFGCode;
                let StrBatch = CubicInfo.Sys_Batch;
                let ProductVersion = CubicInfo.Sys_PVersion;
                let Version = CubicInfo.Sys_Version;
                let StrRotaryType = CubicInfo.Sys_RotaryType;
                let obj1;
                let arr = [];
                let i = 1;

                (globalData.arrcalibType.findIndex((element) => element.Hmi === strHmi)) == -1 ?
                    globalData.arrcalibType : globalData.arrcalibType.splice(globalData.arrcalibType.findIndex((element) => element.Hmi === strHmi), 1);

                (globalData.arrCurrentOperationStatus.findIndex((element) => element.Hmi === strHmi)) == -1 ?
                    globalData.arrCurrentOperationStatus :
                    globalData.arrCurrentOperationStatus.splice(globalData.arrCurrentOperationStatus.findIndex((element) => element.Hmi === strHmi), 1);


                let arrBal = await objCommonOperation.getCubicalData(strHmi);
                let objdetails = arrBal[0];

                for (let obj in objdetails) {
                    if (objdetails[`Sys_Port${i}`] == undefined || objdetails[`Sys_Port${i}`] == "NULL" || objdetails[`Sys_Port${i}`] == "None" || objdetails[`Sys_Port${i}`] == null) {
                        i++;
                        continue;
                    }
                    else {
                        if (objdetails[`Sys_Port${i}`] == "Balance") {
                            arr.push(
                                { "BalanceId": objdetails['Sys_BalID'], "PortNo": i, Type: objdetails[`Sys_Port${i}`] }
                            )
                        } else if (objdetails[`Sys_Port${i}`] == "Vernier") {
                            arr.push(
                                { "VernierId": objdetails['Sys_VernierID'], "PortNo": i, Type: objdetails[`Sys_Port${i}`] }
                            )
                        } else if (objdetails[`Sys_Port${i}`] == "Hardness" || objdetails[`Sys_Port${i}`] == "TBTTST" || objdetails[`Sys_Port${i}`] == "Tablet Tester") {
                            arr.push(
                                { "HardnessId": objdetails['Sys_HardID'], "PortNo": i, Type: objdetails[`Sys_Port${i}`] }
                            )
                        }
                        else if (objdetails[`Sys_Port${i}`] == "Friabilator" || objdetails[`Sys_Port${i}`] == "Friability") {
                            arr.push(
                                { "FriabilityId": objdetails['Sys_FriabID'], "PortNo": i, Type: objdetails[`Sys_Port${i}`] }
                            )
                        }
                        else if (objdetails[`Sys_Port${i}`] == "Disintegration Tester" || objdetails[`Sys_Port${i}`] == "DT") {
                            arr.push(
                                { "DTId": objdetails['Sys_DTID'], "PortNo": i, Type: objdetails[`Sys_Port${i}`] }
                            )
                        }
                        else if (objdetails[`Sys_Port${i}`] == GLOBAL_NOMENCLATURE.MoistureAnalyzer) {
                            arr.push(
                                { "MoistureAnalyserId": objdetails['Sys_MoistID'], "PortNo": i, Type: objdetails[`Sys_Port${i}`] }
                            )
                        }
                        else if (objdetails[`Sys_Port${i}`] == "Tapped Density") {
                            arr.push(
                                { "TappedDensityId": objdetails['Sys_TapDensityID'], "PortNo": i, Type: objdetails[`Sys_Port${i}`] }
                            )
                        }
                        i++;
                    }
                }

                switch (menuName) {
                    case GLOBAL_NOMENCLATURE.IndividualMenu: {
                        menuName = GLOBAL_NOMENCLATURE.IndividualMenu;
                        strInstrumentType = GLOBAL_NOMENCLATURE.Balance;
                        instrumentId = arr.find(k => k.BalanceId).BalanceId;
                        portNo = arr.find(k => k.BalanceId).PortNo;

                    }
                        break;
                    case GLOBAL_NOMENCLATURE.IndLayerMenu: {
                        menuName = GLOBAL_NOMENCLATURE.IndLayerMenu;
                        strInstrumentType = GLOBAL_NOMENCLATURE.Balance;
                        instrumentId = arr.find(k => k.BalanceId).BalanceId;
                        portNo = arr.find(k => k.BalanceId).PortNo;

                    }
                        break;
                    case GLOBAL_NOMENCLATURE.IndLayer1Menu: {
                        menuName = GLOBAL_NOMENCLATURE.IndLayer1Menu;
                        strInstrumentType = GLOBAL_NOMENCLATURE.Balance;
                        instrumentId = arr.find(k => k.BalanceId).BalanceId;
                        portNo = arr.find(k => k.BalanceId).PortNo;

                    }
                        break;
                    case GLOBAL_NOMENCLATURE.GroupIndividual: {
                        menuName = GLOBAL_NOMENCLATURE.GroupIndividual;
                        strInstrumentType = GLOBAL_NOMENCLATURE.Balance;
                        instrumentId = arr.find(k => k.BalanceId).BalanceId;
                        portNo = arr.find(k => k.BalanceId).PortNo;

                    }
                        break;
                    case GLOBAL_NOMENCLATURE.GroupMenu: {
                        menuName = GLOBAL_NOMENCLATURE.GroupMenu;
                        strInstrumentType = GLOBAL_NOMENCLATURE.Balance;
                        instrumentId = arr.find(k => k.BalanceId).BalanceId;
                        portNo = arr.find(k => k.BalanceId).PortNo;

                    }
                        break;
                    case GLOBAL_NOMENCLATURE.GroupLayerMenu: {
                        menuName = GLOBAL_NOMENCLATURE.GroupLayerMenu;
                        strInstrumentType = GLOBAL_NOMENCLATURE.Balance;
                        instrumentId = arr.find(k => k.BalanceId).BalanceId;
                        portNo = arr.find(k => k.BalanceId).PortNo;

                    }
                        break;
                    case GLOBAL_NOMENCLATURE.GroupLayer1Menu: {
                        menuName = GLOBAL_NOMENCLATURE.GroupLayer1Menu;
                        strInstrumentType = GLOBAL_NOMENCLATURE.Balance;
                        instrumentId = arr.find(k => k.BalanceId).BalanceId;
                        portNo = arr.find(k => k.BalanceId).PortNo;

                    }
                        break;
                    case GLOBAL_NOMENCLATURE.ThicknessMenu: {
                        menuName = GLOBAL_NOMENCLATURE.ThicknessMenu;
                        strInstrumentType = GLOBAL_NOMENCLATURE.Vernier;
                        instrumentId = arr.find(k => k.VernierId).VernierId;
                        portNo = arr.find(k => k.VernierId).PortNo;

                    }
                        break;
                    case GLOBAL_NOMENCLATURE.DiameterMenu: {
                        menuName = GLOBAL_NOMENCLATURE.DiameterMenu;
                        strInstrumentType = GLOBAL_NOMENCLATURE.Vernier;
                        instrumentId = arr.find(k => k.VernierId).VernierId;
                        portNo = arr.find(k => k.VernierId).PortNo;

                    }
                        break;
                    case GLOBAL_NOMENCLATURE.BreadthMenu: {
                        menuName = GLOBAL_NOMENCLATURE.BreadthMenu;
                        strInstrumentType = GLOBAL_NOMENCLATURE.Vernier;
                        instrumentId = arr.find(k => k.VernierId).VernierId;
                        portNo = arr.find(k => k.VernierId).PortNo;

                    }
                        break;
                        case GLOBAL_NOMENCLATURE.MoistureAnalyzer:
                            case "LOD": {
                            menuName = menuName;
                            strInstrumentType = GLOBAL_NOMENCLATURE.MoistureAnalyzer;
                            instrumentId = arr.find(k => k.MoistureAnalyserId).MoistureAnalyserId;
                            portNo = arr.find(k => k.MoistureAnalyserId).PortNo;
                        }
                            break;
                    case GLOBAL_NOMENCLATURE.TabletTesterMenu:
                    case GLOBAL_NOMENCLATURE.HardnessMenu: {
                        // menuName = GLOBAL_NOMENCLATURE.TabletTester;
                        menuName = menuName;
                        strInstrumentType = GLOBAL_NOMENCLATURE.Hardness;
                        instrumentId = arr.find(k => k.HardnessId).HardnessId;
                        portNo = arr.find(k => k.HardnessId).PortNo;

                    }
                        break;
                    case GLOBAL_NOMENCLATURE.FriabilityMenu:
                    case GLOBAL_NOMENCLATURE.FriabilatorMenu: {
                        if (menuName == GLOBAL_NOMENCLATURE.FriabilatorMenu) {
                            menuName = GLOBAL_NOMENCLATURE.FriabilatorMenu;
                            strInstrumentType = GLOBAL_NOMENCLATURE.FriabilatorMenu;
                            portNo = arr.find(k => k.FriabilityId).PortNo;
                            instrumentId = arr.find(k => k.FriabilityId).FriabilityId;

                        } else {
                            menuName = GLOBAL_NOMENCLATURE.FriabilityMenu;
                            if (serverConfig.friabilityType == "OF") {
                                strInstrumentType = GLOBAL_NOMENCLATURE.Friability;
                                portNo = arr.find(k => k.FriabilityId).PortNo;
                                instrumentId = arr.find(k => k.FriabilityId).FriabilityId;
                            } else {
                                strInstrumentType = GLOBAL_NOMENCLATURE.Balance;
                                portNo = arr.find(k => k.BalanceId).PortNo;
                                // instrumentId = arr.find(k => k.FriabilityId).FriabilityId;
                                instrumentId = arr.find(k => k.BalanceId).BalanceId;
                            }
                        }



                    }
                        break;
                }
                const removeSelectMenuDetail = prodtDetail1.Menus.reduce((object, key) => {
                    if (Object.keys(key) == menuName) {

                        let b = Object.keys(key);
                        object[Object.keys(key)] = key[b];
                    }
                    return object;
                }, {});

                let productDetail = Object.values(removeSelectMenuDetail)[0];

                //storing menu stype globally
                let objSelMenu = globalData.arrSelectedMenu.find(k => k.idsNo == strIdsNo);
                if (objSelMenu == undefined) {
                    globalData.arrSelectedMenu.push({
                        Hmi: strHmi,
                        idsNo: strIdsNo,
                        menuName: menuName,
                        selectedProductDetail: productDetail,
                        instrumentId: instrumentId,
                        InstrumentType: strInstrumentType,
                        portNo: portNo
                    })
                } else {
                    objSelMenu.idsNo = strIdsNo;
                    objSelMenu.Hmi = strHmi;
                    objSelMenu.menuName = menuName;
                    objSelMenu.selectedProductDetail = productDetail;
                    objSelMenu.instrumentId = instrumentId;
                    objSelMenu.InstrumentType = strInstrumentType;
                    objSelMenu.portNo = portNo;
                }
                objSelMenu = globalData.arrSelectedMenu.find(k => k.idsNo == strIdsNo);
                let T1_Pos_ActualValue, T1_Neg_ActualValue, T2_Pos_ActualValue, T2_Neg_ActualValue;

                /**
                 * getting uppper and lower value.
                 */
                var dp;
                if (productDetail.unit == "mg") {
                    dp = 1
                } else if (productDetail.unit == "gm") {
                    dp = 3
                } else if (productDetail.unit == undefined) {
                    dp = 2
                }

                if (menuName != "Disintegration_Tester" && menuName != "TBTTST"
                    && menuName != "FRIABI" && menuName != "FRIAB"
                    && menuName != "Percentage Fine" && menuName != 'Particle Sizing' && menuName != 'GRPIND' && menuName != 'Tapped Density'
                ) {
                    T1_Pos_ActualValue = Number(objFormulaFun.upperLimit(objSelMenu.selectedProductDetail, "T1"))
                        .toFixed(dp).concat(` ${productDetail.unit == undefined ? productDetail.Thick_unit : productDetail.unit}`);

                    T1_Neg_ActualValue = Number(objFormulaFun.lowerLimit(objSelMenu.selectedProductDetail, "T1"))
                        .toFixed(dp).concat(` ${productDetail.unit == undefined ? productDetail.Thick_unit : productDetail.unit}`);

                    T2_Pos_ActualValue = Number(objFormulaFun.upperLimit(objSelMenu.selectedProductDetail, "T2"))
                        .toFixed(dp).concat(` ${productDetail.unit == undefined ? productDetail.Thick_unit : productDetail.unit}`);

                    T2_Neg_ActualValue = Number(objFormulaFun.lowerLimit(objSelMenu.selectedProductDetail, "T2"))
                        .toFixed(dp).concat(` ${productDetail.unit == undefined ? productDetail.Thick_unit : productDetail.unit}`);
                }
                if (menuName == GLOBAL_NOMENCLATURE.HardnessMenu) {
                    var hardnessthickness = await this.calculateHardThick(productDetail)
                }

                /**
                 * check Rotary and make 
                 */
                /*
                add editableSide : true/false based on double rotary
                add editableSampleNo: true/false
                Side :
                */
                //static configuration
                let editableSide = true;
                let editableSampleNo = true;

                if (!(menuName.replace(/\_/g, " ") == GLOBAL_NOMENCLATURE.DTMenu)) {
                    var side = StrRotaryType == "Double" ? ['LHS', 'RHS'] : "NA";
                    if (menuName.replace(/\_/g, " ") == GLOBAL_NOMENCLATURE.GroupMenu && StrRotaryType == "Double") {

                        var side = StrRotaryType == "Double" ? 'LHS & RHS' : "NA";

                        let resultCompleteData = await models.tbl_tab_master2.findAll({
                            attributes:[
                                    [sequelize.fn("max", sequelize.col("RepSerNo")), "RepSerNo"],
                                ],
                            
                            where: {
                                'BFGCode': CubicInfo.Sys_BFGCode,
                                'ProductName': CubicInfo.Sys_ProductName,
                                'PVersion': CubicInfo.Sys_PVersion,
                                'Version': CubicInfo.Sys_Version,
                                'BatchNo': CubicInfo.Sys_Batch,
                                'CubicleType': CubicInfo.Sys_CubType,
                                'ReportType': CubicInfo.Sys_RptType,
                                'Side': side
                            }
                        });
                        if (resultCompleteData.length != 0) {
                            let RepSerno = resultCompleteData[0].RepSerNo;

                            let tabDetails = await models.tbl_tab_detail2.findAll({
                                where: {
                                    RepSerNo: RepSerno,
                                },
                            });

                            if (tabDetails.length != 0) {
                                var det = tabDetails.length - 1;
                                det = tabDetails[det];
                                if (det.Side == 'LHS') {
                                    side = 'RHS'
                                } else {
                                    side = 'LHS'
                                }
                            } else {
                                side = 'LHS'
                            }
                        } else {
                            side = 'LHS'
                        }
                    }

                }

                if (menuName != (GLOBAL_NOMENCLATURE.HardnessMenu)) {
                    obj1 = {
                        "menuName": menuName.replace(/\_/g, " "),
                        "noOfSample": productDetail.noOfSamples == undefined ? undefined : productDetail.noOfSamples.toString(),
                        "Rotary": StrRotaryType,
                        "ProductId": StrBFGCode,
                        "ProductName": productName,
                        "ProductVersion": ProductVersion,
                        "Version": Version,
                        "Batch": StrBatch,
                        "Nominal": productDetail.nominal == null ? null : productDetail.nominal.toString().includes(':') ? productDetail.nominal : Number(productDetail.nominal).toFixed(productDetail.dp).concat(` ${productDetail.unit}`),
                        "Dp": productDetail.dp,
                        "T1Neg": T1_Neg_ActualValue != undefined ? T1_Neg_ActualValue.trim() : Number(productDetail.T1Neg).toFixed(productDetail.dp).concat(` ${productDetail.unit}`).trim(),
                        "T1Pos": T1_Pos_ActualValue != undefined ? T1_Pos_ActualValue.trim() : Number(productDetail.T1Pos).toFixed(productDetail.dp).concat(` ${productDetail.unit}`).trim(),
                        "T2Neg": T2_Neg_ActualValue != undefined ? T2_Neg_ActualValue.trim() : productDetail.T2Neg == undefined ? undefined : Number(productDetail.T2Neg).toFixed(productDetail.dp).concat(` ${productDetail.unit}`).trim(),
                        "T2Pos": T2_Pos_ActualValue != undefined ? T2_Pos_ActualValue.trim() : productDetail.T2Pos == undefined ? undefined : Number(productDetail.T2Pos).toFixed(productDetail.dp).concat(` ${productDetail.unit}`).trim(),
                        "AirVibrationLimit": "0.014"
                    };
                }
                if (menuName == (GLOBAL_NOMENCLATURE.HardnessMenu)) {
                    obj1 = {
                        "menuName": menuName.replace(/\_/g, " "),
                        "noOfSample": productDetail.noOfSamples == undefined ? undefined : productDetail.noOfSamples.toString(),
                        "Rotary": StrRotaryType,
                        "ProductId": StrBFGCode,
                        "ProductName": productName,
                        "ProductVersion": ProductVersion,
                        "Version": Version,
                        "Batch": StrBatch,
                        "Hard_Nominal": productDetail.Hard_nominal == null ? null : productDetail.Hard_nominal.toString().includes(':') ? productDetail.Hard_nominal : Number(productDetail.Hard_nominal).toFixed(productDetail.dp).concat(` ${productDetail.Hard_unit}`),
                        "Thick_Nominal": productDetail.Thick_nominal == null ? null : productDetail.Thick_nominal.toString().includes(':') ? productDetail.Thick_nominal : Number(productDetail.Thick_nominal).toFixed(productDetail.dp).concat(` ${productDetail.Thick_unit}`),
                        "Dp": productDetail.dp,
                        "Hard_T1Neg": hardnessthickness.T1_Neg_ActualValuehard != undefined ? hardnessthickness.T1_Neg_ActualValuehard : 0,
                        "Hard_T1Pos": hardnessthickness.T1_Pos_ActualValuehard != undefined ? hardnessthickness.T1_Pos_ActualValuehard : 0,
                        "Hard_T2Neg": hardnessthickness.T2_Neg_ActualValuehard != undefined ? hardnessthickness.T2_Neg_ActualValuehard : 0,
                        "Hard_T2Pos": hardnessthickness.T2_Pos_ActualValuehard != undefined ? hardnessthickness.T2_Pos_ActualValuehard : 0,
                        "Thick_T1Neg(mm)": T1_Neg_ActualValue != undefined ? T1_Neg_ActualValue.trim() : 0,
                        "Thick_T1Pos(mm)": T1_Pos_ActualValue != undefined ? T1_Pos_ActualValue.trim() : 0,
                        "Thick_T2Neg(mm)": T2_Neg_ActualValue != undefined ? T2_Neg_ActualValue.trim() : 0,
                        "Thick_T2Pos(mm)": T2_Pos_ActualValue != undefined ? T2_Pos_ActualValue.trim() : 0,
                        "AirVibrationLimit": "0.014"
                    };
                }

                if ((menuName.replace(/\_/g, " ") == (GLOBAL_NOMENCLATURE.TabletTesterMenu || GLOBAL_NOMENCLATURE.HardnessMenu))) {
                    const HardnessType = await this.getDetailOfBulkInstrumentModel(instrumentId);
                    obj1['type'] = HardnessType.Eqp_HT_Type;
                }

                if ((menuName.replace(/\_/g, " ") == GLOBAL_NOMENCLATURE.FriabilityMenu &&
                    (serverConfig.friabilityType == 'OB' || serverConfig.friabilityType == 'BFBO' ||
                        serverConfig.friabilityType == 'BFBT'))) {
                    obj1['type'] = serverConfig.friabilityType;
                    let retuRes = await this.checkFriabilityStatus(strIdsNo);
                    var respSerNo = retuRes.sqNo;
                    var selectObj = await models.tbl_tab_friability.findAll({
                        where: {
                            RepSerNo: respSerNo
                        }
                    })
                    // {
                    //     str_tableName: 'tbl_tab_friability',
                    //     data: '*',
                    //     condition: [
                    //         { str_colName: 'RepSerNo', value: respSerNo },
                    //     ]
                    // }
                    let friabilityInfo = [selectObj];
                    //console.log(retuRes);
                    if (serverConfig.friabilityType == 'BFBT' || serverConfig.friabilityType == 'BFBO' || serverConfig.friabilityType == 'OB') {
                        if (StrRotaryType == "Double") {
                            if (retuRes.status == 'after') {
                                obj1['Before_Drum1'] = friabilityInfo[0][0].LWtBeforeTest;
                                obj1['Before_Drum2'] = friabilityInfo[0][0].RWtBeforeTest;
                            }

                            //send before wt of D1 & D2 from db
                        } else {
                            if (retuRes.status == 'after') {
                                obj1['Before_Drum1'] = friabilityInfo[0][0].NWtBeforeTest;
                            }
                            //here we will send only be before wt of D1 
                        }
                    }

                }

                if ((menuName.replace(/\_/g, " ") == GLOBAL_NOMENCLATURE.FriabilatorMenu)

                ) {
                    obj1['type'] = serverConfig.friabilityType;

                    let unit = obj1.T1Pos.split(' ')[1]
                    obj1.SetRpm = obj1.T1Pos.replace(` ${unit}`, '')
                    obj1.SetCount = obj1.T1Neg.replace(` ${unit}`, '')
                    obj1.NMT = obj1.Nominal.replace(` ${unit}`, ' %')
                    delete obj1.Nominal;
                    delete obj1.T1Neg;
                    delete obj1.T1Pos;
                    delete obj1.T2Neg;
                    delete obj1.T2Pos;
                }
                if ((menuName.replace(/\_/g, " ") == GLOBAL_NOMENCLATURE.FriabilityMenu)
                ) {

                    obj1["SetRpm"] = obj1.T1Pos.split(" ")[0]
                    obj1["SetCount"] = obj1.T1Neg.split(" ")[0]
                    obj1.NMT = obj1.Nominal.replace(` ${unit}`, ' %')
                    delete obj1.Nominal;
                    delete obj1.T1Neg;
                    delete obj1.T1Pos;
                    delete obj1.T2Neg;
                    delete obj1.T2Pos;
                }



                if ((menuName.replace(/\_/g, " ") == (GLOBAL_NOMENCLATURE.TabletTesterMenu || GLOBAL_NOMENCLATURE.HardnessMenu))) {
                    obj1['column'] = productDetail.column;
                    obj1['columnDetail'] = productDetail.columnDetail;
                }

                if (!(menuName.replace(/\_/g, " ") == GLOBAL_NOMENCLATURE.DTMenu)) {
                    obj1['editableSide'] = editableSide;
                    obj1['editableSampleNo'] = editableSampleNo;
                    obj1['Side'] = StrRotaryType == "Single" ? "NA" : side;

                }
                if ((menuName.replace(/\_/g, " ") == GLOBAL_NOMENCLATURE.DTMenu)) {
                    obj1['editableSide'] = false;
                    obj1['editableSampleNo'] = false;
                    obj1['Side'] = StrRotaryType == "Double" ? "NA" : modelDetails;

                }
                if ((menuName.replace(/\_/g, " ") == GLOBAL_NOMENCLATURE.Differential)) {
                    obj1['column'] = productDetail.column;;
                    obj1['columnDetail'] = productDetail.columnDetail;

                }
                //check for incomplete report remark
                let reportPendingStatus = await objPreCheck.checkReportRemarkPending(strIdsNo)
                if (reportPendingStatus != false) {
                    return Object.assign(resObj, {
                        status: "fail",
                        message: `Incomplete Report Remark is Pending for Test ${reportPendingStatus.menuName}.Unable to Continue operation`
                    })
                } else {
                    return Object.assign(resObj, {
                        status: "success",
                        result: obj1
                    })
                }
            }
        } catch (error) {
            throw new Error(error)
        }
    }

    /**
     * @description:function will give jars or basket according to model
     * 
     */
    async getDetailOfBulkInstrumentModel(instrumentId) {
        try {
            const obj = await models.tbl_otherequipment.findAll({
                where: {
                    Eqp_ID: instrumentId
                }
            })
            let res = [obj];
            if (res[0].length <= 0) {
                return undefined
            }
            return res[0][0];
        } catch (error) {
            throw new Error(error)
        }
    }

    async checkFriabilityStatus(IdsNo) {
        var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.idsNo == IdsNo);
        var selectedIds;
        var returnResult = {};
        if (IPQCObject != undefined) {
            selectedIds = IPQCObject.selectedIds;
        } else {
            selectedIds = IdsNo;
        }
        var tempCubic = globalData.arrIdsInfo.find(k => k.idsNo == selectedIds).cubicalData;
        const checkData = await models.tbl_tab_friability.findAll({
            attributes: [[sequelize.fn('max', sequelize.col('RepSerNo')), 'SeqNo']],
            where: {
                BFGCode: tempCubic.Sys_BFGCode,
                ProductName: tempCubic.Sys_ProductName,
                PVersion: tempCubic.Sys_PVersion,
                Version: tempCubic.Sys_Version,
                BatchNo: tempCubic.Sys_Batch,
                IdsNo: selectedIds,
            }
        })
        // {
        //     str_tableName: 'tbl_tab_friability',
        //     data: 'MAX(RepSerNo) AS SeqNo',
        //     condition: [
        //         { str_colName: 'BFGCode', value: tempCubic.Sys_BFGCode, comp: 'eq' },
        //         { str_colName: 'ProductName', value: tempCubic.Sys_ProductName, comp: 'eq' },
        //         { str_colName: 'PVersion', value: tempCubic.Sys_PVersion, comp: 'eq' },
        //         { str_colName: 'Version', value: tempCubic.Sys_Version, comp: 'eq' },
        //         { str_colName: 'BatchNo', value: tempCubic.Sys_Batch, comp: 'eq' },
        //         { str_colName: 'IdsNo', value: selectedIds, comp: 'eq' },
        //     ]
        // }
        var checkFlag = 0;
        var chkResult = [checkData];
        var result = [];
        if (chkResult[0][0].SeqNo == null) {
            checkFlag = 0;
        } else {
            checkFlag = 1;
        }
        if (checkFlag == 1) {
            var fraibData = await models.tbl_tab_friability.findAll({
                where: {
                    RepSerNo: chkResult[0][0].SeqNo
                }
            })
            //  {
            //     str_tableName: 'tbl_tab_friability',
            //     data: '*',
            //     condition: [
            //         { str_colName: 'RepSerNo', value: chkResult[0][0].SeqNo, comp: 'eq' },
            //     ]
            // }
            result = [fraibData];
            result = result[0]
        }
        if (result.length > 0) {
            if (tempCubic.Sys_RotaryType == 'Double') {
                if (result[0].LWtBeforeTest != 0 && result[0].LWtAfterTest != 0
                    && result[0].RWtBeforeTest != 0 && result[0].RWtAfterTest != 0) {
                    Object.assign(returnResult, { status: 'before', sqNo: result[0].RepSerNo })

                } else if (result[0].LWtBeforeTest != 0 && result[0].LWtAfterTest == 0
                    && result[0].RWtBeforeTest == 0 && result[0].RWtAfterTest == 0) {
                    Object.assign(returnResult, { status: 'before', sqNo: result[0].RepSerNo })

                } else if (result[0].LWtBeforeTest != 0 && result[0].LWtAfterTest != 0
                    && result[0].RWtBeforeTest != 0 && result[0].RWtAfterTest == 0) {
                    Object.assign(returnResult, { status: 'after', sqNo: result[0].RepSerNo })

                }
                else if (result[0].LWtBeforeTest != 0 && result[0].LWtAfterTest == 0
                    && result[0].RWtBeforeTest != 0 && result[0].RWtAfterTest == 0) {
                    Object.assign(returnResult, { status: 'after', sqNo: result[0].RepSerNo })


                } else if (result[0].LWtBeforeTest == 0 && result[0].LWtAfterTest == 0
                    && result[0].RWtBeforeTest == 0 && result[0].RWtAfterTest == 0) {
                    Object.assign(returnResult, { status: 'before', sqNo: result[0].RepSerNo })

                }
            } else {
                if (result[0].NWtBeforeTest != 0 && result[0].NWtAfterTest != 0) {
                    Object.assign(returnResult, { status: 'before', sqNo: result[0].RepSerNo })

                } else if (result[0].NWtBeforeTest != 0 && result[0].NWtAfterTest == 0) {
                    Object.assign(returnResult, { status: 'after', sqNo: result[0].RepSerNo })

                } else if (result[0].NWtBeforeTest == 0 && result[0].NWtAfterTest == 0) {
                    Object.assign(returnResult, { status: 'before', sqNo: result[0].RepSerNo })

                }
            }
        } else {
            Object.assign(returnResult, { status: 'before', sqNo: 0 })

        }
        return returnResult;
    }

    DateFormat(date, time) {
        var days = date.getDate();
        var year = date.getFullYear();
        var month = (date.getMonth() + 1);

        // minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = month + '/' + days + '/' + year + ' ' + time;
        //var strTime = hours + ':' + minutes;
        return strTime;
    }
    async CheckHardnessModel(idsNo) {
        try {
            var cubicInfo = globalData.arrIdsInfo.find(k => k.idsNo == idsNo).cubicalData;
            var hardnessId = cubicInfo.Sys_HardID;
            var selectOtherEquip = await models.tbl_otherequipment.findAll({
                where: {
                    Eqp_ID: hardnessId
                }
            })
            var result = [selectOtherEquip];
            return result[0][0];
        } catch (error) {
            throw new Error(error);
        }
    }

    async lockedWeighingStatus(cubicalNo, BatchNo, CubType) {
        try {
            await models.tbl_system_weighingstatus.update({
                Status: 1,
                BatchNo: BatchNo,
                CubType: CubType
            }, {
                where: {
                    CubicleNo: cubicalNo

                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    async calculateHardThick(data) {
        var objSelMenu = data


        if (data.Hard_nominal != 0) {

            var T1_Pos_ActualValuehard = Number(objFormulaFun.HardnessupperLimit(objSelMenu, "T1"))
                .toFixed(objSelMenu.dp).concat(` ${objSelMenu.Hard_unit}`);

            var T1_Neg_ActualValuehard = Number(objFormulaFun.HardnesslowerLimit(objSelMenu, "T1"))
                .toFixed(objSelMenu.dp).concat(` ${objSelMenu.Hard_unit}`);

            var T2_Pos_ActualValuehard = Number(objFormulaFun.HardnessupperLimit(objSelMenu, "T2"))
                .toFixed(objSelMenu.dp).concat(` ${objSelMenu.Hard_unit}`);

            var T2_Neg_ActualValuehard = Number(objFormulaFun.HardnesslowerLimit(objSelMenu, "T2"))
                .toFixed(objSelMenu.dp).concat(` ${objSelMenu.Hard_unit}`);
            var obj = {
                T1_Pos_ActualValuehard: T1_Pos_ActualValuehard,
                T1_Neg_ActualValuehard: T1_Neg_ActualValuehard,
                T2_Pos_ActualValuehard: T2_Pos_ActualValuehard,
                T2_Neg_ActualValuehard: T2_Neg_ActualValuehard
            }

            return obj
        }
        // if(data.Thick_nominal != 0){
        //     T1_Pos_ActualValue = Number(objFormulaFun.upperLimit(objSelMenu.selectedProductDetail, "T1"))
        //     .toFixed(dp).concat(` ${productDetail.unit == undefined ? productDetail.Thick_unit : productDetail.unit}`);

        // T1_Neg_ActualValue = Number(objFormulaFun.lowerLimit(objSelMenu.selectedProductDetail, "T1"))
        //     .toFixed(dp).concat(` ${productDetail.unit == undefined ? productDetail.Thick_unit : productDetail.unit}`);

        // T2_Pos_ActualValue = Number(objFormulaFun.upperLimit(objSelMenu.selectedProductDetail, "T2"))
        //     .toFixed(dp).concat(` ${productDetail.unit == undefined ? productDetail.Thick_unit : productDetail.unit}`);

        // T2_Neg_ActualValue = Number(objFormulaFun.lowerLimit(objSelMenu.selectedProductDetail, "T2"))
        //     .toFixed(dp).concat(` ${productDetail.unit == undefined ? productDetail.Thick_unit : productDetail.unit}`);
        // }
    }
}

module.exports = Menu