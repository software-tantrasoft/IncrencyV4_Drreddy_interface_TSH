const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_calibration_repetability_master_temp', {
    Repet_RepNo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Repet_CalbDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Repet_CalbTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    Repet_BalID: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Repet_BalSrNo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Repet_Make: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Repet_Model: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Repet_Unit: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: "NULL"
    },
    Repet_Dept: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Repet_LeastCnt: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Repet_MaxCap: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Repet_MinCap: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Repet_ZeroError: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Repet_SpritLevel: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Repet_GerneralCare: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Repet_UserID: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    Repet_UserName: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: "NULL"
    },
    Repet_Location: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: "NULL"
    },
    Repet_RoomNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "0"
    },
    Decimal_Point: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Repet_DueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "1992-12-08"
    },
    Repet_PrintNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Repet_VerifyID: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL"
    },
    Repet_VerifyName: {
      type: DataTypes.STRING(250),
      allowNull: true,
      defaultValue: "NULL"
    },
    Repet_VerifyDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: "1992-12-08 00:00:00"
    },
    HMI_ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Repet_IsBinBalance: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Repet_MassWeight: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    Repet_Actual_Average: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NULL"
    },
    Repet_DSquare_Average: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NULL"
    },
    Repet_X: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NULL"
    },
    Repet_SD: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NULL"
    }
  }, {
    sequelize,
    tableName: 'tbl_calibration_repetability_master_temp',
    timestamps: false
  });
};
