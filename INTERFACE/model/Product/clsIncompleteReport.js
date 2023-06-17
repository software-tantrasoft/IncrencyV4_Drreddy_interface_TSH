const database = require('../../global/dbCon');
const globalData = require('../../global/globalData');
const Database = require('../../database/clsQueryProcess')
const database1 = new Database();
const models = require('../../../config/dbConnection').models;
const sequelize = require('../../../config/dbConnection').sequelize;
const { QueryTypes } = require('sequelize');
class IncompleteReport {

    async getIncomepleteData(objWeighmentData, strMasterTableName, strDetailTableName, IdsNo, repNo) {
        try {
            // const objWeighmentData = dataObj.data;
            // const strMasterTableName = dataObj.masterTable;
            // const strDetailTableName = dataObj.detailTable;
            // const IdsNo = dataObj.strIdsNo;
            var strHmi = objWeighmentData.strHmi
            let selectedIdsNo;
            var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.Hmi == IdsNo);
            if (IPQCObject != undefined) {
                selectedIdsNo = IPQCObject.selectedIds;
            } else {
                selectedIdsNo = IdsNo;
            }
            var selectedCub = globalData.arrIdsInfo.find(k => k.Hmi == strHmi );
            // strHmi = strHmi.Hmi;
            const tempProductType = globalData.arrProductTypeArray.find(k => k.Hmi == strHmi);
            //var tempMenu = globalData.arrMultihealerMS.find(k=>k.idsNo == IdsNo);
            let responseObj = {};
            let objWeighment = tempProductType.productType;
            let strBatch = objWeighmentData.objProductDetails.Batch;


            let tableMasterName = strMasterTableName.concat('_incomplete')
            let objIncompleteData = await models[tableMasterName].findAll({
                where: {
                    BFGCode: objWeighment.ProductId,
                    ProductName: objWeighment.ProductName,
                    PVersion: objWeighment.ProductVersion,
                    Version: objWeighment.Version,
                    BatchNo: strBatch,
                    Idsno: strHmi
                }

            })
            objIncompleteData = objWeighment.ProductType == 3 ?
                objIncompleteData.condition.push({ str_colName: 'TestType', value: tempMenu.menu }) :
                objIncompleteData


            let masterresult = [objIncompleteData]
             masterresult = masterresult[0].pop();

             masterresult = masterresult;
            //console.log(masterresult);
            var RepSerNo = masterresult.RepSerNo;
            //console.log(RepSerNo);

            var tableDetailName = strDetailTableName.concat('_incomplete')
            const incompleteDetailData = await models[tableDetailName].findAll({
                where: {
                    RepSerNo: RepSerNo
                }

            })
           
            let detailresult = [incompleteDetailData]
            Object.assign(responseObj, {
                incompleteData: masterresult,
                detailData: detailresult[0],
                completeTableName: strMasterTableName,
                detailTableName: strDetailTableName,
                incompleteTableName: tableMasterName,
                incompletedetailTableName: tableDetailName
            })

            return responseObj;

        } catch (error) {
            throw new Error(error);
        }

    }

    async getDiffIncomepleteData(objWeighmentData, strMasterTableName, strDetailTableName, IdsNo) {
        try {
            // const objWeighmentData = dataObj.data;
            // const strMasterTableName = dataObj.masterTable;
            // const strDetailTableName = dataObj.detailTable;
            var strHmi = IdsNo;

            let selectedIdsNo;
            // var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.Hmi == IdsNo);
            // if (IPQCObject != undefined) {
            //     selectedIdsNo = IPQCObject.selectedIds;
            // } else {
            //     selectedIdsNo = IdsNo;
            // }

            const tempProductType = globalData.arrProductTypeArray.find(k => k.Hmi == strHmi);
            //var tempMenu = globalData.arrMultihealerMS.find(k=>k.idsNo == IdsNo);
            let responseObj = {};
            let objWeighment = tempProductType.productType;
            let strBatch = objWeighmentData.objProductDetails.Batch;

            let selectedCub = globalData.arrIdsInfo.find(k => k.Hmi == strHmi).cubicalData;
            // var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.selectedIds.Idsno == strHmi);
            // if (IPQCObject != undefined) {
            //     strHmi = IPQCObject.idsNo;
            // } else {
            //     strHmi = strHmi;
            // }
            let tableMasterName = strMasterTableName.concat('_incomplete')

            let objIncompleteData = await models[tableMasterName].findAll({
                where: {
                    BFGCode: objWeighment.ProductId,
                    ProductName: objWeighment.ProductName,
                    PVersion: objWeighment.ProductVersion,
                    VERSION: objWeighment.Version,
                    BatchNo: strBatch,
                    // CubicleType: selectedCub.Sys_CubType,
                    Idsno: strHmi // change idsNo to strHmi
                }
            })

            //     str_tableName: strMasterTableName + '_incomplete',
            //     data: '*',
            //     condition: [
            //         { str_colName: 'BFGCode', value: objWeighment.ProductId },
            //         { str_colName: 'ProductName', value: objWeighment.ProductName },
            //         { str_colName: 'PVersion', value: objWeighment.ProductVersion },
            //         { str_colName: 'VERSION', value: objWeighment.Version },
            //         { str_colName: 'BatchNo', value: strBatch },
            //         { str_colName: 'Idsno', value: IdsNo },
            //     ]
            // }
            objIncompleteData = objWeighment.ProductType == 3 ?
                objIncompleteData.condition.push({ str_colName: 'TestType', value: tempMenu.menu }) :
                objIncompleteData


            let masterresult = [objIncompleteData]
             masterresult = masterresult[0].pop(); //uncommented 07/02/23

            masterresult = masterresult;
            //console.log(masterresult);
            var RepSerNo = masterresult.RepSerNo;
            //console.log(RepSerNo);

            var tableDetailName = strDetailTableName.concat('_incomplete')

            const incompleteDetailData = await models[tableDetailName].findAll({
                where: {
                    RepSerNo: RepSerNo
                }

            })
            // {
            //     // str_tableName: strDetailTableName + '_incomplete',
            //     data: '*',
            //     condition: [
            //         { str_colName: 'RepSerNo', value: RepSerNo, comp: 'eq' }
            //     ]
            // }
            let detailresult = [incompleteDetailData]
            Object.assign(responseObj, {
                incompleteData: masterresult,
                detailData: detailresult[0],
                completeTableName: strMasterTableName,
                detailTableName: strDetailTableName,
                incompleteTableName: tableMasterName,
                incompletedetailTableName: tableDetailName
            })

            return responseObj;

        } catch (error) {
            throw new Error(error);
        }

    }
}
module.exports = IncompleteReport;