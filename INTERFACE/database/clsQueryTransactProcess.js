
const PromiseDBOp = require('./clsPromiseDBOperation');
const objPromiseDBOp = new PromiseDBOp();
class QueryBuilder {
    constructor() {
        this.Queries = [];
    }
    /**
     * 
     * @param {*} arrCommon - Array which holds the database operation objects like `INSERT`
     * `UPDATE` and `DELETE`
     * @description Function used for transaction query, here some important notes are
     * * `The queries should not be dependant on each other`
     * * `If there is any parameter from second query depends on result of first query`
     *  `this function fails`
     */
    funMakeQueries(arrCommon) {
        return new Promise((resolve, reject) => {
            this.Queries = [];
            arrCommon.forEach((v) => {
                if (v.action == "in") {
                    this.funInsert(v);
                }
                else if (v.action == "up") {
                    this.funUpdate(v);
                }
                else if (v.action == "de") {
                    this.funDelete(v);
                }
            })
            objPromiseDBOp.queryTransaction(this.Queries).then(result => {
                this.Queries = [];
                resolve(result);
            }).catch(err => {
                this.Queries = [];
                reject(err);
            })
        })

    }
    /**
     * 
     * @param {*} arrCommon - holds object for data insertion
     * @description Function generate the `Preapred query` for data insert
     */
    funInsert(arrCommon) {
        const data = arrCommon.data;
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
        var strQuery = `INSERT INTO ${arrCommon.str_tableName} (${columNames}) VALUES (${str_dummyVar})`;

        this.Queries.push(
            { query: strQuery, value: arr_Values }
        )

    }
    /**
     *
     * @param {*} updateObj - holds object for data updation
     * @description Function generate the `Preapred query` for data update
     */
    funUpdate(updateObj) {
        const arr_updateData = updateObj.data;
        var str_columnNames = "";
        var strWhereColumnNames = "";
        var arr_values = [];
        // For loop for concatinating column names which supposed to update
        for (let i = 0; i < arr_updateData.length; i++) {
            str_columnNames = str_columnNames + arr_updateData[i].str_colName + "=?,";
            arr_values.push(arr_updateData[i].value)
        }
        // For loop for concatinating column names which appears in where clause
        for (let j = 0; j < updateObj.condition.length; j++) {
            strWhereColumnNames = strWhereColumnNames + updateObj.condition[j].str_colName + "=? AND ";
            arr_values.push(updateObj.condition[j].value);
        }
        // removing last , OR  AND from string 
        str_columnNames = str_columnNames.slice(0, -1);
        strWhereColumnNames = strWhereColumnNames.slice(0, -5);
        var strQuery = `UPDATE ${updateObj.str_tableName} SET ${str_columnNames} WHERE ${strWhereColumnNames}`;
        this.Queries.push(
            { query: strQuery, value: arr_values }
        )
        // console.log('2',Queries);   
    }
    /**
     *
     * @param {*} deleteObj - holds object for data delation
     * @description Function generate the `Preapred query` for data delete
     */
    funDelete(deleteObj) {
        var arr_values = [];
        var str_whereColumnName = "";
        for (let i = 0; i < deleteObj.condition.length; i++) {
            str_whereColumnName = str_whereColumnName + deleteObj.condition[i].str_colName + "=? AND ";
            arr_values.push(deleteObj.condition[i].value);
        }
        str_whereColumnName = str_whereColumnName.slice(0, -5)
        var strQuery = `DELETE FROM ${deleteObj.str_tableName} WHERE ${str_whereColumnName}`;
        this.Queries.push(
            { query: strQuery, value: arr_values }
        )
    }
}


//console.log('1',Queries);

module.exports = QueryBuilder;

