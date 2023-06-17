const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_alert_weighing_master', {
    RecSrNo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ProductId: {
      type: DataTypes.STRING(25),
      allowNull: false,
      defaultValue: "NULL"
    },
    ProductName: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: "NULL"
    },
    ProductVersion: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: "NA"
    },
    Version: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: "NA"
    },
    Batch: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    CubicalNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    StartDt: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      primaryKey: true
    },
    StartTm: {
      type: DataTypes.TIME,
      allowNull: false
    },
    CompleteDt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    CompleteTm: {
      type: DataTypes.DATE,
      allowNull: true
    },
    FlgStopped: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      comment: "set this flag true when alert is paused or stoped else keep false"
    },
    IsNewEntry: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'tbl_alert_weighing_master',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "RecSrNo" },
          { name: "StartDt" },
        ]
      },
    ]
  });
};
