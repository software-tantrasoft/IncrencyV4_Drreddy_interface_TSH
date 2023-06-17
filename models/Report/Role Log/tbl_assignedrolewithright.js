const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_assignedrolewithright', {
    RecNo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Role: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NA"
    },
    Rights: {
      type: DataTypes.STRING(5000),
      allowNull: true,
      defaultValue: "NA"
    },
    HMIID: {
      type: DataTypes.STRING(3),
      allowNull: true,
      defaultValue: "0"
    }
  }, {
    sequelize,
    tableName: 'tbl_assignedrolewithright',
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
