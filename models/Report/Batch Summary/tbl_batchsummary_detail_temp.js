const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_batchsummary_detail_temp', {
    SerNo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    RepSerNo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    RecSeqNo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    Date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    Time: {
      type: DataTypes.TIME,
      allowNull: true
    },
    InstrumentID: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    Side: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "NULL"
    },
    Min: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    Max: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    Avg: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    MinTimeDT: {
      type: DataTypes.TIME,
      allowNull: true,
      defaultValue: "00:00:00"
    },
    MaxTimeDT: {
      type: DataTypes.TIME,
      allowNull: true,
      defaultValue: "00:00:00"
    },
    AvgTimeDT: {
      type: DataTypes.TIME,
      allowNull: true,
      defaultValue: "00:00:00"
    },
    TestResult: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    UserID: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    UserName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    HMIID: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "NULL"
    }
  }, {
    sequelize,
    tableName: 'tbl_batchsummary_detail_temp',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "SerNo" },
        ]
      },
    ]
  });
};
