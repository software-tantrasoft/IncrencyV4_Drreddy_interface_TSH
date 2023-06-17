const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_calibration_periodic_detail_vernier_temp', {
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
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Periodic_NegTol: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Periodic_PosTol: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Periodic_ActualWt: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Periodic_BlockboxID: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Periodic_Block: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Periodic_BlockIdentification: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Periodic_BlockboxCert: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    Periodic_BlockboxValidUpto: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    PercentofCapacity: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Decimal_Point: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    HMI_ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'tbl_calibration_periodic_detail_vernier_temp',
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
