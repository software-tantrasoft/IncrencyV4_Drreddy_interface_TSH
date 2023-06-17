const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_audit_other_equipment', {
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
      type: DataTypes.STRING(300),
      allowNull: false,
      defaultValue: "NULL"
    },
    Action: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    Remark: {
      type: DataTypes.STRING(400),
      allowNull: false,
      defaultValue: "NULL"
    },
    Eqp_Type: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Eqp_ID: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    OldData: {
      type: DataTypes.STRING(800),
      allowNull: false,
      defaultValue: "NULL"
    },
    NewData: {
      type: DataTypes.STRING(800),
      allowNull: false,
      defaultValue: "NULL"
    },
    OldWeight: {
      type: DataTypes.STRING(900),
      allowNull: false,
      defaultValue: "NULL"
    },
    NewWeight: {
      type: DataTypes.STRING(900),
      allowNull: false,
      defaultValue: "NULL"
    }
  }, {
    sequelize,
    tableName: 'tbl_audit_other_equipment',
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
