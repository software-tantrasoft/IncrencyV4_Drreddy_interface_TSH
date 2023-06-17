const dbConfig = require("../../global/serverConfig")
const dbCon = require('../../global/dbCon')
const maths = require('mathjs')
// const mysql = require('mysql2');
const models = require('../../../config/dbConnection').models;
const sequelize = require('../../../config/dbConnection').sequelize;
const { QueryTypes } = require('sequelize');



// const connection = mysql.createConnection({
//     host: dbConfig.dbHost,
//     database: dbConfig.dbDatabase,
//     user: dbConfig.dbUserId,
//     password: dbConfig.dbPwd,
//     multipleStatements: true
// });

class StoredProcedure {

   async fetchDetailForStats(resultdata, TestType, RepSerNoFromTable = 0) {
       try {
        
            var masterTable, detailTable, RepSerNo;
            var int_paramNo;
            if (RepSerNoFromTable == 0) {
                RepSerNo = resultdata.incompleteData.RepSerNo
            } else {
                RepSerNo = RepSerNoFromTable
            }
            masterTable = resultdata.incompleteTableName;
            detailTable = resultdata.incompletedetailTableName;

            let storedProcedureQuery = await models[detailTable].findAll({
                where: {
                    RepSerNo: RepSerNo
                }
            })

            var array = []
            for (var i = 0; i < storedProcedureQuery.length; i++) {
                var arr = storedProcedureQuery[i].DataValue;
                array.push(arr)
            }

            var obj={}
            let min = maths.min(array)
            obj["min"] = min;
            let max = maths.max(array)
            obj["max"] = max;
            console.log(min,max);
            
            let total = array.reduce((acc, total) => {
                return Number(total) + Number(acc);
              }, 0)
              let avg = total / array.length
              obj["avg"] = avg;
              console.log(avg)
              return obj;
            // if(true) {
            //     var config = {
            //         user: 'sa',
            //         password: '123',
            //         server: 'TS1033\\SQLEXPRESS',
            //         database: 'increncyV4_indore',
            //         options: {
            //             encrypt: true,
            //             enableArithAbort: true
            //         },
            //     };

            //     // request.input('detailTableName',sql.VarChar(100),detailTable);
            //     // request.input('RepSerNo',sql.Int,parseInt(RepSerNo));
            //     // request.input('weighmentModeNumber',sql.Int,parseInt(TestType));
            //     let pool = await sql.connect(config)
            //     let result2 = await pool.request()
            //         .input('detailTableName',sql.VarChar(100),detailTable)
            //         .input('RepSerNo',sql.Int,parseInt(RepSerNo))
            //         .input('weighmentModeNumber',sql.Int,parseInt(TestType))
            //         .output('minDataValue',sql.VarChar(15))
            //         .output('maxDataValue',sql.VarChar(15))
            //         .output('avgDataValue',sql.VarChar(15))
            //         .execute('batchSummaryReportCalculationsForInterface');
            //         console.log(result2)



            // let storedProcedureQuery = `CALL userManagement('${userId}','${userPass}','${source}','${ip}',@message,@userName);SELECT @message,@userName;`;    
            // var result = await sequelize.query(storedProcedureQuery,{ type: QueryTypes.SELECT });
            // return result;

            // }

            // ********stored procedure query commented as SP is not used in mssql**********
            // let storedProcedureQuery =`CALL batchSummaryReportCalculationsForInterface('${detailTable}','${RepSerNo}','${TestType}',@minWeight,@maxWeight,@average);SELECT @minWeight,@maxWeight,@average;`;    
            // var result = await sequelize.query(storedProcedureQuery,{ type: QueryTypes.SELECT });
            // return result;

            // // let storedProcedureQuery= await sequelize.query
            // ( ,{ type: QueryTypes.SELECT }).then(function (rows){
            //     console.log(rows);
            // })
       } catch (error) {
           console.log(error)
           
       }
           
    }


    getRemarkForTD(resultdata) {
        return new Promise((resolve, reject) => {
            var repSerNo = resultdata;
            var tableName = "tbl_tab_tapdensity";
            let strquery = "CALL reportCalculationTapDensity(" + repSerNo + ",'" + tableName + "'," +
                "@stdNeg,@stdPos,@bulkNegLimit,@bulkPosLimit,@tapDensity,@bulkDensity,@remark);" +
                "SELECT @remark;";
            connection.query(strquery, function (err, rows, fields) {
                if (err) {
                    console.log(err);
                }
                //console.log(rows);
                resolve(rows);
            });

        })

    }

    getRemarkForFriability(resultdata) {
        return new Promise((resolve, reject) => {
            var repSerNo = resultdata;
            let strquery = "CALL reportCalculationFriabilityForInterface(" + repSerNo + "," +
                "@remark);" +
                "SELECT @remark;";
            connection.query(strquery, function (err, rows, fields) {
                if (err) {
                    console.log(err);
                }
                //console.log(rows);
                resolve(rows);
            });

        })
    }


    CallSPRepeatabilityPercentage(repSrNo, balId, repetabilityDetailTable) {
        return new Promise((resolve, reject) => {
            let strquery = "CALL RepeatabilityPercentage(" + repSrNo + ",'" + balId + "','" + repetabilityDetailTable + "'," +
                "@balLeastCount,@balDSNW,@repeatabilityPer,@result);" +
                "SELECT @balLeastCount,@balDSNW,@repeatabilityPer,@result;";
            connection.query(strquery, function (err, rows, fields) {
                if (err) {
                    console.log(err);
                }
                //console.log(rows);
                resolve(rows);
            });
        })
    }
    /**
     * 
     * @param {*} RepSerNo 
     */
    async PercentageCalculationForFriability(RepSerNo) {
        return new Promise((resolve, reject) => {
            var repSerNo = RepSerNo;
            let strquery = "CALL reportCalculationFriabilityForInterfaceMVL(" + repSerNo + "," +
                "@FriabilityPercentageNA,@FriabilityPercentageLeft,@FriabilityPercentageRight,@RemarkNA,@RemarkLeft,@RemarkRight);" +
                "SELECT @FriabilityPercentageNA,@FriabilityPercentageLeft,@FriabilityPercentageRight,@RemarkNA,@RemarkLeft,@RemarkRight;";
            connection.query(strquery, function (err, rows, fields) {
                if (err) {
                    console.log(err);
                }
                //console.log(rows);
                resolve(rows);
            });

        })
    }


}
module.exports = StoredProcedure;