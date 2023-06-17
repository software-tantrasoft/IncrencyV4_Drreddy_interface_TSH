const { QueryTypes } = require('sequelize');
const sequelize = require('../../config/dbConnection').sequelize;
const dbCon = require('../global/dbCon');
// const date = require('date-and-time');
class QueryProcess {
    constructor() {
        this.arr_updateData;
    }

    /**
     * @param insertObj 
     * @description Function saves data in the database but object should be in the `Below` form
    * ```ts
    * { 
    *   str_tableName: String //Table Name
    *   data:Array<[ // Data to be save
    *   {str_colName:String, value:String},... //Column name followed by its value
    *   ]>
    * }
    * ```
    * @summary Function creates the dynamic query` for the saving data
    */
    save(insertObj) {
        // console.log(insertObj)
        return new Promise((resolve, reject) => {
            // fetching columNames and data associated with them from object as from of array
            const data = insertObj.data;
            var columNames = "";
            // array for values to be inserted
            var arr_Values = [];
            // variable for hoding  ? (for prepared statement)
            var str_dummyVar = "";
            for (let i = 0; i < data.length; i++) {
                // concating columnames one by one
                columNames = columNames + data[i].str_colName + ",";
                str_dummyVar = str_dummyVar + "?,"
                arr_Values.push(data[i].value)  
            }
            // removing last , from string 
            columNames = columNames.slice(0, -1);
            str_dummyVar = str_dummyVar.slice(0, -1);
            dbCon.execute(`INSERT INTO ${insertObj.str_tableName} (${columNames}) VALUES (${str_dummyVar})`, arr_Values).then(result => {
                resolve(result)
            }).catch(err => {
                console.log(err)
                reject('Reject Promise while creating save query', err);
            })
        })
    }
    /**
     * @param selectPrecalibSelWtObj
     * @description Function select data from the database but object should be in the `Below` form
    * ```ts
    * {
    *   str_tableName: String //Table Name
    *   data:'*', //If we want to select *
    *   condition:Array<[ //Where condition
    *   {str_colName:String, value:String, comp:String},... //Column name followed by 
    *   // its value
    *   ]>
    * }
    * ```
    * @summary Function creates the dynamic query` for the selecting data
    */
    select(selectPrecalibSelWtObj) {
        return new Promise((resolve, reject) => {
            // which parameter has to select like * or any field
            var data = selectPrecalibSelWtObj.data;
            // fetching tableName
            var str_tableName = selectPrecalibSelWtObj.str_tableName;
            var str_condition = "";
            // If select statement has where condition
            if (selectPrecalibSelWtObj.hasOwnProperty('condition')) {
                str_condition = "WHERE "
                for (let i = 0; i < selectPrecalibSelWtObj.condition.length; i++) {
                    var operator = '=';
                    switch (selectPrecalibSelWtObj.condition[i].comp) {
                        case 'eq': operator = '='; break;
                        case 'ne': operator = '!='; break;
                        case 'lt': operator = '<'; break;
                        case 'lte': operator = '<='; break;
                        case 'gt': operator = '>'; break;
                        case 'gte': operator = '>='; break;
                        case 'btn': operator = 'BETWEEN'
                    }
                    if (operator == 'BETWEEN') {
                        str_condition = str_condition + `(${selectPrecalibSelWtObj.condition[i].str_colName} BETWEEN  '${selectPrecalibSelWtObj.condition[i].value}' AND '${selectPrecalibSelWtObj.condition[i].value1}')  AND `
                    } else {
                        str_condition = str_condition + selectPrecalibSelWtObj.condition[i].str_colName + " " + operator + " '" + selectPrecalibSelWtObj.condition[i].value + "' AND "
                    }
                }
                // removing last , OR  AND from string 
                str_condition = str_condition.slice(0, -5)
            }
            var ordercondition = "";
            if (selectPrecalibSelWtObj.hasOwnProperty('order')) {
               
                for (let i = 0; i < selectPrecalibSelWtObj.order.length; i++) {
                   // str_condition = str_condition + selectPrecalibSelWtObj.condition[i].str_colName + " " + operator + " '" + selectPrecalibSelWtObj.condition[i].value + "' AND "
                    ordercondition =  ordercondition + `${selectPrecalibSelWtObj.order[i].str_colName}` + " " + `${selectPrecalibSelWtObj.order[i].value}` + " , "
                }
                ordercondition = " ORDER" + " BY" + " "+ ordercondition
                ordercondition = ordercondition.slice(0, -3)
            }
            if(ordercondition != ""){
                str_condition = str_condition.concat(ordercondition)
            }
            //console.log(`SELECT ${data} FROM ${str_tableName} ${str_condition}`);
            dbCon.execute(`SELECT ${data} FROM ${str_tableName} ${str_condition}`).then(result => {
                resolve(result)   
            }).catch(err => {
                console.log(err)
                reject('Reject Promise while creating select query', err);
            })
        
        });
    }
    //********************************************************************************************************* */
    // Function for updating tables in database
    //********************************************************************************************************* */
    /**
    * @param updateObj
    * @description Function updates data to the database but object should be in the `Below` form
    * ```ts
    * {
    *   str_tableName: String //Table Name
    *   data:Array<[ // Data to be update
    *   {str_colName:String, value:String},... //Column name followed by its value
    *   ]> 
    *   condition:Array<[ //Where condition
    *   {str_colName:String, value:String},... //Column name followed by
    *   // its value
    *   ]>
    * }
    * ```
    * @summary Function creates the dynamic query` for the selecting data
    */
    update(updateObj) {
        return new Promise((resolve, reject) => {
            // fetching data which we want to update
            this.arr_updateData = updateObj.data;
            var str_columnNames = "";
            var strWhereColumnNames = "";
            var arr_values = [];
            // For loop for concatinating column names which supposed to update
            for (let i = 0; i < this.arr_updateData.length; i++) {
                str_columnNames = str_columnNames + "`"+ this.arr_updateData[i].str_colName + "`=?,";
                arr_values.push(this.arr_updateData[i].value)
            }
            // For loop for concatinating column names which appears in where clause
            for (let j = 0; j < updateObj.condition.length; j++) {
                strWhereColumnNames = strWhereColumnNames + updateObj.condition[j].str_colName + "=? AND ";
                arr_values.push(updateObj.condition[j].value);
            }
            // removing last , OR  AND from string 
            str_columnNames = str_columnNames.slice(0, -1);
            strWhereColumnNames = strWhereColumnNames.slice(0, -4);
            // const query = `UPDATE ${updateObj.str_tableName} SET ${str_columnNames} WHERE ${strWhereColumnNames}, ${arr_values}`;
            //console.log(query, arr_values)
            dbCon.execute(`UPDATE ${updateObj.str_tableName} SET ${str_columnNames} WHERE ${strWhereColumnNames}`, arr_values).then(result => {
                resolve(result);
            }).catch(err => {
                console.log(err)
                reject('Reject Promise while creating update query', err);
            })
        })
    }
    //******************************************************************************************************** */
    // Function for updating tables in database
    //******************************************************************************************************** */
    /**
    * @param deleteObj
    * @description Function delets data from the database but object should be in the `Below` form
    * ```ts
    * {
    *   str_tableName: String //Table Name
    *   condition:Array<[ //Where condition
    *   {str_colName:String, value:String},... //Column name followed by
    *   // its value
    *   ]>
    * }
    * ```
    * @summary Function creates the dynamic query` for the selecting data
    */
    delete(deleteObj) {
        return new Promise((resolve, reject) => {
            var arr_values = [];
            var str_whereColumnName = "";
            for (let i = 0; i < deleteObj.condition.length; i++) {
                str_whereColumnName = str_whereColumnName + deleteObj.condition[i].str_colName + "=? AND ";
                arr_values.push(deleteObj.condition[i].value);
            }
            str_whereColumnName = str_whereColumnName.slice(0, -4)
            // const query = `DELETE FROM ${deleteObj.str_tableName} WHERE ${str_whereColumnName}`;
            dbCon.execute(`DELETE FROM ${deleteObj.str_tableName} WHERE ${str_whereColumnName}`, arr_values).then(result => {
                resolve(result)
            }).catch(err => {
                console.log(err)
                reject('Reject Promise while creating delete query')
            })
            //  console.log(query);
        })
    }
    //********************************************************************************************************* */

    //*************************************************************************************************** */
    // Function to select from one table and insert into another table.                                                        //
    //*************************************************************************************************** */
    // copy(insertObj) {
    //     // console.log(insertObj)
    //     return new Promise((resolve, reject) => {
    //         // fetching columNames and data associated with them from object as from of array
    //         const data = insertObj.data;
    //         var columNames = "";
    //         // array for values to be inserted
    //         var arr_Values = [];
    //         // variable for hoding  ? (for prepared statement)
    //         var str_dummyVar = "";
    //         for (let i = 0; i < data.length; i++) {
    //             // concating columnames one by one
    //             columNames = columNames + data[i].str_colName + ",";
    //             str_dummyVar = str_dummyVar + "?,"
    //             arr_Values.push(data[i].value)
    //         }
    //         // removing last , from string 
    //         columNames = columNames.slice(0, -1);
    //         str_dummyVar = str_dummyVar.slice(0, -1);
    //         dbCon.execute(`INSERT INTO ${insertObj.str_tableName} (${columNames}) VALUES (${str_dummyVar})`, arr_Values).then(result => {
    //             resolve(result)
    //         }).catch(err => {
    //             console.log(err)
    //             reject('Reject Promise while creating copy query', err);
    //         })
    //     })
    // }

    copy(copy) {
        // console.log(copy)
         return new Promise((resolve, reject) => {
             // fetching columNames and data associated with them from object as from of array
             const data = copy.data;
             var columNames = "";
             // array for values to be inserted
             var arr_Values = [];
             var strWhereColumnName = "";
             var str_dummyVar = "";
             for (let i = 0; i < data.length; i++) {
                 // concating columnames one by one
                 columNames = columNames + data[i].str_colName + ",";
             }
 
             for (let i = 0; i < copy.condition.length; i++) {
                 // concating columnames one by one
                 strWhereColumnName = strWhereColumnName + copy.condition[i].str_colName + "=? AND ";
 
                 arr_Values.push(copy.condition[i].value);
             }
             // removing last , from string 
             columNames = columNames.slice(0, -1);
             strWhereColumnName = strWhereColumnName.slice(0, -5);
 
            // console.log(strWhereColumnName, arr_Values);
 
             var str_Query = `insert into ${copy.toCopyTableName} (${columNames}) select ${columNames} from ${copy.fromCopyTblName} where ${strWhereColumnName}`
             dbCon.execute(str_Query, arr_Values).then(result => {
                 resolve(result)
             }).catch(err => {
                //  var logError = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + " , " + JSON.stringify(copy);
                //  logError = logError + err;
                //  ErrorLog.error(logError);
                 reject('Reject Promise while creating copy query');
             })
         })
     }

     //*************************************************************************************************** */
    // copy2 function copies data from two tables but all column names and column count must be same  //
    //*************************************************************************************************** */
    async copy2(fromTblName, toTblName, whereColName,repSrNo) { 
        
        // console.log(`INSERT INTO ${toTblName} SELECT * FROM ${fromTblName} WHERE ${whereColName} = ${repSrNo}`)
          await sequelize.query(`INSERT INTO ${toTblName} SELECT * FROM ${fromTblName} WHERE ${whereColName} = ${repSrNo}`,{type: QueryTypes.INSERT});
          return
        }
     //******************************************************************************************************** */
}




module.exports = QueryProcess;