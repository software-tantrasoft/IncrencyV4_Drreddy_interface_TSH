const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_calibration_uncertinity_master_temp', {
    Uncertinity_RepNo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Uncertinity_CalbDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Uncertinity_CalbTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    Uncertinity_BalID: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Uncertinity_BalSrNo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Uncertinity_Make: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Uncertinity_Model: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Uncertinity_Unit: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: "NULL"
    },
    Uncertinity_Dept: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Uncertinity_LeastCnt: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Uncertinity_MaxCap: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Uncertinity_MinCap: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Uncertinity_ZeroError: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Uncertinity_SpritLevel: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Uncertinity_GerneralCare: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Uncertinity_UserID: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    Uncertinity_UserName: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: "NULL"
    },
    Uncertinity_DueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "1992-12-08"
    },
    Uncertinity_Location: {
      type: DataTypes.STRING(250),
      allowNull: true,
      defaultValue: "NULL"
    },
    Uncertinity_RoomNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "0"
    },
    Decimal_Point: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Uncertinity_PrintNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Uncertinity_VerifyID: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL"
    },
    Uncertinity_VerifyName: {
      type: DataTypes.STRING(250),
      allowNull: true,
      defaultValue: "NULL"
    },
    Uncertinity_VerifyDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: "1992-12-08 00:00:00"
    },
    HMI_ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Uncertinity_IsBinBalance: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Uncertinity_Average: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NULL"
    },
    Dsquare_Average: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NULL"
    },
    Uncertinity_X: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NULL"
    },
    Uncertinity_SD: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NULL"
    },
    Uncertinity: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NULL"
    },
    Uncertinity_MassWeight: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    }
  }, {
    sequelize,
    tableName: 'tbl_calibration_uncertinity_master_temp',
    timestamps: false
  });
};
