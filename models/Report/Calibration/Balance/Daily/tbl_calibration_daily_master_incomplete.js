const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_calibration_daily_master_incomplete', {
    Daily_RepNo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Daily_CalbDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Daily_CalbTime: {
      type: DataTypes.TIME,
      allowNull: false,
      defaultValue: "00:00:00"
    },
    Daily_BalID: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    Daily_BalSrNo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    Daly_Make: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    Daily_Model: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    Daily_Unit: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: ""
    },
    Daily_Dept: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    Daily_LeastCnt: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_MaxCap: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_MinCap: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_ZeroError: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Daily_SpiritLevel: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Daily_GeneralCare: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Daily_UserID: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    Daily_UserName: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: ""
    },
    Daily_VerifyID: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    Daily_VerifyName: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: ""
    },
    Daily_VerifyDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: "1992-12-08 00:00:00"
    },
    Daily_PrintNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Daily_IsRecalib: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Daily_Location: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: ""
    },
    Daily_CubicalNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Daily_Bal_MaxoptRange: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Daily_Bal_MinoptRange: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Decimal_Point: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Daily_StdWeight: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "0"
    },
    Daily_NegTol: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "0"
    },
    Daily_PosTol: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "0"
    },
    Daily_RoomNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "0"
    },
    Daily_NextPeriodicDate: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Daily_Reason: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: ""
    },
    CalibrationStatus: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Daily_AllWeightboxID: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    Daily_AllWeightboxCert: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    Daily_AllWeightboxValidUpto: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    Daily_IsBinBalance: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'tbl_calibration_daily_master_incomplete',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Daily_RepNo" },
        ]
      },
    ]
  });
};
