const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_cubicle_product_sample', {
    Sys_CubicNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Sys_BFGCode: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    Sys_ProductName: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: "NULL"
    },
    Sys_PVersion: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL"
    },
    Sys_Version: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL"
    },
    Sys_CubType: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL"
    },
    Sys_ProductType: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    Individual: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    Group: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    Thickness: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    Breadth: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    Diameter: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    Length: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    Hardness: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    IndCoat: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    GrpCoat: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    IndLay1: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    GrpLay1: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    IndLay2: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    GrpLay2: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    Differential: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 0
    },
    Friability: {
      type: DataTypes.SMALLINT,
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
    },
    Sys_rpi: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: "NULL"
    },
    DT: {
      type: DataTypes.SMALLINT,
      allowNull: true,
      defaultValue: 10
    }
  }, {
    sequelize,
    tableName: 'tbl_cubicle_product_sample',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Sys_CubicNo" },
        ]
      },
    ]
  });
};
