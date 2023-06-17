const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_nomenclature', {
    Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    BFGCode: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    ProductName: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    HardnessID: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    DisintegrationTester: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    FriabilatorID: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    TappedDensityID: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    MoistureAnalyzerID: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    BalanceID: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    VernierID: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    BinBalanceID: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    SieveShakerID: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    CubicleNo: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    MachineCode: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    Tablet_Compression: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    BinText: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    BatchSummary: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "0:Increncyv4,1:Allparameter"
    },
    Instrument: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    dateFormat: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    timeFormat: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Capsule_Capsulation: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Content1: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Content2: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Content3: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    Content4: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    BalUnit: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    IsNMT: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "Applicable:1 and NA:0"
    },
    ReleaseButton: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    FormText: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      comment: "1:camel case,0:no camel"
    }
  }, {
    sequelize,
    tableName: 'tbl_nomenclature',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Id" },
        ]
      },
    ]
  });
};
