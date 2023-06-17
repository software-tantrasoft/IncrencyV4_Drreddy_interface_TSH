const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_calibration_periodic_detail_vernier', {
    Periodic_RepNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Periodic_RecNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Periodic_StdBlock: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Periodic_NegTol: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Periodic_PosTol: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Periodic_ActualWt: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Periodic_BlockboxID: {
      type: DataTypes.STRING(5000),
      allowNull: false,
      defaultValue: "NULL"
    },
    Periodic_Block: {
      type: DataTypes.STRING(5000),
      allowNull: false,
      defaultValue: "NULL"
    },
    Periodic_BlockIdentification: {
      type: DataTypes.STRING(5000),
      allowNull: false,
      defaultValue: "NULL"
    },
    Periodic_BlockboxCert: {
      type: DataTypes.STRING(5000),
      allowNull: true
    },
    Periodic_BlockboxValidUpto: {
      type: DataTypes.STRING(5000),
      allowNull: true
    },
    PercentofCapacity: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Decimal_Point: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_calibration_periodic_detail_vernier',
    timestamps: false,
    indexes: [
      {
        name: "RecNo",
        using: "BTREE",
        fields: [
          { name: "Periodic_RecNo" },
        ]
      },
    ]
  });
};
