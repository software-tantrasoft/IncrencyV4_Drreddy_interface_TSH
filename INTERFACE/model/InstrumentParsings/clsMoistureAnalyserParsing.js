const moment = require('moment');


const ClassweighmentData = require('../clsProcessWeighment.model');
const mqttProtocol = require('../../global/GLOBAL_NOMENCLATURE');
const classHmi = require('../hmiDetail.model');
const mqttProtocols = require('../../global/GLOBAL_NOMENCLATURE');
const loggers = require('../winstonLogger');
const globalData = require('../../global/globalData');
const clsMqttSender = require('../Mqtt/mqttSender.class');
const GLOBAL_NOMENCLATURE = require('../../global/GLOBAL_NOMENCLATURE');

const objWeighmentData = new ClassweighmentData();

const objHmi = new classHmi();
const mqttSender = new clsMqttSender();

class MoistureAnalyserParsing {

    precision(a) {
        if (!isFinite(a)) return 0;
        var e = 1, p = 0;
        while (Math.round(a * e) / e !== a) { e *= 10; p++; }
        return p;
    }

    async parseMoistureAnalyserData(dataObj) {
        try {
            let { str_Protocol, strResberryPi, strHmi, ProtocolPortNo, instrumentId, ProtocolName } = dataObj;
            //here also different balance have different parsing logic
            let data_array = str_Protocol.split("\n");
            let data = str_Protocol.split(":")[2].trim();
            let test_duration_found = false;
            let arm_found = false;
            let arr = [];
            let obj = {}
            for (let i = 0; i < data_array.length; i++) {
                // data = data_array[i].trim();
                if (data == "" || data == null)
                    continue;
                if (data_array[i].includes("SW (Drying Unit )")) {
                    let SWunit = data_array[i].replace('SW (Drying Unit )', ' ').trim().split();
                    SWunit = SWunit[0];
                    obj["SW (Drying Unit)"] = SWunit;
                    // arr.push({ SWunit: SWunit })
                    continue;
                }
                if (data_array[i].includes("SW (Terminal )")) {
                    let SWterminal = data_array[i].replace('SW (Terminal )', ' ').trim().split();
                    SWterminal = SWterminal[0];
                    obj["SW (Terminal)"] = SWterminal;
                    // arr.push({ SWterminal: SWterminal })
                    continue;
                }
                if (data_array[i].includes("Drying Temp")) {
                    let DryTemp = data_array[i].replace('Drying Temp', ' ').trim().split();
                    DryTemp = DryTemp[0];
                    obj["Drying Temp"] = DryTemp
                    // arr.push({ DryTemp: DryTemp })
                    continue;
                }
                if (data_array[i].includes("Start Weight")) {
                    let StrWeight = data_array[i].replace('Start Weight', ' ').trim().split();
                    StrWeight = StrWeight[0];
                    obj["Start Weight"] = StrWeight
                    // arr.push({ StrWeight: StrWeight })
                    continue;
                }
                if (data_array[i].includes("Total time")) {
                    let Totaltime = data_array[i].replace('Total time', ' ').trim().split();
                    Totaltime = Totaltime[0];
                    obj["Total time"] = Totaltime
                    // arr.push({ Totaltime: Totaltime })
                    continue;
                }
                if (data_array[i].includes("End Result")) {
                    let EndRes = data_array[i].replace('End Result', ' ').trim().split();
                    EndRes = EndRes[0];
                    obj["End Result"] = EndRes
                    // arr.push({ EndRes: EndRes })
                    continue;
                }
            
            }

            arr.push(obj);
            // const TimeFormat = "HH:mm:ss";

            console.log(arr)
            if (arr.length == 0) {
                return mqttSender.sendData(strHmi, "Invalid String recieved")
            }
            let dtData = globalData.arrWeighmentProductData.find(k => k.Hmi == strHmi).data;


            let currentOpStatus = globalData.arrCurrentOperationStatus.find(k => k.Hmi == strHmi);
            let tempCailibType = globalData.arrcalibType.find(k => k.Hmi == strHmi);
            // let arrPortDetailForStart1 = await objHmi.idsPortSetting(strHmi)
            let intPortNo1 = dataObj.ProtocolPortNo;
            let strInstrumentType = dataObj.InstrumentType;
            let strInstrumentId = dataObj.InstrumentId;
            const __parameterWeighmentObj = {
                idsNo: strResberryPi,
                Hmi: strHmi,
                actualWt: arr[0],
                instrumentId: strInstrumentId
            }
            if (arr == "") {
                return mqttSender.sendData(strHmi, "Invalid String recieved")
            } else {
                // if (strInstrumentType == GLOBAL_NOMENCLATURE.Balance) {
                //     if (ProtocolUnit == undefined) {
                //         ProtocolUnit = ProtocolUnit == undefined ? "g" : ProtocolUnit;
                //     } else {
                //         if ((ProtocolUnit != "g") && (ProtocolUnit != "kg") && (ProtocolUnit != "mg")) {
                //             //log protocol in file
                //             loggers.MqttProtocolLogger.info(`protocol : ${mqttProtocols.DisplayMessage}Invalid Data String sended to device ${strHmi}`)
                //             return mqttSender.sendData(strHmi, `${mqttProtocols.DisplayMessage}Invalid Data String`);
                //         } else {
                //             if (ProtocolUnit == "mg") {
                //                 actualWt = actualWt / 1000;
                //             } else if (ProtocolUnit == ("kg" || "Kg" || "KG")) {
                //                 actualWt = actualWt * 1000;
                //             }
                //             ProtocolUnit = ProtocolUnit == undefined ? "g" : ProtocolUnit;

                //         }
                //     }

                // } else {
                //     //log protocol in file
                //     loggers.MqttProtocolLogger.info(`unknown instrument`)
                //     console.log('unknown instrument');
                // }

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
                    console.log('calibration is on and dt weighment part has clash')
                }
            }
            // }
        } catch (error) {
            throw new Error(error)
        }
    }
}

module.exports = MoistureAnalyserParsing;