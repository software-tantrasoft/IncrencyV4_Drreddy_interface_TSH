const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_vernier', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    VernierNo: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL"
    },
    VernierID: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL"
    },
    Model: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL"
    },
    leastCount: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    RangeUnit: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "NULL"
    },
    RangeMinVal: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    RangeMaxVal: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: true,
      defaultValue: 0.00000
    },
    CalDueDT: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    CalDuration: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Caldates: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL"
    },
    CalibStoreType: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    CalReminder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Ver_Dept: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    locked: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    editCounter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Ver_IsActivate: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    ver_DP: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    userID: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    Ver_IsApproved: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Ver_ApprovedBy: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    Ver_IsCalib: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    Ver_IsNew: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0:No,1:Yes"
    },
    Make: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    }
  }, {
    sequelize,
    tableName: 'tbl_vernier',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "VernierNo",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "VernierNo" },
        ]
      },
    ]
  });
};
