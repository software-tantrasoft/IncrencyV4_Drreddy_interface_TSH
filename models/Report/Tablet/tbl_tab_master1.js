const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_tab_master1', {
    RepSerNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
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
    Nom: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    T1NegTol: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    T1PosTol: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    T2NegTol: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    T2PosTol: {
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
    StdLimit1: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      defaultValue: "NULL"
    },
    StdLimit2: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      defaultValue: "NULL"
    },
    AvgValue: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    MinValue: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    MaxValue: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    MinPer: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    MaxPer: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    StdDev: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    NoOfAboveT1: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    NoOfAboveT2: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    NoOfBelowT1: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    NoOfBelowT2: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    Remark: {
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
    }
  }, {
    sequelize,
    tableName: 'tbl_tab_master1',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "RepSerNo" },
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
