const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_remark_incomplete_master', {
    serNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    IDSNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    paramName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    tableName: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    BatchNumber: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    Instrument: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    TestType: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_remark_incomplete_master',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "serNo" },
        ]
      },
    ]
  });
};
