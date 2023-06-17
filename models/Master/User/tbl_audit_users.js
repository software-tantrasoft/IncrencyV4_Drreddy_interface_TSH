const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_audit_users', {
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
    OldRole: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NA"
    },
    NewRole: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NA"
    },
    ACT: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    KeyCode: {
      type: DataTypes.STRING(5000),
      allowNull: false,
      defaultValue: "NA"
    },
    KeyValue: {
      type: DataTypes.STRING(5000),
      allowNull: false,
      defaultValue: "NA"
    },
    RightAdded: {
      type: DataTypes.STRING(5000),
      allowNull: false,
      defaultValue: "NA"
    },
    RightRemoved: {
      type: DataTypes.STRING(5000),
      allowNull: false,
      defaultValue: "NA"
    },
    Remark: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "NULL"
    },
    OldDepartment: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NA"
    },
    NewDepartment: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NA"
    }
  }, {
    sequelize,
    tableName: 'tbl_audit_users',
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
