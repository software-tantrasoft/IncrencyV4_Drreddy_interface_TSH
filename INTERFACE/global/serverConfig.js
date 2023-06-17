const developerSetting = require('../../../IncrencyV4DemoConfig.json')

// const ip = require('ip');
// Server Config variables
strIpSeries = '192.168.1.';
HOST_IP = developerSetting.host;
APIPORT_NO = developerSetting.APIPORT; // API server running port
INTERFACE_NO = developerSetting.port; // Interface server running port
ldapServer = 'ldap://192.168.1.12';
baseDn = 'dc=tantrasoftsolutions,dc=com';
ldapServer = 'ldap://192.168.1.12';
baseDn = 'dc=tantrasoftsolutions,dc=com';
isLDAPServer = false;
reporthost = 'http://192.168.1.171:8081/reports/';
foxit_path = "C:/Program Files (x86)/Foxit Software/Foxit Reader/Foxit Reader.exe";

AllowSkipCalib_Start_Tym = "7:00"
AllowSkipCalib_Start_Tym_Period = "am"
AllowSkipCalib_End_Tym = "9:00"
AllowSkipCalib_End_Tym_Period = "am"    
//common database config
dbHost = developerSetting.dbHost;
dbDatabase = developerSetting.dbName;
dbUserId = developerSetting.dbUser;
dbPwd = developerSetting.dbPass;
friabilityType = developerSetting.friabilityType;

// friabilityType = config.friabilityType == undefined? 'OB':config.friabilityType;//OB,OF,BFBO,BFBT

module.exports.friabilityType = friabilityType;
module.exports.HOST_IP = HOST_IP;
module.exports.strIpSeries = strIpSeries;
module.exports.APIPORT_NO = APIPORT_NO;
module.exports.reporthost = reporthost;
module.exports.foxit_path = foxit_path;
module.exports.ldapServer = ldapServer;
module.exports.baseDn = baseDn;
module.exports.dbHost = dbHost;
module.exports.dbDatabase = dbDatabase;
module.exports.dbUserId = dbUserId;
module.exports.dbPwd = dbPwd;
module.exports.isLDAPServer = isLDAPServer;
module.exports.INTERFACE_NO = INTERFACE_NO;
module.exports.AllowSkipCalib_Start_Tym = AllowSkipCalib_Start_Tym;
module.exports.AllowSkipCalib_Start_Tym_Period = AllowSkipCalib_Start_Tym_Period;
module.exports.AllowSkipCalib_End_Tym = AllowSkipCalib_End_Tym;
module.exports.AllowSkipCalib_End_Tym_Period = AllowSkipCalib_End_Tym_Period;