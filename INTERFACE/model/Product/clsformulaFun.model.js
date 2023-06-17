const { create, all } = require('mathjs');
const config = {};
const mathj = create(all, config)


// const Batch = require('../Product/clsBatchSummaryOperation')
// const this = new Batch()
//const Mathjs = require('mathjs');

// This class is responsible for formulas used for limits
class FormulaFunctions {
  constructor() {
    this.math = mathj;
  }

  // ******************************************************************************************//
  // below two function responsible for calculation of lower and upper limit for Balance & vernier
  //***************************************************************************************** */
  lowerLimit(inComingObj, TType) {

    var nominal = parseFloat(inComingObj.nominal == undefined ? inComingObj.Thick_nominal : inComingObj.nominal); // Nominal
    if (inComingObj.unit == 'mg') {
      nominal = this.calculate_roundoff_value(nominal, inComingObj.unit)
    } if (inComingObj.unit == 'g' || inComingObj.unit == 'gm') {
      nominal = this.calculate_roundoff_value(nominal, inComingObj.unit)

    }
    var T1Neg = this.FormatNumber(inComingObj.T1Neg == undefined ? inComingObj.Thick_T1Neg : inComingObj.T1Neg, 4);
    var T1Pos = this.FormatNumber(inComingObj.T1Pos == undefined ? inComingObj.Thick_T1Pos : inComingObj.T1Pos, 4);
    var T2Neg = this.FormatNumber(inComingObj.T2Neg == undefined ? inComingObj.Thick_T2Neg : inComingObj.T2Neg, 4);
    var T2Pos = this.FormatNumber(inComingObj.T2Pos == undefined ? inComingObj.Thick_T2Pos : inComingObj.T2Pos, 4);
    if (TType == 'T2') {
      TType = T2Neg;
    } else {
      TType = T1Neg;
      // TType = (T1Neg == 0) ? T2Neg : T1Neg  ;
      // TType = (T1Neg == 0) ? T1Neg : (T2Neg == 0) ? T2Neg : T1Neg;
      //TType = (T1Neg != 0) ? T2Neg : (T1Neg == 0) ? T1Neg : T;
    }
    if (TType != 0 && TType != 99999) {
      if (inComingObj.LimitOn == false) { //Actual 
        var lowerLimit = this.FormatNumberString(Math.abs(nominal - TType), 4);
        if (inComingObj.unit == 'mg') {
          lowerLimit = this.calculate_roundoff_value(lowerLimit, inComingObj.unit)
        } if (inComingObj.unit == 'g' || inComingObj.unit == 'gm') {
          lowerLimit = this.calculate_roundoff_value(lowerLimit, inComingObj.unit)
        }
        return lowerLimit;
      } else { // Percentage
        var lowerLimit = this.FormatNumberString((((nominal * TType) / 100) - nominal), 4);
        // var lowerLimit = this.FormatNumberString((this.math.round(((nominal * TType) / 100) - nominal,5)),4);
        // return lowerLimit
        if (inComingObj.unit == 'mg') {
          lowerLimit = this.calculate_roundoff_value(lowerLimit, inComingObj.unit)
        } if (inComingObj.unit == 'g' || inComingObj.unit == 'gm') {
          lowerLimit = this.calculate_roundoff_value(lowerLimit, inComingObj.unit)
        }
        return this.FormatNumberString(Math.abs(lowerLimit), 4);
      }
    } else {
      return 0
    }
  }

  FormatNumberString(numberValue, intFormatNumber) {
    var dp = 0;
    switch (intFormatNumber) {
      case 1:
        dp = 10;
        break;
      case 2:
        dp = 100;
        break;
      case 3:
        dp = 1000;
        break;
      case 4:
        dp = 10000;
        break;
      case 5:
        dp = 100000;
        break;
      default:
        break;
    }
    //return parseFloat(round(numberValue * dp) / dp).toFixed(intFormatNumber);

    return parseFloat(this.math.round(numberValue * dp) / dp, dp);
  }
  FormatNumber(num, places) {
    return Math.trunc(num * Math.pow(10, places)) / Math.pow(10, places);
  }

  upperLimit(inComingObj, TType) {
    // var digit = parseInt(serverConfig.calculationDigit);
    let nominal = parseFloat(inComingObj.nominal == undefined ? inComingObj.Thick_nominal : inComingObj.nominal);
    if (inComingObj.unit == 'mg') {
      nominal = this.calculate_roundoff_value(nominal, inComingObj.unit)
    } if (inComingObj.unit == 'g' || inComingObj.unit == 'gm') {
      nominal = this.calculate_roundoff_value(nominal, inComingObj.unit)

    }
    let T1Neg = this.FormatNumber(inComingObj.T1Neg == undefined ? inComingObj.Thick_T1Neg : inComingObj.T1Neg, 4);
    let T1Pos = this.FormatNumber(inComingObj.T1Pos == undefined ? inComingObj.Thick_T1Pos : inComingObj.T1Pos, 4);
    let T2Neg = this.FormatNumber(inComingObj.T2Neg == undefined ? inComingObj.Thick_T2Neg : inComingObj.T2Neg, 4);
    let T2Pos = this.FormatNumber(inComingObj.T2Pos == undefined ? inComingObj.Thick_T2Pos : inComingObj.T2Pos, 4);

    if (TType == 'T2') {
      TType = T2Pos;
    } else {
      TType = T1Pos;
      // TType = (T1Pos == 0) ? T2Pos : T1Pos;
      // TType = (T1Pos == 0) ? T1Pos : T2Pos;
    }

    if (TType != 0 && TType != 99999) {
      if (inComingObj.LimitOn == false) { //Actual 
        let upperLimit = this.FormatNumberString(nominal + TType, 4);
        if (inComingObj.unit == 'mg') {
          upperLimit = this.calculate_roundoff_value(upperLimit, inComingObj.unit)
        } if (inComingObj.unit == 'g' || inComingObj.unit == 'gm') {
          upperLimit = this.calculate_roundoff_value(upperLimit, inComingObj.unit)
        }
        return upperLimit;
      } else {// Percentage
        let upperLimit = this.FormatNumberString((((nominal * TType) / 100) + nominal), 4);
        if (inComingObj.unit == 'mg') {
          upperLimit = this.calculate_roundoff_value(upperLimit, inComingObj.unit)
        } if (inComingObj.unit == 'g' || inComingObj.unit == 'gm') {
          upperLimit = this.calculate_roundoff_value(upperLimit, inComingObj.unit)
        }
        return upperLimit;
      }
    }
    else {
      return 0;
    }
  }

  lowerLimitForRemark(inComingObj, AvgNominal) {
    var objLowerLimit = {};

    if (AvgNominal == "" || AvgNominal == undefined) {
      var nominal = this.FormatNumber(inComingObj.Nom, 4); // Nominal
    } else {
      var nominal = this.FormatNumber(AvgNominal, 4); // Nominal
    }

    var T1Neg = this.FormatNumber(inComingObj.T1NegTol, 4);
    var T1Pos = this.FormatNumber(inComingObj.T1PosTol, 4);
    var T2Neg = this.FormatNumber(inComingObj.T2NegTol, 4);
    var T2Pos = this.FormatNumber(inComingObj.T2PosTol, 4);
    if (inComingObj.limitOn.readUIntLE() == 0) { //Actual 
      var lowerLimit1 = this.FormatNumberString(nominal - T1Neg, 4);
      if (inComingObj.Unit == 'mg') {
        lowerLimit1 = this.calculate_roundoff_value(lowerLimit1, inComingObj.Unit)
      } if (inComingObj.Unit == 'g' || inComingObj.Unit == 'gm') {
        lowerLimit1 = this.calculate_roundoff_value(lowerLimit1, inComingObj.Unit)
      }
      var lowerLimit2 = this.FormatNumberString(nominal - T2Neg, 4);
      if (inComingObj.Unit == 'mg') {
        lowerLimit2 = this.calculate_roundoff_value(lowerLimit2, inComingObj.Unit)
      } if (inComingObj.Unit == 'g' || inComingObj.Unit == 'gm') {
        lowerLimit2 = this.calculate_roundoff_value(lowerLimit2, inComingObj.Unit)
      }
      Object.assign(objLowerLimit,
        { lowerLimit1: lowerLimit1 },
        { lowerLimit2: lowerLimit2 },
      )
      return objLowerLimit;


    } else { // Percentage
      var lowerLimit1 = this.FormatNumberString((nominal - ((nominal * T1Neg) / 100)), 4);
      if (inComingObj.Unit == 'mg') {
        lowerLimit1 = this.calculate_roundoff_value(lowerLimit1, inComingObj.Unit)
      } if (inComingObj.Unit == 'g' || inComingObj.Unit == 'gm') {
        lowerLimit1 = this.calculate_roundoff_value(lowerLimit1, inComingObj.Unit)
      }
      var lowerLimit2 = this.FormatNumberString((nominal - ((nominal * T2Neg) / 100)), 4);
      if (inComingObj.Unit == 'mg') {
        lowerLimit2 = this.calculate_roundoff_value(lowerLimit2, inComingObj.Unit)
      } if (inComingObj.Unit == 'g' || inComingObj.Unit == 'gm') {
        lowerLimit2 = this.calculate_roundoff_value(lowerLimit2, inComingObj.Unit)
      }
      //return Math.abs(lowerLimit);
      Object.assign(objLowerLimit,
        { lowerLimit1: lowerLimit1 },
        { lowerLimit2: lowerLimit2 },
      )
      return objLowerLimit;
    }
  }
  upperLimitForRemark(inComingObj, AvgNominal) {
    //  console.log(inComingObj)
    var objLowerLimit = {};
    if (AvgNominal == "" || AvgNominal == undefined) {
      var nominal = this.FormatNumber(inComingObj.Nom, 4); // Nominal
    } else {
      var nominal = this.FormatNumber(AvgNominal, 4); // Nominal
    }

    var T1Neg = this.FormatNumber(inComingObj.T1NegTol, 4);
    var T1Pos = this.FormatNumber(inComingObj.T1PosTol, 4);
    var T2Neg = this.FormatNumber(inComingObj.T2NegTol, 4);
    var T2Pos = this.FormatNumber(inComingObj.T2PosTol, 4);
    if (inComingObj.limitOn.readUIntLE() == 0) { //Actual 
      var upperLimit1 = this.FormatNumberString(nominal + T1Pos, 4);
      if (inComingObj.Unit == 'mg') {
        upperLimit1 = this.calculate_roundoff_value(upperLimit1, inComingObj.Unit)
      } if (inComingObj.Unit == 'g' || inComingObj.Unit == 'gm') {
        upperLimit1 = this.calculate_roundoff_value(upperLimit1, inComingObj.Unit)
      }
      var upperLimit2 = this.FormatNumberString(nominal + T2Pos, 4);
      if (inComingObj.Unit == 'mg') {
        upperLimit2 = this.calculate_roundoff_value(upperLimit2, inComingObj.Unit)
      } if (inComingObj.Unit == 'g' || inComingObj.Unit == 'gm') {
        upperLimit2 = this.calculate_roundoff_value(upperLimit2, inComingObj.Unit)
      }
      Object.assign(objLowerLimit,
        { upperLimit1: upperLimit1 },
        { upperLimit2: upperLimit2 },
      )
      return objLowerLimit;

    } else {// Percentage
      var upperLimit1 = this.FormatNumberString((((nominal * T1Pos) / 100) + nominal), 4);
      if (inComingObj.Unit == 'mg') {
        upperLimit1 = this.calculate_roundoff_value(upperLimit1, inComingObj.Unit)
      } if (inComingObj.Unit == 'g' || inComingObj.Unit == 'gm') {
        upperLimit1 = this.calculate_roundoff_value(upperLimit1, inComingObj.Unit)
      }
      var upperLimit2 = this.FormatNumberString((((nominal * T2Pos) / 100) + nominal), 4);
      if (inComingObj.Unit == 'mg') {
        upperLimit2 = this.calculate_roundoff_value(upperLimit2, inComingObj.Unit)
      } if (inComingObj.Unit == 'g' || inComingObj.Unit == 'gm') {
        upperLimit2 = this.calculate_roundoff_value(upperLimit2, inComingObj.Unit)
      }
      Object.assign(objLowerLimit,
        { upperLimit1: upperLimit1 },
        { upperLimit2: upperLimit2 },
      )
      return objLowerLimit;
    }
  }

  lowerLimitForRemarkForDiff(inComingObj, AvgNominal) {
    var objLowerLimit = {};

    if (AvgNominal == "" || AvgNominal == undefined) {
      var nominal = this.FormatNumber(inComingObj.NomNet, 4); // Nominal
    } else {
      var nominal = this.FormatNumber(AvgNominal, 4); // Nominal
    }

    var T1Neg = this.FormatNumber(inComingObj.T1NegNet, 4);
    var T1Pos = this.FormatNumber(inComingObj.T1PosNet, 4);
    var T2Neg = this.FormatNumber(inComingObj.T2NegNet, 4);
    var T2Pos = this.FormatNumber(inComingObj.T2PosNet, 4);
    if (inComingObj.limitOn.readUIntLE() == 0) { //Actual 
      var lowerLimit1 = this.FormatNumberString(nominal - T1Neg, 4);
      if (inComingObj.Unit == 'mg') {
        lowerLimit1 = this.calculate_roundoff_value(lowerLimit1, inComingObj.Unit)
      } if (inComingObj.Unit == 'g' || inComingObj.Unit == 'gm') {
        lowerLimit1 = this.calculate_roundoff_value(lowerLimit1, inComingObj.Unit)
      }
      var lowerLimit2 = this.FormatNumberString(nominal - T2Neg, 4);
      if (inComingObj.Unit == 'mg') {
        lowerLimit2 = this.calculate_roundoff_value(lowerLimit2, inComingObj.Unit)
      } if (inComingObj.Unit == 'g' || inComingObj.Unit == 'gm') {
        lowerLimit2 = this.calculate_roundoff_value(lowerLimit2, inComingObj.Unit)
      }
      Object.assign(objLowerLimit,
        { lowerLimit1: lowerLimit1 },
        { lowerLimit2: lowerLimit2 },
      )
      return objLowerLimit;
    } else { // Percentage
      var lowerLimit1 = this.FormatNumberString((nominal - ((nominal * T1Neg) / 100)), 4);
      if (inComingObj.Unit == 'mg') {
        lowerLimit1 = this.calculate_roundoff_value(lowerLimit1, inComingObj.Unit)
      } if (inComingObj.Unit == 'g' || inComingObj.Unit == 'gm') {
        lowerLimit1 = this.calculate_roundoff_value(lowerLimit1, inComingObj.Unit)
      }

      var lowerLimit2 = this.FormatNumberString((nominal - ((nominal * T2Neg) / 100)), 4);
      if (inComingObj.Unit == 'mg') {
        lowerLimit2 = this.calculate_roundoff_value(lowerLimit2, inComingObj.Unit)
      } if (inComingObj.Unit == 'g' || inComingObj.Unit == 'gm') {
        lowerLimit2 = this.calculate_roundoff_value(lowerLimit2, inComingObj.Unit)
      }
      //return Math.abs(lowerLimit);
      Object.assign(objLowerLimit,
        { lowerLimit1: lowerLimit1 },
        { lowerLimit2: lowerLimit2 },
      )
      return objLowerLimit;
    }
  }
  upperLimitForRemarkForDiff(inComingObj, AvgNominal) {
    //  console.log(inComingObj)
    var objLowerLimit = {};
    if (AvgNominal == "" || AvgNominal == undefined) {
      var nominal = this.FormatNumber(inComingObj.NomNet, 4); // Nominal
    } else {
      var nominal = this.FormatNumber(AvgNominal, 4); // Nominal
    }

    var T1Neg = this.FormatNumber(inComingObj.T1NegNet, 4);
    var T1Pos = this.FormatNumber(inComingObj.T1PosNet, 4);
    var T2Neg = this.FormatNumber(inComingObj.T2NegNet, 4);
    var T2Pos = this.FormatNumber(inComingObj.T2PosNet, 4);
    if (inComingObj.limitOn.readUIntLE() == 0) { //Actual 
      var upperLimit1 = this.FormatNumberString(nominal + T1Pos, 4);
      if (inComingObj.Unit == 'mg') {
        upperLimit1 = this.calculate_roundoff_value(upperLimit1, inComingObj.Unit)
      } if (inComingObj.Unit == 'g' || inComingObj.Unit == 'gm') {
        upperLimit1 = this.calculate_roundoff_value(upperLimit1, inComingObj.Unit)
      }
      var upperLimit2 = this.FormatNumberString(nominal + T2Pos, 4);
      if (inComingObj.Unit == 'mg') {
        upperLimit2 = this.calculate_roundoff_value(upperLimit2, inComingObj.Unit)
      } if (inComingObj.Unit == 'g' || inComingObj.Unit == 'gm') {
        upperLimit2 = this.calculate_roundoff_value(upperLimit2, inComingObj.Unit)
      }
      Object.assign(objLowerLimit,
        { upperLimit1: upperLimit1 },
        { upperLimit2: upperLimit2 },
      )
      return objLowerLimit;

    } else {// Percentage
      var upperLimit1 = this.FormatNumberString((((nominal * T1Pos) / 100) + nominal), 4);
      if (inComingObj.Unit == 'mg') {
        upperLimit1 = this.calculate_roundoff_value(upperLimit1, inComingObj.Unit)
      } if (inComingObj.Unit == 'g' || inComingObj.Unit == 'gm') {
        upperLimit1 = this.calculate_roundoff_value(upperLimit1, inComingObj.Unit)
      }
      var upperLimit2 = this.FormatNumberString((((nominal * T2Pos) / 100) + nominal), 4);
      if (inComingObj.Unit == 'mg') {
        upperLimit2 = this.calculate_roundoff_value(upperLimit2, inComingObj.Unit)
      } if (inComingObj.Unit == 'g' || inComingObj.Unit == 'gm') {
        upperLimit2 = this.calculate_roundoff_value(upperLimit2, inComingObj.Unit)
      }
      Object.assign(objLowerLimit,
        { upperLimit1: upperLimit1 },
        { upperLimit2: upperLimit2 },
      )
      return objLowerLimit;
    }
  }
  //************************************************************************************************ */

  // *************************************************************************************************//
  // below two function responsible for calculation of lower and upper limit for Bulk data Instrument
  //***************************************************************************************** *********/
  lowerLimit1(nominal, T1Neg) {
    if (nominal == undefined && T1Neg != undefined) {
      var lowerLimit = T1Neg;
      return Math.abs(lowerLimit);
    } else {
      var lowerLimit = parseFloat(nominal) - parseFloat(T1Neg);
      return Math.abs(lowerLimit);
    }
  }
  upperLimit1(nominal, T1Pos) {
    if (nominal == undefined && T1Pos != undefined) {
      var upperLimit = T1Pos;
      return upperLimit;
    }
    else {
      var upperLimit = parseFloat(nominal) + parseFloat(T1Pos);
      return upperLimit;
    }
  }
  FormatNumberNOS(num, length) {
    var r = "" + num;
    while (r.length < length) {
      r = "0" + r;
    }
    return r;
  }
  //********************************************************************************************** */
  calculate_roundoff_value(actualWt, unit) {
    let ActualWt1 = actualWt
    let Actual_unit = unit
    if (Actual_unit != undefined) {
      if (Actual_unit == 'mg') {
        ActualWt1 = this.math.round(ActualWt1, 1)
        return ActualWt1
      } if (Actual_unit == 'g' || Actual_unit == 'gm') {
        ActualWt1 = this.math.round(ActualWt1, 4)
        return ActualWt1
      }
    }
  }
  //Hardness limoit check//
  HardnessupperLimit(inComingObj, TType) {
    // var digit = parseInt(serverConfig.calculationDigit);
    let nominal = parseFloat(inComingObj.Hard_nominal);
    let T1Neg = this.FormatNumber(inComingObj.Hard_T1Neg, 4);
    let T1Pos = this.FormatNumber(inComingObj.Hard_T1Pos, 4);
    let T2Neg = this.FormatNumber(inComingObj.Hard_T2Neg, 4);
    let T2Pos = this.FormatNumber(inComingObj.Hard_T2Pos, 4);

    if (TType == 'T2') {
      TType = T2Pos;
    } else {
      TType = T1Pos;
      // TType = (T1Pos == 0) ? T2Pos : T1Pos;
      // TType = (T1Pos == 0) ? T1Pos : T2Pos;
    }


    if (TType != 0 && TType != 99999) {
      if (inComingObj.LimitOn == false) { //Actual 
        let upperLimit = this.FormatNumberString(nominal + TType, 4);
        return upperLimit;
      } else {// Percentage
        let upperLimit = this.FormatNumberString((((nominal * TType) / 100) + nominal), 4);
        return upperLimit;
      }
    }
    else {
      return 0;
    }

  }
  HardnesslowerLimit(inComingObj, TType) {

    let nominal = parseFloat(inComingObj.Hard_nominal);
    let T1Neg = this.FormatNumber(inComingObj.Hard_T1Neg, 4);
    let T1Pos = this.FormatNumber(inComingObj.Hard_T1Pos, 4);
    let T2Neg = this.FormatNumber(inComingObj.Hard_T2Neg, 4);
    let T2Pos = this.FormatNumber(inComingObj.Hard_T2Pos, 4);
    if (TType == 'T2') {
      TType = T2Neg;
    } else {
      TType = T1Neg;
      // TType = (T1Neg == 0) ? T2Neg : T1Neg  ;
      // TType = (T1Neg == 0) ? T1Neg : (T2Neg == 0) ? T2Neg : T1Neg;
      //TType = (T1Neg != 0) ? T2Neg : (T1Neg == 0) ? T1Neg : T;

    }
    if (TType != 0 && TType != 99999) {
      if (inComingObj.LimitOn == false) { //Actual 
        var lowerLimit = this.FormatNumberString(Math.abs(nominal - TType), 4);
        return lowerLimit;
      } else { // Percentage
        var lowerLimit = this.FormatNumberString((((nominal * TType) / 100) - nominal), 4);
        // return lowerLimit
        return this.FormatNumberString(Math.abs(lowerLimit), 4);
      }
    } else {
      return 0
    }
  }
  // *************************************************************************************************//
  // below  function responsible for calculation of T1(-)&&T1(+) and T2(-)&&T2(+) data 
  // Rupali07/03/23
  StdLimit(dataObj) {
    const intNominal = dataObj.objProductDetails.Nominal;
    var Tol = [];
    var T1_Neg = ((((Number(intNominal.split(' ')[0]) * Number(dataObj.objProductDetails.T1Neg.split(' ')[0]))) / 100) - Number(intNominal.split(' ')[0])).toFixed(2);
    var T1_Pos = ((((Number(intNominal.split(' ')[0]) * Number(dataObj.objProductDetails.T1Pos.split(' ')[0]))) / 100) - Number(intNominal.split(' ')[0])).toFixed(2);
    var T2_Neg = ((((Number(intNominal.split(' ')[0]) * Number(dataObj.objProductDetails.T2Neg.split(' ')[0]))) / 100) - Number(intNominal.split(' ')[0])).toFixed(2)
    var T2_Pos = ((((Number(intNominal.split(' ')[0]) * Number(dataObj.objProductDetails.T2Pos.split(' ')[0]))) / 100) - Number(intNominal.split(' ')[0])).toFixed(2)
    Tol.push({ T1_Negative: T1_Neg, T1_Positive: T1_Pos, T2_Negative: T2_Neg, T2_Positive: T2_Pos })
    return Tol;
  }


};
module.exports = FormulaFunctions;