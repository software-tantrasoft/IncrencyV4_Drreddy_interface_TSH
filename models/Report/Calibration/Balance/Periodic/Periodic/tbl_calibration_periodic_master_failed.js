const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_calibration_periodic_master_failed', {
    srNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Periodic_RepNo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Periodic_CalbDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Periodic_CalbTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    Periodic_BalID: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    Periodic_BalSrNo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    Periodic_Make: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    Periodic_Model: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    Periodic_Unit: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: ""
    },
    Periodic_Dept: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: ""
    },
    Periodic_LeastCnt: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Periodic_MaxCap: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Periodic_MinCap: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Periodic_ZeroError: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Periodic_SpritLevel: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Periodic_GerneralCare: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Periodic_UserID: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    Periodic_UserName: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: ""
    },
    Periodic_VerifyID: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    Periodic_VerifyName: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: ""
    },
    Periodic_PrintNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Periodic_IsRecalib: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Periodic_Location: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    Periodic_CubicalNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Periodic_Bal_MaxoptRange: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Periodic_Bal_MinoptRange: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Periodic_RoomNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "0"
    },
    Periodic_DueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "1992-12-08"
    },
    Decimal_Point: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Periodic_StdWeight: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "0"
    },
    Periodic_NegTol: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "0"
    },
    Periodic_PosTol: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "0"
    },
    Perodic_VerifyDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: "1992-12-08 00:00:00"
    },
    Periodic_calibStatus: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    Periodic_AllWeightboxID: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    Periodic_AllWeightboxCert: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    Periodic_AllWeightboxValidUpto: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    Periodic_IsBinBalance: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Periodic_MassWeight: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    Periodic_CalbReason: {
      type: DataTypes.STRING(300),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_calibration_periodic_master_failed',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "srNo" },
        ]
      },
    ]
  });
};
