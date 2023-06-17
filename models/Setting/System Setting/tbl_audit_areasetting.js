const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_audit_areasetting', {
    RecNo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    dt: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    tm: {
      type: DataTypes.TIME,
      allowNull: false
    },
    userid: {
      type: DataTypes.STRING(55),
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    Remark: {
      type: DataTypes.STRING(300),
      allowNull: false
    },
    Act: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "UPDATE"
    },
    Area: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    OldData: {
      type: DataTypes.STRING(900),
      allowNull: false
    },
    NewData: {
      type: DataTypes.STRING(900),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'tbl_audit_areasetting',
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
