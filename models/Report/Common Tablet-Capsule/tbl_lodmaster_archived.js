const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_lodmaster_archived', {
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
    Area: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Dept: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    CubicalNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    CubicleName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CubicleType: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ReportType: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    MachineId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    RotaryType: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    ProductType: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    BFGCode: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    ProductName: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    PVersion: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Version: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    IdsNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    BatchNo: {
      type: DataTypes.STRING(25),
      allowNull: true
    },
    BatchSize: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    BMRNo: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    LODID: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    Layer: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Side: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    Stage: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    UserId: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    UserName: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    IsArchived: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    PrDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: "1992-12-08"
    },
    PrTime: {
      type: DataTypes.TIME,
      allowNull: true,
      defaultValue: "00:00:00"
    },
    PrEndDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: "1992-12-08"
    },
    PrEndTime: {
      type: DataTypes.TIME,
      allowNull: true,
      defaultValue: "00:00:00"
    },
    MinLimit: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    MaxLimit: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Lot: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Temp: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    InitalWt: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    FinalWt: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    NetWt: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    PrintNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Remark: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Unit: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    DecimalPoint: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    BatchComplete: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    CheckedByID: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    CheckedByName: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    CheckedByDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: "1992-12-08"
    },
    Inprocess: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Duration: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    LayerName: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_lodmaster_archived',
    schema: 'dbo',
    timestamps: false
  });
};
