const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_dtmedia', {
    RecNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Media: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    }
  }, {
    sequelize,
    tableName: 'tbl_dtmedia',
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
