const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_batches', {
    RecNo: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    Batch: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Status: {
      type: DataTypes.STRING(1),
      allowNull: true,
      defaultValue: "N"
    },
    dt: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    tm: {
      type: DataTypes.TIME,
      allowNull: true
    },
    CubicNo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cubicleType: {
      type: DataTypes.STRING(100),
      allowNull: true,
      defaultValue: "NULL"
    },
    Prod_ID: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    Prod_Name: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    Prod_Version: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NA"
    },
    Version: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NA"
    },
    batchStatusInCubicle: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    BatchStartDTTM: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: "0000-00-00 00:00:00",
      comment: "For veersandra summary"
    },
    BatchEndDTTM: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: "0000-00-00 00:00:00",
      comment: "For veersandra summary"
    }
  }, {
    sequelize,
    tableName: 'tbl_batches',
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
