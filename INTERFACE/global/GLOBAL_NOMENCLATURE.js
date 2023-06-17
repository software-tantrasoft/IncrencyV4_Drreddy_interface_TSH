//protocols definition
module.exports.ComRead = 'ComRead';
module.exports.ComWrite = 'ComWrite:';
module.exports.Logout = 'Logout:';
module.exports.DisplayMessage = 'DisplayMessage:'
module.exports.DisplayResult = 'DisplayResult:';
module.exports.TestCompleted = 'TestCompleted:';
module.exports.powerBackupMessage = 'Operation Pending For Test:'
module.exports.powerBackupMessage_calib = 'Operation Pending For Calibration:'
module.exports.Sideprotocol = 'Side Changed:'
module.exports.SideChange = 'Sample Completed For ';
module.exports.SideChanges = 'Continuing For '
//

//Calibration Names
module.exports.Daily = 'DAILY';
module.exports.Periodic = 'PERIODIC';
module.exports.Repetability = 'REPEATABILITY';
module.exports.Uncertainty = 'UNCERTAINTY';
module.exports.Eccentricity = 'ECCENTRICITY';
//

//Instrument Names
module.exports.Balance = 'Balance';
module.exports.IPCBalance = 'IPC Balance';
module.exports.Hardness = 'Hardness';
module.exports.Vernier = 'Vernier';
module.exports.DT = 'Disintegration Tester';
module.exports.Friability = 'Friability';
module.exports.MoistureAnalyzer = 'Moisture Analyzer';
module.exports.TabletTester = 'Tablet Tester';


//

//Test Names
module.exports.IndividualMenu = 'Individual';
module.exports.GroupMenu = 'Group';
module.exports.ThicknessMenu = 'Thickness';
module.exports.DiameterMenu = 'Diameter';
module.exports.BreadthMenu = 'Breadth';
module.exports.HardnessMenu = 'Hardness';
module.exports.PercentageFine = 'Percentage Fine';
module.exports.ParticalSizing = 'Particle Sizing';
module.exports.IPCNom = "IPC";
module.exports.TappedDensity = 'Tapped Density';
module.exports.Differential = 'Differential';
module.exports.TabletTesterMenu = 'TBTTST';
module.exports.MonitSocket = "DisplayMonit";

//DT jars according to model
module.exports.DTModels = {
    "Electrolab":['JarA','JarB'],
    "Electrolab-ED3PO":['jar1','jar2','jar3'],
    "Erweka":['jar1','jar2','jar3'],
    "Labindia-1000":['JarA','JarB'],
    "Labindia-1000P":['BASKET RACK A','BASKET RACK B'],
}


