const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_calibration_eccentricity_master_incomplete', {
    Eccent_RepNo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Eccent_CalbDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Eccent_CalbTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    Eccent_BalID: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    Eccent_BalSrNo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    Eccent_Make: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    Eccent_Model: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    Eccent_Unit: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: ""
    },
    Eccent_Dept: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    Eccent_LeastCnt: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Eccent_MaxCap: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Eccent_MinCap: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Eccent_ZeroError: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Eccent_SpritLevel: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Eccent_GerneralCare: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Eccent_UserID: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    Eccent_UserName: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: ""
    },
    Eccent_VerifyID: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    Eccent_VerifyName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Eccent_VerifyDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: "1992-12-08 00:00:00"
    },
    Eccent_Location: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: ""
    },
    Eccent_RoomNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "0"
    },
    Decimal_Point: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Eccent_StdWeight: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "0"
    },
    Eccent_NegTol: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "0"
    },
    Eccent_PosTol: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "0"
    },
    Eccent_DueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "1992-12-08"
    },
    Eccent_PrintNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Eccent_AllWeightboxID: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    Eccent_AllWeightboxCert: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    Eccent_AllWeightboxValidUpto: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    Eccent_IsBinBalance: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Eccent_MassWeight: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    }
  }, {
    sequelize,
    tableName: 'tbl_calibration_eccentricity_master_incomplete',
    timestamps: false
  });
};
