const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_audit_bal_setting', {
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
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "NULL"
    },
    Bal_Id: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    OldParameter: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      defaultValue: "NULL"
    },
    NewParameter: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      defaultValue: "NULL"
    },
    OldWeight: {
      type: DataTypes.STRING(5000),
      allowNull: false,
      defaultValue: "NULL"
    },
    NewWeight: {
      type: DataTypes.STRING(5000),
      allowNull: false,
      defaultValue: "NULL"
    }
  }, {
    sequelize,
    tableName: 'tbl_audit_bal_setting',
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
