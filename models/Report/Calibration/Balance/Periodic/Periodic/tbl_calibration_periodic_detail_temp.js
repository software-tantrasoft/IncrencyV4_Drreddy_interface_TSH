const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_calibration_periodic_detail_temp', {
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
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Periodic_BalNegTol: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Periodic_BalPosTol: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Periodic_ActualWt: {
      type: DataTypes.STRING(10),
      allowNull: false
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
    Periodic_ValDate: {
      type: DataTypes.STRING(5000),
      allowNull: true,
      defaultValue: "NULL"
    },
    HMI_ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    Periodic_BalTol: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    Remark: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_calibration_periodic_detail_temp',
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
