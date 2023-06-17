const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_pwd_complexity', {
    Pwd_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Pwd_Length: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Pwd_SpecialChr: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Pwd_Alphabate: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Pwd_Digit: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'tbl_pwd_complexity',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Pwd_id" },
        ]
      },
    ]
  });
};
