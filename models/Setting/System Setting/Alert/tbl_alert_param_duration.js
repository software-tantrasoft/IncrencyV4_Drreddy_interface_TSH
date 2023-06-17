const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_alert_param_duration', {
    CubicNo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ProductId: {
      type: DataTypes.STRING(25),
      allowNull: true,
      defaultValue: "NULL"
    },
    ProductName: {
      type: DataTypes.STRING(250),
      allowNull: true,
      defaultValue: "NULL"
    },
    ProductVersion: {
      type: DataTypes.STRING(250),
      allowNull: true,
      defaultValue: "NA"
    },
    Version: {
      type: DataTypes.STRING(250),
      allowNull: true,
      defaultValue: "NA"
    },
    ProductType: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    Batch: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    Individual: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Group: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Thickness: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Breadth: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Diameter: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Length: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Hardness: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    IndLay: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    GrpLay: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    IndLay1: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    GrpLay1: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Differential: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Sys_Area: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    Sys_CubicName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    }
  }, {
    sequelize,
    tableName: 'tbl_alert_param_duration',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "CubicNo" },
        ]
      },
    ]
  });
};
