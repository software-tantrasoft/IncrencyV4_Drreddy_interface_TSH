const globalData = require('../global/globalData')
const Database = require('../database/clsQueryProcess');
const { models } = require('../../config/dbConnection');
const { where } = require('sequelize/lib/sequelize');
const { Logout } = require('../global/GLOBAL_NOMENCLATURE');
const database = new Database();

/** 
    @description this class holds function whenever user disconnects or logout from hardware
**/
class ClearGlobalArray {
    async clearDetails(Hmi,logout) {
        try {
            if (globalData.arrUsers.find(k => k.Hmi == Hmi) != undefined) {
                await this.logoutUser('', globalData.arrUsers[0].UserId)
            }
            // (globalData.arrAllCanList.findIndex((element) => element.Hmi === Hmi)) == -1 ?   globalData.arrAllCanList : globalData.arrAllCanList.splice(globalData.arrAllCanList.findIndex((element) => element.Hmi === Hmi), 1);
            (globalData.arrUsers.findIndex((element) => element.Hmi === Hmi)) == -1 ? globalData.arrUsers : globalData.arrUsers.splice(globalData.arrUsers.findIndex((element) => element.Hmi === Hmi), 1);
            if(logout == true){
            globalData.arrUserRights.findIndex((element) => element.Hmi == Hmi) == -1 ? globalData.arrUserRights : globalData.arrUserRights.splice(globalData.arrUserRights.findIndex((element) => element.Hmi == Hmi), 1);
            }
            (globalData.arrCurrentOperationStatus.findIndex((element) => element.Hmi === Hmi)) == -1 ? globalData.arrCurrentOperationStatus : globalData.arrCurrentOperationStatus.splice(globalData.arrCurrentOperationStatus.findIndex((element) => element.Hmi === Hmi), 1);
            // (globalData.weighMasterEntry.findIndex((element) => element.Hmi === Hmi)) == -1 ?   globalData.weighMasterEntry : globalData.weighMasterEntry.splice(globalData.weighMasterEntry.findIndex((element) => element.Hmi === Hmi), 1);
            // (globalData.arrProductTypeArray.findIndex((element) => element.Hmi === Hmi)) == -1 ?   globalData.arrProductTypeArray : globalData.arrProductTypeArray.splice(globalData.arrProductTypeArray.findIndex((element) => element.Hmi === Hmi), 1);
            // (globalData.arrVaccumDiffCounter.findIndex((element) => element.Hmi === Hmi)) == -1 ?   globalData.arrVaccumDiffCounter : globalData.arrVaccumDiffCounter.splice(globalData.arrVaccumDiffCounter.findIndex((element) => element.Hmi === Hmi), 1);
            // (globalData.arrLeakCounter.findIndex((element) => element.Hmi === Hmi)) == -1 ?   globalData.arrLeakCounter : globalData.arrLeakCounter.splice(globalData.arrLeakCounter.findIndex((element) => element.Hmi === Hmi), 1);
            (globalData.arrOfBalListWithPortNumber.findIndex((element) => element.Hmi === Hmi)) == -1 ? globalData.arrOfBalListWithPortNumber : globalData.arrOfBalListWithPortNumber.splice(globalData.arrOfBalListWithPortNumber.findIndex((element) => element.Hmi === Hmi), 1);
            (globalData.arrsetAllParameters.findIndex((element) => element.Hmi === Hmi)) == -1 ? globalData.arrsetAllParameters : globalData.arrsetAllParameters.splice(globalData.arrsetAllParameters.findIndex((element) => element.Hmi === Hmi), 1);
            (globalData.arrCalibrationSequnce.findIndex((element) => element.Hmi === Hmi)) == -1 ? globalData.arrCalibrationSequnce : globalData.arrCalibrationSequnce.splice(globalData.arrCalibrationSequnce.findIndex((element) => element.Hmi === Hmi), 1);
            (globalData.arrSortedCalib.findIndex((element) => element.Hmi === Hmi)) == -1 ? globalData.arrSortedCalib : globalData.arrSortedCalib.splice(globalData.arrSortedCalib.findIndex((element) => element.Hmi === Hmi), 1);
            (globalData.arrSelectedBalWithHmi.findIndex((element) => element.Hmi === Hmi)) == -1 ? globalData.arrSelectedBalWithHmi : globalData.arrSelectedBalWithHmi.splice(globalData.arrSelectedBalWithHmi.findIndex((element) => element.Hmi === Hmi), 1);
            (globalData.arrBalanceRecalibStatus.findIndex((element) => element.Hmi === Hmi)) == -1 ? globalData.arrBalanceRecalibStatus : globalData.arrBalanceRecalibStatus.splice(globalData.arrBalanceRecalibStatus.findIndex((element) => element.Hmi === Hmi), 1);
            (globalData.calibrationStatus.findIndex((element) => element.Hmi === Hmi)) == -1 ? globalData.calibrationStatus : globalData.calibrationStatus.splice(globalData.calibrationStatus.findIndex((element) => element.Hmi === Hmi), 1);
            (globalData.arrBalCaibDet.findIndex((element) => element.Hmi === Hmi)) == -1 ? globalData.arrBalCaibDet : globalData.arrBalCaibDet.splice(globalData.arrBalCaibDet.findIndex((element) => element.Hmi === Hmi), 1);
            (globalData.arrcalibType.findIndex((element) => element.Hmi === Hmi)) == -1 ? globalData.arrcalibType : globalData.arrcalibType.splice(globalData.arrcalibType.findIndex((element) => element.Hmi === Hmi), 1);
            (globalData.arrBalance.findIndex((element) => element.Hmi === Hmi)) == -1 ? globalData.arrBalance : globalData.arrBalance.splice(globalData.arrBalance.findIndex((element) => element.Hmi === Hmi), 1);
            (globalData.arrBalCalibWeights.findIndex((element) => element.Hmi === Hmi)) == -1 ? globalData.arrBalCalibWeights : globalData.arrBalCalibWeights.splice(globalData.arrBalCalibWeights.findIndex((element) => element.Hmi === Hmi), 1);
            (globalData.arrsendWt.findIndex((element) => element.Hmi === Hmi)) == -1 ? globalData.arrsendWt : globalData.arrsendWt.splice(globalData.arrsendWt.findIndex((element) => element.Hmi === Hmi), 1);
            (globalData.arrCalibCounterApi.findIndex((element) => element.Hmi === Hmi)) == -1 ? globalData.arrCalibCounterApi : globalData.arrCalibCounterApi.splice(globalData.arrCalibCounterApi.findIndex((element) => element.Hmi === Hmi), 1);
            (globalData.arrCalibInsertCounter.findIndex((element) => element.Hmi === Hmi)) == -1 ? globalData.arrCalibInsertCounter : globalData.arrCalibInsertCounter.splice(globalData.arrCalibInsertCounter.findIndex((element) => element.Hmi === Hmi), 1);
            (globalData.arrWeighmentCounter.findIndex((element) => element.Hmi === Hmi)) == -1 ? globalData.arrWeighmentCounter : globalData.arrWeighmentCounter.splice(globalData.arrWeighmentCounter.findIndex((element) => element.Hmi === Hmi), 1); //counter clear
            (globalData.arrCalibCounter.findIndex((element) => element.Hmi === Hmi)) == -1 ? globalData.arrCalibCounter : globalData.arrCalibCounter.splice(globalData.arrCalibCounter.findIndex((element) => element.Hmi === Hmi), 1); //counter clear
            (globalData.arrOutFlagForTest.findIndex((element) => element.Hmi === Hmi)) == -1 ? globalData.arrOutFlagForTest : globalData.arrOutFlagForTest.splice(globalData.arrOutFlagForTest.findIndex((element) => element.Hmi === Hmi), 1);
            (globalData.arrProtocolData.findIndex((element) => element.Hmi === Hmi)) == -1 ? globalData.arrProtocolData : globalData.arrProtocolData.splice(globalData.arrProtocolData.findIndex((element) => element.Hmi === Hmi), 1);

        }
        catch (error) {
            throw new Error(error)
        }
    }


    async logoutUser(userId) {
        try {
            let objUpdateLoginData = await models.tbl_users.update({
                active: 0,
                HostName: 0,
                source: 'ResberryPi'
            }, {
                where: {
                    UserID: userId
                }
            })
            objUpdateLoginData;
        } catch (error) {
            throw new Error(error)
        }
    }
    async logoutMultipleUser(arrObj){
        try {
            for (let obj of arrObj) {
                if (obj.userName != 'NONE') {
                    await this.logoutUser('', Object.values(obj)[0])
                }
            }
        } catch (error) {
            throw new Error(error)

        }
    }

}


module.exports = ClearGlobalArray;