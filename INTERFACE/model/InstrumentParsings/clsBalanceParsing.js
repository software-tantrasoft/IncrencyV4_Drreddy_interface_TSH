const ClassweighmentData = require('../clsProcessWeighment.model');
const classHmi = require('../hmiDetail.model');
const mqttProtocols = require('../../global/GLOBAL_NOMENCLATURE');
const globalData = require('../../global/globalData');
const clsMqttSender = require('../../model/Mqtt/mqttSender.class');
const GLOBAL_NOMENCLATURE = require('../../global/GLOBAL_NOMENCLATURE');
const { models } = require('../../../config/dbConnection');

const objWeighmentData = new ClassweighmentData();
const objHmi = new classHmi();
const mqttSender = new clsMqttSender();

class BalanceParsing {

    precision(a) {
        if (!isFinite(a)) return 0;
        var e = 1, p = 0;
        while (Math.round(a * e) / e !== a) { e *= 10; p++; }
        return p;
    }

    async parsingBalanceData(dataObj) {
        try {

            let { str_Protocol, strResberryPi, strHmi,
                ProtocolPortNo, InstrumentId, ProtocolName, InstrumentType } = dataObj;
            //here also different balance have different parsing logic
            let data = str_Protocol.split(":")[2].trim();
            let arrWtDetail = data.substr(data.search(/\d/));
            let ProtocolDataAndUnit = arrWtDetail.split(" ");
            let arrRemoveBlankSpace = ProtocolDataAndUnit.filter(item => item);
            let actualWt = arrRemoveBlankSpace[0];
            actualWt = parseFloat(actualWt).toFixed(this.precision(Number(actualWt)));
            let ProtocolDecPoint = (arrRemoveBlankSpace[0].split('.')[1] == undefined) ? 0 : arrRemoveBlankSpace[0].split('.')[1].length;
            let negativeWeightCheck = data.substr(data.search(/-/));
            let ProtocolUnit = arrRemoveBlankSpace[1];
            ProtocolUnit = ProtocolUnit == undefined ? 'g' : ProtocolUnit;
            let currentOpStatus = globalData.arrCurrentOperationStatus.find(k => k.Hmi == strHmi);
            let tempCailibType = globalData.arrcalibType.find(k => k.Hmi == strHmi);
            let arrPortDetailForStart1 = globalData.arrSelectedMenu.find(k => k.Hmi == strHmi);//await objHmi.idsPortSetting(strHmi);
            let hmiEntryinConfig = globalData.arrConfigSettings.find((k) => k.Hmi == strHmi).configSetting;
            let autoTare = hmiEntryinConfig[0].Auto_Tare;
            let tareCommand = hmiEntryinConfig[0].Tare_Command.concat(`\r\n`);
            //Instrument Type,ID,PortNo
            //let intPortNo1 = arrPortDetailForStart1.port;
            let strInstrumentType = InstrumentType;
            let strInstrumentId = InstrumentId;

            const __parameterWeighmentObj = {
                idsNo: strResberryPi,
                Hmi: strHmi,
                actualWt: actualWt,
                decPoint: ProtocolDecPoint,
                unit: ProtocolUnit,
                instrumentId: strInstrumentId,
                ProtocolPortNo: ProtocolPortNo
            }
            if (arrPortDetailForStart1.selectedProductDetail.unit != ProtocolUnit) {
                if (ProtocolUnit.startsWith('g')) {
                    ProtocolUnit = ProtocolUnit ==  "g" ? "gm":"gm"
                } else {
                    mqttSender.sendData(strHmi, `${mqttProtocols.DisplayMessage}Invalid Unit Received`)      
                    // if (autoTare)  mqttSender.sendData( strHmi,`${mqttProtocols.ComWrite}${ProtocolPortNo}:${tareCommand}`);
                    return; 
                }
            }


            //make function for it and return boolean 
            if (actualWt.endsWith('mg' || 'g' || 'kg' || 'gm')) {
                //log protocol in file
                // loggers.MqttProtocolLogger.info(`protocol : ${mqttProtocols.DisplayMessage}Invalid Weight Received sended to device ${strHmi}`)
            mqttSender.sendData(strHmi, `${mqttProtocols.DisplayMessage}Invalid Weight Received`)
            // if (autoTare)  mqttSender.sendData(strHmi,`${mqttProtocols.ComWrite}${ProtocolPortNo}:${tareCommand}`);
            return; 
        }

            if (actualWt == (undefined || "NaN" || 0 || NaN) || negativeWeightCheck.charAt(0) == "-" ||
                ProtocolPortNo == (undefined || "") || data.startsWith('I4') || data == "") {

                //log protocol in file
                // loggers.MqttProtocolLogger.info(`protocol : ${mqttProtocols.DisplayMessage}Invalid Weight Received sended to device ${strHmi}`)
                mqttSender.sendData(strHmi, `${mqttProtocols.DisplayMessage}Invalid Weight Received`)
                // if (autoTare)  mqttSender.sendData(strHmi,`${mqttProtocols.ComWrite}${ProtocolPortNo}:${tareCommand}`)
                return
            }


            if (data !== "") {
                if (ProtocolDataAndUnit.length < 1 || ProtocolDataAndUnit[1] == "") {
                    //log protocol in file
                    // loggers.MqttProtocolLogger.info(`protocol : ${mqttProtocols.DisplayMessage}Invalid Weight Received sended to device ${strHmi}`)
                    mqttSender.sendData(strHmi, `${mqttProtocols.DisplayMessage}Invalid Weight Received`);
                    // loggers.MqttProtocolLogger.info(`protocol : ${mqttProtocols.DisplayMessage}Invalid Weight Received sended to device ${strHmi}`)
                    // mqttSender.sendData(strHmi, `${mqttProtocols.DisplayMessage}Invalid Weight Received`);
                    // if (autoTare)  mqttSender.sendData( strHmi,`${mqttProtocols.ComWrite}${ProtocolPortNo}:${tareCommand}`);
                    return;
                }

                if (ProtocolUnit === "A") {
                    return;
                } else {
                    if (strInstrumentType == GLOBAL_NOMENCLATURE.Balance) {
                        if (ProtocolUnit == undefined) {
                            ProtocolUnit = ProtocolUnit == undefined ? "g" : "gm" ? "gm" : ProtocolUnit;
                        } else {
                            if ((ProtocolUnit != "g") && (ProtocolUnit != "gm") && (ProtocolUnit != 'Kg') && (ProtocolUnit != "mg") && (ProtocolUnit != 'gm')) {
                                //log protocol in file
                                // loggers.MqttProtocolLogger.info(`protocol : ${mqttProtocols.DisplayMessage}Invalid Data String sended to device ${strHmi}`)
                                mqttSender.sendData(strHmi, `${mqttProtocols.DisplayMessage}Invalid Data String`)
                                // if (autoTare)  mqttSender.sendData(strHmi,`${mqttProtocols.ComWrite}${ProtocolPortNo}:${tareCommand}`);
                                return;
                            } else {
                                // if (ProtocolUnit == "mg") {
                                //     actualWt = actualWt / 1000;
                                // } else if (ProtocolUnit == ("kg" || "Kg" || "KG")) {
                                //     actualWt = actualWt * 1000;
                                // }
                                // ProtocolUnit = ProtocolUnit == undefined ? "g" : ProtocolUnit;

                            }
                        }

                    } else {
                        //log protocol in file
                        // loggers.MqttProtocolLogger.info(`unknown instrument`)
                        console.log('unknown instrument');
                    }

                    //decision making 
                    if (tempCailibType == undefined) {
                        if (currentOpStatus == undefined) {
                            // loggers.MqttProtocolLogger.info(`Weight recieve without any api called`)
                            console.log('wt recieve without any api called');
                            return;
                        } else if (currentOpStatus.Weighment == 1 && currentOpStatus.testType == "Weighment") {

                            await objWeighmentData.ParsingTestData(__parameterWeighmentObj);
                        }
                    } else {
                        var result;
                        var calibType = tempCailibType.calibType;
                        switch (calibType.toLowerCase()) {
                            case 'daily':
                                result = dailyCalibrationModel.verifyWeights(str_Protocol, strResberryPi, actualWt, ProtocolDecPoint)
                                break;
                            case 'periodic':
                                result = periodiccalibrationModel.verifyWeights(str_Protocol, strResberryPi, actualWt, ProtocolDecPoint)
                                break;
                            case 'verCalb':
                                break;
                            case 'uncertainty':
                                result = uncertinityCalibModel.verifyWeights(str_Protocol, strResberryPi, actualWt, ProtocolDecPoint)
                                break;
                            case 'repeatability':
                                result = repetabilityCalibration.verifyWeights(str_Protocol, strResberryPi, actualWt, ProtocolDecPoint)
                                break;
                            case 'eccentricity':
                                result = eccentricityCaibration.verifyWeights(str_Protocol, strResberryPi, actualWt, ProtocolDecPoint)
                                break;
                            case 'crmhei':
                                result = objCrimpHeight.verifyWeights(str_Protocol, strResberryPi, actualWt, ProtocolDecPoint, strHmi);
                                break;
                            case 'crmdia':
                                result = objCrimpDiameter.verifyWeights(str_Protocol, strResberryPi, actualWt, ProtocolDecPoint, strHmi);
                                break;
                            case 'linearity':
                                result = linearityCalibration.verifyWeights(str_Protocol, strResberryPi, actualWt, ProtocolDecPoint)
                                break;
                            case 'positional':
                                break;
                            default:
                                // loggers.MqttProtocolLogger.info(`Cal Decider not set : ${calibType}`)
                                console.log('Cal Decider not set');
                                break;
                        }
                        return result;
                    }
                }
            }
        } catch (error) {
            throw new Error(error)
        }
    }
}

module.exports = BalanceParsing;