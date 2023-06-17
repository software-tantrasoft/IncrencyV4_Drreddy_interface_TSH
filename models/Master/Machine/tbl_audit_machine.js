const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_audit_machine', {
    RecNo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    DT: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    TM: {
      type: DataTypes.TIME,
      allowNull: false
    },
    userid: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    Remark: {
      type: DataTypes.STRING(300),
      allowNull: false,
      defaultValue: "NULL"
    },
    ACT: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    MachineID: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    OldData: {
      type: DataTypes.STRING(300),
      allowNull: false,
      defaultValue: "NULL"
    },
    NewData: {
      type: DataTypes.STRING(300),
      allowNull: false,
      defaultValue: "NULL"
    }
  }, {
    sequelize,
    tableName: 'tbl_audit_machine',
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
