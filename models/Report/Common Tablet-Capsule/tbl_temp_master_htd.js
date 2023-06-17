const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_temp_master_htd', {
    SrNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    RepSerNo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    MstSerNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    WgmtModeNo: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    Area: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: "NULL"
    },
    CubicalNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    CubicleType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    CubicleName: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL"
    },
    Dept: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL"
    },
    BMRNo: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    BatchNo: {
      type: DataTypes.STRING(25),
      allowNull: true,
      defaultValue: "NULL"
    },
    BFGCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL"
    },
    ProductName: {
      type: DataTypes.STRING(250),
      allowNull: true,
      defaultValue: "NULL"
    },
    PVersion: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL"
    },
    Version: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL"
    },
    ProductType: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    MachineCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL"
    },
    BatchSize: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL"
    },
    Qty: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    GrpQty: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    GrpFreq: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    Idsno: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    InsturmentID: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL"
    },
    UserId: {
      type: DataTypes.STRING(25),
      allowNull: true,
      defaultValue: "NULL"
    },
    UserName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    PrDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: "1992-12-08"
    },
    PrTime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    PrEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: "1992-12-08"
    },
    PrEndTime: {
      type: DataTypes.TIME,
      allowNull: true
    },
    Side: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL"
    },
    Unit: {
      type: DataTypes.STRING(5),
      allowNull: true,
      defaultValue: "NULL"
    },
    DP: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    NomHard: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    NomThick: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    T1NegTolHard: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    T1PosTolHard: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    T2NegTolHard: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    T2PosTolHard: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    T1NegTolThick: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    T1PosTolThick: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    LimitOn: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0: Actual 1 :Percentage"
    },
    T1NMT: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    GraphType: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: "NULL",
      comment: "0:Standard 1: Average"
    },
    ReportType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL",
      comment: "0:Regular 1: Initial"
    },
    PrintNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    IsArchived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    BatchComplete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    CheckedByID: {
      type: DataTypes.STRING(25),
      allowNull: true,
      defaultValue: "NULL"
    },
    CheckedByName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    CheckedByDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: "1992-12-08"
    },
    AvgValueHard: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    MinValueHard: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    MaxValueHard: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    AvgValueThick: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    MinValueThick: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    MaxValueThick: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    StdDevHard: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    StdDevThick: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    NoOfAboveT1Hard: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    NoOfAboveT2Hard: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    NoOfBelowT1Hard: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    NoOfBelowT2Hard: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    NoOfAboveT1Thick: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    NoOfAboveT2Thick: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    NoOfBelowT1Thick: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    NoOfBelowT2Thick: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    RemarkHard: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL"
    },
    RemarkThick: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL"
    },
    FailedRemark: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL",
      comment: "Software"
    },
    FailedRemarkI: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL",
      comment: "Interface"
    },
    IsProcess: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    HMIID: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL"
    }
  }, {
    sequelize,
    tableName: 'tbl_temp_master_htd',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "SrNo" },
        ]
      },
      {
        name: "index1",
        using: "BTREE",
        fields: [
          { name: "ProductType" },
          { name: "PrDate" },
          { name: "ReportType" },
        ]
      },
    ]
  });
};
