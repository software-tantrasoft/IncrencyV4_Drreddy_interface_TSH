const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_batchsummary_detail_hdlb_temp', {
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
    HardDP: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    MinHard: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    MaxHard: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    AvgHard: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    MinThick: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    MaxThick: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    AvgThick: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
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
    tableName: 'tbl_batchsummary_detail_hdlb_temp',
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
