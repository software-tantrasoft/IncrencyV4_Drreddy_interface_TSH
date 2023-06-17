const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_calibration_repetability_detail_temp', {
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
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Repet_BalNegTol: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Repet_BalPosTol: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    Repet_ActualWt: {
      type: DataTypes.STRING(10),
      allowNull: false
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
    Repet_Remark: {
      type: DataTypes.STRING(500),
      allowNull: true,
      defaultValue: "NULL"
    },
    HMI_ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    d: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NULL"
    },
    dsquare: {
      type: DataTypes.STRING(150),
      allowNull: true,
      defaultValue: "NULL"
    }
  }, {
    sequelize,
    tableName: 'tbl_calibration_repetability_detail_temp',
    timestamps: false
  });
};
