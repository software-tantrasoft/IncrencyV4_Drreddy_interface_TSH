const date = require('date-and-time');
const models = require('../../config/dbConnection').models;
const sequelize = require('../../config/dbConnection').sequelize;
const { QueryTypes } = require('sequelize');
const moment = require('moment')
class ActivityLog {

    /**
     * This function will make a Activity Entry from IDS
     * 
     * @param {*} objActivity Object which includes strUserId,strUserName and activity.
     * @returns a Promise , 1 when successull err when reject
     * @memberof ActivityLog
     */
    // ActivityLogEntry(objActivity) {
    //     return new Promise((resolve, reject) => { 
    //         var now = new Date();
    //        var activityObject = {
    //             str_tableName: 'tbl_activity_log',
    //             data: [
    //                 { str_colName: 'dt', value: date.format(now, 'YYYY-MM-DD') },
    //                 { str_colName: "tm", value: date.format(now, 'HH:mm:ss') },
    //                 { str_colName: "userid", value: objActivity.strUserId },
    //                 { str_colName: "username", value: objActivity.strUserName },
    //                 { str_colName: "activity", value: objActivity.activity },
    //             ]
    //         }

    //         objDatabase.save(activityObject).then((res) => {
    //             resolve({ result: '1' });
    //         }).catch((err) => {
    //             reject(err);
    //         })
    //     })

    // }

    /**
     * This function will make a Activity Entry from IDS
     * 
     * @param {*} objActivity Object which includes strUserId,strUserName and activity.
     * @returns a Promise , 1 when successull err when reject
     * @memberof ActivityLog
     */
    async ActivityLogEntry(objActivity) {
        // return new Promise((resolve, reject) => { 
        //     var now = new Date();
        //    var activityObject = {
        //         str_tableName: 'tbl_activity_log',
        //         data: [
        //             { str_colName: 'dt', value: date.format(now, 'YYYY-MM-DD') },
        //             { str_colName: "tm", value: date.format(now, 'HH:mm:ss') },
        //             { str_colName: "userid", value: objActivity.strUserId },
        //             { str_colName: "username", value: objActivity.strUserName },
        //             { str_colName: "activity", value: objActivity.activity },
        //         ]
        //     }

        //     objDatabase.save(activityObject).then((res) => {
        //         resolve({ result: '1' });
        //     }).catch((err) => {
        //         reject(err);
        //     })
        // })
        var now = new Date();
        let res = await models.tbl_activity_log.create({
            dt: moment().format('YYYY-MM-DD'),
            tm: moment().format('HH:mm:ss'),
            userid: objActivity.strUserId,
            username: objActivity.strUserName,
            activity: objActivity.activity
        })

        if (res) {
            return { result: '1' };
        }
        else {
            return { result: '0' }
        }


    }
}

module.exports = ActivityLog;