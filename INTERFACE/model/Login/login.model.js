const date = require('date-and-time')
const objMoment = require('moment');
const requestIp = require('request-ip');
const mysql = require('mysql2');
const sha1 = require('sha1');

const serverConfig = require('../../../../IncrencyV4SDPConfig.json')
const GLOBAL_NOMENCLATURE = require('../../global/GLOBAL_NOMENCLATURE')
const Database = require('../../database/clsQueryProcess');
const timeZone = require('../../middleware/setTimeZone');
const clsQueryBuilder = require('../../database/clsQueryTransactProcess');
const globalData = require('../../global/globalData')
const clearArrModel = require('../clearGlobalArrays.model');
const clsActivityLog = require('../clsActivityLog.model');
const dbCon = require('../../../INTERFACE/global/dbCon');
const dbConfig = require('../../global/serverConfig');
const clsCommonOperation = require('../Product/clsCommonInsertOperation.model');
const clsHmi = require('../hmiDetail.model');
const { models } = require('../../../config/dbConnection');
const powerbckup = require('../../Utills/powerBackUp/powerbackup');
const ClearGlobalArrayModel = require('../clearGlobalArrays.model');
const sequelize = require('../../../config/dbConnection').sequelize;
const { QueryTypes } = require('sequelize');
const clsMonit = require('../MonitorSocket/clsMonitSocket')
const objMonit = new clsMonit();
const axios = require("axios");
const moment = require('moment');
const momentObj = require('moment');

const maths = require('mathjs')
const FormulaFunModel = require("../../model/Product/clsformulaFun.model");
const objformulaFun = new FormulaFunModel();
const ldapModule = require('../../model/ldapConnect.model');
const objldapModule = new ldapModule();

const objPowerBackup = new powerbckup();
const database = new Database();
const ObjQueryBuilder = new clsQueryBuilder();
const objActivityLog = new clsActivityLog();
const objClearArr = new clearArrModel();
const objCommonOperation = new clsCommonOperation();
const objHmi = new clsHmi();
const objClearArray = new ClearGlobalArrayModel();

// const connection = mysql.createConnection({
//     host: dbConfig.dbHost,
//     database: dbConfig.dbDatabase,
//     user: dbConfig.dbUserId,
//     password: dbConfig.dbPwd,
//     multipleStatements: true
// });

class LoginModal {

    async getIDSNo(req) {
        try {

            var FullIp = requestIp.getClientIp(req);

            var data = await models.tbl_rpi.findAll({
                where: {
                    TSH_IP: FullIp
                }
            })

            if (data.length == 0 || data == undefined)
                return { status: 'fail', message: 'TSH Not Configured', ip: FullIp };

            var dataCubical = await models.tbl_cubical.findAll({
                where: {
                    Sys_rpi: data[0].RPIID
                }
            })

            if (dataCubical.length == 0 || dataCubical == undefined)
                return { status: 'fail', message: 'TSH Not Configured', ip: FullIp };

            var strHmi = dataCubical[0].Sys_IDSNo;

            let arrusers = globalData.arrUsers.find(k => k.Hmi == strHmi);

            if (arrusers != undefined) {

                var userId = arrusers.UserId;

                var userName = arrusers.UserName;

                var Hmi = strHmi
                console.log("65-login.model.js -> blank source and active 0 -> userId", userId);
                let lastLoginDate = await timeZone.convertDateTime(new Date())

                await models.tbl_users.update({
                    active: 0,
                    source: '',
                    lstActvtyTime: lastLoginDate,
                    HostName: strHmi
                }, {
                    where: {
                        UserID: userId
                    }
                })

                await models.tbl_activity_log.create({
                    'dt': momentObj().format('YYYY-MM-DD'),
                    'tm': momentObj().format('HH:mm:ss'),
                    'userid': userId,
                    'username': userName,
                    'activity': `Power On/Off on TSH ${Hmi}`
                });

                let CurrentCubicalObj = globalData.arrIdsInfo.find(k => k.Hmi == strHmi)
                if (!CurrentCubicalObj == undefined) {
                    await this.UnlockedWeighingStatus(CurrentCubicalObj.cubicalData.Sys_CubicNo)
                }

            }

            return { status: 'success', result: data };

        } catch (error) {
            console.log(error)
        }
    }
    async getIDS(req) {
        try {

            var FullIp = requestIp.getClientIp(req);

            var rpiId = req.body.rpiId

            var data = await models.tbl_rpi.findAll({
                where: {
                    RPIID: rpiId
                }
            })

            // if (data.length == 0 || data == undefined)
            //     return { status: 'fail', message: 'TSH Not Configured', ip: FullIp };

            // var dataCubical = await models.tbl_cubical.findAll({
            //     where: {
            //         Sys_rpi: data[0].RPIID
            //     }
            // })

            if (data.length == 0 || data == undefined)
                return { status: 'fail', message: 'TSH Not Configured', ip: FullIp };

            var strHmi = data[0].IDSNo;

            let arrusers = globalData.arrUsers.find(k => k.Hmi == strHmi);

            if (arrusers != undefined) {

                var userId = arrusers.UserId;

                var userName = arrusers.UserName;

                var Hmi = strHmi
                console.log("65-login.model.js -> blank source and active 0 -> userId", userId);
                let lastLoginDate = await timeZone.convertDateTime(new Date())

                await models.tbl_users.update({
                    active: 0,
                    source: '',
                    lstActvtyTime: lastLoginDate,
                    HostName: strHmi
                }, {
                    where: {
                        UserID: userId
                    }
                })

                await models.tbl_activity_log.create({
                    'dt': momentObj().format('YYYY-MM-DD'),
                    'tm': momentObj().format('HH:mm:ss'),
                    'userid': userId,
                    'username': userName,
                    'activity': `Power On/Off on TSH ${Hmi}`
                });

                let CurrentCubicalObj = globalData.arrIdsInfo.find(k => k.Hmi == strHmi)
                if (!CurrentCubicalObj == undefined) {
                    await this.UnlockedWeighingStatus(CurrentCubicalObj.cubicalData.Sys_CubicNo)
                }

            }

            return { status: 'success', result: data };

        } catch (error) {
            console.log(error)
        }
    }
    

    async communicationOff(val) {
        try {
            var Hmi = val.Hmi
            var userId = val.userId
            var userName = val.userName
            var newDate = val.newDate
            var newTime = val.newTime

            await models.tbl_activity_log.create({
                'dt': newDate,
                'tm': newTime,
                'userid': userId,
                'username': userName,
                'activity': `Communication Off on TSH ${Hmi}`
            });

            return { status: 'success', result: "Validated" };

        } catch (error) {
            console.log(error)
        }


    }

    async loginApi(value) {
        var userId = value.userId;
        var userName = value.userName;
        var userPass = value.userPass;
        var rpi = value.resbpi;
        var strHmi = value.Hmi;
        let responseObj = {};
        var source = 'Hardware';


        var user = await models.tbl_users.findAll({
            where: { userID: userId, }
        }) //To check if user have put correct user id 
        var getParameter = await this.getParameterData();
        globalData.arrsAllParameters.push(getParameter);
        var now = new Date();
        // var ClientIp = Ip;
        var ClientIp;
        if (ClientIp === undefined) {
            ClientIp = '127.0.0.1';
        } else {
            ClientIp = ClientIp;
        }
        var ip = ClientIp;
        if (serverConfig.isLDAP == true) {
            // var strReturnProtocol = await this.validateUserLDAP(userId, userPass, strHmi, ip);

            var strReturnProtocol = await this.validateUserLDAP(userId, userPass, source, ip, rpi, strHmi)

            if (strReturnProtocol.status == "success") {

                let tmpUserobj = globalData.arrUsers.find(k => k.Hmi == strHmi);

                await objMonit.monit({ case: 'Login', Hmi: strHmi, data: tmpUserobj });

            }
            return strReturnProtocol;
        }
        if (user.length == 0) {

            return { status: "Fail", result: "Incorrect User ID or Password" }
        }
        // var userActive = await models.tbl_users.update({ active: 1 }, { where: { userID: userId } })
        if (user[0] != undefined) {
            var data = user[0];
            var userName = user[0].UserInitials;
            if (data.active == 1) { //active user msg 
                if (data.source == "Hardware") {
                    Object.assign(responseObj, { status: 'Fail' }, { result: `User is Already Active On TSH` });
                    return responseObj;
                } else {
                    Object.assign(responseObj, { status: 'Fail' }, { result: 'User is Already Active On Software' }, { userName: userName });
                    return responseObj;
                }
            } else if ((data.locked == 1) && (data.Role != "SuperAdmin") && (data.userType != 1)) {
                Object.assign(responseObj, { status: 'Fail' }, { result: 'User Locked, Please contact Admin' }, { userName: userName })
                return responseObj;
            } else if (data.realPassword !== userPass) {
                const auditUnauthorizedUser = await models.tbl_audit_unauthorized_user.create({
                    dt: date.format(now, 'YYYY-MM-DD'),
                    tm: date.format(now, 'HH:mm:ss'),
                    userid: userId,
                    username: user[0].UserName,
                    Host: ClientIp
                });
                var addLoginAttampt = await this.addLoginAttamptValue(userId, "Hardware", userPass, ClientIp); //Store Procedure 
                if (addLoginAttampt == 'success') {
                    addLoginAttampt = "Unauthorized user "
                }
                Object.assign(responseObj, { status: 'Fail' }, { result: addLoginAttampt }, { userName: userName })
                return responseObj;

            } else if ((data.Status == 1) && (data.Role != "SuperAdmin") && (data.userType != 1)) {
                Object.assign(responseObj, { status: 'Fail' }, { result: 'User Temporary Disabled, Contact Admin' }, { userName: userName })
                return responseObj;
            } else if ((data.Status == 2) && (data.Role != "SuperAdmin") && (data.userType != 1)) {
                Object.assign(responseObj, { status: 'Fail' }, { result: 'User Permanent Disabled, Contact Admin' }, { userName: userName })
                return responseObj;
            } else if ((data.Status == 4) && (data.Role != "SuperAdmin") && (data.userType != 1)) {
                Object.assign(responseObj, { status: 'Fail' }, { result: 'User Auto Disabled, Change Password' }, { userName: userName })
                return responseObj;
            } else if ((data.PwdExpStauts != 1) && (data.Status == 6) && (data.Role != "SuperAdmin") && (data.userType != 1)) {
                Object.assign(responseObj, { status: 'Fail' }, { result: 'User Locked, Please contact Admin' }, { userName: userName })
                return responseObj;
            } else if ((data.PwdExpStauts == 1) && (data.Status == 6) && (data.Role != "SuperAdmin") && (data.userType != 1)) {
                Object.assign(responseObj, { status: 'Fail' }, { result: 'Suspicious Activity Found, Contact Admin' }, { userName: userName })
                return responseObj;
            } else if ((data.PwdChg == 1) && (data.Role != "SuperAdmin") && (data.userType != 1)) {
                Object.assign(responseObj, { status: 'Fail' }, { result: 'Please Change Your Password' }, { userName: userName })
                return responseObj;
            } else if ((data.PwdExpStauts == 1) && (data.Role != "SuperAdmin") && (data.userType != 1)) {
                Object.assign(responseObj, { status: 'Fail' }, { result: 'Password Expired, Please Change Your Password' }, { userName: userName })
                return responseObj;
            } else if ((data.Role != "SuperAdmin") && (data.userType != 1)) {
                var getParameter = await this.getParameterData();

            } else {
                var getUserDetailData = await this.checkIfUserDataExist(userId, userPass, strHmi, userName);
                let objActivity = {};
                var tempUserObject = globalData.arrUsers.find(k => k.Hmi == strHmi);
                var objUpdateLoginData = await models.tbl_users.update({
                    active: 1,
                    HostName: ip,
                    source: 'Hardware',
                    LastLoginDt: moment().format('YYYY-MM-DD'),
                    lstActvtyTime: moment().format('YYYY-MM-DD HH:mm:ss')
                }, { where: { userID: userId } })

                Object.assign(objActivity,
                    { strUserId: tempUserObject.UserId },
                    { strUserName: tempUserObject.UserName },
                    { activity: 'Logged in on TSH:' + " " + strHmi }
                );
                await objActivityLog.ActivityLogEntry(objActivity);
                getUserDetailData.result.timeOut = getParameter.tbl_config_TimeoutPeriod;

            }
            var getUserDetailData = await this.checkIfUserDataExist(userId, userPass, strHmi, userName);
            if (Object.keys(getUserDetailData).length != 0) {
                let objActivity = {};
                var tempUserObject = globalData.arrUsers.find(k => k.Hmi == strHmi);

                var objUpdateLoginData = await models.tbl_users.update({
                    active: 1,
                    HostName: ip,
                    source: 'Hardware',
                    LastLoginDt: date.format(new Date(), 'YYYY-MM-DD'),
                    lstActvtyTime: date.format(new Date(), 'YYYY-MM-DD HH:mm:ss')

                },
                    { where: { UserID: userId } });

                Object.assign(objActivity,
                    { strUserId: tempUserObject.UserId },
                    { strUserName: tempUserObject.UserInitials },
                    { activity: 'Logged in on TSH:' + " " + strHmi }
                );
                await objActivityLog.ActivityLogEntry(objActivity);
            }
            let timeout = await models.tbl_setallparameter.findAll();
            timeout = timeout[0].tbl_config_TimeoutPeriod;
            getUserDetailData.result.timeOut = timeout;
            return getUserDetailData;
            // }
        } else {
            console.log("User not Valid");
            return { status: "Fail", result: "Validate User on Software And Try Again" }
        }
    }

    async userManagement(userId, userPass, source, ip, time, dates) {
        try {
            let storedProcedureQuery = `CALL userManagement('${userId}','${userPass}','${source}','${ip}',@message,@userName);SELECT @message,@userName;`;
            var result = await sequelize.query(storedProcedureQuery, { type: QueryTypes.SELECT });
            Object.assign(result, { time: time, date: dates })
            return result;
        } catch (error) {
            console.log("Error : ", error);
        }
    }
    async addLoginAttamptValue(userId, source, userPass, ClientIp) {
        try {
            var userManagementData = await this.userManagement(userId, source, userPass, ClientIp);
            var message = userManagementData[1][0]['@message'];
            return message;
        } catch (error) {
            return error;
        }
    }

    async checkIfUserDataExist(userId, userPass, strHmi) {
        try {
            var responseObj = {};
            const selectUserObj = await models.tbl_users.findAll({
                where: { UserID: userId, realPassword: userPass }
            })

            var result = selectUserObj;
            if (result[0] != undefined) {
                let data = [];
                data = result[0];
                const roleName = data.Role;
                var userName = data.UserInitials;
                let allRoleRights = [], allSplRights = [], allRemoveRights = [];
                var roleRights = await this.roleRight(roleName);
                var splRights = await this.splRight(userId);
                var removeRights = await this.removeRight(userId);
                for (let i = 0; i < roleRights.length; i++) {
                    allRoleRights.push(roleRights[i].role_rights)
                }
                for (let i = 0; i < splRights.length; i++) {
                    allSplRights.push(splRights[i].spl_right)
                }
                for (let i = 0; i < removeRights.length; i++) {
                    allRemoveRights.push(removeRights[i].removed_right)
                }

                var tmpUserobj = globalData.arrUsers.find(k => k.Hmi == strHmi);
                if (tmpUserobj == undefined) {
                    globalData.arrUsers.push({
                        Hmi: strHmi,
                        UserId: userId,
                        UserName: userName,
                        UserPass: userPass,
                    });
                } else {
                    tmpUserobj.UserId = userId;
                    tmpUserobj.UserName = userName;
                    tmpUserobj.UserPass = userPass;
                }
                await this.checkForRights(strHmi, userId);

                const userCridentialDetail = {
                    UserID: data.UserID,
                    UserName: data.UserName,
                    realPassword: data.realPassword,
                }

                Object.assign(responseObj, { status: 'success' }, { result: userCridentialDetail })

                return responseObj;
            } else {
                return false;
            }

        } catch (error) {
            return error;
        }
    }

    async roleRight(roleName) {
        var role = await models.tbl_role.findAll({
            where: { role_name: roleName }
        })
        return role;

    }

    async splRight(userId) {
        var right = await models.tbl_rights_special.findAll({ where: { userid: userId } })
        return right;

    }

    async removeRight(userId) {
        var remove_right = await models.tbl_rights_removed.findAll({ where: { userid: userId } })
        return remove_right;

    }
    async getParameterData() {
        try {
            const parameterObj = await models.tbl_setallparameter.findAll({
                where: {
                    config_id: 1
                }
            })
            if (parameterObj.length > 0) {
                var data = parameterObj[0];
                return data;
            } else {
                return false;
            }
        } catch (error) {
            return error;
        }
    }

    async checkForRights(strHmi, strUserId) {
        try {
            var arr_rights = [];
            let selectRole = await models.tbl_users.findAll({
                where: {
                    UserID: strUserId
                }
            })
            let roleResult = selectRole;
            let roleName = roleResult[0].Role;
            // For role Rights
            let selectRights = await models.tbl_role.findAll({
                where: {
                    role_name: roleName,
                    locked: 0
                }
            })

            let roleRights = selectRights;

            arr_rights = arr_rights.concat(roleRights).map(k => k.role_rights);
            // For special rights
            let selectSpecialRights = await models.tbl_rights_special.findAll({
                where: {
                    userid: strUserId,

                }
            })

            let specialRights = selectSpecialRights;
            let tempSplArr = specialRights.map(k => k.spl_right)
            arr_rights = arr_rights.concat(tempSplArr);
            // For remove rights
            let selectRemoveRights = await models.tbl_rights_removed.findAll({
                where: {
                    userid: strUserId,

                }
            })
            let removeRights = selectRemoveRights;
            let tempRmvArr = removeRights.map(k => k.removed_right);

            let tempRightObj = globalData.arrUserRights.find(t => t.Hmi == strHmi);
            if (tempRightObj == undefined) {
                globalData.arrUserRights.push({
                    Hmi: strHmi,
                    rights: arr_rights,
                    splRights: specialRights,
                    removeRights: tempRmvArr
                });
            } else {
                tempRightObj.rights = arr_rights;
                tempRightObj.splRight = specialRights;
                tempRightObj.removeRight = tempRmvArr;

            }
            return 1;
        } catch (error) {
            throw new Error(error)
        }
    }

    async logout(value) {

        try {

            var strHmi = value.Hmi;
            var userName = value.userName;
            var userId = value.userId;
            var autoLogout = value.autoLogout;



            await models.tbl_cubical.update({
                Sys_WeighmentInProcess: 0,
                Sys_CalibInProcess: 0
            }, { where: { Sys_IDSNo: strHmi } })
            var objUpdateLoginData = await models.tbl_users.update({
                active: 0,
                HostName: '',
                source: '',
                lstActvtyTime: momentObj().format('YYYY-MM-DD HH:mm:ss')
            }, {
                where: {
                    UserId: userId
                }
            })
            objUpdateLoginData;

            var msg = '';
            (autoLogout) ? msg = `Auto Logout from TSH ${strHmi}` : msg = `Logged out on TSH: ${strHmi}`

            await models.tbl_activity_log.create({
                dt: momentObj().format('YYYY-MM-DD'),
                tm: momentObj().format('HH:mm:ss'),
                userid: userId,
                username: userName,
                activity: msg
            })

            await models.tbl_users.update(
                { active: 0 }, {
                where: {
                    UserID: userId
                }
            })
            let CurrentCubicalObj = globalData.arrIdsInfo.find(k => k.Hmi == strHmi)
            if (CurrentCubicalObj != undefined) {
                await this.UnlockedWeighingStatus(CurrentCubicalObj.cubicalData.Sys_Batch);
            }

            var result = { status: "success", message: 'User logout Successfully.' }
            await objClearArray.clearDetails(strHmi, true);
            await objMonit.monit({ case: 'Logout', Hmi: strHmi });
            console.log(`${userName} logout Successfully from TSH ${strHmi}`)
            return result;
        }
        catch (error) {
            console.log(error)
            throw new Error(error);
        }
    }


    async loginMain(userId, userPass, source, Ip, strHmi) {
        try {

            var now = new Date();
            const response = await axios.post(
                `http://${serverConfig.hostApi}:${serverConfig.APIPORT}/API/login/loginMain`,
                {
                    userId: userId,
                    userPass: userPass,
                    source: source,
                    hmi: `${strHmi}`,
                }
            );

            strHmi = strHmi.split('-')[1]
            if (response != undefined) {
                if (response.data != undefined) {
                    if (response.data.data != undefined) {
                        var tmpUserobj = globalData.arrUsers.find(k => k.Hmi == strHmi);
                        if (tmpUserobj == undefined) {
                            globalData.arrUsers.push({
                                Hmi: strHmi,
                                UserName: response.data.userName,
                                UserId: response.data.data.UserID,
                                UserPass: response.data.data.realPassword
                            });
                        } else {
                            var index = globalData.arrUsers.findIndex(k => k.Hmi == strHmi);
                            globalData.arrUsers[index].userName = response.data.userName,
                                globalData.arrUsers[index].userId = response.data.data.UserID,
                                globalData.arrUsers[index].userPass = response.data.data.realPassword;
                        }
                    }
                }
            }

            return response.data
        } catch (error) {
            console.log(error)
            return "Api connection close"
        }
    }

    // async ApiLogin(data) {

    async getLDAPUserData(strUserName, strHmi) {
        try {
            let arrRes = await models.tbl_users.findAll({
                where: {
                    UserName: strUserName
                }
            })
            let configSetting = await this.getParameterData()
            const timeOut = configSetting.tbl_config_TimeoutPeriod
            arrRes[0].timeOut = timeOut;
            await this.checkForRights(strHmi, arrRes[0].UserID)
            return arrRes[0];
        } catch (error) {
            throw new Error(error)
        }
    }

    async getHmi(hmi) {
        try {
            let arrRes = await models.tbl_rpi.findAll({
                where: {
                    RPIID: hmi,
                }
            });
            if (arrRes[0] == undefined) {
                return arrRes[0];
            } else {
                return arrRes[0].IDSNo;
            }
        } catch (error) {
            throw new Error(error)
        }
    }
    async powerbackup(data) {
        var responseObj = {}
        await objClearArray.clearDetails(data.Hmi, false);
        var user = await models.tbl_users.findAll({
            where: { userID: data.userId }
        })
        var tmpUserobj = globalData.arrUsers.find(k => k.Hmi == data.Hmi);
        if (tmpUserobj == undefined) {
            globalData.arrUsers.push({
                Hmi: data.Hmi,
                UserName: user[0].UserInitials,
                UserId: user[0].UserID,
                UserPass: user[0].realPassword
            });
        } else {
            var index = globalData.arrUsers.findIndex(k => k.Hmi == data.Hmi);
            globalData.arrUsers[index].userName = data.userName;
            globalData.arrUsers[index].userId = data.userId;
            globalData.arrUsers[index].userPass = data.userPass;

        }
        // console.log(data)
        var tmpUserRightobj = globalData.arrUserRights.find(k => k.Hmi == data.Hmi);
        if (tmpUserRightobj == undefined) {
            globalData.arrUserRights.push({
                Hmi: data.Hmi,
                rights: data.Rights.concat(data.splRights),
                splRights: data.splRights,
                removeRights: data.removeRights
            });
        } else {
            tmpUserRightobj.rights = tmpUserRightobj.rights;
            tmpUserRightobj.splRight = tmpUserRightobj.splRights;
            tmpUserRightobj.removeRights = tmpUserRightobj.removeRights;

        }
        tmpUserobj = globalData.arrUsers.find(k => k.Hmi == data.Hmi);
        var userRights = globalData.arrUserRights.find(k => k.Hmi == data.Hmi)

        if (!userRights.rights.includes("Test")) return { status: 'Success', message: 'Test Right Not Assigned' }

        //monit
        // await objMonit.monit({ case: 'Login', Hmi: data.Hmi, data: tmpUserobj });

        let arr = []
        var powerbcup = await objPowerBackup.chkPowerBackupPresent(data);
        if (typeof (powerbcup) == 'object') {
            for (let obj in powerbcup) {
                if (powerbcup[obj] != null) {
                    if (arr.length == 0) {
                        arr.push({ [`${obj}`]: powerbcup[obj] })
                        // await models.tbl_activity_log.create({
                        //     dt: momentObj().format('YYYY-MM-DD'),
                        //     tm: momentObj().format('HH:mm:ss'),
                        //     userid: data.userId,
                        //     username: user[0].UserInitials,
                        //     activity: "Powered On TSH" + ' ' + data.Hmi
                        // })
                    } else {
                        arr[0][obj] = powerbcup[obj]
                    }

                    //console.log(obj)
                }
            }

            powerbcup = arr[0]
        } else {
            powerbcup = powerbcup
        }


        Object.assign(responseObj, { status: 'success' }, { result: powerbcup })

        return responseObj;
    }
    async UnlockedWeighingStatus(Batch) {
        try {
            await models.tbl_system_weighingstatus.update({
                Status: 0,
                BatchNo: "NULL",
                CubType: "NULL"
            }, {
                where: {
                    BatchNo: Batch,


                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    //Discarded Powerbackup
    async discardPowerBackup(values) {
        try {
            const { Hmi, userId, userName, menuName } = values;

            console.log(menuName, "discared")
            const Entry = await models.tbl_powerbackup.findAll({
                where: {
                    Idsno: Hmi,
                    WeighmentName: menuName
                }
            })
            if (Entry.length != 0) {
                console.log("Discarded")
                await models.tbl_powerbackup.destroy({
                    where: {
                        Idsno: Hmi,
                        WeighmentName: menuName
                    }
                })

                if (menuName == GLOBAL_NOMENCLATURE.IndividualMenu) {

                    let objSelMenu = globalData.arrSelectedMenu.find(
                        (k) => k.Hmi == Hmi
                    );
                    if (objSelMenu.selectedProductDetail.isonstd == true) {
                        var masterTable = 'tbl_tab_master1';
                        var detailTable = 'tbl_tab_detail1';
                        // strincomplete =  'tbl_tab_master1_incomplete'

                        var detail_tableName = detailTable.concat("_incomplete");
                        var master_tableName = masterTable.concat("_incomplete");
                        var get_Datavalue = await models[detail_tableName].findAll({ where: { RepSerNo: Entry[0].Incomp_RepSerNo } })
                        var get_Datavalue1 = await models[master_tableName].findAll({ where: { RepSerNo: Entry[0].Incomp_RepSerNo } })

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
                            }, { where: { RepSerNo: Entry[0].Incomp_RepSerNo } });
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
                            RepSerNo: Entry[0].Incomp_RepSerNo,
                        }
                    }
                    );
                    var hmiDetails = await models.tbl_tab_master1_incomplete.findAll({
                        where: {
                            RepSerNo: Entry[0].Incomp_RepSerNo,
                        }
                    })
                } else if (menuName == GLOBAL_NOMENCLATURE.Hardness) {
                    await models.tbl_tab_master_htd_incomplete.update(
                        {
                            IsProcess: 0,
                            PrEndDate: momentObj().format("YYYY-MM-DD"),
                            PrEndTime: momentObj().format("HH:mm:ss"),
                            FailedRemarkI: "Aborted test"
                        }, {
                        where: {
                            RepSerNo: Entry[0].Incomp_RepSerNo,
                        }
                    }
                    );
                    var hmiDetails = await models.tbl_tab_master_htd_incomplete.findAll({
                        where: {
                            RepSerNo: Entry[0].Incomp_RepSerNo,
                        }
                    })
                }
                hmiDetails = hmiDetails[0]
                //for calibration
                if (Entry[0].WeighmentType != 'NULL')
                    //for weighment
                    if (menuName != GLOBAL_NOMENCLATURE.Hardness) {
                        var act = `${menuName} Test Discarded on TSH ${Hmi}`
                        if (hmiDetails.Side != 'NA') {
                            var act = `${menuName} Test Discarded on TSH ${Hmi} for side ${hmiDetails.Side}`
                        }
                        await models.tbl_activity_log.create({
                            'dt': momentObj().format('YYYY-MM-DD'),
                            'tm': momentObj().format('HH:mm:ss'),
                            'userid': userId,
                            'username': userName,
                            'activity': act
                        });

                    } else {
                        var act = `${menuName}/Thickness Test Discarded on TSH ${Hmi}`
                        if (hmiDetails.Side != 'NA') {
                            var act = `${menuName}/Thickness Test Discarded on TSH ${Hmi} for side ${hmiDetails.Side}`
                        }
                        await models.tbl_activity_log.create({
                            'dt': momentObj().format('YYYY-MM-DD'),
                            'tm': momentObj().format('HH:mm:ss'),
                            'userid': userId,
                            'username': userName,
                            'activity': act
                        });
                    }
            }

            //clear arrays related to counter and test

            globalData.arrWeighmentCounter.findIndex(k => k.Hmi == Hmi) == -1 ?
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

            return {
                status: 'success',
                result: "Successfully Discarded Previous Test"
            }

        } catch (error) {
            console.log(error);
            console.error(error)
        }
    }

    //LDAP LOGIN
    async validateUserLDAP(userId, userPass, source, ip, rpi, strHmi) {
        try {
            let dt = new Date();
            let now = new Date();
            strHmi = strHmi.toString();
            let user = await models.tbl_users.findAll({
                where: {
                    UserID: userId,
                },
            });
            if (user[0] == undefined) {
                console.log("User not Valid");
                let obj = {
                    status: "fail",
                    result: "Incorrect User ID Or Password",
                };
                return obj;
            }
            // if (user[0].realPassword == "VALIDATED") {
            //     let username = user[0].UserName;
            //     var UserInitial = user[0].UserInitials
            //     let obj = { username, userPass };
            //     const responses = await axios.post(
            //         `http://${serverConfig.hostApi}:${serverConfig.APIPORT}/API/ldap/validate`,
            //         {
            //             strUserName: username,
            //             strPassword: userPass,
            //             // source: source,
            //             // ip : `IDS-${strHmi}`
            //         }
            //     );
            //     // if (responses.data.response == "Authenticated") {
            //     //     const response = await axios.post(
            //     //         `http://${serverConfig.hostApi}:${serverConfig.APIPORT}/API/login/loginMain`,
            //     //         {
            //     //             user: userId,
            //     //             userId: userId,
            //     //             userPass: "VALIDATED",
            //     //             //  username:userName,
            //     //             source: "Hardware",
            //     //             // ip: `${strHmi}`,
            //     //         }
            //     //     );

            //     //     // }
            //     //     if (response.data.result == 'User Already Active On Software') {
            //     //         let obj = {
            //     //             status: "Fail",
            //     //             result: 'User Already Active On Software',
            //     //         };
            //     //         return obj;
            //     //     }
            //     //     if (response.data.result == "Please Change Your Password") {
            //     //         response.data.result = response.data.data;
            //     //         response.data.data.active = 1;
            //     //         let user = await models.tbl_users.update(
            //     //             {
            //     //                 active: 1,
            //     //             },
            //     //             {
            //     //                 where: {
            //     //                     UserID: userId,
            //     //                 },
            //     //             }
            //     //         );
            //     //         await models.tbl_activity_log.create({
            //     //             dt: date.format(now, "YYYY-MM-DD"),
            //     //             tm: date.format(now, "HH:mm:ss"),
            //     //             userid: userId,
            //     //             username: UserInitial,
            //     //             activity: 'Logged in on TSH:' + " " + strHmi
            //     //         });
            //     //     }
            //     //     if (response.data.result == "User Temporary Disabled, Contact Admin" || response.data.result == "User Locked, Please contact Admin") {
            //     //         response.data.result = "User Disabled Contact Authorized Person";
            //     //     }
            //     //     if (response.data.result == "Password Expired, Please Change Your Password") {
            //     //         response.data.result = response.data.data;
            //     //         response.data.result.active = 1;
            //     //         let user = await models.tbl_users.update(
            //     //             {
            //     //                 active: 1,
            //     //             },
            //     //             {
            //     //                 where: {
            //     //                     UserID: userId,
            //     //                 },
            //     //             }
            //     //         );
            //     //         await models.tbl_activity_log.create({
            //     //             dt: date.format(now, "YYYY-MM-DD"),
            //     //             tm: date.format(now, "HH:mm:ss"),
            //     //             userid: userId,
            //     //             username: UserInitial,
            //     //             activity: 'Logged in on TSH:' + " " + strHmi
            //     //         });
            //     //     }

            //     //     if (response != undefined) {
            //     //         if (
            //     //             response.data.result.active != undefined ||
            //     //             response.data.active == 1
            //     //         ) {
            //     //             if (response.data.result.active == 1) {
            //     //                 var tmpUserobj = globalData.arrUsers.find(
            //     //                     (k) => k.Hmi == strHmi
            //     //                 );
            //     //                 if (tmpUserobj == undefined) {
            //     //                     globalData.arrUsers.push({
            //     //                         Hmi: strHmi,
            //     //                         UserId: userId,
            //     //                         UserName: response.data.result.UserInitials,
            //     //                         UserPass: userPass,
            //     //                     });
            //     //                 } else {
            //     //                     tmpUserobj.UserId = userId;
            //     //                     (tmpUserobj.UserName = response.data.result.UserInitials),
            //     //                         (tmpUserobj.UserPass = userPass);
            //     //                 }

            //     //                 var tmpUserRightobj = globalData.arrUserRights.find(
            //     //                     (k) => k.Hmi == strHmi
            //     //                 );
            //     //                 if (tmpUserRightobj == undefined) {
            //     //                     globalData.arrUserRights.push({
            //     //                         Hmi: strHmi,
            //     //                         rights: response.data.result.rights.concat(
            //     //                             response.data.result.splRights
            //     //                         ),
            //     //                         splRights: response.data.result.splRights,
            //     //                         removeRights: response.data.result.removeRights,
            //     //                     });
            //     //                 } else {
            //     //                     tmpUserRightobj.rights = response.data.result.rights.concat(
            //     //                         response.data.result.splRights
            //     //                     );
            //     //                     (tmpUserRightobj.splRight = response.data.result.splRights),
            //     //                         (tmpUserRightobj.removeRight =
            //     //                             response.data.result.removeRights);
            //     //                 }
            //     //             }
            //     //         }
            //     //     }
            //     //     if (response.data.result.active != undefined || response.data.active == 1) {
            //     //     }
            //     //     let timeout = await models.tbl_setallparameter.findAll();
            //     //     timeout = timeout[0].tbl_config_TimeoutPeriod;
            //     //     response.data.timeOut = timeout;
            //     //     console.log(response);
            //     //     let obj = {
            //     //         status: "success",
            //     //         timeOut: response.data.timeOut,
            //     //         userName: response.data.result.UserInitials,
            //     //         result: response.data.result,
            //     //     };
            //     //     return obj;
            //     // }
            //     if (responses.data.response == "Authenticated failed") {
            //         let obj = {
            //             status: "fail",
            //             result: "Incorrect User ID Or Password",
            //         };
            //         return obj;
            //     }
            //     var tmpUserobj = globalData.arrUsers.find(k => k.Hmi == strHmi);
            //     //monit
            //     // await objMonit.monit({ case: 'Login', Hmi: strHmi, data: tmpUserobj });
            // } else {
            //     console.log("User not Valid");
            //     let obj = {
            //         status: "fail",
            //         result: "Validate User on Software And Try Again",
            //     };
            //     return obj;
            // }

            //login03/06/23 start
            if (user[0].realPassword == 'VALIDATED') {
                //If user pass is validated then check for ldap validation
                const responses = await axios.post(`http://${serverConfig.hostApi}:${serverConfig.APIPORT}/API/ldap/validate`, {
                    strUserName: user[0].UserName,
                    strPassword: userPass,
                    req: strHmi
                })
                //If user is authenticated then login
                if (responses.data.response == 'Authenticated') {
                    const checkuser = await axios.post(`http://${serverConfig.hostApi}:${serverConfig.APIPORT}/API/login/chkUserActive`, {
                        userId: userId
                    });
                    //active validation
                    if (checkuser.data.result.active == 1) {
                        var msg = 'User Already Active on Software';
                        return { status: "fail", result: msg }
                    } else {
                        var response = await axios.post(`http://${serverConfig.hostApi}:${serverConfig.APIPORT}/API/login/validateUser`, {
                            userId: userId,
                            user: userId,
                            strUserName:user[0].UserName,
                            // userPass: 'VALIDATED',
                            source: 'hardware',
                            hmi: `${strHmi}`,
                            ip: strHmi,
    
                        });
                        if (response.data.result == "User Validated Successfully") {
                            var right = await axios.post(`http://${serverConfig.hostApi}:${serverConfig.APIPORT}/API/login/checkuserstatusLds`, {
                                user: userId,
                            });
                            var checkuseractive = await axios.post(`http://${serverConfig.hostApi}:${serverConfig.APIPORT}/API/login/chkUserActive`, {
                                userId: userId
                            });
                            //user array and rights array push here
                            if (checkuseractive.data.result.active == 1) {
                                var tmpUserobj = globalData.arrUsers.find(k => k.Hmi == strHmi);
                                if (tmpUserobj == undefined) {
                                    globalData.arrUsers.push({
                                        Hmi: strHmi,
                                        UserId: userId,
                                        UserName: checkuseractive.data.result.UserInitials,
                                        UserPass: userPass,
                                    });
                                } else {
                                    tmpUserobj.UserId = userId;
                                    tmpUserobj.UserName = checkuseractive.data.result.UserInitials,
                                        tmpUserobj.UserPass = userPass;
                                }
    
                                var tmpUserRightobj = globalData.arrUserRights.find(k => k.Hmi == strHmi);
                                if (tmpUserRightobj == undefined) {
                                    globalData.arrUserRights.push({
                                        Hmi: strHmi,
                                        rights: right.data.result[1].rights.concat(right.data.result[2].splRights),
                                        splRights: right.data.result[2].splRights,
                                        removeRights: right.data.result[3].removeRights
                                    });
                                } else {
                                    tmpUserRightobj.rights = right.data.result[1].rights.concat(right.data.result[2].splRights);
                                    tmpUserRightobj.splRight = right.data.result[2].splRights,
                                        tmpUserRightobj.removeRight = right.data.result[3].removeRights
                                }
                                // let CurrentCubicalObj = globalData.arrIdsInfo.find(k => k.Hmi == strHmi);
    
                                // if (CurrentCubicalObj == undefined) {
                                //     CurrentCubicalObj = await models.tbl_cubical.findAll({
                                //         where: {
                                //             Sys_IDSNo: strHmi
                                //         }
                                //     })
                                //     globalData.arrIdsInfo.push({
                                //         Hmi: strHmi,
                                //         respbi: CurrentCubicalObj[0].Sys_rpi,
                                //         cubicalData: CurrentCubicalObj[0]
                                //     })
                                // } else {
                                //     CurrentCubicalObj = CurrentCubicalObj.cubicalData;
                                // }
                                tmpUserobj = globalData.arrUsers.find(k => k.Hmi == strHmi);
                                await objMonit.monit({ case: 'Login', Hmi: strHmi, data: tmpUserobj });
    
                            }
    
                        } else {
                            var msg = 'User Already Active on Software';
                            return { status: "fail", result: msg }
                        }
                    }
                    console.log(checkuser);
                    // if (checkuser.data.result[0].active == 0) {
                    //If user is locked or temporary disabled
                    // if (response.data.result == 'User Temporary Disabled, Contact Admin' || response.data.result == 'User Locked, Please contact Admin') {
                    //     response.data.result = 'User Disabled. Contact Authorized Person'
                    // }
                    //
                    // if (response != undefined) {
                    //     if (response.data.result.active != undefined || response.data.active == 1) {
                    //         if (response.data.result.active == 1) {
                    //             var tmpUserobj = globalData.arrUsers.find(k => k.Hmi == strHmi);
                    //             if (tmpUserobj == undefined) {
                    //                 globalData.arrUsers.push({
                    //                     Hmi: strHmi,
                    //                     userId: userId,
                    //                     userName: response.data.result.UserInitials,
                    //                     userPass: userPass,
                    //                 });
                    //             } else {
                    //                 tmpUserobj.userId = userId;
                    //                 tmpUserobj.userName = response.data.result.UserInitials,
                    //                     tmpUserobj.userPass = userPass;
                    //             }
    
                    //             var tmpUserRightobj = globalData.arrUserRights.find(k => k.Hmi == strHmi);
                    //             if (tmpUserRightobj == undefined) {
                    //                 globalData.arrUserRights.push({
                    //                     Hmi: strHmi,
                    //                     rights: response.data.result.rights.concat(response.data.result.splRights),
                    //                     splRights: response.data.result.splRights,
                    //                     removeRights: response.data.result.removeRights
                    //                 });
                    //             } else {
                    //                 tmpUserRightobj.rights = response.data.result.rights.concat(response.data.result.splRights);
                    //                 tmpUserRightobj.splRight = response.data.result.splRights,
                    //                     tmpUserRightobj.removeRight = response.data.result.removeRights;
                    //             }
                    //             let CurrentCubicalObj = globalData.arrIdsInfo.find(k => k.Hmi == strHmi);
    
                    //             if (CurrentCubicalObj == undefined) {
                    //                 CurrentCubicalObj = await models.tbl_cubical.findAll({
                    //                     where: {
                    //                         Sys_IDSNo: strHmi
                    //                     }
                    //                 })
                    //                 globalData.arrIdsInfo.push({
                    //                     Hmi: strHmi,
                    //                     respbi: CurrentCubicalObj[0].Sys_rpi,
                    //                     cubicalData: CurrentCubicalObj[0]
                    //                 })
                    //             } else {
                    //                 CurrentCubicalObj = CurrentCubicalObj.cubicalData;
                    //             }
                    //             tmpUserobj = globalData.arrUsers.find(k => k.Hmi == strHmi);
                    //             await objMonit.monit({ case: 'Login', Hmi: strHmi, data: tmpUserobj });
    
                    //         }
                    //     }
                    // }
    
                    let timeout = await models.tbl_setallparameter.findAll()
                    timeout = timeout[0].tbl_config_TimeoutPeriod
                    response.data.timeOut = timeout
                    console.log(response);
                    console.log(response.data);
                    let obj = {
                        status: "success",
                        timeOut: response.data.timeOut,
                        userName: checkuseractive.data.result.UserInitials,
                        userId: userId,
                        result: response.data.result,
                    }
                    return obj
                }
                //If user is not authenticated then 
                if (responses.data.response == 'Authenticated failed') {
                    return { status: "fail", result: "Incorrect User ID or Password" }
                }
                // }
            } else {
                console.log("User not Valid");
                return { status: "fail", result: "Validate User on Software and Try Again" }
            }
            //End 03/06/23
        } catch (error) {
            console.error(error);
        }
    }
}
module.exports = LoginModal