const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_audit_cubicle', {
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
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "NULL"
    },
    ACT: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    Remark: {
      type: DataTypes.STRING(300),
      allowNull: false,
      defaultValue: "NULL"
    },
    CubicleNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    OldData: {
      type: DataTypes.STRING(2000),
      allowNull: false,
      defaultValue: "NULL"
    },
    NewData: {
      type: DataTypes.STRING(2000),
      allowNull: false,
      defaultValue: "NULL"
    },
    Area: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "NULL"
    },
    CubName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    }
  }, {
    sequelize,
    tableName: 'tbl_audit_cubicle',
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
