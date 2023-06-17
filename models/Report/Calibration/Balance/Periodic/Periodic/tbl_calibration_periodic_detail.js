const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_calibration_periodic_detail', {
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
    Periodic_BalStdWt: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Periodic_BalNegTol: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Periodic_BalPosTol: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Periodic_ActualWt: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Periodic_StdWtBoxID: {
      type: DataTypes.STRING(5000),
      allowNull: false,
      defaultValue: "NULL"
    },
    Periodic_StdWt: {
      type: DataTypes.STRING(5000),
      allowNull: false,
      defaultValue: "NULL"
    },
    Periodic_WtIdentification: {
      type: DataTypes.STRING(5000),
      allowNull: false,
      defaultValue: "NULL"
    },
    Periodic_WeightBox_certfctNo: {
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
    },
    Periodic_ValDate: {
      type: DataTypes.STRING(5000),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_calibration_periodic_detail',
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
