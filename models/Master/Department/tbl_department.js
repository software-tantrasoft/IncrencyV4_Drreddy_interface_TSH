const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_department', {
    department_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    department_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    locked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'tbl_department',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "department_id" },
        ]
      },
      {
        name: "department_name",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "department_name" },
        ]
      },
      {
        name: "department_name_2",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "department_name" },
        ]
      },
    ]
  });
};
