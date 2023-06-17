const globalData = require('../../global/globalData');
const clsMqttSender = require('../Mqtt/mqttSender.class');
const Global_NomenClature = require('../../global/GLOBAL_NOMENCLATURE');

const mqttSender = new clsMqttSender();

class Monitor {

    async monit(Mobj) {
        try {
            let tempMonitID;
            let strHmi = Mobj.Hmi;
            switch (Mobj.case) {
                case 'Login':
                    tempMonitID = globalData.arrMonitCubic.find(k => k.Hmi == strHmi);
                    if (tempMonitID != undefined) {
                        tempMonitID.status = 'Online';
                        tempMonitID.userName = Mobj.data.UserName;
                        tempMonitID.userID = Mobj.data.UserId;
                        tempMonitID.weight = [];
                        mqttSender.sendData(Global_NomenClature.MonitSocket, JSON.stringify(globalData.arrMonitCubic))
                    }
                    break;
                case 'BeforeCalibration':
                    tempMonitID = globalData.arrMonitCubic.find(k => k.Hmi == strHmi);
                    if (tempMonitID != undefined) {
                        tempMonitID.status = 'Online';
                        tempMonitID.selection1 = "NA";
                        tempMonitID.bulkData = '';
                        tempMonitID.selection2 = "NA";
                        tempMonitID.selection3 = "NA";
                        tempMonitID.selection4 = "NA";
                        tempMonitID.selection5 = "NA";
                        mqttSender.sendData(Global_NomenClature.MonitSocket, JSON.stringify(globalData.arrMonitCubic))
                    }
                    break;
                case 'Calibration':
                    tempMonitID = globalData.arrMonitCubic.find(k => k.Hmi == strHmi);
                    if (tempMonitID != undefined) {
                        tempMonitID.status = 'Online';
                        tempMonitID.selection1 = 'Calibration';
                        tempMonitID.bulkData = '';
                        tempMonitID.selection2 = Mobj.data.calibType;
                        tempMonitID.selection3 = "NA";
                        tempMonitID.selection4 = "NA";
                        tempMonitID.selection5 = "NA";
                        mqttSender.sendData(Global_NomenClature.MonitSocket, JSON.stringify(globalData.arrMonitCubic))
                    }
                    break;
                case 'CalibWeight':
                    tempMonitID = globalData.arrMonitCubic.find(k => k.Hmi == strHmi);
                    if (tempMonitID != undefined) {
                        tempMonitID.status = 'Online';
                        tempMonitID.weight.push({ wt: Mobj.data.Weight, flag: 'in' })
                        mqttSender.sendData(Global_NomenClature.MonitSocket, JSON.stringify(globalData.arrMonitCubic))
                    }
                    break;
                case 'CalibFail':
                    tempMonitID = globalData.arrMonitCubic.find(k => k.Hmi == strHmi);
                    if (tempMonitID != undefined) {
                        tempMonitID.status = 'Online';
                        tempMonitID.weight = [];
                        tempMonitID.selection1 = 'NA';
                        tempMonitID.selection2 = 'NA';
                        tempMonitID.selection3 = 'NA';
                        tempMonitID.selection4 = 'NA';
                        tempMonitID.selection5 = "NA";
                        tempMonitID.bulkData = `${Mobj.data.calibType} Calibration Failed`;
                        mqttSender.sendData(Global_NomenClature.MonitSocket, JSON.stringify(globalData.arrMonitCubic))
                    }
                    break;
                case 'CalibDone':
                    tempMonitID = globalData.arrMonitCubic.find(k => k.Hmi == strHmi);
                    if (tempMonitID != undefined) {
                        tempMonitID.status = 'Online';
                        tempMonitID.weight = [];
                        tempMonitID.bulkData = `${Mobj.data.calibType} Calibration Completed`;
                        mqttSender.sendData(Global_NomenClature.MonitSocket, JSON.stringify(globalData.arrMonitCubic))
                    }
                    break;
                case 'Product':
                    tempMonitID = globalData.arrMonitCubic.find(k => k.Hmi == strHmi);
                    if (tempMonitID != undefined) {
                        tempMonitID.status = 'Online';
                        tempMonitID.weight = [];
                        tempMonitID.selection1 = Mobj.data.data.PrId;
                        tempMonitID.selection2 = Mobj.data.data.prName;
                        tempMonitID.selection3 = Mobj.data.data.batch;
                        tempMonitID.selection4 = 'NA';
                        tempMonitID.selection5 = "NA";
                        tempMonitID.bulkData = "";
                        mqttSender.sendData(Global_NomenClature.MonitSocket, JSON.stringify(globalData.arrMonitCubic))
                    }
                    break;
                case 'Weighment':
                    tempMonitID = globalData.arrMonitCubic.find(k => k.Hmi == strHmi);
                    if (tempMonitID != undefined) {
                        tempMonitID.status = 'Online';
                        tempMonitID.selection4 = Mobj.data.ArAndLot;
                        tempMonitID.bulkData = "started";
                        mqttSender.sendData(Global_NomenClature.MonitSocket, JSON.stringify(globalData.arrMonitCubic))
                    }
                    break;
                case 'ActualData':
                    tempMonitID = globalData.arrMonitCubic.find(k => k.Hmi == strHmi);
                    if (tempMonitID != undefined) {
                        tempMonitID.status = 'Online';
                        if (Mobj.data.Tare) {
                            tempMonitID.dweight.tare = Mobj.data.data
                        } else {
                            tempMonitID.dweight.gross = Mobj.data.data;
                            tempMonitID.dweight.net = Mobj.data.netWt;
                        }
                        tempMonitID.bulkData = "started";
                        mqttSender.sendData(Global_NomenClature.MonitSocket, JSON.stringify(globalData.arrMonitCubic))
                    }
                    break;
                case 'ClearWeight':
                    tempMonitID = globalData.arrMonitCubic.find(k => k.Hmi == strHmi);
                    if (tempMonitID != undefined) {
                        tempMonitID.dweight.tare = 0
                        tempMonitID.dweight.gross = 0;
                        tempMonitID.dweight.net = 0;
                        tempMonitID.bulkData = '';
                        tempMonitID.bulkData = "started";
                        mqttSender.sendData(Global_NomenClature.MonitSocket, JSON.stringify(globalData.arrMonitCubic))
                    }
                    break;
                case 'Logout':
                    tempMonitID = globalData.arrMonitCubic.find(k => k.Hmi == strHmi);
                    if (tempMonitID != undefined) {
                        tempMonitID.status = 'Offline';
                        tempMonitID.userName = 'NA';
                        tempMonitID.userID = 'NA';
                        tempMonitID.selection1 = 'NA';
                        tempMonitID.selection2 = 'NA';
                        tempMonitID.selection3 = 'NA';
                        tempMonitID.selection4 = 'NA';
                        tempMonitID.selection5 = "NA";
                        tempMonitID.weight = [];
                        tempMonitID.bulkData = '';
                        mqttSender.sendData(Global_NomenClature.MonitSocket, JSON.stringify(globalData.arrMonitCubic))
                    }
                    break;
                case 'TestStart':
                    tempMonitID = globalData.arrMonitCubic.find(k => k.Hmi == strHmi);
                    if (tempMonitID != undefined) {
                        tempMonitID.status = 'Online';
                        tempMonitID.selection1 = Mobj.data.Product;
                        tempMonitID.selection2 = Mobj.data.Batch;
                        let type = "Weighment";
                        if(Mobj.data.TestType == "TBTTST" || Mobj.data.TestType == "DIFFER"){
                            type = "Test"
                        }
                        tempMonitID.selection3 = type;
                        tempMonitID.selection4 = Mobj.data.TestType;
                        tempMonitID.selection5 = "NA";
                        tempMonitID.weight = [];
                        tempMonitID.bulkData = "";
                        //tempMonitID.bulkData = "started";
                        mqttSender.sendData(Global_NomenClature.MonitSocket, JSON.stringify(globalData.arrMonitCubic))
                    }
                    break;
                case 'TestWeight':
                    tempMonitID = globalData.arrMonitCubic.find(k => k.Hmi == strHmi);
                    if (tempMonitID != undefined) {
                        tempMonitID.status = 'Online';
                        tempMonitID.weight.push({
                            wt: Mobj.data.Weight,
                            flag: 'in',
                            srNo: Mobj.data.srNo,
                            message: Mobj.data.message
                        })
                        mqttSender.sendData(Global_NomenClature.MonitSocket, JSON.stringify(globalData.arrMonitCubic))
                    }
                    break;
                case 'ReportStatus':
                    tempMonitID = globalData.arrMonitCubic.find(k => k.Hmi == strHmi);
                    if (tempMonitID != undefined) {
                        tempMonitID.status = 'Online';
                        tempMonitID.selection5 = Mobj.data.message;
                        mqttSender.sendData(Global_NomenClature.MonitSocket, JSON.stringify(globalData.arrMonitCubic))
                    }
                    break;
                    case 'DiffTestWeight':
                    tempMonitID = globalData.arrMonitCubic.find(k => k.Hmi == strHmi);
                    if (tempMonitID != undefined) {
                        tempMonitID.status = 'Online';
                        tempMonitID.weight.push({
                            wt: Mobj.data.Weight,
                            flag: 'in',
                            srNo: Mobj.data.srNo,
                            message: Mobj.data.message
                        })
                        
                        mqttSender.sendData(Global_NomenClature.MonitSocket, JSON.stringify(globalData.arrMonitCubic))
                    }
                    break;
                    case 'TestDTWeight':
                        tempMonitID = globalData.arrMonitCubic.find(k => k.Hmi == strHmi);
                        if (tempMonitID != undefined) {
                            tempMonitID.status = 'Online';
                            tempMonitID.weight.push({
                                wt: Mobj.data.Weight,
                                flag: 'in',
                                jar:Mobj.data.Jar,
                                // srNo: srNo,
                                message: Mobj.data.message
                            })
                            
                            mqttSender.sendData(Global_NomenClature.MonitSocket, JSON.stringify(globalData.arrMonitCubic))
                        }
            }
        } catch (error) {
            throw new Error(error)
        }

    }

}
module.exports = Monitor;