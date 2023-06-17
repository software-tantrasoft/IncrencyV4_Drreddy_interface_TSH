//modules

const clsHmiModel = require('./hmiDetail.model');
const Database = require('../database/clsQueryProcess');
const globalData = require('../global/globalData');


// const sequelize = require('../.././models').sequelize

// const { tbl_batches,tbl_remark_incomplete_master } = require('../.././models/init-models').initModels(sequelize)

// const { tbl_batches ,tbl_remark_incomplete_master } = require('../../config/dbConnection').models;
// const sequelize  = require('../../config/dbConnection').sequelize
const models = require('../../config/dbConnection').models;
const sequelize = require('../../config/dbConnection').sequelize;
const { QueryTypes } = require('sequelize');


//instances of classes
const objHmiModel = new clsHmiModel();
const database = new Database();


class PreWeighmentCheck {

    async CheckProductSet(strHmi) {
        try {
            let cubicObj = globalData.arrIdsInfo.find(k => k.Hmi == strHmi);
            let cubicalData = cubicObj.cubicalData;
            if (cubicalData.Sys_ProductName == "NULL" || cubicalData.Sys_BFGCode == "NULL" ||
                (cubicalData.Sys_Version == "NULL") || (cubicalData.Sys_PVersion == "NULL")
            ) {
                return false;
            } else {
                return cubicalData;
            }

        } catch (error) {
            throw new Error(error)
        }
    }

    async CheckProductActivate(strHmi) {
        try {
            let cubicObj = globalData.arrIdsInfo.find(k => k.Hmi == strHmi);
            let cubicalData = cubicObj.cubicalData;
            if (cubicalData.Sys_ProductName == null || cubicalData.Sys_BFGCode == null ||
                cubicalData.Sys_Version == null || cubicalData.Sys_PVersion == null
            ) {
                return false;
            }
            return cubicalData

        } catch (error) {
            throw new Error(error)
        }
    }

    async CheckBatchStatus(strIdsNo, strHmi) {
        try {
            let cubicObj = globalData.arrIdsInfo.find(k => k.Hmi == strHmi);
            let cubicalData = cubicObj.cubicalData;
            let status, strMessage;
            let resObj = {};

            const batchDetails = await models.tbl_batches.findAll({
                where: {
                    CubicNo: cubicalData.Sys_CubicNo,
                    Prod_ID: cubicalData.Sys_BFGCode,
                    Prod_Name: cubicalData.Sys_ProductName,
                    Version: cubicalData.Sys_Version,
                    Prod_Version: cubicalData.Sys_PVersion,
                    Batch: cubicalData.Sys_Batch
                }
            })

            let batchArrDetails = [batchDetails];
            if (batchArrDetails[0].length == 0) {
                return {
                    status: false,
                    message: "Start Batch",
                    Batch: "null"
                }
            }
            let maxBatchRecord = batchArrDetails[0][batchArrDetails[0].length - 1];

            //put condition if batch not set
            const batchStatus = maxBatchRecord.Status;

            switch (batchStatus) {
                case 'E':
                    status = false;
                    strMessage = "Batch has Ended";
                    break;
                case 'R':
                    status = true;
                    strMessage = "Batch has Resumed";
                    break;
                case 'S':
                    status = true;
                    strMessage = "Batch has Started";
                    break;
                case 'I':
                    status = true;
                    strMessage = "Batch IPQC";
                    break;
                case 'N':
                    status = false;
                    strMessage = "Start Batch";
                    break;
                case 'P':
                    status = false;
                    strMessage = "Resume Batch";
                    break;
            }
            return Object.assign(resObj, {
                status: status,
                message: strMessage
            });
        } catch (error) {
            throw new Error(error)
        }
    }

    async checkReportRemarkPending(strIdsNo) {
        try {
            //check report remark pending or not
            let CubicInfo = globalData.arrIdsInfo.find(k => k.idsNo == strIdsNo);


            let selectedIdsNo;

            var IPQCObject = globalData.arr_IPQCRelIds.find(k => k.idsNo == strIdsNo);
            if (IPQCObject != undefined) {
                selectedIdsNo = IPQCObject.selectedIds;
            } else {
                selectedIdsNo = strIdsNo;
            }

            let selectedCubicInfo = globalData.arrIdsInfo.find(k => k.idsNo == selectedIdsNo).cubicalData;
            let StrBatch = selectedCubicInfo.Sys_Batch;
            const objIncompRemark = await models.tbl_remark_incomplete_master.findAll({
                where: {
                    IDSNo: strIdsNo,
                    BatchNumber: StrBatch
                }
            })
            // {
            //     str_tableName: 'tbl_remark_incomplete_master',
            //     data: '*',
            //     condition: [
            //         { str_colName: 'IDSNo', value: strIdsNo },
            //         { str_colName: 'BatchNumber', value: StrBatch }
            //     ]
            // }

            let arrRemarkDetails = [objIncompRemark];
            if (arrRemarkDetails[0].length > 0) {
                let tableName = arrRemarkDetails[0][0].tableName;
                let testName = arrRemarkDetails[0][0].paramName;
                let batchNo = StrBatch;

                const objRemark = await models[tableName].findAll({
                    where: {
                        BatchNo: batchNo,
                        IDSNo: strIdsNo
                    }
                })


                //     data: '*',
                //     condition: [
                //         { str_colName: 'BatchNo', value: batchNo },
                //         { str_colName: 'IDSNo', value: strIdsNo }
                //     ]


                let incompRemarkDetails = [objRemark];
                incompRemarkDetails = incompRemarkDetails[0].pop()

                const checkConditionsArr = ['NULL', "Null", null];

                if (incompRemarkDetails != undefined || incompRemarkDetails != null) {
                    if (checkConditionsArr.some(conditionParameter =>
                        incompRemarkDetails.RepoLabel13.includes(conditionParameter)
                    )) {
                        return { status: true, menuName: testName }
                    }
                    else {
                        return false;
                    }
                } else {
                    return false;
                }

            } else {
                return false;
            }

        } catch (error) {
            throw new Error(error)
        }
    }

}

module.exports = PreWeighmentCheck;