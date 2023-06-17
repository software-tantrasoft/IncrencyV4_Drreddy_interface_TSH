
//modules
const ClearGlobalArrayModel = require('../clearGlobalArrays.model');
const classHmi = require('../hmiDetail.model');
const mqttProtocols = require('../../global/GLOBAL_NOMENCLATURE');
const clsBalanceParsing = require('../InstrumentParsings/clsBalanceParsing');
const clsHardnessParsing = require('../InstrumentParsings/clsHardnessParsing');
const clsMoistureParsing = require('../InstrumentParsings/clsMoistureAnalyserParsing');
const GLOBAL_NOMENCLATURE = require('../../global/GLOBAL_NOMENCLATURE');
const clsMqttSender = require('../Mqtt/mqttSender.class')
const clsVernierParsing = require('../InstrumentParsings/clsVernierParsing')

const globalData = require('../../global/globalData')

const serverConfig = require('../../global/serverConfig')
//instances
const objClearArray = new ClearGlobalArrayModel();
const objHmi = new classHmi();
const objBalanceParsing = new clsBalanceParsing();
const objHardnessParsing = new clsHardnessParsing();
const objMoistureParsing = new clsMoistureParsing();
const mqttSender = new clsMqttSender();
const objVernierParsing = new clsVernierParsing();



class MQTTHandler {

    precision(a) {
        if (!isFinite(a)) return 0;
        var e = 1, p = 0;
        while (Math.round(a * e) / e !== a) { e *= 10; p++; }
        return p;
    }

    //
    async handleProtocol(str_Protocol, strResberryPi) {
        try {
            // loggers.MqttProtocolLogger.info(`protocol : ${str_Protocol} Received from device ${strResberryPi}`)

            const unWantedProtocols = [
                "ACK_DisableCom".toLowerCase(),
                "ACK_EnableCom".toLowerCase(),
                "Hamster Pro20 not found".toLowerCase(),
                "ACK_Disconnected".toLowerCase(),
                'ack_',
                'nack_'
            ]
            if (str_Protocol == "" ||
                unWantedProtocols.some(el => str_Protocol.toLowerCase().includes(el) || str_Protocol.toLowerCase().startsWith(el))) {
                return;
            }

            if (str_Protocol.toLowerCase() == "Disconnected".toLowerCase()) {
                return;
            }

            let strHmi = await objHmi.getHmiNoFromResbPi(strResberryPi);
            let str_ProtocolData = str_Protocol;
            let ProtocolName = str_ProtocolData.split(":")[0];
            let ProtocolPortNo = str_ProtocolData.split(":")[1];
            let arrPortDetailForStart1 = await objHmi.getAliasOfRPI(strHmi);



            const arrCurrentOperation = globalData.arrCurrentOperationStatus.find(k => k.Hmi == strHmi);
            const arrCalibInProcess = globalData.arrcalibType.find(k => k.Hmi == strHmi);
            if (arrCurrentOperation != undefined) {
                const arrSelectedMenu = globalData.arrSelectedMenu.find(k => k.Hmi == strHmi);
                var intPortNo1 = arrSelectedMenu.portNo;
                var strInstrumentType = arrSelectedMenu.InstrumentType;
                var strInstrumentId = arrSelectedMenu.instrumentId;
            } else if (arrCalibInProcess != undefined) {
                let hmiDetails = globalData.arrSelectedBalWithHmi.find(k => k.Hmi == strHmi);
                var intPortNo1 = hmiDetails.portNo;
                var strInstrumentType = hmiDetails.InstrumentType;
                var strInstrumentId = hmiDetails.selectedBal;
            } else {
                return console.log('dont proceedd further')
            }
            if (intPortNo1 != ProtocolPortNo) {
                return mqttSender.sendData(strHmi, `${mqttProtocols.DisplayMessage}Invalid Port Received`)
            }
            
            let result;
            const __paramObj = {
                strHmi: strHmi,
                str_Protocol: str_ProtocolData,
                InstrumentId: strInstrumentId,
                ProtocolPortNo: ProtocolPortNo,
                strResberryPi: strResberryPi,
                ProtocolName: ProtocolName,
                InstrumentType: strInstrumentType
            }

            if (ProtocolName.toLowerCase() === GLOBAL_NOMENCLATURE.ComRead.toLowerCase()) {
                switch (strInstrumentType) {
                    case GLOBAL_NOMENCLATURE.Balance: {
                        result = await objBalanceParsing.parsingBalanceData(__paramObj);
                        return result;
                    };
                    case GLOBAL_NOMENCLATURE.TabletTester:
                    case GLOBAL_NOMENCLATURE.Hardness: {
                        result = await objHardnessParsing.parseDataAccordingToModelHardness(__paramObj);
                        return result;
                    };
                    case GLOBAL_NOMENCLATURE.Vernier: {
                        result = await objVernierParsing.parsingVernierData(__paramObj);
                        return result;
                    };
                    case GLOBAL_NOMENCLATURE.DT: {
                        result = await objDTParsing.parsingDTData(__paramObj);
                        return result;
                    };
                    case (GLOBAL_NOMENCLATURE.FriabilatorMenu && serverConfig.friabilityType == "OF"): {
                        result = await objFriabilityParsing.parsingFriabilityData(__paramObj);
                        return result;
                    };
                    case GLOBAL_NOMENCLATURE.FriabilatorMenu: {
                        result = await objFriabilityParsing.parsingFriabilityBFBO(__paramObj);
                        return result;
                    };
                    case "LOD":
                    case GLOBAL_NOMENCLATURE.MoistureAnalyzer: {
                        result = await objMoistureParsing.parseMoistureAnalyserData(__paramObj);
                        return result;
                    };
                    case GLOBAL_NOMENCLATURE.TappedDensity: {
                        result = await objTappedDensity.parsingTappedDensityData(__paramObj);
                        return result;
                    };
                    case GLOBAL_NOMENCLATURE.PercentageFine: {
                        result = await objBalanceParsing.parsingBalanceData(__paramObj);
                        return result;
                    };
                    case GLOBAL_NOMENCLATURE.ParticalSizing: {
                        result = await objBalanceParsing.parsingBalanceData(__paramObj);
                        return result;
                    };

                }
            }
        } catch (error) {
            // loggers.MqttProtocolLogger.error(`${error} Received in calibDecider function from device : ${strResberryPi}`)
            throw new Error(error)
        }

    }

}

module.exports = MQTTHandler;