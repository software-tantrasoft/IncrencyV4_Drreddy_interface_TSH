const date = require('date-and-time');
// const Database = require('../../database/clsQueryProcess');
// // const clsRemarkInComplete = require('../../model/clsRemarkIncomplete');
// const UtillDb =  require('../../Utills/db');
const models = require('../../../config/dbConnection').models;
const sequelize = require('../../../config/dbConnection').sequelize;
const { QueryTypes } = require('sequelize');

// const database = new Database();
let now = new Date();
// const objRemarkInComplete = new clsRemarkInComplete();

const globalData = require('../../global/globalData');


class GetMstSrNoAndSideSr {

    async getRegularSpaceMstSerialNo(tableName, ReportType, BFGCode, ProductName, PVersion, Version, BatchNo, Idsno) {
        try {
            const checkMasterData = await models.tableName.findAll({
                attributes: [[sequelize.fn('max', sequelize.col('RepSerNo')), 'RepSerNo']],
                where:{
                    BFGCode:BFGCode,
                    ProductName:ProductName,
                    PVersion:PVersion,
                    Version:Version,
                    BatchNo:BatchNo,
                    Idsno:Idsno,
                    ReportType:ReportType
                }
            }) 
            // {
            //     str_tableName: tableName,
            //     data: 'MAX(MstSerNo) AS MstSerNo',
            //     condition: [
            //         { str_colName: 'BFGCode', value: BFGCode, comp: 'eq' },
            //         { str_colName: 'ProductName', value: ProductName, comp: 'eq' },
            //         { str_colName: 'PVersion', value: PVersion, comp: 'eq' },
            //         { str_colName: 'Version', value: Version, comp: 'eq' },
            //         { str_colName: 'BatchNo', value: BatchNo, comp: 'eq' },
            //         { str_colName: 'Idsno', value: Idsno, comp: 'eq' },
            //         { str_colName: 'ReportType', value: ReportType, comp: 'eq' },
            //     ]
            // }

            var objcheckMasterData = [checkMasterData]
            if (objcheckMasterData[0][0].MstSerNo != null) {
                return objcheckMasterData[0][0].MstSerNo
            }
            else {
                return 1
            }
        }
        catch (error) {
            console.log('error in getRegularSpaceMstSerialNo=' + error)
            throw new Error(error);
        }

    }

    async getRegularSpaceSideNo(tableName, ReportType, BFGCode, ProductName, PVersion, Version, BatchNo, Idsno) {

        try {
            var sqlquery = `select Max(SideNo) as SideNo from ${tableName} where BFGCode='${BFGCode}'  and `
            sqlquery = sqlquery + `ProductName='${ProductName}' and PVersion='${PVersion}' and Version='${Version}' and `
            sqlquery = sqlquery + `BatchNo='${BatchNo}' and Idsno='${Idsno}' and ReportType='${ReportType}' and MstSerNo=(`
            sqlquery = sqlquery + `select Max(MstSerNo) from ${tableName} where BFGCode='${BFGCode}'  and `
            sqlquery = sqlquery + `ProductName='${ProductName}' and PVersion='${PVersion}' and Version='${Version}' and `
            sqlquery = sqlquery + `BatchNo='${BatchNo}' and Idsno='${Idsno}' and ReportType='${ReportType}')`


            console.log(sqlquery)

            var objcheckSideNO =await sequelize.query(sqlquery,{ type: QueryTypes.SELECT });
            if (objcheckSideNO[0][0].SideNo != null) {
                return objcheckSideNO[0][0].SideNo
            }
            else {
                return 0
            }
        }
        catch (error) {
            console.log('error in getRegularSpaceSideNo=' + error)
            throw new Error(error);
        }
    }

    async getRegularLRMstSerialNo(dataObj) {
        try { 
            let { tableName, ReportType, Side, BFGCode, ProductName, PVersion, Version, BatchNo, IdsNo } = dataObj
            var selectedIds;
            // here we are selecting IDS functionality for that cubicle 
            // var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.idsNo == Idsno);
            // if (IPQCObject != undefined) {
            //     selectedIds = IPQCObject.selectedIds
            // } else {
            //     selectedIds = Idsno; // for compression and coating
            // };
            var cubicalObj = globalData.arrIdsInfo.find(k => k.Hmi == IdsNo).cubicalData;

            //sunil 

            // let checkMasterData = await str.max('MstSerNo', {
            //     where: {
            //         BFGCode: BFGCode,
            //         ProductName: ProductName,
            //         PVersion: PVersion,
            //         Version: Version,
            //         BatchNo: BatchNo,
            //         //{ str_colName: 'Idsno: Idsno,
            //         ReportType: ReportType,
            //         Side: Side,
            //         Repolabel14: cubicalObj.Sys_IPQCType,//to check IPQC type
            //         CubicleType: cubicalObj.Sys_CubType,
            //     }
            // });



            // tableName = tableName.concat('_incomplete')
            let checkMasterData = await models[tableName].findAll({
                attributes: [[sequelize.fn('max', sequelize.col('RepSerNo')), 'RepSerNo']],
                where: {
                    BFGCode: BFGCode,
                    ProductName: ProductName,
                    PVersion: PVersion,
                    Version: Version,
                    BatchNo: BatchNo,
                    //{ str_colName: 'Idsno: Idsno,
                    ReportType: ReportType,
                    Side: Side,
                    // Repolabel14: cubicalObj.Sys_IPQCType,//to check IPQC type
                    CubicleType: cubicalObj.Sys_CubType,
                }

            })

            console.log([checkMasterData]);
            // const checkMasterData = {
            //     str_tableName: tableName,
            //     data: 'MAX(MstSerNo) AS MstSerNo',
            //     condition: [
            //         { str_colName: 'BFGCode', value: BFGCode, comp: 'eq' },
            //         { str_colName: 'ProductName', value: ProductName, comp: 'eq' },
            //         { str_colName: 'PVersion', value: PVersion, comp: 'eq' },
            //         { str_colName: 'Version', value: Version, comp: 'eq' },
            //         { str_colName: 'BatchNo', value: BatchNo, comp: 'eq' },
            //         //{ str_colName: 'Idsno', value: Idsno, comp: 'eq' },
            //         { str_colName: 'ReportType', value: ReportType, comp: 'eq' },
            //         { str_colName: 'Side', value: Side, comp: 'eq' },
            //         { str_colName: 'Repolabel14', value: cubicalObj.Sys_IPQCType, comp: 'eq' },//to check IPQC type
            //         { str_colName: 'CubicleType', value: cubicalObj.Sys_CubType, comp: 'eq' },
            //     ]
            // }

            var objcheckMasterData = [checkMasterData][0][0];
            if (objcheckMasterData.MstSerNo != null) {
                return objcheckMasterData.MstSerNo;
            }
            else {
                return 1;
            }
        }
        catch (error) {
            console.log('error in getRegularSpaceMstSerialNo=' + error)
            throw new Error(error);
        }

    }

    async getRegularLRSideNo(dataObj) {

        try {
            let { tableName, ReportType, Side, BFGCode, ProductName, PVersion, Version, BatchNo } = dataObj;
            let strIdsNo = dataObj.IdsNo;
            // here we are selecting IDS functionality for that cubicle 
            // var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.idsNo == Idsno);
            // if (IPQCObject != undefined) {
            //     selectedIds = IPQCObject.selectedIds
            // } else {
            //     selectedIds = Idsno; // for compression and coating
            // };
            let cubicalObj = globalData.arrIdsInfo.find(k => k.Hmi == strIdsNo).cubicalData;
            let checkMasterData = await models[tableName].findAll({
                attributes: [
                    [sequelize.fn('max', sequelize.col('RepSerNo')), 'RepSerNo'],
                    [sequelize.fn('max', sequelize.col('MstSerNo')), 'MstSerNo']
                ],

                where: {
                    BFGCode: BFGCode,
                    ProductName: ProductName,
                    PVersion: PVersion,
                    Version: Version,
                    BatchNo: BatchNo,
                    //{ str_colName: 'Idsno: Idsno,
                    ReportType: ReportType,
                    Side: Side,
                    // Repolabel14: cubicalObj.Sys_IPQCType,//to check IPQC type
                    CubicleType: cubicalObj.Sys_CubType,
                }

            })





            // var sqlquery = `select Max(SideNo) as SideNo from ${tableName} where BFGCode='${BFGCode}'  and `
            // sqlquery = sqlquery + `ProductName='${ProductName}' and PVersion='${PVersion}' and Version='${Version}' and `
            // sqlquery = sqlquery + `BatchNo='${BatchNo}' and ReportType='${ReportType}' and Side='${Side}' and Repolabel14 = '${cubicalObj.Sys_IPQCType}'`
            // sqlquery = sqlquery + `and  CubicleType='${cubicalObj.Sys_CubType}' and MstSerNo=(`

            // sqlquery = sqlquery + `select Max(MstSerNo) from ${tableName} where BFGCode='${BFGCode}'  and `
            // sqlquery = sqlquery + `ProductName='${ProductName}' and PVersion='${PVersion}' and Version='${Version}' and `
            // sqlquery = sqlquery + `BatchNo='${BatchNo}' and ReportType='${ReportType}' and Side='${Side}' and Repolabel14 = '${cubicalObj.Sys_IPQCType}' and  CubicleType='${cubicalObj.Sys_CubType}')`

            // var objcheckSideNO = await UtillDb.execute(sqlquery);
            let objcheckSideNO = [checkMasterData][0][0];

            if (objcheckSideNO.SideNo != null) {
                return objcheckSideNO.SideNo;
            }
            else {
                return 0;
            }
        }
        catch (error) {
            console.log('error in getRegularSpaceSideNo=' + error)
            throw new Error(error);
        }
    }
}

module.exports = GetMstSrNoAndSideSr