const ClassweighmentData = require('../clsProcessWeighment.model');

const classHmi = require('../hmiDetail.model');
const mqttProtocols = require('../../global/GLOBAL_NOMENCLATURE');
const globalData = require('../../global/globalData');
const clsMqttSender = require('../../model/Mqtt/mqttSender.class');
const GLOBAL_NOMENCLATURE = require('../../global/GLOBAL_NOMENCLATURE');
const objWeighmentData = new ClassweighmentData();
const objHmi = new classHmi();
const mqttSender = new clsMqttSender();

class VernierParsing {

    precision(a) {
        if (!isFinite(a)) return 0;
        var e = 1, p = 0;
        while (Math.round(a * e) / e !== a) { e *= 10; p++; }
        return p;
    }

    async parsingVernierData(dataObj) {
        try {
            let { str_Protocol, strResberryPi, strHmi, ProtocolPortNo, instrumentId, ProtocolName } = dataObj;
            //here also different balance have different parsing logic
            let data = str_Protocol.split(":")[2].trim();
            let arrWtDetail = data.substr(data.search(/\d/));
            let ProtocolDataAndUnit = arrWtDetail.split(" ");
            let arrRemoveBlankSpace = ProtocolDataAndUnit.filter(item => item);
            let actualWt = arrRemoveBlankSpace[0];
            actualWt = parseFloat(actualWt).toFixed(this.precision(Number(actualWt)));
            let ProtocolDecPoint = this.precision(Number(actualWt));
            let negativeWeightCheck = data.substr(data.search(/-/));
            let ProtocolUnit = arrRemoveBlankSpace[1];
            ProtocolUnit = ProtocolUnit == undefined ? 'mm' : ProtocolUnit;
            let currentOpStatus = globalData.arrCurrentOperationStatus.find(k => k.Hmi == strHmi);
            let tempCailibType = globalData.arrcalibType.find(k => k.Hmi == strHmi);
            let arrPortDetailForStart1 = globalData.arrSelectedMenu.find(k => k.Hmi == strHmi);//await objHmi.idsPortSetting(strHmi);
            //Instrument Type,ID,PortNo
            let intPortNo1 = arrPortDetailForStart1.portNo;
            let strInstrumentType = arrPortDetailForStart1.InstrumentType;
            let strInstrumentId = arrPortDetailForStart1.instrumentId;
            const __parameterWeighmentObj = {
                idsNo: strResberryPi,
                Hmi: strHmi,
                actualWt: actualWt,
                decPoint: ProtocolDecPoint,
                unit: ProtocolUnit,
                instrumentId: strInstrumentId
            }

            if (actualWt.endsWith('mm' || 'g' || 'kg' || 'gm')) {
                //log protocol in file
                loggers.MqttProtocolLogger.info(`protocol : ${mqttProtocols.DisplayMessage}Invalid Weight Received sended to device ${strHmi}`)
                return mqttSender.sendData(strHmi, `${mqttProtocols.DisplayMessage}Invalid Weight Received`)
            }

            if (actualWt == (undefined || "NaN" || 0 || NaN) || negativeWeightCheck.charAt(0) == "-" ||
                ProtocolPortNo == (undefined || "") || data.startsWith('I4') || data == "") {

                //log protocol in file
                loggers.MqttProtocolLogger.info(`protocol : ${mqttProtocols.DisplayMessage}Invalid Weight Received sended to device ${strHmi}`)
                return mqttSender.sendData(strHmi, `${mqttProtocols.DisplayMessage}Invalid Weight Received`)
            }


            if (data !== "") {
                if (ProtocolDataAndUnit.length < 1 || ProtocolDataAndUnit[1] == "") {
                    //log protocol in file
                    loggers.MqttProtocolLogger.info(`protocol : ${mqttProtocols.DisplayMessage}Invalid Weight Received sended to device ${strHmi}`)
                    return mqttSender.sendData(strHmi, `${mqttProtocols.DisplayMessage}Invalid Weight Received`);
                }

                if (ProtocolUnit === "A") {
                    return;
                } else {

                    if (strInstrumentType == GLOBAL_NOMENCLATURE.Vernier) {
                        if (ProtocolUnit == undefined) {
                            ProtocolUnit = ProtocolUnit == undefined ? "g" : ProtocolUnit;
                        } else {
                            if ((ProtocolUnit != "mm")) {
                                //log protocol in file
                                // loggers.MqttProtocolLogger.info(`protocol : ${mqttProtocols.DisplayMessage}Invalid Data String sended to device ${strHmi}`)
                                return mqttSender.sendData(strHmi, `${mqttProtocols.DisplayMessage}Invalid Unit Received`);
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
                        loggers.MqttProtocolLogger.info(`unknown instrument`)
                        console.log('unknown instrument');
                    }

                    //decision making 
                    if (tempCailibType == undefined) {
                        if (currentOpStatus == undefined) {
                            loggers.MqttProtocolLogger.info(`Weight recieve without any api called`)
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
                                loggers.MqttProtocolLogger.info(`Cal Decider not set : ${calibType}`)
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

module.exports = VernierParsing;