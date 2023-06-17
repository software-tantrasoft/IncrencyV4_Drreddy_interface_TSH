const clsDatabase = require('../database/clsQueryProcess');
const globalData = require('../global/globalData');
const GLOBAL_NOMENCLATURE = require('../global/GLOBAL_NOMENCLATURE');
const serverConfig = require('../global/serverConfig');
const clsCommonOperation = require('./Product/clsCommonInsertOperation.model');

const database = new clsDatabase();
const objCommonOperation = new clsCommonOperation();

// const sequelize = require('../../models').sequelize;
// const {tbl_balance, tbl_vernier, tbl_otherequipment} = require('../../models/init-models').initModels(sequelize)

const { tbl_balance ,tbl_vernier , tbl_otherequipment  } = require('../../config/dbConnection').models;
const sequelize  = require('../../config/dbConnection').sequelize

class ConfigSetting {

    async getconfigdata(table_name, coloum_name, value, prop_name, type, port, Operation, strHmi) {
        try {
            const obj = {
                str_tableName: table_name,
                data: '*',
                condition: [
                    { str_colName: coloum_name, value: value, comp: 'eq' }
                ]
            }


            let queryTable;
            if(type == GLOBAL_NOMENCLATURE.Balance){
                queryTable = tbl_balance
            }else if(type == GLOBAL_NOMENCLATURE.Vernier){
                queryTable = tbl_vernier
            }else{
                queryTable = tbl_otherequipment
            }
         
          let getDetails = await queryTable.findAll({
                where:{
                    [`${coloum_name}`] :  value 
                }
            })

           
            let R_timeout = prop_name + '_receiveTimeout';
            let B_Mode = prop_name + '_bulkMode';
            let B_Rate = prop_name + '_baudRate';
            let D_Bit = prop_name + '_dataBit';
            let Parity_bit = prop_name + '_parity';
            let S_Bit = prop_name + '_stopBit';
            let Stability_Threshold_value = prop_name + '_stabilityThreshold';

            getDetails = [getDetails]



            let Receive_Timeout = getDetails[0][0][R_timeout];
            let Bulk_Mode = getDetails[0][0][B_Mode];
            let Baud_Rate = getDetails[0][0][B_Rate];
            let Data_Bit = getDetails[0][0][D_Bit];
            let Parity = getDetails[0][0][Parity_bit];
            let Stop_Bit = getDetails[0][0][S_Bit];
            let Stability_Threshold = getDetails[0][0][Stability_Threshold_value];
            let Tare_Command = getDetails[0][0]['Bal_TareCommand'];
            let intBaud_Rate = type == "Balance" ? Baud_Rate == null ? 9600 : Baud_Rate : Baud_Rate == null ? 4800 : Baud_Rate;
            let intDataBit = type == "Balance" ? Data_Bit == null ? 8 : Data_Bit : Data_Bit == null ? 7 : Data_Bit;
            let strParity = type == "Balance" ? Parity == null ? "None" : Parity : Parity == null ? "Even" : Parity;

            const configSetting = {
                type: type,
                portNo: port,
                Receive_Timeout: Receive_Timeout,
                Bulk_Mode: Bulk_Mode == null ? 1 : Bulk_Mode.readIntLE(),
                Baud_Rate: intBaud_Rate,
                Data_Bit: intDataBit,
                Parity: strParity,
                Stop_Bit: Stop_Bit == null ? 1 : Stop_Bit,
                Stability_Threshold: Stability_Threshold == undefined ? 0 : Stability_Threshold,

            }

            if (type == 'Balance') {
                let unitOfBalance = getDetails[0][0].Bal_Unit;
                let tare = getDetails[0][0].Bal_AutoTare == undefined ? 0 : getDetails[0][0].Bal_AutoTare[0];
                let disable = getDetails[0][0].Bal_Disable;
                let checkZeroTimeout = getDetails[0][0].Bal_checkZeroTimeout;
                let MinThreshold = getDetails[0][0].Bal_MinThreshold;
                if (MinThreshold != undefined) {
                    if (unitOfBalance == 'gm') {
                        MinThreshold = parseFloat(MinThreshold / 1000);
                    } else if (unitOfBalance == 'kg') {
                        MinThreshold = parseFloat(MinThreshold / 100000);
                    }
                }
                let MinCalibThreshold = getDetails[0][0].Bal_MinCalibThreshold;
                configSetting['Auto_Tare'] = tare == undefined ? false : tare == 1 ? true : false;
                configSetting['Disable'] = disable == 1 ? true : false;
                configSetting['Zero_Timeout'] = checkZeroTimeout == undefined ? 5 : checkZeroTimeout;
                configSetting['Tare_Command'] = Tare_Command == undefined ? 'T' : Tare_Command;
                if (Operation == "Calibration") {
                    MinThreshold = MinThreshold == undefined ? 5 : MinCalibThreshold
                } else if (Operation == "Weighment") {
                    MinThreshold = MinThreshold == undefined ? unitOfBalance == 'gm' ? parseFloat("0.014") : unitOfBalance == 'kg' ? parseFloat("0.00014") : parseFloat(14) : MinThreshold;
                }
                configSetting['Min_Threshold'] = MinThreshold;
                configSetting['Balance_Pattern'] = `[-0-9]{1,}(\\.\\d*)?\\s{1,}[a-z]{1,}`;
                //configSetting['MinCalibThreshold'] = MinCalibThreshold == undefined ? 5 : MinCalibThreshold
            }

            if (type == GLOBAL_NOMENCLATURE.Hardness ){
                configSetting["Baud_Rate"] = 9600,
                configSetting["Data_Bit"] = 8,
                configSetting["Parity"] = "None"
                configSetting["Receive_Timeout"] = 100
                configSetting['Bulk_Data_Sent_Mode'] = "Manual"
                configSetting['Bulk_Instrument_Config'] = {
                    "Instrument_Model": "MT50",
                    "Data_Count": 1
                }
            }

            // let hmiEntryinConfig = globalData.arrConfigSettings.find(k=>k.Hmi == strHmi);
            // if(hmiEntryinConfig == undefined){
            //     globalData.arrConfigSettings.push({
            //         Hmi:strHmi,
            //         configSetting:configSetting
            //     })
            // }else{
            //     hmiEntryinConfig.configSetting = configSetting
            // }
            return configSetting;
        } catch (error) {
            throw new Error(error);
        }

    }

    async GetConfigSetting(intIdsNo, InstrumentType) {
        try {

            let getdaqdetails = await objCommonOperation.getCubicalData(intIdsNo);
            let i = 1;
            let arrAllListOfBal = [];
            let mainsetting = [];

            for (let obj in getdaqdetails[0]) {
                if (getdaqdetails[0][`Sys_Port${i}`] == undefined ||
                    getdaqdetails[0][`Sys_Port${i}`] == "None" ||
                    getdaqdetails[0][`Sys_Port${i}`] == "NULL" ||
                    getdaqdetails[0][`Sys_Port${i}`] == null) {
                    i++;
                    continue;
                }
                else {
                    let type = getdaqdetails[0][`Sys_Port${i}`];
                    if (getdaqdetails[0][`Sys_Port${i}`] == GLOBAL_NOMENCLATURE.Balance) {

                        let obj = { "BalanceId": getdaqdetails[0][`Sys_BalID`], 'PortNo': i }

                        let balance_id = obj.BalanceId;
                        var port = `${i}`;
                        let bal_setting = await this.getconfigdata('tbl_balance', 'Bal_ID', balance_id, 'Bal', type, port, "Weighment");
                        mainsetting.push(bal_setting);
                    }
                    else if (getdaqdetails[0][`Sys_Port${i}`] == GLOBAL_NOMENCLATURE.IPCBalance) {
                        // InstrumentType = GLOBAL_NOMENCLATURE.Balance;
                        let obj = { "BalanceId": getdaqdetails[0][`Sys_BinBalID`], 'PortNo': i }

                        let balance_id = obj.BalanceId;
                        var port = `${i}`;
                        let bal_setting = await this.getconfigdata('tbl_balance', 'Bal_ID', balance_id, 'Bal', 'Balance', port, "Weighment");
                        mainsetting.push(bal_setting);
                    }
                    else if (getdaqdetails[0][`Sys_Port${i}`] == GLOBAL_NOMENCLATURE.Vernier) {

                        let obj = { "VernierId": getdaqdetails[0][`Sys_VernierID`], "PortNo": i }
                        let vernier_id = obj.VernierId;
                        let port = `${i}`;
                        let ver_setting = await this.getconfigdata('tbl_vernier', 'VernierID', vernier_id, 'Ver', type, port, "Weighment");
                        mainsetting.push(ver_setting);
                    }
                    else if (getdaqdetails[0][`Sys_Port${i}`] == GLOBAL_NOMENCLATURE.Hardness ||
                    getdaqdetails[0][`Sys_Port${i}`] == GLOBAL_NOMENCLATURE.TabletTester
                    ) {

                        let obj = {
                            "HardnessId": getdaqdetails[0][`Sys_HardID`], "PortNo": i, Type: getdaqdetails[0][`Sys_Port${i}`],
                        }
                        let Hardness_id = obj.HardnessId;
                        let port = `${i}`;
                        let Hardness_setting = await this.getconfigdata('tbl_otherequipment', 'Eqp_ID', Hardness_id, 'Eqp', type, port, "Weighment");
                        mainsetting.push(Hardness_setting);
                    }
                    else if (getdaqdetails[0][`Sys_Port${i}`] == "Friabilator" ||
                        getdaqdetails[0][`Sys_Port${i}`] == "Friability"
                    ) {
 
                        let type = "Friability";
                        if(getdaqdetails[0][`Sys_Port${i}`] == "Friabilator"){
                           type = "Friabilator"
                        }

                        let obj = {
                            "FriabilityId": getdaqdetails[0][`Sys_FriabID`], "PortNo": i, Type: type
                        }
                        let Friability_id = obj.FriabilityId;
                        let port = `${i}`;
                        let Friability_setting = await this.getconfigdata('tbl_otherequipment', 'Eqp_ID', Friability_id, 'Eqp', type, port, "Weighment");
                        mainsetting.push(Friability_setting);
                    }
                    else if (getdaqdetails[0][`Sys_Port${i}`] == GLOBAL_NOMENCLATURE.DT) {

                        let obj = {
                            "DTId": getdaqdetails[0][`Sys_DTID`], "PortNo": i, Type: getdaqdetails[0][`Sys_Port${i}`]
                        }
                        let DTId_id = obj.DTId;
                        let port = `${i}`;
                        let DTId_setting = await this.getconfigdata('tbl_otherequipment', 'Eqp_ID', DTId_id, 'Eqp', type, port, "Weighment");
                        mainsetting.push(DTId_setting);
                    }
                    else if ((getdaqdetails[0][`Sys_Port${i}`] == GLOBAL_NOMENCLATURE.MoistureAnalyzer || getdaqdetails[0][`Sys_Port${i}`] == "LOD")) {

                        let obj = {
                            "MoistureAnalyserId": getdaqdetails[0]['Sys_MoistID'], "PortNo": i, Type: getdaqdetails[0][`Sys_Port${i}`]
                        }
                        let MoistureAnalyser_id = obj.MoistureAnalyserId;
                        let port = `${i}`;
                        let MoistureAnalyser_setting = await this.getconfigdata('tbl_otherequipment', 'Eqp_ID', MoistureAnalyser_id, 'Eqp', type, port, "Weighment");
                        mainsetting.push(MoistureAnalyser_setting);
                    }
                    else if (getdaqdetails[0][`Sys_Port${i}`] == GLOBAL_NOMENCLATURE.TappedDensity) {

                        let obj = {
                            "TappedDensityId": getdaqdetails[0]['Sys_TapDensityID'], "PortNo": i, Type: getdaqdetails[0][`Sys_Port${i}`]
                        }
                        let TappedDensity_id = obj.TappedDensityId;
                        let port = `${i}`;
                        let MoistureAnalyser_setting = await this.getconfigdata('tbl_otherequipment', 'Eqp_ID', TappedDensity_id, 'Eqp', type, port, "Weighment");
                        mainsetting.push(MoistureAnalyser_setting);
                    }

                    arrAllListOfBal.push(getdaqdetails[0][`Port${i}_Instru_Id`]);
                    i++;
                }
                //console.log(arrAllListOfBal);
            }
            let menuDetails = mainsetting.filter(k => k.type == InstrumentType);
            return menuDetails;
            //return mainsetting
        }
        catch (e) {
            throw new Error(e);
        }
        finally {

        }
    }

}

module.exports = ConfigSetting;