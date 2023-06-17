// var arrMasterCount = []; //to increment the master Table tabmaster 
// var arrProductAndBatchSelected = []; //to store the data from cubical and product (product and Batch)
// var arrUserID = [];
// var arrStdWgtDetail = [];

// var arrBalanceInfo = [];
// var arrCalibBoxWgtDetail = [];

// var arrCalibSequence = [];
// var arrCalibStatus = [];
// var arrWeighmentProductData = []
// var arrWeighmentCounter = [];
// var arrUsersDetail = [];
// var arrbusy_display = [];
// var arrbusy_displayForWeighment = [];

// var filterArr = []
// var menuType = []
// var menuSequence = []
// var menuName = []
// var productMenuDetails = []

//login
var arrUserRights = [];
var arrUsers = [];
var arrsAllParameters = [];
var monitDetail = [];

//calibration
var arrCalibCounter = [];
var arrOfBalListWithPortNumber = [];
var calibrationStatus = [];
var arrcalibType = [];
var arrBalanceRecalibStatus = [];
var glbArrListOfBalWithCalibPending = [];
var glbArrListOfCalibratedBal = [];
var arrBalance = [];
var arrBalCalibWeights = [];
var arrCalibCounterApi = [];
var arrSelectedBalWithHmi = [];
var arrCalibApiHit = [];

var arrsendWt = [];
var glbArrOfDecimal = [];
var arrCalibInsertCounter = [];
var arrBalCaibDet = [];
var arrsetAllParameters = [];
var arrDaqSrNoInfo = [];
var arrCalibrationSequnce = [];
var arrSortedCalib = [];
var arr_IPQCRelIds = [];
var arrIdsInfo = [];
var arrProductTypeArray = [];
var arrCurrentOperationStatus = [];
module.exports.arr_Perform_Reminder_CalibDueDt = [];
module.exports.arrDataFromInstHardness = [];
module.exports.arrHardness425 = [];
module.exports.arrTapDensity = [];
module.exports.arrPreWeighCalibOwner = [];
module.exports.arrOutFlagForTest = [];

//weightment
var arrLodData = [];
var arr_limits = [];
var arrSelectedMenu = [];
var arrside = [];
var DoubSide = [];
var arrWeighmentCounter = [];
var arrProtocolData = [];
var arrLODTypeSelectedMenu = [];
var arrWeighmentCounterForFriab = [];
var DoubSideForFriab = [];
var arrsampleno = [];
var formatching = [];
var arrPushValuesOfHardness = [];
var HardnessMasterEntry = [];
var arrcheckingInCompRepSerNo = [];
var bulkFlag=[];
module.exports.arrLodData = []
module.exports.arrCurrentOperationStatus = [];
module.exports.arrWeighmentProductData = [];
module.exports.arrWeighmentCounter = [];
module.exports.arrSampleRemarkForAllTest = [];
module.exports.arrWeighmentCounterAfter = [];
module.exports.arrTimeForMenuDisable = [];
module.exports.arrConfigSettings = [];
module.exports.arrDifferentialCounter = [];
module.exports.arrLODTypeSelectedMenu = [];
module.exports.arrProtocolData = [];
module.exports.FrabilityOnBal = [];
module.exports.arrBFBO = [];
module.exports.arrFriGetRpmCout = [];
module.exports.arrBinInfo = [];
module.exports.arrTotalBins = [];
module.exports.arrAreaRelated = [];
module.exports.glbArrCubArea = []
module.exports.arrside = [];
module.exports.arrCalibApiHit = [];
module.exports.monitDetail = [];
module.exports.bulkFlag = bulkFlag;
// module.exports.arrProductAndBatchSelected = arrProductAndBatchSelected;
// module.exports.arrMasterCount = arrMasterCount;
// module.exports.arrUserID = arrUserID;
// module.exports.arrStdWgtDetail = arrStdWgtDetail;

// module.exports.arrBalanceInfo = arrBalanceInfo;
// module.exports.arrCalibBoxWgtDetail = arrCalibBoxWgtDetail;

// module.exports.arrCalibSequence = arrCalibSequence;
// module.exports.arrCalibStatus = arrCalibStatus;

// module.exports.arrWeighmentCounter = arrWeighmentCounter;
// module.exports.arrUsersDetail = arrUsersDetail;
// module.exports.arrbusy_display = arrbusy_display;
// module.exports.arrbusy_displayForWeighment = arrbusy_displayForWeighment;


// module.exports.filterArr = filterArr;
// module.exports.menuType = menuType;
// module.exports.menuSequence = menuSequence;
// module.exports.menuName = menuName;
// module.exports.productMenuDetails = productMenuDetails;
//
module.exports.arrLodData = arrLodData;
module.exports.arrUserRights = arrUserRights;
module.exports.arrUsers = arrUsers;
module.exports.arrsAllParameters = arrsAllParameters;
module.exports.arrProtocolData = arrProtocolData;
module.exports.arrLODTypeSelectedMenu = arrLODTypeSelectedMenu;

module.exports.arrCalibCounter = arrCalibCounter;
module.exports.arrOfBalListWithPortNumber = arrOfBalListWithPortNumber;
module.exports.calibrationStatus = calibrationStatus;
module.exports.arrcalibType = arrcalibType;
module.exports.arrBalanceRecalibStatus = arrBalanceRecalibStatus;
module.exports.glbArrListOfBalWithCalibPending = glbArrListOfBalWithCalibPending;
module.exports.glbArrListOfCalibratedBal = glbArrListOfCalibratedBal;
module.exports.arrBalance = arrBalance;
module.exports.arrBalCalibWeights = arrBalCalibWeights;
module.exports.arrCalibCounterApi = arrCalibCounterApi;
module.exports.arrSelectedBalWithHmi = arrSelectedBalWithHmi;
module.exports.arrCurrentOperationStatus = arrCurrentOperationStatus;

module.exports.arrsendWt = arrsendWt;
module.exports.glbArrOfDecimal = glbArrOfDecimal;
module.exports.arrCalibInsertCounter = arrCalibInsertCounter;
module.exports.arrBalCaibDet = arrBalCaibDet;
module.exports.arrsetAllParameters = arrsetAllParameters;
module.exports.arrDaqSrNoInfo = arrDaqSrNoInfo;
module.exports.arrCalibrationSequnce = arrCalibrationSequnce;
module.exports.arrSortedCalib = arrSortedCalib;
module.exports.arr_IPQCRelIds = arr_IPQCRelIds; // not in use 
module.exports.arrIdsInfo = arrIdsInfo;
module.exports.arrProductTypeArray = arrProductTypeArray;
module.exports.arr_limits = arr_limits;


//weight
module.exports.arrWeighmentCounter = arrWeighmentCounter;
module.exports.arrSelectedMenu = arrSelectedMenu;
module.exports.arrHardnessMT50 = [];
module.exports.arrBalanceRecalibStatusIPC = [];
module.exports.arrCommonUsage = []
module.exports.linearityReverseCounter = [];
module.exports.DoubSide = [];
module.exports.arrWeighmentCounterForFriab = arrWeighmentCounterForFriab;
module.exports.DoubSideForFriab = DoubSideForFriab;
module.exports.arrsampleno = arrsampleno;
module.exports.formatching = formatching;
module.exports.arrPushValuesOfHardness = arrPushValuesOfHardness;
module.exports.HardnessMasterEntry = HardnessMasterEntry;
module.exports.arrcheckingInCompRepSerNo = arrcheckingInCompRepSerNo;