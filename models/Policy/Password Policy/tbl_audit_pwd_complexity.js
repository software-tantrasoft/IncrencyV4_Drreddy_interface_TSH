const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_audit_pwd_complexity', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    dt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    tm: {
      type: DataTypes.TIME,
      allowNull: true
    },
    userid: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    remark: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    act: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    oldvalues: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    newvalues: {
      type: DataTypes.STRING(250),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_audit_pwd_complexity',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};
