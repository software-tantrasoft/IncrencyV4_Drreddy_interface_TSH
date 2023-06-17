const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_otherequipment', {
    RecNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Eqp_Type: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Eqp_ID: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    Eqp_Model: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    Eqp_Make: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    Eqp_SerialNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    Eqp_Dept: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    locked: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Eqp_Active: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Eqp_CalibDt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Eqp_userID: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    Eqp_IsApproved: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Eqp_ApprovedBy: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    Eqp_IP: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    Eqp_Port: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Eqp_HT_Type: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    Eqp_HT_IsMutliTester: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0:Normal 1: Multitester"
    },
    editCounter: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    IPAddress: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL",
      comment: "For hardness"
    }
  }, {
    sequelize,
    tableName: 'tbl_otherequipment',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "RecNo" },
        ]
      },
    ]
  });
};
