const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_setallparameter', {
    config_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    tbl_config_TimeoutPeriod: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "NULL"
    },
    tbl_config_PasswordExpPeriod: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "NULL"
    },
    tbl_config_ReminderPassword: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "NULL"
    },
    tbl_config_ArchivePeriod: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "NULL"
    },
    tbl_config_AutoDisablePeriod: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "NULL"
    },
    tbl_config_LoginAttempts: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "NULL"
    },
    tbl_config_AutoEnableChances: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "No.of times that a system can automatically enable a user after unsuccessful login attempts."
    },
    tbl_config_DisabledTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: "Time in seconds that a user will get temporary disabled after unsuccessful login attempts."
    },
    tbl_config_PwdHistoryCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tbl_config_PeriodicCalibDays: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tbl_PeriodicCalbVer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tbl_calibration_Reminder: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tbl_PrintingMode: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'tbl_setallparameter',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "config_id" },
        ]
      },
    ]
  });
};
