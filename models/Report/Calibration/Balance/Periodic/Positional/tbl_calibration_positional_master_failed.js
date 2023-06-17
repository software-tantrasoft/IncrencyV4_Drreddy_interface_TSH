const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_calibration_positional_master_failed', {
    Positional_RepNo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Positional_CalbDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Positional_CalbTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    Positional_BalID: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Positional_BalSrNo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Positional_Make: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Positional_Model: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Positional_Unit: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: "NULL"
    },
    Positional_Dept: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Positional_LeastCnt: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Positional_MaxCap: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Positional_MinCap: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Positional_ZeroError: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Positional_SpritLevel: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Positional_GerneralCare: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Positional_UserID: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    Positional_UserName: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: "NULL"
    },
    Positional_Location: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: "NULL"
    },
    Positional_RoomNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Decimal_Point: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Positional_DueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "1992-12-08"
    },
    Positional_AllWeightboxID: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      defaultValue: "NULL"
    },
    Positional_AllWeightboxCert: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      defaultValue: "NULL"
    },
    Positional_AllWeightboxValidUpto: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      defaultValue: "NULL"
    },
    Positional_IsBinBalance: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'tbl_calibration_positional_master_failed',
    timestamps: false
  });
};
