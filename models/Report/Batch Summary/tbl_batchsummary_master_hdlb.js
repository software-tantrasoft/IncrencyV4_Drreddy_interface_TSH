const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_batchsummary_master_hdlb', {
    RepSerNo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Area: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    BFGCode: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    ProductName: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: "NULL"
    },
    PVersion: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NA"
    },
    Version: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NA"
    },
    PrdType: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "1: Tablet, 2:Capsule"
    },
    CubicalNo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    CubType: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    BatchNo: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    BatchSize: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    BMRNo: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    Stage: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    Dept: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    Side: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "NULL"
    },
    ReportType: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0:Standard,1:Avg"
    },
    NomHard: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    T1NegHard: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    T1PosHard: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    T2NegHard: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    T2PosHard: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    UnitHard: {
      type: DataTypes.STRING(5),
      allowNull: true,
      defaultValue: "NULL"
    },
    NomThick: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    LwrThick: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    UppThick: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    MinValueHard: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    MaxValueHard: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    AvgValueHard: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    MinValueThick: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    MaxValueThick: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    AvgValueThick: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    IsArchived: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    BatchCompleted: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0:Incomplete,1:Complete"
    }
  }, {
    sequelize,
    tableName: 'tbl_batchsummary_master_hdlb',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "RepSerNo" },
        ]
      },
    ]
  });
};
