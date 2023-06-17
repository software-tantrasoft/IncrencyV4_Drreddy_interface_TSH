const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_calibration_repetability_detail', {
    Repet_RecNo: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Repet_RepNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    Repet_BalStdWt: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Repet_BalNegTol: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Repet_BalPosTol: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Repet_ActualWt: {
      type: DataTypes.DECIMAL(10,5),
      allowNull: false,
      defaultValue: 0.00000
    },
    Repet_StdWtID: {
      type: DataTypes.STRING(150),
      allowNull: false,
      defaultValue: "NULL"
    },
    Repet_StdWt: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Repet_WtIdentification: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: "NULL"
    },
    Repet_WeightBox_certfctNo: {
      type: DataTypes.STRING(500),
      allowNull: false,
      defaultValue: "NULL"
    },
    PercentofCapacity: {
      type: DataTypes.STRING(11),
      allowNull: false,
      defaultValue: "0"
    },
    Repet_ValDate: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    D: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NULL"
    },
    D_Square: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NULL"
    }
  }, {
    sequelize,
    tableName: 'tbl_calibration_repetability_detail',
    timestamps: false
  });
};
