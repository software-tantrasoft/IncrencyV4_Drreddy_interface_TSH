const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_cubicle_area', {
    RecNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Area: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Flag: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    IDSNos: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    IDSFrom: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    IDSTo: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'tbl_cubicle_area',
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
