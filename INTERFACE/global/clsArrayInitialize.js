const commanClibFunt = require('../model/Calibration/clsCalibCommonFunction.model');
const globalData = require('./globalData');
const FetchDetail = require('../model/clsFetchDetails.model');

const comman = new commanClibFunt();
const fetchDetails = new FetchDetail();

class ArrayInitialize{
    async InitializeArrays(strIdsNo,balType) {
        try {
            // var objOwner = globalData.arrPreWeighCalibOwner.find(k => k.idsNo == strIdsNo);
            balType == "analytical" ? "Balance" : "IPC Balance"
            if (balType == 'analytical') {
                var recalliTable = `tbl_recalibration_balance_status`;
                var calibTable = 'tbl_calibration_status';
                globalData.arrBalanceRecalibStatus = await fetchDetails.getRecalibBalanceStatus(recalliTable); 
            } else {
                var recalliTable = `tbl_recalibration_balance_status_bin`;
                var calibTable = 'tbl_calibration_status_bin';
                globalData.arrBalanceRecalibStatusIPC = await fetchDetails.getRecalibBalanceStatus(recalliTable); 
            }

            globalData.arrDaqSrNoInfo = await fetchDetails.getAllDaqSrNo(); //
           // globalData.arrsetAllParameters = await fetchDetails.getAllParameters(); //
            globalData.arrCalibrationSequnce = await fetchDetails.getCalibrationSequence();
            const array = await comman.sortObject(globalData.arrCalibrationSequnce[0]);  
            var arr_newAray = [];
            for (let i = 0; i < array.length; i++) {
                if (array[i].value !== 0) {
                    arr_newAray.push(array[i].key)
                }
            }
            globalData.arrSortedCalib = arr_newAray; 
            console.log(globalData.arrSortedCalib);

            return "Success";
            

        } catch (error) {
            return "Error";
        }
    }
}

module.exports= ArrayInitialize;