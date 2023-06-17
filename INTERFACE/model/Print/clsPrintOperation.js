const request = require('request')

const serverConfig = require('../../../../IncrencyV4SDPConfig.json');
const globalData = require('../../global/globalData');
const GLOBAL_NOMENCLATURE = require('../../global/GLOBAL_NOMENCLATURE');
const models = require("../../../config/dbConnection").models;
const sequelize = require("../../../config/dbConnection").sequelize;

class PrintOperations {

    async callViewTabReport(data, productType, strHmi,Type) {
        try {
            let cls = this
            let check = data;
            var APIPath;

            let cubicalDetails = globalData.arrIdsInfo.find(k => k.Hmi == strHmi).cubicalData;
            let printerName = cubicalDetails.Sys_PrinterName;

            let sysConfig = await models.tbl_setallparameter.findOne();
            let printerMode = sysConfig.tbl_PrintingMode

            if(printerMode != "Auto"){
                console.log('printer set in manual mode')
                return
            }

            // if (productType == 2) {
            //     APIPath = 'tabletCapsule//viewCapsuleReport';
            // } else if (productType == 3) {
            //     APIPath = 'multihalerReport/ViewMultihalerReport';
            // } else if (productType == 1) {
            //     APIPath = 'tabletCapsule/ViewTabReport';
            // }
            Object.assign(check, { str_hmi: strHmi, str_source: "Auto" }) //Hmi
            APIPath = 'tabletCapsule/ViewTabReport';
            let PrintApi = `http://${serverConfig.hostApi}:${serverConfig.APIPORT}/API/${APIPath}`;

            await request({
                url: PrintApi,
                method: 'POST',
                body: check,
                json: true
            }, function (err, response, body) {
                if (err) {
                    console.log('Error while Printing Report Online', err)

                    return false;
                } else {
                    if (body == null || body == undefined) {
                        console.log('Error while Printing Report Online Body Blank');

                        //************************************************************** */
                        return false;
                    } else {


                        cls.printReport(body, check, printerName, productType,Type).then(res => {
                            return true;
                        }).catch(err => {
                            return err;
                        });

                    }
                }
            });
            // console.log(a)



        } catch (error) {
            console.log(error)
            throw new Error(error)
        }
    }

    generateOnlineReportAsync(objReport, printerName) {
        return new Promise((resolve, reject) => {
            let cls = this;
            var objReport1 = {
                "recordFrom": objReport.recordFrom,
                "reportOption": objReport.reportOption,
                "reportType": objReport.reportType,
                "testType": objReport.testType,
                "RepSerNo": objReport.RepSerNo,
                "userId": objReport.userId,
                "username": objReport.username,
                "idsNo": objReport.idsNo

            }

            var options = {
                method: 'POST',
                uri: `http://${serverConfig.hostApi}:${serverConfig.APIPORT}/API_V1/tabletRoute/ViewTabReport`,
                body: objReport1,
                json: true // Automatically stringifies the body to JSON
            };
            //var parsedBody = await axios.post(options.uri, options.body, json);

            rp(options).then(function (parsedBody) {
                cls.printReport(parsedBody, objReport1, printerName).then(res => {
                    resolve(true);
                }).catch(err => {
                    resolve(err);
                });
            })

        }).catch(error => {
            console.log(error);
            resolve(false);
        })

    }

    async printReport(Response, ObjReportView, printerName, productType = 1,Type) {
        try {
            var reportName = "";
            switch (ObjReportView.reportOption) {
                case "Individual":
                case "Individual Layer-1":
                case "Individual Layer-2":
                    reportName = 'Repo_Tab_Individual';
                    //calculation = true;
                    break;
                case 'Individual Empty':
                    reportName = 'Repo_Tab_Individual';
                    //calculation = true;
                    break;
                case "Group-Individual":
                    reportName = 'Repo_Tab_GroupIndividual';
                    //calculation = true;
                    break;
                case 'Thickness':
                    reportName = 'Repo_Tab_Vernier';
                    //calculation = true;
                    break;
                case 'Length':
                    reportName = 'Repo_Tab_Vernier';
                    //calculation = true;
                    break;
                case 'Breadth':
                    reportName = 'Repo_Tab_Vernier';
                    //calculation = true;
                    break;
                case 'Diameter':
                    reportName = 'Repo_Tab_Vernier';
                    // calculation = true;
                    break;
                case GLOBAL_NOMENCLATURE.Friability:
                    if(Type == 'Double'){
                        reportName = 'Repo_Tab_Friability_LR';
                    }else{
                        reportName = 'Repo_Tab_Friability_Space';
                    }
                    //calculation = false;
                    break;
                case 'Moisture Analyzer':
                    reportName = 'Repo_Tab_LOD';
                    //calculation = false;
                    break;
                case "Hardness":
                    reportName = 'Repo_Tab_Hardness';
                    //calculation = true;
                    break;
                case 'Particle Size':
                    reportName = 'Repo_Tab_ParticleSize';
                    //calculation = true;
                    break;
                case 'Fine %':
                    reportName = 'Repo_Tab_Fine';
                    //calculation = true;
                    break;
                case 'Tapped Density':
                    reportName = 'Repo_Tab_TD';
                    //calculation = false;
                    break;
                case 'Disintegration Tester':
                    reportName = 'Repo_Tab_DT';
                    //calculation = true;
                    break;
                case GLOBAL_NOMENCLATURE.GroupMenu:
                    reportName = 'Repo_Tab_Group';
                    //calculation = true;
                    break;
                case GLOBAL_NOMENCLATURE.GroupLayerMenu:
                    reportName = 'Repo_Tab_Group';
                    //calculation = true;
                    break;
                case GLOBAL_NOMENCLATURE.GroupLayer1Menu:
                    reportName = 'Repo_Tab_Group';
                    //calculation = true;
                    break;
                case "Differential":
                    reportName = 'Repo_Cap_Differential';
                    //calculation = true;
                    break;
                    case "Empty Shell":
                        reportName = 'Repo_Cap_EmptyShell';
                        //calculation = true;
                        break;

                case 'Net Content':
                case 'Dry Cartridge':
                case 'Dry Powder':
                    reportName = 'Repo_Mul_UniformityofContent';
                    break;
                default:
                    break;
            }
            let reportObj = {}
            const reportData = Response.resInsert;
            reportData.waterMark = false
            // delete reportData.resCalculation.waterMark;
            // Object.assign(reportData.resCalculation, { waterMark: false });
            Object.assign(reportObj, { data: reportData, "FileName": reportName })
            if (printerName != "NA" && printerName != "" && printerName != null && printerName != 'None') {
                request({
                    url: `http://${serverConfig.hostApi}:${serverConfig.APIPORT}/API/report/GenerateReport`,
                    method: 'POST',
                    body: reportObj,
                    json: true
                }, function (err, response, body) {

                    if (err) {
                        console.log('Error while Printing Report Online', err)
                        //************************************************************** */
                    } else {
                        if (body == null || body == undefined) {
                            console.log('Error while Printing Report Online Body Blank');
                            //************************************************************** */
                        } else {
                            var filepath = response.body.filepath;

                            let printRep = {}
                            console.log(filepath)
                            Object.assign(
                                printRep,
                                { filepath: filepath },
                                { strSelectedPrinter: printerName }
                            )


                            request.post(`http://${serverConfig.hostApi}:${serverConfig.APIPORT}/API/report/PrintReport`, { json: printRep }, (err, res, body) => {

                                if (err) {
                                    console.log('Error while Printing Report Online', err)
                                    //************************************************************** */
                                } else {
                                    //console.log(res.body);
                                    // setTimeout(()=>{return true;},2000)
                                    const objPrintData = {

                                        reportOption: ObjReportView.reportOption,
                                        reportType: 'Complete',
                                        recordFrom: 'Current',
                                        strReason: '',
                                        strUserId: Response.resInsert.UserId,
                                        strUserName: Response.resInsert.UserName,
                                        intPrintCount: 1,
                                        str_url:productType == 1 ? "Tablet" : "Capsule"
                                    }
                                    if (productType == 3) {
                                        Object.assign(objPrintData, { RepSrNo: ObjReportView.RepSerNo })
                                    } else {
                                        Object.assign(objPrintData, { intReportSerNo: ObjReportView.RepSerNo })
                                    }
                                    var API_PATH = 'tabletCapsule/printcountup';
                                    if (productType == 1) {
                                        API_PATH = 'tabletCapsule/printcountup'
                                    } else if (productType == 2) {
                                        API_PATH = 'tabletCapsule/printcountup';
                                    } else if (productType == 3) {
                                        API_PATH = 'multihalerReport/increasePrintCountMultihaler';
                                    }
                                    request.post(`http://${serverConfig.hostApi}:${serverConfig.APIPORT}/API/${API_PATH}`, { json: objPrintData }, (err, res1, body) => {
                                        if (err) {
                                            console.log(err)
                                        } else {
                                            console.log(res.body, res1.body);
                                        }
                                    })
                                    return true

                                }
                            })
                        }
                    }
                });
            } else {
                console.log("Printer Name empty")
                //************************************************************** */
                return false;
            }

        } catch (error) {
            console.log('Error while Printing Report Online', error)
            // let logQ = date.format(new Date(), 'DD-MM-YYYY HH:mm:ss') + error;
            // //commented by vivek on 31-07-2020********************************
            // //logFromPC.info(logQ);
            // logFromPC.addtoProtocolLog(logQ)
            //************************************************************** */
            return false;
        }
    }

}

module.exports = PrintOperations;