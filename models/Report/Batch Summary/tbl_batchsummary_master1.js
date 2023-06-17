const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_batchsummary_master1', {
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
    ReportType: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0:Standard,1:Avg"
    },
    NMTLimit: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    LimitOn: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    Nom: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    Tol1Neg: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    Tol1Pos: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    Tol2Neg: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    Tol2Pos: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    DP: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Unit: {
      type: DataTypes.STRING(5),
      allowNull: true,
      defaultValue: "NULL"
    },
    MaxValue: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    MinValue: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    AvgValue: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "0"
    },
    DTStdTime: {
      type: DataTypes.TIME,
      allowNull: true,
      defaultValue: "00:00:00"
    },
    FinalMinDT: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "00:00:00"
    },
    FinalMaxDT: {
      type: DataTypes.TIME,
      allowNull: true,
      defaultValue: "00:00:00"
    },
    FinalAvgDT: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: "00:00:00"
    },
    BatchCompleted: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0:Incomplete,1:Complete"
    },
    IsArchived: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    StdLimit1: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      defaultValue: "NULL"
    },
    StdLimit2: {
      type: DataTypes.STRING(1000),
      allowNull: true,
      defaultValue: "NULL"
    }
  }, {
    sequelize,
    tableName: 'tbl_batchsummary_master1',
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
