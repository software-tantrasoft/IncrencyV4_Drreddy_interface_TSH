const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_calibration_periodic_master_vernier', {
    Periodic_RepNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Periodic_CalbDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: "1992-12-08"
    },
    Periodic_CalbTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    Periodic_VerID: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Periodic_VerSrNo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Periodic_Make: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Periodic_Model: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Periodic_Unit: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: "NULL"
    },
    Periodic_Dept: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
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
    Periodic_UserID: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    Periodic_UserName: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: "NULL"
    },
    Periodic_VerifyID: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    Periodic_VerifyName: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: "NULL"
    },
    Perodic_VerifyDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: "1992-12-08 00:00:00"
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
      allowNull: false,
      defaultValue: "NULL"
    },
    Periodic_CubicalNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
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
    Periodic_StdBlock: {
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
    Periodic_calibStatus: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "Complies"
    },
    Periodic_AllBlockboxID: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      defaultValue: "NULL"
    },
    Periodic_AllBlockboxCert: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      defaultValue: "NULL"
    },
    Periodic_AllBlockboxValidUpto: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      defaultValue: "NULL"
    },
    Periodic_Remark: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      defaultValue: "NULL"
    }
  }, {
    sequelize,
    tableName: 'tbl_calibration_periodic_master_vernier',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Periodic_RepNo" },
        ]
      },
    ]
  });
};
