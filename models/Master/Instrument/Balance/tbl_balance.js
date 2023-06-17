const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_balance', {
    Id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Bal_Model: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    Bal_Make: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    Bal_SrNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    Bal_ID: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    Bal_Dept: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    Bal_LeastCnt: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Bal_MaxCap: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Bal_MinCap: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Bal_Unit: {
      type: DataTypes.STRING(5),
      allowNull: false,
      defaultValue: "NULL"
    },
    Bal_CalbStoreType: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Bal_CalbDates: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    Bal_CalbDuration: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Bal_CalbDueDt: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: "1992-12-08"
    },
    Bal_CalbDueDtL: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: "1992-12-08"
    },
    Bal_CalbDueDtU: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: "1992-12-08"
    },
    Bal_CalbDueDtR: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: "1992-12-08"
    },
    Bal_CalbDueDtE: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: "1992-12-08"
    },
    Bal_IsCalibFail: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    Bal_CalbReminder: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    Bal_MaxoptRange: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Bal_MinoptRange: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    IsNewBalance: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    IsBinBalance: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Bal_isActivate: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Bal_DP: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    userID: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    Bal_DSNW: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    Bal_IsApproved: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Bal_ApprovedBy: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    Bal_CalbDueMonth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: "1992-12-08"
    }
  }, {
    sequelize,
    tableName: 'tbl_balance',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id" },
        ]
      },
    ]
  });
};
