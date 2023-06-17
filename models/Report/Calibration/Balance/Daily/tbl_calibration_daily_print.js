const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_calibration_daily_print', {
    RecNo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    BalanceID: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    PrintNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Reason: {
      type: DataTypes.STRING(300),
      allowNull: false,
      defaultValue: "NULL"
    },
    Title: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "NULL"
    },
    UserID: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    UserName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Print_Dt: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Print_Tm: {
      type: DataTypes.TIME,
      allowNull: false
    },
    Rept_Month: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Rept_Year: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Incomplete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'tbl_calibration_daily_print',
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
