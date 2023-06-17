const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_recalibration_balance_status_bin', {
    CubicNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    Bal_ID: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NULL"
    },
    DailyBalRecalib: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    PeriodicBalRecalib: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    LinearityBalRecalib: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    Moisture_ID: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NULL"
    },
    DailyMARecalib: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    HalfYearMARecalib: {
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
    tableName: 'tbl_recalibration_balance_status_bin',
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
