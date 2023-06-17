const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_audit_calibration', {
    Calb_RecNo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Calb_Dt: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Calb_Tm: {
      type: DataTypes.TIME,
      allowNull: false
    },
    Calb_UserID: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Calb_UserName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Calb_Equipment: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Calb_CalibType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Calb_Act: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Calb_Remark: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "NULL"
    }
  }, {
    sequelize,
    tableName: 'tbl_audit_calibration',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Calb_RecNo" },
        ]
      },
    ]
  });
};
