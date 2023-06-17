const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_recalibration_vernier_status', {
    CubicNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Ver_ID: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NULL"
    },
    DailyVerRecalib: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    PeriodicVerRecalib: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    Sys_Area: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    Sys_CubicName: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    RecalibSetDt_daily: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    RecalibSetDt_periodic: {
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_recalibration_vernier_status',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "CubicNo" },
        ]
      },
    ]
  });
};
