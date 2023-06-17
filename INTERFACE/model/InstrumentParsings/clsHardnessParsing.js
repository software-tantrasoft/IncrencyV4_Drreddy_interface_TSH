
const ClassweighmentData = require('../clsProcessWeighment.model');
const classHmi = require('../hmiDetail.model');
const mqttProtocols = require('../../global/GLOBAL_NOMENCLATURE');
const globalData = require('../../global/globalData');
const clsMqttSender = require('../../model/Mqtt/mqttSender.class');
const GLOBAL_NOMENCLATURE = require('../../global/GLOBAL_NOMENCLATURE');
// const clsDatabase = require('../../database/clsQueryProcess');
const clsHardness125 = require('../../model/Test/clsHardness.model');

const objWeighmentData = new ClassweighmentData();
const objHmi = new classHmi();
const mqttSender = new clsMqttSender();
// const database = new clsDatabase();
const objHardness125 = new clsHardness125();

const models = require('../../../config/dbConnection').models;
const sequelize = require('../../../config/dbConnection').sequelize;

class HardnessParsing {
    async parseDataAccordingToModelHardness(dataObj) {
        dataObj.str_Protocol = dataObj.str_Protocol.trim()
        if (dataObj.str_Protocol.endsWith('::StoredData')) {
            // var storedData = dataObj.str_Protocol
            var storedData = dataObj.str_Protocol.slice(0, -12).split(/ComRead/i).slice(1)
            for (let i in storedData) {
                dataObj.str_Protocol = 'ComRead' + storedData[i]
                await this.parsingStoredData(dataObj)
            }
        }
        else await this.parsingStoredData(dataObj)
    }

    async parsingStoredData(dataObj) {
        let strIdsNo = dataObj.strResberryPi;
        let instrumentid = dataObj.InstrumentId
        let strHardnessModel = await this.CheckHardnessModel(strIdsNo, instrumentid);
        if (strHardnessModel.Eqp_Make == 'Erweka TBH-425') {
            await this.parsingHardnessData_Erweka425(dataObj);
        } else if (strHardnessModel.Eqp_Make == 'Dr Schleuniger') {
            await this.parsingHardnessDrSchleuniger(dataObj);
        }
        else if (strHardnessModel.Eqp_Make == "Sotax") { //strHardnessModel.Eqp_Make == "Sotax MT50"
            let strMt50Type = strHardnessModel.Eqp_HT_Type;
            if (strMt50Type == 'HTOHL') {
                // Taking only hardness from all parameters
                await this.parsingHardnessData_OnlyHardness(dataObj);   // only mt50 hardness 
            } else if (strMt50Type == 'HTOHR') {
                // HTOHR Routine MT  50 DIRECT
                await this.parsingHardnessMT50HTOHR(dataObj);
            } else {
                // HTALL
                await this.parsingHardnessData_SotaxMT50(dataObj); // expecpt only mt50 hardness 
            }

            if (strHardnessModel.Eqp_Make == "Sotax ST50") {
                // HTALL
                await this.parsingHardnessData_SotaxMT50(dataObj);

            }
        }
        else {
            await this.parsingHardnessData_Erweka125(dataObj);
        }
    }

    async CheckHardnessModel(idsNo, instrumentid) {
        var cubicInfo = globalData.arrIdsInfo.find(k => k.idsNo == idsNo).cubicalData;
        var hardnessId = instrumentid

        // var selectOtherEquip = {
        //     str_tableName: 'tbl_otherequipment',
        //     data: 'Eqp_Make,Eqp_HT_Type',
        //     condition: [
        //         { str_colName: 'Eqp_ID', value: hardnessId }
        //     ]
        // }
        // var result = await database.select(selectOtherEquip);
        // return result[0][0];
        var selectOtherEquip = await models['tbl_otherequipment'].findAll({
            where: {
                Eqp_ID: hardnessId
            },
            // include: {
            //     model: tbl_otherequipment,
            //     attributes:['Eqp_Make', 'Eqp_HT_Type']
            // }
        });
        return [selectOtherEquip][0][0];
    }

    async parsingHardnessData_Erweka425(dataObj) {
        try {
            let { str_Protocol, strResberryPi, strHmi, ProtocolPortNo, instrumentId, ProtocolName } = dataObj;
            let data = str_Protocol.split("\n\n").filter(k => k);
            // console.log(data);
            // console.log(data);
            let i = 0;
            let recivedData = [];
            let arrData = [];

            let wtRecivedFromHardness = globalData.arrDataFromInstHardness.find(k => k.idsNo == strResberryPi);
            let flagComRead;
            for (let a of data) {
                if (data[i].split(":")[0].toLowerCase() == "ComRead".toLowerCase()) {
                    arrData.push(data[i].replace(/\n\X/g, '').trim());
                    recivedData.push(data[i].replace(/\n\X/g, '').trim());
                    flagComRead = true;
                } else {
                    flagComRead = false;
                }

                i++;
            }

            if (flagComRead == true) {
                if (wtRecivedFromHardness === undefined) {
                    globalData.arrDataFromInstHardness.push({
                        Hmi: strHmi,
                        idsNo: strResberryPi,
                        hardnessData: recivedData,
                        arrLength: recivedData.length,
                        nextData: arrData

                    })
                } else {
                    wtRecivedFromHardness.hardnessData.push(...recivedData);
                    wtRecivedFromHardness.arrLength = recivedData.length;
                    wtRecivedFromHardness.nextData = arrData;
                    wtRecivedFromHardness.hardnessData = wtRecivedFromHardness.hardnessData;
                }


            }
            wtRecivedFromHardness = globalData.arrDataFromInstHardness.find(k => k.idsNo == strResberryPi);
            console.log(wtRecivedFromHardness);

            let currentOpStatus = globalData.arrCurrentOperationStatus.find(k => k.Hmi == strHmi);
            let tempCailibType = globalData.arrcalibType.find(k => k.Hmi == strHmi);
            let arrPortDetailForStart1 = await objHmi.idsPortSetting(strHmi)
            let intPortNo1 = arrPortDetailForStart1.Sys_PortNo;
            let strInstrumentType = arrPortDetailForStart1.Instrument_type;
            let strInstrumentId = arrPortDetailForStart1.Instrument_id;


            const __parameterWeighmentObj = {
                idsNo: strResberryPi,
                Hmi: strHmi,
                actualWt: wtRecivedFromHardness,
                // decPoint: ProtocolDecPoint,
                // unit: ProtocolUnit,
                // instrumentId: strInstrumentId
            }

            if (flagComRead == true && data !== "") {

                if (intPortNo1 != ProtocolPortNo) {
                    //log protocol in file
                    loggers.MqttProtocolLogger.info(`protocol : ${mqttProtocols.DisplayMessage}${strInstrumentType} ${strInstrumentId} connected with Port ${intPortNo1} must be used sended to device ${strHmi}`)
                    return mqttSender.sendData(strHmi, `${mqttProtocols.DisplayMessage}${strInstrumentType} ${strInstrumentId} connected with Port ${intPortNo1} must be used`)
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
                    console.log('Hardeness 425 Parsing Error');
                }

            } else {
                console.log('Invalid data Hardness')
            }

        } catch (error) {
            throw new Error(error)
        }
    }



    async parsingHardnessData_SotaxMT50(dataObj) {
        let strProtocol;
        let HardID = dataObj.InstrumentId;
        let ProtocolPortNo = dataObj.ProtocolPortNo;
        let strIdsNo = dataObj.strResberryPi;
        let strHmi = dataObj.strHmi;
        strProtocol = dataObj.str_Protocol.split("\n");
        let _stringChecking = strProtocol.toString().includes("@");
        let actualRecivedProtocol;
        let currentOpStatus = globalData.arrCurrentOperationStatus.find(k => k.Hmi == strHmi);
        let tempCailibType = globalData.arrcalibType.find(k => k.Hmi == strHmi);
        var productDetail = globalData.arrProductTypeArray.find(k => k.Hmi == strHmi);
        let strInstrumentType = "Hardness";
        let strInstrumentId = dataObj.InstrumentId;
        console.log('string is valid');

        let sampleNoFromString, _forCheckingSampleNo

        actualRecivedProtocol = dataObj.str_Protocol.slice(dataObj.str_Protocol.indexOf('@'), dataObj.str_Protocol.length)
        //push sampleno in array



        if (strProtocol.filter(k => k.includes('Test end')).length > 0) {
            console.log("Test end Received");
            return
        }
        let actualRecivedProtocolCount = actualRecivedProtocol.lastIndexOf('@');

        //data Received from port1  contains multiple @ so return
        if (dataObj.str_Protocol.search('Values') == -1) {
            if ((ProtocolPortNo == 1) && ((dataObj.str_Protocol.match(/@/g) == null) || (dataObj.str_Protocol.match(/@/g).length > 1))) {
                mqttSender.sendData(strHmi, `${GLOBAL_NOMENCLATURE.DisplayMessage}Invalid Data Received`);
                return;
            }
            let digitInString = actualRecivedProtocol.split(' ').filter((k, i) => i !== 0).join(' ');
            digitInString = digitInString.match(/\d/g);
            if (digitInString == null) {
                mqttSender.sendData(strHmi, `${GLOBAL_NOMENCLATURE.DisplayMessage}Invalid Data Received`);
                return;
            }
        }


        // if (actualRecivedProtocol.length == 1 && actualRecivedProtocolCount != 0) {
        if (actualRecivedProtocolCount == 0 && actualRecivedProtocol.includes('MT50')) {

            let parseBulkString = await this.parseDataThick(strProtocol)
            console.log(parseBulkString);
            if (!actualRecivedProtocol.includes('Signature')) {
                console.log('Incomplete Bulk string recieve')
                return
            }
            parseBulkString = parseBulkString.filter(k => k)
            actualRecivedProtocol = parseBulkString

            let bulkHardness = globalData.arrPushValuesOfHardness.find(k => k.Hmi == strHmi)
            if (bulkHardness == undefined) {
                globalData.arrPushValuesOfHardness.push({
                    Hmi: strHmi,
                    idsNo: strIdsNo,
                    sampleno: actualRecivedProtocol
                })
            } else {
                bulkHardness.sampleno = actualRecivedProtocol
            }

        } else {
            if (strProtocol.indexOf("Values:") != -1) {
                if (strProtocol[0].indexOf("@") == -1) {
                    mqttSender.sendData(strHmi, `${GLOBAL_NOMENCLATURE.DisplayMessage}Header Received`);
                    return

                }
                actualRecivedProtocol = strProtocol[strProtocol.indexOf("Values:") + 1];

            } else {
                if (strProtocol[0].indexOf("@") == -1 || actualRecivedProtocol.charAt(1) == 0) {
                    return mqttSender.sendData(strHmi, `${GLOBAL_NOMENCLATURE.DisplayMessage} Invalid string`)
                }
                actualRecivedProtocol = strProtocol[0].split(':')[2].trim()
            }

            var thickUnit = productDetail.productDetail[0][0].Param3_Unit
            if (actualRecivedProtocol.includes('T')) {
                if (!actualRecivedProtocol.substring(actualRecivedProtocol.indexOf("T")).includes(thickUnit)) {
                    mqttSender.sendData(strHmi, `${mqttProtocols.DisplayMessage}Invalid Unit Received`);
                    return
                }
            }

            var hardnessUnit = productDetail.productDetail[0][0].Param7_Unit
            if (actualRecivedProtocol.includes('H')) {
                if (!actualRecivedProtocol.substring(actualRecivedProtocol.indexOf("H")).includes(hardnessUnit)) {
                    mqttSender.sendData(strHmi, `${mqttProtocols.DisplayMessage}Invalid Unit Received`);
                    return
                }
            }
            var valid_Data = globalData.arrHardnessMT50.find(k => k.Hmi == strHmi);
            if (valid_Data != undefined) {
                if (valid_Data.obj.DataValueHard != undefined || valid_Data.obj.DataValueThick != undefined) {
                    if (valid_Data.obj.DataValueHard != undefined) {
                        if (valid_Data.obj.DataValueHard.value != undefined) {
                            if (!(isNaN(Number(valid_Data.obj.DataValueHard.value.split(' ')[0]))) && (Number(valid_Data.obj.DataValueHard.value.split(' ')[0])) != undefined) {
                                var HD = valid_Data.obj.DataValueHard.value
                            }
                        }
                        if (valid_Data.obj.DataValueThick != undefined) {
                            if (valid_Data.obj.DataValueThick.value != undefined) {
                                if (!(isNaN(Number(valid_Data.obj.DataValueThick.value.split(' ')[0]))) && (Number(valid_Data.obj.DataValueThick.value.split(' ')[0])) != undefined) {
                                    var TD = valid_Data.obj.DataValueThick.value;
                                }
                            }
                        }
                    }
                } else {
                    var HD = valid_Data.obj.HardnessVal.length == 0 ? valid_Data.obj.HardnessVal[0] : valid_Data.obj.HardnessVal
                    var TD = valid_Data.obj.thicknessVal.length == 0 ? valid_Data.obj.thicknessVal[0] : valid_Data.obj.thicknessVal
                }
                if (HD != undefined && TD != undefined) { //first wt send both H and T 
                    if (((HD != undefined && actualRecivedProtocol.includes("H")) && (TD != undefined && actualRecivedProtocol.includes("T")))
                    ) {
                        console.log('string is valid');
                    } else {
                        return mqttSender.sendData(strHmi, `${GLOBAL_NOMENCLATURE.DisplayMessage} Invalid string`)
                    }
                }
                if (HD == undefined && TD != undefined) { //only T send 
                    if ((TD != undefined && actualRecivedProtocol.includes("T") && !(actualRecivedProtocol.includes("H")))) {
                        console.log('string is valid');
                    } else { return mqttSender.sendData(strHmi, `${GLOBAL_NOMENCLATURE.DisplayMessage} Invalid string`) }
                }
                if (HD != undefined && TD == undefined) { // only H send
                    if (HD != undefined && actualRecivedProtocol.includes("H") && !(actualRecivedProtocol.includes("T"))) {
                        console.log('string is valid');
                    } else { return mqttSender.sendData(strHmi, `${GLOBAL_NOMENCLATURE.DisplayMessage} Invalid string`) }
                }
            }
            //remove sample no from hardness string 
            let hardnessSample = globalData.arrSelectedMenu.find(k => k.Hmi == strHmi);
            sampleNoFromString = actualRecivedProtocol.substring(1, actualRecivedProtocol.indexOf(' '));
            if (Number(sampleNoFromString) > parseFloat(hardnessSample.selectedProductDetail.noOfSamples)) {
                // return mqttSender.sendData(strHmi, "sample No From String Received higher than sample", sampleNoFromString, "no of sample user selected", hardnessSample.selectedProductDetail.noOfSamples)
                return mqttSender.sendData(strHmi, `${GLOBAL_NOMENCLATURE.DisplayMessage}Invalid Sample Received`)

            }
            //pushing sample from string
            let forMatching = globalData.formatching.find(k => k.Hmi == strHmi);
            if (forMatching == undefined) {
                globalData.formatching.push({
                    Hmi: strHmi,
                    values: [sampleNoFromString]
                });
                var powersample = await models.tbl_powerbackup.findAll({
                    where: {
                        Idsno: strHmi
                    }
                })
                if (powersample.length != 0) {
                    if (powersample[0].RecSampleNo == sampleNoFromString) {
                        return mqttSender.sendData(strHmi, `${GLOBAL_NOMENCLATURE.DisplayMessage}Duplicate Sample Received`)
                    }
                }
            } else {
                if (forMatching.values.filter(k => k == sampleNoFromString).length > 0) {
                    return mqttSender.sendData(strHmi, `${GLOBAL_NOMENCLATURE.DisplayMessage}Duplicate Sample Received`)
                }

            }
            _forCheckingSampleNo = globalData.arrsampleno.find(k => k.Hmi == strHmi);
            let arrSampleNo = globalData.arrsampleno.find(k => k.Hmi == strHmi);
            if (arrSampleNo != undefined) {
                if (hardnessSample.selectedProductDetail.noOfSamples == arrSampleNo.sampleno) {
                    return mqttSender.sendData(strHmi, `${GLOBAL_NOMENCLATURE.DisplayMessage}Send Bulk Data String`)
                }
            } else {
                var powersample = await models.tbl_powerbackup.findAll({
                    where: {
                        Idsno: strHmi
                    }
                })
                if (powersample.length != 0) {
                    if (powersample[0].RecSampleNo == hardnessSample.selectedProductDetail.noOfSamples) {
                        return mqttSender.sendData(strHmi, `${GLOBAL_NOMENCLATURE.DisplayMessage}Send Bulk Data String`)
                    }
                }
            }
            if (forMatching != undefined) {
                forMatching.values.push(sampleNoFromString)
            }
            if (arrSampleNo == undefined) {
                globalData.arrsampleno.push({
                    Hmi: strHmi,
                    idsNo: strIdsNo,
                    sampleno: sampleNoFromString
                });
            } else {
                arrSampleNo.sampleno = sampleNoFromString
            }


        }
        const __parameterWeighmentObjMT50 = {
            idsNo: strIdsNo,
            Hmi: strHmi,
            actualWt: actualRecivedProtocol,
            // decPoint: ProtocolDecPoint,
            // unit: ProtocolUnit,
            instrumentId: strInstrumentId,
            ProtocolPortNo: ProtocolPortNo,
            instrumentType: strInstrumentType
        }

        //decision making 
        if (tempCailibType == undefined) {
            if (currentOpStatus == undefined) {

                console.log('wt recieve without any api called');
                return;
            } else if (currentOpStatus.Weighment == 1 && currentOpStatus.testType == "Weighment") {

                await objHardness125.processHardnessDataMT50(__parameterWeighmentObjMT50);
            }
        } else {
            console.log('Hardeness Mt50 Parsing Error');
        }


    }


    /**
     * Parsing MT50 Direct
     * @returns 
     */
    async parsingHardnessMT50HTOHR(dataObj) {
        let strProtocol;
        let HardID = dataObj.instrumentId;
        let ProtocolPortNo = dataObj.ProtocolPortNo;
        let strIdsNo = dataObj.strResberryPi;
        let strHmi = dataObj.strHmi;
        strProtocol = dataObj.str_Protocol.split("\n");
        let _stringChecking = strProtocol.toString().includes("Meas. Values");
        let _stringCheckingForStatictics = strProtocol.toString().includes("Statistics");
        let actualRecivedProtocol;
        let currentOpStatus = globalData.arrCurrentOperationStatus.find(k => k.Hmi == strHmi);
        let tempCailibType = globalData.arrcalibType.find(k => k.Hmi == strHmi);
        let arrPortDetailForStart1 = await objHmi.idsPortSetting(strHmi)
        let intPortNo1 = arrPortDetailForStart1.Sys_PortNo;
        let strInstrumentType = arrPortDetailForStart1.Instrument_type;
        let strInstrumentId = arrPortDetailForStart1.Instrument_id;
        let data, data_found;
        let arrOfHardnessValue = [];

        for (let i = 0; i < strProtocol.length; i++) {
            data = strProtocol[i].trim();
            if (data == "" || data == null)
                continue;
            if (data.search("Meas. Values") != -1) {
                data_found = true;
                continue;
            }
            if (data_found === true && data.search("Statistics") == -1) {

                let datavalue = data.split(":");
                arrOfHardnessValue.push({ datavalue });


            } else if (data.search("Statistics") != -1) {
                data_found = false;
            }
        }
        //console.log(arrOfHardnessValue);




        const __parameterWeighmentObjMT50 = {
            idsNo: strIdsNo,
            Hmi: strHmi,
            actualWt: arrOfHardnessValue,
            // decPoint: ProtocolDecPoint,
            // unit: ProtocolUnit,
            instrumentId: strInstrumentId,
            instrumentType: strInstrumentType
        }

        if (intPortNo1 != ProtocolPortNo) {
            //log protocol in file
            loggers.MqttProtocolLogger.info(`protocol : ${mqttProtocols.DisplayMessage}${strInstrumentType} ${strInstrumentId} connected with Port ${intPortNo1} must be used sended to device ${strHmi}`)
            return mqttSender.sendData(strHmi, `${mqttProtocols.DisplayMessage}${strInstrumentType} ${strInstrumentId} connected with Port ${intPortNo1} must be used`)
        }


        //decision making 
        if (tempCailibType == undefined) {
            if (currentOpStatus == undefined) {
                loggers.MqttProtocolLogger.info(`Weight recieve without any api called`)
                console.log('wt recieve without any api called');
                return;
            } else if (currentOpStatus.Weighment == 1 && currentOpStatus.testType == "Weighment") {

                await objHardness125.processHardnessMT50HTOHR(__parameterWeighmentObjMT50);
            }
        } else {
            console.log('Hardeness Mt50 Parsing Error');
        }

    }

    async parsingHardnessDrSchleuniger(dataObj) {
        let strProtocol;
        let HardID = dataObj.instrumentId;
        let ProtocolPortNo = dataObj.ProtocolPortNo;
        let strIdsNo = dataObj.strResberryPi;
        let strHmi = dataObj.strHmi;
        strProtocol = dataObj.str_Protocol.split('\n');
        let strProtocoltemp = dataObj.str_Protocol;
        let _stringChecking = strProtocoltemp.toString().includes("Hardness");
        let actualRecivedProtocol;
        let currentOpStatus = globalData.arrCurrentOperationStatus.find(k => k.Hmi == strHmi);
        let tempCailibType = globalData.arrcalibType.find(k => k.Hmi == strHmi);
        let arrPortDetailForStart1 = globalData.arrIdsInfo.find(k => k.Hmi == strHmi).cubicalData;//await objHmi.idsPortSetting(strHmi)
        let intPortNo1 = arrPortDetailForStart1.Sys_PortNo;
        intPortNo1 = intPortNo1.toString().split('0')[1];
        let strInstrumentType = dataObj.InstrumentType;
        let strInstrumentId = dataObj.InstrumentId;
        let data, data_found;
        var arrOfHardnessValue = [];
        var validSampleForstring = 1;
        var countN = 1;
        let checkFlag;
        if (_stringChecking == true) {
            for (let i = 0; i < strProtocol.length; i++) {
                data = strProtocol[i].trim();
                // console.log(data);
                if (data == "" || data == null)
                    continue;
                if (data.search("Valid Samples") != -1 && validSampleForstring == 1) {
                    validSampleForstring = validSampleForstring + 1;
                    continue;
                }

                else if (data.search("Valid Samples") != -1 && validSampleForstring == 2) {
                    data_found = true;
                    checkFlag = 2;
                }
                else if (validSampleForstring == 2 && checkFlag == 2 && data.search("Signature") == -1 && data_found == true
                ) {
                    let datavalue = data.replace(' ', ':');
                    arrOfHardnessValue.push({ datavalue });

                }

                else if (data.search("Signature") != -1) {
                    data_found = false;
                }
            }

            let filterData = arrOfHardnessValue.filter(empty => empty);
            let removeElementforN = filterData.shift();
            let arrOfObjHardnessData = filterData;

            const __parameterWeighmentObj8M = {
                idsNo: strIdsNo,
                Hmi: strHmi,
                actualWt: arrOfObjHardnessData,
                instrumentId: strInstrumentId,
                instrumentType: strInstrumentType
            }

            if (intPortNo1 != ProtocolPortNo) {
                //log protocol in file
                // loggers.MqttProtocolLogger.info(`protocol : ${mqttProtocols.DisplayMessage}${strInstrumentType} ${strInstrumentId} connected with Port ${intPortNo1} must be used sended to device ${strHmi}`)
                return mqttSender.sendData(strHmi, `${mqttProtocols.DisplayMessage}${strInstrumentType} ${strInstrumentId} connected with Port ${intPortNo1} must be used`)
            }


            if (tempCailibType == undefined && arrOfObjHardnessData.length != 0) {
                if (currentOpStatus == undefined) {
                    loggers.MqttProtocolLogger.info(`Weight recieve without any api called`)
                    console.log('wt recieve without any api called');
                    return;
                } else if (currentOpStatus.Weighment == 1 && currentOpStatus.testType == "Weighment") {

                    await objHardness125.processHardnessDrSchleuniger(__parameterWeighmentObj8M);
                }
            } else {
                console.log('DrSchleuniger string is not valid');
            }

        } else {
            console.log('DrSchleuniger string is not valid')
        }

        //check that hardness is their 2 times in a string 
        //if hardness exist in a string then parse the below incoming string.
    }



    //only hardness
    async parsingHardnessData_OnlyHardness(dataObj) {
        let strProtocol;
        let HardID = dataObj.instrumentId;
        let ProtocolPortNo = dataObj.ProtocolPortNo;
        let strIdsNo = dataObj.strResberryPi;
        let strHmi = dataObj.strHmi;
        strProtocol = dataObj.str_Protocol.split("\n");
        // let _stringChecking = strProtocol.toString().includes("@");
        let actualRecivedProtocol;
        let currentOpStatus = globalData.arrCurrentOperationStatus.find(k => k.Hmi == strHmi);
        let tempCailibType = globalData.arrcalibType.find(k => k.Hmi == strHmi);
        let arrPortDetailForStart1 = await objHmi.idsPortSetting(strHmi)
        let intPortNo1 = arrPortDetailForStart1.Sys_PortNo;
        let strInstrumentType = arrPortDetailForStart1.Instrument_type;
        let strInstrumentId = arrPortDetailForStart1.Instrument_id;

        // if (_stringChecking == true) {
        //     console.log('string is valid');
        //     if (strProtocol.indexOf("Values:") != -1) {
        //         actualRecivedProtocol = strProtocol[strProtocol.indexOf("Values:") + 1].trim();
        //     } else {
        //         actualRecivedProtocol = strProtocol[0].split(":")[2].trim();
        //     }
        // } else {
        //     console.log('string comes till values or @ is not their in string')
        // }

        let sampleNoFromString;
        let _forCheckingSampleNo;

        // if (_stringChecking == true) {
        console.log('string is valid');
        // if (strProtocol.indexOf("Values:") != -1) {
        // strProtocol = dataObj.str_Protocol;
        //actualRecivedProtocol = strProtocol.slice(strProtocol.indexOf("Values:") + 1, -1).filter(k => k != '');
        actualRecivedProtocol = dataObj.str_Protocol.slice(dataObj.str_Protocol.split('|')[0].indexOf('@'), -1).split('\n\n').filter(k => k);
        //push sampleno in array
        let actualRecivedProtocolCount = actualRecivedProtocol[0].lastIndexOf('@')
        if (actualRecivedProtocol.length == 1 && actualRecivedProtocolCount != 0) {
            globalData.arrPushValuesOfHardness.push({
                Hmi: strHmi,
                idsNo: strIdsNo,
                sampleno: actualRecivedProtocol
            })
        } else {

            actualRecivedProtocol = strProtocol[strProtocol.indexOf("Values:") + 1];
            //remove sample no from hardness string 
            sampleNoFromString = actualRecivedProtocol.substring(1, actualRecivedProtocol.indexOf(' '));
            _forCheckingSampleNo = globalData.arrsampleno.find(k => k.Hmi == strHmi);


            if (Number(sampleNoFromString) === 1 && _forCheckingSampleNo === undefined) {
                /**
                 * push sample no for comparing that test is complete or not 
                 */


                /**
                 * 
                 */
                globalData.arrsampleno.push({
                    Hmi: strHmi,
                    idsNo: strIdsNo,
                    sampleno: sampleNoFromString
                });


            } else {

                _forCheckingSampleNo.sampleno = sampleNoFromString;
                if (_forCheckingSampleNo === undefined) {
                    console.log('wt should start from @1')
                }

            }
            //pushing sample from string
            globalData.formatching.push(sampleNoFromString);
        }

        // } else {

        //     actualRecivedProtocol = strProtocol[0].split(":")[2].trim();

        // globalData.arrPushValuesOfHardness.push({
        //     Hmi: strHmi,
        //     idsNo: strIdsNo,
        //     sampleno: actualRecivedProtocol
        // })
        // }
        //  } else {
        //     console.log('string comes till values or @ is not their in string')
        // }




        const __parameterWeighmentObjMT50 = {
            idsNo: strIdsNo,
            Hmi: strHmi,
            actualWt: actualRecivedProtocol,
            // decPoint: ProtocolDecPoint,
            // unit: ProtocolUnit,
            ProtocolPortNo: ProtocolPortNo,
            instrumentId: strInstrumentId,
            instrumentType: strInstrumentType
        }

        // if (intPortNo1 != ProtocolPortNo) {
        //     //log protocol in file
        //     loggers.MqttProtocolLogger.info(`protocol : ${mqttProtocols.DisplayMessage}${strInstrumentType} ${strInstrumentId} connected with Port ${intPortNo1} must be used sended to device ${strHmi}`)
        //     return mqttSender.sendData(strHmi, `${mqttProtocols.DisplayMessage}${strInstrumentType} ${strInstrumentId} connected with Port ${intPortNo1} must be used`)
        // }


        //decision making 
        if (tempCailibType == undefined) {
            if (currentOpStatus == undefined) {
                loggers.MqttProtocolLogger.info(`Weight recieve without any api called`)
                console.log('wt recieve without any api called');
                return;
            } else if (currentOpStatus.Weighment == 1 && currentOpStatus.testType == "Weighment") {
                //console.log(globalData.formatching)
                await objHardness125.processHardnessDataMT50OnlyHardnessData(__parameterWeighmentObjMT50);
            }
        } else {
            console.log('Hardeness Mt50 Parsing Error');
        }


        //console.log(strProtocol);
    }

    parseDataThick(Str) {


        var recivedThickessLine = false;
        var ThickOnly = false;
        var WidhtOnly = false;
        var DaimOnly = false;
        var HardOnly = false;
        var recivedMeanVal = false;
        var MeansValCounter = 0;
        var strValid = "";

        var ThickCount = 0;
        var recivedLineHard = false;
        var recivedMeanValHard = false;
        var MeansValCounterHard = 0;
        var strValidHard = "";
        var HardCount = 0;


        // var strSplit = Str.split('\n');
        var strSplit = Str
        //console.log(strSplit);
        for (let str of strSplit) {
            if (ThickOnly == false && WidhtOnly == false) {
                ThickOnly = str.includes("Thickness")
                WidhtOnly = str.includes("Width")
                // console.log(str)
            }


            if (ThickOnly || WidhtOnly) {

                recivedThickessLine = true
            }

            if (str.includes("Meas. Values")) {
                MeansValCounter = MeansValCounter + 1;

                if (MeansValCounter == 1) {
                    recivedMeanVal = true;
                }

            }

            if (recivedThickessLine == true && recivedMeanVal == true && str.includes(':')) {
                var stronlyValues = str.split(':');

                //for (let onlyVal of stronlyValues) {
                //  if (onlyVal.includes('.')) {
                var values = stronlyValues[1].split(' ');

                let arr = values.filter(function (item) {
                    return item !== ''
                })
                ThickCount = ThickCount + 1;

                if (WidhtOnly && ThickOnly) {
                    strValid = strValid + "@" + ThickCount + " T " + arr[0] + "mm Wd " + arr[1] + "mm |";
                }

                else if (WidhtOnly && DaimOnly) {
                    strValid = strValid + "@" + ThickCount + " Wd " + arr[0] + "mm D " + arr[1] + "mm |";
                }
                else if (ThickOnly && DaimOnly) {
                    strValid = strValid + "@" + ThickCount + " T " + arr[0] + "mm D " + arr[1] + "mm |";
                }
                else if (ThickOnly && HardOnly) {
                    strValid = strValid + "@" + ThickCount + " T " + arr[0] + "mm H" + arr[1] + "N |";
                }
                else if (WidhtOnly && HardOnly) {
                    strValid = strValid + "@" + ThickCount + " Wd " + arr[0] + "mm H" + arr[1] + "N |";
                }

                else if (WidhtOnly && !ThickOnly) {
                    strValid = strValid + "@" + ThickCount + " Wd " + arr[0] + "mm |";
                } else if (ThickOnly && !WidhtOnly) {
                    strValid = strValid + "@" + ThickCount + " T " + arr[0] + "mm |";
                }



                // }
                //}
            }




            //console.log(Str)

            if (str.includes('Statistics')) {
                recivedThickessLine = false;
                ThickOnly = false
                WidhtOnly = false


            }


            //hardness code 
            if (DaimOnly == false && HardOnly == false) {
                DaimOnly = str.includes("Diameter")
                HardOnly = str.includes("Hardness")
                // console.log(str)
            }

            if (DaimOnly || HardOnly) {

                recivedLineHard = true
            }

            if (str.includes("Meas. Values")) {
                MeansValCounterHard = MeansValCounterHard + 1
                console.log(MeansValCounterHard, str)
                if (!ThickOnly && !WidhtOnly) {
                    if (strValid == "") {

                        console.log("helofromif")
                        if (MeansValCounterHard == 1) {
                            recivedMeanValHard = true
                        }
                    }

                    else if (MeansValCounterHard == 2) {
                        console.log('helofrom else', MeansValCounterHard, str)
                        recivedMeanValHard = true;

                    }
                }
            }

            if (recivedLineHard == true && recivedMeanValHard == true && str.includes(':')) {
                var stronlyValues = str.split(':');

                // for (let onlyVal of stronlyValues) {
                //  if (onlyVal.includes('.')) {
                var Hardvalues = stronlyValues[1].split(' ');
                let arr = Hardvalues.filter(function (item) {
                    return item !== ''
                })
                HardCount = HardCount + 1;
                if (DaimOnly && HardOnly) {

                    strValidHard = strValidHard + " D " + arr[0] + "mm H " + arr[1] + "N |";
                }
                else if (!DaimOnly && HardOnly) {
                    strValidHard = strValidHard + " H " + arr[0] + "N |";
                }


                else if (DaimOnly && !HardOnly) {

                    strValidHard = strValidHard + " D " + arr[0] + "mm |"
                };

                //  }
                // }

            }



            if (str.includes('Statistics')) {
                recivedLineHard = false;
                DaimOnly = false;
                HardOnly = false;
            }







        }

        var thickarr = strValid.split('|');
        //console.log(thickarr);
        var hardArr = strValidHard.split('|');
        // console.log(hardArr, 'hardarr');
        var result = "";
        var index = 0;
        var counter = 1
        if (hardArr != "" && thickarr != "") {
            thickarr = thickarr.filter(function (item) {
                return item !== ''
            })
            hardArr = hardArr.filter(function (item) {
                return item !== ''
            })

            result = thickarr.map(val => {
                thickarr = thickarr.filter(function (item) {
                    return item !== ''
                })

                let res = val + hardArr[index];
                index = index + 1;
                return res;


            })
        } else if (thickarr != "") {
            thickarr = thickarr.filter(function (item) {
                return item !== ''
            })
            result = thickarr
        }
        else if (hardArr != "") {
            hardArr = hardArr.filter(function (item) {
                return item !== ''
            })
            result = hardArr.map(val => {

                let res = "@" + counter + hardArr[index];
                counter = counter + 1
                index = index + 1
                return res
            })
        }
        return result;
    }



}

module.exports = HardnessParsing;