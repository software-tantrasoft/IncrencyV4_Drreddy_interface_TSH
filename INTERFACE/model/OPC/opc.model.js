var request = require('request');
var serverConfig = require('../../../../IncrencyV4SDPConfigMSSQL.json')
// var serverConfig = require('../../global/serverConfig')
var OPCURL = serverConfig.opcAddress
const mqttProtocols = require('../../global/GLOBAL_NOMENCLATURE');
const clsMqttSender = require('../../model/Mqtt/mqttSender.class');
// var logFromPC = require('../clsLogger');
// const ErrorLog = require('../../model/clsErrorLog');
const date = require('date-and-time');
// var Tracker = require('../clsTracker');
const mqttSender = new clsMqttSender();
class OPC {

  async exportToOPC_Balance(strBalanceId, objBalValues, strHmi) {
    var arrBal = [];

    arrBal.push({ "id": "PTGUII_Balance." + strBalanceId + ".TestName", "v": objBalValues.TestName });
    arrBal.push({ "id": "PTGUII_Balance." + strBalanceId + ".ProductName", "v": objBalValues.ProductName });
    // arrBal.push({ "id": "PTGUII_Balance." + strBalanceId + ".Date", "v": objBalValues.strDate });
    arrBal.push({ "id": "PTGUII_Balance." + strBalanceId + ".TestStart", "v": objBalValues.TestStart });
    // arrBal.push({ "id": "PTGUII_Balance." + strBalanceId + ".NoOfSample_GrpWt", "v": "0" });
    arrBal.push({ "id": "PTGUII_Balance." + strBalanceId + ".NoOfSample_IndiWt", "v": objBalValues.NoOfSample_IndiWt });
    arrBal.push({ "id": "PTGUII_Balance." + strBalanceId + ".BatchNo", "v": objBalValues.BatchNo });
    // arrBal.push({ "id": "PTGUII_Balance." + strBalanceId + ".ActMaximumGrpWeight", "v": "0" });
    arrBal.push({ "id": "PTGUII_Balance." + strBalanceId + ".Side", "v": objBalValues.Side });
    // arrBal.push({ "id": "PTGUII_Balance." + strBalanceId + ".ActMinimumGrpWeight", "v": "0" });
    // arrBal.push({ "id": "PTGUII_Balance." + strBalanceId + ".AverageGrpWeight", "v": "0" });
    arrBal.push({ "id": "PTGUII_Balance." + strBalanceId + ".ActMaximumIndiWeight", "v": objBalValues.ActMaximumIndiWeight });
    arrBal.push({ "id": "PTGUII_Balance." + strBalanceId + ".ActMinimumIndiWeight", "v": objBalValues.ActMinimumIndiWeight });
    arrBal.push({ "id": "PTGUII_Balance." + strBalanceId + ".AverageIndiWeight", "v": objBalValues.AverageIndiWeight });
    // arrBal.push({ "id": "PTGUII_Balance." + strBalanceId + ".TestResult_GrpWtVariation", "v": "0" });
    arrBal.push({ "id": "PTGUII_Balance." + strBalanceId + ".TestResult_IndiWtVariation", "v": objBalValues.TestResult_IndiWtVariation });
    arrBal.push({ "id": "PTGUII_Balance." + strBalanceId + ".TestEnd", "v": objBalValues.TestEnd });
    // arrBal.push({ "id": "PTGUII_Balance." + strBalanceId + ".Lot", "v": objBalValues.Lot });
    // if (typeValue == 1) {
    //   arrBal.push({ "id": "PTGUII_Balance." + strBalanceId + ".BatchAvg", "v": objBalValues.AverageValue });
    // }


    // objBalValues.intValue.forEach((value,i) => {
    //     arrBal.push({ "id": "PTGUII_Bal." + strBalanceId + ".value" + i+1 , "v": value });
    // });

    // request.post({ url:OPCURL , form: arrBal }, function (err, httpResponse, body) { 
    //     if (err) {
    //         console.log(err);
    //     } else { 
    //         console.log(body);
    //     }
    // })
    console.log(arrBal)

    //commented by vivek on 18-08-2020********************************
    //Tracker.info(`${date.format(new Date(), 'DD-MM-YYYY HH:mm:ss')} ${strBalanceId} -> Calling OPC function (Balance Group)`);
    //Tracker.addtoTrackerLog(`${date.format(new Date(), 'DD-MM-YYYY HH:mm:ss')} ${strBalanceId} -> Calling OPC function (Balance Group)`)
    //************************************************************** */
    request({
      url: OPCURL,
      method: 'POST',
      body: arrBal,
      json: true
    }, function (err, response, body) {

      if (err) {
        
        return console.log('Error while posting data to OPC', err)
        //   let logQ = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + strBalanceId + " : " + err;
        // var logError = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + " , " + strBalanceId + ":Body:" + arrBal;
        // logError = logError + err.stack;
        //commented by vivek on 15-08-2020*********************************** */
        //ErrorLog.error(logError);
        // ErrorLog.addToErrorLog(logError);
        //******************************************************************* */
      } else {
        if (body == null || body == undefined) {
         return console.log('Error while posting data to OPC, Something got null and undefined');
          // let msg = "Error while posting data to OPC, Something got null and undefined";
          // var logError = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + " , " + strBalanceId + ": Body:" + arrBal;
          // logError = logError + msg;
          //commented by vivek on 15-08-2020*********************************** */
          //ErrorLog.error(logError);
          // ErrorLog.addToErrorLog(logError);
          //******************************************************************* */
        } else {
          console.log('Data posted to OPC', body);
          let logQ = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + strBalanceId + " : OPC Data posted successfully" + body;
          mqttSender.sendData(strHmi, `${mqttProtocols.DisplayMessage}OPC Data posted successfully`)   
          //commented by vivek on 18-08-2020********************************
          //logFromPC.addtoProtocolLog(logQ, "info");
          //logFromPC.addtoProtocolLog(logQ)
          //************************************************************** */
        }
      }
    });
  }
  async exportToOPC_Vernier(strVernierId, objBalValues) {
    var arrBal = [];

    arrBal.push({ "id": "PTGUII_Vernier." + strVernierId + ".ActMaximumBreadth", "v": objBalValues.ActMaximumBreadth });
    arrBal.push({ "id": "PTGUII_Vernier." + strVernierId + ".ActMaximumDiameter", "v": objBalValues.ActMaximumDiameter });
    // arrBal.push({ "id": "PTGUII_Vern." + strVernierId + ".Date", "v": objBalValues.strDate });
    arrBal.push({ "id": "PTGUII_Vernier." + strVernierId + ".ActMaximumLength", "v": objBalValues.ActMaximumLength });
    arrBal.push({ "id": "PTGUII_Vernier." + strVernierId + ".ActMaximumThickness", "v": objBalValues.ActMaximumThickness });
    arrBal.push({ "id": "PTGUII_Vernier." + strVernierId + ".ActMinimumBreadth", "v": objBalValues.ActMinimumBreadth });
    arrBal.push({ "id": "PTGUII_Vernier." + strVernierId + ".ActMinimumDiameter", "v": objBalValues.ActMinimumDiameter });
    arrBal.push({ "id": "PTGUII_Vernier." + strVernierId + ".ActMinimumLength", "v": objBalValues.ActMinimumLength });
    arrBal.push({ "id": "PTGUII_Vernier." + strVernierId + ".ActMinimumThickness", "v": objBalValues.ActMinimumThickness });
    arrBal.push({ "id": "PTGUII_Vernier." + strVernierId + ".AverageBreadth", "v": objBalValues.AverageBreadth });
    // arrBal.push({ "id": "PTGUII_Vern." + strVernierId + ".maximum_indi", "v": objBalValues.intMaximumInd });
    // arrBal.push({ "id": "PTGUII_Vern." + strVernierId + ".minimum_indi", "v": objBalValues.intMinimumInd });
    // arrBal.push({ "id": "PTGUII_Vern." + strVernierId + ".average_indi", "v": objBalValues.intAverage });
    arrBal.push({ "id": "PTGUII_Vernier." + strVernierId + ".AverageThickness", "v": objBalValues.AverageThickness });
    arrBal.push({ "id": "PTGUII_Vernier." + strVernierId + ".AverageDiameter", "v": objBalValues.AverageDiameter });
    arrBal.push({ "id": "PTGUII_Vernier." + strVernierId + ".AverageLength", "v": objBalValues.AverageLength });
    arrBal.push({ "id": "PTGUII_Vernier." + strVernierId + ".BatchNo", "v": objBalValues.BatchNo });
    arrBal.push({ "id": "PTGUII_Vernier." + strVernierId + ".Lot", "v": objBalValues.Lot });
    arrBal.push({ "id": "PTGUII_Vernier." + strVernierId + ".NoOfSample_Breadth", "v": objBalValues.NoOfSample_Breadth });
    arrBal.push({ "id": "PTGUII_Vernier." + strVernierId + ".NoOfSample_Diameter", "v": objBalValues.NoOfSample_Diameter });
    arrBal.push({ "id": "PTGUII_Vernier." + strVernierId + ".NoOfSample_Length", "v": objBalValues.NoOfSample_Length });
    arrBal.push({ "id": "PTGUII_Vernier." + strVernierId + ".NoOfSample_Thickness", "v": objBalValues.NoOfSample_Thickness });
    arrBal.push({ "id": "PTGUII_Vernier." + strVernierId + ".ProductName", "v": objBalValues.ProductName });
    arrBal.push({ "id": "PTGUII_Vernier." + strVernierId + ".Side", "v": objBalValues.Side });
    arrBal.push({ "id": "PTGUII_Vernier." + strVernierId + ".TestEnd", "v": objBalValues.TestEnd });
    arrBal.push({ "id": "PTGUII_Vernier." + strVernierId + ".TestName", "v": objBalValues.TestName });
    arrBal.push({ "id": "PTGUII_Vernier." + strVernierId + ".TestResult_Breadth", "v": objBalValues.TestResult_Breadth });
    arrBal.push({ "id": "PTGUII_Vernier." + strVernierId + ".TestResult_Diameter", "v": objBalValues.TestResult_Diameter });
    arrBal.push({ "id": "PTGUII_Vernier." + strVernierId + ".TestResult_Length", "v": objBalValues.TestResult_Length });
    arrBal.push({ "id": "PTGUII_Vernier." + strVernierId + ".TestResult_Thickness", "v": objBalValues.TestResult_Thickness });
    arrBal.push({ "id": "PTGUII_Vernier." + strVernierId + ".TestStart", "v": objBalValues.TestStart });



    // objBalValues.intValue.forEach((value,i) => {
    //     arrBal.push({ "id": "PTGUII_Bal." + strBalanceId + ".value" + i+1 , "v": value });
    // });

    // request.post({ url:OPCURL , form: arrBal }, function (err, httpResponse, body) { 
    //     if (err) {
    //         console.log(err);
    //     } else { 
    //         console.log(body);
    //     }
    // })

    console.log(arrBal);
    request({
      url: OPCURL,
      method: 'POST',
      body: arrBal,
      json: true
    }, function (err, response, body) {

      if (err) {
        console.log('Error while posting data to OPC', err)
        //   let logQ = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + strBalanceId + " : " + err;
        var logError = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + " , " + strVernierId + ":";
        logError = logError + err.stack;
        //commented by vivek on 15-08-2020*********************************** */
        //ErrorLog.error(logError);
        ErrorLog.addToErrorLog(logError);
        //******************************************************************* */
      } else {
        if (body == null || body == undefined) {
          console.log('Error while posting data to OPC, Something got null and undefined');
          let msg = "Error while posting data to OPC, Something got null and undefined";
          var logError = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + " , " + strVernierId + ":";
          logError = logError + msg;
          //commented by vivek on 15-08-2020*********************************** */
          //ErrorLog.error(logError);
          ErrorLog.addToErrorLog(logError);
          //******************************************************************* */
        } else {
          console.log('Data posted to OPC', body);
          let logQ = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + strVernierId + " : OPC Data posted successfully" + body;
          //commented by vivek on 18-08-2020********************************
          //logFromPC.addtoProtocolLog(logQ, "info");
          //logFromPC.addtoProtocolLog(logQ)
          //************************************************************** */
        }
      }
    });
  }
  async exportToOPC_MultiParamHardness(strHardnessId, objBalValues) {
    var arrBal = [];

    arrBal.push({ "id": "PTGUII_HardnessTester." + strHardnessId + ".ActMaximumDiameter", "v": objBalValues.ActMaximumDiameter });
    arrBal.push({ "id": "PTGUII_HardnessTester." + strHardnessId + ".ActMaximumHardness", "v": objBalValues.ActMaximumHardness });
    // arrBal.push({ "id": "PTGUII_Vern." + strVernierId + ".Date", "v": objBalValues.strDate });
    arrBal.push({ "id": "PTGUII_HardnessTester." + strHardnessId + ".ActMaximumlength", "v": objBalValues.ActMaximumlength });
    arrBal.push({ "id": "PTGUII_HardnessTester." + strHardnessId + ".ActMaximumThickness", "v": objBalValues.ActMaximumThickness });
    arrBal.push({ "id": "PTGUII_HardnessTester." + strHardnessId + ".ActMinimumDiameter", "v": objBalValues.ActMinimumDiameter });
    arrBal.push({ "id": "PTGUII_HardnessTester." + strHardnessId + ".ActMinimumHardness", "v": objBalValues.ActMinimumHardness });
    arrBal.push({ "id": "PTGUII_HardnessTester." + strHardnessId + ".ActMinimumlength", "v": objBalValues.ActMinimumlength });
    arrBal.push({ "id": "PTGUII_HardnessTester." + strHardnessId + ".ActMinimumThickness", "v": objBalValues.ActMinimumThickness });
    arrBal.push({ "id": "PTGUII_HardnessTester." + strHardnessId + ".AverageDiameter", "v": objBalValues.AverageDiameter });
    // arrBal.push({ "id": "PTGUII_Vern." + strVernierId + ".maximum_indi", "v": objBalValues.intMaximumInd });
    // arrBal.push({ "id": "PTGUII_Vern." + strVernierId + ".minimum_indi", "v": objBalValues.intMinimumInd });
    // arrBal.push({ "id": "PTGUII_Vern." + strVernierId + ".average_indi", "v": objBalValues.intAverage });
    arrBal.push({ "id": "PTGUII_HardnessTester." + strHardnessId + ".AverageHardness", "v": objBalValues.AverageHardness });
    arrBal.push({ "id": "PTGUII_HardnessTester." + strHardnessId + ".Averagelength", "v": objBalValues.Averagelength });
    arrBal.push({ "id": "PTGUII_HardnessTester." + strHardnessId + ".AverageThickness", "v": objBalValues.AverageThickness });
    arrBal.push({ "id": "PTGUII_HardnessTester." + strHardnessId + ".BatchNo", "v": objBalValues.BatchNo });
    arrBal.push({ "id": "PTGUII_HardnessTester." + strHardnessId + ".Lot", "v": objBalValues.Lot });
    arrBal.push({ "id": "PTGUII_HardnessTester." + strHardnessId + ".NoOfSample", "v": objBalValues.NoOfSample });
    arrBal.push({ "id": "PTGUII_HardnessTester." + strHardnessId + ".ProductName", "v": objBalValues.ProductName });
    arrBal.push({ "id": "PTGUII_HardnessTester." + strHardnessId + ".Side", "v": objBalValues.Side });
    arrBal.push({ "id": "PTGUII_HardnessTester." + strHardnessId + ".TestEnd", "v": objBalValues.TestEnd });
    arrBal.push({ "id": "PTGUII_HardnessTester." + strHardnessId + ".TestName", "v": objBalValues.TestName });
    arrBal.push({ "id": "PTGUII_HardnessTester." + strHardnessId + ".TestResultDiameter", "v": objBalValues.TestResultDiameter });
    arrBal.push({ "id": "PTGUII_HardnessTester." + strHardnessId + ".TestResultHardness", "v": objBalValues.TestResultHardness });
    arrBal.push({ "id": "PTGUII_HardnessTester." + strHardnessId + ".TestResultlength", "v": objBalValues.TestResultlength });
    arrBal.push({ "id": "PTGUII_HardnessTester." + strHardnessId + ".TestResultThickness", "v": objBalValues.TestResultThickness });
    arrBal.push({ "id": "PTGUII_HardnessTester." + strHardnessId + ".TestStart", "v": objBalValues.TestStart });
    console.log(arrBal)

    // objBalValues.intValue.forEach((value,i) => {
    //     arrBal.push({ "id": "PTGUII_Bal." + strBalanceId + ".value" + i+1 , "v": value });
    // });

    // request.post({ url:OPCURL , form: arrBal }, function (err, httpResponse, body) { 
    //     if (err) {
    //         console.log(err);
    //     } else { 
    //         console.log(body);
    //     }
    // })


    request({
      url: OPCURL,
      method: 'POST',
      body: arrBal,
      json: true
    }, function (err, response, body) {

      if (err) {
        console.log('Error while posting data to OPC', err)
        //   let logQ = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + strBalanceId + " : " + err;
        var logError = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + " , " + strHardnessId + ":";
        logError = logError + err.stack;
        //commented by vivek on 15-08-2020*********************************** */
        //ErrorLog.error(logError);
        ErrorLog.addToErrorLog(logError);
        //******************************************************************* */
      } else {
        if (body == null || body == undefined) {
          console.log('Error while posting data to OPC, Something got null and undefined');
          let msg = "Error while posting data to OPC, Something got null and undefined";
          var logError = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + " , " + strHardnessId + ":";
          logError = logError + msg;
          //commented by vivek on 15-08-2020*********************************** */
          //ErrorLog.error(logError);
          ErrorLog.addToErrorLog(logError);
          //******************************************************************* */
        } else {
          console.log('Data posted to OPC', body);
          let logQ = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + strHardnessId + " : OPC Data posted successfully" + body;
          //commented by vivek on 18-08-2020********************************
          //logFromPC.addtoProtocolLog(logQ, "info");
          //logFromPC.addtoProtocolLog(logQ)
          //************************************************************** */
        }
      }
    });
  }
  async exportToOPC_MA(strMAId, objBalValues, strHmi) {
    var arrBal = [];

    arrBal.push({ "id": "PTGUII_MoistAnly." + strMAId + ".BatchNo", "v": objBalValues.BatchNo });
    arrBal.push({ "id": "PTGUII_MoistAnly." + strMAId + ".TestStart", "v": objBalValues.TestStart });
    // arrBal.push({ "id": "PTGUII_Vern." + strVernierId + ".Date", "v": objBalValues.strDate });
    arrBal.push({ "id": "PTGUII_MoistAnly." + strMAId + ".SetDryingTemp", "v": parseFloat(objBalValues.SetDryingTemp) });
    arrBal.push({ "id": "PTGUII_MoistAnly." + strMAId + ".TestEnd", "v": objBalValues.TestEnd });
    arrBal.push({ "id": "PTGUII_MoistAnly." + strMAId + ".FinalWeight", "v": parseFloat(objBalValues.FinalWeight) });
    arrBal.push({ "id": "PTGUII_MoistAnly." + strMAId + ".Layer", "v": objBalValues.Layer });
    arrBal.push({ "id": "PTGUII_MoistAnly." + strMAId + ".ActLossOnDrying", "v": parseFloat(objBalValues.ActLossOnDrying) });
    arrBal.push({ "id": "PTGUII_MoistAnly." + strMAId + ".Lot", "v": objBalValues.Lot });
    arrBal.push({ "id": "PTGUII_MoistAnly." + strMAId + ".ProdName", "v": objBalValues.ProdName });
    // arrBal.push({ "id": "PTGUII_Vern." + strVernierId + ".maximum_indi", "v": objBalValues.intMaximumInd });
    // arrBal.push({ "id": "PTGUII_Vern." + strVernierId + ".minimum_indi", "v": objBalValues.intMinimumInd });
    // arrBal.push({ "id": "PTGUII_Vern." + strVernierId + ".average_indi", "v": objBalValues.intAverage });
    arrBal.push({ "id": "PTGUII_MoistAnly." + strMAId + ".TestResult", "v": objBalValues.TestResult });
    arrBal.push({ "id": "PTGUII_MoistAnly." + strMAId + ".Stage", "v": objBalValues.Stage });
    arrBal.push({ "id": "PTGUII_MoistAnly." + strMAId + ".StartWeight", "v": parseFloat(objBalValues.StartWeight) });
    arrBal.push({ "id": "PTGUII_MoistAnly." + strMAId + ".TestName", "v": objBalValues.TestName });

    console.log(arrBal)
    // objBalValues.intValue.forEach((value,i) => {
    //     arrBal.push({ "id": "PTGUII_Bal." + strBalanceId + ".value" + i+1 , "v": value });
    // });

    // request.post({ url:OPCURL , form: arrBal }, function (err, httpResponse, body) { 
    //     if (err) {
    //         console.log(err);
    //     } else { 
    //         console.log(body);
    //     }
    // })


    request({
      url: OPCURL,
      method: 'POST',
      body: arrBal,
      json: true
    }, function (err, response, body) {

      if (err) {
        
        return console.log('Error while posting data to OPC', err)
        //   let logQ = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + strBalanceId + " : " + err;
        // var logError = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + " , " + strBalanceId + ":Body:" + arrBal;
        // logError = logError + err.stack;
        //commented by vivek on 15-08-2020*********************************** */
        //ErrorLog.error(logError);
        // ErrorLog.addToErrorLog(logError);
        //******************************************************************* */
      } else {
        if (body == null || body == undefined) {
         return console.log('Error while posting data to OPC, Something got null and undefined');
          // let msg = "Error while posting data to OPC, Something got null and undefined";
          // var logError = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + " , " + strBalanceId + ": Body:" + arrBal;
          // logError = logError + msg;
          //commented by vivek on 15-08-2020*********************************** */
          //ErrorLog.error(logError);
          // ErrorLog.addToErrorLog(logError);
          //******************************************************************* */
        } else {
          console.log('Data posted to OPC', body);
          let logQ = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + strMAId + " : OPC Data posted successfully" + body;
          mqttSender.sendData(strHmi, `${mqttProtocols.DisplayMessage}OPC Data posted successfully`)   
          //commented by vivek on 18-08-2020********************************
          //logFromPC.addtoProtocolLog(logQ, "info");
          //logFromPC.addtoProtocolLog(logQ)
          //************************************************************** */
        }
      }
    });
  }
  async exportToOPC_DT(strDTId, objBalValues) {
    var arrBal = [];

    arrBal.push({ "id": "PTGUII_DT." + strDTId + ".ActMaximumTemp", "v": objBalValues.ActMaximumTemp });
    arrBal.push({ "id": "PTGUII_DT." + strDTId + ".ActMaxTimeLHS", "v": objBalValues.ActMaxTimeLHS });
    // arrBal.push({ "id": "PTGUII_Vern." + strVernierId + ".Date", "v": objBalValues.strDate });
    arrBal.push({ "id": "PTGUII_DT." + strDTId + ".ActMaxTimeRHS", "v": objBalValues.ActMaxTimeRHS });
    arrBal.push({ "id": "PTGUII_DT." + strDTId + ".ActMinimumTemp", "v": objBalValues.ActMinimumTemp });
    arrBal.push({ "id": "PTGUII_DT." + strDTId + ".BatchNo", "v": objBalValues.BatchNo });
    arrBal.push({ "id": "PTGUII_DT." + strDTId + ".Lot", "v": objBalValues.Lot });
    arrBal.push({ "id": "PTGUII_DT." + strDTId + ".NoOfSample", "v": objBalValues.NoOfSample });
    arrBal.push({ "id": "PTGUII_DT." + strDTId + ".ProductName", "v": objBalValues.ProductName });
    arrBal.push({ "id": "PTGUII_DT." + strDTId + ".Side", "v": objBalValues.Side });
    // arrBal.push({ "id": "PTGUII_Vern." + strVernierId + ".maximum_indi", "v": objBalValues.intMaximumInd });
    // arrBal.push({ "id": "PTGUII_Vern." + strVernierId + ".minimum_indi", "v": objBalValues.intMinimumInd });
    // arrBal.push({ "id": "PTGUII_Vern." + strVernierId + ".average_indi", "v": objBalValues.intAverage });
    arrBal.push({ "id": "PTGUII_DT." + strDTId + ".TestEnd", "v": objBalValues.TestEnd });
    arrBal.push({ "id": "PTGUII_DT." + strDTId + ".TestName", "v": objBalValues.TestName });
    arrBal.push({ "id": "PTGUII_DT." + strDTId + ".TestResult", "v": objBalValues.TestResult });
    arrBal.push({ "id": "PTGUII_DT." + strDTId + ".TestStart", "v": objBalValues.TestStart });

    console.log(arrBal)
    // objBalValues.intValue.forEach((value,i) => {
    //     arrBal.push({ "id": "PTGUII_Bal." + strBalanceId + ".value" + i+1 , "v": value });
    // });

    // request.post({ url:OPCURL , form: arrBal }, function (err, httpResponse, body) { 
    //     if (err) {
    //         console.log(err);
    //     } else { 
    //         console.log(body);
    //     }
    // })


    request({
      url: OPCURL,
      method: 'POST',
      body: arrBal,
      json: true
    }, function (err, response, body) {

      if (err) {
        console.log('Error while posting data to OPC', err)
        //   let logQ = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + strBalanceId + " : " + err;
        var logError = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + " , " + strDTId + ":";
        logError = logError + err.stack;
        //commented by vivek on 15-08-2020*********************************** */
        //ErrorLog.error(logError);
        ErrorLog.addToErrorLog(logError);
        //******************************************************************* */
      } else {
        if (body == null || body == undefined) {
          console.log('Error while posting data to OPC, Something got null and undefined');
          let msg = "Error while posting data to OPC, Something got null and undefined";
          var logError = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + " , " + strDTId + ":";
          logError = logError + msg;
          //commented by vivek on 15-08-2020*********************************** */
          //ErrorLog.error(logError);
          ErrorLog.addToErrorLog(logError);
          //******************************************************************* */
        } else {
          console.log('Data posted to OPC', body);
          let logQ = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + strDTId + " : OPC Data posted successfully" + body;
          //commented by vivek on 18-08-2020********************************
          //logFromPC.addtoProtocolLog(logQ, "info");
          //logFromPC.addtoProtocolLog(logQ)
          //************************************************************** */
        }
      }
    });
  }
  async exportToOPC_TDT(strTDTId, objBalValues) {
    var arrBal = [];

    arrBal.push({ "id": "PTGUII_TappedDensity." + strTDTId + ".TestName", "v": objBalValues.TestName });
    arrBal.push({ "id": "PTGUII_TappedDensity." + strTDTId + ".ProductName", "v": objBalValues.ProductName });
    // arrBal.push({ "id"PTGUII_TappedDensity_Vern." + strVernierId + ".Date", "v": objBalValues.strDate });
    arrBal.push({ "id": "PTGUII_TappedDensity." + strTDTId + ".TestStart", "v": objBalValues.TestStart });
    arrBal.push({ "id": "PTGUII_TappedDensity." + strTDTId + ".QuantityOfSample", "v": objBalValues.QuantityOfSample });
    arrBal.push({ "id": "PTGUII_TappedDensity." + strTDTId + ".BatchNo", "v": objBalValues.BatchNo });
    arrBal.push({ "id": "PTGUII_TappedDensity." + strTDTId + ".TestResult", "v": objBalValues.TestResult });
    arrBal.push({ "id": "PTGUII_TappedDensity." + strTDTId + ".TestEnd", "v": objBalValues.TestEnd });
    arrBal.push({ "id": "PTGUII_TappedDensity." + strTDTId + ".Lot", "v": objBalValues.Lot });
    arrBal.push({ "id": "PTGUII_TappedDensity." + strTDTId + ".Volume occupied(Vo)", "v": objBalValues.VolumeOccupiedVo });
    // arrBal.push({ "id": "PTGUII_Vern." + strVernierId + ".maximum_indi", "v": objBalValues.intMaximumInd });
    // arrBal.push({ "id": "PTGUII_Vern." + strVernierId + ".minimum_indi", "v": objBalValues.intMinimumInd });
    // arrBal.push({ "id": "PTGUII_Vern." + strVernierId + ".average_indi", "v": objBalValues.intAverage });
    arrBal.push({ "id": "PTGUII_TappedDensity." + strTDTId + ".Tapped Density", "v": objBalValues.TappedDensity });
    arrBal.push({ "id": "PTGUII_TappedDensity." + strTDTId + ".Tapped volume(V10)", "v": objBalValues.TappedvolumeV10 });
    arrBal.push({ "id": "PTGUII_TappedDensity." + strTDTId + ".Tapped volume(V500)", "v": objBalValues.TappedvolumeV500 });
    arrBal.push({ "id": "PTGUII_TappedDensity." + strTDTId + ".Tapped volume (V1250a)", "v": objBalValues.TappedvolumeV1250a });
    arrBal.push({ "id": "PTGUII_TappedDensity." + strTDTId + ".Tapped volume (V1250b)", "v": objBalValues.TappedvolumeV1250b });
    arrBal.push({ "id": "PTGUII_TappedDensity." + strTDTId + ".Tapped volume (V1250c)", "v": objBalValues.TappedvolumeV1250c });
    arrBal.push({ "id": "PTGUII_TappedDensity." + strTDTId + ".Method", "v": objBalValues.Method });
    arrBal.push({ "id": "PTGUII_TappedDensity." + strTDTId + ".Layer", "v": objBalValues.Layer });

    console.log(arrBal)
    // objBalValues.intValue.forEach((value,i) => {
    //     arrBal.push({ "id": "PTGUII_Bal." + strBalanceId + ".value" + i+1 , "v": value });
    // });

    // request.post({ url:OPCURL , form: arrBal }, function (err, httpResponse, body) { 
    //     if (err) {
    //         console.log(err);
    //     } else { 
    //         console.log(body);
    //     }
    // })


    request({
      url: OPCURL,
      method: 'POST',
      body: arrBal,
      json: true
    }, function (err, response, body) {

      if (err) {
        console.log('Error while posting data to OPC', err)
        //   let logQ = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + strBalanceId + " : " + err;
        var logError = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + " , " + strTDTId + ":";
        logError = logError + err.stack;
        //commented by vivek on 15-08-2020*********************************** */
        //ErrorLog.error(logError);
        ErrorLog.addToErrorLog(logError);
        //******************************************************************* */
      } else {
        if (body == null || body == undefined) {
          console.log('Error while posting data to OPC, Something got null and undefined');
          let msg = "Error while posting data to OPC, Something got null and undefined";
          var logError = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + " , " + strTDTId + ":";
          logError = logError + msg;
          //commented by vivek on 15-08-2020*********************************** */
          //ErrorLog.error(logError);
          ErrorLog.addToErrorLog(logError);
          //******************************************************************* */
        } else {
          console.log('Data posted to OPC', body);
          let logQ = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + strTDTId + " : OPC Data posted successfully" + body;
          //commented by vivek on 18-08-2020********************************
          //logFromPC.addtoProtocolLog(logQ, "info");
          //logFromPC.addtoProtocolLog(logQ)
          //************************************************************** */
        }
      }
    });
  }
  async exportToOPC_SS(strSSTId, objBalValues) {
    var arrBal = [];

    arrBal.push({ "id": "PTGUII_SieveShaker." + strSSTId + ".PerFineAbove100Mesh", "v": objBalValues.QuantityAbove100Mesh });
    arrBal.push({ "id": "PTGUII_SieveShaker." + strSSTId + ".PerFineAbove20Mesh", "v": objBalValues.perFineAbove20Mesh });
    // arrBal.push({ "id": "PTGUII_Vern." + strVernierId + ".Date", "v": objBalValues.strDate });
    arrBal.push({ "id": "PTGUII_SieveShaker." + strSSTId + ".PerFineAbove40Mesh", "v": objBalValues.PerFineAbove40Mesh });
    arrBal.push({ "id": "PTGUII_SieveShaker." + strSSTId + ".PerFineAbove60Mesh", "v": objBalValues.PerFineAbove60Mesh });
    arrBal.push({ "id": "PTGUII_SieveShaker." + strSSTId + ".PerFineAbove80Mesh", "v": objBalValues.PerFineAbove80Mesh });
    arrBal.push({ "id": "PTGUII_SieveShaker." + strSSTId + ".PerFineOnTheColectngtray", "v": objBalValues.PerFineOnTheColectngtray });
    arrBal.push({ "id": "PTGUII_SieveShaker." + strSSTId + ".ActPerFine", "v": objBalValues.PerFine });
    arrBal.push({ "id": "PTGUII_SieveShaker." + strSSTId + ".BatchNo", "v": objBalValues.BatchNo });
    arrBal.push({ "id": "PTGUII_SieveShaker." + strSSTId + ".FinesOnTheColectngtray", "v": objBalValues.FinesOnTheColectngtray });
    // arrBal.push({ "id": "PTGUII_Vern." + strVernierId + ".maximum_indi", "v": objBalValues.intMaximumInd });
    // arrBal.push({ "id": "PTGUII_Vern." + strVernierId + ".minimum_indi", "v": objBalValues.intMinimumInd });
    // arrBal.push({ "id": "PTGUII_Vern." + strVernierId + ".average_indi", "v": objBalValues.intAverage });
    arrBal.push({ "id": "PTGUII_SieveShaker." + strSSTId + ".Lot", "v": objBalValues.Lot });
    arrBal.push({ "id": "PTGUII_SieveShaker." + strSSTId + ".ProductName", "v": objBalValues.ProductName });
    arrBal.push({ "id": "PTGUII_SieveShaker." + strSSTId + ".QuantityAbove100Mesh", "v": objBalValues.QuantityAbove100Mesh });
    arrBal.push({ "id": "PTGUII_SieveShaker." + strSSTId + ".QuantityAbove20Mesh", "v": objBalValues.QuantityAbove20Mesh });
    arrBal.push({ "id": "PTGUII_SieveShaker." + strSSTId + ".QuantityAbove40Mesh", "v": objBalValues.QuantityAbove40Mesh });
    arrBal.push({ "id": "PTGUII_SieveShaker." + strSSTId + ".QuantityAbove60Mesh", "v": objBalValues.QuantityAbove60Mesh });
    arrBal.push({ "id": "PTGUII_SieveShaker." + strSSTId + ".QuantityAbove80Mesh", "v": objBalValues.QuantityAbove80Mesh });
    arrBal.push({ "id": "PTGUII_SieveShaker." + strSSTId + ".QuantityOfSample", "v": objBalValues.QuantityOfSample });
    arrBal.push({ "id": "PTGUII_SieveShaker." + strSSTId + ".TestName", "v": objBalValues.TestName });
    arrBal.push({ "id": "PTGUII_SieveShaker." + strSSTId + ".TestResult", "v": objBalValues.TestResult });
    arrBal.push({ "id": "PTGUII_SieveShaker." + strSSTId + ".TestSamplePerFine", "v": objBalValues.TestSamplePerFine });
    arrBal.push({ "id": "PTGUII_SieveShaker." + strSSTId + ".TestStart", "v": objBalValues.TestStart });

    console.log(arrBal)
    // objBalValues.intValue.forEach((value,i) => {
    //     arrBal.push({ "id": "PTGUII_Bal." + strBalanceId + ".value" + i+1 , "v": value });
    // });

    // request.post({ url:OPCURL , form: arrBal }, function (err, httpResponse, body) { 
    //     if (err) {
    //         console.log(err);
    //     } else { 
    //         console.log(body);
    //     }
    // })


    request({
      url: OPCURL,
      method: 'POST',
      body: arrBal,
      json: true
    }, function (err, response, body) {

      if (err) {
        console.log('Error while posting data to OPC', err)
        //   let logQ = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + strBalanceId + " : " + err;
        var logError = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + " , " + strSSTId + ":";
        logError = logError + err.stack;
        //commented by vivek on 15-08-2020*********************************** */
        //ErrorLog.error(logError);
        ErrorLog.addToErrorLog(logError);
        //******************************************************************* */
      } else {
        if (body == null || body == undefined) {
          console.log('Error while posting data to OPC, Something got null and undefined');
          let msg = "Error while posting data to OPC, Something got null and undefined";
          var logError = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + " , " + strSSTId + ":";
          logError = logError + msg;
          //commented by vivek on 15-08-2020*********************************** */
          //ErrorLog.error(logError);
          ErrorLog.addToErrorLog(logError);
          //******************************************************************* */
        } else {
          console.log('Data posted to OPC', body);
          let logQ = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + strSSTId + " : OPC Data posted successfully" + body;
          //commented by vivek on 18-08-2020********************************
          //logFromPC.addtoProtocolLog(logQ, "info");
          //logFromPC.addtoProtocolLog(logQ)
          //************************************************************** */
        }
      }
    });
  }
  async exportToOPC_Friability(strId, objBalValues) {
    var arrBal = [];

    arrBal.push({ "id": "PTGUII_Friabilator." + strId + ".ActFriabilityPerLHS", "v": objBalValues.ActFriabilityLHS });
    arrBal.push({ "id": "PTGUII_Friabilator." + strId + ".ActFriabilityPerRHS", "v": objBalValues.ActFriabilityRHS });
    arrBal.push({ "id": "PTGUII_Friabilator." + strId + ".ActualCount", "v": objBalValues.ActualCount });
    // arrBal.push({ "id": "PTGUII_Vern." + strVernierId + ".Date", "v": objBalValues.strDate });
    arrBal.push({ "id": "PTGUII_Friabilator." + strId + ".ActualRpm", "v": objBalValues.ActualRpm });
    arrBal.push({ "id": "PTGUII_Friabilator." + strId + ".BatchNo", "v": objBalValues.BatchNo });
    arrBal.push({ "id": "PTGUII_Friabilator." + strId + ".Lot", "v": objBalValues.Lot });
    arrBal.push({ "id": "PTGUII_Friabilator." + strId + ".NoOfSample", "v": objBalValues.NoOfSample });
    arrBal.push({ "id": "PTGUII_Friabilator." + strId + ".ProductName", "v": objBalValues.ProductName });
    arrBal.push({ "id": "PTGUII_Friabilator." + strId + ".Side", "v": objBalValues.Side });
    arrBal.push({ "id": "PTGUII_Friabilator." + strId + ".TestEnd", "v": objBalValues.TestEnd });
    // arrBal.push({ "id": "PTGUII_Vern." + strVernierId + ".maximum_indi", "v": objBalValues.intMaximumInd });
    // arrBal.push({ "id": "PTGUII_Vern." + strVernierId + ".minimum_indi", "v": objBalValues.intMinimumInd });
    // arrBal.push({ "id": "PTGUII_Vern." + strVernierId + ".average_indi", "v": objBalValues.intAverage });
    arrBal.push({ "id": "PTGUII_Friabilator." + strId + ".TestName", "v": objBalValues.TestName });
    arrBal.push({ "id": "PTGUII_Friabilator." + strId + ".TestResult", "v": objBalValues.TestResult });
    arrBal.push({ "id": "PTGUII_Friabilator." + strId + ".TestStart", "v": objBalValues.TestStart });
    arrBal.push({ "id": "PTGUII_Friabilator." + strId + ".WeightAfterTestLHS", "v": objBalValues.WeightAfterTestLHS });
    arrBal.push({ "id": "PTGUII_Friabilator." + strId + ".WeightBeforeTestLHS", "v": objBalValues.WeightBeforeTestLHS });
    arrBal.push({ "id": "PTGUII_Friabilator." + strId + ".WeightAfterTestRHS", "v": objBalValues.WeightAfterTestRHS });
    arrBal.push({ "id": "PTGUII_Friabilator." + strId + ".WeightBeforeTestRHS", "v": objBalValues.WeightBeforeTestRHS });

    console.log(arrBal)
    // objBalValues.intValue.forEach((value,i) => {
    //     arrBal.push({ "id": "PTGUII_Bal." + strBalanceId + ".value" + i+1 , "v": value });
    // });

    // request.post({ url:OPCURL , form: arrBal }, function (err, httpResponse, body) { 
    //     if (err) {
    //         console.log(err);
    //     } else { 
    //         console.log(body);
    //     }
    // })


    request({
      url: OPCURL,
      method: 'POST',
      body: arrBal,
      json: true
    }, function (err, response, body) {

      if (err) {
        console.log('Error while posting data to OPC', err)
        //   let logQ = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + strBalanceId + " : " + err;
        var logError = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + " , " + strId + ":";
        logError = logError + err.stack;
        //commented by vivek on 15-08-2020*********************************** */
        //ErrorLog.error(logError);
        ErrorLog.addToErrorLog(logError);
        //******************************************************************* */
      } else {
        if (body == null || body == undefined) {
          console.log('Error while posting data to OPC, Something got null and undefined');
          let msg = "Error while posting data to OPC, Something got null and undefined";
          var logError = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + " , " + strId + ":";
          logError = logError + msg;
          //commented by vivek on 15-08-2020*********************************** */
          //ErrorLog.error(logError);
          ErrorLog.addToErrorLog(logError);
          //******************************************************************* */
        } else {
          console.log('Data posted to OPC', body);
          let logQ = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + strId + " : OPC Data posted successfully" + body;
          //commented by vivek on 18-08-2020********************************
          //logFromPC.addtoProtocolLog(logQ, "info");
          //logFromPC.addtoProtocolLog(logQ)
          //************************************************************** */
        }
      }
    });
  }
}

module.exports = OPC;