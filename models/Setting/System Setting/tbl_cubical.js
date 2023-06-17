const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_cubical', {
    Sys_CubicNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Sys_RptType: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Sys_CubicName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    Sys_RoomNo: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NA"
    },
    Sys_Location: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    Sys_IDSNo: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NA"
    },
    Sys_MachineCode: {
      type: DataTypes.STRING(70),
      allowNull: true,
      defaultValue: "None"
    },
    Sys_MfgCode: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    Sys_RotaryType: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "NULL"
    },
    Sys_BalID: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "None",
      primaryKey: true
    },
    Sys_VernierID: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "None"
    },
    Sys_HardID: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "None"
    },
    Sys_FriabID: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "None"
    },
    Sys_DTID: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "None"
    },
    Sys_TapDensityID: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "None"
    },
    Sys_MoistID: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "None"
    },
    Sys_SieveShakerID: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "None"
    },
    Sys_PHID: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "None"
    },
    Sys_ConductID: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "None"
    },
    Sys_DOID: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "None"
    },
    Sys_Batch: {
      type: DataTypes.STRING(30),
      allowNull: true,
      defaultValue: "NULL"
    },
    Sys_BFGCode: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    Sys_ProductName: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: "NULL"
    },
    Sys_BatchSize: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0
    },
    Sys_BatchSizeUnit: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "Unit"
    },
    Sys_Stage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NA"
    },
    Sys_CubType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "Compression"
    },
    Sys_DataMode: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Sys_Version: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NA"
    },
    Sys_PVersion: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NA"
    },
    Sys_DailyBalRecalib: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    Sys_PeriodicBalRecalib: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    Sys_PeriodicVerRecalib: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    locked: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    editCounter: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Sys_MAStage: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NA"
    },
    Sys_PortNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 104
    },
    Sys_Port1: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "None"
    },
    Sys_Port2: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "None"
    },
    Sys_Port3: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "None"
    },
    Sys_Port4: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "None"
    },
    Sys_Plant: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    Sys_dept: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NA"
    },
    Sys_LotNo: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NA"
    },
    Sys_Area: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    Sys_media: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NA"
    },
    Sys_IPQCType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NA"
    },
    Sys_Validation: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0:unchecked,1:checked"
    },
    Sys_PrinterName: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      defaultValue: "NA"
    },
    Sys_CalibInProcess: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0:No,1:Yes"
    },
    Sys_flagAlert: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0:not set,1:Set"
    },
    Sys_cubTypes: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "Compression"
    },
    Sys_BinBalID: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "None"
    },
    Sys_MachineSpeed_Min: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    Sys_MachineSpeed_Max: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    Sys_Appearance: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    Sys_BMRNo: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    Sys_GenericName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NA"
    },
    Sys_IpSeries: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    Sys_rpi: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    IPAddress: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL",
      comment: "For hardness"
    },
    Sys_BatchReuse: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_cubical',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Sys_CubicNo" },
          { name: "Sys_BalID" },
        ]
      },
    ]
  });
};
