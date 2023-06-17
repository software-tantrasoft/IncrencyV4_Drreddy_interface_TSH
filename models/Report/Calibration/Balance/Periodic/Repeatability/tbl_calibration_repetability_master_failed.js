const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_calibration_repetability_master_failed', {
    SrNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Repet_RepNo: {
      type: DataTypes.INTEGER,
      allowNull: true
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
      defaultValue: ""
    },
    Repet_BalSrNo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    Repet_Make: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    Repet_Model: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    Repet_Unit: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: ""
    },
    Repet_Dept: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    Repet_LeastCnt: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Repet_MaxCap: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Repet_MinCap: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
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
      defaultValue: ""
    },
    Repet_UserName: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: ""
    },
    Repet_Location: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: ""
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
    Repet_StdWeight: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "0"
    },
    Repet_NegTol: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "0"
    },
    Repet_PosTol: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "0"
    },
    Repet_DueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "1992-12-08"
    },
    Repet_PrintNo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Repet_VerifyID: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Repet_VerifyName: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Repet_VerifyDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: "1992-12-08 00:00:00"
    },
    Repet_AllWeightboxID: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    Repet_AllWeightboxCert: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    Repet_AllWeightboxValidUpto: {
      type: DataTypes.STRING(1000),
      allowNull: true
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
    tableName: 'tbl_calibration_repetability_master_failed',
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
    ]
  });
};
