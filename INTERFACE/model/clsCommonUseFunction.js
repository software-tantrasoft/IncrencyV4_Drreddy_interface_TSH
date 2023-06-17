const globalData = require('../global/globalData')
const Global_NomenCalture = require('../global/GLOBAL_NOMENCLATURE')
const clsMqttSender = require('./Mqtt/mqttSender.class');
const Batch = require('./Product/clsBatchSummaryOperation')
const round_off = new Batch()

const mqttSender = new clsMqttSender();

class CommonFunctionalityClass {
    
    async SendCommon(data) {
        try {
            const { strHmi, minLimitT2, maxLimitT2, minLimitT1, maxLimitT1, readingIgnore, strMenuName: strTest, sampleNo: count , } = data
            let outFlagObj = globalData.arrOutFlagForTest.find(k => k.idsNo == strHmi)
            // let objSelMenu = globalData.arrSelectedMenu.find(k => k.idsNo == strHmi).selectedProductDetail;
            let outOfT2 = false;
            let actualWt = data.actualWt
            let outOfT1 = false;
            let limit = 'Within Limit';
            let Color = "White"
            // actualWt = await round_off.calculate_roundoff_value(actualWt,unit)
            
            if (outFlagObj == undefined) {
                globalData.arrOutFlagForTest.push({
                    Hmi: strHmi,
                    outFlag: 0,
                    Test: strTest
                })
            }
            // if(minLimitT2 > actualWt && minLimitT1 > actualWt ){
            //     limit = "BELOW LIMIT !";
            // }
            // if(maxLimitT1 > actualWt && maxLimitT2 > actualWt ){
            //     limit = "ABOVE LIMIT !";
            // }


            outFlagObj = globalData.arrOutFlagForTest.find(k => k.Hmi == strHmi)
            if (readingIgnore == "DOUBLE VALUE") {

                limit = readingIgnore;
                return {
                    limit: `${Global_NomenCalture.DisplayMessage}${limit}`,
                    Color: "Red",
                };
            } else {
                if (minLimitT2 != 0) {
                    if ((parseFloat(actualWt) < parseFloat(minLimitT2)) || (parseFloat(actualWt) > parseFloat(maxLimitT2))) {
                        outFlagObj.outFlag += 1;
                        outOfT2 = true;
                        // console.log('recived weight is out of t2 limit');
                    }
                    if (outFlagObj.outFlag == 0 && parseFloat(maxLimitT1) != 0) {
                        if (parseFloat(actualWt) < parseFloat(minLimitT1) || parseFloat(actualWt) > parseFloat(maxLimitT1)) {
                            // outFlagObj.outFlag += 1;
                            outOfT1 = true;
                            // console.log('recived weight is out of t1 limit');
                        }
                    }



                    /****************************wfwqf */


                    if ((parseFloat(actualWt) < parseFloat(minLimitT2))) {
                        console.log("BELOW LIMIT !");
                        limit = "BELOW LIMIT !";
                        Color = "Orange"
                    } else if ((parseFloat(actualWt) > parseFloat(maxLimitT2))) {
                        console.log("ABOVE LIMIT !");
                        limit = "ABOVE LIMIT !";
                        Color = "Orange"
                    }

                    // if (parseFloat(actualWt) < parseFloat(minLimitT1)) {
                    //     limit = "BELOW LIMIT !";
                    //     Color = "Orange"
                    //     // console.log('recived weight is out of t1 limit');
                    // } else if (parseFloat(actualWt) > parseFloat(maxLimitT1)) {
                    //     limit = "ABOVE LIMIT !";
                    //     Color = "Orange"
                    // }
                    // if (outFlagObj.outFlag > (objSelMenu.NMT)) {
                    //     Color = "Red"
                    // }
                    /************************* */
                    //within limit
                    // if ((outOfT1 && !outOfT2) && ((outFlagObj.outFlag) <= (objSelMenu.NMT))) {
                    //     // limit = "OUT OF T1 LIMIT";
                    //     limit = "BELOW LIMIT !";
                    //     // Color = "Yellow"
                    //     Color = "Orange"
                    // }
                    // if ((!outOfT1 && outOfT2) && ((outFlagObj.outFlag) <= (objSelMenu.NMT))) {
                    //     // limit = "OUT OF T2 LIMIT"
                    //     //  limit = "BELOW LIMIT !";
                    //     limit = "ABOVE LIMIT !";
                    //     // Color = "Yellow"
                    //     Color = "Red"
                    // }
                    // //out of limit
                    // if ((outOfT1 && !outOfT2) && ((outFlagObj.outFlag) > (objSelMenu.NMT))) {
                    //     // limit = "OUT OF T1 LIMIT"
                    //     limit = "ABOVE LIMIT !";
                    //     //   Color = "Purple"
                    //     Color = "Red"
                    // }
                    // if ((!outOfT1 && outOfT2) && ((outFlagObj.outFlag) > (objSelMenu.NMT))) {
                    //     // limit = "OUT OF T2 LIMIT"
                    //     limit = "ABOVE LIMIT !";
                    //     //Color = "Purple"
                    //     Color = "Red"
                    // }
                    // if (outFlagObj.outFlag > (objSelMenu.NMT)) {
                    //     Color = "Red"
                    // }
                    //   return mqttSender.sendData(strHmi, `${Global_NomenCalture.DisplayMessage}Sample ${count} is ${limit}:${Color}`);
                    return {
                        limit: `${Global_NomenCalture.DisplayMessage}${limit}`,
                        Color: Color
                    }
                } else {
                    if (parseFloat(maxLimitT1) != 0) {
                        if (parseFloat(actualWt) < parseFloat(minLimitT1) || parseFloat(actualWt) > parseFloat(maxLimitT1)) {
                            outFlagObj.outFlag += 1;
                            outOfT1 = true;
                            // console.log('recived weight is out of t1 limit');
                        }
                    }

                    //within limit
                    // if ((outOfT1) && ((outFlagObj.outFlag) <= (objSelMenu.NMT))) {
                    //     // limit = "OUT Of T1 LIMIT";
                    //     limit = "BELOW LIMIT !";
                    //     Color = "Yellow"
                    // }
                    // //out of limit
                    // if ((outOfT1) && ((outFlagObj.outFlag) > (objSelMenu.NMT))) {
                    //     // limit = "OUT Of T1 LIMIT"
                    //     limit = "BELOW LIMIT !";
                    //     Color = "Purple"
                    // }

                    // if (outFlagObj.outFlag > (objSelMenu.NMT)) {
                    //     Color = "Purple"
                    // }
                    // if (parseFloat(actualWt) < parseFloat(minLimitT1)) {
                    //     console.log("BELOW LIMIT !");
                    //     limit = "BELOW LIMIT !";
                    //     Color = "Orange"
                    //     // console.log('recived weight is out of t1 limit');
                    // } else if (parseFloat(actualWt) > parseFloat(maxLimitT1)) {
                    //     console.log("ABOVE LIMIT !");
                    //     limit = "ABOVE LIMIT !";
                    //     Color = "Orange"
                    // }

                    // return mqttSender.sendData(strHmi, `${Global_NomenCalture.DisplayMessage}Sample ${count} is ${limit}:${Color}`);
                    return {
                        limit: `${Global_NomenCalture.DisplayMessage}${limit}`,
                        Color: Color
                    };
                }

            }


        } catch (error) {
            throw new Error(error)
        }
    }
}

module.exports = CommonFunctionalityClass;