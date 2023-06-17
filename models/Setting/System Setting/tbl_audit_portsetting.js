const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_audit_portsetting', {
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
    CubicleNo: {
      type: DataTypes.INTEGER,
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
    OldData: {
      type: DataTypes.STRING(900),
      allowNull: false
    },
    NewData: {
      type: DataTypes.STRING(900),
      allowNull: false
    },
    Area: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    CubicName: {
      type: DataTypes.STRING(200),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'tbl_audit_portsetting',
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
