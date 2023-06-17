const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_batchsummary_printrecord', {
    RecNo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Print_Dt: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    Print_Tm: {
      type: DataTypes.TIME,
      allowNull: false
    },
    UserID: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    UserName: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: "NULL"
    },
    BFGCode: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    PrdName: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    PrdVersion: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NA"
    },
    Version: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NA"
    },
    ProductType: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "NULL"
    },
    CubType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    ParamName: {
      type: DataTypes.STRING(300),
      allowNull: true,
      defaultValue: "NULL"
    },
    BatchNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "NULL"
    },
    Side: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "NULL"
    },
    PrintNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Reason: {
      type: DataTypes.STRING(800),
      allowNull: false,
      defaultValue: "NULL"
    },
    Area: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    BMRNo: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    },
    BatchSize: {
      type: DataTypes.STRING(200),
      allowNull: true,
      defaultValue: "NULL"
    }
  }, {
    sequelize,
    tableName: 'tbl_batchsummary_printrecord',
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
